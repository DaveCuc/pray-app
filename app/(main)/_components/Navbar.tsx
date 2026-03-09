'use client';

import StreakDisplay from "./StreakDisplay";
import { usePrayer } from '@/app/_context/PrayerContext';

const NavBar = () => {
  const { stats } = usePrayer();

  return ( 
    <div className="w-full h-16 bg-[#38332e] flex items-center justify-between px-6 sticky top-0 z-50">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary">
          Oratio
        </h1>
      <StreakDisplay
        count={stats.currentStreak}
        isActive={stats.completedToday}
        isLoading={stats.isLoading}
      />
    </div>
  );
}
 
export default NavBar;
