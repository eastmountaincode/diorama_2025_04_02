import React, { useRef, useState, useEffect } from 'react';
import { useWheelSound } from './useWheelSound';
import { useRingSound } from './useRingSound';

interface HydrantWheelProps {
  isDisabled: boolean;
  breakpoint: string;
  onTaskComplete: () => void;
}

const HydrantWheel: React.FC<HydrantWheelProps> = ({ 
  isDisabled, 
  breakpoint,
  onTaskComplete 
}) => {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLImageElement>(null);
  const lastMoveTimeRef = useRef<number>(0);
  const lastRotationRef = useRef<number>(0);
  const rotationSpeedRef = useRef<number>(0);

  // Use our custom hooks for sound
  const { startSound, setVolume, fadeOut, stopSound } = useWheelSound();
  const { playSound: playRingSound } = useRingSound();

  const MAX_ROTATION = 1080;

  // Refs to track rotation state
  const isDragging = useRef(false);
  const prevAngle = useRef(0);
  const totalRotation = useRef(0);
  const hasLoggedMaxClockwise = useRef(false);
  const hasLoggedMaxCounterclockwise = useRef(false);

  // Styles for the wheel
  const styles = {
    base: {
      position: 'absolute' as const,
      transform: 'translate(-50%, -50%)',
    },
    wheel: breakpoint === 'mobile'
      ? { top: '51%', left: '48%', width: '13%', zIndex: 41, opacity: 1 }
      : { top: '52.2%', left: '48%', width: '11%', zIndex: 41, opacity: 1 },
  };

  // Compute wheel style with rotation
  const computedWheelStyle = {
    ...styles.base,
    ...styles.wheel,
    transform: `translate(-50%, -50%) rotateY(-15deg) rotateX(10deg) rotate(${rotation}deg)`,
    cursor: isDisabled ? 'default' : (isDragging.current ? 'grabbing' : 'grab'),
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
    // Prevent interaction if wheel is disabled
    if (isDisabled) return;
    
    // Pre-play a silent sound to initialize audio context on first interaction
    // This helps with browsers that require user interaction to enable audio
    playRingSound(0, 0); // Zero volume, zero delay
    
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

    // Start squeaking sound with Web Audio API
    startSound();
    // Initially set volume to 0
    setVolume(0);
    
    lastMoveTimeRef.current = Date.now();
    lastRotationRef.current = rotation;
  };

  // As the pointer moves, calculate rotation
  const handlePointerMove = (e: React.PointerEvent<HTMLImageElement>) => {
    // Prevent interaction if wheel is disabled or not dragging
    if (isDisabled || !isDragging.current) return;
    
    const currentAngle = getAngleFromEvent(e);
    let deltaAngle = currentAngle - prevAngle.current;
    
    // Handle angle wrapping around 180/-180 to prevent jumps
    if (deltaAngle > 180) deltaAngle -= 360;
    if (deltaAngle < -180) deltaAngle += 360;
    
    // Check if we're within the rotation limits
    const newTotalRotation = totalRotation.current + deltaAngle;
    
    // Limit rotation to +/- MAX_ROTATION degrees
    if (newTotalRotation > MAX_ROTATION) {
      // Log max clockwise only once
      if (!hasLoggedMaxClockwise.current) {
        console.log(`Reached maximum clockwise rotation (${MAX_ROTATION}°)`);
        hasLoggedMaxClockwise.current = true;
      }
      deltaAngle = MAX_ROTATION - totalRotation.current;
    } else if (newTotalRotation < -MAX_ROTATION) {
      // Log max counterclockwise only once
      if (!hasLoggedMaxCounterclockwise.current) {
        console.log(`Reached maximum counterclockwise rotation (-${MAX_ROTATION}°)`);
        hasLoggedMaxCounterclockwise.current = true;
        
        // Immediately fade out the squeaking sound
        fadeOut(300);
        
        // Play the ring sound with Web Audio API - using minimal delay for better responsiveness
        // This needs to happen BEFORE we call onTaskComplete for better sound policy compliance
        playRingSound();
        
        // Complete the hydrant task when reaching full left rotation
        onTaskComplete();
        console.log("Hydrant task completed!");
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
        // Map rotation speed to volume (0-1)
        // Min speed: 10 deg/sec = minimal sound, Max speed: 500 deg/sec = full volume
        const minSpeed = 10;
        const maxSpeed = 500;
        let targetVolume = 0;
        
        if (rotationSpeedRef.current > minSpeed) {
          // Apply smoother curve to volume mapping using easing function
          const normalizedSpeed = Math.min(1, (rotationSpeedRef.current - minSpeed) / (maxSpeed - minSpeed));
          // Use ease-in-out curve for more natural sound response
          targetVolume = normalizedSpeed * normalizedSpeed * (3 - 2 * normalizedSpeed);
          // Cap at 0.85 for better control
          targetVolume = targetVolume * 0.85;
          
          // Set the volume through our hook
          setVolume(targetVolume);
        } else {
          // Gradual decrease if speed is below threshold
          setVolume(0);
        }
        
        // Update tracking vars
        lastMoveTimeRef.current = currentTime;
        lastRotationRef.current = rotation;
      }
    } else {
      // If no movement, set volume to 0
      setVolume(0);
    }
    
    // Update previous angle for next move
    prevAngle.current = currentAngle;
  };

  // When the pointer is released, cancel the drag
  const handlePointerUp = (e: React.PointerEvent<HTMLImageElement>) => {
    if (!isDragging.current) return;
    
    isDragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    // Fade out the squeaking sound
    fadeOut(200);
  };

  // Clean up sounds when component unmounts
  useEffect(() => {
    return () => {
      stopSound();
    };
  }, [stopSound]);

  return (
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
  );
};

export default HydrantWheel; 