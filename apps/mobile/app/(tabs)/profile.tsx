import type { Href } from 'expo-router';
import { useNavigation, useRouter } from 'expo-router';
import { deleteUser } from 'firebase/auth';
import { ChevronRight, Flame, Settings, Star, User } from 'lucide-react-native';
import React, { useCallback, useLayoutEffect } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { BorderRadius, Colors, Shadow, Stroke } from '../../constants/Theme';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../lib/firebase';
import { restorePurchasesWithOutcome } from '../../lib/purchases';
import { supabase } from '../../lib/supabase';
import { useAppStore } from '../../store/useAppStore';
import { useToastStore } from '../../store/useToastStore';

type SettingsKey = 'restore' | 'privacy' | 'terms' | 'cookies' | 'support' | 'delete';

const settingsItems: {
  key: SettingsKey;
  title: string;
  color: string;
  url?: string;
  isLast?: boolean;
}[] = [
  { key: 'restore', title: 'Restore Purchases', color: Colors.black },
  { key: 'privacy', title: 'Privacy Policy', color: Colors.black, url: 'https://www.xinchao.app/privacy' },
  { key: 'terms', title: 'Terms & Conditions', color: Colors.black, url: 'https://www.xinchao.app/terms' },
  { key: 'cookies', title: 'Cookie Policy', color: Colors.black, url: 'https://www.xinchao.app/cookie-policy' },
  { key: 'support', title: 'Contact Support', color: Colors.black, url: 'https://www.xinchao.app/contact' },
  { key: 'delete', title: 'Delete Account', color: Colors.brandPrimary, isLast: true },
];

export default function ProfileScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { user } = useAuth();
  const displayStreak = useAppStore((s) => s.displayStreak);
  const displayXp = useAppStore((s) => s.displayXp);
  const resetLocalProgressForAccountDeletion = useAppStore((s) => s.resetLocalProgressForAccountDeletion);
  const showToast = useToastStore((s) => s.showToast);

  const isAnonymous = user?.isAnonymous ?? true;
  const headLine = isAnonymous
    ? 'GUEST LEARNER'
    : user?.displayName || user?.email?.split('@')[0] || 'LEARNER';
  const subLine = isAnonymous
    ? 'Anonymous account'
    : user?.email || 'Signed in';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'HO SO',
      headerHideBorder: true,
      titleAlignment: 'left',
      headerRight: () => null,
    });
  }, [navigation]);

  const onRestorePurchases = useCallback(async () => {
    const outcome = await restorePurchasesWithOutcome();
    if (outcome === 'restored') {
      showToast('Đã khôi phục gói mua của bạn.', 'success', 3);
      return;
    }
    if (outcome === 'empty') {
      showToast('Không tìm thấy gói mua nào để khôi phục.', 'warning', 4);
      return;
    }
    showToast('Không thể khôi phục lúc này. Thử lại sau.', 'error', 3);
  }, [showToast]);

  const performDeleteAccount = useCallback(async () => {
    const u = auth.currentUser;
    if (!u) {
      showToast('Chưa có phiên đăng nhập.', 'warning', 3);
      return;
    }
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', u.uid);
      if (error) console.warn('[profile] delete profile row', error);
    } catch (e) {
      console.warn('[profile] delete profile', e);
    }
    try {
      resetLocalProgressForAccountDeletion();
      await deleteUser(u);
      showToast('Đã xóa tài khoản.', 'success', 3);
    } catch (e: unknown) {
      const code =
        e && typeof e === 'object' && 'code' in e ? String((e as { code: string }).code) : '';
      if (code === 'auth/requires-recent-login') {
        showToast(
          'Cần đăng nhập lại gần đây để xóa tài khoản. Hãy đăng xuất, đăng nhập lại rồi thử xóa.',
          'warning',
          5,
        );
        return;
      }
      showToast('Không xóa được tài khoản. Thử lại sau.', 'error', 4);
    }
  }, [resetLocalProgressForAccountDeletion, showToast]);

  const onDeleteAccount = useCallback(() => {
    Alert.alert(
      'Xóa tài khoản?',
      'Bạn có chắc muốn xóa toàn bộ XP, streak và dữ liệu hồ sơ trên máy chủ? Hành động này không thể hoàn tác.',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: () => void performDeleteAccount() },
      ],
    );
  }, [performDeleteAccount]);

  const handleSettingsPress = useCallback(
    (item: (typeof settingsItems)[0]) => {
      switch (item.key) {
        case 'restore':
          void onRestorePurchases();
          return;
        case 'delete':
          onDeleteAccount();
          return;
        default:
          if (item.url) {
            Linking.openURL(item.url).catch((err) => console.error("Couldn't load page", err));
          }
      }
    },
    [onDeleteAccount, onRestorePurchases],
  );

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsCard}>
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <User size={40} color={Colors.black} strokeWidth={2.5} />
            </View>
            <View style={styles.userInfo}>
              <ThemedText style={styles.userLabel}>{headLine}</ThemedText>
              <ThemedText style={styles.userSub}>{subLine}</ThemedText>
            </View>
          </View>

          <View style={styles.statGrid}>
            <View style={styles.statBox}>
              <Flame size={20} color={Colors.black} fill={Colors.brandPrimary} strokeWidth={2.5} />
              <ThemedText style={styles.statValue}>
                {displayStreak} DAY STREAK
              </ThemedText>
            </View>
            <View style={styles.statBox}>
              <Star size={20} color={Colors.black} strokeWidth={2.5} />
              <ThemedText style={styles.statValue}>{displayXp} XP</ThemedText>
            </View>
          </View>
        </View>

        {isAnonymous ? (
          <View style={styles.ctaCard}>
            <ThemedText style={styles.ctaTitle}>SAVE YOUR{'\n'}PROGRESS!</ThemedText>
            <ThemedText style={styles.ctaSub}>
              Create an account to save your XP and streaks before you lose them.
            </ThemedText>
            <Pressable
              style={styles.ctaBtn}
              onPress={() => router.push('/(auth)/link-account' as Href)}
            >
              <ThemedText style={styles.ctaBtnText}>SIGN UP / LOG IN</ThemedText>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.settingsHeaderRow}>
          <Settings size={18} color={Colors.black} strokeWidth={2.5} />
          <ThemedText style={styles.settingsHeader}>SETTINGS</ThemedText>
        </View>

        <View style={styles.legalBlock}>
          {settingsItems.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => handleSettingsPress(item)}
              style={[styles.listItem, !item.isLast && styles.listItemBorder]}
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
  settingsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  settingsHeader: {
    fontSize: 10,
    fontFamily: 'BeVietnamPro_900Black',
    color: Colors.black,
    letterSpacing: 0.6,
  },
  legalBlock: {
    backgroundColor: '#FAFAF8',
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
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
