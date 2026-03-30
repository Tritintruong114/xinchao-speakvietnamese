// This hook requires 'expo-av' native module. 
// If you see "native module 'ExponentAV' not found", please rebuild your dev client:
// npx expo run:ios OR npx expo run:android

import { useEffect, useRef } from 'react';
import { useToastStore } from '../store/useToastStore';

// Using require to prevent immediate crash on import if native module is missing
let Audio: any;
try {
  Audio = require('expo-av').Audio;
} catch (e) {
  console.warn('expo-av native module not found. Audio functionality will be disabled.');
}

export function useAudio() {
  const soundRef = useRef<any>(null);
  const { showToast } = useToastStore();

  useEffect(() => {
    return () => {
      // Clean up sound on unmount
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => { });
      }
    };
  }, []);

  const playSound = async (uri: string) => {
    if (!Audio) {
      showToast(
        'Audio native module not available. Please rebuild with npx expo run:[ios|android]',
        'warning'
      );
      return;
    }
    try {
      // Unload previous sound
      if (soundRef.current) {
        await soundRef.current.unloadAsync().catch(() => { });
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      soundRef.current = sound;

      await sound.playAsync();
    } catch (error) {
      showToast('Failed to play sound. Audio asset might be missing.', 'error');
      console.warn('Failed to play sound', error);
    }
  };

  const stopSound = async () => {
    if (soundRef.current && Audio) {
      await soundRef.current.stopAsync().catch(() => { });
    }
  };

  return { playSound, stopSound };
}
