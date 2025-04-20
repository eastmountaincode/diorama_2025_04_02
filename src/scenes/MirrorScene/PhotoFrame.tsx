import React, { useRef, useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { breakpointAtom, isPhotoDisplayedAtom } from '../../atoms/gameState';
import { createFramedPhotoDownload } from '../../util/photoUtils';
import { useCursor } from '../../context/CursorContext';
import { playMouseClickSound } from '../../util/sound';

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

  // Check if the image is from camera (data URL) or a fallback image (file path)
  const isFromCamera = imageData?.startsWith('data:');

  // Update the photo display status when component mounts/unmounts
  useEffect(() => {
    // Set photo as displayed when component mounts
    setIsPhotoDisplayed(true);
    
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

  // Wrap the onClose handler to update the atom and play sound
  const handleClose = () => {
    playMouseClickSound();
    setIsPhotoDisplayed(false);
    onClose();
  };

  const handleDownload = () => {
    if (!imageData || !frameRef.current || !photoRef.current || !frameLoaded || !photoLoaded) return;
    
    // Use the utility function to create and download the framed photo
    createFramedPhotoDownload(
      photoRef.current,
      frameRef.current,
      6,  // top percentage
      8,  // left percentage
      84, // width percentage
      81  // height percentage
    );
  };

  if (!imageData) return null;

  // Style for the container - using the transform offset that worked
  const containerStyle = {
    position: 'absolute' as const,
    left: isMobile ? '50%' : '50%',
    top: isMobile ? '50%' : '49%',
    transform: isMobile ? 'translate(-25%, -50%)' : 'translate(-50%, -50%)',
    width: isMobile ? '105px' : '230px',
    backgroundColor: 'transparent',
  };

  // Style for download button
  const buttonStyle = {
    fontSize: isMobile ? '8px' : '14px',
    padding: isMobile ? '2px 6px' : '6px 12px',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '4px',
    marginTop: isMobile ? '4px' : '8px',
    border: 'none',
    cursor: 'pointer'
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
              width: '84%',
              height: '81%',
              top: '6%',
              left: '8%',
              overflow: 'hidden',
              borderRadius: '4px'
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
                objectPosition: isFromCamera ? 'center' : 'center 35%',
                margin: isFromCamera ? '0' : '5% auto 0'
              }} 
              onLoad={handlePhotoLoad}
            />
          </div>
          
          {/* Frame overlay */}
          <img 
            ref={frameRef}
            src="assets/bg/mirror/mirror_scene_photo_frame.png" 
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
              top: '5%', 
              right: '5%',
              width: isMobile ? '10px' : '24px',
              height: isMobile ? '10px' : '24px',
              backgroundColor: '#e53e3e', // red-600 equivalent
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1
            }}
          >
            <span 
              style={{ 
                color: 'white',
                fontWeight: 'bold',
                fontSize: isMobile ? '8px' : '14px',
                marginTop: isMobile ? '-1px' : '-2px',
                textAlign: 'center'
              }}
            >
              &times;
            </span>
          </button>
        </div>
        
        {/* Download button - only show for camera images */}
        {isFromCamera && (
          <div className="flex justify-center">
            <button 
              onClick={handleDownload}
              disabled={!frameLoaded || !photoLoaded}
              style={{
                ...buttonStyle,
                opacity: (!frameLoaded || !photoLoaded) ? 0.5 : 1,
                cursor: (!frameLoaded || !photoLoaded) ? 'not-allowed' : 'pointer'
              }}
            >
              Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoFrame; 