import React from 'react';
import { StyleSheet, View, TouchableOpacity, Share, Alert } from 'react-native';
import { Colors, Stroke, Shadow, BorderRadius } from '../../constants/Theme';
import { ThemedText } from '../ThemedText';
import { Home, Share2, Camera, Bookmark, Star } from 'lucide-react-native';
import { Confetti } from './Confetti';

interface SurvivalSuccessProps {
  moduleTitle: string;
  badge: string;
  xp: number;
  onHome: () => void;
}

export const SurvivalSuccess = ({ moduleTitle, badge, xp, onHome }: SurvivalSuccessProps) => {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `I just earned the ${badge} badge in ${moduleTitle} on XinChao! 🇻🇳`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleAction = (type: string) => {
    Alert.alert('Coming Soon', `${type} feature is being integrated!`);
  };

  return (
    <View style={styles.container}>
      <Confetti />
      {/* Content */}
      <View style={styles.content}>
        <View style={styles.badgeWrapper}>
          <View style={styles.starCircle}>
            <Star size={60} color={Colors.white} fill={Colors.white} />
          </View>
          <ThemedText style={styles.badgeName}>{badge}</ThemedText>
          <ThemedText style={styles.moduleName}>{moduleTitle}</ThemedText>
        </View>

        <View style={styles.xpBox}>
             <ThemedText style={styles.xpAmount}>+{xp}</ThemedText>
             <ThemedText style={styles.xpLabel}>EXPERIENCE POINTS</ThemedText>
        </View>

        {/* Action Row - Commented out as requested
        <View style={styles.actionRow}>
            <TouchableOpacity style={styles.iconButton} onPress={() => handleAction('Screenshot')}>
                <Camera size={24} color={Colors.black} strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
                <Share2 size={24} color={Colors.black} strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => handleAction('Save')}>
                <Bookmark size={24} color={Colors.black} strokeWidth={2.5} />
            </TouchableOpacity>
        </View> 
        */}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.homeButton} onPress={onHome}>
          <Home size={20} color={Colors.white} strokeWidth={3} />
          <ThemedText style={styles.homeText}>BACK TO HOME</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    paddingHorizontal: 24,
  },
  badgeWrapper: {
    alignItems: 'center',
    gap: 12,
  },
  starCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.brandPrimary,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Shadow.color,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  badgeName: {
    fontSize: 32,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: Colors.black,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 44, // More generous line height
  },
  moduleName: {
    fontSize: 14,
    fontFamily: 'BeVietnamPro_700Bold',
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  xpBox: {
    backgroundColor: Colors.brandSecondary,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    borderRadius: BorderRadius.card,
    paddingVertical: 20, // Increased padding
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: Shadow.color,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  xpAmount: {
    fontSize: 40, // Increased size for impact
    fontFamily: 'BeVietnamPro_800ExtraBold', // Changed from 900Black to avoid clipping
    color: Colors.black,
    lineHeight: 50, // Explicit line height to prevent clipping
  },
  xpLabel: {
    fontSize: 12,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: Colors.black,
    opacity: 0.7,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 20,
  },
  iconButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.white,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Shadow.color,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  footer: {
    padding: 24,
    paddingBottom: 32,
  },
  homeButton: {
    height: 64,
    backgroundColor: Colors.black,
    borderRadius: BorderRadius.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: Shadow.color,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  homeText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'BeVietnamPro_900Black',
  },
});
