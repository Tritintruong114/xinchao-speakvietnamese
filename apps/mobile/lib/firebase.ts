import { initializeApp } from "firebase/app";
// @ts-expect-error - getReactNativePersistence is often missing in monorepo types for firebase/auth
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
// @ts-ignore - Some firebase versions have issues with RN persistence types in monorepos
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

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
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export default app;


