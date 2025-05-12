import React from 'react';

type MainInventorySlotProps = {
  name: string;
  image: string;
  isCompleted: boolean;
  opacity: number;
  slotSize: string;
  isMobile: boolean;
  isAnimating?: boolean;
  slotMargin?: string;
};

const MainInventorySlot: React.FC<MainInventorySlotProps> = ({
  name,
  image,
  isCompleted,
  opacity,
  slotSize,
  isMobile,
  isAnimating = false,
  slotMargin
}) => {
  // Style for the slot container
  const slotStyle: React.CSSProperties = {
    width: slotSize,
    height: 0,
    paddingBottom: slotSize, // Creates a perfect square
    aspectRatio: '1 / 1', // Backup to ensure perfect square
    margin: slotMargin || (isMobile ? '0 1.5%' : '3.5% 0'),
    backgroundColor: 'transparent',
    //backgroundColor: 'blue',
    //opacity: 0.5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden', // Ensure images don't overflow the box
  };

  // Style for the grayscale placeholder
  const placeholderStyle: React.CSSProperties = {
    width: '80%',
    height: '80%',
    objectFit: 'contain',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: (isAnimating ? 0 : 0.1), // Hide placeholder if animating
    filter: 'grayscale(100%)',
    transition: 'opacity 2s ease-out', // Longer, smoother fade-out
  };

  // Style for the colored ring with glow
  const imageStyle: React.CSSProperties = {
    width: '80%',
    height: '80%',
    objectFit: 'contain',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: isCompleted ? opacity : 0,
    filter: 'none',
    transition: 'filter 0.5s ease-out',
    zIndex: 2, // Ensure colored ring appears above placeholder
  };

  return (
    <div style={slotStyle}>
      {/* Grayscale placeholder ring */}
      <img 
        src={image} 
        alt={`${name} placeholder`}
        style={placeholderStyle}
        draggable={false}
      />
      
      {/* Color ring that fades in when completed */}
      <img 
        src={image} 
        alt={name}
        style={imageStyle}
        draggable={false}
      />
    </div>
  );
};

export default MainInventorySlot; 