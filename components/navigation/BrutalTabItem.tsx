import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { Colors, Spacing } from '../../constants/Theme';
import { ThemedText } from '../ThemedText';
import { House, LucideIcon, BookMarked, UserRound } from 'lucide-react-native';

interface BrutalTabItemProps {
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  routeName: string;
  label: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  index: House,
  pocket: BookMarked,
  profile: UserRound,
};

export function BrutalTabItem({ 
  isFocused, 
  onPress, 
  onLongPress, 
  routeName, 
  label 
}: BrutalTabItemProps) {
  const Icon = ICON_MAP[routeName] || House;
  
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.container}
    >
      <View style={[
        styles.iconWrapper,
        isFocused && styles.activeWrapper
      ]}>
        <Icon 
          size={isFocused ? 20 : 24} 
          color="#1A1A1A" 
          strokeWidth={2.5}
        />
      </View>
      <ThemedText style={[styles.label, isFocused && styles.activeLabel]}>
        {label.toUpperCase()}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  activeWrapper: {
    backgroundColor: '#FFC62F',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    // Hard shadow
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  label: {
    fontSize: 11,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: '#666666',
    marginTop: 6,
  },
  activeLabel: {
    color: '#1A1A1A',
    fontFamily: 'BeVietnamPro_900Black',
  },
});
