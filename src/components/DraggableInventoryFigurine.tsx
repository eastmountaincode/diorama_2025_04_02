import React, { useState, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { dropZoneRectAtom, isFigurineTouchingDropZoneAtom, isFigurinePlacedAtom } from '../atoms/gameState';
import { useCursor } from '../context/CursorContext';

interface DraggableInventoryFigurineProps {
    children: React.ReactNode;
    anchorDependency?: any; // Triggers recalculation (e.g. when breakpoint changes)
}

const DraggableInventoryFigurine: React.FC<DraggableInventoryFigurineProps> = ({ children, anchorDependency }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { setCursorType } = useCursor();

    // Absolute position in pixels.
    const [position, setPosition] = useState({ x: 0, y: 0 });

    // Use state for dragging to update the cursor style.
    const [isDragging, setIsDragging] = useState(false);
    
    // Track hover state for subtle hover effect
    const [isHovered, setIsHovered] = useState(false);

    // Store the relative position as a fraction of the container's dimensions.
    const relativePositionRef = useRef({ x: 0, y: 0 });

    // Keep track of the last pointer position.
    const lastPointerPosition = useRef<{ x: number; y: number } | null>(null);

    // Atoms for drop zone rect and collision status.
    const [dropZoneShape] = useAtom(dropZoneRectAtom);
    const [isFigurineTouchingDropZone, setIsFigurineOverDropZone] = useAtom(isFigurineTouchingDropZoneAtom);
    const [isFigurinePlaced, setIsFigurinePlaced] = useAtom(isFigurinePlacedAtom);

    // Update cursor type based on hover and drag state
    useEffect(() => {
        if (isDragging) {
            setCursorType('grabbing');
        } else if (isHovered && !isFigurinePlaced) {
            setCursorType('pointer');
        } else {
            setCursorType('default');
        }
    }, [isDragging, isHovered, isFigurinePlaced, setCursorType]);

    // Helper function to check if a point is inside an ellipse
    const isPointInsideEllipse = (
        x: number, 
        y: number, 
        ellipseCx: number, 
        ellipseCy: number, 
        ellipseRx: number, 
        ellipseRy: number
    ): boolean => {
        // Formula for point inside ellipse: ((x-h)^2 / a^2) + ((y-k)^2 / b^2) <= 1
        // where (h,k) is center, a is x-radius, b is y-radius
        if (ellipseRx === 0 || ellipseRy === 0) return false;
        
        const normalizedX = Math.pow(x - ellipseCx, 2) / Math.pow(ellipseRx, 2);
        const normalizedY = Math.pow(y - ellipseCy, 2) / Math.pow(ellipseRy, 2);
        
        return normalizedX + normalizedY <= 1;
    };

    // Check for collision with the elliptical drop zone
    const updateCollisionStatus = () => {
        if (containerRef.current && dropZoneShape.active) {
            const figurineRect = containerRef.current.getBoundingClientRect();
            
            // Get the figurine dimensions
            const figurineWidth = figurineRect.width;
            const figurineHeight = figurineRect.height;
            
            // Check multiple points on the figurine
            const pointsToCheck = [
                // Center
                {
                    x: figurineRect.left + figurineWidth / 2,
                    y: figurineRect.top + figurineHeight / 2
                },
                // Bottom center (more important for a figurine)
                {
                    x: figurineRect.left + figurineWidth / 2,
                    y: figurineRect.bottom - figurineHeight * 0.1 // 10% from bottom
                },
                // Four points around the center
                {
                    x: figurineRect.left + figurineWidth * 0.3, // 30% from left
                    y: figurineRect.top + figurineHeight * 0.5  // center vertically
                },
                {
                    x: figurineRect.left + figurineWidth * 0.7, // 70% from left
                    y: figurineRect.top + figurineHeight * 0.5  // center vertically
                },
                {
                    x: figurineRect.left + figurineWidth * 0.5, // center horizontally
                    y: figurineRect.top + figurineHeight * 0.3  // 30% from top
                },
                {
                    x: figurineRect.left + figurineWidth * 0.5, // center horizontally
                    y: figurineRect.top + figurineHeight * 0.7  // 70% from top
                }
            ];
            
            // Check if any of the points is inside the ellipse
            const collision = pointsToCheck.some(point => 
                isPointInsideEllipse(
                    point.x,
                    point.y,
                    dropZoneShape.cx,
                    dropZoneShape.cy,
                    dropZoneShape.rx,
                    dropZoneShape.ry
                )
            );
            
            setIsFigurineOverDropZone(collision);
        } else {
            setIsFigurineOverDropZone(false);
        }
    };

    const updateRelativePosition = (newPos: { x: number; y: number }) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            relativePositionRef.current = {
                x: newPos.x / rect.width,
                y: newPos.y / rect.height,
            };
        }
    };

    const handlePointerEnter = () => {
        if (!isFigurinePlaced) {
            setIsHovered(true);
        }
    };

    const handlePointerLeave = () => {
        setIsHovered(false);
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        // If the figurine is already placed, don't allow dragging
        if (isFigurinePlaced) return;
        
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

        // Update collision status during movement.
        updateCollisionStatus();
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDragging(false);
        containerRef.current?.releasePointerCapture(e.pointerId);
        lastPointerPosition.current = null;
        
        // If the figurine is touching the drop zone, mark it as placed
        if (isFigurineTouchingDropZone) {
            setIsFigurinePlaced(true);
        } else {
            // Otherwise, reset position back to the original
            setPosition({ x: 0, y: 0 });
            relativePositionRef.current = { x: 0, y: 0 };
            setIsFigurineOverDropZone(false);
        }
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
            // Recheck collision in case sizes changed.
            updateCollisionStatus();
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Reset position when the anchorDependency (e.g. breakpoint) changes.
    useEffect(() => {
        relativePositionRef.current = { x: 0, y: 0 };
        setPosition({ x: 0, y: 0 });
    }, [anchorDependency]);
    
    // If the figurine has been placed, don't render the draggable component
    if (isFigurinePlaced) {
        return null;
    }

    // Determine scale based on state - very subtle
    const scale = isDragging ? 1.03 : isHovered ? 1.03 : 1;

    return (
        <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
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
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                touchAction: 'none',
                transition: isDragging 
                    ? 'none' 
                    : 'transform 0.2s ease',
            }}
        >
            {children}
        </div>
    );
};

export default DraggableInventoryFigurine;
