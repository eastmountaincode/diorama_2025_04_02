import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { breakpointAtom, currentSceneAtom, computerTaskCompletedAtom } from '../../atoms/gameState';
import ComputerFile from './ComputerFile';
import PhotoViewer from './PhotoViewer';
import { playGetRingSound } from '../../utils/sound';

const ComputerScene: React.FC = () => {
  const [currentScene] = useAtom(currentSceneAtom);
  const [breakpoint] = useAtom(breakpointAtom);
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const [computerTaskCompleted, setComputerTaskCompleted] = useAtom(computerTaskCompletedAtom);

  const folderIconSrc = 'assets/bg/computer/Folder_Closed.ico';

  // Define photo paths for each folder
  const photos = {
    'hydrant_photo': 'assets/bg/computer/photos_demo/direct_lease-min.png',
    'archive_photo': 'assets/bg/computer/photos_demo/sb_in_dark-min.png',
    'studio_photo': 'assets/bg/computer/photos_demo/studio_2-min.png',
  };

  // Handler for opening a photo
  const handleOpenPhoto = (folderName: string) => {
    const photoPath = photos[folderName as keyof typeof photos];
    setCurrentPhoto(photoPath);

    // If opening the archive photo and task not completed yet, mark it as completed
    if (folderName === 'archive_photo' && !computerTaskCompleted) {
      setComputerTaskCompleted(true);
      playGetRingSound(0.2, 1000);
    }
  };

  // Handler for closing the photo
  const handleClosePhoto = () => {
    setCurrentPhoto(null);
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
          scale={breakpoint === 'mobile' ? 0.2 : 0.28}
          onClick={() => handleOpenPhoto('hydrant_photo')}
        />
        <ComputerFile 
          name="Archive"
          iconSrc={folderIconSrc}
          positionX= {breakpoint === 'mobile' ? '39%' : '39%'}
          positionY={breakpoint === 'mobile' ? '42.6%' : '36.78%'}    
          scale={breakpoint === 'mobile' ? 0.2 : 0.28}
          onClick={() => handleOpenPhoto('archive_photo')}
        />
        <ComputerFile 
          name="Studio"
          iconSrc={folderIconSrc}
          positionX= {breakpoint === 'mobile' ? '35.5%' : '36.5%'}
          positionY={breakpoint === 'mobile' ? '44%' : '39.5%'}    
          scale={breakpoint === 'mobile' ? 0.2 : 0.28}
          onClick={() => handleOpenPhoto('studio_photo')}
        />
      </div>

      {/* Photo Viewer */}
      {currentPhoto && (
        <PhotoViewer 
          imageSrc={currentPhoto} 
          onClose={handleClosePhoto} 
        />
      )}
    </div>
  );
};

export default ComputerScene; 