import React, { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { 
  breakpointAtom, 
  currentSceneAtom, 
  isEndSceneAtom,
  figurinePositionAtom
} from '../atoms/gameState';

interface RadioAudioPlayerProps {
  audioSrc: string;
}

const RadioAudioPlayer: React.FC<RadioAudioPlayerProps> = ({ audioSrc }) => {
  // Audio element and Web Audio API nodes
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  
  // Component state
  const [currentScene] = useAtom(currentSceneAtom);
  const [isEndScene] = useAtom(isEndSceneAtom);
  const [breakpoint] = useAtom(breakpointAtom);
  const [figurinePosition] = useAtom(figurinePositionAtom);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  
  // Audio parameters
  // Maximum distance (in percentage units) at which the audio is still audible
  const maxAudioDistance = 30;
  // Min and max volume to keep volume within a more subtle range
  const minVolume = 0.02;  // Minimum volume when far away (much quieter)
  const maxVolume = 0.25;  // Maximum volume when close (still quiet)
  // Fixed filter frequency (always muffled)
  const filterFrequency = 550; // Constant low-pass filter at 500Hz
  
  // Radio position (percentage coordinates) - same as in MainSceneProximityManager
  const radioPosition = {
    x: breakpoint === 'mobile' ? 67.5 + 2.9 : 66.8 + 2.25,
    y: breakpoint === 'mobile' ? 51 + 2.9 : 52.5 + 2.25
  };

  // Calculate distance between figurine and radio
  const calculateDistance = () => {
    if (!figurinePosition) return maxAudioDistance;
    const dx = figurinePosition.x - radioPosition.x;
    const dy = figurinePosition.y - radioPosition.y;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  // Initialize audio context and nodes
  const setupAudioNodes = () => {
    if (!audioRef.current || audioContextRef.current) return;
    
    try {
      // Create audio context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create source node from audio element
      sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      
      // Create gain node for volume control
      gainNodeRef.current = audioContextRef.current.createGain();
      
      // Create filter node for low-pass filter
      filterNodeRef.current = audioContextRef.current.createBiquadFilter();
      filterNodeRef.current.type = 'lowpass';
      filterNodeRef.current.frequency.value = filterFrequency; // Fixed at 500Hz
      filterNodeRef.current.Q.value = 1.0; // Q factor (resonance)
      
      // Connect nodes: source -> filter -> gain -> destination
      sourceNodeRef.current.connect(filterNodeRef.current);
      filterNodeRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioContextRef.current.destination);
      
      console.log("Audio processing nodes set up successfully");
    } catch (error) {
      console.error("Error setting up Web Audio API:", error);
    }
  };

  // Initialize audio player
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioSrc);
      audioRef.current.loop = true;
      
      // Set up event handlers
      audioRef.current.addEventListener('canplaythrough', () => {
        setIsAudioLoaded(true);
        setupAudioNodes();
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.error("Audio error:", e);
        setIsAudioLoaded(false);
      });
      
      // Preload the audio
      audioRef.current.load();
    }
    
    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(err => console.error("Error closing audio context:", err));
        audioContextRef.current = null;
        sourceNodeRef.current = null;
        gainNodeRef.current = null;
        filterNodeRef.current = null;
      }
    };
  }, [audioSrc]);

  // Control audio playback based on scene
  useEffect(() => {
    if (!audioRef.current || !isAudioLoaded) return;
    
    if (currentScene === 'MainScene' && !isEndScene) {
      // Resume audio context if it was suspended (needed for Chrome autoplay policy)
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      // Play audio when in main scene and not in end scene
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error playing audio:", error);
        });
      }
    } else {
      // Pause audio when not in main scene
      audioRef.current.pause();
    }
  }, [currentScene, isEndScene, isAudioLoaded]);

  // Update volume based on figurine position
  useEffect(() => {
    if (!figurinePosition || 
        !isAudioLoaded || 
        currentScene !== 'MainScene' || 
        isEndScene || 
        !gainNodeRef.current) return;
    
    // Calculate distance and normalized value (0-1)
    const distance = calculateDistance();
    
    // Use a more subtle transition curve to make changes less pronounced
    // This creates a subtle fade between min and max volume
    const normalizedDistance = Math.min(1, Math.pow(distance / maxAudioDistance, 0.7));
    
    // Calculate volume - the closer to the radio, the louder (but still within quiet range)
    const volume = maxVolume - normalizedDistance * (maxVolume - minVolume);
    
    // Apply volume
    gainNodeRef.current.gain.value = volume;
    
  }, [figurinePosition, currentScene, isEndScene, isAudioLoaded]);

  // Component doesn't render anything visible
  return null;
};

export default RadioAudioPlayer; 