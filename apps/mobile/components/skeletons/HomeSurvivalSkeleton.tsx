import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { NeoBrutalPulseBlock } from './NeoBrutalPulseBlock';
import { BorderRadius, Colors, Stroke } from '../../constants/Theme';

const { width } = Dimensions.get('window');
const CARD_W = (width - 48) / 2;
const IMG_H = CARD_W * (2 / 3);

export function HomeQuickBadgesSkeleton() {
  const half = (width - 48 - 12) / 2;
  return (
    <View style={styles.badgeRow}>
      <NeoBrutalPulseBlock width={half} height={48} style={styles.noMb} />
      <NeoBrutalPulseBlock width={half} height={48} style={styles.noMb} />
    </View>
  );
}

export function HomeSectionTitleSkeleton() {
  return <NeoBrutalPulseBlock width={width * 0.72} height={18} style={styles.sectionTitleBar} />;
}

function HomeModuleCardSkeleton() {
  return (
    <View style={styles.cardCol}>
      <NeoBrutalPulseBlock width={CARD_W} height={IMG_H} style={styles.noMb} />
      <NeoBrutalPulseBlock width={CARD_W} height={54} style={styles.noMb} />
    </View>
  );
}

export function HomeSurvivalSkeletonGrid() {
  return (
    <View style={styles.grid}>
      <HomeModuleCardSkeleton />
      <HomeModuleCardSkeleton />
      <HomeModuleCardSkeleton />
      <HomeModuleCardSkeleton />
    </View>
  );
}

const styles = StyleSheet.create({
  badgeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardCol: {
    width: CARD_W + 4,
  },
  noMb: {
    marginBottom: 0,
    backgroundColor: Colors.brandCyan,
    borderRadius: BorderRadius.card,
    borderWidth: Stroke.width,
  },
  sectionTitleBar: {
    marginBottom: 16,
    backgroundColor: Colors.brandCyan,
    borderRadius: BorderRadius.card,
    borderWidth: Stroke.width,
  },
});
