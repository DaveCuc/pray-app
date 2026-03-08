export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark min-h-screen flex flex-col lg:flex-row items-center justify-center bg-background relative overflow-hidden">
      
      {/* Decoración de fondo difuminada */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Lado Izquierdo: Branding y Descripción */}
      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center p-8 lg:p-24 text-center lg:text-left z-10">
        
        {/* === LOGO Y TÍTULO ALINEADOS === */}
        <div className="flex flex-row items-center justify-center lg:justify-start gap-6 mb-12">
          
          {/* EL SVG ESTÁTICO (Vela) */}
          <div className="w-16 h-20 md:w-20 md:h-24 drop-shadow-[0_0_20px_rgba(245,165,36,0.6)] shrink-0">
            <img 
              src="/candle-fire.svg" 
              alt="Oratio Logo" 
              className="w-full h-full object-contain" 
            />
            
          </div> 

          {/* TÍTULO (A la derecha de la vela) */}
          <h1 className="text-6xl md:text-7xl font-extrabold text-foreground tracking-tight drop-shadow-sm">
            Oratio
          </h1>
        </div>
        
        {/* === TEXTO SECUNDARIO Y DESCRIPCIÓN (Abajo) === */}
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
          Tu altar digital personal
        </h2>
        <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
          Cultiva el hábito de la oración, mantén tu racha diaria y fortalece tu espíritu con una experiencia diseñada para la paz y la constancia.
        </p>
      </div>

      {/* Lado Derecho: Componente de Clerk */}
      <div className="w-full lg:w-1/2 flex justify-center p-8 z-10">
        {children}
      </div>
    </div>
  );
}