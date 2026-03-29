// =============================================================================
// BioR Platform - Early Warning System Data Module
// =============================================================================

import type { EWSData } from '../types';

export const ewsData: EWSData = {
  activeSignals: 14,
  newSignals24h: 3,
  nationalRiskScore: 62,
  riskTrend: 'rising',
  osintArticles: 2847,
  osintRelevant: 142,
  // Risk score history (last 30 days)
  riskHistory: {
    dates: Array.from({length: 30}, (_, i) => { const d = new Date(2026, 1, 7+i); return d.toISOString().slice(5,10); }),
    scores: [45,47,48,50,49,52,55,53,56,58,55,57,60,58,56,59,61,58,60,62,59,61,63,60,62,64,61,63,62,62],
  },
  // Forecast data
  forecast: {
    pathogen: 'Vibrio cholerae',
    region: 'Riyadh',
    days: ['Mar 9', 'Mar 10', 'Mar 11', 'Mar 12', 'Mar 13', 'Mar 14', 'Mar 15'],
    predicted: [18, 22, 25, 28, 26, 24, 21],
    upper: [24, 30, 34, 38, 35, 32, 28],
    lower: [12, 14, 16, 18, 17, 16, 14],
    confidence: 0.85,
    model: 'LSTM Ensemble v2.1',
  },
  regionalRisks: [
    { region: 'Riyadh', score: 72, trend: 'rising', change: '+5', topThreat: 'Cholera' },
    { region: 'Makkah', score: 68, trend: 'rising', change: '+3', topThreat: 'Dengue' },
    { region: 'Jizan', score: 65, trend: 'rising', change: '+4', topThreat: 'Dengue' },
    { region: 'Tabuk', score: 58, trend: 'rising', change: '+8', topThreat: 'CCHF' },
    { region: 'Eastern', score: 55, trend: 'stable', change: '+1', topThreat: 'MERS-CoV' },
    { region: 'Qassim', score: 48, trend: 'stable', change: '0', topThreat: 'Cholera' },
    { region: 'Northern', score: 44, trend: 'rising', change: '+6', topThreat: 'CCHF' },
    { region: 'Madinah', score: 42, trend: 'falling', change: '-3', topThreat: 'TB' },
    { region: 'Asir', score: 38, trend: 'stable', change: '0', topThreat: 'Dengue' },
    { region: 'Najran', score: 35, trend: 'falling', change: '-2', topThreat: 'RVF' },
    { region: 'Hail', score: 22, trend: 'stable', change: '0', topThreat: 'None' },
    { region: 'Al-Baha', score: 18, trend: 'falling', change: '-1', topThreat: 'None' },
    { region: 'Al-Jouf', score: 15, trend: 'stable', change: '0', topThreat: 'None' },
  ],
  detectionLayers: [
    { name: 'Statistical Detection', icon: 'fa-chart-line', color: 'emerald', signals: 5, description: 'CUSUM, Farrington, Bayesian changepoint algorithms running on weekly epi time-series data across 48 districts.', algorithms: ['CUSUM', 'Farrington', 'Serfling', 'EARS C1-C3'], lastRun: '08:00 today', nextRun: '14:00 today' },
    { name: 'ML Anomaly Detection', icon: 'fa-brain', color: 'blue', signals: 3, description: 'LSTM neural network + XGBoost ensemble analyzing 15-variable feature vectors. Retrained quarterly.', algorithms: ['LSTM', 'XGBoost', 'Isolation Forest'], lastRun: '06:00 today', nextRun: '12:00 today' },
    { name: 'OSINT / NLP Intelligence', icon: 'fa-newspaper', color: 'purple', signals: 4, description: 'Monitoring ProMED, WHO EIOS, HealthMap, 50+ news sources. AraBERT NLP for Arabic content.', algorithms: ['AraBERT', 'Named Entity Recognition', 'Sentiment Analysis'], lastRun: 'Continuous', nextRun: 'Continuous' },
    { name: 'Genomic Surveillance', icon: 'fa-dna', color: 'amber', signals: 2, description: 'Novel lineage detection, AMR gene emergence, phylogenetic cluster growth monitoring.', algorithms: ['Pangolin', 'AMRFinderPlus', 'IQ-TREE2'], lastRun: '07:30 today', nextRun: '13:30 today' },
  ],
  recentSignals: [
    { pathogen: 'Vibrio cholerae', region: 'Riyadh - Central District', type: 'Statistical', score: 82, description: 'CUSUM breach: 4x expected cases over 6-week baseline', time: '2h ago', source: 'CUSUM Algorithm', action: 'Alert generated' },
    { pathogen: 'MERS-CoV', region: 'Riyadh', type: 'ML', score: 78, description: 'LSTM model flags anomalous HCW transmission pattern', time: '4h ago', source: 'LSTM Ensemble v2.1', action: 'Alert generated' },
    { pathogen: 'CCHF Virus', region: 'Tabuk / Northern', type: 'OSINT', score: 71, description: 'ProMED alert: CCHF cases reported near northern border', time: '8h ago', source: 'ProMED-mail', action: 'Under review' },
    { pathogen: 'Dengue Virus', region: 'Makkah / Jizan', type: 'Statistical', score: 68, description: 'Farrington algorithm: excess dengue cases beyond 5-year baseline', time: '12h ago', source: 'Farrington Algorithm', action: 'Alert confirmed' },
    { pathogen: 'K. pneumoniae (XDR)', region: 'Riyadh', type: 'Genomic', score: 72, description: 'Novel AMR combination: KPC-3 + NDM-1 + mcr-1 in single isolate', time: '18h ago', source: 'AMRFinderPlus', action: 'Under review' },
    { pathogen: 'M. tuberculosis', region: 'Riyadh', type: 'Genomic', score: 62, description: 'MDR-TB cluster TB-2026-SA-012 expanded to 34 genomes with <5 SNP distance', time: '1d ago', source: 'IQ-TREE2 Phylogenetics', action: 'Alert confirmed' },
    { pathogen: 'RVF Virus', region: 'Jizan', type: 'OSINT', score: 35, description: 'WHO EIOS: RVF outbreak reported in neighboring region', time: '2d ago', source: 'WHO EIOS 2.0', action: 'Monitoring' },
    { pathogen: 'SARS-CoV-2', region: 'National', type: 'ML', score: 42, description: 'XGBoost risk scorer indicates declining trend nationally', time: '2d ago', source: 'XGBoost Ensemble', action: 'No action needed' },
  ],
  // OSINT feed items
  osintFeed: [
    { title: 'ProMED: Cholera cases surge in Middle East region', source: 'ProMED-mail', date: '2026-03-08', relevance: 92, language: 'English', sentiment: 'negative', entities: ['Cholera', 'Middle East', 'Waterborne'] },
    { title: 'WHO EIOS: CCHF cases reported near Saudi border', source: 'WHO EIOS 2.0', date: '2026-03-07', relevance: 88, language: 'English', sentiment: 'negative', entities: ['CCHF', 'Saudi Arabia', 'Border'] },
    { title: 'تقرير: ارتفاع حالات حمى الضنك في جدة', source: 'Saudi Gazette (Arabic)', date: '2026-03-07', relevance: 85, language: 'Arabic', sentiment: 'negative', entities: ['Dengue', 'Jeddah'] },
    { title: 'Antimicrobial resistance crisis: Global update Q1 2026', source: 'Lancet ID', date: '2026-03-06', relevance: 78, language: 'English', sentiment: 'negative', entities: ['AMR', 'Global', 'CRE'] },
    { title: 'MERS-CoV: Healthcare worker infections at hospital', source: 'HealthMap', date: '2026-03-06', relevance: 90, language: 'English', sentiment: 'negative', entities: ['MERS-CoV', 'Nosocomial', 'HCW'] },
    { title: 'RVF outbreak reported in East Africa - travel advisory', source: 'CDC GHSA', date: '2026-03-05', relevance: 72, language: 'English', sentiment: 'warning', entities: ['RVF', 'East Africa', 'Travel'] },
  ]
};
