import SwipeWrapper from './_components/SwipeWrapper';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <SwipeWrapper>
      {/* Aquí le puedes agregar la animación de "deslizamiento" visual con Framer Motion si lo deseas después */}
      {children}
    </SwipeWrapper>
  );
}