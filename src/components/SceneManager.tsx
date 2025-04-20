import React from 'react';
import { useAtom } from 'jotai';
import { showOpeningSceneAtom, currentSceneAtom } from '../atoms/gameState';
import OpeningScene from '../scenes/OpeningScene/OpeningScene';
import MainScene from '../scenes/MainScene/MainScene';
import HydrantScene from '../scenes/HydrantScene/HydrantScene';
import RadioScene from '../scenes/RadioScene/RadioScene';
import MirrorScene from '../scenes/MirrorScene/MirrorScene';
import ComputerScene from '../scenes/ComputerScene/ComputerScene';
import EndGameScene from '../scenes/EndGameScene/EndGameScene';
import GlobalAudioPlayer from './GlobalAudioPlayer';

const SceneManager: React.FC = () => {
  const [showOpeningScene] = useAtom(showOpeningSceneAtom);
  const [currentScene] = useAtom(currentSceneAtom);
  
  return (
    <div className="relative w-full h-full">
      {/* Global Audio Player for music across scenes */}
      <GlobalAudioPlayer audioSrc="assets/audio/diorama_cut.mp3" />
      
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
      
      {/* RadioScene - Only rendered when active */}
      {currentScene === 'RadioScene' && (
        <div className="absolute inset-0">
          <RadioScene />
        </div>
      )}
      
      {/* MirrorScene - Only rendered when active */}
      {currentScene === 'MirrorScene' && (
        <div className="absolute inset-0">
          <MirrorScene />
        </div>
      )}
      
      {/* ComputerScene - Only rendered when active */}
      {currentScene === 'ComputerScene' && (
        <div className="absolute inset-0">
          <ComputerScene />
        </div>
      )}
      
      {/* EndGameScene - Only rendered when active */}
      {currentScene === 'EndGameScene' && (
        <div className="absolute inset-0">
          <EndGameScene />
        </div>
      )}
      
      {/* OpeningScene rendered on top when active */}
      {showOpeningScene && (
        <div className="absolute inset-0 z-10">
          <OpeningScene />
        </div>
      )}
    </div>
  );
};

export default SceneManager;
