
import React, { useEffect, useState } from 'react';

interface GrayBombEffectProps {
  show: boolean;
  onComplete?: () => void;
}

export const GrayBombEffect = ({ show, onComplete }: GrayBombEffectProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // 3초 후 이펙트 완료
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* 중앙에서 퍼지는 회색 원들 */}
      {Array.from({ length: 8 }).map((_, i) => {
        const size = (i + 1) * 150;
        const delay = i * 0.2;
        
        return (
          <div
            key={`gray-wave-${i}`}
            className="absolute border-4 border-gray-400/30 rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              animation: `grayWave 2s ease-out ${delay}s forwards`,
            }}
          />
        );
      })}

      {/* 회색 연기 파티클들 */}
      {Array.from({ length: 20 }).map((_, i) => {
        const size = 30 + Math.random() * 60;
        const left = 50 + (Math.random() - 0.5) * 80;
        const top = 50 + (Math.random() - 0.5) * 60;
        const delay = i * 0.1;

        return (
          <div
            key={`gray-smoke-${i}`}
            className="absolute rounded-full bg-gray-500/20"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: `${top}%`,
              animation: `graySmoke 3s ease-out ${delay}s forwards`,
            }}
          />
        );
      })}

      {/* CSS 애니메이션 정의 */}
      <style jsx>{`
        @keyframes grayWave {
          0% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(0);
          }
          50% {
            opacity: 0.4;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes graySmoke {
          0% {
            opacity: 0.6;
            transform: scale(0) translateY(0);
          }
          50% {
            opacity: 0.3;
            transform: scale(1) translateY(-20px);
          }
          100% {
            opacity: 0;
            transform: scale(1.5) translateY(-60px);
          }
        }
      `}</style>
    </div>
  );
};
