import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants/Theme';

interface ThemedInputProps extends TextInputProps {
  containerStyle?: ViewStyle;
}

/**
 * ThemedInput - A custom TextInput wrapper designed for "XinChao".
 * Features:
 * - 2px solid black border.
 * - 4px hard offset shadow for depth (Neo-brutalism).
 * - Focused state with brandPrimary (Red) border.
 */
export function ThemedInput({ containerStyle, onFocus, onBlur, style, ...props }: ThemedInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <View style={[styles.shadowContainer, containerStyle]}>
      <View style={[
        styles.inputContainer,
        isFocused && styles.focusedContainer
      ]}>
        <TextInput
          style={[styles.input, style]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={Colors.textMuted}
          {...props}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowContainer: {
    // 4px Hard Shadow offset
    backgroundColor: '#1A1A1A',
    borderRadius: BorderRadius.button,
    marginBottom: Spacing.m,
  },
  inputContainer: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: BorderRadius.button,
    minHeight: 48,
    // Negative margin to offset from the "shadow" background
    transform: [{ translateX: -4 }, { translateY: -4 }],
  },
  focusedContainer: {
    borderColor: Colors.brandPrimary,
  },
  input: {
    flex: 1,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    fontSize: 16,
    color: '#1A1A1A',
    fontFamily: 'BeVietnamPro_400Regular',
  },
});
