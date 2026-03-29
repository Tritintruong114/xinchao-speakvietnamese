import { Colors, Stroke } from '../../constants/Theme';
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
  backgroundColor = Colors.white,
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
        paddingTop: Math.max(insets.top, 16),
        borderBottomWidth: hideBorder ? 0 : Stroke.width,
        backgroundColor: backgroundColor
      }
    ]}>
      <View style={[
        styles.header, 
        isLeft ? styles.headerLeft : styles.headerCenter
      ]}>
        <View style={styles.leftSlot}>
          {renderLeft()}
        </View>

        <View style={styles.contentSlot}>
          {title && (
            <ThemedText style={[
              styles.title, 
              isLeft && styles.titleLeft
            ]}>
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
    backgroundColor: Colors.white,
    borderBottomWidth: Stroke.width,
    borderBottomColor: Stroke.color,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    minHeight: 64,
  },
  headerCenter: {
    justifyContent: 'space-between',
  },
  headerLeft: {
    justifyContent: 'flex-start',
    gap: 16,
  },
  leftSlot: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  contentSlot: {
    flex: 1,
    justifyContent: 'center',
  },
  rightSlot: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  title: {
    fontFamily: 'BeVietnamPro_900Black',
    fontSize: 18,
    color: Colors.black,
    textAlign: 'center',
  },
  titleLeft: {
    fontSize: 30,
    textAlign: 'left',
    lineHeight: 34, // Added to prevent cutting
  },
});
