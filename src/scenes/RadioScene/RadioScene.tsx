import React from 'react';
import { useAtom } from 'jotai';
import { 
  currentSceneAtom, 
  mirrorTaskCompletedAtom, 
  hydrantTaskCompletedAtom, 
  computerTaskCompletedAtom,
  breakpointAtom,
  isEndSceneAtom,
  isAudioEnabledAtom
} from '../../atoms/gameState';
import { playButtonClickSound } from '../../util/sound';

const RadioScene: React.FC = () => {
  const [currentScene, setCurrentScene] = useAtom(currentSceneAtom);
  const [breakpoint] = useAtom(breakpointAtom);
  const [, setIsEndScene] = useAtom(isEndSceneAtom);
  const [, setIsAudioEnabled] = useAtom(isAudioEnabledAtom);
  const isMobile = breakpoint === 'mobile';
  
  // Get task completion states
  const [mirrorTaskCompleted] = useAtom(mirrorTaskCompletedAtom);
  const [hydrantTaskCompleted] = useAtom(hydrantTaskCompletedAtom);
  const [computerTaskCompleted] = useAtom(computerTaskCompletedAtom);
  
  // Check if all tasks are completed
  const allTasksCompleted = mirrorTaskCompleted && hydrantTaskCompleted && computerTaskCompleted;

  // Handle the radio button click
  const handleRadioButtonClick = () => {
    if (!allTasksCompleted) return;
    
    // Play button click sound
    playButtonClickSound();
    
    // Disable the background music
    setIsAudioEnabled(false);
    
    // Wait 400ms then return to main scene and set to end scene mode
    setTimeout(() => {
      setCurrentScene('MainScene');
      setIsEndScene(true);
    }, 400);
  };

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
      {/* Radio Button - only visible when all tasks are completed */}
      {allTasksCompleted && (
        <img
          src="assets/bg/radio/radio_button_object.PNG"
          alt="Radio Button"
          onClick={handleRadioButtonClick}
          style={{
            position: 'absolute',
            top: isMobile ? '49.0%' : '48%',
            left: isMobile ? '54.3%' : '54.3%',
            width: isMobile ? '2.7%' : '2.6%',
            height: 'auto',
            transform: 'translate(-50%, -50%)',
            cursor: 'pointer',
            zIndex: 10,
            filter: 'drop-shadow(0 0 5px rgba(212,14,14,1)) drop-shadow(0 0 2px rgba(212,14,14,1)) drop-shadow(0 0 1px rgba(212,14,14,1))',
          }}
        />
      )}
    </div>
  );
};

export default RadioScene; 