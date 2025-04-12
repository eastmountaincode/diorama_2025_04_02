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

  // Request camera access when component mounts
  useEffect(() => {
    // Only try once when we first enter the MirrorScene
    if (currentScene === 'MirrorScene' && !hasRequestedCamera && cameraPermissionStatus === 'not-requested') {
      requestCameraAccess();
      setHasRequestedCamera(true);
    }
  }, [currentScene, hasRequestedCamera, cameraPermissionStatus]);

  // Start camera stream when permission is granted
  useEffect(() => {
    if (currentScene === 'MirrorScene' && cameraPermissionStatus === 'granted' && !streamActive) {
      startCameraStream();
    }
    
    // Clean up stream when leaving scene or losing permission
    return () => {
      if (streamActive) {
        stopCameraStream();
      }
    };
  }, [currentScene, cameraPermissionStatus, streamActive]);

  // Start camera stream
  const startCameraStream = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage('Camera API not available');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
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

  // Show content based on camera permission status
  const renderContent = () => {
    // Camera granted - show the video feed
    if (cameraPermissionStatus === 'granted') {
      return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {/* Mirror-like frame container */}
          <div 
            className={`relative rounded-lg overflow-hidden border-4 border-gray-800 shadow-lg ${
              isMobile ? 'w-[70vw] h-[60vh]' : 'w-[500px] h-[400px]'
            }`}
          >
            {/* Camera feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute w-full h-full object-cover"
              style={{ 
                transform: 'scaleX(-1)' // Mirror the video horizontally
              }}
            />
            
            {/* Subtle overlay to make it look more like a mirror */}
            <div className="absolute inset-0 bg-white opacity-10 pointer-events-none"></div>
          </div>
        </div>
      );
    }
    
    // Denied state - show a retry button
    if (cameraPermissionStatus === 'denied') {
      return (
        <button 
          onClick={requestCameraAccess}
          className={`absolute bg-blue-600 text-white rounded ${
            isMobile 
              ? 'bottom-2 right-2 px-2 py-0.5 text-[10px]' 
              : 'bottom-4 right-4 px-3 py-1 text-xs'
          }`}
        >
          Enable Camera
        </button>
      );
    }
    
    // Only show message for errors, not for standard permission states
    if (errorMessage) {
      return (
        <div className={`absolute bg-black bg-opacity-70 rounded-lg ${
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

  return (
    <div
      className="w-full h-full flex items-center justify-center z-20"
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
      {renderContent()}
    </div>
  );
};

export default MirrorScene; 