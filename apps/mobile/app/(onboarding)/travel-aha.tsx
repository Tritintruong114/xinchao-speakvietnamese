import { Volume2, Trophy } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Stroke } from '@/constants/Theme';
import { useAppStore } from '@/store/useAppStore';
import { useAudio } from '@/hooks/useAudio';

export default function TravelAhaScreen() {
  const router = useRouter();
  const { setHasOnboarded } = useAppStore();
  const [isPlayed, setIsPlayed] = useState(false);
  const { playSound } = useAudio();

  const handlePlay = () => {
    playSound('bot_di');
    setIsPlayed(true);
  };

  const handleQuickSignup = () => {
    setHasOnboarded(true);
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="h1" style={styles.headerTitle}>
          Try your first phrase!
        </ThemedText>

        <TouchableOpacity 
          activeOpacity={0.9} 
          style={styles.flashCard} 
          onPress={handlePlay}
        >
          <ThemedText style={styles.enPhrase}>
            Discount please!
          </ThemedText>
          <ThemedText type="h1" style={styles.viPhrase}>
            Bớt đi!
          </ThemedText>

          <View style={styles.speakerButton}>
            <Volume2 size={32} color={Colors.white} strokeWidth={2.5} />
          </View>
        </TouchableOpacity>

        {isPlayed ? (
          <View style={styles.resultCard}>
            <View style={styles.rewardIconWrapper}>
              <Trophy size={48} color={Colors.brandPrimary} strokeWidth={2.5} />
            </View>
            <ThemedText style={styles.resultText}>
              Bargaining skill UNLOCKED!{"\n"}Ready to save money?
            </ThemedText>
            <ThemedButton 
              title="FINISH ONBOARDING" 
              type="primary" 
              onPress={handleQuickSignup} 
              style={styles.resultCta} 
            />
          </View>
        ) : (
          <ThemedText style={styles.hint}>
            Tap the card to hear the phrase.
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
    paddingHorizontal: 24,
  },
  headerTitle: {
    textAlign: 'center',
    color: Colors.brandPrimary,
    marginBottom: 40,
    fontSize: 32,
    fontFamily: 'BeVietnamPro_900Black',
  },
  flashCard: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.brandSecondary,
    minHeight: 280,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
  },
  enPhrase: {
    color: Colors.black,
    fontSize: 22,
    fontFamily: 'BeVietnamPro_700Bold',
    lineHeight: 28,
    textAlign: 'center',
    opacity: 0.6,
    marginBottom: 8,
  },
  viPhrase: {
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: 'BeVietnamPro_900Black',
    fontSize: 56,
  },
  speakerButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  hint: {
    marginTop: 24,
    textAlign: 'center',
    color: Colors.black,
    fontFamily: 'BeVietnamPro_700Bold',
    opacity: 0.5,
  },
  resultCard: {
    marginTop: 32,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.white,
    padding: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    alignItems: 'center',
  },
  rewardIconWrapper: {
    marginBottom: 16,
  },
  resultText: {
    textAlign: 'center',
    color: Colors.black,
    marginBottom: 24,
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 16,
    lineHeight: 22,
  },
  resultCta: {
    width: '100%',
  },
});
