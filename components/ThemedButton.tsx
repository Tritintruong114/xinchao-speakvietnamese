import { StyleSheet, ViewStyle, Pressable } from 'react-native';
import { Colors, Spacing, BorderRadius, Stroke, Shadow } from '../constants/Theme';
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
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  primary: {
    backgroundColor: Colors.brandPrimary,
    shadowColor: Shadow.color,
    shadowOffset: { width: Shadow.offset, height: Shadow.offset },
    shadowOpacity: Shadow.opacity,
    shadowRadius: 0,
    elevation: Shadow.offset,
  },
  secondary: {
    backgroundColor: Colors.brandSecondary,
    shadowColor: Shadow.color,
    shadowOffset: { width: Shadow.offset / 2, height: Shadow.offset / 2 },
    shadowOpacity: Shadow.opacity,
    shadowRadius: 0,
    elevation: Shadow.offset / 2,
  },
  ghost: {
    backgroundColor: Colors.white,
  },
  pressedPrimary: {
    transform: [{ translateX: Shadow.offset / 2 }, { translateY: Shadow.offset / 2 }],
    shadowOffset: { width: Shadow.offset / 2, height: Shadow.offset / 2 },
    opacity: 1,
  },
  pressedSecondary: {
    transform: [{ translateX: Shadow.offset / 4 }, { translateY: Shadow.offset / 4 }],
    shadowOffset: { width: Shadow.offset / 4, height: Shadow.offset / 4 },
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
