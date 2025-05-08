import { useEffect, useRef } from 'react';

// AudioContext singleton
let audioContext: AudioContext | null = null;

// Get or create the audio context
const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

/**
 * Custom hook to manage water sound with Web Audio API
 * @param isActive Whether the sound should be playing
 * @param volume Volume level (0-1)
 * @returns Functions to control the sound
 */
export const useWaterSound = (isActive: boolean, volume: number = 0.5) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  
  // Setup and play water sound
  useEffect(() => {
    if (isActive) {
      try {
        // Use Web Audio API for better volume control
        const context = getAudioContext();
        
        // Create and prepare the audio element
        const audio = new Audio('assets/audio/water_flowing.mp3');
        audio.loop = true;
        
        // Create Web Audio nodes
        const source = context.createMediaElementSource(audio);
        const gainNode = context.createGain();
        
        // Set volume with exponential scaling for more natural volume perception
        gainNode.gain.value = Math.pow(volume, 3); // Apply cubic scaling
        
        // Connect nodes: source -> gain -> destination
        source.connect(gainNode);
        gainNode.connect(context.destination);
        
        // Store references
        sourceNodeRef.current = source;
        gainNodeRef.current = gainNode;
        audioRef.current = audio;
        
        // Resume audio context if suspended (needed for iOS)
        if (context.state === 'suspended') {
          context.resume().then(() => {
            audio.play().catch(error => {
              console.error("Error playing water sound:", error);
            });
          });
        } else {
          // Play the audio
          audio.play().catch(error => {
            console.error("Error playing water sound:", error);
          });
        }
      } catch (error) {
        console.error("Web Audio API failed:", error);
      }

      // Cleanup function
      return () => {
        stopSound();
      };
    }
  }, [isActive, volume]);
  
  // Function to stop the sound
  const stopSound = () => {
    // Disconnect and clean up Web Audio nodes
    if (sourceNodeRef.current && gainNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
        gainNodeRef.current.disconnect();
      } catch (e) {
        console.error("Error disconnecting audio nodes:", e);
      }
      sourceNodeRef.current = null;
      gainNodeRef.current = null;
    }
    
    // Stop the audio element
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };
  
  // Function to fade out the sound
  const fadeOutSound = (duration: number = 500) => {
    if (gainNodeRef.current && audioContext) {
      const gainNode = gainNodeRef.current;
      const now = audioContext.currentTime;
      
      // Gradual volume reduction over specified duration
      gainNode.gain.linearRampToValueAtTime(0, now + duration/1000);
      
      // Clean up after fade completes
      setTimeout(stopSound, duration);
    } else {
      stopSound();
    }
  };
  
  return {
    stopSound,
    fadeOutSound
  };
}; 