-- =============================================================================
-- BioR Platform - Enterprise Security Tables (v8.0)
-- =============================================================================

-- Token Blacklist: revoked tokens (password change, logout, admin action)
CREATE TABLE IF NOT EXISTS token_blacklist (
  jti TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  reason TEXT NOT NULL DEFAULT 'logout',
  revoked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_token_blacklist_user ON token_blacklist(user_id);
CREATE INDEX IF NOT EXISTS idx_token_blacklist_expires ON token_blacklist(expires_at);

-- Security Events: real-time security monitoring and alerting
CREATE TABLE IF NOT EXISTS security_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium',
  ip TEXT,
  user_id TEXT,
  username TEXT,
  details TEXT,
  metadata TEXT,
  resolved INTEGER DEFAULT 0,
  resolved_by TEXT,
  resolved_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_created ON security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_ip ON security_events(ip);

-- Admin IP Allowlist: zero-trust IP restrictions for admin endpoints
CREATE TABLE IF NOT EXISTS admin_ip_allowlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_address TEXT NOT NULL,
  label TEXT,
  added_by TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  is_active INTEGER DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_admin_ip_active ON admin_ip_allowlist(is_active);

-- Global Rate Limit tracking (per-IP request counter)
CREATE TABLE IF NOT EXISTS rate_limit_tracker (
  ip TEXT NOT NULL,
  window_key TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  first_request DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_request DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (ip, window_key)
);
CREATE INDEX IF NOT EXISTS idx_rate_limit_ip ON rate_limit_tracker(ip);

-- Encrypted fields registry (tracks which fields are encrypted for which tables)
CREATE TABLE IF NOT EXISTS encryption_registry (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_name TEXT NOT NULL,
  field_name TEXT NOT NULL,
  encryption_algo TEXT NOT NULL DEFAULT 'AES-256-GCM',
  encrypted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(table_name, field_name)
);

-- Session fingerprints: bind tokens to device characteristics
CREATE TABLE IF NOT EXISTS session_fingerprints (
  jti TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_agent_hash TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_verified DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_session_fp_user ON session_fingerprints(user_id);

-- Security configuration (key-value pairs for security settings)
CREATE TABLE IF NOT EXISTS security_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_by TEXT
);

-- Insert default security configuration
INSERT OR IGNORE INTO security_config (key, value) VALUES
  ('token_lifetime_hours', '8'),
  ('max_login_attempts', '5'),
  ('lockout_window_minutes', '15'),
  ('global_rate_limit_per_minute', '120'),
  ('admin_ip_restriction_enabled', '0'),
  ('session_fingerprint_enabled', '1'),
  ('encryption_at_rest_enabled', '1'),
  ('security_alerting_enabled', '1'),
  ('password_min_length', '10'),
  ('pbkdf2_iterations', '150000'),
  ('brute_force_detection_enabled', '1'),
  ('auto_logout_on_ip_change', '0');
