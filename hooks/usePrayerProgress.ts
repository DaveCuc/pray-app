// hooks/usePrayerProgress.ts
import { useState, useEffect, useTransition } from 'react';
import { useAuth } from '@clerk/nextjs';
import { getPrayerStats, savePrayerSession } from '@/actions/prayer';

interface PrayerStats {
  currentStreak: number;
  totalDays: number;
  longestStreak: number;
  completedToday: boolean;
  isLoading: boolean;
}

export function usePrayerProgress() {
  const { isSignedIn } = useAuth();
  const [isPending, startTransition] = useTransition();
  
  // INICIALIZACIÓN CON CACHÉ: Leemos el localStorage antes de dibujar el componente
  const [stats, setStats] = useState<PrayerStats>(() => {
    // Verificamos que estamos en el navegador (para evitar errores en Next.js SSR)
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('oratio_stats_cache');
      if (cached) {
        return { ...JSON.parse(cached), isLoading: false };
      }
    }
    // Si no hay caché, empezamos en 0
    return {
      currentStreak: 0,
      totalDays: 0,
      longestStreak: 0,
      completedToday: false,
      isLoading: true
    };
  });

  useEffect(() => {
    if (!isSignedIn) {
      setStats(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const loadData = async () => {
      try {
        // REVALIDACIÓN EN SEGUNDO PLANO: Buscamos el dato real en la BD
        const data = await getPrayerStats();
        if (data) {
          setStats({ ...data, isLoading: false });
          // ACTUALIZAMOS EL CACHÉ con la información más fresca
          localStorage.setItem('oratio_stats_cache', JSON.stringify(data));
        }
      } catch (error) {
        console.error("Error al cargar rachas:", error);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadData();
  }, [isSignedIn]);

  const saveProgress = (duration: number = 20) => {
    if (!isSignedIn) return;

    // Actualización optimista: Reflejamos el cambio en la UI instantáneamente
    setStats(prev => {
      const nuevaRacha = prev.completedToday ? prev.currentStreak : prev.currentStreak + 1;
      const nuevosDias = prev.completedToday ? prev.totalDays : prev.totalDays + 1;

      const newStats = {
        ...prev,
        currentStreak: nuevaRacha,
        totalDays: nuevosDias,
        completedToday: true
      };
      
      // GUARDAMOS EN CACHÉ INMEDIATAMENTE al terminar de orar
      localStorage.setItem('oratio_stats_cache', JSON.stringify(newStats));
      return newStats;
    });

    // Enviamos a Supabase silenciosamente
    startTransition(async () => {
      try {
        await savePrayerSession(duration);
      } catch (error) {
        console.error("Error al guardar la sesión:", error);
      }
    });
  };

  return { stats, saveProgress, isSaving: isPending };
}