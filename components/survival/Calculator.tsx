import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Stroke, Shadow, BorderRadius } from '../../constants/Theme';
import { ThemedText } from '../ThemedText';

interface CalculatorProps {
  onValueChange?: (value: string) => void;
  onDone?: (value: string) => void;
  targetValue?: string;
  expression?: 'happy' | 'neutral' | 'sad' | 'excited';
}

export const Calculator = ({ onValueChange, onDone, targetValue, expression = 'neutral' }: CalculatorProps) => {
  const [display, setDisplay] = useState('0');

  const handlePress = (key: string) => {
    let newValue = display;
    if (key === 'C') {
      newValue = '0';
    } else if (key === 'DEL') {
      newValue = display.length > 1 ? display.slice(0, -1) : '0';
    } else if (key === 'OK') {
      onDone?.(display);
      return;
    } else {
      newValue = display === '0' ? key : display + key;
    }
    
    // Simple thousand separator logic
    const numericValue = newValue.replace(/\./g, '');
    if (numericValue.length > 9) return; // Limit
    
    const formatted = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setDisplay(formatted);
    onValueChange?.(formatted);
  };

  const keys = [
    ['7', '8', '9', 'DEL'],
    ['4', '5', '6', 'C'],
    ['1', '2', '3', '0'],
    ['.', '000', 'OK']
  ];

  const renderMascotFace = () => {
    switch (expression) {
      case 'excited': return ' > ◡ < ';
      case 'happy': return ' ^ ◡ ^ ';
      case 'sad': return ' ; ◡ ; ';
      default: return ' • ◡ • ';
    }
  };

  return (
    <View style={styles.container}>
      {/* Mascot Header */}
      <View style={styles.mascotHeader}>
        <ThemedText style={styles.mascotText}>{renderMascotFace()}</ThemedText>
        <ThemedText style={styles.brandText}>CASIO-X 100</ThemedText>
      </View>

      {/* Screen */}
      <View style={styles.screen}>
        <Text style={styles.displayText} numberOfLines={1}>{display}</Text>
        <Text style={styles.currencyText}>VND</Text>
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        {keys.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((key) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.key,
                  key === 'OK' && styles.okKey,
                  (key === 'C' || key === 'DEL') && styles.clearKey,
                ]}
                onPress={() => handlePress(key)}
              >
                <Text style={[
                  styles.keyText,
                  key === 'OK' && styles.okKeyText
                ]}>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D1D5DB', // Casio gray
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    borderRadius: BorderRadius.card,
    padding: 16,
    width: '100%',
    maxWidth: 320,
    // Hard Shadow
    shadowColor: Shadow.color,
    shadowOffset: { width: Shadow.offset * 2, height: Shadow.offset * 2 },
    shadowOpacity: Shadow.opacity,
    shadowRadius: 0,
    elevation: 8,
  },
  mascotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mascotText: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.black,
  },
  brandText: {
    fontSize: 10,
    fontWeight: 'bold',
    opacity: 0.5,
    color: Colors.black,
  },
  screen: {
    backgroundColor: '#9BAA96', // LCD Green
    borderWidth: 2,
    borderColor: Colors.black,
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 60,
  },
  displayText: {
    fontSize: 32,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontWeight: 'bold',
    color: '#2D342F',
    flex: 1,
    textAlign: 'right',
  },
  currencyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2D342F',
    marginLeft: 8,
    marginBottom: 4,
  },
  keypad: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  key: {
    flex: 1,
    height: 48,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: Colors.black,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    // Slight shadow for keys
    shadowColor: Shadow.color,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 2,
  },
  keyText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.black,
  },
  okKey: {
    backgroundColor: Colors.brandPrimary,
  },
  okKeyText: {
    color: Colors.white,
  },
  clearKey: {
    backgroundColor: Colors.brandSecondary,
  },
});
