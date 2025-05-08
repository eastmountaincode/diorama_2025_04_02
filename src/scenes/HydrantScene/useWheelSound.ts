import { useRef, useCallback } from 'react';

// AudioContext singleton
let wheelAudioContext: AudioContext | null = null;

// Get or create the audio context
const getAudioContext = (): AudioContext => {
  if (!wheelAudioContext) {
    wheelAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return wheelAudioContext;
};

/**
 * Custom hook to manage wheel squeaking sound with Web Audio API
 * @returns Functions to control the wheel sound
 */
export const useWheelSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  
  // Start playing the wheel sound
  const startSound = useCallback(() => {
    // Clean up any existing sound first
    stopSound();
    
    try {
      // Use Web Audio API for better volume control
      const context = getAudioContext();
      
      // Create and prepare the audio element
      const audio = new Audio('assets/audio/wheel_squeaking.wav');
      audio.loop = true;
      
      // Create Web Audio nodes
      const source = context.createMediaElementSource(audio);
      const gainNode = context.createGain();
      
      // Start with zero volume to avoid pops
      gainNode.gain.value = 0;
      
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
            console.error("Error playing wheel sound:", error);
          });
        });
      } else {
        // Play the audio
        audio.play().catch(error => {
          console.error("Error playing wheel sound:", error);
        });
      }
    } catch (error) {
      console.error("Web Audio API failed for wheel sound:", error);
    }
  }, []);
  
  // Stop the wheel sound
  const stopSound = useCallback(() => {
    // Disconnect and clean up Web Audio nodes
    if (sourceNodeRef.current && gainNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
        gainNodeRef.current.disconnect();
      } catch (e) {
        console.error("Error disconnecting wheel audio nodes:", e);
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
  }, []);
  
  // Set the volume (0-1)
  const setVolume = useCallback((volume: number) => {
    if (gainNodeRef.current) {
      // Apply cubic scaling for more natural sound
      gainNodeRef.current.gain.value = Math.pow(volume, 3);
    }
  }, []);
  
  // Fade out the sound
  const fadeOut = useCallback((duration: number = 300) => {
    if (gainNodeRef.current && wheelAudioContext) {
      const gainNode = gainNodeRef.current;
      const now = wheelAudioContext.currentTime;
      
      // Gradual volume reduction over specified duration
      gainNode.gain.linearRampToValueAtTime(0, now + duration/1000);
      
      // Clean up after fade completes
      setTimeout(stopSound, duration);
    } else {
      stopSound();
    }
  }, [stopSound]);
  
  return {
    startSound,
    stopSound,
    setVolume,
    fadeOut
  };
}; 