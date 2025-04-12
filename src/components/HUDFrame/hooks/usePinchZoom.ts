import { useRef, useCallback, useState } from 'react';
import { useAtom } from 'jotai';
import { hudTransformAtom, isSceneTransitioningAtom, currentSceneAtom } from '../../../atoms/gameState';
import { MAX_ZOOM, MIN_ZOOM } from '../../../util/utilSettings';

export function usePinchZoom() {
    const [hudTransform, setHudTransform] = useAtom(hudTransformAtom);
    const [isSceneTransitioning] = useAtom(isSceneTransitioningAtom);
    const [currentScene] = useAtom(currentSceneAtom);
    const [touchMidpoint, setTouchMidpoint] = useState<{x: number, y: number} | null>(null);
    
    // Ref for the viewport element
    const viewportRef = useRef<HTMLDivElement | null>(null);
    
    // Track pinch state
    const pinchRef = useRef({
        active: false,
        startDistance: 0,
        startScale: 1,
        startMidpoint: { x: 0, y: 0 },
        startTranslate: { x: 0, y: 0 }
    });

    const getRelativePosition = useCallback((clientX: number, clientY: number) => {
        // Get viewport rectangle
        const viewport = viewportRef.current;
        if (!viewport) return { x: 0, y: 0 };
        
        const rect = viewport.getBoundingClientRect();
        
        // Calculate position relative to the viewport center
        // Since the viewport is positioned with transform: translate(-50%, -50%)
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        return {
            x: clientX - centerX,
            y: clientY - centerY
        };
    }, []);

    const handleTouchStart = useCallback(
        (e: React.TouchEvent<HTMLDivElement>) => {
            if (isSceneTransitioning || currentScene === 'OpeningScene' || currentScene === 'RadioScene' || currentScene === 'HydrantScene' || currentScene === 'MirrorScene' || e.touches.length !== 2) return;
            e.preventDefault();
            
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            
            // Calculate distance between touches
            const dx = touch2.clientX - touch1.clientX;
            const dy = touch2.clientY - touch1.clientY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Calculate midpoint
            const midX = (touch1.clientX + touch2.clientX) / 2;
            const midY = (touch1.clientY + touch2.clientY) / 2;
            
            // Get relative position
            const relPos = getRelativePosition(midX, midY);
            
            // Set debug visualization
            setTouchMidpoint({ x: midX, y: midY });
            
            // Store initial state
            pinchRef.current = {
                active: true,
                startDistance: distance,
                startScale: hudTransform.zoom,
                startMidpoint: relPos,
                startTranslate: { 
                    x: hudTransform.translateX, 
                    y: hudTransform.translateY 
                }
            };
        },
        [hudTransform, isSceneTransitioning, currentScene, getRelativePosition]
    );

    const handleTouchMove = useCallback(
        (e: React.TouchEvent<HTMLDivElement>) => {
            if (!pinchRef.current.active || e.touches.length !== 2) return;
            e.preventDefault();
            
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            
            // Calculate current distance
            const dx = touch2.clientX - touch1.clientX;
            const dy = touch2.clientY - touch1.clientY;
            const currentDistance = Math.sqrt(dx * dx + dy * dy);
            
            // Calculate scale change
            const scaleChange = currentDistance / pinchRef.current.startDistance;
            const newScale = Math.min(
                Math.max(pinchRef.current.startScale * scaleChange, MIN_ZOOM),
                MAX_ZOOM
            );
            
            // Update midpoint visualization for debugging
            const midX = (touch1.clientX + touch2.clientX) / 2;
            const midY = (touch1.clientY + touch2.clientY) / 2;
            setTouchMidpoint({ x: midX, y: midY });
            
            // Calculate the new position
            // This ensures we zoom toward/away from the midpoint of the pinch
            const relMidpoint = getRelativePosition(midX, midY);
            
            // Calculate offset needed to zoom around the midpoint
            const startScale = pinchRef.current.startScale;
            const startMidpoint = pinchRef.current.startMidpoint;
            
            // Scale factor between scene coordinates and screen coordinates
            const startToSceneScale = 1 / startScale;
            
            // Convert pinch midpoint to scene coordinates (at start of gesture)
            const sceneMidpointX = (startMidpoint.x - pinchRef.current.startTranslate.x) * startToSceneScale;
            const sceneMidpointY = (startMidpoint.y - pinchRef.current.startTranslate.y) * startToSceneScale;
            
            // Calculate new translations to keep that scene point at the current midpoint
            const newTranslateX = relMidpoint.x - (sceneMidpointX * newScale);
            const newTranslateY = relMidpoint.y - (sceneMidpointY * newScale);
            
            setHudTransform({
                zoom: newScale,
                translateX: newTranslateX,
                translateY: newTranslateY
            });
        },
        [setHudTransform, getRelativePosition]
    );

    const handleTouchEnd = useCallback(
        (e: React.TouchEvent<HTMLDivElement>) => {
            if (e.touches.length < 2) {
                pinchRef.current.active = false;
                setTouchMidpoint(null);
            }
        },
        []
    );

    return {
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        touchMidpoint,
        viewportRef
    };
}
