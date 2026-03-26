import React from 'react';
import { LucideIcon, LucideProps } from 'lucide-react-native';
import { Colors } from '@/constants/Theme';

interface ThemedIconProps extends LucideProps {
  icon: LucideIcon;
  colorType?: 'primary' | 'secondary' | 'main' | 'muted';
}

export function ThemedIcon({ 
  icon: IconComponent, 
  size = 24, 
  strokeWidth = 2.5, 
  colorType = 'main',
  color,
  ...props 
}: ThemedIconProps) {
  
  const getColor = () => {
    if (color) return color;
    switch (colorType) {
      case 'primary': return Colors.brandPrimary;
      case 'secondary': return Colors.brandSecondary;
      case 'muted': return '#666666';
      case 'main':
      default: return '#1A1A1A';
    }
  };

  return (
    <IconComponent 
      size={size} 
      strokeWidth={strokeWidth} 
      color={getColor()} 
      {...props} 
    />
  );
}
