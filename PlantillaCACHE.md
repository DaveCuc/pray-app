'use client';

import { useState, useEffect, useTransition } from 'react';
import { getCache, setCache } from '@/utils/cache';
// import { getTamanioLetraBD, saveTamanioLetraBD } from '@/actions/settings'; 

export function useConfiguracionApp() {
  const [isPending, startTransition] = useTransition();

  // PASO 1: Leer el caché INMEDIATAMENTE al iniciar la variable
  const [tamanioLetra, setTamanioLetra] = useState<number>(() => {
    const cache = getCache<number>('oratio_letra_cache');
    return cache ? cache : 16; // 16px por defecto si no hay nada
  });

  // PASO 2: Sincronizar con la base de datos "por debajo del agua"
  useEffect(() => {
    const sincronizarConBD = async () => {
      const dataReal = await getTamanioLetraBD(); // Tu Server Action
      if (dataReal) {
        setTamanioLetra(dataReal);
        setCache('oratio_letra_cache', dataReal); // Refrescamos el caché
      }
    };
    sincronizarConBD();
  }, []);

  // PASO 3: Guardar súper rápido (Optimistic Update)
  const cambiarTamanio = (nuevoTamanio: number) => {
    // 1. Actualizamos la pantalla y el caché AL INSTANTE (0 ms)
    setTamanioLetra(nuevoTamanio);
    setCache('oratio_letra_cache', nuevoTamanio);

    // 2. Le avisamos a la base de datos sin congelar la pantalla
    startTransition(async () => {
      await saveTamanioLetraBD(nuevoTamanio);
    });
  };

  return { tamanioLetra, cambiarTamanio, guardando: isPending };
}