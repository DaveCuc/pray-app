'use client';

import { motion, AnimatePresence } from "framer-motion";
import Vela from "../../(main)/_components/Vela";

interface RelojProps {
  minutes: number;
  seconds: number;
  faseNombre: string;
  progressPercentage: number;
  velaEncendida: boolean;
  modoZen: boolean;
  onToggleZen: () => void;
}

export default function Reloj({
  minutes,
  seconds,
  faseNombre,
  progressPercentage,
  velaEncendida,
  modoZen,
  onToggleZen,
}: RelojProps) {
  // Formateador de tiempo (ej. 20:00)
  const formatTime = () => 
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div 
      onClick={onToggleZen} 
      className="relative w-72 h-72 flex items-center justify-center cursor-pointer mb-12"
    >


      {/* 2. DISPLAY ANIMADO Y CONTADOR */}

      <AnimatePresence>
        {!modoZen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            {/* Sombra difuminada para que los números siempre se lean bien sobre la vela */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 bg-background/80 rounded-full blur-2xl"></div>
            </div>

            {/* Círculo SVG que se va vaciando */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 200 200">
              <circle 
                cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="3" 
                className="text-border" 
              />
              <circle
                cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - progressPercentage / 100)}`}
                className="text-primary transition-all duration-1000 drop-shadow-[0_0_10px_rgba(245,165,36,0.4)]"
              />
            </svg>

            {/* Números y nombre de la fase */}
            <div className="text-center z-30 mt-4">
              <div className="text-7xl font-extrabold text-foreground font-mono tracking-tight drop-shadow-md">
                {formatTime()}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mt-2 font-medium drop-shadow-sm">
                {faseNombre}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}