import React from 'react';
import { useAtom } from 'jotai';
import { currentSceneAtom } from '../atoms/gameState';
import OpeningScene from '../scenes/OpeningScene';
import MainScene from '../scenes/MainScene';

const SceneManager: React.FC = () => {
  const [currentScene] = useAtom(currentSceneAtom);

  // Render the active scene based on the atom's value.
  switch (currentScene) {
    case 'OpeningScene':
      return <OpeningScene />;
    case 'MainScene':
      return <MainScene />;
    default:
      return null;
  }
};

export default SceneManager;
