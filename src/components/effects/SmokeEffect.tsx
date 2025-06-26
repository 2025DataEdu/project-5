
interface SmokeEffectProps {
  show: boolean;
}

export const SmokeEffect = ({ show }: SmokeEffectProps) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0">
      {/* 간소화된 메인 연기 구름들 */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`smoke-${i}`}
          className="absolute bg-gray-500 rounded-full opacity-20 animate-pulse"
          style={{
            width: `${60 + i * 15}px`,
            height: `${60 + i * 15}px`,
            left: `${40 + i * 3}%`,
            top: `${30 - i * 4}%`,
            animationDelay: `${i * 0.2}s`,
            animationDuration: '2s',
          }}
        />
      ))}
      
      {/* 축소된 대형 연기 구름들 */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={`large-cloud-${i}`}
          className="absolute bg-gray-400 rounded-full opacity-15 animate-bounce"
          style={{
            width: `${50 + i * 12}px`,
            height: `${40 + i * 10}px`,
            left: `${35 + i * 4}%`,
            top: `${25 - i * 3}%`,
            animationDelay: `${i * 0.25}s`,
            animationDuration: '2.2s',
          }}
        />
      ))}

      {/* 간소화된 외곽 확산 연기 */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={`outer-smoke-${i}`}
          className="absolute bg-gray-600 rounded-full opacity-10 animate-ping"
          style={{
            width: `${80 + i * 20}px`,
            height: `${70 + i * 18}px`,
            left: `${30 + i * 6}%`,
            top: `${20 - i * 2}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: '1.5s',
          }}
        />
      ))}

      {/* 축소된 중앙 집중 연기 */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-32 h-32 bg-gray-500 rounded-full opacity-25 animate-pulse" />
        <div className="absolute inset-0 w-24 h-24 bg-gray-400 rounded-full opacity-20 animate-bounce m-4" />
        <div className="absolute inset-0 w-16 h-16 bg-gray-600 rounded-full opacity-15 animate-ping m-8" />
      </div>
    </div>
  );
};
