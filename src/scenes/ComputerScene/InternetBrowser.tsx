import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { breakpointAtom } from '../../atoms/gameState';
import { useCursor } from '../../context/CursorContext';
import { playMouseClickSound } from '../../util/sound';

interface InternetBrowserProps {
  onClose: () => void;
}

const InternetBrowser: React.FC<InternetBrowserProps> = ({ onClose }) => {
  const [breakpoint] = useAtom(breakpointAtom);
  const { setCursorType } = useCursor();
  const isMobile = breakpoint === 'mobile';
  const [url, setUrl] = useState('https://en.m.wikipedia.org/');
  const [currentUrl, setCurrentUrl] = useState('https://en.m.wikipedia.org/');

  // Handle cursor change on hover
  const handleButtonMouseEnter = () => {
    setCursorType('pointing');
  };

  const handleButtonMouseLeave = () => {
    setCursorType('neutral');
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playMouseClickSound();
    
    // Format URL if needed (add https:// if missing)
    let formattedUrl = url;
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = 'https://' + url;
    }
    
    setCurrentUrl(formattedUrl);
  };

  // Adjust sizes based on breakpoint
  const buttonSize = isMobile ? '6px' : '12px';
  const fontSize = isMobile ? '3px' : '6px';
  const goButtonWidth = isMobile ? '6px' : '14px';
  const minInputWidth = isMobile ? '20px' : '40px';

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        className="relative bg-white rounded-tr rounded-tl rounded-br rounded-bl overflow-hidden"
        style={{ 
          width: isMobile ? '13%' : '22%',
          height: isMobile ? '15%' : '22%',
        }}
      >
        {/* Single row with input, Go button, and close button */}
        <div className="flex items-center w-full" style={{ height: buttonSize }}>
          <form onSubmit={handleSubmit} className="flex items-center h-full flex-grow" style={{ maxWidth: 'calc(100% - ' + buttonSize + ')' }}>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="URL"
              className="h-full outline-none border-0 px-0.5"
              style={{ 
                fontSize: fontSize,
                width: `calc(100% - ${goButtonWidth})`,
                minWidth: minInputWidth
              }}
            />
            <button
              type="submit"
              onMouseEnter={handleButtonMouseEnter}
              onMouseLeave={handleButtonMouseLeave}
              className="bg-gray-200 h-full flex items-center justify-center"
              style={{ 
                fontSize: fontSize,
                width: goButtonWidth,
                minWidth: goButtonWidth
              }}
            >
              Go
            </button>
          </form>

          {/* Close button */}
          <button
            onClick={() => {
              playMouseClickSound();
              onClose();
            }}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
            className="bg-red-500 hover:bg-red-600 text-white flex items-center justify-center rounded-tr"
            style={{ 
              width: buttonSize,
              height: buttonSize,
              fontSize: isMobile ? '3px' : '8px',
              flexShrink: 0
            }}
          >
            ✕
          </button>
        </div>

        {/* Content area with iframe */}
        <div className="w-full bg-white rounded-bl rounded-br" style={{ height: `calc(100% - ${buttonSize})` }}>
          <iframe
            src={currentUrl}
            className="w-full h-full"
            style={{ zoom: breakpoint === 'mobile' ? 0.13 : 0.19 }}
            title="Browser Content"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </div>
    </div>
  );
};

export default InternetBrowser; 