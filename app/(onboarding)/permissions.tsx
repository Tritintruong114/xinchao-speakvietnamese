import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { Colors, Stroke } from '@/constants/Theme';
import { useAppStore } from '@/store/useAppStore';
import { OnboardingLayout } from '@/components/OnboardingLayout';
import { Bell, Sparkles } from 'lucide-react-native';
import { requestPushPermission, sendWelcomeNotification } from '@/lib/notifications';

export default function PermissionsScreen() {
  const router = useRouter();
  const { setHasAskedNotificationPermission } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    try {
      await requestPushPermission();
      await sendWelcomeNotification();
      setHasAskedNotificationPermission(true);
      router.push('/(onboarding)/success');
    } catch (error) {
      console.error('Notification permission request failed', error);
      router.push('/(onboarding)/success');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    setHasAskedNotificationPermission(true);
    router.push('/(onboarding)/success');
  };

  const renderFooter = () => (
    <View style={styles.footerInner}>
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.brandPrimary} />
      ) : (
        <>
          <ThemedButton 
            title="ENABLE NOTIFICATIONS" 
            type="primary" 
            onPress={handleEnableNotifications} 
          />
          <ThemedButton 
            title="MAYBE LATER" 
            type="ghost" 
            onPress={handleSkip} 
            style={styles.secondaryCta}
          />
        </>
      )}
    </View>
  );

  return (
    <OnboardingLayout
      title="Stay Street-Smart"
      description="Get quick tips when you need them most."
      footer={renderFooter()}
    >
      <View style={styles.permissionBox}>
        <View style={[styles.iconCircle, { backgroundColor: Colors.brandCyan }]}>
          <Sparkles size={32} color={Colors.black} strokeWidth={2.5} />
        </View>
        <View style={styles.textDetails}>
          <ThemedText type="h2" style={styles.cardTitle}>Phrase Nudges</ThemedText>
          <ThemedText style={styles.description}>
            3 quick phrases sent before your day starts. Review each in under 10 seconds.
          </ThemedText>
        </View>
      </View>

      <View style={styles.permissionBox}>
        <View style={[styles.iconCircle, { backgroundColor: Colors.brandPink }]}>
          <Bell size={32} color={Colors.black} strokeWidth={2.5} />
        </View>
        <View style={styles.textDetails}>
          <ThemedText type="h2" style={styles.cardTitle}>Market Alerts</ThemedText>
          <ThemedText style={styles.description}>
            Bargaining tips when you're near local markets or main spots.
          </ThemedText>
        </View>
      </View>

    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  permissionBox: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    width: '100%',
    shadowColor: Colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textDetails: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'BeVietnamPro_900Black',
    fontSize: 18,
    color: Colors.black,
  },
  description: {
    fontSize: 13,
    fontFamily: 'BeVietnamPro_700Bold',
    color: Colors.black,
    opacity: 0.6,
    marginTop: 2,
    lineHeight: 18,
  },
  footerInner: {
    width: '100%',
    paddingBottom: 24,
  },
  secondaryCta: {
    marginTop: 16,
  },
});
