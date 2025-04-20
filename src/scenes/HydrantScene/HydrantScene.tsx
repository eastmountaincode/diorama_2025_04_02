import React, { useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { breakpointAtom, currentSceneAtom, hydrantTaskCompletedAtom } from '../../atoms/gameState';
import { playGetRingSound } from '../../util/sound';

const HydrantScene: React.FC = () => {
  const [currentScene] = useAtom(currentSceneAtom);
  const [breakpoint] = useAtom(breakpointAtom);
  const [hydrantTaskCompleted, setHydrantTaskCompleted] = useAtom(hydrantTaskCompletedAtom);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLImageElement>(null);

  const MAX_ROTATION = 1080;

  // Refs to track rotation state
  const isDragging = useRef(false);
  const prevAngle = useRef(0);
  const totalRotation = useRef(0);
  const hasLoggedMaxClockwise = useRef(false);
  const hasLoggedMaxCounterclockwise = useRef(false);

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
      ? { top: '51%', left: '48%', width: '13%' }
      : { top: '52.2%', left: '48%', width: '11%' },
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
        playGetRingSound(0.2, 1000);
        console.log("Hydrant task completed!");
      }
      deltaAngle = -MAX_ROTATION - totalRotation.current;
    }
    
    // Apply the rotation
    if (deltaAngle !== 0) {
      totalRotation.current += deltaAngle;
      setRotation(prev => prev + deltaAngle);
    }
    
    // Update previous angle for next move
    prevAngle.current = currentAngle;
  };

  // When the pointer is released, cancel the drag
  const handlePointerUp = (e: React.PointerEvent<HTMLImageElement>) => {
    if (!isDragging.current) return;
    
    isDragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
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
      
      {/* Water Leaking Animation - only shows when hydrant task is not completed */}
      {!hydrantTaskCompleted && (
        <img
          src="assets/bg/hydrant/water_leaking.gif"
          alt="Water Leaking"
          style={{
            ...styles.base,
            top: breakpoint === 'mobile' ? '61%' : '70%',
            left: breakpoint === 'mobile' ? '53%' : '55%',
            width: breakpoint === 'mobile' ? '26%' : '26%',
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
