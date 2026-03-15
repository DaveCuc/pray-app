'use client';

import { usePrayer } from '@/app/_context/PrayerContext';
import { motion, AnimatePresence } from 'framer-motion';

// Ajusta estas rutas a donde tengas guardados tus componentes visuales reales
import Vela from '@/app/(main)/_components/Vela';
import VelaDim from '@/app/(main)/_components/VelaDim';

interface VelaOnOffProps {
  forceLit?: boolean;
}

export default function VelaOnOff({ forceLit = false }: VelaOnOffProps) {
  // 1. LLAMADO AL CACHÉ: Le preguntamos al contexto maestro cómo va el usuario
  const { stats } = usePrayer();

  // 2. LA LÓGICA: 
  // stats.completedToday se vuelve 'true' automáticamente en cuanto termina el paso 1.
  // forceLit permite encenderla de forma forzada durante la sesión (ej. modo zen).
  const isLit = stats.completedToday || forceLit;

  // Mientras lee el caché (toma 1 milisegundo), no mostramos nada para evitar parpadeos raros
  if (stats.isLoading) {
    return <div className="w-full h-full opacity-0"></div>;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* AnimatePresence mode="wait" hace que primero desaparezca una y luego aparezca la otra suavemente */}
      <AnimatePresence mode="wait">
        {isLit ? (
          // VELA ENCENDIDA
          <motion.div
            key="vela-encendida"
            initial={{ opacity: 0, filter: 'blur(4px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute flex items-end justify-center"
          >
            <Vela />
          </motion.div>
        ) : (
          // VELA TENUE / APAGADA
          <motion.div
            key="vela-tenue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }} // La mantenemos un poco transparente/tenue
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute flex items-end justify-center grayscale-50" // Le quitamos un poco de color con Tailwind
          >
            <VelaDim />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}