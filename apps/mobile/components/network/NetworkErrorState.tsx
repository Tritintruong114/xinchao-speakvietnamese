import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BrokenCableMascot } from './BrokenCableMascot';
import { ThemedText } from '../ThemedText';
import { ThemedButton } from '../ThemedButton';
import { BorderRadius, Colors, Shadow, Stroke } from '../../constants/Theme';

const COPY =
  'Oops! Cáp quang biển lại cá mập cắn rồi. Vui lòng bật 4G hoặc Wi-Fi để tiếp tục sinh tồn nhé!';

type NetworkErrorStateProps = {
  onRetry?: () => void | Promise<void>;
  /** Full = centered hero for empty states; compact = banner in scroll */
  variant?: 'full' | 'compact';
};

export function NetworkErrorState({ onRetry, variant = 'full' }: NetworkErrorStateProps) {
  const isCompact = variant === 'compact';

  return (
    <View style={[styles.card, isCompact ? styles.cardCompact : styles.cardFull]}>
      <View style={styles.shadow} />
      <View style={styles.inner}>
        <BrokenCableMascot size={isCompact ? 140 : 200} />
        <ThemedText style={styles.title}>Không có mạng</ThemedText>
        <ThemedText style={styles.body}>{COPY}</ThemedText>
        {onRetry ? (
          <View style={styles.btn}>
            <ThemedButton title="Thử lại" onPress={() => void onRetry()} type="primary" />
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    alignSelf: 'stretch',
    marginHorizontal: 16,
  },
  cardFull: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 24,
    minHeight: 360,
  },
  cardCompact: {
    marginBottom: 20,
    marginTop: 8,
  },
  shadow: {
    position: 'absolute',
    top: Shadow.offset,
    left: Shadow.offset,
    right: -Shadow.offset,
    bottom: -Shadow.offset,
    borderRadius: BorderRadius.card,
    backgroundColor: Shadow.color,
    zIndex: 0,
  },
  inner: {
    position: 'relative',
    zIndex: 1,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    borderRadius: BorderRadius.card,
    backgroundColor: Colors.white,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    marginTop: 12,
    fontSize: 20,
    fontFamily: 'BeVietnamPro_900Black',
    color: Colors.black,
    textAlign: 'center',
  },
  body: {
    marginTop: 10,
    fontSize: 15,
    fontFamily: 'BeVietnamPro_400Regular',
    color: Colors.black,
    textAlign: 'center',
    lineHeight: 22,
  },
  btn: {
    marginTop: 20,
    alignSelf: 'stretch',
  },
});
