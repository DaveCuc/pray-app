'use client';

import { BookOpen } from 'lucide-react';

interface EvangelioProps {
  libro: string;
  capitulo: number;
  salmo: number;
  isLoaded: boolean;
}

const Evangelio = ({ libro, capitulo, salmo, isLoaded }: EvangelioProps) => {
  if (!isLoaded) return null;

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
            {libro} <span className="text-primary">{capitulo}</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-muted/30 border border-border">
          
          <p className="text-2xl font-bold text-foreground">
            Salmo <span className="text-primary">{salmo}</span>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Evangelio;
