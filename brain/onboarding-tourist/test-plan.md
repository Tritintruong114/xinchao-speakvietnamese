# Test Plan: Onboarding Branch A - Tourist Target

## 1. Functional Testing

### Test Case 1: Offline Setup (Screen 2A)

- **Given:** User has selected "Tourist" intent.
- **When:** User navigates to `offline.tsx`.
- **Then:** Progress bar should animate from 0% to 100%.
- **Then:** "TẢI GÓI OFFLINE" button should be disabled during download or replaced by success state.
- **Then:** `is_survival_pack_downloaded` should be `true` in local state.

### Test Case 2: AHA Moment (Screen 3A)

- **Given:** User is on `aha.tsx`.
- **When:** User clicks the loudspeaker icon.
- **Then:** Audio plays (mock or actual file).
- **Then:** Firework particle effect displays for 2 seconds.
- **Then:** XP balance increases by 10 points in the persistent profile.

### Test Case 3: Contextual Permissions (Screen 4A)

- **Given:** User is on `permissions.tsx`.
- **When:** User views the screen.
- **Then:** Explanatory text for Camera and Location is visible.
- **When:** User clicks "[ Cho phép Camera ]".
- **Then:** System permission dialog appears (if on real device/simulator).

## 2. Negative Testing

- **Poor Connection:** Simulate download failure and verify the "ĐỂ SAU" (Skip) fallback works.
- **Double Click:** Ensure XP reward can only be claimed once per onboarding session.

## 3. Visual Verification

- Border width: 2px solid #1A1A1A on all cards and buttons.
- Colors: #DA251D (Red) for primary actions, #FFC62F (Yellow) for card background.
- Typography: `Be Vietnam Pro` Bold for headings.