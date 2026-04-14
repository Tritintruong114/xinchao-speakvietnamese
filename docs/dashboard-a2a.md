# Dashboard snapshot (A2A)

Compact handoff for the **internal dashboard** in `apps/landing-web/src/app/dashboard`. **Not indexed** (`robots: noindex`). **Auth-gated** session cookie; data via **Supabase service role** (`getSupabaseAdmin`: `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`).

---

## Shell & auth

- `**layout.tsx`**: `dynamic = 'force-dynamic'`; wraps children in `**DashboardShell`**.
- `**DashboardShell**`: If path is `/dashboard/login`, render children only; else wrap in `**DashboardFrame**` (sidebar + scrollable content).
- `**middleware.ts**`: Matcher `/dashboard/:path*`. `/dashboard/login` allowed. Else requires `DASHBOARD_SESSION_SECRET` + valid `**DASHBOARD_SESSION_COOKIE**` JWT; missing secret → redirect `?reason=misconfigured`; invalid session → `/dashboard/login?next=…`.
- `**login/**`: Server action `loginAction` (email/password vs configured admins); not part of the framed shell.

---

## Sidebar nav (`DashboardFrame`)


| Route                 | Purpose                                                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `/dashboard`          | Waitlist table (`landing_waitlist`)                                                                                     |
| `/dashboard/contact`  | Contact submissions (`landing_contact_submissions`)                                                                     |
| `/dashboard/library`  | **Survival modules** CRUD (Supabase table from `@xinchao/shared` `SURVIVAL_MODULES_TABLE`)                              |
| `/dashboard/offline`  | **Saved / pocket phrases** (`saved_phrases` or equivalent; label “Offline” in UI = product naming, not marketing claim) |
| `/dashboard/settings` | Internal: API keys (ElevenLabs, optional voice id, Gemini), optional **AI module system prompt** (`ai_module_system_prompt`), admins, logout |


Active states: `library`, `offline`, `settings` use `**pathname.startsWith`**; waitlist only exact `/dashboard`.

---

## Data layer (`dashboard/data.ts`)

Server-only loaders + mutators shared by pages:

- **Waitlist / contacts:** read from `landing_waitlist`, `landing_contact_submissions`.
- **Survival modules:** `loadSurvivalModules`, `loadSurvivalModuleById`, `upsertSurvivalModuleFromDashboard`, `deleteSurvivalModuleById` — map rows with `rowsToSurvivalModules` / `survivalModuleInputToRow` from `@xinchao/shared`.
- **Saved phrases:** `loadSavedPhrases`, upsert/delete helpers; hints if `saved_phrases` migration missing.

If admin client is null → panels show `**DbErrorBanner`** (“Database is not configured.”).

---

## Feature surfaces

- **Waitlist / contact:** `WaitlistPanel`, `ContactPanel` + `DbErrorBanner`.
- **Library (`/dashboard/library`):** SSR loads modules → `**LibrarySectionClient`**. List: `**SurvivalModulesPanel`**. Create/edit: query params `?create=1` or `?edit=<id>` inside `**DashboardSlidePanel**` + `**SurvivalModuleEditor**` (JSON steps, categories from shared types). Server actions in `**library/actions.ts**` (`revalidatePath('/dashboard/library')`).
- **Library AI (Gemini + ElevenLabs):** Server actions in `**library/ai-actions.ts`**. **Generate module (Gemini):** reads `gemini_api_key` and optional `**ai_module_system_prompt**`; sent as Gemini **`systemInstruction`** (operator design system first when set, then Pha A rules in `**lib/ai/geminiSurvivalModule.ts`**), so title, steps, and **cover** `image_url` are instructed to follow the same brand/design cues. Model returns JSON including an optional **https** `image_url` (remote source); the server **ingests** that image via `**lib/survivalImageStorage.ts**` into Storage bucket **`survival-images`** and stores the **public Supabase URL** in `survival_modules.image_url` (never the raw external URL). **Generate audio (ElevenLabs):** reads `elevenlabs_api_key` + optional `elevenlabs_voice_id` (or env `ELEVENLABS_VOICE_ID`), TTS model from env `ELEVENLABS_MODEL_ID` (default `eleven_multilingual_v2`; e.g. `eleven_v3` per [ElevenLabs quickstart](https://elevenlabs.io/docs/eleven-api/quickstart)), optional `ELEVENLABS_OUTPUT_FORMAT` (e.g. `mp3_44100_128`) as query `output_format`, uploads MP3 to bucket `survival-audio`. Validation/normalize: `**lib/validation/survivalModuleDraft.ts`** (Zod); TTS slots: `**lib/ai/survivalTtsCore.ts**`. UI: AI tools block + `**ModuleDraftHitlChecklist**` in `**SurvivalModuleEditor**`. **Settings:** separate form `**saveDashboardAiModulePromptAction**` saves the module system prompt. **Ops:** do not log API keys or full model payloads; rely on server-side actions only (no keys in client bundles).
- **Offline / pocket (`/dashboard/offline`):** `loadSavedPhrases` → `**OfflineSectionClient`** + `**SavedPhrasesPanel`**; editor/delete via `**offline/actions.ts**` (`revalidatePath('/dashboard/offline')`).
- **Settings:** reads/writes encrypted or stored dashboard settings + admin list (`@/lib/dashboardSettingsDb`, `getPrimaryDashboardAdmin`); actions in `**settings/actions.ts`**.

---

## UI building blocks

Shared panels under `dashboard/panels/`: `DbErrorBanner`, `DashboardSlidePanel`, editors, delete buttons, slide-over patterns. Types: `**dashboard/types.ts`** (`WaitlistRow`, `ContactRow`).

---

## Operational notes

- Dashboard is **operator-facing**; keep copy/behavior consistent with what the mobile app and Supabase actually do.
- New dashboard routes must be **added to middleware auth** only if they stay under `/dashboard` (matcher already covers all subpaths except login flow).
- **AI quota:** Library Gemini/ElevenLabs actions are on-demand (no job queue). Avoid hammering APIs with parallel bulk runs; add throttling or a worker if operators routinely hit provider rate limits.

---

*Snapshot for agent-to-agent continuity; refresh when routes or tables change.*