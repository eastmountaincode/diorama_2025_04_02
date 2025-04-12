import React from 'react';
import { useAtom } from 'jotai';
import { cameraPermissionStatusAtom } from '../../atoms/gameState';

interface CameraRetryButtonProps {
  className?: string;
  buttonText?: string;
  onPermissionGranted?: () => void;
}

export const CameraRetryButton: React.FC<CameraRetryButtonProps> = ({ 
  className = "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors",
  buttonText = "Enable Camera Access",
  onPermissionGranted
}) => {
  const [_, setCameraPermissionStatus] = useAtom(cameraPermissionStatusAtom);

  const handleRetry = async () => {
    try {
      // Request camera access
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // Stop all tracks to release camera immediately
        stream.getTracks().forEach(track => track.stop());
        
        setCameraPermissionStatus('granted');
        
        // Call the callback if provided
        if (onPermissionGranted) {
          onPermissionGranted();
        }
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraPermissionStatus('denied');
    }
  };

  return (
    <button
      onClick={handleRetry}
      className={className}
    >
      {buttonText}
    </button>
  );
}; 