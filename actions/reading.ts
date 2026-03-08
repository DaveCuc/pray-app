'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

type ReadingProgress = {
  currentBook: string;
  currentChapter: number;
  currentPsalm: number;
};

// Obtener dónde se quedó el usuario
export async function getReadingProgress(): Promise<ReadingProgress> {
  const { userId } = await auth();
  
  // Si no está logueado, le damos los valores por defecto
  if (!userId) return { currentBook: 'Mateo', currentChapter: 1, currentPsalm: 1 };

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currentBook: true, currentChapter: true, currentPsalm: true }
  });

  return {
    currentBook: user?.currentBook ?? 'Mateo',
    currentChapter: user?.currentChapter ?? 1,
    currentPsalm: user?.currentPsalm ?? 1,
  };
}

// Guardar el nuevo capítulo cuando avanza
export async function updateReadingProgress(book: string, chapter: number, psalm: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  await prisma.user.upsert({
    where: { id: userId },
    create: {
      id: userId,
      currentBook: book,
      currentChapter: chapter,
      currentPsalm: psalm,
    },
    update: {
      currentBook: book,
      currentChapter: chapter,
      currentPsalm: psalm,
    },
  });

  // Refrescamos la página inicial para que muestre el nuevo capítulo
  revalidatePath('/');
  return { success: true };
}