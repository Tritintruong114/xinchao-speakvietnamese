import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { 
  useFonts,
  BeVietnamPro_400Regular,
  BeVietnamPro_700Bold,
  BeVietnamPro_800ExtraBold 
} from '@expo-google-fonts/be-vietnam-pro';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider, useAuth } from '@/context/AuthContext';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

import { useAppStore } from '@/store/useAppStore';

function RootLayoutNav({ loaded }: { loaded: boolean }) {
  const colorScheme = useColorScheme();
  const { user, loading: authLoading } = useAuth();
  const { hasOnboarded } = useAppStore();
  const segments = useSegments();
  const router = useRouter();

  // Hide splash screen when both fonts AND auth state are ready
  useEffect(() => {
    if (loaded && !authLoading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, authLoading]);

  useEffect(() => {
    if (authLoading || !loaded) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';

    if (!hasOnboarded) {
      if (!inOnboardingGroup) {
        router.replace('/(onboarding)');
      }
    } else if (!user) {
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
    } else if (user) {
      if (inAuthGroup || inOnboardingGroup) {
        router.replace('/(tabs)');
      }
    }
  }, [user, authLoading, hasOnboarded, segments, loaded]);

  // Don't render the stack until we know the auth status
  if (authLoading || !loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    BeVietnamPro_400Regular,
    BeVietnamPro_700Bold,
    BeVietnamPro_800ExtraBold,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  return (
    <AuthProvider>
      <RootLayoutNav loaded={fontsLoaded} />
    </AuthProvider>
  );
}


