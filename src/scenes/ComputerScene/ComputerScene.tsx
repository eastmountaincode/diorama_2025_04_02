import React from 'react';
import { useAtom } from 'jotai';
import { breakpointAtom, currentSceneAtom } from '../../atoms/gameState';
import ComputerFile from './ComputerFile';

const ComputerScene: React.FC = () => {
  const [currentScene] = useAtom(currentSceneAtom);
  const [breakpoint] = useAtom(breakpointAtom);

  const folderIconSrc = 'assets/bg/computer/Folder_Closed.ico';

  return (
    <div
      className="w-full h-full flex items-center justify-center z-20"
      style={{
        backgroundImage: "url('assets/bg/computer/computer_close_up_xp-min.jpg')",
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        pointerEvents: currentScene === 'ComputerScene' ? 'auto' : 'none',
        position: 'relative',
        display: currentScene === 'ComputerScene' ? 'flex' : 'none',
        marginLeft: breakpoint === 'mobile' ? '10%' : '10%',
        marginTop: breakpoint === 'mobile' ? '4.5%' : '3.5%',
      }}
    >
      {/* Desktop files with absolute positioning */}
      <div className="absolute inset-0 overflow-hidden">
        <ComputerFile 
          name="Folder 1"
          iconSrc={folderIconSrc}
          positionX= {breakpoint === 'mobile' ? '34.4%' : '35%'}
          positionY={breakpoint === 'mobile' ? '42.3%' : '36.3%'}
          scale={breakpoint === 'mobile' ? 0.2 : 0.28}
        />
        <ComputerFile 
          name="Folder 2"
          iconSrc={folderIconSrc}
          positionX= {breakpoint === 'mobile' ? '39%' : '39%'}
          positionY={breakpoint === 'mobile' ? '42.6%' : '36.78%'}    
          scale={breakpoint === 'mobile' ? 0.2 : 0.28}
        />
        <ComputerFile 
          name="Folder 3"
          iconSrc={folderIconSrc}
          positionX= {breakpoint === 'mobile' ? '35.5%' : '36.5%'}
          positionY={breakpoint === 'mobile' ? '44%' : '39.5%'}    
          scale={breakpoint === 'mobile' ? 0.2 : 0.28}
        />
      </div>
    </div>
  );
};

export default ComputerScene; 