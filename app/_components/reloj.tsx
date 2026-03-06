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

    //original
    {/*const [minutes, setMinutes] = useState(FASES[0].duration);*/ }
    {/*const [seconds, setSeconds] = useState(0);*/ }
    //Pruueba
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
            if (onFinish) onFinish(); // Guardar racha al terminar 20 min
        }

        return () => clearInterval(interval);
    }, [isRunning, minutes, seconds, onFinish]);

    const togglePlayPause = () => setIsRunning(!isRunning);

    const handleReset = () => {
        setIsRunning(false);

        //original
        {/*setMinutes(FASES[faseActual].duration);}
        {setSeconds(0);*/}
        //Prueba
        setMinutes(0);
        setSeconds(2);

        setFaseCompletada(false);
    };

    const handleContinuar = () => {
        if (faseActual < 2) {
            const nuevaFase = faseActual + 1;
            setFaseActual(nuevaFase);

            //original

            {/*setMinutes(FASES[nuevaFase].duration);
            setSeconds(0);*/}

            //Prueba
            setMinutes(0);
            setSeconds(2);


            setFaseCompletada(false);
            setIsRunning(true);
        }
    };

    const formatTime = () => {
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    //original
    {/*const totalTimeSeconds = FASES[faseActual].duration * 60;*/}
    // prueba
    const totalTimeSeconds = 2;

    const currentTimeSeconds = minutes * 60 + seconds;
    const progressPercentage = ((totalTimeSeconds - currentTimeSeconds) / totalTimeSeconds) * 100;

    return (
        <div className="flex flex-col items-center justify-center px-4 py-8">

            {/* Píldoras indicadoras de fase */}
            <div className="flex gap-2 mb-8">
                {FASES.map((fase, i) => (
                    <div
                        key={fase.id}
                        className={`h-2 transition-all duration-300 rounded-full ${i === faseActual
                            ? "w-12 bg-yellow-400"
                            : i < faseActual
                                ? "w-8 bg-green-500"
                                : "w-8 bg-gray-300 dark:bg-gray-700"
                            }`}
                    />
                ))}
            </div>

            {/* Display circular */}
            <div className="relative mb-12 w-64 h-64">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    <circle
                        cx="100" cy="100" r="90" fill="none" stroke="#333333" strokeWidth="6"
                    />
                    <circle
                        cx="100" cy="100" r="90" fill="none" stroke="#f59e0b" strokeWidth="6"
                        strokeDasharray={`${2 * Math.PI * 90}`}
                        strokeDashoffset={`${2 * Math.PI * 90 * (1 - progressPercentage / 100)}`}
                        className="transition-all duration-1000"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl font-bold text-gray-900 dark:text-white font-mono">
                            {formatTime()}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">
                            {FASES[faseActual].nombre}
                        </div>
                    </div>
                </div>
            </div>

            {/* Controles */}
            <div className="flex gap-6 mb-4">
                {!faseCompletada ? (
                    <>
                        <button
                            onClick={togglePlayPause}
                            className="w-20 h-20 rounded-full bg-yellow-400 hover:bg-yellow-500 flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
                        >
                            {isRunning ? (
                                <Pause size={32} className="text-gray-900" fill="currentColor" />
                            ) : (
                                <Play size={32} className="text-gray-900 ml-1" fill="currentColor" />
                            )}
                        </button>
                        <button
                            onClick={handleReset}
                            className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 flex items-center justify-center transition-all"
                        >
                            <RotateCcw size={24} className="text-gray-700 dark:text-gray-300" />
                        </button>
                    </>
                ) : (
                    faseActual < 2 ? (
                        <button
                            onClick={handleContinuar}
                            className="flex items-center gap-2 px-8 py-4 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold transition-all shadow-lg animate-pulse"
                        >
                            Siguiente Fase <ArrowRight size={20} />
                        </button>
                    ) : (
                        <div className="px-8 py-4 rounded-full bg-yellow-400 text-gray-900 font-bold shadow-lg">
                            ¡Oración Completada!
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Reloj;