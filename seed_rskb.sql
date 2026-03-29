-- =============================================================================
-- BioR RSKB — Comprehensive Seed Data
-- Regulatory & Standards Knowledge Base
-- =============================================================================

-- =============================================================================
-- DOMAINS (8 top-level domains)
-- =============================================================================
INSERT OR IGNORE INTO rskb_domains (id, code, name, description, icon, color, sort_order) VALUES
  ('dom-01', 'TREATY', 'International Treaties & Conventions', 'Legally binding international agreements between states governing biological weapons, health regulations, and environmental protection', 'fa-scroll', '#DC2626', 1),
  ('dom-02', 'FRAMEWORK', 'International Frameworks & Initiatives', 'Non-binding or semi-binding multilateral frameworks, agendas, and cooperative initiatives for global health security', 'fa-globe', '#2563EB', 2),
  ('dom-03', 'STANDARD', 'Standards & Technical Norms', 'International and national technical standards for laboratory biosafety, quality management, and operational procedures', 'fa-certificate', '#059669', 3),
  ('dom-04', 'NATIONAL', 'National Legislation & Regulations', 'Saudi Arabian and key national laws, royal decrees, and regulations governing biosafety, biosecurity, and public health', 'fa-landmark', '#7C3AED', 4),
  ('dom-05', 'REGIONAL', 'Regional Agreements & Cooperation', 'GCC, EMRO, Arab League, and other regional cooperation frameworks for health security and biosurveillance', 'fa-handshake', '#D97706', 5),
  ('dom-06', 'GUIDELINE', 'Guidelines & Best Practices', 'Technical guidance documents, manuals, and best practice recommendations from authoritative bodies', 'fa-book-open', '#0891B2', 6),
  ('dom-07', 'QA', 'Quality Assurance & Accreditation', 'Laboratory accreditation, proficiency testing, quality management systems, and certification programs', 'fa-award', '#BE185D', 7),
  ('dom-08', 'POLICY', 'Policies & Strategies', 'National and international strategic plans, action plans, and policy documents for biosurveillance and health security', 'fa-chess', '#4338CA', 8);

-- =============================================================================
-- CATEGORIES (subdivisions within each domain)
-- =============================================================================
INSERT OR IGNORE INTO rskb_categories (id, domain_id, code, name, description, sort_order) VALUES
  -- Treaties
  ('cat-01', 'dom-01', 'WMD_DISARM', 'WMD Disarmament & Non-Proliferation', 'Treaties addressing biological and chemical weapons prohibition', 1),
  ('cat-02', 'dom-01', 'HEALTH_LAW', 'International Health Law', 'Binding international health regulations and conventions', 2),
  ('cat-03', 'dom-01', 'ENVIRON', 'Environmental & Biodiversity', 'Conventions on biodiversity, biosafety of GMOs, and environmental protection', 3),
  ('cat-04', 'dom-01', 'UNSC_RES', 'UN Security Council Resolutions', 'Binding UNSC resolutions on WMD proliferation', 4),
  
  -- Frameworks
  ('cat-05', 'dom-02', 'HEALTH_SEC', 'Global Health Security', 'Cooperative frameworks for pandemic preparedness and health security', 1),
  ('cat-06', 'dom-02', 'ONE_HEALTH', 'One Health', 'Integrated human-animal-environment health approaches', 2),
  ('cat-07', 'dom-02', 'EVAL_ASSESS', 'Evaluation & Assessment', 'JEE, SPAR, PVS and other capacity evaluation tools', 3),
  ('cat-08', 'dom-02', 'AMR_FRAME', 'Antimicrobial Resistance', 'Global and regional AMR action plans and surveillance frameworks', 4),
  
  -- Standards
  ('cat-09', 'dom-03', 'BIORISK', 'Biorisk Management', 'Standards for laboratory biosafety and biosecurity risk management', 1),
  ('cat-10', 'dom-03', 'LAB_QUALITY', 'Laboratory Quality', 'Quality management standards for medical and testing laboratories', 2),
  ('cat-11', 'dom-03', 'ANIMAL_STD', 'Animal Health Standards', 'WOAH Terrestrial and Aquatic Codes and diagnostic manuals', 3),
  ('cat-12', 'dom-03', 'INFO_SEC', 'Information Security', 'Data protection and information security standards for health data', 4),
  
  -- National
  ('cat-13', 'dom-04', 'SA_BIOSAFE', 'Saudi Biosafety & Biosecurity', 'Saudi national biosafety and biosecurity regulations', 1),
  ('cat-14', 'dom-04', 'SA_PH', 'Saudi Public Health', 'Saudi public health law, disease notification, and surveillance mandates', 2),
  ('cat-15', 'dom-04', 'SA_LAB', 'Saudi Laboratory Regulation', 'SFDA, PHA, and SASO standards for laboratories in Saudi Arabia', 3),
  ('cat-16', 'dom-04', 'SA_ENVIRON', 'Saudi Environmental', 'Saudi environmental protection and hazardous materials regulations', 4),
  
  -- Regional
  ('cat-17', 'dom-05', 'GCC_HEALTH', 'GCC Health Cooperation', 'Gulf Cooperation Council joint health and disease control initiatives', 1),
  ('cat-18', 'dom-05', 'EMRO_WHO', 'WHO EMRO Regional', 'WHO Eastern Mediterranean Regional Office frameworks and strategies', 2),
  ('cat-19', 'dom-05', 'ARAB_LEAGUE', 'Arab League Health', 'League of Arab States health and biosecurity cooperation', 3),
  
  -- Guidelines
  ('cat-20', 'dom-06', 'BIOSAFE_GUIDE', 'Biosafety Guidelines', 'Laboratory biosafety manuals and operational guidance', 1),
  ('cat-21', 'dom-06', 'SURV_GUIDE', 'Surveillance Guidelines', 'Disease surveillance system design and operation guidance', 2),
  ('cat-22', 'dom-06', 'SAMPLE_GUIDE', 'Sample Management', 'Biological sample collection, transport, and storage guidance', 3),
  ('cat-23', 'dom-06', 'OUTBREAK_GUIDE', 'Outbreak Response', 'Outbreak investigation, response, and containment guidance', 4),
  
  -- QA
  ('cat-24', 'dom-07', 'LAB_ACCRED', 'Laboratory Accreditation', 'ISO 15189, CAP, and national lab accreditation programs', 1),
  ('cat-25', 'dom-07', 'PROFICIENCY', 'Proficiency Testing', 'External quality assessment and proficiency testing schemes', 2),
  ('cat-26', 'dom-07', 'QMS', 'Quality Management Systems', 'ISO 9001 and sector-specific quality management frameworks', 3),
  
  -- Policy
  ('cat-27', 'dom-08', 'NAT_STRATEGY', 'National Strategies', 'National health security, biodefense, and pandemic preparedness strategies', 1),
  ('cat-28', 'dom-08', 'ACTION_PLAN', 'Action Plans', 'Specific action plans for AMR, pandemic preparedness, biosecurity', 2),
  ('cat-29', 'dom-08', 'WORKFORCE', 'Workforce Development', 'Training, education, and workforce capacity building policies', 3);

-- =============================================================================
-- ISSUING BODIES (organizations)
-- =============================================================================
INSERT OR IGNORE INTO rskb_bodies (id, code, name, full_name, body_type, headquarters, established_year, website, mandate, member_states, sa_membership_status) VALUES
  ('body-01', 'WHO', 'World Health Organization', 'World Health Organization', 'un_agency', 'Geneva, Switzerland', 1948, 'https://www.who.int', 'Directing and coordinating authority on international health within the UN system', 194, 'member'),
  ('body-02', 'WOAH', 'World Organisation for Animal Health', 'World Organisation for Animal Health (formerly OIE)', 'int_org', 'Paris, France', 1924, 'https://www.woah.org', 'Improving animal health worldwide through international standards', 183, 'member'),
  ('body-03', 'UN', 'United Nations', 'United Nations', 'int_org', 'New York, USA', 1945, 'https://www.un.org', 'Maintaining international peace and security', 193, 'member'),
  ('body-04', 'UNODA', 'UN Office for Disarmament Affairs', 'United Nations Office for Disarmament Affairs', 'un_agency', 'New York, USA', 1982, 'https://disarmament.unoda.org', 'Supporting multilateral disarmament efforts', 193, 'member'),
  ('body-05', 'ISO', 'International Organization for Standardization', 'International Organization for Standardization', 'standards_body', 'Geneva, Switzerland', 1947, 'https://www.iso.org', 'Developing and publishing international standards', 170, 'member'),
  ('body-06', 'OPCW', 'Organisation for the Prohibition of Chemical Weapons', 'Organisation for the Prohibition of Chemical Weapons', 'int_org', 'The Hague, Netherlands', 1997, 'https://www.opcw.org', 'Implementing the Chemical Weapons Convention', 193, 'member'),
  ('body-07', 'FAO', 'Food and Agriculture Organization', 'Food and Agriculture Organization of the United Nations', 'un_agency', 'Rome, Italy', 1945, 'https://www.fao.org', 'Achieving food security and ensuring regular access to sufficient food', 195, 'member'),
  ('body-08', 'UNEP', 'UN Environment Programme', 'United Nations Environment Programme', 'un_agency', 'Nairobi, Kenya', 1972, 'https://www.unep.org', 'Environmental sustainability and nature protection', 193, 'member'),
  ('body-09', 'GHSA', 'Global Health Security Agenda', 'Global Health Security Agenda', 'int_org', 'Washington, D.C., USA', 2014, 'https://globalhealthsecurityagenda.org', 'Accelerating progress toward a world safe from infectious disease threats', 70, 'member'),
  ('body-10', 'IAEA', 'International Atomic Energy Agency', 'International Atomic Energy Agency', 'int_org', 'Vienna, Austria', 1957, 'https://www.iaea.org', 'Promoting safe, secure and peaceful use of nuclear technologies', 178, 'member'),
  ('body-11', 'SA-MOH', 'Saudi Ministry of Health', 'Ministry of Health, Kingdom of Saudi Arabia', 'national_gov', 'Riyadh, Saudi Arabia', 1950, 'https://www.moh.gov.sa', 'Providing healthcare services and public health oversight in Saudi Arabia', NULL, NULL),
  ('body-12', 'SA-SFDA', 'Saudi Food & Drug Authority', 'Saudi Food and Drug Authority', 'national_gov', 'Riyadh, Saudi Arabia', 2003, 'https://www.sfda.gov.sa', 'Regulating food, drug, medical devices, and biological products in Saudi Arabia', NULL, NULL),
  ('body-13', 'SA-PHA', 'Saudi Public Health Authority', 'Public Health Authority (Weqaya), Kingdom of Saudi Arabia', 'national_gov', 'Riyadh, Saudi Arabia', 2021, 'https://www.pha.gov.sa', 'National public health surveillance, disease control, and health security in Saudi Arabia', NULL, NULL),
  ('body-14', 'GCC', 'Gulf Cooperation Council', 'Cooperation Council for the Arab States of the Gulf', 'regional_org', 'Riyadh, Saudi Arabia', 1981, 'https://www.gcc-sg.org', 'Political and economic cooperation among Gulf states', 6, 'member'),
  ('body-15', 'WHO-EMRO', 'WHO EMRO', 'WHO Regional Office for the Eastern Mediterranean', 'un_agency', 'Cairo, Egypt', 1949, 'https://www.emro.who.int', 'WHO regional coordination for 22 countries in Eastern Mediterranean', 22, 'member'),
  ('body-16', 'CDC', 'US Centers for Disease Control', 'Centers for Disease Control and Prevention', 'national_gov', 'Atlanta, USA', 1946, 'https://www.cdc.gov', 'Protecting public health and safety through disease prevention and control', NULL, NULL),
  ('body-17', 'ECDC', 'European Centre for Disease Prevention', 'European Centre for Disease Prevention and Control', 'regional_org', 'Stockholm, Sweden', 2005, 'https://www.ecdc.europa.eu', 'Strengthening Europe''s defences against infectious diseases', 27, 'non_member'),
  ('body-18', 'SA-SASO', 'Saudi Standards Authority', 'Saudi Standards, Metrology and Quality Organization', 'national_gov', 'Riyadh, Saudi Arabia', 1972, 'https://www.saso.gov.sa', 'Developing and implementing Saudi national standards', NULL, NULL),
  ('body-19', 'AUSTRALIA_GRP', 'Australia Group', 'Australia Group', 'int_org', 'Canberra, Australia', 1985, 'https://www.dfat.gov.au/publications/minisite/theaustraliagroupnet', 'Harmonizing export controls on chemical and biological materials', 43, 'non_member'),
  ('body-20', 'INTERPOL', 'INTERPOL', 'International Criminal Police Organization', 'int_org', 'Lyon, France', 1923, 'https://www.interpol.int', 'International police cooperation including bioterrorism prevention', 196, 'member');

-- =============================================================================
-- INSTRUMENTS — Core Knowledge Base Records
-- =============================================================================

-- ─── DOMAIN 1: INTERNATIONAL TREATIES & CONVENTIONS ──────────────────────────

INSERT OR IGNORE INTO rskb_instruments (id, domain_id, category_id, code, title, short_title, instrument_type, scope, issuing_body, issuing_body_type, adopted_date, entry_into_force, last_amended, status, purpose, summary, key_provisions, obligations, applies_to, geographic_scope, sector_biosecurity, sector_biosafety, sector_biosurveillance, sector_biodefense, sector_public_health, sector_laboratory, binding_level, official_url, sa_relevance, sa_implementing_body, sa_status, tags) VALUES
  ('inst-001', 'dom-01', 'cat-01', 'BWC', 'Convention on the Prohibition of the Development, Production and Stockpiling of Bacteriological (Biological) and Toxin Weapons and on their Destruction', 'Biological Weapons Convention', 'convention', 'international', 'United Nations', 'int_org', '1972-04-10', '1975-03-26', '2024-12-01', 'active',
   'Prohibit the development, production, stockpiling, and use of biological weapons',
   'The BWC is the first multilateral disarmament treaty banning an entire category of weapons. It prohibits the development, production, stockpiling, acquisition, retention, and transfer of biological agents and toxins that have no justification for peaceful purposes, as well as weapons and means of delivery. Entered into force in 1975 with 187 states parties. Review conferences held every 5 years. A Working Group on Strengthening the Convention was established in 2022. The convention lacks a formal verification mechanism, relying on Confidence-Building Measures (CBMs) for transparency.',
   '["Article I: Never develop/produce/stockpile biological weapons","Article II: Destroy existing stocks within 9 months","Article III: No transfer of biological weapons to any recipient","Article IV: Take national implementation measures","Article V: Consult and cooperate to resolve compliance concerns","Article VI: Lodge complaints with UN Security Council","Article VII: Provide assistance if a party is exposed to danger","Article X: Facilitate exchange of equipment and scientific knowledge"]',
   '["Enact national legislation criminalizing biological weapons","Submit annual Confidence-Building Measures (CBMs)","Participate in Review Conferences every 5 years","Implement national oversight of dual-use research","Ensure security of pathogen collections"]',
   '["state_parties","military","research_institutions","laboratories"]',
   '["global"]',
   1, 1, 1, 1, 1, 1, 'mandatory', 'https://disarmament.unoda.org/biological-weapons/',
   'Saudi Arabia acceded to the BWC in 1972. As a state party, KSA is obligated to implement all convention provisions, submit annual CBMs, and maintain national legislation prohibiting biological weapons. Saudi Arabia''s Vision 2030 biotechnology initiatives must comply with BWC dual-use oversight requirements.',
   'Ministry of Foreign Affairs; Ministry of Defense; Saudi PHA', 'adopted',
   '["biosecurity","disarmament","non-proliferation","biological_weapons","dual_use","CBM"]'),

  ('inst-002', 'dom-01', 'cat-01', 'CWC', 'Convention on the Prohibition of the Development, Production, Stockpiling and Use of Chemical Weapons and on their Destruction', 'Chemical Weapons Convention', 'convention', 'international', 'OPCW', 'int_org', '1993-01-13', '1997-04-29', '2023-11-01', 'active',
   'Prohibit development, production, stockpiling, and use of chemical weapons with verification',
   'The CWC is the most comprehensive arms control treaty, banning all chemical weapons and providing a robust verification regime through the OPCW. Unlike the BWC, it includes mandatory on-site inspections, declarations, and challenge inspections. It classifies chemicals into three Schedules based on risk. Relevant to biosurveillance because many biological toxins (e.g., ricin, saxitoxin) fall under CWC Schedules. The OPCW has 193 member states.',
   '["Article I: General obligations - never use/develop/produce chemical weapons","Article III: Declarations of chemical weapons and facilities","Article IV-V: Destruction of chemical weapons and production facilities","Article VI: Activities not prohibited - industry verification","Article IX: Challenge inspections","Article X: Assistance and protection against chemical weapons","Article XI: Economic and technological development","Verification Annex: Detailed inspection procedures"]',
   '["Declare all chemical weapons and production facilities","Destroy chemical weapons stocks and facilities under OPCW verification","Accept routine inspections of declared facilities","Accept challenge inspections","Enact national implementing legislation","Submit annual declarations"]',
   '["state_parties","chemical_industry","research_institutions","military"]',
   '["global"]',
   1, 0, 0, 1, 0, 1, 'mandatory', 'https://www.opcw.org/chemical-weapons-convention',
   'Saudi Arabia ratified the CWC in 1996. KSA maintains declared chemical industry facilities subject to OPCW inspection. Relevant to BioR for toxin surveillance (ricin, botulinum toxin etc. overlap between chemical and biological threats).',
   'Ministry of Foreign Affairs; OPCW National Authority', 'adopted',
   '["chemical_weapons","verification","OPCW","toxins","dual_use","inspection"]'),

  ('inst-003', 'dom-01', 'cat-02', 'IHR-2005', 'International Health Regulations (2005)', 'IHR (2005)', 'regulation', 'international', 'WHO', 'un_agency', '2005-05-23', '2007-06-15', '2024-06-01', 'active',
   'Prevent and respond to acute public health risks with potential to cross borders',
   'The IHR (2005) is a legally binding instrument for 196 countries. It requires states to develop core public health capacities for surveillance, detection, assessment, reporting, and response to public health events of international concern (PHEICs). The 2024 amendments entered into force on 19 September 2025, strengthening national IHR authorities and equity provisions. The IHR defines 13 core capacities that all states must develop and maintain. It establishes the National IHR Focal Point (NFP) system for 24/7 communication with WHO.',
   '["Article 5-6: Surveillance and notification obligations","Article 12: Determination of PHEIC by WHO Director-General","Article 13: Public health response obligations","Article 44: Collaboration and assistance","Annex 1: Core capacity requirements for surveillance and response","Annex 2: Decision instrument for assessment and notification of events"]',
   '["Develop and maintain 13 core capacities within defined timelines","Notify WHO of events that may constitute a PHEIC within 24 hours","Assess events using Annex 2 decision instrument","Designate National IHR Focal Point for 24/7 communication","Maintain surveillance at points of entry","Develop national action plans based on JEE findings"]',
   '["state_parties","national_health_authorities","laboratories","ports_airports","WHO"]',
   '["global"]',
   1, 1, 1, 1, 1, 1, 'mandatory', 'https://www.who.int/health-topics/international-health-regulations',
   'Saudi Arabia is a state party to the IHR (2005). The Saudi Public Health Authority (Weqaya) serves as the National IHR Focal Point. KSA has a unique obligation due to the Hajj and Umrah mass gatherings requiring exceptional surveillance capacity. Saudi Arabia scored well on the 2024 JEE assessment but identified gaps in laboratory networking and event-based surveillance.',
   'Saudi Public Health Authority (Weqaya); Ministry of Health', 'adopted',
   '["IHR","PHEIC","surveillance","notification","core_capacities","NFP","mass_gatherings","Hajj"]'),

  ('inst-004', 'dom-01', 'cat-04', 'UNSCR-1540', 'United Nations Security Council Resolution 1540', 'UNSCR 1540', 'resolution', 'international', 'United Nations', 'int_org', '2004-04-28', '2004-04-28', '2022-11-30', 'active',
   'Prevent proliferation of nuclear, chemical, and biological weapons to non-state actors',
   'UNSCR 1540 is a binding Security Council resolution requiring all states to adopt legislation to prevent the proliferation of WMD (including biological weapons) and their means of delivery, particularly to non-state actors. It requires states to establish domestic controls over related materials, including physical protection, border controls, export controls, and law enforcement measures. The 1540 Committee monitors implementation and provides assistance. Resolution 2663 (2022) extended the mandate to 2032.',
   '["OP1: Refrain from providing support to non-state actors for WMD","OP2: Adopt/enforce laws prohibiting non-state actor WMD activities","OP3(a): Develop/maintain measures for physical protection","OP3(b): Develop/maintain measures for border/export controls","OP3(c): Establish domestic controls for transport/transfer","OP3(d): Establish national export and trans-shipment controls"]',
   '["Enact national legislation criminalizing WMD proliferation to non-state actors","Establish physical protection measures for biological materials","Implement border controls to detect/prevent illicit trafficking","Maintain export controls on dual-use biological materials","Submit national implementation reports to the 1540 Committee","Designate a national point of contact"]',
   '["all_un_member_states","customs_authorities","export_control_agencies","law_enforcement"]',
   '["global"]',
   1, 0, 0, 1, 0, 1, 'mandatory', 'https://www.un.org/disarmament/wmd/sc1540/',
   'Saudi Arabia has submitted implementation reports to the 1540 Committee. KSA maintains export controls on dual-use materials through customs regulations. Enhancement of biological material tracking and physical protection measures align with BioR biosecurity objectives.',
   'Ministry of Foreign Affairs; General Authority for Export Control; Customs Authority', 'adopted',
   '["UNSCR","non_proliferation","WMD","export_control","non_state_actors","physical_protection"]'),

  ('inst-005', 'dom-01', 'cat-03', 'CBD', 'Convention on Biological Diversity', 'CBD', 'convention', 'international', 'UNEP', 'un_agency', '1992-06-05', '1993-12-29', '2022-12-19', 'active',
   'Conservation of biological diversity, sustainable use, and fair sharing of genetic resources',
   'The CBD is a comprehensive treaty covering all aspects of biological diversity. Its Cartagena Protocol on Biosafety (2003) governs the transboundary movement of Living Modified Organisms (LMOs/GMOs). The Nagoya Protocol (2014) addresses access to genetic resources and benefit-sharing. The Kunming-Montreal Global Biodiversity Framework (2022) set targets through 2030. Relevant to biosurveillance for regulation of genetic resources, pathogen sharing, and biosafety of GMOs.',
   '["Article 8(g): Regulate/manage risks from LMOs","Article 15: Access to genetic resources","Article 19: Handling of biotechnology and distribution of benefits","Cartagena Protocol: Advance informed agreement for LMO transfer","Nagoya Protocol: Access and benefit-sharing for genetic resources","Kunming-Montreal Framework: 4 goals, 23 targets for 2030"]',
   '["Develop national biosafety frameworks for LMOs","Implement access and benefit-sharing legislation","Regulate transboundary movement of genetic resources","Report on national biodiversity strategies"]',
   '["state_parties","research_institutions","biotechnology_industry","national_biodiversity_authorities"]',
   '["global"]',
   0, 1, 0, 0, 0, 1, 'mandatory', 'https://www.cbd.int',
   'Saudi Arabia ratified the CBD in 2001. The Saudi National Center for Wildlife serves as CBD focal point. Relevant to BioR for pathogen genetic resource sharing under the Nagoya Protocol and biosafety regulation of GMO research.',
   'National Center for Wildlife; Ministry of Environment; KAUST', 'adopted',
   '["biodiversity","biosafety","genetic_resources","Nagoya_Protocol","Cartagena","LMO","GMO"]'),

  ('inst-006', 'dom-01', 'cat-02', 'NAPPO', 'Nagoya Protocol on Access to Genetic Resources and the Fair and Equitable Sharing of Benefits', 'Nagoya Protocol', 'protocol', 'international', 'UNEP', 'un_agency', '2010-10-29', '2014-10-12', NULL, 'active',
   'Ensure fair and equitable sharing of benefits from utilization of genetic resources',
   'The Nagoya Protocol creates a transparent legal framework for access to genetic resources and fair benefit-sharing. Critical for pathogen sharing — when countries collect and share disease-causing pathogens for research, the protocol governs how benefits (vaccines, diagnostics, treatments) are shared back. This is directly relevant to pandemic preparedness and biosurveillance.',
   '["Article 5: Fair and equitable benefit-sharing","Article 6: Access to genetic resources requires prior informed consent","Article 8: Special considerations for research with emergency purpose","Article 12: Traditional knowledge associated with genetic resources"]',
   '["Establish national access and benefit-sharing legislation","Designate national competent authorities and focal points","Ensure prior informed consent for genetic resource access","Establish mutually agreed terms for benefit-sharing"]',
   '["state_parties","research_institutions","pharmaceutical_industry","laboratories"]',
   '["global"]',
   0, 1, 1, 0, 1, 1, 'mandatory', 'https://www.cbd.int/abs/',
   'Saudi Arabia is a party. Critical for BioR pathogen sharing arrangements — when Saudi labs send samples internationally for sequencing or analysis, Nagoya Protocol provisions apply.',
   'National Center for Wildlife; Ministry of Environment', 'adopted',
   '["genetic_resources","benefit_sharing","pathogen_sharing","access","traditional_knowledge"]');

-- ─── DOMAIN 2: INTERNATIONAL FRAMEWORKS & INITIATIVES ────────────────────────

INSERT OR IGNORE INTO rskb_instruments (id, domain_id, category_id, code, title, short_title, instrument_type, scope, issuing_body, issuing_body_type, adopted_date, entry_into_force, last_amended, status, purpose, summary, key_provisions, obligations, applies_to, geographic_scope, sector_biosecurity, sector_biosafety, sector_biosurveillance, sector_biodefense, sector_public_health, sector_amr, binding_level, official_url, sa_relevance, sa_implementing_body, sa_status, tags) VALUES
  ('inst-007', 'dom-02', 'cat-05', 'GHSA', 'Global Health Security Agenda', 'GHSA', 'framework', 'international', 'GHSA', 'int_org', '2014-02-13', '2014-02-13', '2024-06-01', 'active',
   'Accelerate progress toward a world safe and secure from infectious disease threats',
   'The GHSA is a multilateral initiative of over 70 countries, international organizations, and non-governmental stakeholders to strengthen global capacity to prevent, detect, and respond to infectious disease threats. It operates through Action Packages organized into three pillars: Prevent, Detect, and Respond. The GHSA 2024 Framework extended targets through 2024, and GHSA 2028 Framework continues the mission. Key action packages include biosafety/biosecurity (P3), real-time surveillance (D1), national laboratory systems (D5), and emergency operations (R1).',
   '["Prevent-1 (P1): Antimicrobial Resistance","Prevent-2 (P2): Zoonotic Disease","Prevent-3 (P3): Biosafety and Biosecurity","Detect-1 (D1): National Laboratory System","Detect-2 (D2): Surveillance Systems","Detect-3 (D3): Reporting","Detect-4 (D4): Workforce Development","Respond-1 (R1): Emergency Operations","Respond-2 (R2): Linking Public Health and Law Enforcement","Respond-3 (R3): Medical Countermeasures"]',
   '["Conduct Joint External Evaluation (JEE)","Develop National Action Plan for Health Security (NAPHS)","Build and maintain 13 IHR core capacities","Strengthen laboratory networks","Establish emergency operations centers","Train field epidemiology workforce"]',
   '["member_countries","national_health_authorities","laboratories","emergency_services"]',
   '["global"]',
   1, 1, 1, 1, 1, 1, 'voluntary', 'https://globalhealthsecurityagenda.org',
   'Saudi Arabia is a GHSA member. KSA completed its first JEE assessment and developed a National Action Plan for Health Security. Saudi Arabia co-leads GHSA activities in the EMRO region. Hajj mass gathering preparedness is a priority area.',
   'Saudi Public Health Authority (Weqaya); Ministry of Health', 'adopted',
   '["GHSA","health_security","JEE","NAPHS","action_packages","prevent","detect","respond"]'),

  ('inst-008', 'dom-02', 'cat-07', 'JEE', 'Joint External Evaluation Tool', 'JEE', 'framework', 'international', 'WHO', 'un_agency', '2016-02-01', '2016-02-01', '2022-01-01', 'active',
   'Assess country capacity to prevent, detect, and respond to public health threats',
   'The JEE is a voluntary, collaborative, multisectoral process to assess a country''s IHR core capacity. The third edition (JEE 3.0, 2022) evaluates 19 technical areas across 4 areas: Prevent, Detect, Respond, and IHR-related hazards. Scores range from 1 (No capacity) to 5 (Sustainable capacity). JEE results inform National Action Plans for Health Security (NAPHS) and guide investment in health security infrastructure.',
   '["19 technical areas across 4 pillars","Scoring: 1=No capacity, 2=Limited, 3=Developed, 4=Demonstrated, 5=Sustainable","Prevent: National legislation, IHR coordination, AMR, Zoonotic disease, Food safety, Biosafety/biosecurity, Immunization","Detect: National laboratory system, Surveillance, Reporting, Workforce development","Respond: Emergency preparedness, Emergency operations, Countermeasures, Risk communication","IHR-related hazards: Points of entry, Chemical events, Radiation emergencies"]',
   '["Conduct self-assessment using SPAR tool","Host peer review mission (JEE)","Develop National Action Plan for Health Security based on JEE findings","Conduct After Action Reviews for public health events","Report annually through State Party Annual Reporting (SPAR)"]',
   '["WHO_member_states","national_health_authorities","laboratories","emergency_services"]',
   '["global"]',
   1, 1, 1, 1, 1, 1, 'voluntary', 'https://www.who.int/emergencies/operations/international-health-regulations-monitoring-evaluation-framework/joint-external-evaluations',
   'Saudi Arabia completed its JEE assessment. Key strengths: emergency operations, immunization, and laboratory capacity. Key gaps identified: event-based surveillance, workforce sustainability, and cross-border surveillance coordination. BioR directly supports Saudi JEE scores in surveillance and laboratory networking.',
   'Saudi Public Health Authority (Weqaya)', 'adopted',
   '["JEE","evaluation","IHR","core_capacities","NAPHS","SPAR","health_security_assessment"]'),

  ('inst-009', 'dom-02', 'cat-06', 'OH-JPA', 'One Health Joint Plan of Action 2022-2026', 'OH-JPA', 'action_plan', 'international', 'WHO', 'un_agency', '2022-10-17', '2022-10-17', NULL, 'active',
   'Strengthen collaboration across human, animal, plant, and environmental health',
   'The OH-JPA is a joint initiative of the Quadripartite (WHO, FAO, WOAH, UNEP) providing a framework for integrated One Health action. It identifies 6 action tracks: health systems, emerging threats, endemic diseases, food safety, AMR, and environment. Recognizes that 75% of emerging infectious diseases are zoonotic, requiring integrated human-animal-environment surveillance.',
   '["Action Track 1: Enhanced One Health capacities for health systems","Action Track 2: Reducing risks from emerging/re-emerging zoonotic epidemics and pandemics","Action Track 3: Control/eliminate endemic zoonotic, neglected tropical and vector-borne diseases","Action Track 4: Strengthening food safety","Action Track 5: Reducing antimicrobial resistance","Action Track 6: Integrating the environment into One Health"]',
   '["Establish national One Health coordination mechanisms","Conduct joint risk assessments","Develop integrated surveillance systems","Share data across human, animal, and environmental health sectors"]',
   '["national_governments","veterinary_services","public_health_agencies","environmental_agencies"]',
   '["global"]',
   1, 1, 1, 0, 1, 1, 'voluntary', 'https://www.who.int/publications/i/item/9789240059139',
   'Saudi Arabia has MERS-CoV as a priority One Health threat. KSA established One Health coordination between MOH, MEWA (animal health), and PHA. BioR integrates zoonotic disease surveillance which directly supports One Health objectives.',
   'Saudi Public Health Authority; Ministry of Environment, Water and Agriculture', 'partially_adopted',
   '["One_Health","zoonotic","Quadripartite","integrated_surveillance","AMR","food_safety"]'),

  ('inst-010', 'dom-02', 'cat-08', 'GAP-AMR', 'Global Action Plan on Antimicrobial Resistance', 'GAP-AMR', 'action_plan', 'international', 'WHO', 'un_agency', '2015-05-25', '2015-05-25', '2024-09-01', 'active',
   'Ensure continuity of treatment and prevention of infectious diseases with effective medicines',
   'The GAP-AMR provides a strategic framework for national and global AMR action. It defines 5 strategic objectives: awareness, surveillance/research, infection prevention, optimized antimicrobial use, and sustainable investment. Countries are required to develop National Action Plans on AMR aligned with the GAP. The 2024 UN High-Level Meeting on AMR reaffirmed commitments with a target of reducing AMR-attributable deaths by 10% by 2030.',
   '["Objective 1: Improve awareness and understanding through communication/education","Objective 2: Strengthen knowledge/evidence through surveillance and research","Objective 3: Reduce incidence of infection through sanitation, hygiene, and IPC","Objective 4: Optimize use of antimicrobial medicines","Objective 5: Develop economic case for sustainable investment"]',
   '["Develop National Action Plan on AMR within 2 years","Establish AMR surveillance system linked to GLASS","Implement antimicrobial stewardship programs","Regulate antimicrobial use in human and veterinary medicine","Report to WHO GLASS annually"]',
   '["national_governments","health_facilities","veterinary_services","agriculture","pharmaceutical_industry"]',
   '["global"]',
   0, 0, 1, 0, 1, 1, 'voluntary', 'https://www.who.int/publications/i/item/9789241509763',
   'Saudi Arabia developed its National Action Plan on AMR (2017). KSA participates in GLASS (Global AMR Surveillance System) with 12+ sentinel laboratories. BioR AMR heatmap and surveillance modules directly support GAP-AMR Objective 2.',
   'Saudi Ministry of Health; SFDA; Saudi Public Health Authority', 'adopted',
   '["AMR","antimicrobial_resistance","GLASS","stewardship","surveillance","One_Health"]');

-- ─── DOMAIN 3: STANDARDS & TECHNICAL NORMS ───────────────────────────────────

INSERT OR IGNORE INTO rskb_instruments (id, domain_id, category_id, code, title, short_title, instrument_type, scope, issuing_body, issuing_body_type, adopted_date, entry_into_force, last_amended, status, purpose, summary, key_provisions, obligations, applies_to, geographic_scope, sector_biosecurity, sector_biosafety, sector_biosurveillance, sector_laboratory, binding_level, official_url, sa_relevance, sa_implementing_body, sa_status, tags) VALUES
  ('inst-011', 'dom-03', 'cat-09', 'ISO-35001', 'ISO 35001:2019 Biorisk Management for Laboratories and Other Related Organisations', 'ISO 35001', 'standard', 'international', 'ISO', 'standards_body', '2019-08-01', '2019-08-01', NULL, 'active',
   'Provide a process to identify, assess, control, and monitor risks associated with hazardous biological materials',
   'ISO 35001 is the international standard for biorisk management in laboratories. It replaces the earlier CWA 15793 and provides a systematic approach to managing biosafety and biosecurity risks. Based on the Plan-Do-Check-Act cycle. Applicable to any organization working with biological agents, including diagnostic, research, and production laboratories. Covers both biosafety (unintentional exposure) and biosecurity (intentional misuse).',
   '["Clause 4: Context of the organization - understanding internal/external factors","Clause 5: Leadership - top management commitment and policy","Clause 6: Planning - risk assessment and treatment","Clause 7: Support - resources, competence, awareness, communication","Clause 8: Operation - operational planning, risk assessment, risk treatment","Clause 9: Performance evaluation - monitoring, internal audit, management review","Clause 10: Improvement - nonconformity, corrective action, continual improvement","Annex A: Biorisk assessment methodology","Annex B: Inventory of biological materials"]',
   '["Conduct comprehensive biorisk assessments","Establish biorisk management policy","Maintain biological materials inventory","Implement physical security measures","Train all personnel in biosafety/biosecurity","Conduct regular internal audits","Maintain emergency response procedures"]',
   '["laboratories","research_institutions","diagnostic_facilities","production_facilities"]',
   '["global"]',
   1, 1, 0, 1, 'voluntary', 'https://www.iso.org/standard/71293.html',
   'Saudi PHA National Laboratory Biosafety and Biosecurity Manual (2024) references ISO 35001 as a best practice standard. Saudi labs pursuing international accreditation increasingly adopt ISO 35001 alongside ISO 15189.',
   'Saudi PHA; SASO; SFDA', 'partially_adopted',
   '["biorisk","biosafety","biosecurity","laboratory","risk_assessment","PDCA","ISO"]'),

  ('inst-012', 'dom-03', 'cat-10', 'ISO-15189', 'ISO 15189:2022 Medical Laboratories — Requirements for Quality and Competence', 'ISO 15189', 'standard', 'international', 'ISO', 'standards_body', '2003-02-01', '2003-02-01', '2022-12-01', 'active',
   'Specify requirements for quality and competence in medical laboratories',
   'ISO 15189 is the primary international standard for medical laboratory quality management. The 2022 revision aligns with ISO/IEC 17025 and ISO 9001 while adding specific requirements for medical laboratories. Covers pre-examination, examination, and post-examination processes. Required for laboratory accreditation by national bodies. Key for biosurveillance as it ensures diagnostic results are reliable and comparable across laboratories.',
   '["Clause 5: Structural and governance requirements","Clause 6: Resource requirements (personnel, facilities, equipment)","Clause 7: Process requirements (pre-examination, examination, post-examination)","Clause 8: Management system requirements","Risk-based approach to quality management","Patient safety focus","Metrological traceability requirements"]',
   '["Implement quality management system","Validate all examination procedures","Participate in proficiency testing programs","Maintain metrological traceability","Ensure personnel competence","Document and control all processes","Conduct internal audits and management reviews"]',
   '["medical_laboratories","diagnostic_laboratories","reference_laboratories","point_of_care_testing"]',
   '["global"]',
   0, 1, 1, 1, 'voluntary', 'https://www.iso.org/standard/76677.html',
   'Saudi CBAHI (Central Board for Accreditation of Healthcare Institutions) mandates ISO 15189 accreditation for hospital laboratories. Saudi national reference laboratories are ISO 15189 accredited. BioR laboratory networking module depends on standardized quality across labs.',
   'Saudi CBAHI; SASO; Saudi PHA', 'adopted',
   '["laboratory_quality","accreditation","medical_laboratory","QMS","competence","ISO"]'),

  ('inst-013', 'dom-03', 'cat-11', 'WOAH-TAHC', 'WOAH Terrestrial Animal Health Code', 'Terrestrial Code', 'code_of_practice', 'international', 'WOAH', 'int_org', '1968-01-01', '1968-01-01', '2025-09-05', 'active',
   'Ensure safety of international trade in terrestrial animals and their products',
   'The Terrestrial Animal Health Code (Terrestrial Code) sets international standards for animal health and zoonoses. Updated annually by the WOAH World Assembly. Contains standards for disease prevention, surveillance, diagnosis, and trade in terrestrial animals. Key chapters cover zoonotic diseases (rabies, brucellosis, avian influenza, anthrax), surveillance principles, veterinary legislation, and antimicrobial resistance. Critical for One Health biosurveillance.',
   '["Chapter 1.4: Animal health surveillance","Chapter 1.5: Surveillance for arthropod vectors","Chapter 4.5: Application of compartmentalisation","Chapter 6.7-6.11: Antimicrobial resistance chapters","Chapter 8.Y: Disease-specific chapters (avian influenza, anthrax, brucellosis, etc.)","Chapter 15: Avian influenza","Section 7: Veterinary public health"]',
   '["Implement surveillance systems for listed diseases","Report disease events to WOAH within 24 hours","Apply sanitary measures based on international standards","Maintain veterinary services meeting WOAH standards","Conduct PVS (Performance of Veterinary Services) evaluations"]',
   '["WOAH_member_countries","veterinary_services","animal_health_laboratories"]',
   '["global"]',
   1, 1, 1, 1, 'mandatory', 'https://www.woah.org/en/what-we-do/standards/codes-and-manuals/terrestrial-code/',
   'Saudi Arabia is a WOAH member. KSA veterinary services report to WOAH through WAHIS. Relevant for BioR zoonotic disease surveillance (MERS-CoV, avian influenza, Rift Valley fever, brucellosis). Saudi Arabia completed PVS evaluation.',
   'Ministry of Environment, Water and Agriculture; Saudi Veterinary Services', 'adopted',
   '["animal_health","zoonotic","WOAH","surveillance","trade","veterinary","avian_influenza","brucellosis"]'),

  ('inst-014', 'dom-03', 'cat-12', 'ISO-27001', 'ISO/IEC 27001:2022 Information Security Management Systems', 'ISO 27001', 'standard', 'international', 'ISO', 'standards_body', '2005-10-15', '2005-10-15', '2022-10-25', 'active',
   'Establish, implement, maintain, and continually improve an information security management system',
   'ISO 27001 is the international standard for information security management. Critical for biosurveillance platforms handling sensitive health data, patient information, and national security intelligence. Requires risk assessment, security controls, and continuous improvement. BioR implements AES-256-GCM encryption and access controls aligned with ISO 27001 principles.',
   '["Clause 4: Context and scope","Clause 5: Leadership and commitment","Clause 6: Risk assessment and treatment planning","Clause 7: Support resources and competence","Clause 8: Operational security controls","Clause 9: Performance evaluation","Clause 10: Continual improvement","Annex A: 93 controls across 4 themes (Organizational, People, Physical, Technological)"]',
   '["Conduct information security risk assessment","Implement appropriate security controls","Document information security policies","Train all personnel in security awareness","Monitor and audit security controls","Manage incidents and business continuity"]',
   '["all_organizations_handling_sensitive_data","health_information_systems","biosurveillance_platforms"]',
   '["global"]',
   0, 0, 1, 1, 'voluntary', 'https://www.iso.org/standard/27001',
   'Saudi NCA (National Cybersecurity Authority) ECC framework references ISO 27001. BioR''s enterprise security architecture (AES-256-GCM, session fingerprinting, token blacklist, RBAC) aligns with ISO 27001 Annex A controls.',
   'Saudi NCA; SASO; CITC', 'adopted',
   '["information_security","ISMS","cybersecurity","data_protection","encryption","access_control"]');

-- ─── DOMAIN 4: NATIONAL LEGISLATION & REGULATIONS (SAUDI ARABIA) ─────────────

INSERT OR IGNORE INTO rskb_instruments (id, domain_id, category_id, code, title, short_title, instrument_type, scope, issuing_body, issuing_body_type, adopted_date, entry_into_force, status, purpose, summary, key_provisions, applies_to, geographic_scope, sector_biosecurity, sector_biosafety, sector_biosurveillance, sector_biodefense, sector_public_health, sector_laboratory, binding_level, official_url, sa_relevance, sa_implementing_body, sa_status, tags) VALUES
  ('inst-015', 'dom-04', 'cat-13', 'SA-NLBBSM', 'National Laboratory Biosafety and Biosecurity Manual', 'Saudi Biosafety Manual', 'manual', 'national', 'Saudi PHA', 'national_gov', '2024-11-27', '2024-11-27', 'active',
   'Provide comprehensive biosafety and biosecurity standards for Saudi laboratories',
   'The Saudi PHA National Laboratory Biosafety and Biosecurity Manual (v1.0, November 2024) establishes national standards aligned with WHO, CDC, and international best practices. Covers BSL-1 through BSL-4 requirements, risk group classification, biosafety cabinet use, PPE, decontamination, waste management, biological material inventory, personnel security, and emergency response. References ISO 35001 and WHO Laboratory Biosafety Manual.',
   '["Chapter 1: Introduction to biosafety and biosecurity","Chapter 2: Risk group classification of biological agents","Chapter 3: Biosafety levels (BSL-1 to BSL-4)","Chapter 4: Primary barriers (BSCs, PPE)","Chapter 5: Secondary barriers (facility design)","Chapter 6: Decontamination and waste management","Chapter 7: Biological material inventory and tracking","Chapter 8: Personnel reliability and security","Chapter 9: Transport of biological materials","Chapter 10: Emergency response procedures","Chapter 11: Institutional biosafety committees"]',
   '["all_laboratories_in_saudi_arabia","research_institutions","diagnostic_facilities","universities"]',
   '["Saudi Arabia"]',
   1, 1, 1, 0, 1, 1, 'mandatory', 'https://www.pha.gov.sa',
   'Directly applicable to all BioR-connected laboratories. Establishes the baseline biosafety and biosecurity standards that BioR must track compliance against.',
   'Saudi Public Health Authority (Weqaya)', 'adopted',
   '["biosafety","biosecurity","laboratory","BSL","risk_group","Saudi","PHA","manual"]'),

  ('inst-016', 'dom-04', 'cat-14', 'SA-PH-LAW', 'Saudi Public Health Law', 'Public Health Law', 'law', 'national', 'Saudi MOH', 'national_gov', '2020-01-01', '2020-01-01', 'active',
   'Regulate public health protection and disease prevention in Saudi Arabia',
   'The Saudi Public Health Law establishes the legal framework for disease surveillance, notification, quarantine, and public health emergency response. Mandates notification of communicable diseases within specified timeframes. Establishes powers for quarantine, isolation, and movement restriction. Covers food safety, environmental health, and occupational health. The PHA (Weqaya) was established under this law.',
   '["Mandatory notification of communicable diseases","Quarantine and isolation powers","Public health emergency declaration","Disease surveillance requirements","Vaccination and immunization mandates","Environmental health standards","Food safety oversight","Penalties for non-compliance"]',
   '["healthcare_facilities","laboratories","physicians","public_health_authorities"]',
   '["Saudi Arabia"]',
   0, 0, 1, 0, 1, 1, 'mandatory', 'https://www.moh.gov.sa',
   'BioR surveillance and threat detection modules support Saudi Public Health Law notification requirements. The platform''s alert system can trigger mandatory disease notifications.',
   'Ministry of Health; Saudi Public Health Authority', 'adopted',
   '["public_health","law","notification","quarantine","surveillance","Saudi","communicable_disease"]'),

  ('inst-017', 'dom-04', 'cat-15', 'SA-SFDA-BIO', 'SFDA Regulations for Biological Products', 'SFDA Biologics', 'regulation', 'national', 'Saudi SFDA', 'national_gov', '2018-01-01', '2018-01-01', 'active',
   'Regulate biological products including vaccines, blood products, and diagnostics in Saudi Arabia',
   'SFDA regulations cover the approval, manufacturing, import, distribution, and post-market surveillance of biological products in Saudi Arabia. Includes vaccines, blood products, gene therapies, cell therapies, and in-vitro diagnostics. Aligned with ICH, WHO prequalification, and GCC requirements. Establishes Good Manufacturing Practice (GMP) requirements for biological production facilities.',
   '["Registration requirements for biological products","GMP compliance for manufacturing","Pharmacovigilance and post-market surveillance","Import and export controls","Clinical trial requirements","Labeling and packaging standards"]',
   '["pharmaceutical_manufacturers","diagnostic_companies","blood_banks","research_institutions"]',
   '["Saudi Arabia"]',
   1, 1, 1, 0, 1, 1, 'mandatory', 'https://www.sfda.gov.sa',
   'SFDA regulations govern diagnostic kits and biological reagents used in BioR-connected laboratories. Relevant for quality assurance of surveillance diagnostic tools.',
   'Saudi Food and Drug Authority', 'adopted',
   '["SFDA","biological_products","vaccines","diagnostics","GMP","regulation","Saudi"]');

-- ─── DOMAIN 5: REGIONAL AGREEMENTS ───────────────────────────────────────────

INSERT OR IGNORE INTO rskb_instruments (id, domain_id, category_id, code, title, short_title, instrument_type, scope, issuing_body, issuing_body_type, adopted_date, entry_into_force, status, purpose, summary, key_provisions, applies_to, geographic_scope, sector_biosurveillance, sector_public_health, sector_amr, binding_level, official_url, sa_relevance, sa_implementing_body, sa_status, tags) VALUES
  ('inst-018', 'dom-05', 'cat-17', 'GCC-ICM', 'GCC Infection Control Manual', 'GCC Infection Control', 'manual', 'regional', 'GCC', 'regional_org', '2013-01-01', '2013-01-01', 'active',
   'Standardize infection prevention and control across GCC healthcare facilities',
   'The GCC Infection Control Manual (revised 2013) provides evidence-based guidelines for all healthcare settings in GCC states. Covers standard precautions, transmission-based precautions, hand hygiene, PPE use, environmental cleaning, device-associated infections, surgical site infections, and outbreak management. Aligned with WHO and CDC guidelines.',
   '["Standard and transmission-based precautions","Hand hygiene protocols","Environmental cleaning standards","Device-associated infection prevention","Outbreak investigation and management","AMR surveillance and reporting","Healthcare worker protection"]',
   '["healthcare_facilities","laboratories","GCC_member_states"]',
   '["GCC"]',
   1, 1, 0, 'recommended', 'https://www.moh.gov.sa/CCC/Documents',
   'Applied across all Saudi healthcare facilities. BioR threat detection module monitors infection outbreaks that trigger GCC IPC protocols.',
   'Saudi Ministry of Health; Saudi PHA', 'adopted',
   '["GCC","infection_control","IPC","healthcare","AMR","outbreak","hand_hygiene"]'),

  ('inst-019', 'dom-05', 'cat-18', 'EMRO-HSS', 'WHO EMRO Health Security Strategy 2023-2027', 'EMRO Health Security', 'strategy', 'regional', 'WHO-EMRO', 'un_agency', '2023-01-01', '2023-01-01', 'active',
   'Strengthen health security capacities in the Eastern Mediterranean Region',
   'The WHO EMRO Health Security Strategy addresses the unique challenges of the 22-country Eastern Mediterranean Region, including conflict-affected states, mass gatherings (Hajj/Umrah), and emerging infectious diseases (MERS-CoV). Focuses on strengthening IHR implementation, laboratory networks, event-based surveillance, and emergency preparedness. Supports the development of regional reference laboratory networks.',
   '["Strengthening IHR core capacities across 22 EMRO countries","Regional laboratory networking and reference lab designation","Event-based surveillance enhancement","Mass gathering health security","Conflict-affected states support","AMR surveillance coordination"]',
   '["EMRO_member_states","national_health_authorities","regional_reference_laboratories"]',
   '["EMRO"]',
   1, 1, 0, 'recommended', 'https://www.emro.who.int',
   'Saudi Arabia is a key EMRO member and contributor. KSA hosts the largest annual mass gathering (Hajj) requiring exceptional health security. BioR surveillance capabilities directly support EMRO health security objectives.',
   'Saudi Public Health Authority; Ministry of Health', 'adopted',
   '["EMRO","health_security","IHR","Hajj","mass_gathering","laboratory_network","MERS"]');

-- ─── DOMAIN 6: GUIDELINES & BEST PRACTICES ───────────────────────────────────

INSERT OR IGNORE INTO rskb_instruments (id, domain_id, category_id, code, title, short_title, instrument_type, scope, issuing_body, issuing_body_type, adopted_date, last_amended, status, purpose, summary, key_provisions, applies_to, geographic_scope, sector_biosafety, sector_biosecurity, sector_laboratory, binding_level, official_url, sa_relevance, sa_implementing_body, sa_status, tags) VALUES
  ('inst-020', 'dom-06', 'cat-20', 'WHO-LBM4', 'WHO Laboratory Biosafety Manual, 4th Edition', 'WHO Biosafety Manual', 'manual', 'international', 'WHO', 'un_agency', '2020-12-01', '2023-01-01', 'active',
   'Provide practical guidance on biosafety and biosecurity for laboratory work',
   'The WHO Laboratory Biosafety Manual (4th edition) is the global reference for laboratory biosafety. Major shift from prescriptive BSL requirements to evidence-based risk assessment approach. Introduces the concept of a risk-based biosafety framework that considers the specific activities, agents, and context. Covers facility design, equipment, PPE, emergency response, training, and management. Used by over 190 countries as the primary biosafety reference.',
   '["Part I: Biosafety risk assessment framework","Part II: Core requirements for biosafety","Part III: Heightened control measures","Part IV: Maximum containment measures (BSL-4)","Monographs on specific biological agents","Risk assessment methodology (5-step process)","Biosafety cabinet selection and use","Decontamination and waste management"]',
   '["laboratories","biosafety_officers","institutional_biosafety_committees","national_authorities"]',
   '["global"]',
   1, 1, 1, 'recommended', 'https://www.who.int/publications/i/item/9789240011311',
   'Saudi PHA Biosafety Manual references WHO LBM4 as primary guidance. Saudi laboratories follow WHO risk assessment methodology. BioR compliance module tracks adherence to WHO biosafety guidelines.',
   'Saudi PHA; Institutional Biosafety Committees', 'adopted',
   '["biosafety","laboratory","WHO","risk_assessment","BSL","containment","decontamination"]'),

  ('inst-021', 'dom-06', 'cat-21', 'WHO-SURV-GUIDE', 'WHO Surveillance Standards for Communicable Diseases', 'WHO Surveillance Guide', 'guideline', 'international', 'WHO', 'un_agency', '2018-01-01', '2024-01-01', 'active',
   'Standardize surveillance case definitions, indicators, and reporting for communicable diseases',
   'Comprehensive guidance on establishing and operating communicable disease surveillance systems. Covers indicator-based surveillance (IBS), event-based surveillance (EBS), syndromic surveillance, sentinel surveillance, and laboratory-based surveillance. Defines standardized case definitions for priority diseases. Establishes reporting timelines and data quality indicators. The basis for IDSR (Integrated Disease Surveillance and Response) in Africa and similar systems worldwide.',
   '["Standardized case definitions for priority diseases","Indicator-based vs event-based surveillance","Sentinel surveillance design","Laboratory-based surveillance integration","Data quality indicators and monitoring","Outbreak detection algorithms","Reporting thresholds and timelines","Electronic surveillance system requirements"]',
   '["national_health_authorities","surveillance_officers","laboratories","epidemiologists"]',
   '["global"]',
   0, 0, 1, 'recommended', 'https://www.who.int/emergencies/surveillance',
   'BioR surveillance module implements WHO-standardized case definitions and reporting criteria. Saudi disease notification system follows WHO surveillance standards.',
   'Saudi PHA; Ministry of Health', 'adopted',
   '["surveillance","case_definition","EBS","IBS","sentinel","outbreak_detection","reporting"]'),

  ('inst-022', 'dom-06', 'cat-22', 'WHO-SHIP-GUIDE', 'WHO Guidance on Regulations for the Transport of Infectious Substances', 'WHO Transport Guide', 'guideline', 'international', 'WHO', 'un_agency', '2004-01-01', '2025-01-01', 'active',
   'Ensure safe transport of infectious substances and biological samples',
   'WHO guidance aligned with UN Model Regulations for the Transport of Dangerous Goods (Category A and B infectious substances). Covers classification, packaging (triple packaging system), labeling, documentation, and training requirements. Essential for all biological sample sharing between laboratories. Updated biennially to match UN Recommendations.',
   '["Classification: Category A (UN2814/UN2900) vs Category B (UN3373)","Triple packaging system requirements","Quantity limits per package","Labeling and marking requirements","Documentation (Shipper''s Declaration for Dangerous Goods)","Personnel training requirements","Cold chain maintenance","Emergency response procedures"]',
   '["laboratories","diagnostic_facilities","courier_services","customs_authorities"]',
   '["global"]',
   0, 1, 1, 'mandatory', 'https://www.who.int/publications/i/item/who-guidance-on-regulations-for-the-transport-of-infectious-substances-2025-2026',
   'All biological sample transport in Saudi Arabia must comply with WHO/UN transport regulations. Critical for BioR sample tracking and chain-of-custody module. Saudi airlines follow IATA Dangerous Goods Regulations aligned with WHO guidance.',
   'Saudi GACA; Saudi PHA; SFDA', 'adopted',
   '["transport","infectious_substances","packaging","triple_packaging","UN3373","Category_A","Category_B","shipping"]');

-- ─── DOMAIN 7: QUALITY ASSURANCE & ACCREDITATION ─────────────────────────────

INSERT OR IGNORE INTO rskb_instruments (id, domain_id, category_id, code, title, short_title, instrument_type, scope, issuing_body, issuing_body_type, adopted_date, last_amended, status, purpose, summary, key_provisions, applies_to, geographic_scope, sector_laboratory, binding_level, official_url, sa_relevance, sa_implementing_body, sa_status, tags) VALUES
  ('inst-023', 'dom-07', 'cat-24', 'ISO-17025', 'ISO/IEC 17025:2017 General Requirements for the Competence of Testing and Calibration Laboratories', 'ISO 17025', 'standard', 'international', 'ISO', 'standards_body', '1999-12-15', '2017-11-01', 'active',
   'Establish requirements for competent laboratory testing and calibration',
   'ISO 17025 is the general standard for the competence of testing and calibration laboratories. While ISO 15189 is specific to medical labs, ISO 17025 covers all testing laboratories including environmental, food safety, and veterinary diagnostic labs. Accreditation to ISO 17025 provides third-party assurance of laboratory competence. Required for laboratories performing environmental monitoring, food testing, and water quality analysis relevant to biosurveillance.',
   '["Clause 4: General requirements (impartiality, confidentiality)","Clause 5: Structural requirements","Clause 6: Resource requirements","Clause 7: Process requirements (method validation, measurement uncertainty)","Clause 8: Management system requirements"]',
   '["testing_laboratories","calibration_laboratories","environmental_laboratories","food_laboratories"]',
   '["global"]',
   1, 'voluntary', 'https://www.iso.org/standard/66912.html',
   'Saudi SASO accreditation body (SAC) provides ISO 17025 accreditation for Saudi testing labs. Environmental and food safety labs supporting biosurveillance require ISO 17025.',
   'SAC (Saudi Accreditation Center); SASO', 'adopted',
   '["laboratory","accreditation","testing","calibration","competence","ISO","quality"]'),

  ('inst-024', 'dom-07', 'cat-24', 'CBAHI-STD', 'CBAHI National Hospital Standards', 'CBAHI Standards', 'standard', 'national', 'Saudi MOH', 'national_gov', '2006-01-01', '2024-01-01', 'active',
   'Accredit healthcare institutions in Saudi Arabia against national quality and safety standards',
   'CBAHI (Central Board for Accreditation of Healthcare Institutions) is the Saudi national accreditation body for healthcare. CBAHI standards cover all aspects of healthcare quality including laboratory services, infection control, patient safety, and emergency management. Laboratory chapters mandate ISO 15189 compliance and participation in proficiency testing. CBAHI accreditation is mandatory for all Saudi hospitals.',
   '["Laboratory management and quality standards","Infection prevention and control","Patient safety goals","Emergency and disaster management","Medication management","Governance and leadership","Information management and technology","Staff qualifications and training"]',
   '["hospitals","primary_care_centers","laboratories","healthcare_facilities"]',
   '["Saudi Arabia"]',
   1, 'mandatory', 'https://portal.cbahi.gov.sa',
   'All BioR-connected healthcare facilities must maintain CBAHI accreditation. CBAHI lab standards ensure diagnostic quality for surveillance data feeding into BioR.',
   'CBAHI; Ministry of Health', 'adopted',
   '["CBAHI","accreditation","hospital","quality","Saudi","laboratory","patient_safety"]');

-- ─── DOMAIN 8: POLICIES & STRATEGIES ─────────────────────────────────────────

INSERT OR IGNORE INTO rskb_instruments (id, domain_id, category_id, code, title, short_title, instrument_type, scope, issuing_body, issuing_body_type, adopted_date, status, purpose, summary, key_provisions, applies_to, geographic_scope, sector_biosecurity, sector_biosafety, sector_biosurveillance, sector_biodefense, sector_public_health, binding_level, official_url, sa_relevance, sa_implementing_body, sa_status, tags) VALUES
  ('inst-025', 'dom-08', 'cat-27', 'US-GHSS-2024', 'U.S. Global Health Security Strategy 2024', 'US GHSS 2024', 'strategy', 'national', 'US Government', 'national_gov', '2024-04-01', 'active',
   'Outline US approach to strengthening global capacity to prevent, detect, and respond to infectious disease threats',
   'The 2024 US Global Health Security Strategy builds on the National Biodefense Strategy and NSM-15. It defines the US approach to strengthening global health security capacities aligned with IHR and GHSA. Key objectives: accelerate IHR implementation in partner countries, strengthen laboratory and surveillance systems, build emergency response capacity, combat AMR, and counter biological threats. The US invests $1B+ annually in global health security.',
   '["Goal 1: Strengthen global capacity to prevent infectious disease outbreaks","Goal 2: Strengthen global capacity to detect threats early","Goal 3: Strengthen global capacity for rapid and effective response","Goal 4: Foster a resilient global health security architecture","Emphasis on equity, workforce development, and sustainable financing"]',
   '["US_government_agencies","partner_countries","international_organizations"]',
   '["global"]',
   1, 1, 1, 1, 1, 'aspirational', 'https://www.whitehouse.gov/wp-content/uploads/2024/04/Global-Health-Security-Strategy-2024-1.pdf',
   'Saudi Arabia is a US partner in global health security. US CDC provides technical assistance to Saudi surveillance programs. Understanding US strategy helps align BioR with global investment priorities.',
   'Saudi PHA; Ministry of Foreign Affairs', 'not_adopted',
   '["US","global_health_security","strategy","biodefense","IHR","GHSA","pandemic_preparedness"]'),

  ('inst-026', 'dom-08', 'cat-27', 'US-BIODEF-2024', 'National Blueprint for Biodefense: Biodefense in Crisis', 'US Biodefense Blueprint 2024', 'strategy', 'national', 'Bipartisan Commission on Biodefense', 'professional_body', '2024-05-01', 'active',
   'Assess US biodefense posture and recommend improvements for biological threat preparedness',
   'The 2024 National Blueprint for Biodefense by the Bipartisan Commission highlights critical gaps in US biodefense. Covers natural, accidental, and deliberate biological threats. Recommends strengthening: indoor air quality standards, biosurveillance infrastructure, medical countermeasure development, international cooperation, and dual-use research oversight. Provides benchmark framework applicable to any nation''s biodefense assessment.',
   '["Assessment of current biodefense posture","Threat landscape analysis (natural, accidental, deliberate)","Recommendations for biosurveillance modernization","Medical countermeasure development pipeline","Indoor air quality and pathogen transmission reduction","International cooperation and norm-setting","Dual-use research of concern (DURC) oversight"]',
   '["national_security_agencies","public_health_authorities","research_institutions"]',
   '["United States"]',
   1, 1, 1, 1, 1, 'aspirational', 'https://biodefensecommission.org',
   'Provides a comprehensive biodefense assessment framework that can be adapted for Saudi Arabia. Identifies universal biodefense challenges relevant to BioR development.',
   NULL, 'not_adopted',
   '["biodefense","blueprint","strategy","MCM","DURC","biosurveillance","threat_assessment"]'),

  ('inst-027', 'dom-08', 'cat-28', 'SA-NAP-AMR', 'Saudi National Action Plan on Antimicrobial Resistance', 'Saudi NAP-AMR', 'action_plan', 'national', 'Saudi MOH', 'national_gov', '2017-01-01', 'active',
   'Combat antimicrobial resistance in Saudi Arabia through coordinated national action',
   'Saudi NAP-AMR aligns with the WHO Global Action Plan on AMR. Establishes a National AMR Surveillance System, antimicrobial stewardship programs, infection prevention and control measures, and public awareness campaigns. KSA participates in GLASS with 12+ sentinel laboratories. The plan covers human health, animal health (One Health approach), and environmental sectors.',
   '["Objective 1: Improve awareness through education and communication","Objective 2: Strengthen AMR surveillance and research","Objective 3: Reduce infection incidence through IPC","Objective 4: Optimize antimicrobial use through stewardship","Objective 5: Ensure sustainable investment and multi-sectoral coordination","National AMR Surveillance Network (12+ sentinel labs)","GLASS participation and data reporting"]',
   '["healthcare_facilities","laboratories","veterinary_services","pharmaceutical_sector"]',
   '["Saudi Arabia"]',
   0, 0, 1, 0, 1, 'recommended', 'https://www.moh.gov.sa',
   'BioR AMR heatmap and surveillance modules directly implement Saudi NAP-AMR objectives. AMR data from BioR-connected labs feeds into the national AMR surveillance network.',
   'Ministry of Health; Saudi PHA; SFDA', 'adopted',
   '["AMR","antimicrobial_resistance","stewardship","GLASS","surveillance","Saudi","NAP","One_Health"]');

-- =============================================================================
-- CROSS-REFERENCES (relationships between instruments)
-- =============================================================================
INSERT OR IGNORE INTO rskb_cross_references (id, source_id, target_id, relationship_type, description) VALUES
  ('xref-001', 'inst-003', 'inst-007', 'complements', 'IHR provides the legal basis; GHSA operationalizes implementation through action packages'),
  ('xref-002', 'inst-007', 'inst-008', 'implements', 'GHSA uses JEE as its primary evaluation tool for measuring country progress'),
  ('xref-003', 'inst-003', 'inst-008', 'implements', 'JEE evaluates country compliance with IHR core capacity requirements'),
  ('xref-004', 'inst-001', 'inst-004', 'complements', 'BWC addresses state-level biological weapons; UNSCR 1540 addresses non-state actor proliferation'),
  ('xref-005', 'inst-011', 'inst-020', 'harmonizes_with', 'ISO 35001 provides management system framework; WHO LBM4 provides technical biosafety guidance'),
  ('xref-006', 'inst-015', 'inst-011', 'derived_from', 'Saudi Biosafety Manual references and aligns with ISO 35001 standards'),
  ('xref-007', 'inst-015', 'inst-020', 'derived_from', 'Saudi Biosafety Manual references WHO Laboratory Biosafety Manual as primary guidance'),
  ('xref-008', 'inst-010', 'inst-027', 'implements', 'Saudi NAP-AMR implements WHO Global Action Plan on AMR at national level'),
  ('xref-009', 'inst-012', 'inst-024', 'implements', 'CBAHI laboratory standards mandate ISO 15189 accreditation for Saudi hospital labs'),
  ('xref-010', 'inst-009', 'inst-013', 'complements', 'One Health JPA and WOAH Terrestrial Code both address zoonotic disease surveillance'),
  ('xref-011', 'inst-003', 'inst-009', 'complements', 'IHR surveillance requirements complement One Health integrated surveillance approach'),
  ('xref-012', 'inst-005', 'inst-006', 'implements', 'Nagoya Protocol implements CBD Article 15 on access to genetic resources'),
  ('xref-013', 'inst-001', 'inst-002', 'complements', 'BWC covers biological weapons; CWC covers chemical weapons including biological toxins'),
  ('xref-014', 'inst-014', 'inst-012', 'complements', 'ISO 27001 information security complements ISO 15189 laboratory quality for data protection'),
  ('xref-015', 'inst-016', 'inst-003', 'implements', 'Saudi Public Health Law implements IHR requirements at national level'),
  ('xref-016', 'inst-019', 'inst-003', 'implements', 'EMRO Health Security Strategy operationalizes IHR implementation in the Eastern Mediterranean');

-- =============================================================================
-- REGULATED AGENTS (key biological agents for biosurveillance)
-- =============================================================================
INSERT OR IGNORE INTO rskb_regulated_agents (id, agent_name, agent_type, risk_group, bsl_required, select_agent, australia_group, bwc_relevant, sa_classification, who_classification, diseases, transmission_routes, pandemic_potential, amr_concern, governing_instruments) VALUES
  ('agent-001', 'Bacillus anthracis', 'bacteria', 3, 3, 1, 1, 1, 'High risk', 'Risk Group 3', '["Anthrax (cutaneous, inhalation, gastrointestinal)"]', '["contact","inhalation","ingestion"]', 'moderate', 0, '["inst-001","inst-004","inst-015"]'),
  ('agent-002', 'Yersinia pestis', 'bacteria', 3, 3, 1, 1, 1, 'High risk', 'Risk Group 3', '["Plague (bubonic, pneumonic, septicemic)"]', '["flea_bite","inhalation","contact"]', 'high', 1, '["inst-001","inst-004","inst-015"]'),
  ('agent-003', 'Francisella tularensis', 'bacteria', 3, 3, 1, 1, 1, 'High risk', 'Risk Group 3', '["Tularemia"]', '["tick_bite","inhalation","contact","ingestion"]', 'moderate', 0, '["inst-001","inst-004","inst-015"]'),
  ('agent-004', 'Variola major', 'virus', 4, 4, 1, 1, 1, 'Maximum containment', 'Risk Group 4', '["Smallpox"]', '["respiratory_droplets","contact"]', 'very_high', 0, '["inst-001","inst-004","inst-015"]'),
  ('agent-005', 'Ebola virus', 'virus', 4, 4, 1, 1, 1, 'Maximum containment', 'Risk Group 4', '["Ebola virus disease"]', '["contact_with_body_fluids"]', 'high', 0, '["inst-001","inst-004","inst-015","inst-003"]'),
  ('agent-006', 'MERS-CoV', 'virus', 3, 3, 0, 0, 0, 'High risk', 'Risk Group 3', '["Middle East Respiratory Syndrome"]', '["respiratory_droplets","camel_contact"]', 'moderate', 0, '["inst-003","inst-015","inst-013"]'),
  ('agent-007', 'Avian Influenza H5N1', 'virus', 3, 3, 1, 1, 1, 'High risk', 'Risk Group 3', '["Avian influenza in humans"]', '["bird_contact","respiratory"]', 'very_high', 0, '["inst-003","inst-013","inst-015"]'),
  ('agent-008', 'Clostridium botulinum toxin', 'toxin', 2, 2, 1, 1, 1, 'High risk', 'Risk Group 2', '["Botulism"]', '["ingestion","wound","inhalation"]', 'low', 0, '["inst-001","inst-002","inst-004"]'),
  ('agent-009', 'Brucella species', 'bacteria', 3, 3, 1, 1, 0, 'High risk', 'Risk Group 3', '["Brucellosis"]', '["contact","ingestion","inhalation"]', 'low', 0, '["inst-013","inst-015","inst-003"]'),
  ('agent-010', 'Mycobacterium tuberculosis', 'bacteria', 3, 3, 0, 0, 0, 'High risk', 'Risk Group 3', '["Tuberculosis"]', '["inhalation"]', 'moderate', 1, '["inst-003","inst-010","inst-015"]'),
  ('agent-011', 'Vibrio cholerae O1/O139', 'bacteria', 2, 2, 0, 0, 0, 'Moderate risk', 'Risk Group 2', '["Cholera"]', '["ingestion_contaminated_water"]', 'high', 1, '["inst-003","inst-015"]'),
  ('agent-012', 'Ricin toxin', 'toxin', 2, 2, 1, 1, 1, 'High risk', 'Schedule 1 (CWC)', '["Ricin poisoning"]', '["ingestion","inhalation","injection"]', 'low', 0, '["inst-001","inst-002","inst-004"]'),
  ('agent-013', 'Burkholderia pseudomallei', 'bacteria', 3, 3, 1, 1, 1, 'High risk', 'Risk Group 3', '["Melioidosis"]', '["contact_with_soil","inhalation","ingestion"]', 'low', 1, '["inst-001","inst-015"]'),
  ('agent-014', 'Nipah virus', 'virus', 4, 4, 0, 1, 1, 'Maximum containment', 'Risk Group 4', '["Nipah virus infection"]', '["bat_contact","pig_contact","human_to_human"]', 'very_high', 0, '["inst-001","inst-003","inst-015"]'),
  ('agent-015', 'Rift Valley fever virus', 'virus', 3, 3, 0, 1, 1, 'High risk', 'Risk Group 3', '["Rift Valley fever"]', '["mosquito_bite","animal_contact"]', 'moderate', 0, '["inst-003","inst-013","inst-015"]');

-- =============================================================================
-- CAPACITY AREAS (IHR 13 Core Capacities + GHSA Action Packages)
-- =============================================================================
INSERT OR IGNORE INTO rskb_capacity_areas (id, framework_instrument_id, code, name, category, description, sa_score, sa_level, target_score, sort_order) VALUES
  ('cap-01', 'inst-003', 'IHR-C1', 'National Legislation, Policy and Financing', 'other', 'Legal framework and financing for IHR implementation', 80, 'demonstrated', 90, 1),
  ('cap-02', 'inst-003', 'IHR-C2', 'IHR Coordination, Communication and Advocacy', 'other', 'National IHR Focal Point and coordination mechanisms', 85, 'demonstrated', 95, 2),
  ('cap-03', 'inst-003', 'IHR-C3', 'Surveillance', 'detect', 'Indicator-based and event-based surveillance systems', 75, 'developed', 90, 3),
  ('cap-04', 'inst-003', 'IHR-C4', 'Response', 'respond', 'Rapid response capacity for public health emergencies', 80, 'demonstrated', 90, 4),
  ('cap-05', 'inst-003', 'IHR-C5', 'Preparedness', 'respond', 'National public health emergency preparedness', 85, 'demonstrated', 95, 5),
  ('cap-06', 'inst-003', 'IHR-C6', 'Risk Communication', 'respond', 'Multi-hazard public health risk communication', 70, 'developed', 85, 6),
  ('cap-07', 'inst-003', 'IHR-C7', 'Human Resources', 'other', 'Trained public health workforce', 65, 'developed', 80, 7),
  ('cap-08', 'inst-003', 'IHR-C8', 'Laboratory', 'detect', 'National laboratory system and reference laboratory capacity', 80, 'demonstrated', 95, 8),
  ('cap-09', 'inst-003', 'IHR-C9', 'Points of Entry', 'prevent', 'Health surveillance at airports, ports, and ground crossings', 90, 'sustainable', 95, 9),
  ('cap-10', 'inst-003', 'IHR-C10', 'Zoonotic Events', 'prevent', 'One Health surveillance for zoonotic disease events', 70, 'developed', 85, 10),
  ('cap-11', 'inst-003', 'IHR-C11', 'Food Safety', 'prevent', 'Food safety surveillance and response', 75, 'developed', 85, 11),
  ('cap-12', 'inst-003', 'IHR-C12', 'Chemical Events', 'respond', 'Surveillance and response to chemical incidents', 60, 'limited', 80, 12),
  ('cap-13', 'inst-003', 'IHR-C13', 'Radiation Emergencies', 'respond', 'Surveillance and response to radiation emergencies', 55, 'limited', 75, 13),
  -- GHSA Action Packages
  ('cap-14', 'inst-007', 'GHSA-P1', 'Antimicrobial Resistance (Prevent)', 'prevent', 'National AMR surveillance, stewardship, and IPC', 75, 'developed', 90, 14),
  ('cap-15', 'inst-007', 'GHSA-P2', 'Zoonotic Disease (Prevent)', 'prevent', 'Joint human-animal surveillance for priority zoonoses', 70, 'developed', 85, 15),
  ('cap-16', 'inst-007', 'GHSA-P3', 'Biosafety and Biosecurity (Prevent)', 'prevent', 'Whole-of-government biosafety and biosecurity system', 65, 'developed', 85, 16),
  ('cap-17', 'inst-007', 'GHSA-D1', 'National Laboratory System (Detect)', 'detect', 'National laboratory system with quality management', 80, 'demonstrated', 90, 17),
  ('cap-18', 'inst-007', 'GHSA-D2', 'Surveillance Systems (Detect)', 'detect', 'Indicator- and event-based surveillance', 75, 'developed', 90, 18),
  ('cap-19', 'inst-007', 'GHSA-R1', 'Emergency Operations (Respond)', 'respond', 'Public health emergency operations center', 85, 'demonstrated', 95, 19),
  ('cap-20', 'inst-007', 'GHSA-R2', 'Public Health and Law Enforcement (Respond)', 'respond', 'Linking public health and security/law enforcement', 60, 'limited', 80, 20);

-- =============================================================================
-- FTS Index population (for full-text search)
-- =============================================================================
INSERT INTO rskb_instruments_fts(rowid, code, title, short_title, summary, purpose, tags)
  SELECT rowid, code, title, short_title, summary, purpose, tags FROM rskb_instruments;
