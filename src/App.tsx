import { useEffect, useState } from 'react'
import './App.css'
import { GameSpace } from './components/GameSpace'
import { CursorProvider } from './context/CursorContext'
import CustomCursor from './components/CustomCursor'
import { useAtom } from 'jotai'
import { hideCustomCursorAtom } from './scenes/ComputerScene/ComputerScene'

function App() {
  const [isIOS, setIsIOS] = useState(false);
  const [hideCustomCursor] = useAtom(hideCustomCursorAtom);

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
      <div className={`w-full h-full ${hideCustomCursor ? 'show-cursor' : ''}`} style={{ cursor: isIOS ? 'auto' : 'none' }}>
        <CustomCursor />
        <GameSpace />
      </div>
    </CursorProvider>
  )
}

export default App
