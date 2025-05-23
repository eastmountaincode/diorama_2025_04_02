import React, { useState, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { 
  mirrorTaskCompletedAtom, 
  hydrantTaskCompletedAtom, 
  computerTaskCompletedAtom, 
  ringsAnimationActiveAtom,
  endSceneVideoEndedAtom,
  currentSceneAtom
} from '../../atoms/gameState';
import MainInventorySlot from './MainInventorySlot';
import { useCursor } from '../../context/CursorContext';

type MainSceneInventoryProps = {
  breakpoint?: 'mobile' | 'desktop';
};

// Type for inventory items
interface InventoryItem {
  id: string;
  name: string;
  image: string;
  taskAtom: 'mirror' | 'hydrant' | 'computer';
}

// Ring items with associated tasks
const INVENTORY_ITEMS: InventoryItem[] = [
  { 
    id: "ring1", 
    name: "Clay Ring 1", 
    image: "assets/rings/Ring_1.GIF", 
    taskAtom: 'mirror'
  },
  { 
    id: "ring2", 
    name: "Clay Ring 2", 
    image: "assets/rings/Ring_2.GIF", 
    taskAtom: 'hydrant'
  },
  { 
    id: "ring3", 
    name: "Clay Ring 3", 
    image: "assets/rings/Ring_3.GIF", 
    taskAtom: 'computer'
  }
];

const MainSceneInventory: React.FC<MainSceneInventoryProps> = ({ breakpoint = 'desktop' }) => {
  const isMobile = breakpoint === 'mobile';
  const { setCursorType } = useCursor();
  
  // Get task completion status from atoms
  const [mirrorTaskCompleted] = useAtom(mirrorTaskCompletedAtom);
  const [hydrantTaskCompleted] = useAtom(hydrantTaskCompletedAtom);
  const [computerTaskCompleted] = useAtom(computerTaskCompletedAtom);
  const [ringsAnimationActive] = useAtom(ringsAnimationActiveAtom);
  const [endSceneVideoEnded] = useAtom(endSceneVideoEndedAtom);
  const [currentScene] = useAtom(currentSceneAtom);
  
  // State to track animation states for each ring
  const [ringStates, setRingStates] = useState({
    mirror: { opacity: 0 },
    hydrant: { opacity: 0 },
    computer: { opacity: 0 }
  });
  
  // State to track the animated rings
  const [animationProgress, setAnimationProgress] = useState(0); // 0 to 100
  const [showBorromeanKnot, setShowBorromeanKnot] = useState(false);
  const [borromeanKnotOpacity, setBorromeanKnotOpacity] = useState(0);
  
  // Refs to track previous completion state
  const prevMirrorCompleted = useRef(false);
  const prevHydrantCompleted = useRef(false);
  const prevComputerCompleted = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const animationPhaseRef = useRef('moving'); // 'moving', 'pausing', 'fading'
  
  // New state to prevent rings from reappearing
  const [allRingsHidden, setAllRingsHidden] = useState(false);
  
  // Handle mouse down/up for grasping effect
  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent default browser behavior (text selection)
    e.preventDefault();
    setCursorType('grasping');
  };

  const handleMouseUp = () => {
    setCursorType('open');
  };
  
  // Handle mirror task completion
  useEffect(() => {
    if (mirrorTaskCompleted && !prevMirrorCompleted.current) {
      // First, make sure the ring is at opacity 0
      setRingStates(prev => ({
        ...prev,
        mirror: { opacity: 0 }
      }));
      
      // Start fading in the image slowly (over 3 seconds)
      let opacity = 0;
      const fadeInterval = setInterval(() => {
        opacity += 0.05;
        if (opacity >= 1) {
          clearInterval(fadeInterval);
          opacity = 1;
        }
        
        setRingStates(prev => ({
          ...prev,
          mirror: { opacity }
        }));
      }, 150); // Slower fade-in
    }
    
    prevMirrorCompleted.current = mirrorTaskCompleted;
  }, [mirrorTaskCompleted]);
  
  // Handle hydrant task completion
  useEffect(() => {
    if (hydrantTaskCompleted && !prevHydrantCompleted.current) {
      // First, make sure the ring is at opacity 0
      setRingStates(prev => ({
        ...prev,
        hydrant: { opacity: 0 }
      }));
      
      // Start fading in the image slowly (over 3 seconds)
      let opacity = 0;
      const fadeInterval = setInterval(() => {
        opacity += 0.05;
        if (opacity >= 1) {
          clearInterval(fadeInterval);
          opacity = 1;
        }
        
        setRingStates(prev => ({
          ...prev,
          hydrant: { opacity }
        }));
      }, 150); // Slower fade-in
    }
    
    prevHydrantCompleted.current = hydrantTaskCompleted;
  }, [hydrantTaskCompleted]);
  
  // Handle computer task completion
  useEffect(() => {
    if (computerTaskCompleted && !prevComputerCompleted.current) {
      // First, make sure the ring is at opacity 0
      setRingStates(prev => ({
        ...prev,
        computer: { opacity: 0 }
      }));
      
      // Start fading in the image slowly (over 3 seconds)
      let opacity = 0;
      const fadeInterval = setInterval(() => {
        opacity += 0.05;
        if (opacity >= 1) {
          clearInterval(fadeInterval);
          opacity = 1;
        }
        
        setRingStates(prev => ({
          ...prev,
          computer: { opacity }
        }));
      }, 150); // Slower fade-in
    }
    
    prevComputerCompleted.current = computerTaskCompleted;
  }, [computerTaskCompleted]);
  
  // Handle ring animation
  useEffect(() => {
    // Clean up any existing animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (ringsAnimationActive) {
      let startTime: number | null = null;
      const moveDuration = 6000; // Increased to 6 seconds for slower movement
      const pauseDuration = 100; // Brief pause
      const fadeDuration = 1000; // Fade duration
      const totalDuration = moveDuration + pauseDuration + fadeDuration;
      
      animationPhaseRef.current = 'moving';
      setShowBorromeanKnot(false);
      setBorromeanKnotOpacity(0);
      
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        
        // Determine the current animation phase
        if (elapsed < moveDuration) {
          // Phase 1: Moving rings to center
          animationPhaseRef.current = 'moving';
          const progress = Math.min(elapsed / moveDuration * 100, 100);
          setAnimationProgress(progress);
        } else if (elapsed < moveDuration + pauseDuration) {
          // Phase 2: Pause at the center
          animationPhaseRef.current = 'pausing';
          setAnimationProgress(100); // Keep at final position
        } else if (elapsed < totalDuration) {
          // Phase 3: Fade out rings, fade in Borromean Knot
          animationPhaseRef.current = 'fading';
          setAnimationProgress(100); // Keep at final position
          
          // Calculate fade progress (0-100%)
          const fadeElapsed = elapsed - (moveDuration + pauseDuration);
          const fadeProgress = Math.min(fadeElapsed / fadeDuration, 1);
          
          // Show the Borromean Knot at the start of the fade phase
          if (!showBorromeanKnot) {
            setShowBorromeanKnot(true);
          }
          
          // Update Borromean Knot opacity
          setBorromeanKnotOpacity(fadeProgress);
        }
        
        if (elapsed < totalDuration) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      setAnimationProgress(0);
      setShowBorromeanKnot(false);
      setBorromeanKnotOpacity(0);
      animationPhaseRef.current = 'moving';
    }
    
    // Clean up on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [ringsAnimationActive]);
  
  // Handle Borromean Knot fade-out after end scene video
  useEffect(() => {
    if (endSceneVideoEnded) {
      // Immediately hide all rings when the video ends
      setAllRingsHidden(true);
      
      if (showBorromeanKnot) {
        // Create a fade-out animation for the Borromean Knot
        let opacity = borromeanKnotOpacity;
        const fadeOutInterval = setInterval(() => {
          opacity -= 0.05;
          
          if (opacity <= 0) {
            clearInterval(fadeOutInterval);
            opacity = 0;
            setShowBorromeanKnot(false);
          }
          
          setBorromeanKnotOpacity(opacity);
        }, 100); // Fade out over 2 seconds
        
        return () => clearInterval(fadeOutInterval);
      }
    }
  }, [endSceneVideoEnded, showBorromeanKnot, borromeanKnotOpacity]);
  
  // Reset the allRingsHidden state when leaving end scene
  useEffect(() => {
    if (currentScene !== 'EndGameScene') {
      setAllRingsHidden(false);
    }
  }, [currentScene]);
  
  // Helper function to get properties for each slot
  const getSlotProps = (taskAtom: 'mirror' | 'hydrant' | 'computer') => {
    const taskCompletedMap = {
      'mirror': mirrorTaskCompleted,
      'hydrant': hydrantTaskCompleted,
      'computer': computerTaskCompleted
    };
    
    return {
      isCompleted: taskCompletedMap[taskAtom],
      opacity: ringStates[taskAtom].opacity
    };
  };
  
  // Calculate the size of each inventory slot based on the breakpoint
  const slotSize = isMobile ? '17%' : '48%';
  

  // Define the margin/gap between slots
  const slotMargin = isMobile ? '0 2.9%' : '10.5% 0'; // Increased from original values
  
  // Get the position for the first animated ring (moving from top to middle)
  const getFirstRingStyle = () => {
    const progress = animationProgress / 100;
    const isFading = animationPhaseRef.current === 'fading';
    
    // Calculate fade-out opacity
    let opacity = 1;
    if (isFading) {
      opacity = Math.max(1 - borromeanKnotOpacity * 1.5, 0);
    }
    
    // For desktop, we need more accurate positioning based on the inventory layout
    if (!isMobile) {
      // Get the positions based on the vertical layout
      const desktopStartY = '12.7%'; // First slot position
      const desktopEndY = '35%';  // Second slot position - adjusted not to go too far down
      
      const currentY = `calc(${desktopStartY} + ${(parseFloat(desktopEndY) - parseFloat(desktopStartY)) * progress}%)`;
      
      return {
        position: 'absolute' as const,
        top: currentY,
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '35%', // Desktop size for first ring
        height: 'auto',
        objectFit: 'contain' as const,
        opacity,
        zIndex: 10,
        transition: isFading ? 'opacity 0.3s ease-out' : 'none',
      };
    } else {
      // Mobile layout (horizontal)
      const startPosition = {
        top: '50%',
        left: '27.7%'
      };
      
      const endPosition = {
        top: '50%',
        left: '50%'
      };
      
      const currentLeft = `calc(${startPosition.left} + ${(parseFloat(endPosition.left) - parseFloat(startPosition.left)) * progress}%)`;
      
      return {
        position: 'absolute' as const,
        top: '50%',
        left: currentLeft,
        transform: 'translate(-50%, -50%)',
        width: '13.2%',
        height: 'auto',
        objectFit: 'contain' as const,
        opacity,
        zIndex: 10,
        transition: isFading ? 'opacity 0.3s ease-out' : 'none',
      };
    }
  };

  // Get the position for the third animated ring (moving from bottom to middle)
  const getThirdRingStyle = () => {
    const progress = animationProgress / 100;
    const isFading = animationPhaseRef.current === 'fading';
    
    // Calculate fade-out opacity
    let opacity = 1;
    if (isFading) {
      opacity = Math.max(1 - borromeanKnotOpacity * 1.5, 0);
    }
    
    // For desktop, we need more accurate positioning based on the inventory layout
    if (!isMobile) {
      // Get the positions based on the vertical layout
      const desktopStartY = '59.4%'; // Third slot position
      const desktopEndY = '35%';  // Second slot position
      
      const currentY = `calc(${desktopStartY} - ${(parseFloat(desktopStartY) - parseFloat(desktopEndY)) * progress}%)`;
      
      return {
        position: 'absolute' as const,
        top: currentY,
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '29%', 
        height: 'auto',
        objectFit: 'contain' as const,
        opacity,
        zIndex: 10,
        transition: isFading ? 'opacity 0.3s ease-out' : 'none',
      };
    } else {
      // Mobile layout (horizontal)
      const startPosition = {
        top: '50%',
        left: '72%'
      };
      
      const endPosition = {
        top: '50%',
        left: '50%'
      };
      
      const currentLeft = `calc(${startPosition.left} - ${(parseFloat(startPosition.left) - parseFloat(endPosition.left)) * progress}%)`;
      
      return {
        position: 'absolute' as const,
        top: '50%',
        left: currentLeft,
        transform: 'translate(-50%, -50%)',
        width: '11.2%', 
        height: 'auto',
        objectFit: 'contain' as const,
        opacity,
        zIndex: 10,
        transition: isFading ? 'opacity 0.3s ease-out' : 'none',
      };
    }
  };
  
  // Style for the Borromean Knot 
  const getBorromeanKnotStyle = () => {
    return {
      position: 'absolute' as const,
      top: isMobile ? '51%' : '35.1%',
      left: isMobile ? '50.3%' : '50.3%',
      transform: 'translate(-50%, -50%)',
      width: isMobile ? '14.2%' : '41%',
      height: 'auto',
      objectFit: 'contain' as const,
      opacity: borromeanKnotOpacity,
      zIndex: 11, // Above the rings
      transition: 'opacity 0.3s ease-in',
    };
  };

  // Determine which animated rings should be shown
  const shouldShowFirstRing = ringsAnimationActive && mirrorTaskCompleted && animationProgress > 0;
  const shouldShowThirdRing = ringsAnimationActive && computerTaskCompleted && animationProgress > 0;

  return (
    <div 
      className="inventory-container" 
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: isMobile ? 'center' : 'flex-start',
        paddingTop: isMobile ? '0.6%' : '23.7%',
        paddingLeft: isMobile ? '1%' : '2.4%',
        userSelect: 'none', // Prevent text selection
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className="inventory-slots" style={{
        width: isMobile ? '100%' : '90%',
        height: isMobile ? '90%' : '85%',
        padding: '6px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: isMobile ? 'row' : 'column',
        justifyContent: isMobile ? 'center' : 'flex-start',
        alignItems: 'center',
        position: 'relative',
      }}>
        {INVENTORY_ITEMS.map((item, index) => {
          const slotProps = getSlotProps(item.taskAtom);
          // Hide the completed rings during animation or when all rings should be hidden
          const hideFirstRing = (index === 0 && shouldShowFirstRing) || allRingsHidden;
          const hideThirdRing = (index === 2 && shouldShowThirdRing) || allRingsHidden;
          
          // Also hide the second ring (hydrant) when fading to Borromean Knot or when all rings should be hidden
          const isFadingPhase = ringsAnimationActive && showBorromeanKnot;
          const hideSecondRing = (index === 1 && 
            hydrantTaskCompleted && 
            isFadingPhase) || allRingsHidden;
          
          const hideRing = hideFirstRing || hideSecondRing || hideThirdRing;
          
          // Calculate opacity for middle ring during fade-out
          const ringOpacity = (index === 1 && hydrantTaskCompleted && isFadingPhase) 
            ? Math.max(1 - borromeanKnotOpacity * 1.5, 0) 
            : slotProps.opacity;
          
          return (
            <MainInventorySlot
              key={item.id}
              name={item.name}
              image={item.image}
              isCompleted={slotProps.isCompleted && !hideRing}
              opacity={ringOpacity}
              slotSize={slotSize}
              isMobile={isMobile}
              isAnimating={ringsAnimationActive}
              slotMargin={slotMargin}
            />
          );
        })}
        
        {/* Animated ring moving from slot 1 to slot 2 */}
        {shouldShowFirstRing && !allRingsHidden && (
          <img 
            src="assets/rings/Ring_1.GIF"
            alt="Animated Ring 1"
            style={getFirstRingStyle()}
          />
        )}
        
        {/* Animated ring moving from slot 3 to slot 2 */}
        {shouldShowThirdRing && !allRingsHidden && (
          <img 
            src="assets/rings/Ring_3.GIF"
            alt="Animated Ring 3"
            style={getThirdRingStyle()}
          />
        )}
        
        {/* Borromean Knot that fades in after rings fade out */}
        {showBorromeanKnot && (
          <img 
            src="assets/rings/Borromean_Knot.GIF"
            alt="Borromean Knot"
            style={getBorromeanKnotStyle()}
          />
        )}
      </div>
    </div>
  );
};

export default MainSceneInventory; 