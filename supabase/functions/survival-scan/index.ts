import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { image_base64, context } = await req.json();

    if (!image_base64) {
      throw new Error('image_base64 is required');
    }

    const API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!API_KEY) {
       throw new Error('Gemini API key not configured');
    }

    const payload = {
        contents: [
            {
                parts: [
                    { text: `You are a "Vietnamese Street Specialist". Analyze the provided image snippet of a [${context}] and provide a high-accuracy translation optimized for a traveler's survival. Extract DISHES, PRICES, MODIFIERS, DIRECTIONS. Return a JSON object EXACTLY like this (ensure it's valid JSON): {"type": "FOOD | SIGN | UNKNOWN", "name": "Local Name", "meaning": "English Translation", "price": 50000, "is_spicy": false, "survival_phrases": ["Cho tôi một dĩa cơm tấm"]}` },
                    { 
                        inline_data: { 
                            mime_type: "image/jpeg", 
                            data: image_base64 
                        } 
                    }
                ]
            }
        ],
        generationConfig: {
            responseMimeType: "application/json"
        }
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${API_KEY}`, {
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

    // Map to our expected SurvivalScanResult
    const finalResult = {
        raw_text: jsonResult.name || "Unknown text",
        translated_text: jsonResult.meaning || "Unknown meaning",
        phonetic: "", // Optional
        entities: [], // Optional
        survival_phrase: jsonResult.survival_phrases?.[0] || "Xin chào",
        survival_translation: ""
    };

    return new Response(
      JSON.stringify({ result: finalResult }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    })
  }
})
