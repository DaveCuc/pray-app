"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, ArrowRight, Flame } from "lucide-react";
import Vela from "../../(main)/_components/Vela"; // Ajusta tu ruta si es necesario
import { usePrayer } from "@/app/_context/PrayerContext"; // 🔥 IMPORTAMOS NUESTRO CONTEXTO

const FASES = [
  { id: 1, nombre: "Acción de Gracias", duration: 1 },
  { id: 2, nombre: "Alabanza", duration: 20 },
  { id: 3, nombre: "Espíritu Santo", duration: 20 },
];

interface RelojProps {
  onFinish?: () => void;
}

const Reloj = ({ onFinish }: RelojProps) => {
  // 1. EXTRAEMOS LOS DATOS DEL CACHÉ GLOBAL
  const { stats, avanzarEtapa, saveProgress } = usePrayer();

  // 2. SINCRONIZAMOS LA FASE VISUAL CON LA BASE DE DATOS
  // Math.min evita errores si el step llega a 3 (cuando ya terminó todo)
  const faseActual = Math.min(stats.currentStep, FASES.length - 1);
  const todoCompletado = stats.currentStep >= FASES.length;

  const [minutes, setMinutes] = useState(FASES[0].duration);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [faseInicializada, setFaseInicializada] = useState(-1);

  // Si ya terminó todo en el día, marcamos completado por defecto
  const [faseCompletada, setFaseCompletada] = useState(todoCompletado);

  // 3. ACTUALIZAR TIEMPO SI CAMBIA LA FASE DESDE AFUERA (Ej. al abrir la app)
  useEffect(() => {
    if (stats.isLoading) return;

    if (todoCompletado) {
      setFaseCompletada(true);
      return;
    }

    // Solo reiniciamos los minutos si estamos entrando a una fase NUEVA
    if (faseActual !== faseInicializada) {
      setMinutes(FASES[faseActual].duration);
      setSeconds(0);
      setFaseInicializada(faseActual);
    }
  }, [stats.isLoading, todoCompletado, faseActual, faseInicializada]);

  // 4. LÓGICA PRINCIPAL DEL CRONÓMETRO
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

      // 🔥 MAGIA DE LA RACHA: 
      // Si termina la PRIMERA etapa (Acción de gracias) y no tenía la vela encendida,
      // la encendemos y guardamos el día como completado.
      if (faseActual === 0 && !stats.completedToday) {
        saveProgress();
      }

      if (onFinish) onFinish();
    }

    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds, faseActual, stats.completedToday, saveProgress, onFinish]);

  // Pausar si el usuario cambia de pestaña
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRunning) {
        setIsRunning(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isRunning]);

  const togglePlayPause = () => setIsRunning(!isRunning);

  // 5. FUNCIÓN PARA CONTINUAR (AHORA GUARDA EN BD)
  const handleContinuar = () => {
    if (faseActual < FASES.length - 1) {
      avanzarEtapa(); // Llama a tu Backend y sube al paso 1 o 2
      setFaseCompletada(false);
      // setIsRunning(true); // Descomenta esto si quieres que el siguiente paso inicie solo
    } else {
      avanzarEtapa(); // Marca la etapa final para que llegue a 3 y quede en "todoCompletado"
      setFaseCompletada(true);
    }
  };

  const formatTime = () => `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const totalTimeSeconds = FASES[faseActual].duration * 60;
  const currentTimeSeconds = minutes * 60 + seconds;
  const progressPercentage = ((totalTimeSeconds - currentTimeSeconds) / totalTimeSeconds) * 100;

  // La vela se enciende si ya guardó progreso hoy (por otro dispositivo) o si completó la fase local
  const velaEncendida = stats.completedToday || faseCompletada;

  // MIENTRAS CARGA EL CACHÉ, MOSTRAMOS UN SKELETON (Para evitar salto visual)
  if (stats.isLoading) {
    return <div className="animate-pulse w-72 h-72 rounded-full bg-border/20 mx-auto mt-12"></div>;
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 relative">

      {/* PÍLDORAS INDICADORAS DE FASE */}
      <div className="flex gap-2 mb-10 z-10">
        {FASES.map((fase, i) => (
          <div
            key={fase.id}
            className={`h-2 transition-all duration-300 rounded-full ${i === faseActual && !todoCompletado
                ? "w-12 bg-primary drop-shadow-[0_0_5px_rgba(245,165,36,0.5)]"
                : i < faseActual || todoCompletado
                  ? "w-8 bg-primary/40"
                  : "w-8 bg-border"
              }`}
          />
        ))}
      </div>

      {/* DISPLAY CIRCULAR */}
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

        {/* FONDO OSCURO DIFUMINADO */}
        <motion.div
          animate={{ opacity: faseCompletada ? 0 : 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
        >
          <div className="w-48 h-48 bg-background/80 rounded-full blur-2xl"></div>
        </motion.div>

        {/* CÍRCULO SVG */}
        {!todoCompletado && (
          <svg className="absolute inset-0 w-full h-full transform -rotate-90 z-20 pointer-events-none" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="3" className="text-border" />
            <circle
              cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="5"
              strokeDasharray={`${2 * Math.PI * 90}`}
              strokeDashoffset={`${2 * Math.PI * 90 * (1 - progressPercentage / 100)}`}
              className="text-primary drop-shadow-[0_0_10px_rgba(245,165,36,0.4)] transition-all duration-1000"
            />
          </svg>
        )}

        {/* TEXTO DEL TIEMPO */}
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

      {/* CONTROLES (PLAY, PAUSA, SIGUIENTE) */}
      <div className="flex flex-col items-center gap-6 z-10">
        {!faseCompletada && !todoCompletado ? (
          // BOTÓN PLAY / PAUSE
          <div className="flex gap-6">
            <button
              onClick={togglePlayPause}
              className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-all shadow-[0_0_40px_rgba(245,165,36,0.3)] hover:shadow-[0_0_60px_rgba(245,165,36,0.5)] hover:scale-105"
            >
              {isRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} className="ml-1" fill="currentColor" />}
            </button>
          </div>
        ) : (
          // ESTADOS DE FINALIZACIÓN
          faseActual < FASES.length - 1 && !todoCompletado ? (
            // BOTÓN SIGUIENTE FASE
            <button
              onClick={handleContinuar}
              className="flex items-center gap-2 px-10 py-4 rounded-full bg-primary text-primary-foreground font-bold transition-all shadow-[0_0_40px_rgba(245,165,36,0.3)] hover:shadow-[0_0_60px_rgba(245,165,36,0.5)] hover:scale-105"
            >
              Siguiente Fase <ArrowRight size={20} />
            </button>
          ) : (
            // MENSAJE FINAL (COMPLETÓ LAS 3 FASES)
            <div className="flex flex-col items-center gap-3 px-8 py-5 rounded-3xl bg-card border border-primary/30 shadow-[0_0_30px_rgba(245,165,36,0.2)] mt-4">
              <Flame size={40} className="text-primary animate-pulse" />
              <div className="text-xl font-bold text-primary text-center">¡Ciclo Completado!</div>
              <div className="text-sm text-muted-foreground text-center">Has terminado todas las fases de hoy.</div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Reloj;