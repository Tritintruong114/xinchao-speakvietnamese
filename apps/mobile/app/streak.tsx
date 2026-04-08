import { Stack, useRouter } from 'expo-router';
import { Flame, Trophy, Wallet, ChevronRight, Share2, Info } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View, ScrollView, Pressable, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Stroke, Shadow, BorderRadius } from '../constants/Theme';
import { ThemedText } from '../components/ThemedText';
import { BrutalHeader } from '../components/navigation/BrutalHeader';
import { ThemedButton } from '../components/ThemedButton';

const { width } = Dimensions.get('window');

export default function StreakScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const weekDays = [
    { day: 'M', active: true },
    { day: 'T', active: true },
    { day: 'W', active: true },
    { day: 'T', active: true },
    { day: 'F', active: true },
    { day: 'S', active: false },
    { day: 'S', active: false },
  ];

  return (
    <View style={styles.outerContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <BrutalHeader 
        title="STATISTICS" 
        showBackButton 
        titleAlignment="left"
        rightAction={() => (
           <Pressable style={styles.headerAction}>
             <Share2 color={Colors.black} size={22} strokeWidth={2.5} />
           </Pressable>
        )}
      />

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Streak Card (Node V4f6f) */}
        <View style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <View style={styles.flameCircle}>
                <Flame size={40} color={Colors.black} fill={Colors.brandPrimary} strokeWidth={2} />
            </View>
            <View>
                <ThemedText style={styles.streakNumber}>12</ThemedText>
                <ThemedText style={styles.streakLabel}>DAY STREAK</ThemedText>
            </View>
          </View>

          {/* Week Grid */}
          <View style={styles.weekGrid}>
            {weekDays.map((d, i) => (
              <View key={i} style={styles.dayCol}>
                <View style={[
                  styles.dayDot, 
                  d.active ? styles.dayDotActive : styles.dayDotInactive
                  ]}>
                  {d.active && <Flame size={12} color={Colors.black} fill={Colors.brandPrimary} />}
                </View>
                <ThemedText style={styles.dayText}>{d.day}</ThemedText>
              </View>
            ))}
          </View>

          <ThemedText style={styles.streakSub}>
            Learn 2 more days to unlock the secret chest!
          </ThemedText>
        </View>

        {/* 2. Stats Grid (Node ZUFBM) */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
             <View style={styles.statHeader}>
                <Trophy size={18} color={Colors.black} strokeWidth={2.5} />
                <ThemedText style={styles.statTitle}>RANK</ThemedText>
             </View>
             <ThemedText style={styles.statValue}>BRONZE II</ThemedText>
             <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '65%' }]} />
             </View>
          </View>

          <View style={styles.statCard}>
             <View style={styles.statHeader}>
                <Wallet size={18} color={Colors.black} strokeWidth={2.5} />
                <ThemedText style={styles.statTitle}>WALLET</ThemedText>
             </View>
             <ThemedText style={styles.statValue}>1,250 XP</ThemedText>
             <ThemedText style={styles.statDetail}>Top 15% this week</ThemedText>
          </View>
        </View>

        {/* 3. Shop Section (Node HKrPr) */}
        <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>SHOP REWARDS</ThemedText>
            <Info size={16} color={Colors.black} opacity={0.5} />
        </View>

        <View style={styles.shopItem}>
            <View style={styles.itemIconWrap}>
                 <ThemedText style={{ fontSize: 24 }}>🛡️</ThemedText>
            </View>
            <View style={styles.itemInfo}>
                <ThemedText style={styles.itemName}>STREAK FREEZE</ThemedText>
                <ThemedText style={styles.itemDesc}>Protect your streak for 24h</ThemedText>
            </View>
            <Pressable style={styles.buyBtn}>
                <ThemedText style={styles.buyBtnText}>200 XP</ThemedText>
            </Pressable>
        </View>

        <View style={styles.shopItem}>
            <View style={styles.itemIconWrap}>
                 <ThemedText style={{ fontSize: 24 }}>⚡</ThemedText>
            </View>
            <View style={styles.itemInfo}>
                <ThemedText style={styles.itemName}>XP BOOSTER</ThemedText>
                <ThemedText style={styles.itemDesc}>Double XP for 15 mins</ThemedText>
            </View>
            <Pressable style={styles.buyBtn}>
                <ThemedText style={styles.buyBtnText}>500 XP</ThemedText>
            </Pressable>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom CTA (Node uzq5k) */}
      <View style={[
        styles.bottomBar,
        { paddingBottom: Math.max(insets.bottom, 16) + 16 }
      ]}>
        <ThemedButton 
          title="KEEP LEARNING" 
          onPress={() => router.replace('/(tabs)')}
          type="primary"
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  headerAction: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakCard: {
    backgroundColor: Colors.brandMint,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    borderRadius: BorderRadius.card,
    padding: 20,
    marginBottom: 20,
    // Hard Shadow
    shadowColor: Shadow.color,
    shadowOffset: { width: Shadow.offset, height: Shadow.offset },
    shadowOpacity: Shadow.opacity,
    shadowRadius: 0,
    elevation: Shadow.offset,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  flameCircle: {
      width: 64,
      height: 64,
      backgroundColor: Colors.white,
      borderRadius: 32,
      borderWidth: 2,
      borderColor: Colors.black,
      alignItems: 'center',
      justifyContent: 'center',
  },
  streakNumber: {
    fontSize: 48,
    fontFamily: 'BeVietnamPro_900Black',
    color: Colors.black,
    lineHeight: 48,
  },
  streakLabel: {
    fontSize: 14,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: Colors.black,
  },
  weekGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayCol: {
    alignItems: 'center',
    gap: 8,
  },
  dayDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDotActive: {
    backgroundColor: Colors.brandMint,
  },
  dayDotInactive: {
    backgroundColor: Colors.white,
    opacity: 0.3,
  },
  dayText: {
    fontSize: 12,
    fontFamily: 'BeVietnamPro_700Bold',
    color: Colors.black,
  },
  streakSub: {
    fontSize: 13,
    fontFamily: 'BeVietnamPro_700Bold',
    color: Colors.black,
    textAlign: 'center',
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    borderRadius: BorderRadius.card,
    padding: 14,
    // Hard Shadow
    shadowColor: Shadow.color,
    shadowOffset: { width: Shadow.offset, height: Shadow.offset },
    shadowOpacity: Shadow.opacity,
    shadowRadius: 0,
    elevation: Shadow.offset,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 12,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: Colors.black,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'BeVietnamPro_900Black',
    color: Colors.black,
    marginBottom: 8,
  },
  statDetail: {
    fontSize: 10,
    color: Colors.black,
    opacity: 0.6,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.black,
    overflow: 'hidden',
  },
  progressFill: {
     height: '100%',
     backgroundColor: Colors.brandPrimary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: Colors.black,
    textTransform: 'uppercase',
  },
  shopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    borderRadius: BorderRadius.card,
    padding: 12,
    marginBottom: 12,
    // Hard Shadow
    shadowColor: Shadow.color,
    shadowOffset: { width: Shadow.offset, height: Shadow.offset },
    shadowOpacity: Shadow.opacity,
    shadowRadius: 0,
    elevation: Shadow.offset,
  },
  itemIconWrap: {
    width: 48,
    height: 48,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: Colors.black,
  },
  itemDesc: {
    fontSize: 11,
    color: Colors.black,
    opacity: 0.6,
  },
  buyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.brandSecondary,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: 8,
  },
  buyBtnText: {
    fontSize: 12,
    fontFamily: 'BeVietnamPro_900Black',
    color: Colors.black,
  },
  bottomBar: {
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: Stroke.width,
    borderTopColor: Stroke.color,
  },
});
