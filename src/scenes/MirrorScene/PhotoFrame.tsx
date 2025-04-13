import React, { useRef, useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { breakpointAtom, isPhotoDisplayedAtom } from '../../atoms/gameState';
import { createFramedPhotoDownload } from '../../util/photoUtils';

interface PhotoFrameProps {
  imageData: string | null;
  onClose: () => void;
}

const PhotoFrame: React.FC<PhotoFrameProps> = ({ imageData, onClose }) => {
  const [breakpoint] = useAtom(breakpointAtom);
  const [_, setIsPhotoDisplayed] = useAtom(isPhotoDisplayedAtom);
  const isMobile = breakpoint === 'mobile';
  const photoRef = useRef<HTMLImageElement>(null);
  const frameRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black" >
      <div 
        ref={containerRef}
        style={{ 
          width: isMobile ? '33%' : '40%',
        }}
        className="relative border-2 border-white"
      >
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
              width: isMobile ? '12px' : '24px',
              height: isMobile ? '12px' : '24px',
              backgroundColor: '#e53e3e', // red-600 equivalent
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1
            }}
          >
            <span 
              className={`text-white font-bold ${isMobile ? 'text-[9px]' : 'text-sm'}`}
              style={{ 
                marginTop: isMobile ? '-0.5px' : '-2px',
                marginLeft: isMobile ? '0.5px' : '-0px',
                display: 'block',
                textAlign: 'center'
              }}
            >
              &times;
            </span>
          </button>
        </div>
        
        {/* Download button */}
        <button 
          onClick={handleDownload}
          disabled={!frameLoaded || !photoLoaded}
          className={`mt-2 mx-auto block bg-blue-600 text-white rounded-lg z-30 ${
            isMobile ? 'text-xs px-3 py-1' : 'text-sm px-4 py-1'
          } ${(!frameLoaded || !photoLoaded) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Download Photo
        </button>
      </div>
    </div>
  );
};

export default PhotoFrame; 