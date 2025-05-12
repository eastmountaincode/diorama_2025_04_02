import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { breakpointAtom, currentSceneAtom, computerTaskCompletedAtom } from '../../atoms/gameState';
import ComputerFile from './ComputerFile';
import PhotoViewer from './PhotoViewer';
import InternetBrowser from './InternetBrowser';
import { useComputerRingSound } from './useComputerRingSound';
import { atom } from 'jotai';

// Export an atom to track if the browser is open
export const isBrowserOpenAtom = atom<boolean>(false);

// Export an atom to track if a photo is open
export const isPhotoOpenAtom = atom<boolean>(false);

// Export an atom to control custom cursor visibility
export const hideCustomCursorAtom = atom<boolean>(false);

// Type for photo metadata
interface PhotoMeta {
  path: string;
  customWidth?: string;
}

const ComputerScene: React.FC = () => {
  const [currentScene] = useAtom(currentSceneAtom);
  const [breakpoint] = useAtom(breakpointAtom);
  const [currentPhoto, setCurrentPhoto] = useState<PhotoMeta | null>(null);
  const [showBrowser, setShowBrowser] = useAtom(isBrowserOpenAtom);
  const [, setIsPhotoOpen] = useAtom(isPhotoOpenAtom);
  const [, setHideCustomCursor] = useAtom(hideCustomCursorAtom);
  const [computerTaskCompleted, setComputerTaskCompleted] = useAtom(computerTaskCompletedAtom);
  
  // Use our Web Audio API hook for ring sound
  const { playSound: playRingSound } = useComputerRingSound();

  const folderIconSrc = 'assets/bg/computer/Folder_Closed.ico';
  const internetIconSrc = 'assets/bg/computer/Network_Computers.ico';

  // Define photo paths with simplified size presets
  const photos: Record<string, PhotoMeta> = {
    'hydrant_photo': {
      path: 'assets/bg/computer/photos_new/hydrant_instructions.png',
      customWidth: breakpoint === 'mobile' ? '14%' : '20%'
    },
    'corp_gore_manifesto': {
      path: 'assets/bg/computer/photos_new/README.png',
      customWidth: breakpoint === 'mobile' ? '12%' : '12%'
    },
    'family_photo_1': {
      path: 'assets/bg/computer/photos_new/fam_1_white_gma.jpg',
      customWidth: breakpoint === 'mobile' ? '13%' : '15%'
    },
    'child_photo': {
      path: 'assets/bg/computer/photos_new/child.jpg',
      customWidth: breakpoint === 'mobile' ? '13%' : '25%'
    },
    'family_photo_2': {
      path: 'assets/bg/computer/photos_new/fam_2_chinese_gma.jpg',
      customWidth: breakpoint === 'mobile' ? '13%' : '15%'
    }
  };

  // Handler for opening a photo
  const handleOpenPhoto = (folderName: string) => {
    const photoMeta = photos[folderName];
    setCurrentPhoto(photoMeta);
    setIsPhotoOpen(true);

    // If opening the README file and task not completed yet, mark it as completed
    if (folderName === 'child_photo' && !computerTaskCompleted) {
      setComputerTaskCompleted(true);
      // Use Web Audio API version of the sound
      playRingSound();
    }
  };

  // Handler for closing the photo
  const handleClosePhoto = () => {
    setCurrentPhoto(null);
    setIsPhotoOpen(false);
  };

  // Handler for opening the internet browser
  const handleOpenBrowser = () => {
    setShowBrowser(true);
    setHideCustomCursor(true); // Hide custom cursor when browser is open
  };

  // Handler for closing the internet browser
  const handleCloseBrowser = () => {
    setShowBrowser(false);
    setHideCustomCursor(false); // Show custom cursor again when browser is closed
  };

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
          name="Hydrant"
          iconSrc={folderIconSrc}
          positionX= {breakpoint === 'mobile' ? '34.4%' : '35%'}
          positionY={breakpoint === 'mobile' ? '42.3%' : '36.3%'}
          scale={breakpoint === 'mobile' ? 0.19 : 0.28}
          onClick={() => handleOpenPhoto('hydrant_photo')}
        />
        <ComputerFile 
          name="Corp Gore Manifesto"
          iconSrc={folderIconSrc}
          positionX= {breakpoint === 'mobile' ? '39%' : '39%'}
          positionY={breakpoint === 'mobile' ? '42.6%' : '36.78%'}    
          scale={breakpoint === 'mobile' ? 0.19 : 0.28}
          onClick={() => handleOpenPhoto('corp_gore_manifesto')}
        />
        <ComputerFile 
          name="Family_1"
          iconSrc={folderIconSrc}
          positionX= {breakpoint === 'mobile' ? '35.5%' : '36.5%'}
          positionY={breakpoint === 'mobile' ? '44%' : '39.5%'}    
          scale={breakpoint === 'mobile' ? 0.19 : 0.28}
          onClick={() => handleOpenPhoto('family_photo_1')}
        />
        <ComputerFile 
          name="Family_2"
          iconSrc={folderIconSrc}
          positionX= {breakpoint === 'mobile' ? '39.5%' : '43%'}
          positionY={breakpoint === 'mobile' ? '44%' : '39.5%'}    
          scale={breakpoint === 'mobile' ? 0.19 : 0.28}
          onClick={() => handleOpenPhoto('family_photo_2')}
        />
        <ComputerFile 
          name="Child"
          iconSrc={folderIconSrc}
          positionX= {breakpoint === 'mobile' ? '42%' : '40%'}
          positionY={breakpoint === 'mobile' ? '43%' : '39.5%'}    
          scale={breakpoint === 'mobile' ? 0.19 : 0.28}
          onClick={() => handleOpenPhoto('child_photo')}
        />
        {breakpoint === 'desktop' && (
          <ComputerFile 
            name="Internet"
            iconSrc={internetIconSrc}
            positionX='39.5%'
            positionY='42.5%'    
            scale={0.28}
            onClick={handleOpenBrowser}
          />
        )}
      </div>

      {/* Photo Viewer */}
      {currentPhoto && (
        <PhotoViewer 
          imageSrc={currentPhoto.path} 
          customWidth={currentPhoto.customWidth}
          onClose={handleClosePhoto} 
        />
      )}

      {/* Internet Browser */}
      {showBrowser && (
        <InternetBrowser 
          onClose={handleCloseBrowser} 
        />
      )}
    </div>
  );
};

export default ComputerScene;