import { useNavigation, useRouter } from 'expo-router';
import { Flame, Zap, Banknote } from 'lucide-react-native';
import React, { useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { HomeHero } from '../../components/HomeHero';
import { ModuleCard } from '../../components/ModuleCard';
import { StatusBadge } from '../../components/StatusBadge';
import { ThemedText } from '../../components/ThemedText';
import { Colors } from '../../constants/Theme';

// Import images - New categorized assets
const MoneyCountImg = require('../../assets/screens/home/money_count.png');
const GreetingsImg = require('../../assets/screens/home/greetings.png');
const TaxiImg = require('../../assets/screens/home/ride_hailing.png');
const DirectionsImg = require('../../assets/screens/home/directions.png');
const FoodImg = require('../../assets/screens/home/restaurant_coffee.png');
const BargainingImg = require('../../assets/screens/home/bargaining.png');
const NhauImg = require('../../assets/screens/home/nhau_culture.png');
const MetroImg = require('../../assets/screens/home/metro.png');
const BusImg = require('../../assets/screens/home/sleeper_bus.png');
const TrainImg = require('../../assets/screens/home/train.png');
const PlaneImg = require('../../assets/screens/home/airplane.png');
const GenZImg = require('../../assets/screens/home/genz_slang.png');
const ExpatImg = require('../../assets/screens/home/expat_life.png');

export default function HomeScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'XIN CHÀO',
      headerHideBorder: true,
      headerLeft: () => (
        <StatusBadge
          label="12 STREAK"
          icon={Flame}
          backgroundColor={Colors.brandSecondary}
          onPress={() => router.push('/streak')}
        />
      ),
      headerRight: () => (
        <StatusBadge
          label="OFFLINE"
          icon={Zap}
          backgroundColor={Colors.white}
        />
      ),
    });
  }, [navigation, router]);

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingTop: 16 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <HomeHero onPress={() => console.log('Hero Pressed')} />

        {/* Quick Badges */}
        <View style={styles.quickBadges}>
          <StatusBadge
            label="Currencies"
            icon={Banknote}
            backgroundColor={Colors.brandSecondary}
            onPress={() => router.push('/currencies')}
          />
        </View>

        {/* 1. BEGINNER MODULES */}
        <ThemedText style={styles.sectionTitle}>BEGINNER: THE BASICS</ThemedText>
        <View style={styles.grid}>
          <ModuleCard
            title="MONEY COUNT"
            image={MoneyCountImg}
            backgroundColor={Colors.white}
            onPress={() => router.push('/survival/money_count')}
          />
          <ModuleCard
            title="GREETINGS"
            image={GreetingsImg}
            backgroundColor={Colors.white}
            onPress={() => router.push('/survival/greetings')}
          />
        </View>

        {/* 2. SURVIVAL MODULES */}
        <ThemedText style={[styles.sectionTitle, { marginTop: 24 }]}>SURVIVAL: STREET SMART</ThemedText>
        <View style={styles.grid}>
          <ModuleCard
            title="DIRECTIONS"
            image={DirectionsImg}
            backgroundColor={Colors.white}
            onPress={() => router.push('/survival/directions')}
          />
          <ModuleCard
            title="EAT & DRINK"
            image={FoodImg}
            backgroundColor={Colors.white}
            onPress={() => router.push('/survival/restaurant_coffee')}
          />
          <ModuleCard
            title="BARGAINING"
            image={BargainingImg}
            backgroundColor={Colors.white}
            onPress={() => router.push('/survival/bargaining')}
          />
          <ModuleCard
            title="NHẬU CULTURE"
            image={NhauImg}
            backgroundColor={Colors.white}
            onPress={() => router.push('/survival/nhau_culture')}
          />
          <ModuleCard
            title="RIDE HAILING"
            image={TaxiImg}
            backgroundColor={Colors.white}
            onPress={() => router.push('/survival/ride_hailing')}
          />
          <ModuleCard
            title="METRO"
            image={MetroImg}
            backgroundColor={Colors.white}
            onPress={() => router.push('/survival/metro')}
          />
          <ModuleCard
            title="SLEEPER BUS"
            image={BusImg}
            backgroundColor={Colors.white}
            onPress={() => router.push('/survival/sleeper_bus')}
          />
          <ModuleCard
            title="TRAIN"
            image={TrainImg}
            backgroundColor={Colors.white}
            onPress={() => router.push('/survival/train')}
          />
          <ModuleCard
            title="AIRPLANE"
            image={PlaneImg}
            backgroundColor={Colors.white}
            onPress={() => router.push('/survival/airplane')}
          />
        </View>

        {/* 3. LEGEND MODULES */}
        <ThemedText style={[styles.sectionTitle, { marginTop: 24 }]}>LEGEND: LIVE LIKE A LOCAL</ThemedText>
        <View style={styles.grid}>
          <ModuleCard
            title="GEN Z SLANG"
            image={GenZImg}
            backgroundColor={Colors.white}
            onPress={() => router.push('/survival/genz_slang')}
          />
          <ModuleCard
            title="EXPAT LIFE"
            image={ExpatImg}
            backgroundColor={Colors.white}
            onPress={() => router.push('/survival/expat_life')}
          />
        </View>

        {/* Footer padding */}
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
