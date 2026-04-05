import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { Colors } from '../../constants/Theme';
import { ThemedText } from '../ThemedText';

interface MascotAdvisorProps {
  visible: boolean;
  text: string;
  expression?: 'happy' | 'neutral' | 'sad' | 'excited';
}

export const MascotAdvisor = ({ visible, text, expression = 'happy' }: MascotAdvisorProps) => {
  const renderMascotFace = (exp: string) => {
    switch (exp) {
      case 'excited': return ' > ◡ < ';
      case 'happy': return ' ^ ◡ ^ ';
      case 'sad': return ' ; ◡ ; ';
      default: return ' • ◡ • ';
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutDown}
      style={styles.tipContainer}
    >
      <View style={styles.tipCard}>
        <View style={styles.tipHeader}>
          <ThemedText style={styles.mascotFace}>{renderMascotFace(expression)}</ThemedText>
          <ThemedText style={styles.tipLabel}>PRO ADVICE</ThemedText>
        </View>
        <ThemedText style={styles.tipText}>
          {text}
        </ThemedText>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tipContainer: {
    position: 'absolute',
    bottom: 100,
    left: 24,
    right: 24,
    zIndex: 50,
  },
  tipCard: {
    backgroundColor: Colors.brandSecondary,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingBottom: 4,
  },
  mascotFace: {
    fontSize: 16,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: Colors.black,
  },
  tipLabel: {
    fontSize: 12,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: Colors.black,
    letterSpacing: 1,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'BeVietnamPro_600SemiBold',
    color: Colors.black,
    lineHeight: 20,
  },
});
