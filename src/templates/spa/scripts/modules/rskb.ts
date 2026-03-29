// =============================================================================
// BioR Platform - RSKB: Regulatory & Standards Knowledge Base
// =============================================================================

export function getRSKBJS(): string {
  return `
// ===== RSKB MODULE =====

var _rskbData = { stats: null, domains: [], instruments: [], agents: [], capacities: [], currentDomain: null, currentInstrument: null, view: 'overview', filters: {} };

function renderRSKBView() {
  return '<div id="rskbApp" class="min-h-screen bg-gray-50">' +
    '<div class="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white px-6 py-4">' +
      '<div class="max-w-7xl mx-auto flex items-center justify-between">' +
        '<div class="flex items-center gap-4">' +
          '<button onclick="navigateToHub()" class="text-white/70 hover:text-white transition"><i class="fas fa-arrow-left mr-2"></i>Hub</button>' +
          '<div class="w-px h-8 bg-white/20"></div>' +
          '<div><h1 class="text-xl font-bold flex items-center gap-2"><i class="fas fa-balance-scale"></i> Regulatory & Standards Knowledge Base</h1>' +
          '<p class="text-indigo-200 text-sm">Comprehensive biosurveillance regulatory foundation</p></div>' +
        '</div>' +
        '<div class="flex items-center gap-3">' +
          '<div class="relative"><input id="rskbSearch" type="text" placeholder="Search instruments, agents, bodies..." class="bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-lg px-4 py-2 w-72 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" onkeyup="if(event.key===&apos;Enter&apos;)rskbSearchGlobal(this.value)"><i class="fas fa-search absolute right-3 top-2.5 text-white/40"></i></div>' +
          '<div class="flex bg-white/10 rounded-lg p-0.5">' +
            '<button onclick="rskbSetView(&apos;overview&apos;)" class="rskb-tab px-3 py-1.5 rounded-md text-sm" data-view="overview"><i class="fas fa-th-large mr-1"></i>Overview</button>' +
            '<button onclick="rskbSetView(&apos;instruments&apos;)" class="rskb-tab px-3 py-1.5 rounded-md text-sm" data-view="instruments"><i class="fas fa-scroll mr-1"></i>Instruments</button>' +
            '<button onclick="rskbSetView(&apos;agents&apos;)" class="rskb-tab px-3 py-1.5 rounded-md text-sm" data-view="agents"><i class="fas fa-biohazard mr-1"></i>Agents</button>' +
            '<button onclick="rskbSetView(&apos;capacities&apos;)" class="rskb-tab px-3 py-1.5 rounded-md text-sm" data-view="capacities"><i class="fas fa-chart-bar mr-1"></i>Capacities</button>' +
            '<button onclick="rskbSetView(&apos;matrix&apos;)" class="rskb-tab px-3 py-1.5 rounded-md text-sm" data-view="matrix"><i class="fas fa-table mr-1"></i>Matrix</button>' +
            '<button onclick="rskbSetView(&apos;bodies&apos;)" class="rskb-tab px-3 py-1.5 rounded-md text-sm" data-view="bodies"><i class="fas fa-building mr-1"></i>Bodies</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div id="rskbContent" class="max-w-7xl mx-auto px-6 py-6"><div class="flex items-center justify-center py-20"><i class="fas fa-spinner fa-spin text-4xl text-indigo-400"></i></div></div>' +
  '</div>';
}

function initRSKBView() {
  rskbSetView('overview');
  rskbLoadStats();
}

async function rskbLoadStats() {
  try {
    var res = await fetch('/api/rskb/stats', { headers: { 'Authorization': 'Bearer ' + state.token } });
    _rskbData.stats = await res.json();
  } catch(e) { console.error('RSKB stats error:', e); }
}

function rskbSetView(view) {
  _rskbData.view = view;
  // Update tab styles
  document.querySelectorAll('.rskb-tab').forEach(function(t) {
    t.className = t.getAttribute('data-view') === view
      ? 'rskb-tab px-3 py-1.5 rounded-md text-sm bg-white/20 text-white font-medium'
      : 'rskb-tab px-3 py-1.5 rounded-md text-sm text-white/70 hover:text-white hover:bg-white/10 transition';
  });
  var content = document.getElementById('rskbContent');
  if (!content) return;
  content.innerHTML = '<div class="flex items-center justify-center py-20"><i class="fas fa-spinner fa-spin text-4xl text-indigo-400"></i></div>';
  if (view === 'overview') rskbRenderOverview();
  else if (view === 'instruments') rskbRenderInstruments();
  else if (view === 'agents') rskbRenderAgents();
  else if (view === 'capacities') rskbRenderCapacities();
  else if (view === 'matrix') rskbRenderMatrix();
  else if (view === 'bodies') rskbRenderBodies();
  else if (view === 'detail') rskbRenderDetail();
}

async function rskbRenderOverview() {
  var content = document.getElementById('rskbContent');
  try {
    var [statsRes, domainsRes] = await Promise.all([
      fetch('/api/rskb/stats', { headers: { 'Authorization': 'Bearer ' + state.token } }),
      fetch('/api/rskb/domains', { headers: { 'Authorization': 'Bearer ' + state.token } })
    ]);
    var stats = await statsRes.json();
    var domains = await domainsRes.json();
    _rskbData.stats = stats;
    _rskbData.domains = domains;

    var t = stats.totals;
    var html = '<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">';
    var statCards = [
      { label: 'Instruments', value: t.instruments, icon: 'fa-scroll', color: 'indigo' },
      { label: 'Domains', value: t.domains, icon: 'fa-layer-group', color: 'blue' },
      { label: 'Issuing Bodies', value: t.bodies, icon: 'fa-building', color: 'green' },
      { label: 'Reg. Agents', value: t.agents, icon: 'fa-biohazard', color: 'red' },
      { label: 'Capacity Areas', value: t.capacities, icon: 'fa-chart-bar', color: 'purple' },
      { label: 'Cross-References', value: t.crossReferences, icon: 'fa-link', color: 'orange' }
    ];
    statCards.forEach(function(s) {
      html += '<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition">' +
        '<div class="flex items-center gap-3"><div class="w-10 h-10 bg-' + s.color + '-100 rounded-lg flex items-center justify-center"><i class="fas ' + s.icon + ' text-' + s.color + '-600"></i></div>' +
        '<div><div class="text-2xl font-bold text-gray-800">' + s.value + '</div><div class="text-xs text-gray-500">' + s.label + '</div></div></div></div>';
    });
    html += '</div>';

    // Sector coverage chart
    if (stats.bySector) {
      var sectors = [
        { key: 'biosecurity', label: 'Biosecurity', icon: 'fa-shield-alt', color: '#DC2626' },
        { key: 'biosafety', label: 'Biosafety', icon: 'fa-flask', color: '#2563EB' },
        { key: 'biosurveillance', label: 'Biosurveillance', icon: 'fa-satellite-dish', color: '#059669' },
        { key: 'biodefense', label: 'Biodefense', icon: 'fa-shield-virus', color: '#7C3AED' },
        { key: 'public_health', label: 'Public Health', icon: 'fa-hospital', color: '#D97706' },
        { key: 'laboratory', label: 'Laboratory', icon: 'fa-microscope', color: '#0891B2' },
        { key: 'amr', label: 'AMR', icon: 'fa-pills', color: '#BE185D' },
        { key: 'animal_health', label: 'Animal Health', icon: 'fa-paw', color: '#65A30D' },
        { key: 'food_safety', label: 'Food Safety', icon: 'fa-utensils', color: '#EA580C' },
        { key: 'environmental', label: 'Environmental', icon: 'fa-leaf', color: '#0D9488' }
      ];
      html += '<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">' +
        '<h3 class="text-lg font-semibold text-gray-800 mb-4"><i class="fas fa-chart-pie mr-2 text-indigo-500"></i>Sector Coverage</h3>' +
        '<div class="grid grid-cols-2 md:grid-cols-5 gap-3">';
      sectors.forEach(function(s) {
        var val = stats.bySector[s.key] || 0;
        var pct = t.instruments > 0 ? Math.round(val / t.instruments * 100) : 0;
        html += '<div class="flex items-center gap-2 p-3 rounded-lg bg-gray-50">' +
          '<i class="fas ' + s.icon + '" style="color:' + s.color + '"></i>' +
          '<div class="flex-1"><div class="text-xs text-gray-500">' + s.label + '</div>' +
          '<div class="flex items-center gap-2"><span class="font-semibold text-sm">' + val + '</span>' +
          '<div class="flex-1 bg-gray-200 rounded-full h-1.5"><div class="h-1.5 rounded-full" style="width:' + pct + '%;background:' + s.color + '"></div></div>' +
          '<span class="text-xs text-gray-400">' + pct + '%</span></div></div></div>';
      });
      html += '</div></div>';
    }

    // Domain cards
    html += '<h3 class="text-lg font-semibold text-gray-800 mb-4"><i class="fas fa-layer-group mr-2 text-indigo-500"></i>Knowledge Domains</h3>' +
      '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">';
    domains.forEach(function(d) {
      html += '<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition cursor-pointer group" onclick="rskbFilterByDomain(&apos;' + d.id + '&apos;)">' +
        '<div class="flex items-center gap-3 mb-3"><div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background:' + (d.color || '#6366F1') + '20"><i class="fas ' + (d.icon || 'fa-file') + '" style="color:' + (d.color || '#6366F1') + '"></i></div>' +
        '<div class="flex-1"><h4 class="font-semibold text-gray-800 text-sm group-hover:text-indigo-600 transition">' + d.name + '</h4></div>' +
        '<span class="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">' + d.instrument_count + '</span></div>' +
        '<p class="text-xs text-gray-500 line-clamp-2">' + (d.description || '') + '</p></div>';
    });
    html += '</div>';

    // Quick links - scope/binding breakdown
    html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-6">';
    // By scope
    html += '<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6"><h3 class="text-sm font-semibold text-gray-800 mb-3"><i class="fas fa-globe mr-2 text-blue-500"></i>By Scope</h3><div class="space-y-2">';
    var scopeIcons = { international: 'fa-globe', regional: 'fa-map', national: 'fa-flag' };
    var scopeColors = { international: '#2563EB', regional: '#D97706', national: '#7C3AED' };
    (stats.byScope || []).forEach(function(s) {
      html += '<div class="flex items-center justify-between p-2 rounded bg-gray-50"><div class="flex items-center gap-2"><i class="fas ' + (scopeIcons[s.scope] || 'fa-file') + ' text-sm" style="color:' + (scopeColors[s.scope] || '#666') + '"></i><span class="text-sm capitalize">' + s.scope + '</span></div><span class="text-sm font-bold">' + s.cnt + '</span></div>';
    });
    html += '</div></div>';
    // By binding level
    html += '<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6"><h3 class="text-sm font-semibold text-gray-800 mb-3"><i class="fas fa-gavel mr-2 text-red-500"></i>By Binding Level</h3><div class="space-y-2">';
    var bindColors = { mandatory: '#DC2626', voluntary: '#059669', recommended: '#2563EB', aspirational: '#9CA3AF' };
    var bindIcons = { mandatory: 'fa-exclamation-triangle', voluntary: 'fa-handshake', recommended: 'fa-thumbs-up', aspirational: 'fa-star' };
    (stats.byBinding || []).forEach(function(b) {
      html += '<div class="flex items-center justify-between p-2 rounded bg-gray-50"><div class="flex items-center gap-2"><i class="fas ' + (bindIcons[b.binding_level] || 'fa-file') + ' text-sm" style="color:' + (bindColors[b.binding_level] || '#666') + '"></i><span class="text-sm capitalize">' + b.binding_level + '</span></div><span class="text-sm font-bold">' + b.cnt + '</span></div>';
    });
    html += '</div></div>';
    html += '</div>';

    content.innerHTML = html;
  } catch(e) { content.innerHTML = '<div class="text-center py-20 text-red-500"><i class="fas fa-exclamation-triangle text-4xl mb-4"></i><p>Error loading RSKB data</p></div>'; }
}

function rskbFilterByDomain(domainId) {
  _rskbData.filters.domain_id = domainId;
  rskbSetView('instruments');
}

async function rskbRenderInstruments() {
  var content = document.getElementById('rskbContent');
  try {
    var params = new URLSearchParams();
    if (_rskbData.filters.domain_id) params.set('domain_id', _rskbData.filters.domain_id);
    if (_rskbData.filters.scope) params.set('scope', _rskbData.filters.scope);
    if (_rskbData.filters.sector) params.set('sector', _rskbData.filters.sector);
    if (_rskbData.filters.binding) params.set('binding', _rskbData.filters.binding);
    if (_rskbData.filters.search) params.set('search', _rskbData.filters.search);
    params.set('limit', '50');

    var res = await fetch('/api/rskb/instruments?' + params.toString(), { headers: { 'Authorization': 'Bearer ' + state.token } });
    var data = await res.json();

    // Filter bar
    var html = '<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">' +
      '<div class="flex flex-wrap items-center gap-3">' +
        '<select id="rskbScopeFilter" class="border rounded-lg px-3 py-1.5 text-sm" onchange="rskbApplyFilter(&apos;scope&apos;,this.value)">' +
          '<option value="">All Scopes</option><option value="international">International</option><option value="regional">Regional</option><option value="national">National</option></select>' +
        '<select id="rskbSectorFilter" class="border rounded-lg px-3 py-1.5 text-sm" onchange="rskbApplyFilter(&apos;sector&apos;,this.value)">' +
          '<option value="">All Sectors</option><option value="biosecurity">Biosecurity</option><option value="biosafety">Biosafety</option><option value="biosurveillance">Biosurveillance</option><option value="biodefense">Biodefense</option><option value="public_health">Public Health</option><option value="laboratory">Laboratory</option><option value="amr">AMR</option></select>' +
        '<select id="rskbBindingFilter" class="border rounded-lg px-3 py-1.5 text-sm" onchange="rskbApplyFilter(&apos;binding&apos;,this.value)">' +
          '<option value="">All Binding</option><option value="mandatory">Mandatory</option><option value="voluntary">Voluntary</option><option value="recommended">Recommended</option></select>' +
        '<button onclick="_rskbData.filters={};rskbRenderInstruments()" class="text-sm text-indigo-600 hover:underline"><i class="fas fa-times mr-1"></i>Clear</button>' +
        '<span class="ml-auto text-sm text-gray-500">' + data.total + ' instruments</span>' +
      '</div></div>';

    // Instruments table
    html += '<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"><table class="w-full"><thead class="bg-gray-50"><tr>' +
      '<th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Code</th>' +
      '<th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Title</th>' +
      '<th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Domain</th>' +
      '<th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Scope</th>' +
      '<th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Binding</th>' +
      '<th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">SA Status</th>' +
      '<th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Sectors</th>' +
    '</tr></thead><tbody>';

    (data.instruments || []).forEach(function(inst) {
      var scopeBg = inst.scope === 'international' ? 'bg-blue-100 text-blue-700' : inst.scope === 'regional' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700';
      var bindBg = inst.binding_level === 'mandatory' ? 'bg-red-100 text-red-700' : inst.binding_level === 'voluntary' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700';
      var saStatusBg = inst.sa_status === 'adopted' ? 'bg-green-100 text-green-700' : inst.sa_status === 'partially_adopted' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600';

      var sectors = [];
      if (inst.sector_biosecurity) sectors.push('<i class="fas fa-shield-alt text-red-500" title="Biosecurity"></i>');
      if (inst.sector_biosafety) sectors.push('<i class="fas fa-flask text-blue-500" title="Biosafety"></i>');
      if (inst.sector_biosurveillance) sectors.push('<i class="fas fa-satellite-dish text-green-500" title="Biosurveillance"></i>');
      if (inst.sector_biodefense) sectors.push('<i class="fas fa-shield-virus text-purple-500" title="Biodefense"></i>');
      if (inst.sector_public_health) sectors.push('<i class="fas fa-hospital text-amber-500" title="Public Health"></i>');
      if (inst.sector_laboratory) sectors.push('<i class="fas fa-microscope text-cyan-500" title="Laboratory"></i>');
      if (inst.sector_amr) sectors.push('<i class="fas fa-pills text-pink-500" title="AMR"></i>');

      html += '<tr class="border-t border-gray-100 hover:bg-indigo-50/50 cursor-pointer transition" onclick="rskbShowDetail(&apos;' + inst.id + '&apos;)">' +
        '<td class="px-4 py-3"><span class="font-mono text-sm font-bold text-indigo-600">' + inst.code + '</span></td>' +
        '<td class="px-4 py-3"><div class="text-sm font-medium text-gray-800">' + (inst.short_title || inst.title) + '</div><div class="text-xs text-gray-400 mt-0.5">' + (inst.purpose || '').substring(0,80) + '</div></td>' +
        '<td class="px-4 py-3"><span class="text-xs px-2 py-0.5 rounded-full" style="background:' + (inst.domain_color || '#6366F1') + '15;color:' + (inst.domain_color || '#6366F1') + '">' + (inst.domain_name || '').split(' ')[0] + '</span></td>' +
        '<td class="px-4 py-3"><span class="text-xs px-2 py-0.5 rounded-full ' + scopeBg + ' capitalize">' + inst.scope + '</span></td>' +
        '<td class="px-4 py-3"><span class="text-xs px-2 py-0.5 rounded-full ' + bindBg + ' capitalize">' + (inst.binding_level || '-') + '</span></td>' +
        '<td class="px-4 py-3"><span class="text-xs px-2 py-0.5 rounded-full ' + saStatusBg + ' capitalize">' + (inst.sa_status || '-').replace('_',' ') + '</span></td>' +
        '<td class="px-4 py-3"><div class="flex gap-1">' + sectors.join('') + '</div></td>' +
      '</tr>';
    });
    html += '</tbody></table></div>';
    content.innerHTML = html;

    // Set filter values
    if (_rskbData.filters.scope) { var el = document.getElementById('rskbScopeFilter'); if(el) el.value = _rskbData.filters.scope; }
    if (_rskbData.filters.sector) { var el2 = document.getElementById('rskbSectorFilter'); if(el2) el2.value = _rskbData.filters.sector; }
    if (_rskbData.filters.binding) { var el3 = document.getElementById('rskbBindingFilter'); if(el3) el3.value = _rskbData.filters.binding; }
  } catch(e) { content.innerHTML = '<div class="text-center py-20 text-red-500">Error loading instruments</div>'; }
}

function rskbApplyFilter(key, val) { _rskbData.filters[key] = val || ''; rskbRenderInstruments(); }

async function rskbShowDetail(id) {
  _rskbData.currentInstrument = id;
  var content = document.getElementById('rskbContent');
  content.innerHTML = '<div class="flex items-center justify-center py-20"><i class="fas fa-spinner fa-spin text-4xl text-indigo-400"></i></div>';
  try {
    var res = await fetch('/api/rskb/instruments/' + id, { headers: { 'Authorization': 'Bearer ' + state.token } });
    var inst = await res.json();
    if (inst.error) { content.innerHTML = '<p class="text-red-500 py-10 text-center">' + inst.error + '</p>'; return; }

    var html = '<button onclick="rskbSetView(&apos;instruments&apos;)" class="text-indigo-600 hover:underline text-sm mb-4 inline-block"><i class="fas fa-arrow-left mr-1"></i>Back to list</button>';

    // Header
    html += '<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">' +
      '<div class="flex items-start justify-between mb-4">' +
        '<div><span class="font-mono text-lg font-bold text-indigo-600">' + inst.code + '</span>' +
        '<h2 class="text-xl font-bold text-gray-800 mt-1">' + (inst.short_title || inst.title) + '</h2>' +
        '<p class="text-sm text-gray-500 mt-1">' + inst.title + '</p></div>' +
        '<div class="flex gap-2">' +
          '<span class="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 capitalize">' + inst.instrument_type.replace(/_/g,' ') + '</span>' +
          '<span class="px-3 py-1 rounded-full text-xs font-medium capitalize ' + (inst.scope === 'international' ? 'bg-blue-100 text-blue-700' : inst.scope === 'regional' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700') + '">' + inst.scope + '</span>' +
          '<span class="px-3 py-1 rounded-full text-xs font-medium capitalize ' + (inst.binding_level === 'mandatory' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700') + '">' + inst.binding_level + '</span>' +
        '</div>' +
      '</div>';

    // Metadata grid
    html += '<div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">';
    var meta = [
      { label: 'Issuing Body', value: inst.issuing_body, icon: 'fa-building' },
      { label: 'Adopted', value: inst.adopted_date || '-', icon: 'fa-calendar' },
      { label: 'In Force', value: inst.entry_into_force || '-', icon: 'fa-check-circle' },
      { label: 'Last Amended', value: inst.last_amended || '-', icon: 'fa-edit' },
      { label: 'Status', value: inst.status, icon: 'fa-info-circle' },
      { label: 'SA Status', value: (inst.sa_status || '-').replace(/_/g,' '), icon: 'fa-flag' },
      { label: 'SA Implementing', value: inst.sa_implementing_body || '-', icon: 'fa-university' },
      { label: 'Review Cycle', value: inst.review_cycle || '-', icon: 'fa-sync' }
    ];
    meta.forEach(function(m) {
      html += '<div class="p-3 bg-gray-50 rounded-lg"><div class="text-xs text-gray-400 mb-1"><i class="fas ' + m.icon + ' mr-1"></i>' + m.label + '</div><div class="font-medium text-gray-700 capitalize">' + m.value + '</div></div>';
    });
    html += '</div></div>';

    // Summary & Purpose
    html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">';
    if (inst.purpose) {
      html += '<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6"><h3 class="text-sm font-semibold text-gray-800 mb-3"><i class="fas fa-bullseye mr-2 text-indigo-500"></i>Purpose</h3><p class="text-sm text-gray-600 leading-relaxed">' + inst.purpose + '</p></div>';
    }
    if (inst.sa_relevance) {
      html += '<div class="bg-white rounded-xl shadow-sm border border-green-200 p-6"><h3 class="text-sm font-semibold text-green-800 mb-3"><i class="fas fa-flag mr-2 text-green-500"></i>Saudi Arabia Relevance</h3><p class="text-sm text-gray-600 leading-relaxed">' + inst.sa_relevance + '</p></div>';
    }
    html += '</div>';

    if (inst.summary) {
      html += '<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6"><h3 class="text-sm font-semibold text-gray-800 mb-3"><i class="fas fa-align-left mr-2 text-indigo-500"></i>Summary</h3><p class="text-sm text-gray-600 leading-relaxed">' + inst.summary + '</p></div>';
    }

    // Key provisions
    if (inst.key_provisions) {
      try {
        var provisions = JSON.parse(inst.key_provisions);
        html += '<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6"><h3 class="text-sm font-semibold text-gray-800 mb-3"><i class="fas fa-list-ol mr-2 text-indigo-500"></i>Key Provisions</h3><div class="space-y-2">';
        provisions.forEach(function(p, i) {
          html += '<div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"><span class="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">' + (i+1) + '</span><span class="text-sm text-gray-700">' + p + '</span></div>';
        });
        html += '</div></div>';
      } catch(e) {}
    }

    // Obligations
    if (inst.obligations) {
      try {
        var obls = JSON.parse(inst.obligations);
        html += '<div class="bg-white rounded-xl shadow-sm border border-amber-200 p-6 mb-6"><h3 class="text-sm font-semibold text-amber-800 mb-3"><i class="fas fa-exclamation-triangle mr-2 text-amber-500"></i>Obligations</h3><div class="space-y-2">';
        obls.forEach(function(o) {
          html += '<div class="flex items-start gap-2 text-sm"><i class="fas fa-check-circle text-amber-500 mt-0.5"></i><span class="text-gray-700">' + o + '</span></div>';
        });
        html += '</div></div>';
      } catch(e) {}
    }

    // Cross-references
    var xrefs = inst.crossReferences || {};
    var allXrefs = (xrefs.outgoing || []).concat(xrefs.incoming || []);
    if (allXrefs.length > 0) {
      html += '<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6"><h3 class="text-sm font-semibold text-gray-800 mb-3"><i class="fas fa-link mr-2 text-indigo-500"></i>Cross-References (' + allXrefs.length + ')</h3><div class="space-y-2">';
      (xrefs.outgoing || []).forEach(function(x) {
        html += '<div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-indigo-50 transition" onclick="rskbShowDetail(&apos;' + x.target_id + '&apos;)">' +
          '<i class="fas fa-arrow-right text-indigo-400"></i>' +
          '<span class="text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 capitalize">' + x.relationship_type.replace(/_/g,' ') + '</span>' +
          '<span class="font-mono text-sm font-bold text-indigo-600">' + x.target_code + '</span>' +
          '<span class="text-sm text-gray-600">' + (x.target_title || '') + '</span>' +
          (x.description ? '<span class="text-xs text-gray-400 ml-auto">' + x.description + '</span>' : '') +
        '</div>';
      });
      (xrefs.incoming || []).forEach(function(x) {
        html += '<div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-indigo-50 transition" onclick="rskbShowDetail(&apos;' + x.source_id + '&apos;)">' +
          '<i class="fas fa-arrow-left text-green-400"></i>' +
          '<span class="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700 capitalize">' + x.relationship_type.replace(/_/g,' ') + '</span>' +
          '<span class="font-mono text-sm font-bold text-indigo-600">' + x.source_code + '</span>' +
          '<span class="text-sm text-gray-600">' + (x.source_title || '') + '</span>' +
        '</div>';
      });
      html += '</div></div>';
    }

    // Official URL
    if (inst.official_url) {
      html += '<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6"><a href="' + inst.official_url + '" target="_blank" class="flex items-center gap-2 text-indigo-600 hover:underline text-sm"><i class="fas fa-external-link-alt"></i>Official Document: ' + inst.official_url + '</a></div>';
    }

    // Tags
    if (inst.tags) {
      try {
        var tags = JSON.parse(inst.tags);
        html += '<div class="flex flex-wrap gap-2 mb-6">';
        tags.forEach(function(t) {
          html += '<span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">#' + t + '</span>';
        });
        html += '</div>';
      } catch(e) {}
    }

    content.innerHTML = html;
  } catch(e) { content.innerHTML = '<div class="text-center py-20 text-red-500">Error loading instrument detail</div>'; }
}

async function rskbRenderAgents() {
  var content = document.getElementById('rskbContent');
  try {
    var res = await fetch('/api/rskb/agents', { headers: { 'Authorization': 'Bearer ' + state.token } });
    var agents = await res.json();

    var html = '<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6"><div class="flex items-center gap-3">' +
      '<select class="border rounded-lg px-3 py-1.5 text-sm" onchange="rskbFilterAgents(this.value)">' +
        '<option value="">All Types</option><option value="bacteria">Bacteria</option><option value="virus">Virus</option><option value="toxin">Toxin</option></select>' +
      '<span class="ml-auto text-sm text-gray-500">' + agents.length + ' regulated agents</span>' +
    '</div></div>';

    html += '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';
    agents.forEach(function(a) {
      var typeColor = a.agent_type === 'virus' ? 'red' : a.agent_type === 'bacteria' ? 'blue' : 'purple';
      var riskBg = a.risk_group >= 4 ? 'bg-red-600' : a.risk_group >= 3 ? 'bg-orange-500' : 'bg-yellow-500';
      var diseases = []; try { diseases = JSON.parse(a.diseases || '[]'); } catch(e) {}

      html += '<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition">' +
        '<div class="flex items-start justify-between mb-3">' +
          '<div><h4 class="font-semibold text-gray-800"><i class="fas fa-biohazard text-' + typeColor + '-500 mr-2"></i>' + a.agent_name + '</h4>' +
          '<span class="text-xs text-gray-400 capitalize">' + a.agent_type + '</span></div>' +
          '<div class="flex gap-1">' +
            '<span class="' + riskBg + ' text-white text-xs px-2 py-0.5 rounded-full font-bold">RG ' + a.risk_group + '</span>' +
            '<span class="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full font-bold">BSL-' + a.bsl_required + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="space-y-2 text-xs">';
      if (diseases.length) html += '<div><span class="text-gray-400">Diseases:</span> <span class="text-gray-600">' + diseases.join(', ') + '</span></div>';
      html += '<div class="flex flex-wrap gap-1 mt-2">';
      if (a.select_agent) html += '<span class="bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Select Agent</span>';
      if (a.australia_group) html += '<span class="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Australia Group</span>';
      if (a.bwc_relevant) html += '<span class="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">BWC</span>';
      if (a.amr_concern) html += '<span class="bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">AMR Concern</span>';
      if (a.pandemic_potential === 'very_high') html += '<span class="bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Pandemic: Very High</span>';
      else if (a.pandemic_potential === 'high') html += '<span class="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Pandemic: High</span>';
      html += '</div></div></div>';
    });
    html += '</div>';
    content.innerHTML = html;
  } catch(e) { content.innerHTML = '<div class="text-center py-20 text-red-500">Error loading agents</div>'; }
}

async function rskbFilterAgents(type) {
  var params = type ? '?type=' + type : '';
  var content = document.getElementById('rskbContent');
  try {
    var res = await fetch('/api/rskb/agents' + params, { headers: { 'Authorization': 'Bearer ' + state.token } });
    var agents = await res.json();
    // Re-render with same function but filter
    rskbRenderAgents();
  } catch(e) {}
}

async function rskbRenderCapacities() {
  var content = document.getElementById('rskbContent');
  try {
    var res = await fetch('/api/rskb/capacities', { headers: { 'Authorization': 'Bearer ' + state.token } });
    var caps = await res.json();

    var catColors = { prevent: { bg: 'bg-blue-500', light: 'bg-blue-100 text-blue-700' }, detect: { bg: 'bg-green-500', light: 'bg-green-100 text-green-700' }, respond: { bg: 'bg-red-500', light: 'bg-red-100 text-red-700' }, other: { bg: 'bg-gray-500', light: 'bg-gray-100 text-gray-700' } };

    // Average score
    var totalScore = 0; var count = 0;
    caps.forEach(function(c) { if (c.sa_score) { totalScore += c.sa_score; count++; } });
    var avgScore = count > 0 ? Math.round(totalScore / count) : 0;
    var scoreColor = avgScore >= 80 ? 'text-green-600' : avgScore >= 60 ? 'text-amber-600' : 'text-red-600';

    var html = '<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">' +
      '<div class="flex items-center justify-between">' +
        '<div><h3 class="text-lg font-semibold text-gray-800"><i class="fas fa-chart-bar mr-2 text-indigo-500"></i>Saudi Arabia — IHR & GHSA Capacity Assessment</h3>' +
        '<p class="text-sm text-gray-500 mt-1">Estimated scores based on JEE and GHSA assessments</p></div>' +
        '<div class="text-center"><div class="text-4xl font-bold ' + scoreColor + '">' + avgScore + '</div><div class="text-xs text-gray-400">Avg Score</div></div>' +
      '</div></div>';

    // Group by framework
    var ihrCaps = caps.filter(function(c) { return c.code.startsWith('IHR'); });
    var ghsaCaps = caps.filter(function(c) { return c.code.startsWith('GHSA'); });

    function renderCapGroup(title, items, fwName) {
      var g = '<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">' +
        '<h3 class="text-sm font-semibold text-gray-800 mb-4"><i class="fas fa-layer-group mr-2 text-indigo-500"></i>' + title + ' (' + fwName + ')</h3>' +
        '<div class="space-y-3">';
      items.forEach(function(c) {
        var col = catColors[c.category] || catColors.other;
        var score = c.sa_score || 0;
        var target = c.target_score || 100;
        var barColor = score >= 80 ? '#059669' : score >= 60 ? '#D97706' : '#DC2626';
        g += '<div class="p-3 bg-gray-50 rounded-lg">' +
          '<div class="flex items-center justify-between mb-2">' +
            '<div class="flex items-center gap-2"><span class="text-xs px-2 py-0.5 rounded-full ' + col.light + ' capitalize">' + c.category + '</span>' +
            '<span class="font-mono text-xs text-gray-400">' + c.code + '</span>' +
            '<span class="text-sm font-medium text-gray-700">' + c.name + '</span></div>' +
            '<div class="flex items-center gap-2"><span class="text-xs text-gray-400 capitalize">' + (c.sa_level || '-').replace(/_/g,' ') + '</span>' +
            '<span class="font-bold text-sm" style="color:' + barColor + '">' + score + '</span></div>' +
          '</div>' +
          '<div class="flex items-center gap-2"><div class="flex-1 bg-gray-200 rounded-full h-2">' +
            '<div class="h-2 rounded-full transition-all" style="width:' + score + '%;background:' + barColor + '"></div></div>' +
            '<span class="text-xs text-gray-400">/' + target + '</span></div>' +
        '</div>';
      });
      g += '</div></div>';
      return g;
    }

    html += renderCapGroup('IHR (2005) — 13 Core Capacities', ihrCaps, 'International Health Regulations');
    html += renderCapGroup('GHSA — Action Packages', ghsaCaps, 'Global Health Security Agenda');

    content.innerHTML = html;
  } catch(e) { content.innerHTML = '<div class="text-center py-20 text-red-500">Error loading capacities</div>'; }
}

async function rskbRenderMatrix() {
  var content = document.getElementById('rskbContent');
  try {
    var res = await fetch('/api/rskb/matrix', { headers: { 'Authorization': 'Bearer ' + state.token } });
    var instruments = await res.json();

    var sectors = [
      { key: 'sector_biosecurity', label: 'BiSec', icon: 'fa-shield-alt', color: '#DC2626' },
      { key: 'sector_biosafety', label: 'BiSaf', icon: 'fa-flask', color: '#2563EB' },
      { key: 'sector_biosurveillance', label: 'BiSur', icon: 'fa-satellite-dish', color: '#059669' },
      { key: 'sector_biodefense', label: 'BiDef', icon: 'fa-shield-virus', color: '#7C3AED' },
      { key: 'sector_public_health', label: 'PH', icon: 'fa-hospital', color: '#D97706' },
      { key: 'sector_laboratory', label: 'Lab', icon: 'fa-microscope', color: '#0891B2' },
      { key: 'sector_amr', label: 'AMR', icon: 'fa-pills', color: '#BE185D' },
      { key: 'sector_animal_health', label: 'AH', icon: 'fa-paw', color: '#65A30D' },
      { key: 'sector_food_safety', label: 'FS', icon: 'fa-utensils', color: '#EA580C' },
      { key: 'sector_environmental', label: 'Env', icon: 'fa-leaf', color: '#0D9488' }
    ];

    var html = '<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">' +
      '<h3 class="text-lg font-semibold text-gray-800 mb-2"><i class="fas fa-table mr-2 text-indigo-500"></i>Instrument-Sector Compliance Matrix</h3>' +
      '<p class="text-sm text-gray-500 mb-4">Cross-mapping of regulatory instruments against biosurveillance sectors</p>' +
      '<div class="overflow-x-auto"><table class="w-full text-xs"><thead><tr class="bg-gray-50">' +
        '<th class="px-3 py-2 text-left">Instrument</th>' +
        '<th class="px-3 py-2 text-left">Scope</th>' +
        '<th class="px-3 py-2 text-left">SA Status</th>';
    sectors.forEach(function(s) {
      html += '<th class="px-2 py-2 text-center" title="' + s.label + '"><i class="fas ' + s.icon + '" style="color:' + s.color + '"></i></th>';
    });
    html += '</tr></thead><tbody>';

    instruments.forEach(function(inst) {
      var saColor = inst.sa_status === 'adopted' ? 'text-green-600' : inst.sa_status === 'partially_adopted' ? 'text-amber-600' : 'text-gray-400';
      html += '<tr class="border-t border-gray-100 hover:bg-gray-50">' +
        '<td class="px-3 py-2 font-medium"><span class="font-mono text-indigo-600 cursor-pointer hover:underline" onclick="rskbShowDetail(&apos;' + inst.id + '&apos;)">' + inst.code + '</span> <span class="text-gray-500">' + (inst.short_title || '') + '</span></td>' +
        '<td class="px-3 py-2 capitalize">' + inst.scope + '</td>' +
        '<td class="px-3 py-2 capitalize ' + saColor + ' font-medium">' + (inst.sa_status || '-').replace(/_/g,' ') + '</td>';
      sectors.forEach(function(s) {
        var val = inst[s.key];
        html += '<td class="px-2 py-2 text-center">' + (val ? '<i class="fas fa-check-circle" style="color:' + s.color + '"></i>' : '<span class="text-gray-200">-</span>') + '</td>';
      });
      html += '</tr>';
    });
    html += '</tbody></table></div></div>';
    content.innerHTML = html;
  } catch(e) { content.innerHTML = '<div class="text-center py-20 text-red-500">Error loading matrix</div>'; }
}

async function rskbRenderBodies() {
  var content = document.getElementById('rskbContent');
  try {
    var res = await fetch('/api/rskb/bodies', { headers: { 'Authorization': 'Bearer ' + state.token } });
    var bodies = await res.json();

    var html = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';
    bodies.forEach(function(b) {
      var typeColors = { un_agency: 'blue', int_org: 'green', standards_body: 'purple', national_gov: 'red', regional_org: 'amber', professional_body: 'gray' };
      var col = typeColors[b.body_type] || 'gray';
      var saBadge = b.sa_membership_status === 'member' ? '<span class="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">SA Member</span>' : b.sa_membership_status === 'observer' ? '<span class="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">SA Observer</span>' : '';

      html += '<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition">' +
        '<div class="flex items-start justify-between mb-3">' +
          '<div><h4 class="font-bold text-gray-800 text-lg">' + b.code + '</h4><p class="text-sm text-gray-600">' + b.name + '</p></div>' +
          '<span class="bg-' + col + '-100 text-' + col + '-700 text-xs px-2 py-0.5 rounded-full capitalize">' + (b.body_type || '').replace(/_/g,' ') + '</span>' +
        '</div>' +
        '<div class="space-y-1.5 text-xs text-gray-500">' +
          (b.headquarters ? '<div><i class="fas fa-map-marker-alt mr-1"></i>' + b.headquarters + '</div>' : '') +
          (b.established_year ? '<div><i class="fas fa-calendar mr-1"></i>Est. ' + b.established_year + '</div>' : '') +
          (b.member_states ? '<div><i class="fas fa-users mr-1"></i>' + b.member_states + ' member states</div>' : '') +
          '<div class="flex items-center gap-2 mt-2">' + saBadge +
          '<span class="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">' + (b.instrument_count || 0) + ' instruments</span></div>' +
        '</div>' +
        (b.website ? '<a href="' + b.website + '" target="_blank" class="text-indigo-600 hover:underline text-xs mt-3 inline-block"><i class="fas fa-external-link-alt mr-1"></i>Website</a>' : '') +
      '</div>';
    });
    html += '</div>';
    content.innerHTML = html;
  } catch(e) { content.innerHTML = '<div class="text-center py-20 text-red-500">Error loading bodies</div>'; }
}

async function rskbSearchGlobal(query) {
  if (!query || !query.trim()) return;
  _rskbData.filters = { search: query };
  rskbSetView('instruments');
}
  `;
}
