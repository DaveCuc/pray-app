'use client';

import { useEffect, useState } from "react";
import CandleIco from "./CandleIco"; // Asegúrate de que este import coincida con el tuyo

interface StreakDisplayProps {
  count: number;
  isActive: boolean;
  isLoading?: boolean;
}

export default function StreakDisplay({ count, isActive, isLoading }: StreakDisplayProps) {
  // 1. Estado para saber si el componente ya se "hidrató" en el navegador
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl">
      {/* 2. Protegemos los valores: si no está montado, forzamos los valores por defecto */}
      <CandleIco isActive={isMounted ? isActive : false} />
      
      <span 
        className={`text-lg font-bold text-primary transition-opacity duration-200 ${
          !isMounted || isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* 3. EL TRUCO MAGISTRAL: El servidor siempre renderizará "0", y el cliente también en su primer intento */}
        {isMounted ? count : 0} días
      </span>
    </div>
  );
}