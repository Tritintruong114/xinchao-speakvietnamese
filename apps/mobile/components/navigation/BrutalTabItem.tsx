import { BookMarked, House, LucideIcon, UserRound } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Colors, Shadow, Stroke } from '../../constants/Theme';
import { ThemedText } from '../ThemedText';

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
          color={Colors.black}
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
    backgroundColor: Colors.brandSecondary,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    // Hard shadow
    shadowColor: Shadow.color,
    shadowOffset: { width: Shadow.offset, height: Shadow.offset },
    shadowOpacity: Shadow.opacity,
    shadowRadius: 0,
    elevation: Shadow.offset,
  },
  label: {
    fontSize: 11,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: Colors.textMuted,
    marginTop: 6,
  },
  activeLabel: {
    color: Colors.black,
    fontFamily: 'BeVietnamPro_900Black',
  },
});
