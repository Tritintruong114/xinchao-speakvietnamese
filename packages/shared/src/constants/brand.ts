/**
 * Brand Colors (Raw Hex Values Only)
 * Platform-agnostic — used by both mobile and web
 *
 * Source of Truth: Design System Section 2.1
 * NOTE: Theme.ts (in apps/mobile) wraps these with RN-specific properties
 */
export const BrandColors = {
  /** Đỏ Cờ — Primary CTA, alerts */
  primary: '#DA251D',
  /** Vàng Sao — Secondary CTA, flashcard backgrounds */
  secondary: '#FFC62F',
  /** Hồng phấn — Sub-categories, positive states */
  pink: '#FF90E8',
  /** Xanh bạc hà — Success states */
  mint: '#86EFAC',
  /** Xanh lơ — Supplementary info */
  cyan: '#00E5FF',
  /** Tím oải hương — Language/culture categories */
  lavender: '#C084FC',
  /** Xanh dương nhạt — Neutral states */
  blue: '#93C5FD',
  /** Đen đậm — Main text, solid strokes */
  textMain: '#1A1A1A',
  /** Xám nhạt — Muted text */
  textMuted: '#666666',
  /** Vàng kem nhẹ — Primary background */
  bgPrimary: '#F4F4F0',
  /** Trắng */
  white: '#FFFFFF',
} as const;

export type BrandColor = keyof typeof BrandColors;
