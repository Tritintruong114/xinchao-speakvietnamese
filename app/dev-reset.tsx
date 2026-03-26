import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Theme';
import { useAuth } from '@/context/AuthContext';

export default function DevResetScreen() {
  const { logout } = useAuth();

  useEffect(() => {
    const reset = async () => {
      try {
        await logout();
      } catch (error) {
        // Ignore sign-out errors so reset still clears local state.
        console.warn('dev-reset: logout failed', error);
      }

      await SecureStore.deleteItemAsync('xinchao-storage');
      router.replace('/(onboarding)');
    };

    reset();
  }, [logout]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.brandPrimary} />
      <ThemedText style={styles.text}>Resetting app state...</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  text: {
    marginTop: 12,
    color: Colors.textMain,
  },
});

