
import React, { useEffect, useState } from 'react';
import { Bomb } from 'lucide-react';

interface GrayBombEffectProps {
  show: boolean;
  onComplete?: () => void;
}

export const GrayBombEffect = ({ show, onComplete }: GrayBombEffectProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExploded, setIsExploded] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      
      // 1초 후 폭발
      const explodeTimer = setTimeout(() => {
        setIsExploded(true);
      }, 1000);
      
      // 4초 후 이펙트 완료
      const completeTimer = setTimeout(() => {
        setIsVisible(false);
        setIsExploded(false);
        onComplete?.();
      }, 4000);

      return () => {
        clearTimeout(explodeTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [show, onComplete]);

  if (!isVisible) return null;

  return (
    <>
      {/* CSS 애니메이션 정의 */}
      <style>
        {`
          @keyframes bombPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }

          @keyframes bombExplode {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(3); opacity: 0; }
          }

          @keyframes smokeRise {
            0% {
              opacity: 0.15;
              transform: translateY(0) scale(0.5);
            }
            50% {
              opacity: 0.1;
              transform: translateY(-100px) scale(1);
            }
            100% {
              opacity: 0;
              transform: translateY(-200px) scale(1.5);
            }
          }

          @keyframes smokeSpread {
            0% {
              opacity: 0.12;
              transform: scale(0);
            }
            50% {
              opacity: 0.08;
              transform: scale(1);
            }
            100% {
              opacity: 0;
              transform: scale(2);
            }
          }

          @keyframes flashEffect {
            0% { opacity: 0; }
            10% { opacity: 0.2; }
            20% { opacity: 0; }
            100% { opacity: 0; }
          }
        `}
      </style>
      
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center">
        {/* 폭발 플래시 효과 - 투명도 더 낮춤 */}
        {isExploded && (
          <div 
            className="absolute inset-0 bg-gray-300"
            style={{
              animation: 'flashEffect 0.5s ease-out'
            }}
          />
        )}

        {/* 폭탄 아이콘 (폭발 전) */}
        {!isExploded && (
          <div
            style={{
              animation: 'bombPulse 0.5s ease-in-out infinite'
            }}
          >
            <Bomb className="h-16 w-16 text-gray-600" />
          </div>
        )}

        {/* 폭발 효과 */}
        {isExploded && (
          <div
            className="absolute h-16 w-16 bg-gray-500 rounded-full"
            style={{
              animation: 'bombExplode 0.3s ease-out'
            }}
          />
        )}

        {/* 자욱한 연기 효과들 - 투명도 더 낮춤 */}
        {isExploded && Array.from({ length: 12 }).map((_, i) => {
          const size = 60 + Math.random() * 100;
          const left = 50 + (Math.random() - 0.5) * 80;
          const top = 50 + (Math.random() - 0.5) * 60;
          const delay = i * 0.1;
          const duration = 3 + Math.random() * 2;

          return (
            <div
              key={`smoke-${i}`}
              className="absolute rounded-full bg-gray-400/8"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                animation: `smokeRise ${duration}s ease-out ${delay}s forwards`,
              }}
            />
          );
        })}

        {/* 넓게 퍼지는 연기 구름들 - 투명도 더 낮춤 */}
        {isExploded && Array.from({ length: 5 }).map((_, i) => {
          const size = 120 + i * 60;
          const delay = i * 0.2;
          const angle = (i * 72) * Math.PI / 180;
          const distance = 80 + i * 20;
          const left = 50 + Math.cos(angle) * (distance / 12);
          const top = 50 + Math.sin(angle) * (distance / 12);

          return (
            <div
              key={`spread-smoke-${i}`}
              className="absolute rounded-full bg-gray-500/6"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                transform: 'translate(-50%, -50%)',
                animation: `smokeSpread 3s ease-out ${delay}s forwards`,
              }}
            />
          );
        })}

        {/* 중앙에서 퍼지는 진한 연기 - 투명도 더 낮춤 */}
        {isExploded && Array.from({ length: 8 }).map((_, i) => {
          const size = 70 + Math.random() * 80;
          const delay = i * 0.05;
          const offsetX = (Math.random() - 0.5) * 150;
          const offsetY = (Math.random() - 0.5) * 100;

          return (
            <div
              key={`dense-smoke-${i}`}
              className="absolute rounded-full bg-gray-600/7"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`,
                animation: `smokeSpread 4s ease-out ${delay}s forwards`,
              }}
            />
          );
        })}
      </div>
    </>
  );
};
