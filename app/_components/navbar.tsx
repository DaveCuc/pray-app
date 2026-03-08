'use client';

import StreakDisplay from "./StreakDisplay";
import { usePrayerProgress } from '@/hooks/usePrayerProgress';

const NavBar = () => {
  // El hook SIEMPRE debe ir dentro del componente
  const { stats } = usePrayerProgress();

  return ( 
    <div className="w-full h-16 bg-[#38332e] flex items-center justify-between px-6 sticky top-0 z-50">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary">
          Oratio
        </h1>
      <StreakDisplay count={stats.currentStreak} isActive={stats.completedToday} />
    </div>
  );
}
 
export default NavBar;