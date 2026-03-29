// =============================================================================
// BioR Platform v3.0 - TypeScript Type Definitions
// =============================================================================
// Single source of truth for all data model interfaces.
// Every data module and route handler references these types.
// =============================================================================

// ===== AUTH =====
export interface UserProfile {
  id: string;
  username: string;
  name: string;
  role: 'Admin' | 'Analyst' | 'Viewer';
  fullRole: string;
  institution: string;
  tier: number;
  avatar: string;
}

export interface AuthAccount {
  password: string;
  user: UserProfile;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

// ===== DASHBOARD =====
export interface SparklineData {
  cases: number[];
  sites: number[];
  sequences: number[];
  alerts: number[];
}

export interface ActivityItem {
  type: string;
  message: string;
  time: string;
  icon: string;
  severity: 'critical' | 'warning' | 'info';
}

export interface PathogenSummary {
  name: string;
  cases: number;
  trend: 'rising' | 'falling' | 'stable';
  severity: 'critical' | 'high' | 'medium' | 'low';
  percent: number;
  weekChange: number;
  lineage: string;
}

export interface MapMarker {
  name: string;
  lat: number;
  lng: number;
  status: string;
  type: string;
  color: string;
  cases: number;
}

export interface WeeklyTrend {
  labels: string[];
  confirmed: number[];
  suspected: number[];
  deaths: number[];
}

export interface EWSScores {
  statistical: number;
  ml: number;
  osint: number;
  genomic: number;
  composite: number;
}

export interface DashboardData {
  activeCases: number;
  sitesMonitored: number;
  genomicSequences: number;
  sequencesProcessed: number;
  activeAlerts: number;
  criticalAlerts: number;
  threatLevel: number;
  pendingReview: number;
  dataQualityAvg: number;
  ewsScores: EWSScores;
  sparklines: SparklineData;
  recentActivity: ActivityItem[];
  topPathogens: PathogenSummary[];
  mapMarkers: MapMarker[];
  weeklyTrend: WeeklyTrend;
}

// ===== SURVEILLANCE =====
export interface SurveillanceSite {
  id: string;
  name: string;
  type: 'Hospital' | 'Airport' | 'Wastewater' | 'Environment' | 'Border' | 'Sentinel';
  region: string;
  status: 'Active' | 'Alert' | 'Offline';
  lastReport: string;
  dqScore: number;
  lat: number;
  lng: number;
  casesThisWeek: number;
  samplesSubmitted: number;
  contactPerson: string;
  phone: string;
  capacity: string;
  pathogens: string[];
}

// ===== THREATS =====
export interface TimelineEvent {
  date: string;
  event: string;
  type: 'detection' | 'confirmation' | 'alert' | 'response' | 'escalation';
}

export interface Threat {
  id: string;
  name: string;
  pathogen: string;
  icd11: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  cases: number;
  deaths: number;
  cfr: number;
  regions: string[];
  containment: number;
  detected: string;
  riskScore: number;
  labConfirmed: number;
  genomicClusterId: string | null;
  trend: 'rising' | 'falling' | 'stable';
  weeklyChange: string;
  ihReportable: boolean;
  responseTeams: number;
  waterSources: number;
  timeline: TimelineEvent[];
}

// ===== GENOMICS =====
export interface GenomicSample {
  sampleId: string;
  pathogen: string;
  lineage: string;
  platform: string;
  pipelineStatus: 'Completed' | 'Processing' | 'Failed';
  coverage: number;
  amrDetected: boolean;
  amrGenes: string[];
  quality: string;
  institution: string;
  date: string;
  readLength: string;
  totalReads: string;
  assemblyLength: string;
  mutations: number;
  novelMutations: number;
}

export interface PipelineStage {
  name: string;
  icon: string;
  completed: number;
  active: number;
  failed: number;
}

export interface AMRHeatmap {
  pathogens: string[];
  antibiotics: string[];
  data: number[][];
}

// ===== ALERTS =====
export interface Alert {
  id: string;
  title: string;
  description: string;
  level: 1 | 2 | 3;
  type: string;
  pathogen: string;
  region: string;
  riskScore: number;
  status: string;
  generatedAt: string;
  generatedBy: string;
  reviewedAt: string | null;
  reviewer: string | null;
  channels: string[];
  recommendedActions: string[];
  affectedPopulation: number;
  responseStatus: string;
  sitrep: boolean;
}

// ===== REPORTS =====
export interface EpiCurve {
  dates: string[];
  confirmed: number[];
  suspected: number[];
}

export interface MonthlyTrend {
  months: string[];
  cases: number[];
  deaths: number[];
  sequences: number[];
}

export interface WeeklyReport {
  title: string;
  period: string;
  totalCases: number;
  deaths: number;
  status: 'Published' | 'Draft';
  author: string;
}

export interface ReportsData {
  weeklyLabels: string[];
  confirmedCases: number[];
  suspectedCases: number[];
  positivityRate: number[];
  pathogenLabels: string[];
  pathogenCases: number[];
  alertDistribution: number[];
  regionLabels: string[];
  regionCases: number[];
  epiCurve: EpiCurve;
  monthlyTrend: MonthlyTrend;
  weeklyReports: WeeklyReport[];
}

// ===== EWS =====
export interface RiskHistory {
  dates: string[];
  scores: number[];
}

export interface Forecast {
  pathogen: string;
  region: string;
  days: string[];
  predicted: number[];
  upper: number[];
  lower: number[];
  confidence: number;
  model: string;
}

export interface RegionalRisk {
  region: string;
  score: number;
  trend: string;
  change: string;
  topThreat: string;
}

export interface DetectionLayer {
  name: string;
  icon: string;
  color: string;
  signals: number;
  description: string;
  algorithms: string[];
  lastRun: string;
  nextRun: string;
}

export interface OSINTFeedItem {
  title: string;
  source: string;
  date: string;
  relevance: number;
  language: string;
  sentiment: string;
  entities: string[];
}

export interface EWSSignal {
  pathogen: string;
  region: string;
  type: string;
  score: number;
  description: string;
  time: string;
  source: string;
  action: string;
}

export interface EWSData {
  activeSignals: number;
  newSignals24h: number;
  nationalRiskScore: number;
  riskTrend: string;
  osintArticles: number;
  osintRelevant: number;
  riskHistory: RiskHistory;
  forecast: Forecast;
  regionalRisks: RegionalRisk[];
  detectionLayers: DetectionLayer[];
  recentSignals: EWSSignal[];
  osintFeed: OSINTFeedItem[];
}

// ===== ADMIN =====
export interface ServiceStatus {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  uptime: string;
  latency: string;
  load: number;
  lastCheck: string;
}

export interface StorageMetric {
  used: number;
  total: number;
  unit: string;
}

export interface SystemEvent {
  time: string;
  event: string;
  type: 'info' | 'warning' | 'alert';
}

export interface DQScorecard {
  institution: string;
  score: number;
  completeness: number;
  timeliness: number;
  accuracy: number;
  trend: 'rising' | 'falling' | 'stable';
}

export interface SystemHealth {
  overall: string;
  uptime: string;
  lastIncident: string;
  services: ServiceStatus[];
  storage: Record<string, StorageMetric>;
  recentEvents: SystemEvent[];
  dqScorecard: DQScorecard[];
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ip: string;
  tier: number;
}
