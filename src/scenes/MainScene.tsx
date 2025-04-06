import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { currentSceneAtom, isSceneTransitioningAtom, showOpeningSceneAtom } from '../atoms/gameState';

const MainScene: React.FC = () => {
    const [currentScene] = useAtom(currentSceneAtom);
    const [isSceneTransitioning] = useAtom(isSceneTransitioningAtom);
    const [, setShowOpeningScene] = useAtom(showOpeningSceneAtom);
    const [opacity, setOpacity] = useState(0);
    
    // This will let us hide OpeningScene by clicking in MainScene after transition
    const handleClick = () => {
        // Only allow hiding OpeningScene after transition is complete
        if (!isSceneTransitioning && currentScene === 'MainScene') {
            setShowOpeningScene(false);
        }
    };
    
    // Handle visibility based on current scene and transition state
    useEffect(() => {
        if (currentScene === 'MainScene') {
            // If we're transitioning to this scene, animate the fade in
            if (isSceneTransitioning) {
                setOpacity(0);
                const timer = setTimeout(() => {
                    setOpacity(1);
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
    }, [currentScene, isSceneTransitioning]);
    
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
            onClick={handleClick}
        >
            {/* Content can be added here if needed */}
        </div>
    );
};

export default MainScene; 