# Survival Module Offline-First Architecture Plan

## Objective
Migrate the `Survival` module's hardcoded/static content to a **Dynamic, Offline-First** architecture using **Supabase** (as Source of Truth) and **MMKV** (as local persistence).

## Implementation Roadmap

### Phase 1: Infrastructure Setup
- [ ] Install `react-native-mmkv` in `apps/mobile`.
- [ ] Create `apps/mobile/lib/mmkv.ts` for global storage access.
- [ ] Implement `SurvivalSyncService` (a hook/module to sync Supabase collections to MMKV).

### Phase 2: Data Modeling & Adapter
- [ ] Define `SurvivalData` interface (matching Supabase collections: `survival_modules`, `dialogues`, `vocabulary`).
- [ ] Create `SurvivalStore` to manage MMKV keys (e.g., `modules`, `dialogues`, `vocab`).
- [ ] Implement a **Sync Logic**:
    - Fetch from Supabase via `supabase.from(...)`.
    - `JSON.stringify` data into MMKV.
    - Add a `version` or `timestamp` check for incremental sync.

### Phase 3: Engine Decoupling
- [ ] Refactor `hooks/useSurvivalScan.ts` and other UI components to read from `SurvivalStore` instead of static constants.
- [ ] Ensure fallback: If Supabase fails, data is always pulled from MMKV.

### Phase 4: Verification
- [ ] Test offline behavior (mock network off).
- [ ] Ensure smooth UI transitions between roleplay nodes using local state.

---

## Current Status
- Identified existing connection in `apps/mobile/lib/supabase.ts`.
- Identified current static data usage in `apps/mobile/components/survival/`.
- Preparing to setup MMKV.
