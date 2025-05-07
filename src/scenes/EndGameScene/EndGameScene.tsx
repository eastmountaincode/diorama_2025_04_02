import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { currentSceneAtom, breakpointAtom } from '../../atoms/gameState';
import EndSceneButtons from './EndSceneButtons';
import EndSceneMedia from './EndSceneMedia';
import CreditsModal from './CreditsModal';

const EndGameScene: React.FC = () => {
  const [currentScene] = useAtom(currentSceneAtom);
  const [breakpoint] = useAtom(breakpointAtom);
  const [opacity, setOpacity] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  
  // Fade in effect
  useEffect(() => {
    if (currentScene === 'EndGameScene') {
      const timer = setTimeout(() => {
        setOpacity(1);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [currentScene]);
  
  // Handle video end
  const handleVideoEnded = () => {
    setVideoEnded(true);
  };

  // Handle button clicks
  const handleCreditsClick = () => {
    setIsCreditsOpen(true);
  };

  const handleCloseCredits = () => {
    setIsCreditsOpen(false);
  };

  const handleListenClick = () => {
    console.log('Listen to Diorama clicked');
    // Open Spotify link in a new tab
    window.open('https://open.spotify.com/track/3lCXd0aa4JkjPUBBNodT7b?si=5ae90b062cca4e40', '_blank', 'noopener,noreferrer');
  };
  
  // Set container style to allow overflow
  const containerStyle = {
    backgroundColor: 'black',
    color: 'white',
    opacity: opacity,
    transition: 'opacity 2s ease-in-out',
    display: currentScene === 'EndGameScene' ? 'flex' : 'none',
    position: 'relative' as const,
    overflow: breakpoint === 'mobile' ? 'hidden' : 'visible',
    width: '100%',
    height: '100%',
  };
  
  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center"
      style={containerStyle}
    >
      <EndSceneMedia
        videoEnded={videoEnded}
        onVideoEnded={handleVideoEnded}
        currentScene={currentScene}
      />
      
      {videoEnded && (
        <EndSceneButtons
          onCreditsClick={handleCreditsClick}
          onListenClick={handleListenClick}
        />
      )}

      <CreditsModal 
        isOpen={isCreditsOpen} 
        onClose={handleCloseCredits} 
      />
    </div>
  );
};

export default EndGameScene; 