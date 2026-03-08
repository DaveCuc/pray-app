
import CandleIco from './Candle';

export default function StreakDisplay({ count, isActive }: { count: number; isActive: boolean }) {
  return (
    <div className="flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-2xl border border-orange-500/20">
      <CandleIco isActive={isActive} />
      <span className="text-lg font-bold text-orange-500">{count} días</span>
    </div>
  );
}