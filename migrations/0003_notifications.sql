-- =============================================================================
-- BioR Platform - Notifications Table
-- =============================================================================

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT, -- NULL means for all users
  type TEXT NOT NULL DEFAULT 'info', -- info, success, warning, alert, system
  icon TEXT DEFAULT 'fa-bell',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT, -- optional navigation target
  is_read INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

-- Seed initial notifications
INSERT OR IGNORE INTO notifications (id, user_id, type, icon, title, message, link, created_at) VALUES
  ('notif-001', NULL, 'system', 'fa-rocket', 'Platform Launched', 'BioR Platform v5.5 is now live with enhanced features.', NULL, datetime('now', '-2 hours')),
  ('notif-002', NULL, 'success', 'fa-database', 'PSEF Benchmark Imported', '591 rows imported from 5 benchmark sources into the Data Library.', NULL, datetime('now', '-1 hours')),
  ('notif-003', NULL, 'info', 'fa-chart-bar', 'New Visualizations Available', 'Radar charts, heatmaps, and score distribution added to benchmark viewer.', NULL, datetime('now', '-30 minutes')),
  ('notif-004', 'usr-001', 'warning', 'fa-exclamation-triangle', 'Jizan Alert Escalated', 'Dengue outbreak alert in Jizan region requires review.', NULL, datetime('now', '-15 minutes')),
  ('notif-005', NULL, 'info', 'fa-users-cog', 'User Management Active', 'Admin panel now supports full user CRUD operations.', NULL, datetime('now', '-10 minutes'));
