import { CSSProperties, useEffect, useState } from 'react';
import SceneManager from '../SceneManager';
import Inventory from '../Inventory/Inventory';
import { useAtom } from 'jotai';
import { 
  currentSceneAtom, 
  hudTransformAtom, 
  breakpointAtom, 
  isSceneTransitioningAtom,
  mirrorTransitionCompleteAtom,
  isPhotoDisplayedAtom,
  inventoryStateAtom,
  isFigurinePlacedAtom,
  isFigurineTouchingDropZoneAtom
} from '../../atoms/gameState';
import { defaultHudTransforms } from '../../util/utilSettings';
import { usePinchZoom } from './hooks/usePinchZoom';
import { HUDZoomControls } from './HUDZoomControls';
import { useCursor } from '../../context/CursorContext';
import BackButton from './BackButton';
import ReaffirmButton from './ReaffirmButton';
import { atom } from 'jotai';
import { isBrowserOpenAtom, isPhotoOpenAtom } from '../../scenes/ComputerScene/ComputerScene';

// Create a new atom for triggering photo capture
export const capturePhotoTriggerAtom = atom<boolean>(false);

type ViewportStyle = {
  top: string;
  left: string;
  width: string;
  height: string;
};

export function HUDFrame() {
  const [currentScene, setCurrentScene] = useAtom(currentSceneAtom);
  const [mirrorTransitionComplete] = useAtom(mirrorTransitionCompleteAtom);
  const [src, setSrc] = useState('');
  const [hudTransform, setHudTransform] = useAtom(hudTransformAtom);
  const [breakpoint, setBreakpoint] = useAtom(breakpointAtom);
  const [isSceneTransitioning] = useAtom(isSceneTransitioningAtom);
  const [showReaffirmButton, setShowReaffirmButton] = useState(false);
  const [, setInventoryState] = useAtom(inventoryStateAtom);
  const [isFigurinePlaced] = useAtom(isFigurinePlacedAtom);
  const [isBrowserOpen] = useAtom(isBrowserOpenAtom);
  const [isPhotoOpen] = useAtom(isPhotoOpenAtom);
  const { zoom = 1, translateX = 0, translateY = 0 } = hudTransform || { zoom: 1, translateX: 0, translateY: 0 };
  const {} = useCursor();
  const [isPhotoDisplayed] = useAtom(isPhotoDisplayedAtom);

  const [viewportStyle, setViewportStyle] = useState<ViewportStyle>({
    top: '50%',
    left: '40%',
    width: '70%',
    height: '60%',
  });

  // Update the HUD transform defaults when the scene or breakpoint changes.
  useEffect(() => {
    const defaults = defaultHudTransforms[breakpoint][currentScene];
    setHudTransform(defaults);
  }, [currentScene, breakpoint, setHudTransform]);

  // Update HUD source and viewport style based on screen size
  useEffect(() => {
    const updateHUD = () => {
      const isMobile = window.matchMedia('(max-width: 667px)').matches;
      setSrc(
        isMobile
          ? 'assets/hud/hud_frame_mobile_demo.png'
          : 'assets/hud/hud_frame_desktop_v1.png'
      );

      if (isMobile) {
        setViewportStyle({ top: '42%', left: '50%', width: '90%', height: '80%' });
        setBreakpoint('mobile');
      } else {
        setViewportStyle({ top: '49%', left: '41.5%', width: '75%', height: '92%' });
        setBreakpoint('desktop');
      }
    };

    updateHUD();
    window.addEventListener('resize', updateHUD);
    window.addEventListener('orientationchange', updateHUD);
    return () => {
      window.removeEventListener('resize', updateHUD);
      window.removeEventListener('orientationchange', updateHUD);
    };
  }, [setBreakpoint]);

  // Pinch zoom hook
  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    viewportRef
  } = usePinchZoom();

  // Handle back button for object scenes
  const handleBackToMainScene = () => {
    setCurrentScene('MainScene');
  };
  
  // Handle reaffirm button in mirror scene
  const handleReaffirmExistence = () => {
    // Trigger photo capture in MirrorScene
    setCapturePhotoTrigger(true);
  };

  const [capturePhotoTrigger, setCapturePhotoTrigger] = useAtom(capturePhotoTriggerAtom);

  // Reset trigger after it's been set
  useEffect(() => {
    if (capturePhotoTrigger) {
      // Reset the trigger after a short delay to ensure it's picked up
      const timer = setTimeout(() => {
        setCapturePhotoTrigger(false);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [capturePhotoTrigger, setCapturePhotoTrigger]);

  // Update visibility of the reaffirm button based on mirror transition
  useEffect(() => {
    if (currentScene === 'MirrorScene' && mirrorTransitionComplete && !isPhotoDisplayed) {
      setShowReaffirmButton(true);
    } else {
      setShowReaffirmButton(false);
    }
  }, [currentScene, mirrorTransitionComplete, isPhotoDisplayed]);
  
  // Additional effect to reset button state when scene changes
  useEffect(() => {
    setShowReaffirmButton(false);
  }, [currentScene]);

  // Update inventory state when scene changes
  useEffect(() => {
    if (currentScene === 'MainScene') {
      setInventoryState('MainGame');
    } else if (currentScene === 'OpeningScene') {
      setInventoryState('OpeningScene');
    }
  }, [currentScene, setInventoryState]);

  // Determine if the back button should be shown
  const shouldShowBackButton = () => {
    // Hide back button if browser or photo is open in computer scene
    if (currentScene === 'ComputerScene' && (isBrowserOpen || isPhotoOpen)) {
      return false;
    }
    
    // Show back button in object scenes
    return (
      currentScene === 'HydrantScene' || 
      currentScene === 'RadioScene' || 
      (currentScene === 'MirrorScene' && !isPhotoDisplayed) || 
      currentScene === 'ComputerScene'
    );
  };

  const sceneTransformStyle: CSSProperties = {
    transform: `translate(${translateX}px, ${translateY}px) scale(${zoom})`,
    transformOrigin: 'center center',
    ...(isSceneTransitioning && { transition: 'transform 1.5s ease-in-out' }),
  };

  const viewportContainerStyle: CSSProperties = {
    overflow: 'hidden',
    touchAction: 'none',
    ...viewportStyle,
    transform: 'translate(-50%, -50%)',
    position: 'absolute'
  };

  // Touch Grass message positioned similar to other UI elements
  const touchGrassStyle: CSSProperties = {
    position: 'absolute',
    fontFamily: 'monospace',
    color: '#fffff0',
    fontSize: breakpoint === 'mobile' ? '0.8rem' : '1.4rem',
    letterSpacing: '0.1em',
    zIndex: 50,
    pointerEvents: 'none',
    textAlign: 'center',
    width: 'auto',
    whiteSpace: 'nowrap',
    // Position similar to back button but centered horizontally
    ...(breakpoint === 'mobile' 
      ? { top: '16%', left: '50%', transform: 'translateX(-50%)' } 
      : { top: '20%', left: '43%', transform: 'translateX(-50%)' })
  };

  // Helper to determine what message should be shown in OpeningScene
  const shouldShowGrassMessage = () => {
    // Only show any message in OpeningScene and when not transitioning
    if (currentScene !== 'OpeningScene' || isSceneTransitioning) {
      return false;
    }
    
    // Show message when figurine is not placed yet or when it's placed but waiting for click
    return !isSceneTransitioning;
  };

  return (
    <div className="relative w-full h-full">
      {/* background layer */}
      <div className="absolute inset-0 z-10 pointer-events-none"></div>

      {/* Main content container */}
      <div className="relative w-full h-full flex items-center justify-center z-20">
        {/* Breakpoint Indicator */}
        {/* <div className="absolute top-2 left-2 z-30 bg-black bg-opacity-50 text-white text-xs p-1 rounded pointer-events-none">
          Breakpoint: {breakpoint}
        </div> */}

        {/* Container wrapping HUD frame image */}
        <div className="inline-block relative p-2 max-h-[98vh] flex items-center justify-center mt-2">
          {/* Interactive SceneManager viewport */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div
              ref={viewportRef}
              className="absolute"
              style={viewportContainerStyle}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* SceneManager viewport */}
              <div className="w-full h-full select-none" style={sceneTransformStyle}>
                <SceneManager />
              </div>
            </div>
            
            {/* HUD Transform Controls - visible on desktop for MainScene and HydrantScene */}
            {breakpoint === 'desktop' && (currentScene === 'MainScene') && !isSceneTransitioning && (
              <HUDZoomControls setHudTransform={setHudTransform} />
            )}
            
            {/* Back Button - only visible in object scenes */}
            {shouldShowBackButton() && (
              <BackButton
                onClick={handleBackToMainScene}
                style={breakpoint === 'mobile' ? { top: '5.9%', left: '9.1%' } : { top: '5.9%', left: '5.9%' }}
                className={breakpoint === 'mobile' ? 'text-sm' : 'text-lg'}
              />
            )}
            
            {/* Touch Grass Message - only visible in OpeningScene when not transitioning */}
            {shouldShowGrassMessage() && (
              <div style={touchGrassStyle}>
                <div>TOUCH GRASS TO START</div>
                {/* Only show the quote if figurine hasn't been placed yet */}
                {!isFigurinePlaced && (
                  <div style={{ 
                    fontSize: breakpoint === 'mobile' ? '0.5rem' : '0.7rem',
                    marginTop: '0.5rem'
                  }}>
                    <span style={{ fontStyle: 'italic' }}>"place me on the synthetic grass..."</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Reaffirm Existence Button - only visible in MirrorScene after transition and when no photo is displayed */}
            {currentScene === 'MirrorScene' && !isPhotoDisplayed && (
              <ReaffirmButton
                onClick={handleReaffirmExistence}
                isVisible={showReaffirmButton}
                style={breakpoint === 'mobile' 
                  ? { bottom: '22%', left: '51%', transform: 'translateX(-50%)' } 
                  : { bottom: '11%', left: '43%', transform: 'translateX(-50%)' }
                }
                className={breakpoint === 'mobile' ? 'text-xs' : 'text-sm'}
              />
            )}
          </div>
          {/* HUD Frame Image overlay */}
          <img
            src={src}
            alt="HUD Frame"
            className="relative z-10 block pointer-events-none object-contain max-h-[90vh]"
            style={{ display: 'block', width: 'auto', height: 'auto', maxWidth: '100%' }}
          />
          <Inventory breakpoint={breakpoint} />
        </div>
      </div>
    </div>
  );
}
