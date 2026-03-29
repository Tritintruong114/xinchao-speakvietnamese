import React from 'react';
import { StyleSheet, View, Pressable, ViewStyle } from 'react-native';
import { Colors, Spacing, BorderRadius, Stroke, Shadow } from '../constants/Theme';
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
            <Volume2 color={Colors.black} strokeWidth={2.5} size={24} />
          </Pressable>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.brandSecondary,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    borderRadius: BorderRadius.card,
    padding: Spacing.m,
    marginVertical: Spacing.s,
    // Add a hard shadow as per design-system.md
    shadowColor: Shadow.color,
    shadowOffset: { width: Shadow.offset, height: Shadow.offset },
    shadowOpacity: Shadow.opacity,
    shadowRadius: 0,
    elevation: Shadow.offset,
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
    color: Colors.black,
  },
  description: {
    color: Colors.black,
    opacity: 0.8,
  },
  audioButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    alignItems: 'center',
    justifyContent: 'center',
    // Micro-shadow for the button itself
    shadowColor: Shadow.color,
    shadowOffset: { width: Shadow.offset / 2, height: Shadow.offset / 2 },
    shadowOpacity: Shadow.opacity,
    shadowRadius: 0,
    elevation: Shadow.offset / 2,
  },
  pressed: {
    transform: [{ translateX: Shadow.offset / 4 }, { translateY: Shadow.offset / 4 }],
    shadowOffset: { width: Shadow.offset / 4, height: Shadow.offset / 4 },
    elevation: Shadow.offset / 4,
  },
});
