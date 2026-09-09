import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { GameSpace } from './components/GameSpace'
import { GameAssetLoadingScreen } from './components/GameAssetLoadingScreen'
import { CursorProvider } from './context/CursorContext'
import CustomCursor from './components/CustomCursor'
import { useAtom } from 'jotai'
import { hideCustomCursorAtom } from './scenes/ComputerScene/ComputerScene'

function App() {
  const [isIOS, setIsIOS] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const [hideCustomCursor] = useAtom(hideCustomCursorAtom);
  const handleAssetsReady = useCallback(() => setAssetsReady(true), []);

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

  if (!assetsReady) {
    return <GameAssetLoadingScreen onReady={handleAssetsReady} />;
  }

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
