import React, { useState } from 'react';
import { useCursor } from '../../context/CursorContext';
import { useAtom } from 'jotai';
import { breakpointAtom } from '../../atoms/gameState';

interface ComputerFileProps {
  name: string;
  iconSrc: string;
  positionX: string;
  positionY: string;
  scale?: number;
  onClick?: () => void;
}

const ComputerFile: React.FC<ComputerFileProps> = ({ 
  name, 
  iconSrc, 
  positionX, 
  positionY,
  scale = 1,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { setCursorType } = useCursor();
  const [breakpoint] = useAtom(breakpointAtom);
  const isMobile = breakpoint === 'mobile';

  // Base sizes for the icon - adjusted for mobile
  const baseWidth = 70;
  const baseIconSize = isMobile ? 30 : 40;
  
  // Adjust highlight size to be slightly larger than the icon
  const highlightSize = baseIconSize * scale * 1.2;

  // Handle mouse events for hover effects and cursor changes
  const handleMouseEnter = () => {
    setIsHovered(true);
    setCursorType('pointer');
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCursorType('default');
  };

  return (
    <div 
      className="flex items-center justify-center cursor-pointer select-none"
      style={{
        position: 'absolute',
        left: positionX,
        top: positionY,
        width: `${baseWidth * scale}px`,
        height: `${baseWidth * scale}px`,
        textAlign: 'center',
      }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          width: `${highlightSize}px`,
          height: `${highlightSize}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isHovered ? 'rgba(173, 216, 230, 0.2)' : 'transparent',
          margin: 0,
          padding: 0,
        }}
      >
        <img 
          src={iconSrc} 
          alt={name}
          style={{
            width: `${baseIconSize * scale}px`,
            height: `${baseIconSize * scale}px`,
            display: 'block',
            margin: 'auto',
          }}
          draggable={false}
        />
      </div>
    </div>
  );
};

export default ComputerFile; 