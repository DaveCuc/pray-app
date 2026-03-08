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
  isLoaded: boolean;
}

const Evangelio = ({ indiceLectura, isLoaded }: EvangelioProps) => {
  if (!isLoaded) return null;

  const lecturaEvangelio = EVANGELIOS[indiceLectura % EVANGELIOS.length];
  const lecturaSalmo = (indiceLectura % TOTAL_SALMOS) + 1;

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
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Evangelio</p>
          <p className="text-2xl font-bold text-foreground">
            {lecturaEvangelio.libro} <span className="text-primary">{lecturaEvangelio.capitulo}</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-muted/30 border border-border">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Salmo</p>
          <p className="text-2xl font-bold text-foreground">
            Capitulo <span className="text-primary">{lecturaSalmo}</span>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Evangelio;
