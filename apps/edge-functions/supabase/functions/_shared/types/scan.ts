/**
 * Survival Scan Result Types
 * Extracted from hooks/useSurvivalScan.ts
 * Used by both mobile app and edge functions
 */

export interface SurvivalScanResult {
  raw_text: string;
  translated_text: string;
  phonetic: string;
  entities: { type: string; value: string; mod?: string }[];
  survival_phrase: string;
  survival_translation: string;
}

export interface ScanRequest {
  image_base64: string;
  context: 'FOOD' | 'SIGN';
  lat?: number;
  lng?: number;
}

export interface ScanResponse {
  id?: string;
  result: SurvivalScanResult;
  usage?: {
    remaining: number;
    limit: number;
    reset_at: string;
  };
}

export interface ScanError {
  error: string;
  code?: 'ERR_IMAGE_UNREADABLE' | 'ERR_LIMIT_EXCEEDED' | 'ERR_OFF_TOPIC' | 'ERR_AI_TIMEOUT';
}
