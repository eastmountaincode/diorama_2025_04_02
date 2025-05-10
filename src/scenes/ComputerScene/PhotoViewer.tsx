import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { AiOutlineClose } from 'react-icons/ai';
import { breakpointAtom } from '../../atoms/gameState';
import { useCursor } from '../../context/CursorContext';
import { playMouseClickSound } from '../../util/sound';

// Simplified props with size preset
interface PhotoViewerProps {
  imageSrc: string;
  onClose: () => void;
  customWidth?: string; // Optional custom width override
}

const PhotoViewer: React.FC<PhotoViewerProps> = ({ 
  imageSrc, 
  onClose, 
  customWidth
}) => {
  const [breakpoint] = useAtom(breakpointAtom);
  const { setCursorType } = useCursor();
  const isMobile = breakpoint === 'mobile';
  const [isHovered, setIsHovered] = useState(false);
  
  // Handle cursor change on hover
  const handleCloseButtonMouseEnter = () => {
    setCursorType('pointing');
    setIsHovered(true);
  };

  const handleCloseButtonMouseLeave = () => {
    setCursorType('open');
    setIsHovered(false);
  };

  // Handle close with sound
  const handleClose = () => {
    playMouseClickSound();
    onClose();
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" 
      style={{ background: 'rgba(0, 0, 0, 0.7)' }}
    >
      <div className="relative" 
        style={{ 
          width: customWidth,
          maxHeight: '85vh',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          onMouseEnter={handleCloseButtonMouseEnter}
          onMouseLeave={handleCloseButtonMouseLeave}
          className="absolute rounded-full flex items-center justify-center z-30"
          style={{ 
            top: isMobile ? '-5%' : '-3%', 
            right: isMobile ? '-5%' : '-3%',
            width: isMobile ? '5px' : '9px',
            height: isMobile ? '5px' : '9px',
            backgroundColor: '#fffff0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
            color: '#4a5568',
            cursor: 'pointer',
            filter: isHovered ? 'brightness(0.85)' : 'brightness(1)'
          }}
        >
          <AiOutlineClose size={isMobile ? 3 : 5} />
        </button>
        
        {/* Photo */}
        <img 
          src={imageSrc} 
          alt="Computer Photo"
          className="w-full object-contain"
          style={{ 
            maxHeight: '80vh'
          }}
        />
      </div>
    </div>
  );
};

export default PhotoViewer; 