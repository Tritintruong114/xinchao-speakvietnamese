# Walkthrough: Onboarding Branch A - Tourist Target

I have completed the implementation of the "Tourist Target" onboarding branch. The flow is optimized for speed (TTV < 1 min) and features a consistent Neo-brutalism design style.

## Key Features Implemented

### 1. Offline Support (`offline.tsx`)

- **Language:** Updated to **100% English** (Copy: "No Wi-Fi? No Problem.").
- **UI:** Neo-brutalism Progress Bar with thick borders and vibrant colors.
- **Logic:** Background simulation of "24h Survival Packs" download.
- **State:** Persisted in `useAppStore` as `isSurvivalPackDownloaded`.

### 2. AHA Moment (`aha.tsx`)

- **Language:** Instructions and UI translated to English.
- **Experience:** Interactive Flashcard "Bao nhiêu tiền?".
- **Interaction:** Clicking the loudspeaker icon triggers:
  - Particle "Firework" effect.
  - Success badge display.
  - **Supabase Integration:** Updates current user profile with +10 XP.

### 3. Contextual Permissions (`permissions.tsx`)

- **Language:** 100% English trust-building copy.
- **Trust Building:** Explains the specific use cases for **Camera** (OCR Translation) and **Location** (Geo-push notifications) before continuing to the Dashboard.

### 4. Technical Details

- **Component Fix:** Enhanced `ThemedButton` to support `disabled` state with opacity and shadow-removal styles.
- **Styling:** Adheres to `design-system.md` with 2px solid borders, #DA251D (Red), and #FFC62F (Yellow).
- **Architecture:** Clean separation of concerns between state (Zustand), UI (React Native Components), and Backend (Supabase).

## Verification Evidence

- [SRS Document](file:///Users/truongtritin/Github/xinchao%20-%20speak%20vietnamese/brain/onboarding-tourist/srs.md)
- [API Spec](file:///Users/truongtritin/Github/xinchao%20-%20speak%20vietnamese/brain/onboarding-tourist/api-spec.md)
- [Test Plan](file:///Users/truongtritin/Github/xinchao%20-%20speak%20vietnamese/brain/onboarding-tourist/test-plan.md)

---

*Next Steps: The user is redirected to the Dashboard focused on Emergency situations.*