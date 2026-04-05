const brandPrimary = '#DA251D'; // Crimson Red
const brandSecondary = '#FFC62F'; // Star Yellow
const brandPink = '#FF90E8'; // Bubblegum Pink
const brandMint = '#86EFAC'; // Mint Green
const brandCyan = '#00E5FF'; // Cyan
const brandLavender = '#C084FC'; // Lavender
const brandBlue = '#93C5FD'; // Soft Blue

const textMain = '#1A1A1A';
const textMuted = '#666666';
const bgPrimary = '#F4F4F0'; // Anti-glare Off-white

export default {
  light: {
    text: textMain,
    background: bgPrimary,
    tint: brandPrimary,
    tabIconDefault: textMuted,
    tabIconSelected: brandPrimary,
    brandPrimary,
    brandSecondary,
    brandPink,
    brandMint,
    brandCyan,
    brandLavender,
    brandBlue,
  },
  dark: {
    text: bgPrimary,
    background: textMain,
    tint: brandSecondary,
    tabIconDefault: textMuted,
    tabIconSelected: brandSecondary,
    brandPrimary,
    brandSecondary,
    brandPink,
    brandMint,
    brandCyan,
    brandLavender,
    brandBlue,
  },
};
