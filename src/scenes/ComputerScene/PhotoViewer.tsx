import React from 'react';
import { useAtom } from 'jotai';
import { breakpointAtom } from '../../atoms/gameState';
import { useCursor } from '../../context/CursorContext';
import { playMouseClickSound } from '../../util/sound';

interface PhotoViewerProps {
  imageSrc: string;
  onClose: () => void;
}

const PhotoViewer: React.FC<PhotoViewerProps> = ({ imageSrc, onClose }) => {
  const [breakpoint] = useAtom(breakpointAtom);
  const { setCursorType } = useCursor();
  const isMobile = breakpoint === 'mobile';

  // Handle cursor change on hover
  const handleCloseButtonMouseEnter = () => {
    setCursorType('pointing');
  };

  const handleCloseButtonMouseLeave = () => {
    setCursorType('neutral');
  };

  // Handle close with sound
  const handleClose = () => {
    playMouseClickSound();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0, 0, 0, 0.7)' }}>
      <div className="relative" style={{ 
        width: isMobile ? '15%' : '20%',
        maxHeight: '60vh',
      }}>
        {/* Close button */}
        <button
          onClick={handleClose}
          onMouseEnter={handleCloseButtonMouseEnter}
          onMouseLeave={handleCloseButtonMouseLeave}
          className="absolute bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 flex items-center justify-center"
          style={{ 
            zIndex: 60,
            width: isMobile ? '6px' : '10px',
            height: isMobile ? '6px' : '10px',
            top: isMobile ? '-2px' : '-2px',
            right: isMobile ? '0px' : '2px',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg 
            viewBox="0 0 24 24" 
            width={isMobile ? '4px' : '6px'} 
            height={isMobile ? '4px' : '6px'}
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        
        {/* Photo */}
        <img 
          src={imageSrc} 
          alt="Computer Photo"
          className="w-full object-contain rounded-md shadow-lg"
          style={{ 
            maxHeight: isMobile ? '50vh' : '45vh'
          }}
        />
      </div>
    </div>
  );
};

export default PhotoViewer; 