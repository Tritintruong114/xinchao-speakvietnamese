import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle, Pressable } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { ThemedText } from './ThemedText';
import { Colors, Stroke, Shadow, BorderRadius } from '../constants/Theme';

interface StatusBadgeProps {
  label: string;
  backgroundColor: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconFillColor?: string;
  textColor?: string;
  style?: ViewStyle;
  onPress?: () => void;
}

export function StatusBadge({ 
  label, 
  backgroundColor, 
  icon: Icon, 
  iconColor,
  iconFillColor,
  textColor,
  style, 
  onPress 
}: StatusBadgeProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={!onPress}
      style={[styles.container, style]}
    >
      {/* Shadow layer - hidden when pressed to simulate sinking */}
      {!isPressed && (
        <View style={[styles.shadow, { backgroundColor: Shadow.color }]} />
      )}
      
      {/* Badge layer */}
      <View style={[
        styles.badge, 
        { backgroundColor },
        isPressed && styles.badgePressed
      ]}>
        <View style={styles.content}>
          {Icon && (
            <Icon 
              size={14} 
              color={iconColor || textColor || Colors.black} 
              fill={iconFillColor} 
              strokeWidth={2.5} 
              style={{ marginRight: 6 }} 
            />
          )}
          <ThemedText style={[styles.text, textColor ? { color: textColor } : null]}>{label.toUpperCase()}</ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: Shadow.offset,
    paddingBottom: Shadow.offset,
    position: 'relative',
  },
  shadow: {
    position: 'absolute',
    top: Shadow.offset,
    left: Shadow.offset,
    right: 0,
    bottom: 0,
    borderRadius: BorderRadius.card,
    zIndex: -1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.card,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePressed: {
    transform: [
      { translateX: Shadow.offset / 2 },
      { translateY: Shadow.offset / 2 }
    ],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 10,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: Colors.black, // fallback
    letterSpacing: 0.5,
  },
});
