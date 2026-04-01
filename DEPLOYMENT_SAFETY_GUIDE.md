# BioR Deployment Safety Guide

## CRITICAL: Read This Before Deploying ANYTHING

This document prevents accidental overwrites of the BioR platform. The #1 mistake
is deploying the wrong code to the wrong Cloudflare project.

---

## Complete Infrastructure Map

### Cloudflare Projects (NEVER mix these up)

| CF Project Name | Domain | What It Is | GitHub Repo | Has D1 DB? | Secrets |
|---|---|---|---|---|---|
| `bior` | **bior.tech**, www.bior.tech | Main BioR Platform (SPA) — sign-in, dashboard, hub, ALL features | `mf2022-dev/BioR` | YES (`bior-production`) | JWT_SECRET, LOCKDOWN_MODE, SITE_ACCESS_KEY |
| `tabletap` | **tabletap-axb.pages.dev** | TableTap War Games KB — 20 pandemic exercise cards (linked from BioR hub) | `mf2022-dev/TableTap-WG` | No | None |
| `data-library` | **data-library.bior.tech** | RAND-ENGIN Dashboard (standalone) | `mf2022-dev/RAND-ENGIN` | No | None |
| `bior-data-library` | data.bior.tech | Older data library (may be deprecated) | — | — | — |
| `adc-research-ibdaa-2026` | bioalfa.net | ADC Research platform | — | — | — |
| `bior-geointel` | bior-geointel.pages.dev | GeoIntel standalone | — | — | — |
| `bior-sampletrack` | sampletrack.bior.tech | SampleTrack LIMS | — | — | — |

### The Golden Rule

```
bior.tech                = ONLY deploy from /home/user/bior-toolkit (github.com/mf2022-dev/BioR)
                           ONLY use: --project-name bior

tabletap-axb.pages.dev   = ONLY deploy from /home/user/webapp (github.com/mf2022-dev/TableTap-WG)
                           ONLY use: --project-name tabletap

data-library.bior.tech   = ONLY deploy from github.com/mf2022-dev/RAND-ENGIN
                           ONLY use: --project-name data-library
```

**NEVER deploy webapp/TableTap code to `--project-name bior`** (this destroys bior.tech!)
**NEVER deploy BioR code to `--project-name tabletap`** (this destroys TableTap!)
**NEVER deploy RAND-ENGIN code to `--project-name bior`**

---

## BioR Platform Architecture (bior.tech)

### How Pages Are Served

```
User visits bior.tech
        |
        v
  Cloudflare Pages Worker (_worker.js)
        |
        v
  src/index.ts (Hono app)
        |
        |-- Middleware: LOCKDOWN check → if true, show blocked page
        |-- Middleware: JWT secret init
        |-- Middleware: Security headers
        |-- Middleware: CORS
        |-- Middleware: Auth (for /api/* routes)
        |
        |-- /api/*  → src/routes/api.ts (64+ API endpoints, D1 database)
        |-- /login   → src/templates/login.ts (standalone login page)
        |-- /*       → src/templates/spa/shell.ts (SPA shell — ALL other pages)
                          |
                          v
                    SPA renders client-side:
                      /#/hub        → Project Hub (hub.ts) — Data Library cards here
                      /#/project    → Individual project view (workspace.ts)
                      /#/benchmark  → PSEF Benchmark (benchmark.ts)
                      /#/geointel   → GeoIntel map (geointel.ts)
                      /#/rskb       → Regulatory KB (rskb.ts)
                      /#/datasets   → Dataset explorer (datasets.ts)
                      /#/analytics  → Analytics dashboard (analytics.ts)
```

### Which Files Produce Which Pages

| Page You See | URL | Source File(s) |
|---|---|---|
| **Sign-in / Login** | bior.tech/login | `src/templates/login.ts` |
| **Blocked page** (lockdown) | bior.tech (when LOCKDOWN=true) | `src/index.ts` → `getBlockedPage()` |
| **SPA Shell** (wrapper for all below) | bior.tech/ | `src/templates/spa/shell.ts` + `styles.ts` |
| **Project Hub** | bior.tech/#/hub | `src/templates/spa/scripts/modules/hub.ts` |
| **Data Library cards** | inside hub | `hub.ts` → `loadDataLibrary()` function |
| **Dashboard/Project** | bior.tech/#/project | `src/templates/spa/scripts/modules/workspace.ts` |
| **Benchmark** | bior.tech/#/benchmark | `src/templates/spa/scripts/modules/benchmark.ts` |
| **GeoIntel** | bior.tech/#/geointel | `src/templates/spa/scripts/modules/geointel.ts` |
| **RSKB** | bior.tech/#/rskb | `src/templates/spa/scripts/modules/rskb.ts` |
| **Analytics** | bior.tech/#/analytics | `src/templates/spa/scripts/modules/analytics.ts` |
| **Auth logic** | (client-side) | `src/templates/spa/scripts/modules/auth.ts` |
| **Layout/sidebar** | (client-side) | `src/templates/spa/scripts/modules/layout.ts` |
| **API backend** | bior.tech/api/* | `src/routes/api.ts` + `src/lib/*.ts` |

### Source File Structure

```
BioR/
├── src/
│   ├── index.ts                          ← ENTRY POINT (Hono app, middleware, lockdown)
│   ├── routes/
│   │   ├── api.ts                        ← ALL API endpoints (auth, CRUD, datasets, etc.)
│   │   └── pages.ts                      ← Page routing (/login → login.ts, /* → SPA)
│   ├── lib/
│   │   ├── auth.ts                       ← JWT auth, roles, middleware
│   │   ├── crypto.ts                     ← Passwords, encryption, tokens
│   │   ├── totp.ts                       ← 2FA TOTP
│   │   ├── events.ts                     ← SSE real-time events
│   │   ├── analytics.ts                  ← Analytics helpers
│   │   └── reportGenerator.ts            ← Automated report generation
│   └── templates/
│       ├── login.ts                      ← LOGIN PAGE HTML
│       └── spa/
│           ├── shell.ts                  ← SPA HTML SHELL (assembles everything)
│           ├── styles.ts                 ← ALL CSS STYLES (green theme #00A86B)
│           └── scripts/
│               ├── index.ts              ← Assembles all JS modules
│               └── modules/
│                   ├── core.ts           ← State, API wrapper, utilities
│                   ├── init.ts           ← App initialization, URL routing
│                   ├── render.ts         ← View router (which view to show)
│                   ├── layout.ts         ← Sidebar, header, navigation
│                   ├── auth.ts           ← Login/register forms, JWT handling
│                   ├── hub.ts            ← PROJECT HUB + DATA LIBRARY CARDS
│                   ├── workspace.ts      ← Project workspace/dashboard
│                   ├── datasets.ts       ← Dataset explorer
│                   ├── benchmark.ts      ← PSEF Benchmark
│                   ├── geointel.ts       ← GeoIntel maps
│                   ├── rskb.ts           ← Regulatory Knowledge Base
│                   └── analytics.ts      ← Analytics dashboard
├── migrations/                           ← D1 database migrations
├── public/
│   ├── static/                           ← Static JSON data files
│   └── js/                               ← Static JS (auth helper)
├── wrangler.jsonc                        ← Cloudflare config (D1 binding)
├── package.json
└── vite.config.ts
```

---

## Safe Deployment Commands

### Deploying BioR Platform (bior.tech)

```bash
# SAFETY CHECK: Verify you're in the right directory
cat wrangler.jsonc | grep '"name"'
# Must show: "bior-platform"
# If it shows anything else, STOP — you're in the wrong project!

# SAFETY CHECK: Verify the git remote
git remote -v
# Must show: github.com/mf2022-dev/BioR.git
# If it shows anything else, STOP!

# SAFETY CHECK: Verify green theme exists in built output
npm run build
grep -c "#00A86B" dist/_worker.js
# Must show 250+ matches. If 0, STOP — wrong code!

# Deploy (only after all 3 checks pass)
npx wrangler pages deploy dist --project-name bior

# Verify
curl -s https://bior.tech | grep -c "#00A86B"
# Must show 250+
```

### Deploying RAND-ENGIN (data-library.bior.tech)

```bash
# SAFETY CHECK: Verify you're in the right directory
cat wrangler.jsonc | grep '"name"'
# Must show: "webapp"

# SAFETY CHECK: Verify the git remote
git remote -v
# Must show: github.com/mf2022-dev/RAND-ENGIN.git

# Deploy
npm run build
npx wrangler pages deploy dist --project-name data-library

# Verify
curl -s https://data-library.bior.tech | grep "RAND-ENGIN"
```

---

## Pre-Deployment Checklist (Copy-Paste This)

Before ANY deployment, answer these questions:

```
[ ] 1. WHAT am I deploying?
      → BioR Platform / RAND-ENGIN / Other: ____________

[ ] 2. WHERE am I deploying TO?
      → CF project name: ____________
      → Expected domain: ____________

[ ] 3. Am I in the CORRECT directory?
      → Run: cat wrangler.jsonc | grep '"name"'
      → Expected: ____________ Actual: ____________

[ ] 4. Is the git remote CORRECT?
      → Run: git remote -v
      → Expected repo: ____________ Actual: ____________

[ ] 5. Did I BUILD successfully?
      → Run: npm run build
      → Worker size: ____________ KB

[ ] 6. VERIFICATION after deploy:
      → Run: curl -s <DOMAIN> | grep "<UNIQUE_STRING>"
      → Result: ____________
```

---

## If Something Goes Wrong — Recovery

### Restore BioR Platform (bior.tech)

```bash
# Option 1: From git tag (fastest)
git clone https://github.com/mf2022-dev/BioR.git
cd BioR
git checkout stable-2026-03-26_0110-UTC
npm install
npm run build
npx wrangler pages deploy dist --project-name bior

# Option 2: From backup archive
# Download: https://www.genspark.ai/api/files/s/g5bSDDgj
# Extract, npm install, npm run build, deploy

# Option 3: Re-set secrets if they were lost
npx wrangler pages secret put JWT_SECRET --project-name bior
npx wrangler pages secret put LOCKDOWN_MODE --project-name bior
# Enter: false
npx wrangler pages secret put SITE_ACCESS_KEY --project-name bior
# Enter: BioR2026Admin
```

### Restore RAND-ENGIN (data-library.bior.tech)

```bash
git clone https://github.com/mf2022-dev/RAND-ENGIN.git
cd RAND-ENGIN
npm install
npm run build
npx wrangler pages deploy dist --project-name data-library
```

---

## Environment Variables / Secrets

### bior (bior.tech)

| Secret | Purpose | Current Value |
|---|---|---|
| `JWT_SECRET` | Signs authentication tokens | (encrypted) |
| `LOCKDOWN_MODE` | `true` = block all public access, `false` = open | `false` |
| `SITE_ACCESS_KEY` | Admin bypass key when locked | `BioR2026Admin` |

### data-library (data-library.bior.tech)

No secrets needed — static dashboard with no auth.

---

## D1 Database

Only `bior` uses a D1 database:

| Binding | Database Name | Database ID |
|---|---|---|
| `DB` | `bior-production` | `13a5f469-caab-4af9-9f2c-01640e8838fd` |

Migrations: `migrations/` directory in the BioR repo.

```bash
# Apply migrations to production
npx wrangler d1 migrations apply bior-production

# Query production
npx wrangler d1 execute bior-production --command="SELECT COUNT(*) FROM users"

# Local dev (automatic SQLite)
npx wrangler pages dev dist --d1=bior-production --local --ip 0.0.0.0 --port 3000
```

---

## Prompt for AI Assistants

When working with any AI assistant on this project, start with:

> **IMPORTANT DEPLOYMENT CONTEXT:**
> - The BioR platform (bior.tech) deploys from `github.com/mf2022-dev/BioR` to CF project `bior`
> - The RAND-ENGIN dashboard (data-library.bior.tech) deploys from `github.com/mf2022-dev/RAND-ENGIN` to CF project `data-library`
> - NEVER deploy one project's code to the other's CF project name
> - Before deploying, always verify: `cat wrangler.jsonc | grep '"name"'` and `git remote -v`
> - BioR stable restore tag: `stable-2026-03-26_0110-UTC`
> - BioR backup: https://www.genspark.ai/api/files/s/g5bSDDgj
> - See `DEPLOYMENT_SAFETY_GUIDE.md` in the BioR repo for full details
