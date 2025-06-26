
import React from 'react';

interface SmokeEffectProps {
  show: boolean;
}

export const SmokeEffect = ({ show }: SmokeEffectProps) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {Array.from({ length: 12 }).map((_, i) => {
        const size = 40 + Math.random() * 80;
        const left = Math.random() * 90;
        const top = Math.random() * 80;
        const delay = i * 0.4;

        return (
          <div
            key={`smoke-${i}`}
            className="absolute rounded-full bg-gray-400/20 animate-fadeMove"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: `${top}%`,
              animationDelay: `${delay}s`,
              animationDuration: '6s',
              animationIterationCount: 'infinite',
              animationTimingFunction: 'ease-in-out',
            }}
          />
        );
      })}
    </div>
  );
};
