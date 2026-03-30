import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Theme';
import { ThemedText } from '../ThemedText';
import { Calculator } from './Calculator';

interface CalculatorOverlayProps {
  onValueChange: (value: string) => void;
  onSubmit: (value: string) => void;
  expression?: 'happy' | 'neutral' | 'sad' | 'excited';
  value: string;
}

export const CalculatorOverlay = ({ 
  onValueChange, 
  onSubmit, 
  expression = 'neutral', 
  value 
}: CalculatorOverlayProps) => {
  return (
    <View style={styles.calculatorModal}>
      <Calculator 
        onValueChange={onValueChange} 
        onDone={onSubmit}
        expression={expression}
      />
      <TouchableOpacity 
        style={styles.submitCalculatorBtn}
        onPress={() => onSubmit(value)}
      >
        <ThemedText style={styles.submitText}>CONFIRM PRICE</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  calculatorModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 2,
    borderColor: Colors.black,
    zIndex: 100,
  },
  submitCalculatorBtn: {
    backgroundColor: Colors.brandPrimary,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  submitText: {
    color: Colors.white,
    fontFamily: 'BeVietnamPro_800ExtraBold',
  },
});
