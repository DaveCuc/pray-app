'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Music, Settings, User } from 'lucide-react';

const TABS = [
  { name: 'Inicio', path: '/', icon: Home },
  { name: 'Música', path: '/musica', icon: Music },
  { name: 'Perfil', path: '/perfil', icon: User },
  { name: 'Ajustes', path: '/settings', icon: Settings },
];

export default function LeftNav() {
  const pathname = usePathname();

  return (
    <aside className="h-full p-4">
      <nav className="sticky top-20">
        <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm">
        {TABS.map((tab) => {
          const isActive = pathname === tab.path;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.path}
              href={tab.path}
              className={`relative flex items-center gap-3 h-14 w-full rounded-xl px-3 border transition-colors ${
                isActive
                  ? 'bg-orange-500/10 border-orange-500/40'
                  : 'border-transparent hover:bg-muted/40'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              />
              <span className={`text-sm font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {tab.name}
              </span>
            </Link>
          );
        })}
        </div>
      </nav>
    </aside>
  );
}