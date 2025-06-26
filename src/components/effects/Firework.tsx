
import React, { useEffect, useState } from 'react';

interface FireworkProps {
  color?: string;
  particleCount?: number;
  size?: number;
  x?: number;
  y?: number;
}

export const Firework = ({ 
  color = '#ff4d4f', 
  particleCount = 15, 
  size = 6,
  x = 50,
  y = 50 
}: FireworkProps) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(true);
    const timer = setTimeout(() => {
      setIsActive(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isActive) return null;

  return (
    <div 
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {Array.from({ length: particleCount }).map((_, index) => {
        const angle = (360 / particleCount) * index;
        const randomDelay = Math.random() * 0.3;
        
        return (
          <div
            key={index}
            className="absolute animate-firework"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              borderRadius: '50%',
              boxShadow: `0 0 ${size * 2}px ${color}`,
              animationDelay: `${randomDelay}s`,
              '--angle': `${angle}deg`,
            } as React.CSSProperties & { '--angle': string }}
          />
        );
      })}
      
      <style>
        {`
          @keyframes firework {
            0% {
              transform: translate(0, 0) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(
                calc(cos(var(--angle) * 3.14159 / 180) * 80px),
                calc(sin(var(--angle) * 3.14159 / 180) * 80px)
              ) scale(0);
              opacity: 0;
            }
          }
          
          .animate-firework {
            animation: firework 0.8s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};
