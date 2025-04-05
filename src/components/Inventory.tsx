import React from 'react';

type InventoryProps = {
  breakpoint: 'mobile' | 'desktop';
};

const Inventory: React.FC<InventoryProps> = ({ breakpoint }) => {
  // Define styles based on breakpoint
  const style: React.CSSProperties =
    breakpoint === 'mobile'
      ? {
          position: 'absolute',
          bottom: '5%',         // Adjust mobile position as needed
          left: '2%',
          width: '40%',
          height: '10%',
          border: '4px solid blue',
          zIndex: 20,
        }
      : {
          position: 'absolute',
          top: '2%',            // Desktop positioning
          bottom: '2%',
          right: '1.5%',
          width: '14.5%',
          border: '4px solid blue',
          zIndex: 20,
        };

  return <div style={style}>{/* Inventory placeholder */}</div>;
};

export default Inventory;
