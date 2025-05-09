import { useCallback } from 'react';

// AudioContext singleton
let cameraAudioContext: AudioContext | null = null;

// Get or create the audio context
const getAudioContext = (): AudioContext => {
  if (!cameraAudioContext) {
    cameraAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return cameraAudioContext;
};

/**
 * Custom hook to play the camera click sound with Web Audio API
 * @returns Functions to control the camera sound
 */
export const useCameraClickSound = () => {
  // Play the camera click sound immediately
  const playSound = useCallback((volume: number = 0.45) => {
    try {
      // Use Web Audio API for better volume control
      const context = getAudioContext();
      
      // On some browsers, we need to ensure context is resumed even during interaction
      const ensureContextRunning = async () => {
        // Force context to resume if not already running
        if (context.state !== 'running') {
          try {
            await context.resume();
            console.log("Camera AudioContext resumed successfully");
          } catch (err) {
            console.error("Failed to resume Camera AudioContext:", err);
          }
        }
        
        // Create a buffered source for more reliable playback
        try {
          // Fetch the audio file
          const response = await fetch('assets/audio/camera_click.mp3');
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await context.decodeAudioData(arrayBuffer);
          
          // Now create audio source from buffer (more reliable than MediaElementSource)
          const source = context.createBufferSource();
          source.buffer = audioBuffer;
          
          // Create gain node for volume control
          const gainNode = context.createGain();
          gainNode.gain.value = Math.pow(volume, 3); // Apply cubic scaling
          
          // Connect nodes
          source.connect(gainNode);
          gainNode.connect(context.destination);
          
          // Start playback immediately
          try {
            source.start(0);
            
            // Clean up when sound finishes
            source.onended = () => {
              try {
                source.disconnect();
                gainNode.disconnect();
              } catch (e) {
                console.error("Error disconnecting camera click audio nodes:", e);
              }
            };
          } catch (err) {
            console.error("Error starting camera click sound:", err);
          }
          
        } catch (fetchError) {
          // Fallback to MediaElementSource if buffered approach fails
          console.warn("Buffer source failed for camera, falling back to MediaElement:", fetchError);
          
          // Create new audio element for each play
          const audio = new Audio('assets/audio/camera_click.mp3');
          
          // Create Web Audio nodes
          const source = context.createMediaElementSource(audio);
          const gainNode = context.createGain();
          gainNode.gain.value = Math.pow(volume, 3);
          
          // Connect nodes
          source.connect(gainNode);
          gainNode.connect(context.destination);
          
          // Play immediately
          const playPromise = audio.play();
          if (playPromise) {
            playPromise.catch(error => {
              console.error("Error playing camera click sound:", error);
            });
          }
          
          // Clean up after playback
          audio.onended = () => {
            try {
              source.disconnect();
              gainNode.disconnect();
            } catch (e) {
              console.error("Error disconnecting camera audio nodes:", e);
            }
          };
        }
      };
      
      // Start the process
      ensureContextRunning();
      
    } catch (error) {
      console.error("Web Audio API failed for camera click sound:", error);
    }
  }, []);
  
  return { playSound };
}; 