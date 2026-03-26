import React, { useEffect } from 'react';
import { Image, SafeAreaView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Theme';

export default function TravelReadyScreen() {
  const router = useRouter();

  const goToDashboard = () => {
    router.replace('/(onboarding)/travel-dashboard');
  };

  useEffect(() => {
    const timeoutId = setTimeout(goToDashboard, 1500);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('@/assets/screens/onboarding/traveling.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.progressTrack}>
          <View style={styles.progressFilled} />
        </View>

        <ThemedText type="h2" style={styles.message}>
          Offline Survival Vietnamese pack is ready!
        </ThemedText>

        <ThemedButton title="START" type="primary" onPress={goToDashboard} style={styles.button} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  progressTrack: {
    width: '100%',
    maxWidth: 340,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  progressFilled: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.brandSecondary,
  },
  message: {
    marginTop: 14,
    textAlign: 'center',
    color: Colors.black,
    fontSize: 18,
    lineHeight: 24,
  },
  button: {
    marginTop: 24,
    width: '100%',
  },
});

