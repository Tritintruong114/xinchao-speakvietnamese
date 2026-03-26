import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { ThemedText } from './ThemedText';
import { Colors } from '../constants/Theme';

interface StatusBadgeProps {
  label: string;
  backgroundColor: string;
  icon?: LucideIcon;
  style?: ViewStyle;
}

export function StatusBadge({ label, backgroundColor, icon: Icon, style }: StatusBadgeProps) {
  return (
    <View style={[styles.container, style]}>
      {/* Shadow layer */}
      <View style={[styles.shadow, { backgroundColor: '#1A1A1A' }]} />
      
      {/* Badge layer */}
      <View style={[styles.badge, { backgroundColor }]}>
        <View style={styles.content}>
          {Icon && <Icon size={14} color="#1A1A1A" strokeWidth={2.5} style={{ marginRight: 6 }} />}
          <ThemedText style={styles.text}>{label.toUpperCase()}</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 4,
    paddingBottom: 4,
    position: 'relative',
  },
  shadow: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    zIndex: -1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 10,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },
});
