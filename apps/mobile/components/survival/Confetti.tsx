import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay, 
  withRepeat,
  withSequence,
  Easing
} from 'react-native-reanimated';
import { Colors } from '../../constants/Theme';

const { width, height } = Dimensions.get('window');

const PIECE_COUNT = 40;
const COLORS = [Colors.brandPrimary, Colors.brandSecondary, '#FF80AB', '#00B0FF', '#7C4DFF'];

const ConfettiPiece = ({ index }: { index: number }) => {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(Math.random() * width);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const delay = Math.random() * 2000;
    const duration = 2500 + Math.random() * 2000;

    translateY.value = withDelay(
      delay,
      withTiming(height + 50, { 
        duration, 
        easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
      })
    );

    translateX.value = withDelay(
      delay,
      withTiming(translateX.value + (Math.random() * 100 - 50), { duration })
    );

    rotate.value = withDelay(
      delay,
      withRepeat(withTiming(360, { duration: 1000 }), -1, false)
    );

    opacity.value = withDelay(
      delay + duration * 0.8,
      withTiming(0, { duration: duration * 0.2 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` }
    ],
    opacity: opacity.value,
  }));

  const backgroundColor = useMemo(() => COLORS[index % COLORS.length], [index]);
  const size = useMemo(() => 8 + Math.random() * 8, []);
  const isCircle = useMemo(() => Math.random() > 0.5, []);

  return (
    <Animated.View 
      style={[
        styles.piece, 
        animatedStyle, 
        { 
          backgroundColor, 
          width: size, 
          height: size, 
          borderRadius: isCircle ? size / 2 : 2 
        }
      ]} 
    />
  );
};

export const Confetti = () => {
  const pieces = useMemo(() => Array.from({ length: PIECE_COUNT }), []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map((_, i) => (
        <ConfettiPiece key={i} index={i} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
