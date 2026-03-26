import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from './ThemedText';
import { Volume2 } from 'lucide-react-native';

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
            <Volume2 size={24} color="#1A1A1A" strokeWidth={2.5} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 84,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Hard shadow
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
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
    color: '#1A1A1A',
    marginBottom: 4,
  },
  english: {
    fontSize: 12,
    fontFamily: 'BeVietnamPro_600SemiBold',
    color: '#1A1A1A',
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
    backgroundColor: '#FFC62F',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    // Hard shadow for the button
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  pressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    shadowOffset: { width: 2, height: 2 },
  },
});
