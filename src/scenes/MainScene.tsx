import React, { useState, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { currentSceneAtom, isSceneTransitioningAtom, breakpointAtom } from '../atoms/gameState';

const MainScene: React.FC = () => {
    const [currentScene] = useAtom(currentSceneAtom);
    const [isSceneTransitioning, setIsSceneTransitioning] = useAtom(isSceneTransitioningAtom);
    const [breakpoint] = useAtom(breakpointAtom);
    const [opacity, setOpacity] = useState(0);
    
    // Reference to container and figurine
    const containerRef = useRef<HTMLDivElement>(null);
    const figurineRef = useRef<HTMLDivElement>(null);
    
    // Store current position as x/y pixels from the top-left
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    
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
    
    // Store the initial click offset from the figurine center
    const clickOffset = useRef({ x: 0, y: 0 });
    
    const handlePointerDown = (e: React.PointerEvent) => {
        if (isSceneTransitioning || !figurineRef.current) return;
        
        e.preventDefault();
        setIsDragging(true);
        
        // Calculate offset from click point to figurine center
        const figurineRect = figurineRef.current.getBoundingClientRect();
        clickOffset.current = {
            x: e.clientX - (figurineRect.left + figurineRect.width / 2),
            y: e.clientY - (figurineRect.top + figurineRect.height / 2)
        };
        
        // Capture pointer
        figurineRef.current.setPointerCapture(e.pointerId);
    };
    
    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging || !containerRef.current) return;
        
        const containerRect = containerRef.current.getBoundingClientRect();
        
        // Get container dimensions
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        
        // Calculate the new center position of the figurine (accounting for click offset)
        const newCenterX = e.clientX - clickOffset.current.x - containerRect.left;
        const newCenterY = e.clientY - clickOffset.current.y - containerRect.top;
        
        // Set position as percentages of container size
        setPosition({
            x: (newCenterX / containerWidth) * 100,
            y: (newCenterY / containerHeight) * 100
        });
    };
    
    const handlePointerUp = (e: React.PointerEvent) => {
        if (figurineRef.current) {
            figurineRef.current.releasePointerCapture(e.pointerId);
        }
        setIsDragging(false);
    };
    
    // Set initial position
    useEffect(() => {
        if (containerRef.current) {
            
            // Convert the bottom/left positioning to top/left
            const bottomPos = breakpoint === 'mobile' ? 41.6 : 35.8;
            const leftPos = breakpoint === 'mobile' ? 49.3 : 49.1;
            
            setPosition({
                x: leftPos,
                y: 100 - bottomPos
            });
        }
    }, [breakpoint]);
    
    return (
        <div 
            ref={containerRef}
            className="w-full h-full flex items-center justify-center z-10"
            style={{
                backgroundImage: "url('assets/bg/Diorama_BG.png')",
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity,
                transition: isSceneTransitioning ? 'opacity 1.5s ease-in' : 'none',
                pointerEvents: currentScene === 'MainScene' ? 'auto' : 'none',
                position: 'relative'
            }}
        >
            {/* Main Figurine */}
            <div 
                ref={figurineRef}
                className="absolute" 
                style={{
                    // Position using top/left rather than bottom/left
                    top: `${position.y}%`,
                    left: `${position.x}%`,
                    transform: 'translate(-50%, -50%)', // Center the figurine
                    
                    // Size control based on breakpoint
                    width: breakpoint === 'mobile' ? '7.3%' : '4.5%',
                    
                    // Other styles
                    zIndex: 130,
                    cursor: isDragging ? 'grabbing' : 'grab',
                    transition: isDragging ? 'none' : 'all 0.1s ease-out'
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