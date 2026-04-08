import { useNavigation } from 'expo-router';
import { ChevronRight, Flame, Settings, Star, User } from 'lucide-react-native';
import React, { useLayoutEffect } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { BorderRadius, Colors, Shadow, Stroke } from '../../constants/Theme';

export default function ProfileScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'HO SO',
      headerHideBorder: true,
      titleAlignment: 'left',
      headerRight: () => null,
    });
  }, [navigation]);

  const settingsItems = [
    { title: 'Restore Purchases', color: Colors.black },
    { title: 'Privacy Policy', color: Colors.black, url: 'https://xinchao.tuhocproduct.com/privacy' },
    { title: 'Terms & Conditions', color: Colors.black, url: 'https://xinchao.tuhocproduct.com/terms' },
    { title: 'Cookie Policy', color: Colors.black, url: 'https://xinchao.tuhocproduct.com/cookie-policy' },
    { title: 'Contact Support', color: Colors.black, url: 'https://xinchao.tuhocproduct.com/contact' },
    { title: 'Delete Account', color: Colors.brandPrimary, isLast: true },
  ];

  const handlePress = (item: typeof settingsItems[0]) => {
    if (item.url) {
      Linking.openURL(item.url).catch(err => console.error("Couldn't load page", err));
    } else {
      // Handle other actions like Delete Account or Restore Purchases
      console.log('Action for:', item.title);
    }
  };

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
               <User size={40} color={Colors.black} strokeWidth={2.5} />
            </View>
            <View style={styles.userInfo}>
               <ThemedText style={styles.userLabel}>GUEST LEARNER</ThemedText>
               <ThemedText style={styles.userSub}>Anonymous account</ThemedText>
            </View>
          </View>

          <View style={styles.statGrid}>
            <View style={styles.statBox}>
               <Flame size={20} color={Colors.black} fill={Colors.brandPrimary} strokeWidth={2.5} />
               <ThemedText style={styles.statValue}>12 DAY STREAK</ThemedText>
            </View>
            <View style={styles.statBox}>
               <Star size={20} color={Colors.black} strokeWidth={2.5} />
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
              onPress={() => handlePress(item)}
              style={[
                styles.listItem, 
                !item.isLast && styles.listItemBorder
              ]}
            >
              <ThemedText style={[styles.listItemText, { color: item.color }]}>
                {item.title}
              </ThemedText>
              <ChevronRight size={18} color={Colors.black} strokeWidth={2.5} />
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
    backgroundColor: Colors.bgPrimary,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 8,
  },
  statsCard: {
    backgroundColor: '#FAFAF8',
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    borderRadius: BorderRadius.card,
    padding: 12,
    marginBottom: 20,
    // Hard Shadow
    shadowColor: Shadow.color,
    shadowOffset: { width: Shadow.offset, height: Shadow.offset },
    shadowOpacity: Shadow.opacity,
    shadowRadius: 0,
    elevation: Shadow.offset,
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
    backgroundColor: Colors.white,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    borderRadius: BorderRadius.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userLabel: {
    fontSize: 20,
    fontFamily: 'BeVietnamPro_900Black',
    color: Colors.black,
  },
  userSub: {
    fontSize: 12,
    color: Colors.black,
    opacity: 0.6,
  },
  statGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    height: 74,
    backgroundColor: Colors.brandMint,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    borderRadius: BorderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    gap: 4,
    // Hard Shadow
    shadowColor: Shadow.color,
    shadowOffset: { width: Shadow.offset, height: Shadow.offset },
    shadowOpacity: Shadow.opacity,
    shadowRadius: 0,
    elevation: Shadow.offset,
  },
  statValue: {
    fontSize: 10,
    fontFamily: 'BeVietnamPro_900Black',
    color: Colors.black,
    textAlign: 'center',
  },
  ctaCard: {
    backgroundColor: Colors.brandPrimary,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    borderRadius: BorderRadius.card,
    padding: 24,
    marginBottom: 24,
    // Hard Shadow
    shadowColor: Shadow.color,
    shadowOffset: { width: Shadow.offset, height: Shadow.offset },
    shadowOpacity: Shadow.opacity,
    shadowRadius: 0,
    elevation: Shadow.offset,
  },
  ctaTitle: {
    fontSize: 28,
    fontFamily: 'BeVietnamPro_900Black',
    color: Colors.white,
    lineHeight: 32,
    marginBottom: 8,
  },
  ctaSub: {
    fontSize: 13,
    color: Colors.white,
    marginBottom: 20,
    opacity: 0.9,
    lineHeight: 18,
    fontFamily: 'BeVietnamPro_700Bold',
  },
  ctaBtn: {
    height: 52,
    backgroundColor: Colors.brandMint,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // Hard Shadow
    shadowColor: Shadow.color,
    shadowOffset: { width: Shadow.offset, height: Shadow.offset },
    shadowOpacity: Shadow.opacity,
    shadowRadius: 0,
    elevation: Shadow.offset,
  },
  ctaBtnText: {
    fontSize: 16,
    fontFamily: 'BeVietnamPro_900Black',
    color: Colors.black,
  },
  legalBlock: {
    backgroundColor: '#FAFAF8',
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
    // Hard Shadow
    shadowColor: Shadow.color,
    shadowOffset: { width: Shadow.offset, height: Shadow.offset },
    shadowOpacity: Shadow.opacity,
    shadowRadius: 0,
    elevation: Shadow.offset,
  },
  listItem: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  listItemBorder: {
    borderBottomWidth: Stroke.width,
    borderBottomColor: Stroke.color,
  },
  listItemText: {
    fontSize: 14,
    fontFamily: 'BeVietnamPro_800ExtraBold',
  },
});
