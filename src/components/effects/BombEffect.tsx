import { useEffect, useState } from 'react';
import { Bomb, Zap, Star, Sparkles } from 'lucide-react';

interface BombEffectProps {
  show: boolean;
  onComplete?: () => void;
}

export const BombEffect = ({ show, onComplete }: BombEffectProps) => {
  const [isExploding, setIsExploding] = useState(false);
  const [showShockwave, setShowShockwave] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showSmoke, setShowSmoke] = useState(false);

  useEffect(() => {
    if (show) {
      // 0.75초 후 폭발 (1.5초 → 0.75초)
      const explodeTimer = setTimeout(() => {
        setIsExploding(true);
      }, 750);
      
      // 1초 후 충격파 (2초 → 1초)
      const shockwaveTimer = setTimeout(() => {
        setShowShockwave(true);
      }, 1000);
      
      // 1.25초 후 불꽃놀이 (2.5초 → 1.25초)
      const fireworksTimer = setTimeout(() => {
        setShowFireworks(true);
      }, 1250);
      
      // 1.5초 후 연기 효과 (3초 → 1.5초)
      const smokeTimer = setTimeout(() => {
        setShowSmoke(true);
      }, 1500);
      
      // 3초 후 이펙트 제거 (6초 → 3초)
      const completeTimer = setTimeout(() => {
        setIsExploding(false);
        setShowShockwave(false);
        setShowFireworks(false);
        setShowSmoke(false);
        onComplete?.();
      }, 3000);
      
      return () => {
        clearTimeout(explodeTimer);
        clearTimeout(shockwaveTimer);
        clearTimeout(fireworksTimer);
        clearTimeout(smokeTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
      {/* 전체 화면 플래시 효과 */}
      {isExploding && (
        <div className="absolute inset-0 bg-gradient-to-r from-orange-300 via-red-300 to-yellow-300 opacity-40 animate-pulse" />
      )}
      
      {/* 폭탄 아이콘 (폭발 전) */}
      {!isExploding && (
        <div className="relative">
          <div className="animate-bounce">
            <Bomb className="h-20 w-20 text-red-600 drop-shadow-2xl" />
          </div>
          {/* 폭탄 주변 스파클 */}
          <div className="absolute -top-2 -right-2 animate-pulse">
            <Sparkles className="h-6 w-6 text-yellow-400" />
          </div>
          <div className="absolute -bottom-2 -left-2 animate-ping">
            <Star className="h-4 w-4 text-orange-400" />
          </div>
          <div className="absolute top-0 left-6 animate-bounce" style={{ animationDelay: '0.3s' }}>
            <Zap className="h-5 w-5 text-red-400" />
          </div>
        </div>
      )}
      
      {/* 메인 폭발 이펙트 - 훨씬 더 크고 화려하게 */}
      {isExploding && (
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
          
          {/* 폭발 파편들 - 더 많고 다양하게 */}
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
      )}
      
      {/* 충격파 효과 */}
      {showShockwave && (
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
      )}
      
      {/* 불꽃놀이 효과 */}
      {showFireworks && (
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
      )}
      
      {/* 연기 효과 - 더 크고 현실적으로 */}
      {showSmoke && (
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
      )}
      
      {/* 화면 진동 효과를 위한 스타일 */}
      <style>
        {`
          @keyframes screenShake {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            10% { transform: translate(-2px, -2px) rotate(-0.5deg); }
            20% { transform: translate(-4px, 0px) rotate(0.5deg); }
            30% { transform: translate(4px, 2px) rotate(0deg); }
            40% { transform: translate(-2px, -1px) rotate(0.5deg); }
            50% { transform: translate(-4px, 2px) rotate(-0.5deg); }
            60% { transform: translate(-2px, 1px) rotate(0deg); }
            70% { transform: translate(4px, 1px) rotate(-0.5deg); }
            80% { transform: translate(-1px, -1px) rotate(0.5deg); }
            90% { transform: translate(2px, 2px) rotate(0deg); }
          }
          
          ${isExploding ? `
          body {
            animation: screenShake 0.5s ease-in-out;
          }
          ` : ''}
        `}
      </style>
    </div>
  );
};
