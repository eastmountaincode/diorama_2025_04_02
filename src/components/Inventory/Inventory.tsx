import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { inventoryStateAtom } from '../../atoms/gameState';
import OpeningSceneInventory from './OpeningSceneInventory';

type InventoryProps = {
  breakpoint: 'mobile' | 'desktop';
};

const Inventory: React.FC<InventoryProps> = ({ breakpoint }) => {
  // Use the inventoryStateAtom to get the current state.
  const [inventoryState] = useAtom(inventoryStateAtom);
  const [borderIsVisible, _] = useState(false);

  // Define styles based on breakpoint.
  const style: React.CSSProperties =
    breakpoint === 'mobile'
      ? {
          position: 'absolute',
          bottom: '2.5%',         // Adjust mobile position as needed
          left: '3.5%',
          width: '93%',
          height: '14.5%',
          border: borderIsVisible ? '4px solid blue' : 'none',
          zIndex: 20,
        }
      : {
          position: 'absolute',
          top: '6%',              // Desktop positioning
          bottom: '11%',
          right: '3.2%',
          width: '17.7%',
          border: borderIsVisible ? '4px solid blue' : 'none',
          zIndex: 20,
        };

  return (
    <div style={style}>
      {inventoryState === 'OpeningScene' ? (
        <OpeningSceneInventory breakpoint={breakpoint} />
      ) : (
        <p>Inventory: MainGame</p>
      )}
    </div>
  );
};

export default Inventory;
