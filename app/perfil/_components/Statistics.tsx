'use client';

import { usePrayerProgress } from '@/hooks/usePrayerProgress';
import { CalendarDays, Flame, RotateCcw } from "lucide-react";

const Statistics = () => {
    const { stats } = usePrayerProgress();

    return (
        <div>
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                Estadisticas
            </h3>
            <div className="p-4 rounded-2xl bg-primary/5 border border-border flex flex-col items-center justify-center">
                    <Flame size={24} className="text-primary mb-2" />
                    <span className="text-2xl font-bold text-primary">{stats.currentStreak}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Dias seguidos</span>
                </div>
        </div>
    );
}

export default Statistics;