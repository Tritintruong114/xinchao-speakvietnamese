import React from 'react';
import { Dimensions, Image, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { Colors, Stroke, Shadow, BorderRadius } from '../constants/Theme';

interface ModuleCardProps {
  title: string;
  image: ImageSourcePropType;
  backgroundColor: string;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // (TotalWidth - padding * 2 - gap) / 2
const IMAGE_HEIGHT = CARD_WIDTH * (2 / 3); // 3:2 Aspect Ratio

export function ModuleCard({ title, image, backgroundColor, onPress }: ModuleCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      {/* Shadow layer */}
      <View style={styles.shadow} />

      {/* Card layer */}
      <View style={[styles.card, { backgroundColor }]}>
        <View style={styles.imageContainer}>
          <Image 
            source={image} 
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <View style={styles.textContainer}>
          <ThemedText style={styles.title} numberOfLines={2}>
            {title.toUpperCase()}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH + Shadow.offset,
    marginBottom: 20,
  },
  shadow: {
    position: 'absolute',
    top: Shadow.offset,
    left: Shadow.offset,
    right: 0,
    bottom: 0,
    borderRadius: BorderRadius.card,
    backgroundColor: Shadow.color,
    zIndex: -1,
  },
  card: {
    width: CARD_WIDTH,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    borderRadius: BorderRadius.card,
    overflow: 'hidden', // Contain the image within borders
  },
  imageContainer: {
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: Stroke.width,
    borderBottomColor: Stroke.color,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    padding: 12,
    minHeight: 54,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontFamily: 'BeVietnamPro_900Black',
    color: Colors.black,
    lineHeight: 18,
  },
});
