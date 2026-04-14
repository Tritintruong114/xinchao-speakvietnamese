import React, { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import type { ImageSourcePropType } from 'react-native';
import { StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { Volume2 } from 'lucide-react-native';
import { Colors, BorderRadius, Stroke } from '../../constants/Theme';
import { SURVIVAL_IMAGE_FALLBACK } from '../../lib/localModuleImages';
import { useAudio } from '../../hooks/useAudio';
import { ThemedText } from '../ThemedText';

const BOLD_SEGMENT = /\*\*(.+?)\*\*/g;

function renderBoldSegments(text: string, keyPrefix: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(BOLD_SEGMENT.source, 'g');
  let boldIdx = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    nodes.push(
      <ThemedText key={`${keyPrefix}-bold-${boldIdx++}`} style={styles.contentBold}>
        {match[1]}
      </ThemedText>
    );
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  if (nodes.length === 0) {
    return text;
  }
  return nodes;
}

interface SurvivalTeachingProps {
  title: string;
  content: string;
  visualHighlight?: string;
  /** Resolved URI or bundled asset; typically module cover or step `image_url`. */
  imageSource: ImageSourcePropType;
  /** Bumps when the step changes so a failed hero can retry the new source. */
  heroResetKey?: string;
  /** Step narration (https, or bundled `require` id) — same shape as `voice_practice`. */
  audioUri?: string | number;
}

export const SurvivalTeaching = ({
  title,
  content,
  visualHighlight,
  imageSource,
  heroResetKey,
  audioUri,
}: SurvivalTeachingProps) => {
  const { width: windowWidth } = useWindowDimensions();
  /** Screen minus outer padding (24×2) and teachCard padding (24×2). */
  const heroW = Math.max(1, windowWidth - 96);
  const heroH = heroW * (9 / 16);

  const { playSound } = useAudio();
  const [heroFailed, setHeroFailed] = useState(false);
  useEffect(() => {
    setHeroFailed(false);
  }, [heroResetKey]);

  const heroSource = heroFailed ? SURVIVAL_IMAGE_FALLBACK : imageSource;
  const canPlay =
    audioUri !== undefined && audioUri !== null && String(audioUri).length > 0;
  const renderRichContent = () => {
    const lines = content.split('\n');
    return (
      <View style={styles.richContent}>
        {lines.map((line, i) => {
          const key = `ln-${i}`;
          if (line === '') {
            return <View key={key} style={styles.contentSpacer} />;
          }
          if (line.startsWith('- ')) {
            const body = line.slice(2);
            return (
              <View key={key} style={styles.bulletRow}>
                <ThemedText style={styles.bulletMark}>•</ThemedText>
                <ThemedText style={[styles.contentText, styles.contentTextInBullet]}>
                  {renderBoldSegments(body, key)}
                </ThemedText>
              </View>
            );
          }
          return (
            <ThemedText key={key} style={[styles.contentText, styles.contentParagraph]}>
              {renderBoldSegments(line, key)}
            </ThemedText>
          );
        })}
      </View>
    );
  };

  // Simple renderer for <s> strikethrough logic in visualHighlight
  const renderHighlight = (text: string) => {
    if (!text) return null;
    const parts = text.split(/<\/?s>/);
    return (
      <ThemedText style={[styles.highlightText, { textAlign: 'center', flexWrap: 'wrap' }]}>
        {parts.map((part, index) => {
          const isStrikethrough = index === 1; // Basic assumption for "500,<s>000</s>"
          return (
            <ThemedText
              key={index}
              style={isStrikethrough ? styles.strikethroughText : undefined}
            >
              {part}
            </ThemedText>
          );
        })}
      </ThemedText>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.teachCard}>
        {/* Hero must not sit behind FadeIn.delay — same URI as home grid but delay made it feel slow to load */}
        <View style={[styles.heroImageWrap, { width: heroW, height: heroH }]}>
          <Image
            source={heroSource}
            style={{ width: heroW, height: heroH }}
            contentFit="cover"
            cachePolicy="memory-disk"
            priority="high"
            transition={150}
            onError={() => setHeroFailed(true)}
          />
        </View>
        <Animated.View entering={FadeIn.duration(220)}>
          <View style={styles.titleRow}>
            <ThemedText type="h1" style={styles.titleText}>
              {title}
            </ThemedText>
            {canPlay && (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Play narration"
                activeOpacity={0.7}
                style={styles.speakBtn}
                onPress={() => playSound(audioUri)}
              >
                <Volume2 size={22} color={Colors.black} strokeWidth={2.5} />
              </TouchableOpacity>
            )}
          </View>

          {renderRichContent()}

          {visualHighlight && (
            <Animated.View entering={SlideInRight.duration(280)} style={styles.visualBox}>
              <ThemedText style={styles.visualLabel}>REMEMBER THIS:</ThemedText>
              {renderHighlight(visualHighlight)}
            </Animated.View>
          )}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  /** No flex:1 here — inside ScrollView, flex children often get 0 height and the hero Image never lays out. */
  container: {
    padding: 24,
    width: '100%',
  },
  teachCard: {
    backgroundColor: Colors.white,
    borderWidth: Stroke.width,
    borderColor: Colors.black,
    borderRadius: BorderRadius.card,
    padding: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  headerTag: {
    fontSize: 14,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: Colors.brandPrimary,
    letterSpacing: 2,
  },
  heroImageWrap: {
    alignSelf: 'center',
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.black,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  titleText: {
    flex: 1,
    fontSize: 28,
    lineHeight: 34,
    color: Colors.black,
  },
  speakBtn: {
    marginTop: 2,
    backgroundColor: Colors.brandSecondary,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: 8,
    padding: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  richContent: {
    marginBottom: 32,
  },
  contentSpacer: {
    height: 10,
  },
  contentParagraph: {
    marginBottom: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
    paddingRight: 4,
  },
  bulletMark: {
    fontSize: 18,
    lineHeight: 28,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: Colors.brandPrimary,
    marginTop: 1,
  },
  contentText: {
    fontSize: 18,
    lineHeight: 28,
    fontFamily: 'BeVietnamPro_600SemiBold',
    color: Colors.textMain,
  },
  contentTextInBullet: {
    flex: 1,
  },
  contentBold: {
    fontFamily: 'BeVietnamPro_800ExtraBold',
    fontSize: 18,
    lineHeight: 28,
    color: Colors.textMain,
  },
  visualBox: {
    backgroundColor: Colors.brandSecondary,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  visualLabel: {
    fontSize: 10,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: Colors.black,
    marginBottom: 8,
    opacity: 0.5,
  },
  highlightWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  highlightText: {
    fontSize: 28,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: Colors.black,
  },
  strikethroughText: {
    textDecorationLine: 'line-through',
    color: Colors.brandPrimary,
    opacity: 0.5,
  },
  cautionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    padding: 12,
    backgroundColor: '#FFF0F0',
    borderRadius: 8,
  },
  cautionText: {
    fontSize: 12,
    fontFamily: 'BeVietnamPro_700Bold',
    color: Colors.brandPrimary,
  },
});
