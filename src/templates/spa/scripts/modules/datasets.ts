// =============================================================================
// BioR Platform - Dataset Explorer & Dataset Comparison
// =============================================================================

export function getDatasetsJS(): string {
  return `
// ===== DATASET EXPLORER =====
function renderDatasetExplorer() {
  return '<div class="hub-page"><style>' +
    '.de-header{padding:14px 32px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--bior-border-subtle);background:var(--bior-glass-bg);backdrop-filter:blur(20px);}' +
    '.de-back{display:flex;align-items:center;gap:10px;cursor:pointer;color:rgba(255,255,255,0.5);font-size:12px;font-weight:500;transition:color 0.2s;}' +
    '.de-back:hover{color:#00A86B;}' +
    '.de-back-icon{width:32px;height:32px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;transition:all 0.2s;}' +
    '.de-back:hover .de-back-icon{background:rgba(0,168,107,0.1);border-color:rgba(0,168,107,0.3);}' +
    '.de-title{font-size:15px;font-weight:700;color:#fff;display:flex;align-items:center;gap:10px;}' +
    '.de-title-icon{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;}' +
    '.de-actions{display:flex;gap:8px;}' +
    '.de-btn{padding:8px 16px;border-radius:10px;font-size:11px;font-weight:600;border:none;cursor:pointer;transition:all 0.2s;font-family:Inter,sans-serif;display:flex;align-items:center;gap:6px;}' +
    '.de-btn-primary{background:linear-gradient(135deg,#00A86B,#008F5B);color:#fff;}.de-btn-primary:hover{box-shadow:0 4px 16px rgba(0,168,107,0.3);}' +
    '.de-btn-secondary{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.1);}.de-btn-secondary:hover{background:rgba(255,255,255,0.1);}' +
    '.de-tabs{display:flex;gap:4px;padding:10px 32px;border-bottom:1px solid var(--bior-border-subtle);background:var(--bior-glass-bg);}' +
    '.de-tab{padding:8px 18px;border-radius:10px;font-size:11px;font-weight:600;color:rgba(255,255,255,0.4);cursor:pointer;transition:all 0.2s;border:none;background:none;font-family:Inter,sans-serif;display:flex;align-items:center;gap:6px;}' +
    '.de-tab:hover{color:rgba(255,255,255,0.7);background:rgba(255,255,255,0.04);}' +
    '.de-tab.active{color:#00A86B;background:rgba(0,168,107,0.1);border:1px solid rgba(0,168,107,0.2);}' +
    '.de-content{display:flex;gap:0;min-height:calc(100vh - 110px);}' +
    '.de-main{flex:1;padding:24px 32px;overflow-x:auto;}' +
    '.de-sidebar{width:260px;flex-shrink:0;border-left:1px solid rgba(255,255,255,0.06);padding:24px;background:rgba(255,255,255,0.015);}' +
    '@media(max-width:900px){.de-sidebar{display:none;}.de-content{flex-direction:column;}}' +
    '.de-stat{margin-bottom:16px;}.de-stat-label{font-size:10px;font-weight:600;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;}' +
    '.de-stat-value{font-size:16px;font-weight:700;color:#fff;}' +
    '.de-stat-sub{font-size:10px;color:rgba(255,255,255,0.25);margin-top:2px;}' +
    // Table styles
    '.de-toolbar{display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;align-items:center;}' +
    '.de-search{padding:8px 14px 8px 34px;background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,255,255,0.1);border-radius:10px;color:#fff;font-size:12px;font-family:Inter,sans-serif;outline:none;transition:border 0.2s;width:240px;}' +
    '.de-search:focus{border-color:#00A86B;}' +
    '.de-search-wrap{position:relative;}.de-search-wrap i{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,0.2);font-size:11px;}' +
    '.de-table-wrap{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:14px;overflow:hidden;}' +
    '.de-table{width:100%;border-collapse:collapse;font-size:12px;}' +
    '.de-table th{padding:10px 14px;text-align:left;font-size:10px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.06em;background:rgba(255,255,255,0.03);border-bottom:1px solid rgba(255,255,255,0.06);cursor:pointer;white-space:nowrap;user-select:none;}' +
    '.de-table th:hover{color:rgba(255,255,255,0.7);}' +
    '.de-table th .sort-icon{margin-left:4px;font-size:8px;opacity:0.4;}' +
    '.de-table td{padding:8px 14px;border-bottom:1px solid rgba(255,255,255,0.03);color:rgba(255,255,255,0.7);font-family:"SF Mono",Consolas,monospace;font-size:11px;white-space:nowrap;max-width:200px;overflow:hidden;text-overflow:ellipsis;}' +
    '.de-table tr:hover td{background:rgba(255,255,255,0.03);}' +
    '.de-table .num{color:#f59e0b;text-align:right;}' +
    '.de-pager{display:flex;align-items:center;justify-content:space-between;padding:12px 0;font-size:11px;color:rgba(255,255,255,0.3);}' +
    '.de-pager-btns{display:flex;gap:4px;}' +
    '.de-pager-btn{padding:6px 12px;border-radius:8px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.5);cursor:pointer;font-size:10px;font-weight:600;transition:all 0.2s;font-family:Inter,sans-serif;}' +
    '.de-pager-btn:hover{background:rgba(255,255,255,0.1);}.de-pager-btn.active{background:rgba(0,168,107,0.15);color:#00A86B;border-color:rgba(0,168,107,0.3);}' +
    '.de-pager-btn:disabled{opacity:0.3;cursor:not-allowed;}' +
    // Charts
    '.de-charts-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px;}' +
    '.de-chart-card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:16px;}' +
    '.de-chart-title{font-size:11px;font-weight:700;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:12px;}' +
    // Versions
    '.de-ver-card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:14px 18px;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;}' +
    '.de-ver-card:hover{border-color:rgba(255,255,255,0.12);}' +
    '.de-ver-info{display:flex;align-items:center;gap:12px;}' +
    '.de-ver-badge{width:36px;height:36px;border-radius:10px;background:rgba(0,168,107,0.1);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#00A86B;}' +
    '.de-ver-name{font-size:13px;font-weight:600;color:#fff;}.de-ver-meta{font-size:10px;color:rgba(255,255,255,0.3);margin-top:2px;}' +
    '.de-ver-actions{display:flex;gap:6px;}' +
    // Compare
    '.de-cmp-table{width:100%;border-collapse:collapse;font-size:12px;}' +
    '.de-cmp-table th{padding:10px 14px;text-align:left;font-size:10px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;background:rgba(255,255,255,0.03);border-bottom:1px solid rgba(255,255,255,0.06);}' +
    '.de-cmp-table td{padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.03);color:rgba(255,255,255,0.7);font-size:12px;}' +
    '.de-cmp-up{color:#00A86B;font-weight:700;}.de-cmp-down{color:#ef4444;font-weight:700;}' +
    '</style>' +

    '<div class="de-header">' +
      '<div class="de-back" onclick="navigateToHub()">' +
        '<div class="de-back-icon"><i class="fas fa-arrow-left" style="font-size:11px"></i></div>' +
        '<span>Back to Hub</span>' +
      '</div>' +
      '<div class="de-title" id="deTitle"><i class="fas fa-database" style="color:rgba(255,255,255,0.3)"></i> Loading...</div>' +
      '<div class="de-actions">' +
        '<button class="de-btn de-btn-secondary" onclick="exportDataset()"><i class="fas fa-download"></i>Export CSV</button>' +
        '<button class="de-btn de-btn-primary" onclick="showAddDataModal()"><i class="fas fa-plus"></i>Add Data</button>' +
      '</div>' +
    '</div>' +

    '<div class="de-tabs">' +
      '<button class="de-tab active" data-tab="data" onclick="switchDeTab(this,\\'data\\')"><i class="fas fa-table"></i>Data</button>' +
      '<button class="de-tab" data-tab="charts" onclick="switchDeTab(this,\\'charts\\')"><i class="fas fa-chart-bar"></i>Charts</button>' +
      '<button class="de-tab" data-tab="versions" onclick="switchDeTab(this,\\'versions\\')"><i class="fas fa-code-branch"></i>Versions</button>' +
      '<button class="de-tab" data-tab="compare" onclick="switchDeTab(this,\\'compare\\')"><i class="fas fa-columns"></i>Compare</button>' +
    '</div>' +

    '<div class="de-content">' +
      '<div class="de-main" id="deMain"><div style="text-align:center;padding:60px;color:rgba(255,255,255,0.2)"><i class="fas fa-circle-notch fa-spin fa-2x"></i></div></div>' +
      '<div class="de-sidebar" id="deSidebar"></div>' +
    '</div>' +
  '</div>';
}

var deState = { dataset: null, versions: [], page: 1, sort: '', dir: 'asc', search: '', tab: 'data' };

async function initDatasetExplorer() {
  var id = state.currentDataset;
  var d = await api('/api/datasets/' + id);
  if (d.error) { showToast('Dataset not found', 'error'); navigateToHub(); return; }
  deState.dataset = d.dataset;
  deState.dataset.columns_def = typeof d.dataset.columns_def === 'string' ? JSON.parse(d.dataset.columns_def) : (d.dataset.columns_def||[]);
  deState.versions = d.versions || [];
  deState.page = 1;
  deState.sort = '';
  deState.dir = 'asc';
  deState.search = '';
  deState.tab = 'data';

  // Update title
  var titleEl = document.getElementById('deTitle');
  if (titleEl) titleEl.innerHTML = '<div class="de-title-icon" style="background:' + (d.dataset.color||'#3b82f6') + '20"><i class="fas ' + (d.dataset.icon||'fa-database') + '" style="color:' + (d.dataset.color||'#3b82f6') + ';font-size:14px"></i></div>' + d.dataset.name;

  // Render sidebar
  renderDeSidebar();
  // Load data tab
  loadDeData();
}

function renderDeSidebar() {
  var ds = deState.dataset;
  if (!ds) return;
  var sb = document.getElementById('deSidebar');
  if (!sb) return;
  var cols = ds.columns_def || [];
  sb.innerHTML =
    '<div class="de-stat"><div class="de-stat-label">Total Rows</div><div class="de-stat-value">' + (ds.row_count||0).toLocaleString() + '</div></div>' +
    '<div class="de-stat"><div class="de-stat-label">Columns</div><div class="de-stat-value">' + cols.length + '</div>' +
      '<div class="de-stat-sub">' + cols.map(function(c) { return '<span style="color:' + (c.type==='number'?'#f59e0b':'#3b82f6') + '">' + c.name + '</span>'; }).join(', ') + '</div>' +
    '</div>' +
    '<div class="de-stat"><div class="de-stat-label">Versions</div><div class="de-stat-value">' + (ds.version_count||1) + '</div></div>' +
    '<div class="de-stat"><div class="de-stat-label">Created</div><div class="de-stat-value" style="font-size:12px">' + (ds.created_at||'—').split('T')[0] + '</div><div class="de-stat-sub">by ' + (ds.created_by||'—') + '</div></div>' +
    '<div class="de-stat"><div class="de-stat-label">Updated</div><div class="de-stat-value" style="font-size:12px">' + (ds.updated_at||'—').split('T')[0] + '</div></div>' +
    '<div style="margin-top:24px"><button class="de-btn de-btn-primary" style="width:100%;justify-content:center" onclick="showAddDataModal()"><i class="fas fa-plus"></i>Re-run / Add Data</button></div>';
}

async function loadDeData() {
  var id = state.currentDataset;
  var main = document.getElementById('deMain');
  if (!main) return;
  var cols = deState.dataset.columns_def || [];
  var q = '?page=' + deState.page + '&limit=25';
  if (deState.search) q += '&search=' + encodeURIComponent(deState.search);
  if (deState.sort) q += '&sort=' + deState.sort + '&dir=' + deState.dir;
  var d = await api('/api/datasets/' + id + '/rows' + q);
  var rows = d.rows || [];
  var total = d.total || 0;
  var totalPages = Math.ceil(total / 25) || 1;

  main.innerHTML =
    '<div class="de-toolbar">' +
      '<div class="de-search-wrap"><i class="fas fa-search"></i><input class="de-search" id="deSearch" placeholder="Search data..." value="' + (deState.search||'') + '" onkeydown="if(event.key===\\'Enter\\')deSearchGo()"/></div>' +
      '<span style="font-size:11px;color:rgba(255,255,255,0.25)">Showing ' + ((deState.page-1)*25+1) + '-' + Math.min(deState.page*25,total) + ' of ' + total + ' rows</span>' +
    '</div>' +
    '<div class="de-table-wrap"><table class="de-table"><thead><tr>' +
    cols.map(function(c) {
      var active = deState.sort === c.name;
      var arrow = active ? (deState.dir==='asc'?'fa-sort-up':'fa-sort-down') : 'fa-sort';
      return '<th onclick="deSort(\\'' + c.name + '\\')">' + c.name + ' <i class="fas ' + arrow + ' sort-icon"></i></th>';
    }).join('') +
    '</tr></thead><tbody>' +
    (rows.length === 0 ? '<tr><td colspan="' + cols.length + '" style="text-align:center;padding:40px;color:rgba(255,255,255,0.2)">No data rows yet. Click "+ Add Data" to import.</td></tr>' :
    rows.map(function(r) {
      var data = r.row_data || {};
      return '<tr>' + cols.map(function(c) {
        var val = data[c.name] ?? '';
        return '<td' + (c.type==='number'?' class="num"':'') + '>' + val + '</td>';
      }).join('') + '</tr>';
    }).join('')) +
    '</tbody></table></div>' +
    '<div class="de-pager">' +
      '<span>Page ' + deState.page + ' of ' + totalPages + '</span>' +
      '<div class="de-pager-btns">' +
        '<button class="de-pager-btn" onclick="dePageGo(1)"' + (deState.page<=1?' disabled':'') + '>&laquo;</button>' +
        '<button class="de-pager-btn" onclick="dePageGo(' + (deState.page-1) + ')"' + (deState.page<=1?' disabled':'') + '>&lsaquo;</button>' +
        '<button class="de-pager-btn active">' + deState.page + '</button>' +
        '<button class="de-pager-btn" onclick="dePageGo(' + (deState.page+1) + ')"' + (deState.page>=totalPages?' disabled':'') + '>&rsaquo;</button>' +
        '<button class="de-pager-btn" onclick="dePageGo(' + totalPages + ')"' + (deState.page>=totalPages?' disabled':'') + '>&raquo;</button>' +
      '</div>' +
    '</div>';
}

window.deSort = function(col) {
  if (deState.sort === col) { deState.dir = deState.dir === 'asc' ? 'desc' : 'asc'; }
  else { deState.sort = col; deState.dir = 'asc'; }
  deState.page = 1;
  loadDeData();
};
window.deSearchGo = function() {
  deState.search = (document.getElementById('deSearch')?.value || '').trim();
  deState.page = 1;
  loadDeData();
};
window.dePageGo = function(p) { if (p < 1) return; deState.page = p; loadDeData(); };

window.switchDeTab = function(btn, tab) {
  document.querySelectorAll('.de-tab').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  deState.tab = tab;
  if (tab === 'data') loadDeData();
  else if (tab === 'charts') loadDeCharts();
  else if (tab === 'versions') loadDeVersions();
  else if (tab === 'compare') loadDeCompare();
};

async function loadDeCharts() {
  var main = document.getElementById('deMain');
  if (!main) return;
  main.innerHTML = '<div style="text-align:center;padding:40px;color:rgba(255,255,255,0.2)"><i class="fas fa-circle-notch fa-spin fa-2x"></i></div>';
  var d = await api('/api/datasets/' + state.currentDataset + '/charts');
  var charts = d.charts || [];
  if (charts.length === 0) { main.innerHTML = '<div style="text-align:center;padding:60px;color:rgba(255,255,255,0.2)"><i class="fas fa-chart-bar fa-3x" style="margin-bottom:16px"></i><p>No charts available. Add numeric and text columns for auto-generated visualizations.</p></div>'; return; }
  main.innerHTML = '<div class="de-charts-grid">' + charts.map(function(ch, i) {
    if (ch.type === 'versionTrend') {
      return '<div class="de-chart-card"><div class="de-chart-title">Row Count by Version</div><canvas id="deChart' + i + '" height="200"></canvas></div>';
    }
    return '<div class="de-chart-card"><div class="de-chart-title">' + ch.numericCol + ' by ' + ch.groupCol + '</div><canvas id="deChart' + i + '" height="200"></canvas></div>';
  }).join('') + '</div>';

  // Render Chart.js charts
  charts.forEach(function(ch, i) {
    var el = document.getElementById('deChart' + i);
    if (!el) return;
    if (ch.type === 'versionTrend') {
      new Chart(el, { type: 'line', data: { labels: ch.data.map(function(r) { return 'v' + r.version_num; }), datasets: [{ label: 'Rows', data: ch.data.map(function(r) { return r.row_count; }), borderColor: '#00A86B', backgroundColor: 'rgba(0,168,107,0.1)', fill: true, tension: 0.3 }] }, options: Object.assign({}, chartDefaults) });
    } else {
      var barData = (ch.data||[]).slice(0,12);
      new Chart(el, { type: 'bar', data: { labels: barData.map(function(r) { return r.label||'—'; }), datasets: [{ label: 'Avg ' + ch.numericCol, data: barData.map(function(r) { return parseFloat(r.avg_val||0).toFixed(2); }), backgroundColor: 'rgba(59,130,246,0.4)', borderColor: '#3b82f6', borderWidth: 1, borderRadius: 4 }] }, options: Object.assign({}, chartDefaults) });
    }
  });
}

function loadDeVersions() {
  var main = document.getElementById('deMain');
  if (!main) return;
  var versions = deState.versions || [];
  main.innerHTML =
    '<div style="margin-bottom:16px;display:flex;align-items:center;justify-content:space-between"><h3 style="font-size:14px;font-weight:700;color:#fff">Version History</h3><button class="de-btn de-btn-primary" onclick="showAddDataModal()"><i class="fas fa-plus"></i>Add New Version</button></div>' +
    (versions.length === 0 ? '<p style="color:rgba(255,255,255,0.3);font-size:12px">No versions yet.</p>' :
    versions.map(function(v) {
      return '<div class="de-ver-card">' +
        '<div class="de-ver-info">' +
          '<div class="de-ver-badge">v' + v.version_num + '</div>' +
          '<div><div class="de-ver-name">' + (v.notes||'Version '+v.version_num) + '</div><div class="de-ver-meta">' + v.row_count + ' rows &middot; ' + (v.created_at||'').split('T')[0] + ' &middot; by ' + v.created_by + '</div></div>' +
        '</div>' +
        '<div class="de-ver-actions">' +
          '<button class="de-btn de-btn-secondary" style="padding:6px 12px;font-size:10px" onclick="exportDataset(\\'' + v.id + '\\')"><i class="fas fa-download"></i>Export</button>' +
        '</div>' +
      '</div>';
    }).join(''));
}

async function loadDeCompare() {
  var main = document.getElementById('deMain');
  if (!main) return;
  var versions = deState.versions || [];
  if (versions.length < 2) {
    main.innerHTML = '<div style="text-align:center;padding:60px;color:rgba(255,255,255,0.2)"><i class="fas fa-columns fa-3x" style="margin-bottom:16px"></i><p>Need at least 2 versions to compare. Add more data to create a new version.</p></div>';
    return;
  }
  main.innerHTML = '<div style="text-align:center;padding:40px;color:rgba(255,255,255,0.2)"><i class="fas fa-circle-notch fa-spin fa-2x"></i></div>';
  // Compare latest two versions
  var v1 = versions[versions.length - 1];
  var v2 = versions[0];
  var d = await api('/api/datasets/' + state.currentDataset + '/compare?v1=' + v1.id + '&v2=' + v2.id);
  if (d.error) { main.innerHTML = '<p style="color:#ef4444;padding:20px">' + d.error + '</p>'; return; }
  var cols = d.columns || [];
  var numCols = cols.filter(function(c) { return c.type === 'number'; });

  main.innerHTML =
    '<div style="margin-bottom:16px"><h3 style="font-size:14px;font-weight:700;color:#fff">Compare: v' + d.version1.version_num + ' vs v' + d.version2.version_num + '</h3><p style="font-size:11px;color:rgba(255,255,255,0.3)">Comparing numeric column aggregations between versions</p></div>' +
    '<div class="de-table-wrap"><table class="de-cmp-table"><thead><tr><th>Metric</th><th>v' + d.version1.version_num + '</th><th>v' + d.version2.version_num + '</th><th>Change</th></tr></thead><tbody>' +
    '<tr><td style="font-weight:600">Row Count</td><td>' + d.version1.row_count + '</td><td>' + d.version2.row_count + '</td><td>' + (function() { var diff = d.version2.row_count - d.version1.row_count; return '<span class="' + (diff>=0?'de-cmp-up':'de-cmp-down') + '">' + (diff>=0?'+':'') + diff + '</span>'; })() + '</td></tr>' +
    numCols.map(function(col) {
      var s1 = (d.stats.v1||{})[col.name] || {};
      var s2 = (d.stats.v2||{})[col.name] || {};
      var avgDiff = ((s2.avg_val||0) - (s1.avg_val||0));
      var pct = s1.avg_val ? ((avgDiff / s1.avg_val) * 100).toFixed(1) : '—';
      return '<tr><td style="font-weight:600">' + col.name + ' (avg)</td><td>' + parseFloat(s1.avg_val||0).toFixed(2) + '</td><td>' + parseFloat(s2.avg_val||0).toFixed(2) + '</td><td><span class="' + (avgDiff>=0?'de-cmp-up':'de-cmp-down') + '">' + (avgDiff>=0?'\\u25B2 +':'\\u25BC ') + parseFloat(avgDiff).toFixed(2) + ' (' + pct + '%)</span></td></tr>' +
             '<tr><td style="color:rgba(255,255,255,0.3)">' + col.name + ' (min)</td><td style="color:rgba(255,255,255,0.4)">' + parseFloat(s1.min_val||0).toFixed(2) + '</td><td style="color:rgba(255,255,255,0.4)">' + parseFloat(s2.min_val||0).toFixed(2) + '</td><td></td></tr>' +
             '<tr><td style="color:rgba(255,255,255,0.3)">' + col.name + ' (max)</td><td style="color:rgba(255,255,255,0.4)">' + parseFloat(s1.max_val||0).toFixed(2) + '</td><td style="color:rgba(255,255,255,0.4)">' + parseFloat(s2.max_val||0).toFixed(2) + '</td><td></td></tr>';
    }).join('') +
    '</tbody></table></div>';
}

window.exportDataset = function(versionId) {
  var url = '/api/datasets/' + state.currentDataset + '/export';
  if (versionId) url += '?version=' + versionId;
  window.open(url);
};

window.showAddDataModal = function() {
  var modalEl = document.getElementById('hubModal');
  if (!modalEl) {
    // Create modal container in the explorer page
    var m = document.createElement('div'); m.id = 'hubModal';
    document.body.appendChild(m);
    modalEl = m;
  }
  modalEl.innerHTML =
    '<div class="hub-modal-overlay" onclick="if(event.target===this)closeHubModal()" style="position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(8px);z-index:100;display:flex;align-items:center;justify-content:center">' +
    '<div class="hub-modal" style="max-width:520px;background:var(--bior-bg-modal);border:1px solid var(--bior-border-default);border-radius:20px;padding:32px">' +
      '<h3 style="font-size:18px;font-weight:700;color:#fff;margin-bottom:4px"><i class="fas fa-plus-circle mr-2" style="color:#00A86B"></i>Add Data (New Version)</h3>' +
      '<p style="font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:20px">Paste new CSV rows to create a new version. Use the same column headers.</p>' +
      '<div><label style="display:block;font-size:11px;font-weight:600;color:rgba(255,255,255,0.5);margin-bottom:6px;text-transform:uppercase">Notes</label><input type="text" id="addDataNotes" placeholder="e.g., Re-run March 15" style="width:100%;padding:10px 14px;background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,255,255,0.1);border-radius:10px;color:#fff;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:14px;font-family:Inter,sans-serif" /></div>' +
      '<div><label style="display:block;font-size:11px;font-weight:600;color:rgba(255,255,255,0.5);margin-bottom:6px;text-transform:uppercase">Paste CSV Data (with headers)</label><textarea id="addDataCsv" placeholder="id,pathogen,method,sensitivity&#10;BM-010,New-Path,RT-PCR,99.0" style="width:100%;padding:10px 14px;background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,255,255,0.1);border-radius:10px;color:#fff;font-size:11px;font-family:monospace;min-height:140px;outline:none;box-sizing:border-box;resize:vertical"></textarea></div>' +
      '<div id="addDataPreview" style="font-size:11px;color:rgba(255,255,255,0.3);margin:8px 0 10px"></div>' +
      '<div style="display:flex;gap:10px;justify-content:flex-end">' +
        '<button onclick="closeHubModal()" style="padding:10px 20px;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.1);font-family:Inter,sans-serif">Cancel</button>' +
        '<button onclick="submitAddData()" id="addDataBtn" style="padding:10px 20px;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;background:linear-gradient(135deg,#00A86B,#008F5B);color:#fff;border:none;font-family:Inter,sans-serif"><i class="fas fa-plus mr-1"></i>Add Version</button>' +
      '</div>' +
    '</div></div>';

  var ta = document.getElementById('addDataCsv');
  if (ta) ta.addEventListener('input', function() {
    var text = ta.value.trim();
    var prev = document.getElementById('addDataPreview');
    if (!text || !prev) return;
    var lines = text.split('\\n').filter(function(l) { return l.trim(); });
    prev.innerHTML = '<i class="fas fa-check-circle" style="color:#00A86B"></i> ' + (lines.length - 1) + ' data rows detected';
  });
};

window.submitAddData = async function() {
  var csvText = (document.getElementById('addDataCsv')?.value || '').trim();
  var notes = (document.getElementById('addDataNotes')?.value || '').trim() || 'New version';
  if (!csvText) { showToast('Please paste CSV data', 'warning'); return; }
  var lines = csvText.split('\\n').filter(function(l) { return l.trim(); });
  if (lines.length < 2) { showToast('Need header + at least 1 data row', 'warning'); return; }
  var headers = lines[0].split(',').map(function(h) { return h.trim().replace(/^"|"$/g, ''); });
  var rows = lines.slice(1).map(function(line) {
    var vals = line.split(',').map(function(v) { return v.trim().replace(/^"|"$/g, ''); });
    var obj = {};
    headers.forEach(function(h, i) { obj[h] = vals[i] || ''; });
    return obj;
  });
  var btn = document.getElementById('addDataBtn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-1"></i>Adding...'; }
  var result = await api('/api/datasets/' + state.currentDataset + '/versions', {
    method: 'POST',
    body: JSON.stringify({ rows: rows, notes: notes })
  });
  if (result.error) { showToast('Error: ' + result.error, 'error'); if(btn) { btn.disabled=false; btn.innerHTML='<i class="fas fa-plus mr-1"></i>Add Version'; } return; }
  closeHubModal();
  showToast('Version added: +' + result.addedRows + ' rows (total: ' + result.totalRows + ')', 'success');
  // Refresh explorer
  initDatasetExplorer();
};

window.closeHubModal = function() {
  var m = document.getElementById('hubModal');
  if(m) m.innerHTML = '';
};

// ===== DATASET COMPARISON TOOL =====
window.openDatasetCompare = function() {
  state.currentView = 'dataset-compare';
  pushSpaState();
  render();
};

var dcState = { datasets: [], selectedA: null, selectedB: null, verA: null, verB: null, result: null };

function renderDatasetCompare() {
  return '<div class="hub-page"><style>' +
    '.dc-header{padding:14px 32px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--bior-border-subtle);background:var(--bior-glass-bg);backdrop-filter:blur(20px)}' +
    '.dc-back{display:flex;align-items:center;gap:10px;cursor:pointer;color:rgba(255,255,255,0.5);font-size:12px;font-weight:500;transition:color 0.2s}.dc-back:hover{color:#00A86B}' +
    '.dc-card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:20px;margin-bottom:16px}' +
    '.dc-card h3{font-size:13px;font-weight:700;color:rgba(255,255,255,0.8);margin:0 0 16px;display:flex;align-items:center;gap:8px}' +
    '.dc-select{width:100%;padding:10px 14px;background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,255,255,0.1);border-radius:10px;color:#fff;font-size:12px;font-family:Inter,sans-serif;outline:none}' +
    '.dc-select:focus{border-color:#00A86B}' +
    '.dc-compare-btn{padding:10px 24px;border-radius:12px;font-size:12px;font-weight:700;border:none;cursor:pointer;transition:all 0.2s;font-family:Inter,sans-serif;color:#fff;background:linear-gradient(135deg,#00A86B,#008F5B)}.dc-compare-btn:hover{box-shadow:0 4px 20px rgba(0,168,107,0.3)}' +
    '.dc-compare-btn:disabled{opacity:0.4;cursor:not-allowed}' +
    '.dc-sel-grid{display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:end}' +
    '@media(max-width:640px){.dc-sel-grid{grid-template-columns:1fr!important}.dc-sel-grid>div:nth-child(2){display:none}.dc-summary-grid{grid-template-columns:1fr!important}.dc-schema-grid{grid-template-columns:1fr!important}}' +
    '.dc-metric{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-radius:10px;margin-bottom:6px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.04)}' +
    '.dc-metric-label{font-size:11px;font-weight:600;color:rgba(255,255,255,0.5)}' +
    '.dc-metric-val{font-size:13px;font-weight:700;font-family:monospace}' +
    '.dc-diff-pos{color:#22c55e}.dc-diff-neg{color:#ef4444}.dc-diff-zero{color:#94a3b8}' +
    '</style>' +
    '<div class="dc-header">' +
      '<div class="dc-back" onclick="navigateToHub()"><div style="width:32px;height:32px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center"><i class="fas fa-arrow-left" style="font-size:11px"></i></div><span>Back to Hub</span></div>' +
      '<div style="font-size:15px;font-weight:700;color:#fff;display:flex;align-items:center;gap:10px"><div style="width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,rgba(56,189,248,0.2),rgba(167,139,250,0.2));display:flex;align-items:center;justify-content:center"><i class="fas fa-code-compare" style="color:#38bdf8;font-size:13px"></i></div>Dataset Comparison</div>' +
      '<div></div>' +
    '</div>' +
    '<div style="padding:24px 32px;max-width:1100px;margin:0 auto">' +
      '<div class="dc-card">' +
        '<h3><i class="fas fa-sliders-h" style="color:#38bdf8"></i>Select Datasets & Versions to Compare</h3>' +
        '<div class="dc-sel-grid">' +
          '<div>' +
            '<label style="font-size:10px;color:rgba(255,255,255,0.4);font-weight:600;text-transform:uppercase;display:block;margin-bottom:6px">Dataset A</label>' +
            '<select id="dcDsA" class="dc-select" onchange="dcOnSelectDataset(&apos;A&apos;,this.value)"><option value="">Select dataset...</option></select>' +
            '<select id="dcVerA" class="dc-select" style="margin-top:8px" onchange="dcState.verA=this.value"><option value="">Select version...</option></select>' +
          '</div>' +
          '<div style="text-align:center;padding-bottom:10px"><i class="fas fa-arrows-alt-h" style="color:#475569;font-size:20px"></i></div>' +
          '<div>' +
            '<label style="font-size:10px;color:rgba(255,255,255,0.4);font-weight:600;text-transform:uppercase;display:block;margin-bottom:6px">Dataset B</label>' +
            '<select id="dcDsB" class="dc-select" onchange="dcOnSelectDataset(&apos;B&apos;,this.value)"><option value="">Select dataset...</option></select>' +
            '<select id="dcVerB" class="dc-select" style="margin-top:8px" onchange="dcState.verB=this.value"><option value="">Select version...</option></select>' +
          '</div>' +
        '</div>' +
        '<div style="text-align:center;margin-top:20px"><button id="dcGoBtn" class="dc-compare-btn" disabled onclick="dcRunComparison()"><i class="fas fa-code-compare" style="margin-right:6px"></i>Compare</button></div>' +
      '</div>' +
      '<div id="dcResults"></div>' +
    '</div>' +
  '</div>';
}

async function initDatasetCompare() {
  const data = await api('/api/datasets');
  dcState.datasets = data.datasets || [];
  var opts = dcState.datasets.map(function(ds){ return '<option value="'+ds.id+'">'+ds.name+' ('+ds.row_count+' rows)</option>'; }).join('');
  var selA = document.getElementById('dcDsA');
  var selB = document.getElementById('dcDsB');
  if(selA) selA.innerHTML = '<option value="">Select dataset...</option>' + opts;
  if(selB) selB.innerHTML = '<option value="">Select dataset...</option>' + opts;
}

window.dcOnSelectDataset = async function(side, id) {
  if(side==='A') dcState.selectedA = id; else dcState.selectedB = id;
  var verSelect = document.getElementById('dcVer'+side);
  if(!id) { verSelect.innerHTML = '<option value="">Select version...</option>'; dcCheckBtn(); return; }
  var data = await api('/api/datasets/'+id);
  var versions = data.versions || [];
  verSelect.innerHTML = versions.map(function(v){ return '<option value="'+v.id+'">v'+v.version_num+' ('+v.row_count+' rows) — '+(v.notes||'No notes')+'</option>'; }).join('');
  if(versions.length>0) { if(side==='A') dcState.verA=versions[0].id; else dcState.verB=versions[0].id; }
  dcCheckBtn();
};

function dcCheckBtn() {
  var btn = document.getElementById('dcGoBtn');
  if(btn) btn.disabled = !(dcState.selectedA && dcState.selectedB);
}

window.dcRunComparison = async function() {
  var res = document.getElementById('dcResults');
  if(!res) return;
  res.innerHTML = '<div style="text-align:center;padding:40px"><i class="fas fa-spinner fa-spin" style="color:#38bdf8;font-size:24px"></i><p style="color:#94a3b8;font-size:12px;margin-top:12px">Analyzing datasets...</p></div>';
  // Fetch rows for both
  var dA = await api('/api/datasets/'+dcState.selectedA+'/rows?limit=500');
  var dB = await api('/api/datasets/'+dcState.selectedB+'/rows?limit=500');
  var dsA = dcState.datasets.find(function(x){return x.id===dcState.selectedA}) || {};
  var dsB = dcState.datasets.find(function(x){return x.id===dcState.selectedB}) || {};
  var colsA = []; try { colsA = typeof dsA.columns_def==='string'?JSON.parse(dsA.columns_def):(dsA.columns_def||[]); } catch(e){}
  var colsB = []; try { colsB = typeof dsB.columns_def==='string'?JSON.parse(dsB.columns_def):(dsB.columns_def||[]); } catch(e){}
  var rowsA = (dA.rows||[]).map(function(r){ try { return typeof r.row_data==='string'?JSON.parse(r.row_data):r.row_data; } catch(e){ return r; } });
  var rowsB = (dB.rows||[]).map(function(r){ try { return typeof r.row_data==='string'?JSON.parse(r.row_data):r.row_data; } catch(e){ return r; } });

  // Find shared numeric columns
  var numColsA = colsA.filter(function(c){return c.type==='number'}).map(function(c){return c.name});
  var numColsB = colsB.filter(function(c){return c.type==='number'}).map(function(c){return c.name});
  var sharedNum = numColsA.filter(function(c){return numColsB.indexOf(c)!==-1});

  // Compute stats for shared numeric columns
  var statsHtml = '';
  if(sharedNum.length>0) {
    statsHtml = '<div class="dc-card"><h3><i class="fas fa-chart-line" style="color:#22c55e"></i>Numeric Column Comparison ('+sharedNum.length+' shared columns)</h3>';
    sharedNum.forEach(function(col){
      var valsA = rowsA.map(function(r){return parseFloat(r[col])}).filter(function(v){return !isNaN(v)});
      var valsB = rowsB.map(function(r){return parseFloat(r[col])}).filter(function(v){return !isNaN(v)});
      var avgA = valsA.length?(valsA.reduce(function(a,b){return a+b},0)/valsA.length):0;
      var avgB = valsB.length?(valsB.reduce(function(a,b){return a+b},0)/valsB.length):0;
      var diff = avgA - avgB;
      var diffClass = diff>0?'dc-diff-pos':diff<0?'dc-diff-neg':'dc-diff-zero';
      var diffSign = diff>0?'+':'';
      statsHtml += '<div class="dc-metric"><span class="dc-metric-label">'+col+'</span><span class="dc-metric-val" style="color:#38bdf8">'+avgA.toFixed(2)+'</span><span class="dc-metric-val '+diffClass+'">'+diffSign+diff.toFixed(2)+'</span><span class="dc-metric-val" style="color:#a78bfa">'+avgB.toFixed(2)+'</span></div>';
    });
    statsHtml += '</div>';
  }

  // Schema comparison
  var colNamesA = colsA.map(function(c){return c.name});
  var colNamesB = colsB.map(function(c){return c.name});
  var onlyA = colNamesA.filter(function(c){return colNamesB.indexOf(c)===-1});
  var onlyB = colNamesB.filter(function(c){return colNamesA.indexOf(c)===-1});
  var shared = colNamesA.filter(function(c){return colNamesB.indexOf(c)!==-1});

  res.innerHTML =
    '<div class="dc-card"><h3><i class="fas fa-info-circle" style="color:#38bdf8"></i>Comparison Summary</h3>' +
    '<div class="dc-summary-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:16px">' +
      '<div style="padding:16px;border-radius:12px;background:rgba(56,189,248,0.05);border:1px solid rgba(56,189,248,0.2)">' +
        '<div style="font-size:10px;color:#38bdf8;font-weight:600;text-transform:uppercase;margin-bottom:8px">Dataset A: '+dsA.name+'</div>' +
        '<div style="font-size:20px;font-weight:700;color:#fff">'+rowsA.length+' <span style="font-size:12px;color:#94a3b8">rows</span></div>' +
        '<div style="font-size:11px;color:#94a3b8;margin-top:4px">'+colsA.length+' columns</div>' +
      '</div>' +
      '<div style="padding:16px;border-radius:12px;background:rgba(167,139,250,0.05);border:1px solid rgba(167,139,250,0.2)">' +
        '<div style="font-size:10px;color:#a78bfa;font-weight:600;text-transform:uppercase;margin-bottom:8px">Dataset B: '+dsB.name+'</div>' +
        '<div style="font-size:20px;font-weight:700;color:#fff">'+rowsB.length+' <span style="font-size:12px;color:#94a3b8">rows</span></div>' +
        '<div style="font-size:11px;color:#94a3b8;margin-top:4px">'+colsB.length+' columns</div>' +
      '</div>' +
    '</div></div>' +
    '<div class="dc-card"><h3><i class="fas fa-columns" style="color:#a78bfa"></i>Schema Comparison</h3>' +
    '<div class="dc-schema-grid" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">' +
      '<div style="padding:12px;border-radius:10px;background:rgba(34,197,94,0.05);border:1px solid rgba(34,197,94,0.2)"><div style="font-size:10px;color:#22c55e;font-weight:600;margin-bottom:8px">SHARED ('+shared.length+')</div>'+shared.map(function(c){return '<div style="font-size:11px;color:#cbd5e1;margin-bottom:4px"><i class="fas fa-check" style="color:#22c55e;margin-right:4px;font-size:9px"></i>'+c+'</div>'}).join('')+'</div>' +
      '<div style="padding:12px;border-radius:10px;background:rgba(56,189,248,0.05);border:1px solid rgba(56,189,248,0.2)"><div style="font-size:10px;color:#38bdf8;font-weight:600;margin-bottom:8px">ONLY IN A ('+onlyA.length+')</div>'+(onlyA.length?onlyA.map(function(c){return '<div style="font-size:11px;color:#cbd5e1;margin-bottom:4px"><i class="fas fa-plus" style="color:#38bdf8;margin-right:4px;font-size:9px"></i>'+c+'</div>'}).join(''):'<div style="font-size:11px;color:#64748b;font-style:italic">None</div>')+'</div>' +
      '<div style="padding:12px;border-radius:10px;background:rgba(167,139,250,0.05);border:1px solid rgba(167,139,250,0.2)"><div style="font-size:10px;color:#a78bfa;font-weight:600;margin-bottom:8px">ONLY IN B ('+onlyB.length+')</div>'+(onlyB.length?onlyB.map(function(c){return '<div style="font-size:11px;color:#cbd5e1;margin-bottom:4px"><i class="fas fa-plus" style="color:#a78bfa;margin-right:4px;font-size:9px"></i>'+c+'</div>'}).join(''):'<div style="font-size:11px;color:#64748b;font-style:italic">None</div>')+'</div>' +
    '</div></div>' +
    statsHtml;
}

  `;
}
