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

  const saludo = stats.completedToday 
    ? "¡Has completado tu oración de hoy!" 
    : "Es un buen momento para orar.";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 p-6 space-y-8">
      
      <section className="mt-4">
        <h2 className="text-xl font-medium text-neutral-700 dark:text-neutral-300">
          {saludo}
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Día {stats.totalDays + 1} de racha global.
        </p>
      </section>

      <section className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-neutral-100 dark:border-neutral-800">
        {/* Pasamos la función combinada al Reloj */}
        <Reloj onFinish={handleFaseCompletada} />
      </section>

      <section className="pb-10">
        {/* Pasamos el estado de lectura al componente Evangelio */}
        <Evangelio 
          indiceLectura={indiceLectura} 
          avanzarLectura={avanzarLectura}
          isLoaded={isLoaded}
        />
      </section>

    </div>
  );
}