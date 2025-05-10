import React, { useState } from 'react';
import { useCursor } from '../../context/CursorContext';

interface BackButtonProps {
  onClick: () => void;
  style?: React.CSSProperties; // Expect percentage-based values, e.g. top: '5%', left: '5%'
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  style = { top: '104%', left: '15%' }, // Default responsive positioning using percentages
  className = ''
}) => {
  const { setCursorType } = useCursor();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseEnter = () => {
    setCursorType('pointing');
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setCursorType('neutral');
    setIsHovered(false);
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={`absolute z-50 p-0 border-none bg-transparent cursor-pointer ${className}`}
      aria-label="Back Button"
    >
      <img
        src="assets/hud/back_button.png"  // Update path as necessary
        alt="Back Button"
        style={{ 
          width: '64px', 
          height: 'auto',
          filter: isHovered ? 'brightness(0.85)' : 'brightness(1)'
        }}
        draggable={false}
      />
    </button>
  );
};

export default BackButton;
