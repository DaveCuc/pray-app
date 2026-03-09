'use client';

import { usePrayer } from '@/app/_context/PrayerContext';
import { useReading } from '@/app/_context/ReadingContext';
import Reloj from '../_components/Reloj';
import Evangelio from '../_components/Evangelio';

import { useRouter } from 'next/navigation';
import { Play } from 'lucide-react';


export default function Home() {
  const { stats, saveProgress } = usePrayer();
  const { avanzarLectura } = useReading();
  const router = useRouter();

  // Esta función se ejecuta CADA VEZ que termina una fase de 20 min en el Reloj
  const handleFaseCompletada = () => {
    saveProgress();      // Guarda el día de racha
    avanzarLectura();    // Avanza 1 capítulo de Evangelio y 1 de Salmo
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 p-6 space-y-8">

      <hr />
<button 
        onClick={() => router.push('/sesion')}
        className="group relative flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground text-xl font-bold rounded-full shadow-[0_0_40px_rgba(245,165,36,0.3)] hover:shadow-[0_0_60px_rgba(245,165,36,0.5)] transition-all hover:scale-105"
      >
        <Play className="fill-current" />
        Iniciar Oración
      </button>
      <p className="mt-4 text-sm text-muted-foreground">
        Entrarás al modo concentración
      </p>
      <hr />
      <section className="bg-card rounded-3xl shadow-sm border border-border">

        <Reloj
          onFinish={handleFaseCompletada}
          yaOramosHoy={stats.completedToday}
        />
      </section>

      <section className="pb-10">
        <Evangelio />
      </section>

    </div>
  );
}