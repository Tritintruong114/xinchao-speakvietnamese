import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Stroke, Shadow, BorderRadius as AppBorderRadius } from '../constants/Theme';

interface NeoBrutalWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  offset?: number;
  backgroundColor?: string;
  borderRadius?: number;
  shadowColor?: string;
}

/**
 * NeoBrutalWrapper - A container that implements a "Hard Shadow" by layering.
 * It places a solid color block behind the content to simulate a 2D offset depth.
 */
export function NeoBrutalWrapper({ 
  children, 
  style, 
  offset = Shadow.offset, 
  backgroundColor = Colors.white, 
  borderRadius = AppBorderRadius.card,
  shadowColor = Shadow.color
}: NeoBrutalWrapperProps) {
  return (
    <View style={[styles.container, style]}>
      {/* The "Shadow" layer */}
      <View style={[
        styles.shadow,
        { 
          backgroundColor: shadowColor, 
          borderRadius,
          transform: [{ translateX: offset }, { translateY: offset }]
        }
      ]} />
      
      {/* The "Content" layer */}
      <View style={[
        styles.content,
        { 
          backgroundColor, 
          borderRadius,
          borderWidth: Stroke.width,
          borderColor: Stroke.color
        }
      ]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 4, // Allow space for the shadow
    paddingBottom: 4,
    position: 'relative',
  },
  shadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  content: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
});
