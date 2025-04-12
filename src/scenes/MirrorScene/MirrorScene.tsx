import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { breakpointAtom, currentSceneAtom, mirrorTaskCompletedAtom } from '../../atoms/gameState';

const MirrorScene: React.FC = () => {
  const [currentScene, setCurrentScene] = useAtom(currentSceneAtom);
  const [breakpoint] = useAtom(breakpointAtom);
  const [mirrorTaskCompleted, setMirrorTaskCompleted] = useAtom(mirrorTaskCompletedAtom);
  const [reflectionVisible, setReflectionVisible] = useState(false);

  // Handle back button click to return to main scene
  const handleBackClick = () => {
    setCurrentScene('MainScene');
  };

  // Handle mirror interaction
  const handleMirrorClick = () => {
    setReflectionVisible(!reflectionVisible);
    
    if (!mirrorTaskCompleted) {
      setMirrorTaskCompleted(true);
      console.log("Mirror task completed!");
    }
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center z-20"
      style={{
        backgroundImage: "url('assets/bg/mirror/mirror_close_up.png')",
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        pointerEvents: currentScene === 'MirrorScene' ? 'auto' : 'none',
        position: 'relative',
        display: currentScene === 'MirrorScene' ? 'flex' : 'none',
      }}
    >


      

    </div>
  );
};

export default MirrorScene; 