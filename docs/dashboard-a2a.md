# Dashboard snapshot (A2A)

Compact handoff for the **internal dashboard** in `apps/landing-web/src/app/dashboard`. **Not indexed** (`robots: noindex`). **Auth-gated** session cookie; data via **Supabase service role** (`getSupabaseAdmin`: `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`).

---

## Shell & auth

- `**layout.tsx`**: `dynamic = 'force-dynamic'`; wraps children in `**DashboardShell**`.
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
| `/dashboard/settings` | Internal: API keys (e.g. ElevenLabs, Gemini), list/create dashboard admins, logout                                      |


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
- **Library (`/dashboard/library`):** SSR loads modules → `**LibrarySectionClient`**. List: `**SurvivalModulesPanel**`. Create/edit: **query params** `?create=1` or `?edit=<id>` inside `**DashboardSlidePanel`** + `**SurvivalModuleEditor**` (JSON steps, categories from shared types). Server actions in `**library/actions.ts**` (`revalidatePath('/dashboard/library')`).
- **Offline / pocket (`/dashboard/offline`):** `loadSavedPhrases` → `**OfflineSectionClient`** + `**SavedPhrasesPanel**`; editor/delete via `**offline/actions.ts**` (`revalidatePath('/dashboard/offline')`).
- **Settings:** reads/writes encrypted or stored dashboard settings + admin list (`@/lib/dashboardSettingsDb`, `getPrimaryDashboardAdmin`); actions in `**settings/actions.ts`**.

---

## UI building blocks

Shared panels under `dashboard/panels/`: `DbErrorBanner`, `DashboardSlidePanel`, editors, delete buttons, slide-over patterns. Types: `**dashboard/types.ts**` (`WaitlistRow`, `ContactRow`).

---

## Operational notes

- Dashboard is **operator-facing**; keep copy/behavior consistent with what the mobile app and Supabase actually do.
- New dashboard routes must be **added to middleware auth** only if they stay under `/dashboard` (matcher already covers all subpaths except login flow).

---

*Snapshot for agent-to-agent continuity; refresh when routes or tables change.*