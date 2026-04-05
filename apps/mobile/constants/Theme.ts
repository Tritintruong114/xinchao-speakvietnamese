import ColorsFile from './Colors';

const lightColors = ColorsFile.light;

export const Colors = {
  bgPrimary: lightColors.background,
  brandPrimary: lightColors.brandPrimary,
  brandSecondary: lightColors.brandSecondary,
  brandPink: lightColors.brandPink,
  brandMint: lightColors.brandMint,
  brandCyan: lightColors.brandCyan,
  brandLavender: lightColors.brandLavender,
  brandBlue: lightColors.brandBlue,
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
  tight: 4,
};

export const Stroke = {
  width: 2,
  color: '#1A1A1A',
};

export const Shadow = {
  offset: 4,
  opacity: 1,
  color: '#1A1A1A',
};

export const Typography = {
  h1: {
    fontSize: 24, // Adjusted for Be Vietnam Pro scaling
    fontWeight: '900' as const,
    lineHeight: 32,
    color: Colors.textMain,
  },
  h2: {
    fontSize: 20,
    fontWeight: '800' as const,
    lineHeight: 26,
    color: Colors.textMain,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    color: Colors.textMain,
  },
  button: {
    fontSize: 16,
    fontFamily: 'Be Vietnam Pro Bold',
    fontWeight: '700' as const,
    color: Colors.white,
  },
};
