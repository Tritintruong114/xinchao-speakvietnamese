import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Theme';
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
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 8,
    padding: 2,
    alignItems: 'center',
    // Hard shadow
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
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
    borderColor: '#1A1A1A',
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
    color: '#1A1A1A',
  },
  inactiveLabel: {
    color: '#666666',
  },
  pressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    shadowOffset: { width: 2, height: 2 },
    elevation: 2,
  },
});
