import './App.css'
import { GameSpace } from './components/GameSpace'
import { CursorProvider } from './context/CursorContext'
import CustomCursor from './components/CustomCursor'

function App() {
  return (
    <CursorProvider>
      <div className="w-full h-full" style={{ cursor: 'none' }}>
        <CustomCursor />
        <GameSpace />
      </div>
    </CursorProvider>
  )
}

export default App
