import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Stroke } from '@/constants/Theme';
import { Sparkles } from 'lucide-react-native';
import { OnboardingLayout } from '@/components/OnboardingLayout';
import { useAppStore } from '@/store/useAppStore';

export default function SuccessScreen() {
  const router = useRouter();
  const { setHasOnboarded } = useAppStore();
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    // Celebration animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 20,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Auto-navigation
    const timer = setTimeout(() => {
      setHasOnboarded(true);
      router.replace('/(auth)/login');
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <OnboardingLayout showProgress={false}>
      <View style={styles.container}>
        <Animated.View style={[styles.iconWrapper, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.iconCircle}>
            <Sparkles size={80} color={Colors.black} strokeWidth={2.5} />
          </View>
        </Animated.View>

        <ThemedText type="h1" style={styles.title}>
          You are ready!
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Enjoy your ride.
        </ThemedText>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingBottom: 60,
  },
  iconWrapper: {
    marginBottom: 40,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.brandSecondary,
    borderWidth: Stroke.width,
    borderColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    // Hard Shadow
    shadowColor: Colors.black,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
  },
  title: {
    fontSize: 36,
    color: Colors.brandPrimary,
    textAlign: 'center',
    fontFamily: 'BeVietnamPro_900Black',
    lineHeight: 42,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 24,
    color: Colors.black,
    textAlign: 'center',
    fontFamily: 'BeVietnamPro_700Bold',
    opacity: 0.8,
  },
});
