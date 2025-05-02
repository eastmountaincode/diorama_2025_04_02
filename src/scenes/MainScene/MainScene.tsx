import React, { useState, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import {
    breakpointAtom,
    currentSceneAtom,
    isSceneTransitioningAtom,
    isNearMirrorAtom,
    isNearHydrantAtom,
    isNearPhoneAtom,
    isNearComputerAtom,
    isNearRadioAtom,
    mirrorTaskCompletedAtom,
    hydrantTaskCompletedAtom,
    computerTaskCompletedAtom,
    isEndSceneAtom,
    isDraggingFigurineAtom
} from '../../atoms/gameState';
import MainDraggableFigurine from '../../components/MainDraggableFigurine';
import FloorBoundary from './FloorBoundary';
import MainSceneProximityManager from './MainSceneProximityManager';
import { useCursor } from '../../context/CursorContext';

const MainScene: React.FC = () => {
    const [currentScene, setCurrentScene] = useAtom(currentSceneAtom);
    const [isSceneTransitioning, setIsSceneTransitioning] = useAtom(isSceneTransitioningAtom);
    const [opacity, setOpacity] = useState(0);
    const [breakpoint] = useAtom(breakpointAtom);
    const { setCursorType } = useCursor();
    const [isEndScene] = useAtom(isEndSceneAtom);
    const [isDraggingFigurine] = useAtom(isDraggingFigurineAtom);

    // Task completion states
    const [mirrorTaskCompleted] = useAtom(mirrorTaskCompletedAtom);
    const [hydrantTaskCompleted] = useAtom(hydrantTaskCompletedAtom);
    const [computerTaskCompleted] = useAtom(computerTaskCompletedAtom);

    // Check if all tasks are completed
    const allTasksCompleted = mirrorTaskCompleted && hydrantTaskCompleted && computerTaskCompleted;

    // Proximity states for interactive elements
    const [isNearMirror] = useAtom(isNearMirrorAtom);
    const [isNearHydrant] = useAtom(isNearHydrantAtom);
    const [isNearPhone] = useAtom(isNearPhoneAtom);
    const [isNearComputer] = useAtom(isNearComputerAtom);
    const [isNearRadio] = useAtom(isNearRadioAtom);

    // Helper function to avoid resetting cursor when dragging figurine
    const handleMouseLeave = () => {
        // Only change cursor if not dragging the figurine
        if (!isDraggingFigurine) {
            setCursorType('open');
        }
    };

    // Handle mouse down to avoid grasping cursor when clicking on interactive elements
    const handleContainerMouseDown = (e: React.MouseEvent) => {
        // If we're already dragging, let the dragging logic handle it
        if (isDraggingFigurine) return;

        // Get the event target
        const target = e.target as HTMLElement;
        
        // Check if we're directly clicking on one of the interactive elements
        // by checking if the target is one of our interactive images
        const isClickingOnInteractiveElement = 
            target.tagName === 'IMG' && 
            (
                ((target as HTMLImageElement).alt === 'Mirror' && isNearMirror && !isEndScene) ||
                ((target as HTMLImageElement).alt === 'Hydrant' && isNearHydrant && !isEndScene) ||
                ((target as HTMLImageElement).alt === 'Computer' && isNearComputer && !isEndScene) ||
                ((target as HTMLImageElement).alt === 'Radio' && isNearRadio && !isEndScene) ||
                ((target as HTMLImageElement).alt === 'Phone' && isNearPhone)
            );

        // ONLY handle the cursor for direct clicks on interactive elements
        if (isClickingOnInteractiveElement) {
            // Set cursor to pointing for interactive elements
            setCursorType('pointing');
            // Stop propagation to prevent other handlers
            e.stopPropagation();
        }
        // Don't do anything for non-interactive areas to allow default grasping behavior
    };

    // Add effect to handle document-level mouse events
    useEffect(() => {
        // Only apply when in MainScene
        if (currentScene !== 'MainScene') return;

        // Function to handle mouseup at document level to ensure cursor is reset
        const handleDocumentMouseUp = (e: MouseEvent) => {
            if (isDraggingFigurine) return; // Skip if we're dragging

            // Get the event target
            const target = e.target as HTMLElement;
            
            // Only handle mouseup for IMG elements that are interactive
            if (target.tagName === 'IMG') {
                const imgTarget = target as HTMLImageElement;
                if (imgTarget.alt === 'Mirror' && isNearMirror && !isEndScene) setCursorType('pointing');
                else if (imgTarget.alt === 'Hydrant' && isNearHydrant && !isEndScene) setCursorType('pointing');
                else if (imgTarget.alt === 'Computer' && isNearComputer && !isEndScene) setCursorType('pointing');
                else if (imgTarget.alt === 'Radio' && isNearRadio && !isEndScene) setCursorType('pointing');
                else if (imgTarget.alt === 'Phone' && isNearPhone) setCursorType('pointing');
            }
        };

        // Add document-level handlers
        document.addEventListener('mouseup', handleDocumentMouseUp);

        // Cleanup
        return () => {
            document.removeEventListener('mouseup', handleDocumentMouseUp);
        };
    }, [
        currentScene, 
        isDraggingFigurine, 
        isNearMirror, 
        isNearHydrant, 
        isNearComputer, 
        isNearRadio, 
        isNearPhone,
        isEndScene,
        setCursorType
    ]);

    // Initialize cursor to open and let hover events handle specific elements
    useEffect(() => {
        // Only set to open when not in proximity of anything and not dragging
        if (!isDraggingFigurine && 
            !((isNearPhone && isEndScene) || 
              (isNearMirror && !isEndScene) || 
              (isNearHydrant && !isEndScene) || 
              (isNearComputer && !isEndScene) || 
              (isNearRadio && !isEndScene))) {
            setCursorType('open');
        }
    }, [isNearMirror, isNearHydrant, isNearPhone, isNearComputer, isNearRadio, setCursorType, isEndScene, isDraggingFigurine]);

    // Debug state for proximity visualization
    // const [showProximityDebug, setShowProximityDebug] = useState(false);

    // Reference to container - explicitly typed as HTMLDivElement
    const containerRef = useRef<HTMLDivElement>(null);

    // Control whether the figurine can be dragged
    const [canDragFigurine, _] = useState(true);

    // Debug mode for floor boundary
    const debugBoundary = true;

    // Handle interactive element clicks
    const handleMirrorClick = () => {
        if (isNearMirror && !isEndScene) {
            console.log('Mirror clicked!');
            setCurrentScene('MirrorScene');
        }
    };

    const handleHydrantClick = () => {
        if (isNearHydrant && !isEndScene) {
            console.log('Hydrant clicked!');
            setCurrentScene('HydrantScene');
        }
    };

    const handlePhoneClick = () => {
        if (isNearPhone && isEndScene) {
            console.log('Phone clicked in end scene!');
            setCurrentScene('EndGameScene');
        } else if (isNearPhone && !isEndScene) {
            console.log('Phone clicked in normal scene - no action');
        }
    };

    const handleComputerClick = () => {
        if (isNearComputer && !isEndScene) {
            console.log('Computer clicked!');
            setCurrentScene('ComputerScene');
        }
    };

    const handleRadioClick = () => {
        if (isNearRadio && !isEndScene) {
            console.log('Radio clicked!');
            setCurrentScene('RadioScene');
        }
    };

    // Toggle debug visualization with 'D' key
    // useEffect(() => {
    //     const handleKeyDown = (event: KeyboardEvent) => {
    //         if (event.key === 'd' || event.key === 'D') {
    //             setShowProximityDebug(prev => !prev);
    //         }
    //     };

    //     window.addEventListener('keydown', handleKeyDown);
    //     return () => {
    //         window.removeEventListener('keydown', handleKeyDown);
    //     };
    // }, []);

    // Handle visibility based on current scene and transition state
    useEffect(() => {
        if (currentScene === 'MainScene') {
            // Only handle transitions from OpeningScene
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
        } else if (currentScene === 'HydrantScene') {
            // Keep opacity when switching between MainScene and HydrantScene
            // This ensures figure position is preserved
        } else {
            // If this is not the current scene, keep it invisible
            setOpacity(0);
        }
    }, [currentScene, isSceneTransitioning, setIsSceneTransitioning]);


    return (
        <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center z-10 cursor-default"
            style={{
                backgroundImage: isEndScene ? "none" : "url('assets/bg/bg_compressed_pngquant/Diorama_BG-fs8.png')",
                backgroundColor: isEndScene ? "black" : "transparent",
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: isEndScene ? 1 : opacity,
                transition: isSceneTransitioning ? 'opacity 1.5s ease-in' : 'none',
                pointerEvents: currentScene === 'MainScene' ? 'auto' : 'none',
                position: 'relative'
            }}
            onMouseDown={handleContainerMouseDown}
        >
            {/* Background for end scene - completely black */}
            {isEndScene && (
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundColor: 'black',
                        zIndex: 1
                    }}
                />
            )}

            {/* ProximityManager handles all proximity detection and visualization */}
            <MainSceneProximityManager showDebug={false} />

            {/* TV and Boxes */}
            <img
                src="assets/bg/bg_compressed_pngquant/just_tv_and_boxes-fs8.png"
                alt="TV and Boxes"
                style={{
                    position: 'absolute',
                    top: breakpoint === 'mobile' ? '46.6%' : '44.7%',
                    left: breakpoint === 'mobile' ? '16.5%' : '21.7%',
                    width: breakpoint === 'mobile' ? '22%' : '18.6%',
                    height: 'auto',
                    pointerEvents: 'none',
                    zIndex: 40,
                    display: isEndScene ? 'none' : 'block'
                }}
            />

            {/* Mirror */}
            <img
                src="assets/bg/bg_compressed_pngquant/just_mirror-fs8.png"
                alt="Mirror"
                onClick={handleMirrorClick}
                onMouseEnter={() => isNearMirror && !isEndScene && setCursorType('pointing')}
                onMouseLeave={handleMouseLeave}
                style={{
                    position: 'absolute',
                    top: breakpoint === 'mobile' ? '44%' : '40.5%',
                    left: breakpoint === 'mobile' ? '25.1%' : '28.8%',
                    width: breakpoint === 'mobile' ? '10.6%' : '9%',
                    height: 'auto',
                    pointerEvents: isNearMirror && !isEndScene ? 'auto' : 'none',
                    zIndex: 39,
                    filter: isNearMirror && !isEndScene
                        ? 'drop-shadow(0 0 5px rgba(212,14,14,1)) drop-shadow(0 0 2px rgba(212,14,14,1)) drop-shadow(0 0 1px rgba(212,14,14,1))'
                        : 'none',
                    display: isEndScene ? 'none' : 'block'
                }}
                draggable={false}
            />

            {/* Hydrant */}
            <img
                src="assets/bg/bg_compressed_pngquant/just_hydrant-fs8.png"
                alt="Hydrant"
                onClick={handleHydrantClick}
                onMouseEnter={() => isNearHydrant && !isEndScene && setCursorType('pointing')}
                onMouseLeave={handleMouseLeave}
                style={{
                    position: 'absolute',
                    top: breakpoint === 'mobile' ? '44%' : '40.7%',
                    left: breakpoint === 'mobile' ? '32%' : '34.8%',
                    width: breakpoint === 'mobile' ? '6.3%' : '4.9%',
                    height: 'auto',
                    pointerEvents: isNearHydrant && !isEndScene ? 'auto' : 'none',
                    zIndex: 39,
                    filter: isNearHydrant && !isEndScene
                        ? 'drop-shadow(0 0 5px rgba(212,14,14,1)) drop-shadow(0 0 2px rgba(212,14,14,1)) drop-shadow(0 0 1px rgba(212,14,14,1))'
                        : 'none',
                    display: isEndScene ? 'none' : 'block'
                }}
                draggable={false}
            />

            {/* Water Leaking Animation - only shows when hydrant task is not completed */}
            {!hydrantTaskCompleted && !isEndScene && (
                <img
                    src="assets/bg/hydrant/far/hydrant_ON.GIF"
                    alt="Water Leaking"
                    style={{
                        position: 'absolute',
                        top: breakpoint === 'mobile' ? '45.55%' : '42.9%',
                        left: breakpoint === 'mobile' ? '32.5%' : '35.3%',
                        width: breakpoint === 'mobile' ? '8.7%' : '6.8%',
                        height: 'auto',
                        pointerEvents: 'none',
                        zIndex: 44,
                        display: isEndScene ? 'none' : 'block'
                    }}
                    draggable={false}
                />
            )}

            {/* Sparks animation - only shows when hydrant task is not completed */}
            {!hydrantTaskCompleted && !isEndScene && (
                <img
                    src="assets/bg/hydrant/far/hydrant_sparks_ON.GIF"
                    alt="Sparks"
                    style={{
                        position: 'absolute',
                        top: breakpoint === 'mobile' ? '46%' : '45.5%',
                        left: breakpoint === 'mobile' ? '34%' : '38%',
                        width: breakpoint === 'mobile' ? '12%' : '8%',
                        height: 'auto',
                        pointerEvents: 'none',
                        zIndex: 44,
                        display: isEndScene ? 'none' : 'block'
                    }}
                    draggable={false}
                />
            )}

            {/* Stairs */}
            <img
                src="assets/bg/bg_compressed_pngquant/just_stairs-fs8.png"
                alt="Stairs"
                style={{
                    position: 'absolute',
                    top: breakpoint === 'mobile' ? '27.5%' : '13.5%',
                    left: breakpoint === 'mobile' ? '31%' : '33.9%',
                    width: breakpoint === 'mobile' ? '29%' : '24.2%',
                    height: 'auto',
                    pointerEvents: 'none',
                    zIndex: 40,
                    display: isEndScene ? 'none' : 'block'
                }}
                draggable={false}
            />


            {/* Phone */}
            <img
                src="assets/bg/bg_compressed_pngquant/just_phone-fs8.png"
                alt="Phone"
                onClick={handlePhoneClick}
                onMouseEnter={() => isNearPhone && setCursorType('pointing')}
                onMouseLeave={handleMouseLeave}
                style={{
                    position: 'absolute',
                    top: breakpoint === 'mobile' ? '34.9%' : '25.6%',
                    left: breakpoint === 'mobile' ? '41.7%' : '43.0%',
                    width: breakpoint === 'mobile' ? '13%' : '10.6%',
                    height: 'auto',
                    pointerEvents: isNearPhone ? 'auto' : 'none',
                    zIndex: 39,
                    filter: isNearPhone && isEndScene
                        ? 'drop-shadow(0 0 5px rgba(212,14,14,1)) drop-shadow(0 0 2px rgba(212,14,14,1)) drop-shadow(0 0 1px rgba(212,14,14,1))'
                        : 'none',
                    opacity: isEndScene ? 0 : 1,
                    animation: isEndScene ? 'fadeIn 4s forwards 1s' : 'none'
                }}
                draggable={false}
            />


            {/* Stuff in front of computer */}
            <img
                src="assets/bg/bg_compressed_pngquant/just_stuff_in_front_of_computer-fs8.png"
                alt="Stuff In Front of Computer"
                style={{
                    position: 'absolute',
                    top: breakpoint === 'mobile' ? '40.9%' : '35.2%',
                    left: breakpoint === 'mobile' ? '51.2%' : '51.0%',
                    width: breakpoint === 'mobile' ? '15.5%' : '13%',
                    height: 'auto',
                    pointerEvents: 'none',
                    zIndex: 40,
                    display: isEndScene ? 'none' : 'block'
                }}
                draggable={false}
            />


            {/* Computer */}
            <img
                src="assets/bg/bg_compressed_pngquant/just_computer-fs8.png"
                alt="Computer"
                onClick={handleComputerClick}
                onMouseEnter={() => isNearComputer && !isEndScene && setCursorType('pointing')}
                onMouseLeave={handleMouseLeave}
                style={{
                    position: 'absolute',
                    top: breakpoint === 'mobile' ? '39.4%' : '32.45%',
                    left: breakpoint === 'mobile' ? '55.1%' : '54.3%',
                    width: breakpoint === 'mobile' ? '9.1%' : '7.7%',
                    height: 'auto',
                    pointerEvents: isNearComputer && !isEndScene ? 'auto' : 'none',
                    zIndex: 39,
                    filter: isNearComputer && !isEndScene
                        ? 'drop-shadow(0 0 5px rgba(212,14,14,1)) drop-shadow(0 0 2px rgba(212,14,14,1)) drop-shadow(0 0 1px rgba(212,14,14,1))'
                        : 'none',
                    display: isEndScene ? 'none' : 'block'
                }}
                draggable={false}
            />

            {/* Radio */}
            <img
                src="assets/bg/bg_compressed_pngquant/just_radio-fs8.png"
                alt="Radio"
                onClick={handleRadioClick}
                onMouseEnter={() => isNearRadio && !isEndScene && setCursorType('pointing')}
                onMouseLeave={handleMouseLeave}
                style={{
                    position: 'absolute',
                    top: breakpoint === 'mobile' ? '49%' : '48.5%',
                    left: breakpoint === 'mobile' ? '70.5%' : '67.6%',
                    width: breakpoint === 'mobile' ? '5.8%' : '4.7%',
                    height: 'auto',
                    pointerEvents: isNearRadio && !isEndScene ? 'auto' : 'none',
                    zIndex: 39,
                    filter: (isNearRadio || allTasksCompleted) && !isEndScene
                        ? 'drop-shadow(0 0 5px rgba(212,14,14,1)) drop-shadow(0 0 2px rgba(212,14,14,1)) drop-shadow(0 0 1px rgba(212,14,14,1))'
                        : 'none',
                    display: isEndScene ? 'none' : 'block',
                    animation: allTasksCompleted && !isEndScene ? 'pulse 2s infinite' : 'none'
                }}
                draggable={false}
            />


            {/* Floor Boundary */}
            <FloorBoundary debug={debugBoundary} />

            {/* Main Figurine */}

            <MainDraggableFigurine
                containerRef={containerRef}
                canDragFigurine={canDragFigurine}
            />

            {/* Add animation keyframes */}
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    
                    @keyframes pulse {
                        0% { filter: drop-shadow(0 0 5px rgba(212,14,14,1)) drop-shadow(0 0 2px rgba(212,14,14,1)) drop-shadow(0 0 1px rgba(212,14,14,1)); }
                        50% { filter: drop-shadow(0 0 8px rgba(212,14,14,1)) drop-shadow(0 0 4px rgba(212,14,14,1)) drop-shadow(0 0 2px rgba(212,14,14,1)); }
                        100% { filter: drop-shadow(0 0 5px rgba(212,14,14,1)) drop-shadow(0 0 2px rgba(212,14,14,1)) drop-shadow(0 0 1px rgba(212,14,14,1)); }
                    }
                `}
            </style>

        </div>
    );
};

export default MainScene; 