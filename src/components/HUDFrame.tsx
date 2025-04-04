import { CSSProperties, useEffect, useRef, useState } from 'react'
import SceneManager from './SceneManager'

// Define type for viewport styles
type ViewportStyle = {
  top: string;
  left: string;
  width: string;
  height: string;
}

// Define type for breakpoint names
type BreakpointName = 'mobile' | 'tablet' | 'desktop';

export function HUDFrame() {
  const [src, setSrc] = useState('')
  const [zoom, setZoom] = useState(1) // 1 = 100% zoom
  const [translateX, setTranslateX] = useState(0)
  const [translateY, setTranslateY] = useState(0)
  // State for dynamic viewport styles
  const [viewportStyle, setViewportStyle] = useState<ViewportStyle>({ 
    // Default to desktop values initially, will be updated
    top: '50%', 
    left: '40%', 
    width: '70%', 
    height: '60%' 
  })
  // State to hold the current breakpoint name
  const [currentBreakpoint, setCurrentBreakpoint] = useState<BreakpointName>('desktop');

  // Ref to store pinch state (initial distance, zoom, midpoint, translation)
  const pinchStateRef = useRef<{
    initialDistance: number | null;
    initialZoom: number;
    initialMidX: number | null;
    initialMidY: number | null;
    initialTranslateX: number;
    initialTranslateY: number;
  }>({
    initialDistance: null,
    initialZoom: 1.0,
    initialMidX: null,
    initialMidY: null,
    initialTranslateX: 0,
    initialTranslateY: 0,
  })

  // Update HUD image, viewport styles, AND breakpoint name based on screen width
  useEffect(() => {
    const updateHUD = () => {
      const isMobile = window.matchMedia('(max-width: 667px)').matches
      const isTablet = window.matchMedia('(min-width: 668px) and (max-width: 1024px)').matches
      let breakpointName: BreakpointName = 'desktop'; // Default to desktop

      // --- Set Image Source --- 
      setSrc(
        isMobile
          ? 'assets/hud/hud_frame_mobile_demo.png' 
          : 'assets/hud/hud_frame_desktop_demo.png' 
      )
      
      // --- Set Viewport Styles and Breakpoint Name --- 
      if (isMobile) {
        breakpointName = 'mobile';
        setViewportStyle({ top: '42%', left: '50%', width: '90%', height: '80%' })
      } else if (isTablet) {
        breakpointName = 'tablet';
        setViewportStyle({ top: '50%', left: '42%', width: '80%', height: '74%' })
      } else { 
        // breakpointName remains 'desktop'
        setViewportStyle({ top: '50%', left: '43%', width: '77%', height: '96%' })
      }
      // Update the breakpoint state
      setCurrentBreakpoint(breakpointName);
    }

    updateHUD()
    window.addEventListener('resize', updateHUD)
    window.addEventListener('orientationchange', updateHUD)
    return () => {
      window.removeEventListener('resize', updateHUD)
      window.removeEventListener('orientationchange', updateHUD)
    }
  }, []) 

  // Touch event handlers for pinch-to-zoom and pan on the SceneManager container
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]

      // Calculate initial distance for zoom
      const dx = touch2.clientX - touch1.clientX
      const dy = touch2.clientY - touch1.clientY
      const initialDistance = Math.sqrt(dx * dx + dy * dy)

      // Calculate initial midpoint for panning
      const initialMidX = (touch1.clientX + touch2.clientX) / 2
      const initialMidY = (touch1.clientY + touch2.clientY) / 2

      // Store initial state in ref
      pinchStateRef.current = {
        initialDistance: initialDistance,
        initialZoom: zoom,
        initialMidX: initialMidX,
        initialMidY: initialMidY,
        initialTranslateX: translateX,
        initialTranslateY: translateY,
      }
      e.preventDefault() // Prevent default actions like scrolling/zooming page
    }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const { initialDistance, initialZoom, initialMidX, initialMidY, initialTranslateX, initialTranslateY } = pinchStateRef.current
    
    if (e.touches.length === 2 && initialDistance !== null && initialMidX !== null && initialMidY !== null) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]

      // --- Zoom Calculation ---
      const dxZoom = touch2.clientX - touch1.clientX
      const dyZoom = touch2.clientY - touch1.clientY
      const currentDistance = Math.sqrt(dxZoom * dxZoom + dyZoom * dyZoom)
      // Clamp zoom to reasonable values (e.g., 0.5x to 4x)
      const newZoom = Math.min(Math.max(initialZoom * (currentDistance / initialDistance), 0.5), 4);
      setZoom(newZoom)

      // --- Pan Calculation ---
      const currentMidX = (touch1.clientX + touch2.clientX) / 2
      const currentMidY = (touch1.clientY + touch2.clientY) / 2

      // Calculate the difference in position from the start
      const deltaX = currentMidX - initialMidX
      const deltaY = currentMidY - initialMidY

      // Update translation state (delta is independent of zoom)
      setTranslateX(initialTranslateX + deltaX)
      setTranslateY(initialTranslateY + deltaY)

      e.preventDefault() // prevent page scrolling/zooming during pinch/pan
    }
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length < 2) {
      // Reset initial distance and midpoint when less than 2 touches remain
      pinchStateRef.current.initialDistance = null
      pinchStateRef.current.initialMidX = null
      pinchStateRef.current.initialMidY = null
    }
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center border-4 border-green-500 overflow-hidden">
      {/* Breakpoint Indicator (Top Left Corner) */}
      <div 
        className="absolute top-2 left-2 z-30 bg-black bg-opacity-50 text-white text-xs p-1 rounded"
        style={{ pointerEvents: 'none' }} // Make it non-interactive
      >
        Breakpoint: {currentBreakpoint}
      </div>

      {/* Viewport Container: Styles now come from state */}
      <div
        className="absolute border-4 border-orange-500" // Orange border for visualization
        style={{
          overflow: 'hidden', 
          touchAction: 'none',
          // Apply dynamic styles from state
          ...viewportStyle,
          // Keep the centering transform separate
          transform: 'translate(-50%, -50%)', 
        } as CSSProperties} // Added type assertion for clarity
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Inner Container: Applies zoom/pan transforms */}
        <div 
          className="w-full h-full" // Make sure it fills the viewport initially
          style={{
            transform: `translate(${translateX}px, ${translateY}px) scale(${zoom})`,
            transformOrigin: 'center center', 
            cursor: 'grab'
          }}
        >
          <SceneManager />
        </div>
      </div>

      {/* HUD frame remains static */}
      <img
        src={src}
        alt="HUD Frame"
        className="block pointer-events-none z-10"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}
