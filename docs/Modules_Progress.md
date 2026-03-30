# XinChao: Modules Progress Tracker

This document tracks the current implementation status of learning modules for AI agents.

## 1. Categories Overview
- **BEGINNER**: Basic survival vocabulary and cultural rules.
- **SURVIVAL**: Practical scenarios for navigating street life and transportation.
- **LEGEND**: High-level cultural immersion and modern slang.

## 2. Module Implementation Status & Assets Tracking

| Module ID | Category | Card UI | Image Gen | Curriculum | Mock JSON |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `money_count` | Beginner | ✅ | ✅ Supabase Uploaded | ✅ [Done](file:///Users/truongtritin/Github/xinchao-speak-vietnamese/docs/money_count/CURRICULUM.md) | ✅ [Done](file:///Users/truongtritin/Github/xinchao-speak-vietnamese/docs/money_count/MOCK_DATA.json) |
| `greetings` | Beginner | ✅ | ✅ OK | 🚧 Draft | 🚧 Pending |
| `directions` | Survival | ✅ | ✅ OK | 🚧 Draft | 🚧 Pending |
| `restaurant` | Survival | ✅ | ✅ OK | 🚧 Draft | 🚧 Pending |
| `bargaining` | Survival | ✅ | ✅ OK | ✅ Done | ✅ Ready |
| `nhau_culture` | Survival | ✅ | ✅ OK | 🚧 Pending | 🚧 Pending |
| `ride_hailing` | Survival | ✅ | ✅ OK | 🚧 Pending | 🚧 Pending |
| `metro` | Survival | ✅ | ✅ OK | 🚧 Pending | 🚧 Pending |
| `sleeper_bus` | Survival | ✅ | ✅ OK | 🚧 Pending | 🚧 Pending |
| `train` | Survival | ✅ | 🔄 RE-GEN | 🚧 Pending | 🚧 Pending |
| `airplane` | Survival | ✅ | 🔄 RE-GEN | 🚧 Pending | 🚧 Pending |
| `genz_slang` | Legend | ✅ | ✅ OK | 🚧 Pending | 🚧 Pending |
| `expat_life` | Legend | ✅ | ✅ OK | 🚧 Pending | 🚧 Pending |

## 3. Asset Tasks (For UI Designer)
- [ ] **Train**: [BLOCKED - Quota] Regenerate to match the blue/red D19E "Đổi mới" locomotive look.
- [ ] **Airplane**: [BLOCKED - Quota] Regenerate to show a Vietnam Airlines plane in-flight (over mountains/sea).

## 4. Content Tasks (For Product Owner)
- [ ] Import "Money Count" logic for the "Drop 3 Zeros" rule.
- [ ] Extend "Bargaining" dialogue to include multiple price points.
- [ ] Design transportation stubs (Metro, Bus, Train, Plane) paths.

---
*Note to AI Agents: Always check this file before modifying the module registry in `SurvivalData.ts` or the Home grid in `index.tsx`.*
