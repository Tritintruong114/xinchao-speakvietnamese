import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Stroke, Shadow } from '../../constants/Theme';
import { ThemedText } from '../ThemedText';

interface DialectSwitcherProps {
  dialect: 'N' | 'S'; // North (Hanoi) | South (Saigon)
  onToggle: () => void;
  style?: StyleProp<ViewStyle>;
}

export function DialectSwitcher({ dialect, onToggle, style }: DialectSwitcherProps) {
  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [
        styles.container,
        style,
        pressed && styles.pressed
      ]}
    >
      <View style={[
        styles.segment,
        dialect === 'N' ? styles.activeSegment : styles.inactiveSegment,
        dialect === 'N' && styles.activeShadow
      ]}>
        <ThemedText style={[styles.label, dialect === 'N' ? styles.activeLabel : styles.inactiveLabel]}>HN</ThemedText>
      </View>
      <View style={[
        styles.segment,
        dialect === 'S' ? styles.activeSegment : styles.inactiveSegment,
        dialect === 'S' && styles.activeShadow
      ]}>
        <ThemedText style={[styles.label, dialect === 'S' ? styles.activeLabel : styles.inactiveLabel]}>SG</ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    borderRadius: 8,
    padding: 2,
    alignItems: 'center',
    // Hard shadow
    shadowColor: Shadow.color,
    shadowOffset: { width: Shadow.offset, height: Shadow.offset },
    shadowOpacity: Shadow.opacity,
    shadowRadius: 0,
    elevation: Shadow.offset,
  },
  segment: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  activeSegment: {
    backgroundColor: Colors.brandSecondary,
    borderColor: Stroke.color,
  },
  inactiveSegment: {
    backgroundColor: 'transparent',
  },
  activeShadow: {
    // Subtle inner shadow effect via background color and border
  },
  label: {
    fontSize: 10,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    textAlign: 'center',
  },
  activeLabel: {
    color: Colors.black,
  },
  inactiveLabel: {
    color: Colors.textMuted,
  },
  pressed: {
    transform: [{ translateX: Shadow.offset / 2 }, { translateY: Shadow.offset / 2 }],
    shadowOffset: { width: Shadow.offset / 2, height: Shadow.offset / 2 },
    elevation: Shadow.offset / 2,
  },
});
