import React, { useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import { Flame, Zap, Car, Utensils, ShoppingBag, AlertCircle } from 'lucide-react-native';
import { HomeHero } from '../../components/HomeHero';
import { ModuleCard } from '../../components/ModuleCard';
import { StatusBadge } from '../../components/StatusBadge';
import { ThemedText } from '../../components/ThemedText';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'XIN CHÀO',
      headerHideBorder: true,
      headerLeft: () => (
        <StatusBadge
          label="12 STREAK"
          icon={Flame}
          backgroundColor="#FFC62F"
        />
      ),
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
    <View style={styles.outerContainer}>
      {/* 2. Scrollable Content */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingTop: 16 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 3. Hero Section (Main Action) */}
        <HomeHero onPress={() => console.log('Hero Pressed')} />

        {/* 4. Section Title */}
        <ThemedText style={styles.sectionTitle}>SURVIVAL MODULES</ThemedText>

        {/* 5. Content Grid (2-column) */}
        <View style={styles.grid}>
          <ModuleCard
            title="CALL TAXI"
            icon={Car}
            backgroundColor="#FFFFFF"
            onPress={() => console.log('Taxi')}
          />
          <ModuleCard
            title="RESTAURANT"
            icon={Utensils}
            backgroundColor="#FFC62F"
            onPress={() => console.log('Food')}
          />
          <ModuleCard
            title="BARGAINING"
            icon={ShoppingBag}
            backgroundColor="#FFFFFF"
            onPress={() => console.log('Shopping')}
          />
          <ModuleCard
            title="EMERGENCY"
            icon={AlertCircle}
            backgroundColor="#FFC62F"
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
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: '#1A1A1A',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
