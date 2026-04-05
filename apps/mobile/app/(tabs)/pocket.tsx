import React, { useLayoutEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { Backpack, Zap, Flame } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import { SurvivalKitCard } from '../../components/SurvivalKitCard';
import { FlashcardItem } from '../../components/FlashcardItem';
import { StatusBadge } from '../../components/StatusBadge';

export default function PocketScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'SURVIVAL BAG',
      headerHideBorder: true,
      titleAlignment: 'left',
      headerRight: () => (
        <StatusBadge
          label="OFFLINE"
          icon={Zap}
          backgroundColor="#FFFFFF"
        />
      ),
    });
  }, [navigation]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Section - Status */}
      <View style={styles.hero}>
        <View style={styles.heroRow}>
           <View style={styles.bagWrap}>
              <Backpack size={34} color="#1A1A1A" strokeWidth={2.5} />
           </View>
           <View style={styles.heroContent}>
              <ThemedText style={styles.heroHeadline}>KITS FULLY CHARGED!</ThemedText>
              <ThemedText style={styles.heroSub}>
                15MB offline data saved. No Wi-Fi? No problem.
              </ThemedText>
           </View>
        </View>
        <View style={styles.progressTrack}>
           <View style={styles.progressBar} />
        </View>
      </View>

      {/* Section 1: Downloaded Kits */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionHeading}>DOWNLOADED KITS</ThemedText>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.kitsScroll}
          contentContainerStyle={styles.kitsContainer}
        >
          <SurvivalKitCard 
            title="Ben Thanh Survival" 
            backgroundColor="#DA251D" 
            textColor="#FFFFFF"
            onDelete={() => {}} 
          />
          <SurvivalKitCard 
            title="Saigon Street Food" 
            backgroundColor="#FFFFFF" 
            onDelete={() => {}} 
          />
        </ScrollView>
      </View>

      {/* Section 2: Saved Phrases */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionHeading}>SAVED PHRASES</ThemedText>
        <View style={styles.flashList}>
          <FlashcardItem 
            vietnamese="Không đá, không đường" 
            english="No ice, no sugar" 
            audioUri="khong_da_khong_duong"
          />
          <FlashcardItem 
            vietnamese="Bao nhiêu tiền?" 
            english="How much is it?" 
            audioUri="bao_nhieu_tien"
          />
          <FlashcardItem 
            vietnamese="Cho tôi gọi taxi" 
            english="Call me a taxi" 
            audioUri="cho_toi_goi_taxi"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  hero: {
    backgroundColor: '#FFC62F',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    padding: 14,
    height: 180,
    justifyContent: 'space-between',
    marginBottom: 24,
    // Neo-brutal hard shadow
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bagWrap: {
    width: 72,
    height: 72,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: {
    flex: 1,
    gap: 6,
  },
  heroHeadline: {
    fontSize: 20,
    fontFamily: 'BeVietnamPro_900Black',
    color: '#1A1A1A',
  },
  heroSub: {
    fontSize: 13,
    fontFamily: 'BeVietnamPro_700Bold',
    color: '#1A1A1A',
    lineHeight: 18,
  },
  progressTrack: {
    height: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    overflow: 'hidden',
  },
  progressBar: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1A1A1A',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 16,
    fontFamily: 'BeVietnamPro_900Black',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  kitsScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  kitsContainer: {
    paddingRight: 16, // Extra padding for the last card shadow
    paddingBottom: 8,
  },
  flashList: {
    marginTop: 4,
  },
});
