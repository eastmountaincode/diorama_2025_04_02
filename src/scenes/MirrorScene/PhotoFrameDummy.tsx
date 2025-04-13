import React, { useRef, useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { breakpointAtom, isPhotoDisplayedAtom } from '../../atoms/gameState';
import { createFramedPhotoDownload } from '../../util/photoUtils';

interface PhotoFrameDummyProps {
  imageData: string | null;
  onClose: () => void;
}

const PhotoFrameDummy: React.FC<PhotoFrameDummyProps> = ({ imageData, onClose }) => {
  const [breakpoint] = useAtom(breakpointAtom);
  const [_, setIsPhotoDisplayed] = useAtom(isPhotoDisplayedAtom);
  const isMobile = breakpoint === 'mobile';
  const photoRef = useRef<HTMLImageElement>(null);
  const frameRef = useRef<HTMLImageElement>(null);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const [photoLoaded, setPhotoLoaded] = useState(false);

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

  // Wrap the onClose handler to update the atom
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
    transform: isMobile ? 'translate(-24%, -50%)' : 'translate(-50%, -50%)',
    width: isMobile ? '100px' : '230px',
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
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }} // Mirror the image
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
        
        {/* Download button */}
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
      </div>
    </div>
  );
};

export default PhotoFrameDummy; 