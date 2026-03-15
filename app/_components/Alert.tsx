'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, Info } from 'lucide-react';
import Vela from '../(main)/_components/Vela';
import CandleOff from './CandleOff';

interface AlertProps {
  isOpen: boolean;
  onClose: () => void; // Acción para cancelar/cerrar la alerta (Continuar)
  titulo?: string; // Ahora es opcional
  mensaje: string;
  onConfirm?: () => void; // Acción principal (Ej: Salir)
  textoConfirmar?: string;
  textoCancelar?: string;
  tipo?: 'peligro' | 'info' | 'exito' | 'funny'; // 🔥 Agregamos el estilo 'funny'
  customIcon?: React.ReactNode; // 🔥 Para recibir tu <CandleOff />
}

export default function Alert({
  isOpen,
  onClose,
  titulo,
  mensaje,
  onConfirm,
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  tipo = 'info',
  customIcon
}: AlertProps) {
  
  // Configuramos colores e íconos dinámicos según el tipo de alerta
  const config = {
    peligro: {
      colorTexto: 'text-destructive',
      colorFondo: 'bg-destructive/10',
      colorBotonConfirmar: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-sm',
      colorBotonCancelar: 'bg-muted hover:bg-muted/80 text-foreground',
      icono: <AlertCircle size={32} />
    },
    info: {
      colorTexto: 'text-primary',
      colorFondo: 'bg-primary/10',
      colorBotonConfirmar: 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm',
      colorBotonCancelar: 'bg-muted hover:bg-muted/80 text-foreground',
      icono: <Info size={32} />
    },
    exito: {
      colorTexto: 'text-green-500',
      colorFondo: 'bg-green-500/10',
      colorBotonConfirmar: 'bg-green-500 hover:bg-green-600 text-white shadow-sm',
      colorBotonCancelar: 'bg-muted hover:bg-muted/80 text-foreground',
      icono: <Info size={32} />
    },
    // 🔥 EL NUEVO ESTILO FUNNY
    funny: {
      colorTexto: 'text-foreground',
      colorFondo: 'bg-transparent',
      // El botón de "Cancelar" (Continuar Oración) será el principal y llamativo
      colorBotonCancelar: 'bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest shadow-[0_4px_0_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none transition-all',
      // El botón de "Confirmar" (Terminar Sesión) será un texto naranja oscuro
      colorBotonConfirmar: 'bg-transparent text-[#d97706] hover:bg-orange-50 uppercase tracking-widest transition-colors',
      icono: <CandleOff size={100} /> // Aquí puedes usar tu ícono personalizado de vela
    }
  };

  const estiloActual = config[tipo];
  const isFunny = tipo === 'funny';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
            className={`relative w-full max-w-sm bg-card border border-border rounded-3xl shadow-2xl z-10 overflow-hidden ${isFunny ? 'p-8' : 'p-6'}`}
          >
            {/* Solo mostramos la X si no es estilo Funny */}
            {!isFunny && (
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            )}

            {/* Ícono y Textos */}
            <div className={`flex flex-col items-center text-center ${isFunny ? 'mb-8' : 'mt-2 mb-6'}`}>
              
              <div className={isFunny ? 'mb-6' : `w-16 h-16 rounded-full flex items-center justify-center mb-4 ${estiloActual.colorFondo} ${estiloActual.colorTexto}`}>
                {estiloActual.icono}
              </div>
              
              {titulo && (
                <h3 className="text-xl font-extrabold text-foreground mb-3">
                  {titulo}
                </h3>
              )}
              
              <p className={`${isFunny ? 'text-lg font-bold text-foreground/80' : 'text-muted-foreground text-sm px-2'}`}>
                {mensaje}
              </p>
            </div>

            {/* Botones */}
            <div className={`w-full flex ${isFunny ? 'flex-col gap-4' : 'flex-row gap-3'}`}>
              
              {/* BOTÓN PRINCIPAL (En Funny es "Continuar", en normales es "Cancelar") */}
              {onConfirm && (
                <button
                  onClick={onClose}
                  className={`flex-1 py-4 px-4 rounded-2xl font-bold ${estiloActual.colorBotonCancelar}`}
                >
                  {textoCancelar}
                </button>
              )}
              
              {/* BOTÓN SECUNDARIO / ENLACE (En Funny es "Terminar Sesión", en normales es "Aceptar") */}
              <button
                onClick={() => {
                  if (onConfirm) onConfirm();
                  onClose();
                }}
                className={`flex-1 py-4 px-4 rounded-2xl font-bold ${estiloActual.colorBotonConfirmar}`}
              >
                {onConfirm ? textoConfirmar : "Entendido"}
              </button>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}