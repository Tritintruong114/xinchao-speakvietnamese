import { OnboardingProgress } from '@/components/OnboardingProgress';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { Icons } from '@/constants/Icons';
import { Colors } from '@/constants/Theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, View } from 'react-native';

export default function OnboardingSplashScreen() {
  const router = useRouter();

  const goToSegmentation = () => {
    router.replace('/(onboarding)/intent');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Image source={Icons.logo} style={styles.logo} resizeMode="contain" />
          </View>

          <View style={styles.headingBlock}>
            <ThemedText type="h1" color={Colors.brandPrimary} style={styles.title}>
              XIN CHÀO!
            </ThemedText>

            <ThemedText type="body" style={styles.subtitle}>
              Survival Vietnamese in your pocket.
            </ThemedText>
          </View>
        </View>

        <View style={styles.ctaSection}>
          <ThemedButton title="GET STARTED" type="primary" onPress={goToSegmentation} style={styles.button} />
        </View>

        <View style={styles.progressWrapper}>
          <OnboardingProgress currentStep={1} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  progressWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingTop: 16,
  },
  heroSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 28,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
  },
  logo: {
    width: 180,
    height: 180,
    borderRadius: 20,
  },
  headingBlock: {
    alignItems: 'center',
    marginTop: 8,
  },
  title: {
    textAlign: 'center',
    fontSize: 48,
    lineHeight: 54,
  },
  subtitle: {
    textAlign: 'center',
    color: Colors.textMain,
    marginTop: 8,
  },
  ctaSection: {
    width: '100%',
    paddingBottom: 24,
  },
  button: {
    width: '100%',
    minHeight: 58,
  },
});
