import { OnboardingLayout } from '@/components/OnboardingLayout';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import {
  HomeQuickBadgesSkeleton,
  HomeSectionTitleSkeleton,
} from '@/components/skeletons/HomeSurvivalSkeleton';
import { NeoBrutalPulseBlock } from '@/components/skeletons/NeoBrutalPulseBlock';
import { Colors } from '@/constants/Theme';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

const CURATE_MS = 1500;

export default function CuratingScreen() {
  const router = useRouter();
  const { setSurvivalPackDownloaded } = useAppStore();
  const doneRef = useRef(false);

  const goNext = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setSurvivalPackDownloaded(true);
    router.push('./aha');
  }, [router, setSurvivalPackDownloaded]);

  useEffect(() => {
    const t = setTimeout(goNext, CURATE_MS);
    return () => clearTimeout(t);
  }, [goNext]);

  const footer = (
    <View style={styles.footer}>
      <ThemedButton title="SKIP" type="ghost" onPress={goNext} />
    </View>
  );

  return (
    <OnboardingLayout
      title="Đang chuẩn bị hành trang"
      description="Curating your street-smart vocabulary…"
      footer={footer}
      scrollEnabled={false}
    >
      <View style={styles.block}>
        <ThemedText style={styles.lead}>
          Đang chọn lọc các câu giao tiếp vỉa hè dành riêng cho bạn…
        </ThemedText>
        <HomeQuickBadgesSkeleton />
        <HomeSectionTitleSkeleton />
        <View style={styles.row}>
          <NeoBrutalPulseBlock width="47%" height={120} style={styles.pulse} />
          <NeoBrutalPulseBlock width="47%" height={120} style={styles.pulse} />
        </View>
        <NeoBrutalPulseBlock width="100%" height={14} style={styles.pulse} />
        <NeoBrutalPulseBlock width="85%" height={14} style={styles.pulse} />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  block: {
    width: '100%',
    flex: 1,
    paddingTop: 8,
  },
  lead: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 15,
    color: Colors.black,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
    marginBottom: 8,
  },
  pulse: {
    marginBottom: 12,
    backgroundColor: Colors.brandLavender,
  },
  footer: {
    width: '100%',
    paddingBottom: 24,
  },
});
