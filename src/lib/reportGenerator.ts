// =============================================================================
// BioR Platform v8.7 — Report Generator Service
// =============================================================================
// Generates HTML reports from D1 data for both scheduled (cron) and on-demand use.
// Templates: Weekly National Epi Bulletin, Monthly AMR Summary
// Storage: D1 reports_archive table
// =============================================================================

// ===== TYPES =====
interface ReportData {
  summary: any;
  threats: any[];
  alerts: any[];
  ewsScores: any;
  weeklyTrend: any;
  topPathogens: any[];
  regionBreakdown: any[];
  recentActivity: any[];
  analytics?: any;
}

// ===== HELPER: Generate unique report ID =====
function reportId(type: string): string {
  const now = new Date();
  const date = now.toISOString().split('T')[0].replace(/-/g, '');
  const rand = Math.random().toString(36).substring(2, 6);
  return `RPT-${type.toUpperCase().slice(0, 3)}-${date}-${rand}`;
}

// ===== HELPER: Format date =====
function fmtDate(d: Date): string {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ===== HELPER: Epi week number =====
function epiWeek(d: Date): string {
  const start = new Date(d.getFullYear(), 0, 1);
  const days = Math.floor((d.getTime() - start.getTime()) / 86400000);
  return `W${String(Math.ceil((days + start.getDay() + 1) / 7)).padStart(2, '0')}`;
}

// ===== HELPER: Parse JSON safely =====
function parseJSON(val: string | any, fallback: any = {}): any {
  if (!val) return fallback;
  if (typeof val !== 'string') return val;
  try { return JSON.parse(val); } catch { return fallback; }
}

// =============================================================================
// FETCH ALL REPORT DATA FROM D1
// =============================================================================
export async function fetchReportData(db: D1Database): Promise<ReportData> {
  // Dashboard metrics
  const metricsRows = await db.prepare('SELECT metric_key, metric_value FROM dashboard_metrics').all();
  const metrics: Record<string, any> = {};
  for (const row of metricsRows.results as any[]) {
    metrics[row.metric_key] = parseJSON(row.metric_value);
  }

  // Threats
  const threatRows = await db.prepare('SELECT * FROM threats ORDER BY risk_score DESC').all();
  const threats = threatRows.results as any[];

  // Critical alerts
  const alertRows = await db.prepare("SELECT * FROM alerts WHERE level >= 2 ORDER BY risk_score DESC LIMIT 10").all();
  const alerts = alertRows.results as any[];

  // Analytics (computed)
  const { computeNationalRisk, estimateRt, detectAnomalies } = await import('./analytics');
  const ewsScores = metrics['ews_scores'] || {};
  const weeklyTrend = metrics['weekly_trend'] || {};
  const confirmed: number[] = weeklyTrend.confirmed || [];
  
  const analyticsConfig = {
    risk_w_velocity: 0.30, risk_w_severity: 0.25, risk_w_containment: 0.20,
    risk_w_genomic: 0.15, risk_w_ews: 0.10, anomaly_threshold_sigma: 2.0,
    anomaly_window_weeks: 6, forecast_window_weeks: 6, forecast_horizon_days: 14,
    rt_serial_interval: 5.0, rt_window_days: 7,
  };

  const nationalRisk = computeNationalRisk(threats, ewsScores.composite || 72, analyticsConfig);
  const rt = estimateRt(confirmed);
  const anomalies = detectAnomalies(confirmed, threats, 2.0);

  return {
    summary: metrics['summary'] || {},
    threats,
    alerts,
    ewsScores,
    weeklyTrend,
    topPathogens: metrics['top_pathogens'] || [],
    regionBreakdown: metrics['region_breakdown'] || [],
    recentActivity: metrics['recent_activity'] || [],
    analytics: { nationalRisk, rt, anomalies },
  };
}

// =============================================================================
// WEEKLY NATIONAL EPI BULLETIN (HTML template)
// =============================================================================
export function generateWeeklyBulletinHTML(data: ReportData, period: string): string {
  const s = data.summary;
  const nr = data.analytics?.nationalRisk || { score: 0, level: 'N/A', color: '#666' };
  const rt = data.analytics?.rt || { value: 1.0, lower: 0.8, upper: 1.2, trend: 'stable' };
  const anomalies = data.analytics?.anomalies || [];
  const criticalAlerts = data.alerts.filter((a: any) => a.level >= 3);
  const now = new Date();

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BioR National Epi Bulletin — ${period}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: #0a0f1a; color: #e2e8f0; line-height: 1.6; }
  .container { max-width: 900px; margin: 0 auto; padding: 40px 30px; }
  .header { text-align: center; padding: 30px; border-bottom: 2px solid #00A86B; margin-bottom: 30px; }
  .header h1 { font-size: 24px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
  .header .subtitle { font-size: 13px; color: #94a3b8; margin-top: 4px; }
  .header .period { display: inline-block; background: #00A86B20; color: #00A86B; padding: 4px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 10px; }
  .header .logo { font-size: 36px; color: #00A86B; margin-bottom: 10px; }
  .section { margin-bottom: 28px; }
  .section-title { font-size: 14px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 1px; border-left: 3px solid #00A86B; padding-left: 12px; margin-bottom: 14px; }
  .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
  .kpi { background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 16px; text-align: center; }
  .kpi-value { font-size: 28px; font-weight: 800; color: #fff; }
  .kpi-label { font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
  .risk-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 20px; }
  .risk-card { background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 16px; text-align: center; }
  .risk-score { font-size: 36px; font-weight: 800; }
  .risk-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th { background: #111827; color: #94a3b8; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; padding: 10px 12px; text-align: left; }
  td { padding: 10px 12px; border-bottom: 1px solid #1f2937; color: #cbd5e1; }
  tr:hover td { background: #0f172a; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; }
  .badge-critical { background: #ef444420; color: #ef4444; }
  .badge-high { background: #f59e0b20; color: #f59e0b; }
  .badge-medium { background: #3b82f620; color: #3b82f6; }
  .badge-low { background: #22c55e20; color: #22c55e; }
  .anomaly-card { background: #111827; border-left: 3px solid #ef4444; border-radius: 8px; padding: 12px 16px; margin-bottom: 8px; }
  .anomaly-title { font-size: 12px; font-weight: 600; color: #fff; }
  .anomaly-detail { font-size: 11px; color: #64748b; margin-top: 2px; }
  .footer { text-align: center; padding: 20px; border-top: 1px solid #1f2937; margin-top: 30px; font-size: 10px; color: #475569; }
  .footer a { color: #00A86B; text-decoration: none; }
  @media print { body { background: #fff; color: #1e293b; } .kpi, .risk-card, .anomaly-card { background: #f8fafc; border-color: #e2e8f0; } th { background: #f1f5f9; color: #475569; } td { color: #334155; border-color: #e2e8f0; } .header { border-color: #00A86B; } .section-title { color: #1e293b; } }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="logo">&#x2697;</div>
    <h1>BioR National Epidemiological Bulletin</h1>
    <p class="subtitle">Biological Response Network — Kingdom of Saudi Arabia</p>
    <div class="period">${period}</div>
  </div>

  <div class="section">
    <div class="section-title">Key Performance Indicators</div>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-value" style="color:#ef4444">${s.activeCases || 0}</div><div class="kpi-label">Active Cases</div></div>
      <div class="kpi"><div class="kpi-value" style="color:#00A86B">${s.sitesMonitored || 0}</div><div class="kpi-label">Sites Monitored</div></div>
      <div class="kpi"><div class="kpi-value" style="color:#3b82f6">${s.genomicSequences || 0}</div><div class="kpi-label">Genomic Sequences</div></div>
      <div class="kpi"><div class="kpi-value" style="color:#f59e0b">${s.activeAlerts || 0}</div><div class="kpi-label">Active Alerts</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Risk Assessment</div>
    <div class="risk-row">
      <div class="risk-card"><div class="risk-score" style="color:${nr.color}">${nr.score}</div><div class="risk-label" style="color:${nr.color}">${nr.level}</div><div class="kpi-label">National Risk Score</div></div>
      <div class="risk-card"><div class="risk-score" style="color:${rt.value >= 1.1 ? '#ef4444' : rt.value >= 0.9 ? '#f59e0b' : '#22c55e'}">${rt.value}</div><div class="risk-label">CI: ${rt.lower}–${rt.upper}</div><div class="kpi-label">Reproduction Number (Rt)</div></div>
      <div class="risk-card"><div class="risk-score" style="color:${anomalies.length > 0 ? '#ef4444' : '#22c55e'}">${anomalies.length}</div><div class="risk-label">${anomalies.filter((a: any) => a.severity === 'critical').length} critical</div><div class="kpi-label">Anomalies Detected</div></div>
    </div>
  </div>

  ${anomalies.length > 0 ? `
  <div class="section">
    <div class="section-title">Anomaly Alerts</div>
    ${anomalies.slice(0, 5).map((a: any) => `
    <div class="anomaly-card" style="border-color:${a.severity === 'critical' ? '#ef4444' : a.severity === 'high' ? '#f59e0b' : '#3b82f6'}">
      <div class="anomaly-title">${a.pathogen} — ${a.region} <span class="badge badge-${a.severity}">${a.sigma}&sigma; ${a.severity}</span></div>
      <div class="anomaly-detail">${a.description}</div>
    </div>`).join('')}
  </div>` : ''}

  <div class="section">
    <div class="section-title">Active Threats (Top 10)</div>
    <table>
      <thead><tr><th>Threat</th><th>Pathogen</th><th>Severity</th><th>Cases</th><th>Deaths</th><th>CFR</th><th>Trend</th><th>Risk</th></tr></thead>
      <tbody>
      ${data.threats.slice(0, 10).map((t: any) => `
        <tr>
          <td>${t.name}</td>
          <td>${t.pathogen}</td>
          <td><span class="badge badge-${(t.severity || '').toLowerCase()}">${t.severity}</span></td>
          <td>${t.cases}</td>
          <td>${t.deaths}</td>
          <td>${t.cfr}%</td>
          <td>${t.trend === 'rising' ? '&#9650;' : t.trend === 'falling' ? '&#9660;' : '&#8212;'} ${t.weekly_change || ''}</td>
          <td><strong>${t.risk_score}</strong></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>

  ${criticalAlerts.length > 0 ? `
  <div class="section">
    <div class="section-title">Critical Alerts (Level 3)</div>
    <table>
      <thead><tr><th>ID</th><th>Title</th><th>Pathogen</th><th>Region</th><th>Status</th><th>Risk</th></tr></thead>
      <tbody>
      ${criticalAlerts.map((a: any) => `
        <tr>
          <td>${a.id}</td>
          <td>${a.title}</td>
          <td>${a.pathogen}</td>
          <td>${a.region}</td>
          <td><span class="badge badge-${a.status === 'confirmed' ? 'critical' : 'medium'}">${a.status}</span></td>
          <td><strong>${a.risk_score}</strong></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>` : ''}

  ${data.topPathogens.length > 0 ? `
  <div class="section">
    <div class="section-title">Top Pathogens</div>
    <table>
      <thead><tr><th>Pathogen</th><th>Cases</th><th>Trend</th><th>Severity</th><th>Lineage</th></tr></thead>
      <tbody>
      ${data.topPathogens.map((p: any) => `
        <tr>
          <td>${p.name}</td>
          <td>${p.cases}</td>
          <td>${p.trend === 'rising' ? '&#9650;' : p.trend === 'falling' ? '&#9660;' : '&#8212;'} ${p.weekChange > 0 ? '+' : ''}${p.weekChange || 0}</td>
          <td><span class="badge badge-${(p.severity || 'medium').toLowerCase()}">${p.severity}</span></td>
          <td style="font-size:10px;color:#64748b">${p.lineage || 'N/A'}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>` : ''}

  <div class="footer">
    <p><strong>BioR — Biological Response Network</strong> | Generated ${fmtDate(now)} at ${now.toLocaleTimeString('en-US')} UTC</p>
    <p>Classification: <strong>OFFICIAL — SENSITIVE</strong> | Distribution: Authorized personnel only</p>
    <p><a href="https://bior.tech">https://bior.tech</a></p>
  </div>
</div>
</body>
</html>`;
}

// =============================================================================
// MONTHLY AMR SUMMARY (HTML template)
// =============================================================================
export function generateMonthlySummaryHTML(data: ReportData, period: string): string {
  const s = data.summary;
  const now = new Date();

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>BioR Monthly AMR Summary — ${period}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0a0f1a; color: #e2e8f0; line-height: 1.6; }
  .container { max-width: 900px; margin: 0 auto; padding: 40px 30px; }
  .header { text-align: center; padding: 30px; border-bottom: 2px solid #8b5cf6; margin-bottom: 30px; }
  .header h1 { font-size: 22px; font-weight: 800; color: #fff; }
  .header .subtitle { font-size: 13px; color: #94a3b8; margin-top: 4px; }
  .header .period { display: inline-block; background: #8b5cf620; color: #8b5cf6; padding: 4px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 10px; }
  .section { margin-bottom: 24px; }
  .section-title { font-size: 14px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 1px; border-left: 3px solid #8b5cf6; padding-left: 12px; margin-bottom: 14px; }
  .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
  .kpi { background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 16px; text-align: center; }
  .kpi-value { font-size: 28px; font-weight: 800; color: #fff; }
  .kpi-label { font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th { background: #111827; color: #94a3b8; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; padding: 10px 12px; text-align: left; }
  td { padding: 10px 12px; border-bottom: 1px solid #1f2937; color: #cbd5e1; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; }
  .badge-critical { background: #ef444420; color: #ef4444; }
  .badge-high { background: #f59e0b20; color: #f59e0b; }
  .footer { text-align: center; padding: 20px; border-top: 1px solid #1f2937; margin-top: 30px; font-size: 10px; color: #475569; }
  @media print { body { background: #fff; color: #1e293b; } .kpi { background: #f8fafc; border-color: #e2e8f0; } th { background: #f1f5f9; color: #475569; } td { color: #334155; border-color: #e2e8f0; } }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>Monthly AMR Surveillance Summary</h1>
    <p class="subtitle">BioR — Biological Response Network | Kingdom of Saudi Arabia</p>
    <div class="period">${period}</div>
  </div>

  <div class="section">
    <div class="section-title">Overview</div>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-value" style="color:#8b5cf6">${s.genomicSequences || 0}</div><div class="kpi-label">Sequences Processed</div></div>
      <div class="kpi"><div class="kpi-value" style="color:#ef4444">${data.threats.filter((t: any) => t.pathogen?.includes('XDR') || t.pathogen?.includes('MDR') || t.pathogen?.includes('ESBL')).length}</div><div class="kpi-label">AMR Threats</div></div>
      <div class="kpi"><div class="kpi-value" style="color:#f59e0b">${s.activeAlerts || 0}</div><div class="kpi-label">Active Alerts</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">AMR-Related Threats</div>
    <table>
      <thead><tr><th>Threat</th><th>Pathogen</th><th>Cases</th><th>Resistance</th><th>Risk</th></tr></thead>
      <tbody>
      ${data.threats.filter((t: any) => {
        const name = (t.name || '').toLowerCase();
        const path = (t.pathogen || '').toLowerCase();
        return name.includes('xdr') || name.includes('mdr') || name.includes('esbl') || name.includes('amr') || path.includes('xdr') || path.includes('mdr') || path.includes('esbl');
      }).map((t: any) => `
        <tr>
          <td>${t.name}</td>
          <td>${t.pathogen}</td>
          <td>${t.cases}</td>
          <td><span class="badge badge-critical">AMR</span></td>
          <td><strong>${t.risk_score}</strong></td>
        </tr>`).join('') || '<tr><td colspan="5" style="text-align:center;color:#64748b">No AMR-specific threats this period</td></tr>'}
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">All Active Threats</div>
    <table>
      <thead><tr><th>Threat</th><th>Severity</th><th>Cases</th><th>Trend</th><th>Risk</th></tr></thead>
      <tbody>
      ${data.threats.slice(0, 10).map((t: any) => `
        <tr>
          <td>${t.name}</td>
          <td><span class="badge badge-${(t.severity || '').toLowerCase()}">${t.severity}</span></td>
          <td>${t.cases}</td>
          <td>${t.trend || 'stable'}</td>
          <td><strong>${t.risk_score}</strong></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>

  <div class="footer">
    <p><strong>BioR AMR Surveillance Summary</strong> | Generated ${fmtDate(now)} UTC</p>
    <p>Classification: OFFICIAL — SENSITIVE | <a href="https://bior.tech" style="color:#8b5cf6">https://bior.tech</a></p>
  </div>
</div>
</body>
</html>`;
}

// =============================================================================
// STORE REPORT IN D1
// =============================================================================
export async function storeReport(
  db: D1Database,
  type: string,
  title: string,
  period: string,
  html: string,
  generatedBy: string,
  triggerType: string
): Promise<string> {
  const id = reportId(type);
  const size = new TextEncoder().encode(html).length;

  await db.prepare(
    'INSERT INTO reports_archive (id, title, type, period, html_content, generated_by, trigger_type, size_bytes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, title, type, period, html, generatedBy, triggerType, size).run();

  return id;
}

// =============================================================================
// HIGH-LEVEL GENERATORS (called by cron or API)
// =============================================================================
export async function generateWeeklyBulletin(db: D1Database, triggeredBy: string = 'cron'): Promise<string> {
  const data = await fetchReportData(db);
  const now = new Date();
  const week = epiWeek(now);
  const period = `Epi Week ${now.getFullYear()}-${week} (${fmtDate(now)})`;
  const title = `National Epi Bulletin — ${now.getFullYear()}-${week}`;
  const html = generateWeeklyBulletinHTML(data, period);
  return storeReport(db, 'weekly_bulletin', title, period, html, 'system', triggeredBy);
}

export async function generateMonthlySummary(db: D1Database, triggeredBy: string = 'cron'): Promise<string> {
  const data = await fetchReportData(db);
  const now = new Date();
  const month = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  const title = `Monthly AMR Summary — ${month}`;
  const html = generateMonthlySummaryHTML(data, month);
  return storeReport(db, 'monthly_amr', title, month, html, 'system', triggeredBy);
}
