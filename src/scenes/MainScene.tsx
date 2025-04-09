import React, { useState, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { 
    breakpointAtom, 
    currentSceneAtom, 
    isSceneTransitioningAtom,
    figurinePositionAtom,
    isNearMirrorAtom,
    isNearHydrantAtom,
    isNearPhoneAtom,
    isNearComputerAtom,
    isNearRadioAtom
} from '../atoms/gameState';
import MainDraggableFigurine from '../components/MainDraggableFigurine';
import FloorBoundary from '../components/FloorBoundary';

const MainScene: React.FC = () => {
    const [currentScene] = useAtom(currentSceneAtom);
    const [isSceneTransitioning, setIsSceneTransitioning] = useAtom(isSceneTransitioningAtom);
    const [opacity, setOpacity] = useState(0);
    const [breakpoint] = useAtom(breakpointAtom);

    // Get figurine position
    const [figurinePosition] = useAtom(figurinePositionAtom);

    // Proximity states for interactive elements
    const [isNearMirror, setIsNearMirror] = useAtom(isNearMirrorAtom);
    const [isNearHydrant, setIsNearHydrant] = useAtom(isNearHydrantAtom);
    const [isNearPhone, setIsNearPhone] = useAtom(isNearPhoneAtom);
    const [isNearComputer, setIsNearComputer] = useAtom(isNearComputerAtom);
    const [isNearRadio, setIsNearRadio] = useAtom(isNearRadioAtom);

    // Debug state for proximity visualization
    const [showProximityDebug, setShowProximityDebug] = useState(true);

    // Reference to container - explicitly typed as HTMLDivElement
    const containerRef = useRef<HTMLDivElement>(null);

    // Control whether the figurine can be dragged
    const [canDragFigurine, _] = useState(true);

    // Debug mode for floor boundary
    const debugBoundary = true;

    // Get the proximity thresholds based on current breakpoint
    const getThresholdsForBreakpoint = () => ({
        mirror: breakpoint === 'mobile' ? 7 : 8,    
        hydrant: breakpoint === 'mobile' ? 7.2 : 9,   
        phone: breakpoint === 'mobile' ? 7.5 : 10.5,     
        computer: breakpoint === 'mobile' ? 8.3 : 13,  
        radio: breakpoint === 'mobile' ? 6.5 : 11     
    });

    // Proximity distances for each interactive element (in percentage units)
    const [proximityThresholds, setProximityThresholds] = useState(getThresholdsForBreakpoint());

    // Element positions (percentage coordinates)
    const initialPositions = {
        mirror: {
            x: breakpoint === 'mobile' ? 25.1 + 5.3 : 29.5 + 4.5,   // Left + half width
            y: breakpoint === 'mobile' ? 49 + 5.3 : 53.4 + 4.5      // Top + half height
        },
        hydrant: {
            x: breakpoint === 'mobile' ? 33 + 3.15 : 34.4 + 2.6,    // Left + half width
            y: breakpoint === 'mobile' ? 41 + 3.15 : 41.9 + 2.6     // Top + half height
        },
        phone: {
            x: breakpoint === 'mobile' ? 41.7 + 6.5 : 43.2 + 5.2,   // Left + half width
            y: breakpoint === 'mobile' ? 37.9 + 6.5 : 34.6 + 5.2    // Top + half height
        },
        computer: {
            x: breakpoint === 'mobile' ? 55.1 + 4.55 : 56 + 3.85,   // Left + half width
            y: breakpoint === 'mobile' ? 41.4 + 4.55 : 35 + 3.85    // Top + half height
        },
        radio: {
            x: breakpoint === 'mobile' ? 68.5 + 2.9 : 66.8 + 2.25,  // Left + half width
            y: breakpoint === 'mobile' ? 51 + 2.9 : 52.5 + 2.25     // Top + half height
        }
    };

    // State for element positions that can be adjusted
    const [elementPositions, setElementPositions] = useState(initialPositions);

    // Update positions and thresholds when breakpoint changes
    useEffect(() => {
        setElementPositions(initialPositions);
        setProximityThresholds(getThresholdsForBreakpoint());
    }, [breakpoint, initialPositions]);

    // Calculate distance between figurine and an element
    const calculateDistance = (elementPosition: {x: number, y: number}) => {
        const dx = figurinePosition.x - elementPosition.x;
        const dy = figurinePosition.y - elementPosition.y;
        return Math.sqrt(dx * dx + dy * dy);
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

    // Update proximity states based on figurine position
    useEffect(() => {
        if (figurinePosition) {
            setIsNearMirror(calculateDistance(elementPositions.mirror) < proximityThresholds.mirror);
            setIsNearHydrant(calculateDistance(elementPositions.hydrant) < proximityThresholds.hydrant);
            setIsNearPhone(calculateDistance(elementPositions.phone) < proximityThresholds.phone);
            setIsNearComputer(calculateDistance(elementPositions.computer) < proximityThresholds.computer);
            setIsNearRadio(calculateDistance(elementPositions.radio) < proximityThresholds.radio);
        }
    }, [
        figurinePosition, 
        elementPositions.mirror, 
        elementPositions.hydrant,
        elementPositions.phone,
        elementPositions.computer,
        elementPositions.radio,
        proximityThresholds.mirror,
        proximityThresholds.hydrant,
        proximityThresholds.phone,
        proximityThresholds.computer,
        proximityThresholds.radio,
        setIsNearMirror,
        setIsNearHydrant,
        setIsNearPhone,
        setIsNearComputer,
        setIsNearRadio
    ]);

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
                backgroundImage: "url('assets/bg/bg_compressed_pngquant/Diorama_BG-fs8.png')",
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity,
                transition: isSceneTransitioning ? 'opacity 1.5s ease-in' : 'none', 
                pointerEvents: currentScene === 'MainScene' ? 'auto' : 'none',
                position: 'relative'
            }}
        >
            {/* Debug visualization SVG */}
            {showProximityDebug && (
                <svg 
                    className="absolute inset-0 w-full h-full pointer-events-none" 
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    style={{ zIndex: 9999 }}
                >
                    {/* Mirror proximity visualization */}
                    <circle 
                        cx={elementPositions.mirror.x} 
                        cy={elementPositions.mirror.y} 
                        r={0.8} 
                        fill="#0066FF" 
                        opacity={0.8} 
                    />
                    <circle 
                        cx={elementPositions.mirror.x} 
                        cy={elementPositions.mirror.y} 
                        r={proximityThresholds.mirror} 
                        fill={isNearMirror ? "rgba(0,102,255,0.2)" : "none"} 
                        stroke="#0066FF" 
                        strokeWidth="0.2" 
                        opacity={0.5}
                    />
                    <text 
                        x={elementPositions.mirror.x + 1} 
                        y={elementPositions.mirror.y - 1} 
                        fill="#0066FF" 
                        fontSize="1.5"
                    >
                        Mirror
                    </text>

                    {/* Hydrant proximity visualization */}
                    <circle 
                        cx={elementPositions.hydrant.x} 
                        cy={elementPositions.hydrant.y} 
                        r={0.8} 
                        fill="#0066FF" 
                        opacity={0.8} 
                    />
                    <circle 
                        cx={elementPositions.hydrant.x} 
                        cy={elementPositions.hydrant.y} 
                        r={proximityThresholds.hydrant} 
                        fill={isNearHydrant ? "rgba(0,102,255,0.2)" : "none"} 
                        stroke="#0066FF" 
                        strokeWidth="0.2" 
                        opacity={0.5}
                    />
                    <text 
                        x={elementPositions.hydrant.x + 1} 
                        y={elementPositions.hydrant.y - 1} 
                        fill="#0066FF" 
                        fontSize="1.5"
                    >
                        Hydrant
                    </text>

                    {/* Phone proximity visualization */}
                    <circle 
                        cx={elementPositions.phone.x} 
                        cy={elementPositions.phone.y} 
                        r={0.8} 
                        fill="#0066FF" 
                        opacity={0.8} 
                    />
                    <circle 
                        cx={elementPositions.phone.x} 
                        cy={elementPositions.phone.y} 
                        r={proximityThresholds.phone} 
                        fill={isNearPhone ? "rgba(0,102,255,0.2)" : "none"} 
                        stroke="#0066FF" 
                        strokeWidth="0.2" 
                        opacity={0.5}
                    />
                    <text 
                        x={elementPositions.phone.x + 1} 
                        y={elementPositions.phone.y - 1} 
                        fill="#0066FF" 
                        fontSize="1.5"
                    >
                        Phone
                    </text>

                    {/* Computer proximity visualization */}
                    <circle 
                        cx={elementPositions.computer.x} 
                        cy={elementPositions.computer.y} 
                        r={0.8} 
                        fill="#0066FF" 
                        opacity={0.8} 
                    />
                    <circle 
                        cx={elementPositions.computer.x} 
                        cy={elementPositions.computer.y} 
                        r={proximityThresholds.computer} 
                        fill={isNearComputer ? "rgba(0,102,255,0.2)" : "none"} 
                        stroke="#0066FF" 
                        strokeWidth="0.2" 
                        opacity={0.5}
                    />
                    <text 
                        x={elementPositions.computer.x + 1} 
                        y={elementPositions.computer.y - 1} 
                        fill="#0066FF" 
                        fontSize="1.5"
                    >
                        Computer
                    </text>

                    {/* Radio proximity visualization */}
                    <circle 
                        cx={elementPositions.radio.x} 
                        cy={elementPositions.radio.y} 
                        r={0.8} 
                        fill="#0066FF" 
                        opacity={0.8} 
                    />
                    <circle 
                        cx={elementPositions.radio.x} 
                        cy={elementPositions.radio.y} 
                        r={proximityThresholds.radio} 
                        fill={isNearRadio ? "rgba(0,102,255,0.2)" : "none"} 
                        stroke="#0066FF" 
                        strokeWidth="0.2" 
                        opacity={0.5}
                    />
                    <text 
                        x={elementPositions.radio.x + 1} 
                        y={elementPositions.radio.y - 1} 
                        fill="#0066FF" 
                        fontSize="1.5"
                    >
                        Radio
                    </text>

                    {/* Figurine position dot */}
                    {figurinePosition && (
                        <circle 
                            cx={figurinePosition.x} 
                            cy={figurinePosition.y} 
                            r={0.8} 
                            fill="#FF3333" 
                            opacity={0.8} 
                        />
                    )}

                </svg>
            )}

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
                style={{
                    position: 'absolute',
                    top: breakpoint === 'mobile' ? '44%' : '40.4%',
                    left: breakpoint === 'mobile' ? '25.1%' : '29.5%',
                    width: breakpoint === 'mobile' ? '10.6%' : '9%',
                    height: 'auto',
                    pointerEvents: 'none',
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
                style={{
                    position: 'absolute',
                    top: breakpoint === 'mobile' ? '44%' : '39.9%',
                    left: breakpoint === 'mobile' ? '32%' : '35.4%',
                    width: breakpoint === 'mobile' ? '6.3%' : '5.2%',
                    height: 'auto',
                    pointerEvents: 'none',
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
                style={{
                    position: 'absolute',
                    top: breakpoint === 'mobile' ? '34.9%' : '25.6%',
                    left: breakpoint === 'mobile' ? '41.7%' : '43.2%',
                    width: breakpoint === 'mobile' ? '13%' : '10.4%',
                    height: 'auto',
                    pointerEvents: 'none',
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
                style={{
                    position: 'absolute',
                    top: breakpoint === 'mobile' ? '39.4%' : '32%',
                    left: breakpoint === 'mobile' ? '55.1%' : '54%',
                    width: breakpoint === 'mobile' ? '9.1%' : '7.7%',
                    height: 'auto',
                    pointerEvents: 'none',
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
                style={{
                    position: 'absolute',
                    top: breakpoint === 'mobile' ? '49%' : '48.5%',
                    left: breakpoint === 'mobile' ? '70.5%' : '66.8%',
                    width: breakpoint === 'mobile' ? '5.8%' : '4.5%',
                    height: 'auto',
                    pointerEvents: 'none',
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