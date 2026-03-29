# BioR Quick-Start Prompt for New AI Sessions

Copy everything below the line and paste it as your FIRST message in any new AI workspace.

---

## COPY FROM HERE ↓↓↓

**DEPLOYMENT CONTEXT — READ BEFORE DOING ANYTHING:**

I have a BioR platform with multiple projects. Before making ANY changes or deployments, you MUST follow these rules:

### Projects Map (NEVER mix these up)

| What | Domain | CF Project Name | GitHub Repo | Deploy Command |
|---|---|---|---|---|
| **BioR Platform** (main SPA — login, hub, dashboard, all features) | `bior.tech` | `bior` | `github.com/mf2022-dev/BioR` (private) | `npx wrangler pages deploy dist --project-name bior` |
| **RAND-ENGIN Dashboard** (standalone data library) | `data-library.bior.tech` | `data-library` | `github.com/mf2022-dev/RAND-ENGIN` (private) | `npx wrangler pages deploy dist --project-name data-library` |
| **ADC Research** | `bioalfa.net` | `adc-research-ibdaa-2026` | — | — |
| **SampleTrack** | `sampletrack.bior.tech` | `bior-sampletrack` | — | — |

### Critical Rules

1. **NEVER deploy RAND-ENGIN code to `--project-name bior`** — this will destroy the main platform
2. **NEVER deploy BioR code to `--project-name data-library`** — this will destroy the RAND dashboard
3. **Before EVERY deployment, run these 3 safety checks:**
   - `cat wrangler.jsonc | grep '"name"'` — verify which project you're in
   - `git remote -v` — verify which GitHub repo you're connected to
   - After build: `grep -c "#00A86B" dist/_worker.js` — BioR must show 250+, RAND-ENGIN will show 0

### To Set Up BioR in a New Workspace

```bash
git clone https://github.com/mf2022-dev/BioR.git
cd BioR
npm install
npm run build
# For local dev:
npx wrangler pages dev dist --d1=bior-production --local --ip 0.0.0.0 --port 3000
# For production deploy:
npx wrangler pages deploy dist --project-name bior
```

### To Set Up RAND-ENGIN in a New Workspace

```bash
git clone https://github.com/mf2022-dev/RAND-ENGIN.git
cd RAND-ENGIN
npm install
npm run build
npx wrangler pages deploy dist --project-name data-library
```

### BioR Architecture (which file = which page)

- **Login page** → `src/templates/login.ts`
- **SPA shell (everything after login)** → `src/templates/spa/shell.ts`
- **Green theme CSS** → `src/templates/spa/styles.ts`
- **Project Hub + Data Library cards** → `src/templates/spa/scripts/modules/hub.ts`
- **Dashboard/Workspace** → `src/templates/spa/scripts/modules/workspace.ts`
- **GeoIntel** → `src/templates/spa/scripts/modules/geointel.ts`
- **Benchmark** → `src/templates/spa/scripts/modules/benchmark.ts`
- **RSKB** → `src/templates/spa/scripts/modules/rskb.ts`
- **Analytics** → `src/templates/spa/scripts/modules/analytics.ts`
- **Auth logic** → `src/templates/spa/scripts/modules/auth.ts`
- **API backend (64+ endpoints)** → `src/routes/api.ts`
- **Middleware + entry** → `src/index.ts`

### BioR Secrets (Cloudflare environment)

| Secret | Value |
|---|---|
| `LOCKDOWN_MODE` | `false` (set to `true` to block public access) |
| `SITE_ACCESS_KEY` | `BioR2026Admin` |
| `JWT_SECRET` | (encrypted — do not change unless necessary) |

### D1 Database

- Binding: `DB`
- Database: `bior-production` (ID: `13a5f469-caab-4af9-9f2c-01640e8838fd`)
- Migrations: `migrations/` folder

### If Something Goes Wrong — Restore

```bash
# Restore BioR to last known stable state:
git clone https://github.com/mf2022-dev/BioR.git
cd BioR
git checkout stable-2026-03-26_0110-UTC
npm install && npm run build
npx wrangler pages deploy dist --project-name bior
```

Backup archive: https://www.genspark.ai/api/files/s/g5bSDDgj

### Documentation in the Repo

- `DEPLOYMENT_SAFETY_GUIDE.md` — Full architecture, safety checks, recovery steps
- `PROMPT_ADD_DATA_LIBRARY_CARD.md` — Template for adding cards to Project Hub

**Now tell me what you need help with.**

## ↑↑↑ COPY TO HERE
