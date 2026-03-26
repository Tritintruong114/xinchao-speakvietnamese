import React from 'react';
import { 
  StyleSheet, 
  View, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  ViewStyle
} from 'react-native';
import { Colors, Spacing } from '../constants/Theme';
import { ThemedText } from './ThemedText';

interface OnboardingLayoutProps {
  title?: string;
  description?: string;
  image?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  contentStyle?: ViewStyle;
  scrollEnabled?: boolean;
}

export function OnboardingLayout({ 
  title, 
  description, 
  image,
  children, 
  footer, 
  contentStyle,
  scrollEnabled = true
}: OnboardingLayoutProps) {
  const ContentComponent = scrollEnabled ? ScrollView : View;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ContentComponent 
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            !scrollEnabled && { flex: 1 },
            contentStyle
          ]}
          showsVerticalScrollIndicator={false}
        >
          {(title || description || image) && (
            <View style={styles.header}>
              {image && (
                <View style={styles.imageContainer}>
                  {image}
                </View>
              )}
              {title && (
                <ThemedText type="h1" color={Colors.brandPrimary} style={styles.title}>
                  {title}
                </ThemedText>
              )}
              {description && (
                <ThemedText type="body" style={styles.description}>
                  {description}
                </ThemedText>
              )}
            </View>
          )}

          <View style={styles.childrenContainer}>
            {children}
          </View>
        </ContentComponent>

        {footer && (
          <View style={styles.footer}>
            {footer}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
    flexGrow: 1,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    textAlign: 'center',
    color: '#666666',
    paddingHorizontal: 12,
  },
  childrenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 0 : 24, // SafeAreaView handles iOS
    paddingTop: 16,
    backgroundColor: Colors.bgPrimary,
  },
});
