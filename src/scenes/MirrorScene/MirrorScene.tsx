import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { 
  currentSceneAtom, 
  cameraPermissionStatusAtom,
  breakpointAtom
} from '../../atoms/gameState';
import CameraVideoFeed from '../../components/CameraVideoFeed';

const MirrorScene: React.FC = () => {
  const [currentScene] = useAtom(currentSceneAtom);
  const [cameraPermissionStatus, setCameraPermissionStatus] = useAtom(cameraPermissionStatusAtom);
  const [hasRequestedCamera, setHasRequestedCamera] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [breakpoint] = useAtom(breakpointAtom);
  const isMobile = breakpoint === 'mobile';
  
  // State for background transition.
  // "showSecondBackground" now represents whether the top (non-cut-out) layer has faded out.
  const [showSecondBackground, setShowSecondBackground] = useState(false);
  const [sceneEntered, setSceneEntered] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  // Request camera access when component mounts
  useEffect(() => {
    if (
      currentScene === 'MirrorScene' &&
      !hasRequestedCamera &&
      cameraPermissionStatus === 'not-requested'
    ) {
      requestCameraAccess();
      setHasRequestedCamera(true);
    }
  }, [currentScene, hasRequestedCamera, cameraPermissionStatus]);

  // Reset states when entering the scene
  useEffect(() => {
    if (currentScene === 'MirrorScene') {
      // Reset animation states when entering
      setShowSecondBackground(false);
      setSceneEntered(true);
      setShowCamera(false);
    } else {
      setSceneEntered(false);
    }
  }, [currentScene]);

  // Trigger transition after camera permission has been handled.
  useEffect(() => {
    if (sceneEntered && cameraPermissionStatus !== 'not-requested') {
      const timer = setTimeout(() => {
        // Fade out the top (non-cut-out) background layer.
        setShowSecondBackground(true);

        // Optionally, if permission is granted, show CameraMirror after a short delay.
        if (cameraPermissionStatus === 'granted') {
          setTimeout(() => {
            setShowCamera(true);
          }, 200); // delay after the fade-out begins
        }
      }, 900); // initial delay before starting the transition
      return () => clearTimeout(timer);
    }
  }, [sceneEntered, cameraPermissionStatus]);

  // Reset camera visibility when leaving the scene
  useEffect(() => {
    if (currentScene !== 'MirrorScene') {
      setShowCamera(false);
    }
  }, [currentScene]);

  // Handle requesting camera access
  const requestCameraAccess = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraPermissionStatus('dismissed');
        setErrorMessage('Camera not available on this device or browser');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Stop all tracks immediately since we just need permission status
      stream.getTracks().forEach(track => track.stop());

      setCameraPermissionStatus('granted');
      setErrorMessage(null);
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

  // Render UI elements (like error messages)
  const renderUI = () => {
    if (errorMessage) {
      return (
        <div
          className={`absolute bg-black bg-opacity-70 rounded-lg z-30 ${
            isMobile ? 'bottom-2 right-2 p-1 max-w-[150px]' : 'bottom-4 right-4 p-2'
          }`}
        >
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
      className="w-full h-full flex items-center justify-center relative"
      style={{
        pointerEvents: currentScene === 'MirrorScene' ? 'auto' : 'none',
        display: currentScene === 'MirrorScene' ? 'flex' : 'none',
      }}
    >
      {/* Camera Feed - now positioned below the cut-out layer but above any backgrounds */}
      <CameraVideoFeed
        isActive={currentScene === 'MirrorScene'}
        permissionStatus={cameraPermissionStatus}
        showCamera={showCamera}
        isMobile={isMobile}
        onError={setErrorMessage}
      />

      {/* Lower layer: Always shown (cut-out layer, i.e. mirror_close_up_cut_out.png) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('assets/bg/mirror/mirror_close_up_cut_out.png')",
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 10, // Increase z-index to be above camera feed
        }}
      />

      {/* Top layer: Non-cut-out image (mirror_close_up.png)
          This layer fades out after camera permission is handled */}
      <div
        className="absolute inset-0 transition-opacity duration-1500 ease-in-out"
        style={{
          backgroundImage: "url('assets/bg/mirror/mirror_close_up.png')",
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: showSecondBackground ? 0 : 1,
          zIndex: 15, // Highest z-index to be on top of everything when visible
        }}
      />

      {/* UI elements such as error messages */}
      {renderUI()}
    </div>
  );
};

export default MirrorScene;
