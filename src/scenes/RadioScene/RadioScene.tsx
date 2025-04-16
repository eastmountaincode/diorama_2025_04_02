import React from 'react';
import { useAtom } from 'jotai';
import { 
  currentSceneAtom, 
  mirrorTaskCompletedAtom, 
  hydrantTaskCompletedAtom, 
  computerTaskCompletedAtom,
  breakpointAtom
} from '../../atoms/gameState';

const RadioScene: React.FC = () => {
  const [currentScene] = useAtom(currentSceneAtom);
  const [breakpoint] = useAtom(breakpointAtom);
  const isMobile = breakpoint === 'mobile';
  
  // Get task completion states
  const [mirrorTaskCompleted] = useAtom(mirrorTaskCompletedAtom);
  const [hydrantTaskCompleted] = useAtom(hydrantTaskCompletedAtom);
  const [computerTaskCompleted] = useAtom(computerTaskCompletedAtom);
  
  // Check if all tasks are completed
  const allTasksCompleted = mirrorTaskCompleted && hydrantTaskCompleted && computerTaskCompleted;

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
          style={{
            position: 'absolute',
            top: isMobile ? '49.0%' : '48%',
            left: isMobile ? '54.3%' : '54.3%',
            width: isMobile ? '2.7%' : '2.6%',
            height: 'auto',
            transform: 'translate(-50%, -50%)',
            cursor: 'pointer',
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
};

export default RadioScene; 