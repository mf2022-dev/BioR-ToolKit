// =============================================================================
// BioR Platform - Advanced Analytics Dashboard (v8.6)
// =============================================================================
// Renders: National Risk Gauge, Regional Heatmap, Anomaly Alerts,
//          Rt Tracker, Forecast Panel, Risk Drivers, Drill-down modal
// =============================================================================

export function getAnalyticsJS(): string {
  return `
// ===== ANALYTICS DASHBOARD =====
async function renderAnalytics(el) {
  const d = await api('/api/analytics');
  if (d.error) { el.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle text-red-400"></i><p class="text-red-400">Failed to load analytics</p><p class="text-[10px] text-white/30 mt-1">' + d.error + '</p></div>'; return; }

  const nr = d.nationalRisk || {};
  const rt = d.rt || {};
  const fc = d.forecast || {};
  const anomalies = d.anomalies || [];
  const regions = d.regionalRisks || [];
  const drivers = d.riskDrivers || [];
  const summary = d.summary || {};
  const cfg = d.config || {};

  // === National Risk Score SVG Gauge ===
  const gaugeRadius = 70;
  const gaugeCirc = 2 * Math.PI * gaugeRadius;
  const gaugePercent = (nr.score || 0) / 100;
  const gaugeDash = gaugeCirc * gaugePercent;
  const gaugeColor = nr.color || '#f59e0b';
  const gaugeLevel = nr.level || 'ELEVATED';

  el.innerHTML =
    '<div class="analytics-page">' +

    // HEADER
    '<div class="flex items-center justify-between mb-6">' +
      '<div>' +
        '<h2 class="text-lg font-bold text-white"><i class="fas fa-brain mr-2 text-purple-400/70"></i>Advanced Analytics</h2>' +
        '<p class="text-[10px] text-white/35 mt-0.5">Epidemiological intelligence \u2022 Updated ' + new Date(cfg.lastUpdated || Date.now()).toLocaleTimeString() + '</p>' +
      '</div>' +
      '<div class="flex items-center gap-2">' +
        '<button onclick="renderAnalytics(document.getElementById(\\'pageContent\\'))" class="px-3 py-1.5 bg-white/5 rounded-lg text-[10px] text-white/50 hover:bg-white/10 hover:text-white transition"><i class="fas fa-sync-alt mr-1"></i>Refresh</button>' +
        '<button onclick="showAnalyticsConfig()" class="px-3 py-1.5 bg-white/5 rounded-lg text-[10px] text-white/50 hover:bg-white/10 hover:text-white transition"><i class="fas fa-sliders-h mr-1"></i>Config</button>' +
      '</div>' +
    '</div>' +

    // ROW 1: NATIONAL RISK + Rt + SUMMARY
    '<div class="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">' +

    // National Risk Gauge (4 cols)
    '<div class="lg:col-span-4 panel-card p-5 text-center">' +
      '<div class="text-[10px] text-white/40 uppercase font-semibold mb-3 tracking-wide"><i class="fas fa-shield-virus mr-1"></i>National Risk Score</div>' +
      '<div style="position:relative;width:180px;height:180px;margin:0 auto">' +
        '<svg viewBox="0 0 180 180" width="180" height="180">' +
          '<circle cx="90" cy="90" r="' + gaugeRadius + '" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="12" />' +
          '<circle cx="90" cy="90" r="' + gaugeRadius + '" fill="none" stroke="' + gaugeColor + '" stroke-width="12" stroke-dasharray="' + gaugeDash + ' ' + gaugeCirc + '" stroke-dashoffset="0" stroke-linecap="round" transform="rotate(-90 90 90)" style="transition:stroke-dasharray 1.5s ease;filter:drop-shadow(0 0 8px ' + gaugeColor + '40)" />' +
        '</svg>' +
        '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">' +
          '<div style="font-size:36px;font-weight:800;color:' + gaugeColor + ';line-height:1">' + (nr.score || 0) + '</div>' +
          '<div style="font-size:9px;font-weight:700;color:' + gaugeColor + ';letter-spacing:2px;margin-top:4px">' + gaugeLevel + '</div>' +
        '</div>' +
      '</div>' +
      // Component breakdown
      '<div class="grid grid-cols-5 gap-1 mt-4">' +
        analyticsComponentBar('VEL', nr.components?.velocity, '#8b5cf6') +
        analyticsComponentBar('SEV', nr.components?.severity, '#ef4444') +
        analyticsComponentBar('GAP', nr.components?.containmentGap, '#f59e0b') +
        analyticsComponentBar('GEN', nr.components?.genomicSignal, '#3b82f6') +
        analyticsComponentBar('EWS', nr.components?.ewsComposite, '#06b6d4') +
      '</div>' +
    '</div>' +

    // Rt Tracker (4 cols)
    '<div class="lg:col-span-4 panel-card p-5">' +
      '<div class="text-[10px] text-white/40 uppercase font-semibold mb-3 tracking-wide"><i class="fas fa-chart-line mr-1"></i>Reproduction Number (R<sub>t</sub>)</div>' +
      '<div class="flex items-end justify-center gap-6 mb-4">' +
        '<div class="text-center">' +
          '<div class="text-4xl font-extrabold" style="color:' + rtColor(rt.value) + '">' + (rt.value || '1.00') + '</div>' +
          '<div class="text-[9px] text-white/30 mt-1">R<sub>t</sub> estimate</div>' +
        '</div>' +
        '<div class="text-center">' +
          '<div class="text-sm font-mono text-white/60">' + (rt.lower || '0.80') + ' \u2013 ' + (rt.upper || '1.20') + '</div>' +
          '<div class="text-[9px] text-white/30 mt-1">95% CI</div>' +
        '</div>' +
      '</div>' +
      // Rt visual bar
      '<div style="position:relative;height:6px;background:rgba(255,255,255,0.06);border-radius:3px;margin:0 20px 8px">' +
        '<div style="position:absolute;left:50%;top:-4px;bottom:-4px;width:2px;background:#ef4444;border-radius:1px" title="R=1.0"></div>' +
        '<div style="position:absolute;left:' + Math.min(95, Math.max(5, (rt.value || 1) / 2 * 100)) + '%;top:-6px;width:14px;height:14px;background:' + rtColor(rt.value) + ';border-radius:50%;transform:translateX(-50%);border:2px solid rgba(0,0,0,0.5);box-shadow:0 0 8px ' + rtColor(rt.value) + '60"></div>' +
        '<div style="position:absolute;left:' + Math.min(95, Math.max(5, (rt.lower || 0.8) / 2 * 100)) + '%;right:' + (100 - Math.min(95, Math.max(5, (rt.upper || 1.2) / 2 * 100))) + '%;height:100%;background:' + rtColor(rt.value) + '30;border-radius:3px"></div>' +
      '</div>' +
      '<div class="flex justify-between text-[8px] text-white/20 px-5"><span>0</span><span>0.5</span><span style="color:#ef4444">1.0</span><span>1.5</span><span>2.0</span></div>' +
      '<div class="mt-4 px-3 py-2 rounded-lg text-[10px] text-center" style="background:' + rtColor(rt.value) + '10;color:' + rtColor(rt.value) + '">' +
        '<i class="fas ' + rtIcon(rt.trend) + ' mr-1"></i>' + (rt.label || '') +
      '</div>' +
    '</div>' +

    // Summary Cards (4 cols)
    '<div class="lg:col-span-4 grid grid-cols-2 gap-3">' +
      analyticsSummaryCard('Total Threats', summary.totalThreats, 'fa-biohazard', '#ef4444') +
      analyticsSummaryCard('Critical', summary.criticalThreats, 'fa-skull-crossbones', '#dc2626') +
      analyticsSummaryCard('Total Cases', summary.totalCases, 'fa-users', '#f59e0b') +
      analyticsSummaryCard('Deaths', summary.totalDeaths, 'fa-cross', '#6b7280') +
      analyticsSummaryCard('Regions at Risk', summary.regionsAtRisk, 'fa-map-marked-alt', '#8b5cf6') +
      analyticsSummaryCard('Anomalies', summary.anomalyCount, 'fa-exclamation-triangle', anomalies.length > 0 ? '#f59e0b' : '#22c55e') +
    '</div>' +
    '</div>' + // end row 1

    // ROW 2: FORECAST CHART + ANOMALIES
    '<div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">' +

    // Forecast Panel
    '<div class="panel-card p-5">' +
      '<div class="flex items-center justify-between mb-3">' +
        '<div class="text-[10px] text-white/40 uppercase font-semibold tracking-wide"><i class="fas fa-chart-area mr-1"></i>Case Forecast (' + (cfg.forecastHorizon || 14) + '-day)</div>' +
        '<div class="flex items-center gap-2">' +
          '<span class="text-[9px] text-white/30">' + (fc.model || 'Linear Regression') + '</span>' +
          '<span class="px-1.5 py-0.5 rounded text-[8px] font-bold" style="background:' + (fc.confidence >= 60 ? 'rgba(0,168,107,0.15);color:#00A86B' : 'rgba(245,158,11,0.15);color:#f59e0b') + '">' + (fc.confidence || 0) + '% R\u00B2</span>' +
        '</div>' +
      '</div>' +
      '<div style="height:220px"><canvas id="forecastChart"></canvas></div>' +
    '</div>' +

    // Anomaly Alerts
    '<div class="panel-card">' +
      '<div class="px-4 py-3 border-b border-white/5 flex items-center justify-between">' +
        '<div class="text-[10px] text-white/40 uppercase font-semibold tracking-wide"><i class="fas fa-exclamation-triangle mr-1 text-yellow-400/60"></i>Anomaly Detection (\u03C3 \u2265 ' + (cfg.anomalyThreshold || 2.0) + ')</div>' +
        '<span class="px-2 py-0.5 rounded-full text-[9px] font-bold" style="background:' + (anomalies.length > 0 ? 'rgba(239,68,68,0.15);color:#ef4444' : 'rgba(34,197,94,0.15);color:#22c55e') + '">' + anomalies.length + ' detected</span>' +
      '</div>' +
      (anomalies.length === 0
        ? '<div class="p-8 text-center"><i class="fas fa-check-circle text-[#00A86B]/40 text-2xl mb-2"></i><p class="text-xs text-white/30">No anomalies detected above threshold</p></div>'
        : '<div class="divide-y divide-white/[0.03] max-h-[280px] overflow-y-auto">' +
          anomalies.map(function(a, i) {
            var sevColor = a.severity === 'critical' ? '#ef4444' : a.severity === 'high' ? '#f59e0b' : '#3b82f6';
            return '<div class="px-4 py-3 hover:bg-white/[0.02] transition cursor-pointer" onclick="showAnomalyDetail(' + i + ')">' +
              '<div class="flex items-center gap-3">' +
                '<div style="width:8px;height:8px;border-radius:50%;background:' + sevColor + ';box-shadow:0 0 6px ' + sevColor + '60;flex-shrink:0"></div>' +
                '<div class="flex-1 min-w-0">' +
                  '<div class="flex items-center gap-2">' +
                    '<span class="text-xs font-semibold text-white truncate">' + a.pathogen + '</span>' +
                    '<span class="px-1.5 py-0.5 rounded text-[8px] font-bold" style="background:' + sevColor + '20;color:' + sevColor + '">' + a.sigma + '\u03C3</span>' +
                  '</div>' +
                  '<p class="text-[10px] text-white/40 mt-0.5 truncate">' + a.description + '</p>' +
                '</div>' +
                '<div class="text-right flex-shrink-0">' +
                  '<div class="text-xs font-bold" style="color:' + sevColor + '">+' + a.deviation + '</div>' +
                  '<div class="text-[8px] text-white/25">expected ' + a.expected + '</div>' +
                '</div>' +
              '</div>' +
            '</div>';
          }).join('') +
        '</div>'
      ) +
    '</div>' +
    '</div>' + // end row 2

    // ROW 3: REGIONAL RISK HEATMAP + RISK DRIVERS
    '<div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">' +

    // Regional Risk Heatmap (2/3)
    '<div class="lg:col-span-2 panel-card">' +
      '<div class="px-4 py-3 border-b border-white/5">' +
        '<div class="text-[10px] text-white/40 uppercase font-semibold tracking-wide"><i class="fas fa-map mr-1"></i>Regional Risk Heatmap (' + regions.length + ' regions)</div>' +
      '</div>' +
      '<div class="p-4">' +
        '<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">' +
        regions.map(function(r) {
          var barWidth = Math.max(8, r.score);
          return '<div class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.03] transition cursor-pointer" onclick="showRegionDrilldown(\\'' + r.region + '\\')">' +
            '<div class="w-20 text-[11px] font-medium text-white/80 truncate" title="' + r.region + '">' + r.region + '</div>' +
            '<div class="flex-1 h-5 bg-white/[0.04] rounded-full overflow-hidden relative">' +
              '<div style="width:' + barWidth + '%;height:100%;background:linear-gradient(90deg,' + r.color + '80,' + r.color + ');border-radius:9999px;transition:width 1s ease"></div>' +
            '</div>' +
            '<div class="w-8 text-right text-xs font-bold" style="color:' + r.color + '">' + r.score + '</div>' +
            '<div class="w-12 text-right text-[9px] ' + (r.change > 0 ? 'text-red-400' : r.change < 0 ? 'text-green-400' : 'text-white/30') + '">' +
              (r.change > 0 ? '<i class="fas fa-caret-up mr-0.5"></i>+' + r.change : r.change < 0 ? '<i class="fas fa-caret-down mr-0.5"></i>' + r.change : '\u2014') +
            '</div>' +
          '</div>';
        }).join('') +
        '</div>' +
      '</div>' +
    '</div>' +

    // Risk Drivers (1/3)
    '<div class="panel-card">' +
      '<div class="px-4 py-3 border-b border-white/5">' +
        '<div class="text-[10px] text-white/40 uppercase font-semibold tracking-wide"><i class="fas fa-arrow-trend-up mr-1"></i>Top Risk Drivers</div>' +
      '</div>' +
      '<div class="divide-y divide-white/[0.03]">' +
      drivers.map(function(dr, i) {
        var dirIcon = dr.direction === 'up' ? 'fa-arrow-up text-red-400' : dr.direction === 'down' ? 'fa-arrow-down text-green-400' : 'fa-minus text-white/30';
        return '<div class="px-4 py-2.5">' +
          '<div class="flex items-center gap-2">' +
            '<span class="text-[10px] text-white/25 w-4">' + (i+1) + '</span>' +
            '<i class="fas ' + dirIcon + ' text-[9px]"></i>' +
            '<span class="text-[11px] font-medium text-white/80 truncate flex-1">' + dr.factor + '</span>' +
            '<span class="text-[10px] font-bold text-white/50">' + dr.contribution + '</span>' +
          '</div>' +
          '<p class="text-[9px] text-white/25 mt-0.5 ml-6 truncate">' + dr.detail + '</p>' +
        '</div>';
      }).join('') +
      '</div>' +
    '</div>' +
    '</div>' + // end row 3

  '</div>'; // end analytics-page

  // Store anomalies for detail modal
  _analyticsAnomalies = anomalies;

  // ---- Initialize Charts ----
  initAnalyticsCharts(d);
}

// ===== COMPONENT BAR (for national risk breakdown) =====
function analyticsComponentBar(label, value, color) {
  value = value || 0;
  return '<div class="text-center">' +
    '<div style="height:50px;display:flex;align-items:flex-end;justify-content:center">' +
      '<div style="width:16px;height:' + Math.max(4, value / 2) + 'px;background:' + color + ';border-radius:3px 3px 0 0;transition:height 1s ease;opacity:0.8"></div>' +
    '</div>' +
    '<div class="text-[8px] text-white/30 mt-1">' + label + '</div>' +
    '<div class="text-[9px] font-bold" style="color:' + color + '">' + value + '</div>' +
  '</div>';
}

// ===== SUMMARY CARD =====
function analyticsSummaryCard(title, value, icon, color) {
  return '<div class="panel-card p-3">' +
    '<div class="flex items-center gap-2 mb-1">' +
      '<div style="width:28px;height:28px;border-radius:8px;background:' + color + '15;display:flex;align-items:center;justify-content:center"><i class="fas ' + icon + '" style="color:' + color + ';font-size:11px"></i></div>' +
    '</div>' +
    '<div class="text-lg font-extrabold text-white">' + (value != null ? value : '-') + '</div>' +
    '<div class="text-[9px] text-white/35">' + title + '</div>' +
  '</div>';
}

// ===== Rt COLOR =====
function rtColor(v) {
  v = v || 1;
  if (v >= 1.5) return '#ef4444';
  if (v >= 1.1) return '#f59e0b';
  if (v >= 0.9) return '#3b82f6';
  return '#22c55e';
}

function rtIcon(trend) {
  if (trend === 'growing') return 'fa-arrow-trend-up';
  if (trend === 'declining') return 'fa-arrow-trend-down';
  return 'fa-minus';
}

// ===== FORECAST CHART (Chart.js) =====
function initAnalyticsCharts(d) {
  var fc = d.forecast || {};
  var points = fc.points || [];
  if (points.length === 0) return;

  // Also include recent historical data for context
  var weeklyTrend = d._weeklyConfirmed || [];
  
  var labels = points.map(function(p) { return p.date.slice(5); }); // MM-DD
  var predicted = points.map(function(p) { return p.predicted; });
  var upper = points.map(function(p) { return p.upper; });
  var lower = points.map(function(p) { return p.lower; });

  var canvasEl = document.getElementById('forecastChart');
  if (!canvasEl) return;

  makeChart(canvasEl, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Upper CI',
          data: upper,
          borderColor: 'transparent',
          backgroundColor: 'rgba(139,92,246,0.08)',
          fill: '+1',
          pointRadius: 0,
        },
        {
          label: 'Predicted',
          data: predicted,
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139,92,246,0.1)',
          borderWidth: 2.5,
          pointRadius: 4,
          pointBackgroundColor: '#8b5cf6',
          pointBorderColor: '#1a1a2e',
          pointBorderWidth: 2,
          fill: false,
          tension: 0.3,
        },
        {
          label: 'Lower CI',
          data: lower,
          borderColor: 'transparent',
          backgroundColor: 'rgba(139,92,246,0.08)',
          fill: '-1',
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'top', labels: { filter: function(item) { return item.text === 'Predicted'; }, color: 'rgba(255,255,255,0.5)', font: { size: 9 }, boxWidth: 12 } },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              if (ctx.datasetIndex === 1) return 'Predicted: ' + ctx.parsed.y + ' cases';
              if (ctx.datasetIndex === 0) return 'Upper: ' + ctx.parsed.y;
              return 'Lower: ' + ctx.parsed.y;
            }
          }
        },
      },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 9 } } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 9 } }, beginAtZero: false },
      },
    },
  });
}

// ===== ANOMALY DETAIL MODAL =====
var _analyticsAnomalies = [];
function showAnomalyDetail(idx) {
  // Store anomalies globally from last render
  var a = _analyticsAnomalies[idx];
  if (!a) return;
  var sevColor = a.severity === 'critical' ? '#ef4444' : a.severity === 'high' ? '#f59e0b' : '#3b82f6';
  document.getElementById('modal').innerHTML =
    '<div class="modal-overlay" onclick="if(event.target===this)closeModal()">' +
    '<div class="modal-content fade-in" style="max-width:480px">' +
      '<div class="flex items-center gap-3 mb-4">' +
        '<div style="width:10px;height:10px;border-radius:50%;background:' + sevColor + ';box-shadow:0 0 8px ' + sevColor + '60"></div>' +
        '<h3 class="text-sm font-bold text-white">' + a.pathogen + '</h3>' +
        '<span class="ml-auto px-2 py-0.5 rounded text-[9px] font-bold" style="background:' + sevColor + '20;color:' + sevColor + '">' + a.severity.toUpperCase() + '</span>' +
      '</div>' +
      '<div class="grid grid-cols-3 gap-3 mb-4">' +
        '<div class="text-center p-2 rounded-lg bg-white/[0.03]"><div class="text-lg font-bold text-white">' + a.actual + '</div><div class="text-[8px] text-white/30">Actual</div></div>' +
        '<div class="text-center p-2 rounded-lg bg-white/[0.03]"><div class="text-lg font-bold text-white/60">' + a.expected + '</div><div class="text-[8px] text-white/30">Expected</div></div>' +
        '<div class="text-center p-2 rounded-lg bg-white/[0.03]"><div class="text-lg font-bold" style="color:' + sevColor + '">' + a.sigma + '\u03C3</div><div class="text-[8px] text-white/30">Deviation</div></div>' +
      '</div>' +
      '<div class="text-xs text-white/60 mb-3">' + a.description + '</div>' +
      '<div class="text-[10px] text-white/30"><i class="fas fa-map-marker-alt mr-1"></i>' + a.region + '</div>' +
      '<div class="flex justify-end mt-4"><button onclick="closeModal()" class="px-4 py-1.5 bior-btn text-xs">Close</button></div>' +
    '</div></div>';
}

// ===== REGION DRILL-DOWN MODAL =====
function showRegionDrilldown(regionName) {
  document.getElementById('modal').innerHTML =
    '<div class="modal-overlay" onclick="if(event.target===this)closeModal()">' +
    '<div class="modal-content fade-in" style="max-width:500px">' +
      '<h3 class="text-sm font-bold text-white mb-4"><i class="fas fa-map-marked-alt mr-2 text-purple-400/60"></i>' + regionName + ' Region Detail</h3>' +
      '<div id="regionDrillContent"><div class="text-center py-6"><i class="fas fa-circle-notch fa-spin text-white/20"></i></div></div>' +
      '<div class="flex justify-end mt-4"><button onclick="closeModal()" class="px-4 py-1.5 bior-btn text-xs">Close</button></div>' +
    '</div></div>';
  
  // Fetch and populate
  api('/api/analytics').then(function(d) {
    var reg = (d.regionalRisks || []).find(function(r) { return r.region === regionName; });
    var threats = (d.riskDrivers || []).filter(function(dr) { return dr.detail && dr.detail.toLowerCase().includes(regionName.toLowerCase()); });
    var anomalies = (d.anomalies || []).filter(function(a) { return a.region && a.region.toLowerCase().includes(regionName.toLowerCase()); });
    var el = document.getElementById('regionDrillContent');
    if (!el || !reg) return;
    el.innerHTML =
      '<div class="grid grid-cols-3 gap-3 mb-4">' +
        '<div class="text-center p-3 rounded-lg bg-white/[0.03]"><div class="text-2xl font-bold" style="color:' + reg.color + '">' + reg.score + '</div><div class="text-[8px] text-white/30">Risk Score</div></div>' +
        '<div class="text-center p-3 rounded-lg bg-white/[0.03]"><div class="text-sm font-bold text-white/80">' + reg.level + '</div><div class="text-[8px] text-white/30">Level</div></div>' +
        '<div class="text-center p-3 rounded-lg bg-white/[0.03]"><div class="text-sm font-bold ' + (reg.change > 0 ? 'text-red-400' : 'text-green-400') + '">' + (reg.change > 0 ? '+' : '') + reg.change + '</div><div class="text-[8px] text-white/30">Week Change</div></div>' +
      '</div>' +
      '<div class="text-xs text-white/60 mb-2"><i class="fas fa-biohazard mr-1"></i>Top threat: <strong class="text-white/80">' + (reg.topThreat || 'N/A') + '</strong></div>' +
      '<div class="text-xs text-white/60"><i class="fas fa-arrow-' + (reg.trend === 'rising' ? 'up text-red-400' : 'down text-green-400') + ' mr-1"></i>Trend: ' + (reg.trend || 'stable') + '</div>' +
      (anomalies.length > 0 ? '<div class="mt-3 text-xs text-yellow-400/80"><i class="fas fa-exclamation-triangle mr-1"></i>' + anomalies.length + ' anomalies detected in this region</div>' : '');
  });
}

// ===== ANALYTICS CONFIG MODAL =====
function showAnalyticsConfig() {
  api('/api/analytics').then(function(d) {
    var cfg = d.config || {};
    document.getElementById('modal').innerHTML =
      '<div class="modal-overlay" onclick="if(event.target===this)closeModal()">' +
      '<div class="modal-content fade-in" style="max-width:400px">' +
        '<h3 class="text-sm font-bold text-white mb-4"><i class="fas fa-sliders-h mr-2 text-purple-400/60"></i>Analytics Configuration</h3>' +
        '<p class="text-[10px] text-white/30 mb-4">These parameters control the analytics engine. Changes require API update.</p>' +
        '<div class="space-y-2 text-[11px]">' +
          '<div class="flex justify-between p-2 bg-white/[0.03] rounded"><span class="text-white/50">Anomaly Threshold</span><span class="text-white font-mono">' + (cfg.anomalyThreshold || 2.0) + '\u03C3</span></div>' +
          '<div class="flex justify-between p-2 bg-white/[0.03] rounded"><span class="text-white/50">Forecast Horizon</span><span class="text-white font-mono">' + (cfg.forecastHorizon || 14) + ' days</span></div>' +
          '<div class="flex justify-between p-2 bg-white/[0.03] rounded"><span class="text-white/50">Forecast Model</span><span class="text-white font-mono">' + (cfg.forecastModel || 'OLS') + '</span></div>' +
          '<div class="flex justify-between p-2 bg-white/[0.03] rounded"><span class="text-white/50">Last Updated</span><span class="text-white font-mono">' + new Date(cfg.lastUpdated || Date.now()).toLocaleString() + '</span></div>' +
        '</div>' +
        '<div class="flex justify-end mt-4"><button onclick="closeModal()" class="px-4 py-1.5 bior-btn text-xs">Close</button></div>' +
      '</div></div>';
  });
}
  `;
}
