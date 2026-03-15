'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// 1. OBTENER PREFERENCIA
export async function getTimerPreference() {
  const { userId } = await auth();
  if (!userId) return 60; // Por defecto 60 minutos

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { timerPreference: true }
  });

  return user?.timerPreference || 60;
}

// 2. GUARDAR PREFERENCIA
export async function saveTimerPreference(minutes: number) {
  const { userId } = await auth();
  if (!userId) return { success: false };

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { timerPreference: minutes }
    });
    return { success: true };
  } catch (error) {
    console.error("Error guardando preferencia de tiempo:", error);
    return { success: false };
  }
}