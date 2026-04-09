import { SurvivalScanResult } from '@xinchao/shared';
import * as Speech from 'expo-speech';
import { Volume2 } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Stroke } from '../../constants/Theme';
import { NeoBrutalPulseBlock } from '../skeletons/NeoBrutalPulseBlock';

interface Props {
  result: SurvivalScanResult;
  onClose: () => void;
}

/** Skeleton Neo-Brutal khi chờ Gemini (thay spinner trên nút chụp). */
export function ScanAnalyzeSkeleton() {
  return (
    <View style={skeletonStyles.container}>
      <View style={skeletonStyles.card}>
        <NeoBrutalPulseBlock width="100%" height={28} style={skeletonStyles.block} />
        <NeoBrutalPulseBlock width="92%" height={22} style={skeletonStyles.block} />
        <NeoBrutalPulseBlock width="100%" height={52} style={skeletonStyles.block} />
        <NeoBrutalPulseBlock width="100%" height={44} style={skeletonStyles.block} />
      </View>
    </View>
  );
}

export function ScanResultCard({ result, onClose }: Props) {
  const handleSpeak = () => {
    Speech.speak(result.survival_phrase, { language: 'vi-VN' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{result.raw_text}</Text>
        <Text style={styles.translation}>{result.translated_text}</Text>
        
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.speakerBtn} onPress={handleSpeak}>
            <Volume2 color="#FFFFFF" strokeWidth={2.5} size={24} />
          </TouchableOpacity>
          <View style={styles.phraseContainer}>
             <Text style={styles.survivalPhrase}>{result.survival_phrase}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>Scan Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 24,
    paddingBottom: 48,
  },
  card: {
    backgroundColor: '#FFC62F', // Vàng Sao
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    padding: 16,
    // Hard Shadow Neo-Brutalism
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  title: {
    fontFamily: 'BeVietnamPro-Black',
    fontSize: 24,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  translation: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 16,
    color: '#1A1A1A',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  speakerBtn: {
    backgroundColor: '#DA251D', // Đỏ Cờ
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    // Hard Shadow
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  phraseContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1A1A1A',
  },
  survivalPhrase: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 14,
    color: '#1A1A1A',
  },
  closeBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    alignItems: 'center',
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  closeText: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 16,
    color: '#1A1A1A',
  },
});

const skeletonStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 24,
    paddingBottom: 48,
    pointerEvents: 'none',
  },
  card: {
    backgroundColor: Colors.brandSecondary,
    borderRadius: 12,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  block: {
    marginBottom: 12,
    maxWidth: '100%',
  },
});
