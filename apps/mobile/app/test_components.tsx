import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Colors, Spacing } from '../constants/Theme';
import { ThemedText } from '../components/ThemedText';
import { ThemedInput } from '../components/ThemedInput';
import { FlashcardItem } from '../components/FlashcardItem';
import { ThemedButton } from '../components/ThemedButton';

export default function TestComponentsScreen() {
  const [inputValue, setInputValue] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'Component Lab', headerShown: true }} />
      
      <ThemedText type="h1" style={styles.sectionTitle}>Input Component</ThemedText>
      <ThemedInput 
        placeholder="Type something..."
        value={inputValue}
        onChangeText={setInputValue}
        containerStyle={styles.input}
      />
      <ThemedText type="body">Current Value: {inputValue}</ThemedText>

      <View style={styles.divider} />

      <ThemedText type="h1" style={styles.sectionTitle}>Flashcard Component</ThemedText>
      <FlashcardItem 
        vietnamese="Bao nhiêu tiền?"
        english="How much does it cost?"
        onPlay={() => console.log('Playing audio...')}
      />
      
      <FlashcardItem 
        vietnamese="Cảm ơn!"
        english="Thank you!"
        onPlay={() => console.log('Playing audio...')}
        style={{ marginTop: Spacing.m }}
      />

      <View style={styles.divider} />

      <ThemedText type="h1" style={styles.sectionTitle}>Button Reference</ThemedText>
      <ThemedButton 
        title="Primary Action" 
        onPress={() => {}} 
        type="primary"
        style={styles.button}
      />
      <ThemedButton 
        title="Secondary Action" 
        onPress={() => {}} 
        type="secondary"
        style={styles.button}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  content: {
    padding: 24,
  },
  sectionTitle: {
    marginBottom: Spacing.m,
    marginTop: Spacing.l,
  },
  input: {
    width: '100%',
  },
  divider: {
    height: 2,
    backgroundColor: '#EEEEEE',
    marginVertical: 32,
  },
  button: {
    marginBottom: Spacing.m,
  }
});
