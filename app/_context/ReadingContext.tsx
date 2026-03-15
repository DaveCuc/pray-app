'use client';

import { createContext, useContext, useState, useEffect, useTransition, ReactNode } from 'react';
import { useAuth } from '@clerk/nextjs';
// Ajusta esta importación según cómo se llamen tus Server Actions
import { getReadingProgress, updateReadingProgress } from '@/actions/reading'; 

const EVANGELIOS = [
  ...Array.from({ length: 28 }, (_, i) => ({ libro: 'Mateo', capitulo: i + 1 })),
  ...Array.from({ length: 16 }, (_, i) => ({ libro: 'Marcos', capitulo: i + 1 })),
  ...Array.from({ length: 24 }, (_, i) => ({ libro: 'Lucas', capitulo: i + 1 })),
  ...Array.from({ length: 21 }, (_, i) => ({ libro: 'Juan', capitulo: i + 1 })),
];
const TOTAL_SALMOS = 150;

interface LecturaStats {
  libro: string;
  capitulo: number;
  salmo: number;
  isLoading: boolean;
}

interface ReadingContextType {
  lecturaActual: LecturaStats;
  avanzarLecturaLocal: () => void;
  guardarLecturaDB: () => Promise<void>;
  avanzarLectura: () => void;
  reiniciarLectura: () => void;
  ajustarLectura: (libro: string, capitulo: number, salmo: number) => void;
  isSaving: boolean;
}

const ReadingContext = createContext<ReadingContextType | null>(null);

export function ReadingProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  const [isPending, startTransition] = useTransition();
  const LOCAL_READING_KEY = 'oratio_lectura_local';

  // ==========================================
  // PASO 1: ESTADO INICIAL (Con bandera de carga)
  // ==========================================
  const [lecturaActual, setLecturaActual] = useState<LecturaStats>({
    libro: 'Mateo',
    capitulo: 1,
    salmo: 1,
    isLoading: true 
  });

  // ==========================================
  // PASO 2: MOTOR DE CARGA (Stale-While-Revalidate)
  // ==========================================
  useEffect(() => {
    if (!isLoaded) return;
    
    if (!isSignedIn) {
      setLecturaActual(prev => ({ ...prev, isLoading: false }));
      return;
    }

    // A) LEER CACHÉ TEMPORAL LOCAL (si hay progreso no sincronizado)
    const localReading = localStorage.getItem(LOCAL_READING_KEY);
    if (localReading) {
      setLecturaActual({ ...JSON.parse(localReading), isLoading: false });
      return;
    }

    // B) LEER CACHÉ PERSISTENTE (Milisegundo 1: Datos instantáneos)
    const cached = localStorage.getItem('oratio_lectura_cache');
    if (cached) {
      setLecturaActual({ ...JSON.parse(cached), isLoading: false });
    }

    // C) REVALIDAR CON LA BD (En segundo plano: Datos frescos del servidor)
    const loadData = async () => {
      try {
        const data = await getReadingProgress();
        if (data) {
          const newData = { 
            libro: data.currentBook || 'Mateo', 
            capitulo: data.currentChapter || 1, 
            salmo: data.currentPsalm || 1, 
            isLoading: false 
          };
          
          // Actualizar pantalla con datos reales
          setLecturaActual(newData);
          
          // Actualizar caché para la próxima apertura
          localStorage.setItem('oratio_lectura_cache', JSON.stringify(newData));
        }
      } catch (error) {
        console.error("Error al cargar lectura:", error);
        setLecturaActual(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadData();
  }, [isSignedIn, isLoaded]);

  // ==========================================
  // PASO 3: GUARDADO OPTIMISTA (Velocidad instantánea)
  // ==========================================
  const avanzarLecturaLocal = () => {
    if (!isSignedIn) return;

    setLecturaActual(prev => {
      const indiceActual = EVANGELIOS.findIndex(
        (e) => e.libro === prev.libro && e.capitulo === prev.capitulo
      );

      const nuevoIndice = (indiceActual + 1) % EVANGELIOS.length;
      const nuevaLectura = EVANGELIOS[nuevoIndice];
      const nuevoSalmo = (prev.salmo % TOTAL_SALMOS) + 1;

      const lecturaTemporal: LecturaStats = {
        libro: nuevaLectura.libro,
        capitulo: nuevaLectura.capitulo,
        salmo: nuevoSalmo,
        isLoading: false,
      };

      // Guardado local temporal para no golpear la BD en cada fase.
      localStorage.setItem(LOCAL_READING_KEY, JSON.stringify(lecturaTemporal));
      return lecturaTemporal;
    });
  };

  const guardarLecturaDB = async () => {
    if (!isSignedIn) return;

    const lecturaTemporal = localStorage.getItem(LOCAL_READING_KEY);
    const lecturaFuente = lecturaTemporal
      ? JSON.parse(lecturaTemporal)
      : lecturaActual;

    try {
      await updateReadingProgress(
        lecturaFuente.libro,
        lecturaFuente.capitulo,
        lecturaFuente.salmo
      );

      // Persistimos como caché base y limpiamos temporal.
      localStorage.setItem('oratio_lectura_cache', JSON.stringify({
        ...lecturaFuente,
        isLoading: false,
      }));
      localStorage.removeItem(LOCAL_READING_KEY);
    } catch (error) {
      console.error("Error guardando lectura", error);
    }
  };

  const ajustarLectura = (libro: string, capitulo: number, salmo: number) => {
    if (!isSignedIn) return;

    // A) ACTUALIZAR PANTALLA Y CACHÉ AL INSTANTE (0 milisegundos)
    const nuevaLectura = { libro, capitulo, salmo, isLoading: false };
    setLecturaActual(nuevaLectura);
    localStorage.setItem('oratio_lectura_cache', JSON.stringify(nuevaLectura));
    localStorage.removeItem(LOCAL_READING_KEY);

    // B) ENVIAR A LA BD EN SILENCIO (Sin bloquear la app)
    startTransition(async () => {
      try {
        await updateReadingProgress(libro, capitulo, salmo);
      } catch (error) {
        console.error("Error al guardar lectura:", error);
      }
    });
  };

  const avanzarLectura = () => {
    avanzarLecturaLocal();
  };

  const reiniciarLectura = () => {
    ajustarLectura('Mateo', 1, 1);
  };

  return (
    <ReadingContext.Provider
      value={{
        lecturaActual,
        avanzarLecturaLocal,
        guardarLecturaDB,
        avanzarLectura,
        reiniciarLectura,
        ajustarLectura,
        isSaving: isPending,
      }}
    >
      {children}
    </ReadingContext.Provider>
  );
}

export const useReading = () => {
  const context = useContext(ReadingContext);
  if (!context) throw new Error("useReading debe usarse dentro de ReadingProvider");
  return context;
};