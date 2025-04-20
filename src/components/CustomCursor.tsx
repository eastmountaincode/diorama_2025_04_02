import React, { useState, useEffect } from 'react';
import { useCursor } from '../context/CursorContext';
import { useAtom } from 'jotai';
import { hideCustomCursorAtom } from '../scenes/ComputerScene/ComputerScene';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const { cursorType } = useCursor();
  const [hideCustomCursor] = useAtom(hideCustomCursorAtom);

  // Detect iOS/iPadOS devices
  useEffect(() => {
    // Check if device is iOS/iPadOS
    const isIOSDevice = () => {
      return (
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
      );
    };
    
    setIsIOS(isIOSDevice());
  }, []);

  // Map cursor types to image paths
  const cursorImages = {
    default: 'assets/cursor/cursor_compressed/neutral_hand.png',
    pointer: 'assets/cursor/cursor_compressed/open_hand.png',
    grabbing: 'assets/cursor/cursor_compressed/grabbing_pinching_hand.png',
    grab: 'assets/cursor/cursor_compressed/grasping_hand.png'
  };

  useEffect(() => {
    // Only add event listeners if not iOS/iPadOS
    if (isIOS) return;

    // Update cursor position on both pointer move and touch events
    const updatePosition = (e: PointerEvent | TouchEvent) => {
      // Get coordinates based on event type
      let clientX, clientY;
      
      if ('touches' in e) {
        // It's a touch event
        if (e.touches.length > 0) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else {
          // No touches available, don't update
          return;
        }
      } else {
        // It's a pointer event
        clientX = e.clientX;
        clientY = e.clientY;
      }
      
      setPosition({ x: clientX, y: clientY });
      setIsVisible(true);
    };

    // For touch start (tap) events
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        setPosition({ x: touch.clientX, y: touch.clientY });
        setIsVisible(true);
      }
    };

    // For touch end events
    const handleTouchEnd = () => {
      // Keep the cursor visible at the last position
      // We don't change position here since there are no coordinates on touchend
    };

    // Hide cursor when pointer leaves the window
    const handlePointerLeave = () => {
      setIsVisible(false);
    };

    // Show cursor when pointer enters the window
    const handlePointerEnter = () => {
      setIsVisible(true);
    };

    // Use pointer events for mouse/stylus
    document.addEventListener('pointermove', updatePosition as EventListener);
    document.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('pointerenter', handlePointerEnter);
    
    // Use touch events specifically for mobile devices
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', updatePosition as EventListener);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('pointermove', updatePosition as EventListener);
      document.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('pointerenter', handlePointerEnter);
      
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', updatePosition as EventListener);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isIOS]);

  // Don't render the cursor on iOS/iPadOS devices or when browser is open
  if (isIOS || hideCustomCursor) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        // Offset to center the cursor image - adjusted lower by increasing y-value
        transform: 'translate(-15px, -8px)',
        pointerEvents: 'none', // Important! This prevents the cursor from interfering with click events
        zIndex: 99999, // Extremely high z-index to ensure it's above everything
        width: '30px',
        height: '30px',
        backgroundImage: `url(${cursorImages[cursorType]})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.1s ease'
      }}
    />
  );
};

export default CustomCursor; 