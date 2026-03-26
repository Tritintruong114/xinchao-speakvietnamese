import { StyleSheet, ViewStyle, Pressable } from 'react-native';
import { Colors, Spacing, BorderRadius, Stroke } from '../constants/Theme';
import { ThemedText } from './ThemedText';
import React from 'react';

interface ThemedButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'ghost';
  style?: ViewStyle;
  disabled?: boolean;
}

export function ThemedButton({ title, onPress, type = 'primary', style, disabled }: ThemedButtonProps) {
  const getButtonStyle = () => (type === 'primary' ? styles.primary : type === 'secondary' ? styles.secondary : styles.ghost);

  const getTextStyle = () => {
    return type === 'primary' ? Colors.white : Colors.black;
  };

  const getPressedStyle = () => {
    switch (type) {
      case 'primary':
        return styles.pressedPrimary;
      case 'secondary':
        return styles.pressedSecondary;
      default:
        return styles.pressedGhost;
    }
  };

  return (
    <Pressable 
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        getButtonStyle(),
        pressed && !disabled && getPressedStyle(),
        disabled && styles.disabled,
        style
      ]}
      disabled={disabled}
    >
      <ThemedText type="button" color={getTextStyle()}>{title}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.l,
    borderRadius: BorderRadius.button,
    borderWidth: 2, // Strict 2px border
    borderColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44, // Touch-Target-Min
  },
  primary: {
    backgroundColor: Colors.brandPrimary,
    // 4px Hard Shadow
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  secondary: {
    backgroundColor: Colors.brandSecondary,
    // 2px Hard Shadow for secondary
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  ghost: {
    backgroundColor: Colors.white,
    // Ghost usually has no shadow or very subtle
  },
  pressedPrimary: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    shadowOffset: { width: 2, height: 2 },
    opacity: 1, // Keep opacity solid for Neo-brutalism
  },
  pressedSecondary: {
    transform: [{ translateX: 1 }, { translateY: 1 }],
    shadowOffset: { width: 1, height: 1 },
    opacity: 1,
  },
  pressedGhost: {
    transform: [{ translateY: 1 }],
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
});
