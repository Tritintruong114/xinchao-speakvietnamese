import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Volume2 } from 'lucide-react-native';
import { Colors, Stroke, Shadow } from '../../constants/Theme';
import { ThemedText } from '../ThemedText';
import { Dialogue } from '../../constants/SurvivalData';
import { useAudio } from '../../hooks/useAudio';

interface DialogueBubbleProps {
  dialogue: Dialogue;
  isUser?: boolean;
  isSeller?: boolean;
  onVoicePress?: () => void;
}

export function DialogueBubble({ 
  dialogue, 
  isUser, 
  isSeller, 
  onVoicePress 
}: DialogueBubbleProps) {
  const { playSound } = useAudio();

  const handleVoicePress = () => {
    if (onVoicePress) {
      onVoicePress();
    } else if (dialogue.audioUri) {
      playSound(dialogue.audioUri);
    }
  };

  const showSpeaker = (isUser || isSeller) && (dialogue.audioUri || onVoicePress);

  return (
    <View 
      style={[
        styles.bubbleWrapper,
        isUser ? styles.userWrapper : styles.sellerWrapper
      ]}
    >
      <View style={isUser ? styles.userBubbleContainer : styles.row}>
        {isUser && showSpeaker && (
          <TouchableOpacity style={styles.speakerIcon} onPress={handleVoicePress}>
            <Volume2 size={20} color={Colors.brandPink} strokeWidth={2.5} />
          </TouchableOpacity>
        )}
        
        <View style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.sellerBubble,
        ]}>
          <ThemedText style={[
            styles.bubbleText,
            isUser && styles.userBubbleText,
          ]}>
            {dialogue.text}
          </ThemedText>
        </View>

        {isSeller && showSpeaker && (
          <TouchableOpacity style={styles.speakerIcon} onPress={handleVoicePress}>
            <Volume2 size={20} color={Colors.black} strokeWidth={2.5} />
          </TouchableOpacity>
        )}
      </View>

      <ThemedText style={styles.speakerName}>
        {isUser ? 'YOU' : 'VENDOR'}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleWrapper: {
    maxWidth: '85%',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userWrapper: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  sellerWrapper: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  userBubbleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bubble: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.black,
    // Neo-brutalism
    shadowColor: Colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  userBubble: {
    backgroundColor: Colors.brandPink,
    borderTopRightRadius: 4,
  },
  sellerBubble: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 16,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: Colors.black,
  },
  userBubbleText: {
    color: Colors.white,
  },
  speakerName: {
    fontSize: 10,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: Colors.textMuted,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  speakerIcon: {
    padding: 4,
  },
});
