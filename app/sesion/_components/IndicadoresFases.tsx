'use client';

// Definimos qué datos necesita recibir este componente desde el padre
interface Fase {
  id: number;
  nombre: string;
  duration: number;
}

interface IndicadoresFasesProps {
  fases: Fase[];
  faseActual: number;
  todoCompletado: boolean;
}

export default function IndicadoresFases({
  fases,
  faseActual,
  todoCompletado,
}: IndicadoresFasesProps) {
  return (
    <div className="flex gap-2 mb-10 z-10 mt-6">
      {fases.map((fase, i) => (
        <div
          key={fase.id}
          className={`h-2 transition-all duration-300 rounded-full ${
            i === faseActual && !todoCompletado
              ? "w-12 bg-primary drop-shadow-[0_0_5px_rgba(245,165,36,0.5)]" // Fase actual (larga y brillante)
              : i < faseActual || todoCompletado
              ? "w-8 bg-primary/40" // Fases pasadas o todas terminadas (medianas y opacas)
              : "w-8 bg-border" // Fases futuras (grises)
          }`}
        />
      ))}
    </div>
  );
}