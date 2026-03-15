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

  let user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      activeStreak: true,
      longestStreak: true,
      totalDays: true,
      lastPrayerDate: true,
    },
  });
  
  if (!user) {
    user = await prisma.user.create({
      data: { id: userId },
      select: {
        id: true,
        activeStreak: true,
        longestStreak: true,
        totalDays: true,
        lastPrayerDate: true,
      },
    });
  }

  const today = getStartOfDay();
  let completedToday = false;
  let currentStreak = user.activeStreak;

  if (user.lastPrayerDate) {
    const lastPrayer = getStartOfDay(user.lastPrayerDate);
    const diffDays = Math.floor((today.getTime() - lastPrayer.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      completedToday = true;
    } else {
      // ES UN DÍA NUEVO
      let needsUpdate = false;
      const datosAActualizar: any = {};

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
    lastPrayerDate: user.lastPrayerDate ? user.lastPrayerDate.toISOString() : null
  };
}

export async function savePrayerSession(duration: number) {
  const { userId } = await auth();
  if (!userId) return { success: false };

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      activeStreak: true,
      longestStreak: true,
      totalDays: true,
      lastPrayerDate: true,
    },
  });
  if (!user) return { success: false };

  // CANDADO 2: Comparación estricta de string (YYYY-MM-DD)
  let yaOroHoy = false;

  if (user.lastPrayerDate) {
    const fechaUltimaOracion = user.lastPrayerDate.toISOString().split('T')[0];
    const fechaDeHoy = new Date().toISOString().split('T')[0];

    if (fechaUltimaOracion === fechaDeHoy) {
      yaOroHoy = true;
    }
  }

  let datosAActualizar: any = {
    lastPrayerDate: new Date(),
  };

  // Solo alteramos la racha si NO ha orado hoy
  if (!yaOroHoy) {
    const nuevaRacha = user.activeStreak + 1;
    datosAActualizar.activeStreak = nuevaRacha;
    datosAActualizar.totalDays = user.totalDays + 1;

    if (nuevaRacha > user.longestStreak) {
      datosAActualizar.longestStreak = nuevaRacha;
    }
  }

  void duration;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: datosAActualizar
    });
    return { success: true };
  } catch (error) {
    console.error("Error al guardar la sesión:", error);
    return { success: false };
  }
}