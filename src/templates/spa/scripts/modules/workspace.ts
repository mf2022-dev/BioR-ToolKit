// =============================================================================
// BioR Platform - Dashboard, Surveillance, Threats, Genomics, EWS, Alerts, Reports, Admin
// =============================================================================

export function getWorkspaceJS(): string {
  return `
// ===== PAGE LOADER =====
async function loadPage() {
  const el = document.getElementById('pageContent');
  if(!el) return;
  showSkeleton(el);
  destroyCharts();
  try {
    switch(state.currentPage) {
      case 'dashboard': await renderDashboard(el); break;
      case 'surveillance': await renderSurveillance(el); break;
      case 'threats': await renderThreats(el); break;
      case 'genomics': await renderGenomics(el); break;
      case 'ews': await renderEWS(el); break;
      case 'alerts': await renderAlerts(el); break;
      case 'reports': await renderReports(el); break;
      case 'admin': await renderAdmin(el); break;
      default: el.innerHTML = '<div class="empty-state"><i class="fas fa-compass"></i><p>Page not found</p><p class="text-[10px] text-white/20 mt-2">The module you requested doesn\\'t exist.</p><button onclick="navigate(\\'dashboard\\')" class="mt-4 px-4 py-2 bior-btn text-xs"><i class="fas fa-arrow-left mr-1.5"></i>Back to Dashboard</button></div>';
    }
    // Wrap content in page transition animation
    if (el.children[0] && !el.querySelector('.page-transition')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'page-transition';
      while (el.firstChild) wrapper.appendChild(el.firstChild);
      el.appendChild(wrapper);
    }
  } catch(err) { el.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle text-red-400"></i><p class="text-red-400">Error loading page</p><p class="text-[10px] text-white/30 mt-1 max-w-xs">' + err.message + '</p><button onclick="loadPage()" class="mt-4 px-4 py-2 bior-btn text-xs"><i class="fas fa-redo mr-1.5"></i>Retry</button></div>'; }
}

// ===== KPI CARD (clickable) =====
function kpi(title, icon, value, color, bg, sub, accent, sparkData, sparkColor, link) {
  const accentClass = accent ? ' accent-' + accent : '';
  const clickAttr = link ? ' onclick="navigate(\\'' + link + '\\')" style="cursor:pointer"' : '';
  return '<div class="kpi-card' + accentClass + ' p-4"' + clickAttr + '><div class="flex items-center justify-between mb-2"><span class="text-[10px] font-semibold text-white/40 uppercase tracking-wider">' + title + '</span><div class="w-8 h-8 rounded-xl ' + bg + ' flex items-center justify-center shadow-lg"><i class="fas ' + icon + ' ' + color + ' text-xs"></i></div></div><div class="flex items-end justify-between"><div><p class="text-2xl font-extrabold text-white tracking-tight counter-val" data-target="' + value + '">' + formatNum(value) + '</p><p class="text-[10px] text-white/35 mt-0.5 font-medium">' + sub + '</p></div>' + (sparkData ? '<div class="ml-2">' + svgSparkline(sparkData, sparkColor||'#00A86B') + '</div>' : '') + '</div></div>';
}

// ===== DASHBOARD =====
async function renderDashboard(el) {
  const d = await api('/api/dashboard');
  const threatPct = (d.threatLevel || 65) / 100;
  const circumference = 2 * Math.PI * 42;
  const dashOffset = circumference * (1 - threatPct);
  const threatColor = d.threatLevel >= 75 ? '#ef4444' : d.threatLevel >= 50 ? '#f59e0b' : '#00A86B';
  const threatLabel = d.threatLevel >= 75 ? 'CRITICAL' : d.threatLevel >= 50 ? 'ELEVATED' : 'LOW';

  el.innerHTML = '<div class="page-transition">' +
    '<div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">' +
    kpi('Active Cases','fa-virus',d.activeCases,'text-red-400','bg-red-500/15','+12% this week','red',d.sparklines?.cases,'#ef4444','threats') +
    kpi('Sites Monitored','fa-satellite-dish',d.sitesMonitored,'text-[#00A86B]','bg-[#00A86B]/15','24 active nationwide','green',d.sparklines?.sites,'#00A86B','surveillance') +
    kpi('Genomic Sequences','fa-dna',d.genomicSequences,'text-blue-400','bg-blue-500/15',d.sequencesProcessed+' processed','blue',d.sparklines?.sequences,'#3b82f6','genomics') +
    kpi('Active Alerts','fa-bell',d.activeAlerts,'text-amber-400','bg-amber-500/15',d.criticalAlerts+' critical, '+d.pendingReview+' pending','amber',d.sparklines?.alerts,'#f59e0b','alerts') +
    '</div>' +

    // Live ticker bar
    '<div class="panel-card px-4 py-2 mb-5 overflow-hidden relative"><div class="flex items-center gap-3"><span class="shrink-0 flex items-center gap-1.5 text-[10px] text-[#00A86B] font-semibold"><span class="pulse-dot bg-[#00A86B]"></span>LIVE</span><div class="ticker-wrap flex-1 overflow-hidden"><div class="ticker-track flex gap-8 whitespace-nowrap">' +
    (d.recentActivity||[]).map(a => {
      const col = {critical:'text-red-400',warning:'text-amber-400',info:'text-blue-400'};
      return '<span class="text-[10px] ' + (col[a.severity]||'text-white/50') + '"><i class="fas ' + (a.icon||'fa-info-circle') + ' mr-1"></i>' + a.message + ' <span class="text-white/20 ml-2">' + a.time + '</span></span>';
    }).join('') +
    '</div></div></div></div>' +

    // Analytics Intelligence Banner (mini outbreak risk + top anomaly)
    '<div id="dashAnalyticsBanner" class="panel-card px-4 py-3 mb-5 cursor-pointer hover:border-purple-500/30 transition" onclick="navigate(\\'analytics\\')" style="border-left:3px solid #8b5cf6">' +
      '<div class="flex items-center gap-4">' +
        '<div class="flex items-center gap-2"><i class="fas fa-brain text-purple-400/60"></i><span class="text-[10px] text-purple-400 font-semibold uppercase tracking-wide">Analytics</span></div>' +
        '<div id="dashAnalyticsContent" class="flex-1 text-[10px] text-white/40"><i class="fas fa-circle-notch fa-spin text-white/15 text-[9px] mr-1"></i>Loading intelligence...</div>' +
        '<i class="fas fa-arrow-right text-white/15 text-[10px]"></i>' +
      '</div>' +
    '</div>' +

    '<div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">' +
    // Threat level — animated SVG circle
    '<div class="panel-card p-5"><h3 class="text-[11px] font-semibold text-white/50 mb-3 uppercase tracking-wider">National Threat Level</h3>' +
    '<div class="text-center py-2">' +
    '<div class="threat-circle mx-auto mb-3">' +
    '<svg width="100" height="100" viewBox="0 0 100 100"><circle class="threat-circle-bg" cx="50" cy="50" r="42"/><circle class="threat-circle-fg" cx="50" cy="50" r="42" stroke="' + threatColor + '" stroke-dasharray="' + circumference.toFixed(1) + '" stroke-dashoffset="' + dashOffset.toFixed(1) + '"/></svg>' +
    '<div class="threat-circle-value"><span class="text-2xl font-bold text-white">' + d.threatLevel + '</span><span class="text-[9px] text-white/40 -mt-1">/100</span></div></div>' +
    '<p class="font-semibold text-sm" style="color:' + threatColor + '">' + threatLabel + '</p>' +
    '<p class="text-white/40 text-[10px] mt-1">Composite EWS Score</p></div>' +
    '<div class="space-y-2 mt-3">' + ['statistical','ml','osint','genomic'].map(k => {
      const labels = {statistical:'Statistical',ml:'ML Anomaly',osint:'OSINT Intel',genomic:'Genomic'};
      const icons = {statistical:'fa-chart-bar',ml:'fa-brain',osint:'fa-rss',genomic:'fa-dna'};
      const colors = {statistical:'amber',ml:'blue',osint:'purple',genomic:'emerald'};
      const hexColors = {statistical:'#f59e0b',ml:'#3b82f6',osint:'#8b5cf6',genomic:'#00A86B'};
      const sc = d.ewsScores?.[k]||0;
      const circ = 2*Math.PI*14;
      const off = circ*(1-sc/100);
      return '<div class="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-white/5 transition cursor-pointer" onclick="navigate(\\'ews\\')">' +
        '<svg width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="3"/><circle cx="18" cy="18" r="14" fill="none" stroke="'+hexColors[k]+'" stroke-width="3" stroke-dasharray="'+circ.toFixed(1)+'" stroke-dashoffset="'+off.toFixed(1)+'" stroke-linecap="round" transform="rotate(-90 18 18)" class="ews-ring"/></svg>' +
        '<div class="flex-1 min-w-0"><div class="flex justify-between text-[10px]"><span class="text-white/50"><i class="fas '+icons[k]+' mr-1 text-'+colors[k]+'-400"></i>'+labels[k]+'</span><span class="font-bold text-'+colors[k]+'-400">'+sc+'</span></div></div></div>';
    }).join('') + '</div></div>' +

    // Map — 2-col span
    '<div class="lg:col-span-2 panel-card p-5"><div class="flex items-center justify-between mb-3"><h3 class="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Surveillance Map</h3><div class="flex gap-3 text-[9px]"><span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-400"></span>Active</span><span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-red-400"></span>Alert</span><span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-gray-400"></span>Offline</span><span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-400"></span>Environmental</span></div></div><div id="dashMap" class="map-container"></div></div></div>' +

    // Weekly trend chart + Pathogens — equal split
    '<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">' +
    '<div class="panel-card p-5"><div class="flex items-center justify-between mb-3"><h3 class="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Weekly Case Trends</h3><div class="flex gap-1">' +
    ['4W','8W','12W'].map((p,i) => '<button class="text-[9px] px-2 py-0.5 rounded-lg transition ' + (i===2 ? 'bg-[#00A86B]/15 text-[#00A86B] border border-[#00A86B]/30' : 'text-white/30 hover:text-white/50 hover:bg-white/5') + '">' + p + '</button>').join('') +
    '</div></div><div style="height:240px"><canvas id="dashTrendChart"></canvas></div></div>' +
    '<div class="panel-card p-5"><div class="flex items-center justify-between mb-3"><h3 class="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Top Pathogens</h3><a onclick="navigate(\\'threats\\')" class="text-[10px] text-[#00A86B] hover:text-[#00c77b] cursor-pointer font-medium">View All <i class="fas fa-arrow-right ml-0.5"></i></a></div><div class="space-y-2">' +
    (d.topPathogens||[]).map((p,i) => '<div class="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition cursor-pointer"><div class="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/70">' + (i+1) + '</div><div class="flex-1 min-w-0"><div class="flex justify-between items-center mb-0.5"><span class="text-xs font-medium text-white/85 truncate">' + p.name + '</span><span class="text-[10px] ' + (p.trend==='rising'?'text-red-400':p.trend==='falling'?'text-[#00A86B]':'text-white/50') + '"><i class="fas fa-arrow-' + (p.trend==='rising'?'up':p.trend==='falling'?'down':'right') + ' mr-1"></i>' + p.cases + '</span></div><div class="flex items-center gap-2"><div class="flex-1 bg-white/10 rounded-full h-1"><div class="rounded-full h-1 ' + (p.severity==='critical'?'bg-red-500':p.severity==='high'?'bg-orange-500':p.severity==='medium'?'bg-amber-500':'bg-[#00A86B]') + '" style="width:' + p.percent + '%"></div></div><span class="text-[9px] text-white/40">' + (p.lineage||'') + '</span></div></div></div>').join('') +
    '</div></div></div>' +

    // Region cases + Data Quality
    '<div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">' +
    '<div class="panel-card p-5"><h3 class="text-[11px] font-semibold text-white/50 mb-3 uppercase tracking-wider">Cases by Region</h3><div style="height:200px"><canvas id="dashRegionChart"></canvas></div></div>' +
    '<div class="panel-card p-5"><h3 class="text-[11px] font-semibold text-white/50 mb-3 uppercase tracking-wider">Data Quality Index</h3>' +
    '<div class="flex items-center justify-center py-4"><div class="relative"><svg width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="8"/><circle cx="60" cy="60" r="52" fill="none" stroke="' + (d.dataQualityAvg>=80?'#00A86B':d.dataQualityAvg>=60?'#f59e0b':'#ef4444') + '" stroke-width="8" stroke-dasharray="' + (2*Math.PI*52).toFixed(1) + '" stroke-dashoffset="' + (2*Math.PI*52*(1-(d.dataQualityAvg||75)/100)).toFixed(1) + '" stroke-linecap="round" transform="rotate(-90 60 60)" class="ews-ring"/></svg><div class="absolute inset-0 flex flex-col items-center justify-center"><span class="text-2xl font-bold ' + (d.dataQualityAvg>=80?'text-[#00A86B]':d.dataQualityAvg>=60?'text-amber-400':'text-red-400') + '">' + (d.dataQualityAvg||75) + '%</span><span class="text-[9px] text-white/40">Average DQ</span></div></div></div>' +
    '<div class="grid grid-cols-3 gap-2 mt-2">' +
    '<div class="text-center p-2 rounded-lg bg-white/5"><p class="text-xs font-bold text-[#00A86B]">92%</p><p class="text-[8px] text-white/30">Completeness</p></div>' +
    '<div class="text-center p-2 rounded-lg bg-white/5"><p class="text-xs font-bold text-amber-400">78%</p><p class="text-[8px] text-white/30">Timeliness</p></div>' +
    '<div class="text-center p-2 rounded-lg bg-white/5"><p class="text-xs font-bold text-blue-400">85%</p><p class="text-[8px] text-white/30">Accuracy</p></div>' +
    '</div></div>' +
    // Quick stats sidebar
    '<div class="panel-card p-5"><h3 class="text-[11px] font-semibold text-white/50 mb-3 uppercase tracking-wider">System Status</h3><div class="space-y-3">' +
    '<div class="flex items-center justify-between p-2.5 rounded-lg bg-white/5"><div class="flex items-center gap-2"><span class="pulse-dot bg-[#00A86B]"></span><span class="text-xs text-white/70">API Uptime</span></div><span class="text-xs font-bold text-[#00A86B]">99.97%</span></div>' +
    '<div class="flex items-center justify-between p-2.5 rounded-lg bg-white/5"><div class="flex items-center gap-2"><i class="fas fa-database text-[10px] text-white/30"></i><span class="text-xs text-white/70">Data Pipeline</span></div><span class="text-xs font-bold text-[#00A86B]">Healthy</span></div>' +
    '<div class="flex items-center justify-between p-2.5 rounded-lg bg-white/5"><div class="flex items-center gap-2"><i class="fas fa-clock text-[10px] text-white/30"></i><span class="text-xs text-white/70">Last Sync</span></div><span class="text-xs font-bold text-white/50">2m ago</span></div>' +
    '<div class="flex items-center justify-between p-2.5 rounded-lg bg-white/5"><div class="flex items-center gap-2"><i class="fas fa-users text-[10px] text-white/30"></i><span class="text-xs text-white/70">Active Users</span></div><span class="text-xs font-bold text-blue-400">14</span></div>' +
    '<div class="flex items-center justify-between p-2.5 rounded-lg bg-white/5"><div class="flex items-center gap-2"><i class="fas fa-shield-alt text-[10px] text-white/30"></i><span class="text-xs text-white/70">Security Level</span></div><span class="text-xs font-bold text-amber-400">Elevated</span></div>' +
    '</div></div></div>' +
    '<div class="panel-card p-5"><div class="flex items-center justify-between mb-3"><h3 class="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Recent Activity Feed</h3><a onclick="navigate(\\'alerts\\')" class="text-[10px] text-[#00A86B] hover:text-[#00c77b] cursor-pointer font-medium">View All <i class="fas fa-arrow-right ml-0.5"></i></a></div><div class="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto scrollbar-thin">' +
    (d.recentActivity||[]).map(a => {
      const borderCol = {critical:'border-l-red-500',warning:'border-l-amber-500',info:'border-l-blue-500'};
      const bgCol = {critical:'bg-red-900/10',warning:'bg-amber-900/10',info:'bg-white/5'};
      const iconCol = {critical:'bg-red-900/50 text-red-400',warning:'bg-amber-900/50 text-amber-400',info:'bg-blue-900/50 text-blue-400'};
      return '<div class="flex items-start gap-2 p-2.5 rounded-xl ' + (bgCol[a.severity]||bgCol.info) + ' border border-white/6 border-l-[3px] ' + (borderCol[a.severity]||borderCol.info) + ' hover:bg-white/8 transition"><div class="w-6 h-6 rounded-lg ' + (iconCol[a.severity]||iconCol.info) + ' flex items-center justify-center shrink-0"><i class="fas ' + (a.icon||'fa-info-circle') + ' text-[9px]"></i></div><div class="flex-1 min-w-0"><p class="text-[11px] text-white/85 leading-tight">' + a.message + '</p><p class="text-[9px] text-white/40 mt-0.5">' + a.time + '</p></div></div>';
    }).join('') + '</div></div></div>';

  // Animate KPI counters
  setTimeout(() => animateCounters(), 100);

  // Map with custom markers
  setTimeout(() => {
    const mapEl = document.getElementById('dashMap');
    if(!mapEl) return;
    const map = L.map('dashMap',{zoomControl:false}).setView([24.0,44.0],5);
    L.control.zoom({position:'bottomright'}).addTo(map);
    var mapTheme = (document.documentElement.getAttribute('data-theme') || 'dark');
    var tileUrl = mapTheme === 'light' ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png' : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    L.tileLayer(tileUrl,{attribution:'CARTO'}).addTo(map);
    const typeIcons = {Hospital:'fa-hospital',Airport:'fa-plane',Wastewater:'fa-water',Environment:'fa-leaf',Border:'fa-passport',Sentinel:'fa-satellite-dish'};
    (d.mapMarkers||[]).forEach(m => {
      const iconClass = typeIcons[m.type]||'fa-map-marker-alt';
      const markerColor = m.status==='Alert'?'#ef4444':m.status==='Offline'?'#6b7280':'#00A86B';
      const customIcon = L.divIcon({className:'custom-marker',html:'<div style="background:'+markerColor+';width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid rgba(255,255,255,0.3);box-shadow:0 2px 8px '+markerColor+'60"><i class="fas '+iconClass+'" style="color:white;font-size:10px"></i></div>',iconSize:[28,28],iconAnchor:[14,14]});
      const popupSparkline = m.weeklyData ? svgSparkline(m.weeklyData, markerColor, 80, 24) : '';
      L.marker([m.lat,m.lng],{icon:customIcon}).addTo(map)
        .bindPopup('<div style="font-family:Inter;font-size:11px;min-width:160px"><div style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><b style="color:#fff">'+m.name+'</b><span style="font-size:9px;padding:1px 6px;border-radius:8px;background:'+markerColor+'30;color:'+markerColor+'">'+m.status+'</span></div><div style="color:#9ca3af;font-size:10px;margin-bottom:4px"><i class="fas '+iconClass+'" style="margin-right:4px;color:'+markerColor+'"></i>'+m.type+'</div><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="color:#9ca3af;font-size:10px">Cases: <b style="color:#fff">'+(m.cases||0)+'</b></span></div>'+popupSparkline+'</div>',{className:'bior-popup'});
    });
  }, 100);

  // Weekly trend chart
  if(d.weeklyTrend) {
    makeChart('dashTrendChart',{type:'line',data:{labels:d.weeklyTrend.labels,datasets:[{label:'Confirmed',data:d.weeklyTrend.confirmed,borderColor:'#00A86B',backgroundColor:'rgba(34,197,94,0.08)',fill:true,tension:0.4,pointRadius:2,pointHoverRadius:4,borderWidth:2},{label:'Suspected',data:d.weeklyTrend.suspected,borderColor:'#f59e0b',backgroundColor:'rgba(245,158,11,0.08)',fill:true,tension:0.4,pointRadius:2,pointHoverRadius:4,borderWidth:2},{label:'Deaths',data:d.weeklyTrend.deaths,borderColor:'#ef4444',backgroundColor:'rgba(239,68,68,0.05)',fill:false,tension:0.4,pointRadius:2,borderWidth:1.5,yAxisID:'y1'}]},options:{...chartDefaults,scales:{...chartDefaults.scales,y1:{position:'right',ticks:{color:'#ef4444',font:{size:9}},grid:{display:false}}}}});
  }
  // Region donut chart
  if(d.regionBreakdown) {
    makeChart('dashRegionChart',{type:'doughnut',data:{labels:d.regionBreakdown.map(function(r){return r.name}),datasets:[{data:d.regionBreakdown.map(function(r){return r.cases}),backgroundColor:d.regionBreakdown.map(function(r){return r.color}),borderWidth:0,hoverOffset:6}]},options:{responsive:true,maintainAspectRatio:false,cutout:'68%',plugins:{legend:{position:'right',labels:{color:'rgba(255,255,255,0.5)',font:{size:9},padding:8,boxWidth:10,boxHeight:10,usePointStyle:true,pointStyle:'circle'}},tooltip:{backgroundColor:'rgba(26,31,46,0.95)',titleColor:'#fff',bodyColor:'rgba(255,255,255,0.7)',borderColor:'rgba(255,255,255,0.1)',borderWidth:1,padding:10,cornerRadius:10,callbacks:{label:function(ctx){return ' '+ctx.label+': '+ctx.parsed+' cases';}}}}}});
  }

  // Populate Analytics Intelligence Banner (async, non-blocking)
  api('/api/analytics').then(function(a) {
    var el2 = document.getElementById('dashAnalyticsContent');
    if (!el2 || a.error) return;
    var nr = a.nationalRisk || {};
    var anom = a.anomalies || [];
    var rt = a.rt || {};
    var rtCol = (rt.value || 1) >= 1.1 ? '#ef4444' : (rt.value || 1) >= 0.9 ? '#f59e0b' : '#22c55e';
    el2.innerHTML =
      '<span style="color:' + (nr.color || '#f59e0b') + ';font-weight:700">Risk ' + (nr.score || 0) + '/100 ' + (nr.level || '') + '</span>' +
      '<span class="text-white/15 mx-2">\u2022</span>' +
      '<span>R<sub>t</sub> <strong style="color:' + rtCol + '">' + (rt.value || '1.00') + '</strong></span>' +
      '<span class="text-white/15 mx-2">\u2022</span>' +
      (anom.length > 0
        ? '<span class="text-yellow-400"><i class="fas fa-exclamation-triangle mr-1"></i>' + anom.length + ' anomal' + (anom.length===1?'y':'ies') + ' \u2014 ' + anom[0].pathogen + ' (' + anom[0].sigma + '\u03C3)</span>'
        : '<span class="text-green-400"><i class="fas fa-check-circle mr-1"></i>No anomalies detected</span>');
  }).catch(function(){});
}

// ===== SURVEILLANCE =====
async function renderSurveillance(el) {
  const d = await api('/api/surveillance');
  const active = d.sites.filter(s=>s.status==='Active').length;
  const alertSites = d.sites.filter(s=>s.status==='Alert').length;
  const offline = d.sites.filter(s=>s.status==='Offline').length;
  const totalCases = d.sites.reduce((s,x)=>s+x.casesThisWeek,0);

  el.innerHTML =
    // KPI row with accent colors
    '<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">' +
    '<div class="kpi-card accent-green p-3"><div class="flex items-center justify-between"><div><p class="text-[10px] text-white/40 mb-1">Active Sites</p><p class="text-xl font-bold text-[#00A86B]">' + active + '</p></div><div class="w-8 h-8 rounded-xl bg-[#00A86B]/15 flex items-center justify-center"><i class="fas fa-check-circle text-[#00A86B] text-xs"></i></div></div></div>' +
    '<div class="kpi-card accent-red p-3"><div class="flex items-center justify-between"><div><p class="text-[10px] text-white/40 mb-1">On Alert</p><p class="text-xl font-bold text-red-400">' + alertSites + '</p></div><div class="w-8 h-8 rounded-xl bg-red-500/15 flex items-center justify-center"><i class="fas fa-exclamation-circle text-red-400 text-xs"></i></div></div></div>' +
    '<div class="kpi-card p-3"><div class="flex items-center justify-between"><div><p class="text-[10px] text-white/40 mb-1">Offline</p><p class="text-xl font-bold text-white/50">' + offline + '</p></div><div class="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center"><i class="fas fa-power-off text-white/40 text-xs"></i></div></div></div>' +
    '<div class="kpi-card accent-amber p-3"><div class="flex items-center justify-between"><div><p class="text-[10px] text-white/40 mb-1">Total Cases</p><p class="text-xl font-bold text-amber-400">' + totalCases + '</p></div><div class="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center"><i class="fas fa-virus text-amber-400 text-xs"></i></div></div></div>' +
    '</div>' +

    // Filter toolbar
    '<div class="panel-card p-3 mb-4"><div class="flex flex-wrap items-center gap-2">' +
    '<div class="flex items-center gap-2 flex-1 min-w-0"><i class="fas fa-filter text-[10px] text-white/30"></i>' +
    '<input type="text" id="survSearch" placeholder="Search sites..." class="bior-input px-3 py-1.5 text-xs flex-1 min-w-[120px]" oninput="filterSurvTable()" />' +
    '<select id="survType" class="bior-input px-3 py-1.5 text-xs" onchange="filterSurvTable()"><option value="">All Types</option><option value="Hospital">Hospital</option><option value="Airport">Airport</option><option value="Wastewater">Wastewater</option><option value="Environment">Environment</option><option value="Border">Border</option><option value="Sentinel">Sentinel</option></select>' +
    '<select id="survStatus" class="bior-input px-3 py-1.5 text-xs" onchange="filterSurvTable()"><option value="">All Status</option><option value="Active">Active</option><option value="Alert">Alert</option><option value="Offline">Offline</option></select></div>' +
    '<div class="flex items-center gap-1.5"><span class="text-[10px] text-white/30">' + d.sites.length + ' sites</span>' +
    '<button onclick="filterSurvTable()" class="px-3 py-1.5 bior-btn text-[10px]"><i class="fas fa-search mr-1"></i>Apply</button></div></div></div>' +

    // Side-by-side: Map + Table
    '<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">' +
    '<div class="panel-card p-4"><h3 class="text-[11px] font-semibold text-white/50 mb-3 uppercase tracking-wider"><i class="fas fa-map-marked-alt mr-1.5"></i>Geographic View</h3><div id="survMap" class="map-container" style="height:420px"></div></div>' +
    '<div class="panel-card overflow-hidden"><div class="px-4 py-3 border-b border-white/6 flex items-center justify-between"><h3 class="text-[11px] font-semibold text-white/50 uppercase tracking-wider"><i class="fas fa-table mr-1.5"></i>Site Directory</h3><span class="text-[9px] text-white/25">Click row for details</span></div>' +
    '<div class="overflow-y-auto" style="max-height:420px"><table class="w-full text-xs" id="survTable"><thead class="bg-white/5 sticky top-0"><tr>' +
    '<th class="px-3 py-2 text-left text-[10px] font-medium text-white/50 uppercase">Site</th><th class="px-3 py-2 text-left text-[10px] font-medium text-white/50 uppercase">Type</th><th class="px-3 py-2 text-left text-[10px] font-medium text-white/50 uppercase">Status</th><th class="px-3 py-2 text-left text-[10px] font-medium text-white/50 uppercase">Cases</th><th class="px-3 py-2 text-left text-[10px] font-medium text-white/50 uppercase">DQ</th></tr></thead><tbody class="divide-y divide-gray-800" id="survTableBody">' +
    d.sites.map(s => '<tr class="hover:bg-white/5 transition cursor-pointer surv-row" data-name="' + s.name.toLowerCase() + '" data-type="' + s.type + '" data-status="' + s.status + '" onclick="showSiteDetail(\\'' + s.id + '\\')">' +
      '<td class="px-3 py-2 font-medium text-white/85 text-[11px]">' + s.name + '<div class="text-[9px] text-white/30">' + s.region + '</div></td>' +
      '<td class="px-3 py-2"><span class="badge bg-white/10 text-white/60 text-[9px]">' + s.type + '</span></td>' +
      '<td class="px-3 py-2"><span class="w-2 h-2 rounded-full inline-block mr-1 ' + (s.status==='Active'?'bg-[#00A86B]':s.status==='Alert'?'bg-red-400 animate-pulse':'bg-white/30') + '"></span><span class="text-[10px] ' + (s.status==='Active'?'text-[#00A86B]':s.status==='Alert'?'text-red-400':'text-white/50') + '">' + s.status + '</span></td>' +
      '<td class="px-3 py-2 text-white/70 font-medium">' + s.casesThisWeek + '</td>' +
      '<td class="px-3 py-2"><div class="flex items-center gap-1"><div class="w-8 bg-white/10 rounded-full h-1"><div class="h-1 rounded-full ' + (s.dqScore>=80?'bg-[#00A86B]':s.dqScore>=60?'bg-amber-500':'bg-red-500') + '" style="width:' + s.dqScore + '%"></div></div><span class="text-[9px] text-white/40">' + s.dqScore + '</span></div></td>' +
      '</tr>').join('') +
    '</tbody></table></div></div></div>';

  // Map with custom markers
  setTimeout(() => {
    const map = L.map('survMap',{zoomControl:false}).setView([24.0,44.0],5);
    L.control.zoom({position:'bottomright'}).addTo(map);
    var survMapTheme = (document.documentElement.getAttribute('data-theme') || 'dark');
    var survTileUrl = survMapTheme === 'light' ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png' : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    L.tileLayer(survTileUrl,{attribution:'CARTO'}).addTo(map);
    const typeIcons = {Hospital:'fa-hospital',Airport:'fa-plane',Wastewater:'fa-water',Environment:'fa-leaf',Border:'fa-passport',Sentinel:'fa-satellite-dish'};
    d.sites.forEach(s => {
      if(!s.lat||!s.lng) return;
      const markerColor = s.status==='Active'?'#00A86B':s.status==='Alert'?'#ef4444':'#6b7280';
      const iconClass = typeIcons[s.type]||'fa-map-marker-alt';
      const customIcon = L.divIcon({className:'custom-marker',html:'<div style="background:'+markerColor+';width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid rgba(255,255,255,0.3);box-shadow:0 2px 8px '+markerColor+'60'+(s.status==='Alert'?';animation:pulse 2s infinite':'')+'"  ><i class="fas '+iconClass+'" style="color:white;font-size:9px"></i></div>',iconSize:[26,26],iconAnchor:[13,13]});
      L.marker([s.lat,s.lng],{icon:customIcon}).addTo(map)
        .bindPopup('<div style="font-family:Inter;font-size:11px;min-width:160px"><b style="color:#fff">'+s.name+'</b><div style="color:#9ca3af;font-size:10px;margin:3px 0"><i class="fas '+iconClass+'" style="margin-right:4px;color:'+markerColor+'"></i>'+s.type+' | <span style="color:'+markerColor+'">'+s.status+'</span></div><div style="display:flex;justify-content:space-between;font-size:10px"><span style="color:#9ca3af">Cases: <b style="color:#fff">'+s.casesThisWeek+'</b></span><span style="color:#9ca3af">DQ: <b style="color:'+(s.dqScore>=80?'#00A86B':s.dqScore>=60?'#f59e0b':'#ef4444')+'">'+s.dqScore+'%</b></span></div></div>',{className:'bior-popup'});
    });
  }, 100);
}

// Client-side table filter
window.filterSurvTable = function() {
  const q = (document.getElementById('survSearch')?.value||'').toLowerCase();
  const type = document.getElementById('survType')?.value||'';
  const status = document.getElementById('survStatus')?.value||'';
  document.querySelectorAll('.surv-row').forEach(r => {
    const show = (!q || r.dataset.name.includes(q)) && (!type || r.dataset.type===type) && (!status || r.dataset.status===status);
    r.style.display = show ? '' : 'none';
  });
};

window.filterSurveillance = () => navigate('surveillance');

window.showSiteDetail = async function(id) {
  const s = await api('/api/surveillance/' + id);
  if(s.error) return;
  showModal(
    '<div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold text-white">' + s.name + '</h3><button onclick="closeModal()" class="text-white/40 hover:text-white"><i class="fas fa-times"></i></button></div>' +
    '<div class="grid grid-cols-2 gap-3 mb-4">' +
    '<div class="bg-white/6 rounded-xl p-3"><p class="text-[10px] text-white/40 uppercase">Type</p><p class="text-sm text-white">' + s.type + '</p></div>' +
    '<div class="bg-white/6 rounded-xl p-3"><p class="text-[10px] text-white/40 uppercase">Region</p><p class="text-sm text-white">' + s.region + '</p></div>' +
    '<div class="bg-white/6 rounded-xl p-3"><p class="text-[10px] text-white/40 uppercase">Status</p><p class="text-sm"><span class="badge ' + (s.status==='Active'?'bg-[#00A86B]/15 text-[#00A86B]':s.status==='Alert'?'bg-red-900/50 text-red-400':'bg-white/10 text-white/50') + '">' + s.status + '</span></p></div>' +
    '<div class="bg-white/6 rounded-xl p-3"><p class="text-[10px] text-white/40 uppercase">DQ Score</p><p class="text-sm text-white">' + s.dqScore + '%</p></div>' +
    '<div class="bg-white/6 rounded-xl p-3"><p class="text-[10px] text-white/40 uppercase">Cases This Week</p><p class="text-sm font-bold text-white">' + s.casesThisWeek + '</p></div>' +
    '<div class="bg-white/6 rounded-xl p-3"><p class="text-[10px] text-white/40 uppercase">Samples Submitted</p><p class="text-sm text-white">' + s.samplesSubmitted + '</p></div>' +
    '</div>' +
    '<div class="bg-white/6 rounded-xl p-3 mb-3"><p class="text-[10px] text-white/40 uppercase mb-1">Contact</p><p class="text-xs text-white">' + (s.contactPerson||'N/A') + '</p><p class="text-[10px] text-white/50">' + (s.phone||'') + '</p></div>' +
    '<div class="bg-white/6 rounded-xl p-3 mb-3"><p class="text-[10px] text-white/40 uppercase mb-1">Capacity</p><p class="text-xs text-white">' + (s.capacity||'N/A') + '</p></div>' +
    '<div class="bg-white/6 rounded-xl p-3"><p class="text-[10px] text-white/40 uppercase mb-1">Pathogens Monitored</p><div class="flex flex-wrap gap-1 mt-1">' + (s.pathogens||[]).map(p => '<span class="badge bg-white/10 text-white/70">' + p + '</span>').join('') + '</div></div>'
  );
};

// ===== THREATS =====
let threatsData = [];
async function renderThreats(el) {
  const d = await api('/api/threats');
  threatsData = d.threats || [];
  const severities = ['Critical','High','Medium','Low'];
  const sevIcons = {Critical:'fa-radiation',High:'fa-exclamation-triangle',Medium:'fa-shield-virus',Low:'fa-shield-alt'};
  const sevColors = {Critical:'red',High:'orange',Medium:'amber',Low:'emerald'};

  el.innerHTML =
    // KPI row with accent colors
    '<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">' +
    severities.map(sev => {
      const count = d.threats.filter(t=>t.severity===sev).length;
      const col = sevColors[sev];
      const accent = col === 'emerald' ? 'green' : col;
      return '<div class="kpi-card accent-' + accent + ' p-3"><div class="flex items-center justify-between"><div><p class="text-[10px] text-white/40 mb-1">' + sev + '</p><p class="text-xl font-bold text-' + col + '-400">' + count + '</p></div><div class="w-8 h-8 rounded-xl bg-' + col + '-500/15 flex items-center justify-center"><i class="fas ' + sevIcons[sev] + ' text-' + col + '-400 text-xs"></i></div></div></div>';
    }).join('') + '</div>' +

    // Filter bar
    '<div class="panel-card p-3 mb-4"><div class="flex items-center gap-3">' +
    '<span class="text-[10px] text-white/30"><i class="fas fa-filter mr-1"></i>Filter:</span>' +
    '<div class="flex gap-1">' +
    '<button class="threat-filter-btn text-[10px] px-3 py-1 rounded-lg bg-[#00A86B]/15 text-[#00A86B] border border-[#00A86B]/30" data-severity="" onclick="filterThreats(this,\\'\\')">All (' + d.threats.length + ')</button>' +
    severities.map(sev => '<button class="threat-filter-btn text-[10px] px-3 py-1 rounded-lg text-white/40 hover:text-white/60 hover:bg-white/5 transition" data-severity="' + sev + '" onclick="filterThreats(this,\\'' + sev + '\\')">' + sev + ' (' + d.threats.filter(t=>t.severity===sev).length + ')</button>').join('') +
    '</div><div class="ml-auto text-[10px] text-white/25">' + d.threats.length + ' active threats</div></div></div>' +

    // Grouped threats by severity
    severities.map(sev => {
      const threats = d.threats.filter(t=>t.severity===sev);
      if (threats.length===0) return '';
      const col = sevColors[sev];
      return '<div class="threat-group mb-4" data-severity="' + sev + '">' +
        '<div class="flex items-center gap-2 mb-2 cursor-pointer" onclick="toggleThreatGroup(this)">' +
        '<i class="fas fa-chevron-down text-[10px] text-' + col + '-400 transition-transform threat-chevron"></i>' +
        '<span class="text-[11px] font-semibold text-' + col + '-400 uppercase tracking-wider"><i class="fas ' + sevIcons[sev] + ' mr-1.5"></i>' + sev + '</span>' +
        '<span class="text-[10px] text-white/30">(' + threats.length + ')</span>' +
        '<div class="flex-1 h-px bg-' + col + '-500/15 ml-2"></div></div>' +
        '<div class="space-y-2 threat-group-body">' +
        threats.map(t => {
          const sCol = col;
          return '<div class="panel-card p-4 cursor-pointer hover:border-' + sCol + '-500/30 transition" onclick="showThreatDetail(\\'' + t.id + '\\')">' +
            '<div class="flex items-start justify-between gap-4"><div class="flex-1"><div class="flex items-center gap-2 mb-1"><span class="badge bg-' + sCol + '-900/50 text-' + sCol + '-400">' + t.severity + '</span>' +
            (t.ihReportable?'<span class="badge bg-blue-900/50 text-blue-400"><i class="fas fa-globe mr-1"></i>IHR</span>':'') +
            '<span class="badge bg-white/10 text-white/50">' + t.icd11 + '</span></div>' +
            '<h4 class="text-sm font-semibold text-gray-100">' + t.name + '</h4>' +
            '<p class="text-xs text-white/50 mt-1"><i class="fas fa-virus mr-1"></i>' + t.pathogen + ' <span class="text-white/30">|</span> <i class="fas fa-map-marker-alt mr-1 ml-1"></i>' + t.regions.join(', ') + '</p></div>' +
            '<div class="text-right shrink-0"><p class="text-lg font-bold text-' + sCol + '-400">' + t.cases + '</p><p class="text-[9px] text-white/40">cases</p>' +
            '<p class="text-[10px] mt-1 ' + (t.trend==='rising'?'text-red-400':t.trend==='falling'?'text-[#00A86B]':'text-white/50') + '"><i class="fas fa-arrow-' + (t.trend==='rising'?'up':t.trend==='falling'?'down':'right') + '"></i> ' + t.weeklyChange + '/wk</p></div></div>' +
            '<div class="flex items-center gap-4 mt-3 pt-3 border-t border-white/6"><div class="flex-1"><div class="flex justify-between text-[10px] mb-0.5"><span class="text-white/40">Containment</span><span class="text-white/50">' + t.containment + '%</span></div><div class="w-full bg-white/10 rounded-full h-1.5"><div class="h-1.5 rounded-full transition-all duration-500 ' + (t.containment>=75?'bg-[#00A86B]':t.containment>=50?'bg-amber-500':'bg-red-500') + '" style="width:' + t.containment + '%"></div></div></div>' +
            '<div class="text-[10px] text-white/40"><i class="fas fa-flask mr-1"></i>' + t.labConfirmed + ' confirmed</div>' +
            '<div class="text-[10px] text-white/40"><i class="fas fa-skull-crossbones mr-1"></i>CFR ' + (t.cfr||0) + '%</div>' +
            '<div class="text-[10px] text-white/40"><i class="fas fa-calendar mr-1"></i>' + t.detected + '</div></div></div>';
        }).join('') + '</div></div>';
    }).join('');
}

window.toggleThreatGroup = function(header) {
  const body = header.nextElementSibling;
  const chevron = header.querySelector('.threat-chevron');
  if (body.style.display === 'none') { body.style.display = ''; chevron.style.transform = ''; }
  else { body.style.display = 'none'; chevron.style.transform = 'rotate(-90deg)'; }
};

window.filterThreats = function(btn, severity) {
  document.querySelectorAll('.threat-filter-btn').forEach(b => { b.className = 'threat-filter-btn text-[10px] px-3 py-1 rounded-lg text-white/40 hover:text-white/60 hover:bg-white/5 transition'; });
  btn.className = 'threat-filter-btn text-[10px] px-3 py-1 rounded-lg bg-[#00A86B]/15 text-[#00A86B] border border-[#00A86B]/30';
  document.querySelectorAll('.threat-group').forEach(g => {
    g.style.display = (!severity || g.dataset.severity === severity) ? '' : 'none';
  });
};

window.showThreatDetail = function(id) {
  const t = threatsData.find(x => x.id === id);
  if(!t) return;
  const contColor = t.containment>=75?'#00A86B':t.containment>=50?'#f59e0b':'#ef4444';
  const contCircum = 2*Math.PI*30;
  const contOffset = contCircum*(1-t.containment/100);
  showModal(
    '<div class="flex items-center justify-between mb-4"><div class="flex items-center gap-2"><h3 class="text-lg font-semibold text-white">' + t.name + '</h3><span class="badge bg-' + ({Critical:'red',High:'orange',Medium:'amber',Low:'emerald'}[t.severity]||'gray') + '-900/50 text-' + ({Critical:'red',High:'orange',Medium:'amber',Low:'emerald'}[t.severity]||'gray') + '-400">' + t.severity + '</span>' + (t.ihReportable?'<span class="badge bg-blue-900/50 text-blue-400"><i class="fas fa-globe mr-1"></i>IHR Reportable</span>':'') + '</div><button onclick="closeModal()" class="text-white/40 hover:text-white"><i class="fas fa-times"></i></button></div>' +

    // Key metrics row
    '<div class="grid grid-cols-4 gap-3 mb-4">' +
    '<div class="bg-white/6 rounded-xl p-3 text-center"><p class="text-lg font-bold text-white">' + t.cases + '</p><p class="text-[10px] text-white/40">Total Cases</p></div>' +
    '<div class="bg-white/6 rounded-xl p-3 text-center"><p class="text-lg font-bold text-red-400">' + t.deaths + '</p><p class="text-[10px] text-white/40">Deaths</p></div>' +
    '<div class="bg-white/6 rounded-xl p-3 text-center"><p class="text-lg font-bold text-amber-400">' + t.riskScore + '</p><p class="text-[10px] text-white/40">Risk Score</p></div>' +
    '<div class="bg-white/6 rounded-xl p-3 text-center"><p class="text-lg font-bold text-white">' + (t.cfr||0) + '%</p><p class="text-[10px] text-white/40">CFR</p></div></div>' +

    // Containment gauge + details
    '<div class="grid grid-cols-2 gap-4 mb-4">' +
    '<div class="bg-white/6 rounded-xl p-4"><p class="text-[10px] text-white/40 uppercase mb-3">Containment Progress</p><div class="flex items-center gap-4"><svg width="70" height="70" viewBox="0 0 70 70"><circle cx="35" cy="35" r="30" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="5"/><circle cx="35" cy="35" r="30" fill="none" stroke="' + contColor + '" stroke-width="5" stroke-dasharray="' + contCircum.toFixed(1) + '" stroke-dashoffset="' + contOffset.toFixed(1) + '" stroke-linecap="round" transform="rotate(-90 35 35)" style="transition:stroke-dashoffset 1s"/></svg><div><p class="text-2xl font-bold" style="color:' + contColor + '">' + t.containment + '%</p><p class="text-[10px] text-white/40">' + t.labConfirmed + ' lab confirmed</p></div></div></div>' +
    '<div class="bg-white/6 rounded-xl p-4"><p class="text-[10px] text-white/40 uppercase mb-2">Response Details</p><div class="space-y-2">' +
    '<div class="flex justify-between text-xs"><span class="text-white/50"><i class="fas fa-users mr-1.5"></i>Response Teams</span><span class="text-white font-semibold">' + (t.responseTeams||0) + ' deployed</span></div>' +
    '<div class="flex justify-between text-xs"><span class="text-white/50"><i class="fas fa-map-marker-alt mr-1.5"></i>Regions</span><span class="text-white font-semibold">' + t.regions.join(', ') + '</span></div>' +
    '<div class="flex justify-between text-xs"><span class="text-white/50"><i class="fas fa-virus mr-1.5"></i>Pathogen</span><span class="text-[#00A86B] font-mono text-[10px]">' + t.pathogen + '</span></div>' +
    '<div class="flex justify-between text-xs"><span class="text-white/50"><i class="fas fa-code mr-1.5"></i>ICD-11</span><span class="text-white/70 font-mono text-[10px]">' + t.icd11 + '</span></div>' +
    (t.waterSources?'<div class="flex justify-between text-xs"><span class="text-white/50"><i class="fas fa-water mr-1.5"></i>Water Sources</span><span class="text-amber-400 font-semibold">' + t.waterSources + ' contaminated</span></div>':'') +
    '</div></div></div>' +

    // Trend indicator
    '<div class="bg-white/6 rounded-xl p-3 mb-4 flex items-center justify-between"><div class="flex items-center gap-3"><i class="fas fa-chart-line text-white/40"></i><span class="text-xs text-white/60">Weekly Trend</span></div><div class="flex items-center gap-2"><span class="text-sm font-bold ' + (t.trend==='rising'?'text-red-400':t.trend==='falling'?'text-[#00A86B]':'text-white/50') + '"><i class="fas fa-arrow-' + (t.trend==='rising'?'up':t.trend==='falling'?'down':'right') + ' mr-1"></i>' + t.weeklyChange + '/week</span><span class="badge ' + (t.trend==='rising'?'bg-red-900/50 text-red-400':'bg-[#00A86B]/15 text-[#00A86B]') + '">' + t.trend + '</span></div></div>' +

    // Timeline
    (t.timeline ? '<div class="mb-4"><p class="text-[10px] font-semibold text-white/50 uppercase mb-3"><i class="fas fa-stream mr-1.5"></i>Event Timeline</p><div class="space-y-3">' +
    t.timeline.map(function(e,i) { return '<div class="flex items-start gap-3"><div class="relative"><div class="timeline-dot ' + ({detection:'bg-blue-500',confirmation:'bg-amber-500',alert:'bg-red-500',response:'bg-[#00A86B]',escalation:'bg-purple-500'}[e.type]||'bg-gray-500') + '"></div>' + (i<t.timeline.length-1?'<div class="timeline-line"></div>':'') + '</div><div class="pb-3"><p class="text-xs font-medium text-white/85">' + e.event + '</p><p class="text-[10px] text-white/40">' + e.date + '</p></div></div>'; }).join('') +
    '</div></div>' : '') +

    // Genomic cluster
    (t.genomicClusterId ? '<div class="bg-white/6 rounded-xl p-3"><p class="text-[10px] text-white/40 uppercase mb-1"><i class="fas fa-dna mr-1"></i>Genomic Cluster</p><p class="text-xs font-mono text-[#00A86B]">' + t.genomicClusterId + '</p><p class="text-[9px] text-white/30 mt-1">Detected: ' + t.detected + '</p></div>' : '')
  );
};

// ===== GENOMICS =====
let genomicSamplesData = [];
async function renderGenomics(el) {
  const d = await api('/api/genomics');
  genomicSamplesData = d.samples || [];
  const completed = d.samples.filter(s=>s.pipelineStatus==='Completed').length;
  const processing = d.samples.filter(s=>s.pipelineStatus==='Processing').length;
  const failed = d.samples.filter(s=>s.pipelineStatus==='Failed').length;
  const amrCount = d.samples.filter(s=>s.amrDetected).length;

  el.innerHTML =
    '<div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">' +
    '<div class="kpi-card accent-blue p-3"><p class="text-[10px] text-white/40 mb-1">Total Samples</p><p class="text-xl font-bold text-white">' + d.total + '</p></div>' +
    '<div class="kpi-card accent-green p-3"><p class="text-[10px] text-white/40 mb-1">Completed</p><p class="text-xl font-bold text-[#00A86B]">' + completed + '</p></div>' +
    '<div class="kpi-card p-3"><p class="text-[10px] text-white/40 mb-1">Processing</p><p class="text-xl font-bold text-blue-400">' + processing + '</p></div>' +
    '<div class="kpi-card accent-red p-3"><p class="text-[10px] text-white/40 mb-1">Failed</p><p class="text-xl font-bold text-red-400">' + failed + '</p></div>' +
    '<div class="kpi-card accent-amber p-3"><p class="text-[10px] text-white/40 mb-1"><i class="fas fa-exclamation-triangle mr-1 text-amber-400"></i>AMR+</p><p class="text-xl font-bold text-amber-400">' + amrCount + '</p></div></div>' +

    // Enhanced pipeline with arrow connectors
    '<div class="panel-card p-5 mb-5"><h3 class="text-[11px] font-semibold text-white/50 mb-4 uppercase tracking-wider"><i class="fas fa-stream mr-1.5"></i>Genomic Pipeline Workflow</h3><div class="flex items-center justify-between gap-1 overflow-x-auto">' +
    (d.pipelineStages||d.pipeline||[]).map((p,i) => {
      const isActive = p.active > 0;
      const hasFailed = p.failed > 0;
      return '<div class="flex-1 min-w-[90px] text-center pipeline-step cursor-pointer" onclick="showPipelineStage(\\''+p.name+'\\','+p.completed+','+p.active+','+(p.failed||0)+')">' +
        '<div class="w-14 h-14 mx-auto rounded-xl border flex items-center justify-center mb-2 transition-all ' +
        (isActive ? 'bg-blue-500/10 border-blue-500/40 shadow-lg shadow-blue-500/10' : hasFailed ? 'bg-red-500/10 border-red-500/30' : 'bg-white/6 border-white/10') + '">' +
        '<i class="fas ' + p.icon + ' text-lg ' + (isActive ? 'text-blue-400' : hasFailed ? 'text-red-400' : 'text-[#00A86B]') + '"></i></div>' +
        '<p class="text-[10px] font-medium text-white/70">' + p.name + '</p>' +
        '<div class="flex justify-center gap-2 mt-1">' +
        '<span class="text-[9px] text-[#00A86B]"><i class="fas fa-check text-[7px] mr-0.5"></i>' + p.completed + '</span>' +
        (p.active>0?'<span class="text-[9px] text-blue-400"><i class="fas fa-spinner fa-spin text-[7px] mr-0.5"></i>' + p.active + '</span>':'') +
        (p.failed>0?'<span class="text-[9px] text-red-400"><i class="fas fa-times text-[7px] mr-0.5"></i>' + p.failed + '</span>':'') +
        '</div></div>' +
        (i<(d.pipelineStages||d.pipeline||[]).length-1?'<div class="flex items-center px-1" style="margin-top:-20px"><i class="fas fa-long-arrow-alt-right text-white/15 text-sm"></i></div>':'');
    }).join('') +
    '</div></div>' +

    '<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">' +
    '<div class="panel-card p-5"><h3 class="text-[11px] font-semibold text-white/50 mb-3 uppercase">Pipeline Status</h3><div style="height:200px"><canvas id="genomicsChart"></canvas></div></div>' +
    // AMR Heatmap
    '<div class="panel-card p-5"><h3 class="text-[11px] font-semibold text-white/50 mb-3 uppercase">AMR Resistance Heatmap (%)</h3>' +
    (d.amrHeatmap ? '<div class="overflow-x-auto"><table class="w-full text-[10px]"><thead><tr><th class="p-1"></th>' + d.amrHeatmap.antibiotics.map(a => '<th class="p-1 text-white/50 font-normal" style="writing-mode:vertical-lr;transform:rotate(180deg);height:80px">' + a + '</th>').join('') + '</tr></thead><tbody>' +
    d.amrHeatmap.pathogens.map((p,pi) => '<tr><td class="p-1 text-white/70 whitespace-nowrap pr-2">' + p + '</td>' + d.amrHeatmap.data[pi].map((v,ai) => '<td class="p-1"><div class="heatmap-cell relative group w-8 h-6 rounded flex items-center justify-center text-[9px] font-bold cursor-help ' + (v>=80?'bg-red-600 text-white':v>=50?'bg-orange-600 text-white':v>=20?'bg-amber-600 text-white':'bg-emerald-800 text-emerald-300') + '">' + v + '<div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1.5 bg-gray-900 text-white text-[10px] rounded-lg shadow-xl border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">' + p + ' vs ' + d.amrHeatmap.antibiotics[ai] + '<br><span class="font-bold ' + (v>=80?'text-red-400':v>=50?'text-orange-400':v>=20?'text-amber-400':'text-emerald-400') + '">' + v + '% resistance</span><br><span class="text-white/40">' + (v>=80?'High resistance':v>=50?'Moderate':v>=20?'Low':'Susceptible') + '</span><span class="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900"></span></div></div></td>').join('') + '</tr>').join('') +
    '</tbody></table></div>' : '') + '</div></div>' +

    // Sample table
    '<div class="panel-card overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-xs"><thead class="bg-white/5"><tr>' +
    '<th class="px-3 py-2.5 text-left text-[10px] font-medium text-white/50 uppercase">Sample</th><th class="px-3 py-2.5 text-left text-[10px] font-medium text-white/50 uppercase">Pathogen</th><th class="px-3 py-2.5 text-left text-[10px] font-medium text-white/50 uppercase">Lineage</th><th class="px-3 py-2.5 text-left text-[10px] font-medium text-white/50 uppercase">Platform</th><th class="px-3 py-2.5 text-left text-[10px] font-medium text-white/50 uppercase">Status</th><th class="px-3 py-2.5 text-left text-[10px] font-medium text-white/50 uppercase">Coverage</th><th class="px-3 py-2.5 text-left text-[10px] font-medium text-white/50 uppercase">AMR</th><th class="px-3 py-2.5"></th></tr></thead><tbody class="divide-y divide-gray-800">' +
    d.samples.map(s => '<tr class="hover:bg-white/5 cursor-pointer" onclick="showSampleDetail(\\'' + s.sampleId + '\\')">' +
      '<td class="px-3 py-2 font-mono text-[10px] text-[#00A86B]">' + s.sampleId + '</td>' +
      '<td class="px-3 py-2 text-white/70">' + s.pathogen + '</td>' +
      '<td class="px-3 py-2 font-mono text-[10px] text-white/50">' + (s.lineage||'—') + '</td>' +
      '<td class="px-3 py-2 text-white/50 text-[10px]">' + s.platform + '</td>' +
      '<td class="px-3 py-2"><span class="badge ' + (s.pipelineStatus==='Completed'?'bg-[#00A86B]/15 text-[#00A86B]':s.pipelineStatus==='Processing'?'bg-blue-900/50 text-blue-400':'bg-red-900/50 text-red-400') + '">' + s.pipelineStatus + '</span></td>' +
      '<td class="px-3 py-2 text-white/50">' + s.coverage + 'x</td>' +
      '<td class="px-3 py-2">' + (s.amrDetected?'<span class="badge bg-red-900/50 text-red-400"><i class="fas fa-exclamation-triangle mr-1"></i>AMR+</span>':'<span class="badge bg-white/10 text-white/50">—</span>') + '</td>' +
      '<td class="px-3 py-2 text-white/40"><i class="fas fa-chevron-right text-[9px]"></i></td></tr>').join('') +
    '</tbody></table></div></div>';

  makeChart('genomicsChart',{type:'doughnut',data:{labels:['Completed','Processing','Failed'],datasets:[{data:[completed,processing,failed],backgroundColor:['#00A86B','#3b82f6','#ef4444'],borderWidth:0,borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{color:'#9ca3af',font:{size:10},padding:15}},tooltip:{backgroundColor:'#1f2937',titleColor:'#fff',bodyColor:'#d1d5db'}},cutout:'65%'}});
}

window.showSampleDetail = function(id) {
  const s = genomicSamplesData.find(x => x.sampleId === id);
  if(!s) return;
  showModal(
    '<div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold text-white font-mono">' + s.sampleId + '</h3><button onclick="closeModal()" class="text-white/40 hover:text-white"><i class="fas fa-times"></i></button></div>' +
    '<div class="grid grid-cols-2 gap-3 mb-4">' +
    '<div class="bg-white/6 rounded-xl p-3"><p class="text-[10px] text-white/40 uppercase">Pathogen</p><p class="text-sm text-white">' + s.pathogen + '</p></div>' +
    '<div class="bg-white/6 rounded-xl p-3"><p class="text-[10px] text-white/40 uppercase">Lineage</p><p class="text-sm font-mono text-[#00A86B]">' + (s.lineage||'Pending') + '</p></div>' +
    '<div class="bg-white/6 rounded-xl p-3"><p class="text-[10px] text-white/40 uppercase">Platform</p><p class="text-sm text-white">' + s.platform + '</p></div>' +
    '<div class="bg-white/6 rounded-xl p-3"><p class="text-[10px] text-white/40 uppercase">Read Length</p><p class="text-sm text-white">' + (s.readLength||'N/A') + '</p></div>' +
    '<div class="bg-white/6 rounded-xl p-3"><p class="text-[10px] text-white/40 uppercase">Total Reads</p><p class="text-sm text-white">' + (s.totalReads||'N/A') + '</p></div>' +
    '<div class="bg-white/6 rounded-xl p-3"><p class="text-[10px] text-white/40 uppercase">Coverage</p><p class="text-sm text-white">' + s.coverage + 'x</p></div>' +
    '<div class="bg-white/6 rounded-xl p-3"><p class="text-[10px] text-white/40 uppercase">Assembly</p><p class="text-sm text-white">' + (s.assemblyLength||'N/A') + '</p></div>' +
    '<div class="bg-white/6 rounded-xl p-3"><p class="text-[10px] text-white/40 uppercase">Mutations</p><p class="text-sm text-white">' + (s.mutations||0) + (s.novelMutations?' <span class="text-amber-400">(' + s.novelMutations + ' novel)</span>':'') + '</p></div></div>' +
    (s.amrDetected ? '<div class="kpi-card p-3 mb-3"><p class="text-[10px] text-red-400 uppercase font-semibold mb-1"><i class="fas fa-exclamation-triangle mr-1"></i>AMR Genes Detected</p><div class="flex flex-wrap gap-1.5">' + s.amrGenes.map(g => {
      const amrInfo = {mecA:'Methicillin resistance',blaNDM:'Carbapenem resistance (NDM)',blaKPC:'Carbapenem resistance (KPC)',vanA:'Vancomycin resistance',mcr1:'Colistin resistance',blaCTX:'Extended-spectrum beta-lactamase',blaOXA:'Oxacillin resistance',tetM:'Tetracycline resistance'};
      const desc = amrInfo[g] || 'Antimicrobial resistance gene';
      return '<span class="relative group"><span class="badge bg-red-900/50 text-red-400 cursor-help border border-red-800/30 hover:bg-red-900/70 transition"><i class="fas fa-dna mr-1 text-[8px]"></i>' + g + '</span><span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1.5 bg-gray-900 text-white text-[10px] rounded-lg shadow-xl border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">' + desc + '<span class="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900"></span></span></span>';
    }).join('') + '</div></div>' : '') +
    // Dynamic phylogenetic tree
    (function(){
      var muts = s.mutations || 0;
      var novelMuts = s.novelMutations || 0;
      var lin = s.lineage || s.pathogen;
      var cov = s.coverage || 0;
      var amr = s.amrDetected ? 1 : 0;
      // Branch lengths scaled by mutation count (min 40, max 120)
      var bLen = Math.min(120, Math.max(40, muts * 3));
      var bLen2 = Math.min(100, Math.max(30, novelMuts * 8));
      // Colors based on data
      var sampleColor = amr ? '#ef4444' : (novelMuts > 2 ? '#f59e0b' : '#3b82f6');
      var covPct = Math.min(100, cov);
      return '<div class="bg-white/6 rounded-xl p-4 mb-3"><div class="flex items-center justify-between mb-3"><p class="text-[10px] text-white/40 uppercase"><i class="fas fa-project-diagram mr-1"></i>Phylogenetic Relationship</p><div class="flex items-center gap-3 text-[9px]"><span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-[#00A86B]"></span>Root</span><span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full" style="background:'+sampleColor+'"></span>This Sample</span><span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-[#3b82f6]"></span>Reference</span><span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-white/20"></span>Outgroup</span></div></div>' +
      '<svg width="100%" height="140" viewBox="0 0 520 140" class="phylo-tree">' +
      // Root
      '<circle cx="14" cy="70" r="5" fill="#00A86B" class="phylo-node"><animate attributeName="r" values="5;6;5" dur="2s" repeatCount="indefinite"/></circle>' +
      '<text x="14" y="90" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-size="8" font-family="Inter">Root</text>' +
      // Main trunk
      '<line x1="19" y1="70" x2="80" y2="70" stroke="#00A86B" stroke-width="2" opacity="0.7"/>' +
      // First branch point
      '<circle cx="80" cy="70" r="3" fill="#00A86B" opacity="0.5"/>' +
      '<line x1="80" y1="30" x2="80" y2="110" stroke="#00A86B" stroke-width="1.5" opacity="0.4"/>' +
      // Upper branch — this sample + reference
      '<line x1="80" y1="30" x2="'+Math.round(80+bLen)+'" y2="30" stroke="'+sampleColor+'" stroke-width="2"/>' +
      '<circle cx="'+Math.round(80+bLen)+'" cy="30" r="3" fill="'+sampleColor+'" opacity="0.5"/>' +
      '<line x1="'+Math.round(80+bLen)+'" y1="15" x2="'+Math.round(80+bLen)+'" y2="45" stroke="'+sampleColor+'" stroke-width="1.5" opacity="0.4"/>' +
      // This sample leaf
      '<line x1="'+Math.round(80+bLen)+'" y1="15" x2="'+Math.round(80+bLen+bLen2+40)+'" y2="15" stroke="'+sampleColor+'" stroke-width="2"/>' +
      '<circle cx="'+Math.round(80+bLen+bLen2+40)+'" cy="15" r="5" fill="'+sampleColor+'"><animate attributeName="opacity" values="1;0.6;1" dur="1.5s" repeatCount="indefinite"/></circle>' +
      '<text x="'+Math.round(80+bLen+bLen2+48)+'" y="12" fill="rgba(255,255,255,0.8)" font-size="9" font-weight="600" font-family="Inter">'+lin+'</text>' +
      '<text x="'+Math.round(80+bLen+bLen2+48)+'" y="23" fill="rgba(255,255,255,0.35)" font-size="8" font-family="Inter">'+muts+' mutations'+(novelMuts?' ('+novelMuts+' novel)':'')+'</text>' +
      // Reference strain leaf
      '<line x1="'+Math.round(80+bLen)+'" y1="45" x2="'+Math.round(80+bLen+60)+'" y2="45" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4,2"/>' +
      '<circle cx="'+Math.round(80+bLen+60)+'" cy="45" r="4" fill="#3b82f6"/>' +
      '<text x="'+Math.round(80+bLen+68)+'" y="48" fill="rgba(255,255,255,0.4)" font-size="9" font-family="Inter">Reference strain</text>' +
      // Middle branch — related cluster
      '<line x1="80" y1="70" x2="200" y2="70" stroke="#8b5cf6" stroke-width="1.5"/>' +
      '<circle cx="200" cy="70" r="4" fill="#8b5cf6"/>' +
      '<text x="210" y="73" fill="rgba(255,255,255,0.4)" font-size="9" font-family="Inter">Cluster A (related isolates)</text>' +
      // Lower branch — outgroup
      '<line x1="80" y1="110" x2="150" y2="110" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>' +
      '<circle cx="150" cy="110" r="3" fill="rgba(255,255,255,0.2)"/>' +
      '<line x1="150" y1="100" x2="150" y2="120" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>' +
      '<line x1="150" y1="100" x2="220" y2="100" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>' +
      '<circle cx="220" cy="100" r="3" fill="rgba(255,255,255,0.15)"/>' +
      '<text x="228" y="103" fill="rgba(255,255,255,0.25)" font-size="8" font-family="Inter">Outgroup B</text>' +
      '<line x1="150" y1="120" x2="220" y2="120" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>' +
      '<circle cx="220" cy="120" r="3" fill="rgba(255,255,255,0.15)"/>' +
      '<text x="228" y="123" fill="rgba(255,255,255,0.25)" font-size="8" font-family="Inter">Outgroup C</text>' +
      // Scale bar
      '<line x1="10" y1="135" x2="60" y2="135" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>' +
      '<line x1="10" y1="132" x2="10" y2="138" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>' +
      '<line x1="60" y1="132" x2="60" y2="138" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>' +
      '<text x="35" y="130" text-anchor="middle" fill="rgba(255,255,255,0.2)" font-size="7" font-family="Inter">~10 substitutions</text>' +
      '</svg>' +
      // Coverage & quality bar below tree
      '<div class="grid grid-cols-2 gap-3 mt-3"><div class="bg-white/5 rounded-lg p-2"><p class="text-[9px] text-white/30 mb-1">Coverage Depth</p><div class="flex items-center gap-2"><div class="flex-1 bg-white/10 rounded-full h-1.5"><div class="h-1.5 rounded-full transition-all '+(cov>=30?'bg-[#00A86B]':cov>=10?'bg-amber-500':'bg-red-500')+'" style="width:'+Math.min(100,cov/50*100)+'%"></div></div><span class="text-[10px] font-mono text-white/60">'+cov+'x</span></div></div><div class="bg-white/5 rounded-lg p-2"><p class="text-[9px] text-white/30 mb-1">Genetic Distance</p><div class="flex items-center gap-2"><div class="flex-1 bg-white/10 rounded-full h-1.5"><div class="h-1.5 rounded-full bg-[#8b5cf6]" style="width:'+Math.min(100,muts/20*100)+'%"></div></div><span class="text-[10px] font-mono text-white/60">'+muts+' SNPs</span></div></div></div>' +
      '</div>';
    })() +
    '<div class="bg-white/6 rounded-xl p-3"><p class="text-[10px] text-white/40 uppercase">Institution</p><p class="text-xs text-white">' + s.institution + '</p><p class="text-[10px] text-white/40 mt-1">Date: ' + s.date + '</p></div>'
  );
};

// ===== PIPELINE STAGE DETAIL =====
window.showPipelineStage = function(name, completed, active, failed) {
  const total = completed + active + failed;
  const pct = total > 0 ? Math.round(completed/total*100) : 0;
  const circ = 2*Math.PI*28;
  const off = circ*(1-pct/100);
  showModal(
    '<div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold text-white"><i class="fas fa-stream mr-2 text-[#00A86B]"></i>' + name + '</h3><button onclick="closeModal()" class="text-white/40 hover:text-white"><i class="fas fa-times"></i></button></div>' +
    '<div class="grid grid-cols-2 gap-4 mb-4">' +
    '<div class="flex items-center gap-4 bg-white/6 rounded-xl p-4"><svg width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="4"/><circle cx="32" cy="32" r="28" fill="none" stroke="#00A86B" stroke-width="4" stroke-dasharray="'+circ.toFixed(1)+'" stroke-dashoffset="'+off.toFixed(1)+'" stroke-linecap="round" transform="rotate(-90 32 32)"/><text x="32" y="36" text-anchor="middle" fill="white" font-size="14" font-weight="bold" font-family="Inter">'+pct+'%</text></svg><div><p class="text-xs text-white/50">Completion Rate</p><p class="text-sm font-bold text-white">' + completed + ' / ' + total + ' samples</p></div></div>' +
    '<div class="bg-white/6 rounded-xl p-4 space-y-3">' +
    '<div class="flex justify-between text-xs"><span class="text-white/50"><i class="fas fa-check-circle mr-1.5 text-[#00A86B]"></i>Completed</span><span class="text-[#00A86B] font-bold">' + completed + '</span></div>' +
    '<div class="flex justify-between text-xs"><span class="text-white/50"><i class="fas fa-spinner mr-1.5 text-blue-400"></i>Processing</span><span class="text-blue-400 font-bold">' + active + '</span></div>' +
    '<div class="flex justify-between text-xs"><span class="text-white/50"><i class="fas fa-times-circle mr-1.5 text-red-400"></i>Failed</span><span class="text-red-400 font-bold">' + failed + '</span></div>' +
    '</div></div>' +
    '<div class="bg-white/6 rounded-xl p-3"><div class="flex items-center gap-2"><div class="flex-1 bg-white/10 rounded-full h-2"><div class="bg-[#00A86B] h-2 rounded-full transition-all" style="width:' + (total>0?completed/total*100:0) + '%"></div>' + (active>0?'<div class="bg-blue-500 h-2 rounded-l-none" style="width:'+(active/total*100)+'%;margin-top:-8px"></div>':'') + '</div></div>' +
    '<div class="flex justify-between mt-2 text-[9px] text-white/30"><span>0%</span><span>Pipeline Progress</span><span>100%</span></div></div>'
  );
};

// ===== EWS =====
async function renderEWS(el) {
  const d = await api('/api/ews');
  el.innerHTML =
    '<div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">' +
    '<div class="kpi-card accent-amber p-4"><p class="text-[10px] text-white/40 uppercase mb-1">Active Signals</p><p class="text-2xl font-bold text-amber-400">' + d.activeSignals + '</p><p class="text-[10px] text-white/40">' + d.newSignals24h + ' new in 24h</p></div>' +
    '<div class="kpi-card accent-red p-4"><p class="text-[10px] text-white/40 uppercase mb-1">National Risk Score</p><p class="text-2xl font-bold ' + (d.nationalRiskScore>=70?'text-red-400':d.nationalRiskScore>=40?'text-amber-400':'text-[#00A86B]') + '">' + d.nationalRiskScore + '/100</p><p class="text-[10px] ' + (d.riskTrend==='rising'?'text-red-400':'text-[#00A86B]') + '"><i class="fas fa-arrow-' + (d.riskTrend==='rising'?'up':'down') + '"></i> ' + d.riskTrend + '</p></div>' +
    '<div class="kpi-card accent-purple p-4"><p class="text-[10px] text-white/40 uppercase mb-1">OSINT Processed</p><p class="text-2xl font-bold text-purple-400">' + formatNum(d.osintArticles) + '</p><p class="text-[10px] text-white/40">' + d.osintRelevant + ' relevant signals</p></div></div>' +

    '<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">' +
    // Risk history chart
    '<div class="panel-card p-5"><h3 class="text-[11px] font-semibold text-white/50 mb-3 uppercase">National Risk Score (30-Day Trend)</h3><div style="height:200px"><canvas id="ewsRiskChart"></canvas></div></div>' +
    // Forecast
    '<div class="panel-card p-5"><h3 class="text-[11px] font-semibold text-white/50 mb-3 uppercase">7-Day Forecast: ' + (d.forecast?.pathogen||'') + ' - ' + (d.forecast?.region||'') + '</h3><div style="height:200px"><canvas id="ewsForecastChart"></canvas></div><p class="text-[9px] text-white/40 mt-2"><i class="fas fa-brain mr-1"></i>Model: ' + (d.forecast?.model||'') + ' | Confidence: ' + ((d.forecast?.confidence||0)*100) + '%</p></div></div>' +

    '<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">' +
    // Regional risks — animated bars
    '<div class="panel-card p-5"><h3 class="text-[11px] font-semibold text-white/50 mb-3 uppercase"><i class="fas fa-map-marked mr-1.5"></i>Regional Risk Scores</h3><div class="space-y-2.5">' +
    (d.regionalRisks||[]).map(r => {
      const rColor = r.score>=70?'red':r.score>=40?'amber':'emerald';
      return '<div class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition"><span class="text-[10px] text-white/60 w-24 truncate font-medium">' + r.region + '</span><div class="flex-1 bg-white/6 rounded-full h-3 overflow-hidden"><div class="h-3 rounded-full risk-bar-animate bg-' + rColor + '-500" style="width:' + r.score + '%;--bar-width:' + r.score + '%"></div></div><span class="text-[11px] font-mono w-8 text-right font-bold text-' + rColor + '-400">' + r.score + '</span><span class="text-[9px] w-8 text-right ' + (r.change?.startsWith('+')?'text-red-400':'text-[#00A86B]') + '">' + (r.change||'') + '</span></div>';
    }).join('') +
    '</div></div>' +
    // Detection layers — enhanced cards
    '<div class="panel-card p-5"><h3 class="text-[11px] font-semibold text-white/50 mb-3 uppercase"><i class="fas fa-layer-group mr-1.5"></i>Detection Layers</h3><div class="space-y-3">' +
    (d.detectionLayers||[]).map(l => {
      const hasSignals = l.signals > 0;
      return '<div class="detection-layer p-3 rounded-xl bg-white/5 border border-white/10 ' + (hasSignals?'border-'+l.color+'-500/20':'') + ' hover:bg-white/8 transition">' +
        '<div class="flex items-center justify-between mb-2">' +
        '<div class="flex items-center gap-2"><div class="w-8 h-8 rounded-lg bg-' + l.color + '-500/15 flex items-center justify-center"><i class="fas ' + l.icon + ' text-' + l.color + '-400 text-xs"></i></div><span class="text-xs font-semibold text-white/85">' + l.name + '</span></div>' +
        '<div class="flex items-center gap-2"><span class="badge ' + (hasSignals?'bg-'+l.color+'-900/50 text-'+l.color+'-400':'bg-white/10 text-white/50') + '">' + l.signals + ' signals</span>' +
        '<div class="w-2 h-2 rounded-full ' + (hasSignals?'bg-'+l.color+'-400 animate-pulse':'bg-white/20') + '"></div></div></div>' +
        '<p class="text-[10px] text-white/40 mb-2">' + l.description + '</p>' +
        '<div class="flex items-center gap-4 pt-2 border-t border-white/6 text-[9px] text-white/25"><span><i class="fas fa-clock mr-1"></i>Last: ' + (l.lastRun||'') + '</span><span><i class="fas fa-forward mr-1"></i>Next: ' + (l.nextRun||'') + '</span>' +
        (hasSignals?'<span class="ml-auto text-'+l.color+'-400 font-medium"><i class="fas fa-bolt mr-1"></i>Active</span>':'<span class="ml-auto text-white/20">Idle</span>') +
        '</div></div>';
    }).join('') +
    '</div></div></div>' +

    // OSINT Feed
    '<div class="panel-card p-5 mb-5"><h3 class="text-[11px] font-semibold text-white/50 mb-3 uppercase">OSINT Intelligence Feed</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-2">' +
    (d.osintFeed||[]).map(o => '<div class="p-3 rounded-xl bg-white/5 border border-white/10"><div class="flex items-start justify-between gap-2"><div class="flex-1"><p class="text-xs font-medium text-white/85">' + o.title + '</p><div class="flex items-center gap-2 mt-1"><span class="text-[9px] text-white/40">' + o.source + '</span><span class="text-[9px] text-white/25">' + o.date + '</span>' + (o.language==='Arabic'?'<span class="badge bg-purple-900/50 text-purple-400">AR</span>':'') + '</div></div><div class="shrink-0 w-8 h-8 rounded-lg ' + (o.relevance>=85?'bg-red-900/50 text-red-400':o.relevance>=70?'bg-amber-900/50 text-amber-400':'bg-white/10 text-white/50') + ' flex items-center justify-center text-[10px] font-bold">' + o.relevance + '</div></div></div>').join('') +
    '</div></div>' +

    // Recent signals
    '<div class="panel-card p-5"><h3 class="text-[11px] font-semibold text-white/50 mb-3 uppercase">Recent EWS Signals</h3><div class="space-y-2">' +
    (d.recentSignals||[]).map(s => '<div class="flex items-start gap-3 p-3 rounded-xl ' + (s.score>=70?'bg-red-900/10 border border-red-800/30':s.score>=40?'bg-amber-900/10 border border-amber-800/30':'bg-white/5 border border-white/10') + '"><div class="w-9 h-9 rounded-lg ' + (s.score>=70?'bg-red-900/50 text-red-400':s.score>=40?'bg-amber-900/50 text-amber-400':'bg-[#00A86B]/15 text-[#00A86B]') + ' flex items-center justify-center font-bold text-xs">' + s.score + '</div><div class="flex-1"><div class="flex items-center gap-2"><p class="text-xs font-medium text-white/85">' + s.pathogen + '</p><span class="badge bg-white/10 text-white/50">' + s.type + '</span><span class="badge bg-white/10 text-white/50">' + (s.action||'') + '</span></div><p class="text-[10px] text-white/40 mt-0.5">' + s.region + ' | ' + s.description + '</p><p class="text-[9px] text-white/25 mt-0.5"><i class="fas fa-clock mr-1"></i>' + s.time + ' | Source: ' + (s.source||'') + '</p></div></div>').join('') +
    '</div></div>';

  // Charts
  if(d.riskHistory) {
    makeChart('ewsRiskChart',{type:'line',data:{labels:d.riskHistory.dates,datasets:[{label:'Risk Score',data:d.riskHistory.scores,borderColor:'#f59e0b',backgroundColor:'rgba(245,158,11,0.08)',fill:true,tension:0.4,pointRadius:1,borderWidth:2},{label:'Warning Threshold',data:Array(30).fill(60),borderColor:'rgba(239,68,68,0.4)',borderDash:[5,5],pointRadius:0,borderWidth:1},{label:'Watch Threshold',data:Array(30).fill(40),borderColor:'rgba(34,197,94,0.4)',borderDash:[5,5],pointRadius:0,borderWidth:1}]},options:{...chartDefaults,plugins:{...chartDefaults.plugins,legend:{display:false}}}});
  }
  if(d.forecast) {
    makeChart('ewsForecastChart',{type:'line',data:{labels:d.forecast.days,datasets:[{label:'Predicted',data:d.forecast.predicted,borderColor:'#3b82f6',backgroundColor:'rgba(59,130,246,0.1)',fill:false,tension:0.4,pointRadius:3,borderWidth:2},{label:'Upper CI',data:d.forecast.upper,borderColor:'rgba(239,68,68,0.3)',backgroundColor:'rgba(239,68,68,0.05)',fill:'+1',pointRadius:0,borderWidth:1,borderDash:[3,3]},{label:'Lower CI',data:d.forecast.lower,borderColor:'rgba(34,197,94,0.3)',backgroundColor:'rgba(34,197,94,0.05)',fill:false,pointRadius:0,borderWidth:1,borderDash:[3,3]}]},options:chartDefaults});
  }
}

// ===== ALERTS =====
async function renderAlerts(el) {
  const d = await api('/api/alerts');
  const pendingCount = d.alerts.filter(a=>a.status==='pending_review').length;
  el.innerHTML =
    '<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">' +
    '<div class="kpi-card accent-red p-3"><div class="flex items-center justify-between"><div><p class="text-[10px] text-white/40 mb-1">Emergency (L3)</p><p class="text-xl font-bold text-red-400">' + d.alerts.filter(a=>a.level===3).length + '</p></div><div class="w-8 h-8 rounded-xl bg-red-500/15 flex items-center justify-center"><i class="fas fa-radiation text-red-400 text-xs"></i></div></div></div>' +
    '<div class="kpi-card accent-amber p-3"><div class="flex items-center justify-between"><div><p class="text-[10px] text-white/40 mb-1">Warning (L2)</p><p class="text-xl font-bold text-orange-400">' + d.alerts.filter(a=>a.level===2).length + '</p></div><div class="w-8 h-8 rounded-xl bg-orange-500/15 flex items-center justify-center"><i class="fas fa-exclamation-triangle text-orange-400 text-xs"></i></div></div></div>' +
    '<div class="kpi-card p-3"><div class="flex items-center justify-between"><div><p class="text-[10px] text-white/40 mb-1">Watch (L1)</p><p class="text-xl font-bold text-amber-400">' + d.alerts.filter(a=>a.level===1).length + '</p></div><div class="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center"><i class="fas fa-eye text-amber-400 text-xs"></i></div></div></div>' +
    '<div class="kpi-card accent-purple p-3"><div class="flex items-center justify-between"><div><p class="text-[10px] text-white/40 mb-1">Pending Review</p><p class="text-xl font-bold text-purple-400">' + pendingCount + '</p></div><div class="w-8 h-8 rounded-xl bg-purple-500/15 flex items-center justify-center"><i class="fas fa-clock text-purple-400 text-xs"></i></div></div></div>' +
    '</div>' +

    // Bulk action toolbar
    (pendingCount > 0 ? '<div class="panel-card p-3 mb-4"><div class="flex items-center justify-between">' +
    '<div class="flex items-center gap-3">' +
    '<span class="text-[11px] font-semibold text-amber-400"><i class="fas fa-tasks mr-1.5"></i>Bulk Actions</span>' +
    '<span class="text-[10px] text-white/30">' + pendingCount + ' pending review</span></div>' +
    '<div class="flex gap-2">' +
    '<button onclick="bulkAlertAction(\\'confirm\\')" class="px-3 py-1.5 bg-[#00A86B] hover:bg-[#00c77b] rounded-lg text-[10px] text-white transition font-medium"><i class="fas fa-check-double mr-1"></i>Confirm All</button>' +
    '<button onclick="bulkAlertAction(\\'dismiss\\')" class="px-3 py-1.5 bior-btn-secondary text-[10px] font-medium"><i class="fas fa-times mr-1"></i>Dismiss All</button>' +
    '</div></div></div>' : '') +

    // Alert filter bar
    '<div class="panel-card p-3 mb-4"><div class="flex items-center gap-3 flex-wrap">' +
    '<span class="text-[10px] text-white/30"><i class="fas fa-filter mr-1"></i>Show:</span>' +
    '<div class="flex gap-1">' +
    '<button class="alert-filter-btn text-[10px] px-3 py-1 rounded-lg bg-[#00A86B]/15 text-[#00A86B] border border-[#00A86B]/30" onclick="filterAlerts(this,\\'\\')">All</button>' +
    '<button class="alert-filter-btn text-[10px] px-3 py-1 rounded-lg text-white/40 hover:bg-white/5 transition" onclick="filterAlerts(this,\\'3\\')">L3 Emergency</button>' +
    '<button class="alert-filter-btn text-[10px] px-3 py-1 rounded-lg text-white/40 hover:bg-white/5 transition" onclick="filterAlerts(this,\\'2\\')">L2 Warning</button>' +
    '<button class="alert-filter-btn text-[10px] px-3 py-1 rounded-lg text-white/40 hover:bg-white/5 transition" onclick="filterAlerts(this,\\'1\\')">L1 Watch</button>' +
    '<button class="alert-filter-btn text-[10px] px-3 py-1 rounded-lg text-white/40 hover:bg-white/5 transition" onclick="filterAlerts(this,\\'pending\\')">Pending</button>' +
    '</div></div></div>' +

    '<div class="space-y-3" id="alertsList">' +
    d.alerts.map(a => {
      const lCol = a.level===3?'red':a.level===2?'orange':'amber';
      const stCol = {pending_review:'yellow',confirmed:'emerald',dismissed:'gray',escalated:'purple'}[a.status]||'gray';
      return '<div class="panel-card p-4 alert-item" data-level="' + a.level + '" data-status="' + a.status + '" data-id="' + a.id + '"><div class="flex items-start gap-3">' +
        '<div class="w-10 h-10 rounded-xl bg-' + lCol + '-900/50 text-' + lCol + '-400 flex items-center justify-center shrink-0"><i class="fas ' + (a.level===3?'fa-radiation':a.level===2?'fa-exclamation-triangle':'fa-eye') + '"></i></div>' +
        '<div class="flex-1 min-w-0"><div class="flex flex-wrap items-center gap-1.5 mb-1"><span class="badge bg-' + lCol + '-900/50 text-' + lCol + '-400">L' + a.level + '</span><span class="badge bg-' + stCol + '-900/50 text-' + stCol + '-400">' + a.status.replace('_',' ') + '</span><span class="badge bg-white/10 text-white/50">' + a.type.replace('_',' ') + '</span>' +
        (a.channels||[]).map(ch => '<span class="text-[8px] text-white/25"><i class="fas ' + ({sms:'fa-sms',email:'fa-envelope',dashboard:'fa-desktop',who_ihr:'fa-globe'}[ch]||'fa-bell') + '"></i></span>').join(' ') +
        '</div><h4 class="text-sm font-semibold text-gray-100 cursor-pointer hover:text-[#00A86B] transition" onclick="showAlertDetail(\\'' + a.id + '\\')">' + a.title + ' <i class="fas fa-external-link-alt text-[8px] text-white/20 ml-1"></i></h4><p class="text-[10px] text-white/40 mt-1 line-clamp-2">' + a.description + '</p>' +
        '<div class="flex flex-wrap items-center gap-3 mt-2 text-[10px] text-white/40"><span><i class="fas fa-map-marker-alt mr-1"></i>' + a.region + '</span><span><i class="fas fa-virus mr-1"></i>' + a.pathogen + '</span><span><i class="fas fa-chart-line mr-1"></i>Risk: ' + a.riskScore + '</span><span><i class="fas fa-clock mr-1"></i>' + a.generatedAt + '</span>' +
        (a.reviewer?'<span><i class="fas fa-user-check mr-1"></i>' + a.reviewer + '</span>':'') +
        (a.responseStatus?'<span class="badge bg-' + (a.responseStatus==='Active Response'?'emerald':a.responseStatus==='Monitoring'?'blue':'gray') + '-900/50 text-' + (a.responseStatus==='Active Response'?'emerald':a.responseStatus==='Monitoring'?'blue':'gray') + '-400">' + a.responseStatus + '</span>':'') +
        '</div></div>' +
        (a.status==='pending_review'?'<div class="flex flex-col gap-1.5 shrink-0"><button onclick="reviewAlert(\\'' + a.id + '\\',\\'confirm\\')" class="px-3 py-1 bg-[#00A86B] hover:bg-[#00c77b] rounded-lg text-[10px] text-white transition"><i class="fas fa-check mr-1"></i>Confirm</button><button onclick="reviewAlert(\\'' + a.id + '\\',\\'dismiss\\')" class="px-3 py-1 bg-white/10 hover:bg-white/15 rounded-lg text-[10px] text-white transition"><i class="fas fa-times mr-1"></i>Dismiss</button><button onclick="reviewAlert(\\'' + a.id + '\\',\\'escalate\\')" class="px-3 py-1 bg-red-600 hover:bg-red-500 rounded-lg text-[10px] text-white transition"><i class="fas fa-arrow-up mr-1"></i>Escalate</button></div>':'') +
        '</div>' +
        (a.recommendedActions?'<div class="mt-3 pt-3 border-t border-white/6"><p class="text-[10px] text-white/40 mb-1.5"><i class="fas fa-lightbulb mr-1 text-amber-400"></i>Recommended Actions:</p><div class="flex flex-wrap gap-1.5">' + a.recommendedActions.map(ra=>'<span class="text-[10px] bg-white/6 text-white/70 px-2 py-0.5 rounded-lg">'+ra+'</span>').join('')+'</div></div>':'') +
        '</div>';
    }).join('') + '</div>';
}

// ===== ALERT DETAIL MODAL =====
window.showAlertDetail = async function(id) {
  const d = await api('/api/alerts');
  const a = d.alerts.find(function(x){return x.id===id;});
  if(!a) { showToast('Alert not found','error'); return; }
  const lCol = a.level===3?'red':a.level===2?'orange':'amber';
  const stCol = {pending_review:'yellow',confirmed:'emerald',dismissed:'gray',escalated:'purple'}[a.status]||'gray';
  const riskCol = a.riskScore>=70?'#ef4444':a.riskScore>=40?'#f59e0b':'#00A86B';
  const riskCirc = 2*Math.PI*38;
  const riskOff = riskCirc*(1-a.riskScore/100);
  showModal(
    '<div style="max-width:640px;width:100%">' +
    '<div class="flex items-center justify-between mb-4">' +
    '<div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-'+lCol+'-900/50 text-'+lCol+'-400 flex items-center justify-center"><i class="fas '+(a.level===3?'fa-radiation':a.level===2?'fa-exclamation-triangle':'fa-eye')+' text-sm"></i></div>' +
    '<div><h3 class="text-base font-bold text-white">'+a.title+'</h3><div class="flex items-center gap-2 mt-0.5"><span class="badge bg-'+lCol+'-900/50 text-'+lCol+'-400">Level '+a.level+'</span><span class="badge bg-'+stCol+'-900/50 text-'+stCol+'-400">'+a.status.replace('_',' ')+'</span><span class="text-[9px] text-white/30">'+a.id+'</span></div></div></div>' +
    '<button onclick="closeModal()" class="text-white/40 hover:text-white"><i class="fas fa-times"></i></button></div>' +

    '<div class="grid grid-cols-3 gap-3 mb-4">' +
    '<div class="p-3 rounded-xl bg-white/5 border border-white/8 text-center"><svg width="84" height="84" viewBox="0 0 84 84" class="mx-auto"><circle cx="42" cy="42" r="38" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="5"/><circle cx="42" cy="42" r="38" fill="none" stroke="'+riskCol+'" stroke-width="5" stroke-dasharray="'+riskCirc.toFixed(1)+'" stroke-dashoffset="'+riskOff.toFixed(1)+'" stroke-linecap="round" transform="rotate(-90 42 42)" class="ews-ring"/></svg><div style="margin-top:-58px;position:relative"><p class="text-xl font-bold" style="color:'+riskCol+'">'+a.riskScore+'</p><p class="text-[8px] text-white/30">Risk Score</p></div><div style="height:24px"></div></div>' +
    '<div class="p-3 rounded-xl bg-white/5 border border-white/8"><p class="text-[9px] text-white/30 uppercase mb-1">Pathogen</p><p class="text-xs font-bold text-white/85"><i class="fas fa-virus mr-1 text-'+lCol+'-400"></i>'+a.pathogen+'</p><p class="text-[9px] text-white/30 uppercase mt-2 mb-1">Region</p><p class="text-xs font-bold text-white/85"><i class="fas fa-map-marker-alt mr-1 text-blue-400"></i>'+a.region+'</p></div>' +
    '<div class="p-3 rounded-xl bg-white/5 border border-white/8"><p class="text-[9px] text-white/30 uppercase mb-1">Population</p><p class="text-xs font-bold text-white/85"><i class="fas fa-users mr-1 text-purple-400"></i>'+(a.affectedPopulation?formatNum(a.affectedPopulation):'N/A')+'</p><p class="text-[9px] text-white/30 uppercase mt-2 mb-1">Response</p><p class="text-xs font-bold '+(a.responseStatus==='Active Response'?'text-[#00A86B]':a.responseStatus==='Monitoring'?'text-blue-400':'text-amber-400')+'"><i class="fas fa-shield-alt mr-1"></i>'+(a.responseStatus||'Pending')+'</p></div></div>' +

    '<div class="p-3 rounded-xl bg-white/5 border border-white/8 mb-4"><p class="text-[10px] text-white/40 mb-2"><i class="fas fa-info-circle mr-1"></i>Description</p><p class="text-xs text-white/70 leading-relaxed">'+a.description+'</p></div>' +

    '<div class="grid grid-cols-2 gap-3 mb-4">' +
    '<div class="p-3 rounded-xl bg-white/5 border border-white/8"><p class="text-[10px] text-white/40 mb-2"><i class="fas fa-history mr-1"></i>Timeline</p><div class="space-y-2">' +
    '<div class="flex items-start gap-2"><div class="w-1.5 h-1.5 rounded-full bg-'+lCol+'-400 mt-1.5 shrink-0"></div><div><p class="text-[10px] text-white/70">Alert generated by '+a.generatedBy+'</p><p class="text-[9px] text-white/30">'+a.generatedAt+'</p></div></div>' +
    (a.reviewedAt?'<div class="flex items-start gap-2"><div class="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></div><div><p class="text-[10px] text-white/70">Reviewed by '+a.reviewer+'</p><p class="text-[9px] text-white/30">'+a.reviewedAt+'</p></div></div>':'<div class="flex items-start gap-2"><div class="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 shrink-0 animate-pulse"></div><div><p class="text-[10px] text-amber-400/80">Awaiting review</p></div></div>') +
    '</div></div>' +

    '<div class="p-3 rounded-xl bg-white/5 border border-white/8"><p class="text-[10px] text-white/40 mb-2"><i class="fas fa-satellite-dish mr-1"></i>Channels</p><div class="flex flex-wrap gap-1.5">' +
    (a.channels||[]).map(function(ch) {
      var ic = {sms:'fa-sms',email:'fa-envelope',dashboard:'fa-desktop',who_ihr:'fa-globe'}[ch]||'fa-bell';
      return '<span class="text-[10px] bg-white/8 text-white/60 px-2 py-1 rounded-lg"><i class="fas '+ic+' mr-1"></i>'+ch.replace('_',' ').toUpperCase()+'</span>';
    }).join('') +
    '</div>' +
    (a.sitrep?'<p class="text-[10px] text-[#00A86B] mt-2"><i class="fas fa-file-medical-alt mr-1"></i>SitRep Required</p>':'') +
    '</div></div>' +

    (a.recommendedActions?'<div class="p-3 rounded-xl bg-[#00A86B]/5 border border-[#00A86B]/15 mb-4"><p class="text-[10px] text-[#00A86B] mb-2 font-semibold"><i class="fas fa-lightbulb mr-1"></i>Recommended Actions</p><div class="space-y-1">' +
    a.recommendedActions.map(function(ra,i){return '<div class="flex items-center gap-2"><span class="w-5 h-5 rounded-md bg-[#00A86B]/15 text-[#00A86B] text-[9px] flex items-center justify-center font-bold">'+(i+1)+'</span><span class="text-[11px] text-white/70">'+ra+'</span></div>';}).join('') +
    '</div></div>':'') +

    (a.status==='pending_review'?'<div class="flex gap-2"><button onclick="reviewAlert(\\''+a.id+'\\',\\'confirm\\');closeModal()" class="flex-1 px-4 py-2 bg-[#00A86B] hover:bg-[#00c77b] rounded-xl text-xs text-white transition font-medium"><i class="fas fa-check mr-1.5"></i>Confirm Alert</button><button onclick="reviewAlert(\\''+a.id+'\\',\\'dismiss\\');closeModal()" class="flex-1 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-xs text-white transition font-medium"><i class="fas fa-times mr-1.5"></i>Dismiss</button><button onclick="reviewAlert(\\''+a.id+'\\',\\'escalate\\');closeModal()" class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl text-xs text-white transition font-medium"><i class="fas fa-arrow-up mr-1.5"></i>Escalate</button></div>':'') +
    '</div>'
  );
};

window.filterAlerts = function(btn, filter) {
  document.querySelectorAll('.alert-filter-btn').forEach(b => { b.className = 'alert-filter-btn text-[10px] px-3 py-1 rounded-lg text-white/40 hover:bg-white/5 transition'; });
  btn.className = 'alert-filter-btn text-[10px] px-3 py-1 rounded-lg bg-[#00A86B]/15 text-[#00A86B] border border-[#00A86B]/30';
  document.querySelectorAll('.alert-item').forEach(item => {
    if (!filter) { item.style.display = ''; return; }
    if (filter === 'pending') { item.style.display = item.dataset.status === 'pending_review' ? '' : 'none'; return; }
    item.style.display = item.dataset.level === filter ? '' : 'none';
  });
};

window.bulkAlertAction = async function(action) {
  if (!confirm('Are you sure you want to ' + action + ' all pending alerts?')) return;
  showToast('Processing bulk ' + action + '...', 'info');
  try {
    const res = await api('/api/alerts/bulk', { method: 'PATCH', body: JSON.stringify({ decision: action }) });
    if (res.error) { showToast(res.error, 'error'); return; }
    showToast(res.updated + ' alert(s) ' + action + 'ed', 'success');
    loadPage();
  } catch(e) { showToast('Bulk action failed', 'error'); }
};

window.reviewAlert = async function(id, decision) {
  const card = document.querySelector('.alert-item[data-id="' + id + '"]') || event?.target?.closest?.('.alert-item');
  if(card) {
    card.style.transition = 'opacity 0.3s, transform 0.3s';
    card.style.opacity = '0.5';
    card.style.transform = 'scale(0.98)';
  }
  const res = await api('/api/alerts/'+id+'/review', {method:'PATCH', body:JSON.stringify({decision})});
  const label = {confirm:'Confirmed',dismiss:'Dismissed',escalate:'Escalated'}[decision]||decision;
  const toastType = {confirm:'success',dismiss:'warning',escalate:'error'}[decision]||'info';
  showToast('<i class="fas ' + ({confirm:'fa-check-circle',dismiss:'fa-ban',escalate:'fa-arrow-up'}[decision]||'fa-bell') + ' mr-1"></i>Alert ' + id + ' ' + label.toLowerCase(), toastType);
  if(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateX(20px) scale(0.95)';
    setTimeout(() => loadPage(), 400);
  } else { loadPage(); }
};

// ===== REPORTS (Tabbed: Charts / Situation Reports / Export) =====
let reportsData = null;
async function renderReports(el) {
  const d = await api('/api/reports');
  reportsData = d;

  el.innerHTML =
    // KPI summary row
    '<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">' +
    '<div class="kpi-card accent-green p-3"><div class="flex items-center justify-between"><div><p class="text-[10px] text-white/40 mb-1">Total Confirmed</p><p class="text-xl font-bold text-[#00A86B]">' + formatNum((d.confirmedCases||[]).reduce((a,b)=>a+b,0)) + '</p></div><div class="w-8 h-8 rounded-xl bg-[#00A86B]/15 flex items-center justify-center"><i class="fas fa-clipboard-check text-[#00A86B] text-xs"></i></div></div></div>' +
    '<div class="kpi-card accent-amber p-3"><div class="flex items-center justify-between"><div><p class="text-[10px] text-white/40 mb-1">Total Suspected</p><p class="text-xl font-bold text-amber-400">' + formatNum((d.suspectedCases||[]).reduce((a,b)=>a+b,0)) + '</p></div><div class="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center"><i class="fas fa-question-circle text-amber-400 text-xs"></i></div></div></div>' +
    '<div class="kpi-card accent-blue p-3"><div class="flex items-center justify-between"><div><p class="text-[10px] text-white/40 mb-1">Reports Published</p><p class="text-xl font-bold text-blue-400">' + (d.weeklyReports||[]).filter(r=>r.status==="Published").length + '</p></div><div class="w-8 h-8 rounded-xl bg-blue-500/15 flex items-center justify-center"><i class="fas fa-file-alt text-blue-400 text-xs"></i></div></div></div>' +
    '<div class="kpi-card accent-purple p-3"><div class="flex items-center justify-between"><div><p class="text-[10px] text-white/40 mb-1">Avg Positivity</p><p class="text-xl font-bold text-purple-400">' + ((d.positivityRate||[]).reduce((a,b)=>a+b,0)/(d.positivityRate||[1]).length).toFixed(1) + '%</p></div><div class="w-8 h-8 rounded-xl bg-purple-500/15 flex items-center justify-center"><i class="fas fa-percent text-purple-400 text-xs"></i></div></div></div>' +
    '</div>' +

    // Tab navigation
    '<div class="panel-card p-3 mb-5"><div class="flex items-center justify-between flex-wrap gap-2">' +
    '<div class="flex gap-1">' +
    '<button class="rpt-tab-btn text-[11px] px-4 py-2 rounded-xl bg-[#00A86B]/15 text-[#00A86B] border border-[#00A86B]/30 font-semibold transition" data-tab="charts" onclick="switchReportTab(this,\\'charts\\')"><i class="fas fa-chart-line mr-1.5"></i>Charts & Analytics</button>' +
    '<button class="rpt-tab-btn text-[11px] px-4 py-2 rounded-xl text-white/40 hover:text-white/60 hover:bg-white/5 transition" data-tab="sitreps" onclick="switchReportTab(this,\\'sitreps\\')"><i class="fas fa-file-medical-alt mr-1.5"></i>Situation Reports</button>' +
    '<button class="rpt-tab-btn text-[11px] px-4 py-2 rounded-xl text-white/40 hover:text-white/60 hover:bg-white/5 transition" data-tab="export" onclick="switchReportTab(this,\\'export\\')"><i class="fas fa-download mr-1.5"></i>Export & Print</button>' +
    '<button class="rpt-tab-btn text-[11px] px-4 py-2 rounded-xl text-white/40 hover:text-white/60 hover:bg-white/5 transition" data-tab="archive" onclick="switchReportTab(this,\\'archive\\')"><i class="fas fa-archive mr-1.5"></i>Report Archive</button>' +
    '</div>' +
    '<span class="text-[9px] text-white/25">Report Period</span>' +
    '</div></div>' +

    '<div id="rptTabContent"></div>';

  renderReportCharts(d);
}

function renderReportCharts(d) {
  const el = document.getElementById('rptTabContent');
  if(!el) return;
  destroyCharts();
  el.innerHTML =
    '<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">' +
    '<div class="panel-card p-5"><h3 class="text-[11px] font-semibold text-white/50 mb-3 uppercase"><i class="fas fa-chart-area mr-1.5"></i>Weekly Case Trends</h3><div style="height:220px"><canvas id="rptTrendChart"></canvas></div></div>' +
    '<div class="panel-card p-5"><h3 class="text-[11px] font-semibold text-white/50 mb-3 uppercase"><i class="fas fa-bacteria mr-1.5"></i>Cases by Pathogen</h3><div style="height:220px"><canvas id="rptPathogenChart"></canvas></div></div></div>' +
    '<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">' +
    '<div class="panel-card p-5"><h3 class="text-[11px] font-semibold text-white/50 mb-3 uppercase"><i class="fas fa-wave-square mr-1.5"></i>30-Day Epidemic Curve</h3><div style="height:220px"><canvas id="rptEpiCurve"></canvas></div></div>' +
    '<div class="panel-card p-5"><h3 class="text-[11px] font-semibold text-white/50 mb-3 uppercase"><i class="fas fa-map mr-1.5"></i>Cases by Region</h3><div style="height:220px"><canvas id="rptRegionChart"></canvas></div></div></div>' +
    '<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">' +
    '<div class="panel-card p-5"><h3 class="text-[11px] font-semibold text-white/50 mb-3 uppercase"><i class="fas fa-vial mr-1.5"></i>Positivity Rate Trend</h3><div style="height:200px"><canvas id="rptPositivity"></canvas></div></div>' +
    '<div class="panel-card p-5"><h3 class="text-[11px] font-semibold text-white/50 mb-3 uppercase"><i class="fas fa-calendar-alt mr-1.5"></i>Monthly Overview</h3><div style="height:200px"><canvas id="rptMonthly"></canvas></div></div></div>';

  makeChart('rptTrendChart',{type:'line',data:{labels:d.weeklyLabels,datasets:[{label:'Confirmed',data:d.confirmedCases,borderColor:'#00A86B',backgroundColor:'rgba(34,197,94,0.08)',fill:true,tension:0.4,borderWidth:2,pointRadius:3},{label:'Suspected',data:d.suspectedCases,borderColor:'#f59e0b',backgroundColor:'rgba(245,158,11,0.08)',fill:true,tension:0.4,borderWidth:2,pointRadius:3}]},options:chartDefaults});
  makeChart('rptPathogenChart',{type:'bar',data:{labels:d.pathogenLabels,datasets:[{label:'Cases',data:d.pathogenCases,backgroundColor:['#ef4444','#f97316','#f59e0b','#3b82f6','#00A86B','#8b5cf6'],borderRadius:6}]},options:{...chartDefaults,plugins:{...chartDefaults.plugins,legend:{display:false}}}});
  if(d.epiCurve) {
    makeChart('rptEpiCurve',{type:'bar',data:{labels:d.epiCurve.dates,datasets:[{label:'Confirmed',data:d.epiCurve.confirmed,backgroundColor:'#00A86B',borderRadius:2},{label:'Suspected',data:d.epiCurve.suspected,backgroundColor:'rgba(245,158,11,0.5)',borderRadius:2}]},options:{...chartDefaults,plugins:{...chartDefaults.plugins,legend:{labels:{color:'#9ca3af',font:{size:9}}}},scales:{...chartDefaults.scales,x:{...chartDefaults.scales.x,stacked:true},y:{...chartDefaults.scales.y,stacked:true}}}});
  }
  makeChart('rptRegionChart',{type:'bar',data:{labels:d.regionLabels,datasets:[{label:'Cases',data:d.regionCases,backgroundColor:'#3b82f6',borderRadius:4}]},options:{...chartDefaults,indexAxis:'y',plugins:{...chartDefaults.plugins,legend:{display:false}}}});
  makeChart('rptPositivity',{type:'line',data:{labels:d.weeklyLabels,datasets:[{label:'Positivity %',data:d.positivityRate,borderColor:'#8b5cf6',backgroundColor:'rgba(139,92,246,0.08)',fill:true,tension:0.4,borderWidth:2,pointRadius:3}]},options:chartDefaults});
  if(d.monthlyTrend) {
    makeChart('rptMonthly',{type:'line',data:{labels:d.monthlyTrend.months,datasets:[{label:'Cases',data:d.monthlyTrend.cases,borderColor:'#00A86B',tension:0.4,borderWidth:2,pointRadius:3,yAxisID:'y'},{label:'Sequences',data:d.monthlyTrend.sequences,borderColor:'#3b82f6',tension:0.4,borderWidth:2,pointRadius:3,yAxisID:'y'},{label:'Deaths',data:d.monthlyTrend.deaths,borderColor:'#ef4444',tension:0.4,borderWidth:1.5,pointRadius:3,yAxisID:'y1'}]},options:{...chartDefaults,scales:{...chartDefaults.scales,y1:{position:'right',ticks:{color:'#ef4444',font:{size:9}},grid:{display:false}}}}});
  }
}

function renderReportSitreps(d) {
  const el = document.getElementById('rptTabContent');
  if(!el) return;
  el.innerHTML =
    '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">' +
    (d.weeklyReports||[]).map(r => {
      const isPub = r.status==='Published';
      return '<div class="panel-card p-5 hover:border-[#00A86B]/20 transition">' +
        '<div class="flex items-center justify-between mb-3">' +
        '<span class="badge ' + (isPub?'bg-[#00A86B]/15 text-[#00A86B]':'bg-amber-900/50 text-amber-400') + '">' + (isPub?'<i class="fas fa-check-circle mr-1"></i>':'<i class="fas fa-clock mr-1"></i>') + r.status + '</span>' +
        '<span class="text-[9px] text-white/25"><i class="fas fa-calendar mr-1"></i>' + r.period + '</span></div>' +
        '<h4 class="text-sm font-semibold text-white/90 mb-2">' + r.title + '</h4>' +
        '<p class="text-[10px] text-white/40 mb-3 leading-relaxed">Epidemiological summary for ' + r.period + '.</p>' +
        '<div class="grid grid-cols-3 gap-2 mb-3">' +
        '<div class="text-center p-2 rounded-lg bg-white/5"><p class="text-sm font-bold text-white">' + r.totalCases + '</p><p class="text-[8px] text-white/30 uppercase">Cases</p></div>' +
        '<div class="text-center p-2 rounded-lg bg-white/5"><p class="text-sm font-bold text-red-400">' + r.deaths + '</p><p class="text-[8px] text-white/30 uppercase">Deaths</p></div>' +
        '<div class="text-center p-2 rounded-lg bg-white/5"><p class="text-sm font-bold text-blue-400">' + ((r.deaths/r.totalCases*100)||0).toFixed(1) + '%</p><p class="text-[8px] text-white/30 uppercase">CFR</p></div></div>' +
        '<div class="flex items-center justify-between pt-3 border-t border-white/6">' +
        '<span class="text-[9px] text-white/30"><i class="fas fa-user mr-1"></i>' + (r.author||'System') + '</span>' +
        '<button class="text-[10px] text-[#00A86B] hover:text-[#00c77b] font-medium transition"><i class="fas fa-eye mr-1"></i>View</button>' +
        '</div></div>';
    }).join('') + '</div>';
}

function renderReportExport(d) {
  const el = document.getElementById('rptTabContent');
  if(!el) return;
  el.innerHTML =
    '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">' +
    '<div class="panel-card p-5"><h3 class="text-[11px] font-semibold text-white/50 mb-4 uppercase tracking-wider"><i class="fas fa-file-export mr-1.5"></i>Export Data</h3><div class="space-y-3">' +
    '<div class="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#00A86B]/30 cursor-pointer transition group" onclick="exportCSV()"><div class="w-10 h-10 rounded-xl bg-[#00A86B]/15 flex items-center justify-center shrink-0"><i class="fas fa-file-csv text-[#00A86B]"></i></div><div class="flex-1"><p class="text-xs font-medium text-white/85">CSV Export</p><p class="text-[10px] text-white/40">Spreadsheet analysis</p></div><i class="fas fa-download text-white/20 group-hover:text-[#00A86B] transition"></i></div>' +
    '<div class="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 cursor-pointer transition group" onclick="exportJSON()"><div class="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center shrink-0"><i class="fas fa-code text-blue-400"></i></div><div class="flex-1"><p class="text-xs font-medium text-white/85">JSON Export</p><p class="text-[10px] text-white/40">API integration</p></div><i class="fas fa-download text-white/20 group-hover:text-blue-400 transition"></i></div>' +
    '<div class="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 cursor-pointer transition group" onclick="exportPDF()"><div class="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center shrink-0"><i class="fas fa-file-pdf text-purple-400"></i></div><div class="flex-1"><p class="text-xs font-medium text-white/85">PDF Report</p><p class="text-[10px] text-white/40">Print & share</p></div><i class="fas fa-download text-white/20 group-hover:text-purple-400 transition"></i></div>' +
    '</div></div>' +
    '<div class="panel-card p-5"><h3 class="text-[11px] font-semibold text-white/50 mb-4 uppercase tracking-wider"><i class="fas fa-print mr-1.5"></i>Quick Actions</h3><div class="space-y-3">' +
    '<div class="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 cursor-pointer transition group" onclick="window.print()"><div class="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0"><i class="fas fa-print text-amber-400"></i></div><div class="flex-1"><p class="text-xs font-medium text-white/85">Print Dashboard</p><p class="text-[10px] text-white/40">Send to printer</p></div></div>' +
    '<div class="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/30 cursor-pointer transition group" onclick="emailReport()"><div class="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0"><i class="fas fa-envelope text-red-400"></i></div><div class="flex-1"><p class="text-xs font-medium text-white/85">Email Report</p><p class="text-[10px] text-white/40">Send to stakeholders</p></div></div>' +
    '<div class="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 cursor-pointer transition group" onclick="scheduleReport()"><div class="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center shrink-0"><i class="fas fa-clock text-cyan-400"></i></div><div class="flex-1"><p class="text-xs font-medium text-white/85">Schedule Report</p><p class="text-[10px] text-white/40">Automated delivery</p></div></div>' +
    '</div></div></div>';
}

window.switchReportTab = function(btn, tab) {
  document.querySelectorAll('.rpt-tab-btn').forEach(b => {
    b.className = 'rpt-tab-btn text-[11px] px-4 py-2 rounded-xl text-white/40 hover:text-white/60 hover:bg-white/5 transition';
  });
  btn.className = 'rpt-tab-btn text-[11px] px-4 py-2 rounded-xl bg-[#00A86B]/15 text-[#00A86B] border border-[#00A86B]/30 font-semibold transition';
  const d = reportsData;
  if(tab==='charts') renderReportCharts(d);
  else if(tab==='sitreps') renderReportSitreps(d);
  else if(tab==='archive') renderReportArchive();
  else renderReportExport(d);
};

window.exportCSV = function() {
  showToast('Exporting CSV report...', 'info');
  const d = reportsData;
  const csv = 'Week,Confirmed,Suspected' + GI_NL + (d?.weeklyLabels||['W05','W06','W07','W08','W09','W10']).map((w,i) => w+','+(d?.confirmedCases?.[i]||0)+','+(d?.suspectedCases?.[i]||0)).join(GI_NL);
  const blob = new Blob([csv],{type:'text/csv'}); const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='bior_report.csv'; a.click();
  URL.revokeObjectURL(url);
  showToast('CSV exported successfully', 'success');
};

window.exportJSON = function() {
  showToast('Exporting JSON data...', 'info');
  const blob = new Blob([JSON.stringify(reportsData||{},null,2)],{type:'application/json'}); const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='bior_data.json'; a.click();
  URL.revokeObjectURL(url);
  showToast('JSON exported successfully', 'success');
};

window.exportPDF = function() {
  showToast('Generating PDF report...', 'info');
  setTimeout(()=>window.print(), 500);
};

window.emailReport = function() { showToast('Email report feature — configure SMTP in Admin', 'info'); };
window.scheduleReport = function() { showToast('Report scheduling — configure in Admin > Automation', 'info'); };

// ===== REPORT ARCHIVE (v8.7 — Issue #5) =====
let archiveData = { reports: [], total: 0 };
let archiveFilter = '';
let archiveOffset = 0;

async function renderReportArchive() {
  const el = document.getElementById('rptTabContent');
  if(!el) return;
  el.innerHTML = '<div class="flex items-center justify-center py-12"><div class="animate-spin rounded-full h-8 w-8 border-2 border-[#00A86B] border-t-transparent"></div></div>';

  try {
    let url = '/api/reports/archive?limit=20&offset=' + archiveOffset;
    if(archiveFilter) url += '&type=' + archiveFilter;
    archiveData = await api(url);
  } catch(e) {
    el.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle text-amber-400"></i><p>Failed to load archive</p></div>';
    return;
  }

  const reports = archiveData.reports || [];
  const total = archiveData.total || 0;
  const isAdmin = state.user?.tier >= 3;

  el.innerHTML =
    '<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">' +
    '<div>' +
    '<h3 class="text-sm font-bold text-white/90"><i class="fas fa-archive mr-2 text-[#00A86B]"></i>Report Archive</h3>' +
    '<p class="text-[10px] text-white/40 mt-0.5">' + total + ' archived report' + (total!==1?'s':'') + ' | Auto-generated via cron triggers</p>' +
    '<div class="text-[9px] text-white/25 mt-1"><i class="fas fa-clock mr-1"></i>Cron: Weekly Epi Bulletin — Mon 06:00 UTC | Monthly AMR Summary — 1st 06:00 UTC</div>' +
    '</div>' +
    (isAdmin ? '<div class="flex items-center gap-2">' +
    '<button onclick="generateReport(\\'weekly_bulletin\\')" class="bior-btn text-[10px] px-3 py-1.5"><i class="fas fa-file-medical mr-1.5"></i>Generate Epi Bulletin</button>' +
    '<button onclick="generateReport(\\'monthly_amr\\')" class="px-3 py-1.5 text-[10px] rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 hover:bg-purple-600/30 transition font-medium"><i class="fas fa-dna mr-1.5"></i>Generate AMR Summary</button>' +
    '</div>' : '') +
    '</div>' +

    '<div class="flex items-center gap-2 mb-4">' +
    '<button class="archive-filter text-[10px] px-3 py-1.5 rounded-lg transition ' + (!archiveFilter?'bg-[#00A86B]/15 text-[#00A86B] border border-[#00A86B]/30 font-semibold':'text-white/40 hover:text-white/60 hover:bg-white/5') + '" onclick="filterArchive(\\'\\')"><i class="fas fa-layer-group mr-1"></i>All</button>' +
    '<button class="archive-filter text-[10px] px-3 py-1.5 rounded-lg transition ' + (archiveFilter==='weekly_bulletin'?'bg-[#00A86B]/15 text-[#00A86B] border border-[#00A86B]/30 font-semibold':'text-white/40 hover:text-white/60 hover:bg-white/5') + '" onclick="filterArchive(\\'weekly_bulletin\\')"><i class="fas fa-file-medical-alt mr-1"></i>Weekly Bulletins</button>' +
    '<button class="archive-filter text-[10px] px-3 py-1.5 rounded-lg transition ' + (archiveFilter==='monthly_amr'?'bg-purple-600/15 text-purple-400 border border-purple-500/30 font-semibold':'text-white/40 hover:text-white/60 hover:bg-white/5') + '" onclick="filterArchive(\\'monthly_amr\\')"><i class="fas fa-dna mr-1"></i>Monthly AMR</button>' +
    '</div>' +

    (reports.length === 0 ?
      '<div class="empty-state py-10"><i class="fas fa-archive text-2xl text-white/15 mb-3"></i>' +
      '<p class="text-sm text-white/40">No archived reports yet</p>' +
      '<p class="text-[10px] text-white/25 mt-1">Reports will appear here after the first cron trigger fires or manual generation</p>' +
      (isAdmin ? '<button onclick="generateReport(\\'weekly_bulletin\\')" class="mt-4 bior-btn text-[10px] px-4 py-2"><i class="fas fa-plus mr-1.5"></i>Generate First Report</button>' : '') +
      '</div>'
      :
      '<div class="space-y-2">' +
      reports.map(function(r) {
        const isWeekly = r.type === 'weekly_bulletin';
        const accentColor = isWeekly ? '#00A86B' : '#8b5cf6';
        const icon = isWeekly ? 'fa-file-medical-alt' : 'fa-dna';
        const typeLabel = isWeekly ? 'Weekly Epi Bulletin' : 'Monthly AMR Summary';
        const sizeKB = ((r.size_bytes||0)/1024).toFixed(1);
        const isCron = (r.trigger_type||'').startsWith('cron');
        const genBy = (r.generated_by||'system').replace('manual:','');
        const date = r.generated_at ? new Date(r.generated_at+'Z').toLocaleString() : '';

        return '<div class="panel-card p-4 hover:border-white/15 transition cursor-pointer group" onclick="viewArchivedReport(\\'' + r.id + '\\')">' +
          '<div class="flex items-center justify-between">' +
          '<div class="flex items-center gap-3 min-w-0">' +
          '<div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background:' + accentColor + '15"><i class="fas ' + icon + '" style="color:' + accentColor + '"></i></div>' +
          '<div class="min-w-0">' +
          '<h4 class="text-xs font-semibold text-white/90 truncate">' + (r.title||'Untitled Report') + '</h4>' +
          '<div class="flex items-center gap-2 mt-0.5 flex-wrap">' +
          '<span class="text-[9px] px-2 py-0.5 rounded" style="background:' + accentColor + '15;color:' + accentColor + '">' + typeLabel + '</span>' +
          '<span class="text-[9px] text-white/25">' + sizeKB + ' KB</span>' +
          '<span class="text-[9px] text-white/25">' + (isCron ? '<i class="fas fa-clock mr-0.5"></i>Cron' : '<i class="fas fa-user mr-0.5"></i>' + genBy) + '</span>' +
          '<span class="text-[9px] text-white/25">' + date + '</span>' +
          '</div></div></div>' +
          '<div class="flex items-center gap-2 shrink-0">' +
          '<button onclick="event.stopPropagation();viewArchivedReport(\\'' + r.id + '\\')" class="text-[10px] text-[#00A86B] hover:text-[#00c77b] font-medium transition opacity-0 group-hover:opacity-100"><i class="fas fa-eye mr-1"></i>View</button>' +
          '<button onclick="event.stopPropagation();printArchivedReport(\\'' + r.id + '\\')" class="text-[10px] text-blue-400 hover:text-blue-300 font-medium transition opacity-0 group-hover:opacity-100"><i class="fas fa-print mr-1"></i>Print</button>' +
          (state.user?.role === 'Admin' ? '<button onclick="event.stopPropagation();deleteArchivedReport(\\'' + r.id + '\\')" class="text-[10px] text-red-400 hover:text-red-300 font-medium transition opacity-0 group-hover:opacity-100"><i class="fas fa-trash mr-1"></i></button>' : '') +
          '</div></div></div>';
      }).join('') +
      '</div>' +
      (total > 20 ? '<div class="flex items-center justify-center gap-3 mt-5">' +
        (archiveOffset > 0 ? '<button onclick="archivePage(-1)" class="text-[10px] px-3 py-1.5 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition"><i class="fas fa-chevron-left mr-1"></i>Previous</button>' : '') +
        '<span class="text-[9px] text-white/30">' + (archiveOffset+1) + '\\u2013' + Math.min(archiveOffset+20,total) + ' of ' + total + '</span>' +
        (archiveOffset+20 < total ? '<button onclick="archivePage(1)" class="text-[10px] px-3 py-1.5 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition">Next<i class="fas fa-chevron-right ml-1"></i></button>' : '') +
        '</div>' : '')
    );
}

window.filterArchive = function(type) {
  archiveFilter = type;
  archiveOffset = 0;
  renderReportArchive();
};

window.archivePage = function(dir) {
  archiveOffset = Math.max(0, archiveOffset + (dir * 20));
  renderReportArchive();
};

window.generateReport = async function(type) {
  if(!confirm('Generate a ' + (type==='monthly_amr'?'Monthly AMR Summary':'Weekly Epi Bulletin') + ' now?')) return;
  showToast('Generating report...', 'info');
  try {
    const r = await api('/api/reports/generate', { method: 'POST', body: JSON.stringify({ type }) });
    showToast('Report generated: ' + r.id, 'success');
    archiveOffset = 0;
    renderReportArchive();
  } catch(e) {
    showToast('Generation failed: ' + (e.message||'Unknown error'), 'error');
  }
};

window.viewArchivedReport = async function(id) {
  showToast('Loading report...', 'info');
  try {
    const r = await api('/api/reports/archive/' + id);
    const modal = document.createElement('div');
    modal.id = 'reportViewerModal';
    modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center p-4';
    modal.innerHTML =
      '<div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="closeReportViewer()"></div>' +
      '<div class="relative w-full max-w-5xl h-[90vh] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden" style="background:var(--bior-bg-page)">' +
      '<div class="flex items-center justify-between px-5 py-3 border-b border-white/10 shrink-0">' +
      '<div class="min-w-0">' +
      '<h3 class="text-sm font-bold text-white/90 truncate">' + (r.title||'Report') + '</h3>' +
      '<p class="text-[9px] text-white/30 mt-0.5">' + (r.type==='weekly_bulletin'?'Weekly Epi Bulletin':'Monthly AMR Summary') + ' | ' + (r.period||'') + ' | ' + ((r.size_bytes||0)/1024).toFixed(1) + ' KB</p>' +
      '</div>' +
      '<div class="flex items-center gap-2 shrink-0">' +
      '<button onclick="printReportContent()" class="text-[10px] px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition"><i class="fas fa-print mr-1"></i>Print</button>' +
      '<button onclick="downloadReportHTML()" class="text-[10px] px-3 py-1.5 rounded-lg bg-[#00A86B]/15 text-[#00A86B] border border-[#00A86B]/30 hover:bg-[#00A86B]/25 transition"><i class="fas fa-download mr-1"></i>Download</button>' +
      '<button onclick="closeReportViewer()" class="text-white/40 hover:text-white ml-2 transition"><i class="fas fa-times text-lg"></i></button>' +
      '</div></div>' +
      '<iframe id="reportViewerFrame" class="flex-1 w-full bg-white" sandbox="allow-same-origin"></iframe>' +
      '</div>';
    document.body.appendChild(modal);
    setTimeout(function() {
      const frame = document.getElementById('reportViewerFrame');
      if(frame) {
        const doc = frame.contentDocument || frame.contentWindow.document;
        doc.open();
        doc.write(r.html_content||'<p>No content</p>');
        doc.close();
      }
    }, 100);
    window._currentReportHTML = r.html_content;
    window._currentReportTitle = r.title;
  } catch(e) {
    showToast('Failed to load report', 'error');
  }
};

window.closeReportViewer = function() {
  const m = document.getElementById('reportViewerModal');
  if(m) m.remove();
  window._currentReportHTML = null;
};

window.printReportContent = function() {
  const frame = document.getElementById('reportViewerFrame');
  if(frame && frame.contentWindow) {
    frame.contentWindow.print();
  }
};

window.downloadReportHTML = function() {
  const html = window._currentReportHTML;
  if(!html) return;
  const blob = new Blob([html], {type:'text/html'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = (window._currentReportTitle||'report').replace(/[^a-zA-Z0-9 ]/g,'_') + '.html';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Report downloaded', 'success');
};

window.printArchivedReport = async function(id) {
  try {
    const r = await api('/api/reports/archive/' + id);
    const win = window.open('', '_blank');
    if(win) {
      win.document.write(r.html_content||'<p>No content</p>');
      win.document.close();
      setTimeout(function(){ win.print(); }, 500);
    }
  } catch(e) {
    showToast('Failed to load report for printing', 'error');
  }
};

window.deleteArchivedReport = async function(id) {
  if(!confirm('Delete this archived report? This cannot be undone.')) return;
  try {
    await api('/api/reports/archive/' + id, { method: 'DELETE' });
    showToast('Report deleted', 'success');
    renderReportArchive();
  } catch(e) {
    showToast('Delete failed: ' + (e.message||'Error'), 'error');
  }
};

// ===== ADMIN (enhanced with animated cards, gauges, improved tabs) =====
async function renderAdmin(el) {
  const h = await api('/api/admin/health');

  el.innerHTML =
    // Enhanced tab bar
    '<div class="panel-card p-2 mb-5 inline-flex gap-1 flex-wrap">' +
    '<button class="admin-tab active px-4 py-2 rounded-xl text-xs font-semibold transition-all" onclick="showAdminTab(&apos;health&apos;,this)"><i class="fas fa-heartbeat mr-1.5"></i>System Health</button>' +
    '<button class="admin-tab px-4 py-2 rounded-xl text-xs text-white/50 transition-all" onclick="showAdminTab(&apos;perf&apos;,this)"><i class="fas fa-tachometer-alt mr-1.5"></i>Performance</button>' +
    '<button class="admin-tab px-4 py-2 rounded-xl text-xs text-white/50 transition-all" onclick="showAdminTab(&apos;users&apos;,this)"><i class="fas fa-users-cog mr-1.5"></i>User Management</button>' +
    '<button class="admin-tab px-4 py-2 rounded-xl text-xs text-white/50 transition-all" onclick="showAdminTab(&apos;dq&apos;,this)"><i class="fas fa-database mr-1.5"></i>Data Quality</button>' +
    '<button class="admin-tab px-4 py-2 rounded-xl text-xs text-white/50 transition-all" onclick="showAdminTab(&apos;audit&apos;,this)"><i class="fas fa-scroll mr-1.5"></i>Audit Log</button>' +
    '<button class="admin-tab px-4 py-2 rounded-xl text-xs text-white/50 transition-all" onclick="showAdminTab(&apos;security&apos;,this)"><i class="fas fa-shield-alt mr-1.5"></i>Security</button>' +
    '</div>' +
    '<div id="adminContent"></div>';

  renderAdminHealth(h);

  window.showAdminTab = function(tab, btn) {
    document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if(tab==='health') renderAdminHealth(h);
    else if(tab==='perf') renderAdminPerf();
    else if(tab==='users') renderAdminUsers();
    else if(tab==='dq') renderAdminDQ(h);
    else if(tab==='security') renderAdminSecurity();
    else renderAdminAudit();
  };
}

// ===== USER MANAGEMENT PANEL =====
async function renderAdminUsers() {
  const el = document.getElementById('adminContent');
  if(!el) return;
  el.innerHTML = '<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-white/30 text-xl"></i><p class="text-white/30 text-xs mt-3">Loading users...</p></div>';
  const data = await api('/api/admin/users');
  const users = data.users || [];

  el.innerHTML =
    '<div class="page-transition">' +
    '<div class="flex items-center justify-between mb-4">' +
      '<div><h3 class="text-sm font-bold text-white">User Management</h3><p class="text-[10px] text-white/40 mt-1">' + users.length + ' registered users</p></div>' +
      '<button onclick="showCreateUserModal()" class="flex items-center gap-2 px-4 py-2 bg-[#00A86B] hover:bg-[#008F5B] text-white text-xs font-semibold rounded-xl transition-all"><i class="fas fa-user-plus"></i>Add User</button>' +
    '</div>' +
    '<div class="panel-card overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-xs"><thead class="bg-white/5"><tr>' +
    '<th class="px-3 py-2.5 text-left text-[10px] font-medium text-white/50 uppercase">User</th>' +
    '<th class="px-3 py-2.5 text-left text-[10px] font-medium text-white/50 uppercase">Role</th>' +
    '<th class="px-3 py-2.5 text-left text-[10px] font-medium text-white/50 uppercase">Institution</th>' +
    '<th class="px-3 py-2.5 text-left text-[10px] font-medium text-white/50 uppercase">Tier</th>' +
    '<th class="px-3 py-2.5 text-left text-[10px] font-medium text-white/50 uppercase">Status</th>' +
    '<th class="px-3 py-2.5 text-left text-[10px] font-medium text-white/50 uppercase">Last Login</th>' +
    '<th class="px-3 py-2.5 text-center text-[10px] font-medium text-white/50 uppercase">Actions</th>' +
    '</tr></thead><tbody class="divide-y divide-gray-800">' +
    users.map(u => {
      const statusColor = u.status === 'active' ? 'emerald' : u.status === 'suspended' ? 'red' : 'amber';
      const tierColors = ['','#94a3b8','#f59e0b','#38bdf8','#a78bfa'];
      return '<tr class="hover:bg-white/5">' +
        '<td class="px-3 py-2.5"><div class="flex items-center gap-2"><div class="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white" style="background:linear-gradient(135deg,#334155,#475569)">' + (u.avatar||'?') + '</div><div><div class="text-white font-semibold">' + u.name + '</div><div class="text-[10px] text-white/40">' + u.username + ' &middot; ' + (u.email||'') + '</div></div></div></td>' +
        '<td class="px-3 py-2"><span class="badge bg-white/10 text-white/60">' + u.role + '</span><div class="text-[9px] text-white/30 mt-1">' + (u.full_role||'') + '</div></td>' +
        '<td class="px-3 py-2 text-white/50 text-[11px]">' + (u.institution||'-') + '</td>' +
        '<td class="px-3 py-2"><span style="color:' + tierColors[u.tier||1] + '" class="font-bold">T' + u.tier + '</span></td>' +
        '<td class="px-3 py-2"><span class="badge bg-' + statusColor + '-900/50 text-' + statusColor + '-400">' + (u.status||'active') + '</span></td>' +
        '<td class="px-3 py-2 text-white/40 font-mono text-[10px]">' + (u.last_login||'Never') + '</td>' +
        '<td class="px-3 py-2 text-center"><div class="flex items-center justify-center gap-1">' +
          '<button onclick="showEditUserModal(\\'' + u.id + '\\')" class="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-blue-400 transition" title="Edit"><i class="fas fa-pen text-[10px]"></i></button>' +
          '<button onclick="showResetPasswordModal(\\'' + u.id + '\\',\\'' + u.name.replace(/'/g,'') + '\\')" class="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-amber-400 transition" title="Reset Password"><i class="fas fa-key text-[10px]"></i></button>' +
          '<button onclick="deleteUser(\\'' + u.id + '\\',\\'' + u.name.replace(/'/g,'') + '\\')" class="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400 transition" title="Delete"><i class="fas fa-trash text-[10px]"></i></button>' +
        '</div></td>' +
      '</tr>';
    }).join('') +
    '</tbody></table></div></div></div>';
}

window.showCreateUserModal = function() {
  showModal(
    '<h3 class="text-lg font-bold text-white mb-4"><i class="fas fa-user-plus mr-2 text-[#00A86B]"></i>Create New User</h3>' +
    '<div class="space-y-3">' +
      '<div class="grid grid-cols-2 gap-3">' +
        '<div><label class="text-[10px] text-white/40 uppercase font-semibold block mb-1">Full Name *</label><input id="cuName" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#00A86B]" placeholder="Dr. John Smith"></div>' +
        '<div><label class="text-[10px] text-white/40 uppercase font-semibold block mb-1">Username *</label><input id="cuUsername" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#00A86B]" placeholder="jsmith"></div>' +
      '</div>' +
      '<div class="grid grid-cols-2 gap-3">' +
        '<div><label class="text-[10px] text-white/40 uppercase font-semibold block mb-1">Password *</label><input id="cuPassword" type="password" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#00A86B]" placeholder="Min 6 characters"></div>' +
        '<div><label class="text-[10px] text-white/40 uppercase font-semibold block mb-1">Email</label><input id="cuEmail" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#00A86B]" placeholder="john@bior.tech"></div>' +
      '</div>' +
      '<div class="grid grid-cols-2 gap-3">' +
        '<div><label class="text-[10px] text-white/40 uppercase font-semibold block mb-1">Role *</label><select id="cuRole" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#00A86B]"><option value="Viewer">Viewer</option><option value="Analyst">Analyst</option><option value="Admin">Admin</option></select></div>' +
        '<div><label class="text-[10px] text-white/40 uppercase font-semibold block mb-1">Full Role Title</label><input id="cuFullRole" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#00A86B]" placeholder="Regional Epidemiologist"></div>' +
      '</div>' +
      '<div><label class="text-[10px] text-white/40 uppercase font-semibold block mb-1">Institution</label><input id="cuInstitution" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#00A86B]" placeholder="Central Region Health Directorate"></div>' +
    '</div>' +
    '<div class="flex justify-end gap-3 mt-5">' +
      '<button onclick="closeModal()" class="px-4 py-2 text-white/50 text-xs font-semibold rounded-lg hover:bg-white/5 transition">Cancel</button>' +
      '<button onclick="createUser()" class="px-4 py-2 bg-[#00A86B] text-white text-xs font-semibold rounded-lg hover:bg-[#008F5B] transition"><i class="fas fa-plus mr-1"></i>Create User</button>' +
    '</div>'
  );
};

window.createUser = async function() {
  const name = document.getElementById('cuName').value.trim();
  const username = document.getElementById('cuUsername').value.trim();
  const password = document.getElementById('cuPassword').value;
  const email = document.getElementById('cuEmail').value.trim();
  const role = document.getElementById('cuRole').value;
  const fullRole = document.getElementById('cuFullRole').value.trim();
  const institution = document.getElementById('cuInstitution').value.trim();
  if(!name||!username||!password) { showToast('Name, username, and password are required','error'); return; }
  if(password.length<6) { showToast('Password must be at least 6 characters','error'); return; }
  const r = await api('/api/admin/users', { method:'POST', body: JSON.stringify({username,password,name,role,fullRole,institution,email,tier:role==='Admin'?4:role==='Analyst'?3:2}) });
  if(r.error) { showToast(r.error,'error'); return; }
  closeModal();
  showToast('User '+name+' created','success');
  renderAdminUsers();
};

window.showEditUserModal = async function(id) {
  const data = await api('/api/admin/users');
  const u = (data.users||[]).find(x => x.id === id);
  if(!u) { showToast('User not found','error'); return; }
  showModal(
    '<h3 class="text-lg font-bold text-white mb-4"><i class="fas fa-user-edit mr-2 text-blue-400"></i>Edit User: ' + u.name + '</h3>' +
    '<div class="space-y-3">' +
      '<div class="grid grid-cols-2 gap-3">' +
        '<div><label class="text-[10px] text-white/40 uppercase font-semibold block mb-1">Full Name</label><input id="euName" value="' + (u.name||'').replace(/"/g,'&quot;') + '" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-blue-400"></div>' +
        '<div><label class="text-[10px] text-white/40 uppercase font-semibold block mb-1">Email</label><input id="euEmail" value="' + (u.email||'').replace(/"/g,'&quot;') + '" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-blue-400"></div>' +
      '</div>' +
      '<div class="grid grid-cols-2 gap-3">' +
        '<div><label class="text-[10px] text-white/40 uppercase font-semibold block mb-1">Role</label><select id="euRole" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-blue-400"><option value="Viewer"'+(u.role==='Viewer'?' selected':'')+'>Viewer</option><option value="Analyst"'+(u.role==='Analyst'?' selected':'')+'>Analyst</option><option value="Admin"'+(u.role==='Admin'?' selected':'')+'>Admin</option></select></div>' +
        '<div><label class="text-[10px] text-white/40 uppercase font-semibold block mb-1">Status</label><select id="euStatus" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-blue-400"><option value="active"'+(u.status==='active'||!u.status?' selected':'')+'>Active</option><option value="suspended"'+(u.status==='suspended'?' selected':'')+'>Suspended</option></select></div>' +
      '</div>' +
      '<div class="grid grid-cols-2 gap-3">' +
        '<div><label class="text-[10px] text-white/40 uppercase font-semibold block mb-1">Full Role Title</label><input id="euFullRole" value="' + (u.full_role||'').replace(/"/g,'&quot;') + '" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-blue-400"></div>' +
        '<div><label class="text-[10px] text-white/40 uppercase font-semibold block mb-1">Tier</label><select id="euTier" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-blue-400"><option value="1"'+(u.tier===1?' selected':'')+'>1 - Guest</option><option value="2"'+(u.tier===2?' selected':'')+'>2 - Viewer</option><option value="3"'+(u.tier===3?' selected':'')+'>3 - Analyst</option><option value="4"'+(u.tier===4?' selected':'')+'>4 - Admin</option></select></div>' +
      '</div>' +
      '<div><label class="text-[10px] text-white/40 uppercase font-semibold block mb-1">Institution</label><input id="euInstitution" value="' + (u.institution||'').replace(/"/g,'&quot;') + '" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-blue-400"></div>' +
    '</div>' +
    '<div class="flex justify-end gap-3 mt-5">' +
      '<button onclick="closeModal()" class="px-4 py-2 text-white/50 text-xs font-semibold rounded-lg hover:bg-white/5 transition">Cancel</button>' +
      '<button onclick="updateUser(\\'' + id + '\\')" class="px-4 py-2 bg-blue-500 text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition"><i class="fas fa-save mr-1"></i>Save Changes</button>' +
    '</div>'
  );
};

window.updateUser = async function(id) {
  const name = document.getElementById('euName').value.trim();
  const email = document.getElementById('euEmail').value.trim();
  const role = document.getElementById('euRole').value;
  const status = document.getElementById('euStatus').value;
  const fullRole = document.getElementById('euFullRole').value.trim();
  const tier = parseInt(document.getElementById('euTier').value);
  const institution = document.getElementById('euInstitution').value.trim();
  const r = await api('/api/admin/users/' + id, { method:'PUT', body: JSON.stringify({name,email,role,status,fullRole,tier,institution}) });
  if(r.error) { showToast(r.error,'error'); return; }
  closeModal();
  showToast('User updated','success');
  renderAdminUsers();
};

window.showResetPasswordModal = function(id, name) {
  showModal(
    '<h3 class="text-lg font-bold text-white mb-4"><i class="fas fa-key mr-2 text-amber-400"></i>Reset Password: ' + name + '</h3>' +
    '<div class="space-y-3">' +
      '<div><label class="text-[10px] text-white/40 uppercase font-semibold block mb-1">New Password</label><input id="rpPassword" type="password" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-amber-400" placeholder="Min 6 characters"></div>' +
      '<div><label class="text-[10px] text-white/40 uppercase font-semibold block mb-1">Confirm Password</label><input id="rpConfirm" type="password" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-amber-400" placeholder="Repeat password"></div>' +
    '</div>' +
    '<div class="flex justify-end gap-3 mt-5">' +
      '<button onclick="closeModal()" class="px-4 py-2 text-white/50 text-xs font-semibold rounded-lg hover:bg-white/5 transition">Cancel</button>' +
      '<button onclick="resetUserPassword(\\'' + id + '\\')" class="px-4 py-2 bg-amber-500 text-white text-xs font-semibold rounded-lg hover:bg-amber-600 transition"><i class="fas fa-key mr-1"></i>Reset Password</button>' +
    '</div>'
  );
};

window.resetUserPassword = async function(id) {
  const pw = document.getElementById('rpPassword').value;
  const confirm = document.getElementById('rpConfirm').value;
  if(!pw||pw.length<6) { showToast('Password must be at least 6 characters','error'); return; }
  if(pw!==confirm) { showToast('Passwords do not match','error'); return; }
  const r = await api('/api/admin/users/' + id + '/reset-password', { method:'POST', body: JSON.stringify({password:pw}) });
  if(r.error) { showToast(r.error,'error'); return; }
  closeModal();
  showToast('Password reset successfully','success');
};

window.deleteUser = async function(id, name) {
  if(!confirm('Delete user "' + name + '"? This cannot be undone.')) return;
  const r = await api('/api/admin/users/' + id, { method:'DELETE' });
  if(r.error) { showToast(r.error,'error'); return; }
  showToast('User ' + name + ' deleted','success');
  renderAdminUsers();
};

function renderAdminHealth(h) {
  const el = document.getElementById('adminContent');
  if(!el) return;

  // SVG gauge helper
  function gauge(pct, color, label) {
    const r = 34, c = 2*Math.PI*r, off = c*(1-pct/100);
    return '<div class="text-center"><svg width="80" height="80" viewBox="0 0 80 80"><circle cx="40" cy="40" r="' + r + '" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="6"/><circle cx="40" cy="40" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="6" stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '" transform="rotate(-90 40 40)" class="gauge-ring"/><text x="40" y="40" text-anchor="middle" dominant-baseline="central" fill="white" font-size="14" font-weight="700" font-family="Inter">' + pct.toFixed(0) + '%</text></svg><p class="text-[9px] text-white/40 mt-1">' + label + '</p></div>';
  }

  el.innerHTML =
    '<div class="page-transition">' +
    '<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">' +
    '<div class="kpi-card accent-green p-4"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-[#00A86B]/15 flex items-center justify-center"><i class="fas fa-heartbeat text-[#00A86B] admin-pulse"></i></div><div><p class="text-[10px] text-white/40 uppercase">Status</p><p class="text-sm font-bold text-[#00A86B]">' + (h.overall||'healthy').toUpperCase() + '</p></div></div></div>' +
    '<div class="kpi-card accent-blue p-4"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center"><i class="fas fa-arrow-up text-blue-400"></i></div><div><p class="text-[10px] text-white/40 uppercase">Uptime</p><p class="text-sm font-bold text-white">' + (h.uptime||'99.7%') + '</p></div></div></div>' +
    '<div class="kpi-card accent-purple p-4"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center"><i class="fas fa-cubes text-purple-400"></i></div><div><p class="text-[10px] text-white/40 uppercase">Services</p><p class="text-sm font-bold text-white">' + (h.services||[]).length + ' active</p></div></div></div>' +
    '<div class="kpi-card accent-amber p-4"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center"><i class="fas fa-exclamation-circle text-amber-400"></i></div><div><p class="text-[10px] text-white/40 uppercase">Last Incident</p><p class="text-[10px] font-bold text-white">' + (h.lastIncident||'None') + '</p></div></div></div>' +
    '</div>' +

    // Microservices — animated cards
    '<div class="panel-card p-5 mb-5"><h3 class="text-[11px] font-semibold text-white/50 mb-3 uppercase tracking-wider"><i class="fas fa-server mr-1.5"></i>Microservice Status</h3><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">' +
    (h.services||[]).map(s => {
      const sColor = s.status==='healthy'?'emerald':s.status==='warning'?'amber':'red';
      return '<div class="service-card p-3 rounded-xl bg-white/5 border border-white/10 hover:border-' + sColor + '-500/30 transition-all">' +
        '<div class="flex items-center justify-between mb-2"><div class="flex items-center gap-2"><div class="w-2.5 h-2.5 rounded-full bg-' + sColor + '-400 service-status-dot"></div><span class="text-xs font-semibold text-white/85">' + s.name + '</span></div><span class="badge bg-' + sColor + '-900/50 text-' + sColor + '-400">' + s.status + '</span></div>' +
        '<div class="grid grid-cols-3 gap-2 text-center">' +
        '<div><p class="text-[9px] text-white/30">Latency</p><p class="text-[10px] font-mono text-white/60">' + s.latency + '</p></div>' +
        '<div><p class="text-[9px] text-white/30">Uptime</p><p class="text-[10px] font-mono text-white/60">' + s.uptime + '</p></div>' +
        '<div><p class="text-[9px] text-white/30">Load</p><p class="text-[10px] font-mono ' + (s.load>=70?'text-red-400':s.load>=40?'text-amber-400':'text-[#00A86B]') + '">' + s.load + '%</p></div></div>' +
        '<div class="mt-2"><div class="w-full bg-white/6 rounded-full h-1.5"><div class="h-1.5 rounded-full transition-all duration-700 ' + (s.load>=70?'bg-red-500':s.load>=40?'bg-amber-500':'bg-[#00A86B]') + '" style="width:' + s.load + '%"></div></div></div>' +
        '<p class="text-[8px] text-white/20 mt-1.5">Last check: ' + s.lastCheck + '</p></div>';
    }).join('') +
    '</div></div>' +

    // Storage gauges
    '<div class="panel-card p-5 mb-5"><h3 class="text-[11px] font-semibold text-white/50 mb-4 uppercase tracking-wider"><i class="fas fa-hdd mr-1.5"></i>Storage Utilization</h3><div class="grid grid-cols-2 md:grid-cols-4 gap-4">' +
    Object.entries(h.storage||{}).map(([k,v]) => {
      const pct = (v.used/v.total*100);
      const gColor = pct>=80?'#ef4444':pct>=50?'#f59e0b':'#00A86B';
      return '<div class="p-4 rounded-xl bg-white/5 border border-white/10">' +
        gauge(pct, gColor, k.charAt(0).toUpperCase()+k.slice(1)) +
        '<div class="mt-2 text-center"><p class="text-xs font-bold text-white">' + v.used + ' / ' + v.total + ' ' + v.unit + '</p></div></div>';
    }).join('') +
    '</div></div>' +

    // Events timeline
    '<div class="panel-card p-5"><h3 class="text-[11px] font-semibold text-white/50 mb-3 uppercase tracking-wider"><i class="fas fa-stream mr-1.5"></i>System Events</h3><div class="space-y-1.5">' +
    (h.recentEvents||[]).map(e => '<div class="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/8 transition"><span class="text-[10px] text-white/40 font-mono w-14 shrink-0">' + e.time + '</span><span class="w-2 h-2 rounded-full shrink-0 ' + (e.type==='alert'?'bg-red-400':e.type==='warning'?'bg-amber-400':'bg-emerald-400') + '"></span><span class="text-xs text-white/70 flex-1">' + e.event + '</span></div>').join('') +
    '</div></div></div>';
}

// ===== PERFORMANCE METRICS PANEL (Live D1 Data) =====
async function renderAdminPerf() {
  const el = document.getElementById('adminContent');
  if(!el) return;
  el.innerHTML = '<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-white/30 text-xl"></i><p class="text-white/30 text-xs mt-3">Loading live metrics...</p></div>';

  const p = await api('/api/admin/performance');
  const isLive = p.dataSource === 'live_d1';

  // Sparkline SVG from hourly trend
  var trend = p.hourlyTrend || [];
  var sparkW = 260, sparkH = 40;
  var maxReq = Math.max(1, Math.max.apply(null, trend.map(function(t){return t.requests;})));
  var sparkPath = trend.length > 1 ? trend.map(function(t,i){
    var x = (i/(trend.length-1)) * sparkW;
    var y = sparkH - (t.requests/maxReq) * sparkH;
    return (i===0?'M':'L') + x.toFixed(1) + ',' + y.toFixed(1);
  }).join(' ') : '';

  el.innerHTML =
    '<div class="page-transition">' +
    // Live indicator
    '<div class="flex items-center gap-2 mb-4"><span class="flex items-center gap-1.5 text-[10px] '+(isLive?'text-[#00A86B]':'text-amber-400')+'"><span class="w-2 h-2 rounded-full '+(isLive?'bg-[#00A86B]':'bg-amber-400')+'" style="animation:pulse 2s infinite"></span>'+(isLive?'Live D1 Metrics':'Static Data')+'</span><span class="text-[10px] text-white/20">Updated: ' + new Date().toLocaleTimeString() + '</span></div>' +

    // KPI row
    '<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-5">' +
    '<div class="kpi-card accent-blue p-4"><div><p class="text-[10px] text-white/40 uppercase">Requests Today</p><p class="text-xl font-bold text-white">' + (p.requestsToday||0).toLocaleString() + '</p></div></div>' +
    '<div class="kpi-card accent-green p-4"><div><p class="text-[10px] text-white/40 uppercase">Avg Latency</p><p class="text-xl font-bold text-[#00A86B]">' + (p.avgLatency||'--') + '</p></div></div>' +
    '<div class="kpi-card accent-purple p-4"><div><p class="text-[10px] text-white/40 uppercase">P95 Latency</p><p class="text-xl font-bold text-purple-400">' + (p.p95Latency||'--') + '</p></div></div>' +
    '<div class="kpi-card accent-amber p-4"><div><p class="text-[10px] text-white/40 uppercase">P99 Latency</p><p class="text-xl font-bold text-amber-400">' + (p.p99Latency||'--') + '</p></div></div>' +
    '<div class="kpi-card p-4"><div><p class="text-[10px] text-white/40 uppercase">Errors Today</p><p class="text-xl font-bold '+(p.errorsToday>0?'text-red-400':'text-white')+'">' + (p.errorsToday||0) + '</p></div></div>' +
    '<div class="kpi-card p-4"><div><p class="text-[10px] text-white/40 uppercase">Error Rate</p><p class="text-xl font-bold '+(parseFloat(p.errorRate)>0.01?'text-red-400':'text-[#00A86B]')+'">' + (parseFloat(p.errorRate)*100).toFixed(2) + '%</p></div></div>' +
    '</div>' +

    // Request trend sparkline
    '<div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">' +
    '<div class="panel-card p-5"><h3 class="text-[10px] font-semibold text-white/40 uppercase mb-4"><i class="fas fa-chart-area mr-1.5"></i>Request Volume (Last 24h)</h3>' +
    (trend.length > 1 ? '<svg width="100%" height="90" viewBox="-10 -5 280 55" preserveAspectRatio="none"><defs><linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#00A86B" stop-opacity="0.3"/><stop offset="100%" stop-color="#00A86B" stop-opacity="0"/></linearGradient></defs><path d="' + sparkPath + ' L'+sparkW+','+sparkH+' L0,'+sparkH+' Z" fill="url(#sparkGrad)"/><path d="' + sparkPath + '" fill="none" stroke="#00A86B" stroke-width="2"/></svg><div class="flex justify-between text-[8px] text-white/20 mt-1">' + trend.map(function(t){return '<span>'+t.hour+'</span>';}).join('') + '</div>' : '<p class="text-xs text-white/30 text-center py-4">No hourly data yet — metrics accumulate over time</p>') +
    '</div>' +

    // Slowest endpoints table
    '<div class="panel-card p-5"><h3 class="text-[10px] font-semibold text-white/40 uppercase mb-4"><i class="fas fa-hourglass-half mr-1.5"></i>Slowest Endpoints</h3>' +
    '<table class="w-full text-xs"><thead><tr><th class="text-left text-[10px] text-white/30 pb-2 uppercase">Endpoint</th><th class="text-right text-[10px] text-white/30 pb-2 uppercase">Avg</th><th class="text-right text-[10px] text-white/30 pb-2 uppercase">Hits</th></tr></thead><tbody>' +
    (p.slowestEndpoints||[]).map(function(ep) {
      var lat = parseInt(ep.avgLatency);
      var barColor = lat > 100 ? 'bg-red-500' : lat > 50 ? 'bg-amber-500' : 'bg-[#00A86B]';
      return '<tr class="border-t border-white/5"><td class="py-2"><span class="font-mono text-[10px] text-white/70">' + ep.path + '</span><div class="w-full bg-white/5 rounded-full h-1 mt-1"><div class="h-1 rounded-full '+barColor+'" style="width:'+Math.min(100,lat/2)+'%"></div></div></td><td class="py-2 text-right text-white/50 font-mono">' + ep.avgLatency + '</td><td class="py-2 text-right text-white/40">' + ep.hits + '</td></tr>';
    }).join('') +
    ((!p.slowestEndpoints||p.slowestEndpoints.length===0) ? '<tr><td colspan="3" class="py-4 text-center text-white/20">No endpoint data yet</td></tr>' : '') +
    '</tbody></table></div></div>' +

    // Last hour summary
    '<div class="panel-card p-4"><div class="flex flex-wrap items-center gap-6"><div class="flex items-center gap-2"><i class="fas fa-clock text-white/20"></i><span class="text-xs text-white/40">Last Hour:</span><span class="text-xs font-bold text-white">' + (p.requestsLastHour||0) + ' requests</span></div><div class="flex items-center gap-2"><span class="text-xs text-white/40">Avg:</span><span class="text-xs font-bold text-white">' + (p.avgLatencyLastHour||'--') + '</span></div><div class="flex items-center gap-2"><span class="text-xs text-white/40">Max:</span><span class="text-xs font-bold text-white">' + (p.maxLatency||'--') + '</span></div><div class="flex items-center gap-2"><span class="text-xs text-white/40">CPU:</span><span class="text-xs font-bold text-white">' + (p.cpuTime||'--') + '</span></div><button onclick="renderAdminPerf()" class="ml-auto px-3 py-1 bg-white/5 rounded-lg text-[10px] text-white/40 hover:bg-white/10 hover:text-white transition"><i class="fas fa-sync-alt mr-1"></i>Refresh</button></div></div></div>';
}

function renderAdminDQ(h) {
  const el = document.getElementById('adminContent');
  if(!el) return;
  el.innerHTML =
    '<div class="panel-card overflow-hidden"><div class="px-5 py-3 border-b border-white/8"><h3 class="text-[11px] font-semibold text-white/50 uppercase">Institutional Data Quality Scorecard</h3></div><div class="overflow-x-auto"><table class="w-full text-xs"><thead class="bg-white/5"><tr><th class="px-3 py-2.5 text-left text-[10px] font-medium text-white/50 uppercase">Institution</th><th class="px-3 py-2.5 text-left text-[10px] font-medium text-white/50 uppercase">Overall</th><th class="px-3 py-2.5 text-left text-[10px] font-medium text-white/50 uppercase">Completeness</th><th class="px-3 py-2.5 text-left text-[10px] font-medium text-white/50 uppercase">Timeliness</th><th class="px-3 py-2.5 text-left text-[10px] font-medium text-white/50 uppercase">Accuracy</th><th class="px-3 py-2.5 text-left text-[10px] font-medium text-white/50 uppercase">Trend</th></tr></thead><tbody class="divide-y divide-gray-800">' +
    (h.dqScorecard||[]).map(d => '<tr class="hover:bg-white/5"><td class="px-3 py-2 text-white/85">' + d.institution + '</td><td class="px-3 py-2"><div class="flex items-center gap-1.5"><div class="w-10 bg-white/10 rounded-full h-1"><div class="h-1 rounded-full ' + (d.score>=80?'bg-[#00A86B]':d.score>=60?'bg-amber-500':'bg-red-500') + '" style="width:' + d.score + '%"></div></div><span class="text-[10px] font-bold ' + (d.score>=80?'text-[#00A86B]':d.score>=60?'text-amber-400':'text-red-400') + '">' + d.score + '%</span></div></td><td class="px-3 py-2 text-white/50">' + d.completeness + '%</td><td class="px-3 py-2 text-white/50">' + d.timeliness + '%</td><td class="px-3 py-2 text-white/50">' + d.accuracy + '%</td><td class="px-3 py-2"><i class="fas fa-arrow-' + (d.trend==='rising'?'up text-[#00A86B]':d.trend==='falling'?'down text-red-400':'right text-white/40') + ' text-[10px]"></i></td></tr>').join('') +
    '</tbody></table></div></div>';
}

async function renderAdminAudit() {
  const el = document.getElementById('adminContent');
  if(!el) return;
  el.innerHTML = '<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-white/30 text-xl"></i><p class="text-white/30 text-xs mt-3">Loading audit trail...</p></div>';

  // State for audit filters
  if(!state.auditFilters) state.auditFilters = { page:1, search:'', action:'', user:'', from:'', to:'' };
  const af = state.auditFilters;

  const qs = new URLSearchParams({page:af.page, limit:30, search:af.search, action:af.action, user:af.user, from:af.from, to:af.to});
  const data = await api('/api/admin/audit?' + qs.toString());
  const entries = data.entries || [];
  const total = data.total || 0;
  const totalPages = Math.ceil(total / 30) || 1;
  const stats = data.stats || {};
  const filters = data.filters || {};
  const topActions = (stats.actionBreakdown||[]).slice(0,6);

  // Action color mapping
  function actionBadge(a) {
    if(a.includes('Delete')) return 'bg-red-900/50 text-red-400';
    if(a.includes('Alert')|| a.includes('Escalat')) return 'bg-red-900/50 text-red-400';
    if(a.includes('Create')||a.includes('Submit')) return 'bg-emerald-900/50 text-emerald-400';
    if(a.includes('Update')||a.includes('Reset')) return 'bg-amber-900/50 text-amber-400';
    if(a.includes('Login')) return 'bg-blue-900/50 text-blue-400';
    return 'bg-white/10 text-white/50';
  }

  el.innerHTML =
    '<div class="page-transition">' +
    // Stats summary
    '<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">' +
    '<div class="kpi-card accent-blue p-4"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center"><i class="fas fa-list-alt text-blue-400"></i></div><div><p class="text-[10px] text-white/40 uppercase">Total Events</p><p class="text-lg font-bold text-white">' + total.toLocaleString() + '</p></div></div></div>' +
    '<div class="kpi-card accent-green p-4"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-[#00A86B]/15 flex items-center justify-center"><i class="fas fa-users text-[#00A86B]"></i></div><div><p class="text-[10px] text-white/40 uppercase">Unique Users</p><p class="text-lg font-bold text-white">' + (stats.uniqueUsers||0) + '</p></div></div></div>' +
    '<div class="kpi-card accent-purple p-4"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center"><i class="fas fa-tags text-purple-400"></i></div><div><p class="text-[10px] text-white/40 uppercase">Action Types</p><p class="text-lg font-bold text-white">' + (filters.actions||[]).length + '</p></div></div></div>' +
    '<div class="kpi-card accent-amber p-4"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center"><i class="fas fa-file-csv text-amber-400"></i></div><div><p class="text-[10px] text-white/40 uppercase">Export</p><button onclick="auditExportCSV()" class="text-xs font-bold text-amber-400 hover:text-amber-300 transition"><i class="fas fa-download mr-1"></i>CSV</button></div></div></div>' +
    '</div>' +

    // Top actions mini-chart
    '<div class="panel-card p-4 mb-5"><h3 class="text-[10px] font-semibold text-white/40 uppercase mb-3"><i class="fas fa-chart-bar mr-1.5"></i>Action Breakdown</h3><div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">' +
    topActions.map(function(a) {
      var maxCnt = topActions[0] ? topActions[0].count : 1;
      var pct = Math.round(a.count/maxCnt*100);
      return '<div class="bg-white/5 rounded-lg p-2.5"><p class="text-[10px] text-white/60 font-medium truncate mb-1">' + a.action + '</p><div class="flex items-end gap-1.5"><span class="text-sm font-bold text-white">' + a.count + '</span><div class="flex-1 bg-white/10 rounded-full h-1"><div class="h-1 rounded-full bg-[#00A86B]" style="width:' + pct + '%"></div></div></div></div>';
    }).join('') +
    '</div></div>' +

    // Filters bar
    '<div class="panel-card p-4 mb-4"><div class="flex flex-wrap gap-3 items-end">' +
    '<div class="flex-1 min-w-[180px]"><label class="text-[9px] text-white/30 uppercase font-semibold block mb-1">Search</label><div class="relative"><i class="fas fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-white/20 text-[10px]"></i><input id="auditSearch" type="text" value="' + (af.search||'') + '" placeholder="Search users, actions, resources..." class="w-full pl-7 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#00A86B] placeholder-white/20" onkeydown="if(event.key===&apos;Enter&apos;)auditApplyFilters()"/></div></div>' +
    '<div class="w-[140px]"><label class="text-[9px] text-white/30 uppercase font-semibold block mb-1">Action</label><select id="auditAction" class="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#00A86B]" onchange="auditApplyFilters()"><option value="">All Actions</option>' + (filters.actions||[]).map(function(a){return '<option value="'+a+'" '+(af.action===a?'selected':'')+'>'+a+'</option>';}).join('') + '</select></div>' +
    '<div class="w-[120px]"><label class="text-[9px] text-white/30 uppercase font-semibold block mb-1">User</label><select id="auditUser" class="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#00A86B]" onchange="auditApplyFilters()"><option value="">All Users</option>' + (filters.users||[]).map(function(u){return '<option value="'+u+'" '+(af.user===u?'selected':'')+'>'+u+'</option>';}).join('') + '</select></div>' +
    '<div class="w-[130px]"><label class="text-[9px] text-white/30 uppercase font-semibold block mb-1">From</label><input id="auditFrom" type="date" value="' + (af.from||'') + '" class="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#00A86B]" onchange="auditApplyFilters()"/></div>' +
    '<div class="w-[130px]"><label class="text-[9px] text-white/30 uppercase font-semibold block mb-1">To</label><input id="auditTo" type="date" value="' + (af.to||'') + '" class="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#00A86B]" onchange="auditApplyFilters()"/></div>' +
    '<button onclick="auditClearFilters()" class="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white/40 text-xs hover:bg-white/10 hover:text-white/70 transition" title="Clear filters"><i class="fas fa-times mr-1"></i>Clear</button>' +
    '</div></div>' +

    // Table
    '<div class="panel-card overflow-hidden"><div class="px-4 py-2.5 border-b border-white/8 flex items-center justify-between"><span class="text-[10px] text-white/40">Showing ' + ((af.page-1)*30+1) + '-' + Math.min(af.page*30, total) + ' of ' + total + '</span><div class="flex items-center gap-1">' +
    '<button onclick="auditPrevPage()" class="px-2 py-1 rounded bg-white/5 text-white/40 text-[10px] hover:bg-white/10 transition '+(af.page<=1?'opacity-30 pointer-events-none':'')+'"><i class="fas fa-chevron-left"></i></button>' +
    '<span class="text-[10px] text-white/50 px-2">' + af.page + ' / ' + totalPages + '</span>' +
    '<button onclick="auditNextPage()" class="px-2 py-1 rounded bg-white/5 text-white/40 text-[10px] hover:bg-white/10 transition '+(af.page>=totalPages?'opacity-30 pointer-events-none':'')+'"><i class="fas fa-chevron-right"></i></button>' +
    '</div></div>' +
    '<div class="overflow-x-auto"><table class="w-full text-xs"><thead class="bg-white/5"><tr><th class="px-3 py-2.5 text-left text-[10px] font-medium text-white/50 uppercase">Timestamp</th><th class="px-3 py-2.5 text-left text-[10px] font-medium text-white/50 uppercase">User</th><th class="px-3 py-2.5 text-left text-[10px] font-medium text-white/50 uppercase">Action</th><th class="px-3 py-2.5 text-left text-[10px] font-medium text-white/50 uppercase">Resource</th><th class="px-3 py-2.5 text-left text-[10px] font-medium text-white/50 uppercase">Details</th><th class="px-3 py-2.5 text-left text-[10px] font-medium text-white/50 uppercase">IP</th></tr></thead><tbody class="divide-y divide-gray-800">' +
    (entries.length === 0 ? '<tr><td colspan="6" class="px-4 py-8 text-center text-white/30 text-xs"><i class="fas fa-inbox text-xl mb-2 block"></i>No audit entries match your filters</td></tr>' :
    entries.map(function(e) { return '<tr class="hover:bg-white/5"><td class="px-3 py-2 text-white/50 font-mono text-[10px] whitespace-nowrap">' + (e.timestamp||'') + '</td><td class="px-3 py-2 text-white/85 whitespace-nowrap"><span class="inline-flex items-center gap-1"><span class="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-[8px] text-white/50 font-bold">' + (e.user?e.user.charAt(0).toUpperCase():'?') + '</span>' + (e.user||'System') + '</span></td><td class="px-3 py-2"><span class="badge ' + actionBadge(e.action||'') + '">' + (e.action||'') + '</span></td><td class="px-3 py-2 font-mono text-[10px] text-[#00A86B] max-w-[140px] truncate">' + (e.resource||'') + '</td><td class="px-3 py-2 text-white/40 text-[10px] max-w-[200px] truncate" title="' + (e.details||'').replace(/"/g,'&quot;') + '">' + (e.details||'') + '</td><td class="px-3 py-2 text-white/40 font-mono text-[10px]">' + (e.ip||'') + '</td></tr>'; }).join('')) +
    '</tbody></table></div>' +
    // Bottom pagination
    '<div class="px-4 py-2.5 border-t border-white/8 flex items-center justify-between"><span class="text-[10px] text-white/30">' + total + ' total events</span><div class="flex items-center gap-1">' +
    '<button onclick="auditPrevPage()" class="px-2 py-1 rounded bg-white/5 text-white/40 text-[10px] hover:bg-white/10 transition '+(af.page<=1?'opacity-30 pointer-events-none':'')+'"><i class="fas fa-chevron-left mr-1"></i>Prev</button>' +
    '<button onclick="auditNextPage()" class="px-2 py-1 rounded bg-white/5 text-white/40 text-[10px] hover:bg-white/10 transition '+(af.page>=totalPages?'opacity-30 pointer-events-none':'')+'">Next<i class="fas fa-chevron-right ml-1"></i></button>' +
    '</div></div></div></div>';
}

window.auditApplyFilters = function() {
  state.auditFilters.page = 1;
  state.auditFilters.search = (document.getElementById('auditSearch')||{}).value || '';
  state.auditFilters.action = (document.getElementById('auditAction')||{}).value || '';
  state.auditFilters.user = (document.getElementById('auditUser')||{}).value || '';
  state.auditFilters.from = (document.getElementById('auditFrom')||{}).value || '';
  state.auditFilters.to = (document.getElementById('auditTo')||{}).value || '';
  renderAdminAudit();
};
window.auditClearFilters = function() {
  state.auditFilters = { page:1, search:'', action:'', user:'', from:'', to:'' };
  renderAdminAudit();
};
window.auditPrevPage = function() {
  if(state.auditFilters.page > 1) { state.auditFilters.page--; renderAdminAudit(); }
};
window.auditNextPage = function() {
  state.auditFilters.page++;
  renderAdminAudit();
};
window.auditExportCSV = function() {
  window.open('/api/admin/audit/export', '_blank');
};

// ===== SECURITY COMPLIANCE DASHBOARD =====
async function renderAdminSecurity() {
  const el = document.getElementById('adminContent');
  if(!el) return;
  el.innerHTML = '<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-white/30 text-xl"></i><p class="text-white/30 text-xs mt-3">Loading security status...</p></div>';

  let sec, events, ipList;
  try {
    [sec, events, ipList] = await Promise.all([
      api('/api/security/status'),
      api('/api/security/events?limit=20'),
      api('/api/security/ip-allowlist')
    ]);
  } catch(e) {
    el.innerHTML = '<div class="panel-card p-6 text-center"><i class="fas fa-exclamation-triangle text-red-400 text-2xl mb-3"></i><p class="text-white/60 text-sm">Failed to load security data</p><button onclick="renderAdminSecurity()" class="mt-3 px-4 py-2 bg-white/5 rounded-lg text-xs text-white/50 hover:bg-white/10"><i class="fas fa-redo mr-1"></i>Retry</button></div>';
    return;
  }

  var score = sec.complianceScore || 0;
  var checks = sec.complianceChecks || [];
  var passCount = checks.filter(function(c){ return c.status === 'pass'; }).length;
  var warnCount = checks.filter(function(c){ return c.status === 'warn' || c.status === 'info'; }).length;
  var failCount = checks.filter(function(c){ return c.status === 'fail'; }).length;
  var evts = (events.events || []);
  var allowlist = ipList.allowlist || [];
  var ipEnabled = ipList.enabled || false;
  var scoreColor = score >= 90 ? '#00A86B' : score >= 70 ? '#F59E0B' : '#EF4444';
  var scoreLabel = score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : 'Needs Attention';

  // severity counts
  var critEvts = evts.filter(function(e){ return e.severity === 'critical'; }).length;
  var highEvts = evts.filter(function(e){ return e.severity === 'high'; }).length;
  var unresolvedEvts = evts.filter(function(e){ return !e.resolved; }).length;

  el.innerHTML = '<div class="page-transition">' +

    // TOP KPI ROW
    '<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">' +
    // Compliance score gauge
    '<div class="panel-card p-4 text-center">' +
      '<div class="relative inline-block mb-2">' +
        '<svg width="80" height="80" viewBox="0 0 80 80">' +
          '<circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="6"/>' +
          '<circle cx="40" cy="40" r="34" fill="none" stroke="' + scoreColor + '" stroke-width="6" stroke-dasharray="' + (2*Math.PI*34*score/100) + ' ' + (2*Math.PI*34) + '" stroke-linecap="round" transform="rotate(-90 40 40)" style="transition:stroke-dasharray 1s ease"/>' +
          '<text x="40" y="38" text-anchor="middle" fill="white" font-size="18" font-weight="bold">' + score + '</text>' +
          '<text x="40" y="52" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="8">%</text>' +
        '</svg>' +
      '</div>' +
      '<p class="text-[10px] font-semibold" style="color:' + scoreColor + '">' + scoreLabel + '</p>' +
      '<p class="text-[10px] text-white/30">Compliance Score</p>' +
    '</div>' +
    // Checks summary
    '<div class="panel-card p-4">' +
      '<div class="flex items-center gap-2 mb-3"><i class="fas fa-clipboard-check text-[#00A86B]/60 text-lg"></i><span class="text-[10px] text-white/40 uppercase font-medium">Checks</span></div>' +
      '<div class="text-2xl font-bold text-white mb-1">' + checks.length + '</div>' +
      '<div class="flex items-center gap-3 text-[10px]">' +
        '<span class="text-[#00A86B]"><i class="fas fa-check-circle mr-1"></i>' + passCount + ' pass</span>' +
        '<span class="text-yellow-400"><i class="fas fa-info-circle mr-1"></i>' + warnCount + ' info</span>' +
        '<span class="text-red-400"><i class="fas fa-times-circle mr-1"></i>' + failCount + ' fail</span>' +
      '</div>' +
    '</div>' +
    // Security events
    '<div class="panel-card p-4">' +
      '<div class="flex items-center gap-2 mb-3"><i class="fas fa-exclamation-triangle text-yellow-400/60 text-lg"></i><span class="text-[10px] text-white/40 uppercase font-medium">Events</span></div>' +
      '<div class="text-2xl font-bold text-white mb-1">' + (events.total || evts.length) + '</div>' +
      '<div class="flex items-center gap-3 text-[10px]">' +
        (critEvts > 0 ? '<span class="text-red-400"><i class="fas fa-skull-crossbones mr-1"></i>' + critEvts + ' critical</span>' : '') +
        (highEvts > 0 ? '<span class="text-orange-400"><i class="fas fa-fire mr-1"></i>' + highEvts + ' high</span>' : '') +
        '<span class="text-white/40">' + unresolvedEvts + ' unresolved</span>' +
      '</div>' +
    '</div>' +
    // IP Restriction
    '<div class="panel-card p-4">' +
      '<div class="flex items-center gap-2 mb-3"><i class="fas fa-network-wired text-cyan-400/60 text-lg"></i><span class="text-[10px] text-white/40 uppercase font-medium">IP Restriction</span></div>' +
      '<div class="text-2xl font-bold text-white mb-1">' + (ipEnabled ? '<span class="text-[#00A86B]">ON</span>' : '<span class="text-white/30">OFF</span>') + '</div>' +
      '<div class="text-[10px] text-white/40">' + allowlist.length + ' IPs in allowlist</div>' +
      '<button onclick="secToggleIpRestriction()" class="mt-2 px-3 py-1 bg-white/5 rounded-lg text-[10px] text-white/40 hover:bg-white/10 hover:text-white transition">' + (ipEnabled ? '<i class="fas fa-lock-open mr-1"></i>Disable' : '<i class="fas fa-lock mr-1"></i>Enable') + '</button>' +
    '</div>' +
    '</div>' +

    // COMPLIANCE CHECKS TABLE
    '<div class="panel-card mb-5">' +
      '<div class="flex items-center justify-between px-4 py-3 border-b border-white/5">' +
        '<h3 class="text-xs font-bold text-white"><i class="fas fa-shield-alt mr-2 text-[#00A86B]/60"></i>Compliance Checks (' + checks.length + ')</h3>' +
        '<button onclick="renderAdminSecurity()" class="px-3 py-1 bg-white/5 rounded-lg text-[10px] text-white/40 hover:bg-white/10 hover:text-white transition"><i class="fas fa-sync-alt mr-1"></i>Refresh</button>' +
      '</div>' +
      '<div class="overflow-x-auto"><table class="w-full text-xs"><tbody>' +
      checks.map(function(c, i) {
        var icon = c.status === 'pass' ? '<i class="fas fa-check-circle text-[#00A86B]"></i>' :
                   c.status === 'fail' ? '<i class="fas fa-times-circle text-red-400"></i>' :
                   '<i class="fas fa-info-circle text-yellow-400"></i>';
        var bg = i % 2 === 0 ? '' : 'bg-white/[0.02]';
        return '<tr class="' + bg + ' border-b border-white/[0.03]">' +
          '<td class="px-4 py-2.5 w-8">' + icon + '</td>' +
          '<td class="px-3 py-2.5 text-white font-medium">' + c.name + '</td>' +
          '<td class="px-3 py-2.5 text-white/40">' + (c.details || '-') + '</td>' +
        '</tr>';
      }).join('') +
      '</tbody></table></div>' +
    '</div>' +

    // SECURITY EVENTS + IP ALLOWLIST ROW
    '<div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">' +

    // Security Events (2/3)
    '<div class="lg:col-span-2 panel-card">' +
      '<div class="flex items-center justify-between px-4 py-3 border-b border-white/5">' +
        '<h3 class="text-xs font-bold text-white"><i class="fas fa-history mr-2 text-yellow-400/60"></i>Recent Security Events</h3>' +
      '</div>' +
      (evts.length === 0
        ? '<div class="p-6 text-center text-white/30 text-xs"><i class="fas fa-check-circle text-[#00A86B]/40 text-lg mb-2"></i><p>No security events recorded</p></div>'
        : '<div class="divide-y divide-white/[0.03] max-h-80 overflow-y-auto">' +
          evts.map(function(e) {
            var sevColor = e.severity === 'critical' ? 'text-red-400 bg-red-400/10' :
                           e.severity === 'high' ? 'text-orange-400 bg-orange-400/10' :
                           e.severity === 'medium' ? 'text-yellow-400 bg-yellow-400/10' :
                           'text-white/40 bg-white/5';
            var typeIcon = e.event_type.includes('login_fail') ? 'fa-user-slash' :
                           e.event_type.includes('login_success') ? 'fa-sign-in-alt' :
                           e.event_type.includes('rate_limit') ? 'fa-tachometer-alt' :
                           e.event_type.includes('token') ? 'fa-key' :
                           e.event_type.includes('brute') ? 'fa-skull' :
                           'fa-shield-alt';
            return '<div class="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.02] transition">' +
              '<div class="w-6 h-6 rounded-full flex items-center justify-center ' + sevColor + ' flex-shrink-0 mt-0.5"><i class="fas ' + typeIcon + ' text-[10px]"></i></div>' +
              '<div class="flex-1 min-w-0">' +
                '<div class="flex items-center gap-2 mb-0.5">' +
                  '<span class="text-xs text-white font-medium truncate">' + (e.event_type || '').replace(/_/g,' ') + '</span>' +
                  '<span class="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ' + sevColor + '">' + e.severity + '</span>' +
                  (e.resolved ? '<span class="text-[9px] text-[#00A86B]"><i class="fas fa-check mr-0.5"></i>resolved</span>' : '') +
                '</div>' +
                '<p class="text-[10px] text-white/40 truncate">' + (e.details || '-') + '</p>' +
                '<div class="flex items-center gap-3 mt-1 text-[9px] text-white/25">' +
                  '<span><i class="fas fa-user mr-1"></i>' + (e.username || e.user_id || 'system') + '</span>' +
                  '<span><i class="fas fa-globe mr-1"></i>' + (e.ip || '-') + '</span>' +
                  '<span><i class="fas fa-clock mr-1"></i>' + (e.created_at || '-') + '</span>' +
                '</div>' +
              '</div>' +
              (!e.resolved ? '<button onclick="secResolveEvent(\\'' + e.id + '\\')" class="px-2 py-1 bg-white/5 rounded text-[9px] text-white/30 hover:bg-white/10 hover:text-white transition flex-shrink-0" title="Resolve"><i class="fas fa-check"></i></button>' : '') +
            '</div>';
          }).join('') +
          '</div>'
      ) +
    '</div>' +

    // IP Allowlist (1/3)
    '<div class="panel-card">' +
      '<div class="flex items-center justify-between px-4 py-3 border-b border-white/5">' +
        '<h3 class="text-xs font-bold text-white"><i class="fas fa-lock mr-2 text-cyan-400/60"></i>IP Allowlist</h3>' +
      '</div>' +
      '<div class="p-4">' +
        '<div class="flex gap-2 mb-3">' +
          '<input id="secIpInput" type="text" placeholder="e.g. 10.0.1.0/24" class="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/25 focus:border-[#00A86B]/50 outline-none"/>' +
          '<button onclick="secAddIp()" class="px-3 py-2 bg-[#00A86B] hover:bg-[#008F5B] rounded-lg text-xs text-white font-semibold transition"><i class="fas fa-plus"></i></button>' +
        '</div>' +
        '<input id="secIpLabel" type="text" placeholder="Label (optional)" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/25 focus:border-[#00A86B]/50 outline-none mb-3"/>' +
        (allowlist.length === 0
          ? '<p class="text-[10px] text-white/25 text-center py-4">No IPs in allowlist</p>'
          : '<div class="space-y-2 max-h-48 overflow-y-auto">' +
            allowlist.map(function(ip) {
              return '<div class="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2">' +
                '<div>' +
                  '<span class="text-xs text-white font-mono">' + (ip.ip || ip.cidr || '-') + '</span>' +
                  (ip.label ? '<span class="text-[10px] text-white/30 ml-2">' + ip.label + '</span>' : '') +
                '</div>' +
                '<button onclick="secRemoveIp(\\'' + ip.id + '\\')" class="text-red-400/60 hover:text-red-400 transition text-xs"><i class="fas fa-trash-alt"></i></button>' +
              '</div>';
            }).join('') +
            '</div>'
        ) +
      '</div>' +
    '</div>' +

    '</div>' +

    // QUICK ACTIONS ROW
    '<div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">' +
    '<button onclick="secEncryptPii()" class="panel-card p-4 text-left hover:bg-white/[0.04] transition group">' +
      '<div class="flex items-center gap-3">' +
        '<div class="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition"><i class="fas fa-user-shield text-purple-400 text-sm"></i></div>' +
        '<div><p class="text-xs font-semibold text-white">Encrypt PII</p><p class="text-[10px] text-white/30">Encrypt unprotected personal data fields</p></div>' +
      '</div>' +
    '</button>' +
    '<button onclick="secRevokeToken()" class="panel-card p-4 text-left hover:bg-white/[0.04] transition group">' +
      '<div class="flex items-center gap-3">' +
        '<div class="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition"><i class="fas fa-ban text-red-400 text-sm"></i></div>' +
        '<div><p class="text-xs font-semibold text-white">Revoke Token</p><p class="text-[10px] text-white/30">Revoke a specific JWT by token ID</p></div>' +
      '</div>' +
    '</button>' +
    '<button onclick="secCleanup()" class="panel-card p-4 text-left hover:bg-white/[0.04] transition group">' +
      '<div class="flex items-center gap-3">' +
        '<div class="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition"><i class="fas fa-broom text-cyan-400 text-sm"></i></div>' +
        '<div><p class="text-xs font-semibold text-white">Security Cleanup</p><p class="text-[10px] text-white/30">Purge expired tokens, old events, stale sessions</p></div>' +
      '</div>' +
    '</button>' +
    '</div>' +

    '</div>';
}

// Security dashboard action handlers
window.secToggleIpRestriction = async function() {
  if(!confirm('Toggle admin IP restriction?')) return;
  try {
    await api('/api/security/ip-restriction/toggle', { method:'POST', body: JSON.stringify({}) });
    showToast('IP restriction toggled', 'success');
    renderAdminSecurity();
  } catch(e) { showToast('Failed: ' + (e.message||e), 'error'); }
};

window.secAddIp = async function() {
  var ip = (document.getElementById('secIpInput') || {}).value;
  var label = (document.getElementById('secIpLabel') || {}).value;
  if(!ip) { showToast('Enter an IP address or CIDR', 'error'); return; }
  try {
    await api('/api/security/ip-allowlist', { method:'POST', body: JSON.stringify({ ip: ip, label: label || 'Manual entry' }) });
    showToast('IP added to allowlist', 'success');
    renderAdminSecurity();
  } catch(e) { showToast('Failed: ' + (e.message||e), 'error'); }
};

window.secRemoveIp = async function(id) {
  if(!confirm('Remove this IP from the allowlist?')) return;
  try {
    await api('/api/security/ip-allowlist/' + id, { method:'DELETE' });
    showToast('IP removed', 'success');
    renderAdminSecurity();
  } catch(e) { showToast('Failed: ' + (e.message||e), 'error'); }
};

window.secResolveEvent = async function(id) {
  try {
    await api('/api/security/events/' + id + '/resolve', { method:'PATCH', body: JSON.stringify({}) });
    showToast('Event resolved', 'success');
    renderAdminSecurity();
  } catch(e) { showToast('Failed: ' + (e.message||e), 'error'); }
};

window.secEncryptPii = async function() {
  if(!confirm('Encrypt all unprotected PII fields? This cannot be undone.')) return;
  try {
    var r = await api('/api/security/encrypt-pii', { method:'POST', body: JSON.stringify({}) });
    showToast('PII encryption complete: ' + (r.encrypted || 0) + ' fields encrypted', 'success');
    renderAdminSecurity();
  } catch(e) { showToast('Failed: ' + (e.message||e), 'error'); }
};

window.secRevokeToken = async function() {
  var jti = prompt('Enter JWT Token ID (jti) to revoke:');
  if(!jti) return;
  try {
    await api('/api/security/token/revoke', { method:'POST', body: JSON.stringify({ jti: jti }) });
    showToast('Token revoked', 'success');
    renderAdminSecurity();
  } catch(e) { showToast('Failed: ' + (e.message||e), 'error'); }
};

window.secCleanup = async function() {
  if(!confirm('Run security cleanup? This purges expired tokens, old events, and stale sessions.')) return;
  try {
    var r = await api('/api/security/cleanup', { method:'POST', body: JSON.stringify({}) });
    showToast('Cleanup complete: ' + JSON.stringify(r.cleaned || r), 'success');
    renderAdminSecurity();
  } catch(e) { showToast('Failed: ' + (e.message||e), 'error'); }
};

// ===== AUTO REFRESH =====
window.spinRefresh = function() {
  const btn = document.getElementById('refreshBtn');
  if(btn) { btn.querySelector('i').classList.add('fa-spin'); setTimeout(() => btn.querySelector('i').classList.remove('fa-spin'), 1000); }
};

window.toggleAutoRefreshMenu = function() {
  const menu = document.getElementById('autoRefreshMenu');
  if(menu) menu.classList.toggle('hidden');
};

window.setAutoRefresh = function(seconds) {
  if(state.autoRefresh) clearInterval(state.autoRefresh);
  state.autoRefreshInterval = seconds;
  const badge = document.getElementById('autoRefreshBadge');
  const menu = document.getElementById('autoRefreshMenu');
  if(menu) menu.classList.add('hidden');
  if(seconds === 0) {
    state.autoRefresh = null;
    if(badge) { badge.classList.add('hidden'); badge.textContent = ''; }
    showToast('Auto-refresh disabled', 'info');
    return;
  }
  if(badge) { badge.classList.remove('hidden'); badge.textContent = seconds + 's'; }
  showToast('Auto-refresh every ' + seconds + 's', 'success');
  let countdown = seconds;
  state.autoRefresh = setInterval(() => {
    countdown--;
    if(badge) badge.textContent = countdown + 's';
    if(countdown <= 0) {
      countdown = seconds;
      spinRefresh();
      loadPage();
    }
  }, 1000);
};

// Close auto-refresh menu on outside click
document.addEventListener('click', function(e) {
  const wrap = document.getElementById('refreshWrap');
  const menu = document.getElementById('autoRefreshMenu');
  if(menu && wrap && !wrap.contains(e.target)) menu.classList.add('hidden');
});

// ===== DARK/LIGHT THEME =====
const savedTheme = localStorage.getItem('bior_theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

window.toggleTheme = function() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('bior_theme', next);
  showToast('Switched to ' + next + ' mode', 'info');
  const icon = document.getElementById('themeIcon');
  if (icon) icon.className = 'fas ' + (next === 'dark' ? 'fa-moon' : 'fa-sun');
  // Re-render page so maps and charts pick up correct theme
  render();
};

// ===== KEYBOARD SHORTCUTS =====
let shortcutPrefix = false;
let shortcutTimer = null;
document.addEventListener('keydown', function(e) {
  // Don't trigger in inputs
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
  if (!state.isAuthenticated) return;

  // ? = show help
  if (e.key === '?') { e.preventDefault(); showShortcutHelp(); return; }

  // Escape = close modal or report viewer
  if (e.key === 'Escape') {
    const rv = document.getElementById('reportViewerModal');
    if(rv) { rv.remove(); window._currentReportHTML = null; return; }
    closeModal(); return;
  }

  // g prefix for navigation
  if (e.key === 'g' && !shortcutPrefix) {
    shortcutPrefix = true;
    clearTimeout(shortcutTimer);
    shortcutTimer = setTimeout(() => { shortcutPrefix = false; }, 800);
    return;
  }

  if (shortcutPrefix) {
    shortcutPrefix = false;
    clearTimeout(shortcutTimer);
    const shortcuts = { d:'dashboard', s:'surveillance', t:'threats', n:'genomics', e:'ews', a:'alerts', r:'reports', m:'admin' };
    const page = shortcuts[e.key];
    if (page) { e.preventDefault(); navigate(page); showToast('Navigated to ' + page, 'info'); }
    return;
  }

  // / = focus search
  if (e.key === '/') {
    e.preventDefault();
    const search = document.getElementById('headerSearch');
    if (search) search.focus();
  }

  // r = refresh (standalone, not after g)
  if (e.key === 'r' && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    loadPage(); spinRefresh();
  }

  // t = toggle theme
  if (e.key === 'T' && e.shiftKey) {
    e.preventDefault();
    toggleTheme();
  }

  // Ctrl+K or Cmd+K = command palette
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    showCommandPalette();
  }
});

// ===== COMMAND PALETTE (Ctrl+K) =====
function showCommandPalette() {
  const allCommands = [
    {icon:'fa-tachometer-alt',label:'Dashboard',desc:'Overview & KPIs',action:'navigate(\\'dashboard\\')'},
    {icon:'fa-satellite-dish',label:'Surveillance Network',desc:'24 monitoring sites',action:'navigate(\\'surveillance\\')'},
    {icon:'fa-biohazard',label:'Threat Intelligence',desc:'Active biological threats',action:'navigate(\\'threats\\')'},
    {icon:'fa-dna',label:'Genomic Tracking',desc:'Sequencing pipeline & AMR',action:'navigate(\\'genomics\\')'},
    {icon:'fa-exclamation-triangle',label:'Early Warning System',desc:'Multi-layer EWS signals',action:'navigate(\\'ews\\')'},
    {icon:'fa-bell',label:'Alert Management',desc:'Review & manage alerts',action:'navigate(\\'alerts\\')'},
    {icon:'fa-chart-bar',label:'Reports & Analytics',desc:'Charts, sitreps, export',action:'navigate(\\'reports\\')'},
    {icon:'fa-archive',label:'Report Archive',desc:'Archived bulletins, generate on-demand',action:'navigate(\\'reports\\');setTimeout(()=>{const b=document.querySelector(\\'.rpt-tab-btn[data-tab=archive]\\');if(b)switchReportTab(b,\\'archive\\');},500)'},
    {icon:'fa-brain',label:'Analytics Intelligence',desc:'Risk scoring, anomalies, Rt, forecast',action:'navigate(\\'analytics\\')'},
    {icon:'fa-cogs',label:'Administration',desc:'System health & audit',action:'navigate(\\'admin\\')'},
    {icon:'fa-moon',label:'Toggle Dark/Light Theme',desc:'Switch appearance',action:'toggleTheme()'},
    {icon:'fa-sync-alt',label:'Refresh Page',desc:'Reload current page data',action:'loadPage();spinRefresh()'},
    {icon:'fa-keyboard',label:'Keyboard Shortcuts',desc:'Show all shortcuts',action:'showShortcutHelp()'},
    {icon:'fa-sign-out-alt',label:'Sign Out',desc:'Log out of BioR',action:'logout()'},
  ];

  document.getElementById('modal').innerHTML =
    '<div class="modal-overlay" onclick="if(event.target===this)closeModal()" style="align-items:flex-start;padding-top:15vh">' +
    '<div class="modal-content p-0 fade-in" style="max-width:540px;width:100%">' +
    '<div class="px-4 py-3 border-b border-white/8 flex items-center gap-3">' +
    '<i class="fas fa-search text-white/30 text-sm"></i>' +
    '<input type="text" id="cmdInput" class="flex-1 bg-transparent text-sm text-white outline-none placeholder-white/30" placeholder="Type a command..." oninput="filterCommands()" autofocus />' +
    '<kbd class="px-2 py-0.5 rounded bg-white/8 border border-white/10 text-[9px] text-white/30 font-mono">ESC</kbd>' +
    '</div>' +
    '<div id="cmdResults" class="max-h-[320px] overflow-y-auto scrollbar-thin py-1">' +
    allCommands.map(function(c,i) {
      return '<div class="cmd-item flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-white/5 transition' + (i===0?' cmd-active bg-white/5':'') + '" data-label="' + c.label.toLowerCase() + '" data-desc="' + c.desc.toLowerCase() + '" onclick="eval(decodeAttr(this));closeModal()" data-action="' + c.action + '">' +
        '<div class="w-8 h-8 rounded-lg bg-white/6 flex items-center justify-center shrink-0"><i class="fas ' + c.icon + ' text-xs text-white/50"></i></div>' +
        '<div class="flex-1 min-w-0"><p class="text-xs font-medium text-white/85">' + c.label + '</p><p class="text-[10px] text-white/35">' + c.desc + '</p></div>' +
        '<i class="fas fa-arrow-right text-[9px] text-white/15"></i></div>';
    }).join('') +
    '</div>' +
    '<div class="px-4 py-2 border-t border-white/6 flex items-center justify-between">' +
    '<div class="flex items-center gap-3 text-[9px] text-white/25">' +
    '<span><kbd class="px-1 py-0.5 rounded bg-white/8 border border-white/10 font-mono mr-1">\u2191\u2193</kbd>Navigate</span>' +
    '<span><kbd class="px-1 py-0.5 rounded bg-white/8 border border-white/10 font-mono mr-1">\u21B5</kbd>Select</span>' +
    '</div>' +
    '<span class="text-[9px] text-white/20">BioR Command Palette</span>' +
    '</div></div></div>';

  const input = document.getElementById('cmdInput');
  if(input) {
    input.focus();
    input.addEventListener('keydown', function(e) {
      const items = document.querySelectorAll('.cmd-item:not([style*=\"display: none\"])');
      const active = document.querySelector('.cmd-active');
      let idx = Array.from(items).indexOf(active);
      if(e.key==='ArrowDown') { e.preventDefault(); idx = Math.min(idx+1, items.length-1); }
      else if(e.key==='ArrowUp') { e.preventDefault(); idx = Math.max(idx-1, 0); }
      else if(e.key==='Enter') { e.preventDefault(); if(active) active.click(); return; }
      else return;
      items.forEach(function(it) { it.classList.remove('cmd-active','bg-white/5'); });
      if(items[idx]) { items[idx].classList.add('cmd-active','bg-white/5'); items[idx].scrollIntoView({block:'nearest'}); }
    });
  }
}

window.filterCommands = function() {
  const q = (document.getElementById('cmdInput')?.value||'').toLowerCase();
  let first = true;
  document.querySelectorAll('.cmd-item').forEach(function(item) {
    const match = !q || item.dataset.label.includes(q) || item.dataset.desc.includes(q);
    item.style.display = match ? '' : 'none';
    item.classList.remove('cmd-active','bg-white/5');
    if(match && first) { item.classList.add('cmd-active','bg-white/5'); first = false; }
  });
};

window.decodeAttr = function(el) { return el.dataset.action; };

function showShortcutHelp() {
  showModal(
    '<div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold text-white"><i class="fas fa-keyboard mr-2 text-[#00A86B]"></i>Keyboard Shortcuts</h3><button onclick="closeModal()" class="text-white/40 hover:text-white"><i class="fas fa-times"></i></button></div>' +
    '<div class="space-y-3">' +
    '<div class="text-[10px] text-white/40 uppercase font-semibold mb-1">Navigation (press g then key)</div>' +
    [['g d','Dashboard'],['g s','Surveillance'],['g t','Threat Intel'],['g n','Genomics'],['g e','Early Warning'],['g a','Alerts'],['g y','Analytics'],['g r','Reports'],['g m','Admin']].map(function(s) {
      return '<div class="flex items-center justify-between p-2 rounded-lg bg-white/5">' +
        '<span class="text-xs text-white/70">' + s[1] + '</span>' +
        '<div class="flex gap-1">' + s[0].split(' ').map(function(k) { return '<kbd class="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-white/60 font-mono">' + k + '</kbd>'; }).join('<span class="text-white/20 text-[10px] mx-0.5">then</span>') + '</div></div>';
    }).join('') +
    '<div class="text-[10px] text-white/40 uppercase font-semibold mt-3 mb-1">General</div>' +
    '<div class="flex items-center justify-between p-2 rounded-lg bg-white/5"><span class="text-xs text-white/70">Focus Search</span><kbd class="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-white/60 font-mono">/</kbd></div>' +
    '<div class="flex items-center justify-between p-2 rounded-lg bg-white/5"><span class="text-xs text-white/70">Refresh Page</span><kbd class="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-white/60 font-mono">r</kbd></div>' +
    '<div class="flex items-center justify-between p-2 rounded-lg bg-white/5"><span class="text-xs text-white/70">Toggle Theme</span><div class="flex gap-1"><kbd class="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-white/60 font-mono">Shift</kbd><span class="text-white/20 text-[10px]">+</span><kbd class="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-white/60 font-mono">T</kbd></div></div>' +
    '<div class="flex items-center justify-between p-2 rounded-lg bg-white/5"><span class="text-xs text-white/70">Command Palette</span><div class="flex gap-1"><kbd class="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-white/60 font-mono">Ctrl</kbd><span class="text-white/20 text-[10px]">+</span><kbd class="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-white/60 font-mono">K</kbd></div></div>' +
    '<div class="flex items-center justify-between p-2 rounded-lg bg-white/5"><span class="text-xs text-white/70">Close Modal</span><kbd class="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-white/60 font-mono">Esc</kbd></div>' +
    '<div class="flex items-center justify-between p-2 rounded-lg bg-white/5"><span class="text-xs text-white/70">Show This Help</span><kbd class="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-white/60 font-mono">?</kbd></div>' +
    '</div>'
  );
}

  `;
}
