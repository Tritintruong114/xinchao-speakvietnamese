import React, { useState } from 'react';
import { StyleSheet, View, Image, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ThemedText } from '../components/ThemedText';
import { ThemedButton } from '../components/ThemedButton';
import { Colors, Spacing, Shadow, Stroke, BorderRadius } from '../constants/Theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useToastStore } from '@/store/useToastStore';

export default function LandingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signInAnonymously } = useAuth();
  const { showToast } = useToastStore();
  const [busy, setBusy] = useState(false);

  const handleGetStarted = async () => {
    setBusy(true);
    try {
      await signInAnonymously();
    } catch {
      showToast(
        'Chưa kết nối được. Bạn vẫn có thể tiếp tục — thử lại sau trên màn hình tiếp theo nhé.',
        'warning',
        5,
      );
    } finally {
      setBusy(false);
    }
    router.push('/(onboarding)');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.content}>
        {/* Hero Illustration - Standardized Neo-Brutalism Logo */}
        <View style={styles.heroContainer}>
          <View style={styles.logoWrapper}>
            <Image 
              source={require('../assets/icons/logo_rectangle.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.infoBlock}>
          <ThemedText style={styles.subtitle}>Speak Vietnamese. Survive. Connect.</ThemedText>
        </View>

        {/* Action Buttons - Standardized CTAs */}
        <View style={styles.buttonContainer}>
          {busy ? (
            <View style={[styles.mainButton, styles.loadingWrap]}>
              <ActivityIndicator size="large" color={Colors.brandPrimary} />
            </View>
          ) : (
            <ThemedButton
              title="GET STARTED"
              onPress={() => void handleGetStarted()}
              type="primary"
              style={styles.mainButton}
            />
          )}
          
          <ThemedButton 
            title="I HAVE AN ACCOUNT" 
            onPress={() => router.push('/(auth)/login')}
            type="ghost"
          />
        </View>
      </View>

      {/* Footer Decoration */}
      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>
          MADE WITH <ThemedText style={{ color: Colors.brandPrimary }}>♥</ThemedText> IN VIETNAM
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 72, // 8 * 9
    paddingBottom: 40, // 8 * 5
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'BeVietnamPro_700Bold',
    color: Colors.black,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },
  infoBlock: {
    marginTop: -16,
    marginBottom: 40,
    alignItems: 'center',
  },
  heroContainer: {
    marginTop: 48,
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    width: 240,
    height: 240,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: 24, // 8 * 3
    overflow: 'hidden',
    // Standard Neo-Brutalism Hard Shadow
    shadowColor: Colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    padding: 0,
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    marginTop: 'auto',
  },
  mainButton: {
    minHeight: 64,
  },
  loadingWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingBottom: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: Colors.black,
    opacity: 0.3,
    letterSpacing: 1,
  },
});
