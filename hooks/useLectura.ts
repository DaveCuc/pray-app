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

  const reiniciarLectura = () => {
    setIndiceLectura(0);
    localStorage.setItem('oratio-lectura', '0');
  };

  const ajustarLectura = (nuevoIndice: number) => {
    setIndiceLectura(nuevoIndice);
    localStorage.setItem('oratio-lectura', nuevoIndice.toString());
  };

  return { indiceLectura, avanzarLectura, reiniciarLectura, ajustarLectura, isLoaded };
};