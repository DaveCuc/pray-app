import { Music } from 'lucide-react';

import Upcoming from '../../_components/Upcoming';

export default function MusicPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 p-6 space-y-8 pb-24">
      
      {/* Header */}
      <header className="mt-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white flex items-center gap-3">
          <Music className="w-8 h-8 text-yellow-500" />
          Música
        </h1>
        <p className="text-neutral-500 mt-2">
          Acompaña tu tiempo de oración con la mejor selección musical.
        </p>
      </header>

      {/* Componentes modulares */}


      {/* <PlataformasMusica /> */}
      {/*<SugerenciasMusica /> */}
      <Upcoming />

    </div>
  );
}