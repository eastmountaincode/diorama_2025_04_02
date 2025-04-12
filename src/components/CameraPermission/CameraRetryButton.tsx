import React from 'react';
import { useAtom } from 'jotai';
import { showCameraPermissionModalAtom } from '../../atoms/gameState';

interface CameraRetryButtonProps {
  className?: string;
  buttonText?: string;
}

export const CameraRetryButton: React.FC<CameraRetryButtonProps> = ({ 
  className = "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors",
  buttonText = "Enable Camera Access" 
}) => {
  const [_, setShowCameraPermissionModal] = useAtom(showCameraPermissionModalAtom);

  const handleRetry = () => {
    setShowCameraPermissionModal(true);
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