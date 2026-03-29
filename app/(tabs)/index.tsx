import { useNavigation, useRouter } from 'expo-router';
import { Flame, Zap } from 'lucide-react-native';
import React, { useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { HomeHero } from '../../components/HomeHero';
import { ModuleCard } from '../../components/ModuleCard';
import { StatusBadge } from '../../components/StatusBadge';
import { ThemedText } from '../../components/ThemedText';
import { Colors } from '../../constants/Theme';

// Import images
const TaxiImage = require('../../assets/screens/home/[Call Taxi].jpg');
const BargainingImage = require('../../assets/screens/home/[Bargaining].jpg');
const RestaurantImage = require('../../assets/screens/home/[Restaurant].jpg');
// Using TaxiImage as fallback for now
const FallbackImage = TaxiImage;

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

        {/* Section Title */}
        <ThemedText style={styles.sectionTitle}>SURVIVAL MODULES</ThemedText>

        {/* Content Grid (2-column) */}
        <View style={styles.grid}>
          <ModuleCard
            title="CALL TAXI"
            image={TaxiImage}
            backgroundColor={Colors.white}
            onPress={() => console.log('Taxi')}
          />
          <ModuleCard
            title="RESTAURANT"
            image={RestaurantImage}
            backgroundColor={Colors.white}
            onPress={() => console.log('Food')}
          />
          <ModuleCard
            title="BARGAINING"
            image={BargainingImage}
            backgroundColor={Colors.white}
            onPress={() => console.log('Shopping')}
          />
          <ModuleCard
            title="EMERGENCY"
            image={FallbackImage}
            backgroundColor={Colors.white}
            onPress={() => console.log('Emergency')}
          />
        </View>

        {/* Footer padding for tab bar visibility */}
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
});
