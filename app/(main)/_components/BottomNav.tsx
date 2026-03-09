'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Music, User } from 'lucide-react';

const TABS = [
  { name: 'Inicio', path: '/', icon: Home },
  { name: 'Música', path: '/musica', icon: Music },
  { name: 'Perfil', path: '/perfil', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-card border-t border-border z-50 md:hidden">
      <div className="flex justify-around items-center h-16 pb-safe">
        {TABS.map((tab) => {
          const isActive = pathname === tab.path;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.path}
              href={tab.path}
              className="relative flex flex-col items-center justify-center w-full h-full"
            >
              {/* Barra indicadora superior animada */}
              {isActive && (
                <motion.div
                  layoutId="nav-top-indicator"
                  className="absolute top-0 w-12 h-0.75 bg-primary rounded-b-md shadow-[0_1px_8px_rgba(245,165,36,0.6)]"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              
              <Icon
                className={`w-6 h-6 mb-1 transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              />
              <span className={`text-[10px] font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}