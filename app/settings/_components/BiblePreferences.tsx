'use client';

import { BookOpen, Edit2, Check, X } from 'lucide-react';
import { useLectura } from '@/hooks/useLectura';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TOTAL_SALMOS = 150;

const LIBROS_INFO = {
  'Mateo': { capitulos: 28 },
  'Marcos': { capitulos: 16 },
  'Lucas': { capitulos: 24 },
  'Juan': { capitulos: 21 },
};

const BiblePreferences = () => {
    const { lecturaActual, ajustarLectura, isLoaded, isSaving } = useLectura();
    const [modoEdicion, setModoEdicion] = useState(false);
    const [libroSeleccionado, setLibroSeleccionado] = useState<keyof typeof LIBROS_INFO>('Mateo');
    const [capituloSeleccionado, setCapituloSeleccionado] = useState(1);
    const [salmoSeleccionado, setSalmoSeleccionado] = useState(1);

    // Sincronizar selectores con la lectura guardada en BD
    useEffect(() => {
        if (!isLoaded) return;

        setLibroSeleccionado(lecturaActual.libro as keyof typeof LIBROS_INFO);
        setCapituloSeleccionado(lecturaActual.capitulo);
        setSalmoSeleccionado(lecturaActual.salmo);
    }, [lecturaActual, isLoaded]);

    const handleAjustarLectura = () => {
        ajustarLectura(libroSeleccionado, capituloSeleccionado, salmoSeleccionado);
        setModoEdicion(false);
    };

    const handleCancelar = () => {
        // Restaurar valores originales
        setLibroSeleccionado(lecturaActual.libro as keyof typeof LIBROS_INFO);
        setCapituloSeleccionado(lecturaActual.capitulo);
        setSalmoSeleccionado(lecturaActual.salmo);
        setModoEdicion(false);
    };

    if (!isLoaded) return null;

    return (
        <section>
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-primary" />
                Ajustar preferencias de lectura
            </h3>
            <section className="bg-card rounded-2xl px-4 py-5 shadow-sm border border-border text-foreground">
                
                {!modoEdicion ? (
                    /* Vista de solo lectura */
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary/10 rounded-xl">
                                    <BookOpen size={20} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Evangelio</p>
                                    <p className="text-xl font-bold text-foreground">
                                        {lecturaActual.libro} <span className="text-primary">{lecturaActual.capitulo}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary/10 rounded-xl">
                                    <BookOpen size={20} className="text-primary" />
                                </div>
                                <div>
                                    
                                    <p className="text-xl font-bold text-foreground">
                                        Salmo <span className="text-primary">{lecturaActual.salmo}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setModoEdicion(true)}
                            className="p-3 hover:bg-primary/10 rounded-xl transition-colors text-primary"
                            aria-label="Editar lecturas"
                        >
                            <Edit2 size={24} />
                        </button>
                    </div>
                ) : (
                    /* Vista de edición */
                    <div className="space-y-4">
                        {/* Selector de Evangelio */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Evangelio
                            </label>
                            <div className="flex gap-3">
                                <Select
                                    value={libroSeleccionado}
                                    onValueChange={(value) => {
                                        setLibroSeleccionado(value as keyof typeof LIBROS_INFO);
                                        setCapituloSeleccionado(1);
                                    }}
                                >
                                    <SelectTrigger className="flex-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Mateo">Mateo</SelectItem>
                                        <SelectItem value="Marcos">Marcos</SelectItem>
                                        <SelectItem value="Lucas">Lucas</SelectItem>
                                        <SelectItem value="Juan">Juan</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={capituloSeleccionado.toString()}
                                    onValueChange={(value) => setCapituloSeleccionado(Number(value))}
                                >
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: LIBROS_INFO[libroSeleccionado].capitulos }, (_, i) => (
                                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                                                Cap. {i + 1}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Salmo
                            </label>
                            <Select
                                value={salmoSeleccionado.toString()}
                                onValueChange={(value) => setSalmoSeleccionado(Number(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: TOTAL_SALMOS }, (_, i) => (
                                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                                            Salmo {i + 1}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button 
                                onClick={handleCancelar}
                                className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground"
                                aria-label="Cancelar"
                            >
                                <X size={24} />
                            </button>
                            <button 
                                onClick={handleAjustarLectura}
                                disabled={isSaving}
                                className="p-2 hover:bg-primary/10 rounded-xl transition-colors text-primary disabled:opacity-50"
                                aria-label="Aplicar cambios"
                            >
                                <Check size={24} />
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </section>
    );
};

export default BiblePreferences;