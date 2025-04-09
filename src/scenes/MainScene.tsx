import React, { useState, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { currentSceneAtom, isSceneTransitioningAtom } from '../atoms/gameState';
import MainDraggableFigurine from '../components/MainDraggableFigurine';
import FloorBoundary from '../components/FloorBoundary';

const MainScene: React.FC = () => {
    const [currentScene] = useAtom(currentSceneAtom);
    const [isSceneTransitioning, setIsSceneTransitioning] = useAtom(isSceneTransitioningAtom);
    const [opacity, setOpacity] = useState(0);
    
    // Reference to container - explicitly typed as HTMLDivElement
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Control whether the figurine can be dragged
    const [canDragFigurine, _] = useState(true);
    
    // Debug mode for floor boundary
    const debugBoundary = true;
    
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
            {/* TV and Boxes */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: "url('assets/bg/just_tv_and_boxes.png')",
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    pointerEvents: 'none', // Allow clicks to pass through to elements below
                    zIndex: 40,
                }}
            />
            
            {/* Mirror */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: "url('assets/bg/just_mirror.png')",
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    pointerEvents: 'none',
                    zIndex: 39,
                    filter: 'drop-shadow(0 0 5px rgba(212, 14, 14, 1)) drop-shadow(0 0 2px rgba(212, 14, 14, 1)) drop-shadow(0 0 1px rgba(212, 14, 14, 1))',
                }}
            />
            
            {/* Hydrant */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: "url('assets/bg/just_hydrant.png')",
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    pointerEvents: 'none',
                    zIndex: 39,
                    filter: 'drop-shadow(0 0 5px rgba(212, 14, 14, 1)) drop-shadow(0 0 2px rgba(212, 14, 14, 1)) drop-shadow(0 0 1px rgba(212, 14, 14, 1))',
                }}
            />

            {/* Stairs */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: "url('assets/bg/just_stairs.png')",
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',  
                    pointerEvents: 'none',
                    zIndex: 40,
                }}
            />

            {/* Phone */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: "url('assets/bg/just_phone.png')",
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    pointerEvents: 'none',
                    zIndex: 39,
                    filter: 'drop-shadow(0 0 5px rgba(212, 14, 14, 1)) drop-shadow(0 0 2px rgba(212, 14, 14, 1)) drop-shadow(0 0 1px rgba(212, 14, 14, 1))',
                }}
            />

            {/* Stuff in front of computer */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: "url('assets/bg/just_stuff_in_front_of_computer.png')",
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    pointerEvents: 'none',
                    zIndex: 40,
                }}
            />

            {/* Computer */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: "url('assets/bg/just_computer.png')",
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    pointerEvents: 'none',
                    zIndex: 39,
                    filter: 'drop-shadow(0 0 5px rgba(212, 14, 14, 1)) drop-shadow(0 0 2px rgba(212, 14, 14, 1)) drop-shadow(0 0 1px rgba(212, 14, 14, 1))',
                }}
            />
            
            
            
            
            
            
            
            
            
            
            {/* Floor Boundary */}
            <FloorBoundary debug={debugBoundary} />
            
            {/* Main Figurine */}
            <MainDraggableFigurine 
                containerRef={containerRef}
                canDragFigurine={canDragFigurine}
            />
            
        </div>
    );
};

export default MainScene; 