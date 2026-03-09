import { Sparkles } from 'lucide-react';

export default function Upcoming() {
  return (
    <section className="bg-card rounded-2xl px-4 py-6 shadow-sm border border-border text-foreground">
      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <div className="p-3 rounded-xl bg-primary/10 text-primary">
          <Sparkles size={24} />
        </div>
        <p className="text-lg font-semibold text-foreground">
          Próximamente
        </p>
        <p className="text-sm text-muted-foreground">
          Nuevo contenido en camino...
        </p>
      </div>
    </section>
  );
}