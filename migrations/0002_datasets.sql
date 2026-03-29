-- =============================================================================
-- BioR Platform - Datasets & Data Library Schema
-- Admin-only feature for managing analytical datasets
-- =============================================================================

-- Datasets (metadata)
CREATE TABLE IF NOT EXISTS datasets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon TEXT DEFAULT 'fa-database',
  color TEXT DEFAULT '#3b82f6',
  columns_def TEXT NOT NULL DEFAULT '[]',  -- JSON array of {name, type}
  row_count INTEGER DEFAULT 0,
  version_count INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active',            -- active, archived
  created_by TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Dataset versions (each import/re-run = new version)
CREATE TABLE IF NOT EXISTS dataset_versions (
  id TEXT PRIMARY KEY,
  dataset_id TEXT NOT NULL,
  version_num INTEGER NOT NULL DEFAULT 1,
  row_count INTEGER DEFAULT 0,
  notes TEXT DEFAULT '',
  created_by TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE CASCADE
);

-- Dataset rows (actual data stored as JSON per row)
CREATE TABLE IF NOT EXISTS dataset_rows (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dataset_id TEXT NOT NULL,
  version_id TEXT NOT NULL,
  row_data TEXT NOT NULL DEFAULT '{}',     -- JSON object with column values
  row_index INTEGER DEFAULT 0,
  FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE CASCADE,
  FOREIGN KEY (version_id) REFERENCES dataset_versions(id) ON DELETE CASCADE
);

-- Project-dataset links (many-to-many)
CREATE TABLE IF NOT EXISTS project_datasets (
  project_id TEXT NOT NULL,
  dataset_id TEXT NOT NULL,
  linked_at TEXT DEFAULT (datetime('now')),
  linked_by TEXT NOT NULL,
  PRIMARY KEY (project_id, dataset_id),
  FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_dataset_versions_dataset ON dataset_versions(dataset_id);
CREATE INDEX IF NOT EXISTS idx_dataset_rows_dataset ON dataset_rows(dataset_id);
CREATE INDEX IF NOT EXISTS idx_dataset_rows_version ON dataset_rows(version_id);
CREATE INDEX IF NOT EXISTS idx_project_datasets_project ON project_datasets(project_id);
CREATE INDEX IF NOT EXISTS idx_project_datasets_dataset ON project_datasets(dataset_id);
