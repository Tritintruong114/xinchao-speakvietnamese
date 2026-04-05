# @xinchao/edge-functions

Supabase Edge Functions running on Deno runtime.

## Architecture

```
supabase/functions/
├── _shared/
│   ├── cors.ts          # CORS headers
│   └── types/           # ← Synced from packages/shared (DO NOT EDIT)
└── survival-scan/
    └── index.ts         # OCR + Gemini AI scan
```

## Workflow

```bash
# 1. Sync shared types
pnpm run sync-types

# 2. Serve locally
pnpm run serve

# 3. Deploy
pnpm run deploy
```

> ⚠️ **DO NOT** edit files in `supabase/functions/_shared/types/` directly.
> They are auto-synced from `packages/shared/src/types/`.
