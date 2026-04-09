import React, { useEffect } from 'react';
import { DimensionValue, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { BorderRadius, Colors, Shadow, Stroke } from '../../constants/Theme';

type NeoBrutalPulseBlockProps = {
  width: number | DimensionValue;
  height: number;
  style?: ViewStyle;
};

/**
 * Neo-Brutalism skeleton: thick stroke, hard shadow, pulse.
 */
export function NeoBrutalPulseBlock({ width, height, style }: NeoBrutalPulseBlockProps) {
  const o = useSharedValue(0.45);

  useEffect(() => {
    o.value = withRepeat(
      withSequence(withTiming(1, { duration: 550 }), withTiming(0.45, { duration: 550 })),
      -1,
      false,
    );
  }, [o]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: o.value,
  }));

  return (
    <Animated.View
      style={[
        styles.wrap,
        { width, height, marginBottom: 20 },
        style,
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    borderRadius: BorderRadius.card,
    backgroundColor: Colors.brandLavender,
    shadowColor: Shadow.color,
    shadowOffset: { width: Shadow.offset, height: Shadow.offset },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
});
