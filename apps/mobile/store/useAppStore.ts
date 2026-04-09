import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

// Custom storage wrapper for Expo SecureStore
const secureStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await SecureStore.getItemAsync(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
};

interface AppState {
  hasOnboarded: boolean;
  onboardingStatus: 'not_started' | 'started' | 'completed';
  userIntent: 'travel' | 'work' | null;
  hasAskedNotificationPermission: boolean;
  isSurvivalPackDownloaded: boolean;
  /** Local gamification until dedicated backend streak API — shown on Home, synced from onboarding rewards. */
  displayStreak: number;
  displayXp: number;
  setHasOnboarded: (value: boolean) => void;
  setOnboardingStatus: (status: AppState['onboardingStatus']) => void;
  setUserIntent: (intent: AppState['userIntent']) => void;
  setHasAskedNotificationPermission: (value: boolean) => void;
  setSurvivalPackDownloaded: (value: boolean) => void;
  setDisplayStreak: (value: number) => void;
  addDisplayXp: (delta: number) => void;
  /** Reset local gamification / prefs after account deletion (keeps hasOnboarded). */
  resetLocalProgressForAccountDeletion: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      onboardingStatus: 'not_started',
      userIntent: null,
      hasAskedNotificationPermission: false,
      isSurvivalPackDownloaded: false,
      displayStreak: 0,
      displayXp: 0,
      setHasOnboarded: (value) => set({ hasOnboarded: value, onboardingStatus: value ? 'completed' : 'not_started' }),
      setOnboardingStatus: (status) => set({ onboardingStatus: status }),
      setUserIntent: (intent) => set({ userIntent: intent }),
      setHasAskedNotificationPermission: (value) => set({ hasAskedNotificationPermission: value }),
      setSurvivalPackDownloaded: (value) => set({ isSurvivalPackDownloaded: value }),
      setDisplayStreak: (value) => set({ displayStreak: Math.max(0, Math.floor(value)) }),
      addDisplayXp: (delta) =>
        set((s) => ({ displayXp: Math.max(0, s.displayXp + Math.floor(delta)) })),
      resetLocalProgressForAccountDeletion: () =>
        set({
          displayStreak: 0,
          displayXp: 0,
          userIntent: null,
          hasAskedNotificationPermission: false,
          isSurvivalPackDownloaded: false,
        }),
    }),
    {
      name: 'xinchao-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);

