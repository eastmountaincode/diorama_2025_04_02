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
    isNearRadioAtom
} from '../../atoms/gameState';
import MainDraggableFigurine from '../../components/MainDraggableFigurine';
import FloorBoundary from '../../components/FloorBoundary';
import MainSceneProximityManager from './MainSceneProximityManager';
import { useCursor } from '../../context/CursorContext';

const MainScene: React.FC = () => {
    const [currentScene, setCurrentScene] = useAtom(currentSceneAtom);
    const [isSceneTransitioning, setIsSceneTransitioning] = useAtom(isSceneTransitioningAtom);
    const [opacity, setOpacity] = useState(0);
    const [breakpoint] = useAtom(breakpointAtom);
    const { setCursorType } = useCursor();

    // Proximity states for interactive elements
    const [isNearMirror] = useAtom(isNearMirrorAtom);
    const [isNearHydrant] = useAtom(isNearHydrantAtom);
    const [isNearPhone] = useAtom(isNearPhoneAtom);
    const [isNearComputer] = useAtom(isNearComputerAtom);
    const [isNearRadio] = useAtom(isNearRadioAtom);

    // Update cursor type based on proximity
    useEffect(() => {
        if (isNearMirror || isNearHydrant || isNearPhone || isNearComputer || isNearRadio) {
            setCursorType('pointer');
        } else {
            setCursorType('default');
        }
    }, [isNearMirror, isNearHydrant, isNearPhone, isNearComputer, isNearRadio, setCursorType]);

    // Debug state for proximity visualization
    const [showProximityDebug, setShowProximityDebug] = useState(false);

    // Reference to container - explicitly typed as HTMLDivElement
    const containerRef = useRef<HTMLDivElement>(null);

    // Control whether the figurine can be dragged
    const [canDragFigurine, _] = useState(true);

    // Debug mode for floor boundary
    const debugBoundary = true;

    // Handle interactive element clicks
    const handleMirrorClick = () => {
        if (isNearMirror) {
            console.log('Mirror clicked!');
        }
    };

    const handleHydrantClick = () => {
        if (isNearHydrant) {
            console.log('Hydrant clicked!');
            setCurrentScene('HydrantScene');
        }
    };

    const handlePhoneClick = () => {
        if (isNearPhone) {
            console.log('Phone clicked!');
        }
    };

    const handleComputerClick = () => {
        if (isNearComputer) {
            console.log('Computer clicked!');
        }
    };

    const handleRadioClick = () => {
        if (isNearRadio) {
            console.log('Radio clicked!');
        }
    };

    // Toggle debug visualization with 'D' key
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'd' || event.key === 'D') {
                setShowProximityDebug(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

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
                backgroundImage: "url('assets/bg/bg_compressed_pngquant/Diorama_BG-fs8.png')",
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: currentScene === 'HydrantScene' ? 1 : opacity,
                transition: isSceneTransitioning ? 'opacity 1.5s ease-in' : 'none', 
                pointerEvents: currentScene === 'MainScene' ? 'auto' : 'none',
                position: 'relative'
            }}
        >
            {/* ProximityManager handles all proximity detection and visualization */}
            <MainSceneProximityManager showDebug={showProximityDebug} />

            {/* TV and Boxes */}
            <img
                src="assets/bg/bg_compressed_pngquant/just_tv_and_boxes-fs8.png"
                alt="TV and Boxes"
                style={{
                    position: 'absolute',
                    top: breakpoint === 'mobile' ? '46.6%' : '45%',
                    left: breakpoint === 'mobile' ? '16.5%' : '23.1%',
                    width: breakpoint === 'mobile' ? '22%' : '17.5%',
                    height: 'auto',
                    pointerEvents: 'none',
                    zIndex: 40,
                }}
            />

            {/* Mirror */}
            <img
                src="assets/bg/bg_compressed_pngquant/just_mirror-fs8.png"
                alt="Mirror"
                onClick={handleMirrorClick}
                style={{
                    position: 'absolute',
                    top: breakpoint === 'mobile' ? '44%' : '40.4%',
                    left: breakpoint === 'mobile' ? '25.1%' : '29.5%',
                    width: breakpoint === 'mobile' ? '10.6%' : '9%',
                    height: 'auto',
                    pointerEvents: isNearMirror ? 'auto' : 'none',
                    zIndex: 39,
                    filter: isNearMirror 
                        ? 'drop-shadow(0 0 5px rgba(212,14,14,1)) drop-shadow(0 0 2px rgba(212,14,14,1)) drop-shadow(0 0 1px rgba(212,14,14,1))'
                        : 'none',
                    transition: 'filter 0.3s ease-in-out'
                }}
            />

            {/* Hydrant */}
            <img
                src="assets/bg/bg_compressed_pngquant/just_hydrant-fs8.png"
                alt="Hydrant"
                onClick={handleHydrantClick}
                style={{
                    position: 'absolute',
                    top: breakpoint === 'mobile' ? '44%' : '39.9%',
                    left: breakpoint === 'mobile' ? '32%' : '35.4%',
                    width: breakpoint === 'mobile' ? '6.3%' : '5.2%',
                    height: 'auto',
                    pointerEvents: isNearHydrant ? 'auto' : 'none',
                    zIndex: 39,
                    filter: isNearHydrant 
                        ? 'drop-shadow(0 0 5px rgba(212,14,14,1)) drop-shadow(0 0 2px rgba(212,14,14,1)) drop-shadow(0 0 1px rgba(212,14,14,1))'
                        : 'none',
                    transition: 'filter 0.3s ease-in-out'
                }}
            />

            {/* Stairs */}
            <img
                src="assets/bg/bg_compressed_pngquant/just_stairs-fs8.png"
                alt="Stairs"
                style={{
                    position: 'absolute',
                    top: breakpoint === 'mobile' ? '27.5%' : '13.3%',
                    left: breakpoint === 'mobile' ? '31%' : '34.5%',
                    width: breakpoint === 'mobile' ? '29%' : '24%',
                    height: 'auto',
                    pointerEvents: 'none',
                    zIndex: 40,
                }}
            />


            {/* Phone */}
            <img
                src="assets/bg/bg_compressed_pngquant/just_phone-fs8.png"
                alt="Phone"
                onClick={handlePhoneClick}
                style={{
                    position: 'absolute',
                    top: breakpoint === 'mobile' ? '34.9%' : '25.6%',
                    left: breakpoint === 'mobile' ? '41.7%' : '43.2%',
                    width: breakpoint === 'mobile' ? '13%' : '10.4%',
                    height: 'auto',
                    pointerEvents: isNearPhone ? 'auto' : 'none',
                    zIndex: 39,
                    filter: isNearPhone 
                        ? 'drop-shadow(0 0 5px rgba(212,14,14,1)) drop-shadow(0 0 2px rgba(212,14,14,1)) drop-shadow(0 0 1px rgba(212,14,14,1))'
                        : 'none',
                    transition: 'filter 0.3s ease-in-out'
                }}
            />


            {/* Stuff in front of computer */}
            <img
                src="assets/bg/bg_compressed_pngquant/just_stuff_in_front_of_computer-fs8.png"
                alt="Stuff In Front of Computer"
                style={{
                    position: 'absolute',
                    top: breakpoint === 'mobile' ? '40.9%' : '35.4%',
                    left: breakpoint === 'mobile' ? '51.2%' : '51.2%',
                    width: breakpoint === 'mobile' ? '15.5%' : '12%',
                    height: 'auto',
                    pointerEvents: 'none',
                    zIndex: 40,
                }}
            />


            {/* Computer */}
            <img
                src="assets/bg/bg_compressed_pngquant/just_computer-fs8.png"
                alt="Computer"
                onClick={handleComputerClick}
                style={{
                    position: 'absolute',
                    top: breakpoint === 'mobile' ? '39.4%' : '32%',
                    left: breakpoint === 'mobile' ? '55.1%' : '54%',
                    width: breakpoint === 'mobile' ? '9.1%' : '7.7%',
                    height: 'auto',
                    pointerEvents: isNearComputer ? 'auto' : 'none',
                    zIndex: 39,
                    filter: isNearComputer 
                        ? 'drop-shadow(0 0 5px rgba(212,14,14,1)) drop-shadow(0 0 2px rgba(212,14,14,1)) drop-shadow(0 0 1px rgba(212,14,14,1))'
                        : 'none',
                    transition: 'filter 0.3s ease-in-out'
                }}
            />

            {/* Radio */}
            <img
                src="assets/bg/bg_compressed_pngquant/just_radio-fs8.png"
                alt="Radio"
                onClick={handleRadioClick}
                style={{
                    position: 'absolute',
                    top: breakpoint === 'mobile' ? '49%' : '48.5%',
                    left: breakpoint === 'mobile' ? '70.5%' : '66.8%',
                    width: breakpoint === 'mobile' ? '5.8%' : '4.5%',
                    height: 'auto',
                    pointerEvents: isNearRadio ? 'auto' : 'none',
                    zIndex: 39,
                    filter: isNearRadio 
                        ? 'drop-shadow(0 0 5px rgba(212,14,14,1)) drop-shadow(0 0 2px rgba(212,14,14,1)) drop-shadow(0 0 1px rgba(212,14,14,1))'
                        : 'none',
                    transition: 'filter 0.3s ease-in-out'
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