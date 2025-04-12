import React from 'react';
import { useAtom } from 'jotai';
import {currentSceneAtom } from '../../atoms/gameState';

const RadioScene: React.FC = () => {
  const [currentScene, _] = useAtom(currentSceneAtom);


  return (
    <div
      className="w-full h-full flex items-center justify-center z-20"
      style={{
        backgroundImage: "url('assets/bg/radio/radio_close_up.JPG')", // You'll need to add this asset
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        pointerEvents: currentScene === 'RadioScene' ? 'auto' : 'none',
        position: 'relative',
        display: currentScene === 'RadioScene' ? 'flex' : 'none',
      }}
    >

    </div>
  );
};

export default RadioScene; 