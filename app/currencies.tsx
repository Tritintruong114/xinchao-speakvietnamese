import { Stack, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { FlashcardItem } from '../components/FlashcardItem';
import { ThemedText } from '../components/ThemedText';
import { Colors } from '../constants/Theme';

const { width } = Dimensions.get('window');

const DENOMINATIONS = [
  { value: '1.000', id: '1000', color: '#BDBDBD', viet: 'Một nghìn đồng', eng: 'One thousand dong', audio: 'mot_nghin' },
  { value: '2.000', id: '2000', color: '#8D6E63', viet: 'Hai nghìn đồng', eng: 'Two thousand dong', audio: 'hai_nghin' },
  { value: '5.000', id: '5000', color: '#4DB6AC', viet: 'Năm nghìn đồng', eng: 'Five thousand dong', audio: 'nam_nghin' },
  { value: '10.000', id: '10000', color: '#FBC02D', viet: 'Mười nghìn đồng', eng: 'Ten thousand dong', audio: 'muoi_nghin' },
  { value: '20.000', id: '20000', color: '#1E88E5', viet: 'Hai mươi nghìn đồng', eng: 'Twenty thousand dong', audio: 'hai_muoi_nghin' },
  { value: '50.000', id: '50000', color: '#EC407A', viet: 'Năm mươi nghìn đồng', eng: 'Fifty thousand dong', audio: 'nam_muoi_nghin' },
  { value: '100.000', id: '100000', color: '#66BB6A', viet: 'Một trăm nghìn đồng', eng: 'One hundred thousand dong', audio: 'mot_tram_nghin' },
  { value: '200.000', id: '200000', color: '#D84315', viet: 'Hai trăm nghìn đồng', eng: 'Two hundred thousand dong', audio: 'hai_tram_nghin' },
  { value: '500.000', id: '500000', color: '#0277BD', viet: 'Năm trăm nghìn đồng', eng: 'Five hundred thousand dong', audio: 'nam_tram_nghin' },
];

const CURRENCY_IMAGES: Record<string, { F: any; B: any }> = {
  '1000': {
    F: require('../assets/currencies/F-1000.png'),
    B: require('../assets/currencies/B-1000.png'),
  },
  '2000': {
    F: require('../assets/currencies/F-2000.png'),
    B: require('../assets/currencies/B-2000.png'),
  },
  '5000': {
    F: require('../assets/currencies/F-5000.png'),
    B: require('../assets/currencies/B-5000.png'),
  },
  '10000': {
    F: require('../assets/currencies/F-10000.png'),
    B: require('../assets/currencies/B-10000.png'),
  },
  '20000': {
    F: require('../assets/currencies/F-20000.png'),
    B: require('../assets/currencies/B-20000.png'),
  },
  '50000': {
    F: require('../assets/currencies/F-50000.png'),
    B: require('../assets/currencies/B-50000.png'),
  },
  '100000': {
    F: require('../assets/currencies/F-100000.png'),
    B: require('../assets/currencies/B-100000.png'),
  },
  '200000': {
    F: require('../assets/currencies/F-200000.png'),
    B: require('../assets/currencies/B-200000.png'),
  },
  '500000': {
    F: require('../assets/currencies/F-500000.png'),
    B: require('../assets/currencies/B-500000.png'),
  },
};

export default function CurrenciesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <ChevronLeft color={Colors.black} size={28} />
        </TouchableOpacity>
        <ThemedText type="h1" style={styles.headerTitle}>CURRENCIES</ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {DENOMINATIONS.map((item) => (
          <View key={item.id} style={styles.denomSection}>
            <FlashcardItem
              vietnamese={item.viet}
              english={item.eng}
              tag={`${item.value} VND ĐỒNG`}
              backgroundColor={item.color}
              primaryColor={Colors.white}
              audioUri={item.audio}
            />

            <View style={styles.currencyCard}>
              <View style={styles.imageColumn}>
                <ThemedText style={styles.sideLabel}>FRONT</ThemedText>
                <View style={styles.imageWrapper}>
                  <Image
                    source={CURRENCY_IMAGES[item.id].F}
                    style={styles.noteImage}
                    resizeMode="contain"
                  />
                </View>
              </View>

              <View style={styles.imageColumn}>
                <ThemedText style={styles.sideLabel}>BACK</ThemedText>
                <View style={styles.imageWrapper}>
                  <Image
                    source={CURRENCY_IMAGES[item.id].B}
                    style={styles.noteImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: Colors.black,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'BeVietnamPro_800ExtraBold',
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 24,
  },

  denomSection: {
    marginBottom: 32,
  },
  currencyCard: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    gap: 24,
  },
  imageColumn: {
    gap: 8,
  },
  sideLabel: {
    fontSize: 10,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: '#666',
    textAlign: 'center',
  },
  imageWrapper: {
    aspectRatio: 16 / 9,

    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteImage: {
    width: '100%',
    height: '100%',
  },
});
