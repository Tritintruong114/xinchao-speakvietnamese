import React from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/Theme';
import { ThemedText } from '@/components/ThemedText';

interface TravelOptionCardProps {
  title: string;
  subtitle: string;
  image?: ImageSourcePropType;
  emoji?: string;
  onPress?: () => void;
  highlighted?: boolean;
}

export function TravelOptionCard({
  title,
  subtitle,
  image,
  emoji,
  onPress,
  highlighted = false,
}: TravelOptionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        highlighted ? styles.highlighted : styles.defaultCard,
        pressed && styles.pressed,
      ]}
    >
      {image ? (
        <Image source={image} style={styles.image} resizeMode="contain" />
      ) : (
        <View style={styles.emojiBadge}>
          <ThemedText style={styles.emoji}>{emoji ?? '✨'}</ThemedText>
        </View>
      )}
      <View style={styles.textBlock}>
        <ThemedText type="h2" color={highlighted ? Colors.white : Colors.black} style={styles.title}>
          {title}
        </ThemedText>
        <ThemedText type="body" color={highlighted ? Colors.white : Colors.textMain} style={styles.subtitle}>
          {subtitle}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.black,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 96,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  defaultCard: {
    backgroundColor: Colors.white,
  },
  highlighted: {
    backgroundColor: Colors.brandPrimary,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  emojiBadge: {
    width: 72,
    height: 72,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.brandSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 28,
  },
  textBlock: {
    flex: 1,
    paddingLeft: 12,
  },
  title: {
    marginBottom: 2,
    fontSize: 18,
    lineHeight: 22,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 17,
  },
  pressed: {
    transform: [{ translateX: 1 }, { translateY: 1 }],
  },
});

