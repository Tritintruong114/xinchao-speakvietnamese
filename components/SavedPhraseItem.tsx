import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Colors, Stroke, Shadow, BorderRadius } from '../constants/Theme';
import { Volume2 } from 'lucide-react-native';
import { ThemedText } from './ThemedText';

interface SavedPhraseItemProps {
  vietnamese: string;
  english: string;
  onPlay?: () => void;
}

/**
 * SavedPhraseItem - List item for saved vocabulary/phrases.
 * Matches Pencil design node flash1 (9Qcaz).
 */
export function SavedPhraseItem({ vietnamese, english, onPlay }: SavedPhraseItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.vietnamese}>
          {vietnamese.toUpperCase()}
        </ThemedText>
        <ThemedText style={styles.english}>
          {english}
        </ThemedText>
      </View>
      
      <View style={styles.buttonWrapper}>
        {onPlay && (
          <Pressable 
            onPress={onPlay}
            style={({ pressed }) => [
              styles.playButton,
              pressed && styles.pressed
            ]}
          >
            <Volume2 size={24} color={Colors.black} strokeWidth={2.5} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 84,
    backgroundColor: Colors.white,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    borderRadius: BorderRadius.card,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Hard shadow
    shadowColor: Shadow.color,
    shadowOffset: { width: Shadow.offset, height: Shadow.offset },
    shadowOpacity: Shadow.opacity,
    shadowRadius: 0,
    elevation: Shadow.offset,
    marginBottom: 16,
    marginRight: 4, // Space for shadow
  },
  content: {
    flex: 1,
    marginRight: 10,
  },
  vietnamese: {
    fontSize: 14,
    fontFamily: 'BeVietnamPro_900Black',
    color: Colors.black,
    marginBottom: 4,
  },
  english: {
    fontSize: 12,
    fontFamily: 'BeVietnamPro_600SemiBold',
    color: Colors.black,
  },
  buttonWrapper: {
    width: 60, // Ensure enough space for the button shadow
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  playButton: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: Colors.brandSecondary,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    alignItems: 'center',
    justifyContent: 'center',
    // Hard shadow for the button
    shadowColor: Shadow.color,
    shadowOffset: { width: Shadow.offset, height: Shadow.offset },
    shadowOpacity: Shadow.opacity,
    shadowRadius: 0,
    elevation: Shadow.offset,
  },
  pressed: {
    transform: [{ translateX: Shadow.offset / 2 }, { translateY: Shadow.offset / 2 }],
    shadowOffset: { width: Shadow.offset / 2, height: Shadow.offset / 2 },
  },
});
