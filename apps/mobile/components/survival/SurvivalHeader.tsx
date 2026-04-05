import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Theme';
import { ProgressBar } from './ProgressBar';

interface SurvivalHeaderProps {
  currentStep: number;
  totalSteps: number;
  onClose: () => void;
}

export const SurvivalHeader = ({ currentStep, totalSteps, onClose }: SurvivalHeaderProps) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
      <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
        <X size={24} color={Colors.black} />
      </TouchableOpacity>
      <View style={styles.progressWrapper}>
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  closeBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressWrapper: {
    flex: 1,
    paddingRight: 16,
  },
});
