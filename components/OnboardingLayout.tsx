import { usePathname } from 'expo-router';
import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Theme';
import { OnboardingProgress } from './OnboardingProgress';
import { ThemedText } from './ThemedText';

interface OnboardingLayoutProps {
  title?: string;
  description?: string;
  image?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  contentStyle?: ViewStyle;
  scrollEnabled?: boolean;
  currentStep?: number;
  totalSteps?: number;
  showProgress?: boolean;
}

const ONBOARDING_ORDER = [
  'intent',
  'offline',
  'aha',
  'permissions'
];

export function OnboardingLayout({
  title,
  description,
  image,
  children,
  footer,
  contentStyle,
  scrollEnabled = true,
  currentStep,
  totalSteps = 4,
  showProgress = true
}: OnboardingLayoutProps) {
  const ContentComponent = scrollEnabled ? ScrollView : View;
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // Determine current step automatically if not provided
  let activeStep = currentStep;
  if (activeStep === undefined && showProgress) {
    const routeName = pathname.split('/').pop() || '';
    const index = ONBOARDING_ORDER.indexOf(routeName);
    if (index !== -1) {
      activeStep = index + 1;
    }
  }

  // Calculate total steps
  const finalTotalSteps = totalSteps || ONBOARDING_ORDER.length;

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <ContentComponent
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: Math.max(insets.top, 24) },
            !scrollEnabled && { flex: 1 },
            contentStyle
          ]}
          showsVerticalScrollIndicator={false}
        >
          {showProgress && activeStep !== undefined && (
            <View style={styles.progressWrapper}>
              <OnboardingProgress currentStep={activeStep} totalSteps={finalTotalSteps} />
            </View>
          )}

          <View style={styles.centerWrapper}>
            {(title || description || image) && (
              <View style={styles.header}>
                {image && (
                  <View style={styles.imageWrapper}>
                    {image}
                  </View>
                )}
                {title && (
                  <ThemedText type="h1" style={styles.title}>
                    {title}
                  </ThemedText>
                )}
                {description && (
                  <ThemedText style={styles.description}>
                    {description}
                  </ThemedText>
                )}
              </View>
            )}

            <View style={styles.content}>
              {children}
            </View>
          </View>
        </ContentComponent>

        {footer && (
          <View style={styles.footer}>
            {footer}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  centerWrapper: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  imageWrapper: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: Colors.brandPrimary,
    fontFamily: 'BeVietnamPro_900Black',
    lineHeight: 32,
  },
  description: {
    textAlign: 'center',
    color: Colors.black,
    opacity: 0.6,
    fontFamily: 'BeVietnamPro_700Bold',
    lineHeight: 22,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  progressWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 0 : 24, // SafeAreaView handles iOS
    paddingTop: 16,
    backgroundColor: Colors.bgPrimary,
  },
});
