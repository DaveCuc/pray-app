'use client';

import { usePrayerProgress } from '@/hooks/usePrayerProgress';
import { useLectura } from '@/hooks/useLectura';
import Reloj from './_components/reloj';
import Evangelio from './_components/evangelio';


export default function Home() {
  const { stats, saveProgress } = usePrayerProgress();
  const { indiceLectura, avanzarLectura, isLoaded } = useLectura();

  // Esta función se ejecuta CADA VEZ que termina una fase de 20 min en el Reloj
  const handleFaseCompletada = () => {
    saveProgress();      // Guarda el día de racha
    avanzarLectura();    // Avanza 1 capítulo de Evangelio y 1 de Salmo
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 p-6 space-y-8">


      <section className="bg-card rounded-3xl shadow-sm border border-border">

        <Reloj
          onFinish={handleFaseCompletada}
          yaOramosHoy={stats.completedToday}
        />
      </section>

      <section className="pb-10">

        <Evangelio
          indiceLectura={indiceLectura}
          isLoaded={isLoaded}
        />
      </section>
    
    </div>
  );
}