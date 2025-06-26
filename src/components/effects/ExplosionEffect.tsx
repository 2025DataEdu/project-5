
interface ExplosionEffectProps {
  show: boolean;
}

export const ExplosionEffect = ({ show }: ExplosionEffectProps) => {
  if (!show) return null;

  return (
    <div className="relative">
      {/* 축소된 폭발 링들 */}
      <div className="absolute inset-0 animate-ping">
        <div className="w-48 h-48 bg-gradient-to-r from-orange-400 via-red-500 to-yellow-400 rounded-full opacity-50 m-24" />
      </div>
      <div className="absolute inset-0 animate-pulse" style={{ animationDelay: '0.1s' }}>
        <div className="w-40 h-40 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full opacity-60 m-28" />
      </div>
      <div className="absolute inset-0 animate-ping" style={{ animationDelay: '0.2s' }}>
        <div className="w-32 h-32 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full opacity-70 m-32" />
      </div>
      <div className="absolute inset-0 animate-bounce" style={{ animationDelay: '0.3s' }}>
        <div className="w-24 h-24 bg-gradient-to-r from-white via-yellow-300 to-orange-300 rounded-full opacity-80 m-36" />
      </div>
      
      {/* 중앙 핵심 폭발 */}
      <div className="absolute inset-0 animate-pulse">
        <div className="w-16 h-16 bg-white rounded-full opacity-90 m-40 shadow-lg" />
      </div>
      
      {/* 축소된 폭발 파편들 */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={`fragment-${i}`}
          className="absolute w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-ping shadow-md"
          style={{
            left: `${50 + Math.cos(i * 45 * Math.PI / 180) * 80}px`,
            top: `${50 + Math.sin(i * 45 * Math.PI / 180) * 80}px`,
            animationDelay: `${i * 0.08}s`,
            animationDuration: '1.2s',
          }}
        />
      ))}
      
      {/* 축소된 스파클링 파편들 */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={`spark-${i}`}
          className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full animate-bounce opacity-80"
          style={{
            left: `${50 + Math.cos(i * 30 * Math.PI / 180) * 100}px`,
            top: `${50 + Math.sin(i * 30 * Math.PI / 180) * 100}px`,
            animationDelay: `${i * 0.05}s`,
            animationDuration: '1.5s',
          }}
        />
      ))}
    </div>
  );
};
