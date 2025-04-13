import React from 'react';
import { useCursor } from '../../context/CursorContext';
import { useAtom } from 'jotai';
import { breakpointAtom } from '../../atoms/gameState';

interface ReaffirmButtonProps {
  onClick: () => void;
  style?: React.CSSProperties;
  className?: string;
  isVisible: boolean;
}

const ReaffirmButton: React.FC<ReaffirmButtonProps> = ({
  onClick,
  style = { bottom: '8%', left: '50%', transform: 'translateX(-50%)' },
  className = '',
  isVisible
}) => {
  const { setCursorType } = useCursor();
  const [breakpoint] = useAtom(breakpointAtom);
  const isMobile = breakpoint === 'mobile';

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setCursorType('pointer')}
      onMouseLeave={() => setCursorType('default')}
      className={`absolute z-30 bg-[#fffff0] text-gray-700 border border-gray-400 rounded px-3 py-1 
                 hover:bg-gray-200 hover:text-gray-900 transition-all duration-500 opacity-0
                 ${isVisible ? 'opacity-100' : 'pointer-events-none'} ${className}`}
      style={style}
      aria-label="Reaffirm Existence Button"
    >
      {/* Camera Icon */}
      <div className="flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={isMobile ? "10" : "14"}
          height={isMobile ? "10" : "14"}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isMobile ? "mr-1 inline-block" : "mr-1.5 inline-block"}
        >
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
          <circle cx="12" cy="13" r="4"></circle>
        </svg>
        <span className={isMobile ? "text-xs" : "text-sm"}>
          Reaffirm Existence
        </span>
      </div>
    </button>
  );
};

export default ReaffirmButton; 