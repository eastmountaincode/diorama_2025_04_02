// Sound utility functions

/**
 * Plays a sound effect
 * @param soundPath Path to the sound file
 * @param volume Volume level (0.0 to 1.0)
 * @param delay Delay in milliseconds before playing the sound
 * @returns The Audio element that was created and played
 */
export const playSound = (soundPath: string, volume: number, delay: number): HTMLAudioElement => {
  const audio = new Audio(soundPath);
  
  // Apply exponential scaling to make volume control more natural at low levels
  // This makes small volume values like 0.1 much quieter than linear scaling
  audio.volume = Math.pow(volume, 3);
  
  // Play the sound with optional delay
  if (delay > 0) {
    setTimeout(() => {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error playing sound:", error);
        });
      }
    }, delay);
  } else {
    // Play immediately
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error("Error playing sound:", error);
      });
    }
  }
  
  return audio;
};

/**
 * Plays the "get ring" sound effect
 * @param volume Optional volume level (0.0 to 1.0), uses exponential scaling
 * @param delay Delay in milliseconds before playing the sound
 * @returns The Audio element that was created and played
 */
export const playGetRingSound = (volume: number = 0.4, delay: number = 500): HTMLAudioElement => {
  return playSound("assets/audio/get_ring.wav", volume, delay);
};

/**
 * Plays the "button click" sound effect (for the radio)
 * @param volume Optional volume level (0.0 to 1.0), uses exponential scaling
 * @param delay Delay in milliseconds before playing the sound
 * @returns The Audio element that was created and played
 */
export const playButtonClickSound = (volume: number = 0.65, delay: number = 0): HTMLAudioElement => {
  return playSound("assets/audio/button_click.wav", volume, delay);
};

/**
 * Plays the "mouse click" sound effect
 * @param volume Optional volume level (0.0 to 1.0), uses exponential scaling
 * @param delay Delay in milliseconds before playing the sound
 * @returns The Audio element that was created and played
 */
export const playMouseClickSound = (volume: number = 0.75, delay: number = 0): HTMLAudioElement => {
  return playSound("assets/audio/mouse_click.mp3", volume, delay);
};

/**
 * Plays the "camera click" sound effect
 * @param volume Optional volume level (0.0 to 1.0), uses exponential scaling
 * @param delay Delay in milliseconds before playing the sound
 * @returns The Audio element that was created and played
 */
export const playCameraClickSound = (volume: number = 0.5, delay: number = 0): HTMLAudioElement => {
  return playSound("assets/audio/camera_click.mp3", volume, delay);
};

/**
 * Plays the "water flowing" sound effect
 * @param volume Optional volume level (0.0 to 1.0), uses exponential scaling
 * @param delay Delay in milliseconds before playing the sound
 * @returns The Audio element that was created and played
 */
export const playWaterFlowingSound = (volume: number = 0.4, delay: number = 0): HTMLAudioElement => {
  return playSound("assets/audio/water_flowing.mp3", volume, delay);
};

/**
 * Plays the "wheel squeaking" sound effect
 * @param volume Optional volume level (0.0 to 1.0), uses exponential scaling
 * @param delay Delay in milliseconds before playing the sound
 * @returns The Audio element that was created and played
 */
export const playWheelSqueakingSound = (volume: number = 0.4, delay: number = 0): HTMLAudioElement => {
  return playSound("assets/audio/wheel_squeaking.wav", volume, delay);
}; 