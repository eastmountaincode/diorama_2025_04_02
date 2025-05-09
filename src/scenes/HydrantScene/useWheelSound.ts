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
  const lastVolumeRef = useRef<number>(0);
  
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
      lastVolumeRef.current = 0;
      
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
    
    lastVolumeRef.current = 0;
  }, []);
  
  // Set the volume (0-1) with smooth transition
  const setVolume = useCallback((volume: number) => {
    if (gainNodeRef.current && wheelAudioContext) {
      // Apply cubic scaling for more natural sound
      const targetVolume = Math.pow(volume, 3);
      
      // Skip if the volume change is negligible to avoid scheduling too many ramps
      if (Math.abs(targetVolume - lastVolumeRef.current) < 0.01) {
        return;
      }
      
      const now = wheelAudioContext.currentTime;
      // Use a very short ramp (20ms) to avoid pops while still being responsive
      const rampTime = now + 0.02;
      
      // Cancel any scheduled ramps
      gainNodeRef.current.gain.cancelScheduledValues(now);
      // Start from current value
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, now);
      // Ramp to new value
      gainNodeRef.current.gain.linearRampToValueAtTime(targetVolume, rampTime);
      
      // Update last volume
      lastVolumeRef.current = targetVolume;
    }
  }, []);
  
  // Fade out the sound
  const fadeOut = useCallback((duration: number = 300) => {
    if (gainNodeRef.current && wheelAudioContext) {
      const gainNode = gainNodeRef.current;
      const now = wheelAudioContext.currentTime;
      
      // Start from current value
      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.setValueAtTime(gainNode.gain.value, now);
      
      // Gradual volume reduction over specified duration
      gainNode.gain.linearRampToValueAtTime(0, now + duration/1000);
      
      // Clean up after fade completes
      setTimeout(stopSound, duration);
      
      lastVolumeRef.current = 0;
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