// =============================================================================
// BioR Platform - Admin / System Health Data Module
// =============================================================================

import type { SystemHealth, AuditEntry } from '../types';

export const systemHealth: SystemHealth = {
  overall: 'healthy',
  uptime: '99.7%',
  lastIncident: '2026-02-28 03:15',
  services: [
    { name: 'Data Ingestion Hub', status: 'healthy', uptime: '99.9%', latency: '45ms', load: 32, lastCheck: '1 min ago' },
    { name: 'Genomic Pipeline', status: 'healthy', uptime: '99.5%', latency: '180ms', load: 68, lastCheck: '2 min ago' },
    { name: 'EWS Engine', status: 'healthy', uptime: '99.8%', latency: '92ms', load: 41, lastCheck: '1 min ago' },
    { name: 'Alert Service', status: 'healthy', uptime: '99.9%', latency: '28ms', load: 15, lastCheck: '30 sec ago' },
    { name: 'OSINT NLP Engine', status: 'warning', uptime: '98.2%', latency: '320ms', load: 78, lastCheck: '5 min ago' },
    { name: 'Auth / Keycloak', status: 'healthy', uptime: '99.9%', latency: '35ms', load: 8, lastCheck: '1 min ago' },
    { name: 'PostgreSQL Primary', status: 'healthy', uptime: '99.9%', latency: '12ms', load: 42, lastCheck: '15 sec ago' },
    { name: 'OpenSearch Cluster', status: 'healthy', uptime: '99.7%', latency: '55ms', load: 52, lastCheck: '30 sec ago' },
    { name: 'MinIO Storage', status: 'healthy', uptime: '99.8%', latency: '65ms', load: 28, lastCheck: '1 min ago' },
    { name: 'Kafka Event Bus', status: 'healthy', uptime: '99.9%', latency: '8ms', load: 35, lastCheck: '15 sec ago' },
  ],
  storage: {
    postgresql: { used: 48, total: 500, unit: 'GB' },
    opensearch: { used: 18, total: 200, unit: 'GB' },
    minio: { used: 4800, total: 10000, unit: 'GB' },
    redis: { used: 2.4, total: 8, unit: 'GB' },
  },
  recentEvents: [
    { time: '10:15', event: 'Genomic pipeline batch #847 completed (12 samples)', type: 'info' },
    { time: '09:45', event: 'OSINT NLP engine response time elevated (320ms)', type: 'warning' },
    { time: '09:30', event: 'EWS risk score update completed for all 13 regions', type: 'info' },
    { time: '08:15', event: 'Level 3 alert generated: Cholera cluster', type: 'alert' },
    { time: '07:00', event: 'Daily data quality audit completed (avg: 86%)', type: 'info' },
    { time: '05:00', event: 'Scheduled backup completed successfully', type: 'info' },
    { time: '03:15', event: 'SSL certificate renewed for api.bior.gov', type: 'info' },
  ],
  // Data quality scorecard per institution
  dqScorecard: [
    { institution: 'King Faisal Specialist Hospital', score: 97, completeness: 98, timeliness: 96, accuracy: 97, trend: 'stable' },
    { institution: 'NEOM Health Hub', score: 95, completeness: 96, timeliness: 94, accuracy: 95, trend: 'rising' },
    { institution: 'King Fahad Medical City', score: 94, completeness: 95, timeliness: 93, accuracy: 94, trend: 'stable' },
    { institution: 'Khamis Mushait Military Hospital', score: 93, completeness: 94, timeliness: 92, accuracy: 93, trend: 'stable' },
    { institution: 'Madinah General Hospital', score: 92, completeness: 93, timeliness: 91, accuracy: 92, trend: 'rising' },
    { institution: 'Jeddah King Abdulaziz Airport', score: 91, completeness: 92, timeliness: 90, accuracy: 91, trend: 'stable' },
    { institution: 'Hofuf King Fahd Hospital', score: 91, completeness: 92, timeliness: 90, accuracy: 91, trend: 'stable' },
    { institution: 'King Abdullah Medical City', score: 90, completeness: 91, timeliness: 89, accuracy: 90, trend: 'falling' },
    { institution: 'Qassim Central Hospital', score: 89, completeness: 90, timeliness: 88, accuracy: 89, trend: 'stable' },
    { institution: 'Riyadh International Airport', score: 88, completeness: 89, timeliness: 87, accuracy: 88, trend: 'stable' },
    { institution: 'Taif General Hospital', score: 88, completeness: 89, timeliness: 87, accuracy: 88, trend: 'stable' },
    { institution: 'Hail Wastewater Facility', score: 87, completeness: 88, timeliness: 86, accuracy: 87, trend: 'stable' },
    { institution: 'Jubail Industrial Health', score: 86, completeness: 87, timeliness: 85, accuracy: 86, trend: 'rising' },
    { institution: 'Dammam Wastewater Treatment', score: 85, completeness: 86, timeliness: 84, accuracy: 85, trend: 'stable' },
    { institution: 'Najran Sentinel Surveillance', score: 83, completeness: 84, timeliness: 82, accuracy: 83, trend: 'stable' },
    { institution: 'Jeddah Port Authority', score: 82, completeness: 83, timeliness: 81, accuracy: 82, trend: 'falling' },
    { institution: 'Yanbu Industrial Env. Monitor', score: 81, completeness: 82, timeliness: 80, accuracy: 81, trend: 'stable' },
    { institution: 'Baha Regional Center', score: 80, completeness: 81, timeliness: 79, accuracy: 80, trend: 'stable' },
    { institution: 'Dhahran Environment Station', score: 79, completeness: 80, timeliness: 78, accuracy: 79, trend: 'falling' },
    { institution: 'Sakaka Health Center', score: 77, completeness: 78, timeliness: 76, accuracy: 77, trend: 'stable' },
    { institution: 'Tabuk Northern Border Post', score: 76, completeness: 77, timeliness: 75, accuracy: 76, trend: 'rising' },
    { institution: 'Jizan Health Directorate', score: 74, completeness: 75, timeliness: 73, accuracy: 74, trend: 'falling' },
    { institution: 'Arar Border Crossing', score: 73, completeness: 74, timeliness: 72, accuracy: 73, trend: 'stable' },
    { institution: 'Abha Regional Laboratory', score: 68, completeness: 70, timeliness: 66, accuracy: 68, trend: 'falling' },
  ],
};

export const auditLog: AuditEntry[] = [
  { id: 'AUD-001', timestamp: '2026-03-08 10:15:32', user: 'Dr Majed', action: 'Alert Review', resource: 'ALT-2026-0042', details: 'Viewed cholera cluster alert', ip: '10.0.1.45', tier: 4 },
  { id: 'AUD-002', timestamp: '2026-03-08 09:45:18', user: 'System (EWS)', action: 'Alert Generated', resource: 'ALT-2026-0042', details: 'Level 3 alert auto-generated by CUSUM engine', ip: 'system', tier: 0 },
  { id: 'AUD-003', timestamp: '2026-03-08 09:30:05', user: 'Dr. Fatima Hassan', action: 'Report Export', resource: 'RPT-W10', details: 'Exported W10 bulletin as PDF', ip: '10.0.2.12', tier: 3 },
  { id: 'AUD-004', timestamp: '2026-03-08 08:15:44', user: 'Dr. Khalid Mansoor', action: 'Sequence Submitted', resource: 'BioR-2026-SA-0847', details: 'SARS-CoV-2 sample submitted from KFSH', ip: '10.0.3.88', tier: 3 },
  { id: 'AUD-005', timestamp: '2026-03-07 18:00:22', user: 'Dr. Fatima Hassan', action: 'Alert Confirmed', resource: 'ALT-2026-0039', details: 'Dengue alert confirmed after review', ip: '10.0.2.12', tier: 3 },
  { id: 'AUD-006', timestamp: '2026-03-07 15:45:11', user: 'Dr Majed', action: 'Alert Confirmed', resource: 'ALT-2026-0041', details: 'MERS-CoV nosocomial alert confirmed', ip: '10.0.1.45', tier: 4 },
  { id: 'AUD-007', timestamp: '2026-03-07 14:30:00', user: 'System (ML)', action: 'Alert Generated', resource: 'ALT-2026-0041', details: 'LSTM anomaly detection flagged MERS pattern', ip: 'system', tier: 0 },
  { id: 'AUD-008', timestamp: '2026-03-07 10:00:33', user: 'System (Genomics)', action: 'AMR Alert', resource: 'BioR-2026-SA-0844', details: 'XDR K. pneumoniae detected with triple resistance', ip: 'system', tier: 0 },
  { id: 'AUD-009', timestamp: '2026-03-06 16:45:00', user: 'System (EWS)', action: 'Alert Generated', resource: 'ALT-2026-0039', details: 'Farrington algorithm flagged dengue surge', ip: 'system', tier: 0 },
  { id: 'AUD-010', timestamp: '2026-03-06 09:20:15', user: 'System (OSINT)', action: 'Signal Detected', resource: 'SIG-CCHF-001', details: 'ProMED CCHF article processed by AraBERT', ip: 'system', tier: 0 },
  { id: 'AUD-011', timestamp: '2026-03-05 14:00:44', user: 'Dr. Khalid Mansoor', action: 'Alert Confirmed', resource: 'ALT-2026-0037', details: 'MDR-TB cluster alert confirmed', ip: '10.0.3.88', tier: 3 },
  { id: 'AUD-012', timestamp: '2026-03-05 11:30:00', user: 'System (Genomics)', action: 'Alert Generated', resource: 'ALT-2026-0037', details: 'Phylogenetic analysis detected MDR-TB expansion', ip: 'system', tier: 0 },
];
