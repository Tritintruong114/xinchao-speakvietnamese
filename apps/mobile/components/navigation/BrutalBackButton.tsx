import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { Colors, Stroke, Shadow, BorderRadius } from '../../constants/Theme';

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
        <ChevronLeft size={24} color={Colors.black} strokeWidth={2.5} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    backgroundColor: Colors.white,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    borderRadius: BorderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
    // Hard shadow
    shadowColor: Shadow.color,
    shadowOffset: { width: Shadow.offset, height: Shadow.offset },
    shadowOpacity: Shadow.opacity,
    shadowRadius: 0,
    elevation: Shadow.offset,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    transform: [{ translateX: Shadow.offset / 2 }, { translateY: Shadow.offset / 2 }],
    shadowOffset: { width: Shadow.offset / 2, height: Shadow.offset / 2 },
    elevation: Shadow.offset / 2,
  },
});
