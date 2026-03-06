"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, ArrowRight } from "lucide-react";

// Definición de las 3 fases
const FASES = [
    { id: 1, nombre: "Acción de Gracias", duration: 20 }, // En minutos
    { id: 2, nombre: "Alabanza", duration: 20 },
    { id: 3, nombre: "Espíritu Santo", duration: 20 },
];

interface RelojProps {
    onFinish?: () => void; // Prop opcional para guardar la racha
}

const Reloj = ({ onFinish }: RelojProps) => {
    const [faseActual, setFaseActual] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(2);
    const [isRunning, setIsRunning] = useState(false);
    const [faseCompletada, setFaseCompletada] = useState(false);

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
            // Cuando el temporizador llega a 0
            setIsRunning(false);
            setFaseCompletada(true);
            if (onFinish) onFinish(); // Guardar racha al terminar
        }

        return () => clearInterval(interval);
    }, [isRunning, minutes, seconds, onFinish]);

    const togglePlayPause = () => setIsRunning(!isRunning);

    const handleReset = () => {
        setIsRunning(false);
        setMinutes(0);
        setSeconds(2);
        setFaseCompletada(false);
    };

    const handleContinuar = () => {
        if (faseActual < 2) {
            const nuevaFase = faseActual + 1;
            setFaseActual(nuevaFase);
            setMinutes(0);
            setSeconds(2);
            setFaseCompletada(false);
            setIsRunning(true);
        }
    };

    const formatTime = () => {
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    const totalTimeSeconds = 2;
    const currentTimeSeconds = minutes * 60 + seconds;
    const progressPercentage = ((totalTimeSeconds - currentTimeSeconds) / totalTimeSeconds) * 100;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 py-8">

            {/* Píldoras indicadoras de fase */}
            <div className="flex gap-2 mb-12">
                {FASES.map((fase, i) => (
                    <div
                        key={fase.id}
                        className={`h-2 transition-all duration-300 rounded-full ${i === faseActual
                            ? "w-12 bg-primary"
                            : i < faseActual
                                ? "w-8 bg-primary/60"
                                : "w-8 bg-muted"
                            }`}
                    />
                ))}
            </div>

            {/* Nombre de la fase actual */}
            {!faseCompletada && (
                <h2 className="text-2xl font-bold text-foreground mb-6">
                    {FASES[faseActual].nombre}
                </h2>
            )}

            {/* Display circular */}
            <div className="relative w-80 h-80 mb-16">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    {/* Círculo de fondo */}
                    <circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        className="text-border"
                    />
                    {/* Círculo de progreso dorado */}
                    <circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeDasharray={`${2 * Math.PI * 90}`}
                        strokeDashoffset={`${2 * Math.PI * 90 * (1 - progressPercentage / 100)}`}
                        className="text-primary drop-shadow-[0_0_15px_rgba(245,165,36,0.3)] transition-all duration-1000"
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-7xl font-bold text-foreground font-mono">
                            {formatTime()}
                        </div>
                        <div className="text-sm text-muted-foreground mt-2">
                            {FASES[faseActual].nombre}
                        </div>
                    </div>
                </div>
            </div>

            {/* Controles */}
            <div className="flex gap-6 mb-12">
                <button
                    onClick={togglePlayPause}
                    className="w-24 h-24 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                    {isRunning ? (
                        <Pause size={40} fill="currentColor" />
                    ) : (
                        <Play size={40} fill="currentColor" className="ml-1" />
                    )}
                </button>
                <button
                    onClick={handleReset}
                    className="w-24 h-24 rounded-full bg-muted hover:bg-muted/80 text-foreground flex items-center justify-center transition-all active:scale-95"
                >
                    <RotateCcw size={28} />
                </button>
            </div>

            {/* Botón Continuar */}
            {faseCompletada && faseActual < 2 && (
                <button
                    onClick={handleContinuar}
                    className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all"
                >
                    Continuar <ArrowRight size={20} />
                </button>
            )}

            {/* Mensaje final */}
            {faseCompletada && faseActual === 2 && (
                <div className="text-center">
                    <h3 className="text-3xl font-bold text-foreground">¡Racha completada!</h3>
                    <p className="text-muted-foreground mt-2">Has completado tu tiempo de oración.</p>
                </div>
            )}
        </div>
    );
};

export default Reloj;