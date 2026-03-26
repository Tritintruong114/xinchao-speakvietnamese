import React from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { ThemedText } from './ThemedText';

interface ModuleCardProps {
  title: string;
  icon: LucideIcon;
  backgroundColor: string;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 48) / 2; // (TotalWidth - padding * 2 - gap) / 2

export function ModuleCard({ title, icon: Icon, backgroundColor, onPress }: ModuleCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      {/* Shadow layer */}
      <View style={styles.shadow} />

      {/* Card layer */}
      <View style={[styles.card, { backgroundColor }]}>
        <View style={styles.iconContainer}>
          <Icon size={28} color="#1A1A1A" strokeWidth={2.5} />
        </View>
        <ThemedText style={styles.title}>{title.toUpperCase()}</ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 4,
    paddingBottom: 4,
    width: CARD_SIZE + 4,
    height: CARD_SIZE + 4,
    marginBottom: 16,
  },
  shadow: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    zIndex: -1,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: '#1A1A1A',
    lineHeight: 20,
  },
});
