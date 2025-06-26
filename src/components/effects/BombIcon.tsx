
import { Bomb, Zap, Star, Sparkles } from 'lucide-react';

interface BombIconProps {
  show: boolean;
}

export const BombIcon = ({ show }: BombIconProps) => {
  if (!show) return null;

  return (
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
  );
};
