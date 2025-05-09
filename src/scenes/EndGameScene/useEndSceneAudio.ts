import { useCallback, useRef, useEffect } from 'react';

// AudioContext singleton
let endSceneAudioContext: AudioContext | null = null;

// Get or create the audio context
const getAudioContext = (): AudioContext => {
  if (!endSceneAudioContext) {
    endSceneAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return endSceneAudioContext;
};

/**
 * Custom hook to handle video audio with Web Audio API for better mobile support
 * @returns Functions to control the video audio
 */
export const useEndSceneAudio = () => {
  // Keep track of the audio nodes
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const connectedElementRef = useRef<HTMLMediaElement | null>(null);
  
  // Function to connect a video element to the Web Audio API
  const connectVideoAudio = useCallback(async (videoElement: HTMLVideoElement, volume: number = 0.2) => {
    // If we're already connected to this element, just update volume
    if (connectedElementRef.current === videoElement && sourceNodeRef.current && gainNodeRef.current) {
      gainNodeRef.current.gain.value = Math.pow(volume, 3);
      return;
    }
    
    // First disconnect any existing audio connections
    disconnectVideoAudio();
    
    try {
      // Get the audio context
      const context = getAudioContext();
      
      // Make sure the context is running
      if (context.state !== 'running') {
        await context.resume();
      }
      
      // Create the source node from the video element
      // This might throw if the element is already connected
      try {
        const sourceNode = context.createMediaElementSource(videoElement);
        
        // Create a gain node for volume control
        const gainNode = context.createGain();
        
        // Set the volume (using cubic scaling for more natural volume control)
        gainNode.gain.value = Math.pow(volume, 3);
        
        // Connect the nodes
        sourceNode.connect(gainNode);
        gainNode.connect(context.destination);
        
        // Store references to the nodes
        sourceNodeRef.current = sourceNode;
        gainNodeRef.current = gainNode;
        connectedElementRef.current = videoElement;
        
        console.log("Video audio connected to Web Audio API");
      } catch (err) {
        console.warn("Could not create MediaElementSource, using native volume control", err);
        // Fall back to native volume control
        videoElement.volume = volume;
      }
    } catch (error) {
      console.error("Failed to connect video audio to Web Audio API:", error);
      // Fall back to native volume control if Web Audio API fails
      videoElement.volume = volume;
    }
  }, []);
  
  // Function to disconnect the video audio from Web Audio API
  const disconnectVideoAudio = useCallback(() => {
    if (sourceNodeRef.current && gainNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
        gainNodeRef.current.disconnect();
        console.log("Video audio disconnected from Web Audio API");
      } catch (e) {
        console.error("Error disconnecting video audio nodes:", e);
      }
      sourceNodeRef.current = null;
      gainNodeRef.current = null;
      connectedElementRef.current = null;
    }
  }, []);
  
  // Function to set the volume
  const setVolume = useCallback((volume: number) => {
    if (gainNodeRef.current) {
      // Apply cubic scaling for more natural volume control
      gainNodeRef.current.gain.value = Math.pow(volume, 3);
    } else if (connectedElementRef.current) {
      // Fall back to native volume if gain node isn't available
      connectedElementRef.current.volume = volume;
    }
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectVideoAudio();
    };
  }, [disconnectVideoAudio]);
  
  return {
    connectVideoAudio,
    disconnectVideoAudio,
    setVolume
  };
}; 