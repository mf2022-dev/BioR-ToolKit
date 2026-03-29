// =============================================================================
// BioR Platform - Core State, Helpers, API, SPA History, Theme
// =============================================================================

export function getCoreJS(): string {
  return `
// ========== BioR Platform v5.1 - Complete Frontend ==========
const API = '';
const charts = {};

// ===== STATE =====
const state = {
  currentView: 'hub', // 'hub' or 'workspace'
  currentPage: 'login', isAuthenticated: false, user: null, token: null,
  currentProject: null, // which project is open in workspace
  currentDataset: null, // which dataset is open in explorer
  datasetCache: null, // cached dataset list for hub
  projects: [], // user-created projects
  data: {}, sidebarCollapsed: false, refreshTimer: null, autoRefresh: null, autoRefreshInterval: 0,
  notifPollTimer: null, lastNotifCount: -1, notifPollInterval: 30000,
  sseSource: null, sseConnected: false, sseRetryCount: 0, sseMaxRetry: 5
};

// GeoIntel map globals (declared early so render() and navigateToHub() can reference them)
var giMap = null;
var giMapReady = false;
var _giMapInitializing = false;
var GI_NL = String.fromCharCode(10); // newline character for template literals in built worker

// Load saved projects from localStorage
try { state.projects = JSON.parse(localStorage.getItem('bior_projects') || '[]'); } catch(e) { state.projects = []; }

// Default projects (always present)
const defaultProjects = [
  { id: 'dashboard', name: 'Dashboard', description: 'National Biosurveillance Platform — real-time monitoring, threat intelligence, genomic tracking, and early warning across 13 regions.', icon: 'fa-tachometer-alt', color: '#00A86B', modules: 8, status: 'Active', type: 'system' },
  { id: 'sampletrack', name: 'SampleTrack', description: 'Global LIMS Benchmark — 62 systems evaluated across 5 domains (D1–D5), 22 standards, specimen management, gap analysis, and CSV/JSON export. Cloudflare D1 database with 48 tables.', icon: 'fa-vials', color: '#3b82f6', modules: 10, status: 'Active', type: 'external', url: 'https://sampletrack.bior.tech' },
  { id: 'project-1', name: 'Project 1', description: 'Empty workspace ready for configuration. Set up a new biosurveillance module or research project.', icon: 'fa-flask', color: '#8b5cf6', modules: 0, status: 'Not Started', type: 'user' },
  { id: 'project-2', name: 'Project 2', description: 'Empty workspace ready for configuration. Set up a new biosurveillance module or research project.', icon: 'fa-microscope', color: '#f59e0b', modules: 0, status: 'Not Started', type: 'user' },
  { id: 'project-3', name: 'Project 3', description: 'Empty workspace ready for configuration. Set up a new biosurveillance module or research project.', icon: 'fa-vials', color: '#ef4444', modules: 0, status: 'Not Started', type: 'user' },
];

function getAllProjects() {
  return [...defaultProjects, ...state.projects];
}

function saveProjects() {
  localStorage.setItem('bior_projects', JSON.stringify(state.projects));
}

const saved = localStorage.getItem('bior_auth');
if (saved) { try { const s = JSON.parse(saved); if(s.expiresAt && new Date(s.expiresAt) < new Date()) { localStorage.removeItem('bior_auth'); } else { state.isAuthenticated = true; state.user = s.user; state.token = s.token; state.tokenExpiresAt = s.expiresAt; state.currentPage = 'dashboard'; state.currentView = 'hub'; } } catch(e) {} }

// Restore view from URL hash on page refresh (e.g. #/geointel-map, #/benchmark, #/geointel)
if (state.isAuthenticated && window.location.hash) {
  var hashView = window.location.hash.replace('#/', '').split('/')[0];
  var validViews = ['hub', 'geointel', 'geointel-map', 'benchmark', 'rskb', 'workspace', 'project', 'dataset-compare'];
  if (hashView && validViews.indexOf(hashView) !== -1) {
    state.currentView = hashView;
    var hashPage = window.location.hash.replace('#/', '').split('/')[1];
    if (hashPage) state.currentPage = hashPage;
  }
}

// Restore sidebar state
const sidebarState = localStorage.getItem('bior_sidebar');
if (sidebarState === 'collapsed') state.sidebarCollapsed = true;

// ===== HELPERS =====
let apiInFlight = 0;
function startLoadBar() { apiInFlight++; const b = document.getElementById('loadBar'); if(b) { b.style.opacity='1'; b.style.width='30%'; setTimeout(()=>{if(apiInFlight>0&&b)b.style.width='60%';},200); setTimeout(()=>{if(apiInFlight>0&&b)b.style.width='85%';},600); } }
function stopLoadBar() { apiInFlight = Math.max(0,apiInFlight-1); if(apiInFlight===0) { const b = document.getElementById('loadBar'); if(b) { b.style.width='100%'; setTimeout(()=>{b.style.opacity='0';setTimeout(()=>{b.style.width='0%';},300);},200); } } }
async function api(path, opts = {}) {
  const h = { 'Content-Type': 'application/json' };
  if (state.token) h['Authorization'] = 'Bearer ' + state.token;
  startLoadBar();
  try {
    const r = await fetch(API + path, { ...opts, headers: h });
    if (r.status === 401 && state.isAuthenticated && !path.includes('/auth/login')) {
      stopLoadBar();
      const j = await r.json().catch(() => ({}));
      const msg = j.code === 'TOKEN_REVOKED' ? 'Session revoked. Please sign in again.' : 'Session expired. Please sign in again.';
      showToast(msg, 'error');
      logout();
      return { error: msg };
    }
    if (r.status === 429) {
      const j = await r.json();
      stopLoadBar();
      showToast(j.error || 'Rate limited. Please slow down.', 'error');
      return j;
    }
    const j = await r.json();
    stopLoadBar();
    // Handle forced re-auth (e.g., password change revokes all sessions)
    if (j.requireReAuth) {
      showToast(j.message || 'Please sign in again.', 'info');
      setTimeout(() => logout(), 1500);
    }
    return j;
  } catch(e) { stopLoadBar(); return { error: e.message }; }
}

function navigate(page) { state.currentPage = page; pushSpaState(); render(); }
function navigateToHub() { if (giMap) { try { giMap.remove(); } catch(e) {} giMap = null; giMapReady = false; _giMapInitializing = false; } state.currentView = 'hub'; state.currentProject = null; if(state.refreshTimer) clearInterval(state.refreshTimer); if(state.autoRefresh) { clearInterval(state.autoRefresh); state.autoRefresh = null; } pushSpaState(); render(); }
function enterProject(projectId) {
  // Handle external URL projects (open in new tab)
  const proj = getAllProjects().find(function(p) { return p.id === projectId; });
  if (proj && proj.url) {
    window.open(proj.url, '_blank');
    return;
  }
  state.currentProject = projectId;
  if (projectId === 'dashboard') {
    state.currentView = 'workspace';
    state.currentPage = 'dashboard';
  } else {
    state.currentView = 'project';
  }
  pushSpaState();
  render();
}
function logout() {
  // Notify server to blacklist the token (fire-and-forget)
  if (state.token) {
    fetch(API + '/api/auth/logout', { method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+state.token} }).catch(()=>{});
  }
  state.isAuthenticated = false; state.user = null; state.token = null; state.currentView = 'hub'; state.currentProject = null; localStorage.removeItem('bior_auth'); if(state.refreshTimer) clearInterval(state.refreshTimer); if(state.autoRefresh) { clearInterval(state.autoRefresh); state.autoRefresh = null; } if(typeof stopSSE === 'function') stopSSE(); if(typeof stopNotifPolling === 'function') stopNotifPolling(); state.currentPage = 'login'; _spaHistoryDepth = 0; replaceSpaState(); render();
}

// ===== SPA HISTORY MANAGEMENT =====
var _spaHistoryDepth = 0;
function pushSpaState() {
  var s = { view: state.currentView, page: state.currentPage, project: state.currentProject, dataset: state.currentDataset, _spa: true };
  // Don't append page to hash for standalone views (prevents #/geointel-map/dashboard)
  var standaloneViews = ['geointel', 'geointel-map', 'benchmark', 'rskb', 'hub'];
  var hash = '#/' + state.currentView + (standaloneViews.indexOf(state.currentView) === -1 && state.currentPage ? '/' + state.currentPage : '');
  history.pushState(s, '', hash);
  _spaHistoryDepth++;
}
function replaceSpaState() {
  var s = { view: state.currentView, page: state.currentPage, project: state.currentProject, dataset: state.currentDataset, _spa: true };
  var standaloneViews = ['geointel', 'geointel-map', 'benchmark', 'rskb', 'hub'];
  var hash = '#/' + state.currentView + (standaloneViews.indexOf(state.currentView) === -1 && state.currentPage ? '/' + state.currentPage : '');
  history.replaceState(s, '', hash);
}
window.onpopstate = function(e) {
  if (e.state && e.state._spa) {
    _spaHistoryDepth = Math.max(0, _spaHistoryDepth - 1);
    state.currentView = e.state.view || 'hub';
    state.currentPage = e.state.page || 'dashboard';
    state.currentProject = e.state.project || null;
    state.currentDataset = e.state.dataset || null;
    render();
  } else {
    // Prevent browser from leaving the SPA — push state back
    if (state.isAuthenticated) {
      history.pushState({ view: state.currentView, page: state.currentPage, project: state.currentProject, _spa: true }, '', '#/' + state.currentView);
    } else {
      history.pushState({ view: 'hub', page: 'login', _spa: true }, '', '#/hub/login');
    }
  }
};

function showToast(msg, type='info') {
  const c = document.getElementById('toasts');
  const colors = { info:'bg-blue-500/90', success:'toast-success', warning:'bg-amber-500/90', error:'bg-red-500/90' };
  const icons = { info:'fa-info-circle', success:'fa-check-circle', warning:'fa-exclamation-triangle', error:'fa-times-circle' };
  const t = document.createElement('div');
  t.className = 'toast ' + (colors[type]||colors.info);
  t.innerHTML = '<i class="fas ' + (icons[type]||icons.info) + ' mr-2"></i>' + msg;
  c.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; t.style.transition='opacity 0.3s'; setTimeout(()=>t.remove(),300); }, 4000);
}

function showModal(html) { document.getElementById('modal').innerHTML = '<div class="modal-overlay" onclick="if(event.target===this)closeModal()"><div class="modal-content p-6 fade-in">' + html + '</div></div>'; }
function closeModal() { document.getElementById('modal').innerHTML = ''; }
window.closeModal = closeModal;

function destroyCharts() { Object.keys(charts).forEach(k => { if(charts[k]) { charts[k].destroy(); delete charts[k]; } }); }

function makeChart(id, config) {
  setTimeout(() => {
    const el = document.getElementById(id);
    if (!el) return;
    if (charts[id]) charts[id].destroy();
    // Apply theme-aware defaults
    var lt = isLightTheme();
    if (lt && config.options) {
      var o = config.options;
      if (o.plugins && o.plugins.legend && o.plugins.legend.labels && typeof o.plugins.legend.labels.color === 'string' && o.plugins.legend.labels.color.indexOf('255,255,255') > -1) {
        o.plugins.legend.labels.color = 'rgba(26,26,46,0.5)';
      }
      if (o.plugins && o.plugins.tooltip) {
        o.plugins.tooltip.backgroundColor = 'rgba(255,255,255,0.95)';
        o.plugins.tooltip.titleColor = '#1a1a2e';
        o.plugins.tooltip.bodyColor = '#334155';
        o.plugins.tooltip.borderColor = 'rgba(0,0,0,0.1)';
      }
      var fixScale = function(s) { if (!s) return; if (s.ticks && s.ticks.color && s.ticks.color.indexOf && s.ticks.color.indexOf('255,255,255') > -1) s.ticks.color = 'rgba(26,26,46,0.35)'; if (s.grid && s.grid.color && s.grid.color.indexOf && s.grid.color.indexOf('255,255,255') > -1) s.grid.color = 'rgba(0,0,0,0.06)'; };
      if (o.scales) { fixScale(o.scales.x); fixScale(o.scales.y); fixScale(o.scales.y1); }
    }
    charts[id] = new Chart(el, config);
  }, 50);
}

function svgSparkline(data, color='#00A86B', w=100, h=32) {
  if(!data||!data.length) return '';
  const max = Math.max(...data), min = Math.min(...data), range = max-min||1;
  const pts = data.map((v,i) => ((i/(data.length-1))*w).toFixed(1)+','+((1-(v-min)/range)*h).toFixed(1)).join(' ');
  const areaPts = pts + ' ' + w + ',' + (h+2) + ' 0,' + (h+2);
  const uid = 'sp' + Math.random().toString(36).substring(7);
  return '<svg class="sparkline" width="'+w+'" height="'+(h+4)+'" viewBox="0 0 '+w+' '+(h+4)+'">' +
    '<defs><linearGradient id="'+uid+'" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="'+color+'" stop-opacity="0.2"/><stop offset="100%" stop-color="'+color+'" stop-opacity="0.02"/></linearGradient></defs>' +
    '<polygon points="'+areaPts+'" fill="url(#'+uid+')"/>' +
    '<polyline points="'+pts+'" fill="none" stroke="'+color+'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="'+((data.length-1)/(data.length-1)*w).toFixed(1)+'" cy="'+((1-(data[data.length-1]-min)/range)*h).toFixed(1)+'" r="2.5" fill="'+color+'"/>' +
    '</svg>';
}

function formatNum(n) { return typeof n==='number'? n.toLocaleString() : n; }

// ===== ANIMATED COUNTER =====
function animateCounters() {
  document.querySelectorAll('.counter-val').forEach(el => {
    const target = parseInt(el.dataset.target);
    if (isNaN(target)) return;
    let current = 0;
    const increment = Math.max(1, Math.ceil(target / 50));
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current.toLocaleString();
    }, 20);
  });
}

function isLightTheme() { return document.documentElement.getAttribute('data-theme') === 'light'; }
function getChartDefaults() {
  var lt = isLightTheme();
  var textColor = lt ? 'rgba(26,26,46,0.5)' : 'rgba(255,255,255,0.5)';
  var tickColor = lt ? 'rgba(26,26,46,0.35)' : 'rgba(255,255,255,0.35)';
  var gridColor = lt ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)';
  return { responsive:true, maintainAspectRatio:false, plugins:{legend:{labels:{color:textColor,font:{size:10,family:'Inter'},boxWidth:12}},tooltip:{backgroundColor:lt?'rgba(255,255,255,0.95)':'rgba(0,98,65,0.95)',titleColor:lt?'#1a1a2e':'#fff',bodyColor:lt?'#334155':'#d1fae5',borderColor:lt?'rgba(0,0,0,0.1)':'rgba(0,168,107,0.3)',borderWidth:1,cornerRadius:10,padding:12,titleFont:{family:'Inter',weight:'600'},bodyFont:{family:'Inter'}}}, scales:{x:{ticks:{color:tickColor,font:{size:9,family:'Inter'}},grid:{color:gridColor}},y:{ticks:{color:tickColor,font:{size:9,family:'Inter'}},grid:{color:gridColor}}} };
}
const chartDefaults = { responsive:true, maintainAspectRatio:false, plugins:{legend:{labels:{color:'rgba(255,255,255,0.5)',font:{size:10,family:'Inter'},boxWidth:12}},tooltip:{backgroundColor:'rgba(0,98,65,0.95)',titleColor:'#fff',bodyColor:'#d1fae5',borderColor:'rgba(0,168,107,0.3)',borderWidth:1,cornerRadius:10,padding:12,titleFont:{family:'Inter',weight:'600'},bodyFont:{family:'Inter'}}}, scales:{x:{ticks:{color:'rgba(255,255,255,0.35)',font:{size:9,family:'Inter'}},grid:{color:'rgba(255,255,255,0.04)'}},y:{ticks:{color:'rgba(255,255,255,0.35)',font:{size:9,family:'Inter'}},grid:{color:'rgba(255,255,255,0.04)'}}} };

  `;
}
