# Prompt: Add a New Card to BioR Project Hub — Data Library Section

## Context

**Repository:** https://github.com/mf2022-dev/BioR (private)
**Live site:** https://bior.tech
**Cloudflare project:** `bior`
**Stable restore tag:** `stable-2026-03-26_0110-UTC`
**File to edit:** `src/templates/spa/scripts/modules/hub.ts`

The BioR platform is a Hono-based SPA deployed to Cloudflare Pages. The Project Hub page has a **Data Library** section with horizontally scrolling cards. Each card represents a data source, tool, or external resource.

---

## Instructions

Add a new card to the **Data Library** section in the BioR Project Hub page.

### File & Location

Edit: `src/templates/spa/scripts/modules/hub.ts`

Find this exact line (the "Add Dataset" card — this is always the LAST card):
```javascript
    '<div class="hub-dl-card hub-dl-add" onclick="showCreateDatasetModal()">' +
```

Insert the new card **immediately BEFORE** that line.

### Card Template

Copy and customize this template. Replace all `{{PLACEHOLDER}}` values:

```javascript
    // {{CARD_NAME}} — {{SHORT_DESCRIPTION}}
    '<div class="hub-dl-card" style="border-color:rgba({{R}},{{G}},{{B}},0.3);background:linear-gradient(135deg,rgba({{R}},{{G}},{{B}},0.06),rgba({{R2}},{{G2}},{{B2}},0.05))" onclick="{{ONCLICK_ACTION}}">' +
      '<div class="hub-dl-card-icon" style="background:rgba({{R}},{{G}},{{B}},0.15)"><i class="fas {{FA_ICON}}" style="color:{{PRIMARY_HEX}}"></i></div>' +
      '<div class="hub-dl-card-name" style="background:linear-gradient(135deg,{{PRIMARY_HEX}},{{SECONDARY_HEX}});-webkit-background-clip:text;-webkit-text-fill-color:transparent">{{CARD_TITLE}}</div>' +
      '<div class="hub-dl-card-desc">{{DESCRIPTION_TEXT}}</div>' +
      '<div class="hub-dl-progress"><div class="hub-dl-progress-bar" style="width:{{PROGRESS_PCT}}%;background:linear-gradient(90deg,{{PRIMARY_HEX}},{{SECONDARY_HEX}})"></div></div>' +
      '<div class="hub-dl-card-meta">' +
        '<span class="hub-dl-card-tag"><i class="fas {{META1_ICON}}"></i>{{META1_TEXT}}</span>' +
        '<span class="hub-dl-card-tag"><i class="fas {{META2_ICON}}"></i>{{META2_TEXT}}</span>' +
        '<span class="hub-dl-card-tag"><i class="fas {{META3_ICON}}"></i>{{META3_TEXT}}</span>' +
      '</div>' +
      '<div class="hub-dl-card-actions">' +
        '<button class="hub-dl-btn hub-dl-btn-explore" style="background:linear-gradient(135deg,{{PRIMARY_HEX}},{{SECONDARY_HEX}});color:#fff" onclick="event.stopPropagation();{{BUTTON_ACTION}}"><i class="fas {{BUTTON_ICON}}"></i> {{BUTTON_TEXT}}</button>' +
      '</div>' +
    '</div>' +
```

### Placeholder Reference

| Placeholder | What it is | Example |
|---|---|---|
| `{{CARD_NAME}}` | Comment name for the card | `WHO IRIS` |
| `{{SHORT_DESCRIPTION}}` | Comment description | `Global Health Intelligence` |
| `{{R}},{{G}},{{B}}` | Primary color in RGB | `0,168,107` (green) |
| `{{R2}},{{G2}},{{B2}}` | Secondary gradient RGB | `6,182,212` (cyan) |
| `{{PRIMARY_HEX}}` | Primary hex color | `#00A86B` |
| `{{SECONDARY_HEX}}` | Secondary hex color | `#06b6d4` |
| `{{FA_ICON}}` | FontAwesome icon class | `fa-globe` |
| `{{CARD_TITLE}}` | Display title on card | `WHO IRIS` |
| `{{DESCRIPTION_TEXT}}` | 1-2 line description | `World Health Organization...` |
| `{{PROGRESS_PCT}}` | Progress bar 0-100 | `100` |
| `{{META1_ICON}}` | Meta tag 1 icon | `fa-database` |
| `{{META1_TEXT}}` | Meta tag 1 text | `50K Records` |
| `{{META2_ICON}}` | Meta tag 2 icon | `fa-layer-group` |
| `{{META2_TEXT}}` | Meta tag 2 text | `12 Domains` |
| `{{META3_ICON}}` | Meta tag 3 icon | `fa-globe` |
| `{{META3_TEXT}}` | Meta tag 3 text | `194 Countries` |
| `{{BUTTON_ICON}}` | Button icon | `fa-external-link-alt` |
| `{{BUTTON_TEXT}}` | Button label | `Explore` |
| `{{ONCLICK_ACTION}}` | Card click action (see below) | |
| `{{BUTTON_ACTION}}` | Button click action (see below) | |

### Click Action Types

**For external links (opens new tab):**
```javascript
// Card onclick:
window.open(\\'https://example.com\\',\\'_blank\\')
// Button onclick:
window.open(\\'https://example.com\\',\\'_blank\\')
```

**For internal SPA views:**
```javascript
// Card onclick:
state.currentView=\\'viewName\\';pushSpaState();render()
// Button onclick:
state.currentView=\\'viewName\\';pushSpaState();render()
```

**For internal JS functions:**
```javascript
// Card onclick:
openSomeView()
// Button onclick:
openSomeView()
```

### Color Palette of Existing Cards

| Card | Primary | Secondary | RGB |
|---|---|---|---|
| PSEF Benchmark | `#38bdf8` | `#a78bfa` | `56,189,248` |
| GeoIntel | `#00A86B` | `#06b6d4` | `0,168,107` |
| RSKB | `#4F46E5` | `#A855F7` | `79,70,229` |
| RAND-ENGIN | `#5B2D8E` / `#006C35` | `#8B5CF6` / `#22c55e` | `91,45,142` |
| **Available (unused):** | `#ef4444` (red) | `#f59e0b` (amber) | |
| | `#ec4899` (pink) | `#f97316` (orange) | |
| | `#14b8a6` (teal) | `#6366f1` (indigo) | |

### Common FontAwesome Icons

`fa-database` `fa-globe` `fa-flask` `fa-dna` `fa-biohazard` `fa-shield-virus`
`fa-microscope` `fa-chart-bar` `fa-chart-line` `fa-book` `fa-file-medical`
`fa-hospital` `fa-virus` `fa-lungs-virus` `fa-syringe` `fa-vial`
`fa-satellite` `fa-map-marker-alt` `fa-layer-group` `fa-brain`
`fa-robot` `fa-atom` `fa-radiation` `fa-skull-crossbones`
`fa-balance-scale` `fa-landmark` `fa-scroll` `fa-shield-alt`
`fa-external-link-alt` `fa-eye` `fa-search` `fa-download`

---

## Filled Example — Adding a "WHO IRIS" Card

```javascript
    // WHO IRIS — Global Health Research Library
    '<div class="hub-dl-card" style="border-color:rgba(20,184,166,0.3);background:linear-gradient(135deg,rgba(20,184,166,0.06),rgba(59,130,246,0.05))" onclick="window.open(\\'https://iris.who.int\\',\\'_blank\\')">' +
      '<div class="hub-dl-card-icon" style="background:rgba(20,184,166,0.15)"><i class="fas fa-globe" style="color:#14b8a6"></i></div>' +
      '<div class="hub-dl-card-name" style="background:linear-gradient(135deg,#14b8a6,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent">WHO IRIS</div>' +
      '<div class="hub-dl-card-desc">WHO Institutional Repository — global health publications, technical guidelines, situation reports, disease outbreak news, and policy documents from 194 member states.</div>' +
      '<div class="hub-dl-progress"><div class="hub-dl-progress-bar" style="width:100%;background:linear-gradient(90deg,#14b8a6,#3b82f6)"></div></div>' +
      '<div class="hub-dl-card-meta">' +
        '<span class="hub-dl-card-tag"><i class="fas fa-file-medical"></i>300K+ Docs</span>' +
        '<span class="hub-dl-card-tag"><i class="fas fa-globe"></i>194 Countries</span>' +
        '<span class="hub-dl-card-tag"><i class="fas fa-language"></i>6 Languages</span>' +
      '</div>' +
      '<div class="hub-dl-card-actions">' +
        '<button class="hub-dl-btn hub-dl-btn-explore" style="background:linear-gradient(135deg,#14b8a6,#3b82f6);color:#fff" onclick="event.stopPropagation();window.open(\\'https://iris.who.int\\',\\'_blank\\')"><i class="fas fa-external-link-alt"></i> Explore</button>' +
      '</div>' +
    '</div>' +
```

---

## After Adding the Card — Build & Deploy

```bash
# 1. Build
cd /path/to/BioR && npm run build

# 2. Deploy
npx wrangler pages deploy dist --project-name bior --commit-dirty=true

# 3. Commit & push
git add -A && git commit -m "Add [CARD_NAME] to Data Library in Project Hub"
git push origin main

# 4. Verify
curl -s https://bior.tech | grep "CARD_NAME"
```

## If Something Goes Wrong — Restore

```bash
git checkout stable-2026-03-26_0110-UTC
npm install && npm run build
npx wrangler pages deploy dist --project-name bior
```

Or download backup: https://www.genspark.ai/api/files/s/g5bSDDgj
