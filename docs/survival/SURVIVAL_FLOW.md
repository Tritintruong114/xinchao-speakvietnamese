# 🇻🇳 XinChao Survival Flow: Architectural Guide

This document outlines the architecture, data structures, and database best practices for the "Survival" module in XinChao.

## 1. Core Philosophy: "Time-to-Value"

The Survival module is designed for **immediate utility**. Unlike traditional lessons, it follows a "Learn, Practice, Survive" loop that takes under 5 minutes to complete.

---

## 2. The Step Machine (Component Logic)

The `SurvivalScreen` ([id.tsx](file:///Users/truongtritin/Github/xinchao-speak-vietnamese/app/survival/[id].tsx)) acts as a controller that iterates through a `SurvivalStep[]` array. Each step drives a specific UI component:

| Step Type          | Component             | Purpose                                                      |
| :----------------- | :-------------------- | :----------------------------------------------------------- |
| `onboarding`     | `OnboardingContent` | Sets the "Mission" (e.g., Bargaining at a market).           |
| `micro-learning` | `FlashcardItem`     | Rapidly introduces 1-3 essential "weapon" phrases.           |
| `voice_practice` | `VoicePractice`     | Speech recognition to ensure the user can say it loud.       |
| `roleplay`       | `ComicRoleplay`     | A modular coordinator for dynamic, branching state machines. |
| `reward`         | `SurvivalSuccess`   | Celebrates completion with XP and high-contrast badges.      |

---

## 3. Dynamic Database Structure (Firestore Best Practices)

To make the Survival system scalable without app updates, we recommend the following **Firestore** schema.

### Collection: `survival_modules`

Each document is a standalone module (e.g., `bargaining`, `taxi`, `airport`).

```json
{
  "id": "bargaining",
  "title": "THE ART OF BARGAINING",
  "difficulty": "survival",
  "order": 1,
  "steps": [
    { "id": "step_1", "type": "onboarding", "title": "...", "goal": "..." },
    { "id": "step_2", "type": "micro-learning", "vocabularyIds": ["vocab_123"] },
    { "id": "simulation", "type": "roleplay", "dialogueIds": ["d1", "d2", "d3"] }
  ]
}
```

### Collection: `dialogues` (The Dynamic Logic)

Roleplay steps should pull their dialogue graph from this collection. Each document represents one "node" in the interaction.

```json
{
  "id": "d8_walkaway_choice",
  "speaker": "user",
  "nextId": null,
  "timeLimit": 12,
  "timeoutId": "d8_timeout",
  "options": [
    { "label": "Pay 150k", "nextId": "end_partial" },
    { "label": "Smile and walk away", "nextId": "d9_call_back" }
  ]
}
```

### Collection: `vocabulary` (Normalized)

Storing vocabulary separately allows reuse across different survival modules.

```json
{
  "id": "bao_nhieu_tien",
  "phrase": "Cái này bao nhiêu tiền?",
  "translation": "How much is this?",
  "audio_url": "https://storage.googleapis.com/xinchao/audio/bn_tien.mp3",
  "tags": ["survival", "money"]
}
```

---

## 4. The Modular Roleplay Engine

The `ComicRoleplay` component has been refactored from a monolith into a modular coordinator. It uses a custom hook for logic and specialized components for UI.

### Architectural Breakdown

| Part                  | Type           | Responsibility                                                                               |
| :-------------------- | :------------- | :------------------------------------------------------------------------------------------- |
| `useRoleplayTimer`  | **Hook** | Manages `timeLeft`, automatic `onTimeout` transitions, and the global "Hurry Bar" toast. |
| `MascotAdvisor`     | **UI**   | Floating tip card that "whispers" advice. Keeps tips out of the chat history.                |
| `OptionGrid`        | **UI**   | Grid of `ThemedButton` items for branching user choices.                                   |
| `CalculatorOverlay` | **UI**   | Modal wrapper for price negotiation. Includes "Confirm" validation.                          |
| `DialogueBubble`    | **UI**   | Presentation-only bubbles for Seller and User.                                               |

### Dynamic Branching Logic

1. **Forced Continuation**: If `nextId` is present and `options` is null, the system can auto-advance (for seller/app lines).
2. **Time Pressure (Survival Mode)**:
   * If `timeLimit` is set, the `useRoleplayTimer` hook is activated.
   * It triggers a `showToast` with a `progress` duration.
   * If the clock hits zero, it triggers the `timeoutId` node (e.g., Seller getting impatient).
3. **Negotiation Validation**:
   * User offers using the `CalculatorOverlay` are compared against `getLatestVendorPrice()`.
   * Prevents users from "bargaining" by offering *more* than the vendor asked.

## 5. Audio Best Practices

1. **Lazy Loading**: Do not load all audio files for a module at once. The `useAudio` hook handles initialization only when the "Speaker" icon is pressed.
2. **Naming Convention**: Use semantic IDs for storage (e.g., `bargaining_seller_rejection_150k.mp3`) instead of UUIDs to make content management easier.
3. **Hardening**: Always wrap native audio imports in try-catch (as implemented in `useAudio.ts`) to prevent non-blocking UI freezes on systems without native modules.

---

## 6. Neo-Brutalism UI Implementation

When adding new dynamic components, adhere to these `Theme.ts` constants:

- **Borders**: 2px solid `#1A1A1A`.
- **Shadows**: Hard offsets (4px, 4px), no blur.
- **Colors**: High contrast (#DA251D Red, #FFC62F Yellow).
- **Typography**: `Be Vietnam Pro` (Black/ExtraBold for headers).
