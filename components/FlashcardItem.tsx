import React from 'react';
import { StyleSheet, View, Pressable, ViewStyle } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants/Theme';
import { ThemedText } from './ThemedText';
import { Volume2 } from 'lucide-react-native';

interface FlashcardItemProps {
  title: string;
  description: string;
  onPlayAudio?: () => void;
  style?: ViewStyle;
}

/**
 * FlashcardItem - Optimized learning card component.
 * Features:
 * - brandSecondary (Star Yellow) background.
 * - 2px solid black border and 12px border radius.
 * - Integrated h2 title and body description.
 * - Audio play button with Lucide icon.
 * - React.memo for list performance.
 */
export const FlashcardItem = React.memo(({ 
  title, 
  description, 
  onPlayAudio, 
  style 
}: FlashcardItemProps) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.textContainer}>
          <ThemedText type="h2" style={styles.title}>{title}</ThemedText>
          <ThemedText type="body" style={styles.description}>{description}</ThemedText>
        </View>
        
        {onPlayAudio && (
          <Pressable 
            onPress={onPlayAudio}
            style={({ pressed }) => [
              styles.audioButton,
              pressed && styles.pressed
            ]}
          >
            <Volume2 color="#1A1A1A" strokeWidth={2.5} size={24} />
          </Pressable>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.brandSecondary,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: BorderRadius.card,
    padding: Spacing.m,
    marginVertical: Spacing.s,
    // Add a subtle hard shadow as per design-system.md Section 3.2
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: Spacing.m,
  },
  title: {
    marginBottom: 4,
    color: '#1A1A1A',
  },
  description: {
    color: '#1A1A1A',
    opacity: 0.8,
  },
  audioButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    // Micro-shadow for the button itself
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  pressed: {
    transform: [{ translateX: 1 }, { translateY: 1 }],
    shadowOffset: { width: 1, height: 1 },
    elevation: 1,
  },
});
