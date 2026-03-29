// =============================================================================
// BioR Platform - Reports Data Module
// =============================================================================

import type { ReportsData } from '../types';

export const reports: ReportsData = {
  weeklyLabels: ['W05', 'W06', 'W07', 'W08', 'W09', 'W10'],
  confirmedCases: [280, 310, 295, 340, 325, 370],
  suspectedCases: [420, 460, 445, 510, 490, 540],
  positivityRate: [12.5, 14.2, 13.8, 15.1, 14.6, 16.3],
  pathogenLabels: ['SARS-CoV-2', 'Cholera', 'Dengue', 'MERS-CoV', 'Salmonella', 'TB'],
  pathogenCases: [487, 127, 156, 23, 94, 201],
  alertDistribution: [2, 4, 3, 12],
  // Regional breakdown
  regionLabels: ['Riyadh', 'Makkah', 'Eastern', 'Madinah', 'Jizan', 'Asir', 'Tabuk', 'Qassim', 'Northern', 'Najran', 'Hail', 'Al-Baha', 'Al-Jouf'],
  regionCases: [380, 285, 145, 88, 120, 72, 38, 52, 18, 22, 12, 8, 7],
  // Epi curve data (daily cases last 30 days)
  epiCurve: {
    dates: Array.from({length: 30}, (_, i) => { const d = new Date(2026, 1, 7+i); return d.toISOString().slice(5,10); }),
    confirmed: [8,12,10,15,14,11,13,16,18,14,12,17,19,22,20,18,15,21,24,19,16,23,25,28,22,20,26,30,24,28],
    suspected: [14,18,16,22,20,17,19,24,26,21,18,25,28,32,29,26,22,30,35,28,24,33,36,40,32,29,38,44,35,41],
  },
  // Monthly trend
  monthlyTrend: {
    months: ['Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026'],
    cases: [820, 910, 1050, 1180, 1150, 1247],
    deaths: [8, 12, 15, 18, 14, 12],
    sequences: [180, 220, 310, 420, 580, 856],
  },
  weeklyReports: [
    { title: 'National Epi Bulletin W10', period: 'Mar 4 - Mar 8, 2026', totalCases: 370, deaths: 4, status: 'Published', author: 'Dr Majed' },
    { title: 'National Epi Bulletin W09', period: 'Feb 25 - Mar 3, 2026', totalCases: 325, deaths: 2, status: 'Published', author: 'Dr Majed' },
    { title: 'National Epi Bulletin W08', period: 'Feb 18 - Feb 24, 2026', totalCases: 340, deaths: 5, status: 'Published', author: 'Dr Majed' },
    { title: 'Cholera Situation Report #3', period: 'Mar 1 - Mar 8, 2026', totalCases: 127, deaths: 3, status: 'Published', author: 'Dr. Fatima Hassan' },
    { title: 'MERS-CoV Weekly Update', period: 'Mar 1 - Mar 8, 2026', totalCases: 23, deaths: 4, status: 'Draft', author: 'Dr Majed' },
    { title: 'AMR Surveillance Summary', period: 'Feb 2026', totalCases: 52, deaths: 6, status: 'Published', author: 'Dr. Khalid Mansoor' },
  ]
};
