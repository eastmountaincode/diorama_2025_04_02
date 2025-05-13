/**
 * Utility functions for photo handling, including frame rendering and download
 */

/**
 * Creates a downloadable image with a photo inside a frame
 * @param photoImg The photo image element
 * @param frameImg The frame image element
 * @param frameTopPct Percentage from top where photo should be positioned
 * @param frameLeftPct Percentage from left where photo should be positioned
 * @param frameWidthPct Percentage of width the photo should occupy
 * @param frameHeightPct Percentage of height the photo should occupy
 * @param fileName Name of the downloaded file
 */
export const createFramedPhotoDownload = (
  photoImg: HTMLImageElement,
  frameImg: HTMLImageElement,
  frameTopPct: number = 4,
  frameLeftPct: number = 6, 
  frameWidthPct: number = 88,
  frameHeightPct: number = 81,
  fileName: string = 'i_still_exist.png'
): void => {
  if (!photoImg || !frameImg) return;
  
  // Create a canvas with the proper dimensions to match the frame's aspect ratio
  const canvas = document.createElement('canvas');
  
  // Use the natural dimensions of the frame image for better quality
  const naturalWidth = frameImg.naturalWidth;
  const naturalHeight = frameImg.naturalHeight;
  
  // Set canvas size to match the natural dimensions of the frame image
  canvas.width = naturalWidth;
  canvas.height = naturalHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Cannot create canvas context');
    return;
  }
  
  // Clear the canvas with transparent background
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // First draw the frame to get correct dimensions
  ctx.drawImage(frameImg, 0, 0, naturalWidth, naturalHeight);
  
  // These percentages match the CSS in the component
  const photoX = Math.floor(naturalWidth * (frameLeftPct / 100));
  const photoY = Math.floor(naturalHeight * (frameTopPct / 100));
  const photoWidth = Math.floor(naturalWidth * (frameWidthPct / 100));
  const photoHeight = Math.floor(naturalHeight * (frameHeightPct / 100));
  
  // Create a temporary canvas for the photo with the exact dimensions of the photo area
  const photoCanvas = document.createElement('canvas');
  photoCanvas.width = photoWidth;
  photoCanvas.height = photoHeight;
  const photoCtx = photoCanvas.getContext('2d');
  
  if (photoCtx) {
    // Calculate aspect ratios
    const sourceAspect = photoImg.naturalWidth / photoImg.naturalHeight;
    const targetAspect = photoWidth / photoHeight;
    
    // Variables for centering and scaling
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = photoImg.naturalWidth;
    let sourceHeight = photoImg.naturalHeight;
    
    // Determine which dimension to constrain
    if (sourceAspect > targetAspect) {
      // Source is wider, constrain width
      sourceWidth = photoImg.naturalHeight * targetAspect;
      sourceX = (photoImg.naturalWidth - sourceWidth) / 2;
    } else {
      // Source is taller, constrain height
      sourceHeight = photoImg.naturalWidth / targetAspect;
      sourceY = (photoImg.naturalHeight - sourceHeight) / 2;
    }
    
    // Set up mirror transformation
    photoCtx.translate(photoWidth, 0);
    photoCtx.scale(-1, 1);
    
    // Draw the photo with proper cropping to match target aspect ratio
    photoCtx.drawImage(
      photoImg,
      sourceX, sourceY, sourceWidth, sourceHeight,  // Source crop
      0, 0, photoWidth, photoHeight                 // Destination
    );
    
    // Now draw the temporary photo canvas into the main canvas at the correct position
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over'; // Draw under existing content
    ctx.drawImage(photoCanvas, photoX, photoY);
    ctx.restore();
    
    // Draw the frame again on top to ensure it's visible
    ctx.globalCompositeOperation = 'source-over'; // Default mode
    ctx.drawImage(frameImg, 0, 0, naturalWidth, naturalHeight);
  }
  
  // Get the data URL from the canvas
  const dataUrl = canvas.toDataURL('image/png');
  
  // Mobile detection
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isInApp = window.navigator.userAgent.includes('Instagram') || 
                  window.navigator.userAgent.includes('FBAV') || 
                  window.navigator.userAgent.includes('FBAN');
  
  if (isMobile && isInApp) {
    // For in-app browsers on mobile, open the image in a new tab first
    // This often allows the user to long press and save the image
    const newTab = window.open();
    if (newTab) {
      newTab.document.write(`
        <html>
          <head>
            <title>Save your photo</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { 
                margin: 0; 
                padding: 0; 
                display: flex; 
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                background-color: #000;
                color: #fff;
                font-family: sans-serif;
                text-align: center;
              }
              img { 
                max-width: 100%; 
                max-height: 80vh;
                object-fit: contain;
              }
              .instructions {
                padding: 20px;
                font-size: 16px;
              }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" alt="Your Photo">
            <div class="instructions">
              Press and hold on the image to save it to your device
            </div>
          </body>
        </html>
      `);
      newTab.document.close();
    }
  } else {
    // Traditional download for desktop and standard mobile browsers
    try {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        // Revoke the object URL to free memory
        URL.revokeObjectURL(link.href);
      }, 100);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback for browsers that don't support download attribute
      window.open(dataUrl, '_blank');
    }
  }
}; 