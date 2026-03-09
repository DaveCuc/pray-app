
import ThemeSelector from "./_components/ThemeSelector";
import TimerPreferences from "./_components/TimerPreferences";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import RestartSection from "./_components/Restart";
import BiblePreferences from "./_components/BiblePreferences";

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-background p-6 pb-24">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <Link
                        href="/perfil"
                        className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors md:hidden"
                        aria-label="Volver a perfil"
                    >
                        <ArrowLeft size={30} />
                    </Link>
                    <div className="flex-1 md:flex-none">
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground text-center">Ajustes</h1>
                    </div>
                    <div className="w-10 md:hidden"></div>
                </div>

                <hr />
                <ThemeSelector />
                <hr />
                <TimerPreferences />
                <hr />
                <BiblePreferences />
                <hr />
                <RestartSection />
                <hr />
            </div>
        </div>
    );
}

