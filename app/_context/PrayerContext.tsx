'use client';

import { createContext, useContext, useState, useEffect, useTransition, ReactNode } from 'react';
import { useAuth } from '@clerk/nextjs';
import { getPrayerStats, savePrayerSession } from '@/actions/prayer';

// 1. AGREGAMOS lastPrayerDate A LA INTERFAZ
interface PrayerStats {
  currentStreak: number;
  totalDays: number;
  longestStreak: number;
  completedToday: boolean;
  lastPrayerDate?: string | null; 
  isLoading: boolean;
}

interface PrayerContextType {
  stats: PrayerStats;
  saveProgress: (duration?: number) => void;
  isSaving: boolean;
}

const PrayerContext = createContext<PrayerContextType | null>(null);

// 2. FUNCIÓN DE AYUDA CORREGIDA: Ignora las zonas horarias
const isSameDay = (date1: Date | string | null, date2: Date) => {
  if (!date1) return false;

  // 1. Extraemos solo la parte "YYYY-MM-DD" del servidor (ej. "2026-03-08")
  const dateString = typeof date1 === 'string' ? date1 : date1.toISOString();
  const dbDate = dateString.split('T')[0]; 

  // 2. Formateamos la hora LOCAL del celular al mismo formato "YYYY-MM-DD"
  const year = date2.getFullYear();
  const month = String(date2.getMonth() + 1).padStart(2, '0');
  const day = String(date2.getDate()).padStart(2, '0');
  const localDate = `${year}-${month}-${day}`;

  // 3. Comparamos los textos directamente (ej. "2026-03-08" === "2026-03-08")
  return dbDate === localDate;
};

export function PrayerProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  const [isPending, startTransition] = useTransition();

  const [stats, setStats] = useState<PrayerStats>({
    currentStreak: 0,
    totalDays: 0,
    longestStreak: 0,
    completedToday: false,
    lastPrayerDate: null,
    isLoading: true ,
  });

  // ==========================================
  // MOTOR DE CARGA: Stale-While-Revalidate
  // ==========================================
  useEffect(() => {
    if (!isLoaded) return; 

    if (!isSignedIn) {
      setStats(prev => ({ ...prev, isLoading: false }));
      return;
    }

    // A) LEER CACHÉ PRIMERO (Milisegundo 1: Datos instantáneos)
    const cached = localStorage.getItem('oratio_stats_cache');
    if (cached) {
      const parsedCache = JSON.parse(cached);
      const isLitToday = isSameDay(parsedCache.lastPrayerDate, new Date());
      setStats({ 
        ...parsedCache, 
        completedToday: isLitToday,
        isLoading: false 
      });
    }

    // B) REVALIDAR CON LA BD (En segundo plano: Datos frescos del servidor)
    const loadData = async () => {
      try {
        const data = await getPrayerStats();
        if (data) {
          const isLitToday = isSameDay(data.lastPrayerDate, new Date());
          let freshDataForCache: PrayerStats | null = null;

          setStats(prev => {
            const freshData: PrayerStats = {
              ...prev,
              ...data,
              completedToday: isLitToday,
              isLoading: false
            };
            freshDataForCache = freshData;
            return freshData;
          });

          if (freshDataForCache) {
            // Actualizar caché para la próxima apertura
            localStorage.setItem('oratio_stats_cache', JSON.stringify(freshDataForCache));
          }
        }
      } catch (error) {
        console.error("Error al cargar rachas:", error);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadData();
  }, [isSignedIn, isLoaded]);

  // ==========================================
  // GUARDADO OPTIMISTA: Velocidad instantánea
  // ==========================================
  const saveProgress = (duration: number = 20) => {
    if (!isSignedIn) return;

    // CANDADO 1: Evitar doble ejecución en el mismo día
    if (stats.completedToday) {
      console.log("Ya oraste hoy. No se sumará doble racha.");
      return;
    }

    // A) ACTUALIZAR PANTALLA Y CACHÉ AL INSTANTE (0 milisegundos)
    setStats(prev => {
      const now = new Date();
      const newStats = {
        ...prev,
        currentStreak: prev.currentStreak + 1,
        totalDays: prev.totalDays + 1,
        completedToday: true,
        lastPrayerDate: now.toISOString()
      };
      
      localStorage.setItem('oratio_stats_cache', JSON.stringify(newStats));
      return newStats;
    });

    // B) ENVIAR A LA BD EN SILENCIO (Sin bloquear la app)
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

export const usePrayer = () => {
  const context = useContext(PrayerContext);
  if (!context) throw new Error("usePrayer debe usarse dentro de PrayerProvider");
  return context;
};