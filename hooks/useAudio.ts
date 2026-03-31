// This hook requires the 'expo-audio' native module. 
// If you see a native module error, please rebuild your dev client:
// npx expo run:ios OR npx expo run:android

import { useEffect, useRef } from 'react';
import { useToastStore } from '../store/useToastStore';

// Using dynamic import of the native functionality to stay resilient against missing native modules
let Audio: any = null;
try {
  Audio = require('expo-audio');
} catch (e) {
  console.warn('expo-audio native module not found. Audio functionality will be disabled.');
}

export function useAudio() {
  // Use a ref to keep track of the current player instance to manage its lifecycle
  const playerRef = useRef<any>(null);
  const { showToast } = useToastStore();

  useEffect(() => {
    return () => {
      // Clean up player on unmount
      if (playerRef.current) {
        playerRef.current.release();
        playerRef.current = null;
      }
    };
  }, []);

  const playSound = async (source: any) => {
    if (!Audio) {
      showToast(
        'Audio native module not available. Please rebuild with npx expo run:[ios|android]',
        'warning'
      );
      return;
    }

    try {
      // Release previous player instance if it exists to free up native resources
      if (playerRef.current) {
        playerRef.current.release();
        playerRef.current = null;
      }

      // expo-audio comfortably handles both local assets (number) and remote URIs (string)
      // Note: No need for manual { uri: ... } wrapper for strings in expo-audio
      const player = Audio.createAudioPlayer(source);
      playerRef.current = player;
      
      // Explicitly playing once it's created
      player.play();
    } catch (error) {
      showToast('Failed to play sound. Audio asset might be missing.', 'error');
      console.warn('Failed to play sound', error);
    }
  };

  const stopSound = async () => {
    if (playerRef.current) {
      playerRef.current.pause();
    }
  };

  return { playSound, stopSound };
}
