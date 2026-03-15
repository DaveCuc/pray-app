interface CandleOffProps {
  size?: number;
  className?: string;
}

const CandleOff = ({ size = 120, className = "" }: CandleOffProps) => {
  return (
    <img 
      src="/candle-off.svg" // 🔥 Nombre corregido apuntando a public/
      alt="Vela apagada" 
      width={size} 
      height={size} 
      className={`object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105 ${className}`} 
      style={{ width: size, height: size }} 
    />
  );
};

export default CandleOff;