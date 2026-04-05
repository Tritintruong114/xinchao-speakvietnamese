import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/Theme';
import { ThemedText } from '@/components/ThemedText';

interface BrutalistTooltipProps {
  text: string;
}

export function BrutalistTooltip({ text }: BrutalistTooltipProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.bubble}>
        <ThemedText type="body" style={styles.text}>
          {text}
        </ThemedText>
      </View>
      <View style={styles.pointer} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  bubble: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.black,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  text: {
    fontSize: 13,
    lineHeight: 17,
    color: Colors.black,
    fontWeight: '700',
  },
  pointer: {
    width: 14,
    height: 14,
    marginRight: 24,
    marginTop: -3,
    backgroundColor: Colors.white,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: Colors.black,
    transform: [{ rotate: '-45deg' }],
  },
});

