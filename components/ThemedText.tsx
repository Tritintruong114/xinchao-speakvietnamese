import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { Colors, Typography } from '../constants/Theme';

interface ThemedTextProps extends TextProps {
  type?: 'h1' | 'h2' | 'body' | 'button';
  color?: string;
}

export function ThemedText({ style, type = 'body', color, ...rest }: ThemedTextProps) {
  const getTextStyle = () => {
    switch (type) {
      case 'h1': return Typography.h1;
      case 'h2': return Typography.h2;
      case 'button': return Typography.button;
      default: return Typography.body;
    }
  };

  return (
    <RNText 
      style={[
        getTextStyle(),
        { fontFamily: 'BeVietnamPro_400Regular' }, // Will update to match bold/thin if needed
        type === 'h1' && { fontFamily: 'BeVietnamPro_800ExtraBold' },
        type === 'h2' && { fontFamily: 'BeVietnamPro_700Bold' },
        type === 'button' && { fontFamily: 'BeVietnamPro_700Bold' },
        color ? { color } : {},
        style
      ]} 
      {...rest} 
    />
  );
}
