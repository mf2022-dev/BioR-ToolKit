# BioR - Biological Response Network Platform

## Project Overview
- **Name**: BioR (Biological Response Network)
- **Version**: 8.8.0 (SSE Real-Time Notifications)
- **Goal**: National biosurveillance platform for Saudi Arabia — real-time disease monitoring, genomic analysis, early warning, and outbreak response
- **Architecture**: Cloudflare Pages + D1 Database + Hono Framework + Enterprise Security (AES-256-GCM + Session Fingerprinting + Token Blacklist) + Multi-Project Hub + Data Library + PSEF Benchmark Integration + GeoIntel Engine (10 Active Layers, 489 Features) + Advanced Analytics (Risk Scoring, Rt Estimation, Anomaly Detection, Forecasting) + Automated Report Archive (Weekly Epi Bulletin + Monthly AMR Summary, Cron-Ready) + SSE Real-Time Notifications (Event Bus + EventSource Client)

## URLs
- **Production**: https://bior.tech
- **Backup**: https://bior-platform.pages.dev
- **Login Page**: https://bior.tech/login
- **GitHub (BioR)**: https://github.com/mf2022-dev/BioR
- **GitHub (Benchmark)**: https://github.com/mf2022-dev/Pathogen-Biosurviallance-platform-Benchmark-

## User Accounts
| Username | Role | Name | Tier | Permissions |
|---|---|---|---|---|
| `admin` | Admin | Dr Majed | 4 | Full CRUD + Admin panel + Data Library |
| `analyst` | Analyst | Dr. Fatima Hassan | 3 | Create/edit data + alert review |
| `viewer` | Viewer | Dr. Khalid Mansoor | 2 | Read-only access |

> **Note**: Passwords are NOT stored in source code. They are hashed with PBKDF2-SHA256 (150k iterations) and stored in D1. Contact the admin for credentials.

## Data Architecture
- **Database**: Cloudflare D1 (SQLite) — `bior-production` (ID: `13a5f469-caab-4af9-9f2c-01640e8838fd`)
- **25+ tables + notifications + security + analytics + archive tables**: users, surveillance_sites, threats, genomic_samples, alerts, ews_signals, ews_detection_layers, ews_regional_risks, ews_osint_feed, ews_config, pipeline_stages, amr_heatmap, dashboard_metrics, reports, reports_data, system_services, system_config, dq_scorecard, audit_log, **datasets, dataset_versions, dataset_rows, project_datasets, notifications**, **token_blacklist, security_events, admin_ip_allowlist, rate_limit_tracker, encryption_registry, session_fingerprints, security_config**, **analytics_config**, **reports_archive**
- **Authentication**: PBKDF2-SHA256 password hashing (150k iterations, 32-byte salt) + HMAC-SHA256 JWT tokens (8h expiry)
- **Encryption at Rest**: AES-256-GCM field-level encryption for PII (emails)
- **Session Security**: Token bound to User-Agent + IP via session fingerprinting
- **JWT Secret**: Stored as Cloudflare Pages secret (env variable), NOT in source code
- **RBAC**: Tier-based access control (tier 1-4) on all API routes

## Benchmark Dataset (PSEF v3.1)
All benchmark data from the [Pathogen Biosurveillance Platform Benchmark](https://github.com/mf2022-dev/Pathogen-Biosurviallance-platform-Benchmark-) repository is integrated into the platform:

**Dataset: PSEF Benchmark v3.1.0** — 189 platforms, 50 deep-research profiles, 20 CBRN operational, 6 layers, 10 dimensions

| Layer | Count | Description |
|---|---|---|
| L1_Surveillance | 57 | Epidemiological surveillance platforms |
| L2_Genomic | 59 | Genomic sequencing & phylogenetic analysis |
| L3_Defense | 39 | Biodefense & threat detection systems |
| L4_CBRN_Operational | 20 | CBRN detection, warning & response (NEW in v3.1) |
| L4_Hardware | 9 | Sensor hardware & detection equipment |
| L5_Policy | 5 | Policy frameworks & governance indices |

**Deep-Research Profiles**: 50 platforms with executive summaries, timelines, key publications, CBRN assessments, ecosystem connections, official guidelines

**CBRN Operational** (20 platforms, ranks 170–189): Saab AWR (88), ENSCO SENTRY (87), Systematic SitaWare (86), ARGOS DSS (86), Bruhn NewTech (85), RODOS/JRODOS (85), FEMA CBRNResponder (85), HPAC (84), Two Six SIGMA (84), IAEA USIE (84), and 10 more

**Key columns**: Rank, Name, Score, Layer, Category, Description, Biosurveillance_Class, Primary_Input, 10 dimension scores, URL, Military_Biodefense, Deep_Research

### PSEF Evaluation Dimensions (10)
| Dimension | Short Code | Weight |
|---|---|---|
| Data Integration | DI | 12% |
| Analytics Capability | AC | 12% |
| Visualization | VZ | 10% |
| Accessibility | AX | 10% |
| Scalability | SC | 10% |
| Documentation | DC | 8% |
| Community Support | CS | 8% |
| Security & Compliance | SE | 12% |
| Interoperability | IO | 10% |
| Real-Time Capability | RT | 8% |

### Tier Classification
| Tier | Score Range | Count (of 189) |
|---|---|---|
| Excellent | >= 90 | 3 |
| Good | 80-89 | 94 |
| Adequate | 70-79 | 77 |
| Developing | < 70 | 15 |

## API Endpoints

### Auth
| Method | Path | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/login` | Login, returns JWT (or 2FA challenge) | No |
| GET | `/api/auth/me` | Get profile + stats + 2FA status | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |
| POST | `/api/auth/change-password` | Change own password (revokes all sessions) | Yes |
| POST | `/api/auth/logout` | Logout (revokes current token) | Yes |
| POST | `/api/auth/register` | Disabled (403) | — |
| POST | `/api/auth/reset-password` | Reset password (Admin only, revokes user sessions) | Admin |
| POST | `/api/auth/forgot-password` | Request password reset OTP | No |
| POST | `/api/auth/verify-reset` | Verify OTP + set new password | No |
| POST | `/api/auth/2fa/setup` | Begin TOTP 2FA setup (QR + recovery codes) | Yes |
| POST | `/api/auth/2fa/verify-setup` | Confirm 2FA setup with first valid code | Yes |
| POST | `/api/auth/2fa/verify-login` | Verify TOTP code during 2FA login | No |
| POST | `/api/auth/2fa/recovery` | Use recovery code during 2FA login | No |
| POST | `/api/auth/2fa/disable` | Disable 2FA (requires code or password) | Yes |
| GET | `/api/auth/2fa/status` | Check 2FA status + recovery codes left | Yes |

### Data (JWT Required)
| Method | Path | Description | Params |
|---|---|---|---|
| GET | `/api/dashboard` | Dashboard metrics | — |
| GET | `/api/surveillance` | List sites | `?search=&type=&status=&region=&page=&limit=` |
| GET | `/api/surveillance/:id` | Get site | — |
| POST | `/api/surveillance` | Create site (tier 3+) | JSON body |
| PUT | `/api/surveillance/:id` | Update site (tier 3+) | JSON body |
| GET | `/api/threats` | List threats | `?severity=&page=&limit=` |
| POST | `/api/threats` | Create threat (tier 3+) | JSON body |
| PUT | `/api/threats/:id` | Update threat (tier 3+) | JSON body |
| GET | `/api/genomics` | List samples + pipeline + AMR | `?status=&pathogen=&search=&page=&limit=` |
| POST | `/api/genomics` | Submit sample (tier 2+) | JSON body |
| GET | `/api/alerts` | List alerts | `?level=&status=&page=&limit=` |
| PATCH | `/api/alerts/:id/review` | Review alert (tier 3+) | `{decision: "confirm"\|"dismiss"\|"escalate"}` |
| PATCH | `/api/alerts/bulk` | Bulk confirm/dismiss pending (tier 3+) | `{decision: "confirm"\|"dismiss"}` |
| GET | `/api/ews` | EWS data | — |
| GET | `/api/analytics` | Advanced analytics — national risk, Rt, anomalies, forecast, regional heatmap, risk drivers | — |
| GET | `/api/reports` | Reports + chart data | — |
| GET | `/api/reports/archive` | List archived reports (paginated) | `?type=weekly_bulletin\|monthly_amr&limit=&offset=` |
| GET | `/api/reports/archive/:id` | Get full archived report (HTML) | — |
| POST | `/api/reports/generate` | Generate report on-demand (tier 3+) | `{type: "weekly_bulletin"\|"monthly_amr"}` |
| DELETE | `/api/reports/archive/:id` | Delete archived report (Admin only) | — |
| GET | `/api/admin/health` | System health | — |
| GET | `/api/admin/audit` | Audit log | `?search=&action=&user=&from=&to=&page=&limit=` |
| GET | `/api/admin/audit/export` | CSV export (up to 5000) | `?action=&user=&from=&to=&search=` |
| GET | `/api/admin/performance` | Live D1 performance metrics | — |
| GET | `/api/admin/users` | User list (Admin only) | — |
| POST | `/api/admin/users` | Create user (Admin only) | `{username, password, name, role, ...}` |
| PUT | `/api/admin/users/:id` | Update user (Admin only) | `{name, role, status, tier, ...}` |
| POST | `/api/admin/users/:id/reset-password` | Reset password (Admin only) | `{password}` |
| DELETE | `/api/admin/users/:id` | Delete user (Admin only) | — |
| GET | `/api/export/:type` | CSV export | `surveillance|alerts|threats|genomics` |

### Security (Admin Only)
| Method | Path | Description | Params |
|---|---|---|---|
| GET | `/api/security/status` | Security compliance dashboard (20 checks) | — |
| GET | `/api/security/events` | Security event log | `?severity=&type=&page=&limit=` |
| PATCH | `/api/security/events/:id/resolve` | Resolve security event | — |
| GET | `/api/security/ip-allowlist` | View admin IP allowlist | — |
| POST | `/api/security/ip-allowlist` | Add IP to allowlist | `{ipAddress, label, expiresAt}` |
| DELETE | `/api/security/ip-allowlist/:id` | Remove IP from allowlist | — |
| POST | `/api/security/ip-restriction/toggle` | Enable/disable admin IP restriction | `{enabled: true/false}` |
| POST | `/api/security/encrypt-pii` | Encrypt existing PII fields (one-time) | — |
| POST | `/api/security/token/revoke` | Revoke all tokens for a user | `{userId, reason}` |
| POST | `/api/security/cleanup` | Clean expired security data | — |

### Database Management
| Method | Path | Description |
|---|---|---|
| POST | `/api/db/seed` | Seed database (Admin only, restricted) |

### Notifications & SSE (JWT Required)
| Method | Path | Description | Params |
|---|---|---|---|
| GET | `/api/notifications` | Get user notifications | `?limit=20` |
| GET | `/api/notifications/stream` | **SSE stream** — real-time events via EventSource | `?token=<jwt>` (query param auth) |
| GET | `/api/notifications/stream/health` | SSE health — active subscriber count | — |
| PATCH | `/api/notifications/:id/read` | Mark notification as read | — |
| PATCH | `/api/notifications/read-all` | Mark all as read | — |
| POST | `/api/notifications` | Create notification (Admin only, triggers SSE broadcast) | `{title, message, type, icon, user_id, link}` |

### Global Search (JWT Required)
| Method | Path | Description | Params |
|---|---|---|---|
| GET | `/api/search` | Search across all entities | `?q=query` (min 2 chars) |

Searches: surveillance sites, threats, genomic samples, datasets, alerts, and pages.

### Data Library (Admin Only)
| Method | Path | Description | Params |
|---|---|---|---|
| GET | `/api/datasets` | List all datasets | — |
| GET | `/api/datasets/:id` | Get dataset + versions | — |
| GET | `/api/datasets/:id/rows` | Get rows (paginated) | `?page=&limit=&search=&sort=&dir=&version=` |
| POST | `/api/datasets` | Create dataset (CSV import) | `{name, description, icon, color, columns, rows}` |
| POST | `/api/datasets/:id/versions` | Add new version | `{rows, notes}` |
| GET | `/api/datasets/:id/charts` | Auto-generated charts | — |
| GET | `/api/datasets/:id/compare` | Compare two versions | `?v1=&v2=` |
| GET | `/api/datasets/:id/export` | Export as CSV | `?version=` |
| DELETE | `/api/datasets/:id` | Delete dataset | — |
| POST | `/api/datasets/:id/link` | Link to project | `{projectId}` |
| DELETE | `/api/datasets/:id/link/:projectId` | Unlink from project | — |

## Pages (SPA)

### User Flow
```
bior.tech → Login → Project Hub (card grid) → Select Project → Workspace
```

### Project Hub
After login, users land on a **Project Hub** — a card-grid navigator that divides the BioR platform into separate sections/workspaces:

| Card | Description | Status |
|---|---|---|
| **Dashboard** | Full BioR National Biosurveillance Platform (8 modules) | Active |
| **Project 1** | Empty workspace for future module/research configuration | Not Started |
| **Project 2** | Empty workspace for future module/research configuration | Not Started |
| **Project 3** | Empty workspace for future module/research configuration | Not Started |
| **+ Add New Project** | Create additional project workspaces (stored in localStorage) | — |

### Data Library (Admin Only — Hub Level)
Visible only to Admin users on the Project Hub, the **Data Library** is a horizontal scrollable card row above the Projects grid:

| Feature | Description |
|---|---|
| **Dataset Cards** | Each card shows: icon, name, description, row count, column count, version count, linked project count, progress bar |
| **+ New Dataset** | Opens create modal (CSV paste with auto-detect OR manual column definition) |
| **Compare** | Opens Dataset Comparison tool for side-by-side analysis of any two datasets |
| **Explore** | Opens full-page Dataset Explorer with 4 tabs |
| **Delete** | Admin can delete datasets (cascades to rows, versions, links) |
| **Pre-loaded** | PSEF Benchmark v3.1.0 (189 platforms, 21 columns) — integrated from GitHub benchmark repository |
| **GeoIntel Engine** | Multi-source geospatial intelligence dataset with full presentation layer (About, Layers, Methodology, Architecture, Sources tabs) and interactive MapLibre GL JS map — 489 features across 10 layers (platforms, BSL-4 labs, CTBTO stations, outbreaks, GHS scores, CBRN sensors, genomic labs, environmental monitoring, population centres, policy readiness). Hub card → Presentation → Launch Map flow. |

### Dataset Comparison Tool (v5.4)
Full-page visual comparison of any two datasets with:

| Feature | Description |
|---|---|
| **Dataset Selection** | Pick any two datasets and their versions from dropdown selectors |
| **Summary Cards** | Row count and column count for each dataset side-by-side |
| **Schema Comparison** | 3-panel view: Shared columns, Only-in-A columns, Only-in-B columns |
| **Numeric Stats** | For shared numeric columns: average comparison with positive/negative diff indicators |

### Dataset Explorer (Admin Only)
Full-page view accessed from the Data Library with:

| Tab | Description |
|---|---|
| **Data** | Searchable, sortable, paginated data table with column type highlighting (text=blue, number=amber) |
| **Charts** | Auto-generated bar charts (numeric cols grouped by text cols) + version row-count trend line |
| **Versions** | Version history list with row counts, notes, dates, authors, per-version CSV export |
| **Compare** | Side-by-side comparison of latest two versions (row count diff, numeric column avg/min/max diff with indicators and % change) |

**Add Data** button opens a modal to paste new CSV rows, creating a new version automatically.

### GeoIntel Engine (Phase 3 Complete — All 10 Layers Active)
Full-page interactive map view accessed from the Data Library GeoIntel card — **489 features across 10 layers**:

| Feature | Description |
|---|---|
| **MapLibre GL JS** | Dark-themed vector map (CARTO basemap) with zoom, pan, 3D pitch |
| **189 PSEF Platforms** | All platforms geocoded and displayed as color-coded markers by layer (L1–L5 + Hardware) |
| **41 BSL-4 Laboratories** | Maximum containment labs worldwide, status-coded (Operational/Under Construction/Planned) |
| **54 CTBTO Stations** | Nuclear test monitoring network, color-coded by detection type (Seismic/Hydroacoustic/Infrasound/Radionuclide) |
| **24 WHO Outbreaks** | Active disease outbreak events, severity-scaled markers (Critical/High/Moderate/Low) |
| **45 GHS Index Countries** | Global Health Security scores with graduated color scale (red→amber→cyan→green) |
| **33 CBRN Sensors** | Chemical/biological/radiological/nuclear detection sensors (BioWatch, etc.), type-coded markers |
| **24 Genomic Surveillance Labs** | Sequencing facilities worldwide with capacity ratings (High/Medium/Low) and annual throughput |
| **21 Environmental Stations** | Air quality, radiation, and water quality monitoring stations with network info |
| **30 Population Centers** | Major metropolitan areas with population density and biosecurity risk tiers (Very High/High/Elevated/Moderate) |
| **28 Policy Readiness Countries** | IHR/JEE compliance scores with tier classification (Compliant/Partially Compliant/Developing) |
| **Clustering** | Automatic marker clustering at low zoom levels with expansion on click |
| **Layer Colors** | Platforms=Green, BSL-4=Red, CTBTO=Amber, Outbreaks=Pink, GHS=Blue, CBRN=Orange, Genomic=Purple, Env=Cyan, Population=Lavender, Policy=Teal |
| **Hover Popups** | Layer-specific: platform scores, BSL-4 status/org, CTBTO type, outbreak severity/cases, GHS rank, CBRN type/network, genomic sequencers/capacity, env type/parameters, population density/risk, policy IHR+JEE scores |
| **Detail Panels** | Click any feature for full profile with layer-specific detail views, score gauges, data grids, and info callouts |
| **10 Layer Toggles** | Sidebar with all 10 data layers toggleable — all fully functional with lazy loading |
| **Lazy Loading** | Non-platform layers loaded on-demand when first toggled (performance optimization) |
| **Cross-Layer Search** | Search across all 10 datasets by name, country, type, pathogen, capacity, network, ISO code, WHO region, etc. |
| **Dynamic Legend** | Legend updates automatically based on active layers with layer-specific color coding |
| **Map Styles** | Toggle between Dark, Light, and Voyager basemaps (re-adds all active layers) |
| **3D Mode** | Toggle pitch/bearing for 3D perspective view |
| **Multi-Layer Export** | CSV export includes data from all active layers with Type column |
| **Stats Bar** | Bottom bar showing total features, active layers, countries, zoom level |

**GeoIntel Data Files (10 files, 489 total features)**:
| File | Features | Size | Description |
|---|---|---|---|
| `/static/geointel-platforms.json` | 189 | 151 KB | PSEF platforms with scores, coordinates, 10 dimensions |
| `/static/geointel-bsl4.json` | 41 | 10 KB | BSL-4 labs: name, city, country, status, year, organization |
| `/static/geointel-ctbto.json` | 54 | 9 KB | CTBTO IMS stations: name, type, country |
| `/static/geointel-outbreaks.json` | 24 | 5 KB | WHO outbreaks: pathogen, cases, severity, date |
| `/static/geointel-ghs.json` | 45 | 6 KB | GHS Index: country, ISO, score, rank |
| `/static/geointel-cbrn.json` | 33 | 8 KB | CBRN sensors: name, city, country, type, network, status |
| `/static/geointel-genomic.json` | 24 | 7 KB | Genomic labs: name, city, country, capacity, focus, sequencers, annual_sequences |
| `/static/geointel-env.json` | 21 | 5 KB | Environmental stations: name, city, country, type, network, parameter |
| `/static/geointel-population.json` | 30 | 6 KB | Population centers: name, country, population, density, risk_tier |
| `/static/geointel-policy.json` | 28 | 7 KB | Policy readiness: name, ISO, ihr_score, jee_score, naphs, who_region, tier |

### Dashboard Workspace Pages (8 modules)
| Page | Description |
|---|---|
| Dashboard | Real-time overview with KPIs, charts, maps |
| Surveillance | 36 surveillance sites across 13 regions |
| Threats | 18 active biological threats with severity tracking |
| Genomics | 25 genomic samples + pipeline + AMR heatmap (48 entries) |
| Early Warning System | 14 signals, 13 regional risks, 12 OSINT feeds |
| Alerts | 20 alerts (5 critical) with confirm/dismiss/escalate workflow |
| **Analytics** | **National risk score (50/100), Rt estimation (1.09), Z-score anomaly detection (12), linear regression forecast (R²=0.94), 13-region heatmap, 8 risk drivers** |
| Reports | Epidemiological charts, sitreps, CSV/PDF export, **Report Archive** (4th tab) |
| **Report Archive** | **Automated report storage — Weekly Epi Bulletin + Monthly AMR Summary, on-demand generation, full HTML viewer, print/download, filter by type, pagination, admin delete** |
| Admin | System health, user management, data quality, audit log, security compliance (95%) |

### User Management Panel (v5.4 — Admin Only)
Accessible from the Admin page's "User Management" tab:

| Feature | Description |
|---|---|
| **User Table** | Full list with avatar, name, username, email, role, institution, tier, status, last login |
| **Add User** | Modal form: name, username, password, email, role, full role title, institution |
| **Edit User** | Modal form: update name, email, role, status, tier, full role, institution |
| **Reset Password** | Modal with confirm: set new password for any user |
| **Delete User** | Confirm dialog, prevents self-deletion, cascading audit log |

### Data Visualization Enhancements (v5.4)
Available in the PSEF Benchmark Results viewer:

| Feature | Description |
|---|---|
| **SVG Radar Charts** | 10-axis radar chart for each platform's dimension scores (in detail view) |
| **Dimension Heatmap** | Color-coded table of all 10 platforms × 10 dimensions (in Overview tab) |
| **Score Distribution** | SVG bar chart showing Top 10 platforms side-by-side (in Overview tab) |
| **Radar Overlay** | Dual-platform overlay radar for visual comparison |
| **CSV Export** | Export all 189 platforms with scores as CSV file |
| **PDF Export** | Opens printable report with all platforms and dimension scores |

## Enterprise Security Architecture (v8.0)

### Compliance Score: 95% (20/20 checks passing)

Access the live security dashboard at `GET /api/security/status` (Admin auth required).

### Security Layers

| Layer | Feature | Details |
|---|---|---|
| **Cryptography** | PBKDF2-SHA256 | 150,000 iterations, 32-byte salt |
| **Cryptography** | HMAC-SHA256 JWT | 8-hour token lifetime (reduced from 24h) |
| **Cryptography** | AES-256-GCM | Field-level encryption for PII at rest |
| **Session** | Fingerprinting | Tokens bound to User-Agent + IP hash |
| **Session** | Token Blacklist | Revoked tokens stored in D1, checked on every request |
| **Session** | Forced Re-auth | Password change/reset revokes ALL existing user sessions |
| **Session** | Server-side Logout | Token blacklisted on logout (no client-only logout) |
| **Access** | RBAC (4-tier) | Admin=4, Analyst=3, Viewer=2, Guest=1 |
| **Access** | Admin IP Allowlist | Zero-trust mode: restrict admin routes to approved IPs |
| **Access** | Registration Disabled | Only admins can create accounts |
| **Rate Limiting** | Login | 5 attempts per 15 minutes per IP |
| **Rate Limiting** | Global API | 120 requests per minute per IP |
| **Headers** | HSTS | 2 years, includeSubDomains, preload |
| **Headers** | CSP | Strict Content-Security-Policy with whitelisted CDNs |
| **Headers** | COOP/CORP | Cross-Origin-Opener-Policy + Cross-Origin-Resource-Policy |
| **Headers** | X-Frame-Options | DENY (anti-clickjacking) |
| **Headers** | Cache-Control | no-store for all API responses |
| **Monitoring** | Security Events | Real-time logging of all security-relevant actions |
| **Monitoring** | Brute Force Detection | Auto-alert on 10+ failed logins per IP per hour |
| **Monitoring** | Audit Trail | All actions logged with IP, user, timestamp |
| **Code** | No Hardcoded Secrets | JWT secret from env, no passwords in source |
| **Code** | Input Sanitization | XSS prevention + parameterized SQL queries |

### Security Headers (12 headers on every response)
| Header | Value | Purpose |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Force HTTPS (2 years) |
| `Content-Security-Policy` | Restrictive CSP + `upgrade-insecure-requests` | Prevent XSS, injection |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-XSS-Protection` | `1; mode=block` | XSS protection (legacy) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer leaks |
| `Permissions-Policy` | Restricted (camera, mic, geo, payment, usb) | Block device APIs |
| `Cross-Origin-Opener-Policy` | `same-origin` | Isolate browsing context |
| `Cross-Origin-Resource-Policy` | `same-origin` | Prevent cross-origin reads |
| `Cache-Control` | `no-store, no-cache, must-revalidate, private` | No API caching |
| `Pragma` | `no-cache` | Legacy cache prevention |
| `Retry-After` | Dynamic (on 429) | Rate limit retry guidance |

### Token Security
- **8-hour lifetime** (reduced from 24h for tighter security)
- **Unique JTI** per token (prevents replay)
- **Session fingerprint** bound to token (User-Agent + IP hash)
- **Server-side blacklist** (D1 table `token_blacklist`)
- **Forced re-auth** on password change (all sessions revoked)
- **Forced re-auth** on admin password reset (target user sessions revoked)
- **Forced re-auth** on account suspension (all sessions revoked)
- **Logout blacklists token** immediately (server-side revocation)

### Data Encryption
- **Algorithm**: AES-256-GCM (Web Crypto API)
- **Key Derivation**: PBKDF2 from JWT_SECRET with purpose-specific salt
- **Encrypted Fields**: User emails (PII)
- **Format**: `ENC:iv_base64:ciphertext_base64`
- **Decryption**: Only on authenticated API response (never exposed in DB)
- **One-time migration**: `POST /api/security/encrypt-pii` encrypts existing data

### Security Database Tables (Migration 0005)
| Table | Purpose |
|---|---|
| `token_blacklist` | Revoked JWT tokens (jti, user_id, reason, expires_at) |
| `security_events` | Real-time security event log (type, severity, IP, details) |
| `admin_ip_allowlist` | Approved IPs for admin access (zero-trust mode) |
| `rate_limit_tracker` | Per-IP request counting for global rate limiting |
| `encryption_registry` | Tracks which DB fields are encrypted |
| `session_fingerprints` | Binds tokens to device characteristics (UA + IP) |
| `security_config` | Key-value security settings (editable via API) |

### CORS Policy
- Restricted to: `https://bior.tech`, `https://www.bior.tech`, `https://bior-709.pages.dev`
- Credentials: enabled
- Allowed methods: GET, POST, PUT, PATCH, DELETE

### Cloudflare Secrets
| Secret | Purpose |
|---|---|
| `JWT_SECRET` | HMAC-SHA256 JWT signing + AES-256-GCM key derivation |

Set via: `npx wrangler pages secret put JWT_SECRET --project-name bior`

### GitHub Repository Security
- **Visibility**: Private
- **Vulnerability alerts**: Enabled (Dependabot)
- **No PAT in remote URL**: Git credentials use credential helper
- **No secrets in source code**: All secrets use environment variables
- **`.gitignore`**: Covers `.env`, `.dev.vars`, `node_modules/`, `.wrangler/`

### Security Recommendations (Manual)
1. **Rotate GitHub PAT** — The previous PAT was exposed in git remote history. Regenerate at https://github.com/settings/tokens
2. **Enable 2FA on GitHub** — Protect the repository from unauthorized access
3. **Rotate JWT_SECRET every 90 days** — `npx wrangler pages secret put JWT_SECRET`
4. **Change default passwords** — Update seed user passwords via admin panel
5. **Enable admin IP restriction** — `POST /api/security/ip-restriction/toggle` with `{"enabled":true}`
6. **Monitor security events** — `GET /api/security/events`
7. **Run PII encryption** — `POST /api/security/encrypt-pii` after initial deployment
8. **Enable Cloudflare WAF** — For DDoS/bot protection at the edge
9. **Enable GitHub Advanced Security** (paid) — For secret scanning and push protection

## Tech Stack
- **Backend**: Hono v4 (TypeScript) on Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Auth**: Web Crypto API (PBKDF2-SHA256 + HMAC-SHA256 JWT)
- **Frontend**: Vanilla JS SPA with Tailwind CSS (built, 44KB), Chart.js, Leaflet, MapLibre GL JS
- **Build**: Vite v6
- **Deploy**: Cloudflare Pages
- **Benchmark Source**: GitHub — Pathogen-Biosurviallance-platform-Benchmark-

## Project Structure
```
src/
├── index.ts              # App entry (Hono + middleware + 12 security headers)
├── lib/
│   ├── crypto.ts         # PBKDF2 + JWT + AES-256-GCM + session fingerprinting
│   ├── auth.ts           # Auth middleware + RBAC + token blacklist + rate limiting + security events
│   ├── analytics.ts      # National risk, Rt estimation, anomaly detection, forecasting
│   ├── events.ts         # SSE event bus — in-memory pub/sub (subscribe/unsubscribe/broadcast/heartbeat)
│   └── reportGenerator.ts # Weekly Epi Bulletin + Monthly AMR Summary HTML templates + D1 storage
├── routes/
│   ├── api.ts            # All D1 CRUD API routes + security dashboard + SSE stream (~2,150 lines)
│   └── pages.ts          # Login + SPA page routes
├── data/                 # Legacy static data (kept for reference)
├── templates/
│   ├── login.ts          # Login page HTML
│   └── spa/
│       ├── scripts/
│       │   ├── index.ts          # 49-line orchestrator (imports & concatenates modules)
│       │   └── modules/
│       │       ├── core.ts       # (~241 lines) State, helpers, API client, SPA history, theme, SSE state
│       │       ├── render.ts     # (93 lines) Main render() function, skeleton loader
│       │       ├── auth.ts       # (247 lines) Login form, authentication handlers
│       │       ├── layout.ts     # (~640 lines) Layout, sidebar, user profile, search, notifications, SSE client
│       │       ├── hub.ts        # (560 lines) Project Hub, quick stats, data library
│       │       ├── datasets.ts   # (501 lines) Dataset Explorer, Dataset Comparison
│       │       ├── workspace.ts  # (~1,980 lines) Dashboard, surveillance, threats, genomics, EWS, alerts, reports + archive, admin
│       │       ├── benchmark.ts  # (1,471 lines) PSEF Benchmark viewer, radar, heatmap, layers, CBRN
│       │       ├── geointel.ts   # (2,326 lines) GeoIntel Engine, map, 10 layers, controls, legend
│       │       └── init.ts       # (14 lines) Application initialization + SSE startup
│       ├── shell.ts          # SPA HTML shell
│       └── styles.ts         # CSS styles
└── types/index.ts        # TypeScript type definitions

migrations/
├── 0001_initial_schema.sql      # 20 tables, 44 DDL commands
├── 0002_datasets.sql            # 4 tables (datasets, versions, rows, project links)
├── 0003_notifications.sql       # notifications table + seed data
├── 0004_request_metrics.sql     # request_metrics + metrics_hourly
├── 0005_security_enterprise.sql # 7 security tables + config defaults
├── 0006_analytics_config.sql    # Analytics configurable weights (10 parameters)
└── 0007_reports_archive.sql     # Report archive table for scheduled & on-demand reports

seed.sql                  # Base seed data (645 rows)
seed-enrich.sql           # Enrichment data (+75 rows across 10 tables)
wrangler.jsonc            # D1 binding configuration
ecosystem.config.cjs      # PM2 dev server config
```

## Development
```bash
# Install dependencies
npm install

# Create .dev.vars for local JWT secret
echo 'JWT_SECRET=local-dev-secret-change-me' > .dev.vars

# Reset & seed local database
npm run db:reset

# Start dev server (D1 local)
npm run build && pm2 start ecosystem.config.cjs

# Test login
curl http://localhost:3000/api/auth/login -X POST -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YOUR_PASSWORD"}'
```

## Deployment
```bash
# Apply migrations to production
npm run db:migrate:prod

# Set JWT secret (first-time or rotation)
npx wrangler pages secret put JWT_SECRET --project-name bior

# Seed production (first-time only)
npx wrangler d1 execute bior-production --remote --file=./seed.sql

# Deploy
npm run deploy
```

## Changelog

### v9.0.0 — Dual-Channel Security: TOTP 2FA + Email OTP (2026-03-19)
- **TOTP Two-Factor Authentication**: Full authenticator app support (Google Authenticator, Authy, 1Password)
- **New Library**: `src/lib/totp.ts` — Pure Web Crypto API implementation of RFC 6238/4226
  - HMAC-SHA1 TOTP generation, Base32 encoding/decoding, ±1 time window, constant-time comparison
- **D1 Migration**: `0009_totp_2fa.sql` — `totp_secrets` (user_id, secret, enabled, verified, recovery_codes) + `totp_attempts` (rate limiting)
- **6 New API Endpoints**:
  - `POST /auth/2fa/setup` — Generate secret + QR otpauth URI + 8 recovery codes
  - `POST /auth/2fa/verify-setup` — Confirm setup with first valid code
  - `POST /auth/2fa/verify-login` — Verify TOTP during login (public, no JWT)
  - `POST /auth/2fa/recovery` — Use recovery code during login (public, no JWT)
  - `POST /auth/2fa/disable` — Disable 2FA (requires authenticator code OR password)
  - `GET /auth/2fa/status` — Check 2FA status + recovery codes remaining
- **Login Flow**: Password → 2FA challenge (5-min expiry) → TOTP verify → full JWT token
  - Challenge: max 5 attempts per session, rate limited per IP
  - Recovery codes: 8 codes (XXXX-XXXX format), each single-use, warning when ≤2 remaining
- **Frontend Login**: 2FA step with 6-digit code input (auto-submit), recovery code option, back navigation
- **Profile Security Tab**: Enable/Disable 2FA with full QR code setup modal
  - QR code rendered via `qrcode-generator` CDN library
  - Manual secret key with click-to-copy
  - Recovery codes grid with copy-to-clipboard
  - Disable flow with authenticator code or password confirmation
- **Email OTP (Resend Integration)**: Password reset sends OTP via Resend email when `RESEND_API_KEY` is configured
  - Branded HTML email template with 6-digit code, 15-min expiry
  - Dev mode: OTP shown on screen when no email service configured
  - Enable: `npx wrangler pages secret put RESEND_API_KEY --project-name bior-platform`
- **Security**: Auth middleware bypass for 2FA public endpoints, `/auth/me` returns 2FA status
- **Platform Metrics**: ~15,200 source lines | 956 KB worker | 11 modules | 72 API routes | 40 DB tables | 74 git commits
- **Deployed**: All production domains (bior.tech, bior-platform.pages.dev) HTTP 200

### v8.8.0 — SSE Real-Time Notifications (2026-03-19)
- **SSE Event Bus** (GitHub #1): In-memory pub/sub system for real-time push notifications via Server-Sent Events
- **New File**: `src/lib/events.ts` — `SSEEvent` interface, `subscribe()`, `unsubscribe()`, `broadcast()`, `heartbeat()`, `subscriberCount()`
- **SSE Endpoint**: `GET /api/notifications/stream?token=<jwt>` — returns `text/event-stream` with 25s heartbeat keepalive
- **SSE Health**: `GET /api/notifications/stream/health` — returns active subscriber count
- **Typed Events**: 5 event types — `alert` (review/bulk), `surveillance` (threat/site create), `notification` (admin broadcast), `ews_update`, `system` (report generated, connected)
- **6 Broadcast Hooks**: Alert review, bulk alert review, notification create, threat create, surveillance site create, report generate
- **JWT Auth**: Query-param authentication (EventSource can't set headers), with blacklist check
- **Frontend EventSource Client**: Auto-connects on login, typed event handlers (alert → auto-refresh alerts page, surveillance → auto-refresh threats/surveillance, notification → toast + bell pulse, system → toast + page refresh)
- **Exponential Backoff Reconnection**: Up to 5 retries (1s → 2s → 4s → 8s → 16s → 30s cap), then falls back to 30s polling
- **SSE-Aware UI**: Header connection status indicator ("Live" when SSE active, "Online" when polling), clickable status modal showing connection mode, retries, reconnect button
- **Polling Degradation**: SSE active → polling slows to 120s heartbeat; SSE failed → resumes 30s polling
- **Auth Middleware Update**: SSE stream endpoint bypassed (handles own JWT via query param)
- **Platform Metrics**: ~14,300 source lines | 911 KB worker | 11 modules | 66 API routes | 38 DB tables | 71 git commits
- **Deployed**: All 4 domains (bior.tech, bior-709, bior-geointel, bior-platform) HTTP 200

### v8.7.0 — Automated Report Archive (2026-03-19)
- **Report Archive System** (GitHub #5): Full automated report generation + archival system with on-demand generation and cron-ready scheduled handler
- **D1 Migration**: `0007_reports_archive.sql` — `reports_archive` table (id, title, type, period, html_content, generated_by, trigger_type, size_bytes, metadata)
- **Report Generator**: `src/lib/reportGenerator.ts` — `fetchReportData()` aggregates from 4 D1 tables, `generateWeeklyBulletinHTML()` (KPIs, risk assessment, Rt, anomalies, threats, alerts, pathogens), `generateMonthlySummaryHTML()` (AMR-focused with resistance patterns), `storeReport()` to D1
- **Scheduled Handler**: `src/index.ts` exports `scheduled()` for cron triggers — `0 6 * * 1` (weekly Mon 06:00 UTC), `0 6 1 * *` (monthly 1st 06:00 UTC)
- **4 New API Routes**: `GET /api/reports/archive` (paginated, filterable by type), `GET /api/reports/archive/:id` (full HTML), `POST /api/reports/generate` (tier 3+ on-demand), `DELETE /api/reports/archive/:id` (admin only)
- **Frontend**: 4th tab "Report Archive" on Reports page — archive list with type badges (Weekly/AMR), trigger source (Cron/Manual), size, timestamps, filter buttons, pagination
- **Report Viewer Modal**: Full-screen iframe viewer with Print + Download HTML buttons, Escape to close
- **Generate Now**: Two admin buttons — "Generate Epi Bulletin" + "Generate AMR Summary" with confirmation dialog
- **Command Palette**: "Report Archive" entry navigates to Reports → Archive tab
- **Test Reports Generated**: Weekly Epi Bulletin (14.9 KB) + Monthly AMR Summary (6.8 KB)
- **Platform Metrics**: ~14,000 source lines | 900 KB worker | 11 modules | 64 API routes | 38 DB tables | 70 git commits
- **Deployed**: All 4 domains (bior.tech, bior-709, bior-geointel, bior-platform) HTTP 200

### v8.6.0 — Advanced Analytics Dashboard (2026-03-19)
- **Analytics Engine** (`src/lib/analytics.ts`): Pure TypeScript — national risk scoring (5-component weighted), Rt estimation (ratio method + 95% CI), Z-score anomaly detection (σ ≥ 2.0 threshold), linear regression forecast (OLS with confidence bands), risk driver ranking
- **API**: `GET /api/analytics` returns `{ nationalRisk, rt, anomalies, forecast, regionalRisks, riskDrivers, config, summary }` — computed from threats, EWS, weekly trends, regional data
- **Frontend**: New "Analytics" page — SVG national risk gauge (0-100), Rt tracker with visual confidence bar, anomaly alert cards with detail modals, forecast Chart.js line chart (predicted + CI band), 13-region risk heatmap with drill-down, top 8 risk drivers
- **Dashboard Integration**: Purple analytics intelligence banner shows live risk score, Rt value, and top anomaly count; clicking navigates to full analytics
- **Hub Integration**: Analytics stat card in hub quick stats shows national risk score from API
- **D1 Migration**: `analytics_config` table with 10 configurable weights (risk velocity 0.30, severity 0.25, containment 0.20, genomic 0.15, EWS 0.10; anomaly threshold 2.0σ; forecast horizon 14 days)
- **Navigation**: Sidebar entry, keyboard shortcut `g → y`, command palette entry
- **Live Analytics**: Risk Score 50/100 (MODERATE) | Rt 1.09 (stable, CI 0.98–1.21) | 12 anomalies (3 critical: Dammam ICU pneumonia, H5N1 Qassim, XDR A. baumannii) | Forecast: 366→378 cases/week (R²=0.942, 94% confidence) | Eastern Province highest risk (76)
- **No new dependencies**: Pure TS math, stays within Workers 10ms CPU limit
- **Platform Metrics**: ~13,000 source lines | 870 KB worker | 11 modules | 60 API routes | 37 DB tables | 67 git commits
- **Deployed**: All 4 domains (bior.tech, bior-709, bior-geointel, bior-platform) HTTP 200

### v8.5.0 — Modular Architecture + Enriched Production Data (2026-03-19)
- **Modular Frontend**: Split 7,327-line monolithic `index.ts` into 10 focused modules — core (239), render (93), auth (247), layout (473), hub (560), datasets (501), workspace (1,474), benchmark (1,471), geointel (2,326), init (12) — via a 49-line orchestrator
- **Production Data Enrichment**: Applied `seed-enrich.sql` to production D1 — +3 users, +12 alerts, +10 genomic samples, +6 EWS signals, +6 OSINT feeds, +10 notifications, +12 AMR entries, +15 audit logs
- **Dashboard**: 1,724 active cases, 20 alerts (5 critical), 882 genomic sequences, 8 top pathogens, 10 recent activity events, threat level 72
- **EWS**: 14 active signals (statistical + ML + OSINT + genomic), 13 regional risk profiles, 12 OSINT articles
- **Pathogens Tracked**: SARS-CoV-2, V. cholerae O1, Dengue, MDR-TB, Salmonella, MERS-CoV, Influenza A (H5N1), Brucella melitensis
- **New Alerts**: H5N1 avian flu, norovirus outbreak, ESBL E. coli water contamination, measles cluster, unexplained ICU deaths, brucellosis spike, dengue vector surge, XDR Acinetobacter, foodborne botulism, schistosomiasis resurgence, Legionella in hospital
- **New Genomic Samples**: V. cholerae, MERS-CoV Clade B.1, N. meningitidis, SARS-CoV-2 KP.3.1.1, Brucella, H5N1 2.3.4.4b, Legionella, Dengue DENV-3, C. difficile RT027, P. falciparum K13-C580Y
- **Dependabot**: Resolved 6 vulnerabilities (3 high, 3 moderate) in undici/wrangler
- **Deployed**: All 4 domains (bior.tech, bior-709, bior-geointel, bior-platform) updated

### v8.4.1 — QA Hardening & Map Stability (2026-03-19)
- **Critical Fix: giMap ReferenceError**: Declared `giMap`, `giMapReady`, `_giMapInitializing` at top of script scope — previously undeclared, causing blank page on load
- **Critical Fix: Map DOM Destruction**: Render guard prevents `app.innerHTML` replacement when GeoIntel map is already displayed — stops WebGL canvas orphaning
- **Critical Fix: GI_NL Undeclared**: Added `var GI_NL = String.fromCharCode(10)` for proper newlines in MapLibre text labels and CSV exports
- **Fix: Login 500 on Empty Body**: Wrapped `c.req.json()` in try-catch across all API routes — returns 400 instead of 500 for malformed requests
- **Fix: CSP Blocking Cloudflare Analytics**: Added `static.cloudflareinsights.com` to Content-Security-Policy script-src
- **Fix: Permissions-Policy Warning**: Removed unrecognized `bluetooth` feature from Permissions-Policy header
- **Fix: CSV Export Newlines**: Replaced literal `'\n'` strings with `GI_NL` constant in report and data export functions
- **Fix: Map Not Destroyed on View Switch**: `navigateToHub()` and `openGeoIntelView()` now properly call `giMap.remove()` and reset map state
- **Fix: URL Hash Navigation**: Standalone views (geointel, geointel-map) no longer append `currentPage` to hash
- **WebGL Resilience**: Added `failIfMajorPerformanceCaveat: false` and `preserveDrawingBuffer: true` for tablet/mobile compatibility
- **Map Init Lock**: `_giMapInitializing` flag prevents concurrent map creation race conditions
- **Ghost Canvas Cleanup**: Container children cleared before new MapLibre instance creation
- **QA Audit**: 23 issues detected, 9 fixed, 14 passed (JS syntax, all 59 API routes, 10 GeoJSON files, 11 static assets, security headers, no hardcoded secrets)
- **Platform Metrics**: 12,030 source lines | 816 KB worker | 206 functions | 59 API routes | 36 DB tables | 10 GeoIntel layers | 489 features | 60 git commits
- **Production Data**: 6 users | 20 alerts (5 critical) | 25 genomic samples | 14 EWS signals | 36 sites | 18 threats | 48 AMR entries | 8 top pathogens | 1,724 active cases
- **Deployed**: bior.tech, bior-709.pages.dev, bior-geointel.pages.dev, bior-platform.pages.dev

### v8.4.0 — GeoIntel Engine Presentation v1.0 (2026-03-19)
- **GeoIntel Presentation Layer**: Full presentation system mirroring the Benchmark (PSEF) treatment — 5 tabs: About, Data Layers, Methodology, Architecture, Sources & Citations
- **About GeoIntel Tab**: Executive introduction, purpose & scope, 10-layer taxonomy overview, interactive capabilities summary, KPI dashboard (489 features, 10 layers, 80+ countries, 216 KB dataset)
- **10 Data Layers Tab**: Complete layer reference with per-layer descriptions, feature counts, GeoJSON file info, data sources, collection methodology, and property schemas
- **Methodology Tab**: 4-phase data construction pipeline (Source ID → Extraction → Geocoding → QA), phased development timeline (Phase 1-3), geocoding methodology detail
- **Architecture Tab**: Dataset structure overview, GeoJSON schema documentation, file manifest table (10 files), technology stack (MapLibre GL JS, GeoJSON RFC 7946, Cloudflare Pages, CARTO)
- **Sources & Citations Tab**: 8 source organisations documented (WHO, CTBTO, NTI, OPCW, WMO, UN, GISAID, BioR PSEF), suggested citation format
- **Navigation Flow**: Hub card → GeoIntel About (5 tabs) → Launch Map → Back to GeoIntel About
- **Layer Metadata**: Comprehensive `giLayerMeta` object with per-layer: label, icon, color, count, filename, file size, properties, description, source, methodology
- **Bundle**: 811 KB (up from 756 KB)

### v8.3.0 — GeoIntel Phase 3: All 10 Layers Complete (2026-03-19)
- **5 New Data Layers**: CBRN Sensors (33), Genomic Surveillance (24), Environmental Monitoring (21), Population Density (30), Policy Readiness (28)
- **CBRN Sensors Layer**: Type-coded markers (Biological=orange, Chemical=yellow, Radiological=red, Nuclear=dark red), network info, Active/Inactive status
- **Genomic Surveillance Layer**: Capacity-coded markers (High/Medium/Low=purple shades), sequencer count, annual sequence throughput, focus area metadata
- **Environmental Layer**: Type-coded markers (Air Quality=cyan, Radiation=red, Water Quality=blue, Weather=amber), monitoring network, parameter info
- **Population Density Layer**: Size-scaled by population, risk-tier color-coded (Very High=red, High=orange, Elevated=amber, Moderate=lavender), density data
- **Policy Readiness Layer**: Tier-coded markers (Compliant=teal, Partially Compliant=amber, Developing=red), dual IHR + JEE score display, NAPHS status, WHO region
- **All 10 Layers Fully Functional**: Removed all "Coming in Phase 3" placeholders — every layer toggle now loads and renders real data
- **5 New Detail Panels**: Each new layer has comprehensive click-to-open detail panel with layer-specific data views, score bars, and info callouts
- **5 New Hover Popups**: Unique hover popup format for each new layer with relevant metadata badges
- **Extended Legend**: Dynamic legend now supports all 10 layers with proper symbology
- **Extended Search**: Cross-layer search covers all 10 datasets (name, country, city, type, network, focus, capacity, ISO, WHO region, risk tier)
- **Extended Export**: CSV export includes all 10 layer types with layer-specific columns
- **Extended Stats**: Feature/country/layer counters include all 10 layers
- **Data Files**: 5 new GeoJSON files (geointel-cbrn.json, geointel-genomic.json, geointel-env.json, geointel-population.json, geointel-policy.json)
- **Total GeoIntel Features**: 489 across 10 active layers (189 + 41 + 54 + 24 + 45 + 33 + 24 + 21 + 30 + 28)
- **Worker Size**: 755.92 KB (up from 711.91 KB in v8.2)
- **Code**: +690 lines in index.ts for new layer functions

### v8.2.0 — GeoIntel Phase 2: Multi-Layer Intelligence (2026-03-19)
- **4 New Data Layers**: BSL-4 Laboratories (41), CTBTO Monitoring Stations (54), WHO Disease Outbreaks (24), GHS Index (45 countries)
- **BSL-4 Layer**: Status-coded markers (Operational=red, Under Construction=amber, Planned=gray), hover showing org/city/year, detail panel with full facility info
- **CTBTO Layer**: Type-coded markers (Seismic=amber, Hydroacoustic=cyan, Infrasound=purple, Radionuclide=red), IMS station details
- **WHO Outbreaks Layer**: Severity-scaled markers (size by case count, color by severity), case count badges, pathogen/date metadata
- **GHS Index Layer**: Score-graduated color scale (green ≥80, cyan ≥60, amber ≥40, red <40), rank display, preparedness tier classification
- **Lazy Layer Loading**: Non-platform layers fetch GeoJSON on first toggle (performance optimization)
- **Dynamic Legend**: Auto-updating legend panel showing active layer symbology
- **Cross-Layer Search**: Search finds features across all loaded datasets (platforms, labs, stations, outbreaks, countries)
- **Multi-Layer Export**: CSV export includes all active layers with type column
- **Enhanced Stats Bar**: Shows total features (not just platforms) across all active layers
- **Style Change Persistence**: All active layers re-added after basemap style switch
- **Layer-Specific Detail Panels**: BSL-4 (org/status/year), CTBTO (type/IMS info), Outbreaks (cases/severity/date grid), GHS (score gauge/rank/tier)
- **Layer-Specific Hover Popups**: Each layer has unique popup format with relevant metadata
- **Data Files**: 4 new GeoJSON files (geointel-bsl4.json, geointel-ctbto.json, geointel-outbreaks.json, geointel-ghs.json)
- **Total GeoIntel Features**: 308 across 5 active layers (189 + 41 + 54 + 24 + 45 = 353 in data, 308 visible with defaults)

### v8.1.0 — GeoIntel Engine (2026-03-19)
- **GeoIntel Engine**: New full-page interactive map view integrated into Project Hub Data Library
- **MapLibre GL JS**: Vector tile map with 3 basemap styles (Dark, Light, Voyager), 3D pitch toggle
- **189 Geocoded Platforms**: All PSEF platforms mapped with curated coordinates (90+ manually geocoded, rest by layer region defaults)
- **Cluster Markers**: Automatic clustering at low zoom with color-coded expansion by platform count
- **Layer-Coded Markers**: 6 distinct colors for L1-L5 + Hardware layers with glow effects
- **Hover Popups**: Platform name, score, layer badge, and country on mouse hover
- **Detail Panel**: Click-to-open right panel with full platform profile, 10 animated dimension score bars, URL link, biosurveillance class, military badge
- **10 Data Layer Toggles**: Phase 1 delivers PSEF Platforms layer; Phase 2+ will add BSL-4 Labs, CTBTO Stations, WHO Outbreaks, GHS Index, CBRN Sensors, Genomic Surveillance, Environmental, Population Density, Policy Readiness
- **Platform Search**: Real-time search by name, country, layer, category with fly-to-location on click
- **CSV Export**: Export all geocoded platforms with rank, name, score, layer, country, lat/lng, URL
- **Stats Bar**: Bottom floating bar with platform count, active layers, country count, current zoom
- **Hub Integration**: GeoIntel card in Data Library scroll, 5th quick stat (GeoIntel Layers), clickable stat card
- **GeoJSON Data**: `/static/geointel-platforms.json` (189 features, 151KB)

### v8.0.0 — Enterprise Security Hardening (2026-03-17)
- **AES-256-GCM Encryption at Rest**: PII fields (emails) encrypted in D1 database; decrypted only for authenticated API responses
- **8-Hour Token Lifetime**: Reduced from 24h for tighter session control
- **Session Fingerprinting**: JWT tokens bound to User-Agent + IP hash; mismatches rejected with security alert
- **Token Blacklist/Revocation**: Password change, admin reset, and account suspension immediately revoke ALL user tokens
- **Server-Side Logout**: `POST /api/auth/logout` blacklists the current token in D1
- **Global API Rate Limiting**: 120 requests/minute per IP across all authenticated endpoints (D1-backed)
- **Admin IP Allowlist**: Zero-trust mode restricts admin routes to approved IPs only
- **Security Compliance Dashboard**: `GET /api/security/status` returns 20 compliance checks with 95% score
- **Security Event Monitoring**: Real-time logging of login failures, rate limits, fake tokens, brute force, IP blocks
- **Brute Force Detection**: Auto-alert on 10+ failed logins from same IP within 1 hour
- **Enhanced Security Headers**: Added COOP, CORP, 2-year HSTS, upgrade-insecure-requests, expanded Permissions-Policy
- **API Cache-Control**: `no-store, no-cache, must-revalidate, private` on all API responses
- **PII Encryption Migration**: `POST /api/security/encrypt-pii` for one-time encryption of existing data
- **Security Cleanup**: `POST /api/security/cleanup` removes expired tokens, old rate limits, 90-day-old events
- **11 New Security API Endpoints**: Dashboard, events, IP allowlist, token revocation, PII encryption, cleanup, logout
- **7 New D1 Tables**: token_blacklist, security_events, admin_ip_allowlist, rate_limit_tracker, encryption_registry, session_fingerprints, security_config
- **Security Tests**: 31/31 automated tests passing

### v7.0.0 — Cybersecurity Hardening (2026-03-17)
- **JWT Secret from Environment**: Removed hardcoded JWT secret; now loaded from Cloudflare `JWT_SECRET` env var with ephemeral fallback
- **Client-Side Auth Bypass Eliminated**: Removed ALL hardcoded credentials from login page and SPA; login now calls real `/api/auth/login` API
- **7 Security Headers**: CSP, HSTS, X-Frame-Options (DENY), X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy
- **Password Policy Strengthened**: 10+ chars, uppercase, lowercase, number, special character required; common password check
- **Registration Disabled**: Self-registration returns 403; only admins can create users
- **Password Reset Protected**: Requires Admin role authentication
- **Seed Endpoint Protected**: Requires Admin role authentication
- **Fake Token Rejection**: Old static tokens (`eyJhbGciOiJIUzI1NiJ9.bior-*`) explicitly blocked
- **Input Sanitization**: XSS sanitization for user inputs, username validation (alphanumeric only)
- **Constant-Time Password Comparison**: Prevents timing attacks on hash verification
- **Stronger Hashing**: PBKDF2 iterations increased to 150k, salt size to 32 bytes (backward compatible)
- **CORS Restricted**: Only allows requests from bior.tech and bior-709.pages.dev
- **GitHub Security**: Repository private, vulnerability alerts enabled, Dependabot active, PAT removed from remote URL
- **Legacy Auth Module Deprecated**: `src/data/auth.ts` emptied; all auth flows through D1 + JWT API

### v6.1.0 — Comprehensive Maintenance & Light Theme (2026-03-17)
- **Comprehensive Light Theme**: 413+ CSS override rules for every workspace view, modal, dropdown, header, sidebar, and map popup
- **Workspace Light Mode**: bg-[#0a0f1a] main content area, user menu, auto-refresh menu, search dropdown all properly themed
- **Modal Light Mode**: All modals (profile, notifications, add data, project creation) with light background and dark text overrides
- **Header/Search Light Mode**: Theme-aware search dropdown creation, header icons, breadcrumbs, inputs
- **Map Popup Light Mode**: Leaflet popup content inline colors overridden for light backgrounds
- **Chart.js Theme-Aware**: makeChart() detects light theme and adjusts legend, tooltip, axis colors dynamically
- **SPA Navigation Fix**: history.replaceState on init, _spaHistoryDepth tracking, back button no longer exits the app
- **6-Layer Badge Support**: bmLayerBadge now maps all 6 layers (L1-L5 + Hardware) with color-coded CSS classes
- **API Fixes**: datasets endpoint returns `count` field; notifications returns `total` field; admin/users returns `total`
- **Search Dropdown**: Dark/light theme-aware inline style based on isLightTheme() at creation time
- **Full API Audit**: All 16+ endpoints verified: dashboard, surveillance, threats, genomics, alerts, EWS, reports, admin (users, health, audit, performance), notifications, datasets, search, benchmark static data

### v6.0.0 — SPA Navigation & Layer Badges (2026-03-17)
- **SPA History Fix**: replaceSpaState on init with _spa flag, popstate handler prevents app exit
- **Theme-Aware Charts**: getChartDefaults() returns light/dark config, makeChart applies theme fixes
- **Hub Button Light Override**: hub-btn-icon styled for light theme
- **bmLayerBadge L4/L5**: Added L4_CBRN_Operational, L4_Hardware, L5_Policy mappings

### v5.9.0 — PSEF Benchmark v3.1.0 Integration (2026-03-17)
- **189 Platforms**: Upgraded from v3.0 (169) to v3.1.0 (189) with 20 new CBRN operational platforms
- **50 Deep-Research Profiles**: Expanded from 10 to 50 with executive summaries, timelines, publications, CBRN assessments
- **CBRN Operational Tab**: Dedicated view with KPIs, surveillance input coverage, score distribution, platform cards
- **6-Layer Taxonomy**: L1 Surveillance (57), L2 Genomic (59), L3 Defense (39), L4 CBRN (20), L4 Hardware (9), L5 Policy (5)
- **Layer Filter Buttons**: Filter all 189 platforms by layer with count badges
- **Layer Badges**: Color-coded badges with icons for all 6 layers
- **Military/Biodefense Indicators**: Badge shown on CBRN and defense platforms
- **All Platforms Clickable**: Profile detail view for all 189 platforms (not just deep-researched)
- **Data Library**: PSEF Benchmark v3.1 dataset entry (189 rows, 21 columns)
- **CSV/PDF Exports**: Updated to PSEF v3.1 with 189 platforms

### v5.8.0 — Polish & Completeness: Final Round (2026-03-17)
- **Light Theme Audit**: Added 50+ light-mode CSS rules covering admin panels, alerts, genomics detail modal, command palette, report tabs, detection layers, empty states, skeletons, login page, profile tabs, kbd elements, risk bars, ticker, heatmap cells
- **Theme-Aware Maps**: Dashboard and Surveillance maps switch to CARTO light tiles in light mode, dark tiles in dark mode; theme toggle re-renders current page for instant map update
- **Bulk Alert API**: New `PATCH /api/alerts/bulk` endpoint confirms or dismisses all pending alerts in one request with audit trail; frontend `bulkAlertAction` wired to real API (no more mock setTimeout)
- **Keyboard Shortcuts**: Added `r` = refresh page, `Shift+T` = toggle theme; updated help modal with full list
- **Empty State Polish**: Page-not-found now includes description + "Back to Dashboard" button; error states include retry button

### v5.7.0 — Security & User Experience (2026-03-17)
- **Rate Limiting**: IP-based failed login tracking — 5 attempts per 15 minutes, then 429 Too Many Requests
- **Session Management**: JWT returns `expiresAt`/`expiresIn` fields; frontend auto-logout timer with countdown toast
- **User Profile Modal**: 4-tab profile (Overview, Edit, Security, Activity) with live API data, password change, recent login history
- **Admin Notification Creation**: Broadcast form in notification panel for admin users
- **Hub Quick Stats**: Dashboard, surveillance sites, threats, samples, alerts counts loaded live on hub page
- **401 Auto-Logout**: API wrapper detects expired tokens and forces re-login

### v5.6.0 — Polish & Completeness (2026-03-17)
- **Audit Trail UI Upgrade**: Full-featured admin audit log with filter by action type, user, date range, and free-text search. Paginated (30/page), stats summary (total events, unique users, action breakdown chart), color-coded action badges, and CSV export of full audit log (up to 5000 rows). New API: `GET /api/admin/audit?search=&action=&user=&from=&to=&page=&limit=`, `GET /api/admin/audit/export`
- **Phylogenetic Tree (Genomics)**: Dynamic SVG tree with branch lengths scaled by mutation count, color-coded nodes (AMR=red, novel mutations=amber, normal=blue), animated root/sample nodes, coverage depth and genetic distance bars, legend and scale bar
- **Live Performance Metrics**: New "Performance" tab in Admin panel. Request middleware records every API call to D1 (`request_metrics` table). Live KPIs: requests today, avg/P95/P99 latency, error rate. SVG sparkline for hourly request volume. Slowest endpoints table. `live_d1` data source indicator. New API: `GET /api/admin/performance` (real metrics)
- **New migration**: `0004_request_metrics.sql` — `request_metrics` and `metrics_hourly` tables

### v5.5.0 — Notifications, Global Search, Tailwind Build (2026-03-17)
- **Notification System**: Bell icon fetches real-time notifications from D1 database with unread count badge, mark-as-read, mark-all-read, and 5 notification types (info, success, warning, alert, system)
- **Global Search API**: `/api/search?q=query` searches across surveillance sites, threats, genomic samples, datasets, alerts, and navigation pages — returns up to 20 typed results
- **Live Search Dropdown**: Header search shows type-ahead results as you type (debounced 250ms) with categorized results and direct navigation
- **Tailwind CSS Built**: Replaced CDN script with pre-built CSS (44KB minified) — eliminates production warning and improves load time
- **Mobile Responsive**: Added responsive breakpoints for dataset compare grids
- **Fixed**: onclick quote escaping issues in notification panel and search results

### v5.4.0 — Data Viz, Export, User Mgmt, Dataset Compare (2026-03-17)
- **SVG Radar Charts**: 10-axis radar per platform in benchmark detail view
- **Dimension Heatmap**: Color-coded 10×10 matrix in Overview tab
- **Score Distribution**: Top-10 platforms SVG bar chart
- **CSV/PDF Export**: Export all 189 platforms with full scores
- **User Management Panel**: Admin CRUD for users (add/edit/delete/reset-password)
- **Dataset Comparison Tool**: Side-by-side comparison with schema diff and numeric stats

### v5.3.0 — PSEF Benchmark Integration (2026-03-17)
- **Admin renamed**: "Dr. Majed Al-Rashidi" → "Dr Majed" (no last name), avatar "M", email majed@bior.tech
- **Unified benchmark dataset**: All 5 benchmark sources merged into one single dataset "PSEF Benchmark v3.0" (591 rows, 34 columns)
- **Source column**: Filter by `Source` to isolate Canonical-169, Scope-A-114, Scope-B-Enriched-169, Scope-C-93, or Evaluation-Criteria
- **Data from**: [Pathogen-Biosurviallance-platform-Benchmark-](https://github.com/mf2022-dev/Pathogen-Biosurviallance-platform-Benchmark-) GitHub repo
- **Cross-repository sync**: BioR ↔ Benchmark GitHub repos linked via Data Library

### v5.2.0 — Data Library & Dataset Explorer (2026-03-17)
- **Data Library (Admin-only)**: Hub-level dataset management with horizontal scrollable card grid
- **Dataset Explorer**: Full-page view with 4 tabs (Data, Charts, Versions, Compare)
- **CSV Import**: Paste CSV data with auto-detection of column names and types (text/number)
- **Versioned Datasets**: Each "Re-run" or "Add Data" creates a new version with independent row sets
- **Auto-generated Charts**: Numeric columns cross-grouped by text columns, plus version trend lines
- **Version Compare**: Side-by-side aggregation diffs (avg, min, max, row count) with % change indicators
- **CSV Export**: Per-version or full dataset export to CSV
- **Project Linking**: Datasets can be linked to multiple projects (many-to-many)
- **D1 Tables Added**: datasets, dataset_versions, dataset_rows, project_datasets (migration 0002)
- **11 New API Endpoints**: Full CRUD for datasets, versions, rows, charts, compare, export, link

### v5.1.0 — D1 Database & Real Authentication (2026-03-13)
- **D1 Database**: All data persists in Cloudflare D1 (no more in-memory mock data)
- **Real JWT Auth**: HMAC-SHA256 signed tokens with 24h expiry
- **PBKDF2 Password Hashing**: Auto-migrates from placeholder hashes on first login
- **RBAC**: Tier-based permissions (Admin=4, Analyst=3, Viewer=2)
- **CRUD APIs**: Full create/read/update for surveillance, threats, genomics, alerts
- **Pagination**: `?page=&limit=` on all list endpoints (max 100)
- **Search**: `?search=` on surveillance and genomics
- **CSV Export**: Server-side export from D1 queries
- **Audit Trail**: All actions logged to `audit_log` table
- **Auth Middleware**: All `/api/*` routes protected (except login/register)

## Platform Metrics (v8.7.0)
| Metric | Value |
|---|---|
| Source Lines | ~14,000 |
| Worker Bundle | 900 KB |
| Frontend Modules | 11 |
| API Routes | 64 |
| DB Tables (Production) | 38 |
| GeoIntel Layers | 10 |
| GeoIntel Features | 489 |
| Analytics Algorithms | 5 (Risk, Rt, Anomaly, Forecast, Drivers) |
| Report Templates | 2 (Weekly Epi Bulletin, Monthly AMR Summary) |
| Git Commits | 70 |
| Deployments | 4 domains |

## Open Issues (Roadmap)
- [#1](https://github.com/mf2022-dev/BioR/issues/1) SSE Real-Time Notifications (partially addressed by 30s polling)
- [#4](https://github.com/mf2022-dev/BioR/issues/4) ~~Advanced Analytics & ML Epidemiology~~ **DONE** (v8.6.0)
- [#5](https://github.com/mf2022-dev/BioR/issues/5) ~~Automated Scheduled Reports~~ **DONE** (v8.7.0) — Report Archive tab, on-demand generation, cron handler ready
- Split `workspace.ts` (1,780 lines) and `benchmark.ts` (1,471 lines) into sub-modules
- Add `/api/admin/security` route (frontend references it)
- Enrich production seed data (currently 3 users, 1 dataset, 24 sites)
- Address Dependabot vulnerabilities (3 high, 3 moderate in transitive deps)

## Last Updated
2026-03-19 — v8.7.0 (Automated Report Archive: 4 new API routes, report viewer modal, on-demand generation, 900 KB worker, 38 tables, 64 routes, all 4 domains deployed)
