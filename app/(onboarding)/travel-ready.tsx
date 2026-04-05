import React, { useEffect } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles } from 'lucide-react-native';

import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Stroke } from '@/constants/Theme';

export default function TravelReadyScreen() {
  const router = useRouter();

  const goToDashboard = () => {
    router.replace('/(onboarding)/travel-dashboard');
  };

  useEffect(() => {
    const timeoutId = setTimeout(goToDashboard, 2000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageBox}>
          <Sparkles size={80} color={Colors.brandPrimary} strokeWidth={2.5} />
        </View>

        <View style={styles.progressTrack}>
          <View style={styles.progressFilled} />
        </View>

        <ThemedText type="h1" style={styles.message}>
          Survival Pack Ready!
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
  imageBox: {
    width: 140,
    height: 140,
    backgroundColor: Colors.brandSecondary,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    marginBottom: 48,
  },
  progressTrack: {
    width: '100%',
    maxWidth: 300,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.white,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  progressFilled: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.brandPrimary,
  },
  message: {
    marginTop: 32,
    textAlign: 'center',
    color: Colors.brandPrimary,
    fontSize: 36,
    fontFamily: 'BeVietnamPro_900Black',
    lineHeight: 44,
  },
  button: {
    marginTop: 48,
    width: '100%',
  },
});
