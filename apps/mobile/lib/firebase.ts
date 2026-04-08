import { initializeApp, getApps, getApp } from "firebase/app";
// @ts-expect-error - getReactNativePersistence is often missing in monorepo types for firebase/auth
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
// @ts-ignore - Some firebase versions have issues with RN persistence types in monorepos
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Replace these with actual config from your Firebase project
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with AsyncStorage persistence only in native environments
export const auth = (() => {
  if (Platform.OS === 'web' || typeof window === 'undefined') {
    return getAuth(app);
  }
  return initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
})();

export default app;


