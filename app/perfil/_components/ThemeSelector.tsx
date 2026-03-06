'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evitar error de hidratación renderizando solo en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const options = [
    { value: 'light', label: 'Claro', icon: Sun },
    { value: 'dark', label: 'Oscuro', icon: Moon },
    { value: 'system', label: 'Sistema', icon: Monitor },
  ];

  return (
    <section>
      <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <Moon size={20} className="text-primary" />
        Apariencia
      </h3>
      <div className="flex bg-card p-1.5 rounded-2xl border border-border">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.value;
          
          return (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all ${
                isSelected 
                  ? 'bg-primary/10 text-primary drop-shadow-[0_0_8px_rgba(245,165,36,0.1)]' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs font-semibold">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}