// =============================================================================
// BioR Platform - Dashboard Data Module
// =============================================================================

import type { DashboardData } from '../types';

export const dashboardData: DashboardData = {
  activeCases: 1247,
  sitesMonitored: 24,
  genomicSequences: 856,
  sequencesProcessed: 742,
  activeAlerts: 7,
  criticalAlerts: 2,
  threatLevel: 62,
  pendingReview: 3,
  dataQualityAvg: 86,
  ewsScores: { statistical: 42, ml: 38, osint: 55, genomic: 28, composite: 62 },
  sparklines: {
    cases: [980, 1020, 1050, 1080, 1040, 1100, 1120, 1090, 1150, 1180, 1200, 1210, 1230, 1247],
    sites: [22, 22, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24],
    sequences: [620, 640, 660, 690, 710, 720, 740, 760, 780, 800, 820, 835, 848, 856],
    alerts: [5, 6, 5, 4, 5, 7, 8, 7, 6, 8, 7, 6, 7, 7],
  },
  recentActivity: [
    { type: 'alert', message: 'Critical: Cholera cluster detected in Central District - 48 cases in 7 days', time: '12 min ago', icon: 'fa-exclamation-circle', severity: 'critical' },
    { type: 'genomic', message: 'Sequence BioR-2026-SA-0847 completed - Novel SARS-CoV-2 lineage BA.2.86.4 identified', time: '28 min ago', icon: 'fa-dna', severity: 'info' },
    { type: 'case', message: '15 new case reports ingested from King Fahad Medical City LIMS', time: '45 min ago', icon: 'fa-file-medical', severity: 'info' },
    { type: 'alert', message: 'Warning: MERS-CoV signal detected via OSINT - ProMED report from Eastern Province', time: '1h ago', icon: 'fa-newspaper', severity: 'warning' },
    { type: 'genomic', message: 'AMR detected: Carbapenem-resistant K. pneumoniae at Riyadh Central Lab', time: '2h ago', icon: 'fa-pills', severity: 'critical' },
    { type: 'case', message: 'Weekly aggregate complete: Epi Week 2026-W10, 340 confirmed cases nationwide', time: '3h ago', icon: 'fa-chart-bar', severity: 'info' },
    { type: 'system', message: 'Data quality alert: Jeddah General Hospital DQ score dropped to 68%', time: '4h ago', icon: 'fa-database', severity: 'warning' },
    { type: 'alert', message: 'EWS: CUSUM threshold breached for Dengue in Makkah Region', time: '5h ago', icon: 'fa-chart-line', severity: 'warning' },
    { type: 'system', message: 'Genomic pipeline v3.2.1 deployed successfully - 15% faster assembly', time: '6h ago', icon: 'fa-cogs', severity: 'info' },
    { type: 'case', message: 'MERS-CoV case investigation initiated at King Fahad Medical City', time: '7h ago', icon: 'fa-search', severity: 'warning' },
  ],
  topPathogens: [
    { name: 'SARS-CoV-2', cases: 487, trend: 'falling', severity: 'medium', percent: 65, weekChange: -12, lineage: 'BA.2.86 / JN.1' },
    { name: 'Vibrio cholerae O1', cases: 127, trend: 'rising', severity: 'critical', percent: 85, weekChange: +34, lineage: 'O1 El Tor' },
    { name: 'Dengue Virus', cases: 156, trend: 'rising', severity: 'high', percent: 55, weekChange: +18, lineage: 'DENV-2 Cosmopolitan' },
    { name: 'Mycobacterium tuberculosis', cases: 201, trend: 'stable', severity: 'medium', percent: 40, weekChange: +2, lineage: 'Lineage 4' },
    { name: 'Salmonella enterica', cases: 94, trend: 'stable', severity: 'medium', percent: 45, weekChange: -3, lineage: 'ST313' },
    { name: 'MERS-CoV', cases: 23, trend: 'rising', severity: 'high', percent: 70, weekChange: +8, lineage: 'Clade B' },
  ],
  mapMarkers: [
    { name: 'King Fahad Medical City', lat: 24.69, lng: 46.72, status: 'Active', type: 'Hospital', color: '#22c55e', cases: 45 },
    { name: 'Riyadh Airport Sentinel', lat: 24.96, lng: 46.70, status: 'Active', type: 'Airport', color: '#22c55e', cases: 12 },
    { name: 'Jeddah Port Authority', lat: 21.48, lng: 39.18, status: 'Alert', type: 'Border', color: '#ef4444', cases: 32 },
    { name: 'Makkah Central Hospital', lat: 21.42, lng: 39.82, status: 'Active', type: 'Hospital', color: '#22c55e', cases: 28 },
    { name: 'Dammam Wastewater Plant', lat: 26.43, lng: 50.10, status: 'Active', type: 'Wastewater', color: '#3b82f6', cases: 0 },
    { name: 'Madinah Sentinel Site', lat: 24.47, lng: 39.61, status: 'Active', type: 'Sentinel', color: '#22c55e', cases: 22 },
    { name: 'Tabuk Border Post', lat: 28.38, lng: 36.57, status: 'Active', type: 'Border', color: '#22c55e', cases: 5 },
    { name: 'Abha Regional Lab', lat: 18.22, lng: 42.50, status: 'Offline', type: 'Hospital', color: '#6b7280', cases: 15 },
    { name: 'Khobar Env. Monitor', lat: 26.27, lng: 50.21, status: 'Active', type: 'Environment', color: '#3b82f6', cases: 3 },
    { name: 'Jizan Health Center', lat: 16.89, lng: 42.55, status: 'Alert', type: 'Hospital', color: '#ef4444', cases: 41 },
    { name: 'Najran Sentinel', lat: 17.49, lng: 44.13, status: 'Active', type: 'Sentinel', color: '#22c55e', cases: 8 },
    { name: 'Hail Wastewater', lat: 27.52, lng: 41.69, status: 'Active', type: 'Wastewater', color: '#3b82f6', cases: 0 },
  ],
  regionBreakdown: [
    { name: 'Riyadh', cases: 412, color: '#00A86B' },
    { name: 'Makkah', cases: 287, color: '#3b82f6' },
    { name: 'Eastern', cases: 156, color: '#f59e0b' },
    { name: 'Madinah', cases: 134, color: '#8b5cf6' },
    { name: 'Asir', cases: 98, color: '#ef4444' },
    { name: 'Jizan', cases: 82, color: '#ec4899' },
    { name: 'Others', cases: 78, color: '#6b7280' },
  ],
  weeklyTrend: {
    labels: ['W51', 'W52', 'W01', 'W02', 'W03', 'W04', 'W05', 'W06', 'W07', 'W08', 'W09', 'W10'],
    confirmed: [210, 225, 245, 260, 255, 270, 280, 310, 295, 340, 325, 370],
    suspected: [320, 340, 360, 380, 375, 400, 420, 460, 445, 510, 490, 540],
    deaths: [2, 3, 2, 4, 3, 5, 3, 4, 5, 6, 4, 4],
  },
};
