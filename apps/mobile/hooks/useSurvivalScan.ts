import { useState, useRef } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SurvivalScanResult } from '@xinchao/shared';
import { supabase } from '../lib/supabase';



export function useSurvivalScan() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SurvivalScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scanImage = async () => {
    if (!cameraRef.current) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
        const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 });
        if (!photo || !photo.base64) {
            throw new Error("Failed to take picture");
        }

        const { data, error: invokeError } = await supabase.functions.invoke('survival-scan', {
            body: { 
                image_base64: photo.base64,
                context: "FOOD/SIGN" 
            }
        });

        if (invokeError) {
            throw new Error(invokeError.message || "Failed to call survival-scan function");
        }

        if (!data?.result) {
            throw new Error("Missing result from scan function");
        }

        setResult(data.result);
    } catch (err: any) {
        setError(err.message || "Oops! Món này lạ quá, Bé Ghế Nhựa chưa học kịp.");
    } finally {
        setIsLoading(false);
    }
  };

  const clearResult = () => {
      setResult(null);
      setError(null);
  }

  return {
    permission,
    requestPermission,
    cameraRef,
    isLoading,
    result,
    error,
    scanImage,
    clearResult
  };
}
