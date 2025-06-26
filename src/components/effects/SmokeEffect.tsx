
interface SmokeEffectProps {
  show: boolean;
}

export const SmokeEffect = ({ show }: SmokeEffectProps) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={`smoke-${i}`}
          className="absolute bg-gray-600 rounded-full opacity-20 animate-pulse"
          style={{
            width: `${60 + i * 10}px`,
            height: `${60 + i * 10}px`,
            left: `${45 + i * 2 - 8}%`,
            top: `${30 - i * 8}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: '3s',
          }}
        />
      ))}
      
      {/* 추가 연기 구름들 */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`cloud-${i}`}
          className="absolute bg-gray-500 rounded-full opacity-15 animate-bounce"
          style={{
            width: `${40 + i * 15}px`,
            height: `${30 + i * 10}px`,
            left: `${40 + i * 3}%`,
            top: `${20 - i * 5}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: '4s',
          }}
        />
      ))}
    </div>
  );
};
