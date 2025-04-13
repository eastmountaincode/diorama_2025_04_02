import React, { useEffect, useState, useRef } from 'react';
import { useAtom } from 'jotai';
import { mirrorTaskCompletedAtom } from '../atoms/gameState';

interface CameraVideoFeedProps {
  isActive: boolean;
  permissionStatus: 'not-requested' | 'granted' | 'denied' | 'dismissed';
  showCamera: boolean;
  isMobile: boolean;
  onError: (message: string) => void;
}

const CameraVideoFeed: React.FC<CameraVideoFeedProps> = ({
  isActive,
  permissionStatus,
  showCamera,
  isMobile,
  onError
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [_, setMirrorTaskCompleted] = useAtom(mirrorTaskCompletedAtom);

  // Start camera stream when permission is granted and component is active
  useEffect(() => {
    if (isActive && permissionStatus === 'granted') {
      startCameraStream();
    }
    
    // Clean up stream when leaving or deactivating
    return () => {
      if (streamActive) {
        stopCameraStream();
      }
    };
  }, [isActive, permissionStatus]);

  // Start camera stream
  const startCameraStream = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        onError('Camera API not available');
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
      onError('Could not start camera stream');
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

  // Calculate size based on device type
  const cameraStyles = {
    width: isMobile ? '40%' : '28%',
    height: isMobile ? '35%' : '48%',
    top: isMobile ? '50%' : '52%', 
    left: '67%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute' as const,
    zIndex: 5, // Below the cut-out layer (z-index 10) but above any background layers
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

export default CameraVideoFeed; 