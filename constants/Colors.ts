const brandPrimary = '#DA251D'; // Crimson Red
const brandSecondary = '#FFC62F'; // Star Yellow
const textMain = '#1A1A1A';
const textMuted = '#666666';
const bgPrimary = '#FFFFFF';

export default {
  light: {
    text: textMain,
    background: bgPrimary,
    tint: brandPrimary,
    tabIconDefault: textMuted,
    tabIconSelected: brandPrimary,
    brandPrimary,
    brandSecondary,
  },
  dark: {
    text: bgPrimary,
    background: textMain,
    tint: brandSecondary,
    tabIconDefault: textMuted,
    tabIconSelected: brandSecondary,
    brandPrimary,
    brandSecondary,
  },
};
