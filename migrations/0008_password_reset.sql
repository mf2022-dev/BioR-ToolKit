-- =============================================================================
-- BioR Platform - Password Reset Tokens (Forgot Password)
-- =============================================================================

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  otp_hash TEXT NOT NULL,        -- PBKDF2 hash of the 6-digit OTP
  email TEXT NOT NULL,           -- email the OTP was sent to
  attempts INTEGER DEFAULT 0,   -- failed verification attempts (max 5)
  used INTEGER DEFAULT 0,       -- 1 = already used
  expires_at DATETIME NOT NULL, -- 15-minute expiry
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_prt_user ON password_reset_tokens(user_id, used, expires_at);
CREATE INDEX IF NOT EXISTS idx_prt_expires ON password_reset_tokens(expires_at);
