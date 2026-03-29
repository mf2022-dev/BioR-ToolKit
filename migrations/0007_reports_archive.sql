-- =============================================================================
-- BioR Platform - Reports Archive (v8.7)
-- Stores scheduled and on-demand generated reports
-- =============================================================================

CREATE TABLE IF NOT EXISTS reports_archive (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'weekly_bulletin',
  period TEXT NOT NULL,
  html_content TEXT NOT NULL,
  generated_by TEXT NOT NULL DEFAULT 'system',
  generated_at TEXT DEFAULT (datetime('now')),
  trigger_type TEXT NOT NULL DEFAULT 'manual',
  size_bytes INTEGER DEFAULT 0,
  metadata TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_reports_archive_type ON reports_archive(type);
CREATE INDEX IF NOT EXISTS idx_reports_archive_generated ON reports_archive(generated_at DESC);
