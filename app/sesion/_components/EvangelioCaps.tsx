'use client';

import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { useReading } from '@/app/_context/ReadingContext'; // Asegúrate de que esta ruta sea correcta

const EvangelioCaps = () => {
  const { lecturaActual } = useReading();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !lecturaActual) return (
    <div className="bg-card rounded-3xl p-6 shadow-sm border border-border animate-pulse h-48 w-full"></div>
  );

  return (
    <div className="bg-card rounded-3xl p-6 shadow-sm border border-border text-foreground w-full transition-all duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-xl text-primary">
          <BookOpen size={24} />
        </div>
        <h3 className="text-xl font-bold text-foreground">Lectura del Día</h3>
      </div>

      <div className="space-y-4">
        {/* LIBRO Y CAPÍTULO */}
        <div className="p-4 rounded-2xl bg-muted/30 border border-border">
          <p className="text-2xl font-bold text-foreground">
            {lecturaActual.libro} <span className="text-primary">{lecturaActual.capitulo}</span>
          </p>
        </div>

        {/* SALMO */}
        <div className="p-4 rounded-2xl bg-muted/30 border border-border">
          <p className="text-2xl font-bold text-foreground">
            Salmo <span className="text-primary">{lecturaActual.salmo}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EvangelioCaps;