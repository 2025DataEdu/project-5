
interface ScreenShakeProps {
  isActive: boolean;
}

export const ScreenShake = ({ isActive }: ScreenShakeProps) => {
  return (
    <style>
      {`
        @keyframes screenShake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(-1px, -1px) rotate(-0.3deg); }
          20% { transform: translate(-2px, 0px) rotate(0.3deg); }
          30% { transform: translate(2px, 1px) rotate(0deg); }
          40% { transform: translate(-1px, -0.5px) rotate(0.3deg); }
          50% { transform: translate(-2px, 1px) rotate(-0.3deg); }
          60% { transform: translate(-1px, 0.5px) rotate(0deg); }
          70% { transform: translate(2px, 0.5px) rotate(-0.3deg); }
          80% { transform: translate(-0.5px, -0.5px) rotate(0.3deg); }
          90% { transform: translate(1px, 1px) rotate(0deg); }
        }
        
        ${isActive ? `
        body {
          animation: screenShake 0.3s ease-in-out;
        }
        ` : ''}
      `}
    </style>
  );
};
