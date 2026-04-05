# 🇻🇳 XinChao - Speak Vietnamese. Survive. Connect.

XinChao is a modern, fast-paced Vietnamese learning application designed for travelers, expats, and anyone needing to "survive" and "connect" in Vietnam. No grammar fluff—just real-world utility in 30 seconds.

## 🚀 Project Overview

The project is structured as a **Turborepo Monorepo** for scalability and code sharing across different platforms.

```text
xinchao-monorepo/
├── apps/
│   ├── mobile/            # ⚛️ Main React Native Expo App
│   ├── edge-functions/    # ⚡ Supabase Edge Functions (Deno)
│   └── landing-web/       # 🌐 Pre-allocated space for Marketing Web
├── packages/
│   ├── shared/            # 📦 Core logic, models, and AI constants
│   ├── config-ts/         # 🛠️ Shared TypeScript presets
│   └── config-eslint/     # 🚨 Shared ESLint rules
├── docs/                  # 📄 Unified Project Documentation
└── pnpm-workspace.yaml    # 🏗️ Workspace configuration
```

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| **Mobile** | React Native (Expo SDK 55) |
| **Web** | React.js / Next.js |
| **Backend** | Supabase (PostgreSQL, Auth, Storage) |
| **Edge Computing** | Deno (Supabase Edge Functions) |
| **AI Engine** | Google Gemini 1.5 Flash / 2.0 Flash Lite |
| **Monorepo Tool** | Turborepo + pnpm |

## 🛠️ Getting Started

### 1. Prerequisites
- [pnpm](https://pnpm.io/) (v10+)
- [Node.js](https://nodejs.org/) (v20+)
- [Expo Go](https://expo.dev/go) (for mobile testing)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (for edge functions)

### 2. Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd xinchao-speak-vietnamese

# Install dependencies
pnpm install
```

### 3. Development
Run the whole project or specific applications:

```bash
# Run everything (Mobile + Web + Functions)
pnpm dev

# Run only Mobile App
pnpm run dev --filter @xinchao/mobile

# Run only Edge Functions
pnpm run serve --filter @xinchao/edge-functions
```

### 4. Shared Packages
When updating types or constants in `packages/shared`, you should sync them with the edge functions:

```bash
pnpm run sync-types
```

## 📐 Design System
XinChao follows a **Neo-Brutalism** design system:
- **Colors:** Vibrant Red (#DA251D), Yellow (#FFC62F), and Pink (#FF90E8).
- **Typography:** Be Vietnam Pro.
- **Aesthetic:** High contrast, hard shadows, and bold lines.

Refer to [docs/survival/survival_spec.md](docs/survival/survival_spec.md) for more design and feature details.

## 📁 Documentation
Explore the `docs/` directory for detailed specifications:
- [Architecture & API](docs/architecture/)
- [Database Schema](docs/database/)
- [Feature Specs](docs/specs/)
- [Survival Modules](docs/survival/)

---
*Speak Vietnamese. Survive. Connect.*
