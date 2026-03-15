'use client';

import { useState, useEffect, useTransition } from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import { getTimerPreference, saveTimerPreference } from '@/actions/preferences';

const OPCIONES_TIEMPO = [
  { tiempo: 20, titulo: '20 Minutos', descripcion: '1 Fase (Acción de Gracias)' },
  { tiempo: 40, titulo: '40 Minutos', descripcion: '2 Fases (+ Alabanza)' },
  { tiempo: 60, titulo: '60 Minutos', descripcion: '3 Fases (+ Espíritu Santo)' },
];

export default function TimerPreferences() {
  const [isPending, startTransition] = useTransition();
  const [tiempoSeleccionado, setTiempoSeleccionado] = useState<number>(60);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // 1. LEER CACHÉ RÁPIDO
    const guardado = localStorage.getItem('oratio_tiempo_pref');
    if (guardado) setTiempoSeleccionado(Number(guardado));

    // 2. CONFIRMAR CON BASE DE DATOS
    const sincronizarBD = async () => {
      const tiempoReal = await getTimerPreference();
      setTiempoSeleccionado(tiempoReal);
      localStorage.setItem('oratio_tiempo_pref', tiempoReal.toString());
    };
    sincronizarBD();
  }, []);

  const handleSeleccion = (tiempo: number) => {
    // A) Actualizar visual y caché al instante
    setTiempoSeleccionado(tiempo);
    localStorage.setItem('oratio_tiempo_pref', tiempo.toString());

    // B) Guardar en Base de Datos silenciosamente
    startTransition(async () => {
      await saveTimerPreference(tiempo);
    });
  };

  if (!isMounted) return <div className="animate-pulse h-40 bg-card rounded-2xl"></div>;

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
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
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
        {isPending ? "Guardando preferencia..." : "Esta configuración define la meta diaria."}
      </p>
    </section>
  );
}