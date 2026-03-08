'use client';

import { usePrayerProgress } from '@/hooks/usePrayerProgress';
import { useLectura } from '@/hooks/useLectura';
import Reloj from './_components/Reloj';
import Evangelio from './_components/Evangelio';
import Attention from './_components/Attention';


export default function Home() {
  const { stats, saveProgress } = usePrayerProgress();
  const { lecturaActual, avanzarLectura, isLoaded } = useLectura();

  // Esta función se ejecuta CADA VEZ que termina una fase de 20 min en el Reloj
  const handleFaseCompletada = () => {
    saveProgress();      // Guarda el día de racha
    avanzarLectura();    // Avanza 1 capítulo de Evangelio y 1 de Salmo
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 p-6 space-y-8">

    <Attention />

      <section className="bg-card rounded-3xl shadow-sm border border-border">

        <Reloj
          onFinish={handleFaseCompletada}
          yaOramosHoy={stats.completedToday}
        />
      </section>

      <section className="pb-10">

        <Evangelio
          libro={lecturaActual.libro}
          capitulo={lecturaActual.capitulo}
          salmo={lecturaActual.salmo}
          isLoaded={isLoaded}
        />
      </section>
    
    </div>
  );
}