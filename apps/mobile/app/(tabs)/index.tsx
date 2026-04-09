import { useFocusEffect } from '@react-navigation/native';
import { useNavigation, useRouter } from 'expo-router';
import { Flame, Banknote, Camera, Wifi, WifiOff } from 'lucide-react-native';
import React, { useCallback, useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ModuleCard } from '../../components/ModuleCard';
import { NetworkErrorState } from '../../components/network/NetworkErrorState';
import {
  HomeQuickBadgesSkeleton,
  HomeSectionTitleSkeleton,
  HomeSurvivalSkeletonGrid,
} from '../../components/skeletons/HomeSurvivalSkeleton';
import { StatusBadge } from '../../components/StatusBadge';
import { ThemedText } from '../../components/ThemedText';
import { Colors } from '../../constants/Theme';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { useSurvivalModulesForHome } from '../../hooks/useSurvivalModulesForHome';
import { resolveSurvivalCoverImage } from '../../lib/localModuleImages';
import { SurvivalStore } from '../../store/survivalStore';

export default function HomeScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { sections, syncModules, refresh, isLoading } = useSurvivalModulesForHome();
  const { isOffline, refresh: refreshNet } = useNetworkStatus();

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void (async () => {
        await SurvivalStore.ensureHydrated();
        if (!active) return;
        await syncModules();
        if (active) refresh();
      })();
      return () => {
        active = false;
      };
    }, [syncModules, refresh]),
  );

  const moduleCount = sections.reduce((n, s) => n + s.modules.length, 0);
  /** Skeleton only when online sync would leave grid empty (no bundle/cache yet). */
  const showOnlineSkeleton = isLoading && !isOffline && moduleCount === 0;
  const showEmptyOffline = isOffline && moduleCount === 0;

  const retryNetworkAndSync = useCallback(async () => {
    await refreshNet();
    await SurvivalStore.ensureHydrated();
    await syncModules();
    refresh();
  }, [refreshNet, syncModules, refresh]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'XIN CHÀO',
      headerHideBorder: true,
      headerLeft: () => (
        <StatusBadge
          label="12 STREAK"
          icon={Flame}
          backgroundColor={Colors.brandMint}
          iconFillColor={Colors.brandPrimary}
          onPress={() => router.push('/streak')}
        />
      ),
      headerRight: () => (
        <StatusBadge
          label={isOffline ? 'OFFLINE' : 'ONLINE'}
          icon={isOffline ? WifiOff : Wifi}
          backgroundColor={isOffline ? Colors.brandBlue : Colors.brandMint}
          iconFillColor={isOffline ? Colors.white : Colors.brandPrimary}
          textColor={isOffline ? Colors.white : Colors.black}
        />
      ),
    });
  }, [navigation, router, isOffline]);

  if (showEmptyOffline) {
    return (
      <View style={styles.outerContainer}>
        <NetworkErrorState variant="full" onRetry={retryNetworkAndSync} />
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingTop: 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {isOffline ? (
          <NetworkErrorState variant="compact" onRetry={retryNetworkAndSync} />
        ) : null}

        {showOnlineSkeleton ? (
          <>
            <HomeQuickBadgesSkeleton />
            <HomeSectionTitleSkeleton />
            <HomeSurvivalSkeletonGrid />
            <View style={{ marginTop: 24 }}>
              <HomeSectionTitleSkeleton />
              <HomeSurvivalSkeletonGrid />
            </View>
          </>
        ) : (
          <>
            <View style={styles.quickBadges}>
              <StatusBadge
                label="Currencies"
                icon={Banknote}
                backgroundColor={Colors.brandSecondary}
                iconFillColor={Colors.white}
                onPress={() => router.push('/currencies')}
              />
              <StatusBadge
                label="Scan & Translate"
                icon={Camera}
                backgroundColor={Colors.brandPrimary}
                textColor={Colors.white}
                iconFillColor="rgba(255,255,255,0.2)"
                onPress={() => router.push('/survival/scan')}
              />
            </View>

            {sections.map((section, si) => (
              <View key={section.category} style={si > 0 ? { marginTop: 24 } : undefined}>
                <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
                <View style={styles.grid}>
                  {section.modules.map((m) => (
                    <ModuleCard
                      key={m.id}
                      title={m.title}
                      image={resolveSurvivalCoverImage(m)}
                      backgroundColor={Colors.white}
                      onPress={() => router.push(`/survival/${m.id}`)}
                    />
                  ))}
                </View>
              </View>
            ))}
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: Colors.black,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickBadges: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
});
