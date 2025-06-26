
interface ShockwaveEffectProps {
  show: boolean;
}

export const ShockwaveEffect = ({ show }: ShockwaveEffectProps) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={`shockwave-${i}`}
          className="absolute border-4 border-orange-400 rounded-full animate-ping opacity-30"
          style={{
            width: `${(i + 1) * 200}px`,
            height: `${(i + 1) * 200}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            animationDelay: `${i * 0.2}s`,
            animationDuration: '2s',
          }}
        />
      ))}
    </div>
  );
};
