"use client";

import { useState } from "react";

const Attention = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) {
        return null;
    }

    return (
        <div className="w-full bg-yellow-300 text-yellow-950 border-y border-yellow-400">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-2 text-sm">
                <p className="leading-relaxed">
                    <span className="font-bold">Atencion:</span> Estas probando una app en desarrollo, por lo que es posible que encuentres errores o comportamientos inesperados. Si eso sucede, por favor reportalo a davecuc781@gmail.com para que pueda corregirlo. Gracias por tu ayuda.
                </p>

                <button
                    type="button"
                    onClick={() => setIsVisible(false)}
                    className="shrink-0 rounded px-2 py-1 font-bold hover:bg-yellow-400"
                    aria-label="Cerrar aviso"
                >
                    X
                </button>
            </div>
        </div>
    );
};

export default Attention;