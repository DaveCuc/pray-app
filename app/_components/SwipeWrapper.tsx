'use client';

import { motion, PanInfo } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { ReactNode } from 'react';

// Define el orden exacto de tus pestañas (ajusta las rutas según tu app)
const ROUTES_ORDER = ['/', '/musica', '/perfil']; 

// Cuántos píxeles debe deslizar el dedo para que cuente como un cambio de pestaña
const SWIPE_THRESHOLD = 50; 

export default function SwipeWrapper({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Si el movimiento horizontal fue muy corto, no hacemos nada
    if (Math.abs(info.offset.x) < SWIPE_THRESHOLD) return;

    const currentIndex = ROUTES_ORDER.indexOf(pathname);
    if (currentIndex === -1) return; // Si no está en las pestañas principales, ignoramos

    // Deslizó hacia la izquierda (Siguiente pestaña)
    if (info.offset.x < -SWIPE_THRESHOLD) {
      if (currentIndex < ROUTES_ORDER.length - 1) {
        router.push(ROUTES_ORDER[currentIndex + 1]);
      }
    } 
    // Deslizó hacia la derecha (Pestaña anterior)
    else if (info.offset.x > SWIPE_THRESHOLD) {
      if (currentIndex > 0) {
        router.push(ROUTES_ORDER[currentIndex - 1]);
      }
    }
  };

  return (
    <motion.div
      drag="x" // Solo permitimos arrastrar horizontalmente
      dragConstraints={{ left: 0, right: 0 }} // Para que el contenido no se quede "fuera" de la pantalla
      dragElastic={0.2} // Un pequeño efecto de "goma" al jalar
      onDragEnd={handleDragEnd}
      className="w-full h-full overflow-x-hidden touch-pan-y"
      // touch-pan-y es crucial: permite el scroll vertical normal pero captura el swipe horizontal
    >
      {children}
    </motion.div>
  );
}