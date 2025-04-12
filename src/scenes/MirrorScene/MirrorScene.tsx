import React from 'react';
import { useAtom } from 'jotai';
import { currentSceneAtom } from '../../atoms/gameState';

const MirrorScene: React.FC = () => {
  const [currentScene, _] = useAtom(currentSceneAtom);


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