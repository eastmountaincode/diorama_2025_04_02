import React from 'react';
import { useAtom } from 'jotai';
import { showOpeningSceneAtom } from '../atoms/gameState';
import OpeningScene from '../scenes/OpeningScene/OpeningScene';
import MainScene from '../scenes/MainScene';

const SceneManager: React.FC = () => {
  const [showOpeningScene] = useAtom(showOpeningSceneAtom);

  // Always render both scenes, but control visibility
  return (
    <div className="relative w-full h-full">
      {/* MainScene is always rendered beneath */}
      <div className="absolute inset-0">
        <MainScene />
      </div>
      
      {/* OpeningScene stays visible based on the showOpeningScene atom */}
      {showOpeningScene && (
        <div className="absolute inset-0">
          <OpeningScene />
        </div>
      )}
    </div>
  );
};

export default SceneManager;
