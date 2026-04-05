import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Car, Utensils, ShoppingBag } from 'lucide-react-native';
import { BrutalistTooltip } from '../../components/travel/BrutalistTooltip';
import { TravelOptionCard } from '../../components/travel/TravelOptionCard';
import { Colors } from '../../constants/Theme';
import { ThemedText } from '../../components/ThemedText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TravelDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <ThemedText type="h1" style={styles.title}>
          Survival Dashboard
        </ThemedText>

        <View style={styles.cardContainer}>
          <TravelOptionCard
            title="Call a Ride"
            subtitle="Get to the city without stress."
            icon={Car}
          />

          <TravelOptionCard
            title="Order Food"
            subtitle="Point, speak, and order like a pro."
            icon={Utensils}
          />

          <View style={styles.tooltipWrapper}>
            <BrutalistTooltip text="Try your first bargaining phrase!" />
            <TravelOptionCard
              title="Bargaining"
              subtitle="Learn the line before you shop."
              icon={ShoppingBag}
              highlighted
              onPress={() => router.push('/(onboarding)/travel-aha')}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    textAlign: 'center',
    color: Colors.brandPrimary,
    marginBottom: 32,
    fontSize: 40,
    fontFamily: 'BeVietnamPro_900Black',
    lineHeight: 48,
  },
  cardContainer: {
    gap: 16,
  },
  tooltipWrapper: {
    marginTop: 8,
  },
});
