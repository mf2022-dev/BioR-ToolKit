-- =============================================================================
-- BioR Platform - Regulatory & Standards Knowledge Base (RSKB)
-- Migration 0010: Comprehensive biosurveillance regulatory foundation
-- 
-- Systematic taxonomy covering:
--   Domain 1: International Treaties & Conventions
--   Domain 2: International Frameworks & Initiatives  
--   Domain 3: Standards & Technical Norms
--   Domain 4: National Legislation & Regulations
--   Domain 5: Regional Agreements & Cooperation
--   Domain 6: Guidelines & Best Practices
--   Domain 7: Quality Assurance & Accreditation
--   Domain 8: Policies & Strategies
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. DOMAINS — Top-level classification of regulatory knowledge
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rskb_domains (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,              -- e.g., 'TREATY', 'FRAMEWORK', 'STANDARD'
  name TEXT NOT NULL,                      -- e.g., 'International Treaties & Conventions'
  description TEXT,
  icon TEXT,                               -- FontAwesome icon class
  color TEXT,                              -- Hex color for UI
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- -----------------------------------------------------------------------------
-- 2. CATEGORIES — Sub-classification within domains
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rskb_categories (
  id TEXT PRIMARY KEY,
  domain_id TEXT NOT NULL REFERENCES rskb_domains(id),
  code TEXT UNIQUE NOT NULL,              -- e.g., 'BIOSECURITY', 'BIOSAFETY', 'BIOSURV'
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_rskb_categories_domain ON rskb_categories(domain_id);

-- -----------------------------------------------------------------------------
-- 3. INSTRUMENTS — The core records (treaties, standards, laws, guidelines)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rskb_instruments (
  id TEXT PRIMARY KEY,
  domain_id TEXT NOT NULL REFERENCES rskb_domains(id),
  category_id TEXT REFERENCES rskb_categories(id),
  
  -- Identity
  code TEXT UNIQUE NOT NULL,              -- Short reference code e.g., 'BWC', 'IHR-2005', 'ISO-35001'
  title TEXT NOT NULL,                     -- Full official title
  short_title TEXT,                        -- Common abbreviated name
  
  -- Classification
  instrument_type TEXT NOT NULL,           -- treaty|convention|protocol|resolution|framework|standard|regulation|law|decree|guideline|manual|policy|strategy|action_plan|code_of_practice
  scope TEXT NOT NULL DEFAULT 'international', -- international|regional|national|sub_national|institutional
  
  -- Governance
  issuing_body TEXT NOT NULL,              -- WHO, UN, WOAH, ISO, Saudi MOH, etc.
  issuing_body_type TEXT,                  -- un_agency|int_org|standards_body|national_gov|regional_org|professional_body|ngo
  
  -- Temporal
  adopted_date TEXT,                       -- Date adopted/signed
  entry_into_force TEXT,                   -- Date entered into force
  last_amended TEXT,                       -- Last amendment date
  review_cycle TEXT,                       -- e.g., '5 years', 'annual'
  next_review TEXT,                        -- Next scheduled review
  status TEXT NOT NULL DEFAULT 'active',   -- active|amended|superseded|expired|draft|proposed
  
  -- Content
  purpose TEXT,                            -- Brief purpose statement
  summary TEXT,                            -- Detailed summary
  key_provisions TEXT,                     -- JSON array of key provisions/articles
  obligations TEXT,                        -- JSON array of obligations for states/parties
  
  -- Applicability
  applies_to TEXT,                         -- JSON array: ['state_parties', 'laboratories', 'health_facilities']
  geographic_scope TEXT,                   -- JSON array: ['global', 'EMRO', 'GCC', 'Saudi Arabia']
  
  -- Sectors covered
  sector_biosecurity INTEGER DEFAULT 0,
  sector_biosafety INTEGER DEFAULT 0,
  sector_biosurveillance INTEGER DEFAULT 0,
  sector_biodefense INTEGER DEFAULT 0,
  sector_public_health INTEGER DEFAULT 0,
  sector_animal_health INTEGER DEFAULT 0,
  sector_food_safety INTEGER DEFAULT 0,
  sector_environmental INTEGER DEFAULT 0,
  sector_laboratory INTEGER DEFAULT 0,
  sector_amr INTEGER DEFAULT 0,
  
  -- Links
  official_url TEXT,
  document_url TEXT,
  
  -- Compliance
  binding_level TEXT DEFAULT 'mandatory',  -- mandatory|voluntary|recommended|aspirational
  enforcement_mechanism TEXT,              -- Description of enforcement
  compliance_indicators TEXT,              -- JSON array of compliance indicators
  
  -- Saudi Arabia relevance
  sa_relevance TEXT,                        -- How this applies to Saudi Arabia specifically
  sa_implementing_body TEXT,                -- Saudi body responsible for implementation
  sa_status TEXT,                           -- adopted|partially_adopted|under_review|not_adopted
  
  -- Metadata
  tags TEXT,                               -- JSON array of tags
  notes TEXT,
  created_by TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_rskb_instruments_domain ON rskb_instruments(domain_id);
CREATE INDEX IF NOT EXISTS idx_rskb_instruments_category ON rskb_instruments(category_id);
CREATE INDEX IF NOT EXISTS idx_rskb_instruments_type ON rskb_instruments(instrument_type);
CREATE INDEX IF NOT EXISTS idx_rskb_instruments_scope ON rskb_instruments(scope);
CREATE INDEX IF NOT EXISTS idx_rskb_instruments_status ON rskb_instruments(status);
CREATE INDEX IF NOT EXISTS idx_rskb_instruments_issuing_body ON rskb_instruments(issuing_body);

-- Full-text search support
CREATE VIRTUAL TABLE IF NOT EXISTS rskb_instruments_fts USING fts5(
  code, title, short_title, summary, purpose, tags,
  content='rskb_instruments',
  content_rowid='rowid'
);

-- -----------------------------------------------------------------------------
-- 4. CROSS-REFERENCES — Relationships between instruments
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rskb_cross_references (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES rskb_instruments(id),
  target_id TEXT NOT NULL REFERENCES rskb_instruments(id),
  relationship_type TEXT NOT NULL,         -- implements|supplements|amends|supersedes|references|harmonizes_with|derived_from|requires|conflicts_with|complements
  description TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(source_id, target_id, relationship_type)
);

CREATE INDEX IF NOT EXISTS idx_rskb_xref_source ON rskb_cross_references(source_id);
CREATE INDEX IF NOT EXISTS idx_rskb_xref_target ON rskb_cross_references(target_id);

-- -----------------------------------------------------------------------------
-- 5. PROVISIONS — Specific articles/sections within instruments
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rskb_provisions (
  id TEXT PRIMARY KEY,
  instrument_id TEXT NOT NULL REFERENCES rskb_instruments(id),
  provision_number TEXT NOT NULL,           -- e.g., 'Article 6', 'Section 3.2', 'Annex A'
  title TEXT,
  content TEXT,
  provision_type TEXT,                      -- article|section|annex|appendix|schedule|regulation|clause
  is_key_provision INTEGER DEFAULT 0,
  relevance_to_bior TEXT,                   -- How this provision relates to BioR operations
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_rskb_provisions_instrument ON rskb_provisions(instrument_id);

-- -----------------------------------------------------------------------------
-- 6. ISSUING BODIES — Organizations that create/maintain instruments
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rskb_bodies (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,               -- e.g., 'WHO', 'WOAH', 'ISO', 'SA-MOH'
  name TEXT NOT NULL,
  full_name TEXT,
  body_type TEXT NOT NULL,                  -- un_agency|int_org|standards_body|national_gov|regional_org|professional_body
  parent_body_id TEXT REFERENCES rskb_bodies(id),
  headquarters TEXT,
  established_year INTEGER,
  website TEXT,
  mandate TEXT,
  member_states INTEGER,
  sa_membership_status TEXT,               -- member|observer|non_member|associate
  logo_url TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- -----------------------------------------------------------------------------
-- 7. COMPLIANCE MATRIX — Track Saudi Arabia's compliance with instruments
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rskb_compliance (
  id TEXT PRIMARY KEY,
  instrument_id TEXT NOT NULL REFERENCES rskb_instruments(id),
  assessment_date TEXT NOT NULL,
  overall_score REAL,                       -- 0-100 compliance score
  status TEXT NOT NULL,                     -- compliant|partially_compliant|non_compliant|under_assessment|not_applicable
  
  -- Detailed scores by area
  legislative_score REAL,                   -- Legal framework alignment
  institutional_score REAL,                 -- Institutional capacity
  technical_score REAL,                     -- Technical capabilities
  reporting_score REAL,                     -- Reporting obligations met
  
  gaps TEXT,                                -- JSON array of identified gaps
  recommendations TEXT,                     -- JSON array of recommendations
  action_items TEXT,                        -- JSON array of action items
  assessor TEXT,
  next_assessment TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_rskb_compliance_instrument ON rskb_compliance(instrument_id);

-- -----------------------------------------------------------------------------
-- 8. IMPLEMENTATION TIMELINE — Key dates and milestones
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rskb_timeline (
  id TEXT PRIMARY KEY,
  instrument_id TEXT NOT NULL REFERENCES rskb_instruments(id),
  event_date TEXT NOT NULL,
  event_type TEXT NOT NULL,                 -- adopted|signed|ratified|entered_force|amended|reviewed|expired|milestone
  title TEXT NOT NULL,
  description TEXT,
  sa_impact TEXT,                           -- Impact on Saudi Arabia
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_rskb_timeline_instrument ON rskb_timeline(instrument_id);
CREATE INDEX IF NOT EXISTS idx_rskb_timeline_date ON rskb_timeline(event_date);

-- -----------------------------------------------------------------------------
-- 9. CAPACITY AREAS — IHR/JEE Core Capacities and GHSA Action Packages
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rskb_capacity_areas (
  id TEXT PRIMARY KEY,
  framework_instrument_id TEXT REFERENCES rskb_instruments(id),
  code TEXT UNIQUE NOT NULL,               -- e.g., 'IHR-C1', 'GHSA-P1', 'JEE-LAB'
  name TEXT NOT NULL,
  category TEXT NOT NULL,                   -- prevent|detect|respond|other
  description TEXT,
  indicators TEXT,                          -- JSON array of measurable indicators
  sa_score REAL,                            -- Saudi Arabia's current score (0-100)
  sa_level TEXT,                            -- no_capacity|limited|developed|demonstrated|sustainable
  target_score REAL,
  target_date TEXT,
  linked_instruments TEXT,                  -- JSON array of instrument IDs that support this capacity
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_rskb_capacity_framework ON rskb_capacity_areas(framework_instrument_id);

-- -----------------------------------------------------------------------------
-- 10. AGENT LISTS — Select agents, toxins, and regulated pathogens
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rskb_regulated_agents (
  id TEXT PRIMARY KEY,
  agent_name TEXT NOT NULL,
  agent_type TEXT NOT NULL,                 -- bacteria|virus|toxin|fungus|prion|parasite
  risk_group INTEGER,                       -- 1-4 (WHO risk groups)
  bsl_required INTEGER,                     -- BSL level required (1-4)
  select_agent INTEGER DEFAULT 0,           -- Is a select agent (US CDC)
  australia_group INTEGER DEFAULT 0,        -- On Australia Group control list
  bwc_relevant INTEGER DEFAULT 0,           -- BWC relevant
  cw_schedule TEXT,                         -- CWC schedule if applicable
  
  -- Regulatory classification by jurisdiction
  sa_classification TEXT,                   -- Saudi Arabia classification
  who_classification TEXT,                  -- WHO classification
  cdc_classification TEXT,                  -- US CDC classification
  eu_classification TEXT,                   -- EU classification
  
  -- Disease/threat info
  diseases TEXT,                            -- JSON array of diseases caused
  transmission_routes TEXT,                 -- JSON array
  pandemic_potential TEXT,                  -- low|moderate|high|very_high
  amr_concern INTEGER DEFAULT 0,           -- Antimicrobial resistance concern
  
  -- Linked instruments (regulations that cover this agent)
  governing_instruments TEXT,              -- JSON array of instrument IDs
  
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_rskb_agents_type ON rskb_regulated_agents(agent_type);
CREATE INDEX IF NOT EXISTS idx_rskb_agents_risk ON rskb_regulated_agents(risk_group);
CREATE INDEX IF NOT EXISTS idx_rskb_agents_bsl ON rskb_regulated_agents(bsl_required);

-- -----------------------------------------------------------------------------
-- 11. AUDIT/CHANGE LOG — Track changes to the knowledge base
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rskb_changelog (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,               -- instrument|provision|compliance|body|agent
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,                     -- created|updated|deleted|reviewed
  changed_fields TEXT,                      -- JSON of changed fields
  changed_by TEXT,
  reason TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_rskb_changelog_entity ON rskb_changelog(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_rskb_changelog_date ON rskb_changelog(created_at);
