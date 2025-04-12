import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { 
  cameraPermissionStatusAtom, 
  showCameraPermissionModalAtom, 
  breakpointAtom
} from '../../atoms/gameState';

export const CameraPermissionModal: React.FC = () => {
  const [cameraPermissionStatus, setCameraPermissionStatus] = useAtom(cameraPermissionStatusAtom);
  const [showCameraPermissionModal, setShowCameraPermissionModal] = useAtom(showCameraPermissionModalAtom);
  const [breakpoint] = useAtom(breakpointAtom);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Request camera permissions
  const requestCameraPermission = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Stop all tracks to release camera immediately
      stream.getTracks().forEach(track => track.stop());
      setCameraPermissionStatus('granted');
      setShowCameraPermissionModal(false);
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      setCameraPermissionStatus('denied');
      
      // Handle different error types
      if (error.name === 'NotAllowedError') {
        setErrorMessage('Camera access was denied. Please allow camera access in your browser settings.');
      } else if (error.name === 'NotFoundError') {
        setErrorMessage('No camera was found on your device.');
      } else if (error.name === 'NotReadableError') {
        setErrorMessage('Your camera is in use by another application.');
      } else {
        setErrorMessage(`Camera error: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deny button click
  const handleDenyPermission = () => {
    setCameraPermissionStatus('denied');
    setShowCameraPermissionModal(false);
  };

  // Handle dismiss button click
  const handleDismissModal = () => {
    setCameraPermissionStatus('dismissed');
    setShowCameraPermissionModal(false);
  };

  // Try to get camera permission status on mount
  useEffect(() => {
    // Only check if we haven't requested permissions yet
    if (cameraPermissionStatus === 'not-requested') {
      navigator.permissions?.query({ name: 'camera' as PermissionName })
        .then(result => {
          if (result.state === 'granted') {
            setCameraPermissionStatus('granted');
            setShowCameraPermissionModal(false);
          } else if (result.state === 'denied') {
            setCameraPermissionStatus('denied');
            setErrorMessage('Camera access was denied in your browser settings.');
          }
        })
        .catch(error => {
          console.error('Error checking camera permission:', error);
          // If permissions API isn't available, we'll just ask directly later
        });
    }
  }, [cameraPermissionStatus, setCameraPermissionStatus, setShowCameraPermissionModal]);

  if (!showCameraPermissionModal) {
    return null;
  }

  const isMobile = breakpoint === 'mobile';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div 
        className={`bg-gray-800 text-white rounded-lg shadow-xl p-6 max-w-lg mx-4 ${
          isMobile ? 'w-11/12' : 'w-2/3'
        }`}
      >
        <h2 className="text-xl font-bold mb-4">Camera Access Required</h2>
        <p className="mb-6">
          This experience requires access to your camera for enhanced interaction.
          We don't store any camera data. Your privacy is important to us.
        </p>
        
        {errorMessage && (
          <div className="bg-red-900 p-3 rounded mb-4">
            <p>{errorMessage}</p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-end mt-4">
          <button
            onClick={handleDismissModal}
            className="px-4 py-2 text-sm bg-gray-600 rounded hover:bg-gray-500 transition-colors"
            disabled={isLoading}
          >
            Continue Without Camera
          </button>
          <button
            onClick={handleDenyPermission}
            className="px-4 py-2 text-sm bg-gray-600 rounded hover:bg-gray-500 transition-colors"
            disabled={isLoading}
          >
            Deny
          </button>
          <button
            onClick={requestCameraPermission}
            className={`px-4 py-2 text-sm ${
              isLoading ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-500'
            } rounded transition-colors flex items-center justify-center gap-2`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Allow Camera'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}; 