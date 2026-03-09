'use client';

import { usePrayer } from '@/app/_context/PrayerContext';
import { useReading } from '@/app/_context/ReadingContext';

import Evangelio from './_components/Evangelio';

import { useRouter } from 'next/navigation';
import { Play } from 'lucide-react';
import Vela from './_components/Vela';
import VelaOff from './_components/VelaOff';


export default function Home() {
  const { stats, saveProgress } = usePrayer();
  const { avanzarLectura } = useReading();
  const router = useRouter();

  const yaOroHoy = stats.completedToday;
  const isPrayerLoading = stats.isLoading;
  const ctaLabel = isPrayerLoading
    ? 'Cargando...'
    : yaOroHoy
      ? 'Continuar Oración'
      : 'Iniciar Oración';

  // Esta función se ejecuta CADA VEZ que termina una fase de 20 min en el Reloj
  const handleFaseCompletada = () => {
    saveProgress();      // Guarda el día de racha
    avanzarLectura();    // Avanza 1 capítulo de Evangelio y 1 de Salmo
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 p-6 space-y-8">


      <div className="flex justify-center">
        {isPrayerLoading ? (
          <div className="h-32 w-32 rounded-full bg-muted/30 animate-pulse" />
        ) : yaOroHoy ? (
          <Vela />
        ) : (
          <VelaOff />
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => router.push('/sesion')}
          disabled={isPrayerLoading}
          className="group relative flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground text-xl font-bold rounded-full shadow-[0_0_40px_rgba(245,165,36,0.3)] hover:shadow-[0_0_60px_rgba(245,165,36,0.5)] transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <Play className="fill-current" />
          {ctaLabel}
        </button>
      </div>
      <hr />
      <section className="pb-10">
        <Evangelio />
      </section>

    </div>
  );
}