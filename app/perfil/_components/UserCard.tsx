'use client';

import { usePrayerProgress } from '@/hooks/usePrayerProgress';
import { User, Flame, CalendarDays } from 'lucide-react';

export default function UserCard() {
  const { stats } = usePrayerProgress();

  return (
    <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-800">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border-2 border-yellow-500">
          <User size={32} className="text-neutral-500 dark:text-neutral-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Mi Perfil</h2>
          <p className="text-sm text-neutral-500">Discípulo en oración</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30 flex flex-col items-center justify-center">
          <Flame size={24} className="text-orange-500 mb-2" />
          <span className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.currentStreak}</span>
          <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">Días seguidos</span>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 flex flex-col items-center justify-center">
          <CalendarDays size={24} className="text-blue-500 mb-2" />
          <span className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.totalDays}</span>
          <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">Total de días</span>
        </div>
      </div>
    </section>
  );
}