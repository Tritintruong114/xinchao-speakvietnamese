import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { Colors, Stroke, Shadow, BorderRadius } from '@/constants/Theme';
import { useAppStore } from '@/store/useAppStore';
import { OnboardingLayout } from '@/components/OnboardingLayout';
import { Camera, MapPin } from 'lucide-react-native';
import { ThemedIcon } from '@/components/ThemedIcon';

export default function PermissionsScreen() {
  const router = useRouter();
  const { setHasOnboarded } = useAppStore();

  const handleComplete = () => {
    setHasOnboarded(true);
    router.replace('/(tabs)');
  };

  const renderFooter = () => (
    <View style={styles.footerInner}>
      <ThemedButton 
        title="I'M READY" 
        type="primary" 
        onPress={handleComplete} 
      />
    </View>
  );

  return (
    <OnboardingLayout
      title={`To make your trip\neven easier:`}
      footer={renderFooter()}
    >
      <View style={styles.permissionBox}>
        <View style={styles.iconCircle}>
          <ThemedIcon icon={Camera} size={32} />
        </View>
        <View style={styles.textDetails}>
          <ThemedText type="h2">Camera Translation</ThemedText>
          <ThemedText style={styles.description}>
            Scan Menus and Signs to understand instantly (OCR). We only use the camera when you request a translation.
          </ThemedText>
        </View>
      </View>

      <View style={styles.permissionBox}>
        <View style={styles.iconCircle}>
          <ThemedIcon icon={MapPin} size={32} />
        </View>
        <View style={styles.textDetails}>
          <ThemedText type="h2">Location Tips</ThemedText>
          <ThemedText style={styles.description}>
            Get suggestions for common phrases when you arrive at major tourist spots.
          </ThemedText>
        </View>
      </View>

      <View style={styles.infoCard}>
        <ThemedText style={styles.infoText}>
          Your data is secure and only used to improve your learning experience.
        </ThemedText>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  permissionBox: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    borderRadius: BorderRadius.card,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
    // Hard Shadow
    shadowColor: Shadow.color,
    shadowOffset: { width: Shadow.offset, height: Shadow.offset },
    shadowOpacity: Shadow.opacity,
    shadowRadius: 0,
    elevation: Shadow.offset,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.brandSecondary,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textDetails: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: Colors.brandSecondary,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    borderRadius: 8,
    padding: 16,
    marginTop: 10,
    marginBottom: 40,
    width: '100%',
  },
  infoText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 20,
    color: Colors.black,
  },
  footerInner: {
    width: '100%',
    paddingBottom: 24,
  },
});
