'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useReading } from '@/app/_context/ReadingContext';
import Alert from '@/app/_components/Alert';


const RestartSection = () => {
    const { reiniciarLectura, isSaving } = useReading();
    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    const mensajeReinicio = '¿Estás seguro de reiniciar tus lecturas bíblicas? Esto volverá a Mateo 1.';

    const ejecutarAccion = () => {
        reiniciarLectura();
    };

    const handleReiniciarLectura = () => {
        setMostrarAlerta(true);
    };

    return (
        <section>
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <RotateCcw size={20} className="text-primary" />
                Reiniciar
            </h3>
            <section className="bg-card rounded-2xl px-4 py-5 shadow-sm border border-border text-foreground">

                <div className="flex items-center justify-between gap-3">
                    <div className="text-left">
                        <h4 className="font-bold text-foreground ">
                            Reiniciar lecturas
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1 pr-2">
                            Esto reiniciará tus lecturas bíblicas a Mateo 1, pero no eliminará tus estadísticas de oración.
                        </p>
                    </div>
                

                <button className="text-primary font-bold disabled:opacity-50" onClick={handleReiniciarLectura} disabled={isSaving} style={{ cursor: "pointer" }}>
                    REINICIAR
                    
                </button>
            </div>

            <Alert
                isOpen={mostrarAlerta}
                onClose={() => setMostrarAlerta(false)}
                onConfirm={ejecutarAccion}
                titulo="¿Estás seguro?"
                mensaje={mensajeReinicio}
                tipo="peligro"
                textoConfirmar="Confirmar"
                textoCancelar="Cancelar"
            />
        </section>
        </section >
    );
};

export default RestartSection;