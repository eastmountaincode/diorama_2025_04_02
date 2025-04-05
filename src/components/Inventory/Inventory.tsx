import React from 'react';
import { useAtom } from 'jotai';
import { inventoryStateAtom } from '../../atoms/gameState';
import OpeningSceneInventory from './OpeningSceneInventory';

type InventoryProps = {
  breakpoint: 'mobile' | 'desktop';
};

const Inventory: React.FC<InventoryProps> = ({ breakpoint }) => {
  // Use the inventoryStateAtom to get the current state.
  const [inventoryState] = useAtom(inventoryStateAtom);

  // Define styles based on breakpoint.
  const style: React.CSSProperties =
    breakpoint === 'mobile'
      ? {
          position: 'absolute',
          bottom: '2.5%',         // Adjust mobile position as needed
          left: '3.5%',
          width: '93%',
          height: '14.5%',
          border: '4px solid blue',
          zIndex: 20,
        }
      : {
          position: 'absolute',
          top: '2%',              // Desktop positioning
          bottom: '2%',
          right: '1.5%',
          width: '14.5%',
          border: '4px solid blue',
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
