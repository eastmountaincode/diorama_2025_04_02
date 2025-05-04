import React from 'react';
import { useAtom } from 'jotai';
import { IoClose } from 'react-icons/io5';
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
  
  // Handle cursor change on hover
  const handleCloseButtonMouseEnter = () => {
    setCursorType('pointing');
  };

  const handleCloseButtonMouseLeave = () => {
    setCursorType('open');
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
          className="absolute bg-black bg-opacity-60 text-white rounded-full hover:bg-opacity-80 flex items-center justify-center"
          style={{ 
            zIndex: 99,
            width: isMobile ? '6px' : '18px',
            height: isMobile ? '6px' : '18px',
            top: isMobile ? '-2px' : '-10px',
            right: isMobile ? '-2px' : '-10px',
          }}
        >
          <IoClose />
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