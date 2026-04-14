/**
 * Centralized AI Configuration for XinChao
 * Platform-agnostic — no React Native or Deno imports
 *
 * Source of Truth: Design System Rule 7.1
 * "Mọi cấu hình AI phải được quản lý tại file này"
 */
export const AIConfig = {
  /**
   * Default Gemini model for all vision and text tasks.
   * Optimized for survival scan performance and lower latency.
   */
  DEFAULT_GEMINI_MODEL: 'gemini-3.1-flash-lite-preview',

  /**
   * Native image generation (Nano Banana) for dashboard module covers — do not use for text JSON modules.
   * @see https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash-image
   */
  GEMINI_IMAGE_MODEL: 'gemini-2.5-flash-image',

  /**
   * Base URL for Google Generative AI API
   */
  GEMINI_BASE_URL: 'https://generativelanguage.googleapis.com/v1beta',

  /**
   * Vietnamese Street Specialist persona prompt prefix
   */
  PERSONA_PREFIX: 'You are a "Vietnamese Street Specialist".',
} as const;

export type AIConfigType = typeof AIConfig;
