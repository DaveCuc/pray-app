'use client';


import { User } from 'lucide-react';

export default function UserCard() {
  

  return (
    <section className="bg-card rounded-3xl p-6 shadow-sm border border-border text-foreground">
      <div className="flex items-center gap-4 ">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border-2 border-primary">
          <User size={32} className="text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Mi Perfil</h2>
          <p className="text-sm text-muted-foreground">Discipulo en oracion</p>
        </div>
      </div>
    </section>
  );
}