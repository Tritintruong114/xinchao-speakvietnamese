import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NeoBrutalPulseBlock } from './NeoBrutalPulseBlock';
import { Colors, Stroke } from '../../constants/Theme';

export function PocketChipsSkeleton() {
  return (
    <View style={styles.chipRow}>
      {[72, 88, 64, 96, 80].map((w, i) => (
        <NeoBrutalPulseBlock key={i} width={w} height={36} style={styles.chip} />
      ))}
    </View>
  );
}

function PocketFlashcardSkeleton() {
  return <NeoBrutalPulseBlock width="100%" height={112} style={styles.flashRow} />;
}

export function PocketListSkeleton() {
  return (
    <View style={styles.list}>
      {[0, 1, 2, 3, 4].map((i) => (
        <PocketFlashcardSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  chip: {
    marginBottom: 0,
    borderRadius: 8,
    backgroundColor: Colors.brandPink,
  },
  list: {
    paddingHorizontal: 16,
  },
  flashRow: {
    backgroundColor: Colors.brandMint,
    marginBottom: 12,
  },
});
