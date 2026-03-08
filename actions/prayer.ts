// actions/prayer.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Helper para ignorar las horas y comparar solo las fechas
function getStartOfDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export async function getPrayerStats() {
  const { userId } = await auth();
  if (!userId) return null;

  // Buscar usuario o crearlo si es su primera vez
  let user = await prisma.user.findUnique({ where: { id: userId } });
  
  if (!user) {
    user = await prisma.user.create({ data: { id: userId } });
  }

  const today = getStartOfDay();
  let completedToday = false;
  let currentStreak = user.activeStreak;

  // Lógica para detectar si la racha se rompió por inactividad
  if (user.lastPrayerDate) {
    const lastPrayer = getStartOfDay(user.lastPrayerDate);
    const diffDays = Math.floor((today.getTime() - lastPrayer.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      completedToday = true;
    } else if (diffDays > 1) {
      currentStreak = 0; // Pasó más de un día, la racha se rompe
      // Guardamos la racha rota en la BD silenciosamente
      await prisma.user.update({
        where: { id: userId },
        data: { activeStreak: 0 }
      });
    }
  }

  return {
    currentStreak,
    totalDays: user.totalDays,
    longestStreak: user.longestStreak,
    completedToday
  };
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