import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Mic, Volume2 } from 'lucide-react-native';
import { Colors, Stroke, Shadow, BorderRadius } from '../../constants/Theme';
import { ThemedText } from '../ThemedText';
import { useAudio } from '../../hooks/useAudio';

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
  }, [delay]);

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

interface VoicePracticeProps {
  phrase: string;
  translation?: string;
  audioUri?: string;
  onSuccess: () => void;
  successFeedback?: string;
}

export const VoicePractice = ({ phrase, translation, audioUri, onSuccess, successFeedback = 'Perfect!' }: VoicePracticeProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [showEffects, setShowEffects] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { playSound } = useAudio();

  const handlePressIn = () => {
    setIsRecording(true);
  };

  const handlePressOut = () => {
    setIsRecording(false);
    // Simulate AI success after 1 second
    setTimeout(() => {
      setIsSuccess(true);
      setShowEffects(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.phraseContainer}>
        <View style={styles.phraseHeader}>
          <ThemedText type="h1" style={styles.phraseText}>{phrase}</ThemedText>
          {audioUri && (
            <TouchableOpacity 
              activeOpacity={0.7}
              style={styles.speakerBtn}
              onPress={() => playSound(audioUri)}
            >
              <Volume2 size={24} color={Colors.black} strokeWidth={2.5} />
            </TouchableOpacity>
          )}
        </View>
        {translation && (
          <ThemedText style={styles.translationText}>"{translation}"</ThemedText>
        )}
        {isSuccess && (
          <ThemedText style={styles.feedbackText}>{successFeedback}</ThemedText>
        )}
      </View>

      <View style={styles.micWrapper}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[
            styles.micButton,
            isRecording && styles.micButtonActive
          ]}
        >
          <Mic size={48} color={Colors.white} strokeWidth={2.5} />
          
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
        <ThemedText style={styles.hintText}>
          {isRecording ? 'Listening...' : 'Hold to speak'}
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 60,
    width: '100%',
  },
  dialectSwitcher: {
    alignSelf: 'center',
  },
  phraseContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  phraseHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  phraseText: {
    fontSize: 32,
    lineHeight: 42,
    textAlign: 'center',
    color: Colors.brandPrimary,
    paddingHorizontal: 40, // Space for the absolute speaker button
  },
  speakerBtn: {
    position: 'absolute',
    right: 0,
    backgroundColor: Colors.brandSecondary,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: 8,
    padding: 8,
    // Consistent hard shadow
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  translationText: {
    fontSize: 20,
    fontFamily: 'BeVietnamPro_600SemiBold',
    color: Colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: -8,
    marginBottom: 24,
  },
  feedbackText: {
    fontSize: 24,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: '#10B981', // Emerald 500
    textAlign: 'center',
  },
  micWrapper: {
    alignItems: 'center',
    marginBottom: 40,
  },
  micButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.brandPink,
    borderWidth: Stroke.width * 1.5,
    borderColor: Stroke.color,
    justifyContent: 'center',
    alignItems: 'center',
    // Hard Shadow
    shadowColor: Shadow.color,
    shadowOffset: { width: Shadow.offset * 2, height: Shadow.offset * 2 },
    shadowOpacity: Shadow.opacity,
    shadowRadius: 0,
    elevation: 10,
  },
  micButtonActive: {
    transform: [{ scale: 0.95 }, { translateX: 2 }, { translateY: 2 }],
    shadowOffset: { width: Shadow.offset, height: Shadow.offset },
  },
  hintText: {
    marginTop: 24,
    fontSize: 16,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  effectsContainer: {
    position: 'absolute',
    top: 60,
    left: 60,
    width: 0,
    height: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: Stroke.color,
  },
});
