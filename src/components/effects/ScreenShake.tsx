
interface ScreenShakeProps {
  isActive: boolean;
}

export const ScreenShake = ({ isActive }: ScreenShakeProps) => {
  return (
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
        
        ${isActive ? `
        body {
          animation: screenShake 0.5s ease-in-out;
        }
        ` : ''}
      `}
    </style>
  );
};
