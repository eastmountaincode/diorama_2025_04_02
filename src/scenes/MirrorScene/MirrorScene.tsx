import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { 
  currentSceneAtom, 
  cameraPermissionStatusAtom,
  breakpointAtom,
  mirrorTransitionCompleteAtom,
  mirrorTaskCompletedAtom
} from '../../atoms/gameState';
import CameraVideoFeed from '../../components/CameraVideoFeed';
import PhotoFrame from './PhotoFrame';
import { capturePhotoTriggerAtom } from '../../components/HUDFrame/HUDFrame';
import { useMirrorRingSound } from './useMirrorRingSound';

const MirrorScene: React.FC = () => {
  const [currentScene] = useAtom(currentSceneAtom);
  const [cameraPermissionStatus, setCameraPermissionStatus] = useAtom(cameraPermissionStatusAtom);
  const [hasRequestedCamera, setHasRequestedCamera] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [breakpoint] = useAtom(breakpointAtom);
  const [_, setMirrorTransitionComplete] = useAtom(mirrorTransitionCompleteAtom);
  const [mirrorTaskCompleted, setMirrorTaskCompleted] = useAtom(mirrorTaskCompletedAtom);
  const isMobile = breakpoint === 'mobile';
  
  // Use our Web Audio API hooks for sounds
  const { playSound: playRingSound } = useMirrorRingSound();
  
  // State for background transition.
  // "showSecondBackground" now represents whether the top (non-cut-out) layer has faded out.
  const [showSecondBackground, setShowSecondBackground] = useState(false);
  const [sceneEntered, setSceneEntered] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showRippleEffect, setShowRippleEffect] = useState(false);
  
  // Add states for photo capturing
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  // Listen for photo capture trigger from HUDFrame
  const [capturePhotoTrigger] = useAtom(capturePhotoTriggerAtom);
  
  // Always reset the transition complete state when mounting/unmounting
  useEffect(() => {
    // Reset when component mounts
    setMirrorTransitionComplete(false);
    
    // Reset when component unmounts
    return () => {
      setMirrorTransitionComplete(false);
    };
  }, [setMirrorTransitionComplete]);

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
      setShowRippleEffect(false);
      // Always ensure transition complete is reset on entry
      setMirrorTransitionComplete(false);
      // Reset captured photo when re-entering the scene
      setCapturedPhoto(null);
      // We don't reset mirrorTaskCompleted here - once completed, it stays completed
    } else {
      // If we're not in the mirror scene, reset entered state
      setSceneEntered(false);
    }
  }, [currentScene, setMirrorTransitionComplete]);

  // Always ensure mirror transition state is reset when leaving
  useEffect(() => {
    // Only run this cleanup when component is mounted
    return () => {
      // When component is unmounting, reset the state
      setMirrorTransitionComplete(false);
    };
  }, [setMirrorTransitionComplete]);

  // Trigger transition after camera permission has been handled.
  useEffect(() => {
    if (sceneEntered && cameraPermissionStatus !== 'not-requested') {
      const timer = setTimeout(() => {
        // Fade out the top (non-cut-out) background layer.
        setShowSecondBackground(true);

        // If permission is granted, show CameraMirror after a short delay
        if (cameraPermissionStatus === 'granted') {
          setTimeout(() => {
            setShowCamera(true);
            
            // Mark transition as complete after camera appears
            setTimeout(() => {
              setMirrorTransitionComplete(true);
            }, 800);
          }, 200); // delay after the fade-out begins
        } else {
          // If camera permission is not granted, show ripple effect instead
          setTimeout(() => {
            setShowRippleEffect(true);
            
            // Mark transition as complete after ripple appears
            setTimeout(() => {
              setMirrorTransitionComplete(true);
            }, 800);
          }, 200);
        }
      }, 900); // initial delay before starting the transition
      return () => {
        clearTimeout(timer);
        setMirrorTransitionComplete(false); // Reset when effect is cleaned up
      };
    }
  }, [sceneEntered, cameraPermissionStatus, setMirrorTransitionComplete]);

  // Reset camera visibility when leaving the scene
  useEffect(() => {
    if (currentScene !== 'MirrorScene') {
      setShowCamera(false);
      setShowRippleEffect(false);
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

  // Function to capture photo from video stream or use fallback image
  const capturePhoto = () => {
    // Camera sound is now played by ReaffirmButton, no need to play it here
    
    // If camera permission is not granted, use the fallback image
    if (cameraPermissionStatus !== 'granted') {
      setCapturedPhoto('assets/figure/Laila_sprite_cropped.png');
      
      // Only mark task as completed and play sound if not already completed
      if (!mirrorTaskCompleted) {
        setMirrorTaskCompleted(true);
        // Use Web Audio API version of the sound
        playRingSound();
      }
      return;
    }

    // Use the CameraVideoFeed's video element to capture the photo
    const videoElement = document.querySelector('video');
    if (!videoElement) {
      setErrorMessage('Cannot find video element');
      return;
    }

    // Create a canvas element to draw the video frame
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    // Draw the current video frame to the canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setErrorMessage('Cannot create canvas context');
      return;
    }
    
    // Draw the video frame
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    // Get the data URL from the canvas
    const dataUrl = canvas.toDataURL('image/png');
    setCapturedPhoto(dataUrl);
    
    // Only mark task as completed and play sound if not already completed
    if (!mirrorTaskCompleted) {
      setMirrorTaskCompleted(true);
      // Use Web Audio API version of the sound
      playRingSound();
    }
  };

  // Function to close the photo view
  const closePhotoView = () => {
    setCapturedPhoto(null);
  };

  // Ripple effect styles - similar positioning to camera feed
  const rippleStyles = {
    width: isMobile ? '40%' : '28%',
    height: isMobile ? '35%' : '48%',
    top: isMobile ? '50%' : '52%',
    left: '67%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute' as const,
    zIndex: cameraPermissionStatus === 'granted' ? 6 : 5, // Above camera feed when granted, same level otherwise
    opacity: showRippleEffect ? (cameraPermissionStatus === 'granted' ? 1 : 1) : 1, // 50% opacity when camera is showing
    transition: 'opacity 0.5s ease-in-out',
    objectFit: 'cover' as const,
    borderRadius: '4px',
    mixBlendMode: cameraPermissionStatus === 'granted' ? 'overlay' as const : 'normal' as const, // Blend with camera feed when granted
    filter: 'grayscale(100%)',
    scale: 2
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
          <p className={`text-white ${isMobile ? 'text-[10px]' : 'text-xs'} font-mono`}>
            {isMobile && errorMessage.length > 50
              ? errorMessage.substring(0, 50) + '...'
              : errorMessage}
          </p>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    if (capturePhotoTrigger && !capturedPhoto) {
      // Now the ReaffirmButton is playing the camera sound using Web Audio API
      // So we can just call capturePhoto directly without worrying about duplicate sounds
      capturePhoto();
    }
  }, [capturePhotoTrigger, capturedPhoto]);

  return (
    <div
      className="w-full h-full flex items-center justify-center relative"
      style={{
        pointerEvents: currentScene === 'MirrorScene' ? 'auto' : 'none',
        display: currentScene === 'MirrorScene' ? 'flex' : 'none',
      }}
    >
      {/* Camera Feed - shown when camera permission is granted */}
      <CameraVideoFeed
        isActive={currentScene === 'MirrorScene'}
        permissionStatus={cameraPermissionStatus}
        showCamera={showCamera}
        isMobile={isMobile}
        onError={setErrorMessage}
      />

      {/* Water Ripple GIF - shown regardless of permission, but with different opacity/z-index */}
      <img
        src="assets/bg/mirror/water_ripple.gif"
        alt="Water Ripple Effect"
        style={rippleStyles}
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

      {/* Use PhotoFrame with the captured photo */}
      {capturedPhoto && (
        <PhotoFrame
          imageData={capturedPhoto}
          onClose={closePhotoView}
        />
      )}
    </div>
  );
};

export default MirrorScene;
