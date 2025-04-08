import React, { useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { dropZoneRectAtom, isFigurinePlacedAtom, hudTransformAtom, isSceneTransitioningAtom, currentSceneAtom } from '../../atoms/gameState';

interface DropZoneEllipseProps {
  breakpoint: string;
  isFigurinePlaced: boolean;
  setIsEllipseHovered: (isHovered: boolean) => void;
}

const DropZoneEllipse: React.FC<DropZoneEllipseProps> = ({
  breakpoint,
  isFigurinePlaced,
  setIsEllipseHovered
}) => {
  const dropZoneRef = useRef<SVGEllipseElement>(null);
  const [, setDropZoneRect] = useAtom(dropZoneRectAtom);
  const [, setHudTransform] = useAtom(hudTransformAtom);
  const [, setIsSceneTransitioning] = useAtom(isSceneTransitioningAtom);
  const [, setCurrentScene] = useAtom(currentSceneAtom);

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
          // Get the SVG's viewport dimensions
          const svgRect = svgParent.getBoundingClientRect();
          
          // Get current oval props based on breakpoint
          const currentOvalProps = getOvalProps();
          
          // Parse percentage values from currentOvalProps
          const cxPercent = parseFloat(currentOvalProps.cx) / 100;
          const cyPercent = parseFloat(currentOvalProps.cy) / 100;
          const rxPercent = parseFloat(currentOvalProps.rx) / 100;
          const ryPercent = parseFloat(currentOvalProps.ry) / 100;
          
          // Calculate center point in global coordinates 
          const cxPixels = svgRect.left + (svgRect.width * cxPercent);
          const cyPixels = svgRect.top + (svgRect.height * cyPercent);
          
          // Calculate radii in pixels
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
    
    // Create a ResizeObserver to detect when the SVG element changes size
    const resizeObserver = new ResizeObserver(() => {
      updateDropZonePosition();
    });
    
    // Initial update with a small delay to ensure everything is rendered
    // This is crucial for correct initial detection
    setTimeout(updateDropZonePosition, 0);
    
    // Also observe the SVG parent for size changes
    if (dropZoneRef.current && dropZoneRef.current.ownerSVGElement) {
      resizeObserver.observe(dropZoneRef.current.ownerSVGElement);
    }
    
    // Update on window resize as well
    window.addEventListener('resize', updateDropZonePosition);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', updateDropZonePosition);
      resizeObserver.disconnect();
      // Set drop zone to inactive when component unmounts
      setDropZoneRect(prev => ({ ...prev, active: false }));
    };
  }, [setDropZoneRect, breakpoint]);

  // Get ellipse fill styling based on state
  const getEllipseStyling = () => {
    // Always keep the ellipse invisible visually
    // But still make it interactive when the figurine is placed
    return {
      fill: "rgba(255, 255, 0, 0)",
      stroke: "rgba(255, 255, 0, 0)",
      strokeWidth: 0,
      cursor: isFigurinePlaced ? 'pointer' : 'default',
      pointerEvents: isFigurinePlaced ? 'auto' as const : 'none' as const
    };
  };

  // Handle click on the ellipse when figurine is placed
  const handleEllipseClick = () => {
    if (isFigurinePlaced) {
      console.log('Ellipse clicked with figurine placed! Ready to transition to main scene.');
      
      // Enable transition animation for the transform
      setIsSceneTransitioning(true);
      
      // Start transition to zoom 1
      setHudTransform({
        zoom: 1,
        translateX: 0,
        translateY: 0
      });
      
      // First wait for the zoom transform to fully complete
      setTimeout(() => {
        // Change to MainScene after transform is complete
        setCurrentScene('MainScene');
      }, 2000); // Wait for transform to fully complete
    }
  };
  
  // Handle hover events for the ellipse
  const handleEllipseMouseEnter = () => {
    if (isFigurinePlaced) {
      setIsEllipseHovered(true);
    }
  };
  
  const handleEllipseMouseLeave = () => {
    setIsEllipseHovered(false);
  };

  return (
    <svg 
      className="absolute top-0 left-0 w-full h-full z-30"
      style={{ overflow: 'visible' }}
    >
      <ellipse
        ref={dropZoneRef}
        cx={ovalProps.cx}
        cy={ovalProps.cy}
        rx={ovalProps.rx}
        ry={ovalProps.ry}
        style={getEllipseStyling()}
        onClick={handleEllipseClick}
        onMouseEnter={handleEllipseMouseEnter}
        onMouseLeave={handleEllipseMouseLeave}
      />
    </svg>
  );
};

export default DropZoneEllipse; 