'use client';

import { useState, useEffect } from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';

const OPCIONES_TIEMPO = [
  { tiempo: 20, titulo: '20 Minutos', descripcion: '1 Fase (Acción de Gracias)' },
  { tiempo: 40, titulo: '40 Minutos', descripcion: '2 Fases (+ Alabanza)' },
  { tiempo: 60, titulo: '60 Minutos', descripcion: '3 Fases (+ Espíritu Santo)' },
];

export default function TimerPreferences() {
  const [tiempoSeleccionado, setTiempoSeleccionado] = useState<number>(60);

  useEffect(() => {
    const guardado = localStorage.getItem('oratio-tiempo-pref');
    if (guardado) setTiempoSeleccionado(Number(guardado));
  }, []);

  const handleSeleccion = (tiempo: number) => {
    setTiempoSeleccionado(tiempo);
    localStorage.setItem('oratio-tiempo-pref', tiempo.toString());
  };

  return (
    <section>
      <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <Clock size={20} className="text-primary" />
        Preferencia de Temporizador
      </h3>
      <div className="space-y-3">
        {OPCIONES_TIEMPO.map((opcion) => {
          const isSelected = tiempoSeleccionado === opcion.tiempo;
          
          return (
            <button
              key={opcion.tiempo}
              onClick={() => handleSeleccion(opcion.tiempo)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                isSelected 
                  ? 'bg-primary/5 border-primary drop-shadow-[0_0_10px_rgba(245,165,36,0.15)]' 
                  : 'bg-card border-border hover:border-primary/50'
              }`}
            >
              <div className="text-left">
                <h4 className={`font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {opcion.titulo}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {opcion.descripcion}
                </p>
              </div>
              {isSelected && <CheckCircle2 size={24} className="text-primary" />}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-4 text-center">
        Esta configuración define la meta diaria, pero puedes detenerte en cualquier momento.
      </p>
    </section>
  );
}
