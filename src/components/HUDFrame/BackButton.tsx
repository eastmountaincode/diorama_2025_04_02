import React from 'react';
import { useCursor } from '../../context/CursorContext';

interface BackButtonProps {
  onClick: () => void;
  style?: React.CSSProperties; // Expect percentage-based values, e.g. top: '5%', left: '5%'
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  style = { top: '104%', left: '15%' }, // Default responsive positioning using percentages
  className = ''
}) => {
  const { setCursorType } = useCursor();

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setCursorType('pointing')}
      onMouseLeave={() => setCursorType('neutral')}
      style={style}
      className={`absolute z-50 p-0 border-none bg-transparent cursor-pointer ${className}`}
      aria-label="Back Button"
    >
      <img
        src="assets/hud/back_button.png"  // Update path as necessary
        alt="Back Button"
        className="drop-shadow hover:opacity-80" // Tailwind drop shadow for extra pop
        style={{ width: '64px', height: 'auto' }}  // Adjust size as needed
        draggable={false}
      />
    </button>
  );
};

export default BackButton;
