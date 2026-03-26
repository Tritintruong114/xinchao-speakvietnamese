import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { Colors } from '@/constants/Theme';
import { useAuth } from '@/context/AuthContext';
import { Icons } from '@/constants/Icons';

export default function LoginScreen() {
  const { signInAnonymously } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleStartLearning = async () => {
    setIsSyncing(true);
    try {
      await signInAnonymously();
      // Auth guard in _layout.tsx will handle redirection
    } catch (error) {
      console.error(error);
      setIsSyncing(false);
    }
  };

  const handleExistingAccount = () => {
    // Placeholder for email/google login
    console.log('Login with existing account');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={Icons.logo} 
          style={styles.logo} 
          resizeMode="contain" 
        />
        <ThemedText type="h1" color={Colors.brandPrimary} style={{ textAlign: 'center' }}>
          Welcome to{"\n"}Viet Nam!
        </ThemedText>
        <ThemedText type="body" style={styles.subtitle}>
          Speak Vietnamese. Survive. Connect.
        </ThemedText>
      </View>

      <View style={styles.form}>
        {isSyncing ? (
          <ActivityIndicator size="large" color={Colors.brandPrimary} />
        ) : (
          <>
            <ThemedButton 
              title="START LEARNING" 
              type="primary" 
              onPress={handleStartLearning} 
            />
            <ThemedButton 
              title="I ALREADY HAVE AN ACCOUNT" 
              type="secondary" 
              onPress={handleExistingAccount}
              style={{ marginTop: 16 }}
            />
          </>
        )
}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
});
