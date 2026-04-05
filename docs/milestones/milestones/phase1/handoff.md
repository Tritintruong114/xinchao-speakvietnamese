# Project Handoff: XinChao (Speak Vietnamese)

## Project Overview
**XinChao** is a React Native (Expo) application designed for rapid Vietnamese language acquisition with a focus on "survival" and "connection" (e.g., "Sinh tồn ở chợ", "Giao tiếp sân bay").

**Tagline:** *Speak Vietnamese. Survive. Connect.*
**Tone of Voice:** Short, practical, action-oriented, and youthful.

---

## Tech Stack
- **Framework:** Expo (React Native) using SDK 55.
- **Navigation:** Expo Router (Stack & Tabs).
- **Authentication:** Firebase Auth (Anonymous sign-in as the default entry point).
- **Database/Backend:** Supabase (Profiles, XP, streaks, and future content syncing).
- **State Management:** Zustand (with `expo-secure-store` persistence).
- **Typography:** `Be Vietnam Pro` (Custom Google Font).
- **Design System:** Neubrutalism-inspired (Hard shadows, 2px borders, vibrant Red #DA251D and Yellow #FFC62F).

---

## Core Architecture & Flows

### 1. Authentication Flow (`app/(auth)/login.tsx`)
- The "START LEARNING" button triggers an anonymous Firebase sign-in.
- `AuthContext.tsx` listens for state changes and syncs the user to a Supabase `profiles` table.
- If no profile exists, one is created with:
  - `xp: 0`
  - `streak: 0`
  - `display_name: 'Learner'`

### 2. Navigation & Redirection (`app/_layout.tsx`)
- **Persistence:** `hasOnboarded` flag in the Zustand store determines the destination.
- **New Users:** Redirected to `(onboarding)` flow.
- **Existing/Signed-in Users:** Redirected to the main `(tabs)` dashboard.

### 3. Onboarding Flow (`app/(onboarding)/`)
- Progressive disclosure screens including:
  - `intent.tsx`: User goal selection (Travel vs. Work).
  - `aha.tsx`: Early value demonstration.
  - `permissions.tsx`: Requesting system access.
  - `offline.tsx`: Highlighting offline capabilities.

### 4. Global State (`store/useAppStore.ts`)
- Manages `hasOnboarded`, `userIntent`, and `onboardingStatus`.
- Persisted securely using `expo-secure-store`.

---

## Key Files & Directories
- `/app/_layout.tsx`: Root layout, navigation logic, and font loading.
- `/context/AuthContext.tsx`: Firebase & Supabase integration.
- `/constants/Theme.ts`: Centralized design system tokens (Colors, Spacing).
- `/components/`: Reusable themed components (`ThemedButton`, `ThemedText`).
- `/RULE[design-system.md]`: **CRITICAL** guidelines for UI/UX consistency.

---

## Current Status (Phase 1)
- Core auth and navigation infrastructure is implemented.
- Onboarding flow structure is defined.
- Design system tokens are established and enforced.

## Agent Instructions
- **UI/UX:** Always follow the `design-system.md` precisely. Use `Colors.brandPrimary` (Red) for primary actions and `Colors.brandSecondary` (Yellow) for highlights.
- **Logic:** Maintain the anonymous-first auth pattern.
- **Performance:** App aims for high responsiveness and offline support.
