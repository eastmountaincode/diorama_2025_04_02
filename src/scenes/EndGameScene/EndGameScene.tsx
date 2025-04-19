import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { currentSceneAtom } from '../../atoms/gameState';

const EndGameScene: React.FC = () => {
  const [currentScene] = useAtom(currentSceneAtom);
  const [opacity, setOpacity] = useState(0);
  
  // Fade in effect
  useEffect(() => {
    if (currentScene === 'EndGameScene') {
      const timer = setTimeout(() => {
        setOpacity(1);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [currentScene]);
  
  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center"
      style={{
        backgroundColor: 'black',
        color: 'white',
        opacity: opacity,
        transition: 'opacity 2s ease-in-out',
        display: currentScene === 'EndGameScene' ? 'flex' : 'none',
      }}
    >
      <h1 className="text-4xl mb-8">The End</h1>
      <p className="text-xl mb-4">Thank you for playing</p>
      <p className="text-xs">(Refresh page to play again)</p>
    </div>
  );
};

export default EndGameScene; 