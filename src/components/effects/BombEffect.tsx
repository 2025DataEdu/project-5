
import { useEffect, useState } from 'react';
import { BombIcon } from './BombIcon';
import { ExplosionEffect } from './ExplosionEffect';
import { SmokeEffect } from './SmokeEffect';
import { ScreenShake } from './ScreenShake';

interface BombEffectProps {
  show: boolean;
  onComplete?: () => void;
}

export const BombEffect = ({ show, onComplete }: BombEffectProps) => {
  const [isExploding, setIsExploding] = useState(false);
  const [showSmoke, setShowSmoke] = useState(false);

  useEffect(() => {
    if (show) {
      // 0.75초 후 폭발
      const explodeTimer = setTimeout(() => {
        setIsExploding(true);
      }, 750);
      
      // 1.2초 후 연기 효과
      const smokeTimer = setTimeout(() => {
        setShowSmoke(true);
      }, 1200);
      
      // 3초 후 이펙트 제거
      const completeTimer = setTimeout(() => {
        setIsExploding(false);
        setShowSmoke(false);
        onComplete?.();
      }, 3000);
      
      return () => {
        clearTimeout(explodeTimer);
        clearTimeout(smokeTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
      {/* 완화된 화면 플래시 효과 */}
      {isExploding && (
        <div className="absolute inset-0 bg-gradient-to-r from-orange-200 via-red-200 to-yellow-200 opacity-20 animate-pulse" />
      )}
      
      <BombIcon show={!isExploding} />
      <ExplosionEffect show={isExploding} />
      <SmokeEffect show={showSmoke} />
      <ScreenShake isActive={isExploding} />
    </div>
  );
};
