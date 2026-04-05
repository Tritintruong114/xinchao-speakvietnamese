import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Stroke, BorderRadius } from '../../constants/Theme';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.step,
            index <= currentStep ? styles.activeStep : styles.inactiveStep,
            index === 0 && styles.firstStep,
            index === totalSteps - 1 && styles.lastStep,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 12,
    width: '100%',
    backgroundColor: Colors.white,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    borderRadius: BorderRadius.tight,
    overflow: 'hidden',
  },
  step: {
    flex: 1,
    borderRightWidth: Stroke.width / 2,
    borderRightColor: Stroke.color,
  },
  activeStep: {
    backgroundColor: Colors.brandPrimary,
  },
  inactiveStep: {
    backgroundColor: Colors.white,
  },
  firstStep: {
    borderTopLeftRadius: BorderRadius.tight - 2,
    borderBottomLeftRadius: BorderRadius.tight - 2,
  },
  lastStep: {
    borderRightWidth: 0,
    borderTopRightRadius: BorderRadius.tight - 2,
    borderBottomRightRadius: BorderRadius.tight - 2,
  },
});
