import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/Theme';

interface OnboardingProgressProps {
  currentStep: 1 | 2 | 3;
}

export function OnboardingProgress({ currentStep }: OnboardingProgressProps) {
  return (
    <View style={styles.container}>
      {[1, 2, 3].map((step) => (
        <View
          key={step}
          style={[
            styles.segment,
            step <= currentStep ? styles.segmentActive : styles.segmentInactive,
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

