import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { breakpointAtom, currentSceneAtom, hydrantTaskCompletedAtom } from '../../atoms/gameState';
import { useWaterSound } from './useWaterSound';
import HydrantWheel from './HydrantWheel';

const HydrantScene: React.FC = () => {
  const [currentScene] = useAtom(currentSceneAtom);
  const [breakpoint] = useAtom(breakpointAtom);
  const [hydrantTaskCompleted, setHydrantTaskCompleted] = useAtom(hydrantTaskCompletedAtom);
  
  // Use the water sound hook
  const { fadeOutSound } = useWaterSound(
    currentScene === 'HydrantScene' && !hydrantTaskCompleted,
    0.5 // volume
  );
  
  // When task is completed, fade out the water sound
  useEffect(() => {
    if (hydrantTaskCompleted) {
      fadeOutSound(500);
    }
  }, [hydrantTaskCompleted, fadeOutSound]);
  
  // Base styles for positioning
  const styles = {
    base: {
      position: 'absolute' as const,
      transform: 'translate(-50%, -50%)',
    },
    noWheelHydrant: breakpoint === 'mobile'
      ? { top: '49.6%', left: '46.9%', width: '21%' }
      : { top: '50%', left: '46.5%', width: '19%' },
  };
  
  // Handle task completion from the wheel component
  const handleTaskComplete = () => {
    setHydrantTaskCompleted(true);
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center z-20"
      style={{
        backgroundImage: "url('assets/bg/hydrant/hydrant_close_up.JPG')",
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        pointerEvents: currentScene === 'HydrantScene' ? 'auto' : 'none',
        position: 'relative',
        display: currentScene === 'HydrantScene' ? 'flex' : 'none',
      }}
    >
      <img
        src="assets/bg/hydrant/hydrant_no_wheel_object.png"
        alt="Hydrant Base"
        style={{ ...styles.base, ...styles.noWheelHydrant }}
        draggable={false}
      />
      
      {/* Water Gushing Animation - only shows when hydrant task is not completed */}
      {!hydrantTaskCompleted && (
        <img
          src="assets/bg/hydrant/close/closeup_Hydrant_On.GIF"
          alt="Water Leaking"
          style={{
            ...styles.base,
            top: breakpoint === 'mobile' ? '55%' : '59%',
            left: breakpoint === 'mobile' ? '50.5%' : '50%',
            width: breakpoint === 'mobile' ? '31%' : '27%',
            height: 'auto',
            pointerEvents: 'none',
            zIndex: 40
          }}
          draggable={false}
        />
      )}

      {/* Water Leaking Animation - shows once hydrant task is completed */}
      {hydrantTaskCompleted && (
        <img
          src="assets/bg/hydrant/close/closeup_Hydrant_Off.GIF"
          alt="Water Leaking"
          style={{
            ...styles.base,
            top: breakpoint === 'mobile' ? '54.4%' : '58.5%',
            left: breakpoint === 'mobile' ? '48.6%' : '48.5%',
            width: breakpoint === 'mobile' ? '20%' : '20%',
            height: 'auto',
            pointerEvents: 'none',
            zIndex: 40
          }}
          draggable={false}
        />
      )}

      {/* Sparks animation - only shows when hydrant task is not completed */}
      {!hydrantTaskCompleted && (
        <img
          src="assets/bg/hydrant/close/closeup_Hydrant_sparks.GIF"
          alt="Sparks"
          style={{
            ...styles.base,
            top: breakpoint === 'mobile' ? '65%' : '70%',
            left: breakpoint === 'mobile' ? '65%' : '73%',
            width: breakpoint === 'mobile' ? '31%' : '29%',
            height: 'auto',
            pointerEvents: 'none',
            zIndex: 40
          }}
          draggable={false}
        />
      )}
      
      {/* Wheel component */}
      <HydrantWheel 
        isDisabled={hydrantTaskCompleted}
        breakpoint={breakpoint}
        onTaskComplete={handleTaskComplete}
      />
    </div>
  );
};

export default HydrantScene;
