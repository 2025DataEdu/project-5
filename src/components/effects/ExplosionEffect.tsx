
interface ExplosionEffectProps {
  show: boolean;
}

export const ExplosionEffect = ({ show }: ExplosionEffectProps) => {
  if (!show) return null;

  return (
    <div className="relative">
      {/* 가장 큰 외곽 폭발 링들 */}
      <div className="absolute inset-0 animate-ping">
        <div className="w-96 h-96 bg-gradient-to-r from-orange-400 via-red-500 to-yellow-400 rounded-full opacity-60" />
      </div>
      <div className="absolute inset-0 animate-pulse" style={{ animationDelay: '0.1s' }}>
        <div className="w-80 h-80 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full opacity-70 m-8" />
      </div>
      <div className="absolute inset-0 animate-ping" style={{ animationDelay: '0.2s' }}>
        <div className="w-64 h-64 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full opacity-80 m-16" />
      </div>
      <div className="absolute inset-0 animate-bounce" style={{ animationDelay: '0.3s' }}>
        <div className="w-48 h-48 bg-gradient-to-r from-white via-yellow-300 to-orange-300 rounded-full opacity-90 m-24" />
      </div>
      
      {/* 중앙 핵심 폭발 */}
      <div className="absolute inset-0 animate-pulse">
        <div className="w-32 h-32 bg-white rounded-full opacity-95 m-32 shadow-2xl" />
      </div>
      
      {/* 폭발 파편들 */}
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={`fragment-${i}`}
          className="absolute w-4 h-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-ping shadow-lg"
          style={{
            left: `${50 + Math.cos(i * 22.5 * Math.PI / 180) * 120}px`,
            top: `${50 + Math.sin(i * 22.5 * Math.PI / 180) * 120}px`,
            animationDelay: `${i * 0.05}s`,
            animationDuration: '1.5s',
          }}
        />
      ))}
      
      {/* 추가 스파클링 파편들 */}
      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={`spark-${i}`}
          className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-bounce"
          style={{
            left: `${50 + Math.cos(i * 15 * Math.PI / 180) * 160}px`,
            top: `${50 + Math.sin(i * 15 * Math.PI / 180) * 160}px`,
            animationDelay: `${i * 0.03}s`,
            animationDuration: '2s',
          }}
        />
      ))}
    </div>
  );
};
