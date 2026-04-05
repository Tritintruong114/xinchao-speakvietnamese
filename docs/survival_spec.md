# Survival Vietnamese: Money & Bargaining Spec

This document outlines the technical and experiential logic for the **Money Count** and **Bargaining** survival modules in the XinChao app.

---

## 1. Data Structure (The "Engine")

All modules are driven by the `SurvivalModule` interface, ensuring high performance and offline capability.

```typescript
export interface SurvivalModule {
  id: string;             // Unique identifier (e.g., 'money_count')
  title: string;          // Heading shown in UI
  category: 'Survival';   // Primary grouping
  image: any;             // Banner asset
  steps: SurvivalStep[];  // Array of interactive tasks
}

export interface SurvivalStep {
  id: string;
  type: 'onboarding' | 'micro-learning' | 'voice_practice' | 'roleplay' | 'reward' | 'quiz' | 'teaching';
  title: string;
  // Dynamic fields based on type:
  goal?: string;          // Mission statement
  description?: string;
  vocabulary?: { phrase: string; translation: string; audioUri?: string; tag?: string }[];
  targetPhrase?: string;  // For STT (Speech-to-Text) verification
  dialogues?: Dialogue[]; // For roleplay branching logic
  reward?: { xp: number; badge: string };
  // Quiz specific
  question?: string;
  image?: any;
  images?: any[];
  options?: string[];
  correctIndex?: number;
  fact?: string;
  // Teaching specific
  content?: string;
  visualHighlight?: string;
}

/**
 * The Missing Piece: Dialogue Interface
 * Supports complex branching and time-pressure scenarios.
 */
export interface Dialogue {
  id: string;
  speaker: 'seller' | 'user' | 'app' | 'mascot';
  text?: string;
  tip?: string;
  options?: {
    label: string;
    nextId: string;
    xp?: number;
    badge?: string;
    audioUri?: string;
  }[];
  audioUri?: string;
  nextId?: string;
  timeLimit?: number; // in seconds (for high-pressure bargaining)
  timeoutId?: string; // fallback if user hesitates too long
}
```

---

## 2. Module 1: Money Count (Sinh Tồn Tiền Tệ)

### Objective
Avoid the "Blue Note Trap" (500k vs 20k), master the 3-zero rule, and calculate change instantly.

### Step-by-Step Flow
1.  **Onboarding**: Mission starts. Highlight: "Master the 3-zero rule".
2.  **Micro-learning (Core Cash)**: Flashcards for 1k, 10k, 100k, 500k and "Bao nhiêu tiền?".
3.  **Teaching (Denominations)**: Difference between Cotton Paper (small) and Polymer (large).
4.  **Quiz (The Blue Trap)**: Visual identification test. *Data needed: Image of 20k and 500k notes.*
5.  **Quiz (Quick Addition)**: Bánh Mì + Water = ? *Logic: Simple math using real-world prices.*
6.  **Quiz (Calculating Change)**: Paying 100k for a 75k meal.
7.  **Teaching (Metro Survival)**: Fare logic (Paper vs Card).
8.  **Roleplay (Hotel Price Check)**: Dialogue simulating asking for room price per night.
9.  **Voice Practice (Street Slang)**: Mastering "Rưỡi" (and a half) for millions.

### Required Data
- **Audio**: Native pronunciation for all currency values and "rưỡi".
- **Visuals**: High-resolution PNGs of current VND banknotes (front/back).

---

## 3. Module 2: The Art of Bargaining (Nghệ Thuật Trả Giá)

### Objective
Negotiate like a local, recognize high-pressure tactics, and use "The Walkaway" strategy.

### Step-by-Step Flow
1.  **Stage 1: Asking**: Vocabulary for "How much is this?".
2.  **Stage 2: Weapons**: Teaching surprise phrases: "Mắc quá!" (South) and "Đắt thế!" (North).
3.  **Stage 3: Closing**: Polite exit or deal closing: "Cảm ơn!".
4.  **Voice Practice**: Mandatory pronunciation check for "Cái này bao nhiêu tiền?".
5.  **Full Market Simulation**: A branching dialogue roleplay.

### Roleplay Branching Logic (The "Brain")
1.  **User asks price**: "Cái này bao nhiêu tiền?".
2.  **Seller offers**: "For you, 200,000 VND".
3.  **User Counters**:
    - *Decision A*: Complain "Too expensive!".
    - *Decision B*: Use "Calculator Strategy" (type 100k).
4.  **Seller Responds**: "No, too low! 150k final price!".
5.  **The Walkaway Choice**:
    - *Action A*: Accept 150k.
    - *Action B*: Shake head and walk away.
6.  **The Deal**: Seller calls back: "Wait! Okay, okay, 100k! Deal!".

### Required Data
- **Dialogue Scripts**: Persona matching (Street Seller vs Polite Traveler).
- **Audio**: Multi-modal (User audio, Seller audio, App tips).

---

## 4. Roles & Responsibilities

| Role | Action | Expected Output |
| :--- | :--- | :--- |
| **USER** | Speaks phrase, taps choice, calculates change. | "Aha!" moment, Survival Badge. |
| **SELLER** | Challenges user with high prices and pressure. | Branching dialogue response. |
| **APP/MASCOT** | Guides user through "traps" and slang tips. | +100 XP, Badge reward. |

---

## 6. Data Prototype: Bargaining Roleplay (JSON)

This implementation shows how the branching logic handles the "Walkaway Strategy".

```json
[
  {
    "id": "d1",
    "speaker": "app",
    "tip": "Step into the market and point at a shirt you like.",
    "nextId": "d2"
  },
  {
    "id": "d2",
    "speaker": "user",
    "text": "Cái này bao nhiêu tiền?",
    "audioUri": "audio/bargaining/baonhieutien.mp3",
    "nextId": "d3"
  },
  {
    "id": "d3",
    "speaker": "seller",
    "text": "This one? Top quality! For you, 200,000 VND.",
    "nextId": "d4"
  },
  {
    "id": "d4",
    "speaker": "user",
    "options": [
      { "label": "Mắc quá! (South)", "nextId": "d5_offer" },
      { "label": "Đắt thế! (North)", "nextId": "d5_offer" }
    ]
  },
  {
    "id": "d5_offer",
    "speaker": "app",
    "tip": "Tip: Hand over your calculator and type 100,000.",
    "nextId": "d6_calc"
  },
  {
    "id": "d7_rejection",
    "speaker": "seller",
    "text": "No no, too low! My cost is high. 150,000 VND, take it or leave it!",
    "nextId": "d8_walkaway_choice"
  },
  {
    "id": "d8_walkaway_choice",
    "speaker": "user",
    "options": [
      { "label": "Pay 150k", "nextId": "end_partial" },
      { "label": "Shake head, smile and walk away", "nextId": "d9_call_back" }
    ],
    "timeLimit": 12,
    "timeoutId": "d8_timeout"
  },
  {
    "id": "d9_call_back",
    "speaker": "seller",
    "text": "Wait! Come back! Okay, okay, 100,000 VND! Deal!",
    "nextId": "d10_thank"
  }
]
```

---

## 7. Metadata & Assets

- **Model ID**: `gemini-3.1-flash-lite-preview` (Used for generating dynamic slang or future scenarios).
- **Offline First**: All `SURVIVAL_MODULES` must be bundled in the app for traveler reliability.
- **Success Criteria**: 100% completion of all steps in the module.

---

> [!TIP]
> **Action-Oriented Design**: In bargaining, if the user picks the "Pay 150k" choice, tell them they could have gotten it for 100k if they walked away. This creates a replayable "Street Pro" lesson.
