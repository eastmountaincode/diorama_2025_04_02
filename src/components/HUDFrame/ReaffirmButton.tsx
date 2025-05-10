import React, { useState } from 'react';
import { useCursor } from '../../context/CursorContext';
import { useAtom } from 'jotai';
import { breakpointAtom } from '../../atoms/gameState';
import { useCameraClickSound } from '../../scenes/MirrorScene/useCameraClickSound';
import { AiOutlineCamera } from 'react-icons/ai';

interface ReaffirmButtonProps {
  onClick: () => void;
  style?: React.CSSProperties;
  className?: string;
  isVisible: boolean;
}

const ReaffirmButton: React.FC<ReaffirmButtonProps> = ({
  onClick,
  style = { bottom: '8%', left: '50%', transform: 'translateX(-50%)' },
  className = '',
  isVisible
}) => {
  const { setCursorType } = useCursor();
  const [breakpoint] = useAtom(breakpointAtom);
  const isMobile = breakpoint === 'mobile';
  const [isHovered, setIsHovered] = useState(false);
  
  // Use our Web Audio API hook for camera sound
  const { playSound: playCameraSound } = useCameraClickSound();

  // Handle click with sound
  const handleClick = () => {
    playCameraSound();
    onClick();
  };
  
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
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`absolute z-30 bg-[#fffff0] text-gray-700 border border-gray-400 rounded px-3 py-1 
                 transition-opacity duration-500 font-mono
                 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'} ${className}`}
      style={{
        ...style,
        filter: isHovered ? 'brightness(0.85)' : 'brightness(1)'
      }}
      aria-label="Reaffirm Existence Button"
    >
      {/* Camera Icon */}
      <div className="flex items-center justify-center">
        <AiOutlineCamera 
          size={isMobile ? 14 : 16} 
          className={isMobile ? "mr-1.5" : "mr-2"} 
        />
        <span className={`${isMobile ? "text-xs" : "text-sm"} font-mono`}>
          Reaffirm Existence
        </span>
      </div>
    </button>
  );
};

export default ReaffirmButton; 