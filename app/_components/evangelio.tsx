'use client';

import { BookOpen } from 'lucide-react';

const EVANGELIOS = [
  ...Array.from({ length: 28 }, (_, i) => ({ libro: 'Mateo', capitulo: i + 1 })),
  ...Array.from({ length: 16 }, (_, i) => ({ libro: 'Marcos', capitulo: i + 1 })),
  ...Array.from({ length: 24 }, (_, i) => ({ libro: 'Lucas', capitulo: i + 1 })),
  ...Array.from({ length: 21 }, (_, i) => ({ libro: 'Juan', capitulo: i + 1 })),
];

const TOTAL_SALMOS = 150;

interface EvangelioProps {
  indiceLectura: number;
  avanzarLectura: () => void;
  isLoaded: boolean;
}

const Evangelio = ({ indiceLectura, avanzarLectura, isLoaded }: EvangelioProps) => {
  if (!isLoaded) return null;

  const lecturaEvangelio = EVANGELIOS[indiceLectura % EVANGELIOS.length];
  const lecturaSalmo = (indiceLectura % TOTAL_SALMOS) + 1;

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
          <BookOpen size={24} />
        </div>
        <h3 className="text-xl font-bold text-neutral-800 dark:text-white">Lectura del Día</h3>
      </div>

      <div className="space-y-4 mb-6">
        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Evangelio</p>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white">
            {lecturaEvangelio.libro} <span className="text-blue-500">{lecturaEvangelio.capitulo}</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Salmo</p>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white">
            Capítulo <span className="text-blue-500">{lecturaSalmo}</span>
          </p>
        </div>
      </div>

      {/* Botón manual opcional, por si el usuario quiere avanzar sin usar el reloj */}
      <button
        onClick={avanzarLectura}
        className="hidden w-full py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
      >
        Avanzar lectura manualmente
      </button>
    </div>
  );
};

export default Evangelio;