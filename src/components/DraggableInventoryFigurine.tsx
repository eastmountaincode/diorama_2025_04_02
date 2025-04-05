import React, { useState, useRef, useEffect } from 'react';

interface DraggableInventoryFigurineProps {
  children: React.ReactNode;
  anchorDependency?: any; // Triggers recalculation (e.g. when breakpoint changes)
}

const DraggableInventoryFigurine: React.FC<DraggableInventoryFigurineProps> = ({ children, anchorDependency }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Absolute position in pixels.
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Use state for dragging to update the cursor style.
  const [isDragging, setIsDragging] = useState(false);
  
  // Store the relative position as a fraction of the container's dimensions.
  const relativePositionRef = useRef({ x: 0, y: 0 });
  
  // Keep track of the last pointer position.
  const lastPointerPosition = useRef<{ x: number; y: number } | null>(null);

  const updateRelativePosition = (newPos: { x: number; y: number }) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      relativePositionRef.current = {
        x: newPos.x / rect.width,
        y: newPos.y / rect.height,
      };
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    lastPointerPosition.current = { x: e.clientX, y: e.clientY };
    containerRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !lastPointerPosition.current) return;
    const dx = e.clientX - lastPointerPosition.current.x;
    const dy = e.clientY - lastPointerPosition.current.y;
    const newPos = { x: position.x + dx, y: position.y + dy };
    setPosition(newPos);
    updateRelativePosition(newPos);
    lastPointerPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    containerRef.current?.releasePointerCapture(e.pointerId);
    lastPointerPosition.current = null;
    // Reset position back to the original.
    setPosition({ x: 0, y: 0 });
    relativePositionRef.current = { x: 0, y: 0 };
  };

  // Update absolute position on window resize.
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setPosition({
          x: relativePositionRef.current.x * rect.width,
          y: relativePositionRef.current.y * rect.height,
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset position when the anchorDependency (e.g. breakpoint) changes.
  useEffect(() => {
    relativePositionRef.current = { x: 0, y: 0 };
    setPosition({ x: 0, y: 0 });
  }, [anchorDependency]);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDragStart={(e) => e.preventDefault()} // Disable native drag.
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(${position.x}px, ${position.y}px)`,
        touchAction: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
        // Apply transition only when not dragging.
        transition: isDragging ? 'none' : 'transform 0.3s ease',
      }}
    >
      {children}
    </div>
  );
};

export default DraggableInventoryFigurine;
