import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Colors, Spacing, Stroke, Shadow, BorderRadius } from '../constants/Theme';
import { ThemedText } from './ThemedText';
import { Camera } from 'lucide-react-native';

interface HomeHeroProps {
  onPress: () => void;
}

export function HomeHero({ onPress }: HomeHeroProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      {/* Shadow layer */}
      <View style={styles.shadow} />
      
      {/* Hero layer */}
      <View style={styles.hero}>
        <View style={styles.content}>
          <ThemedText style={styles.title}>SCAN MENU{"\n"}/ SIGNS</ThemedText>
          <ThemedText style={styles.subtext}>Camera translation & AI scoring</ThemedText>
        </View>
        <View style={styles.iconContainer}>
          <Camera color={Colors.white} size={48} strokeWidth={2.5} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    position: 'relative',
    width: '100%',
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
  hero: {
    backgroundColor: Colors.brandPrimary,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    borderRadius: BorderRadius.card,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 140,
  },
  content: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 30,
    fontFamily: 'BeVietnamPro_900Black',
    color: Colors.white,
    lineHeight: 34,
  },
  subtext: {
    fontSize: 12,
    fontFamily: 'BeVietnamPro_400Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
