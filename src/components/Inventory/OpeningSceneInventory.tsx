import React, { useState } from 'react';
import DraggableInventoryFigurine from '../DraggableInventoryFigurine';

type OpeningSceneInventoryProps = {
  breakpoint?: 'mobile' | 'desktop';
};

const OpeningSceneInventory: React.FC<OpeningSceneInventoryProps> = ({ breakpoint = 'desktop' }) => {
  const [borderIsVisible, _] = useState(false);
  // Container takes up the full width of its parent.
  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: breakpoint === 'mobile' ? 'flex-end' : 'center',
    alignItems: breakpoint === 'mobile' ? 'center' : 'flex-start',
    paddingTop: breakpoint === 'desktop' ? '45px' : '0',
    paddingRight: breakpoint === 'mobile' ? '4%' : '0',
  };

  // Box style remains as defined, with relative positioning and overflow hidden.
  const boxStyle: React.CSSProperties =
    breakpoint === 'mobile'
      ? {
          width: '50%',      // Less wide on mobile
          height: '75%',     // Taller for mobile
          border: borderIsVisible ? '2px solid blue' : 'none',
          padding: '6px',
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',  // Needed for absolute positioning of the image.
        }
      : {
          width: '85%',      // Wider on desktop
          height: '40%',     // Reduced height
          border: borderIsVisible ? '2px solid blue' : 'none',
          padding: '6px',
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        };

  // Mobile: rotate the image, scale the height, and let it fill the container.
  const imageStyleMobile: React.CSSProperties = {
    transform: 'rotate(90deg)',
    position: 'absolute',
    height: '200%',
    objectFit: 'contain',
  };

  // Desktop: center the image with padding by positioning it absolutely.
  // Using top/left 50% and translate to center, and subtracting padding via calc().
  const imageStyleDesktop: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 'calc(100% - 20px)', // adds ~10px padding on left and right
    height: 'calc(100% - 20px)', // adds ~10px padding on top and bottom
    objectFit: 'contain',
    transform: 'translate(-50%, -50%)',
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <DraggableInventoryFigurine anchorDependency={breakpoint}>
          <img
            src="assets/figure/Laila_sprite_cropped.png"
            alt="Laila Figurine"
            draggable={false} // Disable default HTML5 dragging.
            style={breakpoint === 'mobile' ? imageStyleMobile : imageStyleDesktop}
            className="z-40"
          />
        </DraggableInventoryFigurine>
      </div>
    </div>
  );
};

export default OpeningSceneInventory;
