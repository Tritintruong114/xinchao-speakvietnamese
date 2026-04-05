import { OnboardingLayout } from '../../components/OnboardingLayout';
import { ThemedText } from '../../components/ThemedText';
import { Colors, Stroke } from '../../constants/Theme';
import { useAppStore } from '../../store/useAppStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Plane, Briefcase } from 'lucide-react-native';

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
    router.push('/(onboarding)/permissions');
  };

  return (
    <OnboardingLayout
      title="What's your main goal?"
      description="Bạn muốn học tiếng Việt để làm gì?"
    >
      <View style={styles.cardContainer}>
        <Pressable style={styles.card} onPress={() => handleSelect('travel')}>
          <View style={[styles.iconBox, { backgroundColor: Colors.brandPink }]}>
            <Plane size={40} color={Colors.black} strokeWidth={2.5} />
          </View>
          <View style={styles.cardTextBlock}>
            <ThemedText type="h2" style={styles.cardTitle}>
              SURVIVAL TRAVEL
            </ThemedText>
            <ThemedText style={styles.cardSubtitle}>
              Survival for food, bargaining, and taxis.
            </ThemedText>
          </View>
        </Pressable>

        <Pressable style={styles.card} onPress={() => handleSelect('work')}>
          <View style={[styles.iconBox, { backgroundColor: Colors.brandCyan }]}>
            <Briefcase size={40} color={Colors.black} strokeWidth={2.5} />
          </View>
          <View style={styles.cardTextBlock}>
            <ThemedText type="h2" style={styles.cardTitle}>
              LIVE & WORK IN VN
            </ThemedText>
            <ThemedText style={styles.cardSubtitle}>
              For expats and professionals.
            </ThemedText>
          </View>
        </Pressable>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    gap: 24,
    paddingTop: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.brandSecondary,
    borderWidth: Stroke.width,
    borderColor: Colors.black,
    borderRadius: 20,
    padding: 20,
    // Hard Shadow
    shadowColor: Colors.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextBlock: {
    flex: 1,
    paddingLeft: 16,
  },
  cardTitle: {
    color: Colors.black,
    fontSize: 22,
    fontFamily: 'BeVietnamPro_900Black',
    lineHeight: 26,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    fontFamily: 'BeVietnamPro_700Bold',
    color: Colors.black,
    opacity: 0.6,
  },
});
