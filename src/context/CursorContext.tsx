import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define cursor types
type CursorType = 'neutral' | 'open' | 'pinching' | 'grasping' | 'pointing';

// Define context types
interface CursorContextType {
  cursorType: CursorType;
  setCursorType: (type: CursorType) => void;
}

// Create the context with default values
const CursorContext = createContext<CursorContextType>({
  cursorType: 'neutral',
  setCursorType: () => {},
});

// Custom hook for using the cursor context
export const useCursor = () => useContext(CursorContext);

// Provider component
interface CursorProviderProps {
  children: ReactNode;
}

export const CursorProvider: React.FC<CursorProviderProps> = ({ children }) => {
  const [cursorType, setCursorType] = useState<CursorType>('neutral');

  return (
    <CursorContext.Provider value={{ cursorType, setCursorType }}>
      {children}
    </CursorContext.Provider>
  );
}; 