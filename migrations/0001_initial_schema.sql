-- =============================================================================
-- BioR Platform - Initial Database Schema
-- Cloudflare D1 (SQLite-compatible)
-- =============================================================================

-- Users table with password hashing support
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Viewer',
  full_role TEXT,
  institution TEXT,
  tier INTEGER NOT NULL DEFAULT 1,
  avatar TEXT,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  sessions_today INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  last_login TEXT
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Surveillance sites
CREATE TABLE IF NOT EXISTS surveillance_sites (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  region TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  last_report TEXT,
  dq_score INTEGER DEFAULT 0,
  lat REAL,
  lng REAL,
  cases_this_week INTEGER DEFAULT 0,
  samples_submitted INTEGER DEFAULT 0,
  contact_person TEXT,
  phone TEXT,
  capacity TEXT,
  pathogens TEXT, -- JSON array stored as text
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sites_region ON surveillance_sites(region);
CREATE INDEX IF NOT EXISTS idx_sites_status ON surveillance_sites(status);
CREATE INDEX IF NOT EXISTS idx_sites_type ON surveillance_sites(type);

-- Threats / outbreaks
CREATE TABLE IF NOT EXISTS threats (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  pathogen TEXT NOT NULL,
  icd11 TEXT,
  severity TEXT NOT NULL DEFAULT 'Low',
  cases INTEGER DEFAULT 0,
  deaths INTEGER DEFAULT 0,
  cfr REAL DEFAULT 0,
  regions TEXT, -- JSON array
  containment INTEGER DEFAULT 0,
  detected TEXT,
  risk_score INTEGER DEFAULT 0,
  lab_confirmed INTEGER DEFAULT 0,
  genomic_cluster_id TEXT,
  trend TEXT DEFAULT 'stable',
  weekly_change TEXT DEFAULT '0',
  ih_reportable INTEGER DEFAULT 0,
  response_teams INTEGER DEFAULT 0,
  water_sources INTEGER DEFAULT 0,
  timeline TEXT, -- JSON array of {date, event, type}
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_threats_severity ON threats(severity);
CREATE INDEX IF NOT EXISTS idx_threats_pathogen ON threats(pathogen);
CREATE INDEX IF NOT EXISTS idx_threats_risk ON threats(risk_score);

-- Genomic samples
CREATE TABLE IF NOT EXISTS genomic_samples (
  sample_id TEXT PRIMARY KEY,
  pathogen TEXT NOT NULL,
  lineage TEXT,
  platform TEXT,
  pipeline_status TEXT DEFAULT 'Queued',
  coverage REAL DEFAULT 0,
  amr_detected INTEGER DEFAULT 0,
  amr_genes TEXT, -- JSON array
  quality TEXT DEFAULT 'pending',
  institution TEXT,
  date TEXT,
  read_length TEXT,
  total_reads TEXT,
  assembly_length TEXT,
  mutations INTEGER DEFAULT 0,
  novel_mutations INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_samples_pathogen ON genomic_samples(pathogen);
CREATE INDEX IF NOT EXISTS idx_samples_status ON genomic_samples(pipeline_status);
CREATE INDEX IF NOT EXISTS idx_samples_institution ON genomic_samples(institution);
CREATE INDEX IF NOT EXISTS idx_samples_date ON genomic_samples(date);

-- Pipeline stages (aggregates)
CREATE TABLE IF NOT EXISTS pipeline_stages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  icon TEXT,
  completed INTEGER DEFAULT 0,
  active INTEGER DEFAULT 0,
  failed INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- AMR heatmap data
CREATE TABLE IF NOT EXISTS amr_heatmap (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pathogen TEXT NOT NULL,
  antibiotic TEXT NOT NULL,
  resistance_pct REAL DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_amr_pathogen ON amr_heatmap(pathogen);

-- Alerts
CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  level INTEGER NOT NULL DEFAULT 1,
  type TEXT,
  pathogen TEXT,
  region TEXT,
  risk_score INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending_review',
  generated_at TEXT DEFAULT (datetime('now')),
  generated_by TEXT,
  reviewed_at TEXT,
  reviewer TEXT,
  channels TEXT, -- JSON array
  recommended_actions TEXT, -- JSON array
  affected_population INTEGER DEFAULT 0,
  response_status TEXT DEFAULT 'Pending',
  sitrep INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_alerts_level ON alerts(level);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_pathogen ON alerts(pathogen);
CREATE INDEX IF NOT EXISTS idx_alerts_region ON alerts(region);

-- EWS signals
CREATE TABLE IF NOT EXISTS ews_signals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pathogen TEXT NOT NULL,
  region TEXT NOT NULL,
  type TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  description TEXT,
  time TEXT,
  source TEXT,
  action TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_ews_type ON ews_signals(type);
CREATE INDEX IF NOT EXISTS idx_ews_score ON ews_signals(score);

-- EWS detection layers
CREATE TABLE IF NOT EXISTS ews_detection_layers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  signals INTEGER DEFAULT 0,
  description TEXT,
  algorithms TEXT, -- JSON array
  last_run TEXT,
  next_run TEXT
);

-- EWS regional risks
CREATE TABLE IF NOT EXISTS ews_regional_risks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  region TEXT NOT NULL UNIQUE,
  score INTEGER DEFAULT 0,
  trend TEXT DEFAULT 'stable',
  change TEXT DEFAULT '0',
  top_threat TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- EWS OSINT feed
CREATE TABLE IF NOT EXISTS ews_osint_feed (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  source TEXT,
  date TEXT,
  relevance INTEGER DEFAULT 0,
  language TEXT DEFAULT 'English',
  sentiment TEXT DEFAULT 'neutral',
  entities TEXT, -- JSON array
  created_at TEXT DEFAULT (datetime('now'))
);

-- EWS config (national risk, forecast, risk history)
CREATE TABLE IF NOT EXISTS ews_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL, -- JSON
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Dashboard metrics (snapshot-based)
CREATE TABLE IF NOT EXISTS dashboard_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  metric_key TEXT NOT NULL,
  metric_value TEXT NOT NULL, -- JSON for complex values
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_dashboard_key ON dashboard_metrics(metric_key);

-- Reports data
CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  period TEXT,
  total_cases INTEGER DEFAULT 0,
  deaths INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Draft',
  author TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Reports chart data (stored as key-value JSON)
CREATE TABLE IF NOT EXISTS reports_data (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL, -- JSON
  updated_at TEXT DEFAULT (datetime('now'))
);

-- System health services
CREATE TABLE IF NOT EXISTS system_services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'healthy',
  uptime TEXT,
  latency TEXT,
  load INTEGER DEFAULT 0,
  last_check TEXT
);

-- System health config
CREATE TABLE IF NOT EXISTS system_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL, -- JSON
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Data quality scorecard
CREATE TABLE IF NOT EXISTS dq_scorecard (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  institution TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  completeness INTEGER DEFAULT 0,
  timeliness INTEGER DEFAULT 0,
  accuracy INTEGER DEFAULT 0,
  trend TEXT DEFAULT 'stable',
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_dq_institution ON dq_scorecard(institution);

-- Audit log
CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  timestamp TEXT DEFAULT (datetime('now')),
  user TEXT,
  action TEXT NOT NULL,
  resource TEXT,
  details TEXT,
  ip TEXT,
  tier INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_log(action);
