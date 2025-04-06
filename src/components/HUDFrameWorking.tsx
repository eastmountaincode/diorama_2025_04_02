import { CSSProperties, useEffect, useRef, useState } from 'react';
import SceneManager from './SceneManager';
import Inventory from './Inventory/Inventory';
import { useAtom } from 'jotai';
import { currentSceneAtom, hudTransformAtom, breakpointAtom } from '../atoms/gameState';
import { defaultHudTransforms } from '../util/utilSettings';
type ViewportStyle = {
  top: string;
  left: string;
  width: string;
  height: string;
};

const MAX_ZOOM = 2.3;
const MIN_ZOOM = 0.5;

export function HUDFrameWorking() {
  const [currentScene] = useAtom(currentSceneAtom);
  const [src, setSrc] = useState('');
  const [hudTransform, setHudTransform] = useAtom(hudTransformAtom);
  const [breakpoint, setBreakpoint] = useAtom(breakpointAtom);
  
  const { zoom, translateX, translateY } = hudTransform;
  const [viewportStyle, setViewportStyle] = useState<ViewportStyle>({
    top: '50%',
    left: '40%',
    width: '70%',
    height: '60%',
  });

  // Pinch state ref
  const pinchStateRef = useRef<{
    initialDistance: number | null;
    initialZoom: number;
    initialMidX: number | null;
    initialMidY: number | null;
    initialTranslateX: number;
    initialTranslateY: number;
  }>({
    initialDistance: null,
    initialZoom: zoom,
    initialMidX: null,
    initialMidY: null,
    initialTranslateX: translateX,
    initialTranslateY: translateY,
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

  // Touch handlers for pinch-to-zoom and pan
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (currentScene == 'OpeningScene') return;
    if (e.touches.length !== 2) return;
    const [touch1, touch2] = [e.touches[0], e.touches[1]];
    const initialDistance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
    const initialMidX = (touch1.clientX + touch2.clientX) / 2;
    const initialMidY = (touch1.clientY + touch2.clientY) / 2;

    pinchStateRef.current = {
      initialDistance,
      initialZoom: zoom,
      initialMidX,
      initialMidY,
      initialTranslateX: translateX,
      initialTranslateY: translateY,
    };
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (currentScene == 'OpeningScene') return;
    const {
      initialDistance,
      initialZoom,
      initialMidX,
      initialMidY,
      initialTranslateX,
      initialTranslateY,
    } = pinchStateRef.current;
    if (e.touches.length !== 2 || !initialDistance || initialMidX === null || initialMidY === null)
      return;
    const [touch1, touch2] = [e.touches[0], e.touches[1]];
    const currentDistance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
    const newZoom = Math.min(Math.max(initialZoom * (currentDistance / initialDistance), MIN_ZOOM), MAX_ZOOM);
    const currentMidX = (touch1.clientX + touch2.clientX) / 2;
    const currentMidY = (touch1.clientY + touch2.clientY) / 2;

    setHudTransform({
      zoom: newZoom,
      translateX: initialTranslateX + (currentMidX - initialMidX),
      translateY: initialTranslateY + (currentMidY - initialMidY),
    });
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (currentScene == 'OpeningScene') return;
    if (e.touches.length < 2) {
      pinchStateRef.current.initialDistance = null;
      pinchStateRef.current.initialMidX = null;
      pinchStateRef.current.initialMidY = null;
    }
  };

  const sceneTransformStyle: CSSProperties = {
    transform: `translate(${translateX}px, ${translateY}px) scale(${zoom})`,
    transformOrigin: 'center center',
  };

  const viewportContainerStyle: CSSProperties = {
    overflow: 'hidden',
    touchAction: 'none',
    ...viewportStyle,
    transform: 'translate(-50%, -50%)',
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
              className="absolute"
              style={viewportContainerStyle}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="w-full h-full select-none" style={sceneTransformStyle}>
                <SceneManager />
              </div>
            </div>
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
