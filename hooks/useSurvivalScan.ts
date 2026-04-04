import { useState, useRef } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { supabase } from '../lib/supabase'; // We'll verify this exists
import * as FileSystem from 'expo-file-system';

export type SurvivalScanResult = {
  raw_text: string;
  translated_text: string;
  phonetic: string;
  entities: { type: string; value: string; mod?: string }[];
  survival_phrase: string;
  survival_translation: string;
};

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

        const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            throw new Error("Gemini API Key missing. Please add EXPO_PUBLIC_GEMINI_API_KEY to your .env file.");
        }

        const payload = {
            contents: [{
                parts: [
                    { text: `You are a "Vietnamese Street Specialist". Analyze the provided image snippet of a [FOOD/SIGN] and provide a high-accuracy translation optimized for a traveler's survival. Extract DISHES, PRICES, MODIFIERS, DIRECTIONS. Return a JSON object EXACTLY like this: {"type": "FOOD | SIGN | UNKNOWN", "name": "Local Name", "meaning": "English Translation", "price": 50000, "is_spicy": false, "survival_phrases": ["Cho tôi một dĩa cơm tấm"]}` },
                    { inline_data: { mime_type: "image/jpeg", data: photo.base64 } }
                ]
            }],
            generationConfig: { responseMimeType: "application/json" }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const body = await response.json();
        if (!response.ok) {
            throw new Error(body.error?.message || "Failed to call Gemini");
        }

        const geminiText = body.candidates[0].content.parts[0].text;
        const jsonResult = JSON.parse(geminiText);

        setResult({
            raw_text: jsonResult.name || "Unknown",
            translated_text: jsonResult.meaning || "Unknown",
            phonetic: "",
            entities: [],
            survival_phrase: jsonResult.survival_phrases?.[0] || "Xin chào",
            survival_translation: ""
        });
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
