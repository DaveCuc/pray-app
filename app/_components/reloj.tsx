"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, ArrowRight, Flame } from "lucide-react";
import Vela from "./vela";

const FASES = [
  { id: 1, nombre: "Acción de Gracias", duration: 20 },
  { id: 2, nombre: "Alabanza", duration: 20 },
  { id: 3, nombre: "Espíritu Santo", duration: 20 },
];

interface RelojProps {
  onFinish?: () => void;
  yaOramosHoy?: boolean;
}

const Reloj = ({ onFinish, yaOramosHoy = false }: RelojProps) => {
  const [faseActual, setFaseActual] = useState(0);
  const [minutes, setMinutes] = useState(FASES[0].duration);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [faseCompletada, setFaseCompletada] = useState(false);

  const velaEncendida = yaOramosHoy || faseCompletada;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsRunning(false);
          } else {
            setMinutes((prev) => prev - 1);
            setSeconds(59);
          }
        } else {
          setSeconds((prev) => prev - 1);
        }
      }, 1000);
    } else if (minutes === 0 && seconds === 0 && isRunning) {
      setIsRunning(false);
      setFaseCompletada(true);
      if (onFinish) onFinish();
    }

    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds, onFinish]);

  const togglePlayPause = () => setIsRunning(!isRunning);

  const handleReset = () => {
    setIsRunning(false);
    setMinutes(FASES[faseActual].duration);
    setSeconds(0);
    setFaseCompletada(false);
  };

  const handleContinuar = () => {
    if (faseActual < 2) {
      const nuevaFase = faseActual + 1;
      setFaseActual(nuevaFase);
      setMinutes(FASES[nuevaFase].duration);
      setSeconds(0);
      setFaseCompletada(false);
      setIsRunning(true);
    }
  };

  const formatTime = () => {
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const totalTimeSeconds = FASES[faseActual].duration * 60;
  const currentTimeSeconds = minutes * 60 + seconds;
  const progressPercentage = ((totalTimeSeconds - currentTimeSeconds) / totalTimeSeconds) * 100;

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 relative">
      
      {/* Píldoras indicadoras de fase */}
      <div className="flex gap-2 mb-10 z-10">
        {FASES.map((fase, i) => (
          <div
            key={fase.id}
            className={`h-2 transition-all duration-300 rounded-full ${
              i === faseActual
                ? "w-12 bg-primary drop-shadow-[0_0_5px_rgba(245,165,36,0.5)]"
                : i < faseActual
                ? "w-8 bg-primary/40"
                : "w-8 bg-border"
            }`}
          />
        ))}
      </div>

      {/* Display circular */}
      <div className="relative mb-12 w-72 h-72 flex items-center justify-center rounded-full overflow-hidden">
        
        {/* COMPONENTE VELA */}
        <AnimatePresence>
          {velaEncendida && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 flex items-end justify-center z-0"
            >
              <Vela /> 
            </motion.div>
          )}
        </AnimatePresence>

        {/* FONDO OSCURO DIFUMINADO (Se desvanece al completar la fase) */}
        <motion.div 
          animate={{ opacity: faseCompletada ? 0 : 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
        >
          <div className="w-48 h-48 bg-background/80 rounded-full blur-2xl"></div>
        </motion.div>

        {/* Círculo SVG */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90 z-20 pointer-events-none" viewBox="0 0 200 200">
          <circle
            cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="3"
            className="text-border"
          />
          <circle
            cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="5"
            strokeDasharray={`${2 * Math.PI * 90}`}
            strokeDashoffset={`${2 * Math.PI * 90 * (1 - progressPercentage / 100)}`}
            className="text-primary drop-shadow-[0_0_10px_rgba(245,165,36,0.4)] transition-all duration-1000"
          />
        </svg>

        {/* TEXTO DEL TIEMPO (Se desvanece al completar la fase) */}
        <motion.div 
          animate={{ opacity: faseCompletada ? 0 : 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="text-center z-30 mt-4"
        >
          <div className="text-7xl font-extrabold text-foreground font-mono tracking-tight drop-shadow-md">
            {formatTime()}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-widest mt-2 font-medium drop-shadow-sm">
            {FASES[faseActual].nombre}
          </div>
        </motion.div>
      </div>

      {/* Controles */}
      <div className="flex flex-col items-center gap-6 z-10">
        {!faseCompletada ? (
          <div className="flex gap-6">
            <button
              onClick={togglePlayPause}
              className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-all shadow-lg hover:bg-oratio-gold-hover hover:scale-105"
              style={{ cursor: "pointer" }}
            >
              {isRunning ? (
                <Pause size={32} fill="currentColor" />
              ) : (
                <Play size={32} className="ml-1" fill="currentColor" />
              )}
            </button>
            
          </div>
        ) : (
          faseActual < 2 ? (
            <button
              onClick={handleContinuar}
              className="flex items-center gap-2 px-10 py-4 rounded-full bg-primary text-primary-foreground font-bold transition-all shadow-lg animate-pulse hover:bg-oratio-gold-hover"
            >
              Siguiente Fase <ArrowRight size={20} />
            </button>
          ) : (
            <div className="flex flex-col items-center gap-3 px-8 py-5 rounded-3xl bg-card border border-primary/30 shadow-[0_0_30px_rgba(245,165,36,0.2)]">
              <Flame size={40} className="text-primary animate-pulse" />
              <div className="text-xl font-bold text-primary">¡Oración Completada!</div>
              <div className="text-sm text-muted-foreground">Racha de hoy guardada.</div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Reloj;