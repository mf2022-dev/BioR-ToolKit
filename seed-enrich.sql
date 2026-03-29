-- =============================================================================
-- BioR Platform - Data Enrichment Script
-- Adds realistic operational data to production D1 database
-- Run AFTER seed.sql (all INSERT OR IGNORE to avoid duplicates)
-- =============================================================================

-- ===== NEW USERS (3 additional staff) =====
INSERT OR IGNORE INTO users (id, username, password_hash, name, role, full_role, institution, tier, avatar, email) VALUES
  ('usr-004', 'lab_tech', '__HASH_LabTech2026!__', 'Dr. Aisha Al-Qahtani', 'Analyst', 'Lead Laboratory Technician', 'National Reference Laboratory', 3, 'AQ', 'aisha@bior.tech'),
  ('usr-005', 'field_epi', '__HASH_FieldEpi2026!__', 'Dr. Sami Al-Rashidi', 'Analyst', 'Field Epidemiologist', 'Western Region Health Directorate', 3, 'SR', 'sami@bior.tech'),
  ('usr-006', 'data_mgr', '__HASH_DataMgr2026!__', 'Eng. Reem Al-Harbi', 'Viewer', 'Data Management Officer', 'BioR National Operations Center', 2, 'RH', 'reem@bior.tech');

-- ===== NEW ALERTS (12 additional alerts) =====
INSERT OR IGNORE INTO alerts (id, title, description, level, type, pathogen, region, risk_score, status, generated_at, generated_by, reviewed_at, reviewer, channels, recommended_actions, affected_population, response_status, sitrep) VALUES
  ('ALT-2026-0043', 'Suspected Anthrax Case - Northern Border', 'Cutaneous anthrax suspected in livestock worker at Arar border zone. Sample sent for PCR confirmation. Contact tracing initiated for 12 close contacts.', 2, 'case_surge', 'Bacillus anthracis', 'Northern Borders - Arar', 65, 'pending_review', '2026-03-09 06:30', 'Clinical Surveillance', NULL, NULL, '["sms","email","dashboard"]', '["Collect environmental samples","Contact trace 12 close contacts","Alert veterinary services","Prophylaxis for exposed workers"]', 2000, 'Investigating', 0),
  ('ALT-2026-0044', 'Norovirus Outbreak - Makkah Worker Camp', 'Cluster of 45 gastroenteritis cases in temporary worker housing near Makkah. Norovirus GII.4 confirmed by rapid antigen test. Environmental samples positive.', 2, 'case_surge', 'Norovirus GII.4', 'Makkah - Industrial Zone', 62, 'confirmed', '2026-03-09 08:15', 'Sentinel Surveillance', '2026-03-09 09:00', 'Dr. Fatima Hassan', '["sms","email","dashboard"]', '["Implement strict hand hygiene","Isolate symptomatic cases","Environmental decontamination","Ensure ORS supply"]', 5000, 'Active Response', 0),
  ('ALT-2026-0045', 'ESBL E. coli in Water Supply - Jubail', 'ESBL-producing E. coli detected in Jubail desalination plant output. blaCTX-M-15 gene confirmed. Emergency chlorination protocol activated.', 3, 'amr_alert', 'E. coli (ESBL)', 'Eastern - Jubail', 78, 'pending_review', '2026-03-09 04:45', 'Environmental Monitoring', NULL, NULL, '["sms","email","dashboard","who_ihr"]', '["Emergency chlorination","Notify water authority","Sample upstream sources","Public advisory"]', 250000, 'Mobilizing', 1),
  ('ALT-2026-0046', 'Measles Cluster - Riyadh School', 'Seven confirmed measles cases among unvaccinated children at Al-Fayha Elementary School. Ring vaccination campaign initiated for 400 students.', 2, 'case_surge', 'Measles Virus', 'Riyadh - Al-Fayha', 58, 'confirmed', '2026-03-08 14:20', 'School Health Program', '2026-03-08 16:00', 'Dr Majed', '["email","dashboard"]', '["Ring vaccination for 400 students","Notify parents","Check vaccination records","Isolate cases for 4 days"]', 8000, 'Active Response', 0),
  ('ALT-2026-0047', 'Unexplained Pneumonia Deaths - ICU Cluster', 'Three unexplained pneumonia deaths in 48 hours at Dammam Central Hospital ICU. No common pathogen identified. BAL samples sent for metagenomic sequencing.', 3, 'case_surge', 'Unknown', 'Eastern - Dammam', 85, 'pending_review', '2026-03-09 02:00', 'Hospital Surveillance', NULL, NULL, '["sms","email","dashboard","who_ihr"]', '["Metagenomic sequencing urgent","Enhanced IPC in ICU","Epidemiological investigation","Notify MOH leadership"]', 3000, 'Investigating', 1),
  ('ALT-2026-0048', 'Brucellosis Spike - Al-Jouf', 'Twelve new brucellosis cases confirmed in Al-Jouf over 2 weeks, triple the seasonal average. Linked to unpasteurized dairy consumption from local farms.', 1, 'case_surge', 'Brucella melitensis', 'Al-Jouf - Sakaka', 48, 'confirmed', '2026-03-08 11:00', 'EWS Statistical Engine', '2026-03-08 13:00', 'Dr. Sami Al-Rashidi', '["email","dashboard"]', '["Dairy farm inspections","Public awareness on pasteurization","Screen farm workers","Coordinate with MEWA"]', 12000, 'Active Response', 0),
  ('ALT-2026-0049', 'Dengue Vector Index Exceeded - Jizan', 'Aedes aegypti Breteau Index reached 42 (threshold: 20) in Jizan urban area. Correlates with 65% increase in dengue cases. Emergency fogging scheduled.', 2, 'case_surge', 'Dengue Virus', 'Jizan - Urban', 72, 'confirmed', '2026-03-08 16:30', 'Vector Surveillance', '2026-03-08 17:00', 'Dr. Fatima Hassan', '["sms","email","dashboard"]', '["Emergency fogging operations","Larviciding program","Community source reduction","Deploy additional surveillance traps"]', 180000, 'Active Response', 1),
  ('ALT-2026-0050', 'H5N1 Avian Influenza - Qassim Poultry Farm', 'Highly pathogenic avian influenza H5N1 confirmed in commercial poultry farm, Qassim. 2,000 birds culled. Three farm workers under monitoring.', 3, 'osint_signal', 'Influenza A H5N1', 'Qassim - Buraidah', 82, 'pending_review', '2026-03-09 09:00', 'Animal Health Authority', NULL, NULL, '["sms","email","dashboard","who_ihr"]', '["Cull remaining flock","PPE for all farm workers","Oseltamivir prophylaxis","10-day surveillance zone","Notify OIE/WOAH"]', 50000, 'Mobilizing', 1),
  ('ALT-2026-0051', 'Suspected Foodborne Botulism', 'Two patients with descending paralysis admitted to KAMC Riyadh. Both consumed home-canned vegetables 72h prior. Serum botulinum toxin assay pending.', 2, 'case_surge', 'Clostridium botulinum', 'Riyadh', 68, 'pending_review', '2026-03-09 07:45', 'Emergency Department', NULL, NULL, '["sms","email","dashboard"]', '["Botulinum antitoxin standby","Trace food product source","Test remaining food items","Alert poison control"]', 500, 'Investigating', 0),
  ('ALT-2026-0052', 'Schistosomiasis Resurgence - Asir', 'Prevalence survey in Asir mountain villages found 8.2% S. mansoni positivity (up from 1.5% in 2024). Linked to irrigation canal exposure.', 1, 'case_surge', 'Schistosoma mansoni', 'Asir - Al-Soudah', 42, 'confirmed', '2026-03-07 13:00', 'Community Health Survey', '2026-03-07 15:00', 'Dr. Khalid Mansoor', '["email","dashboard"]', '["Mass drug administration (praziquantel)","Snail control in canals","Health education campaign","Re-survey in 6 months"]', 25000, 'Active Response', 0),
  ('ALT-2026-0053', 'Legionella in Hospital Cooling Tower', 'Legionella pneumophila serogroup 1 detected at >1000 CFU/L in Taif General Hospital cooling tower. Two HCWs with atypical pneumonia under investigation.', 2, 'amr_alert', 'Legionella pneumophila', 'Makkah - Taif', 64, 'confirmed', '2026-03-08 10:00', 'Environmental Health', '2026-03-08 12:00', 'Dr Majed', '["email","dashboard"]', '["Hyperchlorinate cooling tower","Screen respiratory cases","Urinary antigen testing","Review water management plan"]', 4000, 'Active Response', 0),
  ('ALT-2026-0054', 'XDR Acinetobacter Outbreak - Burns Unit', 'Five patients in KFMC burns unit positive for XDR A. baumannii carrying blaOXA-23 and blaNDM-1. Cohorting implemented. Only colistin sensitive.', 3, 'amr_alert', 'A. baumannii (XDR)', 'Riyadh - KFMC', 80, 'confirmed', '2026-03-08 18:00', 'Infection Control', '2026-03-08 20:00', 'Dr. Fatima Hassan', '["sms","email","dashboard"]', '["Patient cohorting","Dedicated nursing staff","Environmental deep clean","Restrict colistin to ID approval"]', 200, 'Active Response', 1);

-- ===== NEW GENOMIC SAMPLES (10 additional) =====
INSERT OR IGNORE INTO genomic_samples (sample_id, pathogen, lineage, platform, pipeline_status, coverage, amr_detected, amr_genes, quality, institution, date, read_length, total_reads, assembly_length, mutations, novel_mutations) VALUES
  ('BioR-2026-SA-0848', 'Vibrio cholerae O1', 'O1 El Tor Ogawa', 'Illumina NovaSeq', 'Completed', 132, 1, '["blaCTX-M-15","tetA","dfrA1"]', 'good', 'King Faisal Specialist Hospital', '2026-03-08', '2x250bp', '6.2M', '4.03 Mbp', 22, 1),
  ('BioR-2026-SA-0849', 'MERS-CoV', 'Clade B.1', 'Oxford Nanopore', 'Completed', 178, 0, '[]', 'good', 'Eastern Province Central Lab', '2026-03-08', 'Long-read', '2.1M', '30,119 bp', 11, 2),
  ('BioR-2026-SA-0850', 'Neisseria meningitidis', 'ST-11 cc', 'Illumina MiSeq', 'Completed', 105, 0, '[]', 'good', 'Riyadh Central Lab', '2026-03-08', '2x300bp', '3.8M', '2.27 Mbp', 8, 0),
  ('BioR-2026-SA-0851', 'SARS-CoV-2', 'KP.3.1.1', 'Illumina NovaSeq', 'Processing', 54, 0, '[]', 'acceptable', 'Jeddah Reference Lab', '2026-03-09', '2x150bp', '1.8M', 'In progress', 0, 0),
  ('BioR-2026-SA-0852', 'Brucella melitensis', 'biovar 1', 'Illumina MiSeq', 'Completed', 96, 0, '[]', 'good', 'Sakaka Health Center Lab', '2026-03-08', '2x300bp', '2.9M', '3.29 Mbp', 5, 0),
  ('BioR-2026-SA-0853', 'Influenza A', 'H5N1 2.3.4.4b', 'Illumina MiSeq', 'Processing', 42, 0, '[]', 'acceptable', 'Qassim Veterinary Lab', '2026-03-09', '2x150bp', '1.5M', 'In progress', 0, 0),
  ('BioR-2026-SA-0854', 'Legionella pneumophila', 'SG1 ST1', 'Illumina MiSeq', 'Completed', 118, 0, '[]', 'good', 'Taif General Hospital Lab', '2026-03-08', '2x300bp', '4.1M', '3.45 Mbp', 3, 0),
  ('BioR-2026-SA-0855', 'Dengue Virus', 'DENV-3 Genotype III', 'Illumina MiSeq', 'Completed', 112, 0, '[]', 'good', 'Jizan Health Center Lab', '2026-03-09', '2x150bp', '3.2M', '10,707 bp', 18, 1),
  ('BioR-2026-SA-0856', 'Clostridioides difficile', 'RT027/ST1', 'Illumina NovaSeq', 'Completed', 88, 1, '["ermB","tetM"]', 'good', 'King Abdullah Medical City Lab', '2026-03-07', '2x250bp', '4.8M', '4.29 Mbp', 0, 0),
  ('BioR-2026-SA-0857', 'Plasmodium falciparum', 'K13-C580Y', 'Illumina MiSeq', 'Completed', 75, 1, '["K13-C580Y","pfcrt-76T"]', 'good', 'Jizan Malaria Lab', '2026-03-07', '2x150bp', '2.4M', '23.3 Mbp', 32, 3);

-- ===== NEW EWS SIGNALS (6 additional) =====
INSERT OR IGNORE INTO ews_signals (pathogen, region, type, score, description, time, source, action) VALUES
  ('Acute Watery Diarrhea', 'Qassim', 'statistical', 85, 'CUSUM statistic exceeded threshold (C=4.2, h=3.0) for acute watery diarrhea cases. 28 cases in last 7 days vs expected 12.', '2h ago', 'CUSUM Engine', 'Dispatch field investigation team to Qassim'),
  ('Dengue Virus', 'Makkah', 'ml', 72, 'LSTM model predicts 240% increase in dengue cases within 14 days based on climate, vector index, and historical patterns.', '4h ago', 'LSTM Model v2', 'Pre-position vector control resources'),
  ('Influenza A H5N1', 'National', 'osint', 78, 'ProMED report on H5N1 outbreaks in commercial poultry farms across Gulf states. One farm in Qassim confirmed.', '6h ago', 'AraBERT NLP (ProMED)', 'Activate One Health coordination with MEWA'),
  ('SARS-CoV-2', 'Riyadh', 'genomic', 65, 'Two independent samples carry convergent spike mutations L455S and F456L. Potential immune evasion. Functional characterization needed.', '8h ago', 'Phylogenetic Analysis', 'Share sequences with GISAID, flag for WHO review'),
  ('Brucella melitensis', 'Al-Jouf', 'statistical', 82, 'Case count (12) exceeds Farrington 99th percentile threshold (7.3) for Al-Jouf in current 2-week window.', '12h ago', 'Farrington Algorithm', 'Investigate dairy farm sources in Al-Jouf'),
  ('Foodborne illness', 'Riyadh', 'osint', 58, 'Spike in Arabic social media posts mentioning food poisoning in central Riyadh. 47 posts in 6 hours vs baseline 8.', '1h ago', 'Social Media NLP', 'Alert SFDA for restaurant inspections');

-- ===== NEW EWS REGIONAL RISKS (update existing) =====
INSERT OR REPLACE INTO ews_regional_risks (region, score, trend, change, top_threat) VALUES
  ('Riyadh', 72, 'rising', '+8', 'Cholera O1 Cluster + CRE'),
  ('Makkah', 68, 'rising', '+12', 'Dengue Surge + Norovirus'),
  ('Eastern', 76, 'rising', '+15', 'MERS-CoV + Unexplained Pneumonia'),
  ('Madinah', 45, 'falling', '-5', 'SARS-CoV-2 JN.1 Declining'),
  ('Jizan', 64, 'rising', '+10', 'Dengue + RVF + Malaria'),
  ('Asir', 48, 'rising', '+6', 'Schistosomiasis Resurgence'),
  ('Tabuk', 52, 'stable', '+2', 'CCHF Border Cases'),
  ('Qassim', 65, 'rising', '+18', 'H5N1 Avian Flu + AWD Spike'),
  ('Northern', 44, 'rising', '+8', 'Suspected Anthrax'),
  ('Najran', 32, 'stable', '0', 'RVF Monitoring'),
  ('Hail', 28, 'stable', '0', 'No Active Threats'),
  ('Al-Baha', 25, 'stable', '0', 'Routine Surveillance'),
  ('Al-Jouf', 55, 'rising', '+12', 'Brucellosis Exceedance');

-- ===== NEW EWS OSINT FEED (6 additional) =====
INSERT OR IGNORE INTO ews_osint_feed (title, source, date, relevance, language, sentiment, entities) VALUES
  ('H5N1 HPAI - Gulf States: Poultry Farm Outbreaks', 'ProMED', '2026-03-09', 92, 'English', 'negative', '["H5N1","poultry","Qassim","Saudi Arabia","Gulf States"]'),
  ('MERS-CoV - Kingdom of Saudi Arabia: Hospital Cluster', 'WHO DON', '2026-03-08', 95, 'English', 'negative', '["MERS-CoV","nosocomial","Riyadh","healthcare workers"]'),
  ('Cholera Situation Update - MENA Region March 2026', 'ReliefWeb', '2026-03-08', 78, 'English', 'negative', '["cholera","MENA","Saudi Arabia","water sanitation"]'),
  ('Food Poisoning Reports Spike in Riyadh Restaurants', 'Twitter/X', '2026-03-09', 58, 'Arabic', 'negative', '["food poisoning","Riyadh","restaurants","gastroenteritis"]'),
  ('Rapid Risk Assessment: Dengue in Arabian Peninsula 2026', 'ECDC', '2026-03-07', 85, 'English', 'neutral', '["dengue","Arabian Peninsula","Aedes aegypti","vector control"]'),
  ('New SARS-CoV-2 Lineage KP.3.1.1 Detected in Saudi Arabia', 'GISAID', '2026-03-09', 72, 'English', 'neutral', '["SARS-CoV-2","KP.3.1.1","spike mutations","immune evasion"]');

-- ===== NEW NOTIFICATIONS (10 additional) =====
INSERT OR IGNORE INTO notifications (id, user_id, title, message, type, icon, link, is_read, created_at) VALUES
  ('notif-006', 'usr-001', 'Critical: H5N1 Confirmed in Qassim', 'Highly pathogenic avian influenza H5N1 confirmed at commercial poultry farm in Buraidah. One Health response activated.', 'alert', 'fa-biohazard', '/alerts', 0, '2026-03-09 09:00:00'),
  ('notif-007', 'usr-001', 'New User Created: Dr. Aisha Al-Qahtani', 'Lab Technician account (usr-004) created with Analyst role at National Reference Laboratory.', 'info', 'fa-user-plus', '/admin', 1, '2026-03-08 10:00:00'),
  ('notif-008', 'usr-001', 'EWS Alert: CUSUM Threshold Breached - Qassim', 'Acute watery diarrhea cases exceeded statistical threshold in Qassim region. 28 cases vs. expected 12.', 'warning', 'fa-chart-line', '/ews', 0, '2026-03-09 04:00:00'),
  ('notif-009', 'usr-002', 'Cholera Sitrep #4 Due', 'Weekly cholera situation report deadline is tomorrow. Current case count: 155. Please submit draft by 18:00.', 'system', 'fa-file-alt', '/reports', 0, '2026-03-09 08:00:00'),
  ('notif-010', 'usr-002', 'New Alert Assigned: Norovirus Outbreak', 'Norovirus outbreak (ALT-2026-0044) in Makkah worker camp assigned to your review queue.', 'alert', 'fa-exclamation-triangle', '/alerts', 0, '2026-03-09 08:30:00'),
  ('notif-011', 'usr-003', 'Sequence Complete: BioR-2026-SA-0849', 'MERS-CoV sample from Eastern Province completed assembly. Clade B.1 confirmed with 2 novel mutations.', 'success', 'fa-dna', '/genomics', 0, '2026-03-08 16:00:00'),
  ('notif-012', 'usr-003', 'AMR Alert: Artemisinin Resistance Detected', 'P. falciparum K13-C580Y mutation detected in Jizan sample (BioR-0857). First confirmed artemisinin resistance in KSA.', 'alert', 'fa-pills', '/genomics', 0, '2026-03-07 14:00:00'),
  ('notif-013', 'usr-004', 'Welcome to BioR Platform', 'Your account has been created. Please review the user guide and update your profile.', 'info', 'fa-hand-wave', '/profile', 0, '2026-03-08 10:05:00'),
  ('notif-014', 'usr-005', 'Field Investigation: Brucellosis - Al-Jouf', 'You have been assigned as lead investigator for the brucellosis cluster in Al-Jouf (12 cases). Travel authorization approved.', 'system', 'fa-map-marker-alt', '/surveillance', 0, '2026-03-08 15:00:00'),
  ('notif-015', 'usr-001', 'Security: Failed Login Attempts', '8 failed login attempts detected from IP 185.220.101.x in the last hour. Rate limiting active.', 'warning', 'fa-shield-alt', '/admin', 0, '2026-03-09 03:00:00');

-- ===== NEW AMR HEATMAP DATA (12 additional entries for new pathogens) =====
INSERT OR IGNORE INTO amr_heatmap (pathogen, antibiotic, resistance_pct) VALUES
  ('Neisseria meningitidis', 'Penicillin', 15),
  ('Neisseria meningitidis', 'Ciprofloxacin', 8),
  ('Neisseria meningitidis', 'Ceftriaxone', 0),
  ('Legionella pneumophila', 'Azithromycin', 0),
  ('Legionella pneumophila', 'Levofloxacin', 2),
  ('Brucella melitensis', 'Doxycycline', 0),
  ('Brucella melitensis', 'Rifampin', 3),
  ('Brucella melitensis', 'Streptomycin', 12),
  ('Clostridioides difficile', 'Vancomycin', 0),
  ('Clostridioides difficile', 'Metronidazole', 18),
  ('Clostridioides difficile', 'Fidaxomicin', 0),
  ('Plasmodium falciparum', 'Artemisinin', 4);

-- ===== ADDITIONAL AUDIT LOG ENTRIES (15 new entries) =====
INSERT OR IGNORE INTO audit_log (id, timestamp, user, action, resource, details, ip, tier) VALUES
  ('AUD-013', '2026-03-09 09:15:00', 'Dr Majed', 'Alert Created', 'ALT-2026-0050', 'H5N1 avian influenza alert escalated to Critical', '10.0.1.45', 4),
  ('AUD-014', '2026-03-09 08:30:00', 'Dr. Fatima Hassan', 'Alert Review', 'ALT-2026-0044', 'Norovirus outbreak alert reviewed and confirmed', '10.0.2.12', 3),
  ('AUD-015', '2026-03-09 07:00:00', 'System (EWS)', 'Signal Generated', 'ews-sig-011', 'OSINT: ProMED H5N1 article processed', 'system', 0),
  ('AUD-016', '2026-03-09 06:00:00', 'System (ML)', 'Signal Generated', 'ews-sig-010', 'LSTM dengue forecast for Makkah region', 'system', 0),
  ('AUD-017', '2026-03-09 04:00:00', 'System (EWS)', 'Signal Generated', 'ews-sig-009', 'CUSUM threshold breached for AWD in Qassim', 'system', 0),
  ('AUD-018', '2026-03-08 18:30:00', 'Dr. Aisha Al-Qahtani', 'Sequence Submitted', 'BioR-2026-SA-0848', 'V. cholerae sample submitted from KFSH', '10.0.3.100', 3),
  ('AUD-019', '2026-03-08 16:00:00', 'System (Genomics)', 'Sequence Completed', 'BioR-2026-SA-0849', 'MERS-CoV assembly completed - 2 novel mutations', 'system', 0),
  ('AUD-020', '2026-03-08 15:00:00', 'Dr Majed', 'User Created', 'usr-004', 'Created account for Dr. Aisha Al-Qahtani (Analyst)', '10.0.1.45', 4),
  ('AUD-021', '2026-03-08 14:30:00', 'Dr. Sami Al-Rashidi', 'Surveillance Update', 's12', 'Updated Jizan Health Directorate dengue case count', '10.0.4.22', 3),
  ('AUD-022', '2026-03-08 12:00:00', 'Dr. Khalid Mansoor', 'Report Viewed', 'RPT-W10', 'Accessed National Epi Bulletin W10', '10.0.3.88', 2),
  ('AUD-023', '2026-03-08 10:30:00', 'System (OSINT)', 'Signal Detected', 'osint-008', 'WHO DON: MERS-CoV hospital cluster article processed', 'system', 0),
  ('AUD-024', '2026-03-08 09:00:00', 'Dr Majed', 'Security Config', 'rate_limit', 'Updated global rate limit from 100 to 120 req/min', '10.0.1.45', 4),
  ('AUD-025', '2026-03-07 20:00:00', 'Dr. Fatima Hassan', 'Alert Escalated', 'ALT-2026-0054', 'XDR Acinetobacter outbreak escalated to Critical', '10.0.2.12', 3),
  ('AUD-026', '2026-03-07 16:30:00', 'System (Genomics)', 'AMR Alert', 'BioR-2026-SA-0857', 'Artemisinin-resistant P. falciparum detected - K13-C580Y', 'system', 0),
  ('AUD-027', '2026-03-07 12:00:00', 'Dr Majed', 'Data Export', 'export-surveillance', 'Exported all surveillance sites as CSV', '10.0.1.45', 4);

-- ===== UPDATE DASHBOARD METRICS (higher numbers reflecting enriched data) =====
UPDATE dashboard_metrics SET metric_value = '{"activeCases":1582,"sitesMonitored":24,"genomicSequences":882,"sequencesProcessed":768,"activeAlerts":20,"criticalAlerts":5,"threatLevel":68,"pendingReview":8,"dataQualityAvg":84}'
WHERE metric_key = 'summary';

UPDATE dashboard_metrics SET metric_value = '{"statistical":52,"ml":45,"osint":62,"genomic":35,"composite":68}'
WHERE metric_key = 'ews_scores';

UPDATE dashboard_metrics SET metric_value = '{"cases":[980,1020,1050,1080,1040,1100,1120,1090,1150,1180,1200,1320,1450,1582],"sites":[22,22,23,23,23,24,24,24,24,24,24,24,24,24],"sequences":[620,640,660,690,710,720,740,760,780,800,820,835,860,882],"alerts":[5,6,5,4,5,7,8,7,6,8,12,15,18,20]}'
WHERE metric_key = 'sparklines';

UPDATE dashboard_metrics SET metric_value = '[{"type":"alert","message":"Critical: H5N1 avian influenza confirmed at Qassim poultry farm - One Health response activated","time":"2 min ago","icon":"fa-biohazard","severity":"critical"},{"type":"alert","message":"Critical: 3 unexplained pneumonia deaths at Dammam Central Hospital ICU - metagenomic sequencing initiated","time":"15 min ago","icon":"fa-lungs","severity":"critical"},{"type":"genomic","message":"Sequence BioR-2026-SA-0849 completed - MERS-CoV Clade B.1 with 2 novel spike mutations","time":"32 min ago","icon":"fa-dna","severity":"warning"},{"type":"alert","message":"High: Norovirus outbreak in Makkah worker camp - 45 cases confirmed","time":"1h ago","icon":"fa-virus","severity":"warning"},{"type":"case","message":"22 new case reports ingested from King Fahad Medical City LIMS","time":"1.5h ago","icon":"fa-file-medical","severity":"info"},{"type":"genomic","message":"AMR Alert: Artemisinin-resistant P. falciparum detected in Jizan - first in KSA","time":"2h ago","icon":"fa-pills","severity":"critical"},{"type":"alert","message":"Warning: ESBL E. coli detected in Jubail desalination plant water supply","time":"3h ago","icon":"fa-water","severity":"warning"},{"type":"case","message":"Weekly aggregate complete: Epi Week 2026-W10, 425 confirmed cases nationwide","time":"4h ago","icon":"fa-chart-bar","severity":"info"},{"type":"alert","message":"EWS: CUSUM threshold breached for acute watery diarrhea in Qassim Region","time":"5h ago","icon":"fa-chart-line","severity":"warning"},{"type":"system","message":"OSINT: WHO Disease Outbreak News - MERS-CoV hospital cluster in Saudi Arabia","time":"6h ago","icon":"fa-newspaper","severity":"warning"}]'
WHERE metric_key = 'recent_activity';

UPDATE dashboard_metrics SET metric_value = '[{"name":"SARS-CoV-2","cases":487,"trend":"falling","severity":"medium","percent":65,"weekChange":-12,"lineage":"BA.2.86 / JN.1 / KP.3.1.1"},{"name":"Vibrio cholerae O1","cases":155,"trend":"rising","severity":"critical","percent":88,"weekChange":28,"lineage":"O1 El Tor Ogawa"},{"name":"Dengue Virus","cases":198,"trend":"rising","severity":"high","percent":62,"weekChange":42,"lineage":"DENV-2/3 Cosmopolitan"},{"name":"Mycobacterium tuberculosis","cases":201,"trend":"stable","severity":"medium","percent":40,"weekChange":2,"lineage":"Lineage 4 (MDR)"},{"name":"Salmonella enterica","cases":94,"trend":"falling","severity":"medium","percent":38,"weekChange":-8,"lineage":"ST313"},{"name":"MERS-CoV","cases":28,"trend":"rising","severity":"critical","percent":75,"weekChange":5,"lineage":"Clade B / B.1"},{"name":"Influenza A","cases":312,"trend":"falling","severity":"low","percent":25,"weekChange":-15,"lineage":"H3N2 + H5N1 (poultry)"},{"name":"Brucella melitensis","cases":18,"trend":"rising","severity":"medium","percent":45,"weekChange":12,"lineage":"biovar 1"}]'
WHERE metric_key = 'top_pathogens';

-- ===== UPDATE PIPELINE STAGES (higher numbers) =====
UPDATE pipeline_stages SET completed = 882, active = 2, failed = 0 WHERE name = 'Raw Upload';
UPDATE pipeline_stages SET completed = 868, active = 6, failed = 8 WHERE name = 'QC Check';
UPDATE pipeline_stages SET completed = 856, active = 10, failed = 2 WHERE name = 'Assembly';
UPDATE pipeline_stages SET completed = 845, active = 14, failed = 1 WHERE name = 'Classification';
UPDATE pipeline_stages SET completed = 840, active = 5, failed = 0 WHERE name = 'AMR Scan';
UPDATE pipeline_stages SET completed = 768, active = 82, failed = 0 WHERE name = 'Phylogenetics';

-- ===== NEW THREATS (8 additional to match enriched alerts) =====
INSERT OR IGNORE INTO threats (id, name, pathogen, icd11, severity, cases, deaths, cfr, regions, containment, detected, risk_score, lab_confirmed, genomic_cluster_id, trend, weekly_change, ih_reportable, response_teams, water_sources, timeline) VALUES
  ('t11', 'H5N1 Avian Influenza - Qassim', 'Influenza A H5N1', '1E32', 'Critical', 3, 0, 0, '["Qassim"]', 25, '2026-03-09', 82, 0, NULL, 'rising', '+3', 1, 2, 0, '[{"date":"Mar 9","event":"HPAI H5N1 confirmed in commercial poultry farm - 2,000 birds culled","type":"detection"},{"date":"Mar 9","event":"Three farm workers placed under 10-day monitoring","type":"response"},{"date":"Mar 9","event":"Oseltamivir prophylaxis administered, PPE distributed","type":"response"},{"date":"Mar 9","event":"10km surveillance zone established around Buraidah farm","type":"response"}]'),
  ('t12', 'Norovirus Outbreak - Makkah Workers', 'Norovirus GII.4', '1A23', 'Medium', 45, 0, 0, '["Makkah"]', 55, '2026-03-09', 58, 12, NULL, 'rising', '+45', 0, 1, 0, '[{"date":"Mar 9","event":"Cluster of 45 gastroenteritis cases in temporary worker housing","type":"detection"},{"date":"Mar 9","event":"Norovirus GII.4 confirmed by rapid antigen test","type":"confirmation"},{"date":"Mar 9","event":"Environmental decontamination initiated","type":"response"}]'),
  ('t13', 'ESBL E. coli - Jubail Water', 'E. coli (ESBL)', '1C12', 'High', 8, 0, 0, '["Eastern"]', 40, '2026-03-09', 76, 8, 'ESBL-2026-SA-001', 'rising', '+8', 0, 2, 3, '[{"date":"Mar 9","event":"ESBL-producing E. coli detected in desalination plant output","type":"detection"},{"date":"Mar 9","event":"blaCTX-M-15 gene confirmed by PCR","type":"confirmation"},{"date":"Mar 9","event":"Emergency chlorination protocol activated","type":"response"},{"date":"Mar 9","event":"Water authority notified, upstream sampling initiated","type":"response"}]'),
  ('t14', 'Measles Cluster - Riyadh School', 'Measles Virus', '1F03', 'Medium', 7, 0, 0, '["Riyadh"]', 60, '2026-03-08', 55, 7, NULL, 'stable', '+3', 0, 1, 0, '[{"date":"Mar 8","event":"Seven confirmed measles cases among unvaccinated children","type":"detection"},{"date":"Mar 8","event":"Al-Fayha Elementary School identified as source","type":"confirmation"},{"date":"Mar 8","event":"Ring vaccination campaign for 400 students initiated","type":"response"}]'),
  ('t15', 'Unexplained Pneumonia - Dammam ICU', 'Unknown', 'CA40', 'Critical', 5, 3, 60.0, '["Eastern"]', 15, '2026-03-09', 88, 0, NULL, 'rising', '+5', 1, 3, 0, '[{"date":"Mar 9","event":"Three unexplained pneumonia deaths in 48 hours at Dammam Central ICU","type":"detection"},{"date":"Mar 9","event":"No common pathogen identified by standard panels","type":"detection"},{"date":"Mar 9","event":"BAL samples sent for urgent metagenomic sequencing","type":"response"},{"date":"Mar 9","event":"Enhanced IPC protocols activated, MOH leadership notified","type":"escalation"}]'),
  ('t16', 'Brucellosis Cluster - Al-Jouf', 'Brucella melitensis', '1C17', 'Medium', 12, 0, 0, '["Al-Jouf"]', 50, '2026-03-08', 48, 8, NULL, 'rising', '+12', 0, 1, 0, '[{"date":"Mar 8","event":"12 brucellosis cases in 2 weeks, triple seasonal average","type":"detection"},{"date":"Mar 8","event":"Linked to unpasteurized dairy from local farms","type":"confirmation"},{"date":"Mar 8","event":"Dairy farm inspections initiated, MEWA coordinated","type":"response"}]'),
  ('t17', 'XDR A. baumannii - Burns Unit', 'Acinetobacter baumannii (XDR)', '1C12', 'High', 5, 1, 20.0, '["Riyadh"]', 45, '2026-03-08', 78, 5, 'XDR-AB-2026-001', 'rising', '+3', 0, 1, 0, '[{"date":"Mar 8","event":"Five patients positive for XDR A. baumannii in KFMC burns unit","type":"detection"},{"date":"Mar 8","event":"blaOXA-23 and blaNDM-1 resistance genes confirmed","type":"confirmation"},{"date":"Mar 8","event":"Patient cohorting and dedicated nursing staff implemented","type":"response"},{"date":"Mar 8","event":"Environmental deep clean, colistin restricted to ID approval","type":"response"}]'),
  ('t18', 'Schistosomiasis - Asir Resurgence', 'Schistosoma mansoni', '1G43', 'Low', 45, 0, 0, '["Asir"]', 65, '2026-03-07', 42, 28, NULL, 'rising', '+8', 0, 1, 0, '[{"date":"Mar 7","event":"Prevalence survey: 8.2% S. mansoni positivity (up from 1.5% in 2024)","type":"detection"},{"date":"Mar 7","event":"Linked to irrigation canal exposure in mountain villages","type":"confirmation"},{"date":"Mar 7","event":"Mass drug administration (praziquantel) scheduled","type":"response"},{"date":"Mar 7","event":"Snail control in canals initiated","type":"response"}]');

-- ===== NEW SURVEILLANCE SITES (12 additional to bring total to 36) =====
INSERT OR IGNORE INTO surveillance_sites (id, name, type, region, status, last_report, dq_score, lat, lng, cases_this_week, samples_submitted, contact_person, phone, capacity, pathogens) VALUES
  ('s25', 'Qassim Veterinary Lab', 'Sentinel', 'Qassim', 'Alert', '2026-03-09', 82, 26.3260, 43.9750, 3, 8, 'Dr. Omar Al-Tamimi', '+966-16-384-XXXX', 'BSL-3 facility, 200 samples/week', '["Influenza A","Brucella","CCHF","Anthrax","RVF"]'),
  ('s26', 'Jubail Desalination Monitoring', 'Environment', 'Eastern', 'Alert', '2026-03-09', 74, 27.0046, 49.6603, 8, 15, 'Eng. Faisal Al-Dossary', '+966-13-341-XXXX', 'Continuous monitoring, 500 samples/week', '["E. coli","Legionella","Vibrio","Cryptosporidium"]'),
  ('s27', 'Al-Fayha School Health Unit', 'Sentinel', 'Riyadh', 'Active', '2026-03-08', 68, 24.6877, 46.7219, 7, 12, 'Dr. Huda Al-Shammari', '+966-11-445-XXXX', 'School-based surveillance, 50 tests/week', '["Measles","Influenza","Varicella","Pertussis"]'),
  ('s28', 'Makkah Industrial Zone Camp', 'Sentinel', 'Makkah', 'Alert', '2026-03-09', 72, 21.4225, 39.8262, 45, 22, 'Dr. Yasser Al-Ghamdi', '+966-12-568-XXXX', 'Worker camp clinic, 300 visits/week', '["Norovirus","Hepatitis A","Salmonella","Cholera"]'),
  ('s29', 'Dammam Central Hospital ICU', 'Hospital', 'Eastern', 'Alert', '2026-03-09', 90, 26.4322, 50.1141, 14, 35, 'Dr. Nadia Al-Rasheed', '+966-13-842-XXXX', 'Tertiary ICU, 80 beds, BSL-2 lab', '["MERS-CoV","Influenza","CRE","A. baumannii","Legionella"]'),
  ('s30', 'Sakaka Regional Health Center', 'Hospital', 'Al-Jouf', 'Active', '2026-03-08', 78, 29.9697, 40.2064, 12, 18, 'Dr. Khalid Al-Anazi', '+966-14-625-XXXX', 'Regional hospital, 200 beds', '["Brucella","Leishmaniasis","TB","Hepatitis B"]'),
  ('s31', 'Taif General Hospital', 'Hospital', 'Makkah', 'Active', '2026-03-08', 85, 21.2703, 40.4158, 6, 14, 'Dr. Amina Al-Zahrani', '+966-12-736-XXXX', 'General hospital, 350 beds, cooling tower monitoring', '["Legionella","MERS-CoV","Dengue","TB"]'),
  ('s32', 'Al-Soudah Mountain Clinic', 'Sentinel', 'Asir', 'Active', '2026-03-07', 65, 18.2482, 42.4295, 8, 6, 'Dr. Ibrahim Al-Shahri', '+966-17-225-XXXX', 'Rural clinic, 20 beds, NTD surveillance', '["Schistosomiasis","Malaria","Leishmaniasis"]'),
  ('s33', 'Arar Border Health Post', 'Border', 'Northern Borders', 'Active', '2026-03-09', 80, 30.9754, 41.0381, 2, 4, 'Dr. Mohammed Al-Shamri', '+966-14-662-XXXX', 'Border crossing, 500 screenings/day', '["Anthrax","Brucella","CCHF","Cholera","TB"]'),
  ('s34', 'KFMC Burns Unit', 'Hospital', 'Riyadh', 'Alert', '2026-03-08', 92, 24.6241, 46.7116, 5, 28, 'Dr. Sara Al-Otaibi', '+966-11-288-XXXX', 'Specialist burns unit, 30 beds, BSL-2 lab', '["A. baumannii","MRSA","Pseudomonas","CRE"]'),
  ('s35', 'Jizan Malaria Control Center', 'Sentinel', 'Jizan', 'Active', '2026-03-07', 88, 16.8892, 42.5511, 11, 19, 'Dr. Ali Al-Malki', '+966-17-322-XXXX', 'Malaria + vector surveillance, 400 tests/week', '["Plasmodium","Dengue","RVF","Chikungunya"]'),
  ('s36', 'Buraidah Poultry Farm Zone', 'Environment', 'Qassim', 'Alert', '2026-03-09', 70, 26.3566, 43.9768, 0, 12, 'Dr. Tariq Al-Mutairi', '+966-16-382-XXXX', 'Avian surveillance, environmental sampling', '["Influenza A","Newcastle Disease","Salmonella"]');

-- ===== UPDATE DASHBOARD METRICS (reflecting 18 threats and 36 sites) =====
UPDATE dashboard_metrics SET metric_value = '{"activeCases":1724,"sitesMonitored":36,"genomicSequences":882,"sequencesProcessed":768,"activeAlerts":20,"criticalAlerts":5,"threatLevel":72,"pendingReview":8,"dataQualityAvg":82}'
WHERE metric_key = 'summary';

UPDATE dashboard_metrics SET metric_value = '{"statistical":58,"ml":52,"osint":68,"genomic":42,"composite":72}'
WHERE metric_key = 'ews_scores';

UPDATE dashboard_metrics SET metric_value = '{"cases":[980,1020,1050,1080,1040,1100,1120,1090,1150,1180,1200,1320,1450,1724],"sites":[22,22,23,24,26,28,30,32,33,34,35,36,36,36],"sequences":[620,640,660,690,710,720,740,760,780,800,820,835,860,882],"alerts":[5,6,5,4,5,7,8,7,6,8,12,15,18,20]}'
WHERE metric_key = 'sparklines';
