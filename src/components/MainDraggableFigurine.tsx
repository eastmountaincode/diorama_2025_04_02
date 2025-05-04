import React, { useState, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { 
  breakpointAtom, 
  isSceneTransitioningAtom, 
  FLOOR_BOUNDARY, 
  FLOOR_BOUNDARY_OFFSET,
  FloorBoundaryShape,
  figurinePositionAtom,
  isDraggingFigurineAtom
} from '../atoms/gameState';
import { useCursor } from '../context/CursorContext';

interface MainDraggableFigurineProps {
  containerRef: any; // Using any to bypass type check issues temporarily
  canDragFigurine?: boolean;
}

// Helper function to check if a point is inside a trapezoid
// The trapezoid is defined by four points (in percentage of container size)
const isInsideTrapezoid = (
  x: number, 
  y: number, 
  trapezoid: FloorBoundaryShape
) => {
  // Convert percentages to actual coordinates
  const points = [
    [trapezoid.topLeft.x, trapezoid.topLeft.y],
    [trapezoid.topRight.x, trapezoid.topRight.y],
    [trapezoid.bottomRight.x, trapezoid.bottomRight.y],
    [trapezoid.bottomLeft.x, trapezoid.bottomLeft.y]
  ];
  
  // Ray casting algorithm to determine if point is inside polygon
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i][0], yi = points[i][1];
    const xj = points[j][0], yj = points[j][1];
    
    const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  
  return inside;
};

const MainDraggableFigurine: React.FC<MainDraggableFigurineProps> = ({
  containerRef,
  canDragFigurine = false,
}) => {
  const [breakpoint] = useAtom(breakpointAtom);
  const [isSceneTransitioning] = useAtom(isSceneTransitioningAtom);
  const { setCursorType } = useCursor();
  
  // Reference to the figurine element
  const figurineRef = useRef<HTMLDivElement>(null);
  
  // Store current position as x/y percentages from the top-left (0-100 scale)
  const [position, setPosition] = useState({ x: 0, y: 0 });
  // Share position with MainScene for proximity detection
  const [_, setFigurinePosition] = useAtom(figurinePositionAtom);
  const [isDragging, setIsDragging] = useState(false);
  // Share dragging state with MainScene to prevent cursor change when dragging
  const [, setIsDraggingFigurine] = useAtom(isDraggingFigurineAtom);
  
  // Store the initial click offset from the figurine center
  const clickOffset = useRef({ x: 0, y: 0 });
  
  // Get current boundary based on breakpoint and apply the offset
  const getBoundaryWithOffset = () => {
    const base = FLOOR_BOUNDARY[breakpoint];
    return {
      topLeft: { x: base.topLeft.x + FLOOR_BOUNDARY_OFFSET.x, y: base.topLeft.y + FLOOR_BOUNDARY_OFFSET.y },
      topRight: { x: base.topRight.x + FLOOR_BOUNDARY_OFFSET.x, y: base.topRight.y + FLOOR_BOUNDARY_OFFSET.y },
      bottomRight: { x: base.bottomRight.x + FLOOR_BOUNDARY_OFFSET.x, y: base.bottomRight.y + FLOOR_BOUNDARY_OFFSET.y },
      bottomLeft: { x: base.bottomLeft.x + FLOOR_BOUNDARY_OFFSET.x, y: base.bottomLeft.y + FLOOR_BOUNDARY_OFFSET.y }
    };
  };
  
  // Figurine height as percentage of container (used to calculate bottom point)
  const figurineHeight = breakpoint === 'mobile' ? 4.0 : 5.5;
  
  // Set initial position based on breakpoint
  useEffect(() => {
    if (containerRef.current) {
      // Center the figurine within the floor boundary
      const boundary = getBoundaryWithOffset();
      
      // Calculate center of the boundary
      const centerX = (boundary.topLeft.x + boundary.topRight.x + boundary.bottomRight.x + boundary.bottomLeft.x) / 4;
      const centerY = (boundary.topLeft.y + boundary.topRight.y + boundary.bottomRight.y + boundary.bottomLeft.y) / 4;
      
      setPosition({
        x: centerX,
        y: centerY
      });
    }
  }, [breakpoint, containerRef]);
  
  // Update figurine position atom whenever position changes
  useEffect(() => {
    // Apply an offset for more accurate position tracking 
    // (desktop only since mobile appears correct)
    const positionOffsetX = breakpoint === 'mobile' ? 0 : 2.5;
    const positionOffsetY = breakpoint === 'mobile' ? 0 : -1;
    setFigurinePosition({
      x: position.x + positionOffsetX,
      y: position.y + positionOffsetY
    });
  }, [position, setFigurinePosition, breakpoint]);
  
  // Set cursor based on dragging state and update global dragging state
  useEffect(() => {
    if (canDragFigurine) {
      setCursorType(isDragging ? 'pinching' : 'open');
      setIsDraggingFigurine(isDragging);
    }
  }, [isDragging, canDragFigurine, setCursorType, setIsDraggingFigurine]);
  
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isSceneTransitioning || !figurineRef.current || !canDragFigurine) return;
    
    e.preventDefault();
    setIsDragging(true);
    setCursorType('pinching');
  
    const figurineRect = figurineRef.current.getBoundingClientRect();
  
    // Account for CSS transform translate(-14%, -77%) and translate(-20%, -67%)
    const offsetX = breakpoint === 'mobile' ? figurineRect.width * 0.358 : figurineRect.width * 0.367;
    const offsetY = breakpoint === 'mobile' ? figurineRect.height * -0.179 : figurineRect.height * -0.27;
  
    clickOffset.current = {
      x: e.clientX - (figurineRect.left + figurineRect.width / 2 - offsetX),
      y: e.clientY - (figurineRect.top + figurineRect.height / 2 - offsetY),
    };
  
    figurineRef.current.setPointerCapture(e.pointerId);
  };
  
  
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current || !canDragFigurine) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Calculate the new center position of the figurine (accounting for click offset)
    const newCenterX = e.clientX - clickOffset.current.x - containerRect.left;
    const newCenterY = e.clientY - clickOffset.current.y - containerRect.top;
    
    // Convert to percentages using the same 0-100 scale as the SVG viewBox
    const newX = (newCenterX / containerRect.width) * 100;
    const newY = (newCenterY / containerRect.height) * 100;
    
    // Calculate the BOTTOM point of the figurine (center point + half height)
    // Since the figurine is transformed with translate(-14%, -77%) and translate(-20%, -67%),
    // we need to adjust the calculation of the bottom point
    // this is just for boundary detection
    const bottomY = newY - (figurineHeight * -0.68);
    
    // Get the current boundary with offset applied
    const currentBoundary = getBoundaryWithOffset();
    
    // Check if the BOTTOM point of the figurine is within the floor boundary
    // We still use the center X position, but the bottom Y position
    if (isInsideTrapezoid(newX, bottomY, currentBoundary)) {
      // Set position as percentages of container size (still using center position for placement)
      setPosition({ x: newX, y: newY });
    }
  };
  
  const handlePointerUp = (e: React.PointerEvent) => {
    if (figurineRef.current) {
      figurineRef.current.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
    setCursorType('open');
  };
  
  return (
    <div 
      ref={figurineRef}
      className="absolute"
      style={{
        // Position using top/left with the same coordinate system as the SVG viewBox
        top: `${position.y}%`,
        left: `${position.x}%`,
        transform: breakpoint === 'mobile' ? 'translate(-14%, -69%)' : 'translate(-14%, -77%)', // Original transform that worked with positioning
        
        // Size control based on breakpoint
        width: breakpoint === 'mobile' ? '7.5%' : '6.8%',
        
        // Other styles
        zIndex: 11130,

      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <img 
        src={isDragging ? "assets/figure/laila_grabbed_scaled-min.png" : "assets/figure/Laila_sprite_cropped.png"}
        alt="Laila Figurine"
        style={{
          width: isDragging ? '100%' : '111%',
          height: 'auto',
          transform: isDragging ? (breakpoint === 'mobile' ? 'translate(0%, -4%)' : 'translate(0%, -4%) scale(1.11)') : 'none'
        }}
        draggable={false}
        className="pointer-events-none"
      />
    </div>
  );
};

export default MainDraggableFigurine; 