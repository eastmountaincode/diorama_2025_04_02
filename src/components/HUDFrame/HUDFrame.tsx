import { CSSProperties, useEffect, useState } from 'react';
import SceneManager from '../SceneManager';
import Inventory from '../Inventory/Inventory';
import { useAtom } from 'jotai';
import { currentSceneAtom, hudTransformAtom, breakpointAtom, isSceneTransitioningAtom } from '../../atoms/gameState';
import { defaultHudTransforms } from '../../util/utilSettings';
import { usePinchZoom } from './hooks/usePinchZoom';
import { HUDZoomControls } from './HUDZoomControls';

type ViewportStyle = {
  top: string;
  left: string;
  width: string;
  height: string;
};

export function HUDFrame() {
  const [currentScene] = useAtom(currentSceneAtom);
  const [src, setSrc] = useState('');
  const [hudTransform, setHudTransform] = useAtom(hudTransformAtom);
  const [breakpoint, setBreakpoint] = useAtom(breakpointAtom);
  const [isSceneTransitioning] = useAtom(isSceneTransitioningAtom);
  const { zoom, translateX, translateY } = hudTransform;

  const [viewportStyle, setViewportStyle] = useState<ViewportStyle>({
    top: '50%',
    left: '40%',
    width: '70%',
    height: '60%',
  });

  // Update the HUD transform defaults when the scene changes.
  useEffect(() => {
    const defaults = defaultHudTransforms[currentScene];
    setHudTransform(defaults);
  }, [currentScene, setHudTransform]);

  // Update HUD source and viewport style based on screen size
  useEffect(() => {
    const updateHUD = () => {
      const isMobile = window.matchMedia('(max-width: 667px)').matches;
      setSrc(
        isMobile
          ? 'assets/hud/hud_frame_mobile_demo.png'
          : 'assets/hud/hud_frame_desktop_demo.png'
      );

      if (isMobile) {
        setViewportStyle({ top: '42%', left: '50%', width: '90%', height: '80%' });
        setBreakpoint('mobile');
      } else {
        setViewportStyle({ top: '50%', left: '43%', width: '82%', height: '96%' });
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

  return (
    <div className="relative w-full h-full">
      {/* background layer */}
      <div className="absolute inset-0 z-10 pointer-events-none"></div>

      {/* Main content container */}
      <div className="relative w-full h-full flex items-center justify-center z-20">
        {/* Breakpoint Indicator */}
        <div className="absolute top-2 left-2 z-30 bg-black bg-opacity-50 text-white text-xs p-1 rounded pointer-events-none">
          Breakpoint: {breakpoint}
        </div>

        {/* Container wrapping HUD frame image */}
        <div className="inline-block relative p-2">
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
            
            {/* HUD Transform Controls - only visible on desktop and MainScene */}
            {breakpoint === 'desktop' && currentScene === 'MainScene' && !isSceneTransitioning && (
              <HUDZoomControls setHudTransform={setHudTransform} />
            )}
          </div>
          {/* HUD Frame Image overlay */}
          <img
            src={src}
            alt="HUD Frame"
            className="relative z-10 block pointer-events-none"
            style={{ display: 'block', width: '100%', height: 'auto' }}
          />
          <Inventory breakpoint={breakpoint} />
        </div>
      </div>
    </div>
  );
}
