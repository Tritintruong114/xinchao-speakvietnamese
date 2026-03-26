import ColorsFile from './Colors';

const lightColors = ColorsFile.light;

export const Colors = {
  bgPrimary: lightColors.background,
  brandPrimary: lightColors.brandPrimary,
  brandSecondary: lightColors.brandSecondary,
  textMain: lightColors.text,
  textMuted: '#666666',
  white: '#FFFFFF',
  black: '#1A1A1A',
};

export const Spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
};

export const BorderRadius = {
  button: 8,
  card: 12,
};

export const Stroke = {
  width: 2,
  color: '#1A1A1A',
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '800' as const,
    lineHeight: 38, // 120%
    color: Colors.brandPrimary,
  },
  h2: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 26, // 130%
    color: Colors.textMain,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24, // 150%
    color: Colors.textMain,
  },
  button: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.white,
  },
};
