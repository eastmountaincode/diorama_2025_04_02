import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import {
    breakpointAtom,
    figurinePositionAtom,
    isNearMirrorAtom,
    isNearHydrantAtom,
    isNearPhoneAtom,
    isNearComputerAtom,
    isNearRadioAtom
} from '../../atoms/gameState';

interface ProximityManagerProps {
    showDebug: boolean;
}

const MainSceneProximityManager: React.FC<ProximityManagerProps> = ({ showDebug }) => {
    const [breakpoint] = useAtom(breakpointAtom);
    const [figurinePosition] = useAtom(figurinePositionAtom);
    
    const [isNearMirror, setIsNearMirror] = useAtom(isNearMirrorAtom);
    const [isNearHydrant, setIsNearHydrant] = useAtom(isNearHydrantAtom);
    const [isNearPhone, setIsNearPhone] = useAtom(isNearPhoneAtom);
    const [isNearComputer, setIsNearComputer] = useAtom(isNearComputerAtom);
    const [isNearRadio, setIsNearRadio] = useAtom(isNearRadioAtom);

    // Get the proximity thresholds based on current breakpoint
    const getThresholdsForBreakpoint = () => ({
        mirror: breakpoint === 'mobile' ? 7.9 : 8,    
        hydrant: breakpoint === 'mobile' ? 7.7 : 9,   
        phone: breakpoint === 'mobile' ? 7.5 : 10.5,     
        computer: breakpoint === 'mobile' ? 8.3 : 13,  
        radio: breakpoint === 'mobile' ? 7.4 : 11     
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
            x: breakpoint === 'mobile' ? 67.5 + 2.9 : 66.8 + 2.25,  // Left + half width
            y: breakpoint === 'mobile' ? 51 + 2.9 : 52.5 + 2.25     // Top + half height
        }
    };

    // State for element positions that can be adjusted
    const [elementPositions, setElementPositions] = useState(initialPositions);

    // Update positions and thresholds when breakpoint changes
    useEffect(() => {
        setElementPositions(initialPositions);
        setProximityThresholds(getThresholdsForBreakpoint());
    }, [breakpoint]);

    // Calculate distance between figurine and an element
    const calculateDistance = (elementPosition: {x: number, y: number}) => {
        if (!figurinePosition) return Infinity;
        const dx = figurinePosition.x - elementPosition.x;
        const dy = figurinePosition.y - elementPosition.y;
        return Math.sqrt(dx * dx + dy * dy);
    };

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
        elementPositions,
        proximityThresholds
    ]);

    if (!showDebug || !figurinePosition) return null;

    return (
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
    );
};

export default MainSceneProximityManager;
