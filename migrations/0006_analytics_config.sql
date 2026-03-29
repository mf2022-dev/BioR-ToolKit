-- =============================================================================
-- BioR Platform - Analytics Configuration (v8.6)
-- Configurable weights for risk scoring, anomaly detection, and forecasting
-- =============================================================================

CREATE TABLE IF NOT EXISTS analytics_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Risk score weights (must sum to 1.0)
INSERT OR REPLACE INTO analytics_config (key, value, description) VALUES
  ('risk_w_velocity', '0.30', 'Weight for case velocity in national risk'),
  ('risk_w_severity', '0.25', 'Weight for severity index'),
  ('risk_w_containment', '0.20', 'Weight for containment gap (100 - containment%)'),
  ('risk_w_genomic', '0.15', 'Weight for genomic signal strength'),
  ('risk_w_ews', '0.10', 'Weight for EWS composite score');

-- Anomaly detection
INSERT OR REPLACE INTO analytics_config (key, value, description) VALUES
  ('anomaly_threshold_sigma', '2.0', 'Z-score threshold for anomaly flagging'),
  ('anomaly_window_weeks', '6', 'Baseline window for Z-score calculation');

-- Forecast
INSERT OR REPLACE INTO analytics_config (key, value, description) VALUES
  ('forecast_window_weeks', '6', 'Historical weeks used for regression'),
  ('forecast_horizon_days', '14', 'Forward prediction horizon');

-- Rt estimation
INSERT OR REPLACE INTO analytics_config (key, value, description) VALUES
  ('rt_serial_interval', '5.0', 'Serial interval in days for Rt calculation'),
  ('rt_window_days', '7', 'Rolling window for Rt estimation');

CREATE INDEX IF NOT EXISTS idx_analytics_config_key ON analytics_config(key);
