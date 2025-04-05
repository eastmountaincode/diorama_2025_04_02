import React, { useState, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { dropZoneRectAtom, isFigurineTouchingDropZoneAtom } from '../atoms/gameState';

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

    // Atoms for drop zone rect and collision status.
    const [dropZoneShape] = useAtom(dropZoneRectAtom);
    const [, setIsFigurineOverDropZone] = useAtom(isFigurineTouchingDropZoneAtom);

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
            
            // Use the center point of the figurine for collision detection
            const figurineCenterX = figurineRect.left + figurineRect.width / 2;
            const figurineCenterY = figurineRect.top + figurineRect.height / 2;
            
            // Check if the center of the figurine is inside the ellipse
            const collision = isPointInsideEllipse(
                figurineCenterX,
                figurineCenterY,
                dropZoneShape.cx,
                dropZoneShape.cy,
                dropZoneShape.rx,
                dropZoneShape.ry
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

        // Update collision status during movement.
        updateCollisionStatus();
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDragging(false);
        containerRef.current?.releasePointerCapture(e.pointerId);
        lastPointerPosition.current = null;
        // Reset position back to the original.
        setPosition({ x: 0, y: 0 });
        relativePositionRef.current = { x: 0, y: 0 };

        // Always set to false when releasing
        setIsFigurineOverDropZone(false);
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
