import React, { useState, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { mirrorTaskCompletedAtom, hydrantTaskCompletedAtom, computerTaskCompletedAtom } from '../../atoms/gameState';
import MainInventorySlot from './MainInventorySlot';

type MainSceneInventoryProps = {
  breakpoint?: 'mobile' | 'desktop';
};

// Type for inventory items
interface InventoryItem {
  id: string;
  name: string;
  image: string;
  taskAtom: 'mirror' | 'hydrant' | 'computer';
}

// Ring items with associated tasks
const INVENTORY_ITEMS: InventoryItem[] = [
  { 
    id: "ring1", 
    name: "Clay Ring 1", 
    image: "assets/rings/clay_ring_1_demo-min.png", 
    taskAtom: 'mirror'
  },
  { 
    id: "ring2", 
    name: "Clay Ring 2", 
    image: "assets/rings/clay_ring_2_demo-min.png", 
    taskAtom: 'hydrant'
  },
  { 
    id: "ring3", 
    name: "Clay Ring 3", 
    image: "assets/rings/clay_ring_3_demo-min.png", 
    taskAtom: 'computer'
  }
];

const MainSceneInventory: React.FC<MainSceneInventoryProps> = ({ breakpoint = 'desktop' }) => {
  const isMobile = breakpoint === 'mobile';
  
  // Get task completion status from atoms
  const [mirrorTaskCompleted] = useAtom(mirrorTaskCompletedAtom);
  const [hydrantTaskCompleted] = useAtom(hydrantTaskCompletedAtom);
  const [computerTaskCompleted] = useAtom(computerTaskCompletedAtom);
  
  // State to track animation states for each ring
  const [ringStates, setRingStates] = useState({
    mirror: { glowing: false, opacity: 0 },
    hydrant: { glowing: false, opacity: 0 },
    computer: { glowing: false, opacity: 0 }
  });
  
  // Refs to track previous completion state
  const prevMirrorCompleted = useRef(false);
  const prevHydrantCompleted = useRef(false);
  const prevComputerCompleted = useRef(false);
  
  // Handle mirror task completion
  useEffect(() => {
    if (mirrorTaskCompleted && !prevMirrorCompleted.current) {
      // First, make sure the ring is at opacity 0
      setRingStates(prev => ({
        ...prev,
        mirror: { glowing: true, opacity: 0 }
      }));
      
      // Start fading in the image slowly (over 3 seconds)
      let opacity = 0;
      const fadeInterval = setInterval(() => {
        opacity += 0.05;
        if (opacity >= 1) {
          clearInterval(fadeInterval);
          opacity = 1;
        }
        
        setRingStates(prev => ({
          ...prev,
          mirror: { ...prev.mirror, opacity }
        }));
      }, 150); // Slower fade-in
      
      // Stop glowing after 5 seconds
      setTimeout(() => {
        setRingStates(prev => ({
          ...prev,
          mirror: { ...prev.mirror, glowing: false }
        }));
      }, 5000);
    }
    
    prevMirrorCompleted.current = mirrorTaskCompleted;
  }, [mirrorTaskCompleted]);
  
  // Handle hydrant task completion
  useEffect(() => {
    if (hydrantTaskCompleted && !prevHydrantCompleted.current) {
      // First, make sure the ring is at opacity 0
      setRingStates(prev => ({
        ...prev,
        hydrant: { glowing: true, opacity: 0 }
      }));
      
      // Start fading in the image slowly (over 3 seconds)
      let opacity = 0;
      const fadeInterval = setInterval(() => {
        opacity += 0.05;
        if (opacity >= 1) {
          clearInterval(fadeInterval);
          opacity = 1;
        }
        
        setRingStates(prev => ({
          ...prev,
          hydrant: { ...prev.hydrant, opacity }
        }));
      }, 150); // Slower fade-in
      
      // Stop glowing after 5 seconds
      setTimeout(() => {
        setRingStates(prev => ({
          ...prev,
          hydrant: { ...prev.hydrant, glowing: false }
        }));
      }, 5000);
    }
    
    prevHydrantCompleted.current = hydrantTaskCompleted;
  }, [hydrantTaskCompleted]);
  
  // Handle computer task completion
  useEffect(() => {
    if (computerTaskCompleted && !prevComputerCompleted.current) {
      // First, make sure the ring is at opacity 0
      setRingStates(prev => ({
        ...prev,
        computer: { glowing: true, opacity: 0 }
      }));
      
      // Start fading in the image slowly (over 3 seconds)
      let opacity = 0;
      const fadeInterval = setInterval(() => {
        opacity += 0.05;
        if (opacity >= 1) {
          clearInterval(fadeInterval);
          opacity = 1;
        }
        
        setRingStates(prev => ({
          ...prev,
          computer: { ...prev.computer, opacity }
        }));
      }, 150); // Slower fade-in
      
      // Stop glowing after 5 seconds
      setTimeout(() => {
        setRingStates(prev => ({
          ...prev,
          computer: { ...prev.computer, glowing: false }
        }));
      }, 5000);
    }
    
    prevComputerCompleted.current = computerTaskCompleted;
  }, [computerTaskCompleted]);
  
  // Helper function to get properties for each slot
  const getSlotProps = (taskAtom: 'mirror' | 'hydrant' | 'computer') => {
    const taskCompletedMap = {
      'mirror': mirrorTaskCompleted,
      'hydrant': hydrantTaskCompleted,
      'computer': computerTaskCompleted
    };
    
    return {
      isCompleted: taskCompletedMap[taskAtom],
      glowing: ringStates[taskAtom].glowing,
      opacity: ringStates[taskAtom].opacity
    };
  };
  
  // Calculate the size of each inventory slot based on the breakpoint
  const slotSize = isMobile ? '21%' : '58%';
  
  return (
    <div className="inventory-container" style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: isMobile ? 'center' : 'flex-start',
      paddingTop: isMobile ? 0 : '45px',
    }}>
      <div className="inventory-slots" style={{
        width: isMobile ? '100%' : '90%',
        height: isMobile ? '90%' : '85%',
        padding: '6px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: isMobile ? 'row' : 'column',
        justifyContent: isMobile ? 'center' : 'flex-start',
        alignItems: 'center',
        position: 'relative',
      }}>
        {INVENTORY_ITEMS.map((item) => {
          const slotProps = getSlotProps(item.taskAtom);
          return (
            <MainInventorySlot
              key={item.id}
              name={item.name}
              image={item.image}
              isCompleted={slotProps.isCompleted}
              glowing={slotProps.glowing}
              opacity={slotProps.opacity}
              slotSize={slotSize}
              isMobile={isMobile}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MainSceneInventory; 