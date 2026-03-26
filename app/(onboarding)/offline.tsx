import { OnboardingLayout } from '@/components/OnboardingLayout';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedImage } from '@/components/ThemedImage';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Theme';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export default function OfflineScreen() {
  const router = useRouter();
  const { setSurvivalPackDownloaded, isSurvivalPackDownloaded } = useAppStore();
  const [downloadProgress] = useState(new Animated.Value(0));
  const [progressPercent, setProgressPercent] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const getQuirkyPhase = (percent: number) => {
    if (percent <= 20) return "Packing 100 bargaining phrases into your 'Túi Ba Gang'...";
    if (percent <= 50) return "Wrapping a Banh Mi with grilled pork and pâté...";
    if (percent <= 80) return "Compressing the 'Ninja Lead' street-smart attitude...";
    if (percent < 100) return "Cramming in one last glass of Cà Phê Sữa Đá...";
    return "Done! Ready to survive!";
  };

  useEffect(() => {
    if (isDownloading) {
      Animated.timing(downloadProgress, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }).start(() => {
        setSurvivalPackDownloaded(true);
        setIsDownloading(false);
      });

      downloadProgress.addListener(({ value }) => {
        setProgressPercent(Math.floor(value * 100));
      });
    }
    return () => downloadProgress.removeAllListeners();
  }, [isDownloading]);

  const handleStartDownload = () => {
    setIsDownloading(true);
  };

  const handleNext = () => {
    router.push('/(onboarding)/aha');
  };

  const renderFooter = () => (
    <View style={styles.buttonContainer}>
      {!isSurvivalPackDownloaded ? (
        <ThemedButton
          title={isDownloading ? "DOWNLOADING..." : "DOWNLOAD SURVIVAL PACK"}
          type="primary"
          onPress={handleStartDownload}
          disabled={isDownloading}
        />
      ) : (
        <ThemedButton
          title="CONTINUE"
          type="primary"
          onPress={handleNext}
        />
      )}

      <ThemedButton
        title="MAYBE LATER"
        type="ghost"
        onPress={handleNext}
        style={{ marginTop: 12 }}
        disabled={isDownloading}
      />
    </View>
  );

  return (
    <OnboardingLayout
      title={`NO WI-FI?\nNO PROBLEM.`}
      image={
        <ThemedImage 
          source={require('@/assets/screens/onboarding/offline_mode.jpg')} 
          size="lg"
        />
      }
      footer={renderFooter()}
    >
      <View style={styles.progressContainer}>
        <View style={styles.progressBarWrapper}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: downloadProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                })
              }
            ]}
          />
        </View>
        <ThemedText style={styles.progressText}>
          {getQuirkyPhase(progressPercent)}
        </ThemedText>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 40,
  },
  progressBarWrapper: {
    width: '100%',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 8,
    overflow: 'hidden',
    // Hard Shadow
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.brandSecondary,
  },
  progressText: {
    marginTop: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    color: '#1A1A1A',
    paddingHorizontal: 10,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    paddingBottom: 24,
  },
});
