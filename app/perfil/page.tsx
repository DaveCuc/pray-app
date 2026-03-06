import UserCard from './_components/UserCard';
import TimerPreferences from './_components/TimerPreferences';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 p-6 space-y-8 pb-24">
      
      {/* Header (Opcional, para consistencia visual con Música) */}
      <header className="mt-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Ajustes
        </h1>
      </header>

      {/* Componentes */}
      <UserCard />
      <TimerPreferences />

    </div>
  );
}