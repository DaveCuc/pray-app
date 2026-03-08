'use client';

import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { useReading } from '@/app/_context/ReadingContext';

const Evangelio = () => {
const { lecturaActual, ajustarLectura, isSaving } = useReading();  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Función para avanzar al siguiente capítulo
  const handleAvanzar = () => {
    ajustarLectura(lecturaActual.libro, lecturaActual.capitulo + 1, lecturaActual.salmo);
  };

  // Protección de hidratación: no renderizar hasta que estemos en el cliente
  if (!isMounted || lecturaActual.isLoading) return null;

  return (
    <div className="bg-card rounded-3xl p-6 shadow-sm border border-border text-foreground">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-xl text-primary">
          <BookOpen size={24} />
        </div>
        <h3 className="text-xl font-bold text-foreground">Lectura del Día</h3>
      </div>

      <div className="space-y-4 mb-6">
        <div className="p-4 rounded-2xl bg-muted/30 border border-border">
          <p className="text-2xl font-bold text-foreground">
            {lecturaActual.libro} <span className="text-primary">{lecturaActual.capitulo}</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-muted/30 border border-border">
          <p className="text-2xl font-bold text-foreground">
            Salmo <span className="text-primary">{lecturaActual.salmo}</span>
          </p>
        </div>
      </div>

      {/* Botón para avanzar lectura */}
      <button 
        onClick={handleAvanzar}
        disabled={isSaving}
        className="w-full px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50"
      >
        {isSaving ? 'Guardando...' : 'Avanzar Lectura'}
      </button>
    </div>
  );
};

export default Evangelio;
