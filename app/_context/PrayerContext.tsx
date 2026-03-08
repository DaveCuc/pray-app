'use client';

import { createContext, useContext, useState, useEffect, useTransition, ReactNode } from 'react';
import { useAuth } from '@clerk/nextjs';
import { getPrayerStats, savePrayerSession } from '@/actions/prayer';

interface PrayerStats {
  currentStreak: number;
  totalDays: number;
  longestStreak: number;
  completedToday: boolean;
  isLoading: boolean;
}

interface PrayerContextType {
  stats: PrayerStats;
  saveProgress: (duration?: number) => void;
  isSaving: boolean;
}

const PrayerContext = createContext<PrayerContextType | null>(null);

export function PrayerProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  const [isPending, startTransition] = useTransition();

  // ESTADO INICIAL ESTÁTICO: Igual para Servidor y Cliente
  const [stats, setStats] = useState<PrayerStats>({
    currentStreak: 0,
    totalDays: 0,
    longestStreak: 0,
    completedToday: false,
    isLoading: true // Esto es clave para ocultarlo en la UI
  });

  useEffect(() => {
    if (!isLoaded) return; 

    if (!isSignedIn) {
      setStats(prev => ({ ...prev, isLoading: false }));
      return;
    }

    // LEER CACHÉ DESPUÉS DEL MONTAJE (Evita el error de hidratación)
    const cached = localStorage.getItem('oratio_stats_cache');
    if (cached) {
      // Aplicamos el caché súper rápido sin esperar a la BD
      setStats({ ...JSON.parse(cached), isLoading: false });
    }

    // REVALIDAR CON LA BASE DE DATOS
    const loadData = async () => {
      try {
        const data = await getPrayerStats();
        if (data) {
          setStats({ ...data, isLoading: false });
          localStorage.setItem('oratio_stats_cache', JSON.stringify(data));
        }
      } catch (error) {
        console.error("Error al cargar rachas:", error);
      }
    };

    loadData();
  }, [isSignedIn, isLoaded]);

  const saveProgress = (duration: number = 20) => {
    if (!isSignedIn) return;

    setStats(prev => {
      const newStats = {
        ...prev,
        currentStreak: prev.completedToday ? prev.currentStreak : prev.currentStreak + 1,
        totalDays: prev.completedToday ? prev.totalDays : prev.totalDays + 1,
        completedToday: true
      };
      localStorage.setItem('oratio_stats_cache', JSON.stringify(newStats));
      return newStats;
    });

    startTransition(async () => {
      try {
        await savePrayerSession(duration);
      } catch (error) {
        console.error("Error al guardar la sesión:", error);
      }
    });
  };

  return (
    <PrayerContext.Provider value={{ stats, saveProgress, isSaving: isPending }}>
      {children}
    </PrayerContext.Provider>
  );
}

// Hook personalizado para usar el contexto fácilmente
export const usePrayer = () => {
  const context = useContext(PrayerContext);
  if (!context) throw new Error("usePrayer debe usarse dentro de PrayerProvider");
  return context;
};