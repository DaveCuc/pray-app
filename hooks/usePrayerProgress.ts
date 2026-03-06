
import { useState, useEffect } from 'react';

export function usePrayerProgress() {
  const [stats, setStats] = useState({
    currentStreak: 0,
    totalDays: 0,
    lastDate: '',
    completedToday: false
  });

  // Cargar datos al montar el componente (Solo en el cliente)
  useEffect(() => {
    const saved = localStorage.getItem('prayer-progress');
    if (saved) {
      const data = JSON.parse(saved);
      const today = new Date().toDateString();
      
      // Lógica de reset de racha si pasó más de 1 día
      if (data.lastDate) {
        const last = new Date(data.lastDate);
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 3600 * 24));
        
        if (diffInDays > 1) data.currentStreak = 0;
      }

      setStats({
        ...data,
        totalDays: data.totalDays ?? data.currentStreak ?? 0,
        completedToday: data.lastDate === today
      });
    }
  }, []);

  const saveProgress = () => {
    const today = new Date().toDateString();
    const newStats = {
      ...stats,
      currentStreak: stats.completedToday ? stats.currentStreak : stats.currentStreak + 1,
      totalDays: stats.completedToday ? stats.totalDays : stats.totalDays + 1,
      lastDate: today,
      completedToday: true
    };

    setStats(newStats);
    localStorage.setItem('prayer-progress', JSON.stringify(newStats));
  };

  return { stats, saveProgress };
}