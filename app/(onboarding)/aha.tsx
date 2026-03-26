import { OnboardingLayout } from '@/components/OnboardingLayout';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedIcon } from '@/components/ThemedIcon';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Theme';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Volume2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

// Simple Particle Component represented by a small square
const Particle = ({ delay, color }: { delay: number; color: string }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 100;

    translateX.value = withDelay(delay, withTiming(Math.cos(angle) * distance, { duration: 1000 }));
    translateY.value = withDelay(delay, withTiming(Math.sin(angle) * distance, { duration: 1000 }));
    opacity.value = withDelay(delay, withSequence(withTiming(1, { duration: 200 }), withTiming(0, { duration: 800 })));
    scale.value = withDelay(delay, withSequence(withTiming(1, { duration: 200 }), withTiming(0, { duration: 800 })));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value }
    ],
    backgroundColor: color,
  }));

  return <Animated.View style={[styles.particle, animatedStyle]} />;
};

export default function AhaScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [showEffects, setShowEffects] = useState(false);
  const [hasClaimedReward, setHasClaimedReward] = useState(false);
  const [isUpdatingXp, setIsUpdatingXp] = useState(false);

  const handleNext = () => {
    router.push('/(onboarding)/permissions');
  };

  const handlePlayAudio = async () => {
    if (isUpdatingXp) return;

    // Trigger visual effects
    setShowEffects(true);
    setTimeout(() => setShowEffects(false), 2000);

    // Update XP if not already claimed
    if (!hasClaimedReward && user) {
      setIsUpdatingXp(true);
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('xp')
          .eq('id', user.uid)
          .single();

        const currentXp = profile?.xp || 0;

        await supabase
          .from('profiles')
          .update({ xp: currentXp + 10 })
          .eq('id', user.uid);

        setHasClaimedReward(true);
      } catch (error) {
        console.error('Error updating XP:', error);
      } finally {
        setIsUpdatingXp(false);
      }
    }
  };

  const renderFooter = () => (
    <View style={styles.footerInner}>
      <ThemedText type="body" style={styles.description}>
        Listen to the correct pronunciation and earn your first reward!
      </ThemedText>
      <ThemedButton
        title="CONTINUE"
        type="primary"
        onPress={handleNext}
        disabled={isUpdatingXp}
      />
    </View>
  );

  return (
    <OnboardingLayout
      title="Try tapping the speaker:"
      footer={renderFooter()}
    >
      <View style={styles.cardContainer}>
        <View style={styles.flashcard}>
          <ThemedText type="h1" style={styles.vietnameseText}>
            Bao nhiêu tiền?
          </ThemedText>
          <ThemedText type="body" style={styles.englishText}>
            How much is it?
          </ThemedText>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.audioIcon}
            onPress={handlePlayAudio}
            disabled={isUpdatingXp}
          >
            <View style={styles.speakerWrapper}>
              <ThemedIcon icon={Volume2} size={48} strokeWidth={2.5} />
            </View>

            {showEffects && (
              <View style={styles.effectsContainer}>
                {[...Array(12)].map((_, i) => (
                  <Particle
                    key={i}
                    delay={i * 20}
                    color={i % 2 === 0 ? Colors.brandPrimary : Colors.brandSecondary}
                  />
                ))}
              </View>
            )}
          </TouchableOpacity>

          {hasClaimedReward && (
            <Animated.View style={styles.rewardBadge}>
              <ThemedText style={styles.rewardText}>+10 XP</ThemedText>
            </Animated.View>
          )}
        </View>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  flashcard: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.brandSecondary,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    // Hard Shadow
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
  },
  vietnameseText: {
    fontSize: 36,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '900',
  },
  englishText: {
    fontSize: 18,
    color: '#1A1A1A',
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: 'bold',
  },
  audioIcon: {
    width: 96,
    height: 96,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    // Little shadow for the button itself
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  speakerWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  speakerEmoji: {
    fontSize: 44,
    textAlign: 'center',
    // Standardizing emoji position
    marginTop: Platform.OS === 'ios' ? 4 : 0,
    marginLeft: Platform.OS === 'ios' ? 4 : 0,
  },
  effectsContainer: {
    position: 'absolute',
    top: 48,
    left: 48,
    width: 0,
    height: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  rewardBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: Colors.brandPrimary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    transform: [{ rotate: '12deg' }],
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  rewardText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
  },
  footerInner: {
    width: '100%',
    paddingBottom: 24,
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666666',
    fontWeight: '500',
  },
});
