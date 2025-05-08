import React, { useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { breakpointAtom } from '../../atoms/gameState';

interface EndSceneMediaProps {
  videoEnded: boolean;
  onVideoEnded: () => void;
  currentScene: string;
}

const EndSceneMedia: React.FC<EndSceneMediaProps> = ({ 
  videoEnded, 
  onVideoEnded,
  currentScene
}) => {
  const [breakpoint] = useAtom(breakpointAtom);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Video positioning parameters
  const videoStyles = {
    width: '100%',
    height: '100%',
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    objectFit: 'cover' as const,
    maxWidth: 'none',
  };
  
  // GIF positioning parameters
  const gifStyles = breakpoint === 'mobile' ? {
    width: 'auto',
    height: '40vh',
    position: 'absolute' as const,
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    objectFit: 'contain' as const,
    zIndex: 50,
  } : {
    width: '100%',
    height: 'auto',
    position: 'absolute' as const,
    top: '43%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  // Play video when scene becomes visible
  useEffect(() => {
    if (currentScene === 'EndGameScene' && !videoEnded) {
      if (videoRef.current) {
        // Set volume to a lower level (0.0 to 1.0)
        videoRef.current.volume = 0.2;
        videoRef.current.play().catch(e => 
          console.error("Video playback failed:", e)
        );
      }
    }
  }, [currentScene, videoEnded]);

  return (
    <>
      {!videoEnded ? (
        <video
          ref={videoRef}
          style={videoStyles}
          src="assets/end_video/Dio_End_Scene_3s.mp4"
          playsInline
          muted={false}
          controls={false}
          preload="auto"
          onEnded={onVideoEnded}
        />
      ) : (
        <img
          src="assets/end_video/DioEndScreenLoop.gif"
          alt="End Scene Loop"
          style={gifStyles}
        />
      )}
    </>
  );
};

export default EndSceneMedia; 