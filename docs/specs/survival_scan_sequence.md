# Sequence Diagram: SurvivalScan Interactive Loop

This diagram maps the interaction between the User, App (Client), and Backend Services for a single scan event.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant App as Mobile App (React Native)
    participant MLKit as MLKit (On-Device)
    participant API as Supabase Edge Function
    participant DB as Postgres (Supabase)
    participant AI as Gemini 1.5 Flash
    participant TTS as Expo Speech (On-Device)

    User->>App: Points Camera + Tap Scan
    App->>DB: Check Usage Limit (Zustand/API)
    
    rect rgb(218, 37, 29, 0.1)
        Note over App,DB: IF Limit Exceeded -> Show Paywall
    end

    App->>MLKit: Quick Text Detection
    alt Keyword in Local Survival Pack?
        MLKit-->>App: Return Local Match (Fast Path)
    else Unknown / Complex Text
        App->>API: POST /scan (Base64 + Context)
        API->>AI: Prompt: "Street Specialist Expert"
        AI-->>API: Return JSON (Dish, Price, Translation)
        API->>DB: Update usage_count (+1)
        API-->>App: Return Processed Result
    end

    App->>User: Render High-Contrast Hover Card (Neo-Brutalism)
    User->>App: Tap "Speaker" Icon
    App->>TTS: Play Phrase (Vietnamese)
    TTS-->>User: [Vietnamese Voice Output]
    
    App->>App: Trigger Viral Referral Prompt (if 1st success)
```

### Key Optimizations:
1.  **Fast-Path Recognition:** By checking `MLKit` local keywords first, we reduce Cloud AI latency and costs for common items (e.g., "Phở", "Toilet").
2.  **Usage Gating:** The check happens *before* expensive AI processing to protect the API quota.
3.  **On-Device TTS:** We use `expo-speech` to avoid the data costs and latency of a cloud-based TTS engine.
