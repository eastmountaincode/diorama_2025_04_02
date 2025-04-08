import React, { Dispatch, SetStateAction } from 'react';
import { HudTransform } from '../../atoms/gameState'; // Assuming path is correct
import { MAX_ZOOM, MIN_ZOOM } from '../../util/utilSettings';

interface HUDZoomControlsProps {
  setHudTransform: Dispatch<SetStateAction<HudTransform>>;
}

const HUD_ZOOM_STEP = 0.5;

export const HUDZoomControls: React.FC<HUDZoomControlsProps> = ({ setHudTransform }) => {
  return (
    <div 
      className="absolute top-8 z-50 flex flex-col items-center"
      style={{ right: '19%' }} // Note: This positioning might need adjustment or be passed as a prop
    >
      {/* Background container for all zoom controls */}
      <div className="bg-gray-800 bg-opacity-30 p-1.5 rounded border border-gray-600 border-opacity-20 backdrop-blur-sm">
        {/* Magnifying glass icon */}
        <div className="flex justify-center mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 opacity-60">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        
        <button 
          className="bg-gray-700 bg-opacity-30 text-gray-400 w-6 h-6 rounded-sm flex items-center justify-center hover:bg-opacity-50 hover:text-white hover:border-gray-300 hover:shadow-sm transition-all border border-gray-500 border-opacity-20"
          onClick={() => setHudTransform(prev => ({
            ...prev,
            zoom: Math.min(prev.zoom + 0.3, MAX_ZOOM)
          }))}
          title="Zoom In"
        >
          <span className="text-xs leading-none flex items-center justify-center h-full">+</span>
        </button>
        
        <div className="h-1"></div> {/* Small spacer */}
        
        <button 
          className="bg-gray-700 bg-opacity-30 text-gray-400 w-6 h-6 rounded-sm flex items-center justify-center hover:bg-opacity-50 hover:text-white hover:border-gray-300 hover:shadow-sm transition-all border border-gray-500 border-opacity-20"
          onClick={() => setHudTransform(prev => ({
            ...prev,
            zoom: Math.max(prev.zoom - HUD_ZOOM_STEP, MIN_ZOOM)
          }))}
          title="Zoom Out"
        >
          <span className="text-xs leading-none flex items-center justify-center h-full">−</span>
        </button>
      </div>
    </div>
  );
}; 