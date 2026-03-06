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
    <nav className="fixed bottom-0 left-0 w-full bg-white/70 dark:bg-black/70 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 z-50">
      <div className="flex justify-around items-center h-20 px-2 pb-4 pt-2">
        {TABS.map((tab) => {
          const isActive = pathname === tab.path;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.path}
              href={tab.path}
              className="relative flex flex-col items-center justify-center w-16 h-12"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 bg-yellow-500/20 dark:bg-yellow-500/10 rounded-2xl"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon
                className={`w-6 h-6 z-10 transition-colors ${
                  isActive ? 'text-yellow-600 dark:text-yellow-500' : 'text-gray-500 dark:text-gray-400'
                }`}
              />
              <span className={`text-[10px] mt-1 z-10 font-medium ${
                isActive ? 'text-yellow-600 dark:text-yellow-500' : 'text-gray-500 dark:text-gray-400'
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