import React from 'react';
import { useAtom } from 'jotai';
import { showOpeningSceneAtom, currentSceneAtom } from '../atoms/gameState';
import OpeningScene from '../scenes/OpeningScene/OpeningScene';
import MainScene from '../scenes/MainScene/MainScene';
import HydrantScene from '../scenes/HydrantScene/HydrantScene';

const SceneManager: React.FC = () => {
  const [showOpeningScene] = useAtom(showOpeningSceneAtom);
  const [currentScene] = useAtom(currentSceneAtom);
  
  return (
    <div className="relative w-full h-full">
      {/* MainScene is always rendered beneath */}
      <div className="absolute inset-0" style={{
        visibility: (currentScene === 'MainScene' || showOpeningScene) ? 'visible' : 'hidden'
      }}>
        <MainScene />
      </div>
      
      {/* HydrantScene - Only rendered when active */}
      {currentScene === 'HydrantScene' && (
        <div className="absolute inset-0">
          <HydrantScene />
        </div>
      )}
      
      {/* OpeningScene - Special transition handling */}
      {showOpeningScene && (
        <div className="absolute inset-0">
          <OpeningScene />
        </div>
      )}
    </div>
  );
};

export default SceneManager;
