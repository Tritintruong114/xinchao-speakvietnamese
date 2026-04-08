import { Volume2 } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { BorderRadius, Colors, Shadow, Stroke } from '../constants/Theme';
import { useAudio } from '../hooks/useAudio';
import { ThemedText } from './ThemedText';

interface FlashcardItemProps {
  vietnamese: string;
  english: string;
  /** Local asset (number) or remote/bundled URI string. */
  audioUri?: string | number;
  onPlay?: () => void;
  backgroundColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  tag?: string;
  style?: any;
  searchQuery?: string;
}

/**
 * Helper to highlight matched search terms
 */
function HighlightedText({ text, query, style, highlightStyle }: { text: string; query?: string; style?: any; highlightStyle?: any }) {
  if (!query || query.trim() === '') {
    return <ThemedText style={style}>{text}</ThemedText>;
  }

  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));

  return (
    <ThemedText style={style}>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <Text key={i} style={[styles.highlight, highlightStyle]}>
            {part}
          </Text>
        ) : (
          part
        )
      )}
    </ThemedText>
  );
}

/**
 * FlashcardItem - Global reusable component for vocabulary items.
 * Supports multiple color variants while maintaining Neo-brutalism design.
 */
export function FlashcardItem({
  vietnamese,
  english,
  audioUri,
  onPlay,
  backgroundColor = Colors.white,
  primaryColor = Colors.black,
  secondaryColor = Colors.textMuted,
  tag,
  searchQuery
}: FlashcardItemProps) {
  const { playSound } = useAudio();

  const handlePlay = () => {
    if (onPlay) {
      onPlay();
    } else if (audioUri) {
      playSound(audioUri);
    } else {
      console.warn(`FlashcardItem: audioUri is missing for phrase "${vietnamese}"`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        {tag && (
          <View style={styles.tagWrapper}>
            <ThemedText style={styles.tagText}>{tag.toUpperCase()}</ThemedText>
          </View>
        )}
        <HighlightedText 
          text={vietnamese} 
          query={searchQuery} 
          style={[styles.vietnamese, { color: primaryColor }]} 
        />
        <HighlightedText 
          text={english} 
          query={searchQuery} 
          style={[styles.english, { color: secondaryColor }]} 
          highlightStyle={styles.highlightEnglish}
        />
      </View>

      {(onPlay || audioUri) && (
        <View style={styles.buttonWrapper}>
          <Pressable
            onPress={handlePlay}
            style={({ pressed }) => [
              styles.playButton,
              pressed && styles.pressed
            ]}
          >
            <Volume2 size={24} color={Stroke.color} strokeWidth={2.5} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 88,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    borderRadius: BorderRadius.card,
    padding: 16,
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
    marginRight: Shadow.offset,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  vietnamese: {
    fontSize: 22,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    lineHeight: 30, // Prevents accent clipping
    marginBottom: 2,
  },
  english: {
    fontSize: 14,
    fontFamily: 'BeVietnamPro_600SemiBold',
    color: Colors.white,
    fontStyle: 'italic',
  },
  highlight: {
    backgroundColor: Colors.brandSecondary,
    fontFamily: 'BeVietnamPro_900Black',
    color: Colors.black,
  },
  highlightEnglish: {
    fontStyle: 'italic', // Maintain italic for english matches
  },
  buttonWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: Colors.brandSecondary,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    alignItems: 'center',
    justifyContent: 'center',
    // Smaller hard shadow for the button itself
    shadowColor: Shadow.color,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  tagWrapper: {
    backgroundColor: Colors.brandSecondary,
    borderWidth: 1.5,
    borderColor: Stroke.color,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  tagText: {
    fontSize: 10,
    fontFamily: 'BeVietnamPro_900Black',
    color: Colors.black,
  },
  pressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    shadowOffset: { width: 0, height: 0 },
  },
});
