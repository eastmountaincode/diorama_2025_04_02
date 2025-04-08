import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { breakpointAtom, isFigurineTouchingDropZoneAtom, isFigurinePlacedAtom, isSceneTransitioningAtom, showOpeningSceneAtom } from '../../atoms/gameState';
import DropZoneEllipse from './DropZoneEllipse';
import OpeningSceneGrass from '../../components/OpeningSceneGrass';

const OpeningScene: React.FC = () => {
  const [breakpoint] = useAtom(breakpointAtom);
  const [isFigurineTouchingDropZone] = useAtom(isFigurineTouchingDropZoneAtom);
  const [isFigurinePlaced] = useAtom(isFigurinePlacedAtom);
  const [showFigurineAnimation, setShowFigurineAnimation] = useState(false);
  const [isEllipseHovered, setIsEllipseHovered] = useState(false);
  const [isSceneTransitioning] = useAtom(isSceneTransitioningAtom);
  const [, setShowOpeningScene] = useAtom(showOpeningSceneAtom);
  const [opacity, setOpacity] = useState(1);
  
  // Handle fade-out effect when transitioning to MainScene
  useEffect(() => {
    // TEMPORARY: Set this to true to disable fade-out while positioning
    const disableFadeOut = false;
    
    if (!disableFadeOut && isSceneTransitioning && opacity === 1) {
      // Wait for MainScene to fade in before fading out OpeningScene
      const timer = setTimeout(() => {
        // Start fading out
        setOpacity(0);
        
        // Wait for fade-out to complete before hiding OpeningScene
        setTimeout(() => {
          setShowOpeningScene(false);
        }, 1500); // Match the fade-out duration
      }, 3500); // Wait for transform + MainScene fade-in
      
      return () => clearTimeout(timer);
    }
  }, [isSceneTransitioning, opacity, setShowOpeningScene]);
  
  // Handle figurine animation when placed
  useEffect(() => {
    if (isFigurinePlaced) {
      // Small delay before starting the animation
      const timer = setTimeout(() => {
        setShowFigurineAnimation(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isFigurinePlaced]);
  
  // Set oval position based on breakpoint
  const getOvalProps = () => {
    if (breakpoint === 'mobile') {
      return {
        cx: "50.5%",
        cy: "58%"
      };
    } else {
      return {
        cx: "50.5%",
        cy: "63%"
      };
    }
  };
  
  const ovalProps = getOvalProps();

  return (
    <div className="w-full h-full relative z-30" style={{
      opacity,
      transition: isSceneTransitioning ? 'opacity 1.5s ease-out' : 'none',
    }}>
      <OpeningSceneGrass 
        isFigurineTouchingDropZone={isFigurineTouchingDropZone}
        isFigurinePlaced={isFigurinePlaced}
        isEllipseHovered={isEllipseHovered}
        showFigurineAnimation={showFigurineAnimation}
        breakpoint={breakpoint}
        ovalProps={ovalProps}
      />
      
      {/* Ellipse hitbox component */}
      <DropZoneEllipse 
        breakpoint={breakpoint}
        isFigurinePlaced={isFigurinePlaced}
        setIsEllipseHovered={setIsEllipseHovered}
      />
    </div>
  );
};

export default OpeningScene;
