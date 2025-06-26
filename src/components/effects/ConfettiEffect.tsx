
import { useEffect, useState } from 'react';
import { Firework } from './Firework';

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

  const [fireworks, setFireworks] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    particleCount: number;
    size: number;
    delay: number;
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
        y: Math.random() * -200 - 50,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        size: Math.random() * 12 + 6,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 2 + 1,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      }));
      
      // 폭죽 효과 생성 (8개)
      const newFireworks = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 80 + 10, // 10% ~ 90% 범위
        y: Math.random() * 60 + 20, // 20% ~ 80% 범위
        color: colors[Math.floor(Math.random() * colors.length)],
        particleCount: Math.floor(Math.random() * 15) + 10, // 10~25개
        size: Math.floor(Math.random() * 4) + 4, // 4~8px
        delay: Math.random() * 2, // 0~2초 지연
      }));
      
      setParticles(newParticles);
      setFireworks(newFireworks);
      
      // 4초 후 이펙트 제거
      const timer = setTimeout(() => {
        setParticles([]);
        setFireworks([]);
        onComplete?.();
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

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
      {/* 배경 플래시 효과 - 더 강렬하게 */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/30 via-pink-200/30 to-blue-200/30 animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-br from-orange-300/20 via-purple-300/20 to-cyan-300/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
      
      {/* 폭죽 파티클들 */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-pulse"
          style={getShapeStyle(particle)}
        />
      ))}
      
      {/* 폭죽 효과들 */}
      {fireworks.map((firework) => (
        <div
          key={firework.id}
          style={{
            animationDelay: `${firework.delay}s`
          }}
        >
          <Firework
            color={firework.color}
            particleCount={firework.particleCount}
            size={firework.size}
            x={firework.x}
            y={firework.y}
          />
        </div>
      ))}
      
      {/* 중앙 폭발 효과 - 훨씬 더 크고 화려하게 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {/* 가장 큰 외곽 링 */}
        <div className="w-80 h-80 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 rounded-full opacity-20 animate-ping" />
        <div className="absolute top-8 left-8 w-64 h-64 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 rounded-full opacity-25 animate-pulse" />
        <div className="absolute top-12 left-12 w-56 h-56 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 rounded-full opacity-30 animate-ping" style={{ animationDelay: '0.3s' }} />
        
        {/* 중간 크기 링들 */}
        <div className="absolute top-16 left-16 w-48 h-48 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-full opacity-35 animate-pulse" style={{ animationDelay: '0.6s' }} />
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 rounded-full opacity-40 animate-ping" style={{ animationDelay: '0.9s' }} />
        
        {/* 내부 핵심 폭발 */}
        <div className="absolute top-24 left-24 w-32 h-32 bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 rounded-full opacity-50 animate-bounce" />
        <div className="absolute top-28 left-28 w-24 h-24 bg-gradient-to-r from-white via-yellow-200 to-orange-200 rounded-full opacity-60 animate-pulse" />
        <div className="absolute top-32 left-32 w-16 h-16 bg-white rounded-full opacity-80 animate-ping" />
        
        {/* 추가 스파클링 효과들 */}
        <div className="absolute top-10 left-40 w-8 h-8 bg-yellow-300 rounded-full opacity-70 animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="absolute top-40 left-10 w-6 h-6 bg-pink-300 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.4s' }} />
        <div className="absolute top-60 left-60 w-10 h-10 bg-cyan-300 rounded-full opacity-50 animate-ping" style={{ animationDelay: '0.6s' }} />
        <div className="absolute top-20 left-60 w-4 h-4 bg-purple-300 rounded-full opacity-80 animate-bounce" style={{ animationDelay: '0.8s' }} />
        <div className="absolute top-50 left-20 w-5 h-5 bg-green-300 rounded-full opacity-70 animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* 반짝이는 별 효과들 */}
        <div className="absolute top-5 left-5 w-3 h-3 bg-white transform rotate-45 opacity-90 animate-ping" style={{ animationDelay: '0.1s' }} />
        <div className="absolute top-70 left-70 w-3 h-3 bg-white transform rotate-45 opacity-90 animate-pulse" style={{ animationDelay: '0.3s' }} />
        <div className="absolute top-15 left-65 w-2 h-2 bg-yellow-200 transform rotate-45 opacity-80 animate-bounce" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-65 left-15 w-2 h-2 bg-pink-200 transform rotate-45 opacity-80 animate-ping" style={{ animationDelay: '0.7s' }} />
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
