import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { breakpointAtom, currentSceneAtom, radioTaskCompletedAtom } from '../../atoms/gameState';

const RadioScene: React.FC = () => {
  const [currentScene, setCurrentScene] = useAtom(currentSceneAtom);
  const [breakpoint] = useAtom(breakpointAtom);
  const [radioTaskCompleted, setRadioTaskCompleted] = useAtom(radioTaskCompletedAtom);
  

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
      {/* Radio controls panel */}
      <div style={{
        position: 'absolute',
        top: breakpoint === 'mobile' ? '45%' : '45%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: breakpoint === 'mobile' ? '80%' : '60%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
      }}>


      </div>
    </div>
  );
};

export default RadioScene; 