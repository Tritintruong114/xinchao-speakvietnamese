import { LucideIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { Colors, Spacing, BorderRadius, Stroke, Shadow } from '../constants/Theme';

interface ThemedInputProps extends TextInputProps {
  containerStyle?: ViewStyle;
  borderColor?: string;
  icon?: LucideIcon;
}

export function ThemedInput({ 
  containerStyle, 
  onFocus, 
  onBlur, 
  style, 
  borderColor = Stroke.color,
  icon: Icon,
  ...props 
}: ThemedInputProps) {
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
        { borderColor: isFocused ? Colors.brandPrimary : borderColor },
        isFocused && styles.focusedContainer
      ]}>
        {Icon && <Icon size={20} color={Colors.textMuted} style={styles.icon} />}
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
    // Hard Shadow offset
    backgroundColor: Shadow.color,
    borderRadius: BorderRadius.button,
    marginBottom: Spacing.m,
  },
  inputContainer: {
    backgroundColor: Colors.white,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    borderRadius: BorderRadius.button,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.m,
    // Negative margin to offset from the "shadow" background
    transform: [{ translateX: -Shadow.offset }, { translateY: -Shadow.offset }],
  },
  focusedContainer: {
    borderColor: Colors.brandPrimary,
  },
  icon: {
    marginRight: -4, // Pull text closer to icon
  },
  input: {
    flex: 1,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    fontSize: 16,
    color: Colors.black,
    fontFamily: 'BeVietnamPro_400Regular',
  },
});
