'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import RelojSection from './_components/RelojSection'; 
import EvangelioCaps from './_components/EvangelioCaps'; 

export default function SesionPage() {
  const router = useRouter();
  
  // 🔥 NUEVO ESTADO: Controla si ya se acabaron todas las fases
  const [cicloCompletado, setCicloCompletado] = useState(false);

  const handleTerminar = () => {
    // Alerta antes de salir
    const confirmar = window.confirm(
      "¿Estás seguro de que quieres salir? Tu progreso y lecturas de esta sesión no se guardarán."
    );
    
    if (confirmar) {
      // Limpiamos los cachés temporales de pasos Y lecturas
      localStorage.removeItem('oratio_session_step');
      localStorage.removeItem('oratio_lectura_local');
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start p-6 relative">
      
      <button 
        onClick={handleTerminar}
        className="absolute top-6 left-6 p-2 bg-card rounded-full border border-border hover:bg-muted transition-colors z-50"
      >
        <X size={24} className="text-muted-foreground" />
      </button>

      <div className="w-full max-w-md flex flex-col items-center gap-8 mt-16 pb-12">
        
        <div className="w-full flex justify-center">
          {/* Le pasamos una función para que el Reloj nos avise cuando termine todo */}
          <RelojSection onCicloTerminado={() => setCicloCompletado(true)} />
        </div>

        {/* 🔥 MAGIA VISUAL: Si el ciclo ya se completó, ocultamos el Evangelio */}
        {!cicloCompletado && (
          <>
            <div className="w-1/2 h-px bg-border my-4 animate-in fade-in" />
            <div className="w-full animate-in fade-in slide-in-from-bottom-4">
              <EvangelioCaps />
            </div>
          </>
        )}

      </div>
    </div>
  );
}