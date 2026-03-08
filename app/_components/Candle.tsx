interface CandleIcoProps {
    isActive: boolean;
}

const CandleIco = ({ isActive }: CandleIcoProps) => {
    const src = isActive ? '/candle-fire.svg' : '/candle-nfire.svg';

    return <img src={src} alt="Candle" className="w-6 h-6" />;
};

export default CandleIco;