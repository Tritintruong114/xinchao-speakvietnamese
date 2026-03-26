import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Car, Utensils, ShoppingBag } from 'lucide-react-native';
import { BrutalistTooltip } from '@/components/travel/BrutalistTooltip';
import { TravelOptionCard } from '@/components/travel/TravelOptionCard';
import { Colors } from '@/constants/Theme';
import { ThemedText } from '@/components/ThemedText';

export default function TravelDashboardScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="h2" style={styles.title}>
          Survival Dashboard
        </ThemedText>

        <TravelOptionCard
          title="Call a Ride"
          subtitle="Get from airport to city without stress."
          icon={Car}
        />

        <TravelOptionCard
          title="Order Food"
          subtitle="Point, speak, and order in seconds."
          icon={Utensils}
        />

        <BrutalistTooltip text="Try your first bargaining phrase." />

        <TravelOptionCard
          title="Bargaining"
          subtitle="Learn the must-know line before you shop."
          icon={ShoppingBag}
          highlighted
          onPress={() => router.push('/(onboarding)/travel-aha')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brandSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    gap: 12,
  },
  title: {
    textAlign: 'center',
    color: Colors.black,
    marginBottom: 8,
    fontSize: 32,
    lineHeight: 38,
  },
});

