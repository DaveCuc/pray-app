import { useState, useEffect, useTransition } from 'react';
import { useAuth } from '@clerk/nextjs';
import { getReadingProgress, updateReadingProgress } from '@/actions/reading';

// Estructura de los evangelios (libro → cantidad de capítulos)
const EVANGELIOS = [
  ...Array.from({ length: 28 }, (_, i) => ({ libro: 'Mateo', capitulo: i + 1 })),
  ...Array.from({ length: 16 }, (_, i) => ({ libro: 'Marcos', capitulo: i + 1 })),
  ...Array.from({ length: 24 }, (_, i) => ({ libro: 'Lucas', capitulo: i + 1 })),
  ...Array.from({ length: 21 }, (_, i) => ({ libro: 'Juan', capitulo: i + 1 })),
];

export const useLectura = () => {
  const { isSignedIn } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [lecturaActual, setLecturaActual] = useState({
    libro: 'Mateo',
    capitulo: 1,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar progreso desde la BD al montar el componente
  useEffect(() => {
    if (!isSignedIn) {
      setIsLoaded(true);
      return;
    }

    const loadProgress = async () => {
      try {
        const progress = await getReadingProgress();
        setLecturaActual({
          libro: progress.currentBook,
          capitulo: progress.currentChapter,
        });
      } catch (error) {
        console.error('Error al cargar progreso de lectura:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadProgress();
  }, [isSignedIn]);

  const avanzarLectura = () => {
    if (!isSignedIn) return;

    // Encontrar el índice actual en el array de evangelios
    const indiceActual = EVANGELIOS.findIndex(
      (e) => e.libro === lecturaActual.libro && e.capitulo === lecturaActual.capitulo
    );

    // Avanzar al siguiente capítulo (o volver al inicio si llegamos al final)
    const nuevoIndice = (indiceActual + 1) % EVANGELIOS.length;
    const nuevaLectura = EVANGELIOS[nuevoIndice];

    // Actualización optimista en el UI
    setLecturaActual({
      libro: nuevaLectura.libro,
      capitulo: nuevaLectura.capitulo,
    });

    // Guardar en la BD silenciosamente
    startTransition(async () => {
      try {
        await updateReadingProgress(nuevaLectura.libro, nuevaLectura.capitulo);
      } catch (error) {
        console.error('Error al guardar progreso de lectura:', error);
      }
    });
  };

  const reiniciarLectura = () => {
    if (!isSignedIn) return;

    setLecturaActual({ libro: 'Mateo', capitulo: 1 });

    startTransition(async () => {
      try {
        await updateReadingProgress('Mateo', 1);
      } catch (error) {
        console.error('Error al reiniciar lectura:', error);
      }
    });
  };

  const ajustarLectura = (libro: string, capitulo: number) => {
    if (!isSignedIn) return;

    setLecturaActual({ libro, capitulo });

    startTransition(async () => {
      try {
        await updateReadingProgress(libro, capitulo);
      } catch (error) {
        console.error('Error al ajustar lectura:', error);
      }
    });
  };

  return { 
    lecturaActual, 
    avanzarLectura, 
    reiniciarLectura, 
    ajustarLectura,
    isLoaded,
    isSaving: isPending 
  };
};