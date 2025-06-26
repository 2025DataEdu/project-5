
interface FireworksEffectProps {
  show: boolean;
}

export const FireworksEffect = ({ show }: FireworksEffectProps) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={`firework-${i}`}
          className="absolute"
          style={{
            left: `${20 + (i % 4) * 20}%`,
            top: `${20 + Math.floor(i / 4) * 20}%`,
          }}
        >
          {/* 불꽃 중심 */}
          <div className="w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse" />
          
          {/* 불꽃 파티클들 */}
          {Array.from({ length: 8 }).map((_, j) => (
            <div
              key={`particle-${j}`}
              className="absolute w-1 h-1 bg-gradient-to-r from-cyan-300 to-blue-400 rounded-full animate-ping"
              style={{
                left: `${Math.cos(j * 45 * Math.PI / 180) * 30}px`,
                top: `${Math.sin(j * 45 * Math.PI / 180) * 30}px`,
                animationDelay: `${j * 0.1 + i * 0.05}s`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
