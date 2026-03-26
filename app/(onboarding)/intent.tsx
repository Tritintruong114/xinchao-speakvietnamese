import { OnboardingProgress } from '@/components/OnboardingProgress';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Theme';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';

export default function IntentScreen() {
  const router = useRouter();
  const { setUserIntent, setOnboardingStatus } = useAppStore();

  const handleSelect = (intent: 'travel' | 'work') => {
    setUserIntent(intent);
    setOnboardingStatus('started');
    if (intent === 'travel') {
      router.push('/(onboarding)/offline');
      return;
    }
    router.push('/(onboarding)/push');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.body}>
          <ThemedText type="h2" style={styles.title}>
            What brings you to Vietnam?
          </ThemedText>

          <Pressable style={styles.card} onPress={() => handleSelect('travel')}>
            <Image
              source={require('@/assets/screens/onboarding/traveling.png')}
              style={styles.cardImage}
              resizeMode="contain"
            />
            <View style={styles.cardTextBlock}>
              <ThemedText type="h2" style={styles.cardTitle}>
                Short-Term Travel
              </ThemedText>
              <ThemedText type="body" style={styles.cardSubtitle}>
                Learn fast for food, bargaining, and rides.
              </ThemedText>
            </View>
          </Pressable>

          <Pressable style={styles.card} onPress={() => handleSelect('work')}>
            <Image
              source={require('@/assets/screens/onboarding/expats.png')}
              style={styles.cardImage}
              resizeMode="contain"
            />
            <View style={styles.cardTextBlock}>
              <ThemedText type="h2" style={styles.cardTitle}>
                Relocation / Work
              </ThemedText>
              <ThemedText type="body" style={styles.cardSubtitle}>
                A deeper communication journey.
              </ThemedText>
            </View>
          </Pressable>
        </View>

        <View style={styles.progressWrapper}>
          <OnboardingProgress currentStep={2} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brandSecondary,
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
  body: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
    width: '100%',
  },
  title: {
    textAlign: 'center',
    color: Colors.black,
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  cardImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  cardTextBlock: {
    flex: 1,
    paddingLeft: 12,
  },
  cardTitle: {
    color: Colors.black,
    marginBottom: 2,
    fontSize: 18,
    lineHeight: 22,
  },
  cardSubtitle: {
    color: Colors.textMain,
    fontSize: 13,
    lineHeight: 17,
  },
});

