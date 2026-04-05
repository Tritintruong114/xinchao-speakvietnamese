import { OnboardingLayout } from '@/components/OnboardingLayout';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Stroke, BorderRadius } from '@/constants/Theme';
import { Sparkles, CheckCircle2, MessageCircle, ShoppingBag, Utensils, Car, Banknote } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { useToastStore } from '@/store/useToastStore';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View, Image } from 'react-native';

export default function OfflineScreen() {
  const router = useRouter();
  const { setSurvivalPackDownloaded, isSurvivalPackDownloaded } = useAppStore();
  const { showToast } = useToastStore();
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
    // Show background download toast
    showToast("The package is downloading in the background", "success", 4);
    
    // Trigger background download simulation
    setIsDownloading(true);
    
    // Move to next step immediately
    handleNext();
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
        <View style={styles.imageBox}>
          <Image 
            source={require('@/assets/images/offline_hero.png')} 
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>
      }
      footer={renderFooter()}
    >
      <View style={styles.includedSection}>
        <ThemedText style={styles.includedTitle}>WHAT'S INSIDE:</ThemedText>
        <View style={styles.featureGrid}>
          <View style={styles.featureItem}>
            <MessageCircle size={18} color={Colors.brandPrimary} />
            <ThemedText style={styles.featureText}>Greetings</ThemedText>
          </View>
          <View style={styles.featureItem}>
            <ShoppingBag size={18} color={Colors.brandSecondary} />
            <ThemedText style={styles.featureText}>Bargaining</ThemedText>
          </View>
          <View style={styles.featureItem}>
            <Utensils size={18} color={Colors.brandPink} />
            <ThemedText style={styles.featureText}>Food & Drink</ThemedText>
          </View>
          <View style={styles.featureItem}>
            <Car size={18} color={Colors.brandCyan} />
            <ThemedText style={styles.featureText}>Grab & Taxi</ThemedText>
          </View>
          <View style={styles.featureItem}>
            <Banknote size={18} color={Colors.brandMint} />
            <ThemedText style={styles.featureText}>Money Hacks</ThemedText>
          </View>
          <View style={styles.featureItem}>
            <CheckCircle2 size={18} color={Colors.brandLavender} />
            <ThemedText style={styles.featureText}>500+ Phrases</ThemedText>
          </View>
        </View>
      </View>

      {isDownloading && (
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
      )}
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
    fontFamily: 'BeVietnamPro_700Bold',
    textAlign: 'center',
    fontSize: 16,
    color: Colors.black,
    paddingHorizontal: 10,
    lineHeight: 24,
  },
  imageBox: {
    width: 200,
    height: 200,
    backgroundColor: Colors.white,
    borderWidth: Stroke.width,
    borderColor: Colors.black,
    borderRadius: BorderRadius.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  includedSection: {
    width: '100%',
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: BorderRadius.card,
    padding: 16,
    marginBottom: 24,
    // Standard Hard Shadow
    shadowColor: Colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  includedTitle: {
    fontSize: 12,
    fontFamily: 'BeVietnamPro_900Black',
    color: Colors.black,
    marginBottom: 12,
    letterSpacing: 1,
    opacity: 0.6,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: Colors.bgPrimary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.black,
    gap: 6,
    minWidth: '45%',
  },
  featureText: {
    fontSize: 13,
    fontFamily: 'BeVietnamPro_700Bold',
    color: Colors.black,
  },
  buttonContainer: {
    width: '100%',
    paddingBottom: 24,
  },
});
