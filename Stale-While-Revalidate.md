import { useState, useEffect, useTransition } from 'react';
// import { getMiDataBD, saveMiDataBD } from '@/actions/mis-acciones';

export function useMiNuevaFuncion() {
  const [isPending, startTransition] = useTransition();

  // ==========================================
  // PASO 1: EL ESTADO INICIAL (Con bandera de carga)
  // ==========================================
  // Siempre empezamos con valores por defecto y un "isLoading: true" 
  // para evitar que Next.js lance errores rojos de hidratación.
  const [miData, setMiData] = useState({
    valor1: 'default',
    valor2: 0,
    isLoading: true 
  });

  // ==========================================
  // PASO 2: EL MOTOR DE CARGA (El truco del instante)
  // ==========================================
  useEffect(() => {
    // A) LEER EL CACHÉ PRIMERO: 
    // Esto ocurre en el milisegundo 1. Leemos el disco duro del celular.
    const cached = localStorage.getItem('mi_clave_secreta_unica');
    if (cached) {
      // Si hay datos, los dibujamos al instante y quitamos el isLoading
      setMiData({ ...JSON.parse(cached), isLoading: false });
    }

    // B) LEER LA BASE DE DATOS DESPUÉS:
    // Esto ocurre "en la sombra". Le preguntamos al servidor si hay algo más nuevo.
    const cargarDesdeBD = async () => {
      try {
        const dataReal = await getMiDataBD(); 
        if (dataReal) {
          const datosFrescos = { ...dataReal, isLoading: false };
          
          // Actualizamos la pantalla con lo real
          setMiData(datosFrescos);
          
          // Actualizamos el caché para la próxima vez que abra la app
          localStorage.setItem('mi_clave_secreta_unica', JSON.stringify(datosFrescos));
        }
      } catch (error) {
        console.error("Error cargando de BD:", error);
      }
    };

    cargarDesdeBD();
  }, []); // <-- Aquí puedes poner dependencias como [isSignedIn] de Clerk

  // ==========================================
  // PASO 3: EL GUARDADO OPTIMISTA (La sensación de velocidad)
  // ==========================================
  const guardarNuevosDatos = (nuevosValores) => {
    
    // A) ACTUALIZAR PANTALLA Y CACHÉ AL INSTANTE (0 milisegundos)
    const dataActualizada = { ...nuevosValores, isLoading: false };
    setMiData(dataActualizada);
    localStorage.setItem('mi_clave_secreta_unica', JSON.stringify(dataActualizada));

    // B) ENVIAR A LA BASE DE DATOS EN SILENCIO (Sin bloquear la app)
    startTransition(async () => {
      try {
        await saveMiDataBD(nuevosValores);
      } catch (error) {
        console.error("Error guardando:", error);
      }
    });
  };

  return { miData, guardarNuevosDatos, isSaving: isPending };
}