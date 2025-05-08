import { useCallback } from 'react';

// AudioContext singleton
let ringAudioContext: AudioContext | null = null;

// Get or create the audio context
const getAudioContext = (): AudioContext => {
  if (!ringAudioContext) {
    ringAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return ringAudioContext;
};

/**
 * Custom hook to play the "get ring" sound with Web Audio API
 * @returns Functions to control the ring sound
 */
export const useRingSound = () => {
  // Play the ring sound with optional delay
  const playSound = useCallback((volume: number = 0.5, delayMs: number = 500) => {
    try {
      // Use Web Audio API for better volume control
      const context = getAudioContext();
      
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
        
        // Create new audio element for each play
        const audio = new Audio('assets/audio/get_ring.wav');
        
        // Create a buffered source for more reliable playback
        try {
          // Fetch the audio file
          const response = await fetch('assets/audio/get_ring.wav');
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
          
          // Schedule playback with delay
          setTimeout(() => {
            try {
              source.start(0);
              
              // Clean up when sound finishes
              source.onended = () => {
                try {
                  source.disconnect();
                  gainNode.disconnect();
                } catch (e) {
                  console.error("Error disconnecting ring audio nodes:", e);
                }
              };
            } catch (err) {
              console.error("Error starting ring sound:", err);
            }
          }, delayMs);
          
        } catch (fetchError) {
          // Fallback to MediaElementSource if buffered approach fails
          console.warn("Buffer source failed, falling back to MediaElement:", fetchError);
          
          // Create Web Audio nodes
          const source = context.createMediaElementSource(audio);
          const gainNode = context.createGain();
          gainNode.gain.value = Math.pow(volume, 3);
          
          // Connect nodes
          source.connect(gainNode);
          gainNode.connect(context.destination);
          
          // Play with delay
          setTimeout(() => {
            const playPromise = audio.play();
            if (playPromise) {
              playPromise.catch(error => {
                console.error("Error playing ring sound:", error);
              });
            }
            
            // Clean up after playback
            audio.onended = () => {
              try {
                source.disconnect();
                gainNode.disconnect();
              } catch (e) {
                console.error("Error disconnecting audio nodes:", e);
              }
            };
          }, delayMs);
        }
      };
      
      // Start the process
      ensureContextRunning();
      
    } catch (error) {
      console.error("Web Audio API failed for ring sound:", error);
    }
  }, []);
  
  return { playSound };
}; 