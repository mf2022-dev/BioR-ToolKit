// =============================================================================
// BioR Platform v8.6 — Analytics Engine (Pure TypeScript)
// =============================================================================
// All algorithms run within Cloudflare Workers 10ms CPU limit:
// - National Risk Score (weighted composite)
// - Regional Risk Heatmap
// - Anomaly Detection (Z-score)
// - Rt Estimation (simple ratio with CI)
// - Linear Regression Forecast (7/14-day)
// =============================================================================

export interface AnalyticsConfig {
  risk_w_velocity: number;
  risk_w_severity: number;
  risk_w_containment: number;
  risk_w_genomic: number;
  risk_w_ews: number;
  anomaly_threshold_sigma: number;
  anomaly_window_weeks: number;
  forecast_window_weeks: number;
  forecast_horizon_days: number;
  rt_serial_interval: number;
  rt_window_days: number;
}

export interface ThreatRow {
  id: string;
  name: string;
  pathogen: string;
  severity: string;
  cases: number;
  deaths: number;
  cfr: number;
  regions: string;
  containment: number;
  risk_score: number;
  trend: string;
  weekly_change: string;
}

export interface RegionalRiskRow {
  region: string;
  score: number;
  trend: string;
  change: string;
  top_threat: string;
}

export interface Anomaly {
  region: string;
  pathogen: string;
  expected: number;
  actual: number;
  deviation: number;
  sigma: number;
  severity: 'critical' | 'high' | 'medium';
  description: string;
}

export interface RtEstimate {
  value: number;
  lower: number;
  upper: number;
  trend: 'growing' | 'stable' | 'declining';
  label: string;
}

export interface ForecastPoint {
  day: number;
  date: string;
  predicted: number;
  lower: number;
  upper: number;
}

// ===== HELPER: Parse numeric weekly_change like "+34" or "-8" =====
function parseChange(s: string): number {
  if (!s) return 0;
  return parseInt(s.replace(/[^0-9\-+]/g, ''), 10) || 0;
}

// ===== HELPER: Severity to numeric weight =====
function severityWeight(s: string): number {
  switch ((s || '').toLowerCase()) {
    case 'critical': return 1.0;
    case 'high': return 0.75;
    case 'medium': return 0.5;
    case 'low': return 0.25;
    default: return 0.3;
  }
}

// ===== HELPER: Linear Regression =====
function linearRegression(ys: number[]): { slope: number; intercept: number; r2: number } {
  const n = ys.length;
  if (n < 2) return { slope: 0, intercept: ys[0] || 0, r2: 0 };
  
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += ys[i];
    sumXY += i * ys[i];
    sumX2 += i * i;
    sumY2 += ys[i] * ys[i];
  }
  
  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return { slope: 0, intercept: sumY / n, r2: 0 };
  
  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  
  // R-squared
  const meanY = sumY / n;
  let ssTot = 0, ssRes = 0;
  for (let i = 0; i < n; i++) {
    ssTot += (ys[i] - meanY) ** 2;
    ssRes += (ys[i] - (intercept + slope * i)) ** 2;
  }
  const r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot;
  
  return { slope, intercept, r2 };
}

// ===== HELPER: Mean and StdDev =====
function meanStd(arr: number[]): { mean: number; std: number } {
  if (arr.length === 0) return { mean: 0, std: 0 };
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance = arr.reduce((sum, v) => sum + (v - mean) ** 2, 0) / arr.length;
  return { mean, std: Math.sqrt(variance) };
}

// =============================================================================
// 1. NATIONAL RISK SCORE — weighted composite (0-100)
// =============================================================================
export function computeNationalRisk(
  threats: ThreatRow[],
  ewsComposite: number,
  config: AnalyticsConfig
): { score: number; components: Record<string, number>; level: string; color: string } {
  
  // Velocity: normalize weekly changes against total cases
  const totalCases = threats.reduce((s, t) => s + (t.cases || 0), 0) || 1;
  const totalChange = threats.reduce((s, t) => s + Math.abs(parseChange(t.weekly_change)), 0);
  const velocityRaw = (totalChange / totalCases) * 100;
  const velocity = Math.min(velocityRaw * 3, 100); // scale up, cap at 100
  
  // Severity index: weighted average of threat severities by case count
  const severityNum = threats.reduce((s, t) => s + severityWeight(t.severity) * t.cases, 0) / totalCases * 100;
  
  // Containment gap: 100 - average containment
  const avgContainment = threats.length > 0
    ? threats.reduce((s, t) => s + (t.containment || 0), 0) / threats.length
    : 50;
  const containmentGap = 100 - avgContainment;
  
  // Genomic signal: average risk_score from threats with genomic data
  const genomicThreats = threats.filter(t => t.risk_score > 0);
  const genomicSignal = genomicThreats.length > 0
    ? genomicThreats.reduce((s, t) => s + t.risk_score, 0) / genomicThreats.length
    : 40;
  
  // EWS composite (already 0-100)
  const ewsScore = Math.min(ewsComposite || 50, 100);
  
  const score = Math.round(
    velocity * config.risk_w_velocity +
    severityNum * config.risk_w_severity +
    containmentGap * config.risk_w_containment +
    genomicSignal * config.risk_w_genomic +
    ewsScore * config.risk_w_ews
  );
  
  const clamped = Math.max(0, Math.min(100, score));
  
  const level = clamped >= 80 ? 'CRITICAL' : clamped >= 60 ? 'ELEVATED' : clamped >= 40 ? 'MODERATE' : 'LOW';
  const color = clamped >= 80 ? '#ef4444' : clamped >= 60 ? '#f59e0b' : clamped >= 40 ? '#3b82f6' : '#22c55e';
  
  return {
    score: clamped,
    components: {
      velocity: Math.round(velocity),
      severity: Math.round(severityNum),
      containmentGap: Math.round(containmentGap),
      genomicSignal: Math.round(genomicSignal),
      ewsComposite: Math.round(ewsScore),
    },
    level,
    color,
  };
}

// =============================================================================
// 2. REGIONAL RISK HEATMAP
// =============================================================================
export function computeRegionalRisks(
  regionalData: RegionalRiskRow[],
  threats: ThreatRow[]
): Array<{
  region: string;
  score: number;
  trend: string;
  change: number;
  topThreat: string;
  threatCount: number;
  level: string;
  color: string;
}> {
  return regionalData.map(r => {
    // Count threats affecting this region
    const regionThreats = threats.filter(t => {
      try {
        const regions = JSON.parse(t.regions || '[]');
        return regions.some((rr: string) => rr.toLowerCase().includes(r.region.toLowerCase()));
      } catch { return false; }
    });
    
    const level = r.score >= 75 ? 'CRITICAL' : r.score >= 55 ? 'HIGH' : r.score >= 35 ? 'MODERATE' : 'LOW';
    const color = r.score >= 75 ? '#ef4444' : r.score >= 55 ? '#f59e0b' : r.score >= 35 ? '#3b82f6' : '#22c55e';
    
    return {
      region: r.region,
      score: r.score,
      trend: r.trend,
      change: parseChange(r.change),
      topThreat: r.top_threat,
      threatCount: regionThreats.length,
      level,
      color,
    };
  }).sort((a, b) => b.score - a.score);
}

// =============================================================================
// 3. ANOMALY DETECTION — Z-score on weekly data
// =============================================================================
export function detectAnomalies(
  weeklyData: number[],
  threats: ThreatRow[],
  sigmaThreshold: number
): Anomaly[] {
  const anomalies: Anomaly[] = [];
  
  if (weeklyData.length < 4) return anomalies;
  
  // Use all-but-last as baseline, test the last value
  const baseline = weeklyData.slice(0, -1);
  const current = weeklyData[weeklyData.length - 1];
  const { mean, std } = meanStd(baseline);
  
  if (std > 0) {
    const zScore = (current - mean) / std;
    if (Math.abs(zScore) >= sigmaThreshold) {
      anomalies.push({
        region: 'National',
        pathogen: 'All confirmed cases',
        expected: Math.round(mean),
        actual: current,
        deviation: Math.round(current - mean),
        sigma: Math.round(zScore * 10) / 10,
        severity: Math.abs(zScore) >= 3 ? 'critical' : Math.abs(zScore) >= 2.5 ? 'high' : 'medium',
        description: `Weekly confirmed cases (${current}) deviate ${zScore > 0 ? 'above' : 'below'} baseline mean (${Math.round(mean)}) by ${Math.abs(Math.round(zScore * 10) / 10)}\u03C3`,
      });
    }
  }
  
  // Per-threat anomalies: flag threats with large positive weekly change
  for (const t of threats) {
    const change = parseChange(t.weekly_change);
    if (change > 0 && t.cases > 0) {
      const changeRate = change / t.cases;
      // Flag if weekly change > 30% of total cases (rapid growth)
      if (changeRate >= 0.25 || (severityWeight(t.severity) >= 0.75 && change >= 5)) {
        const sig = changeRate >= 0.5 ? 3.0 : changeRate >= 0.3 ? 2.5 : 2.0;
        if (sig >= sigmaThreshold) {
          anomalies.push({
            region: (() => { try { return JSON.parse(t.regions || '[]')[0] || 'Unknown'; } catch { return 'Unknown'; } })(),
            pathogen: t.pathogen,
            expected: t.cases - change,
            actual: t.cases,
            deviation: change,
            sigma: Math.round(sig * 10) / 10,
            severity: sig >= 3 ? 'critical' : sig >= 2.5 ? 'high' : 'medium',
            description: `${t.name}: +${change} cases this week (${Math.round(changeRate * 100)}% increase)`,
          });
        }
      }
    }
  }
  
  return anomalies.sort((a, b) => b.sigma - a.sigma);
}

// =============================================================================
// 4. Rt ESTIMATION — Simple ratio method with confidence interval
// =============================================================================
export function estimateRt(
  weeklyConfirmed: number[]
): RtEstimate {
  if (weeklyConfirmed.length < 3) {
    return { value: 1.0, lower: 0.8, upper: 1.2, trend: 'stable', label: 'Insufficient data' };
  }
  
  // Use ratio of last 2 weeks / previous 2 weeks as rough Rt proxy
  const recent = weeklyConfirmed.slice(-2);
  const previous = weeklyConfirmed.slice(-4, -2);
  
  const recentSum = recent.reduce((a, b) => a + b, 0) || 1;
  const prevSum = previous.reduce((a, b) => a + b, 0) || 1;
  
  const rt = recentSum / prevSum;
  
  // Bootstrap-like CI approximation using Poisson noise
  const se = rt * Math.sqrt(1 / recentSum + 1 / prevSum);
  const lower = Math.max(0, rt - 1.96 * se);
  const upper = rt + 1.96 * se;
  
  const trend: 'growing' | 'stable' | 'declining' =
    lower > 1.0 ? 'growing' :
    upper < 1.0 ? 'declining' : 'stable';
  
  const label =
    trend === 'growing' ? 'Epidemic growing — Rt significantly above 1.0' :
    trend === 'declining' ? 'Epidemic declining — Rt below 1.0' :
    'Near threshold — Rt close to 1.0';
  
  return {
    value: Math.round(rt * 100) / 100,
    lower: Math.round(lower * 100) / 100,
    upper: Math.round(upper * 100) / 100,
    trend,
    label,
  };
}

// =============================================================================
// 5. FORECAST — Linear regression with confidence band
// =============================================================================
export function computeForecast(
  weeklyConfirmed: number[],
  weekLabels: string[],
  horizonDays: number
): { points: ForecastPoint[]; model: string; confidence: number; r2: number } {
  
  const forecastWeeks = Math.ceil(horizonDays / 7);
  
  if (weeklyConfirmed.length < 3) {
    return { points: [], model: 'Insufficient data', confidence: 0, r2: 0 };
  }
  
  const { slope, intercept, r2 } = linearRegression(weeklyConfirmed);
  const n = weeklyConfirmed.length;
  
  // Residual standard error
  const residuals = weeklyConfirmed.map((y, i) => y - (intercept + slope * i));
  const rse = Math.sqrt(residuals.reduce((s, r) => s + r * r, 0) / Math.max(n - 2, 1));
  
  const points: ForecastPoint[] = [];
  const now = new Date();
  
  for (let w = 1; w <= forecastWeeks; w++) {
    const x = n - 1 + w;
    const predicted = Math.max(0, Math.round(intercept + slope * x));
    
    // Prediction interval widens with distance
    const margin = 1.96 * rse * Math.sqrt(1 + 1 / n + ((x - (n - 1) / 2) ** 2) / (n * ((n - 1) / 12)));
    
    const futureDate = new Date(now.getTime() + w * 7 * 24 * 60 * 60 * 1000);
    const dateStr = futureDate.toISOString().split('T')[0];
    
    points.push({
      day: w * 7,
      date: dateStr,
      predicted,
      lower: Math.max(0, Math.round(predicted - margin)),
      upper: Math.round(predicted + margin),
    });
  }
  
  const confidence = Math.round(Math.max(0, Math.min(100, r2 * 100)));
  
  return {
    points,
    model: 'Linear Regression (OLS)',
    confidence,
    r2: Math.round(r2 * 1000) / 1000,
  };
}

// =============================================================================
// 6. RISK DRIVERS — Top factors driving national risk
// =============================================================================
export function computeRiskDrivers(
  threats: ThreatRow[],
  anomalies: Anomaly[]
): Array<{ factor: string; contribution: number; direction: 'up' | 'down' | 'stable'; detail: string }> {
  const drivers: Array<{ factor: string; contribution: number; direction: 'up' | 'down' | 'stable'; detail: string }> = [];
  
  // Top threats by risk score
  const topThreats = [...threats].sort((a, b) => b.risk_score - a.risk_score).slice(0, 5);
  for (const t of topThreats) {
    const dir = t.trend === 'rising' ? 'up' as const : t.trend === 'falling' ? 'down' as const : 'stable' as const;
    drivers.push({
      factor: t.name,
      contribution: t.risk_score,
      direction: dir,
      detail: `${t.cases} cases, CFR ${t.cfr}%, ${t.weekly_change} this week`,
    });
  }
  
  // Anomalies as risk drivers
  for (const a of anomalies.slice(0, 3)) {
    drivers.push({
      factor: `Anomaly: ${a.pathogen}`,
      contribution: Math.round(a.sigma * 20),
      direction: 'up',
      detail: a.description,
    });
  }
  
  return drivers.sort((a, b) => b.contribution - a.contribution).slice(0, 8);
}
