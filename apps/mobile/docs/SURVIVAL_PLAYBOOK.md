# ⚔️ XINCHAO SURVIVAL PLAYBOOK: THE MISSION SPEC

This document defines the standard for "Survival Missions" within the XinChao application. Every mission is designed to move a user from **Zero to Hero** in a specific real-world scenario in under 5 minutes.

---

## Ⅰ. CORE STRUCTURE (6 PHASES)

A mission must follow this exact sequence to ensure maximum "Time-to-Value":

1.  **Phase 1: Onboarding (The Mission Brief)**  
    *   **Goal:** Define the high-stakes objective.
    *   **Tone:** Urgent, practical, street-smart.

2.  **Phase 2: Micro-Learning (The Arsenal)**  
    *   **Goal:** Equip the user with 3-5 high-impact phrases.
    *   **Data:** Audio + Phonetic help + Cultural tags (North/South).

3.  **Phase 3: Tactical Intel (The Knowledge)**  
    *   **Goal:** Provide the "unfair advantage" (e.g., how to spot a fake taxi).
    *   **Format:** Teaching slides or Quizzes.

4.  **Phase 4: Verbal Drill (Voice Practice)**  
    *   **Goal:** Build muscle memory for the most critical phrase.
    *   **Validation:** Speech-to-text scoring.

5.  **Phase 5: The Showdown (Role Play Simulation)**  
    *   **Goal:** Apply all skills in a branching narrative.
    *   **Mechanics:** Time limits, AI-driven responses, and decision-based outcomes.

6.  **Phase 6: Extraction (Victory & Rewards)**  
    *   **Goal:** Gamify successful survival.
    *   **Rewards:** 100-150 XP + Unique Skill Badge.

---

## Ⅱ. DATA ARCHITECTURE

| Phase | Data Required | Location in Code |
| :--- | :--- | :--- |
| **Micro-Learning** | `vocabulary` [phrase, translation, audioUri] | `SurvivalStep.vocabulary` |
| **Tactical Intel** | `question`, `options`, `fact`, `image` | `SurvivalStep.quiz` / `teaching` |
| **The Showdown** | `dialogues` [speaker, text, options, nextId] | `SurvivalStep.dialogues` |
| **Rewards** | `xp`, `badge` | `SurvivalStep.reward` |

---

## Ⅲ. SAMPLE MOCK DATA (AIRPORT SURVIVAL)

Below is a complete `SurvivalModule` object that precisely mirrors the complexity of the **Bargaining** module, including `audioUri` for all interactions.

```typescript
import { SurvivalModule } from './types';

export const airport_survival: SurvivalModule = {
  id: 'airport_sim_taxi',
  title: 'AIRPORT ARRIVAL',
  category: 'Survival',
  image: require('../../assets/screens/home/airport.png'),
  steps: [
    {
      id: 'onboarding',
      type: 'onboarding',
      title: 'MISSION: LANDING IN SAIGON',
      goal: 'First 30 minutes: Get a SIM card and reach your hotel safely without overpaying.',
    },
    // ... intermediate steps (learn_phrases, quiz, voice_practice) ...
    {
      id: 'final_showdown',
      type: 'roleplay',
      title: 'THE TAXI STAND SHOWDOWN',
      dialogues: [
        {
          id: 'd1',
          speaker: 'app',
          tip: 'A driver approaches you: "Taxi? 500k to District 1!"',
          nextId: 'd2',
        },
        {
          id: 'd2',
          speaker: 'user',
          text: 'Đi taxi Xanh SM?',
          audioUri: require('../../assets/audio/airport/xanh_sm.mp3'),
          nextId: 'd3',
        },
        {
          id: 'd3',
          speaker: 'seller', 
          text: 'No no, Xanh SM is expensive! I give you cheap price, 400k!',
          audioUri: 'driver_offer_400k',
          nextId: 'd4',
        },
        {
          id: 'd4',
          speaker: 'user',
          options: [
            { 
              label: 'No, thank you! (South)', 
              nextId: 'd5_walkaway', 
              audioUri: require('../../assets/audio/airport/khong_cam_on.mp3') 
            },
            { 
              label: 'Okay, 400k...', 
              nextId: 'd3_fail' 
            },
          ],
          timeLimit: 8,
          timeoutId: 'd3_timeout',
        },
        {
          id: 'd3_timeout',
          speaker: 'seller',
          text: 'Hurry up! 400k, yes or no?',
          audioUri: 'driver_impatient',
          nextId: 'd4',
        },
        {
          id: 'd5_walkaway',
          speaker: 'seller',
          text: 'Wait! Okay, okay, 200k like Xanh SM! Come back!',
          audioUri: 'driver_final_offer',
          nextId: 'end_success',
        },
        {
          id: 'd3_fail',
          speaker: 'app',
          tip: 'WARNING: You just paid 3x the local price! Mission Failed.',
          nextId: 'onboarding', 
        },
      ],
    },
    {
      id: 'reward',
      type: 'reward',
      title: 'MISSION ACCOMPLISHED',
      reward: { xp: 120, badge: 'SAVVY_TRAVELER' },
    },
  ],
};
```

