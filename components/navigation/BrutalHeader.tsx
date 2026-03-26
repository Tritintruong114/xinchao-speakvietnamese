import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../ThemedText';
import { BrutalBackButton } from './BrutalBackButton';

interface BrutalHeaderProps {
  title?: string;
  showBackButton?: boolean;
  leftAction?: React.ReactNode | (() => React.ReactNode);
  rightAction?: React.ReactNode | (() => React.ReactNode);
  hideBorder?: boolean;
  backgroundColor?: string;
  titleAlignment?: 'left' | 'center';
}

export function BrutalHeader({ 
  title, 
  showBackButton = false, 
  leftAction,
  rightAction,
  hideBorder = false,
  backgroundColor = '#FFFFFF',
  titleAlignment = 'center'
}: BrutalHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const renderLeft = () => {
    if (leftAction) {
      return typeof leftAction === 'function' ? leftAction() : leftAction;
    }
    if (showBackButton) return <BrutalBackButton onPress={() => router.back()} />;
    return null;
  };

  const renderRight = () => {
    if (rightAction) {
      return typeof rightAction === 'function' ? rightAction() : rightAction;
    }
    return null;
  };

  const isLeft = titleAlignment === 'left';

  return (
    <View style={[
      styles.safeContainer,
      { 
        paddingTop: insets.top > 0 ? insets.top : 16,
        borderBottomWidth: hideBorder ? 0 : 1,
        backgroundColor: backgroundColor
      }
    ]}>
      <View style={[styles.header, isLeft && { justifyContent: 'flex-start', gap: 12 }]}>
        <View style={isLeft ? styles.leftSlotCompact : styles.leftSlot}>
          {renderLeft()}
        </View>

        <View style={isLeft ? styles.leftTitleSlot : styles.centerSlot}>
          {title && (
            <ThemedText style={[styles.title, isLeft && styles.titleLeft]}>
              {title.toUpperCase()}
            </ThemedText>
          )}
        </View>

        <View style={styles.rightSlot}>
          {renderRight()}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
    zIndex: 1000,
  },
  header: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  leftSlot: {
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  leftSlotCompact: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  centerSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftTitleSlot: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightSlot: {
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  title: {
    fontFamily: 'BeVietnamPro_900Black',
    fontSize: 18,
    color: '#1A1A1A',
    textAlign: 'center',
  },
  titleLeft: {
    fontSize: 30,
    textAlign: 'left',
  },
});
