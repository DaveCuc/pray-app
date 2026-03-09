// actions/prayer.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Helper para ignorar las horas y comparar solo las fechas
function getStartOfDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// 1. OBTENER ESTADÍSTICAS (CON LIMPIEZA INTELIGENTE)
export async function getPrayerStats() {
  const { userId } = await auth();
  if (!userId) return null;

  let user = await prisma.user.findUnique({ where: { id: userId } });
  
  if (!user) {
    user = await prisma.user.create({ data: { id: userId } });
  }

  const today = getStartOfDay();
  let completedToday = false;
  let currentStreak = user.activeStreak;
  let currentStep = user.currentStep || 0; 

  if (user.lastPrayerDate) {
    const lastPrayer = getStartOfDay(user.lastPrayerDate);
    const diffDays = Math.floor((today.getTime() - lastPrayer.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      completedToday = true;
    } else {
      // ES UN DÍA NUEVO
      let needsUpdate = false;
      const datosAActualizar: any = {};

      // Limpiamos el paso solo si no está en 0
      if (currentStep > 0) {
        currentStep = 0;
        datosAActualizar.currentStep = 0;
        needsUpdate = true;
      }

      // Rompemos la racha solo si pasaron > 1 días y no está en 0
      if (diffDays > 1 && currentStreak > 0) {
        currentStreak = 0;
        datosAActualizar.activeStreak = 0;
        needsUpdate = true;
      }

      // Solo escribimos en BD si realmente hubo cambios
      if (needsUpdate) {
        await prisma.user.update({
          where: { id: userId },
          data: datosAActualizar
        });
      }
    }
  }

  return {
    currentStreak,
    totalDays: user.totalDays,
    longestStreak: user.longestStreak,
    completedToday,
    lastPrayerDate: user.lastPrayerDate ? user.lastPrayerDate.toISOString() : null,
    currentStep // 🔥 Devolvemos la etapa actual al frontend
  };
}

// 2. NUEVA FUNCIÓN: AVANZAR ETAPA EN LA BD
export async function advancePrayerStep(newStep: number) {
  const { userId } = await auth();
  if (!userId) return { success: false };

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { currentStep: newStep }
    });
    return { success: true };
  } catch (error) {
    console.error("Error al avanzar etapa:", error);
    return { success: false };
  }
}

export async function savePrayerSession(durationMinutes: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  const today = getStartOfDay();

  // 1. Guardar la sesión individual (como los "pomodoros" del video)
  await prisma.prayer.create({
    data: { userId, durationMinutes }
  });

  // 2. Actualizar las estadísticas del usuario
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Usuario no encontrado");

  let { activeStreak, longestStreak, totalDays, lastPrayerDate } = user;
  
  let diffDays = -1;
  if (lastPrayerDate) {
    const lastPrayer = getStartOfDay(lastPrayerDate);
    diffDays = Math.floor((today.getTime() - lastPrayer.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Si diffDays es 0, ya había orado hoy, solo guardamos el registro arriba.
  // Si no ha orado hoy, actualizamos la racha:
  if (diffDays !== 0) {
    if (diffDays === 1) {
      activeStreak += 1; // Racha consecutiva
    } else {
      activeStreak = 1; // Racha nueva después de fallar
    }

    if (activeStreak > longestStreak) longestStreak = activeStreak;
    totalDays += 1;
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        activeStreak,
        longestStreak,
        totalDays,
        lastPrayerDate: today
      }
    });
  }

  // Refrescar la UI de Next.js
  revalidatePath('/');
  revalidatePath('/perfil');

  return { success: true };
}