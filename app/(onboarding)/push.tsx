import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingProgress } from '@/components/OnboardingProgress';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { Colors } from '@/constants/Theme';
import { useAppStore } from '@/store/useAppStore';
import { requestPushPermission } from '@/lib/notifications';

export default function PushPermissionScreen() {
  const router = useRouter();
  const { userIntent, setHasOnboarded, setHasAskedNotificationPermission } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  const completeOnboarding = () => {
    setHasOnboarded(true);
    router.replace('/(auth)/login');
  };

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    try {
      await requestPushPermission();
      setHasAskedNotificationPermission(true);
      completeOnboarding();
    } catch (error) {
      console.error('Notification permission request failed', error);
      completeOnboarding();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    setHasAskedNotificationPermission(true);
    completeOnboarding();
  };

  const title =
    userIntent === 'work' ? 'Speak with confidence at work.' : 'Pay local prices at the market.';
  const description =
    userIntent === 'work'
      ? 'Get short phrase nudges before your day starts. Most users finish each tip in under 10 seconds.'
      : 'Get 3 quick bargaining phrases when you are near local markets. Most users review a tip in under 10 seconds.';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.progressWrapper}>
          <OnboardingProgress currentStep={3} />
        </View>

        <View style={styles.body}>
          <View style={styles.illustration}>
            <Image
              source={require('@/assets/screens/onboarding/push_notification.png')}
              style={styles.illustrationImage}
              resizeMode="contain"
            />
          </View>

          <ThemedText type="h1" color={Colors.brandPrimary} style={styles.title}>
            {title}
          </ThemedText>
          <ThemedText type="body" style={styles.description}>
            {description}
          </ThemedText>

          <View style={styles.actions}>
            {isLoading ? (
              <ActivityIndicator size="large" color={Colors.brandPrimary} />
            ) : (
              <>
                <ThemedButton title="ENABLE NOTIFICATIONS" type="primary" onPress={handleEnableNotifications} />
                <ThemedButton title="MAYBE LATER" type="ghost" onPress={handleSkip} style={styles.secondaryCta} />
              </>
            )}
          </View>
        </View>
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
    padding: 24,
  },
  progressWrapper: {
    alignItems: 'center',
    marginTop: 6,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 8,
  },
  illustration: {
    alignItems: 'center',
    marginBottom: 24,
  },
  illustrationImage: {
    width: '100%',
    maxWidth: 320,
    height: 220,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    textAlign: 'center',
    color: Colors.textMain,
    marginBottom: 32,
  },
  actions: {
    width: '100%',
  },
  secondaryCta: {
    marginTop: 12,
    borderWidth: 0,
  },
});

