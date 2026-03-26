import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { Colors } from '@/constants/Theme';
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
          🚀 Your data is secure and only used to improve your learning experience.
        </ThemedText>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  permissionBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
    // Hard Shadow
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.brandSecondary,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textDetails: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: Colors.brandSecondary,
    borderWidth: 2,
    borderColor: '#1A1A1A',
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
  },
  footerInner: {
    width: '100%',
    paddingBottom: 24,
  },
});
