import { OnboardingLayout } from '@/components/OnboardingLayout';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { VoicePractice } from '@/components/survival/VoicePractice';
import { Colors, Stroke, Shadow, BorderRadius } from '@/constants/Theme';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useAppStore } from '@/store/useAppStore';
import { useToastStore } from '@/store/useToastStore';

const AHA_XP_REWARD = 50;

export default function AhaScreen() {
  const router = useRouter();
  const { signInAnonymously } = useAuth();
  const { showToast } = useToastStore();
  const addDisplayXp = useAppStore((s) => s.addDisplayXp);
  const [hasClaimedReward, setHasClaimedReward] = useState(false);
  const [isUpdatingXp, setIsUpdatingXp] = useState(false);

  const handleNext = () => {
    router.push('/(onboarding)/permissions');
  };

  const handleVoiceSuccess = async () => {
    if (hasClaimedReward) return;
    setIsUpdatingXp(true);
    try {
      if (!auth.currentUser) {
        await signInAnonymously();
      }
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('xp')
        .eq('id', uid)
        .single();

      const currentXp = profile?.xp || 0;

      await supabase
        .from('profiles')
        .update({ xp: currentXp + AHA_XP_REWARD })
        .eq('id', uid);

      setHasClaimedReward(true);
      addDisplayXp(AHA_XP_REWARD);
      showToast(`Ting ting! +${AHA_XP_REWARD} XP — bạn đã mở khóa phần thưởng đầu tiên!`, 'success', 4);
    } catch (error) {
      console.error('Error updating XP:', error);
    } finally {
      setIsUpdatingXp(false);
    }
  };

  const renderFooter = () => (
    <View style={styles.footerInner}>
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
      title="Say Your First Words"
      footer={renderFooter()}
    >
      <View style={styles.container}>
        <VoicePractice 
          phrase="Cái này bao nhiêu tiền?"
          translation="How much is this?"
          audioUri={require('@/assets/audio/bargaining/baonhieutien.mp3')}
          onSuccess={handleVoiceSuccess}
          successFeedback={`Perfect! +${AHA_XP_REWARD} XP`}
        />

        {hasClaimedReward && (
          <Animated.View 
            entering={FadeIn.delay(300)} 
            exiting={FadeOut}
            style={styles.rewardBadge}
          >
            <ThemedText style={styles.rewardText}>+{AHA_XP_REWARD} XP EARNED</ThemedText>
          </Animated.View>
        )}
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  rewardBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.brandPrimary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: Stroke.width,
    borderColor: Colors.black,
    transform: [{ rotate: '12deg' }],
    shadowColor: Colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    zIndex: 100,
  },
  rewardText: {
    color: Colors.white,
    fontFamily: 'BeVietnamPro_900Black',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  footerInner: {
    width: '100%',
    paddingBottom: 24,
  },
});
