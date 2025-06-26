
import { useEffect, useState } from 'react';
import { Bomb } from 'lucide-react';

interface BombEffectProps {
  show: boolean;
  onComplete?: () => void;
}

export const BombEffect = ({ show, onComplete }: BombEffectProps) => {
  const [isExploding, setIsExploding] = useState(false);
  const [showSmoke, setShowSmoke] = useState(false);

  useEffect(() => {
    if (show) {
      // 1초 후 폭발
      const explodeTimer = setTimeout(() => {
        setIsExploding(true);
      }, 1000);
      
      // 1.5초 후 연기 효과
      const smokeTimer = setTimeout(() => {
        setShowSmoke(true);
      }, 1500);
      
      // 4초 후 이펙트 제거
      const completeTimer = setTimeout(() => {
        setIsExploding(false);
        setShowSmoke(false);
        onComplete?.();
      }, 4000);
      
      return () => {
        clearTimeout(explodeTimer);
        clearTimeout(smokeTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {!isExploding && (
        <div className="animate-bounce">
          <Bomb className="h-16 w-16 text-red-600" />
        </div>
      )}
      
      {isExploding && (
        <div className="relative">
          {/* 폭발 이펙트 */}
          <div className="absolute inset-0 animate-ping">
            <div className="w-32 h-32 bg-orange-500 rounded-full opacity-75" />
          </div>
          <div className="absolute inset-0 animate-pulse">
            <div className="w-24 h-24 bg-red-500 rounded-full opacity-75 m-4" />
          </div>
          <div className="absolute inset-0 animate-bounce">
            <div className="w-16 h-16 bg-yellow-400 rounded-full opacity-75 m-8" />
          </div>
          
          {/* 폭발 파편들 */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-orange-400 rounded-full animate-ping"
              style={{
                left: `${50 + Math.cos(i * 45 * Math.PI / 180) * 60}px`,
                top: `${50 + Math.sin(i * 45 * Math.PI / 180) * 60}px`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}
      
      {showSmoke && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-12 h-12 bg-gray-400 rounded-full opacity-30 animate-pulse"
              style={{
                left: `${i * 10 - 20}px`,
                top: `${i * -15}px`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
