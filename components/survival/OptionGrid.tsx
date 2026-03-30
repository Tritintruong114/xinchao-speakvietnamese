import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors, BorderRadius } from '../../constants/Theme';
import { ThemedText } from '../ThemedText';

interface Option {
  label: string;
  nextId: string;
  audioUri?: string;
}

interface OptionGridProps {
  options: Option[];
  onSelect: (option: Option) => void;
}

export const OptionGrid = ({ options, onSelect }: OptionGridProps) => {
  return (
    <View style={styles.optionsGrid}>
      {options.map((option, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.optionButton}
          onPress={() => onSelect(option)}
        >
          <ThemedText style={styles.optionText}>{option.label}</ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  optionsGrid: {
    gap: 12,
    marginTop: 24,
    width: '100%',
  },
  optionButton: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: BorderRadius.button,
    padding: 16,
    width: '100%',
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    textAlign: 'center',
    color: Colors.black,
  },
});
