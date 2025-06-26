
interface SmokeEffectProps {
  show: boolean;
}

export const SmokeEffect = ({ show }: SmokeEffectProps) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0">
      {/* 메인 연기 구름들 - 훨씬 크고 넓게 퍼짐 */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={`smoke-${i}`}
          className="absolute bg-gray-600 rounded-full opacity-25 animate-pulse"
          style={{
            width: `${120 + i * 30}px`,
            height: `${120 + i * 30}px`,
            left: `${30 + i * 4 - 12}%`,
            top: `${20 - i * 6}%`,
            animationDelay: `${i * 0.15}s`,
            animationDuration: '2s',
          }}
        />
      ))}
      
      {/* 추가 대형 연기 구름들 */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={`large-cloud-${i}`}
          className="absolute bg-gray-500 rounded-full opacity-20 animate-bounce"
          style={{
            width: `${80 + i * 25}px`,
            height: `${60 + i * 20}px`,
            left: `${25 + i * 5}%`,
            top: `${15 - i * 4}%`,
            animationDelay: `${i * 0.2}s`,
            animationDuration: '2.5s',
          }}
        />
      ))}

      {/* 외곽 확산 연기 */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={`outer-smoke-${i}`}
          className="absolute bg-gray-700 rounded-full opacity-15 animate-ping"
          style={{
            width: `${200 + i * 40}px`,
            height: `${180 + i * 35}px`,
            left: `${10 + i * 8}%`,
            top: `${5 - i * 3}%`,
            animationDelay: `${i * 0.25}s`,
            animationDuration: '1.8s',
          }}
        />
      ))}

      {/* 중앙 집중 연기 */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-96 h-96 bg-gray-600 rounded-full opacity-30 animate-pulse" />
        <div className="absolute inset-0 w-80 h-80 bg-gray-500 rounded-full opacity-25 animate-bounce m-8" />
        <div className="absolute inset-0 w-64 h-64 bg-gray-700 rounded-full opacity-20 animate-ping m-16" />
      </div>
    </div>
  );
};
