import UserCard from './_components/UserCard';

import Link from 'next/link';

import { Settings } from 'lucide-react';
import Upcoming from '../../_components/Upcoming';
import Statistics from './_components/Statistics';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background p-6 pb-24">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="mt-4 flex items-center justify-between">
          <div className="w-10 md:hidden"></div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Perfil</h1>
          <Link
            href="/settings"
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors md:hidden"
            aria-label="Ir a ajustes"
          >
            <Settings size={30} />
          </Link>
        </div>
        <hr />
        <UserCard />
        <Statistics />
        <hr />
        <Upcoming />
      </div>
    </div>
  );
}