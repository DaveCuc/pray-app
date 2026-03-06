'use client';

import { usePrayerProgress } from '@/hooks/usePrayerProgress';
import { User, Flame, CalendarDays } from 'lucide-react';

export default function UserCard() {
  const { stats } = usePrayerProgress();

  return (
    <section className="bg-card rounded-3xl p-6 shadow-sm border border-border text-foreground">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border-2 border-primary">
          <User size={32} className="text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Mi Perfil</h2>
          <p className="text-sm text-muted-foreground">Discipulo en oracion</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-primary/5 border border-border flex flex-col items-center justify-center">
          <Flame size={24} className="text-primary mb-2" />
          <span className="text-2xl font-bold text-primary">{stats.currentStreak}</span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Dias seguidos</span>
        </div>

        <div className="p-4 rounded-2xl bg-muted/30 border border-border flex flex-col items-center justify-center">
          <CalendarDays size={24} className="text-primary mb-2" />
          <span className="text-2xl font-bold text-primary">{stats.totalDays}</span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Total de dias</span>
        </div>
      </div>
    </section>
  );
}