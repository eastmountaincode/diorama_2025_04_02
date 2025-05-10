import React, { useRef, useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { breakpointAtom, isPhotoDisplayedAtom } from '../../atoms/gameState';
import { createFramedPhotoDownload } from '../../util/photoUtils';
import { useCursor } from '../../context/CursorContext';
import { AiOutlineClose, AiOutlineSave } from 'react-icons/ai';

interface PhotoFrameProps {
  imageData: string | null;
  onClose: () => void;
}

const PhotoFrame: React.FC<PhotoFrameProps> = ({ imageData, onClose }) => {
  const [breakpoint] = useAtom(breakpointAtom);
  const [_, setIsPhotoDisplayed] = useAtom(isPhotoDisplayedAtom);
  const { setCursorType } = useCursor();
  const isMobile = breakpoint === 'mobile';
  const photoRef = useRef<HTMLImageElement>(null);
  const frameRef = useRef<HTMLImageElement>(null);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const [frameNumber, setFrameNumber] = useState<number>(0);

  // Check if the image is from camera (data URL) or a fallback image (file path)
  const isFromCamera = imageData?.startsWith('data:');

  // Update the photo display status when component mounts/unmounts
  useEffect(() => {
    // Set photo as displayed when component mounts
    setIsPhotoDisplayed(true);
    
    // Pick a random frame number between 19 and 26
    const randomFrame = Math.floor(Math.random() * 8) + 19;
    setFrameNumber(randomFrame);
    
    // Reset when component unmounts
    return () => {
      setIsPhotoDisplayed(false);
    };
  }, [setIsPhotoDisplayed]);

  // Handle when images are loaded
  const handleFrameLoad = () => setFrameLoaded(true);
  const handlePhotoLoad = () => setPhotoLoaded(true);

  // Handle cursor changes for close button
  const handleCloseButtonMouseEnter = () => {
    setCursorType('pointing');
  };

  const handleCloseButtonMouseLeave = () => {
    setCursorType('open');
  };

  const handleDownloadButtonMouseEnter = () => {
    setCursorType('pointing');
  };

  const handleDownloadButtonMouseLeave = () => {
    setCursorType('open');
  };

  // Wrap the onClose handler to update the atom and play sound
  const handleClose = () => {
    setIsPhotoDisplayed(false);
    onClose();
  };

  const handleDownload = () => {
    if (!imageData || !frameRef.current || !photoRef.current || !frameLoaded || !photoLoaded) return;
    
    // Use the utility function to create and download the framed photo
    createFramedPhotoDownload(
      photoRef.current,
      frameRef.current,
      4,  // top percentage
      6,  // left percentage
      88, // width percentage
      81  // height percentage
    );
  };

  if (!imageData) return null;

  const containerStyle = {
    position: 'absolute' as const,
    left: isMobile ? '50%' : '50%',
    top: isMobile ? '50%' : '49%',
    transform: isMobile ? 'translate(-25%, -50%)' : 'translate(-50%, -50%)',
    width: isMobile ? '105px' : '35%',
    backgroundColor: 'transparent',
  };

  // Style for download button
  const buttonStyle = {
    fontFamily: 'monospace',
    fontSize: isMobile ? '8px' : '14px',
    padding: isMobile ? '2px 6px' : '6px 12px',
    backgroundColor: '#fffff0',
    color: '#4a5568',
    borderRadius: '2px',
    marginTop: isMobile ? '4px' : '8px',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div style={containerStyle}>
        {/* Frame Container */}
        <div className="relative">
          {/* Photo inside frame */}
          <div 
            className="absolute z-10" 
            style={{
              width: '88%',
              height: '81%',
              top: '4%',
              left: '6%',
              overflow: 'hidden'
            }}
          >
            <img 
              ref={photoRef}
              src={imageData} 
              alt="Your selfie" 
              className={`${isFromCamera ? 'w-full h-full object-cover' : 'object-contain'}`}
              style={{ 
                transform: isFromCamera ? 'scaleX(-1)' : 'none', // Only mirror camera images
                width: isFromCamera ? '100%' : '90%',
                height: isFromCamera ? '100%' : '80%',
                objectPosition: isFromCamera ? 'center' : 'center 47.5%',
                margin: isFromCamera ? '0' : '10% auto 0'
              }} 
              onLoad={handlePhotoLoad}
            />
          </div>
          
          {/* Frame overlay */}
          <img 
            ref={frameRef}
            src={`assets/bg/mirror/photo_frames/${frameNumber}.png`}
            alt="Photo frame" 
            className="w-full relative z-20" 
            onLoad={handleFrameLoad}
            crossOrigin="anonymous"
          />
          
          {/* Close button */}
          <button 
            onClick={handleClose}
            onMouseEnter={handleCloseButtonMouseEnter}
            onMouseLeave={handleCloseButtonMouseLeave}
            className="absolute rounded-full flex items-center justify-center z-30"
            style={{ 
              top: isMobile ? '-5%' : '-2%', 
              right: isMobile ? '-5%' : '-2%',
              width: isMobile ? '15px' : '24px',
              height: isMobile ? '15px' : '24px',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0',

              cursor: 'pointer',
              backgroundColor: '#fffff0',
            color: '#4a5568'
            }}
          >
            <AiOutlineClose size={isMobile ? 10 : 16} />
          </button>
        </div>
        
        {/* Download button - only show for camera images */}
        {isFromCamera && (
          <div className="flex justify-center">
            <button 
              onClick={handleDownload}
              onMouseEnter={handleDownloadButtonMouseEnter}
              onMouseLeave={handleDownloadButtonMouseLeave}
              disabled={!frameLoaded || !photoLoaded}
              style={{
                ...buttonStyle,
                opacity: (!frameLoaded || !photoLoaded) ? 0.5 : 1,
                cursor: (!frameLoaded || !photoLoaded) ? 'not-allowed' : 'pointer',
                backgroundColor: '#fffff0',
                color: '#4a5568'
              }}
              className="flex items-center justify-center"
            >
              <AiOutlineSave 
                size={isMobile ? 12 : 16} 
                className={isMobile ? "mr-1" : "mr-1.5"} 
              />
              <span>Download</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoFrame; 