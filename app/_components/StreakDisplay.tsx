import { motion } from 'framer-motion';

export default function StreakDisplay({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-2xl border border-orange-500/20">
      <motion.span 
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-2xl"
      >
        🔥
      </motion.span>
      <span className="text-lg font-bold text-orange-500">{count} días</span>
    </div>
  );
}