import { useState, useEffect } from 'react';

export const useLectura = () => {
  const [indiceLectura, setIndiceLectura] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const guardado = localStorage.getItem('oratio-lectura');
    if (guardado) {
      setIndiceLectura(Number(guardado));
    }
    setIsLoaded(true);
  }, []);

  const avanzarLectura = () => {
    setIndiceLectura((prev) => {
      const nuevoIndice = prev + 1;
      localStorage.setItem('oratio-lectura', nuevoIndice.toString());
      return nuevoIndice;
    });
  };

  return { indiceLectura, avanzarLectura, isLoaded };
};