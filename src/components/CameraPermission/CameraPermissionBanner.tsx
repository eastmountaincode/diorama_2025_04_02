import React from 'react';
import { useAtom } from 'jotai';
import { cameraPermissionStatusAtom, showCameraPermissionModalAtom } from '../../atoms/gameState';

export const CameraPermissionBanner: React.FC = () => {
  const [cameraPermissionStatus] = useAtom(cameraPermissionStatusAtom);
  const [_, setShowCameraPermissionModal] = useAtom(showCameraPermissionModalAtom);

  // Only show for denied state
  if (cameraPermissionStatus !== 'denied') {
    return null;
  }

  const handleRetry = () => {
    setShowCameraPermissionModal(true);
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-900 text-white p-2 flex justify-between items-center z-40">
      <p className="text-sm">Camera access denied. Some features may not work properly.</p>
      <button 
        onClick={handleRetry}
        className="bg-white text-red-900 px-3 py-1 text-xs rounded hover:bg-gray-200 transition-colors"
      >
        Retry
      </button>
    </div>
  );
}; 