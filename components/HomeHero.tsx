import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Colors, Spacing } from '../constants/Theme';
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
          <Camera color="#FFFFFF" size={48} strokeWidth={2.5} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 6,
    paddingBottom: 6,
    marginBottom: 24,
    position: 'relative',
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
  hero: {
    backgroundColor: '#DA251D',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 12,
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
    color: '#FFFFFF',
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
