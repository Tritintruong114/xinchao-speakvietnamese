import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { FlashcardItem } from '../../components/FlashcardItem';
import { NetworkErrorState } from '../../components/network/NetworkErrorState';
import { PocketListSkeleton } from '../../components/skeletons/PocketListSkeleton';
import { ThemedInput } from '../../components/ThemedInput';
import { ThemedText } from '../../components/ThemedText';
import { Colors } from '../../constants/Theme';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { useSurvivalSync } from '../../hooks/useSurvivalSync';
import { getMergedSurvivalModules } from '../../lib/survivalCatalog';
import { collectSurvivalLibraryAudioRows } from '../../lib/survivalLibraryPhrases';
import { SurvivalStore } from '../../store/survivalStore';
import { Search } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PocketScreen() {
  const insets = useSafeAreaInsets();
  const { syncModules, isLoading } = useSurvivalSync();
  const { isOffline, refresh: refreshNet } = useNetworkStatus();
  const [catalogTick, setCatalogTick] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const modules = useMemo(() => getMergedSurvivalModules(), [catalogTick]);
  const audioRows = useMemo(() => collectSurvivalLibraryAudioRows(modules), [modules]);

  const retryNetworkAndSync = useCallback(async () => {
    await refreshNet();
    await SurvivalStore.ensureHydrated();
    await syncModules({ force: true });
    setCatalogTick((n) => n + 1);
  }, [refreshNet, syncModules]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void (async () => {
        await SurvivalStore.ensureHydrated();
        if (!active) return;
        await syncModules({ force: true });
        if (active) setCatalogTick((n) => n + 1);
      })();
      return () => {
        active = false;
      };
    }, [syncModules]),
  );

  const showOnlineSkeleton = isLoading && !isOffline && modules.length === 0;

  const filteredRows = audioRows.filter((row) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      row.primary.toLowerCase().includes(q) ||
      row.secondary.toLowerCase().includes(q) ||
      row.moduleTitle.toLowerCase().includes(q)
    );
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={[styles.container, { paddingTop: 16 + insets.top }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isOffline ? <NetworkErrorState variant="compact" onRetry={retryNetworkAndSync} /> : null}

        {showOnlineSkeleton ? (
          <PocketListSkeleton />
        ) : (
          <View style={styles.section}>
            <View style={styles.flashList}>
              {filteredRows.length > 0 ? (
                filteredRows.map((row) => (
                  <FlashcardItem
                    key={row.id}
                    vietnamese={row.primary}
                    english={row.secondary.trim() ? row.secondary : row.moduleTitle}
                    audioUri={row.audioUri}
                    primaryColor={Colors.black}
                    searchQuery={searchQuery}
                  />
                ))
              ) : (
                <ThemedText style={styles.emptyText}>
                  Chưa có dòng nào có audio trong thư viện. Thêm audioUri trong module trên LMS hoặc
                  kéo catalog khi có mạng.
                </ThemedText>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <ThemedInput
          placeholder="Tìm trong thư viện…"
          value={searchQuery}
          onChangeText={setSearchQuery}
          borderColor={Colors.brandPrimary}
          icon={Search}
          containerStyle={styles.searchInputContainer}
          style={styles.searchInput}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  flashList: {
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666666',
    fontFamily: 'BeVietnamPro_400Regular',
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
  },
  searchInputContainer: {
    marginBottom: 0,
  },
  searchInput: {
    fontFamily: 'BeVietnamPro_700Bold',
    height: 56,
    fontSize: 18,
  },
});
