import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { breakpointAtom } from '../../atoms/gameState';
import { FaInfoCircle } from 'react-icons/fa';
import { IoMusicalNotes } from 'react-icons/io5';
import { useCursor } from '../../context/CursorContext';
import { playMouseClickSound } from '../../util/sound';

interface EndSceneButtonsProps {
  onCreditsClick: () => void;
  onListenClick: () => void;
}

const EndSceneButtons: React.FC<EndSceneButtonsProps> = ({ 
  onCreditsClick, 
  onListenClick 
}) => {
  const [breakpoint] = useAtom(breakpointAtom);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const { setCursorType } = useCursor();

  // Button container styles
  const buttonContainerStyles = {
    position: 'absolute' as const,
    bottom: breakpoint === 'mobile' ? '5%' : '8%',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: breakpoint === 'mobile' ? 'column' as const : 'row' as const,
    gap: breakpoint === 'mobile' ? '0.8rem' : '1rem',
    zIndex: 60,
    width: breakpoint === 'mobile' ? 'auto' : 'auto',
    alignItems: 'center',
  };

  // Base button styles
  const buttonStyles = {
    padding: breakpoint === 'mobile' ? '0.6rem 1rem' : '0.5rem 1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    border: '1px solid white',
    borderRadius: '4px',
    fontSize: breakpoint === 'mobile' ? '0.7rem' : '0.8rem',
    fontFamily: 'monospace',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    minWidth: breakpoint === 'mobile' ? '160px' : 'auto',
    justifyContent: 'center',
    whiteSpace: 'nowrap' as const,
    width: 'auto',
    opacity: 0.8,
  };

  // Hover button styles
  const getButtonStyle = (buttonId: string) => {
    const isHovered = hoveredButton === buttonId;
    return {
      ...buttonStyles,
      opacity: isHovered ? 1 : 0.8,
      ...(buttonId === 'stream' && { width: breakpoint === 'mobile' ? 'fit-content' : 'auto' }),
    };
  };

  // Icon styles
  const iconStyles = {
    fontSize: breakpoint === 'mobile' ? '1.2rem' : '1rem',
    minWidth: breakpoint === 'mobile' ? '16px' : 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };
  
  // Mouse handlers for cursor changes
  const handleButtonMouseEnter = (buttonId: string) => {
    setCursorType('pointing');
    setHoveredButton(buttonId);
  };

  const handleButtonMouseLeave = () => {
    setCursorType('open');
    setHoveredButton(null);
  };

  // Handle button clicks with sound
  const handleCreditsClick = () => {
    playMouseClickSound();
    onCreditsClick();
  };

  const handleListenClick = () => {
    playMouseClickSound();
    onListenClick();
  };

  return (
    <div style={buttonContainerStyles}>
      <button 
        style={getButtonStyle('credits')}
        onClick={handleCreditsClick}
        onMouseEnter={() => handleButtonMouseEnter('credits')}
        onMouseLeave={handleButtonMouseLeave}
      >
        <FaInfoCircle style={iconStyles} />
        <span className="font-mono">Credits</span>
      </button>
      <button 
        style={getButtonStyle('stream')}
        onClick={handleListenClick}
        onMouseEnter={() => handleButtonMouseEnter('stream')}
        onMouseLeave={handleButtonMouseLeave}
      >
        <IoMusicalNotes style={iconStyles} />
        <span style={{ whiteSpace: 'nowrap', fontFamily: 'monospace' }}>Stream 'Diorama'</span>
      </button>
    </div>
  );
};

export default EndSceneButtons; 