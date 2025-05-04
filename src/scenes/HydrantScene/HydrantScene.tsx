import React, { useRef, useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { breakpointAtom, currentSceneAtom, hydrantTaskCompletedAtom } from '../../atoms/gameState';
import { playGetRingSound, playWaterFlowingSound, playWheelSqueakingSound } from '../../util/sound';

const HydrantScene: React.FC = () => {
  const [currentScene] = useAtom(currentSceneAtom);
  const [breakpoint] = useAtom(breakpointAtom);
  const [hydrantTaskCompleted, setHydrantTaskCompleted] = useAtom(hydrantTaskCompletedAtom);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLImageElement>(null);
  const waterSoundRef = useRef<HTMLAudioElement | null>(null);
  const squeakSoundRef = useRef<HTMLAudioElement | null>(null);
  const lastMoveTimeRef = useRef<number>(0);
  const lastRotationRef = useRef<number>(0);
  const rotationSpeedRef = useRef<number>(0);
  const fadeIntervalRef = useRef<number | null>(null);

  const MAX_ROTATION = 1080;

  // Refs to track rotation state
  const isDragging = useRef(false);
  const prevAngle = useRef(0);
  const totalRotation = useRef(0);
  const hasLoggedMaxClockwise = useRef(false);
  const hasLoggedMaxCounterclockwise = useRef(false);

  // Play water flowing sound when scene is active and task is not completed
  useEffect(() => {
    if (currentScene === 'HydrantScene' && !hydrantTaskCompleted) {
      // Play water flowing sound, looping
      const audio = playWaterFlowingSound();
      audio.loop = true;
      waterSoundRef.current = audio;

      // Cleanup function to stop sound when component unmounts or scene changes
      return () => {
        if (waterSoundRef.current) {
          waterSoundRef.current.pause();
          waterSoundRef.current = null;
        }
      };
    }
  }, [currentScene, hydrantTaskCompleted]);

  // Stop water sound when task is completed
  useEffect(() => {
    if (hydrantTaskCompleted && waterSoundRef.current) {
      waterSoundRef.current.pause();
      waterSoundRef.current = null;
    }
    
    // Also stop wheel squeaking sound when task is completed
    if (hydrantTaskCompleted && squeakSoundRef.current) {
      fadeOutAudio(squeakSoundRef.current, 300).then(() => {
        if (squeakSoundRef.current) {
          squeakSoundRef.current.pause();
          squeakSoundRef.current = null;
        }
      });
    }
  }, [hydrantTaskCompleted]);

  // Your original styles
  const styles = {
    base: {
      position: 'absolute' as const,
      transform: 'translate(-50%, -50%)',
    },
    noWheelHydrant: breakpoint === 'mobile'
      ? { top: '49.6%', left: '46.9%', width: '21%' }
      : { top: '50%', left: '46.5%', width: '19%' },
    wheel: breakpoint === 'mobile'
      ? { top: '51%', left: '48%', width: '13%', zIndex: 41, opacity: 1 }
      : { top: '52.2%', left: '48%', width: '11%', zIndex: 41, opacity: 1 },
  };

  // Combine base + wheel positioning, add current rotation
  const computedWheelStyle = {
    ...styles.base,
    ...styles.wheel,
    transform: `translate(-50%, -50%) rotateY(-15deg) rotateX(10deg) rotate(${rotation}deg)`,
    cursor: hydrantTaskCompleted ? 'default' : (isDragging.current ? 'grabbing' : 'grab'),
    transformStyle: 'preserve-3d' as const,
  };

  // Get angle from pointer position
  const getAngleFromEvent = (e: React.PointerEvent<HTMLImageElement>) => {
    if (!wheelRef.current) return 0;
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
  };

  // Function to smoothly fade out audio to prevent pops
  const fadeOutAudio = (audio: HTMLAudioElement, duration: number = 150): Promise<void> => {
    return new Promise((resolve) => {
      const startVolume = audio.volume;
      const fadeSteps = 10;
      const fadeStepTime = duration / fadeSteps;
      const volumeStep = startVolume / fadeSteps;
      
      let currentStep = 0;
      
      // Clear any existing fade interval
      if (fadeIntervalRef.current !== null) {
        clearInterval(fadeIntervalRef.current);
      }
      
      const interval = setInterval(() => {
        currentStep++;
        const newVolume = startVolume - (volumeStep * currentStep);
        
        if (newVolume <= 0 || currentStep >= fadeSteps) {
          audio.volume = 0;
          clearInterval(interval);
          fadeIntervalRef.current = null;
          resolve();
        } else {
          audio.volume = newVolume;
        }
      }, fadeStepTime);
      
      fadeIntervalRef.current = interval as unknown as number;
    });
  };

  // When pointer goes down, record the starting angle
  const handlePointerDown = (e: React.PointerEvent<HTMLImageElement>) => {
    // Prevent interaction if task is completed
    if (hydrantTaskCompleted) return;
    
    isDragging.current = true;
    prevAngle.current = getAngleFromEvent(e);
    e.currentTarget.setPointerCapture(e.pointerId);
    
    // Reset the max rotation logs when starting a new drag
    // but only if we're not at the max anymore
    if (totalRotation.current < MAX_ROTATION) {
      hasLoggedMaxClockwise.current = false;
    }
    if (totalRotation.current > -MAX_ROTATION) {
      hasLoggedMaxCounterclockwise.current = false;
    }

    // Clean up any existing sound before creating a new one
    if (squeakSoundRef.current) {
      const oldSound = squeakSoundRef.current;
      fadeOutAudio(oldSound, 50).then(() => {
        oldSound.pause();
      });
    }

    // Initialize wheel squeaking sound but with volume 0
    // Pre-load audio with no autoplay to avoid initial pop
    const newSound = new Audio('assets/audio/wheel_squeaking.wav');
    newSound.volume = 0;
    newSound.loop = true;
    
    // Use a timeout to start playing after a tiny delay
    setTimeout(() => {
      if (isDragging.current) {
        const playPromise = newSound.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Error playing squeaking sound:", error);
          });
        }
      }
    }, 10);
    
    squeakSoundRef.current = newSound;
    lastMoveTimeRef.current = Date.now();
    lastRotationRef.current = rotation;
  };

  // As the pointer moves, calculate rotation
  const handlePointerMove = (e: React.PointerEvent<HTMLImageElement>) => {
    // Prevent interaction if task is completed
    if (hydrantTaskCompleted || !isDragging.current) return;
    
    const currentAngle = getAngleFromEvent(e);
    let deltaAngle = currentAngle - prevAngle.current;
    
    // Handle angle wrapping around 180/-180 to prevent jumps
    if (deltaAngle > 180) deltaAngle -= 360;
    if (deltaAngle < -180) deltaAngle += 360;
    
    // Check if we're within the rotation limits
    const newTotalRotation = totalRotation.current + deltaAngle;
    
    // Limit rotation to +/- 720 degrees (2 full rotations)
    if (newTotalRotation > MAX_ROTATION) {
      // Log max clockwise only once
      if (!hasLoggedMaxClockwise.current) {
        console.log("Reached maximum clockwise rotation (1080°)");
        hasLoggedMaxClockwise.current = true;
      }
      deltaAngle = MAX_ROTATION - totalRotation.current;
    } else if (newTotalRotation < -MAX_ROTATION) {
      // Log max counterclockwise only once
      if (!hasLoggedMaxCounterclockwise.current) {
        console.log("Reached maximum counterclockwise rotation (-1080°)");
        hasLoggedMaxCounterclockwise.current = true;
        
        // Complete the hydrant task when reaching full left rotation
        setHydrantTaskCompleted(true);
        playGetRingSound();
        console.log("Hydrant task completed!");
        
        // Immediately stop the squeaking sound when the task is completed
        if (squeakSoundRef.current) {
          fadeOutAudio(squeakSoundRef.current, 300).then(() => {
            if (squeakSoundRef.current) {
              squeakSoundRef.current.pause();
              squeakSoundRef.current = null;
            }
          });
        }
      }
      deltaAngle = -MAX_ROTATION - totalRotation.current;
    }
    
    // Apply the rotation
    if (deltaAngle !== 0) {
      totalRotation.current += deltaAngle;
      setRotation(prev => prev + deltaAngle);

      // Calculate rotation speed
      const currentTime = Date.now();
      const timeDelta = currentTime - lastMoveTimeRef.current;
      
      if (timeDelta > 0) {
        // Calculate rotation speed in degrees per second
        const rotationDelta = Math.abs(rotation - lastRotationRef.current);
        rotationSpeedRef.current = rotationDelta / timeDelta * 1000;
        
        // Update squeak sound volume based on rotation speed
        if (squeakSoundRef.current) {
          // Map rotation speed to volume (0-1)
          // Min speed: 10 deg/sec = minimal sound, Max speed: 500 deg/sec = full volume
          const minSpeed = 10;
          const maxSpeed = 500;
          let targetVolume = 0;
          
          if (rotationSpeedRef.current > minSpeed) {
            targetVolume = Math.min(1, (rotationSpeedRef.current - minSpeed) / (maxSpeed - minSpeed));
            // Apply exponential scaling to make it sound more natural
            targetVolume = Math.pow(targetVolume, 2) * 0.6; // Cap at 0.6 max volume
            
            // Smooth volume transition to avoid pops
            const currentVolume = squeakSoundRef.current.volume;
            const volumeDelta = targetVolume - currentVolume;
            
            // Apply only a portion of the volume change per frame for smoothness
            squeakSoundRef.current.volume = currentVolume + (volumeDelta * 0.3);
          } else if (squeakSoundRef.current.volume > 0) {
            // Gradual decrease if speed is below threshold
            squeakSoundRef.current.volume = Math.max(0, squeakSoundRef.current.volume - 0.03);
          }
        }
        
        // Update tracking vars
        lastMoveTimeRef.current = currentTime;
        lastRotationRef.current = rotation;
      }
    } else {
      // If no movement, gradually reduce volume
      if (squeakSoundRef.current && squeakSoundRef.current.volume > 0) {
        squeakSoundRef.current.volume = Math.max(0, squeakSoundRef.current.volume - 0.02);
      }
    }
    
    // Update previous angle for next move
    prevAngle.current = currentAngle;
  };

  // When the pointer is released, cancel the drag
  const handlePointerUp = async (e: React.PointerEvent<HTMLImageElement>) => {
    if (!isDragging.current) return;
    
    isDragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    // Fade out and stop the squeaking sound to prevent pops
    if (squeakSoundRef.current) {
      const sound = squeakSoundRef.current;
      await fadeOutAudio(sound);
      sound.pause();
      squeakSoundRef.current = null;
    }
  };

  // Clean up sounds when component unmounts
  useEffect(() => {
    return () => {
      // Clear any ongoing fade interval
      if (fadeIntervalRef.current !== null) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
      
      if (waterSoundRef.current) {
        waterSoundRef.current.pause();
        waterSoundRef.current = null;
      }
      
      if (squeakSoundRef.current) {
        squeakSoundRef.current.volume = 0;
        squeakSoundRef.current.pause();
        squeakSoundRef.current = null;
      }
    };
  }, []);

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
      
      <img
        ref={wheelRef}
        src="assets/bg/hydrant/hydrant_wheel.png"
        alt="Hydrant Wheel"
        style={computedWheelStyle}
        draggable={false}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
    </div>
  );
};

export default HydrantScene;
