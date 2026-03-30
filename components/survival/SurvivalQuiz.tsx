import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import Animated, { FadeIn, BounceIn } from 'react-native-reanimated';
import { Colors, BorderRadius, Stroke, Shadow } from '../../constants/Theme';
import { ThemedText } from '../ThemedText';
import { LucideIcon, CheckCircle2, XCircle, Info } from 'lucide-react-native';

interface SurvivalQuizProps {
  question: string;
  image?: any;
  options: string[];
  correctIndex: number;
  fact?: string;
  onSuccess: () => void;
}

export const SurvivalQuiz = ({
  question,
  image,
  options,
  correctIndex,
  fact,
  onSuccess,
}: SurvivalQuizProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  const handleSelect = (index: number) => {
    if (isLocked) return;
    setSelectedIndex(index);
    if (index === correctIndex) {
      setIsLocked(true);
      setTimeout(onSuccess, 2500); // Give time to read the fact/feedback
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.delay(200)} style={styles.questionCard}>
        <View style={styles.header}>
          <Info size={20} color={Colors.brandPrimary} />
          <ThemedText style={styles.headerTag}>POP QUIZ</ThemedText>
        </View>
        <ThemedText type="h2" style={styles.questionText}>
          {question}
        </ThemedText>
        {image && (
          <View style={styles.imageContainer}>
            <Image source={image} style={styles.quizImage} resizeMode="contain" />
          </View>
        )}
      </Animated.View>

      <View style={styles.optionsContainer}>
        {options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isCorrect = index === correctIndex;
          const isWrong = isSelected && !isCorrect;

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => handleSelect(index)}
              style={[
                styles.optionButton,
                isSelected && isCorrect && styles.correctButton,
                isSelected && isWrong && styles.wrongButton,
              ]}
            >
              <ThemedText
                style={[
                  styles.optionText,
                  isSelected && (isCorrect || isWrong) && styles.selectedOptionText,
                ]}
              >
                {option}
              </ThemedText>
              {isSelected && isCorrect && (
                <Animated.View entering={BounceIn}>
                  <CheckCircle2 color={Colors.white} size={24} />
                </Animated.View>
              )}
              {isSelected && isWrong && (
                <Animated.View entering={BounceIn}>
                  <XCircle color={Colors.white} size={24} />
                </Animated.View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedIndex === correctIndex && fact && (
        <Animated.View entering={FadeIn} style={styles.factCard}>
          <ThemedText style={styles.factLabel}>DID YOU KNOW?</ThemedText>
          <ThemedText style={styles.factText}>{fact}</ThemedText>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
  },
  questionCard: {
    backgroundColor: Colors.white,
    borderWidth: Stroke.width,
    borderColor: Colors.black,
    borderRadius: BorderRadius.card,
    padding: 20,
    marginBottom: 32,
    shadowColor: Colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  headerTag: {
    fontSize: 12,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: Colors.brandPrimary,
    letterSpacing: 1,
  },
  questionText: {
    fontSize: 20,
    lineHeight: 28,
    marginBottom: 16,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.black,
    overflow: 'hidden',
  },
  quizImage: {
    width: '100%',
    height: '100%',
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: BorderRadius.button,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  correctButton: {
    backgroundColor: '#4CAF50', // Success green
    borderColor: Colors.black,
  },
  wrongButton: {
    backgroundColor: Colors.brandPrimary, // Crimson Red for error
    borderColor: Colors.black,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'BeVietnamPro_700Bold',
    color: Colors.black,
  },
  selectedOptionText: {
    color: Colors.white,
  },
  factCard: {
    marginTop: 32,
    backgroundColor: Colors.brandSecondary,
    borderWidth: Stroke.width,
    borderColor: Colors.black,
    borderRadius: BorderRadius.card,
    padding: 16,
    borderStyle: 'dashed',
  },
  factLabel: {
    fontSize: 12,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: Colors.black,
    marginBottom: 4,
    opacity: 0.6,
  },
  factText: {
    fontSize: 14,
    fontFamily: 'BeVietnamPro_600SemiBold',
    lineHeight: 20,
  },
});
