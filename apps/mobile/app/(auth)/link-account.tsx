import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Stroke } from '@/constants/Theme';
import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';
import { useToastStore } from '@/store/useToastStore';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import {
  GoogleAuthProvider,
  OAuthProvider,
  linkWithCredential,
  updateProfile,
} from 'firebase/auth';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function LinkAccountScreen() {
  const router = useRouter();
  const showToast = useToastStore((s) => s.showToast);
  const [busyApple, setBusyApple] = useState(false);
  const [busyGoogle, setBusyGoogle] = useState(false);

  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
  const [googleRequest, googleResponse, promptGoogle] = Google.useIdTokenAuthRequest({
    webClientId: webClientId || undefined,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  const upsertProfileAfterLink = useCallback(async () => {
    const u = auth.currentUser;
    if (!u) return;
    const displayName =
      u.displayName || u.email?.split('@')[0] || 'Learner';
    const { error } = await supabase
      .from('profiles')
      .update({
        email: u.email ?? null,
        display_name: displayName,
      })
      .eq('id', u.uid);
    if (error) console.warn('[link-account] profile update', error);
  }, []);

  const finishLink = useCallback(async () => {
    await upsertProfileAfterLink();
    showToast('Đã liên kết tài khoản. Tiến trình của bạn đã được bảo vệ!', 'success', 3);
    router.replace('/(tabs)/profile');
  }, [router, showToast, upsertProfileAfterLink]);

  useEffect(() => {
    const run = async () => {
      if (googleResponse?.type !== 'success') return;
      const idToken =
        googleResponse.params.id_token ??
        (googleResponse.params as Record<string, string>).id_token;
      if (!idToken || !auth.currentUser) {
        showToast('Đăng nhập Google không thành công.', 'error', 3);
        return;
      }
      setBusyGoogle(true);
      try {
        const credential = GoogleAuthProvider.credential(idToken);
        await linkWithCredential(auth.currentUser, credential);
        await finishLink();
      } catch (e: unknown) {
        const code = e && typeof e === 'object' && 'code' in e ? String((e as { code: string }).code) : '';
        if (code === 'auth/credential-already-in-use') {
          showToast('Email này đã gắn với tài khoản khác.', 'warning', 4);
        } else {
          showToast('Liên kết Google thất bại. Thử lại nhé.', 'error', 3);
        }
      } finally {
        setBusyGoogle(false);
      }
    };
    void run();
  }, [googleResponse, finishLink, showToast]);

  const onApple = async () => {
    if (!auth.currentUser) return;
    setBusyApple(true);
    try {
      const available = await AppleAuthentication.isAvailableAsync();
      if (!available) {
        showToast('Đăng nhập Apple chỉ khả dụng trên iOS.', 'warning', 3);
        return;
      }
      const rawNonce =
        Math.random().toString(36).slice(2) + Date.now().toString(36);
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        rawNonce,
        { encoding: Crypto.CryptoEncoding.HEX },
      );
      const apple = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });
      if (!apple.identityToken) {
        showToast('Apple không trả token. Thử lại nhé.', 'error', 3);
        return;
      }
      const appleDisplay =
        [apple.fullName?.givenName, apple.fullName?.familyName]
          .filter(Boolean)
          .join(' ')
          .trim() || '';

      const provider = new OAuthProvider('apple.com');
      const credential = provider.credential({
        idToken: apple.identityToken,
        rawNonce,
      });
      await linkWithCredential(auth.currentUser, credential);
      const u = auth.currentUser;
      if (u && appleDisplay) {
        await updateProfile(u, { displayName: appleDisplay });
      }
      await finishLink();
    } catch (e: unknown) {
      const code =
        e && typeof e === 'object' && 'code' in e ? String((e as { code: string }).code) : '';
      if (code === 'ERR_REQUEST_CANCELED' || code === 'ERR_CANCELED') return;
      if (code === 'auth/credential-already-in-use') {
        showToast('Apple ID này đã gắn với tài khoản khác.', 'warning', 4);
        return;
      }
      showToast('Liên kết Apple thất bại. Thử lại nhé.', 'error', 3);
    } finally {
      setBusyApple(false);
    }
  };

  const onGoogle = () => {
    if (!webClientId?.trim()) {
      showToast('Google Sign-In chưa cấu hình trên bản build này.', 'warning', 4);
      return;
    }
    if (!googleRequest) {
      showToast('Chưa sẵn sàng đăng nhập Google.', 'warning', 3);
      return;
    }
    void promptGoogle();
  };

  const working = busyApple || busyGoogle;

  return (
    <View style={styles.container}>
      <ThemedText type="body" style={styles.lead}>
        Liên kết Apple hoặc Google để lưu XP và streak — không mất tiến trình khi đổi máy.
      </ThemedText>

      {Platform.OS === 'ios' ? (
        <ThemedButton
          title="CONTINUE WITH APPLE"
          type="secondary"
          onPress={() => void onApple()}
          disabled={working}
          style={styles.btn}
        />
      ) : null}

      <ThemedButton
        title="CONTINUE WITH GOOGLE"
        type="primary"
        onPress={onGoogle}
        disabled={working || !webClientId.trim()}
        style={styles.btn}
      />

      {working ? (
        <View style={styles.busy}>
          <ActivityIndicator size="small" color={Colors.brandPrimary} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
    padding: 24,
    paddingTop: 16,
  },
  lead: {
    marginBottom: 28,
    lineHeight: 22,
  },
  btn: {
    marginBottom: 16,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
  },
  busy: {
    marginTop: 8,
    alignItems: 'center',
  },
});
