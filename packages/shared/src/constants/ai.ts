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
   * Base URL for Google Generative AI API
   */
  GEMINI_BASE_URL: 'https://generativelanguage.googleapis.com/v1beta',

  /**
   * Vietnamese Street Specialist persona prompt prefix
   */
  PERSONA_PREFIX: 'You are a "Vietnamese Street Specialist".',
} as const;

export type AIConfigType = typeof AIConfig;
