import { Headphones, PlayCircle, ListMusic } from 'lucide-react';

const PLATAFORMAS = [
  {
    id: 'spotify',
    nombre: 'Spotify',
    descripcion: 'Abre tu app de Spotify',
    url: 'https://open.spotify.com',
    color: 'bg-green-500',
    icon: Headphones,
  },
  {
    id: 'youtube',
    nombre: 'YouTube Music',
    descripcion: 'Explora en YouTube',
    url: 'https://music.youtube.com',
    color: 'bg-red-500',
    icon: PlayCircle,
  },
  {
    id: 'local',
    nombre: 'Música Local',
    descripcion: 'Reproductor del dispositivo',
    url: '#', 
    color: 'bg-blue-500',
    icon: ListMusic,
  },
];

export default function PlataformasMusica() {
  return (
    <section>
      <h2 className="text-lg font-bold text-neutral-800 dark:text-white mb-4">
        Plataformas
      </h2>
      <div className="grid gap-4">
        {PLATAFORMAS.map((plat) => {
          const Icon = plat.icon;
          return (
            <a
              key={plat.id}
              href={plat.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800 hover:scale-[1.02] transition-transform"
            >
              <div className={`p-3 rounded-xl text-white ${plat.color}`}>
                <Icon size={24} />
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-neutral-900 dark:text-white">
                  {plat.nombre}
                </h3>
                <p className="text-sm text-neutral-500">
                  {plat.descripcion}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}