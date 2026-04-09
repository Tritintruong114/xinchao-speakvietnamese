import { SurvivalScanResult } from '@xinchao/shared';
import { FunctionsFetchError } from '@supabase/functions-js';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { useCallback, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useToastStore } from '../store/useToastStore';

/** Max edge for upload — đủ cho OCR menu, giữ base64 ~ vài trăm KB thay vì hàng MB. */
const SCAN_IMAGE_MAX_WIDTH = 1080;
const SCAN_JPEG_COMPRESS = 0.72;
const SURVIVAL_SCAN_INVOKE_TIMEOUT_MS = 15_000;

const TIMEOUT_TOAST =
  'AI đang bị kẹt xe! Vui lòng thử chụp lại nhé.';

function isAbortedFunctionInvoke(error: unknown): boolean {
  if (error instanceof FunctionsFetchError) {
    const ctx = error.context as { name?: string; message?: string } | undefined;
    if (ctx?.name === 'AbortError') return true;
    if (String(ctx?.message ?? '').toLowerCase().includes('abort')) return true;
  }
  if (error && typeof error === 'object' && 'name' in error && (error as { name: string }).name === 'AbortError') {
    return true;
  }
  return false;
}

export function useSurvivalScan() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SurvivalScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const showToast = useToastStore((s) => s.showToast);

  const scanImage = useCallback(async () => {
    if (!cameraRef.current) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: false,
        quality: 0.85,
      });
      if (!photo?.uri) {
        throw new Error('Failed to take picture');
      }

      const manipulated = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: SCAN_IMAGE_MAX_WIDTH } }],
        {
          compress: SCAN_JPEG_COMPRESS,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        },
      );

      if (!manipulated.base64) {
        throw new Error('Failed to encode image');
      }

      const { data, error: invokeError } = await supabase.functions.invoke<{ result: SurvivalScanResult }>(
        'survival-scan',
        {
          body: {
            image_base64: manipulated.base64,
            context: 'FOOD/SIGN',
          },
          timeout: SURVIVAL_SCAN_INVOKE_TIMEOUT_MS,
        },
      );

      if (invokeError) {
        if (isAbortedFunctionInvoke(invokeError)) {
          showToast(TIMEOUT_TOAST, 'warning', 4);
          return;
        }
        throw new Error(invokeError.message || 'Failed to call survival-scan function');
      }

      if (!data?.result) {
        throw new Error('Missing result from scan function');
      }

      setResult(data.result);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Oops! Món này lạ quá, Bé Ghế Nhựa chưa học kịp.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    permission,
    requestPermission,
    cameraRef,
    isLoading,
    result,
    error,
    scanImage,
    clearResult,
  };
}
