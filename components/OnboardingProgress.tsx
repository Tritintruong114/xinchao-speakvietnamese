import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/Theme';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps?: number;
}

export function OnboardingProgress({ currentStep, totalSteps = 3 }: OnboardingProgressProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.segment,
            i + 1 <= currentStep ? styles.segmentActive : styles.segmentInactive,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    alignSelf: 'center',
  },
  segment: {
    width: 40,
    height: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.black,
  },
  segmentActive: {
    backgroundColor: Colors.brandPrimary,
  },
  segmentInactive: {
    backgroundColor: Colors.white,
  },
});

