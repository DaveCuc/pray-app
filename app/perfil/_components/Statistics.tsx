'use client';

import { usePrayerProgress } from '@/hooks/usePrayerProgress';
import { CalendarDays, Flame, Trophy } from "lucide-react";

const Statistics = () => {
    const { stats } = usePrayerProgress();

    return (
        <div>
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                Estadísticas
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                
                {/* Racha Actual */}
                <div className="p-4 rounded-2xl bg-primary/5 border border-border flex flex-col items-center justify-center">
                    <Flame size={24} className="text-primary mb-2" />
                    <span className="text-2xl font-bold text-primary">{stats.currentStreak}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Racha Actual</span>
                </div>

                {/* Racha Más Larga */}
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-border flex flex-col items-center justify-center">
                    <Trophy size={24} className="text-amber-500 mb-2" />
                    <span className="text-2xl font-bold text-amber-500">{stats.longestStreak}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Récord</span>
                </div>

                {/* Total de Días */}
                <div className="p-4 rounded-2xl bg-blue-500/5 border border-border flex flex-col items-center justify-center">
                    <CalendarDays size={24} className="text-blue-500 mb-2" />
                    <span className="text-2xl font-bold text-blue-500">{stats.totalDays}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Total de Días</span>
                </div>

            </div>
        </div>
    );
}

export default Statistics;