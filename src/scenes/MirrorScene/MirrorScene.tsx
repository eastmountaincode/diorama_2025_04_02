import React, { useEffect, useState, useRef } from 'react';
import { useAtom } from 'jotai';
import { 
  currentSceneAtom, 
  cameraPermissionStatusAtom,
  mirrorTaskCompletedAtom,
  breakpointAtom
} from '../../atoms/gameState';

const MirrorScene: React.FC = () => {
  const [currentScene] = useAtom(currentSceneAtom);
  const [cameraPermissionStatus, setCameraPermissionStatus] = useAtom(cameraPermissionStatusAtom);
  const [_, setMirrorTaskCompleted] = useAtom(mirrorTaskCompletedAtom);
  const [hasRequestedCamera, setHasRequestedCamera] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [breakpoint] = useAtom(breakpointAtom);
  const isMobile = breakpoint === 'mobile';
  
  // Reference to video element
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  
  // Add state for background transition
  const [showSecondBackground, setShowSecondBackground] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [sceneEntered, setSceneEntered] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  // Request camera access when component mounts
  useEffect(() => {
    // Only try once when we first enter the MirrorScene
    if (currentScene === 'MirrorScene' && !hasRequestedCamera && cameraPermissionStatus === 'not-requested') {
      requestCameraAccess();
      setHasRequestedCamera(true);
    }
  }, [currentScene, hasRequestedCamera, cameraPermissionStatus]);

  // Track when we enter and leave the scene
  useEffect(() => {
    if (currentScene === 'MirrorScene') {
      // Reset animation states when entering the scene
      setShowSecondBackground(false);
      setOverlayOpacity(0);
      setSceneEntered(true);
      setShowCamera(false);
    } else {
      setSceneEntered(false);
    }
  }, [currentScene]);
  
  // Trigger background transition after camera permission interaction or scene re-enter
  useEffect(() => {
    // Trigger transition when entering scene (with permission already handled)
    if (sceneEntered && cameraPermissionStatus !== 'not-requested') {
      // Short delay before starting transition
      const timer = setTimeout(() => {
        setShowSecondBackground(true);
        
        // Fade in the overlay
        setTimeout(() => {
          setOverlayOpacity(1);
          
          // Only show camera after overlay is fully visible
          setTimeout(() => {
            if (cameraPermissionStatus === 'granted') {
              setShowCamera(true);
            }
          }, 1000); // Delay after overlay starts fading in
          
        }, 100);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [sceneEntered, cameraPermissionStatus]);

  // Track when we leave the scene to reset camera visibility
  useEffect(() => {
    if (currentScene !== 'MirrorScene') {
      setShowCamera(false);
    }
  }, [currentScene]);

  // Start camera stream when permission is granted
  useEffect(() => {
    if (currentScene === 'MirrorScene' && cameraPermissionStatus === 'granted') {
      startCameraStream();
    }
    
    // Clean up stream when leaving scene
    return () => {
      if (streamActive) {
        stopCameraStream();
      }
    };
  }, [currentScene, cameraPermissionStatus]);

  // Start camera stream
  const startCameraStream = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage('Camera API not available');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreamActive(true);
        setMirrorTaskCompleted(true);
      }
    } catch (error) {
      console.error('Error starting camera stream:', error);
      setErrorMessage('Could not start camera stream');
    }
  };
  
  // Stop camera stream
  const stopCameraStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setStreamActive(false);
    }
  };

  // Handle requesting camera access
  const requestCameraAccess = async () => {
    try {
      // Check if camera API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraPermissionStatus('dismissed');
        setErrorMessage('Camera not available on this device or browser');
        return;
      }
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Stop all tracks to release camera immediately
      stream.getTracks().forEach(track => track.stop());
      
      setCameraPermissionStatus('granted');
      setErrorMessage(null);
      // Don't set task completed here, do it when the stream starts
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      
      if (error.name === 'NotAllowedError') {
        setCameraPermissionStatus('denied');
      } else {
        setCameraPermissionStatus('dismissed');
        setErrorMessage(`Camera error: ${error.message || 'Unknown error'}`);
      }
    }
  };

  // Show UI elements based on camera permission status
  const renderUI = () => {
    if (errorMessage) {
      return (
        <div className={`absolute bg-black bg-opacity-70 rounded-lg z-30 ${
          isMobile 
            ? 'bottom-2 right-2 p-1 max-w-[150px]' 
            : 'bottom-4 right-4 p-2'
        }`}>
          <p className={`text-white ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
            {isMobile && errorMessage.length > 50 
              ? errorMessage.substring(0, 50) + '...' 
              : errorMessage}
          </p>
        </div>
      );
    }
    
    return null;
  };

  // Render camera feed with percentage-based positioning
  const renderCameraFeed = () => {
    // Calculate size based on device type
    const cameraStyles = {
      width: isMobile ? '40%' : '28%',
      height: isMobile ? '35%' : '48%',
      top: isMobile ? '50%' : '52%', 
      left: '67%',
      transform: 'translate(-50%, -50%)',
      position: 'absolute' as const,
      zIndex: 1, // Always behind overlays
      opacity: showCamera ? 1 : 0, // Only visible when showCamera is true
      transition: 'opacity 0.5s ease-in-out' // Smooth fade in
    };

    // Always render the feed, but control visibility with opacity
    return (
      <div style={cameraStyles}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: isMobile ? 'scale(0.75) scaleX(-1)' : 'scaleX(-1)' }}
        />
      </div>
    );
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center relative"
      style={{
        backgroundImage: "url('assets/bg/mirror/mirror_close_up.png')",
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        pointerEvents: currentScene === 'MirrorScene' ? 'auto' : 'none',
        position: 'relative',
        display: currentScene === 'MirrorScene' ? 'flex' : 'none',
      }}
    >
      {/* Camera feed with percentage-based positioning */}
      {cameraPermissionStatus === 'granted' && renderCameraFeed()}
      
      {/* Overlay cutout image that fades in */}
      {showSecondBackground && (
        <div 
          className="absolute inset-0 transition-opacity duration-1500 ease-in-out"
          style={{
            backgroundImage: "url('assets/bg/mirror/mirror_close_up_cut_out.png')",
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: overlayOpacity,
            pointerEvents: 'none',
            zIndex: 10
          }}
        />
      )}
      
      {/* UI elements (error messages) */}
      {renderUI()}
    </div>
  );
};

export default MirrorScene; 