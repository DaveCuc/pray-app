'use client';

import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { usePrayer } from '@/app/_context/PrayerContext';
// Asegúrate de importar tus componentes reales
import Reloj from '@/app/sesion/_components/Reloj'; 
import Evangelio from '@/app/(main)/_components/Evangelio'; 

export default function SesionPage() {
  const router = useRouter();
  const { saveProgress } = usePrayer();

  const handleFaseCompletada = () => {
    saveProgress();
  };

  const handleTerminar = () => {
    // Te regresa a la pantalla principal
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start p-6 relative">
      
      {/* Botón para salir de la sesión */}
      <button 
        onClick={handleTerminar}
        className="absolute top-6 left-6 p-2 bg-card rounded-full border border-border hover:bg-muted transition-colors z-50"
      >
        <X size={24} className="text-muted-foreground" />
      </button>

      <div className="w-full max-w-md flex flex-col items-center gap-8 mt-16 pb-12">
        
        {/* Aquí va tu componente del Reloj (que ya tiene la vela) */}
        <div className="w-full flex justify-center">
          <Reloj onFinish={handleFaseCompletada} />
        </div>

        {/* Separador elegante */}
        <div className="w-1/2 h-px bg-border my-4" />

        {/* Aquí va tu componente de las Lecturas */}
        <div className="w-full">
          <Evangelio />
        </div>

      </div>
    </div>
  );
}