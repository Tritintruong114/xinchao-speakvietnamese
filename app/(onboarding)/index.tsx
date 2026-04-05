import { ThemedButton } from '../../components/ThemedButton';
import { ThemedText } from '../../components/ThemedText';
import { Colors, Spacing, Stroke, Shadow, BorderRadius } from '../../constants/Theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OnboardingSplashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const goToSegmentation = () => {
    router.replace('/(onboarding)/intent');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <View style={styles.heroSection}>
          <View style={styles.logoBox}>
            <Image 
              source={require('../../assets/images/welcome_hero.png')} 
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headingBlock}>
            <ThemedText type="h1" style={styles.title}>
              XIN CHÀO!
            </ThemedText>

            <ThemedText style={styles.subtitle}>
              Survival Vietnamese in your pocket.
            </ThemedText>
          </View>
        </View>

        <View style={styles.ctaSection}>
          <ThemedButton 
            title="START THE JOURNEY" 
            type="primary" 
            onPress={goToSegmentation} 
            style={styles.button} 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 64,
  },
  heroSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    width: 160,
    height: 160,
    backgroundColor: Colors.brandSecondary,
    borderWidth: Stroke.width,
    borderColor: Colors.black,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // Hard Shadow
    shadowColor: Colors.black,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    marginBottom: 40,
    overflow: 'hidden', // Ensure image doesn't bleed out of rounded box
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  headingBlock: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 56,
    fontFamily: 'BeVietnamPro_900Black',
    color: Colors.brandPrimary,
    lineHeight: 64,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'BeVietnamPro_700Bold',
    color: Colors.black,
    marginTop: 8,
    lineHeight: 24,
    opacity: 0.6,
  },
  ctaSection: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
});
