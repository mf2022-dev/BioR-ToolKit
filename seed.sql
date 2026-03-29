-- =============================================================================
-- BioR Platform - Seed Data
-- All current mock data migrated to D1
-- =============================================================================

-- ===== USERS =====
-- Passwords are PBKDF2-SHA256 hashed (will be generated at runtime on first seed)
-- Placeholder hashes below are replaced by the seed API endpoint
INSERT OR IGNORE INTO users (id, username, password_hash, name, role, full_role, institution, tier, avatar, email) VALUES
  ('usr-001', 'admin', '__HASH_BioR2026!__', 'Dr Majed', 'Admin', 'National Epidemiologist', 'BioR National Operations Center', 4, 'M', 'majed@bior.tech'),
  ('usr-002', 'analyst', '__HASH_Analyst2026!__', 'Dr. Fatima Hassan', 'Analyst', 'Regional Epidemiologist', 'Central Region Health Directorate', 3, 'FH', 'fatima@bior.tech'),
  ('usr-003', 'viewer', '__HASH_Viewer2026!__', 'Dr. Khalid Mansoor', 'Viewer', 'Senior Bioinformatician', 'National Reference Laboratory', 2, 'KM', 'khalid@bior.tech');

-- ===== SURVEILLANCE SITES =====
INSERT OR IGNORE INTO surveillance_sites (id, name, type, region, status, last_report, dq_score, lat, lng, cases_this_week, samples_submitted, contact_person, phone, capacity, pathogens) VALUES
  ('s01', 'King Fahad Medical City', 'Hospital', 'Riyadh', 'Active', '2026-03-08 09:15', 94, 24.69, 46.72, 45, 12, 'Dr. Saleh Al-Dosary', '+966-11-288-9999', 'Level 3 BSL', '["SARS-CoV-2","MERS-CoV","TB"]'),
  ('s02', 'King Faisal Specialist Hospital', 'Hospital', 'Riyadh', 'Active', '2026-03-08 08:30', 97, 24.67, 46.68, 38, 18, 'Dr. Noura Al-Salem', '+966-11-464-7272', 'Level 3 BSL', '["All Priority"]'),
  ('s03', 'Riyadh International Airport', 'Airport', 'Riyadh', 'Active', '2026-03-08 10:00', 88, 24.96, 46.70, 12, 5, 'Dr. Faisal Al-Otaibi', '+966-11-221-1111', 'Screening Point', '["SARS-CoV-2","Influenza"]'),
  ('s04', 'Jeddah King Abdulaziz Airport', 'Airport', 'Makkah', 'Active', '2026-03-08 07:45', 91, 21.67, 39.16, 18, 8, 'Dr. Hassan Al-Ghamdi', '+966-12-685-4444', 'Screening Point', '["SARS-CoV-2","Cholera","MERS-CoV"]'),
  ('s05', 'Jeddah Port Authority', 'Border', 'Makkah', 'Alert', '2026-03-08 06:20', 82, 21.48, 39.18, 32, 14, 'Dr. Ibrahim Al-Harbi', '+966-12-647-2222', 'Level 2 BSL', '["Cholera","Dengue"]'),
  ('s06', 'King Abdullah Medical City', 'Hospital', 'Makkah', 'Active', '2026-03-08 09:45', 90, 21.42, 39.82, 28, 9, 'Dr. Layla Al-Shehri', '+966-12-556-3333', 'Level 3 BSL', '["SARS-CoV-2","MERS-CoV","Dengue"]'),
  ('s07', 'Dammam Wastewater Treatment', 'Wastewater', 'Eastern', 'Active', '2026-03-08 05:00', 85, 26.43, 50.10, 0, 4, 'Eng. Mohammed Al-Dawsari', '+966-13-826-5555', 'Environmental', '["Poliovirus","SARS-CoV-2","Norovirus"]'),
  ('s08', 'Dhahran Environment Station', 'Environment', 'Eastern', 'Active', '2026-03-08 04:30', 79, 26.27, 50.21, 0, 2, 'Dr. Ali Al-Qahtani', '+966-13-891-6666', 'Environmental', '["Vector Surveillance"]'),
  ('s09', 'Madinah General Hospital', 'Hospital', 'Madinah', 'Active', '2026-03-08 08:15', 92, 24.47, 39.61, 22, 7, 'Dr. Yousuf Al-Madani', '+966-14-847-7777', 'Level 2 BSL', '["TB","SARS-CoV-2","Salmonella"]'),
  ('s10', 'Tabuk Northern Border Post', 'Border', 'Tabuk', 'Active', '2026-03-08 07:00', 76, 28.38, 36.57, 5, 2, 'Dr. Nasser Al-Enezi', '+966-14-422-8888', 'Screening Point', '["CCHF","Brucella"]'),
  ('s11', 'Abha Regional Laboratory', 'Hospital', 'Asir', 'Offline', '2026-03-07 23:50', 68, 18.22, 42.50, 15, 0, 'Dr. Saeed Al-Asiri', '+966-17-226-9999', 'Level 2 BSL', '["Dengue","Malaria"]'),
  ('s12', 'Jizan Health Directorate', 'Hospital', 'Jizan', 'Alert', '2026-03-08 09:30', 74, 16.89, 42.55, 41, 11, 'Dr. Ahmad Al-Fifi', '+966-17-322-1010', 'Level 2 BSL', '["Dengue","RVF","Malaria"]'),
  ('s13', 'Najran Sentinel Surveillance', 'Sentinel', 'Najran', 'Active', '2026-03-08 06:00', 83, 17.49, 44.13, 8, 3, 'Dr. Saad Al-Yami', '+966-17-542-1111', 'Screening Point', '["RVF","Dengue"]'),
  ('s14', 'Hail Wastewater Facility', 'Wastewater', 'Hail', 'Active', '2026-03-08 04:00', 87, 27.52, 41.69, 0, 3, 'Eng. Abdullah Al-Shammari', '+966-16-532-1212', 'Environmental', '["Poliovirus","SARS-CoV-2"]'),
  ('s15', 'Qassim Central Hospital', 'Hospital', 'Qassim', 'Active', '2026-03-08 08:00', 89, 26.33, 43.97, 19, 6, 'Dr. Omar Al-Mutairi', '+966-16-383-1313', 'Level 2 BSL', '["SARS-CoV-2","Salmonella","TB"]'),
  ('s16', 'Yanbu Industrial Env. Monitor', 'Environment', 'Madinah', 'Active', '2026-03-08 03:15', 81, 24.09, 38.06, 0, 2, 'Eng. Tariq Al-Johani', '+966-14-396-1414', 'Environmental', '["Water Quality"]'),
  ('s17', 'Jubail Industrial Health', 'Environment', 'Eastern', 'Active', '2026-03-08 07:30', 86, 27.01, 49.66, 3, 2, 'Dr. Majed Al-Harbi', '+966-13-341-1515', 'Level 1 BSL', '["Environmental"]'),
  ('s18', 'Taif General Hospital', 'Hospital', 'Makkah', 'Active', '2026-03-08 09:00', 88, 21.27, 40.42, 14, 4, 'Dr. Khaled Al-Thubaiti', '+966-12-736-1616', 'Level 2 BSL', '["SARS-CoV-2","Dengue"]'),
  ('s19', 'Hofuf King Fahd Hospital', 'Hospital', 'Eastern', 'Active', '2026-03-08 08:45', 91, 25.38, 49.59, 11, 5, 'Dr. Sultan Al-Dosari', '+966-13-587-1717', 'Level 2 BSL', '["MERS-CoV","SARS-CoV-2"]'),
  ('s20', 'Arar Border Crossing', 'Border', 'Northern', 'Active', '2026-03-08 06:30', 73, 30.97, 41.02, 2, 1, 'Dr. Abdulrahman Al-Anzi', '+966-16-662-1818', 'Screening Point', '["Brucella","CCHF"]'),
  ('s21', 'Baha Regional Center', 'Sentinel', 'Al-Baha', 'Active', '2026-03-08 07:15', 80, 20.00, 41.47, 6, 2, 'Dr. Fahad Al-Zahrani', '+966-17-725-1919', 'Screening Point', '["Dengue","Leishmaniasis"]'),
  ('s22', 'Sakaka Health Center', 'Sentinel', 'Al-Jouf', 'Active', '2026-03-08 05:45', 77, 29.97, 40.21, 4, 1, 'Dr. Mansour Al-Ruwaili', '+966-14-625-2020', 'Screening Point', '["Brucella","Leishmaniasis"]'),
  ('s23', 'Khamis Mushait Military Hospital', 'Hospital', 'Asir', 'Active', '2026-03-08 08:30', 93, 18.31, 42.73, 17, 6, 'Dr. Turki Al-Qahtani', '+966-17-250-2121', 'Level 3 BSL', '["All Priority"]'),
  ('s24', 'NEOM Health Hub', 'Environment', 'Tabuk', 'Active', '2026-03-08 10:15', 95, 27.95, 35.30, 1, 2, 'Dr. Waleed Al-Balawi', '+966-14-441-2222', 'Level 3 BSL', '["Environmental","Vector"]');

-- ===== THREATS =====
INSERT OR IGNORE INTO threats (id, name, pathogen, icd11, severity, cases, deaths, cfr, regions, containment, detected, risk_score, lab_confirmed, genomic_cluster_id, trend, weekly_change, ih_reportable, response_teams, water_sources, timeline) VALUES
  ('t01', 'Cholera Outbreak - Central District', 'Vibrio cholerae O1', '1A00', 'Critical', 127, 3, 2.4, '["Riyadh","Qassim"]', 35, '2026-03-01', 82, 48, 'CHOL-2026-SA-001', 'rising', '+34', 1, 3, 2, '[{"date":"Mar 1","event":"First case detected","type":"detection"},{"date":"Mar 3","event":"Cluster confirmed (5 cases)","type":"confirmation"},{"date":"Mar 5","event":"Level 2 alert issued","type":"alert"},{"date":"Mar 6","event":"WASH team deployed","type":"response"},{"date":"Mar 8","event":"48 lab-confirmed, upgraded to Level 3","type":"escalation"}]'),
  ('t02', 'MERS-CoV Resurgence', 'MERS-CoV', '1D64', 'Critical', 23, 4, 17.4, '["Eastern","Riyadh"]', 55, '2026-02-15', 78, 23, 'MERS-2026-SA-004', 'rising', '+8', 1, 2, 0, '[{"date":"Feb 15","event":"Index case - camel handler","type":"detection"},{"date":"Feb 18","event":"2nd case - HCW","type":"detection"},{"date":"Feb 22","event":"Nosocomial cluster confirmed","type":"confirmation"},{"date":"Mar 1","event":"IPC protocols activated","type":"response"},{"date":"Mar 7","event":"3 new HCW cases","type":"escalation"}]'),
  ('t03', 'Dengue Surge - Western Region', 'Dengue Virus', '1D20', 'High', 156, 1, 0.6, '["Makkah","Jizan","Asir"]', 45, '2026-02-20', 68, 89, NULL, 'rising', '+18', 0, 4, 0, '[{"date":"Feb 20","event":"Seasonal increase noted","type":"detection"},{"date":"Feb 28","event":"DENV-2 genotype confirmed","type":"confirmation"},{"date":"Mar 3","event":"Vector control initiated","type":"response"},{"date":"Mar 8","event":"156 total cases","type":"escalation"}]'),
  ('t04', 'MDR TB Cluster - Riyadh', 'Mycobacterium tuberculosis', '1B10', 'High', 34, 2, 5.9, '["Riyadh"]', 60, '2026-01-15', 62, 34, 'TB-2026-SA-012', 'stable', '+2', 0, 1, 0, '[{"date":"Jan 15","event":"MDR-TB cluster identified","type":"detection"},{"date":"Jan 25","event":"rpoB mutation confirmed","type":"confirmation"},{"date":"Feb 5","event":"Contact tracing initiated","type":"response"},{"date":"Mar 1","event":"34 genomically linked cases","type":"escalation"}]'),
  ('t05', 'Salmonella - Food Chain', 'Salmonella enterica', '1A03', 'Medium', 94, 0, 0, '["Riyadh","Makkah","Madinah"]', 70, '2026-02-28', 48, 67, 'SAL-2026-SA-007', 'falling', '-3', 0, 2, 0, '[{"date":"Feb 28","event":"Multi-site outbreak detected","type":"detection"},{"date":"Mar 2","event":"ST313 confirmed","type":"confirmation"},{"date":"Mar 4","event":"Food chain investigation","type":"response"}]'),
  ('t06', 'COVID-19 JN.1 Wave', 'SARS-CoV-2', 'RA01', 'Medium', 487, 8, 1.6, '["National"]', 80, '2026-01-01', 42, 312, NULL, 'falling', '-12', 1, 0, 0, '[{"date":"Jan 1","event":"JN.1 detected nationally","type":"detection"},{"date":"Jan 15","event":"Peak wave","type":"escalation"},{"date":"Feb 15","event":"Declining trend confirmed","type":"response"}]'),
  ('t07', 'Crimean-Congo HF - Border', 'CCHF Virus', '1D60', 'High', 5, 1, 20.0, '["Tabuk","Northern"]', 75, '2026-03-05', 71, 5, NULL, 'stable', '+2', 1, 1, 0, '[{"date":"Mar 5","event":"First case at border post","type":"detection"},{"date":"Mar 6","event":"Lab confirmation","type":"confirmation"},{"date":"Mar 7","event":"Border screening enhanced","type":"response"}]'),
  ('t08', 'CRE Alert - Hospital', 'Klebsiella pneumoniae (CRE)', '1C12', 'Medium', 18, 3, 16.7, '["Riyadh"]', 65, '2026-02-10', 55, 18, 'CRE-2026-SA-003', 'stable', '+1', 0, 1, 0, '[{"date":"Feb 10","event":"XDR strain detected","type":"detection"},{"date":"Feb 15","event":"Genomic confirmation","type":"confirmation"},{"date":"Feb 20","event":"IPC enhanced","type":"response"}]'),
  ('t09', 'Rift Valley Fever Signal', 'RVF Virus', '1D63', 'Low', 2, 0, 0, '["Jizan","Najran"]', 90, '2026-03-06', 35, 1, NULL, 'stable', '0', 1, 1, 0, '[{"date":"Mar 6","event":"Suspected imported case","type":"detection"},{"date":"Mar 7","event":"1 lab confirmed","type":"confirmation"}]'),
  ('t10', 'Influenza A (H3N2) Season', 'Influenza A H3N2', '1E30', 'Low', 312, 5, 1.6, '["National"]', 85, '2026-01-10', 28, 145, NULL, 'falling', '-15', 0, 0, 0, '[{"date":"Jan 10","event":"Seasonal onset","type":"detection"},{"date":"Feb 1","event":"Peak season","type":"escalation"},{"date":"Mar 1","event":"Declining trend","type":"response"}]');

-- ===== GENOMIC SAMPLES =====
INSERT OR IGNORE INTO genomic_samples (sample_id, pathogen, lineage, platform, pipeline_status, coverage, amr_detected, amr_genes, quality, institution, date, read_length, total_reads, assembly_length, mutations, novel_mutations) VALUES
  ('BioR-2026-SA-0847', 'SARS-CoV-2', 'BA.2.86.4', 'Illumina MiSeq', 'Completed', 125, 0, '[]', 'good', 'King Faisal Specialist Hospital', '2026-03-07', '2x150bp', '2.4M', '29,903 bp', 42, 3),
  ('BioR-2026-SA-0846', 'Vibrio cholerae O1', 'O1 El Tor', 'Illumina NovaSeq', 'Completed', 89, 1, '["blaCTX-M-15","tetA"]', 'good', 'Riyadh Central Lab', '2026-03-07', '2x250bp', '5.1M', '4.03 Mbp', 18, 0),
  ('BioR-2026-SA-0845', 'MERS-CoV', 'Clade B', 'Oxford Nanopore', 'Completed', 156, 0, '[]', 'good', 'King Fahad Medical City', '2026-03-06', 'Long-read', '1.8M', '30,119 bp', 8, 1),
  ('BioR-2026-SA-0844', 'Klebsiella pneumoniae', 'ST258', 'Illumina MiSeq', 'Completed', 95, 1, '["blaKPC-3","blaNDM-1","mcr-1"]', 'good', 'Dammam Central Lab', '2026-03-06', '2x300bp', '3.2M', '5.67 Mbp', 0, 0),
  ('BioR-2026-SA-0843', 'Salmonella enterica', 'ST313', 'Illumina NovaSeq', 'Completed', 112, 1, '["blaCMY-2","qnrS1"]', 'good', 'Jeddah Reference Lab', '2026-03-06', '2x150bp', '4.5M', '4.87 Mbp', 12, 0),
  ('BioR-2026-SA-0842', 'Mycobacterium tuberculosis', 'Lineage 4.3.3', 'Illumina MiSeq', 'Processing', 78, 1, '["rpoB-S450L","katG-S315T"]', 'acceptable', 'King Fahad Medical City', '2026-03-05', '2x300bp', '2.1M', 'In progress', 0, 0),
  ('BioR-2026-SA-0841', 'SARS-CoV-2', 'JN.1.18.1', 'Oxford Nanopore', 'Processing', 67, 0, '[]', 'acceptable', 'Madinah Regional Lab', '2026-03-05', 'Long-read', '1.2M', 'In progress', 0, 0),
  ('BioR-2026-SA-0840', 'CCHF Virus', 'Asia-1', 'Illumina MiSeq', 'Completed', 145, 0, '[]', 'good', 'Tabuk Military Hospital', '2026-03-05', '2x150bp', '3.8M', '19,217 bp', 5, 2),
  ('BioR-2026-SA-0839', 'Dengue Virus', 'DENV-2 Cosmopolitan', 'Illumina MiSeq', 'Completed', 98, 0, '[]', 'good', 'Jizan Health Center', '2026-03-04', '2x150bp', '2.8M', '10,723 bp', 14, 0),
  ('BioR-2026-SA-0838', 'Vibrio cholerae O1', 'O1 El Tor', 'Illumina NovaSeq', 'Failed', 12, 0, '[]', 'failed', 'Qassim Central Lab', '2026-03-04', '2x250bp', '0.3M', 'N/A', 0, 0),
  ('BioR-2026-SA-0837', 'Influenza A', 'H3N2 3C.2a1b.2a.2', 'Illumina MiSeq', 'Completed', 88, 0, '[]', 'good', 'Riyadh Airport Lab', '2026-03-04', '2x150bp', '2.0M', '13,588 bp', 22, 1),
  ('BioR-2026-SA-0836', 'E. coli (ESBL)', 'ST131', 'Illumina MiSeq', 'Completed', 110, 1, '["blaCTX-M-27","aac(6)-Ib-cr"]', 'good', 'King Faisal Specialist Hospital', '2026-03-03', '2x300bp', '3.5M', '5.23 Mbp', 0, 0),
  ('BioR-2026-SA-0835', 'MERS-CoV', 'Clade B', 'Oxford Nanopore', 'Processing', 45, 0, '[]', 'acceptable', 'Eastern Province Lab', '2026-03-03', 'Long-read', '0.9M', 'In progress', 0, 0),
  ('BioR-2026-SA-0834', 'Acinetobacter baumannii', 'IC2/ST2', 'Illumina NovaSeq', 'Completed', 134, 1, '["blaOXA-23","armA","blaNDM-1"]', 'good', 'Riyadh Central Lab', '2026-03-03', '2x150bp', '4.2M', '3.98 Mbp', 0, 0),
  ('BioR-2026-SA-0833', 'SARS-CoV-2', 'BA.2.86.1', 'Illumina MiSeq', 'Failed', 8, 0, '[]', 'failed', 'Hail Regional Lab', '2026-03-02', '2x150bp', '0.2M', 'N/A', 0, 0);

-- ===== PIPELINE STAGES =====
INSERT OR IGNORE INTO pipeline_stages (name, icon, completed, active, failed) VALUES
  ('Raw Upload', 'fa-upload', 856, 0, 0),
  ('QC Check', 'fa-check-circle', 842, 4, 10),
  ('Assembly', 'fa-layer-group', 830, 8, 4),
  ('Classification', 'fa-tags', 820, 12, 2),
  ('AMR Scan', 'fa-pills', 815, 5, 0),
  ('Phylogenetics', 'fa-code-branch', 742, 73, 0);

-- ===== AMR HEATMAP =====
INSERT OR IGNORE INTO amr_heatmap (pathogen, antibiotic, resistance_pct) VALUES
  ('K. pneumoniae', 'Carbapenems', 85), ('K. pneumoniae', 'Cephalosporins', 92), ('K. pneumoniae', 'Fluoroquinolones', 45), ('K. pneumoniae', 'Aminoglycosides', 38), ('K. pneumoniae', 'Colistin', 12), ('K. pneumoniae', 'Tetracyclines', 28),
  ('E. coli', 'Carbapenems', 15), ('E. coli', 'Cephalosporins', 78), ('E. coli', 'Fluoroquinolones', 55), ('E. coli', 'Aminoglycosides', 22), ('E. coli', 'Colistin', 3), ('E. coli', 'Tetracyclines', 35),
  ('A. baumannii', 'Carbapenems', 88), ('A. baumannii', 'Cephalosporins', 95), ('A. baumannii', 'Fluoroquinolones', 72), ('A. baumannii', 'Aminoglycosides', 65), ('A. baumannii', 'Colistin', 8), ('A. baumannii', 'Tetracyclines', 42),
  ('S. aureus', 'Carbapenems', 2), ('S. aureus', 'Cephalosporins', 8), ('S. aureus', 'Fluoroquinolones', 42), ('S. aureus', 'Aminoglycosides', 5), ('S. aureus', 'Colistin', 0), ('S. aureus', 'Tetracyclines', 18),
  ('P. aeruginosa', 'Carbapenems', 35), ('P. aeruginosa', 'Cephalosporins', 18), ('P. aeruginosa', 'Fluoroquinolones', 48), ('P. aeruginosa', 'Aminoglycosides', 28), ('P. aeruginosa', 'Colistin', 15), ('P. aeruginosa', 'Tetracyclines', 22),
  ('Salmonella', 'Carbapenems', 5), ('Salmonella', 'Cephalosporins', 45), ('Salmonella', 'Fluoroquinolones', 32), ('Salmonella', 'Aminoglycosides', 12), ('Salmonella', 'Colistin', 2), ('Salmonella', 'Tetracyclines', 62);

-- ===== ALERTS =====
INSERT OR IGNORE INTO alerts (id, title, description, level, type, pathogen, region, risk_score, status, generated_at, generated_by, reviewed_at, reviewer, channels, recommended_actions, affected_population, response_status, sitrep) VALUES
  ('ALT-2026-0042', 'Cholera Cluster - Central District Critical Alert', 'CUSUM threshold breached: 48 cases in 7 days vs expected 12. Lab-confirmed V. cholerae O1 El Tor. Genomic cluster CHOL-2026-SA-001 growing. Immediate WASH intervention required.', 3, 'case_surge', 'Vibrio cholerae', 'Riyadh - Central District', 82, 'pending_review', '2026-03-08 08:15', 'EWS Statistical Engine', NULL, NULL, '["sms","email","dashboard","who_ihr"]', '["Deploy WASH response teams","Activate ORS stockpile","Notify WHO IHR","Establish cholera treatment centers"]', 125000, 'Mobilizing', 1),
  ('ALT-2026-0041', 'MERS-CoV Nosocomial Transmission Suspected', 'ML anomaly detection flagged unusual MERS-CoV pattern at King Fahad Medical City. 3 HCW cases in 48h. Clade B genomic match confirms hospital cluster.', 3, 'case_surge', 'MERS-CoV', 'Riyadh', 78, 'confirmed', '2026-03-07 14:30', 'EWS ML Engine', '2026-03-07 15:45', 'Dr Majed', '["sms","email","dashboard","who_ihr"]', '["Activate hospital IPC protocols","Contact trace all exposed HCWs","Submit IHR notification"]', 5000, 'Active Response', 1),
  ('ALT-2026-0040', 'Carbapenem-Resistant K. pneumoniae - XDR Strain', 'Genomic analysis confirms XDR K. pneumoniae (KPC-3 + NDM-1 + mcr-1) at 2 hospitals in Riyadh. ST258 clone. High mortality risk.', 2, 'amr_alert', 'K. pneumoniae (XDR)', 'Riyadh', 72, 'pending_review', '2026-03-07 10:00', 'Genomic Surveillance', NULL, NULL, '["email","dashboard"]', '["Implement enhanced IPC","Screen all ICU patients","Restrict carbapenem use"]', 800, 'Pending', 0),
  ('ALT-2026-0039', 'Dengue Surge - Makkah Region', 'Farrington algorithm signals excess dengue cases. 156 total, 89 lab-confirmed. DENV-2 Cosmopolitan genotype dominant. Peak season approaching.', 2, 'case_surge', 'Dengue Virus', 'Makkah / Jizan', 68, 'confirmed', '2026-03-06 16:45', 'EWS Statistical Engine', '2026-03-06 18:00', 'Dr. Fatima Hassan', '["sms","email","dashboard"]', '["Vector control spraying","Community awareness campaign","Prepare blood bank reserves"]', 350000, 'Active Response', 1),
  ('ALT-2026-0038', 'CCHF Signal - Northern Border', 'OSINT signal: ProMED report of CCHF cases near Saudi-Iraq border. 5 lab-confirmed locally. Tick season starting.', 2, 'osint_signal', 'CCHF Virus', 'Tabuk / Northern Borders', 71, 'pending_review', '2026-03-06 09:20', 'OSINT NLP Engine', NULL, NULL, '["email","dashboard"]', '["Alert border health posts","Distribute tick prevention guidance","Ensure ribavirin stocks"]', 45000, 'Pending', 0),
  ('ALT-2026-0037', 'MDR-TB Cluster Expansion', 'Genomic phylogenetic analysis shows MDR-TB cluster TB-2026-SA-012 expanded to 34 cases across 3 districts. rpoB-S450L mutation confirmed.', 2, 'genomic_divergence', 'M. tuberculosis (MDR)', 'Riyadh', 62, 'confirmed', '2026-03-05 11:30', 'Genomic Surveillance', '2026-03-05 14:00', 'Dr. Khalid Mansoor', '["email","dashboard"]', '["Contact trace index cases","Ensure bedaquiline supply","Screen high-risk contacts"]', 15000, 'Active Response', 0),
  ('ALT-2026-0036', 'Novel SARS-CoV-2 Lineage Detected', 'Pangolin identified BA.2.86.4 sublineage with 3 novel spike mutations. 2 cases at King Faisal Hospital. Monitoring for immune evasion.', 1, 'genomic_divergence', 'SARS-CoV-2', 'Riyadh', 45, 'dismissed', '2026-03-04 15:00', 'Genomic Surveillance', '2026-03-04 17:30', 'Dr Majed', '["dashboard"]', '["Monitor lineage growth","Share sequence with GISAID"]', 0, 'Monitoring', 0),
  ('ALT-2026-0035', 'Rift Valley Fever - Border Signal', 'WHO EIOS signal: RVF outbreak in neighboring country. 2 imported cases suspected at Jizan border. Enhanced screening activated.', 1, 'osint_signal', 'RVF Virus', 'Jizan / Najran', 35, 'confirmed', '2026-03-03 08:00', 'OSINT NLP Engine', '2026-03-03 10:15', 'Dr. Fatima Hassan', '["sms","email","dashboard"]', '["Enhanced border screening","Alert veterinary services","Stockpile RVF diagnostics"]', 80000, 'Monitoring', 0);

-- ===== EWS SIGNALS =====
INSERT OR IGNORE INTO ews_signals (pathogen, region, type, score, description, time, source, action) VALUES
  ('Vibrio cholerae', 'Riyadh - Central District', 'Statistical', 82, 'CUSUM breach: 4x expected cases over 6-week baseline', '2h ago', 'CUSUM Algorithm', 'Alert generated'),
  ('MERS-CoV', 'Riyadh', 'ML', 78, 'LSTM model flags anomalous HCW transmission pattern', '4h ago', 'LSTM Ensemble v2.1', 'Alert generated'),
  ('CCHF Virus', 'Tabuk / Northern', 'OSINT', 71, 'ProMED alert: CCHF cases reported near northern border', '8h ago', 'ProMED-mail', 'Under review'),
  ('Dengue Virus', 'Makkah / Jizan', 'Statistical', 68, 'Farrington algorithm: excess dengue cases beyond 5-year baseline', '12h ago', 'Farrington Algorithm', 'Alert confirmed'),
  ('K. pneumoniae (XDR)', 'Riyadh', 'Genomic', 72, 'Novel AMR combination: KPC-3 + NDM-1 + mcr-1 in single isolate', '18h ago', 'AMRFinderPlus', 'Under review'),
  ('M. tuberculosis', 'Riyadh', 'Genomic', 62, 'MDR-TB cluster TB-2026-SA-012 expanded to 34 genomes with <5 SNP distance', '1d ago', 'IQ-TREE2 Phylogenetics', 'Alert confirmed'),
  ('RVF Virus', 'Jizan', 'OSINT', 35, 'WHO EIOS: RVF outbreak reported in neighboring region', '2d ago', 'WHO EIOS 2.0', 'Monitoring'),
  ('SARS-CoV-2', 'National', 'ML', 42, 'XGBoost risk scorer indicates declining trend nationally', '2d ago', 'XGBoost Ensemble', 'No action needed');

-- ===== EWS DETECTION LAYERS =====
INSERT OR IGNORE INTO ews_detection_layers (name, icon, color, signals, description, algorithms, last_run, next_run) VALUES
  ('Statistical Detection', 'fa-chart-line', 'emerald', 5, 'CUSUM, Farrington, Bayesian changepoint algorithms running on weekly epi time-series data across 48 districts.', '["CUSUM","Farrington","Serfling","EARS C1-C3"]', '08:00 today', '14:00 today'),
  ('ML Anomaly Detection', 'fa-brain', 'blue', 3, 'LSTM neural network + XGBoost ensemble analyzing 15-variable feature vectors. Retrained quarterly.', '["LSTM","XGBoost","Isolation Forest"]', '06:00 today', '12:00 today'),
  ('OSINT / NLP Intelligence', 'fa-newspaper', 'purple', 4, 'Monitoring ProMED, WHO EIOS, HealthMap, 50+ news sources. AraBERT NLP for Arabic content.', '["AraBERT","Named Entity Recognition","Sentiment Analysis"]', 'Continuous', 'Continuous'),
  ('Genomic Surveillance', 'fa-dna', 'amber', 2, 'Novel lineage detection, AMR gene emergence, phylogenetic cluster growth monitoring.', '["Pangolin","AMRFinderPlus","IQ-TREE2"]', '07:30 today', '13:30 today');

-- ===== EWS REGIONAL RISKS =====
INSERT OR IGNORE INTO ews_regional_risks (region, score, trend, change, top_threat) VALUES
  ('Riyadh', 72, 'rising', '+5', 'Cholera'),
  ('Makkah', 68, 'rising', '+3', 'Dengue'),
  ('Jizan', 65, 'rising', '+4', 'Dengue'),
  ('Tabuk', 58, 'rising', '+8', 'CCHF'),
  ('Eastern', 55, 'stable', '+1', 'MERS-CoV'),
  ('Qassim', 48, 'stable', '0', 'Cholera'),
  ('Northern', 44, 'rising', '+6', 'CCHF'),
  ('Madinah', 42, 'falling', '-3', 'TB'),
  ('Asir', 38, 'stable', '0', 'Dengue'),
  ('Najran', 35, 'falling', '-2', 'RVF'),
  ('Hail', 22, 'stable', '0', 'None'),
  ('Al-Baha', 18, 'falling', '-1', 'None'),
  ('Al-Jouf', 15, 'stable', '0', 'None');

-- ===== EWS OSINT FEED =====
INSERT OR IGNORE INTO ews_osint_feed (title, source, date, relevance, language, sentiment, entities) VALUES
  ('ProMED: Cholera cases surge in Middle East region', 'ProMED-mail', '2026-03-08', 92, 'English', 'negative', '["Cholera","Middle East","Waterborne"]'),
  ('WHO EIOS: CCHF cases reported near Saudi border', 'WHO EIOS 2.0', '2026-03-07', 88, 'English', 'negative', '["CCHF","Saudi Arabia","Border"]'),
  ('تقرير: ارتفاع حالات حمى الضنك في جدة', 'Saudi Gazette (Arabic)', '2026-03-07', 85, 'Arabic', 'negative', '["Dengue","Jeddah"]'),
  ('Antimicrobial resistance crisis: Global update Q1 2026', 'Lancet ID', '2026-03-06', 78, 'English', 'negative', '["AMR","Global","CRE"]'),
  ('MERS-CoV: Healthcare worker infections at hospital', 'HealthMap', '2026-03-06', 90, 'English', 'negative', '["MERS-CoV","Nosocomial","HCW"]'),
  ('RVF outbreak reported in East Africa - travel advisory', 'CDC GHSA', '2026-03-05', 72, 'English', 'warning', '["RVF","East Africa","Travel"]');

-- ===== EWS CONFIG =====
INSERT OR IGNORE INTO ews_config (key, value) VALUES
  ('national_risk', '{"activeSignals":14,"newSignals24h":3,"nationalRiskScore":62,"riskTrend":"rising","osintArticles":2847,"osintRelevant":142}'),
  ('risk_history', '{"dates":["02-07","02-08","02-09","02-10","02-11","02-12","02-13","02-14","02-15","02-16","02-17","02-18","02-19","02-20","02-21","02-22","02-23","02-24","02-25","02-26","02-27","02-28","03-01","03-02","03-03","03-04","03-05","03-06","03-07","03-08"],"scores":[45,47,48,50,49,52,55,53,56,58,55,57,60,58,56,59,61,58,60,62,59,61,63,60,62,64,61,63,62,62]}'),
  ('forecast', '{"pathogen":"Vibrio cholerae","region":"Riyadh","days":["Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 14","Mar 15"],"predicted":[18,22,25,28,26,24,21],"upper":[24,30,34,38,35,32,28],"lower":[12,14,16,18,17,16,14],"confidence":0.85,"model":"LSTM Ensemble v2.1"}');

-- ===== DASHBOARD METRICS =====
INSERT OR IGNORE INTO dashboard_metrics (metric_key, metric_value) VALUES
  ('summary', '{"activeCases":1247,"sitesMonitored":24,"genomicSequences":856,"sequencesProcessed":742,"activeAlerts":7,"criticalAlerts":2,"threatLevel":62,"pendingReview":3,"dataQualityAvg":86}'),
  ('ews_scores', '{"statistical":42,"ml":38,"osint":55,"genomic":28,"composite":62}'),
  ('sparklines', '{"cases":[980,1020,1050,1080,1040,1100,1120,1090,1150,1180,1200,1210,1230,1247],"sites":[22,22,23,23,23,24,24,24,24,24,24,24,24,24],"sequences":[620,640,660,690,710,720,740,760,780,800,820,835,848,856],"alerts":[5,6,5,4,5,7,8,7,6,8,7,6,7,7]}'),
  ('recent_activity', '[{"type":"alert","message":"Critical: Cholera cluster detected in Central District - 48 cases in 7 days","time":"12 min ago","icon":"fa-exclamation-circle","severity":"critical"},{"type":"genomic","message":"Sequence BioR-2026-SA-0847 completed - Novel SARS-CoV-2 lineage BA.2.86.4 identified","time":"28 min ago","icon":"fa-dna","severity":"info"},{"type":"case","message":"15 new case reports ingested from King Fahad Medical City LIMS","time":"45 min ago","icon":"fa-file-medical","severity":"info"},{"type":"alert","message":"Warning: MERS-CoV signal detected via OSINT - ProMED report from Eastern Province","time":"1h ago","icon":"fa-newspaper","severity":"warning"},{"type":"genomic","message":"AMR detected: Carbapenem-resistant K. pneumoniae at Riyadh Central Lab","time":"2h ago","icon":"fa-pills","severity":"critical"},{"type":"case","message":"Weekly aggregate complete: Epi Week 2026-W10, 340 confirmed cases nationwide","time":"3h ago","icon":"fa-chart-bar","severity":"info"},{"type":"system","message":"Data quality alert: Jeddah General Hospital DQ score dropped to 68%","time":"4h ago","icon":"fa-database","severity":"warning"},{"type":"alert","message":"EWS: CUSUM threshold breached for Dengue in Makkah Region","time":"5h ago","icon":"fa-chart-line","severity":"warning"},{"type":"system","message":"Genomic pipeline v3.2.1 deployed successfully - 15% faster assembly","time":"6h ago","icon":"fa-cogs","severity":"info"},{"type":"case","message":"MERS-CoV case investigation initiated at King Fahad Medical City","time":"7h ago","icon":"fa-search","severity":"warning"}]'),
  ('top_pathogens', '[{"name":"SARS-CoV-2","cases":487,"trend":"falling","severity":"medium","percent":65,"weekChange":-12,"lineage":"BA.2.86 / JN.1"},{"name":"Vibrio cholerae O1","cases":127,"trend":"rising","severity":"critical","percent":85,"weekChange":34,"lineage":"O1 El Tor"},{"name":"Dengue Virus","cases":156,"trend":"rising","severity":"high","percent":55,"weekChange":18,"lineage":"DENV-2 Cosmopolitan"},{"name":"Mycobacterium tuberculosis","cases":201,"trend":"stable","severity":"medium","percent":40,"weekChange":2,"lineage":"Lineage 4"},{"name":"Salmonella enterica","cases":94,"trend":"stable","severity":"medium","percent":45,"weekChange":-3,"lineage":"ST313"},{"name":"MERS-CoV","cases":23,"trend":"rising","severity":"high","percent":70,"weekChange":8,"lineage":"Clade B"}]'),
  ('map_markers', '[{"name":"King Fahad Medical City","lat":24.69,"lng":46.72,"status":"Active","type":"Hospital","color":"#22c55e","cases":45},{"name":"Riyadh Airport Sentinel","lat":24.96,"lng":46.70,"status":"Active","type":"Airport","color":"#22c55e","cases":12},{"name":"Jeddah Port Authority","lat":21.48,"lng":39.18,"status":"Alert","type":"Border","color":"#ef4444","cases":32},{"name":"Makkah Central Hospital","lat":21.42,"lng":39.82,"status":"Active","type":"Hospital","color":"#22c55e","cases":28},{"name":"Dammam Wastewater Plant","lat":26.43,"lng":50.10,"status":"Active","type":"Wastewater","color":"#3b82f6","cases":0},{"name":"Madinah Sentinel Site","lat":24.47,"lng":39.61,"status":"Active","type":"Sentinel","color":"#22c55e","cases":22},{"name":"Tabuk Border Post","lat":28.38,"lng":36.57,"status":"Active","type":"Border","color":"#22c55e","cases":5},{"name":"Abha Regional Lab","lat":18.22,"lng":42.50,"status":"Offline","type":"Hospital","color":"#6b7280","cases":15},{"name":"Khobar Env. Monitor","lat":26.27,"lng":50.21,"status":"Active","type":"Environment","color":"#3b82f6","cases":3},{"name":"Jizan Health Center","lat":16.89,"lng":42.55,"status":"Alert","type":"Hospital","color":"#ef4444","cases":41},{"name":"Najran Sentinel","lat":17.49,"lng":44.13,"status":"Active","type":"Sentinel","color":"#22c55e","cases":8},{"name":"Hail Wastewater","lat":27.52,"lng":41.69,"status":"Active","type":"Wastewater","color":"#3b82f6","cases":0}]'),
  ('region_breakdown', '[{"name":"Riyadh","cases":412,"color":"#00A86B"},{"name":"Makkah","cases":287,"color":"#3b82f6"},{"name":"Eastern","cases":156,"color":"#f59e0b"},{"name":"Madinah","cases":134,"color":"#8b5cf6"},{"name":"Asir","cases":98,"color":"#ef4444"},{"name":"Jizan","cases":82,"color":"#ec4899"},{"name":"Others","cases":78,"color":"#6b7280"}]'),
  ('weekly_trend', '{"labels":["W51","W52","W01","W02","W03","W04","W05","W06","W07","W08","W09","W10"],"confirmed":[210,225,245,260,255,270,280,310,295,340,325,370],"suspected":[320,340,360,380,375,400,420,460,445,510,490,540],"deaths":[2,3,2,4,3,5,3,4,5,6,4,4]}');

-- ===== REPORTS =====
INSERT OR IGNORE INTO reports (title, period, total_cases, deaths, status, author) VALUES
  ('National Epi Bulletin W10', 'Mar 4 - Mar 8, 2026', 370, 4, 'Published', 'Dr Majed'),
  ('National Epi Bulletin W09', 'Feb 25 - Mar 3, 2026', 325, 2, 'Published', 'Dr Majed'),
  ('National Epi Bulletin W08', 'Feb 18 - Feb 24, 2026', 340, 5, 'Published', 'Dr Majed'),
  ('Cholera Situation Report #3', 'Mar 1 - Mar 8, 2026', 127, 3, 'Published', 'Dr. Fatima Hassan'),
  ('MERS-CoV Weekly Update', 'Mar 1 - Mar 8, 2026', 23, 4, 'Draft', 'Dr Majed'),
  ('AMR Surveillance Summary', 'Feb 2026', 52, 6, 'Published', 'Dr. Khalid Mansoor');

-- ===== REPORTS DATA =====
INSERT OR IGNORE INTO reports_data (key, value) VALUES
  ('weekly_labels', '["W05","W06","W07","W08","W09","W10"]'),
  ('confirmed_cases', '[280,310,295,340,325,370]'),
  ('suspected_cases', '[420,460,445,510,490,540]'),
  ('positivity_rate', '[12.5,14.2,13.8,15.1,14.6,16.3]'),
  ('pathogen_labels', '["SARS-CoV-2","Cholera","Dengue","MERS-CoV","Salmonella","TB"]'),
  ('pathogen_cases', '[487,127,156,23,94,201]'),
  ('alert_distribution', '[2,4,3,12]'),
  ('region_labels', '["Riyadh","Makkah","Eastern","Madinah","Jizan","Asir","Tabuk","Qassim","Northern","Najran","Hail","Al-Baha","Al-Jouf"]'),
  ('region_cases', '[380,285,145,88,120,72,38,52,18,22,12,8,7]'),
  ('epi_curve', '{"dates":["02-07","02-08","02-09","02-10","02-11","02-12","02-13","02-14","02-15","02-16","02-17","02-18","02-19","02-20","02-21","02-22","02-23","02-24","02-25","02-26","02-27","02-28","03-01","03-02","03-03","03-04","03-05","03-06","03-07","03-08"],"confirmed":[8,12,10,15,14,11,13,16,18,14,12,17,19,22,20,18,15,21,24,19,16,23,25,28,22,20,26,30,24,28],"suspected":[14,18,16,22,20,17,19,24,26,21,18,25,28,32,29,26,22,30,35,28,24,33,36,40,32,29,38,44,35,41]}'),
  ('monthly_trend', '{"months":["Oct 2025","Nov 2025","Dec 2025","Jan 2026","Feb 2026","Mar 2026"],"cases":[820,910,1050,1180,1150,1247],"deaths":[8,12,15,18,14,12],"sequences":[180,220,310,420,580,856]}');

-- ===== SYSTEM SERVICES =====
INSERT OR IGNORE INTO system_services (name, status, uptime, latency, load, last_check) VALUES
  ('Data Ingestion Hub', 'healthy', '99.9%', '45ms', 32, '1 min ago'),
  ('Genomic Pipeline', 'healthy', '99.5%', '180ms', 68, '2 min ago'),
  ('EWS Engine', 'healthy', '99.8%', '92ms', 41, '1 min ago'),
  ('Alert Service', 'healthy', '99.9%', '28ms', 15, '30 sec ago'),
  ('OSINT NLP Engine', 'warning', '98.2%', '320ms', 78, '5 min ago'),
  ('Auth / Keycloak', 'healthy', '99.9%', '35ms', 8, '1 min ago'),
  ('PostgreSQL Primary', 'healthy', '99.9%', '12ms', 42, '15 sec ago'),
  ('OpenSearch Cluster', 'healthy', '99.7%', '55ms', 52, '30 sec ago'),
  ('MinIO Storage', 'healthy', '99.8%', '65ms', 28, '1 min ago'),
  ('Kafka Event Bus', 'healthy', '99.9%', '8ms', 35, '15 sec ago');

-- ===== SYSTEM CONFIG =====
INSERT OR IGNORE INTO system_config (key, value) VALUES
  ('health', '{"overall":"healthy","uptime":"99.7%","lastIncident":"2026-02-28 03:15"}'),
  ('storage', '{"postgresql":{"used":48,"total":500,"unit":"GB"},"opensearch":{"used":18,"total":200,"unit":"GB"},"minio":{"used":4800,"total":10000,"unit":"GB"},"redis":{"used":2.4,"total":8,"unit":"GB"}}'),
  ('recent_events', '[{"time":"10:15","event":"Genomic pipeline batch #847 completed (12 samples)","type":"info"},{"time":"09:45","event":"OSINT NLP engine response time elevated (320ms)","type":"warning"},{"time":"09:30","event":"EWS risk score update completed for all 13 regions","type":"info"},{"time":"08:15","event":"Level 3 alert generated: Cholera cluster","type":"alert"},{"time":"07:00","event":"Daily data quality audit completed (avg: 86%)","type":"info"},{"time":"05:00","event":"Scheduled backup completed successfully","type":"info"},{"time":"03:15","event":"SSL certificate renewed for api.bior.gov","type":"info"}]');

-- ===== DATA QUALITY SCORECARD =====
INSERT OR IGNORE INTO dq_scorecard (institution, score, completeness, timeliness, accuracy, trend) VALUES
  ('King Faisal Specialist Hospital', 97, 98, 96, 97, 'stable'),
  ('NEOM Health Hub', 95, 96, 94, 95, 'rising'),
  ('King Fahad Medical City', 94, 95, 93, 94, 'stable'),
  ('Khamis Mushait Military Hospital', 93, 94, 92, 93, 'stable'),
  ('Madinah General Hospital', 92, 93, 91, 92, 'rising'),
  ('Jeddah King Abdulaziz Airport', 91, 92, 90, 91, 'stable'),
  ('Hofuf King Fahd Hospital', 91, 92, 90, 91, 'stable'),
  ('King Abdullah Medical City', 90, 91, 89, 90, 'falling'),
  ('Qassim Central Hospital', 89, 90, 88, 89, 'stable'),
  ('Riyadh International Airport', 88, 89, 87, 88, 'stable'),
  ('Taif General Hospital', 88, 89, 87, 88, 'stable'),
  ('Hail Wastewater Facility', 87, 88, 86, 87, 'stable'),
  ('Jubail Industrial Health', 86, 87, 85, 86, 'rising'),
  ('Dammam Wastewater Treatment', 85, 86, 84, 85, 'stable'),
  ('Najran Sentinel Surveillance', 83, 84, 82, 83, 'stable'),
  ('Jeddah Port Authority', 82, 83, 81, 82, 'falling'),
  ('Yanbu Industrial Env. Monitor', 81, 82, 80, 81, 'stable'),
  ('Baha Regional Center', 80, 81, 79, 80, 'stable'),
  ('Dhahran Environment Station', 79, 80, 78, 79, 'falling'),
  ('Sakaka Health Center', 77, 78, 76, 77, 'stable'),
  ('Tabuk Northern Border Post', 76, 77, 75, 76, 'rising'),
  ('Jizan Health Directorate', 74, 75, 73, 74, 'falling'),
  ('Arar Border Crossing', 73, 74, 72, 73, 'stable'),
  ('Abha Regional Laboratory', 68, 70, 66, 68, 'falling');

-- ===== AUDIT LOG =====
INSERT OR IGNORE INTO audit_log (id, timestamp, user, action, resource, details, ip, tier) VALUES
  ('AUD-001', '2026-03-08 10:15:32', 'Dr Majed', 'Alert Review', 'ALT-2026-0042', 'Viewed cholera cluster alert', '10.0.1.45', 4),
  ('AUD-002', '2026-03-08 09:45:18', 'System (EWS)', 'Alert Generated', 'ALT-2026-0042', 'Level 3 alert auto-generated by CUSUM engine', 'system', 0),
  ('AUD-003', '2026-03-08 09:30:05', 'Dr. Fatima Hassan', 'Report Export', 'RPT-W10', 'Exported W10 bulletin as PDF', '10.0.2.12', 3),
  ('AUD-004', '2026-03-08 08:15:44', 'Dr. Khalid Mansoor', 'Sequence Submitted', 'BioR-2026-SA-0847', 'SARS-CoV-2 sample submitted from KFSH', '10.0.3.88', 3),
  ('AUD-005', '2026-03-07 18:00:22', 'Dr. Fatima Hassan', 'Alert Confirmed', 'ALT-2026-0039', 'Dengue alert confirmed after review', '10.0.2.12', 3),
  ('AUD-006', '2026-03-07 15:45:11', 'Dr Majed', 'Alert Confirmed', 'ALT-2026-0041', 'MERS-CoV nosocomial alert confirmed', '10.0.1.45', 4),
  ('AUD-007', '2026-03-07 14:30:00', 'System (ML)', 'Alert Generated', 'ALT-2026-0041', 'LSTM anomaly detection flagged MERS pattern', 'system', 0),
  ('AUD-008', '2026-03-07 10:00:33', 'System (Genomics)', 'AMR Alert', 'BioR-2026-SA-0844', 'XDR K. pneumoniae detected with triple resistance', 'system', 0),
  ('AUD-009', '2026-03-06 16:45:00', 'System (EWS)', 'Alert Generated', 'ALT-2026-0039', 'Farrington algorithm flagged dengue surge', 'system', 0),
  ('AUD-010', '2026-03-06 09:20:15', 'System (OSINT)', 'Signal Detected', 'SIG-CCHF-001', 'ProMED CCHF article processed by AraBERT', 'system', 0),
  ('AUD-011', '2026-03-05 14:00:44', 'Dr. Khalid Mansoor', 'Alert Confirmed', 'ALT-2026-0037', 'MDR-TB cluster alert confirmed', '10.0.3.88', 3),
  ('AUD-012', '2026-03-05 11:30:00', 'System (Genomics)', 'Alert Generated', 'ALT-2026-0037', 'Phylogenetic analysis detected MDR-TB expansion', 'system', 0);

-- ===== PSEF BENCHMARK DATASET =====
INSERT OR IGNORE INTO datasets (id, name, description, icon, color, columns_def, row_count, version_count, status, created_by)
VALUES (
  'ds-psef-benchmark',
  'PSEF Benchmark v3.1',
  'Pathogen Surveillance Evaluation Framework (PSEF) v3.1.0 — 189 platforms across 6 layers (L1-L5), 50 deep-research profiles, 20 CBRN operational platforms. 10 evaluation dimensions with weighted scoring. Source: github.com/mf2022-dev/Pathogen-Biosurviallance-platform-Benchmark-',
  'fa-shield-virus',
  '#38bdf8',
  '[{"name":"Rank","type":"number"},{"name":"Name","type":"text"},{"name":"Score","type":"number"},{"name":"Layer","type":"text"},{"name":"Category","type":"text"},{"name":"Description","type":"text"},{"name":"Biosurveillance_Class","type":"text"},{"name":"Primary_Input","type":"text"},{"name":"Data_Integration","type":"number"},{"name":"Analytics","type":"number"},{"name":"Visualization","type":"number"},{"name":"Accessibility","type":"number"},{"name":"Scalability","type":"number"},{"name":"Documentation","type":"number"},{"name":"Community","type":"number"},{"name":"Security","type":"number"},{"name":"Interoperability","type":"number"},{"name":"RealTime","type":"number"},{"name":"URL","type":"text"},{"name":"Military_Biodefense","type":"boolean"},{"name":"Deep_Research","type":"boolean"}]',
  189,
  1,
  'active',
  'usr-001'
);

INSERT OR IGNORE INTO dataset_versions (id, dataset_id, version_num, row_count, notes, created_by)
VALUES ('dsv-psef-v31', 'ds-psef-benchmark', 1, 189, 'PSEF v3.1.0 — 189 platforms, 50 deep profiles, 20 CBRN. Expanded from v3.0 (169 platforms).', 'usr-001');
