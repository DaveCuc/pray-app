'use client';

import { createContext, useContext, useState, useEffect, useTransition, ReactNode } from 'react';
import { useAuth } from '@clerk/nextjs';
// Ajusta esta importación según cómo se llamen tus Server Actions
import { getReadingProgress, updateReadingProgress } from '@/actions/reading'; 

interface LecturaStats {
  libro: string;
  capitulo: number;
  salmo: number;
  isLoading: boolean;
}

interface ReadingContextType {
  lecturaActual: LecturaStats;
  ajustarLectura: (libro: string, capitulo: number, salmo: number) => void;
  isSaving: boolean;
}

const ReadingContext = createContext<ReadingContextType | null>(null);

export function ReadingProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  const [isPending, startTransition] = useTransition();

  // 1. ESTADO INICIAL ESTÁTICO: Oculto por defecto
  const [lecturaActual, setLecturaActual] = useState<LecturaStats>({
    libro: 'Mateo',
    capitulo: 1,
    salmo: 1,
    isLoading: true 
  });

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setLecturaActual(prev => ({ ...prev, isLoading: false }));
      return;
    }

    // 2. LEER CACHÉ AL INSTANTE
    const cached = localStorage.getItem('oratio_lectura_cache');
    if (cached) {
      setLecturaActual({ ...JSON.parse(cached), isLoading: false });
    }

    // 3. REVALIDAR EN SEGUNDO PLANO
    const loadData = async () => {
      try {
        const data = await getReadingProgress();
        if (data) {
          // Asegúrate de mapear bien los nombres que vienen de tu BD
          const newData = { 
            libro: data.currentBook || 'Mateo', 
            capitulo: data.currentChapter || 1, 
            salmo: data.currentPsalm || 1, 
            isLoading: false 
          };
          setLecturaActual(newData);
          localStorage.setItem('oratio_lectura_cache', JSON.stringify(newData));
        }
      } catch (error) {
        console.error("Error al cargar lectura:", error);
      }
    };

    loadData();
  }, [isSignedIn, isLoaded]);

  const ajustarLectura = (libro: string, capitulo: number, salmo: number) => {
    if (!isSignedIn) return;

    // Actualización optimista y guardado en caché instantáneo
    const nuevaLectura = { libro, capitulo, salmo, isLoading: false };
    setLecturaActual(nuevaLectura);
    localStorage.setItem('oratio_lectura_cache', JSON.stringify(nuevaLectura));

    // Guardado silencioso en BD
    startTransition(async () => {
      try {
        await updateReadingProgress(libro, capitulo, salmo);
      } catch (error) {
        console.error("Error al guardar lectura:", error);
      }
    });
  };

  return (
    <ReadingContext.Provider value={{ lecturaActual, ajustarLectura, isSaving: isPending }}>
      {children}
    </ReadingContext.Provider>
  );
}

export const useReading = () => {
  const context = useContext(ReadingContext);
  if (!context) throw new Error("useReading debe usarse dentro de ReadingProvider");
  return context;
};