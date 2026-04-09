import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { 
  useFonts,
  BeVietnamPro_400Regular,
  BeVietnamPro_700Bold,
  BeVietnamPro_800ExtraBold,
  BeVietnamPro_900Black
} from '@expo-google-fonts/be-vietnam-pro';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import 'react-native-reanimated';

// Handle notifications in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useAppStore } from '@/store/useAppStore';
import { GlobalToast } from '@/components/GlobalToast';
import { ensurePurchasesConfigured } from '@/lib/purchases';

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
    const authChild = segments[1] as string | undefined;
    const onLinkAccount = inAuthGroup && authChild === 'link-account';

    if (!hasOnboarded) {
      if (!inOnboardingGroup) {
        router.replace('/(onboarding)');
      }
    } else if (!user) {
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
    } else if (user) {
      if (inOnboardingGroup) {
        router.replace('/(tabs)');
      } else if (inAuthGroup && !onLinkAccount) {
        router.replace('/(tabs)');
      }
    }
  }, [user, authLoading, hasOnboarded, segments, loaded]);

  useEffect(() => {
    if (authLoading || !loaded) return;
    void ensurePurchasesConfigured(user?.uid ?? null);
  }, [authLoading, loaded, user?.uid]);

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
      <GlobalToast />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    BeVietnamPro_400Regular,
    BeVietnamPro_700Bold,
    BeVietnamPro_800ExtraBold,
    BeVietnamPro_900Black,
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
