import BiblePreferences from "./_components/BiblePreferences";
import ThemeSelector from "./_components/ThemeSelector";
import TimerPreferences from "./_components/TimerPreferences";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-background p-6 space-y-8 pb-24">
            <div className="flex items-center justify-between">
                <Link
                    href="/perfil"
                    className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors md:hidden"
                    aria-label="Volver a perfil"
                >
                    <ArrowLeft size={30} />
                </Link>
                <div>
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
        </div>
    );
}

