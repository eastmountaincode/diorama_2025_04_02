import React from 'react';

interface ComputerFileProps {
  name: string;
  iconSrc: string;
  positionX: string;
  positionY: string;
  scale?: number;
}

const ComputerFile: React.FC<ComputerFileProps> = ({ 
  name, 
  iconSrc, 
  positionX, 
  positionY,
  scale = 1,
}) => {



  // Base sizes for the icon
  const baseWidth = 70;
  const baseIconSize = 40;

  return (
    <div 
      className={`flex flex-col items-center justify-center cursor-pointer select-none `}
      style={{
        position: 'absolute',
        left: positionX,
        top: positionY,
        width: `${baseWidth * scale}px`,
        height: `${baseWidth * scale}px`,
        textAlign: 'center',
        padding: '4px',
        borderRadius: '3px',
      }}
    >
      <img 
        src={iconSrc} 
        alt={name}
        style={{
          width: `${baseIconSize * scale}px`,
          height: `${baseIconSize * scale}px`,
        }}
        draggable={false}
      />
    </div>
  );
};

export default ComputerFile; 