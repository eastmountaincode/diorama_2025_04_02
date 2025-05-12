import React, { useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { breakpointAtom, endSceneVideoEndedAtom } from '../../atoms/gameState';
import { useEndSceneAudio } from './useEndSceneAudio';

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
  const [, setEndSceneVideoEnded] = useAtom(endSceneVideoEndedAtom);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { connectVideoAudio, disconnectVideoAudio } = useEndSceneAudio();
  
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
    width: '100%',
    height: '62%',
    scale: '1.5',
    top: '40%',
    left: '50%',
    transform: 'translate(1%, 0.4%)',
    zIndex: 50,
    overflow: 'hidden',
  } : {
    width: '100%',
    height: 'auto',
    position: 'absolute' as const,
    top: '46.5%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  // Play video when scene becomes visible
  useEffect(() => {
    if (currentScene === 'EndGameScene' && !videoEnded) {
      if (videoRef.current) {
        // First play the video
        videoRef.current.play()
          .then(() => {
            // After successful play, try to connect the audio
            try {
              connectVideoAudio(videoRef.current!, 0.5);
            } catch (audioError) {
              console.warn("Falling back to native volume control", audioError);
              videoRef.current!.volume = 0.5;
            }
          })
          .catch(e => console.error("Video playback failed:", e));
      }
    }
  }, [currentScene, videoEnded, connectVideoAudio]);

  // Disconnect Web Audio API when component unmounts
  useEffect(() => {
    return () => {
      disconnectVideoAudio();
    };
  }, [disconnectVideoAudio]);

  // Handle video end
  const handleVideoEnded = () => {
    setEndSceneVideoEnded(true); // Set atom for Borromean knot fade-out
    onVideoEnded(); // Call the original handler
  };

  // Reset endSceneVideoEnded when unmounting or changing scenes
  useEffect(() => {
    if (currentScene !== 'EndGameScene') {
      setEndSceneVideoEnded(false);
    }
    
    return () => {
      setEndSceneVideoEnded(false);
    };
  }, [currentScene, setEndSceneVideoEnded]);

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
          onEnded={handleVideoEnded}
        />
      ) : (
        <img
          src="assets/end_video/dioendscreenloop_new.gif"
          alt="End Scene Loop"
          style={gifStyles}
        />
      )}
    </>
  );
};

export default EndSceneMedia; 