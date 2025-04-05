import React, { useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { dropZoneRectAtom, breakpointAtom } from '../atoms/gameState';

const OpeningScene: React.FC = () => {
  const dropZoneRef = useRef<SVGEllipseElement>(null);
  const [, setDropZoneRect] = useAtom(dropZoneRectAtom);
  const [breakpoint] = useAtom(breakpointAtom);
  
  // Set oval position based on breakpoint
  const getOvalProps = () => {
    if (breakpoint === 'mobile') {
      return {
        cx: "50.5%",
        cy: "58%",
        rx: "12.5%",
        ry: "3.5%"
      };
    } else {
      return {
        cx: "50.5%",
        cy: "63%",
        rx: "10.5%",
        ry: "6%"
      };
    }
  };
  
  const ovalProps = getOvalProps();
  
  // Update drop zone position whenever it changes
  useEffect(() => {
    const updateDropZonePosition = () => {
      if (dropZoneRef.current) {
        const rect = dropZoneRef.current.getBoundingClientRect();
        const svgParent = dropZoneRef.current.ownerSVGElement;
        
        if (svgParent) {
          // Calculate actual pixel values for ellipse parameters
          const svgRect = svgParent.getBoundingClientRect();
          const cxPercent = parseFloat(ovalProps.cx) / 100;
          const cyPercent = parseFloat(ovalProps.cy) / 100;
          const rxPercent = parseFloat(ovalProps.rx) / 100;
          const ryPercent = parseFloat(ovalProps.ry) / 100;
          
          const cxPixels = svgRect.width * cxPercent + svgRect.left;
          const cyPixels = svgRect.height * cyPercent + svgRect.top;
          const rxPixels = svgRect.width * rxPercent;
          const ryPixels = svgRect.height * ryPercent;
          
          setDropZoneRect({
            // Bounding box (for reference)
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
            // Ellipse specific properties
            cx: cxPixels,
            cy: cyPixels,
            rx: rxPixels,
            ry: ryPixels,
            active: true
          });
        }
      }
    };
    
    // Initial update
    updateDropZonePosition();
    
    // Update on resize
    window.addEventListener('resize', updateDropZonePosition);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', updateDropZonePosition);
      // Set drop zone to inactive when component unmounts
      setDropZoneRect(prev => ({ ...prev, active: false }));
    };
  }, [setDropZoneRect, breakpoint, ovalProps]);

  return (
    <div className="w-full h-full relative z-20">
      <img 
        src="assets/bg/Grass_alone_demo.png" 
        alt="Grass"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'center',
          filter: "drop-shadow(0 0 10px yellow)"
        }}
        className="absolute top-0 left-0"
      />
      
      {/* Drop zone SVG - long oval shape */}
      <svg 
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-30"
        style={{ overflow: 'visible' }}
      >
        <ellipse
          ref={dropZoneRef}
          cx={ovalProps.cx}
          cy={ovalProps.cy}
          rx={ovalProps.rx}
          ry={ovalProps.ry}
          fill="rgba(255, 255, 0, 0.2)"
          stroke="rgba(255, 255, 0, 0.5)"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      </svg>
    </div>
  );
};

export default OpeningScene;
