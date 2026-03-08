'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Obtener dónde se quedó el usuario
export async function getReadingProgress() {
  const { userId } = await auth();
  
  // Si no está logueado, le damos los valores por defecto
  if (!userId) return { currentBook: 'Mateo', currentChapter: 1 };

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currentBook: true, currentChapter: true }
  });

  return user || { currentBook: 'Mateo', currentChapter: 1 };
}

// Guardar el nuevo capítulo cuando avanza
export async function updateReadingProgress(book: string, chapter: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  await prisma.user.update({
    where: { id: userId },
    data: {
      currentBook: book,
      currentChapter: chapter
    }
  });

  // Refrescamos la página inicial para que muestre el nuevo capítulo
  revalidatePath('/');
  return { success: true };
}