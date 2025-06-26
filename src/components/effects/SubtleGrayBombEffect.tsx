
import React, { useEffect, useState } from 'react';
import { Bomb } from 'lucide-react';

interface SubtleGrayBombEffectProps {
  show: boolean;
  onComplete?: () => void;
}

export const SubtleGrayBombEffect = ({ show, onComplete }: SubtleGrayBombEffectProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExploded, setIsExploded] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      
      // 1초 후 폭발
      const explodeTimer = setTimeout(() => {
        setIsExploded(true);
      }, 1000);
      
      // 3초 후 이펙트 완료 (시간 단축)
      const completeTimer = setTimeout(() => {
        setIsVisible(false);
        setIsExploded(false);
        onComplete?.();
      }, 3000);

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
          @keyframes subtleBombPulse {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.05); opacity: 0.8; }
          }

          @keyframes subtleBombExplode {
            0% { transform: scale(1); opacity: 0.4; }
            100% { transform: scale(2); opacity: 0; }
          }

          @keyframes subtleSmokeRise {
            0% {
              opacity: 0.03;
              transform: translateY(0) scale(0.3);
            }
            50% {
              opacity: 0.02;
              transform: translateY(-80px) scale(0.7);
            }
            100% {
              opacity: 0;
              transform: translateY(-150px) scale(1);
            }
          }

          @keyframes subtleSmokeSpread {
            0% {
              opacity: 0.025;
              transform: scale(0);
            }
            50% {
              opacity: 0.015;
              transform: scale(0.8);
            }
            100% {
              opacity: 0;
              transform: scale(1.5);
            }
          }

          @keyframes subtleFlashEffect {
            0% { opacity: 0; }
            10% { opacity: 0.03; }
            20% { opacity: 0; }
            100% { opacity: 0; }
          }
        `}
      </style>
      
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center">
        {/* 폭발 플래시 효과 - 매우 연한 투명도 */}
        {isExploded && (
          <div 
            className="absolute inset-0 bg-gray-400"
            style={{
              animation: 'subtleFlashEffect 0.3s ease-out'
            }}
          />
        )}

        {/* 폭탄 아이콘 (폭발 전) */}
        {!isExploded && (
          <div
            style={{
              animation: 'subtleBombPulse 0.5s ease-in-out infinite'
            }}
          >
            <Bomb className="h-12 w-12 text-gray-500 opacity-60" />
          </div>
        )}

        {/* 폭발 효과 */}
        {isExploded && (
          <div
            className="absolute h-12 w-12 bg-gray-400 rounded-full opacity-40"
            style={{
              animation: 'subtleBombExplode 0.2s ease-out'
            }}
          />
        )}

        {/* 매우 연한 연기 효과들 - 개수 줄임 */}
        {isExploded && Array.from({ length: 6 }).map((_, i) => {
          const size = 40 + Math.random() * 60;
          const left = 50 + (Math.random() - 0.5) * 60;
          const top = 50 + (Math.random() - 0.5) * 40;
          const delay = i * 0.15;
          const duration = 2 + Math.random() * 1;

          return (
            <div
              key={`smoke-${i}`}
              className="absolute rounded-full bg-gray-400"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                animation: `subtleSmokeRise ${duration}s ease-out ${delay}s forwards`,
              }}
            />
          );
        })}

        {/* 넓게 퍼지는 연기 구름들 - 개수 줄임 */}
        {isExploded && Array.from({ length: 3 }).map((_, i) => {
          const size = 80 + i * 40;
          const delay = i * 0.3;
          const angle = (i * 120) * Math.PI / 180;
          const distance = 60 + i * 15;
          const left = 50 + Math.cos(angle) * (distance / 15);
          const top = 50 + Math.sin(angle) * (distance / 15);

          return (
            <div
              key={`spread-smoke-${i}`}
              className="absolute rounded-full bg-gray-500"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                transform: 'translate(-50%, -50%)',
                animation: `subtleSmokeSpread 2s ease-out ${delay}s forwards`,
              }}
            />
          );
        })}

        {/* 중앙에서 퍼지는 진한 연기 - 개수 줄임 */}
        {isExploded && Array.from({ length: 4 }).map((_, i) => {
          const size = 50 + Math.random() * 50;
          const delay = i * 0.1;
          const offsetX = (Math.random() - 0.5) * 100;
          const offsetY = (Math.random() - 0.5) * 80;

          return (
            <div
              key={`dense-smoke-${i}`}
              className="absolute rounded-full bg-gray-600"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`,
                animation: `subtleSmokeSpread 2.5s ease-out ${delay}s forwards`,
              }}
            />
          );
        })}
      </div>
    </>
  );
};
