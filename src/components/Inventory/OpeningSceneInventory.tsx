import React from 'react';

type OpeningSceneInventoryProps = {
  breakpoint?: 'mobile' | 'desktop';
};

const OpeningSceneInventory: React.FC<OpeningSceneInventoryProps> = ({ breakpoint = 'desktop' }) => {
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

  // Define the rectangular box style. Adjust dimensions and styles as needed.
  const boxStyle: React.CSSProperties =
    breakpoint === 'mobile'
      ? {
          width: '50%',      // Less wide on mobile
          height: '75%',     // Taller for mobile
          border: '2px solid blue',
          padding: '6px',
          boxSizing: 'border-box',
        }
      : {
          width: '85%',      // Wider on desktop
          height: '40%',     // Reduced height
          border: '2px solid blue',
          padding: '6px',
          boxSizing: 'border-box',
        };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        {/* Insert additional content or elements here */}
      </div>
    </div>
  );
};

export default OpeningSceneInventory;
