
import { useEffect, useState } from 'react';

interface ConfettiEffectProps {
  show: boolean;
  onComplete?: () => void;
}

export const ConfettiEffect = ({ show, onComplete }: ConfettiEffectProps) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    rotation: number;
    size: number;
    vx: number;
    vy: number;
    shape: 'circle' | 'square' | 'triangle';
  }>>([]);

  useEffect(() => {
    if (show) {
      const colors = [
        '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
        '#FFEAA7', '#FF7675', '#74B9FF', '#A29BFE', '#FD79A8',
        '#FDCB6E', '#6C5CE7', '#00B894', '#E17055', '#81ECEC'
      ];
      
      const shapes = ['circle', 'square', 'triangle'] as const;
      
      // 더 많은 파티클 생성 (100개)
      const newParticles = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * -200 - 50, // 더 높은 위치에서 시작
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        size: Math.random() * 12 + 6, // 더 큰 크기
        vx: (Math.random() - 0.5) * 4, // 수평 속도
        vy: Math.random() * 2 + 1, // 수직 속도
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      }));
      
      setParticles(newParticles);
      
      // 4초 후 이펙트 제거 (더 오래 지속)
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show || particles.length === 0) return null;

  const getShapeStyle = (particle: typeof particles[0]) => {
    const baseStyle = {
      left: particle.x,
      top: particle.y,
      width: particle.size,
      height: particle.size,
      transform: `rotate(${particle.rotation}deg)`,
      animation: `confetti-fall-${particle.id % 3} 4s ease-out forwards`,
    };

    switch (particle.shape) {
      case 'circle':
        return {
          ...baseStyle,
          backgroundColor: particle.color,
          borderRadius: '50%',
          boxShadow: `0 0 ${particle.size/2}px ${particle.color}40`,
        };
      case 'square':
        return {
          ...baseStyle,
          backgroundColor: particle.color,
          borderRadius: '2px',
          boxShadow: `0 0 ${particle.size/2}px ${particle.color}40`,
        };
      case 'triangle':
        return {
          ...baseStyle,
          width: 0,
          height: 0,
          backgroundColor: 'transparent',
          borderLeft: `${particle.size/2}px solid transparent`,
          borderRight: `${particle.size/2}px solid transparent`,
          borderBottom: `${particle.size}px solid ${particle.color}`,
          filter: `drop-shadow(0 0 ${particle.size/2}px ${particle.color}40)`,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* 배경 플래시 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/20 via-pink-200/20 to-blue-200/20 animate-pulse" />
      
      {/* 폭죽 파티클들 */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-pulse"
          style={getShapeStyle(particle)}
        />
      ))}
      
      {/* 중앙 폭발 효과 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-32 h-32 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 rounded-full opacity-30 animate-ping" />
        <div className="absolute top-4 left-4 w-24 h-24 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 rounded-full opacity-40 animate-pulse" />
        <div className="absolute top-8 left-8 w-16 h-16 bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 rounded-full opacity-50 animate-bounce" />
      </div>

      <style>
        {`
          @keyframes confetti-fall-0 {
            0% {
              transform: translateY(-50px) translateX(0px) rotate(0deg) scale(1);
              opacity: 1;
            }
            25% {
              transform: translateY(25vh) translateX(20px) rotate(180deg) scale(1.2);
              opacity: 0.8;
            }
            50% {
              transform: translateY(50vh) translateX(-10px) rotate(360deg) scale(0.8);
              opacity: 0.6;
            }
            75% {
              transform: translateY(75vh) translateX(30px) rotate(540deg) scale(1.1);
              opacity: 0.4;
            }
            100% {
              transform: translateY(110vh) translateX(-20px) rotate(720deg) scale(0.5);
              opacity: 0;
            }
          }
          
          @keyframes confetti-fall-1 {
            0% {
              transform: translateY(-30px) translateX(0px) rotate(0deg) scale(0.8);
              opacity: 1;
            }
            30% {
              transform: translateY(30vh) translateX(-25px) rotate(270deg) scale(1.3);
              opacity: 0.9;
            }
            60% {
              transform: translateY(60vh) translateX(15px) rotate(450deg) scale(0.9);
              opacity: 0.5;
            }
            100% {
              transform: translateY(105vh) translateX(25px) rotate(810deg) scale(0.3);
              opacity: 0;
            }
          }
          
          @keyframes confetti-fall-2 {
            0% {
              transform: translateY(-70px) translateX(0px) rotate(0deg) scale(1.1);
              opacity: 1;
            }
            20% {
              transform: translateY(20vh) translateX(35px) rotate(150deg) scale(1.4);
              opacity: 0.8;
            }
            40% {
              transform: translateY(40vh) translateX(-30px) rotate(300deg) scale(0.7);
              opacity: 0.7;
            }
            80% {
              transform: translateY(80vh) translateX(10px) rotate(600deg) scale(1.2);
              opacity: 0.3;
            }
            100% {
              transform: translateY(115vh) translateX(-40px) rotate(900deg) scale(0.2);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};
