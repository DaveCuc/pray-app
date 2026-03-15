'use client';

import { useState, useEffect } from "react";
import { Play, Pause, Flame, ArrowRight, CheckCircle2 } from "lucide-react";
import { usePrayer } from "@/app/_context/PrayerContext";
import { useReading } from "@/app/_context/ReadingContext";
import { useRouter } from "next/navigation";

import VelaOnOff from "./VelaOnOff";
import IndicadoresFases from "./IndicadoresFases";
import Reloj from "./Reloj";

const FASES_BASE = [
  { id: 1, nombre: "Acción de Gracias", duration: 20 },
  { id: 2, nombre: "Alabanza", duration: 20 },
  { id: 3, nombre: "Espíritu Santo", duration: 20 },
];

interface RelojSectionProps {
  onCicloTerminado?: () => void;
}

export default function RelojSection({ onCicloTerminado }: RelojSectionProps) {
  const router = useRouter();

  // Solo necesitamos saveProgress del contexto para el FINAL
  const { stats, saveProgress } = usePrayer();
  const { avanzarLecturaLocal, guardarLecturaDB } = useReading();

  // ESTADOS DEL PADRE
  const [fasesActivas, setFasesActivas] = useState(FASES_BASE);
  const [modoZen, setModoZen] = useState(false);

  // 🔥 ESTADO LOCAL DE LA SESIÓN (Reemplaza a la base de datos)
  const [faseActual, setFaseActual] = useState(0);

  const [minutes, setMinutes] = useState(20);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [faseCompletadaLocal, setFaseCompletadaLocal] = useState(false);
  const [autoIniciado, setAutoIniciado] = useState(false);
  const [faseInicializada, setFaseInicializada] = useState(-1);

  // 1. CARGAR PREFERENCIAS Y CACHÉ LOCAL DE LA SESIÓN
  useEffect(() => {
    // A) ¿Cuántas fases eligió?
    const guardadoPref = localStorage.getItem('oratio_tiempo_pref');
    const tiempoElegido = guardadoPref ? Number(guardadoPref) : 60;
    const numeroDeFases = Math.max(1, tiempoElegido / 20);
    setFasesActivas(FASES_BASE.slice(0, numeroDeFases));

    // B) ¿Se quedó a la mitad de una sesión hoy mismo?
    const pasoGuardado = localStorage.getItem('oratio_session_step');
    if (pasoGuardado) {
      setFaseActual(Number(pasoGuardado));
    }
  }, []);

  const todoCompletado = faseActual >= fasesActivas.length;

  // 2. PROTECCIÓN CONTRA CIERRE DE PESTAÑA (Caché + Advertencia)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Si el reloj está corriendo o ya avanzó de fase, advertimos antes de cerrar
      if (isRunning || faseActual > 0) {
        e.preventDefault();
        e.returnValue = ''; // Esto lanza el mensaje nativo del navegador de "¿Seguro que quieres salir?"
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isRunning, faseActual]);

  // 3. AUTO-INICIO AL ABRIR
  useEffect(() => {
    if (!stats.isLoading && !autoIniciado && !todoCompletado && !faseCompletadaLocal) {
      setIsRunning(true);
      setAutoIniciado(true);
    }
  }, [stats.isLoading, autoIniciado, todoCompletado, faseCompletadaLocal]);

  // 4. INICIALIZAR TIEMPOS DE CADA FASE
  useEffect(() => {
    if (stats.isLoading || todoCompletado) return;
    if (faseActual !== faseInicializada) {
      setMinutes(fasesActivas[faseActual]?.duration || 20);
      setSeconds(0);
      setFaseInicializada(faseActual);
      setFaseCompletadaLocal(false);
    }
  }, [stats.isLoading, todoCompletado, faseActual, faseInicializada, fasesActivas]);

  // 5. MOTOR DEL TIEMPO
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
      // El tiempo llegó a cero
      setIsRunning(false);
      setModoZen(false);
      avanzarLecturaLocal();

      const esUltimaFase = faseActual === fasesActivas.length - 1;

      if (esUltimaFase) {
        const faseFinal = faseActual + 1;
        localStorage.setItem('oratio_session_step', faseFinal.toString());
        setFaseActual(faseFinal);

        if (onCicloTerminado) onCicloTerminado();
      } else {
        setFaseCompletadaLocal(true);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds, faseActual, fasesActivas.length, avanzarLecturaLocal, onCicloTerminado]);

  // 6. PAUSAR AL CAMBIAR DE PESTAÑA
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRunning) setIsRunning(false);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isRunning]);

  // --- ACCIONES ---

  const toggleZen = () => setModoZen(!modoZen);
  const togglePlayPause = () => setIsRunning(!isRunning);

  const handleContinuarFase = () => {
    const siguienteFase = faseActual + 1;

    // Guardamos en caché local para que sobreviva a un refresh accidental F5
    localStorage.setItem('oratio_session_step', siguienteFase.toString());
    setFaseActual(siguienteFase);

    if (siguienteFase < fasesActivas.length) {
      setMinutes(fasesActivas[siguienteFase].duration);
      setSeconds(0);
      setFaseInicializada(siguienteFase);
    }

    setFaseCompletadaLocal(false);
    setIsRunning(true);
  };

  // 🔥 EL ÚNICO MOMENTO DONDE HABLAMOS CON LA BASE DE DATOS 🔥
  const handleFinalizarSesion = () => {
    // 1. Guardado en la base de datos (racha y lecturas)
    saveProgress();

    void guardarLecturaDB();

    // 2. Limpiamos cachés para mañana
    localStorage.removeItem('oratio_session_step');
    localStorage.removeItem('oratio_lectura_local');

    // 3. Vamos a la página de victoria
    router.push('/sesion/finish');
  };

  const totalTimeSeconds = (fasesActivas[faseActual]?.duration || 20) * 60;
  const currentTimeSeconds = minutes * 60 + seconds;
  const progressPercentage = ((totalTimeSeconds - currentTimeSeconds) / totalTimeSeconds) * 100;
  const velaEncendida = stats.completedToday || faseCompletadaLocal || todoCompletado;

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[400px] relative">

      {/* SECCIÓN 1: VELA (Animación fluida de 1 segundo) */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out ${modoZen ? "scale-150 z-50 cursor-pointer" : "scale-125 z-0"
          }`}
        onClick={modoZen ? toggleZen : undefined}
      >
        <div className={`absolute inset-0 bg-black/40 rounded-full blur-3xl transition-opacity duration-1000 ease-in-out ${modoZen ? "opacity-100" : "opacity-0"}`} />
        <VelaOnOff forceLit={modoZen} />
      </div>

      {/* SECCIÓN 2: INTERFAZ COMPLETA (Con Delay en secuencia) */}
      <div
        className={`w-full flex flex-col items-center z-10 transition-all duration-1000 ease-in-out ${modoZen
            ? "opacity-0 pointer-events-none scale-95 delay-0"
            : "opacity-100 scale-100 delay-[800ms]"
          }`}
      >

        {/* INDICADORES */}
        <IndicadoresFases
          fases={fasesActivas}
          faseActual={faseActual}
          todoCompletado={todoCompletado}
        />

        {/* RELOJ O MENSAJE FINAL */}
        {!todoCompletado ? (
          <Reloj
            minutes={minutes}
            seconds={seconds}
            faseNombre={fasesActivas[faseActual]?.nombre || ""}
            progressPercentage={progressPercentage}
            velaEncendida={stats.completedToday}
            modoZen={false}
            onToggleZen={toggleZen}
          />
        ) : (
          <div className="mb-12 z-10 flex flex-col items-center gap-3 px-8 py-5 rounded-3xl bg-card border border-primary/30 mt-4 shadow-lg backdrop-blur-md">
            <Flame size={40} className="text-primary animate-pulse" />
            <div className="text-xl font-bold text-primary text-center">¡Sesión Terminada!</div>
          </div>
        )}

        {/* CONTROLES DE BOTONES */}
        <div className="h-20 flex items-center justify-center mt-4">
          {!todoCompletado && !faseCompletadaLocal && (
            <button
              onClick={togglePlayPause}
              className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition-all shadow-[0_0_40px_rgba(245,165,36,0.3)]"
            >
              {isRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} className="ml-1" fill="currentColor" />}
            </button>
          )}

          {!todoCompletado && faseCompletadaLocal && (
            <button
              onClick={handleContinuarFase}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold hover:scale-105 transition-all shadow-[0_0_40px_rgba(245,165,36,0.3)]"
            >
              Continuar <ArrowRight size={20} />
            </button>
          )}

          {todoCompletado && (
            <button
              onClick={handleFinalizarSesion}
              className="group relative flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground text-xl font-bold rounded-full shadow-[0_0_40px_rgba(245,165,36,0.3)] hover:shadow-[0_0_60px_rgba(245,165,36,0.5)] transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"            >
              <CheckCircle2 size={20} /> Finalizar Sesión
            </button>
          )}
        </div>

      </div>
    </div>
  );
}