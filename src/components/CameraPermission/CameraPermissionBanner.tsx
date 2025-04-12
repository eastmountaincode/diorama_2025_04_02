import React from 'react';
import { useAtom } from 'jotai';
import { cameraPermissionStatusAtom, currentSceneAtom, breakpointAtom } from '../../atoms/gameState';

export const CameraPermissionBanner: React.FC = () => {
  const [cameraPermissionStatus] = useAtom(cameraPermissionStatusAtom);
  const [currentScene] = useAtom(currentSceneAtom);
  const [breakpoint] = useAtom(breakpointAtom);

  // Only show in mirror scene and when we have a meaningful status
  if (currentScene !== 'MirrorScene' || cameraPermissionStatus === 'not-requested') {
    return null;
  }

  // Determine if mobile
  const isMobile = breakpoint === 'mobile';
  
  // Determine banner style based on permission state
  let bgColor = 'bg-blue-600';
  let message = 'Camera access required';

  if (cameraPermissionStatus === 'granted') {
    bgColor = 'bg-green-700';
    message = 'Camera access granted';
  } else if (cameraPermissionStatus === 'denied') {
    bgColor = 'bg-red-700';
    message = 'Camera access denied';
  } else if (cameraPermissionStatus === 'dismissed') {
    bgColor = 'bg-gray-700';
    message = 'No camera access';
  }

  // Adjust styling based on breakpoint
  const bannerClasses = `
    fixed top-2 left-1/2 transform -translate-x-1/2 
    ${bgColor} text-white rounded-lg z-40 bg-opacity-80 
    ${isMobile ? 'text-[10px] px-2 py-0.5 whitespace-nowrap' : 'text-xs px-3 py-1'}
  `;

  return (
    <div className={bannerClasses.trim()}>
      {message}
    </div>
  );
}; 