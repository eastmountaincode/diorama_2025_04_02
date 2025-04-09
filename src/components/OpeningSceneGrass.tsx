import React from 'react';

interface OpeningSceneGrassProps {
  isFigurineTouchingDropZone: boolean;
  isFigurinePlaced: boolean;
  isEllipseHovered: boolean;
  showFigurineAnimation: boolean;
  breakpoint: string;
  ovalProps: {
    cx: string;
    cy: string;
  };
}

const OpeningSceneGrass: React.FC<OpeningSceneGrassProps> = ({
  isFigurineTouchingDropZone,
  isFigurinePlaced,
  isEllipseHovered,
  showFigurineAnimation,
  breakpoint,
  ovalProps
}) => {
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
        return 'translate(-50%, -95%)';
      } else {
        return 'translate(-50%, -96%)';
      }
    };
    
    // Base position and size that doesn't change during animation
    const positionStyle = {
      position: 'absolute' as const,
      left: ovalProps.cx,
      top: ovalProps.cy,
      width: breakpoint === 'mobile' ? '7%' : '4.7%',
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

  return (
    <>
      <img 
        src="assets/bg/bg_compressed_pngquant/grass_alone_final-fs8.png" 
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
    </>
  );
};

export default OpeningSceneGrass; 