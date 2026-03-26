import React, { useLayoutEffect } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { Colors } from '../../constants/Theme';
import { ThemedText } from '../../components/ThemedText';
import { Settings, ChevronRight, Flame, Star, User } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import { StatusBadge } from '../../components/StatusBadge';

export default function ProfileScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'PROFILE',
      headerHideBorder: true,
      titleAlignment: 'left',
      headerRight: () => (
        <Pressable style={styles.headerSettingsBtn}>
          <Settings color="#1A1A1A" size={22} strokeWidth={2.5} />
        </Pressable>
      ),
    });
  }, [navigation]);

  const settingsItems = [
    { title: 'Restore Purchases', color: '#1A1A1A' },
    { title: 'Privacy Policy', color: '#1A1A1A' },
    { title: 'Contact Support', color: '#1A1A1A' },
    { title: 'Delete Account', color: Colors.brandPrimary, isLast: true },
  ];

  return (
    <View style={styles.outerContainer}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Identity & Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.userRow}>
            <View style={styles.avatar}>
               <User size={40} color="#1A1A1A" strokeWidth={2.5} />
            </View>
            <View style={styles.userInfo}>
               <ThemedText style={styles.userLabel}>GUEST LEARNER</ThemedText>
               <ThemedText style={styles.userSub}>Anonymous account</ThemedText>
            </View>
          </View>

          <View style={styles.statGrid}>
            <View style={styles.statBox}>
               <Flame size={20} color="#1A1A1A" strokeWidth={2.5} />
               <ThemedText style={styles.statValue}>12 DAY STREAK</ThemedText>
            </View>
            <View style={styles.statBox}>
               <Star size={20} color="#1A1A1A" strokeWidth={2.5} />
               <ThemedText style={styles.statValue}>150 XP</ThemedText>
            </View>
          </View>
        </View>

        {/* 2. Urgent CTA - Save Progress */}
        <View style={styles.ctaCard}>
          <ThemedText style={styles.ctaTitle}>SAVE YOUR{"\n"}PROGRESS!</ThemedText>
          <ThemedText style={styles.ctaSub}>
            Create an account to save your XP and streaks before you lose them.
          </ThemedText>
          <Pressable style={styles.ctaBtn}>
            <ThemedText style={styles.ctaBtnText}>SIGN UP / LOG IN</ThemedText>
          </Pressable>
        </View>

        {/* 3. Settings List */}
        <View style={styles.legalBlock}>
          {settingsItems.map((item, index) => (
            <Pressable 
              key={item.title} 
              style={[
                styles.listItem, 
                !item.isLast && styles.listItemBorder
              ]}
            >
              <ThemedText style={[styles.listItemText, { color: item.color }]}>
                {item.title}
              </ThemedText>
              <ChevronRight size={18} color="#1A1A1A" strokeWidth={2.5} />
            </Pressable>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 8,
  },
  headerSettingsBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // Hard Shadow
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    // Hard Shadow
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 76,
    height: 76,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFace: {
    fontSize: 34,
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userLabel: {
    fontSize: 20,
    fontFamily: 'BeVietnamPro_900Black',
    color: '#1A1A1A',
  },
  userSub: {
    fontSize: 12,
    color: '#1A1A1A',
    opacity: 0.6,
  },
  statGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    height: 74,
    backgroundColor: Colors.brandSecondary,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    gap: 4,
    // Hard Shadow
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  statValue: {
    fontSize: 10,
    fontFamily: 'BeVietnamPro_900Black',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  ctaCard: {
    backgroundColor: Colors.brandPrimary,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    // Hard Shadow
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  ctaTitle: {
    fontSize: 28,
    fontFamily: 'BeVietnamPro_900Black',
    color: '#FFFFFF',
    lineHeight: 32,
    marginBottom: 8,
  },
  ctaSub: {
    fontSize: 13,
    color: '#FFFFFF',
    marginBottom: 20,
    opacity: 0.9,
    lineHeight: 18,
    fontFamily: 'BeVietnamPro_700Bold',
  },
  ctaBtn: {
    height: 52,
    backgroundColor: Colors.brandSecondary,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // Hard Shadow
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  ctaBtnText: {
    fontSize: 16,
    fontFamily: 'BeVietnamPro_900Black',
    color: '#1A1A1A',
  },
  legalBlock: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    overflow: 'hidden',
    // Hard Shadow
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  listItem: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  listItemBorder: {
    borderBottomWidth: 2,
    borderBottomColor: '#1A1A1A',
  },
  listItemText: {
    fontSize: 14,
    fontFamily: 'BeVietnamPro_800ExtraBold',
  },
});
