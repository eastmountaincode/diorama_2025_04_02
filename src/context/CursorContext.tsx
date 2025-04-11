import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define cursor types
type CursorType = 'default' | 'pointer' | 'grabbing' | 'grab';

// Define context types
interface CursorContextType {
  cursorType: CursorType;
  setCursorType: (type: CursorType) => void;
}

// Create the context with default values
const CursorContext = createContext<CursorContextType>({
  cursorType: 'default',
  setCursorType: () => {},
});

// Custom hook for using the cursor context
export const useCursor = () => useContext(CursorContext);

// Provider component
interface CursorProviderProps {
  children: ReactNode;
}

export const CursorProvider: React.FC<CursorProviderProps> = ({ children }) => {
  const [cursorType, setCursorType] = useState<CursorType>('default');

  return (
    <CursorContext.Provider value={{ cursorType, setCursorType }}>
      {children}
    </CursorContext.Provider>
  );
}; 