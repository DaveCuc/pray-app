
import CandleIco from './Candle';

export default function StreakDisplay({ count, isActive }: { count: number; isActive: boolean }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl">
      <CandleIco isActive={isActive} />
      <span className="text-lg font-bold text-primary">{count} días</span>
    </div>
  );
}