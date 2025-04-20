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
    neutral: 'assets/cursor/cursor_compressed/neutral_hand.png',
    open: 'assets/cursor/cursor_compressed/open_hand.png',
    pinching: 'assets/cursor/cursor_compressed/grabbing_pinching_hand.png',
    grasping: 'assets/cursor/cursor_compressed/grasping_hand.png',
    pointing: 'assets/cursor/cursor_compressed/pointing_hand-min.PNG'
  };

  // Define specific offsets for each cursor type
  const cursorOffsets = {
    neutral: { x: -15, y: -8 },
    open: { x: -15, y: -8 },
    pinching: { x: -9, y: -8 },
    grasping: { x: -15, y: -12 },
    pointing: { x: -15, y: -2 } 
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

  // Get the current cursor offset
  const currentOffset = cursorOffsets[cursorType];

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        // Use specific offset for current cursor type
        transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
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