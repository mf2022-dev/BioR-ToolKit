-- Request metrics for real performance tracking
CREATE TABLE IF NOT EXISTS request_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  path TEXT NOT NULL,
  method TEXT DEFAULT 'GET',
  status INTEGER DEFAULT 200,
  latency_ms REAL NOT NULL,
  timestamp TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_metrics_timestamp ON request_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_metrics_path ON request_metrics(path);

-- Hourly aggregated metrics (auto-rolled up)
CREATE TABLE IF NOT EXISTS metrics_hourly (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hour TEXT NOT NULL,  -- '2026-03-17 14:00'
  total_requests INTEGER DEFAULT 0,
  avg_latency_ms REAL DEFAULT 0,
  p95_latency_ms REAL DEFAULT 0,
  max_latency_ms REAL DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  unique_paths INTEGER DEFAULT 0
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_metrics_hourly_hour ON metrics_hourly(hour);
