import React, { useRef, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { dropZoneRectAtom, breakpointAtom, isFigurineTouchingDropZoneAtom, isFigurinePlacedAtom, hudTransformAtom, isSceneTransitioningAtom, currentSceneAtom, showOpeningSceneAtom } from '../atoms/gameState';

const OpeningScene: React.FC = () => {
  const dropZoneRef = useRef<SVGEllipseElement>(null);
  const [, setDropZoneRect] = useAtom(dropZoneRectAtom);
  const [breakpoint] = useAtom(breakpointAtom);
  const [isFigurineTouchingDropZone] = useAtom(isFigurineTouchingDropZoneAtom);
  const [isFigurinePlaced] = useAtom(isFigurinePlacedAtom);
  const [showFigurineAnimation, setShowFigurineAnimation] = useState(false);
  const [isEllipseHovered, setIsEllipseHovered] = useState(false);
  const [, setHudTransform] = useAtom(hudTransformAtom);
  const [isSceneTransitioning, setIsSceneTransitioning] = useAtom(isSceneTransitioningAtom);
  const [, setCurrentScene] = useAtom(currentSceneAtom);
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
        cy: "58%",
        rx: "12.5%",
        ry: "3.5%"
      };
    } else {
      return {
        cx: "50.5%",
        cy: "63%",
        rx: "10.5%",
        ry: "6%"
      };
    }
  };
  
  const ovalProps = getOvalProps();
  
  // Update drop zone position whenever it changes
  useEffect(() => {
    const updateDropZonePosition = () => {
      if (dropZoneRef.current) {
        const rect = dropZoneRef.current.getBoundingClientRect();
        const svgParent = dropZoneRef.current.ownerSVGElement;
        
        if (svgParent) {
          // Get the SVG's viewport dimensions
          const svgRect = svgParent.getBoundingClientRect();
          
          // Get current oval props based on breakpoint
          const currentOvalProps = getOvalProps();
          
          // Parse percentage values from currentOvalProps
          const cxPercent = parseFloat(currentOvalProps.cx) / 100;
          const cyPercent = parseFloat(currentOvalProps.cy) / 100;
          const rxPercent = parseFloat(currentOvalProps.rx) / 100;
          const ryPercent = parseFloat(currentOvalProps.ry) / 100;
          
          // Calculate center point in global coordinates 
          const cxPixels = svgRect.left + (svgRect.width * cxPercent);
          const cyPixels = svgRect.top + (svgRect.height * cyPercent);
          
          // Calculate radii in pixels
          const rxPixels = svgRect.width * rxPercent;
          const ryPixels = svgRect.height * ryPercent;
          
          setDropZoneRect({
            // Bounding box (for reference)
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
            // Ellipse specific properties
            cx: cxPixels,
            cy: cyPixels,
            rx: rxPixels,
            ry: ryPixels,
            active: true
          });
        }
      }
    };
    
    // Create a ResizeObserver to detect when the SVG element changes size
    const resizeObserver = new ResizeObserver(() => {
      updateDropZonePosition();
    });
    
    // Initial update with a small delay to ensure everything is rendered
    // This is crucial for correct initial detection
    setTimeout(updateDropZonePosition, 0);
    
    // Also observe the SVG parent for size changes
    if (dropZoneRef.current && dropZoneRef.current.ownerSVGElement) {
      resizeObserver.observe(dropZoneRef.current.ownerSVGElement);
    }
    
    // Update on window resize as well
    window.addEventListener('resize', updateDropZonePosition);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', updateDropZonePosition);
      resizeObserver.disconnect();
      // Set drop zone to inactive when component unmounts
      setDropZoneRect(prev => ({ ...prev, active: false }));
    };
  }, [setDropZoneRect, breakpoint]);

  // Get the grass image style based on whether a figurine is touching the drop zone
  const getGrassImageStyle = () => {
    // Determine the glow strength based on state
    let glowEffect = "drop-shadow(0 0 10px rgba(255, 255, 0, 0.5))";
    
    if (isFigurineTouchingDropZone && !isFigurinePlaced) {
      glowEffect = "drop-shadow(0 0 20px rgba(255, 255, 0, 0.7))";
    } else if (isFigurinePlaced) {
      if (isEllipseHovered) {
        // Enhanced glow when hovering over the ellipse with a placed figurine
        glowEffect = "drop-shadow(0 0 25px rgba(255, 255, 0, 1.0)) drop-shadow(0 0 15px rgba(255, 255, 255, 0.7))";
      } else {
        // Normal placed figurine glow
        glowEffect = "drop-shadow(0 0 15px rgba(255, 255, 0, 1.0))";
      }
    }
    
    return {
      width: '100%',
      height: '100%',
      objectFit: 'contain' as const,
      objectPosition: 'center',
      filter: glowEffect,
      transition: 'filter 0.3s ease-in-out',
    };
  };

  // Get style for the figurine image with animations
  const getFigurineStyle = () => {
    // Get position transform based on breakpoint
    const getTransform = () => {
      if (breakpoint === 'mobile') {
        // Fixed offset for mobile to prevent position jumping
        return 'translate(-67%, -95%)';
      } else {
        return 'translate(-80%, -90%)';
      }
    };
    
    // Base position and size that doesn't change during animation
    const positionStyle = {
      position: 'absolute' as const,
      left: ovalProps.cx,
      top: ovalProps.cy,
      width: breakpoint === 'mobile' ? '7%' : '4.5%',
      height: 'auto',
      zIndex: 40,
      transform: getTransform()
    };
    
    // Animation styles that are separate from positioning
    const animationStyle = {
      opacity: showFigurineAnimation ? 1 : 0,
      transition: 'opacity 0.6s ease-out'
    };
    
    return {
      ...positionStyle,
      ...animationStyle
    };
  };

  // Get ellipse fill styling based on state
  const getEllipseStyling = () => {
    // Always keep the ellipse invisible visually
    // But still make it interactive when the figurine is placed
    return {
      fill: "rgba(255, 255, 0, 0)",
      stroke: "rgba(255, 255, 0, 0)",
      strokeWidth: 0,
      cursor: isFigurinePlaced ? 'pointer' : 'default',
      pointerEvents: isFigurinePlaced ? 'auto' as const : 'none' as const
    };
  };
  
  // Handle click on the ellipse when figurine is placed
  const handleEllipseClick = () => {
    if (isFigurinePlaced) {
      console.log('Ellipse clicked with figurine placed! Ready to transition to main scene.');
      
      // Enable transition animation for the transform
      setIsSceneTransitioning(true);
      
      // Start transition to zoom 1
      setHudTransform({
        zoom: 1,
        translateX: 0,
        translateY: 0
      });
      
      // First wait for the zoom transform to fully complete
      setTimeout(() => {
        // Change to MainScene after transform is complete
        setCurrentScene('MainScene');
      }, 2000); // Wait for transform to fully complete
    }
  };
  
  // Handle hover events for the ellipse
  const handleEllipseMouseEnter = () => {
    if (isFigurinePlaced) {
      setIsEllipseHovered(true);
    }
  };
  
  const handleEllipseMouseLeave = () => {
    setIsEllipseHovered(false);
  };

  return (
    <div className="w-full h-full relative z-30" style={{
      opacity,
      transition: isSceneTransitioning ? 'opacity 1.5s ease-out' : 'none',
    }}>
      <img 
        src="assets/bg/grass_alone_final.png" 
        alt="Grass"
        style={getGrassImageStyle()}
        className="absolute top-0 left-0"
        draggable={false}
      />
      
      {/* Only show the figurine if it has been placed */}
      {isFigurinePlaced && (
        <img
          src="assets/figure/Laila_sprite_cropped.png" 
          alt="Figurine"
          style={getFigurineStyle()}
          draggable={false}
        />
      )}
      
      {/* SVG with interactive ellipse */}
      <svg 
        className="absolute top-0 left-0 w-full h-full z-30"
        style={{ overflow: 'visible' }}
      >
        <ellipse
          ref={dropZoneRef}
          cx={ovalProps.cx}
          cy={ovalProps.cy}
          rx={ovalProps.rx}
          ry={ovalProps.ry}
          style={getEllipseStyling()}
          onClick={handleEllipseClick}
          onMouseEnter={handleEllipseMouseEnter}
          onMouseLeave={handleEllipseMouseLeave}
        />
      </svg>
    </div>
  );
};

export default OpeningScene;
