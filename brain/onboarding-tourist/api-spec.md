# API Spec: Onboarding Branch A - Tourist Target

## 1. Offline Survival Pack Download
**Endpoint (Mock):** `GET /assets/packs/survival-24h.zip`
**Implementation:** 
- In the current phase, this will be simulated using a local `setTimeout` to mimic network activity.
- The "Progress Bar" should update based on fixed intervals (e.g., 20%, 50%, 85%, 100%).
- **Artifact:** A local persistent flag `is_survival_pack_downloaded` set in `useAppStore`.

## 2. XP Reward Update
**Service:** Supabase Database
**Table:** `profiles`
**Action:** `rpc` or `update`
**Logic:**
```typescript
const { data, error } = await supabase
  .from('profiles')
  .update({ xp: currentXp + 10 })
  .eq('id', userId);
```
**Trigger:** On clicking the loudspeaker icon in `aha.tsx`.

## 3. User Intent Recording
**Service:** Zustand Store (`useAppStore`)
**Action:** `setUserIntent('travel')`
**Trigger:** On initial branching (if not already set).

## 4. Analytics (Future)
**Event:** `onboarding_aha_moment_reached`
**Properties:** `{ intent: 'travel', reward_claimed: true }`
