import React, { useState, useEffect } from 'react';
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
import { useCursor } from '../../context/CursorContext';

const RadioScene: React.FC = () => {
  const [currentScene, setCurrentScene] = useAtom(currentSceneAtom);
  const [breakpoint] = useAtom(breakpointAtom);
  const [, setIsEndScene] = useAtom(isEndSceneAtom);
  const [, setIsAudioEnabled] = useAtom(isAudioEnabledAtom);
  const { setCursorType } = useCursor();
  const isMobile = breakpoint === 'mobile';
  const [isInteractingWithButton, setIsInteractingWithButton] = useState(false);
  
  // Get task completion states
  const [mirrorTaskCompleted] = useAtom(mirrorTaskCompletedAtom);
  const [hydrantTaskCompleted] = useAtom(hydrantTaskCompletedAtom);
  const [computerTaskCompleted] = useAtom(computerTaskCompletedAtom);
  
  // Check if all tasks are completed
  const allTasksCompleted = mirrorTaskCompleted && hydrantTaskCompleted && computerTaskCompleted;

  // Ensure proper cursor when the scene becomes active
  useEffect(() => {
    if (currentScene === 'RadioScene') {
      setCursorType('open');
    }
  }, [currentScene, setCursorType]);

  // Handle cursor changes for radio button
  const handleRadioButtonMouseEnter = () => {
    if (allTasksCompleted) {
      setCursorType('pointing');
      setIsInteractingWithButton(true);
    }
  };

  const handleRadioButtonMouseLeave = () => {
    setCursorType('open');
    setIsInteractingWithButton(false);
  };

  // Handle mouse down/up to maintain pointing cursor
  const handleRadioButtonMouseDown = (e: React.MouseEvent) => {
    // Prevent default to avoid selecting/dragging
    e.preventDefault();
    // Stop propagation to prevent parent handlers from changing cursor
    e.stopPropagation();
    // Keep cursor as pointing
    if (allTasksCompleted) {
      setCursorType('pointing');
    }
  };

  const handleRadioButtonMouseUp = (e: React.MouseEvent) => {
    // Prevent default and stop propagation
    e.preventDefault();
    e.stopPropagation();
    if (allTasksCompleted) {
      setCursorType('pointing');
    }
  };

  // Handle the radio button click
  const handleRadioButtonClick = (e: React.MouseEvent) => {
    if (!allTasksCompleted) return;
    
    // Prevent default and stop propagation
    e.preventDefault();
    e.stopPropagation();
    
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
      // Handle mouse events on the main container to ensure cursor always returns to open
      onMouseDown={(e) => !isInteractingWithButton && setCursorType('open')}
      onMouseUp={(e) => !isInteractingWithButton && setCursorType('open')}
    >
      {/* Radio Button - only visible when all tasks are completed */}
      {allTasksCompleted && (
        <div 
          style={{
            position: 'absolute',
            top: isMobile ? '49.0%' : '48%',
            left: isMobile ? '54.3%' : '54.3%',
            width: isMobile ? '2.7%' : '2.6%',
            height: 'auto',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            userSelect: 'none', // Prevent text selection
          }}
          onClick={handleRadioButtonClick}
          onMouseEnter={handleRadioButtonMouseEnter}
          onMouseLeave={handleRadioButtonMouseLeave}
          onMouseDown={handleRadioButtonMouseDown}
          onMouseUp={handleRadioButtonMouseUp}
        >
          <img
            src="assets/bg/radio/radio_button_object.PNG"
            alt="Radio Button"
            style={{
              width: '100%',
              height: '100%',
              filter: 'drop-shadow(0 0 5px rgba(212,14,14,1)) drop-shadow(0 0 2px rgba(212,14,14,1)) drop-shadow(0 0 1px rgba(212,14,14,1))',
              pointerEvents: 'none', // Ensure the div handles events, not the image
            }}
          />
        </div>
      )}
    </div>
  );
};

export default RadioScene; 