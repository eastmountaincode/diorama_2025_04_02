import React, { useState, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { currentSceneAtom, isSceneTransitioningAtom, breakpointAtom, hudTransformAtom } from '../atoms/gameState';

const MainScene: React.FC = () => {
    const [currentScene] = useAtom(currentSceneAtom);
    const [isSceneTransitioning, setIsSceneTransitioning] = useAtom(isSceneTransitioningAtom);
    const [breakpoint] = useAtom(breakpointAtom);
    const [hudTransform] = useAtom(hudTransformAtom);
    const [opacity, setOpacity] = useState(0);
    
    // Add state for figurine dragging
    const [figurinePosition, setFigurinePosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const lastPointerPosition = useRef({ x: 0, y: 0 });
    
    // Handle visibility based on current scene and transition state
    useEffect(() => {
        if (currentScene === 'MainScene') {
            // If we're transitioning to this scene, animate the fade in
            if (isSceneTransitioning) {
                setOpacity(0);
                const timer = setTimeout(() => {
                    setOpacity(1);
                    
                    // Turn off transition flag after MainScene is fully faded in 
                    // and OpeningScene has started fading out
                    setTimeout(() => {
                        setIsSceneTransitioning(false);
                    }, 3000); // Coordinate with OpeningScene fade-out
                }, 100);
                
                return () => clearTimeout(timer);
            } else {
                // When not in transition mode but this is the current scene, ensure scene is fully visible
                setOpacity(1);
            }
        } else {
            // If this is not the current scene, keep it invisible
            setOpacity(0);
        }
    }, [currentScene, isSceneTransitioning, setIsSceneTransitioning]);
    
    // Add drag handlers
    const handlePointerDown = (e: React.PointerEvent) => {
        // Don't allow dragging during transitions
        if (isSceneTransitioning) return;
        
        e.preventDefault();
        setIsDragging(true);
        lastPointerPosition.current = { x: e.clientX, y: e.clientY };
        
        // Capture the pointer to track movement even outside the element
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };
    
    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        
        // Calculate raw movement
        const dx = e.clientX - lastPointerPosition.current.x;
        const dy = e.clientY - lastPointerPosition.current.y;
        
        // Adjust for zoom level - divide by zoom to get correct movement
        const zoomFactor = hudTransform.zoom;
        const scaledDx = dx / zoomFactor;
        const scaledDy = dy / zoomFactor;
        
        setFigurinePosition(prev => ({
            x: prev.x + scaledDx,
            y: prev.y + scaledDy
        }));
        
        lastPointerPosition.current = { x: e.clientX, y: e.clientY };
    };
    
    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDragging(false);
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    };
    
    return (
        <div 
            className="w-full h-full flex items-center justify-center z-10"
            style={{
                backgroundImage: "url('assets/bg/Diorama_BG.png')",
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity,
                transition: isSceneTransitioning ? 'opacity 1.5s ease-in' : 'none',
                pointerEvents: currentScene === 'MainScene' ? 'auto' : 'none',
            }}
        >
            {/* Main Figurine */}
            <div 
                className="absolute" 
                style={{
                    // Vertical positioning - use either top or bottom
                    bottom: breakpoint === 'mobile' ? '41.6%' : '35.8%',     // Moved higher up from the bottom
                    
                    // Horizontal positioning - use either left or right
                    left: breakpoint === 'mobile' ? '49.3%' : '49.1%',       // Moved left of center
                    
                    // Add dragging translation to existing transform
                    transform: `translateX(-50%) translate(${figurinePosition.x}px, ${figurinePosition.y}px)`,
                    
                    // Size control based on breakpoint
                    width: breakpoint === 'mobile' ? '7.3%' : '4.5%',
                    
                    // Layer control
                    zIndex: 130,
                    
                    // Cursor styles
                    cursor: isDragging ? 'grabbing' : 'grab',
                    
                    // Smooth transition when releasing
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                <img 
                    src="assets/figure/Laila_sprite_cropped.png"
                    alt="Laila Figurine"
                    style={{
                        width: '100%',
                        height: 'auto',

                    }}
                    draggable={false}
                    className="pointer-events-none"
                />
            </div>
        </div>
    );
};

export default MainScene; 