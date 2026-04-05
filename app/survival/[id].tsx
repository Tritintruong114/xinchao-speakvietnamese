import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { FlashcardItem } from '../../components/FlashcardItem';
import { ThemedButton } from '../../components/ThemedButton';
import { ThemedText } from '../../components/ThemedText';
import { ComicRoleplay } from '../../components/survival/ComicRoleplay';
import { SurvivalBottomAction } from '../../components/survival/SurvivalBottomAction';
import { SurvivalHeader } from '../../components/survival/SurvivalHeader';
import { SurvivalQuiz } from '../../components/survival/SurvivalQuiz';
import { SurvivalSuccess } from '../../components/survival/SurvivalSuccess';
import { SurvivalTeaching } from '../../components/survival/SurvivalTeaching';
import { VoicePractice } from '../../components/survival/VoicePractice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAudio } from '../../hooks/useAudio';
import { SURVIVAL_MODULES } from '../../constants/SurvivalData';
import { BorderRadius, Colors, Shadow, Stroke } from '../../constants/Theme';

const { width } = Dimensions.get('window');

export default function SurvivalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const module = SURVIVAL_MODULES[id as string];
  const { playSound } = useAudio();
  const [stepIndex, setStepIndex] = useState(0);

  if (!module) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText>Module not found</ThemedText>
        <ThemedButton title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const currentStep = module.steps[stepIndex];

  const handleNext = () => {
    if (stepIndex < module.steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      router.replace('/(tabs)');
    }
  };

  const renderStepContent = () => {
    switch (currentStep.type) {
      case 'onboarding':
        return (
          <View style={[styles.onboardingContent, { padding: 24 }]}>
            <ThemedText type="h1" style={styles.stepTitle}>{currentStep.title}</ThemedText>
            <View style={styles.goalCard}>
              <ThemedText style={styles.goalLabel}>YOUR MISSION:</ThemedText>
              <ThemedText style={styles.goalText}>{currentStep.goal}</ThemedText>
            </View>
          </View>
        );
      case 'micro-learning':
        return (
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollContent, { padding: 24, paddingBottom: 100, justifyContent: 'center' }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.vocabGrid}>
              {currentStep.vocabulary?.map((v, i) => (
                <FlashcardItem
                  key={i}
                  vietnamese={v.phrase}
                  english={v.translation}
                  primaryColor={Colors.brandPrimary}
                  tag={v.tag}
                  audioUri={v.audioUri}
                  onPlay={() => v.audioUri && playSound(v.audioUri)}
                />
              ))}
            </View>
          </ScrollView>
        );
      case 'voice_practice':
        return (
          <VoicePractice
            phrase={currentStep.targetPhrase || ''}
            translation={currentStep.targetTranslation}
            audioUri={currentStep.audioUri}
            onSuccess={handleNext}
            successFeedback={currentStep.successFeedback}
          />
        );
      case 'roleplay':
        return (
          <ComicRoleplay
            dialogues={currentStep.dialogues || []}
            onComplete={handleNext}
          />
        );
      case 'reward':
        return (
          <SurvivalSuccess
            moduleTitle={module.title}
            badge={currentStep.reward?.badge || 'SURVIVALIST'}
            xp={currentStep.reward?.xp || 0}
            onHome={() => router.replace('/(tabs)')}
          />
        );
      case 'quiz':
        return (
          <SurvivalQuiz
            question={currentStep.question || ''}
            image={currentStep.image}
            images={currentStep.images}
            options={currentStep.options || []}
            correctIndex={currentStep.correctIndex || 0}
            fact={currentStep.fact}
            onSuccess={handleNext}
          />
        );
      case 'teaching':
        return (
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: 100, justifyContent: 'center' }]}
            showsVerticalScrollIndicator={false}
          >
            <SurvivalTeaching
              title={currentStep.title}
              content={currentStep.content || ''}
              visualHighlight={currentStep.visualHighlight}
            />
          </ScrollView>
        );
      default:
        return <ThemedText>Unknown Step Type</ThemedText>;
    }
  };

  if (currentStep.type === 'reward') {
    return (
      <SafeAreaView style={styles.successContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <SurvivalSuccess
          moduleTitle={module.title}
          badge={currentStep.reward?.badge || 'SURVIVALIST'}
          xp={currentStep.reward?.xp || 0}
          onHome={() => router.replace('/(tabs)')}
        />
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <SurvivalHeader
        currentStep={stepIndex}
        totalSteps={module.steps.length}
        onClose={() => router.back()}
      />

      <View style={styles.content}>
        {renderStepContent()}
      </View>

      <SurvivalBottomAction
        title={
          currentStep.type === 'onboarding' ? 'START THE MISSION' : 'GEAR UP & CONTINUE'
        }
        onPress={handleNext}
        visible={['onboarding', 'micro-learning', 'teaching'].includes(currentStep.type)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  successContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  closeBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressWrapper: {
    flex: 1,
    paddingRight: 16,
  },
  content: {
    flex: 1,
  },
  stepTitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  // Onboarding
  onboardingContent: {
    flex: 1,
    justifyContent: 'center',
  },
  goalCard: {
    backgroundColor: Colors.brandSecondary,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    borderRadius: BorderRadius.card,
    padding: 24,
    marginBottom: 40,
    shadowColor: Shadow.color,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  goalLabel: {
    fontSize: 12,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: Colors.black,
    marginBottom: 8,
    opacity: 0.6,
  },
  goalText: {
    fontSize: 20,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    lineHeight: 28,
  },
  // Learning
  learningContent: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  mascotBubble: {
    alignSelf: 'center',
    backgroundColor: Colors.brandSecondary,
    padding: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.black,
    marginBottom: 16,
    transform: [{ rotate: '-5deg' }],
  },
  mascotFace: {
    fontSize: 24,
    fontFamily: 'BeVietnamPro_800ExtraBold',
  },
  vocabGrid: {
    gap: 16,
  },
  continueLink: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  continueText: {
    fontSize: 16,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    textDecorationLine: 'underline',
  },
  // Reward
  rewardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.brandSecondary,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: Shadow.color,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
  },
  winIcon: {
    fontSize: 60,
  },
  rewardTitle: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 8,
    color: Colors.black,
  },
  rewardSub: {
    fontSize: 18,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: Colors.brandPrimary,
    marginBottom: 32,
    textTransform: 'uppercase',
  },
  xpBadge: {
    backgroundColor: Colors.brandPrimary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    marginBottom: 48,
    transform: [{ rotate: '-2deg' }],
  },
  xpText: {
    color: Colors.white,
    fontSize: 24,
    fontFamily: 'BeVietnamPro_800ExtraBold',
  },
  actionBtn: {
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  scrollView: {
    flex: 1,
  },
});
