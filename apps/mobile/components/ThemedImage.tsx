import React from 'react';
import { Image, ImageProps, ImageStyle, StyleSheet } from 'react-native';

export type ImageSize = 'sm' | 'md' | 'lg';

interface ThemedImageProps extends Omit<ImageProps, 'style'> {
  size?: ImageSize;
  style?: ImageStyle;
}

const SIZES: Record<ImageSize, { width: number; height: number }> = {
  sm: { width: 120, height: 120 },
  md: { width: 180, height: 180 },
  lg: { width: 240, height: 240 },
};

export function ThemedImage({ size = 'md', style, ...props }: ThemedImageProps) {
  const sizeStyle = SIZES[size];
  
  return (
    <Image 
      {...props} 
      style={[sizeStyle, style]} 
      resizeMode={props.resizeMode || 'contain'} 
    />
  );
}
