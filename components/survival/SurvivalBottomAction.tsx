import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedButton } from '../ThemedButton';

interface SurvivalBottomActionProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'ghost';
  visible?: boolean;
}

export const SurvivalBottomAction = ({ title, onPress, type = 'primary', visible = true }: SurvivalBottomActionProps) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <ThemedButton 
        title={title}
        type={type}
        onPress={onPress}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: 'transparent',
  },
  button: {
    width: '100%',
  },
});
