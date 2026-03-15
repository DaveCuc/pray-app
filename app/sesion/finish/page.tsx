'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Flame, Home, Award } from 'lucide-react';
import { usePrayer } from '@/app/_context/PrayerContext';

export default function FinishPage() {
  const router = useRouter();
  const { stats } = usePrayer();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Círculos decorativos de fondo */}
      <div className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-green-500/10 rounded-full blur-3xl -bottom-20 -right-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
        className="flex flex-col items-center z-10 text-center"
      >
        {/* Ícono de trofeo/flama gigante */}
        <div className="relative w-32 h-32 flex items-center justify-center bg-primary/10 rounded-full mb-8 shadow-[0_0_60px_rgba(245,165,36,0.2)]">
          <Flame size={64} className="text-primary animate-pulse" />
        </div>

        <h1 className="text-4xl font-extrabold text-foreground mb-4 tracking-tight">
          ¡Gloria a Dios!
        </h1>
        <p className="text-muted-foreground text-lg mb-10 max-w-sm">
          Has completado tu meta de oración. La vela de hoy está encendida.
        </p>

        {/* Tarjeta de Racha Actualizada */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border p-6 rounded-3xl shadow-sm w-full max-w-xs flex items-center justify-between mb-12"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-500">
              <Award size={24} />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-muted-foreground">Racha Activa</div>
              <div className="text-xl font-bold text-foreground">
                {stats.currentStreak} {stats.currentStreak === 1 ? 'día' : 'días'}
              </div>
            </div>
          </div>
          <Flame size={28} className="text-primary" />
        </motion.div>

        {/* Botón de Salir */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => router.push('/')}
          className="group relative flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground text-xl font-bold rounded-full shadow-[0_0_40px_rgba(245,165,36,0.3)] hover:shadow-[0_0_60px_rgba(245,165,36,0.5)] transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <Home size={20} /> Continuar
        </motion.button>
      </motion.div>

    </div>
  );
}