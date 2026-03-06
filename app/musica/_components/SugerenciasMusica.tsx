import { Radio } from 'lucide-react';

const SUGERENCIAS = [
  { titulo: 'Música de Adoración', tiempo: '60 min', tipo: 'Playlist' },
  { titulo: 'Instrumental de Oración', tiempo: '120 min', tipo: 'Radio' },
  { titulo: 'Salmos Cantados', tiempo: '45 min', tipo: 'Álbum' },
];

export default function SugerenciasMusica() {
  return (
    <section>
      <h2 className="text-lg font-bold text-neutral-800 dark:text-white mb-4 flex items-center gap-2">
        <Radio size={20} className="text-yellow-500" />
        Sugerencias para buscar
      </h2>
      <div className="space-y-3">
        {SUGERENCIAS.map((sug, index) => (
          <div 
            key={index}
            className="flex justify-between items-center p-4 bg-neutral-100 dark:bg-neutral-800/50 rounded-2xl"
          >
            <div>
              <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
                {sug.titulo}
              </h4>
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
                {sug.tipo}
              </span>
            </div>
            <span className="text-sm text-neutral-400 font-mono">
              {sug.tiempo}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}