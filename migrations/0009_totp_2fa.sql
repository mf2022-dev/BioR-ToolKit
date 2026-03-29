-- =============================================================================
-- BioR Platform - TOTP Two-Factor Authentication (v9.0)
-- =============================================================================
-- Stores TOTP secrets and recovery codes for each user
-- =============================================================================

CREATE TABLE IF NOT EXISTS totp_secrets (
  user_id TEXT PRIMARY KEY,
  secret TEXT NOT NULL,         -- Base32-encoded TOTP secret (encrypted)
  enabled INTEGER DEFAULT 0,   -- 1 = 2FA active, 0 = setup pending
  verified INTEGER DEFAULT 0,  -- 1 = user confirmed setup with valid code
  recovery_codes TEXT,          -- JSON array of hashed recovery codes
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Track 2FA verification attempts (rate limiting)
CREATE TABLE IF NOT EXISTS totp_attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  ip TEXT,
  success INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_totp_attempts_user ON totp_attempts(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_totp_attempts_ip ON totp_attempts(ip, created_at);
