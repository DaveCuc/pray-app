import UserCard from './_components/UserCard';
import TimerPreferences from './_components//TimerPreferences';
import ThemeSelector from './_components/ThemeSelector';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background p-6 space-y-8 pb-24">
      <header className="mt-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Perfil
        </h1>
      </header>

      <UserCard />
      <ThemeSelector />
      <TimerPreferences />
    </div>
  );
}