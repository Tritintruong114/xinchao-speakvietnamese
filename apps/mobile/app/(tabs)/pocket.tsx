import React, { useCallback, useLayoutEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Platform, KeyboardAvoidingView, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ThemedText } from '../../components/ThemedText';
import { Zap, Search } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import { FlashcardItem } from '../../components/FlashcardItem';
import { StatusBadge } from '../../components/StatusBadge';
import { ThemedInput } from '../../components/ThemedInput';
import { Colors, Stroke, Shadow, BorderRadius } from '../../constants/Theme';
import { CATEGORIES } from '../../constants/survival/saved_phrases';
import { PhraseCategory as SharedPhraseCategory } from '@xinchao/shared';
import { useSavedPhrasesForPocket } from '../../hooks/useSavedPhrasesForPocket';
import { PhraseStore } from '../../store/phraseStore';

/**
 * Helper to extract hex color from tailwind-like strings: "bg-[#DA251D] text-white"
 */
const getHexFromTailwind = (tw: string) => {
  const match = tw.match(/#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/);
  return match ? `#${match[1]}` : '#FFFFFF';
};

export default function PocketScreen() {
  const navigation = useNavigation();
  const { phrases, syncPhrases, refresh } = useSavedPhrasesForPocket();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SharedPhraseCategory | 'ALL'>('ALL');

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void (async () => {
        await PhraseStore.ensureHydrated();
        if (!active) return;
        await syncPhrases();
        if (active) refresh();
      })();
      return () => {
        active = false;
      };
    }, [syncPhrases, refresh]),
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'SAVED PHRASES',
      headerHideBorder: true,
      titleAlignment: 'left',
      headerRight: () => (
        <StatusBadge
          label="OFFLINE"
          icon={Zap}
          backgroundColor={Colors.brandBlue}
          iconFillColor={Colors.white}
        />
      ),
    });
  }, [navigation]);

  const filteredPhrases = phrases.filter(phrase => {
    const matchesSearch = 
      phrase.vietnamese.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phrase.english.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'ALL' || phrase.categories.includes(selectedCategory as SharedPhraseCategory);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Categories Horizontal Scroll */}
        <View style={styles.categoriesWrapper}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {CATEGORIES.map(cat => (
              <Pressable
                key={cat.id}
                onPress={() => {
                  if (selectedCategory === cat.id) {
                    setSelectedCategory('ALL');
                  } else {
                    setSelectedCategory(cat.id as SharedPhraseCategory | 'ALL');
                  }
                }}
                style={[
                  styles.chip,
                  { backgroundColor: getHexFromTailwind(cat.themeClass) },
                  selectedCategory === cat.id && styles.activeChip
                ]}
              >
                <ThemedText style={[
                  styles.chipText,
                  cat.themeClass.includes('text-white') && { color: '#FFFFFF' },
                  selectedCategory === cat.id && styles.activeChipText
                ]}>
                  {cat.label}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Phrases List */}
        <View style={styles.section}>
          <View style={styles.flashList}>
            {filteredPhrases.length > 0 ? (
              filteredPhrases.map((phrase) => (
                <FlashcardItem 
                  key={phrase.id}
                  vietnamese={phrase.vietnamese} 
                  english={phrase.english} 
                  audioUri={phrase.audioUri}
                  searchQuery={searchQuery}
                />
              ))
            ) : (
              <ThemedText style={styles.emptyText}>No phrases found.</ThemedText>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Persistent Search Bar footer */}
      <View style={styles.footer}>
        <ThemedInput
          placeholder="Quick search phrases..."
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
    paddingTop: 16,
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  categoriesWrapper: {
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8, // For the chip shadow
    gap: 12,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.button,
    borderWidth: Stroke.width,
    borderColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeChip: {
    // Hard shadow for active state
    shadowColor: Colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    transform: [{ translateX: -1 }, { translateY: -1 }],
  },
  chipText: {
    fontSize: 12,
    fontFamily: 'BeVietnamPro_700Bold',
    color: Colors.black,
    textTransform: 'uppercase',
  },
  activeChipText: {
    fontFamily: 'BeVietnamPro_900Black',
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
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Slightly transparency
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
  },
  searchInputContainer: {
    marginBottom: 0, 
  },
  searchInput: {
    fontFamily: 'BeVietnamPro_700Bold',
    height: 56, // Slightly taller
    fontSize: 18, // Slightly bigger text
  },
});
