import React from 'react';
import { useAtom } from 'jotai';
import { breakpointAtom, FLOOR_BOUNDARY, FLOOR_BOUNDARY_OFFSET } from '../atoms/gameState';

interface FloorBoundaryProps {
  debug?: boolean; // Show debug visualization
}

const FloorBoundary: React.FC<FloorBoundaryProps> = ({ debug = false }) => {
  const [breakpoint] = useAtom(breakpointAtom);
  
  // Get current points based on breakpoint
  const currentPoints = FLOOR_BOUNDARY[breakpoint];
  
  // Get the offset values
  const offsetX = FLOOR_BOUNDARY_OFFSET.x;
  const offsetY = FLOOR_BOUNDARY_OFFSET.y;

  // Create an SVG points string where each coordinate is shifted by the offset
  const pointsString = `
    ${currentPoints.topLeft.x + offsetX},${currentPoints.topLeft.y + offsetY} 
    ${currentPoints.topRight.x + offsetX},${currentPoints.topRight.y + offsetY} 
    ${currentPoints.bottomRight.x + offsetX},${currentPoints.bottomRight.y + offsetY} 
    ${currentPoints.bottomLeft.x + offsetX},${currentPoints.bottomLeft.y + offsetY}
  `;
  
  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none" 
      viewBox="0 0 100 100"  // This defines a 100x100 coordinate system
      preserveAspectRatio="none"
      style={{ zIndex: debug ? 1000 : -1 }}
    >
      <polygon 
        points={pointsString}
        fill={debug ? "rgba(255, 0, 0, 0.0)" : "transparent"}
        stroke={debug ? "rgba(255, 0, 0, 0.0)" : "transparent"}
        strokeWidth="0"
      />
    </svg>
  );
};

export default FloorBoundary;
