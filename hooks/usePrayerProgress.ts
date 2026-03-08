// hooks/usePrayerProgress.ts
import { useState, useEffect, useTransition } from 'react';
import { useAuth } from '@clerk/nextjs';
import { getPrayerStats, savePrayerSession } from '@/actions/prayer';

export function usePrayerProgress() {
  const { isSignedIn } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [stats, setStats] = useState({
    currentStreak: 0,
    totalDays: 0,
    longestStreak: 0,
    completedToday: false,
    isLoading: true
  });

  useEffect(() => {
    if (!isSignedIn) {
      setStats(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const loadData = async () => {
      try {
        const data = await getPrayerStats();
        if (data) {
          setStats({ ...data, isLoading: false });
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
    setStats(prev => ({
      ...prev,
      currentStreak: prev.completedToday ? prev.currentStreak : prev.currentStreak + 1,
      totalDays: prev.completedToday ? prev.totalDays : prev.totalDays + 1,
      completedToday: true
    }));

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