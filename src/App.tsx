import { useEffect, useState } from 'react'
import './App.css'
import { GameSpace } from './components/GameSpace'
import { CursorProvider } from './context/CursorContext'
import CustomCursor from './components/CustomCursor'

function App() {
  const [isIOS, setIsIOS] = useState(false);

  // Detect iOS/iPadOS devices on mount
  useEffect(() => {
    // Check if device is iOS/iPadOS
    const isIOSDevice = () => {
      return (
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
      );
    };
    
    setIsIOS(isIOSDevice());
  }, []);

  return (
    <CursorProvider>
      <div className="w-full h-full" style={{ cursor: isIOS ? 'auto' : 'none' }}>
        <CustomCursor />
        <GameSpace />
      </div>
    </CursorProvider>
  )
}

export default App
