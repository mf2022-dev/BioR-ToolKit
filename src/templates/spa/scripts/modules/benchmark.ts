// =============================================================================
// BioR Platform - PSEF Benchmark Viewer (About, Overview, Detail, Profiles, Layers, CBRN)
// =============================================================================

export function getBenchmarkJS(): string {
  return `
// ===== BENCHMARK RESULTS VIEW =====
window.openBenchmarkView = function() {
  state.currentView = 'benchmark';
  pushSpaState();
  render();
};

var benchData = null;
var benchView = 'overview';
var benchSelectedPlatform = null;

// ===== SVG RADAR CHART =====
function bmRadarChart(scores, dims, size) {
  size = size || 280;
  var cx = size/2, cy = size/2, r = size/2 - 40;
  var n = dims.length;
  var angleStep = (2 * Math.PI) / n;
  var levels = [20,40,60,80,100];
  var svg = '<svg width="'+size+'" height="'+size+'" viewBox="0 0 '+size+' '+size+'" xmlns="http://www.w3.org/2000/svg">';
  // Grid circles
  levels.forEach(function(lv) {
    var lr = r * lv / 100;
    var pts = [];
    for(var i=0;i<n;i++){var a=-Math.PI/2+i*angleStep;pts.push((cx+lr*Math.cos(a)).toFixed(1)+','+(cy+lr*Math.sin(a)).toFixed(1));}
    svg += '<polygon points="'+pts.join(' ')+'" fill="none" stroke="rgba(148,163,184,0.15)" stroke-width="1"/>';
  });
  // Axis lines
  for(var i=0;i<n;i++){var a=-Math.PI/2+i*angleStep;svg+='<line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+r*Math.cos(a)).toFixed(1)+'" y2="'+(cy+r*Math.sin(a)).toFixed(1)+'" stroke="rgba(148,163,184,0.1)" stroke-width="1"/>';}
  // Data polygon
  var dataPts = [];
  for(var i=0;i<n;i++){var a=-Math.PI/2+i*angleStep;var v=(scores[dims[i].key]||0)/100;dataPts.push((cx+r*v*Math.cos(a)).toFixed(1)+','+(cy+r*v*Math.sin(a)).toFixed(1));}
  svg += '<polygon points="'+dataPts.join(' ')+'" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" stroke-width="2"/>';
  // Data dots and labels
  for(var i=0;i<n;i++){
    var a=-Math.PI/2+i*angleStep;var v=(scores[dims[i].key]||0)/100;
    var dx=cx+r*v*Math.cos(a),dy=cy+r*v*Math.sin(a);
    svg+='<circle cx="'+dx.toFixed(1)+'" cy="'+dy.toFixed(1)+'" r="4" fill="#38bdf8" stroke="#0f172a" stroke-width="2"/>';
    var lx=cx+(r+22)*Math.cos(a),ly=cy+(r+22)*Math.sin(a);
    var anchor=Math.abs(Math.cos(a))<0.1?'middle':Math.cos(a)>0?'start':'end';
    svg+='<text x="'+lx.toFixed(1)+'" y="'+ly.toFixed(1)+'" text-anchor="'+anchor+'" dominant-baseline="central" fill="#94a3b8" font-size="9" font-weight="600" font-family="Inter,sans-serif">'+dims[i].short_code+' '+(scores[dims[i].key]||0)+'</text>';
  }
  svg += '</svg>';
  return svg;
}

// ===== SVG RADAR OVERLAY (compare 2 platforms) =====
function bmRadarOverlay(scores1, scores2, dims, label1, label2, size) {
  size = size || 300;
  var cx = size/2, cy = size/2, r = size/2 - 45;
  var n = dims.length;
  var angleStep = (2 * Math.PI) / n;
  var levels = [20,40,60,80,100];
  var svg = '<svg width="'+size+'" height="'+size+'" viewBox="0 0 '+size+' '+size+'" xmlns="http://www.w3.org/2000/svg">';
  levels.forEach(function(lv){var lr=r*lv/100;var pts=[];for(var i=0;i<n;i++){var a=-Math.PI/2+i*angleStep;pts.push((cx+lr*Math.cos(a)).toFixed(1)+','+(cy+lr*Math.sin(a)).toFixed(1));}svg+='<polygon points="'+pts.join(' ')+'" fill="none" stroke="rgba(148,163,184,0.12)" stroke-width="1"/>';});
  for(var i=0;i<n;i++){var a=-Math.PI/2+i*angleStep;svg+='<line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+r*Math.cos(a)).toFixed(1)+'" y2="'+(cy+r*Math.sin(a)).toFixed(1)+'" stroke="rgba(148,163,184,0.08)" stroke-width="1"/>';}
  // Platform 1
  var pts1=[];for(var i=0;i<n;i++){var a=-Math.PI/2+i*angleStep;var v=(scores1[dims[i].key]||0)/100;pts1.push((cx+r*v*Math.cos(a)).toFixed(1)+','+(cy+r*v*Math.sin(a)).toFixed(1));}
  svg+='<polygon points="'+pts1.join(' ')+'" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="2" stroke-dasharray=""/>';
  // Platform 2
  var pts2=[];for(var i=0;i<n;i++){var a=-Math.PI/2+i*angleStep;var v=(scores2[dims[i].key]||0)/100;pts2.push((cx+r*v*Math.cos(a)).toFixed(1)+','+(cy+r*v*Math.sin(a)).toFixed(1));}
  svg+='<polygon points="'+pts2.join(' ')+'" fill="rgba(167,139,250,0.12)" stroke="#a78bfa" stroke-width="2"/>';
  // Labels
  for(var i=0;i<n;i++){var a=-Math.PI/2+i*angleStep;var lx=cx+(r+24)*Math.cos(a),ly=cy+(r+24)*Math.sin(a);var anchor=Math.abs(Math.cos(a))<0.1?'middle':Math.cos(a)>0?'start':'end';svg+='<text x="'+lx.toFixed(1)+'" y="'+ly.toFixed(1)+'" text-anchor="'+anchor+'" dominant-baseline="central" fill="#94a3b8" font-size="9" font-weight="600" font-family="Inter,sans-serif">'+dims[i].short_code+'</text>';}
  // Legend
  svg+='<rect x="10" y="'+(size-30)+'" width="10" height="10" rx="2" fill="rgba(56,189,248,0.4)"/><text x="24" y="'+(size-21)+'" fill="#38bdf8" font-size="9" font-family="Inter,sans-serif">'+label1+'</text>';
  svg+='<rect x="'+(size/2)+'" y="'+(size-30)+'" width="10" height="10" rx="2" fill="rgba(167,139,250,0.4)"/><text x="'+(size/2+14)+'" y="'+(size-21)+'" fill="#a78bfa" font-size="9" font-family="Inter,sans-serif">'+label2+'</text>';
  svg += '</svg>';
  return svg;
}

// ===== DIMENSION HEATMAP =====
function bmHeatmap(platforms, dims) {
  var html = '<div style="overflow-x:auto"><table style="border-collapse:collapse;font-size:11px;width:100%"><thead><tr><th style="padding:6px 10px;text-align:left;color:#94a3b8;font-weight:600;position:sticky;left:0;background:#1e293b;z-index:1">Platform</th>';
  dims.forEach(function(d){html+='<th style="padding:6px 8px;text-align:center;color:#94a3b8;font-weight:600;font-size:9px;min-width:55px" title="'+d.label+'">'+d.short_code+'</th>';});
  html+='<th style="padding:6px 8px;text-align:center;color:#94a3b8;font-weight:600;font-size:9px">AVG</th></tr></thead><tbody>';
  platforms.forEach(function(p){
    var sc = p.sc || {};
    html+='<tr style="border-bottom:1px solid rgba(51,65,85,0.3)"><td style="padding:6px 10px;color:#fff;font-weight:500;white-space:nowrap;position:sticky;left:0;background:#1e293b;z-index:1">'+p.n+'</td>';
    dims.forEach(function(d){
      var v=sc[d.key]||0;
      var bg=v>=90?'rgba(34,197,94,0.3)':v>=85?'rgba(56,189,248,0.25)':v>=80?'rgba(245,158,11,0.2)':'rgba(239,68,68,0.2)';
      html+='<td style="padding:6px 8px;text-align:center;background:'+bg+';color:'+bmScoreColor(v)+';font-weight:700;font-family:monospace">'+v+'</td>';
    });
    var avg=(dims.reduce(function(a,d){return a+(sc[d.key]||0)},0)/dims.length).toFixed(1);
    html+='<td style="padding:6px 8px;text-align:center;color:#38bdf8;font-weight:700;font-family:monospace">'+avg+'</td></tr>';
  });
  html+='</tbody></table></div>';
  return html;
}

// ===== SCORE DISTRIBUTION CHART (SVG bar chart) =====
function bmScoreDistribution(platforms, width) {
  width = width || 600;
  var h = 200, pad = 40, barW = Math.max(20, Math.min(50, (width-pad*2)/platforms.length - 4));
  var maxS = 100;
  var svg = '<svg width="'+width+'" height="'+(h+60)+'" viewBox="0 0 '+width+' '+(h+60)+'" xmlns="http://www.w3.org/2000/svg">';
  // Y axis
  for(var i=0;i<=4;i++){var y=pad+i*(h-pad)/4;var lbl=100-i*25;svg+='<line x1="'+pad+'" y1="'+y+'" x2="'+(width-10)+'" y2="'+y+'" stroke="rgba(148,163,184,0.1)" stroke-width="1"/><text x="'+(pad-6)+'" y="'+y+'" text-anchor="end" dominant-baseline="central" fill="#64748b" font-size="9" font-family="Inter,sans-serif">'+lbl+'</text>';}
  // Bars
  var startX = pad + (width-pad*2-platforms.length*(barW+4))/2;
  platforms.forEach(function(p,i){
    var bh = (p.s/maxS)*(h-pad);
    var x = startX + i*(barW+4);
    var y = h - bh + pad;
    var col = bmScoreColor(p.s);
    svg += '<rect x="'+x+'" y="'+y+'" width="'+barW+'" height="'+bh+'" rx="3" fill="'+col+'" opacity="0.7"/>';
    svg += '<text x="'+(x+barW/2)+'" y="'+(y-6)+'" text-anchor="middle" fill="'+col+'" font-size="9" font-weight="700" font-family="monospace">'+p.s+'</text>';
    svg += '<text x="'+(x+barW/2)+'" y="'+(h+pad+14)+'" text-anchor="middle" fill="#94a3b8" font-size="7" font-weight="600" font-family="Inter,sans-serif" transform="rotate(-35,'+(x+barW/2)+','+(h+pad+14)+')">'+p.n.substring(0,12)+'</text>';
  });
  svg += '</svg>';
  return svg;
}

// ===== EXPORT: CSV =====
window.bmExportCSV = function() {
  if(!benchData) return;
  var dims = benchData.dimensions || [];
  var headers = ['Rank','Name','URL','Overall Score','Category','Layer'];
  dims.forEach(function(d){headers.push(d.label);});
  headers.push('Strengths','Weaknesses');
  var rows = [headers.join(',')];
  var all = benchData.all_platforms || benchData.platforms || [];
  all.forEach(function(p){
    var row = [p.r, '"'+(p.n||'').replace(/"/g,'""')+'"', '"'+(p.u||'')+'"', p.s, '"'+(p.c||'')+'"', '"'+(p.l||'')+'"'];
    dims.forEach(function(d){row.push((p.sc&&p.sc[d.key])||'');});
    row.push('"'+((p.st||[]).join('; ')).replace(/"/g,'""')+'"');
    row.push('"'+((p.wk||[]).join('; ')).replace(/"/g,'""')+'"');
    rows.push(row.join(','));
  });
  var blob = new Blob([rows.join(GI_NL)], {type:'text/csv'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'PSEF_Benchmark_v3.1.csv';
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('CSV exported (' + all.length + ' platforms)', 'success');
};

// ===== EXPORT: PDF (via print) =====
window.bmExportPDF = function() {
  var main = document.getElementById('bmMainContent');
  if(!main) return;
  var win = window.open('','_blank');
  win.document.write('<html><head><title>PSEF Benchmark Report v3.1</title><style>body{font-family:Inter,Arial,sans-serif;background:#0f172a;color:#e2e8f0;padding:40px;max-width:900px;margin:0 auto}h1{font-size:24px;background:linear-gradient(135deg,#38bdf8,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent}table{width:100%;border-collapse:collapse;font-size:11px}th,td{padding:8px 12px;border:1px solid #334155;text-align:left}th{background:#1e293b;color:#94a3b8;font-weight:600}td{color:#cbd5e1}.score{font-weight:700;font-family:monospace}@media print{body{background:#fff;color:#111}th{background:#f1f5f9;color:#334155}td{color:#334155;border-color:#e2e8f0}}</style></head><body>');
  win.document.write('<h1>PSEF Benchmark Report v3.1 — 189 Platforms</h1>');
  win.document.write('<p style="color:#94a3b8;font-size:13px">Generated: ' + new Date().toLocaleString() + ' | BioR Intelligence Platform</p><hr style="border-color:#334155;margin:20px 0">');
  // Build table
  var dims = benchData.dimensions || [];
  var all = benchData.all_platforms || benchData.platforms || [];
  win.document.write('<table><thead><tr><th>#</th><th>Platform</th><th>Score</th><th>Category</th>');
  dims.forEach(function(d){win.document.write('<th>'+d.short_code+'</th>');});
  win.document.write('</tr></thead><tbody>');
  all.forEach(function(p){
    var col = p.s>=90?'#22c55e':p.s>=85?'#38bdf8':p.s>=80?'#f59e0b':'#ef4444';
    win.document.write('<tr><td>'+p.r+'</td><td>'+p.n+'</td><td class="score" style="color:'+col+'">'+p.s+'</td><td>'+p.c+'</td>');
    dims.forEach(function(d){var v=(p.sc&&p.sc[d.key])||'';win.document.write('<td class="score">'+v+'</td>');});
    win.document.write('</tr>');
  });
  win.document.write('</tbody></table>');
  win.document.write('<p style="margin-top:30px;font-size:10px;color:#64748b">Pathogen Surveillance Evaluation Framework (PSEF) v3.1 &mdash; 189 platforms, 50 deep profiles, 20 CBRN &mdash; bior.tech</p></body></html>');
  win.document.close();
  setTimeout(function(){win.print();}, 500);
  showToast('PDF report opened for printing', 'success');
};

function bmScoreColor(s) { return s >= 90 ? '#22c55e' : s >= 85 ? '#38bdf8' : s >= 80 ? '#f59e0b' : '#ef4444'; }
function bmLayerBadge(l) {
  var cls = l.indexOf('L4_CBRN')===0 ? 'bm-badge-l4c' : l.indexOf('L4_Hardware')===0 ? 'bm-badge-l4h' : l.indexOf('L5')===0 ? 'bm-badge-l5' : l.indexOf('L1')===0 ? 'bm-badge-l1' : l.indexOf('L2')===0 ? 'bm-badge-l2' : l.indexOf('L3')===0 ? 'bm-badge-l3' : 'bm-badge-l1';
  var icons = { L1_Surveillance:'\uD83D\uDCE1', L2_Genomic:'\uD83E\uDDEC', L3_Defense:'\uD83D\uDEE1\uFE0F', L4_CBRN_Operational:'\u2622\uFE0F', L4_Hardware:'\uD83D\uDD27', L5_Policy:'\uD83C\uDFDB\uFE0F' };
  var labels = { L1_Surveillance:'L1 Surveillance', L2_Genomic:'L2 Genomic', L3_Defense:'L3 Defense', L4_CBRN_Operational:'L4 CBRN', L4_Hardware:'L4 Hardware', L5_Policy:'L5 Policy' };
  return '<span class="' + cls + '" style="padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600">' + (icons[l]||'') + ' ' + (labels[l]||l) + '</span>';
}
function bmScoreRing(score, sz) {
  sz = sz || 72; var r = 28, circ = 2 * Math.PI * r, offset = circ - (score/100)*circ, col = bmScoreColor(score);
  return '<div style="position:relative;width:'+sz+'px;height:'+sz+'px">' +
    '<svg width="'+sz+'" height="'+sz+'" viewBox="0 0 '+sz+' '+sz+'" style="transform:rotate(-90deg)">' +
    '<circle cx="'+sz/2+'" cy="'+sz/2+'" r="'+r+'" fill="none" stroke="#334155" stroke-width="5"/>' +
    '<circle cx="'+sz/2+'" cy="'+sz/2+'" r="'+r+'" fill="none" stroke="'+col+'" stroke-width="5" stroke-dasharray="'+circ+'" stroke-dashoffset="'+offset+'" stroke-linecap="round"/>' +
    '</svg><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;color:'+col+'">'+score+'</div></div>';
}
function bmTrunc(str, len) { len=len||200; if(!str||str.length<=len) return str||''; return str.substring(0,len)+'...'; }

function renderBenchmarkView() {
  return '<div class="bm-wrapper" style="min-height:100vh">' +
    '<style>' +
    '.bm-glass{background:rgba(30,41,59,0.85);backdrop-filter:blur(12px);border:1px solid rgba(56,189,248,0.15);border-radius:12px}' +
    '.bm-glass-light{background:rgba(51,65,85,0.5);backdrop-filter:blur(8px);border:1px solid rgba(56,189,248,0.1);border-radius:8px}' +
    '.bm-gradient-text{background:linear-gradient(135deg,#38bdf8 0%,#a78bfa 50%,#22c55e 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}' +
    '.bm-badge-l1{background:rgba(34,197,94,0.15);color:#22c55e;border:1px solid rgba(34,197,94,0.3)}' +
    '.bm-badge-l2{background:rgba(56,189,248,0.15);color:#38bdf8;border:1px solid rgba(56,189,248,0.3)}' +
    '.bm-badge-l3{background:rgba(239,68,68,0.15);color:#ef4444;border:1px solid rgba(239,68,68,0.3)}'+
    '.bm-badge-l4c{background:rgba(245,158,11,0.15);color:#f59e0b;border:1px solid rgba(245,158,11,0.3)}'+
    '.bm-badge-l4h{background:rgba(139,92,246,0.15);color:#8b5cf6;border:1px solid rgba(139,92,246,0.3)}'+
    '.bm-badge-l5{background:rgba(236,72,153,0.15);color:#ec4899;border:1px solid rgba(236,72,153,0.3)}' +
    '.bm-layer-item{display:flex;align-items:center;width:100%;padding:10px 14px;border:none;background:transparent;color:#e2e8f0;font-size:12.5px;cursor:pointer;transition:all 0.15s;font-family:inherit}' +
    '.bm-layer-item:hover{background:rgba(56,189,248,0.1);color:#fff}' +
    '.bm-layer-item strong{color:#fff;margin-right:2px}' +
    '.bm-layer-cnt{font-family:monospace;font-weight:700;font-size:12px;margin-left:auto;padding-left:12px}' +
    '.bm-layer-stat-card{text-align:center;padding:20px 16px;border-radius:10px}' +
    '.bm-layer-bar{display:flex;align-items:center;gap:10px;margin-bottom:8px}' +
    '.bm-layer-bar-label{font-size:11px;color:#94a3b8;width:140px;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.bm-layer-bar-track{flex:1;background:#334155;border-radius:999px;height:8px;overflow:hidden}' +
    '.bm-layer-bar-fill{height:8px;border-radius:999px}' +
    '.bm-layer-bar-val{font-size:11px;font-family:monospace;font-weight:700;width:32px;text-align:right}' +
    '.bm-card{transition:all 0.3s}.bm-card:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(56,189,248,0.15)}' +
    '.bm-tab{padding:8px 16px;border-radius:8px;font-size:13px;font-weight:500;border:1px solid transparent;cursor:pointer;transition:all 0.2s;color:rgba(255,255,255,0.4);background:transparent}' +
    '.bm-tab:hover{color:rgba(255,255,255,0.7)}.bm-tab-active{border-color:#38bdf8;color:#38bdf8;background:rgba(56,189,248,0.1)}' +
    '.bm-fadein{animation:bmFade 0.4s ease-out}@keyframes bmFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}' +
    '.bm-pub-item{border-left:3px solid #38bdf8}' +
    '.bm-eco-line{border-left:2px dashed #475569}' +
    '@media(max-width:768px){' +
      '.bm-tab{padding:6px 10px;font-size:11px}' +
      '.bm-kpi-grid{grid-template-columns:repeat(2,1fr)!important}' +
      '.bm-cards-grid{grid-template-columns:repeat(2,1fr)!important}' +
      '.bm-detail-grid2{grid-template-columns:1fr!important}' +
      '.bm-detail-scores{grid-template-columns:1fr!important}' +
      '.bm-tier-grid{grid-template-columns:repeat(2,1fr)!important}' +
      '.bm-hdr-right{display:none!important}' +
    '}' +
    '@media(max-width:640px){' +
      '.bm-tab{padding:5px 8px;font-size:10px}' +
      '.bm-kpi-grid{grid-template-columns:1fr 1fr!important}' +
      '.bm-cards-grid{grid-template-columns:1fr!important}' +
      '.bm-eco-grid{grid-template-columns:1fr!important}' +
      '.bm-tier-grid{grid-template-columns:1fr 1fr!important}' +
    '}' +
    '</style>' +
    // Header
    '<header class="bm-glass" style="position:sticky;top:0;z-index:50;border-radius:0;border-left:none;border-right:none;border-top:none">' +
      '<div style="max-width:1200px;margin:0 auto;padding:12px 16px;display:flex;align-items:center;justify-content:space-between">' +
        '<div style="display:flex;align-items:center;gap:12px">' +
          '<button onclick="navigateToHub()" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:14px;padding:6px 10px;border-radius:8px;transition:all 0.2s" onmouseover="this.style.color=&apos;#38bdf8&apos;" onmouseout="this.style.color=&apos;#94a3b8&apos;"><i class="fas fa-arrow-left"></i></button>' +
          '<div style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#38bdf8,#a78bfa);display:flex;align-items:center;justify-content:center"><i class="fas fa-shield-virus" style="color:#fff;font-size:16px"></i></div>' +
          '<div><h1 style="font-size:16px;font-weight:700;margin:0" class="bm-gradient-text">BioR Intelligence</h1><p style="font-size:11px;color:#94a3b8;margin:0">Deep-Research Platform Profiles — 50 Deep Profiles</p></div>' +
        '</div>' +
        '<div class="bm-hdr-right" style="display:flex;align-items:center;gap:12px;font-size:12px">' +
          '<span style="color:#94a3b8"><i class="fas fa-database" style="margin-right:4px"></i>189 platforms</span>' +
          '<span style="color:#38bdf8"><i class="fas fa-microscope" style="margin-right:4px"></i>50 deep profiles</span>' +
          '<span style="color:#f59e0b"><i class="fas fa-radiation" style="margin-right:4px"></i>20 CBRN</span>' +
          '<span style="color:#64748b;font-family:monospace;font-size:11px">PSEF v3.1</span>' +
          '<button onclick="bmExportCSV()" style="padding:5px 10px;border-radius:6px;border:1px solid rgba(56,189,248,0.3);background:rgba(56,189,248,0.1);color:#38bdf8;font-size:11px;cursor:pointer;font-weight:600;font-family:inherit;transition:all 0.2s" onmouseover="this.style.background=&apos;rgba(56,189,248,0.2)&apos;" onmouseout="this.style.background=&apos;rgba(56,189,248,0.1)&apos;"><i class="fas fa-file-csv" style="margin-right:4px"></i>CSV</button>' +
          '<button onclick="bmExportPDF()" style="padding:5px 10px;border-radius:6px;border:1px solid rgba(167,139,250,0.3);background:rgba(167,139,250,0.1);color:#a78bfa;font-size:11px;cursor:pointer;font-weight:600;font-family:inherit;transition:all 0.2s" onmouseover="this.style.background=&apos;rgba(167,139,250,0.2)&apos;" onmouseout="this.style.background=&apos;rgba(167,139,250,0.1)&apos;"><i class="fas fa-file-pdf" style="margin-right:4px"></i>PDF</button>' +
        '</div>' +
      '</div>' +
    '</header>' +
    // Tabs
    '<nav style="max-width:1200px;margin:0 auto;padding:16px 16px 0;display:flex;gap:8px;overflow-x:auto;align-items:center" id="bmNavTabs">' +
      '<button class="bm-tab bm-tab-active" data-bmview="about" onclick="bmShowView(&apos;about&apos;)"><i class="fas fa-book-open" style="margin-right:4px"></i>About PSEF</button>' +
      '<button class="bm-tab" data-bmview="overview" onclick="bmShowView(&apos;overview&apos;)"><i class="fas fa-chart-bar" style="margin-right:4px"></i>Overview</button>' +
      // Layers dropdown
      '<div class="bm-layer-dropdown" style="position:relative">' +
        '<button class="bm-tab" data-bmview="layers" id="bmLayerDropBtn" onclick="bmToggleLayerMenu(event)" style="display:flex;align-items:center;gap:4px"><i class="fas fa-layer-group" style="margin-right:4px"></i>Layers <i class="fas fa-chevron-down" style="font-size:9px;margin-left:2px;transition:transform 0.2s" id="bmLayerChevron"></i></button>' +
        '<div id="bmLayerDropdown" style="display:none;position:absolute;top:calc(100% + 4px);left:0;z-index:100;min-width:280px;border-radius:10px;overflow:hidden;background:rgba(15,23,42,0.97);backdrop-filter:blur(16px);border:1px solid rgba(56,189,248,0.2);box-shadow:0 12px 40px rgba(0,0,0,0.5)">' +
          '<div style="padding:8px 12px;border-bottom:1px solid rgba(51,65,85,0.5);font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Six-Layer Taxonomy</div>' +
          '<button class="bm-layer-item" data-bmview="layer_l1" onclick="bmShowView(&apos;layer_l1&apos;);bmCloseLayerMenu()"><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:#22c55e;margin-right:10px"></span><span style="flex:1;text-align:left"><strong>L1</strong> &mdash; Surveillance</span><span class="bm-layer-cnt" style="color:#22c55e">57</span></button>' +
          '<button class="bm-layer-item" data-bmview="layer_l2" onclick="bmShowView(&apos;layer_l2&apos;);bmCloseLayerMenu()"><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:#38bdf8;margin-right:10px"></span><span style="flex:1;text-align:left"><strong>L2</strong> &mdash; Genomic</span><span class="bm-layer-cnt" style="color:#38bdf8">59</span></button>' +
          '<button class="bm-layer-item" data-bmview="layer_l3" onclick="bmShowView(&apos;layer_l3&apos;);bmCloseLayerMenu()"><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:#ef4444;margin-right:10px"></span><span style="flex:1;text-align:left"><strong>L3</strong> &mdash; Defense</span><span class="bm-layer-cnt" style="color:#ef4444">39</span></button>' +
          '<button class="bm-layer-item" data-bmview="layer_l4c" onclick="bmShowView(&apos;layer_l4c&apos;);bmCloseLayerMenu()"><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:#f59e0b;margin-right:10px"></span><span style="flex:1;text-align:left"><strong>L4a</strong> &mdash; CBRN Operational</span><span class="bm-layer-cnt" style="color:#f59e0b">20</span></button>' +
          '<button class="bm-layer-item" data-bmview="layer_l4h" onclick="bmShowView(&apos;layer_l4h&apos;);bmCloseLayerMenu()"><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:#8b5cf6;margin-right:10px"></span><span style="flex:1;text-align:left"><strong>L4b</strong> &mdash; Hardware</span><span class="bm-layer-cnt" style="color:#8b5cf6">9</span></button>' +
          '<button class="bm-layer-item" data-bmview="layer_l5" onclick="bmShowView(&apos;layer_l5&apos;);bmCloseLayerMenu()"><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:#ec4899;margin-right:10px"></span><span style="flex:1;text-align:left"><strong>L5</strong> &mdash; Policy</span><span class="bm-layer-cnt" style="color:#ec4899">5</span></button>' +
        '</div>' +
      '</div>' +
      '<button class="bm-tab" data-bmview="profiles" onclick="bmShowView(&apos;profiles&apos;)"><i class="fas fa-id-card" style="margin-right:4px"></i>Platform Profiles</button>' +
      '<button class="bm-tab" data-bmview="comparison" onclick="bmShowView(&apos;comparison&apos;)"><i class="fas fa-columns" style="margin-right:4px"></i>Comparison</button>' +
      '<button class="bm-tab" data-bmview="cbrn" onclick="bmShowView(&apos;cbrn&apos;)"><i class="fas fa-radiation" style="margin-right:4px"></i>CBRN Operational</button>' +
      '<button class="bm-tab" data-bmview="allplatforms" onclick="bmShowView(&apos;allplatforms&apos;)"><i class="fas fa-th-list" style="margin-right:4px"></i>All 189 Platforms</button>' +
      '<button class="bm-tab" data-bmview="ecosystem" onclick="bmShowView(&apos;ecosystem&apos;)"><i class="fas fa-project-diagram" style="margin-right:4px"></i>Ecosystem Map</button>' +
    '</nav>' +
    // Main content
    '<main style="max-width:1200px;margin:0 auto;padding:24px 16px" id="bmMainContent">' +
      '<div style="text-align:center;padding:60px 0"><i class="fas fa-spinner fa-spin" style="color:#38bdf8;font-size:28px"></i><p style="color:#94a3b8;margin-top:16px;font-size:13px">Loading benchmark data...</p></div>' +
    '</main>' +
  '</div>';
}

function initBenchmarkView() {
  fetch('/static/benchmark-data.json').then(function(r){return r.json()}).then(function(data) {
    benchData = data;
    bmShowView('about');
  }).catch(function(e) {
    document.getElementById('bmMainContent').innerHTML = '<p style="color:#ef4444;text-align:center;padding:60px 0">Failed to load data: ' + e.message + '</p>';
  });
}

window.bmShowView = function(view) {
  benchView = view;
  // Handle tab active state — layer views highlight the Layers dropdown
  document.querySelectorAll('.bm-tab').forEach(function(t){t.classList.remove('bm-tab-active');});
  var isLayerView = view.indexOf('layer_') === 0;
  if(isLayerView) {
    var dropBtn = document.getElementById('bmLayerDropBtn');
    if(dropBtn) dropBtn.classList.add('bm-tab-active');
    // Also highlight the specific layer item
    document.querySelectorAll('.bm-layer-item').forEach(function(t){t.style.background='transparent';t.style.fontWeight='normal'});
    var activeItem = document.querySelector('.bm-layer-item[data-bmview="'+view+'"]');
    if(activeItem) { activeItem.style.background='rgba(56,189,248,0.12)'; activeItem.style.fontWeight='600'; }
  } else {
    var active = document.querySelector('[data-bmview="'+view+'"]');
    if(active) active.classList.add('bm-tab-active');
  }
  var main = document.getElementById('bmMainContent');
  if(!benchData) return;
  switch(view) {
    case 'about': main.innerHTML = bmRenderAbout(); break;
    case 'overview': main.innerHTML = bmRenderOverview(); break;
    case 'profiles': main.innerHTML = bmRenderProfiles(); break;
    case 'comparison': main.innerHTML = bmRenderComparison(); break;
    case 'cbrn': main.innerHTML = bmRenderCBRN(); break;
    case 'allplatforms': main.innerHTML = bmRenderAllPlatforms(); bmInitAllPlatforms(); break;
    case 'ecosystem': main.innerHTML = bmRenderEcosystem(); break;
    case 'layer_l1': main.innerHTML = bmRenderLayer('L1_Surveillance'); break;
    case 'layer_l2': main.innerHTML = bmRenderLayer('L2_Genomic'); break;
    case 'layer_l3': main.innerHTML = bmRenderLayer('L3_Defense'); break;
    case 'layer_l4c': main.innerHTML = bmRenderLayer('L4_CBRN_Operational'); break;
    case 'layer_l4h': main.innerHTML = bmRenderLayer('L4_Hardware'); break;
    case 'layer_l5': main.innerHTML = bmRenderLayer('L5_Policy'); break;
  }
};

window.bmShowDetail = function(name) {
  benchSelectedPlatform = name;
  var main = document.getElementById('bmMainContent');
  main.innerHTML = bmRenderDetail(name);
  window.scrollTo({top:0,behavior:'smooth'});
};

// =============================================================================
// ABOUT PSEF — Executive Introduction, Methodology, Layers, Dimensions
// =============================================================================

function bmRenderAbout() {
  var meta = benchData.meta || {};
  var dims = benchData.dimensions || [];
  var layers = meta.layers || {};
  var cbrn = meta.cbrn_summary || {};
  var totalPlatforms = meta.total_platforms || 189;
  var deepProfiles = meta.deep_profiles || 50;
  var version = meta.version || 'PSEF v3.1.0';

  // Layer stats from all_platforms
  var ap = benchData.all_platforms || [];
  var layerCounts = {};
  var bioClasses = {};
  var inputTypes = {};
  ap.forEach(function(p) {
    layerCounts[p.l] = (layerCounts[p.l]||0)+1;
    var bc = p.biosurveillance_class || 'unknown';
    bioClasses[bc] = (bioClasses[bc]||0)+1;
    var pi = p.primary_input_type || 'unknown';
    inputTypes[pi] = (inputTypes[pi]||0)+1;
  });

  // Score distribution
  var scores = ap.map(function(p){return p.s;});
  var minScore = Math.min.apply(null, scores);
  var maxScore = Math.max.apply(null, scores);
  var avgScore = (scores.reduce(function(a,b){return a+b;},0)/scores.length).toFixed(1);
  var excellent = scores.filter(function(s){return s>=90}).length;
  var good = scores.filter(function(s){return s>=80 && s<90}).length;
  var adequate = scores.filter(function(s){return s>=70 && s<80}).length;
  var developing = scores.filter(function(s){return s<70}).length;

  // Dimension weight total check
  var totalWeight = dims.reduce(function(a,d){return a+d.weight},0);

  // Colors for layer cards
  var layerColors = {
    L1_Surveillance: {bg:'rgba(34,197,94,0.08)', border:'rgba(34,197,94,0.3)', color:'#22c55e', icon:'fa-satellite-dish', label:'L1 — Surveillance & Epidemiological Intelligence'},
    L2_Genomic: {bg:'rgba(56,189,248,0.08)', border:'rgba(56,189,248,0.3)', color:'#38bdf8', icon:'fa-dna', label:'L2 — Genomic & Molecular Intelligence'},
    L3_Defense: {bg:'rgba(239,68,68,0.08)', border:'rgba(239,68,68,0.3)', color:'#ef4444', icon:'fa-shield-alt', label:'L3 — Biodefense & Threat Intelligence'},
    L4_CBRN_Operational: {bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.3)', color:'#f59e0b', icon:'fa-radiation', label:'L4a — CBRN Operational Platforms'},
    L4_Hardware: {bg:'rgba(139,92,246,0.08)', border:'rgba(139,92,246,0.3)', color:'#8b5cf6', icon:'fa-microchip', label:'L4b — Hardware & Sensor Systems'},
    L5_Policy: {bg:'rgba(236,72,153,0.08)', border:'rgba(236,72,153,0.3)', color:'#ec4899', icon:'fa-gavel', label:'L5 — Policy & Governance Frameworks'}
  };

  var layerDescs = {
    L1_Surveillance: 'Disease surveillance, outbreak detection, syndromic monitoring, and epidemiological case management platforms. These systems form the frontline of biosurveillance, tracking case reports, syndromic signals, and epidemiological trends at local, national, and international scales.',
    L2_Genomic: 'Pathogen genomics, phylogenetic analysis, metagenomics, and molecular epidemiology platforms. This layer encompasses bioinformatics pipelines, genome databases, and phylogenetic visualization tools that enable molecular-level pathogen characterisation and evolutionary tracking.',
    L3_Defense: 'Biodefense, threat assessment, risk modeling, environmental monitoring, and early-warning systems. Platforms in this layer support military and civilian biodefense operations, including threat intelligence fusion, biological risk assessment, and environmental sampling networks.',
    L4_CBRN_Operational: 'Chemical, Biological, Radiological, and Nuclear operational platforms for detection, consequence modelling, incident management, and interagency coordination. These 20 platforms represent the specialized tools used by CBRN response units, NATO forces, and civil protection agencies.',
    L4_Hardware: 'Physical sensor systems, laboratory instruments, field-deployable detection devices, and point-of-care diagnostics. Hardware platforms that generate the raw data feeding into software analysis layers, including PCR instruments, biosensors, and radiation monitors.',
    L5_Policy: 'International health regulations, preparedness indices, compliance frameworks, and governance standards. This layer captures the policy instruments and evaluation frameworks that shape national and international biosurveillance capacity.'
  };

  var layerExamples = {
    L1_Surveillance: ['SORMAS', 'DHIS2', 'BioSense / ESSENCE', 'HealthMap', 'ProMED', 'EWARS (WHO)'],
    L2_Genomic: ['Nextstrain', 'GISAID', 'CZ ID', 'NCBI Pathogen Detection', 'Microreact', 'outbreak.info'],
    L3_Defense: ['BARDA PHEMCE', 'DTRA Biosurveillance', 'PREDICT / USAID', 'Global Health Security Index'],
    L4_CBRN_Operational: ['Saab AWR', 'ARGOS', 'RODOS', 'FEMA CBRNResponder', 'SitaWare CBRN'],
    L4_Hardware: ['MinION (Oxford Nanopore)', 'BioFire FilmArray', 'Cepheid GeneXpert'],
    L5_Policy: ['IHR (2005)', 'JEE (Joint External Evaluation)', 'GHSI', 'Biological Weapons Convention']
  };

  // Dimension details
  var dimDescs = {
    data_integration: {icon:'fa-database', color:'#38bdf8', desc:'Measures the ability to ingest, harmonise, and link heterogeneous data sources including genomic sequences, clinical records, environmental sensors, geospatial data, and open-source intelligence feeds. Evaluates API availability, format support (FASTA, VCF, HL7 FHIR, GeoJSON), and cross-domain data fusion.'},
    analytics_capability: {icon:'fa-brain', color:'#a78bfa', desc:'Assesses the depth and sophistication of the analytical engine \u2014 including phylogenetic reconstruction, spatial-temporal clustering, machine-learning forecasting, statistical modelling, AMR prediction, and outbreak detection algorithms. Evaluates both real-time and retrospective analytical capacity.'},
    visualization: {icon:'fa-chart-area', color:'#22c55e', desc:'Evaluates the quality, interactivity, and customisability of visual outputs \u2014 including phylogenetic trees, epidemiological curves, geospatial heatmaps, radar charts, Sankey diagrams, and temporal animations. Assesses whether visualizations are publication-ready and decision-support oriented.'},
    accessibility: {icon:'fa-universal-access', color:'#f59e0b', desc:'Measures ease of adoption, user interface design quality, multilingual support, mobile responsiveness, offline capability, and documentation quality. Evaluates whether non-specialist users (e.g., field epidemiologists, policy-makers) can effectively operate the system with minimal training.'},
    scalability: {icon:'fa-expand-arrows-alt', color:'#38bdf8', desc:'Assesses the capacity to handle increasing data volumes, concurrent users, and geographic expansion without performance degradation. Evaluates cloud-native architecture, horizontal scaling, load balancing, and deployment flexibility (on-premise, cloud, hybrid, edge).'},
    documentation: {icon:'fa-file-alt', color:'#94a3b8', desc:'Evaluates the completeness, currency, and quality of technical documentation, user guides, API references, tutorials, training materials, and deployment guides. Assesses whether documentation enables independent deployment and customisation.'},
    community_support: {icon:'fa-users', color:'#ec4899', desc:'Measures the health of the developer and user community \u2014 including open-source contribution activity, forum responsiveness, issue resolution speed, governance model, and institutional backing. Evaluates sustainable long-term support and governance.'},
    security_compliance: {icon:'fa-shield-alt', color:'#ef4444', desc:'Assesses data protection measures, access control models, encryption standards, audit logging, regulatory compliance (HIPAA, GDPR, IHR), and incident response protocols. Evaluates whether requirements for handling sensitive health and defense data are met.'},
    interoperability: {icon:'fa-plug', color:'#a78bfa', desc:'Measures adherence to open standards (HL7 FHIR, ISO 11179, OGC, ATP-45), API-first design, data export capabilities, and integration with other biosurveillance systems. Evaluates bidirectional data exchange and federation support across the ecosystem.'},
    real_time_capability: {icon:'fa-bolt', color:'#f59e0b', desc:'Assesses the ability to process, analyse, and visualise data in real-time or near-real-time. Evaluates streaming data support, event-driven architectures, alert latency, and the time from data ingestion to actionable intelligence.'}
  };

  // Build Layer cards HTML
  var layerCardsHtml = Object.keys(layerColors).map(function(lk) {
    var lc = layerColors[lk];
    var cnt = layerCounts[lk] || 0;
    var pct = ((cnt / totalPlatforms) * 100).toFixed(0);
    var examples = (layerExamples[lk] || []).map(function(ex) {
      return '<span style="display:inline-block;padding:3px 10px;border-radius:999px;font-size:10px;font-weight:600;background:'+lc.bg+';color:'+lc.color+';border:1px solid '+lc.border+';margin:2px 4px 2px 0">'+ex+'</span>';
    }).join('');
    return '<div class="bm-glass bm-fadein" style="padding:20px;border-color:'+lc.border+'">' +
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px">' +
        '<div style="display:flex;align-items:center;gap:12px"><div style="width:44px;height:44px;border-radius:12px;background:'+lc.bg+';border:1px solid '+lc.border+';display:flex;align-items:center;justify-content:center"><i class="fas '+lc.icon+'" style="color:'+lc.color+';font-size:18px"></i></div><div><h3 style="color:'+lc.color+';font-size:15px;font-weight:700;margin:0">'+lc.label+'</h3><span style="font-size:11px;color:#64748b">'+cnt+' platforms ('+pct+'%)</span></div></div>' +
        '<div style="font-size:28px;font-weight:800;color:'+lc.color+';font-family:monospace">'+cnt+'</div>' +
      '</div>' +
      '<p style="color:#cbd5e1;font-size:12.5px;line-height:1.7;margin:0 0 14px">'+(layerDescs[lk]||'')+'</p>' +
      '<div style="border-top:1px solid rgba(51,65,85,0.5);padding-top:12px"><div style="font-size:10px;color:#64748b;font-weight:600;text-transform:uppercase;margin-bottom:8px;letter-spacing:0.5px">Representative Platforms</div>'+examples+'</div>' +
    '</div>';
  }).join('');

  // Build Dimension cards HTML
  var dimCardsHtml = dims.map(function(d, idx) {
    var dd = dimDescs[d.key] || {};
    var barW = ((d.weight / 12) * 100).toFixed(0);
    return '<div class="bm-glass bm-fadein" style="padding:20px">' +
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px">' +
        '<div style="display:flex;align-items:center;gap:10px"><div style="width:38px;height:38px;border-radius:10px;background:rgba(56,189,248,0.1);display:flex;align-items:center;justify-content:center"><i class="fas '+(dd.icon||'fa-check')+'" style="color:'+(dd.color||'#38bdf8')+';font-size:15px"></i></div><div><h4 style="color:#fff;font-size:14px;font-weight:700;margin:0">'+(idx+1)+'. '+d.label+'</h4><span style="font-size:11px;color:#64748b;font-family:monospace">'+d.short_code+' — Weight: '+d.weight+'%</span></div></div>' +
        '<div style="display:flex;flex-direction:column;align-items:flex-end"><span style="font-size:24px;font-weight:800;color:'+(dd.color||'#38bdf8')+';font-family:monospace">'+d.weight+'<span style="font-size:12px;font-weight:400">%</span></span></div>' +
      '</div>' +
      '<div style="margin-bottom:12px;height:6px;background:#1e293b;border-radius:999px;overflow:hidden"><div style="height:6px;border-radius:999px;width:'+barW+'%;background:linear-gradient(90deg,'+(dd.color||'#38bdf8')+','+(dd.color||'#38bdf8')+'80)"></div></div>' +
      '<p style="color:#cbd5e1;font-size:12px;line-height:1.7;margin:0">'+(dd.desc||'')+'</p>' +
    '</div>';
  }).join('');

  // Scoring tiers
  var tierData = [
    {label:'Excellent', range:'90-100', color:'#22c55e', bg:'rgba(34,197,94,0.1)', count:excellent, desc:'World-class platforms with comprehensive capabilities, strong community, and proven operational deployment at scale.'},
    {label:'Good', range:'80-89', color:'#38bdf8', bg:'rgba(56,189,248,0.1)', count:good, desc:'Mature platforms with solid capabilities across most dimensions, suitable for production biosurveillance operations.'},
    {label:'Adequate', range:'70-79', color:'#f59e0b', bg:'rgba(245,158,11,0.1)', count:adequate, desc:'Functional platforms with notable strengths in specific areas but gaps in one or more evaluation dimensions.'},
    {label:'Developing', range:'<70', color:'#ef4444', bg:'rgba(239,68,68,0.1)', count:developing, desc:'Emerging or niche platforms that address specific needs but lack breadth, community, or maturity for full-scale adoption.'}
  ];

  var tierHtml = tierData.map(function(t) {
    var pct = ((t.count / totalPlatforms) * 100).toFixed(0);
    return '<div class="bm-glass bm-fadein" style="padding:16px;border-left:4px solid '+t.color+'">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><div><span style="font-size:16px;font-weight:700;color:'+t.color+'">'+t.label+'</span><span style="font-size:12px;color:#64748b;margin-left:8px">('+t.range+')</span></div><div style="font-size:24px;font-weight:800;color:'+t.color+';font-family:monospace">'+t.count+'</div></div>' +
      '<div style="height:4px;background:#1e293b;border-radius:999px;margin-bottom:8px;overflow:hidden"><div style="height:4px;border-radius:999px;width:'+pct+'%;background:'+t.color+'"></div></div>' +
      '<p style="color:#94a3b8;font-size:11.5px;line-height:1.6;margin:0">'+t.desc+'</p>' +
    '</div>';
  }).join('');

  // CBRN findings
  var cbrnFindings = (cbrn.key_findings || []).map(function(f) {
    return '<li style="color:#cbd5e1;font-size:12.5px;line-height:1.7;margin-bottom:8px;padding-left:4px">'+f+'</li>';
  }).join('');
  var cbrnRecs = (cbrn.recommendations || []).map(function(r) {
    return '<li style="color:#cbd5e1;font-size:12.5px;line-height:1.7;margin-bottom:8px;padding-left:4px">'+r+'</li>';
  }).join('');

  // Build the full About page
  return '<div class="bm-fadein" style="max-width:1000px;margin:0 auto">' +

    // ===== SECTION 1: EXECUTIVE INTRODUCTION =====
    '<div class="bm-glass" style="padding:32px;margin-bottom:28px;border-color:rgba(56,189,248,0.2)">' +
      '<div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">' +
        '<div style="width:56px;height:56px;border-radius:14px;background:linear-gradient(135deg,#38bdf8,#a78bfa);display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="fas fa-shield-virus" style="color:#fff;font-size:24px"></i></div>' +
        '<div><h2 style="font-size:22px;font-weight:800;margin:0" class="bm-gradient-text">Pathogen Surveillance Evaluation Framework</h2><p style="font-size:13px;color:#64748b;margin:4px 0 0">'+version+' — Comprehensive Biosurveillance Intelligence Benchmark</p></div>' +
      '</div>' +
      '<div style="padding:20px;border-radius:10px;background:rgba(56,189,248,0.04);border:1px solid rgba(56,189,248,0.15);margin-bottom:20px">' +
        '<p style="color:#e2e8f0;font-size:14px;line-height:1.9;margin:0">The <strong style="color:#38bdf8">Pathogen Surveillance Evaluation Framework (PSEF)</strong> is a systematic, multi-dimensional benchmark designed to evaluate the global landscape of digital platforms used in pathogen surveillance, genomic epidemiology, biodefense, and CBRN (Chemical, Biological, Radiological, Nuclear) operational response. Developed as part of the <strong style="color:#a78bfa">BioR Intelligence Platform</strong>, PSEF provides decision-makers, researchers, and biosurveillance architects with an evidence-based, standardised assessment of <strong style="color:#22c55e">'+totalPlatforms+' platforms</strong> across <strong style="color:#f59e0b">6 functional layers</strong> and <strong style="color:#ec4899">10 evaluation dimensions</strong>.</p>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px">' +
        '<div style="text-align:center;padding:16px;border-radius:10px;background:rgba(56,189,248,0.06);border:1px solid rgba(56,189,248,0.15)"><div style="font-size:30px;font-weight:800" class="bm-gradient-text">'+totalPlatforms+'</div><div style="font-size:11px;color:#94a3b8;margin-top:4px">Platforms Evaluated</div></div>' +
        '<div style="text-align:center;padding:16px;border-radius:10px;background:rgba(56,189,248,0.06);border:1px solid rgba(56,189,248,0.15)"><div style="font-size:30px;font-weight:800;color:#38bdf8">'+deepProfiles+'</div><div style="font-size:11px;color:#94a3b8;margin-top:4px">Deep Research Profiles</div></div>' +
        '<div style="text-align:center;padding:16px;border-radius:10px;background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.15)"><div style="font-size:30px;font-weight:800;color:#f59e0b">'+(cbrn.total_platforms||20)+'</div><div style="font-size:11px;color:#94a3b8;margin-top:4px">CBRN Operational</div></div>' +
        '<div style="text-align:center;padding:16px;border-radius:10px;background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.15)"><div style="font-size:30px;font-weight:800;color:#a78bfa">10</div><div style="font-size:11px;color:#94a3b8;margin-top:4px">Evaluation Dimensions</div></div>' +
      '</div>' +
    '</div>' +

    // ===== SECTION 2: PURPOSE & SCOPE =====
    '<div class="bm-glass" style="padding:28px;margin-bottom:28px">' +
      '<h3 style="font-size:17px;font-weight:700;color:#fff;margin:0 0 16px"><i class="fas fa-bullseye" style="margin-right:10px;color:#22c55e"></i>Purpose & Scope</h3>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">' +
        '<div style="padding:16px;border-radius:10px;background:rgba(34,197,94,0.04);border:1px solid rgba(34,197,94,0.15)">' +
          '<h4 style="color:#22c55e;font-size:13px;font-weight:700;margin:0 0 10px"><i class="fas fa-crosshairs" style="margin-right:6px"></i>Why PSEF?</h4>' +
          '<ul style="margin:0;padding:0 0 0 16px;color:#cbd5e1;font-size:12.5px;line-height:1.8">' +
            '<li>No existing standardised framework systematically compares biosurveillance platforms across functional, technical, and operational dimensions</li>' +
            '<li>Decision-makers need evidence-based tools to evaluate and compare platforms for national biosurveillance architecture</li>' +
            '<li>The rapid expansion of genomic, digital, and CBRN platforms demands a structured taxonomy and scoring methodology</li>' +
            '<li>Interoperability gaps between surveillance, genomic, and defense systems require systematic mapping</li>' +
          '</ul>' +
        '</div>' +
        '<div style="padding:16px;border-radius:10px;background:rgba(56,189,248,0.04);border:1px solid rgba(56,189,248,0.15)">' +
          '<h4 style="color:#38bdf8;font-size:13px;font-weight:700;margin:0 0 10px"><i class="fas fa-users-cog" style="margin-right:6px"></i>Target Audience</h4>' +
          '<ul style="margin:0;padding:0 0 0 16px;color:#cbd5e1;font-size:12.5px;line-height:1.8">' +
            '<li><strong style="color:#fff">National Health Authorities</strong> — Platform selection for national biosurveillance architectures</li>' +
            '<li><strong style="color:#fff">Military/CBRN Planners</strong> — Evaluation of CBRN response platform capabilities and NATO interoperability</li>' +
            '<li><strong style="color:#fff">Researchers & Bioinformaticians</strong> — Identifying best-fit tools for genomic epidemiology workflows</li>' +
            '<li><strong style="color:#fff">Policy Makers</strong> — Understanding the global biosurveillance technology landscape and investment priorities</li>' +
            '<li><strong style="color:#fff">System Architects</strong> — Mapping integration pathways and interoperability standards</li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
    '</div>' +

    // ===== SECTION 3: METHODOLOGY =====
    '<div class="bm-glass" style="padding:28px;margin-bottom:28px">' +
      '<h3 style="font-size:17px;font-weight:700;color:#fff;margin:0 0 16px"><i class="fas fa-flask" style="margin-right:10px;color:#a78bfa"></i>Methodology</h3>' +
      '<p style="color:#cbd5e1;font-size:13px;line-height:1.8;margin:0 0 20px">PSEF employs a <strong style="color:#a78bfa">multi-source deep-research enrichment</strong> methodology combining automated data collection, expert analysis, and structured scoring across 10 weighted dimensions. The evaluation process follows four phases:</p>' +
      '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px">' +
        '<div style="padding:16px;border-radius:10px;background:rgba(56,189,248,0.06);border:1px solid rgba(56,189,248,0.15);text-align:center"><div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#38bdf8,#38bdf880);display:flex;align-items:center;justify-content:center;margin:0 auto 10px;color:#fff;font-weight:800;font-size:14px">1</div><h4 style="color:#38bdf8;font-size:12px;font-weight:700;margin:0 0 6px">Discovery</h4><p style="color:#94a3b8;font-size:11px;line-height:1.6;margin:0">Systematic identification of biosurveillance platforms through academic literature, WHO/CDC registries, NATO databases, and open-source repositories</p></div>' +
        '<div style="padding:16px;border-radius:10px;background:rgba(167,139,250,0.06);border:1px solid rgba(167,139,250,0.15);text-align:center"><div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#a78bfa,#a78bfa80);display:flex;align-items:center;justify-content:center;margin:0 auto 10px;color:#fff;font-weight:800;font-size:14px">2</div><h4 style="color:#a78bfa;font-size:12px;font-weight:700;margin:0 0 6px">Classification</h4><p style="color:#94a3b8;font-size:11px;line-height:1.6;margin:0">Assignment to the 6-layer taxonomy based on primary function, input data type, biosurveillance classification, and operational domain</p></div>' +
        '<div style="padding:16px;border-radius:10px;background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.15);text-align:center"><div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#22c55e,#22c55e80);display:flex;align-items:center;justify-content:center;margin:0 auto 10px;color:#fff;font-weight:800;font-size:14px">3</div><h4 style="color:#22c55e;font-size:12px;font-weight:700;margin:0 0 6px">Evaluation</h4><p style="color:#94a3b8;font-size:11px;line-height:1.6;margin:0">Structured scoring across 10 weighted dimensions using documented evidence, technical testing, and comparative benchmarking</p></div>' +
        '<div style="padding:16px;border-radius:10px;background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.15);text-align:center"><div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#f59e0b80);display:flex;align-items:center;justify-content:center;margin:0 auto 10px;color:#fff;font-weight:800;font-size:14px">4</div><h4 style="color:#f59e0b;font-size:12px;font-weight:700;margin:0 0 6px">Deep Research</h4><p style="color:#94a3b8;font-size:11px;line-height:1.6;margin:0">'+deepProfiles+' platforms receive enriched profiles: executive summaries, key publications, ecosystem mapping, CBRN assessment, and timeline analysis</p></div>' +
      '</div>' +
      '<div style="padding:16px;border-radius:10px;background:rgba(56,189,248,0.04);border:1px solid rgba(56,189,248,0.12)">' +
        '<h4 style="color:#fff;font-size:13px;font-weight:700;margin:0 0 10px"><i class="fas fa-calculator" style="margin-right:6px;color:#38bdf8"></i>Scoring Formula</h4>' +
        '<div style="padding:14px;border-radius:8px;background:rgba(15,23,42,0.6);font-family:monospace;font-size:13px;color:#38bdf8;text-align:center;letter-spacing:0.5px">' +
          'Overall Score = <span style="color:#a78bfa">&Sigma;</span> ( Dimension<sub>i</sub> &times; Weight<sub>i</sub> ) / '+totalWeight+' &nbsp;&nbsp; <span style="color:#64748b">where i = 1..10</span>' +
        '</div>' +
        '<p style="color:#94a3b8;font-size:11.5px;line-height:1.7;margin:10px 0 0">Each dimension is scored on a <strong style="color:#fff">0-100 scale</strong> based on documented evidence. The weighted composite score determines overall platform ranking. Dimension weights reflect their relative importance in operational biosurveillance contexts, with <strong style="color:#fff">Data Integration, Analytics, and Security</strong> receiving the highest weights (12% each).</p>' +
      '</div>' +
    '</div>' +

    // ===== SECTION 4: SIX-LAYER TAXONOMY =====
    '<div class="bm-glass" style="padding:28px;margin-bottom:28px">' +
      '<h3 style="font-size:17px;font-weight:700;color:#fff;margin:0 0 6px"><i class="fas fa-layer-group" style="margin-right:10px;color:#f59e0b"></i>Six-Layer Biosurveillance Taxonomy</h3>' +
      '<p style="color:#94a3b8;font-size:13px;line-height:1.7;margin:0 0 20px">PSEF organises all '+totalPlatforms+' platforms into a six-layer functional taxonomy reflecting the operational architecture of modern biosurveillance systems — from frontline epidemiological intelligence (L1) to governance frameworks (L5).</p>' +
      '<div style="display:grid;grid-template-columns:1fr;gap:16px">' +
        layerCardsHtml +
      '</div>' +
    '</div>' +

    // ===== SECTION 5: TEN EVALUATION DIMENSIONS =====
    '<div class="bm-glass" style="padding:28px;margin-bottom:28px">' +
      '<h3 style="font-size:17px;font-weight:700;color:#fff;margin:0 0 6px"><i class="fas fa-ruler-combined" style="margin-right:10px;color:#38bdf8"></i>Ten Evaluation Dimensions</h3>' +
      '<p style="color:#94a3b8;font-size:13px;line-height:1.7;margin:0 0 8px">Every platform is scored across 10 weighted dimensions. Weights were calibrated to prioritise capabilities most critical for operational biosurveillance decision-making. Total weight: <strong style="color:#38bdf8">'+totalWeight+'%</strong></p>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:20px">' +
        dims.map(function(d){
          var dd = dimDescs[d.key]||{};
          return '<span style="display:inline-flex;align-items:center;gap:4px;padding:5px 12px;border-radius:999px;font-size:11px;font-weight:600;background:rgba(56,189,248,0.08);color:'+(dd.color||'#38bdf8')+';border:1px solid rgba(56,189,248,0.2)"><i class="fas '+(dd.icon||'fa-check')+'" style="font-size:10px"></i>'+d.label+' <span style="color:#64748b">'+d.weight+'%</span></span>';
        }).join('') +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">' +
        dimCardsHtml +
      '</div>' +
    '</div>' +

    // ===== SECTION 6: SCORING TIERS =====
    '<div class="bm-glass" style="padding:28px;margin-bottom:28px">' +
      '<h3 style="font-size:17px;font-weight:700;color:#fff;margin:0 0 6px"><i class="fas fa-medal" style="margin-right:10px;color:#22c55e"></i>Scoring Tiers & Distribution</h3>' +
      '<p style="color:#94a3b8;font-size:13px;line-height:1.7;margin:0 0 20px">Platforms are classified into four performance tiers based on their composite PSEF score. Score range across '+totalPlatforms+' platforms: <strong style="color:#38bdf8">'+minScore+' – '+maxScore+'</strong> (Mean: <strong style="color:#38bdf8">'+avgScore+'</strong>).</p>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">' +
        tierHtml +
      '</div>' +
    '</div>' +

    // ===== SECTION 7: CBRN OPERATIONAL ASSESSMENT =====
    (cbrn.title ? '<div class="bm-glass" style="padding:28px;margin-bottom:28px;border-color:rgba(245,158,11,0.25)">' +
      '<h3 style="font-size:17px;font-weight:700;color:#fff;margin:0 0 6px"><i class="fas fa-radiation" style="margin-right:10px;color:#f59e0b"></i>CBRN Operational Assessment</h3>' +
      '<p style="color:#94a3b8;font-size:13px;line-height:1.7;margin:0 0 16px">'+(cbrn.total_platforms||20)+' specialised CBRN platforms were assessed with scores ranging from <strong style="color:#f59e0b">'+(cbrn.score_range||'76-88')+'</strong>. This represents the most comprehensive comparative evaluation of CBRN digital platforms available.</p>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">' +
        '<div>' +
          '<h4 style="color:#f59e0b;font-size:13px;font-weight:700;margin:0 0 10px"><i class="fas fa-search" style="margin-right:6px"></i>Key Findings</h4>' +
          '<ul style="margin:0;padding:0 0 0 16px;list-style-type:disc">'+cbrnFindings+'</ul>' +
        '</div>' +
        '<div>' +
          '<h4 style="color:#38bdf8;font-size:13px;font-weight:700;margin:0 0 10px"><i class="fas fa-lightbulb" style="margin-right:6px"></i>Recommendations</h4>' +
          '<ul style="margin:0;padding:0 0 0 16px;list-style-type:disc">'+cbrnRecs+'</ul>' +
        '</div>' +
      '</div>' +
    '</div>' : '') +

    // ===== SECTION 8: DEEP RESEARCH PROFILES =====
    '<div class="bm-glass" style="padding:28px;margin-bottom:28px">' +
      '<h3 style="font-size:17px;font-weight:700;color:#fff;margin:0 0 6px"><i class="fas fa-microscope" style="margin-right:10px;color:#a78bfa"></i>Deep Research Profiles</h3>' +
      '<p style="color:#94a3b8;font-size:13px;line-height:1.7;margin:0 0 16px">The top '+deepProfiles+' platforms receive comprehensive deep-research profiles enriched with the following structured data:</p>' +
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">' +
        '<div style="padding:14px;border-radius:10px;background:rgba(56,189,248,0.05);border:1px solid rgba(56,189,248,0.12)"><div style="color:#38bdf8;font-weight:700;font-size:13px;margin-bottom:6px"><i class="fas fa-file-alt" style="margin-right:6px"></i>Executive Summary</div><p style="color:#94a3b8;font-size:11.5px;line-height:1.6;margin:0">AI-synthesized executive overview covering capabilities, adoption, and strategic significance</p></div>' +
        '<div style="padding:14px;border-radius:10px;background:rgba(34,197,94,0.05);border:1px solid rgba(34,197,94,0.12)"><div style="color:#22c55e;font-weight:700;font-size:13px;margin-bottom:6px"><i class="fas fa-book" style="margin-right:6px"></i>Key Publications</div><p style="color:#94a3b8;font-size:11.5px;line-height:1.6;margin:0">Peer-reviewed publications with citation counts, journal names, and direct links</p></div>' +
        '<div style="padding:14px;border-radius:10px;background:rgba(167,139,250,0.05);border:1px solid rgba(167,139,250,0.12)"><div style="color:#a78bfa;font-weight:700;font-size:13px;margin-bottom:6px"><i class="fas fa-balance-scale" style="margin-right:6px"></i>Official Guidelines</div><p style="color:#94a3b8;font-size:11.5px;line-height:1.6;margin:0">WHO, CDC, ECDC, and institutional guidelines referencing or recommending the platform</p></div>' +
        '<div style="padding:14px;border-radius:10px;background:rgba(245,158,11,0.05);border:1px solid rgba(245,158,11,0.12)"><div style="color:#f59e0b;font-weight:700;font-size:13px;margin-bottom:6px"><i class="fas fa-project-diagram" style="margin-right:6px"></i>Ecosystem Connections</div><p style="color:#94a3b8;font-size:11.5px;line-height:1.6;margin:0">Mapped integration relationships with other platforms in the biosurveillance ecosystem</p></div>' +
        '<div style="padding:14px;border-radius:10px;background:rgba(236,72,153,0.05);border:1px solid rgba(236,72,153,0.12)"><div style="color:#ec4899;font-weight:700;font-size:13px;margin-bottom:6px"><i class="fas fa-exclamation-circle" style="margin-right:6px"></i>Controversies & Changes</div><p style="color:#94a3b8;font-size:11.5px;line-height:1.6;margin:0">Notable controversies, data-sharing debates, funding changes, and recent pivots</p></div>' +
        '<div style="padding:14px;border-radius:10px;background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.12)"><div style="color:#ef4444;font-weight:700;font-size:13px;margin-bottom:6px"><i class="fas fa-radiation" style="margin-right:6px"></i>CBRN Assessment</div><p style="color:#94a3b8;font-size:11.5px;line-height:1.6;margin:0">Relevance to CBRN operations, hazard coverage, NATO alignment, and operational deployment</p></div>' +
      '</div>' +
    '</div>' +

    // ===== SECTION 9: 7-AXIS COMPARISON METHODOLOGY =====
    '<div class="bm-glass" style="padding:28px;margin-bottom:28px">' +
      '<h3 style="font-size:17px;font-weight:700;color:#fff;margin:0 0 6px"><i class="fas fa-columns" style="margin-right:10px;color:#38bdf8"></i>7-Axis Comparative Analysis</h3>' +
      '<p style="color:#94a3b8;font-size:13px;line-height:1.7;margin:0 0 16px">Beyond dimensional scoring, PSEF performs a structured comparative analysis across 7 orthogonal axes enabling cross-platform feature comparison:</p>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px">' +
        (benchData.comparison && benchData.comparison.comparison_axes ? benchData.comparison.comparison_axes.map(function(ax,i) {
          var axColors = ['#38bdf8','#a78bfa','#22c55e','#f59e0b','#ec4899','#ef4444','#8b5cf6'];
          var axIcons = ['fa-tag','fa-biohazard','fa-code','fa-building','fa-database','fa-lock-open','fa-globe-americas'];
          var c = axColors[i%axColors.length];
          return '<div style="padding:14px;border-radius:10px;background:rgba(56,189,248,0.04);border:1px solid rgba(56,189,248,0.1);text-align:center"><i class="fas '+axIcons[i%axIcons.length]+'" style="color:'+c+';font-size:18px;margin-bottom:8px;display:block"></i><div style="color:#fff;font-weight:700;font-size:12px">'+ax.axis+'</div></div>';
        }).join('') : '') +
      '</div>' +
    '</div>' +

    // ===== SECTION 10: VERSION & CITATION =====
    '<div class="bm-glass" style="padding:24px;margin-bottom:28px;border-color:rgba(56,189,248,0.15)">' +
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:16px">' +
        '<div>' +
          '<h4 style="color:#fff;font-size:14px;font-weight:700;margin:0 0 8px"><i class="fas fa-tag" style="margin-right:8px;color:#38bdf8"></i>'+version+'</h4>' +
          '<p style="color:#94a3b8;font-size:12px;line-height:1.7;margin:0">Generated: '+(meta.timestamp ? meta.timestamp.split('T')[0] : '2026-03-16')+'<br>Method: '+( meta.method || 'Multi-source deep-research enrichment')+'<br>Platforms: '+totalPlatforms+' total | '+deepProfiles+' deep profiles | '+(cbrn.total_platforms||20)+' CBRN operational</p>' +
        '</div>' +
        '<div style="text-align:right">' +
          '<div style="font-size:11px;color:#64748b;margin-bottom:4px">Suggested Citation</div>' +
          '<div style="padding:12px;border-radius:8px;background:rgba(15,23,42,0.5);font-size:11.5px;color:#cbd5e1;line-height:1.7;font-family:serif;max-width:400px">BioR Intelligence Platform. <em>Pathogen Surveillance Evaluation Framework (PSEF) v3.1</em>. '+totalPlatforms+' platforms, '+deepProfiles+' deep profiles, '+(cbrn.total_platforms||20)+' CBRN assessments. bior.tech, 2026.</div>' +
        '</div>' +
      '</div>' +
    '</div>' +

    // ===== CTA: Explore Data =====
    '<div style="text-align:center;margin-bottom:40px;padding:24px">' +
      '<button onclick="bmShowView(&apos;overview&apos;)" class="bm-tab bm-tab-active" style="padding:12px 28px;font-size:14px;font-weight:700;border-radius:12px"><i class="fas fa-chart-bar" style="margin-right:8px"></i>Explore the Data</button>' +
      '<span style="margin:0 12px;color:#475569">|</span>' +
      '<button onclick="bmShowView(&apos;allplatforms&apos;)" class="bm-tab" style="padding:12px 28px;font-size:14px;font-weight:600;border-radius:12px;border:1px solid rgba(56,189,248,0.3);color:#38bdf8"><i class="fas fa-th-list" style="margin-right:8px"></i>Browse All '+totalPlatforms+' Platforms</button>' +
    '</div>' +

  '</div>';
}

function bmRenderOverview() {
  var ps = benchData.platforms;
  var avgScore = (ps.reduce(function(a,p){return a+p.s},0)/ps.length).toFixed(1);
  var layers = {};
  ps.forEach(function(p){layers[p.l]=(layers[p.l]||0)+1;});
  var totalPubs = ps.reduce(function(a,p){return a+((p.deep_research&&p.deep_research.key_publications)?p.deep_research.key_publications.length:0)},0);
  var totalEco = ps.reduce(function(a,p){return a+((p.deep_research&&p.deep_research.ecosystem_connections)?p.deep_research.ecosystem_connections.length:0)},0);

  var cards = ps.map(function(p) {
    var dr = p.deep_research || {};
    return '<div class="bm-card bm-glass bm-fadein" style="padding:16px;cursor:pointer" onclick="bmShowDetail(&apos;' + p.n.replace(/'/g,'&amp;apos;') + '&apos;)">' +
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px">' +
        '<div style="flex:1;min-width:0">' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span style="color:#64748b;font-family:monospace;font-size:11px">#'+p.r+'</span>'+bmLayerBadge(p.l)+'</div>' +
          '<h3 style="color:#fff;font-weight:700;font-size:15px;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+p.n+'</h3>' +
          '<p style="color:#94a3b8;font-size:11px;margin:4px 0 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+p.c+'</p>' +
        '</div>' +
        bmScoreRing(p.s,60) +
      '</div>' +
      '<p style="color:#cbd5e1;font-size:11px;line-height:1.6;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">'+bmTrunc((dr.executive_summary||''),180)+'</p>' +
      '<div style="display:flex;align-items:center;gap:12px;margin-top:12px;font-size:11px;color:#64748b">' +
        '<span><i class="fas fa-book" style="margin-right:4px"></i>'+(dr.key_publications?dr.key_publications.length:0)+' pubs</span>' +
        '<span><i class="fas fa-link" style="margin-right:4px"></i>'+(dr.ecosystem_connections?dr.ecosystem_connections.length:0)+' connections</span>' +
        '<span><i class="fas fa-clock" style="margin-right:4px"></i>'+(dr.timeline?dr.timeline.length:0)+' milestones</span>' +
      '</div>' +
    '</div>';
  }).join('');

  var layerHtml = '';
  Object.keys(layers).forEach(function(l) {
    layerHtml += '<div style="display:flex;align-items:center;gap:8px">' + bmLayerBadge(l) + '<span style="color:#fff;font-weight:700">'+layers[l]+'</span></div>';
  });

  return '<div class="bm-fadein">' +
    '<div class="bm-kpi-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px">' +
      '<div class="bm-glass" style="padding:16px;text-align:center"><div style="font-size:28px;font-weight:700" class="bm-gradient-text">'+ps.length+'</div><div style="font-size:11px;color:#94a3b8;margin-top:4px">Deep Profiles</div></div>' +
      '<div class="bm-glass" style="padding:16px;text-align:center"><div style="font-size:28px;font-weight:700;color:#38bdf8">'+avgScore+'</div><div style="font-size:11px;color:#94a3b8;margin-top:4px">Avg Score</div></div>' +
      '<div class="bm-glass" style="padding:16px;text-align:center"><div style="font-size:28px;font-weight:700;color:#22c55e">'+totalPubs+'</div><div style="font-size:11px;color:#94a3b8;margin-top:4px">Total Citations</div></div>' +
      '<div class="bm-glass" style="padding:16px;text-align:center"><div style="font-size:28px;font-weight:700;color:#a78bfa">'+totalEco+'</div><div style="font-size:11px;color:#94a3b8;margin-top:4px">Ecosystem Links</div></div>' +
    '</div>' +
    '<div class="bm-glass" style="padding:16px;margin-bottom:24px"><h3 style="font-size:13px;font-weight:600;color:#cbd5e1;margin:0 0 12px"><i class="fas fa-layer-group" style="margin-right:8px;color:#38bdf8"></i>Layer Distribution</h3><div style="display:flex;gap:24px">'+layerHtml+'</div></div>' +
    // Score Distribution Chart
    '<div class="bm-glass" style="padding:20px;margin-bottom:24px"><h3 style="font-size:13px;font-weight:600;color:#cbd5e1;margin:0 0 16px"><i class="fas fa-chart-bar" style="margin-right:8px;color:#38bdf8"></i>Score Distribution — Top 50 Deep Profiles</h3><div style="overflow-x:auto;text-align:center">'+bmScoreDistribution(ps, 700)+'</div></div>' +
    // Dimension Heatmap
    '<div class="bm-glass" style="padding:20px;margin-bottom:24px"><h3 style="font-size:13px;font-weight:600;color:#cbd5e1;margin:0 0 16px"><i class="fas fa-th" style="margin-right:8px;color:#a78bfa"></i>10-Dimension Heatmap</h3>'+bmHeatmap(ps, benchData.dimensions || [])+'</div>' +
    '<div class="bm-cards-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">'+cards+'</div>' +
  '</div>';
}

function bmRenderDetail(name) {
  var p = benchData.platforms.find(function(x){return x.n===name});
  if(!p) {
    // Try all_platforms for non-deep profiles
    var ap = (benchData.all_platforms||[]).find(function(x){return x.n===name});
    if(!ap) return '<p style="color:#ef4444">Platform not found</p>';
    // Render a lighter detail view for non-deep platforms
    var profAp = ap.profile || {};
    var scAp = ap.sc || {};
    var subScoresAp = Object.keys(scAp).sort(function(a,b){return scAp[b]-scAp[a]}).map(function(k) {
      var v = scAp[k];
      var label = k.replace(/_/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase()});
      return '<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px"><span style="font-size:11px;color:#94a3b8;width:160px;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+label+'</span><div style="flex:1;background:#334155;border-radius:999px;height:8px;overflow:hidden"><div style="height:8px;border-radius:999px;width:'+(v)+'%;background:'+bmScoreColor(v)+'"></div></div><span style="font-size:11px;font-family:monospace;font-weight:700;width:28px;text-align:right;color:'+bmScoreColor(v)+'">'+v+'</span></div>';
    }).join('');
    var fieldIconsAp = {overview:'fa-info-circle',functional_scope:'fa-cogs',tech_stack:'fa-code',operator:'fa-building',data_model:'fa-database',users_scale:'fa-users',access_model:'fa-lock-open'};
    var fieldsAp = ['overview','functional_scope','tech_stack','operator','data_model','users_scale','access_model'].map(function(f) {
      if(!profAp[f]) return '';
      return '<div class="bm-glass-light" style="padding:16px;margin-bottom:12px"><h4 style="color:#38bdf8;font-size:13px;font-weight:600;margin:0 0 8px"><i class="fas '+fieldIconsAp[f]+'" style="margin-right:8px"></i>'+f.replace(/_/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase()})+'</h4><p style="color:#cbd5e1;font-size:13px;line-height:1.7;margin:0">'+profAp[f]+'</p></div>';
    }).join('');
    return '<div class="bm-fadein">' +
      '<button onclick="bmShowView(&apos;'+benchView+'&apos;)" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:13px;margin-bottom:16px;padding:0"><i class="fas fa-arrow-left" style="margin-right:8px"></i>Back</button>' +
      '<div class="bm-glass" style="padding:24px;margin-bottom:24px"><div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:16px"><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:12px;margin-bottom:8px"><span style="color:#64748b;font-family:monospace;font-size:13px">#'+ap.r+'</span>'+bmLayerBadge(ap.l)+'<span style="color:#64748b;font-size:11px">'+(ap.biosurveillance_class||'')+'</span>'+(ap.military_biodefense?'<span style="padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;background:rgba(239,68,68,0.15);color:#ef4444;border:1px solid rgba(239,68,68,0.3)"><i class="fas fa-user-shield" style="margin-right:3px"></i>Military/Biodefense</span>':'')+'</div><h2 style="font-size:24px;font-weight:700;color:#fff;margin:0 0 8px">'+ap.n+'</h2><p style="color:#94a3b8;font-size:13px;margin:0 0 12px">'+ap.c+' \u2014 '+ap.d+'</p>'+(ap.u?'<a href="'+ap.u+'" target="_blank" style="color:#38bdf8;font-size:13px;text-decoration:none"><i class="fas fa-external-link-alt" style="margin-right:4px"></i>'+ap.u+'</a>':'')+'</div>'+bmScoreRing(ap.s,80)+'</div>' +
      '<div class="bm-detail-grid2" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px"><div><h4 style="color:#22c55e;font-size:12px;font-weight:600;margin:0 0 8px"><i class="fas fa-check-circle" style="margin-right:4px"></i>Strengths</h4><ul style="margin:0;padding:0;list-style:none">'+(ap.st||[]).map(function(s){return '<li style="display:flex;align-items:flex-start;gap:8px;font-size:13px;color:#cbd5e1;margin-bottom:4px"><span style="color:#22c55e;margin-top:2px">\u2022</span>'+s+'</li>'}).join('')+'</ul></div><div><h4 style="color:#f59e0b;font-size:12px;font-weight:600;margin:0 0 8px"><i class="fas fa-exclamation-triangle" style="margin-right:4px"></i>Weaknesses</h4><ul style="margin:0;padding:0;list-style:none">'+(ap.wk||[]).map(function(w){return '<li style="display:flex;align-items:flex-start;gap:8px;font-size:13px;color:#cbd5e1;margin-bottom:4px"><span style="color:#f59e0b;margin-top:2px">\u2022</span>'+w+'</li>'}).join('')+'</ul></div></div></div>' +
      (Object.keys(scAp).length>0?'<div class="bm-glass" style="padding:20px;margin-bottom:24px"><h3 style="font-size:13px;font-weight:600;color:#cbd5e1;margin:0 0 16px"><i class="fas fa-chart-bar" style="margin-right:8px;color:#38bdf8"></i>Evaluation Sub-Scores</h3><div class="bm-detail-scores" style="display:grid;grid-template-columns:1fr 280px;gap:24px;align-items:start"><div>'+subScoresAp+'</div><div style="text-align:center"><div style="font-size:11px;color:#94a3b8;margin-bottom:8px;font-weight:600">Radar Profile</div>'+bmRadarChart(scAp, benchData.dimensions || [], 280)+'</div></div></div>':'') +
      (fieldsAp?'<div style="margin-bottom:24px"><h3 style="font-size:13px;font-weight:600;color:#cbd5e1;margin:0 0 12px"><i class="fas fa-id-card" style="margin-right:8px;color:#38bdf8"></i>Platform Profile</h3>'+fieldsAp+'</div>':'') +
    '</div>';
  }
  var prof = p.profile || {};
  var dr = p.deep_research || {};
  var sc = p.sc || {};

  var subScores = Object.keys(sc).sort(function(a,b){return sc[b]-sc[a]}).map(function(k) {
    var v = sc[k];
    var label = k.replace(/_/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase()});
    return '<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">' +
      '<span style="font-size:11px;color:#94a3b8;width:160px;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+label+'</span>' +
      '<div style="flex:1;background:#334155;border-radius:999px;height:8px;overflow:hidden"><div style="height:8px;border-radius:999px;width:'+(v)+'%;background:'+bmScoreColor(v)+'"></div></div>' +
      '<span style="font-size:11px;font-family:monospace;font-weight:700;width:28px;text-align:right;color:'+bmScoreColor(v)+'">'+v+'</span>' +
    '</div>';
  }).join('');

  var fieldIcons = {overview:'fa-info-circle',functional_scope:'fa-cogs',tech_stack:'fa-code',operator:'fa-building',data_model:'fa-database',users_scale:'fa-users',access_model:'fa-lock-open'};
  var fields = ['overview','functional_scope','tech_stack','operator','data_model','users_scale','access_model'].map(function(f) {
    return '<div class="bm-glass-light" style="padding:16px;margin-bottom:12px"><h4 style="color:#38bdf8;font-size:13px;font-weight:600;margin:0 0 8px"><i class="fas '+fieldIcons[f]+'" style="margin-right:8px"></i>'+f.replace(/_/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase()})+'</h4><p style="color:#cbd5e1;font-size:13px;line-height:1.7;margin:0">'+(prof[f]||'<span style="color:#64748b;font-style:italic">Not available</span>')+'</p></div>';
  }).join('');

  var pubs = (dr.key_publications||[]).map(function(pub) {
    return '<div class="bm-pub-item bm-glass-light" style="padding:12px;margin-bottom:8px;border-radius:0 8px 8px 0"><div style="color:#fff;font-size:13px;font-weight:500">'+pub.title+'</div><div style="color:#94a3b8;font-size:11px;margin-top:4px">'+(pub.authors||'')+' — <em>'+(pub.journal||'')+'</em> ('+(pub.year||'')+')'+(pub.citations?' · <span style="color:#f59e0b">'+pub.citations+' citations</span>':'')+'</div>'+(pub.url?'<a href="'+pub.url+'" target="_blank" style="color:#38bdf8;font-size:11px;text-decoration:none;margin-top:6px;display:inline-block"><i class="fas fa-external-link-alt" style="margin-right:4px"></i>View</a>':'')+'</div>';
  }).join('');

  var guides = (dr.official_guidelines||[]).map(function(g) {
    return '<a href="'+g.url+'" target="_blank" style="display:block;text-decoration:none" class="bm-glass-light" style="padding:12px;margin-bottom:8px"><div style="color:#fff;font-size:13px">'+g.title+'</div><div style="color:#64748b;font-size:11px;margin-top:4px"><i class="fas fa-building" style="margin-right:4px"></i>'+(g.org||'')+'</div></a>';
  }).join('');

  var controv = (dr.controversies_and_changes||[]).map(function(c){return '<li style="color:#cbd5e1;font-size:13px;margin-bottom:8px;padding-left:8px">'+c+'</li>'}).join('');

  var eco = (dr.ecosystem_connections||[]).map(function(e) {
    return '<div class="bm-eco-line" style="padding:8px 0 8px 16px;margin-bottom:12px"><span style="color:#38bdf8;font-weight:600;font-size:13px">'+e.platform+'</span><p style="color:#94a3b8;font-size:11px;margin:2px 0 0">'+e.relationship+'</p></div>';
  }).join('');

  var timeline = (dr.timeline||[]).map(function(t) {
    return '<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:16px"><div style="display:flex;flex-direction:column;align-items:center"><div style="width:12px;height:12px;border-radius:50%;border:2px solid #38bdf8;background:#0f172a;flex-shrink:0"></div><div style="width:1px;flex:1;background:#334155"></div></div><div><span style="color:#38bdf8;font-weight:700;font-size:13px">'+t.year+'</span><p style="color:#cbd5e1;font-size:13px;margin:2px 0 0">'+t.event+'</p></div></div>';
  }).join('');

  var cbrnHtml = '';
  if(dr.cbrn_assessment) {
    var cbrnText = typeof dr.cbrn_assessment === 'string' ? dr.cbrn_assessment : (dr.cbrn_assessment.assessment||'');
    var cbrnTag = typeof dr.cbrn_assessment === 'object' && dr.cbrn_assessment.tag ? dr.cbrn_assessment.tag : (p.l==='L4_CBRN_Operational'?'CBRN Operational':'CBRN Relevant');
    cbrnHtml = '<div class="bm-glass" style="padding:20px;margin-bottom:24px;border-color:rgba(239,68,68,0.3)"><h3 style="color:#ef4444;font-weight:700;font-size:13px;margin:0 0 12px"><i class="fas fa-radiation" style="margin-right:8px"></i>CBRN Assessment</h3><span style="display:inline-block;padding:4px 12px;border-radius:999px;font-size:11px;font-weight:700;background:rgba(239,68,68,0.2);color:#ef4444;border:1px solid rgba(239,68,68,0.4);margin-bottom:12px">'+cbrnTag+'</span><p style="color:#cbd5e1;font-size:13px;line-height:1.7;margin:0">'+cbrnText+'</p></div>';
  }

  return '<div class="bm-fadein">' +
    '<button onclick="bmShowView(&apos;'+benchView+'&apos;)" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:13px;margin-bottom:16px;padding:0"><i class="fas fa-arrow-left" style="margin-right:8px"></i>Back</button>' +
    '<div class="bm-glass" style="padding:24px;margin-bottom:24px">' +
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:16px">' +
        '<div style="flex:1;min-width:0">' +
          '<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px"><span style="color:#64748b;font-family:monospace;font-size:13px">#'+p.r+'</span>'+bmLayerBadge(p.l)+'<span style="color:#64748b;font-size:11px">'+(p.biosurveillance_class||'')+'</span>'+(p.military_biodefense?'<span style="padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;background:rgba(239,68,68,0.15);color:#ef4444;border:1px solid rgba(239,68,68,0.3)"><i class="fas fa-user-shield" style="margin-right:3px"></i>Military</span>':'')+'</div>' +
          '<h2 style="font-size:24px;font-weight:700;color:#fff;margin:0 0 8px">'+p.n+'</h2>' +
          '<p style="color:#94a3b8;font-size:13px;margin:0 0 12px">'+p.c+' — '+p.d+'</p>' +
          '<a href="'+p.u+'" target="_blank" style="color:#38bdf8;font-size:13px;text-decoration:none"><i class="fas fa-external-link-alt" style="margin-right:4px"></i>'+p.u+'</a>' +
        '</div>' +
        bmScoreRing(p.s,80) +
      '</div>' +
      '<div style="margin-top:16px;padding:16px;border-radius:8px;background:rgba(56,189,248,0.05);border:1px solid rgba(56,189,248,0.2)"><p style="color:#e2e8f0;font-size:13px;line-height:1.7;font-style:italic;margin:0">"'+(dr.executive_summary||'')+'"</p></div>' +
      '<div class="bm-detail-grid2" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px">' +
        '<div><h4 style="color:#22c55e;font-size:12px;font-weight:600;margin:0 0 8px"><i class="fas fa-check-circle" style="margin-right:4px"></i>Strengths</h4><ul style="margin:0;padding:0;list-style:none">'+(p.st||[]).map(function(s){return '<li style="display:flex;align-items:flex-start;gap:8px;font-size:13px;color:#cbd5e1;margin-bottom:4px"><span style="color:#22c55e;margin-top:2px">•</span>'+s+'</li>'}).join('')+'</ul></div>' +
        '<div><h4 style="color:#f59e0b;font-size:12px;font-weight:600;margin:0 0 8px"><i class="fas fa-exclamation-triangle" style="margin-right:4px"></i>Weaknesses</h4><ul style="margin:0;padding:0;list-style:none">'+(p.wk||[]).map(function(w){return '<li style="display:flex;align-items:flex-start;gap:8px;font-size:13px;color:#cbd5e1;margin-bottom:4px"><span style="color:#f59e0b;margin-top:2px">•</span>'+w+'</li>'}).join('')+'</ul></div>' +
      '</div>' +
    '</div>' +
    '<div class="bm-glass" style="padding:20px;margin-bottom:24px"><h3 style="font-size:13px;font-weight:600;color:#cbd5e1;margin:0 0 16px"><i class="fas fa-chart-bar" style="margin-right:8px;color:#38bdf8"></i>Evaluation Sub-Scores (10 Criteria)</h3>' +
    '<div class="bm-detail-scores" style="display:grid;grid-template-columns:1fr 280px;gap:24px;align-items:start">' +
      '<div>'+subScores+'</div>' +
      '<div style="text-align:center"><div style="font-size:11px;color:#94a3b8;margin-bottom:8px;font-weight:600">Radar Profile</div>'+bmRadarChart(sc, benchData.dimensions || [], 280)+'</div>' +
    '</div></div>' +
    cbrnHtml +
    '<div style="margin-bottom:24px"><h3 style="font-size:13px;font-weight:600;color:#cbd5e1;margin:0 0 12px"><i class="fas fa-id-card" style="margin-right:8px;color:#38bdf8"></i>Structured Profile (7 Fields)</h3>'+fields+'</div>' +
    '<div class="bm-detail-grid2" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px">' +
      '<div class="bm-glass" style="padding:20px"><h3 style="font-size:13px;font-weight:600;color:#cbd5e1;margin:0 0 16px"><i class="fas fa-book" style="margin-right:8px;color:#38bdf8"></i>Key Publications ('+(dr.key_publications||[]).length+')</h3>'+(pubs||'<p style="color:#64748b;font-size:13px;font-style:italic">No publications</p>')+'</div>' +
      '<div class="bm-glass" style="padding:20px"><h3 style="font-size:13px;font-weight:600;color:#cbd5e1;margin:0 0 16px"><i class="fas fa-balance-scale" style="margin-right:8px;color:#38bdf8"></i>Official Guidelines</h3>'+(guides||'<p style="color:#64748b;font-size:13px;font-style:italic">No guidelines</p>')+'</div>' +
    '</div>' +
    '<div class="bm-glass" style="padding:20px;margin-bottom:24px"><h3 style="font-size:13px;font-weight:600;color:#cbd5e1;margin:0 0 12px"><i class="fas fa-exclamation-circle" style="margin-right:8px;color:#f59e0b"></i>Controversies & Recent Changes</h3><ul style="list-style:disc;padding-left:20px;margin:0">'+controv+'</ul></div>' +
    '<div class="bm-detail-grid2" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px">' +
      '<div class="bm-glass" style="padding:20px"><h3 style="font-size:13px;font-weight:600;color:#cbd5e1;margin:0 0 16px"><i class="fas fa-project-diagram" style="margin-right:8px;color:#38bdf8"></i>Ecosystem Connections ('+(dr.ecosystem_connections||[]).length+')</h3>'+eco+'</div>' +
      '<div class="bm-glass" style="padding:20px"><h3 style="font-size:13px;font-weight:600;color:#cbd5e1;margin:0 0 16px"><i class="fas fa-clock" style="margin-right:8px;color:#38bdf8"></i>Timeline</h3>'+timeline+'</div>' +
    '</div>' +
  '</div>';
}

function bmRenderProfiles() {
  var rows = benchData.platforms.map(function(p) {
    var dr = p.deep_research||{};
    return '<tr style="border-bottom:1px solid rgba(51,65,85,0.5);cursor:pointer;transition:background 0.2s" onmouseover="this.style.background=&apos;rgba(51,65,85,0.3)&apos;" onmouseout="this.style.background=&apos;transparent&apos;" onclick="bmShowDetail(&apos;'+p.n.replace(/'/g,'&amp;apos;')+'&apos;)">' +
      '<td style="padding:12px;font-family:monospace;font-size:11px;color:#64748b">'+p.r+'</td>' +
      '<td style="padding:12px"><div style="font-weight:600;color:#fff;font-size:13px">'+p.n+'</div><div style="color:#64748b;font-size:11px">'+p.c+'</div></td>' +
      '<td style="padding:12px">'+bmLayerBadge(p.l)+'</td>' +
      '<td style="padding:12px;text-align:center"><span style="font-weight:700;font-family:monospace;color:'+bmScoreColor(p.s)+'">'+p.s+'</span></td>' +
      '<td style="padding:12px;font-size:11px;color:#94a3b8;max-width:400px">'+bmTrunc(dr.executive_summary,120)+'</td>' +
      '<td style="padding:12px;text-align:center;font-size:11px;color:#94a3b8">'+(dr.key_publications?dr.key_publications.length:0)+'</td>' +
      '<td style="padding:12px;text-align:center"><i class="fas fa-chevron-right" style="color:#475569"></i></td>' +
    '</tr>';
  }).join('');

  return '<div class="bm-fadein"><div class="bm-glass" style="overflow:hidden"><table style="width:100%;border-collapse:collapse"><thead><tr style="background:rgba(51,65,85,0.5);font-size:11px;color:#94a3b8;text-transform:uppercase">' +
    '<th style="padding:12px;text-align:left">#</th><th style="padding:12px;text-align:left">Platform</th><th style="padding:12px;text-align:left">Layer</th><th style="padding:12px;text-align:center">Score</th><th style="padding:12px;text-align:left">Summary</th><th style="padding:12px;text-align:center">Pubs</th><th style="padding:12px"></th>' +
    '</tr></thead><tbody>'+rows+'</tbody></table></div></div>';
}

function bmRenderComparison() {
  var comp = benchData.comparison;
  if(!comp||!comp.comparison_axes) return '<p style="color:#94a3b8">No comparison data</p>';
  var names = benchData.platforms.map(function(p){return p.n});

  return '<div class="bm-fadein">' + comp.comparison_axes.map(function(ax) {
    var rows = names.map(function(n) {
      return '<tr style="border-bottom:1px solid rgba(51,65,85,0.3)" onmouseover="this.style.background=&apos;rgba(51,65,85,0.2)&apos;" onmouseout="this.style.background=&apos;transparent&apos;">' +
        '<td style="padding:8px 12px;font-size:13px;font-weight:500;color:#fff;white-space:nowrap">'+n+'</td>' +
        '<td style="padding:8px 12px;font-size:13px;color:#cbd5e1">'+(ax.values[n]||'—')+'</td>' +
      '</tr>';
    }).join('');
    return '<div class="bm-glass" style="overflow:hidden;margin-bottom:24px">' +
      '<div style="background:rgba(51,65,85,0.4);padding:12px 16px;border-bottom:1px solid rgba(56,189,248,0.1)"><h3 style="font-size:13px;font-weight:600;color:#38bdf8;margin:0"><i class="fas fa-th-list" style="margin-right:8px"></i>'+ax.axis+'</h3></div>' +
      '<table style="width:100%;border-collapse:collapse"><thead><tr style="font-size:11px;color:#64748b;text-transform:uppercase;background:rgba(51,65,85,0.2)"><th style="padding:8px 12px;text-align:left;width:200px">Platform</th><th style="padding:8px 12px;text-align:left">'+ax.axis+'</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
  }).join('') + '</div>';
}

function bmRenderEcosystem() {
  var connections = {};
  benchData.platforms.forEach(function(p) {
    var eco = (p.deep_research&&p.deep_research.ecosystem_connections)||[];
    eco.forEach(function(e) {
      var key = [p.n,e.platform].sort().join('↔');
      if(!connections[key]) connections[key] = {from:p.n,to:e.platform,relationships:[]};
      connections[key].relationships.push({direction:p.n+' → '+e.platform,text:e.relationship});
    });
  });

  var connList = Object.keys(connections).map(function(k) {
    var c = connections[k];
    return '<div class="bm-glass-light bm-fadein" style="padding:16px;margin-bottom:12px">' +
      '<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px"><span style="color:#38bdf8;font-weight:600;font-size:13px">'+c.from+'</span><i class="fas fa-arrows-alt-h" style="color:#475569"></i><span style="color:#a78bfa;font-weight:600;font-size:13px">'+c.to+'</span></div>' +
      c.relationships.map(function(r){return '<div style="font-size:11px;color:#94a3b8;padding-left:16px;border-left:2px solid #334155;margin-bottom:4px"><span style="color:#64748b">'+r.direction+':</span> '+r.text+'</div>'}).join('') +
    '</div>';
  }).join('');

  var nodeCounts = {};
  benchData.platforms.forEach(function(p) {
    nodeCounts[p.n] = ((p.deep_research&&p.deep_research.ecosystem_connections)||[]).length;
  });
  var nodeList = Object.keys(nodeCounts).sort(function(a,b){return nodeCounts[b]-nodeCounts[a]}).map(function(n) {
    var p = benchData.platforms.find(function(x){return x.n===n});
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-radius:8px;cursor:pointer;transition:background 0.2s" onmouseover="this.style.background=&apos;rgba(51,65,85,0.3)&apos;" onmouseout="this.style.background=&apos;transparent&apos;" onclick="bmShowDetail(&apos;'+n.replace(/'/g,'&amp;apos;')+'&apos;)">' +
      '<div style="display:flex;align-items:center;gap:12px">'+bmLayerBadge(p?p.l:'')+'<span style="color:#fff;font-size:13px;font-weight:500">'+n+'</span></div>' +
      '<span style="color:#38bdf8;font-weight:700">'+nodeCounts[n]+'</span></div>';
  }).join('');

  return '<div class="bm-fadein"><div class="bm-eco-grid" style="display:grid;grid-template-columns:1fr 2fr;gap:24px">' +
    '<div><div class="bm-glass" style="padding:20px;position:sticky;top:80px"><h3 style="font-size:13px;font-weight:600;color:#cbd5e1;margin:0 0 12px"><i class="fas fa-sitemap" style="margin-right:8px;color:#38bdf8"></i>Connection Count</h3>'+nodeList+'<div style="margin-top:16px;padding:12px;border-radius:8px;background:rgba(56,189,248,0.05);border:1px solid rgba(56,189,248,0.2)"><p style="font-size:11px;color:#94a3b8;margin:0"><strong style="color:#38bdf8">'+Object.keys(connections).length+'</strong> unique connections across '+benchData.platforms.length+' platforms</p></div></div></div>' +
    '<div><h3 style="font-size:13px;font-weight:600;color:#cbd5e1;margin:0 0 16px"><i class="fas fa-project-diagram" style="margin-right:8px;color:#38bdf8"></i>All Ecosystem Connections</h3>'+connList+'</div>' +
  '</div></div>';
}

// ===== LAYER DROPDOWN HELPERS =====
window.bmToggleLayerMenu = function(e) {
  e.stopPropagation();
  var dd = document.getElementById('bmLayerDropdown');
  var ch = document.getElementById('bmLayerChevron');
  if(!dd) return;
  var isOpen = dd.style.display !== 'none';
  dd.style.display = isOpen ? 'none' : 'block';
  if(ch) ch.style.transform = isOpen ? '' : 'rotate(180deg)';
};
window.bmCloseLayerMenu = function() {
  var dd = document.getElementById('bmLayerDropdown');
  var ch = document.getElementById('bmLayerChevron');
  if(dd) dd.style.display = 'none';
  if(ch) ch.style.transform = '';
};
// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  var dd = document.getElementById('bmLayerDropdown');
  if(dd && dd.style.display !== 'none') {
    var el = e.target;
    var parent = el && el.closest ? el.closest('.bm-layer-dropdown') : null;
    if(!parent) window.bmCloseLayerMenu();
  }
});

// ===== SIX LAYER DETAIL VIEWS =====
var bmLayerMeta = {
  L1_Surveillance: {
    code:'L1', shortLabel:'Surveillance', fullLabel:'L1 \u2014 Surveillance & Epidemiological Intelligence',
    color:'#22c55e', bg:'rgba(34,197,94,0.08)', border:'rgba(34,197,94,0.3)', icon:'fa-satellite-dish',
    desc:'Disease surveillance, outbreak detection, syndromic monitoring, and epidemiological case management platforms. These systems form the frontline of biosurveillance, tracking case reports, syndromic signals, and epidemiological trends at local, national, and international scales.',
    scope:'L1 platforms represent the foundational layer of public health surveillance infrastructure. They range from community-level syndromic reporting tools to global disease intelligence aggregators. Key capabilities include real-time case notification, epidemiological curve generation, outbreak clustering algorithms, early warning signal detection, and interoperability with laboratory and clinical systems. Platforms in this layer are predominantly civilian, operated by public health agencies (WHO, CDC, ECDC) or NGOs, and focus on the timely collection, analysis, and dissemination of disease-related data.',
    keyCapabilities: ['Real-time case notification and outbreak alerting','Epidemiological curve generation and trend analysis','Syndromic surveillance from unstructured data','Wastewater and environmental monitoring integration','Mobile-first field epidemiology data collection','Geospatial mapping and spatial clustering','Cross-border disease intelligence sharing','Automated statistical anomaly detection'],
    keyOrgs: ['World Health Organization (WHO)','US CDC','European CDC (ECDC)','National Public Health Institutes','Ministries of Health']
  },
  L2_Genomic: {
    code:'L2', shortLabel:'Genomic', fullLabel:'L2 \u2014 Genomic & Molecular Intelligence',
    color:'#38bdf8', bg:'rgba(56,189,248,0.08)', border:'rgba(56,189,248,0.3)', icon:'fa-dna',
    desc:'Pathogen genomics, phylogenetic analysis, metagenomics, and molecular epidemiology platforms. This layer encompasses bioinformatics pipelines, genome databases, and phylogenetic visualization tools that enable molecular-level pathogen characterisation and evolutionary tracking.',
    scope:'L2 platforms drive the genomic revolution in public health. They enable whole-genome sequencing (WGS) analysis at scale, phylogenetic tree reconstruction for outbreak tracing, antimicrobial resistance (AMR) gene detection, metagenomic classification of unknown pathogens, and real-time genomic surveillance dashboards. The layer includes both data repositories (GISAID, GenBank) and analytical platforms (Nextstrain, CZ ID). Most platforms are open-source or open-access, maintained by academic consortia and research institutions.',
    keyCapabilities: ['Whole-genome sequence analysis and annotation','Phylogenetic tree reconstruction and visualisation','Real-time pathogen evolution tracking','Antimicrobial resistance gene detection','Metagenomic pathogen identification','Consensus sequence generation and variant calling','Lineage assignment and nomenclature','Genomic epidemiology integration with case data'],
    keyOrgs: ['NCBI / NIH','Wellcome Sanger Institute','GISAID Initiative','Chan Zuckerberg Initiative','European Bioinformatics Institute (EMBL-EBI)']
  },
  L3_Defense: {
    code:'L3', shortLabel:'Defense', fullLabel:'L3 \u2014 Biodefense & Threat Intelligence',
    color:'#ef4444', bg:'rgba(239,68,68,0.08)', border:'rgba(239,68,68,0.3)', icon:'fa-shield-alt',
    desc:'Biodefense, threat assessment, risk modeling, environmental monitoring, and early-warning systems. Platforms in this layer support military and civilian biodefense operations, including threat intelligence fusion, biological risk assessment, and environmental sampling networks.',
    scope:'L3 bridges civilian public health and military/intelligence biosurveillance. Platforms here integrate signals intelligence, environmental sampling data, epidemiological reports, and open-source intelligence (OSINT) to detect deliberate or natural biological threats. Many are operated by defence agencies (DoD, DTRA, DARPA) or international security organisations (NATO, EU HERA). This layer also includes countermeasure development platforms (BARDA PHEMCE) and preparedness assessment tools (JEE, GHSI). Access is frequently restricted, with military classification levels for some systems.',
    keyCapabilities: ['Biological threat detection and early warning','Multi-source intelligence fusion (OSINT, SIGINT, epi data)','Environmental sampling and BioWatch-type surveillance','Risk modelling and consequence assessment','Countermeasure development pipeline tracking','Military force health protection','Bioterrorism preparedness assessment','International Health Regulation compliance monitoring'],
    keyOrgs: ['US Department of Defense (DoD)','DTRA','DARPA','BARDA','NATO','EU HERA']
  },
  L4_CBRN_Operational: {
    code:'L4a', shortLabel:'CBRN Operational', fullLabel:'L4a \u2014 CBRN Operational Platforms',
    color:'#f59e0b', bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.3)', icon:'fa-radiation',
    desc:'Chemical, Biological, Radiological, and Nuclear operational platforms for detection, consequence modelling, incident management, and interagency coordination. These 20 platforms represent the specialized tools used by CBRN response units, NATO forces, and civil protection agencies.',
    scope:'L4a is the most operationally critical layer in the PSEF taxonomy. These platforms provide real-time detection, warning, and reporting (DWR) for CBRN hazards; consequence modelling and plume dispersion prediction; incident command and coordination; and sensor data aggregation from field-deployed detectors. Half of these platforms have military origins or dual-use designation. NATO interoperability (ATP-45, ADatP-3) is a key differentiator. The layer includes the only platforms capable of integrated all-hazard (C+B+R+N) response.',
    keyCapabilities: ['CBRN detection, warning, and reporting (DWR)','Atmospheric dispersion and plume modelling','Consequence assessment and protective action zones','Sensor data aggregation and fusion','NATO ATP-45 and STANAG compliance','Incident command and coordination','Radiological dose estimation','Chemical hazard prediction (CW agents, TICs)'],
    keyOrgs: ['NATO CBRN Centres of Excellence','IAEA','CTBTO','National CBRN Response Units','Civil Protection Agencies']
  },
  L4_Hardware: {
    code:'L4b', shortLabel:'Hardware', fullLabel:'L4b \u2014 Hardware & Sensor Systems',
    color:'#8b5cf6', bg:'rgba(139,92,246,0.08)', border:'rgba(139,92,246,0.3)', icon:'fa-microchip',
    desc:'Physical sensor systems, laboratory instruments, field-deployable detection devices, and point-of-care diagnostics. Hardware platforms that generate the raw data feeding into software analysis layers, including PCR instruments, biosensors, and radiation monitors.',
    scope:'L4b represents the physical detection and diagnostic layer. These are the instruments and sensor systems that generate the raw signals feeding into all other analysis layers. Platforms range from rapid field-deployable biothreat identifiers (BioFire FilmArray) to advanced mass spectrometry systems (Bruker CBRNE Detection) and next-generation sequencing hardware (Oxford Nanopore MinION). All platforms in this layer are classified as military/biodefense, reflecting their critical role in force protection and first-responder operations. Hardware platforms are evaluated on sensitivity, specificity, time-to-result, portability, and integration with software C2 systems.',
    keyCapabilities: ['Rapid multiplex biothreat identification','Point-of-care molecular diagnostics','Field-deployable aerosol sampling and detection','Mass spectrometry-based agent identification','Next-generation sequencing for unknown pathogen ID','Radiation detection and dose measurement','Continuous air monitoring for biological agents','Integration with C2 and reporting systems'],
    keyOrgs: ['BioFire Defense (bioMerieux)','Smiths Detection','Bruker','Oxford Nanopore Technologies','Cepheid/Danaher']
  },
  L5_Policy: {
    code:'L5', shortLabel:'Policy', fullLabel:'L5 \u2014 Policy & Governance Frameworks',
    color:'#ec4899', bg:'rgba(236,72,153,0.08)', border:'rgba(236,72,153,0.3)', icon:'fa-gavel',
    desc:'International health regulations, preparedness indices, compliance frameworks, and governance standards. This layer captures the policy instruments and evaluation frameworks that shape national and international biosurveillance capacity.',
    scope:'L5 platforms are the governance and policy evaluation layer of the biosurveillance ecosystem. Rather than processing surveillance data directly, these platforms assess national and international preparedness, track research funding flows, evaluate IHR compliance, and provide composite indices used by policy-makers to prioritise investment and reform. The GHS Index is the most widely cited global preparedness assessment. JEE evaluations drive national action plans. CEPI\u2019s PPX engine applies AI to pandemic preparedness R&D prioritisation. This layer is small (5 platforms) but disproportionately influential in shaping the policy environment within which all other layers operate.',
    keyCapabilities: ['National health security capacity assessment','IHR (2005) compliance evaluation','Pandemic preparedness index generation','Research funding landscape mapping','Policy gap identification and reform prioritisation','Multi-stakeholder governance coordination','Biological Weapons Convention compliance tracking','AI-powered R&D prioritisation'],
    keyOrgs: ['WHO','Nuclear Threat Initiative (NTI)','Johns Hopkins Center for Health Security','CEPI','US Federal Select Agent Program']
  }
};

function bmRenderLayer(layerKey) {
  var lm = bmLayerMeta[layerKey];
  if(!lm) return '<p style="color:#ef4444">Layer not found</p>';

  // Filter platforms for this layer
  var platforms = (benchData.all_platforms||[]).filter(function(p){return p.l===layerKey;});
  platforms.sort(function(a,b){return b.s-a.s});

  // Deep profile lookup
  var deepNames = {};
  benchData.platforms.forEach(function(p){deepNames[p.n]=true;});

  // Statistics
  var count = platforms.length;
  var scores = platforms.map(function(p){return p.s});
  var avgScore = count ? (scores.reduce(function(a,b){return a+b},0)/count).toFixed(1) : '0';
  var minScore = count ? Math.min.apply(null, scores) : 0;
  var maxScore = count ? Math.max.apply(null, scores) : 0;
  var militaryCount = platforms.filter(function(p){return p.military_biodefense}).length;
  var deepCount = platforms.filter(function(p){return deepNames[p.n]}).length;
  var topP = platforms[0] || {n:'\u2014',s:0};
  var botP = platforms[platforms.length-1] || {n:'\u2014',s:0};

  // Tier distribution
  var excellent = scores.filter(function(s){return s>=90}).length;
  var good = scores.filter(function(s){return s>=80 && s<90}).length;
  var adequate = scores.filter(function(s){return s>=70 && s<80}).length;
  var developing = scores.filter(function(s){return s<70}).length;

  // Biosurveillance classification breakdown
  var bioClasses = {};
  platforms.forEach(function(p){
    var bc = p.biosurveillance_class || 'unknown';
    bioClasses[bc] = (bioClasses[bc]||0)+1;
  });
  var bioClassKeys = Object.keys(bioClasses).sort(function(a,b){return bioClasses[b]-bioClasses[a]});

  // Primary input types
  var inputTypes = {};
  platforms.forEach(function(p){
    var pit = p.primary_input_type || 'unknown';
    inputTypes[pit] = (inputTypes[pit]||0)+1;
  });
  var inputKeys = Object.keys(inputTypes).sort(function(a,b){return inputTypes[b]-inputTypes[a]});

  // Category breakdown
  var categories = {};
  platforms.forEach(function(p){
    categories[p.c] = (categories[p.c]||0)+1;
  });
  var catKeys = Object.keys(categories).sort(function(a,b){return categories[b]-categories[a]});

  // Surveillance input types aggregation
  var survInputs = {};
  platforms.forEach(function(p){
    (p.surveillance_input_types||[]).forEach(function(t){survInputs[t]=(survInputs[t]||0)+1;});
  });
  var survKeys = Object.keys(survInputs).sort(function(a,b){return survInputs[b]-survInputs[a]});

  // Dimension averages for the layer
  var dimKeys = (benchData.dimensions||[]).map(function(d){return d.key});
  var dimAvgs = {};
  dimKeys.forEach(function(dk) {
    var vals = platforms.map(function(p){return (p.sc||{})[dk]||0}).filter(function(v){return v>0});
    dimAvgs[dk] = vals.length ? (vals.reduce(function(a,b){return a+b},0)/vals.length).toFixed(1) : '0';
  });

  // Build bio class bars
  var bioClassHtml = bioClassKeys.map(function(bc) {
    var cnt = bioClasses[bc];
    var pct = Math.round(cnt/count*100);
    var label = bc.replace(/_/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase()});
    return '<div class="bm-layer-bar"><span class="bm-layer-bar-label">'+label+'</span><div class="bm-layer-bar-track"><div class="bm-layer-bar-fill" style="width:'+pct+'%;background:'+lm.color+'"></div></div><span class="bm-layer-bar-val" style="color:'+lm.color+'">'+cnt+'</span></div>';
  }).join('');

  // Build input type bars
  var inputHtml = inputKeys.map(function(it) {
    var cnt = inputTypes[it];
    var pct = Math.round(cnt/count*100);
    var label = it.replace(/_/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase()});
    return '<div class="bm-layer-bar"><span class="bm-layer-bar-label">'+label+'</span><div class="bm-layer-bar-track"><div class="bm-layer-bar-fill" style="width:'+pct+'%;background:#a78bfa"></div></div><span class="bm-layer-bar-val" style="color:#a78bfa">'+cnt+'</span></div>';
  }).join('');

  // Build category breakdown
  var catHtml = catKeys.slice(0,12).map(function(cat) {
    var cnt = categories[cat];
    var pct = Math.round(cnt/count*100);
    return '<div class="bm-layer-bar"><span class="bm-layer-bar-label" title="'+cat+'">'+bmTrunc(cat,35)+'</span><div class="bm-layer-bar-track"><div class="bm-layer-bar-fill" style="width:'+pct+'%;background:#38bdf8"></div></div><span class="bm-layer-bar-val" style="color:#38bdf8">'+cnt+'</span></div>';
  }).join('');

  // Build surveillance input types
  var survHtml = survKeys.slice(0,15).map(function(si) {
    var cnt = survInputs[si];
    var pct = Math.round(cnt/count*100);
    return '<div class="bm-layer-bar"><span class="bm-layer-bar-label" title="'+si+'">'+bmTrunc(si.replace(/_/g,' '),30)+'</span><div class="bm-layer-bar-track"><div class="bm-layer-bar-fill" style="width:'+Math.min(pct,100)+'%;background:#22c55e"></div></div><span class="bm-layer-bar-val" style="color:#22c55e">'+cnt+'</span></div>';
  }).join('');

  // Build dimension averages
  var dimAvgHtml = (benchData.dimensions||[]).map(function(d) {
    var v = parseFloat(dimAvgs[d.key]) || 0;
    return '<div class="bm-layer-bar"><span class="bm-layer-bar-label">'+d.label+'</span><div class="bm-layer-bar-track"><div class="bm-layer-bar-fill" style="width:'+v+'%;background:'+bmScoreColor(v)+'"></div></div><span class="bm-layer-bar-val" style="color:'+bmScoreColor(v)+'">'+dimAvgs[d.key]+'</span></div>';
  }).join('');

  // Build tier mini bar
  var tierHtml = [
    {label:'Excellent', range:'90\u2013100', color:'#22c55e', count:excellent},
    {label:'Good', range:'80\u201389', color:'#38bdf8', count:good},
    {label:'Adequate', range:'70\u201379', color:'#f59e0b', count:adequate},
    {label:'Developing', range:'<70', color:'#ef4444', count:developing}
  ].map(function(t) {
    var pct = count ? Math.round(t.count/count*100) : 0;
    return '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">' +
      '<span style="font-size:11px;color:'+t.color+';width:90px;flex-shrink:0;font-weight:600">'+t.label+' <span style="color:#64748b;font-weight:400">('+t.range+')</span></span>' +
      '<div style="flex:1;background:#334155;border-radius:999px;height:10px;overflow:hidden"><div style="height:10px;border-radius:999px;width:'+pct+'%;background:'+t.color+'"></div></div>' +
      '<span style="font-size:12px;font-family:monospace;font-weight:700;width:40px;text-align:right;color:'+t.color+'">'+t.count+'</span>' +
    '</div>';
  }).join('');

  // Build key capabilities
  var capsHtml = (lm.keyCapabilities||[]).map(function(c) {
    return '<li style="display:flex;align-items:flex-start;gap:8px;font-size:12.5px;color:#cbd5e1;margin-bottom:6px;line-height:1.6"><span style="color:'+lm.color+';margin-top:2px;flex-shrink:0"><i class="fas fa-check-circle" style="font-size:10px"></i></span>'+c+'</li>';
  }).join('');

  // Build key organisations
  var orgsHtml = (lm.keyOrgs||[]).map(function(o) {
    return '<span style="display:inline-block;padding:4px 12px;border-radius:999px;font-size:11px;font-weight:600;background:'+lm.bg+';color:'+lm.color+';border:1px solid '+lm.border+';margin:2px 4px 2px 0">'+o+'</span>';
  }).join('');

  // Build platform cards
  var cards = platforms.map(function(p) {
    var hasDeep = !!deepNames[p.n];
    var full = hasDeep ? benchData.platforms.find(function(x){return x.n===p.n}) : null;
    var dr = full ? full.deep_research || {} : {};
    return '<div class="bm-card bm-glass bm-fadein" style="padding:16px;cursor:'+(hasDeep?'pointer':'default')+';border-color:'+lm.border+'"' + (hasDeep ? ' onclick="bmShowDetail(&apos;'+p.n.replace(/'/g,'&amp;apos;')+'&apos;)"' : '') + '>' +
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px">' +
        '<div style="flex:1;min-width:0">' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">' +
            '<span style="color:#64748b;font-family:monospace;font-size:11px">#'+p.r+'</span>' +
            bmLayerBadge(p.l) +
            (p.military_biodefense ? '<span style="padding:2px 6px;border-radius:4px;font-size:9px;font-weight:700;background:rgba(239,68,68,0.15);color:#ef4444;border:1px solid rgba(239,68,68,0.3)"><i class="fas fa-user-shield" style="margin-right:2px"></i>MIL</span>' : '') +
          '</div>' +
          '<h3 style="color:#fff;font-weight:700;font-size:14px;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+p.n+'</h3>' +
          '<p style="color:#94a3b8;font-size:11px;margin:4px 0 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+p.c+'</p>' +
        '</div>' +
        bmScoreRing(p.s,56) +
      '</div>' +
      '<p style="color:#cbd5e1;font-size:11px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">'+p.d+'</p>' +
      (dr.executive_summary ? '<p style="color:#94a3b8;font-size:10px;line-height:1.5;margin-top:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-style:italic">'+bmTrunc(dr.executive_summary,150)+'</p>' : '') +
      '<div style="display:flex;align-items:center;gap:6px;margin-top:8px;flex-wrap:wrap">' +
        '<span style="font-size:9px;padding:2px 6px;border-radius:4px;background:rgba(100,116,139,0.15);color:#94a3b8;border:1px solid rgba(100,116,139,0.2)">'+(p.primary_input_type||'').replace(/_/g,' ')+'</span>' +
        '<span style="font-size:9px;padding:2px 6px;border-radius:4px;background:'+lm.bg+';color:'+lm.color+';border:1px solid '+lm.border+'">'+(p.biosurveillance_class||'').replace(/_/g,' ')+'</span>' +
      '</div>' +
      (hasDeep ? '<div style="margin-top:8px;font-size:10px;color:#38bdf8"><i class="fas fa-microscope" style="margin-right:4px"></i>Deep profile available</div>' : '') +
      // Mini dimension bars
      '<div style="margin-top:10px;border-top:1px solid rgba(51,65,85,0.5);padding-top:8px">' +
        (function(){
          var sc = p.sc || {};
          var dimTop3 = Object.keys(sc).sort(function(a,b){return sc[b]-sc[a]}).slice(0,3);
          return dimTop3.map(function(dk) {
            var v = sc[dk];
            var label = dk.replace(/_/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase()});
            return '<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px"><span style="font-size:9px;color:#64748b;width:100px;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+label+'</span><div style="flex:1;background:#1e293b;border-radius:999px;height:4px;overflow:hidden"><div style="height:4px;border-radius:999px;width:'+v+'%;background:'+bmScoreColor(v)+'"></div></div><span style="font-size:9px;font-family:monospace;color:'+bmScoreColor(v)+'">'+v+'</span></div>';
          }).join('');
        })() +
      '</div>' +
    '</div>';
  }).join('');

  // Build top 5 platform table
  var top5 = platforms.slice(0,5);
  var top5Html = top5.map(function(p, i) {
    var hasDeep = !!deepNames[p.n];
    return '<tr style="border-bottom:1px solid rgba(51,65,85,0.3);cursor:'+(hasDeep?'pointer':'default')+';transition:background 0.15s" onmouseover="this.style.background=&apos;rgba(51,65,85,0.25)&apos;" onmouseout="this.style.background=&apos;transparent&apos;"' + (hasDeep ? ' onclick="bmShowDetail(&apos;'+p.n.replace(/'/g,'&amp;apos;')+'&apos;)"' : '') + '>' +
      '<td style="padding:10px 8px;font-family:monospace;color:'+lm.color+';font-weight:700;font-size:14px">'+(i+1)+'</td>' +
      '<td style="padding:10px 8px"><div style="color:#fff;font-weight:600;font-size:13px">'+p.n+'</div><div style="color:#64748b;font-size:10px;margin-top:2px">'+p.c+'</div></td>' +
      '<td style="padding:10px 8px;text-align:center">'+bmScoreRing(p.s,44)+'</td>' +
      '<td style="padding:10px 8px;font-size:11px;color:#94a3b8">'+(p.primary_input_type||'').replace(/_/g,' ')+'</td>' +
      '<td style="padding:10px 8px">'+(p.military_biodefense ? '<span style="font-size:9px;padding:2px 6px;border-radius:4px;background:rgba(239,68,68,0.15);color:#ef4444;border:1px solid rgba(239,68,68,0.3)">Military</span>' : '<span style="font-size:9px;color:#64748b">Civilian</span>')+'</td>' +
      '<td style="padding:10px 8px">'+(hasDeep ? '<span style="font-size:9px;color:#38bdf8"><i class="fas fa-microscope"></i> Deep</span>' : '<span style="font-size:9px;color:#475569">Standard</span>')+'</td>' +
    '</tr>';
  }).join('');

  // Build the layer radar from dimension averages (as object)
  var dimAvgObj = {};
  dimKeys.forEach(function(dk){ dimAvgObj[dk] = parseFloat(dimAvgs[dk])||0; });

  // Build complete view
  return '<div class="bm-fadein">' +

    // === HEADER BANNER ===
    '<div class="bm-glass" style="padding:28px;margin-bottom:24px;border-color:'+lm.border+'">' +
      '<div style="display:flex;align-items:center;gap:16px;margin-bottom:16px">' +
        '<div style="width:56px;height:56px;border-radius:14px;background:'+lm.bg+';border:2px solid '+lm.border+';display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="fas '+lm.icon+'" style="color:'+lm.color+';font-size:24px"></i></div>' +
        '<div style="flex:1"><h2 style="font-size:22px;font-weight:800;margin:0;color:'+lm.color+'">'+lm.fullLabel+'</h2><p style="font-size:13px;color:#94a3b8;margin:4px 0 0">'+count+' platforms evaluated \u2022 Scores: '+minScore+' \u2013 '+maxScore+' \u2022 Mean: '+avgScore+'</p></div>' +
        '<div style="text-align:center"><div style="font-size:42px;font-weight:800;color:'+lm.color+';font-family:monospace;line-height:1">'+count+'</div><div style="font-size:10px;color:#64748b;margin-top:4px">Platforms</div></div>' +
      '</div>' +
      '<p style="color:#e2e8f0;font-size:13.5px;line-height:1.8;margin:0">'+lm.desc+'</p>' +
    '</div>' +

    // === KPI CARDS ===
    '<div class="bm-kpi-grid" style="display:grid;grid-template-columns:repeat(6,1fr);gap:14px;margin-bottom:24px">' +
      '<div class="bm-glass bm-layer-stat-card" style="border-color:'+lm.border+'"><div style="font-size:28px;font-weight:800;color:'+lm.color+';font-family:monospace">'+count+'</div><div style="font-size:10px;color:#94a3b8;margin-top:4px">Total Platforms</div></div>' +
      '<div class="bm-glass bm-layer-stat-card"><div style="font-size:28px;font-weight:800;color:#38bdf8;font-family:monospace">'+avgScore+'</div><div style="font-size:10px;color:#94a3b8;margin-top:4px">Average Score</div></div>' +
      '<div class="bm-glass bm-layer-stat-card"><div style="font-size:28px;font-weight:800;color:#22c55e;font-family:monospace">'+maxScore+'</div><div style="font-size:10px;color:#94a3b8;margin-top:4px">Highest</div><div style="font-size:9px;color:#64748b;margin-top:2px">'+bmTrunc(topP.n,18)+'</div></div>' +
      '<div class="bm-glass bm-layer-stat-card"><div style="font-size:28px;font-weight:800;color:#ef4444;font-family:monospace">'+minScore+'</div><div style="font-size:10px;color:#94a3b8;margin-top:4px">Lowest</div><div style="font-size:9px;color:#64748b;margin-top:2px">'+bmTrunc(botP.n,18)+'</div></div>' +
      '<div class="bm-glass bm-layer-stat-card"><div style="font-size:28px;font-weight:800;color:#a78bfa;font-family:monospace">'+deepCount+'</div><div style="font-size:10px;color:#94a3b8;margin-top:4px">Deep Profiles</div></div>' +
      '<div class="bm-glass bm-layer-stat-card"><div style="font-size:28px;font-weight:800;color:'+(militaryCount>0?'#ef4444':'#64748b')+';font-family:monospace">'+militaryCount+'</div><div style="font-size:10px;color:#94a3b8;margin-top:4px">Military/Biodefense</div></div>' +
    '</div>' +

    // === SCOPE & CAPABILITIES (2 columns) ===
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px" class="bm-detail-grid2">' +
      // Scope
      '<div class="bm-glass" style="padding:20px">' +
        '<h3 style="font-size:14px;font-weight:700;color:#fff;margin:0 0 12px"><i class="fas fa-crosshairs" style="margin-right:8px;color:'+lm.color+'"></i>Scope & Coverage</h3>' +
        '<p style="color:#cbd5e1;font-size:12.5px;line-height:1.8;margin:0 0 16px">'+lm.scope+'</p>' +
        '<div style="border-top:1px solid rgba(51,65,85,0.5);padding-top:14px"><div style="font-size:10px;color:#64748b;font-weight:600;text-transform:uppercase;margin-bottom:10px;letter-spacing:0.5px">Key Organisations</div>'+orgsHtml+'</div>' +
      '</div>' +
      // Key Capabilities
      '<div class="bm-glass" style="padding:20px">' +
        '<h3 style="font-size:14px;font-weight:700;color:#fff;margin:0 0 12px"><i class="fas fa-cogs" style="margin-right:8px;color:'+lm.color+'"></i>Key Capabilities</h3>' +
        '<ul style="margin:0;padding:0;list-style:none">'+capsHtml+'</ul>' +
      '</div>' +
    '</div>' +

    // === TOP 5 TABLE ===
    '<div class="bm-glass" style="padding:20px;margin-bottom:24px">' +
      '<h3 style="font-size:14px;font-weight:700;color:#fff;margin:0 0 16px"><i class="fas fa-trophy" style="margin-right:8px;color:'+lm.color+'"></i>Top 5 Platforms in '+lm.shortLabel+'</h3>' +
      '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse">' +
        '<thead><tr style="border-bottom:2px solid '+lm.border+'"><th style="padding:8px;text-align:left;font-size:11px;color:#64748b;font-weight:600">#</th><th style="padding:8px;text-align:left;font-size:11px;color:#64748b;font-weight:600">Platform</th><th style="padding:8px;text-align:center;font-size:11px;color:#64748b;font-weight:600">Score</th><th style="padding:8px;text-align:left;font-size:11px;color:#64748b;font-weight:600">Input Type</th><th style="padding:8px;text-align:left;font-size:11px;color:#64748b;font-weight:600">Domain</th><th style="padding:8px;text-align:left;font-size:11px;color:#64748b;font-weight:600">Profile</th></tr></thead>' +
        '<tbody>'+top5Html+'</tbody>' +
      '</table></div>' +
    '</div>' +

    // === TIER DISTRIBUTION ===
    '<div class="bm-glass" style="padding:20px;margin-bottom:24px">' +
      '<h3 style="font-size:14px;font-weight:700;color:#fff;margin:0 0 16px"><i class="fas fa-medal" style="margin-right:8px;color:'+lm.color+'"></i>Tier Distribution</h3>' +
      tierHtml +
    '</div>' +

    // === SCORE DISTRIBUTION CHART ===
    '<div class="bm-glass" style="padding:20px;margin-bottom:24px">' +
      '<h3 style="font-size:14px;font-weight:700;color:#fff;margin:0 0 16px"><i class="fas fa-chart-bar" style="margin-right:8px;color:'+lm.color+'"></i>Score Distribution \u2014 '+count+' '+lm.shortLabel+' Platforms</h3>' +
      '<div style="overflow-x:auto;text-align:center">'+bmScoreDistribution(platforms, 700)+'</div>' +
    '</div>' +

    // === ANALYTICS GRID (4 panels) ===
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px" class="bm-detail-grid2">' +
      // Biosurveillance Classification
      '<div class="bm-glass" style="padding:20px">' +
        '<h3 style="font-size:13px;font-weight:700;color:#fff;margin:0 0 14px"><i class="fas fa-biohazard" style="margin-right:8px;color:'+lm.color+'"></i>Biosurveillance Classification</h3>' +
        bioClassHtml +
      '</div>' +
      // Primary Input Types
      '<div class="bm-glass" style="padding:20px">' +
        '<h3 style="font-size:13px;font-weight:700;color:#fff;margin:0 0 14px"><i class="fas fa-tag" style="margin-right:8px;color:#a78bfa"></i>Primary Input Types</h3>' +
        inputHtml +
      '</div>' +
      // Functional Categories
      '<div class="bm-glass" style="padding:20px">' +
        '<h3 style="font-size:13px;font-weight:700;color:#fff;margin:0 0 14px"><i class="fas fa-folder-open" style="margin-right:8px;color:#38bdf8"></i>Functional Categories</h3>' +
        catHtml +
      '</div>' +
      // Surveillance Input Coverage
      '<div class="bm-glass" style="padding:20px">' +
        '<h3 style="font-size:13px;font-weight:700;color:#fff;margin:0 0 14px"><i class="fas fa-signal" style="margin-right:8px;color:#22c55e"></i>Surveillance Input Coverage</h3>' +
        (survKeys.length > 0 ? survHtml : '<p style="color:#64748b;font-size:12px;font-style:italic">No detailed surveillance input data available</p>') +
      '</div>' +
    '</div>' +

    // === DIMENSION AVERAGES ===
    '<div class="bm-glass" style="padding:20px;margin-bottom:24px">' +
      '<h3 style="font-size:14px;font-weight:700;color:#fff;margin:0 0 6px"><i class="fas fa-ruler-combined" style="margin-right:8px;color:'+lm.color+'"></i>Average Dimension Scores \u2014 '+lm.shortLabel+' Layer</h3>' +
      '<p style="color:#64748b;font-size:11px;margin:0 0 16px">Mean scores across all '+count+' platforms in this layer for each of the 10 PSEF evaluation dimensions</p>' +
      '<div style="display:grid;grid-template-columns:1fr 260px;gap:24px;align-items:start" class="bm-detail-scores">' +
        '<div>'+dimAvgHtml+'</div>' +
        '<div style="text-align:center"><div style="font-size:11px;color:#94a3b8;margin-bottom:8px;font-weight:600">Layer Radar Profile</div>'+bmRadarChart(dimAvgObj, benchData.dimensions || [], 260)+'</div>' +
      '</div>' +
    '</div>' +

    // === HEATMAP (top platforms) ===
    (platforms.length > 1 ? '<div class="bm-glass" style="padding:20px;margin-bottom:24px">' +
      '<h3 style="font-size:14px;font-weight:700;color:#fff;margin:0 0 16px"><i class="fas fa-th" style="margin-right:8px;color:'+lm.color+'"></i>10-Dimension Heatmap \u2014 Top '+Math.min(platforms.length,15)+' Platforms</h3>' +
      bmHeatmap(platforms.slice(0,15).map(function(p){return {n:p.n,s:p.s,sc:p.sc,l:p.l,c:p.c}}), benchData.dimensions || []) +
    '</div>' : '') +

    // === ALL PLATFORM CARDS ===
    '<h3 style="font-size:15px;font-weight:700;color:#fff;margin:0 0 16px"><i class="fas '+lm.icon+'" style="margin-right:8px;color:'+lm.color+'"></i>All '+count+' '+lm.fullLabel+' Platforms</h3>' +
    '<div class="bm-cards-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px">' +
      cards +
    '</div>' +

    // === NAVIGATION CTA ===
    '<div style="text-align:center;margin-bottom:40px;padding:24px">' +
      '<button onclick="bmShowView(&apos;about&apos;)" class="bm-tab" style="padding:10px 24px;font-size:13px;font-weight:600;border-radius:10px;border:1px solid rgba(56,189,248,0.3);color:#38bdf8"><i class="fas fa-book-open" style="margin-right:6px"></i>About PSEF</button>' +
      '<span style="margin:0 10px;color:#475569">|</span>' +
      '<button onclick="bmShowView(&apos;overview&apos;)" class="bm-tab" style="padding:10px 24px;font-size:13px;font-weight:600;border-radius:10px;border:1px solid rgba(56,189,248,0.3);color:#38bdf8"><i class="fas fa-chart-bar" style="margin-right:6px"></i>Overview</button>' +
      '<span style="margin:0 10px;color:#475569">|</span>' +
      '<button onclick="bmShowView(&apos;allplatforms&apos;)" class="bm-tab" style="padding:10px 24px;font-size:13px;font-weight:600;border-radius:10px;border:1px solid rgba(56,189,248,0.3);color:#38bdf8"><i class="fas fa-th-list" style="margin-right:6px"></i>All 189 Platforms</button>' +
    '</div>' +

  '</div>';
}

// ===== CBRN OPERATIONAL VIEW =====
function bmRenderCBRN() {
  var cbrn = (benchData.all_platforms||[]).filter(function(p){return p.l==='L4_CBRN_Operational'});
  cbrn.sort(function(a,b){return b.s-a.s});
  var deepNames = {};
  benchData.platforms.forEach(function(p){deepNames[p.n]=true;});
  var avgScore = cbrn.length?(cbrn.reduce(function(a,p){return a+p.s},0)/cbrn.length).toFixed(1):'0';
  var maxP = cbrn[0]||{n:'—',s:0};
  var minP = cbrn[cbrn.length-1]||{n:'—',s:0};

  // Build cards for each CBRN platform
  var cards = cbrn.map(function(p) {
    var full = benchData.platforms.find(function(x){return x.n===p.n});
    var dr = full?full.deep_research:{};
    var hasDeep = !!full;
    return '<div class="bm-card bm-glass bm-fadein" style="padding:16px;cursor:pointer;border-color:rgba(245,158,11,0.2)"' + (hasDeep ? ' onclick="bmShowDetail(&apos;'+p.n.replace(/'/g,'&amp;apos;')+'&apos;)"' : '') + '>' +
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px">' +
        '<div style="flex:1;min-width:0">' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span style="color:#64748b;font-family:monospace;font-size:11px">#'+p.r+'</span>'+bmLayerBadge(p.l)+(p.military_biodefense?'<span style="padding:2px 6px;border-radius:4px;font-size:9px;font-weight:700;background:rgba(239,68,68,0.15);color:#ef4444;border:1px solid rgba(239,68,68,0.3)"><i class="fas fa-user-shield" style="margin-right:2px"></i>MILITARY</span>':'')+'</div>' +
          '<h3 style="color:#fff;font-weight:700;font-size:14px;margin:0">'+p.n+'</h3>' +
          '<p style="color:#94a3b8;font-size:11px;margin:4px 0 0">'+p.c+'</p>' +
        '</div>' +
        bmScoreRing(p.s,56) +
      '</div>' +
      '<p style="color:#cbd5e1;font-size:11px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">'+p.d+'</p>' +
      (dr&&dr.executive_summary?'<p style="color:#94a3b8;font-size:10px;line-height:1.5;margin-top:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-style:italic">'+bmTrunc(dr.executive_summary,150)+'</p>':'') +
      '<div style="display:flex;align-items:center;gap:8px;margin-top:8px;flex-wrap:wrap">' +
        (p.surveillance_input_types||[]).slice(0,4).map(function(t){return '<span style="font-size:9px;padding:2px 6px;border-radius:4px;background:rgba(245,158,11,0.1);color:#f59e0b;border:1px solid rgba(245,158,11,0.2)">'+t+'</span>'}).join('') +
      '</div>' +
      (hasDeep?'<div style="margin-top:8px;font-size:10px;color:#38bdf8"><i class="fas fa-microscope" style="margin-right:4px"></i>Deep profile available</div>':'') +
    '</div>';
  }).join('');

  // CBRN summary from meta
  var summary = (benchData.meta&&benchData.meta.cbrn_summary)||'';
  var summaryHtml = '';
  if(summary) {
    summaryHtml = '<div class="bm-glass" style="padding:20px;margin-bottom:24px;border-color:rgba(245,158,11,0.3)">' +
      '<h3 style="font-size:13px;font-weight:600;color:#f59e0b;margin:0 0 12px"><i class="fas fa-file-alt" style="margin-right:8px"></i>CBRN Executive Summary</h3>' +
      '<p style="color:#cbd5e1;font-size:13px;line-height:1.7;margin:0">'+summary+'</p></div>';
  }

  // Build stacked bar showing input types across CBRN platforms
  var inputCounts = {};
  cbrn.forEach(function(p){(p.surveillance_input_types||[]).forEach(function(t){inputCounts[t]=(inputCounts[t]||0)+1})});
  var inputHtml = Object.keys(inputCounts).sort(function(a,b){return inputCounts[b]-inputCounts[a]}).map(function(t) {
    var pct = Math.round(inputCounts[t]/cbrn.length*100);
    return '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px"><span style="font-size:11px;color:#94a3b8;width:120px;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+t+'</span><div style="flex:1;background:#334155;border-radius:999px;height:8px;overflow:hidden"><div style="height:8px;border-radius:999px;width:'+pct+'%;background:#f59e0b"></div></div><span style="font-size:11px;color:#f59e0b;font-weight:600;width:24px;text-align:right">'+inputCounts[t]+'</span></div>';
  }).join('');

  return '<div class="bm-fadein">' +
    '<div class="bm-kpi-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px">' +
      '<div class="bm-glass" style="padding:16px;text-align:center;border-color:rgba(245,158,11,0.3)"><div style="font-size:28px;font-weight:700;color:#f59e0b">'+cbrn.length+'</div><div style="font-size:11px;color:#94a3b8;margin-top:4px">CBRN Platforms</div></div>' +
      '<div class="bm-glass" style="padding:16px;text-align:center"><div style="font-size:28px;font-weight:700;color:#38bdf8">'+avgScore+'</div><div style="font-size:11px;color:#94a3b8;margin-top:4px">Avg Score</div></div>' +
      '<div class="bm-glass" style="padding:16px;text-align:center"><div style="font-size:28px;font-weight:700;color:#22c55e">'+maxP.s+'</div><div style="font-size:11px;color:#94a3b8;margin-top:4px">Highest ('+bmTrunc(maxP.n,15)+')</div></div>' +
      '<div class="bm-glass" style="padding:16px;text-align:center"><div style="font-size:28px;font-weight:700;color:#ef4444">'+minP.s+'</div><div style="font-size:11px;color:#94a3b8;margin-top:4px">Lowest ('+bmTrunc(minP.n,15)+')</div></div>' +
    '</div>' +
    summaryHtml +
    '<div class="bm-glass" style="padding:20px;margin-bottom:24px"><h3 style="font-size:13px;font-weight:600;color:#cbd5e1;margin:0 0 16px"><i class="fas fa-signal" style="margin-right:8px;color:#f59e0b"></i>Surveillance Input Coverage</h3>'+inputHtml+'</div>' +
    '<div class="bm-glass" style="padding:20px;margin-bottom:24px"><h3 style="font-size:13px;font-weight:600;color:#cbd5e1;margin:0 0 16px"><i class="fas fa-chart-bar" style="margin-right:8px;color:#f59e0b"></i>CBRN Score Distribution</h3><div style="overflow-x:auto;text-align:center">'+bmScoreDistribution(cbrn, 700)+'</div></div>' +
    '<h3 style="font-size:14px;font-weight:600;color:#cbd5e1;margin:0 0 16px"><i class="fas fa-radiation" style="margin-right:8px;color:#f59e0b"></i>All '+cbrn.length+' CBRN Operational Platforms</h3>' +
    '<div class="bm-cards-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">'+cards+'</div>' +
  '</div>';
}

// ===== ALL 189 PLATFORMS VIEW =====
var bmSearchTerm = '';
var bmSortField = 'r';
var bmSortDir = 'asc';
var bmFilterCategory = '';
var bmFilterTier = '';
var bmFilterLayer = '';

function bmRenderAllPlatforms() {
  var ap = benchData.all_platforms || [];
  var cats = {};
  var tiers = {excellent:0, good:0, adequate:0, developing:0};
  var layerCounts = {};
  ap.forEach(function(p) {
    cats[p.c] = (cats[p.c]||0)+1;
    layerCounts[p.l] = (layerCounts[p.l]||0)+1;
    if(p.s>=90) tiers.excellent++;
    else if(p.s>=80) tiers.good++;
    else if(p.s>=70) tiers.adequate++;
    else tiers.developing++;
  });
  var catOptions = Object.keys(cats).sort().map(function(c){return '<option value="'+c+'">'+c+' ('+cats[c]+')</option>'}).join('');
  var layerMeta = (benchData.meta&&benchData.meta.layers)||{};
  var layerButtons = ['L1_Surveillance','L2_Genomic','L3_Defense','L4_CBRN_Operational','L4_Hardware','L5_Policy'].map(function(l) {
    var lm = layerMeta[l]||{};
    var active = bmFilterLayer===l;
    return '<button style="padding:6px 12px;border-radius:6px;font-size:11px;font-weight:600;border:1px solid '+(active?(lm.color||'#38bdf8'):'rgba(56,189,248,0.15)')+';background:'+(active?'rgba(56,189,248,0.15)':'transparent')+';color:'+(active?(lm.color||'#fff'):'#94a3b8')+';cursor:pointer;transition:all 0.2s;font-family:inherit" onclick="bmFilterByLayer(&apos;'+l+'&apos;)"><i class="fas '+(lm.icon||'fa-circle')+'" style="margin-right:4px"></i>'+(lm.name||l)+' ('+(layerCounts[l]||0)+')</button>';
  }).join('');

  return '<div class="bm-fadein">' +
    '<div class="bm-tier-grid" style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:16px">' +
      '<div class="bm-glass" style="padding:14px;text-align:center;cursor:pointer;transition:all 0.2s;border-color:'+(bmFilterTier===''?'rgba(56,189,248,0.4)':'rgba(56,189,248,0.15)')+'" onclick="bmFilterByTier(&apos;&apos;)"><div style="font-size:24px;font-weight:700" class="bm-gradient-text">'+ap.length+'</div><div style="font-size:10px;color:#94a3b8;margin-top:2px">All Platforms</div></div>' +
      '<div class="bm-glass" style="padding:14px;text-align:center;cursor:pointer;transition:all 0.2s;border-color:'+(bmFilterTier==='excellent'?'rgba(34,197,94,0.5)':'rgba(56,189,248,0.15)')+'" onclick="bmFilterByTier(&apos;excellent&apos;)"><div style="font-size:24px;font-weight:700;color:#22c55e">'+tiers.excellent+'</div><div style="font-size:10px;color:#94a3b8;margin-top:2px">Excellent (\u226590)</div></div>' +
      '<div class="bm-glass" style="padding:14px;text-align:center;cursor:pointer;transition:all 0.2s;border-color:'+(bmFilterTier==='good'?'rgba(56,189,248,0.5)':'rgba(56,189,248,0.15)')+'" onclick="bmFilterByTier(&apos;good&apos;)"><div style="font-size:24px;font-weight:700;color:#38bdf8">'+tiers.good+'</div><div style="font-size:10px;color:#94a3b8;margin-top:2px">Good (80-89)</div></div>' +
      '<div class="bm-glass" style="padding:14px;text-align:center;cursor:pointer;transition:all 0.2s;border-color:'+(bmFilterTier==='adequate'?'rgba(245,158,11,0.5)':'rgba(56,189,248,0.15)')+'" onclick="bmFilterByTier(&apos;adequate&apos;)"><div style="font-size:24px;font-weight:700;color:#f59e0b">'+tiers.adequate+'</div><div style="font-size:10px;color:#94a3b8;margin-top:2px">Adequate (70-79)</div></div>' +
      '<div class="bm-glass" style="padding:14px;text-align:center;cursor:pointer;transition:all 0.2s;border-color:'+(bmFilterTier==='developing'?'rgba(239,68,68,0.5)':'rgba(56,189,248,0.15)')+'" onclick="bmFilterByTier(&apos;developing&apos;)"><div style="font-size:24px;font-weight:700;color:#ef4444">'+tiers.developing+'</div><div style="font-size:10px;color:#94a3b8;margin-top:2px">Developing (&lt;70)</div></div>' +
    '</div>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;align-items:center"><span style="font-size:11px;color:#64748b;font-weight:600;margin-right:4px">Layers:</span><button style="padding:6px 12px;border-radius:6px;font-size:11px;font-weight:600;border:1px solid '+(bmFilterLayer===''?'rgba(56,189,248,0.4)':'rgba(56,189,248,0.15)')+';background:'+(bmFilterLayer===''?'rgba(56,189,248,0.1)':'transparent')+';color:'+(bmFilterLayer===''?'#38bdf8':'#94a3b8')+';cursor:pointer;transition:all 0.2s;font-family:inherit" onclick="bmFilterByLayer(&apos;&apos;)">All</button>'+layerButtons+'</div>' +
    '<div class="bm-glass" style="padding:16px;margin-bottom:20px">' +
      '<div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">' +
        '<div style="flex:1;min-width:200px"><input id="bmSearch" type="text" placeholder="Search platforms..." value="'+bmSearchTerm+'" style="width:100%;padding:8px 12px;background:rgba(15,23,42,0.6);border:1px solid rgba(56,189,248,0.2);border-radius:8px;color:#e2e8f0;font-size:13px;outline:none;font-family:inherit" oninput="bmOnSearch(this.value)"></div>' +
        '<select id="bmCatFilter" style="padding:8px 12px;background:rgba(15,23,42,0.6);border:1px solid rgba(56,189,248,0.2);border-radius:8px;color:#e2e8f0;font-size:12px;outline:none;font-family:inherit;max-width:250px" onchange="bmOnCategoryFilter(this.value)"><option value="">All Categories</option>'+catOptions+'</select>' +
        '<select style="padding:8px 12px;background:rgba(15,23,42,0.6);border:1px solid rgba(56,189,248,0.2);border-radius:8px;color:#e2e8f0;font-size:12px;outline:none;font-family:inherit" onchange="bmOnSort(this.value)">' +
          '<option value="r-asc"'+(bmSortField==='r'&&bmSortDir==='asc'?' selected':'')+'>Rank (Best First)</option>' +
          '<option value="r-desc"'+(bmSortField==='r'&&bmSortDir==='desc'?' selected':'')+'>Rank (Lowest First)</option>' +
          '<option value="n-asc"'+(bmSortField==='n'&&bmSortDir==='asc'?' selected':'')+'>Name (A-Z)</option>' +
          '<option value="n-desc"'+(bmSortField==='n'&&bmSortDir==='desc'?' selected':'')+'>Name (Z-A)</option>' +
          '<option value="s-desc"'+(bmSortField==='s'&&bmSortDir==='desc'?' selected':'')+'>Score (High to Low)</option>' +
          '<option value="s-asc"'+(bmSortField==='s'&&bmSortDir==='asc'?' selected':'')+'>Score (Low to High)</option>' +
        '</select>' +
      '</div>' +
    '</div>' +
    '<div id="bmAllTable"></div>' +
  '</div>';
}

function bmInitAllPlatforms() {
  bmRenderAllTable();
}

function bmGetFilteredPlatforms() {
  var ap = benchData.all_platforms || [];
  var filtered = ap;
  if(bmSearchTerm) {
    var q = bmSearchTerm.toLowerCase();
    filtered = filtered.filter(function(p){return p.n.toLowerCase().indexOf(q)!==-1 || p.c.toLowerCase().indexOf(q)!==-1 || p.d.toLowerCase().indexOf(q)!==-1 || (p.l||'').toLowerCase().indexOf(q)!==-1 || (p.biosurveillance_class||'').toLowerCase().indexOf(q)!==-1;});
  }
  if(bmFilterCategory) {
    filtered = filtered.filter(function(p){return p.c===bmFilterCategory;});
  }
  if(bmFilterLayer) {
    filtered = filtered.filter(function(p){return p.l===bmFilterLayer;});
  }
  if(bmFilterTier) {
    filtered = filtered.filter(function(p){
      if(bmFilterTier==='excellent') return p.s>=90;
      if(bmFilterTier==='good') return p.s>=80 && p.s<90;
      if(bmFilterTier==='adequate') return p.s>=70 && p.s<80;
      if(bmFilterTier==='developing') return p.s<70;
      return true;
    });
  }
  filtered.sort(function(a,b) {
    var va = a[bmSortField], vb = b[bmSortField];
    if(typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
    if(va < vb) return bmSortDir==='asc' ? -1 : 1;
    if(va > vb) return bmSortDir==='asc' ? 1 : -1;
    return 0;
  });
  return filtered;
}

function bmRenderAllTable() {
  var filtered = bmGetFilteredPlatforms();
  var container = document.getElementById('bmAllTable');
  if(!container) return;
  var deepNames = {};
  benchData.platforms.forEach(function(p){deepNames[p.n]=true;});

  var rows = filtered.map(function(p) {
    var tierColor = p.s>=90?'#22c55e':p.s>=80?'#38bdf8':p.s>=70?'#f59e0b':'#ef4444';
    var tierLabel = p.s>=90?'Excellent':p.s>=80?'Good':p.s>=70?'Adequate':'Developing';
    var hasDeep = deepNames[p.n];
    var hasProfile = p.profile || hasDeep;
    return '<tr style="border-bottom:1px solid rgba(51,65,85,0.3);transition:background 0.15s;cursor:'+(hasProfile?'pointer':'default')+'" onmouseover="this.style.background=&apos;rgba(51,65,85,0.25)&apos;" onmouseout="this.style.background=&apos;transparent&apos;"' + (hasProfile ? ' onclick="bmShowDetail(&apos;'+p.n.replace(/'/g,'&amp;apos;')+'&apos;)"' : '') + '>' +
      '<td style="padding:10px 12px;font-family:monospace;font-size:11px;color:#64748b;text-align:center">'+p.r+'</td>' +
      '<td style="padding:10px 12px"><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><span style="font-weight:600;color:#fff;font-size:13px">'+p.n+'</span>'+(hasDeep?'<span style="font-size:9px;padding:2px 6px;border-radius:4px;background:rgba(56,189,248,0.15);color:#38bdf8;border:1px solid rgba(56,189,248,0.3);font-weight:600">DEEP</span>':'')+(p.military_biodefense?'<span style="font-size:9px;padding:2px 5px;border-radius:4px;background:rgba(239,68,68,0.15);color:#ef4444;border:1px solid rgba(239,68,68,0.3);font-weight:600"><i class="fas fa-user-shield"></i></span>':'')+'</div><div style="color:#64748b;font-size:11px;margin-top:2px">'+p.c+'</div></td>' +
      '<td style="padding:10px 12px;text-align:center">'+bmLayerBadge(p.l)+'</td>' +
      '<td style="padding:10px 12px;text-align:center"><div style="display:flex;align-items:center;justify-content:center;gap:6px"><span style="font-weight:700;font-family:monospace;font-size:14px;color:'+tierColor+'">'+p.s+'</span></div><div style="font-size:9px;color:'+tierColor+';margin-top:2px">'+tierLabel+'</div></td>' +
      '<td style="padding:10px 12px;font-size:11px;color:#94a3b8;max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+p.d+'</td>' +
      '<td style="padding:10px 12px;text-align:center">'+(p.u?'<a href="'+p.u+'" target="_blank" style="color:#38bdf8;text-decoration:none;font-size:12px" onclick="event.stopPropagation()"><i class="fas fa-external-link-alt"></i></a>':'—')+'</td>' +
    '</tr>';
  }).join('');

  container.innerHTML = '<div class="bm-glass" style="overflow:hidden">' +
    '<div style="padding:12px 16px;border-bottom:1px solid rgba(56,189,248,0.1);display:flex;align-items:center;justify-content:space-between">' +
      '<span style="font-size:13px;font-weight:600;color:#cbd5e1"><i class="fas fa-th-list" style="margin-right:8px;color:#38bdf8"></i>'+filtered.length+' of '+benchData.all_platforms.length+' platforms</span>' +
      '<span style="font-size:11px;color:#64748b">'+(bmSearchTerm||bmFilterCategory||bmFilterTier||bmFilterLayer?'Filtered':'Showing all')+'</span>' +
    '</div>' +
    '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;min-width:900px"><thead><tr style="background:rgba(51,65,85,0.4);font-size:11px;color:#94a3b8;text-transform:uppercase">' +
      '<th style="padding:10px 12px;text-align:center;width:50px">#</th>' +
      '<th style="padding:10px 12px;text-align:left">Platform</th>' +
      '<th style="padding:10px 12px;text-align:center;width:100px">Layer</th>' +
      '<th style="padding:10px 12px;text-align:center;width:80px">Score</th>' +
      '<th style="padding:10px 12px;text-align:left">Description</th>' +
      '<th style="padding:10px 12px;text-align:center;width:50px">URL</th>' +
    '</tr></thead><tbody>'+rows+'</tbody></table></div>' +
  '</div>';
}

window.bmOnSearch = function(val) {
  bmSearchTerm = val;
  bmRenderAllTable();
};
window.bmOnCategoryFilter = function(val) {
  bmFilterCategory = val;
  bmRenderAllTable();
};
window.bmOnSort = function(val) {
  var parts = val.split('-');
  bmSortField = parts[0];
  bmSortDir = parts[1];
  bmRenderAllTable();
};
window.bmFilterByTier = function(tier) {
  bmFilterTier = (bmFilterTier === tier) ? '' : tier;
  var main = document.getElementById('bmMainContent');
  main.innerHTML = bmRenderAllPlatforms();
  bmInitAllPlatforms();
};
window.bmFilterByLayer = function(layer) {
  bmFilterLayer = (bmFilterLayer === layer) ? '' : layer;
  var main = document.getElementById('bmMainContent');
  main.innerHTML = bmRenderAllPlatforms();
  bmInitAllPlatforms();
};

  `;
}
