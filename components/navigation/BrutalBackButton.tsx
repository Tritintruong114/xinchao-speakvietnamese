import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { Colors } from '../../constants/Theme';

interface BrutalBackButtonProps {
  onPress: () => void;
}

export function BrutalBackButton({ onPress }: BrutalBackButtonProps) {
  return (
    <Pressable 
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
    >
      <View style={styles.iconContainer}>
        <ChevronLeft size={24} color="#1A1A1A" strokeWidth={2.5} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    // Hard shadow
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    shadowOffset: { width: 2, height: 2 },
    elevation: 2,
  },
});
