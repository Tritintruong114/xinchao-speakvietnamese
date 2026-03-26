import { Volume2, Trophy } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Theme';
import { useAppStore } from '@/store/useAppStore';

export default function TravelAhaScreen() {
  const router = useRouter();
  const { setHasOnboarded } = useAppStore();
  const [isPlayed, setIsPlayed] = useState(false);

  const handlePlay = () => {
    setIsPlayed(true);
  };

  const handleQuickSignup = () => {
    setHasOnboarded(true);
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Pressable style={styles.flashCard} onPress={handlePlay}>
          <ThemedText type="h1" style={styles.viPhrase}>
            Bớt đi!
          </ThemedText>
          <ThemedText type="body" style={styles.enPhrase}>
            Discount please!
          </ThemedText>

          <Pressable onPress={handlePlay} style={styles.speakerButton}>
            <Volume2 size={24} color="#FFFFFF" strokeWidth={2.5} />
          </Pressable>
        </Pressable>

        {isPlayed ? (
          <View style={styles.resultCard}>
            <View style={styles.rewardIconWrapper}>
              <Trophy size={32} color="#1A1A1A" strokeWidth={2.5} />
            </View>
            <ThemedText type="body" style={styles.resultText}>
              Save this win to your account?
            </ThemedText>
            <ThemedButton title="QUICK SIGN UP" type="primary" onPress={handleQuickSignup} style={styles.resultCta} />
          </View>
        ) : (
          <ThemedText type="body" style={styles.hint}>
            Tap the card or speaker to hear the phrase.
          </ThemedText>
        )}
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
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  flashCard: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.brandSecondary,
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  viPhrase: {
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 8,
  },
  enPhrase: {
    color: Colors.black,
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
  },
  speakerButton: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakerIcon: {
    fontSize: 24,
  },
  hint: {
    marginTop: 16,
    textAlign: 'center',
    color: Colors.textMuted,
  },
  resultCard: {
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.white,
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  rewardIconWrapper: {
    alignItems: 'center',
    marginBottom: 8,
  },
  resultText: {
    textAlign: 'center',
    color: Colors.black,
    marginBottom: 10,
  },
  resultCta: {
    width: '100%',
  },
});

