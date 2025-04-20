import React, { Dispatch, SetStateAction } from 'react';
import { HudTransform } from '../../atoms/gameState';
import { MAX_ZOOM, MIN_ZOOM } from '../../util/utilSettings';
import { useCursor } from '../../context/CursorContext';

interface HUDZoomControlsProps {
  setHudTransform: Dispatch<SetStateAction<HudTransform>>;
}

const HUD_ZOOM_STEP = 0.5;

export const HUDZoomControls: React.FC<HUDZoomControlsProps> = ({ setHudTransform }) => {
  const { setCursorType } = useCursor();

  const handleMouseEnter = () => setCursorType('pointing');
  const handleMouseLeave = () => setCursorType('neutral');

  return (
    <div
      className="absolute z-50 flex flex-col items-center"
      style={{
        top: '6%',       // Use a percentage value (adjust as needed)
        right: '24%',     // Use a percentage value for responsiveness
        pointerEvents: 'auto',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Container styled with #fffff0 (ivory) as the background */}
      <div className="bg-[#fffff0] p-1 rounded border border-gray-400">
        {/* Magnifying glass icon */}
        <div className="flex justify-center mb-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

        {/* Zoom In Button */}
        <button
          className="bg-[#fffff0] text-gray-700 w-6 h-6 rounded-sm flex items-center justify-center
                     hover:bg-gray-200 hover:text-gray-900 transition-colors duration-200
                     border border-gray-400"
          onClick={() =>
            setHudTransform(prev => ({
              ...prev,
              zoom: Math.min(prev.zoom + 0.3, MAX_ZOOM)
            }))
          }
          title="Zoom In"
          style={{ pointerEvents: 'auto' }}
        >
          <span className="text-sm">+</span>
        </button>

        <div className="h-1"></div> {/* Spacer */}

        {/* Zoom Out Button */}
        <button
          className="bg-[#fffff0] text-gray-700 w-6 h-6 rounded-sm flex items-center justify-center
                     hover:bg-gray-200 hover:text-gray-900 transition-colors duration-200
                     border border-gray-400"
          onClick={() =>
            setHudTransform(prev => ({
              ...prev,
              zoom: Math.max(prev.zoom - HUD_ZOOM_STEP, MIN_ZOOM)
            }))
          }
          title="Zoom Out"
          style={{ pointerEvents: 'auto' }}
        >
          <span className="text-sm">−</span>
        </button>
      </div>
    </div>
  );
};

export default HUDZoomControls;
