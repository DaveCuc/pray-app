'use client';

import { RotateCcw } from 'lucide-react';
import { useLectura } from '@/hooks/useLectura';


const BiblePreferenceSection = () => {
    const { reiniciarLectura } = useLectura();

    const handleReiniciarLectura = () => {
        const confirmado = window.confirm('Estas seguro de reiniciar tus citas biblicas');
        if (confirmado) {
            reiniciarLectura();
        }
    };

    return (
        <section>
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <RotateCcw size={20} className="text-primary" />
                Progreso
            </h3>
            <section className="bg-card rounded-2xl px-4 py-5 shadow-sm border border-border text-foreground">

                <div className="flex items-center justify-between gap-3">
                    <div className="text-left">
                        <h4 className="font-bold text-foreground ">
                            Reiniciar lecturas
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1 pr-2">
                            Esto reiniciará tus lecturas biblicas, pero no eliminará tus estadísticas de oración.
                        </p>
                    </div>
                

                <button className="text-primary font-bold" onClick={handleReiniciarLectura} style={{ cursor: "pointer" }}>
                    REINICIAR
                    
                </button>
            </div>
        </section>
        </section >
    );
};

export default BiblePreferenceSection;