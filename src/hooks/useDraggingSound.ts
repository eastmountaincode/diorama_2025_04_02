import { useCallback } from 'react';

// AudioContext singleton
let draggingAudioContext: AudioContext | null = null;

// Get or create the audio context
const getAudioContext = (): AudioContext => {
  if (!draggingAudioContext) {
    draggingAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return draggingAudioContext;
};

/**
 * Custom hook to play random dragging sounds with Web Audio API
 * @returns Functions to control the dragging sounds
 */
export const useDraggingSound = () => {
  // Play a random dragging sound
  const playRandomDraggingSound = useCallback((volume: number = 0.3) => {
    try {
      // Use Web Audio API for better volume control
      const context = getAudioContext();
      
      // Generate random number 1-5 for the sound file
      const randomSoundNumber = Math.floor(Math.random() * 5) + 1;
      const soundFile = `assets/audio/dragging_noises/dragging_noise_00${randomSoundNumber}.wav`;
      
      // On some browsers, we need to ensure context is resumed even during mouse down
      const ensureContextRunning = async () => {
        // Force context to resume if not already running
        if (context.state !== 'running') {
          try {
            await context.resume();
            console.log("AudioContext resumed successfully");
          } catch (err) {
            console.error("Failed to resume AudioContext:", err);
          }
        }
        
        try {
          // Fetch the audio file
          const response = await fetch(soundFile);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await context.decodeAudioData(arrayBuffer);
          
          // Create audio source from buffer
          const source = context.createBufferSource();
          source.buffer = audioBuffer;
          
          // Create gain node for volume control
          const gainNode = context.createGain();
          gainNode.gain.value = Math.pow(volume, 3); // Apply cubic scaling
          
          // Connect nodes
          source.connect(gainNode);
          gainNode.connect(context.destination);
          
          // Play immediately
          source.start(0);
          
          // Clean up when sound finishes
          source.onended = () => {
            try {
              source.disconnect();
              gainNode.disconnect();
            } catch (e) {
              console.error("Error disconnecting dragging audio nodes:", e);
            }
          };
        } catch (fetchError) {
          console.error("Error playing dragging sound:", fetchError);
          
          // Fallback to regular Audio API if Web Audio fails
          try {
            const audio = new Audio(soundFile);
            audio.volume = Math.pow(volume, 3);
            audio.play().catch(err => console.error("Fallback audio play failed:", err));
          } catch (audioError) {
            console.error("All audio methods failed:", audioError);
          }
        }
      };
      
      // Start the process
      ensureContextRunning();
      
    } catch (error) {
      console.error("Web Audio API failed for dragging sound:", error);
    }
  }, []);
  
  return { playRandomDraggingSound };
}; 