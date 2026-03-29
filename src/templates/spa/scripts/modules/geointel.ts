// =============================================================================
// BioR Platform - GeoIntel Engine (About/Presentation, Map, 10 Layers, Controls, Legend)
// =============================================================================

export function getGeointelJS(): string {
  return `
// ===== GEOINTEL ENGINE VIEW =====
window.openGeoIntelView = function() {
  // Clean up map when leaving geointel-map view
  if (giMap) { try { giMap.remove(); } catch(e) {} giMap = null; giMapReady = false; _giMapInitializing = false; }
  state.currentView = 'geointel';
  pushSpaState();
  render();
};

window.openGeoIntelMap = function() {
  state.currentView = 'geointel-map';
  pushSpaState();
  render();
};

var giAboutView = 'about';

// ===== GeoIntel Layer metadata for presentation =====
var giLayerMeta = {
  platforms:  { label:'PSEF Platforms', icon:'fa-map-marker-alt', color:'#00A86B', border:'rgba(0,168,107,0.3)', bg:'rgba(0,168,107,0.08)', count:189, file:'geointel-platforms.json', size:'151 KB', props:['name','score','layer_name','country','url','coordinates'], desc:'The foundational layer of BioR GeoIntel. All 189 biosurveillance platforms from the PSEF benchmark dataset are geocoded to their primary operational headquarters or institutional origin. Each platform carries its composite PSEF score, 6-layer classification, and deep-research metadata. This layer enables spatial analysis of global biosurveillance capacity distribution, identifying geographic clusters, coverage gaps, and regional concentration patterns.', source:'BioR PSEF v3.1 Benchmark Dataset', methodology:'Manual geocoding from institutional addresses and official registries. Each platform verified against Google Maps, OpenStreetMap, and institutional websites. 90+ platforms required manual coordinate research beyond automated geocoding.' },
  bsl4:      { label:'BSL-4 Laboratories', icon:'fa-flask', color:'#ef4444', border:'rgba(239,68,68,0.3)', bg:'rgba(239,68,68,0.08)', count:41, file:'geointel-bsl4.json', size:'10 KB', props:['name','city','country','status','type','organization'], desc:'Maximum containment (Biosafety Level 4) laboratories worldwide, representing the highest-security biological research facilities capable of handling the most dangerous pathogens (Ebola, Marburg, Nipah, etc.). Classified by operational status: Operational, Under Construction, or Planned. Critical infrastructure for pandemic preparedness and biodefense research capacity assessment.', source:'WHO Laboratory Biosafety Manual, Global Health Security Agenda, ABSA International', methodology:'Compiled from WHO biosafety registries, national biosafety authority databases, published facility directories, and peer-reviewed literature on high-containment laboratories.' },
  ctbto:     { label:'CTBTO Monitoring Stations', icon:'fa-broadcast-tower', color:'#f59e0b', border:'rgba(245,158,11,0.3)', bg:'rgba(245,158,11,0.08)', count:54, file:'geointel-ctbto.json', size:'9 KB', props:['name','city','country','station_type','network'], desc:'The Comprehensive Nuclear-Test-Ban Treaty Organization (CTBTO) International Monitoring System (IMS) stations. Four technology types: Seismic, Hydroacoustic, Infrasound, and Radionuclide. These stations provide continuous global monitoring for nuclear explosions and have dual-use relevance for detecting radiological events that could accompany CBRN incidents or environmental disasters.', source:'CTBTO Preparatory Commission, IMS Station Database', methodology:'Extracted from official CTBTO station directories and the International Monitoring System public database. Station types verified against CTBTO technical publications.' },
  outbreaks: { label:'WHO Disease Outbreaks', icon:'fa-virus', color:'#ec4899', border:'rgba(236,72,153,0.3)', bg:'rgba(236,72,153,0.08)', count:24, file:'geointel-outbreaks.json', size:'5 KB', props:['name','country','pathogen','cases','severity','date'], desc:'Active disease outbreak events reported through WHO Disease Outbreak News (DON) and ProMED alerts. Each outbreak carries severity classification (Critical, High, Moderate, Low), confirmed case counts, causative pathogen, and temporal data. This layer enables real-time situational awareness of global health threats and pandemic risk assessment.', source:'WHO Disease Outbreak News (DON), ProMED-mail, ECDC Communicable Disease Threats Report', methodology:'Aggregated from WHO DON reports, ProMED alerts, and ECDC threat assessments. Severity classification uses WHO Emergency Risk Assessment criteria. Case counts from official national and WHO situation reports.' },
  ghs:       { label:'GHS Index', icon:'fa-shield-alt', color:'#3b82f6', border:'rgba(59,130,246,0.3)', bg:'rgba(59,130,246,0.08)', count:45, file:'geointel-ghs.json', size:'6 KB', props:['name','country','score','tier','rank'], desc:'Global Health Security Index country-level scores measuring national preparedness for epidemic and pandemic threats. The GHS Index evaluates 195 countries across 6 categories: Prevention, Detection & Reporting, Rapid Response, Health System, Compliance with International Norms, and Risk Environment. Displayed as graduated circles with color-coded preparedness tiers.', source:'Nuclear Threat Initiative (NTI), Johns Hopkins Bloomberg School of Public Health, The Economist Intelligence Unit', methodology:'GHS Index 2021 scores and rankings. Countries mapped to capital city coordinates. Score thresholds: Most Prepared (80+), More Prepared (60-79), Moderate (40-59), Least Prepared (<40).' },
  cbrn:      { label:'CBRN Sensors', icon:'fa-radiation-alt', color:'#f97316', border:'rgba(249,115,22,0.3)', bg:'rgba(249,115,22,0.08)', count:33, file:'geointel-cbrn.json', size:'8 KB', props:['name','city','country','type','network','status'], desc:'Chemical, Biological, Radiological, and Nuclear (CBRN) sensor networks and detection facilities worldwide. Includes biodetection systems (e.g., BioWatch), radiological monitoring stations, chemical detection networks, and integrated CBRN warning systems. These facilities represent the physical detection infrastructure that feeds into CBRN operational platforms evaluated in PSEF Layer 4.', source:'OPCW declarations, national CBRN authority publications, NATO CBRN defence reports', methodology:'Compiled from open-source CBRN infrastructure databases, national civil protection agency publications, OPCW transparency reports, and NATO CBRN capability assessments. Network affiliations verified against published deployment records.' },
  genomic:   { label:'Genomic Surveillance', icon:'fa-dna', color:'#8b5cf6', border:'rgba(139,92,246,0.3)', bg:'rgba(139,92,246,0.08)', count:24, file:'geointel-genomic.json', size:'7 KB', props:['name','city','country','capacity','focus','sequencers','annual_sequences'], desc:'Major genomic sequencing and pathogen surveillance laboratories worldwide. Each facility carries data on sequencing capacity (number of sequencers), annual throughput (sequences per year), primary research focus, and technological capabilities. This layer maps the global distribution of genomic intelligence infrastructure critical for pathogen characterisation, variant tracking, and molecular epidemiology.', source:'GISAID EpiCoV metadata, GenBank submission records, WHO Genomic Surveillance Strategy', methodology:'Identified from GISAID submission metadata, institutional sequencing reports, WHO genomic surveillance network directories, and published sequencing capacity assessments. Throughput data from institutional annual reports and published benchmarking studies.' },
  env:       { label:'Environmental Monitoring', icon:'fa-cloud', color:'#06b6d4', border:'rgba(6,182,212,0.3)', bg:'rgba(6,182,212,0.08)', count:21, file:'geointel-env.json', size:'5 KB', props:['name','city','country','type','network','parameter'], desc:'Environmental monitoring stations measuring atmospheric composition, radiation levels, and air quality parameters. Includes stations from the Global Atmosphere Watch (GAW), CTBTO radionuclide network, and national environmental monitoring agencies. Monitored parameters include CO2, O3, PM2.5, radiation dose rates, and radionuclide concentrations. These stations provide the environmental data layer essential for detecting anomalous releases and assessing environmental health threats.', source:'WMO Global Atmosphere Watch (GAW), IAEA Environmental Monitoring, national EPA networks', methodology:'Station data compiled from WMO GAW network directory, IAEA environmental monitoring database, and national environmental protection agency station registries. Parameters verified against published station metadata.' },
  population:{ label:'Population Density', icon:'fa-users', color:'#a78bfa', border:'rgba(167,139,250,0.3)', bg:'rgba(167,139,250,0.08)', count:30, file:'geointel-population.json', size:'6 KB', props:['name','country','population','density','risk_tier'], desc:'Major global population centres with demographic data enabling vulnerability assessment and exposure modelling. Each city carries total population, population density (per km2), and a computed risk tier (Very High, High, Moderate, Low) based on density thresholds. This layer enables overlay analysis with outbreak, BSL-4, and CBRN data to assess population exposure risk and prioritise response resource allocation.', source:'United Nations World Urbanization Prospects, WorldPop, national census data', methodology:'Population data from UN World Urbanization Prospects 2024 revision. Density calculated from administrative boundary areas. Risk tiers: Very High (>5000/km2), High (3000-5000), Moderate (1000-3000), Low (<1000). Coordinates from GeoNames database.' },
  policy:    { label:'Policy Readiness', icon:'fa-gavel', color:'#14b8a6', border:'rgba(20,184,166,0.3)', bg:'rgba(20,184,166,0.08)', count:28, file:'geointel-policy.json', size:'7 KB', props:['name','iso','ihr_score','jee_score','naphs','who_region','year','tier'], desc:'International Health Regulations (IHR) and Joint External Evaluation (JEE) compliance scores at national level. Each country carries IHR State Party Self-Assessment (SPAR) scores, JEE mission scores, National Action Plan for Health Security (NAPHS) status, and a computed compliance tier. This layer maps the policy and governance preparedness landscape, identifying countries with strong regulatory frameworks versus those with critical gaps.', source:'WHO IHR Monitoring & Evaluation Framework, JEE mission reports, NAPHS tracker', methodology:'IHR SPAR scores from WHO e-SPAR database. JEE scores from published WHO JEE mission reports. NAPHS status from WHO NAPHS country tracker. Compliance tiers: Compliant (IHR 80+, JEE 80+), Progressing (60-79), Developing (40-59), Critical (<40).' }
};

// ===== GEOINTEL ABOUT / PRESENTATION VIEW =====
function renderGeoIntelAboutView() {
  return '<div class="bm-wrapper" style="min-height:100vh">' +
    '<style>' +
    '.gi-a-glass{background:rgba(30,41,59,0.85);backdrop-filter:blur(12px);border:1px solid rgba(0,168,107,0.15);border-radius:12px}' +
    '.gi-a-glass-light{background:rgba(51,65,85,0.5);backdrop-filter:blur(8px);border:1px solid rgba(0,168,107,0.1);border-radius:8px}' +
    '.gi-a-gradient{background:linear-gradient(135deg,#00A86B 0%,#06b6d4 50%,#8b5cf6 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}' +
    '.gi-a-tab{padding:8px 16px;border-radius:8px;font-size:13px;font-weight:500;border:1px solid transparent;cursor:pointer;transition:all 0.2s;color:rgba(255,255,255,0.4);background:transparent}' +
    '.gi-a-tab:hover{color:rgba(255,255,255,0.7)}.gi-a-tab-active{border-color:#00A86B;color:#00A86B;background:rgba(0,168,107,0.1)}' +
    '.gi-a-fadein{animation:giFade 0.4s ease-out}@keyframes giFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}' +
    '.gi-a-card{transition:all 0.3s}.gi-a-card:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,168,107,0.15)}' +
    '.gi-a-kpi{text-align:center;padding:16px;border-radius:10px}' +
    '@media(max-width:768px){' +
      '.gi-a-tab{padding:6px 10px;font-size:11px}' +
      '.gi-a-kpi-grid{grid-template-columns:repeat(2,1fr)!important}' +
      '.gi-a-layer-grid{grid-template-columns:1fr!important}' +
      '.gi-a-2col{grid-template-columns:1fr!important}' +
    '}' +
    '</style>' +
    // Header
    '<header class="gi-a-glass" style="position:sticky;top:0;z-index:50;border-radius:0;border-left:none;border-right:none;border-top:none">' +
      '<div style="max-width:1200px;margin:0 auto;padding:12px 16px;display:flex;align-items:center;justify-content:space-between">' +
        '<div style="display:flex;align-items:center;gap:12px">' +
          '<button onclick="navigateToHub()" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:14px;padding:6px 10px;border-radius:8px;transition:all 0.2s" onmouseover="this.style.color=&apos;#00A86B&apos;" onmouseout="this.style.color=&apos;#94a3b8&apos;"><i class="fas fa-arrow-left"></i></button>' +
          '<div style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#00A86B,#06b6d4);display:flex;align-items:center;justify-content:center"><i class="fas fa-globe-americas" style="color:#fff;font-size:16px"></i></div>' +
          '<div><h1 style="font-size:16px;font-weight:700;margin:0" class="gi-a-gradient">GeoIntel Engine</h1><p style="font-size:11px;color:#94a3b8;margin:0">Multi-Source Geospatial Intelligence Dataset &mdash; 489 Features</p></div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:12px;font-size:12px">' +
          '<span style="color:#94a3b8"><i class="fas fa-layer-group" style="margin-right:4px"></i>10 layers</span>' +
          '<span style="color:#00A86B"><i class="fas fa-map-marker-alt" style="margin-right:4px"></i>489 features</span>' +
          '<span style="color:#06b6d4"><i class="fas fa-globe" style="margin-right:4px"></i>80+ countries</span>' +
          '<span style="color:#64748b;font-family:monospace;font-size:11px">v1.0</span>' +
          '<button onclick="openGeoIntelMap()" style="padding:6px 14px;border-radius:8px;border:1px solid rgba(0,168,107,0.3);background:linear-gradient(135deg,rgba(0,168,107,0.15),rgba(6,182,212,0.15));color:#00A86B;font-size:12px;cursor:pointer;font-weight:700;font-family:inherit;transition:all 0.2s;display:flex;align-items:center;gap:6px" onmouseover="this.style.background=&apos;linear-gradient(135deg,rgba(0,168,107,0.25),rgba(6,182,212,0.25))&apos;" onmouseout="this.style.background=&apos;linear-gradient(135deg,rgba(0,168,107,0.15),rgba(6,182,212,0.15))&apos;"><i class="fas fa-map"></i>Launch Map</button>' +
        '</div>' +
      '</div>' +
    '</header>' +
    // Tabs
    '<nav style="max-width:1200px;margin:0 auto;padding:16px 16px 0;display:flex;gap:8px;overflow-x:auto;align-items:center">' +
      '<button class="gi-a-tab gi-a-tab-active" data-giview="about" onclick="giAboutShowView(&apos;about&apos;)"><i class="fas fa-book-open" style="margin-right:4px"></i>About GeoIntel</button>' +
      '<button class="gi-a-tab" data-giview="layers" onclick="giAboutShowView(&apos;layers&apos;)"><i class="fas fa-layer-group" style="margin-right:4px"></i>10 Data Layers</button>' +
      '<button class="gi-a-tab" data-giview="methodology" onclick="giAboutShowView(&apos;methodology&apos;)"><i class="fas fa-flask" style="margin-right:4px"></i>Methodology</button>' +
      '<button class="gi-a-tab" data-giview="architecture" onclick="giAboutShowView(&apos;architecture&apos;)"><i class="fas fa-project-diagram" style="margin-right:4px"></i>Dataset Architecture</button>' +
      '<button class="gi-a-tab" data-giview="sources" onclick="giAboutShowView(&apos;sources&apos;)"><i class="fas fa-book" style="margin-right:4px"></i>Sources & Citations</button>' +
    '</nav>' +
    '<main style="max-width:1200px;margin:0 auto;padding:24px 16px" id="giAboutContent">' +
      '<div style="text-align:center;padding:60px 0"><i class="fas fa-spinner fa-spin" style="color:#00A86B;font-size:28px"></i><p style="color:#94a3b8;margin-top:16px;font-size:13px">Loading GeoIntel dataset...</p></div>' +
    '</main>' +
  '</div>';
}

function initGeoIntelAboutView() {
  giAboutShowView('about');
}

window.giAboutShowView = function(view) {
  giAboutView = view;
  document.querySelectorAll('.gi-a-tab').forEach(function(t){t.classList.remove('gi-a-tab-active');});
  var active = document.querySelector('[data-giview="'+view+'"]');
  if(active) active.classList.add('gi-a-tab-active');
  var main = document.getElementById('giAboutContent');
  if(!main) return;
  switch(view) {
    case 'about': main.innerHTML = giRenderAbout(); break;
    case 'layers': main.innerHTML = giRenderLayers(); break;
    case 'methodology': main.innerHTML = giRenderMethodology(); break;
    case 'architecture': main.innerHTML = giRenderArchitecture(); break;
    case 'sources': main.innerHTML = giRenderSources(); break;
  }
};

// ===== ABOUT TAB — Executive Introduction =====
function giRenderAbout() {
  var layerKeys = Object.keys(giLayerMeta);
  var totalFeatures = layerKeys.reduce(function(a,k){return a+giLayerMeta[k].count},0);
  var totalSize = '216 KB';

  // Layer summary cards
  var layerSummary = layerKeys.map(function(k) {
    var m = giLayerMeta[k];
    return '<div class="gi-a-card gi-a-glass gi-a-fadein" style="padding:14px;cursor:pointer" onclick="giAboutShowView(&apos;layers&apos;)">' +
      '<div style="display:flex;align-items:center;gap:10px">' +
        '<div style="width:36px;height:36px;border-radius:10px;background:'+m.bg+';border:1px solid '+m.border+';display:flex;align-items:center;justify-content:center"><i class="fas '+m.icon+'" style="color:'+m.color+';font-size:14px"></i></div>' +
        '<div style="flex:1;min-width:0"><h4 style="color:'+m.color+';font-size:12px;font-weight:700;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+m.label+'</h4><span style="font-size:10px;color:#64748b">'+m.count+' features</span></div>' +
        '<div style="font-size:18px;font-weight:800;color:'+m.color+';font-family:monospace">'+m.count+'</div>' +
      '</div>' +
    '</div>';
  }).join('');

  return '<div class="gi-a-fadein" style="max-width:1000px;margin:0 auto">' +

    // SECTION 1: EXECUTIVE INTRODUCTION
    '<div class="gi-a-glass" style="padding:32px;margin-bottom:28px;border-color:rgba(0,168,107,0.2)">' +
      '<div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">' +
        '<div style="width:56px;height:56px;border-radius:14px;background:linear-gradient(135deg,#00A86B,#06b6d4);display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="fas fa-globe-americas" style="color:#fff;font-size:24px"></i></div>' +
        '<div><h2 style="font-size:22px;font-weight:800;margin:0" class="gi-a-gradient">GeoIntel Engine &mdash; Geospatial Intelligence Dataset</h2><p style="font-size:13px;color:#64748b;margin:4px 0 0">v1.0 &mdash; Multi-Source Geospatial Biosurveillance Intelligence</p></div>' +
      '</div>' +
      '<div style="padding:20px;border-radius:10px;background:rgba(0,168,107,0.04);border:1px solid rgba(0,168,107,0.15);margin-bottom:20px">' +
        '<p style="color:#e2e8f0;font-size:14px;line-height:1.9;margin:0">The <strong style="color:#00A86B">GeoIntel Engine</strong> is a custom-built, multi-layer geospatial intelligence dataset designed to provide decision-makers with a unified spatial view of global biosurveillance infrastructure, health security capacity, active threat events, and critical detection networks. Developed as a core module of the <strong style="color:#06b6d4">BioR Intelligence Platform</strong>, GeoIntel fuses <strong style="color:#8b5cf6">'+totalFeatures+' geocoded features</strong> across <strong style="color:#f59e0b">10 thematic layers</strong> sourced from international health organisations, treaty monitoring bodies, national authorities, and the BioR PSEF benchmark dataset.</p>' +
      '</div>' +
      '<div class="gi-a-kpi-grid" style="display:grid;grid-template-columns:repeat(5,1fr);gap:14px">' +
        '<div class="gi-a-kpi" style="background:rgba(0,168,107,0.06);border:1px solid rgba(0,168,107,0.15);border-radius:10px"><div style="font-size:28px;font-weight:800" class="gi-a-gradient">'+totalFeatures+'</div><div style="font-size:11px;color:#94a3b8;margin-top:4px">Total Features</div></div>' +
        '<div class="gi-a-kpi" style="background:rgba(6,182,212,0.06);border:1px solid rgba(6,182,212,0.15);border-radius:10px"><div style="font-size:28px;font-weight:800;color:#06b6d4">10</div><div style="font-size:11px;color:#94a3b8;margin-top:4px">Data Layers</div></div>' +
        '<div class="gi-a-kpi" style="background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.15);border-radius:10px"><div style="font-size:28px;font-weight:800;color:#8b5cf6">80+</div><div style="font-size:11px;color:#94a3b8;margin-top:4px">Countries</div></div>' +
        '<div class="gi-a-kpi" style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.15);border-radius:10px"><div style="font-size:28px;font-weight:800;color:#f59e0b">'+totalSize+'</div><div style="font-size:11px;color:#94a3b8;margin-top:4px">Dataset Size</div></div>' +
        '<div class="gi-a-kpi" style="background:rgba(236,72,153,0.06);border:1px solid rgba(236,72,153,0.15);border-radius:10px"><div style="font-size:28px;font-weight:800;color:#ec4899">GeoJSON</div><div style="font-size:11px;color:#94a3b8;margin-top:4px">Data Format</div></div>' +
      '</div>' +
    '</div>' +

    // SECTION 2: PURPOSE & SCOPE
    '<div class="gi-a-glass" style="padding:28px;margin-bottom:28px">' +
      '<h3 style="font-size:17px;font-weight:700;color:#fff;margin:0 0 16px"><i class="fas fa-bullseye" style="margin-right:10px;color:#00A86B"></i>Purpose & Scope</h3>' +
      '<div class="gi-a-2col" style="display:grid;grid-template-columns:1fr 1fr;gap:20px">' +
        '<div style="padding:16px;border-radius:10px;background:rgba(0,168,107,0.04);border:1px solid rgba(0,168,107,0.15)">' +
          '<h4 style="color:#00A86B;font-size:13px;font-weight:700;margin:0 0 10px"><i class="fas fa-crosshairs" style="margin-right:6px"></i>Why GeoIntel?</h4>' +
          '<ul style="margin:0;padding:0 0 0 16px;color:#cbd5e1;font-size:12.5px;line-height:1.8">' +
            '<li>No existing platform provides a <strong style="color:#fff">unified geospatial view</strong> of biosurveillance platforms, laboratory infrastructure, monitoring networks, and health security indicators in a single interactive map</li>' +
            '<li>Decision-makers need <strong style="color:#fff">spatial context</strong> to understand the geographic distribution of detection capability, response capacity, and population vulnerability</li>' +
            '<li>Cross-layer analysis (e.g., overlay BSL-4 labs with population density and outbreak locations) enables <strong style="color:#fff">evidence-based resource allocation</strong></li>' +
            '<li>The rapid expansion of global biosurveillance infrastructure demands a <strong style="color:#fff">living geospatial registry</strong> that can be updated as new facilities come online</li>' +
          '</ul>' +
        '</div>' +
        '<div style="padding:16px;border-radius:10px;background:rgba(6,182,212,0.04);border:1px solid rgba(6,182,212,0.15)">' +
          '<h4 style="color:#06b6d4;font-size:13px;font-weight:700;margin:0 0 10px"><i class="fas fa-globe-americas" style="margin-right:6px"></i>What GeoIntel Covers</h4>' +
          '<ul style="margin:0;padding:0 0 0 16px;color:#cbd5e1;font-size:12.5px;line-height:1.8">' +
            '<li><strong style="color:#00A86B">Platform Infrastructure</strong> &mdash; 189 geocoded biosurveillance platforms from the PSEF benchmark</li>' +
            '<li><strong style="color:#ef4444">Laboratory Containment</strong> &mdash; 41 BSL-4 maximum containment facilities worldwide</li>' +
            '<li><strong style="color:#f59e0b">Treaty Monitoring</strong> &mdash; 54 CTBTO International Monitoring System stations</li>' +
            '<li><strong style="color:#ec4899">Active Threats</strong> &mdash; 24 WHO-reported disease outbreaks with severity and case data</li>' +
            '<li><strong style="color:#3b82f6">Health Security</strong> &mdash; 45 countries scored on the Global Health Security Index</li>' +
            '<li><strong style="color:#f97316">Detection Networks</strong> &mdash; 33 CBRN sensor facilities and 21 environmental monitoring stations</li>' +
            '<li><strong style="color:#8b5cf6">Genomic Capacity</strong> &mdash; 24 major genomic surveillance laboratories</li>' +
            '<li><strong style="color:#a78bfa">Vulnerability Context</strong> &mdash; 30 population density centres and 28 policy readiness assessments</li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
    '</div>' +

    // SECTION 3: LAYER OVERVIEW GRID
    '<div class="gi-a-glass" style="padding:28px;margin-bottom:28px">' +
      '<h3 style="font-size:17px;font-weight:700;color:#fff;margin:0 0 6px"><i class="fas fa-layer-group" style="margin-right:10px;color:#f59e0b"></i>10-Layer Taxonomy Overview</h3>' +
      '<p style="color:#94a3b8;font-size:13px;line-height:1.7;margin:0 0 20px">GeoIntel organises '+totalFeatures+' features into 10 thematic layers spanning biosurveillance infrastructure, threat intelligence, health security governance, and population vulnerability. Click any layer for full detail.</p>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
        layerSummary +
      '</div>' +
    '</div>' +

    // SECTION 4: KEY CAPABILITIES
    '<div class="gi-a-glass" style="padding:28px;margin-bottom:28px">' +
      '<h3 style="font-size:17px;font-weight:700;color:#fff;margin:0 0 16px"><i class="fas fa-cogs" style="margin-right:10px;color:#06b6d4"></i>Interactive Map Capabilities</h3>' +
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">' +
        '<div style="padding:16px;border-radius:10px;background:rgba(0,168,107,0.05);border:1px solid rgba(0,168,107,0.12)"><div style="color:#00A86B;font-weight:700;font-size:13px;margin-bottom:6px"><i class="fas fa-object-group" style="margin-right:6px"></i>Layer Toggle & Overlay</div><p style="color:#94a3b8;font-size:11.5px;line-height:1.6;margin:0">Toggle any combination of 10 layers on/off for cross-layer spatial analysis. Each layer loads independently with lazy-loading for performance.</p></div>' +
        '<div style="padding:16px;border-radius:10px;background:rgba(6,182,212,0.05);border:1px solid rgba(6,182,212,0.12)"><div style="color:#06b6d4;font-weight:700;font-size:13px;margin-bottom:6px"><i class="fas fa-mouse-pointer" style="margin-right:6px"></i>Interactive Popups</div><p style="color:#94a3b8;font-size:11.5px;line-height:1.6;margin:0">Hover for quick summaries; click for full detail panels with layer-specific metadata, scores, and classifications.</p></div>' +
        '<div style="padding:16px;border-radius:10px;background:rgba(139,92,246,0.05);border:1px solid rgba(139,92,246,0.12)"><div style="color:#8b5cf6;font-weight:700;font-size:13px;margin-bottom:6px"><i class="fas fa-search" style="margin-right:6px"></i>Cross-Layer Search</div><p style="color:#94a3b8;font-size:11.5px;line-height:1.6;margin:0">Unified search across all 10 layers by name, country, or attribute. Results fly-to the selected feature on the map.</p></div>' +
        '<div style="padding:16px;border-radius:10px;background:rgba(245,158,11,0.05);border:1px solid rgba(245,158,11,0.12)"><div style="color:#f59e0b;font-weight:700;font-size:13px;margin-bottom:6px"><i class="fas fa-file-csv" style="margin-right:6px"></i>Multi-Layer CSV Export</div><p style="color:#94a3b8;font-size:11.5px;line-height:1.6;margin:0">Export all active-layer features to CSV with standardised columns: Type, Name, Score/Value, Layer, Country, Coordinates.</p></div>' +
        '<div style="padding:16px;border-radius:10px;background:rgba(236,72,153,0.05);border:1px solid rgba(236,72,153,0.12)"><div style="color:#ec4899;font-weight:700;font-size:13px;margin-bottom:6px"><i class="fas fa-palette" style="margin-right:6px"></i>Basemap Styles</div><p style="color:#94a3b8;font-size:11.5px;line-height:1.6;margin:0">Three basemap styles (Dark, Light, Voyager) with layer persistence across style changes. 3D globe mode for global perspective.</p></div>' +
        '<div style="padding:16px;border-radius:10px;background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.12)"><div style="color:#ef4444;font-weight:700;font-size:13px;margin-bottom:6px"><i class="fas fa-chart-bar" style="margin-right:6px"></i>Real-Time Stats</div><p style="color:#94a3b8;font-size:11.5px;line-height:1.6;margin:0">Dynamic stats bar showing total features, active layers, country coverage, and zoom level. Auto-updates as layers are toggled.</p></div>' +
      '</div>' +
    '</div>' +

    // CTA
    '<div style="text-align:center;margin-bottom:40px;padding:24px">' +
      '<button onclick="openGeoIntelMap()" style="padding:12px 28px;font-size:14px;font-weight:700;border-radius:12px;border:1px solid rgba(0,168,107,0.3);background:linear-gradient(135deg,rgba(0,168,107,0.15),rgba(6,182,212,0.15));color:#00A86B;cursor:pointer;font-family:inherit;transition:all 0.2s" onmouseover="this.style.background=&apos;linear-gradient(135deg,rgba(0,168,107,0.25),rgba(6,182,212,0.25))&apos;" onmouseout="this.style.background=&apos;linear-gradient(135deg,rgba(0,168,107,0.15),rgba(6,182,212,0.15))&apos;"><i class="fas fa-map" style="margin-right:8px"></i>Launch Interactive Map</button>' +
      '<span style="margin:0 12px;color:#475569">|</span>' +
      '<button onclick="giAboutShowView(&apos;layers&apos;)" class="gi-a-tab" style="padding:12px 28px;font-size:14px;font-weight:600;border-radius:12px;border:1px solid rgba(6,182,212,0.3);color:#06b6d4"><i class="fas fa-layer-group" style="margin-right:8px"></i>Explore 10 Layers</button>' +
    '</div>' +

  '</div>';
}

// ===== LAYERS TAB — Full Layer Detail =====
function giRenderLayers() {
  var layerKeys = Object.keys(giLayerMeta);
  var cards = layerKeys.map(function(k, idx) {
    var m = giLayerMeta[k];
    var props = m.props.map(function(p) {
      return '<span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:500;background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.5);border:1px solid rgba(255,255,255,0.08);margin:2px 3px 2px 0;font-family:monospace">'+p+'</span>';
    }).join('');
    return '<div class="gi-a-glass gi-a-fadein" style="padding:24px;border-color:'+m.border+'">' +
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px">' +
        '<div style="display:flex;align-items:center;gap:14px"><div style="width:48px;height:48px;border-radius:12px;background:'+m.bg+';border:1px solid '+m.border+';display:flex;align-items:center;justify-content:center"><i class="fas '+m.icon+'" style="color:'+m.color+';font-size:20px"></i></div><div><h3 style="color:'+m.color+';font-size:16px;font-weight:700;margin:0">'+(idx+1)+'. '+m.label+'</h3><span style="font-size:11px;color:#64748b">'+m.count+' features &bull; '+m.file+' &bull; '+m.size+'</span></div></div>' +
        '<div style="font-size:32px;font-weight:800;color:'+m.color+';font-family:monospace">'+m.count+'</div>' +
      '</div>' +
      '<p style="color:#cbd5e1;font-size:13px;line-height:1.8;margin:0 0 16px">'+m.desc+'</p>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">' +
        '<div style="padding:12px;border-radius:8px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06)"><div style="font-size:10px;color:#64748b;font-weight:600;text-transform:uppercase;margin-bottom:6px;letter-spacing:0.5px"><i class="fas fa-database" style="margin-right:4px"></i>Data Source</div><p style="color:#94a3b8;font-size:12px;line-height:1.6;margin:0">'+m.source+'</p></div>' +
        '<div style="padding:12px;border-radius:8px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06)"><div style="font-size:10px;color:#64748b;font-weight:600;text-transform:uppercase;margin-bottom:6px;letter-spacing:0.5px"><i class="fas fa-flask" style="margin-right:4px"></i>Collection Method</div><p style="color:#94a3b8;font-size:12px;line-height:1.6;margin:0">'+m.methodology+'</p></div>' +
      '</div>' +
      '<div style="border-top:1px solid rgba(51,65,85,0.5);padding-top:12px"><div style="font-size:10px;color:#64748b;font-weight:600;text-transform:uppercase;margin-bottom:8px;letter-spacing:0.5px">GeoJSON Properties</div>'+props+'</div>' +
    '</div>';
  }).join('');

  return '<div class="gi-a-fadein" style="max-width:1000px;margin:0 auto">' +
    '<div class="gi-a-glass" style="padding:24px;margin-bottom:20px">' +
      '<h3 style="font-size:17px;font-weight:700;color:#fff;margin:0 0 6px"><i class="fas fa-layer-group" style="margin-right:10px;color:#00A86B"></i>Complete Layer Reference</h3>' +
      '<p style="color:#94a3b8;font-size:13px;line-height:1.7;margin:0">Detailed documentation for each of the 10 GeoIntel data layers, including feature counts, data sources, collection methodology, and GeoJSON property schemas.</p>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:1fr;gap:16px">' + cards + '</div>' +
    '<div style="text-align:center;margin-top:28px;padding:20px"><button onclick="openGeoIntelMap()" style="padding:10px 24px;border-radius:10px;border:1px solid rgba(0,168,107,0.3);background:rgba(0,168,107,0.1);color:#00A86B;font-size:13px;cursor:pointer;font-weight:600;font-family:inherit"><i class="fas fa-map" style="margin-right:6px"></i>Explore All Layers on the Map</button></div>' +
  '</div>';
}

// ===== METHODOLOGY TAB =====
function giRenderMethodology() {
  return '<div class="gi-a-fadein" style="max-width:1000px;margin:0 auto">' +

    // Phase methodology
    '<div class="gi-a-glass" style="padding:28px;margin-bottom:28px">' +
      '<h3 style="font-size:17px;font-weight:700;color:#fff;margin:0 0 16px"><i class="fas fa-flask" style="margin-right:10px;color:#8b5cf6"></i>Data Construction Methodology</h3>' +
      '<p style="color:#cbd5e1;font-size:13px;line-height:1.8;margin:0 0 24px">The GeoIntel dataset was constructed through a systematic <strong style="color:#8b5cf6">four-phase pipeline</strong> combining automated data harvesting, manual verification, expert curation, and cartographic quality assurance. Each layer underwent independent validation to ensure spatial accuracy, attribute completeness, and source traceability.</p>' +
      '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px">' +
        '<div style="padding:18px;border-radius:10px;background:rgba(0,168,107,0.06);border:1px solid rgba(0,168,107,0.15);text-align:center"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#00A86B,#00A86B80);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;color:#fff;font-weight:800;font-size:16px">1</div><h4 style="color:#00A86B;font-size:13px;font-weight:700;margin:0 0 8px">Source Identification</h4><p style="color:#94a3b8;font-size:11px;line-height:1.6;margin:0">Identification of authoritative data sources for each layer: WHO, CTBTO, NTI, OPCW, WMO, UN, national health authorities, and the BioR PSEF benchmark.</p></div>' +
        '<div style="padding:18px;border-radius:10px;background:rgba(6,182,212,0.06);border:1px solid rgba(6,182,212,0.15);text-align:center"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#06b6d4,#06b6d480);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;color:#fff;font-weight:800;font-size:16px">2</div><h4 style="color:#06b6d4;font-size:13px;font-weight:700;margin:0 0 8px">Data Extraction</h4><p style="color:#94a3b8;font-size:11px;line-height:1.6;margin:0">Structured extraction of facility names, locations, attributes, and metadata from source databases, reports, and publications. Standardisation to GeoJSON FeatureCollection format.</p></div>' +
        '<div style="padding:18px;border-radius:10px;background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.15);text-align:center"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#8b5cf680);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;color:#fff;font-weight:800;font-size:16px">3</div><h4 style="color:#8b5cf6;font-size:13px;font-weight:700;margin:0 0 8px">Geocoding & Verification</h4><p style="color:#94a3b8;font-size:11px;line-height:1.6;margin:0">Each feature geocoded to precise coordinates. Automated geocoding verified against satellite imagery, OpenStreetMap, and institutional records. 90+ platforms required manual coordinate research.</p></div>' +
        '<div style="padding:18px;border-radius:10px;background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.15);text-align:center"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#f59e0b80);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;color:#fff;font-weight:800;font-size:16px">4</div><h4 style="color:#f59e0b;font-size:13px;font-weight:700;margin:0 0 8px">Quality Assurance</h4><p style="color:#94a3b8;font-size:11px;line-height:1.6;margin:0">Attribute validation, duplicate detection, coordinate bounding-box checks, and cross-reference verification against secondary sources. Each layer tested in the interactive map renderer.</p></div>' +
      '</div>' +
    '</div>' +

    // Phased rollout
    '<div class="gi-a-glass" style="padding:28px;margin-bottom:28px">' +
      '<h3 style="font-size:17px;font-weight:700;color:#fff;margin:0 0 16px"><i class="fas fa-tasks" style="margin-right:10px;color:#00A86B"></i>Phased Development</h3>' +
      '<div style="display:grid;grid-template-columns:1fr;gap:12px">' +
        '<div style="display:flex;gap:16px;padding:16px;border-radius:10px;border-left:4px solid #00A86B;background:rgba(0,168,107,0.04)">' +
          '<div style="flex-shrink:0;width:80px"><span style="display:inline-block;padding:4px 12px;border-radius:6px;background:rgba(0,168,107,0.15);color:#00A86B;font-size:11px;font-weight:700">Phase 1</span></div>' +
          '<div><h4 style="color:#fff;font-size:14px;font-weight:700;margin:0 0 4px">GeoIntel Engine Foundation</h4><p style="color:#94a3b8;font-size:12px;line-height:1.7;margin:0">Full-page interactive map with MapLibre GL JS, 189 geocoded PSEF platforms, marker clustering, layer-coded colours, hover popups, detail panels, real-time search, and CSV export. <strong style="color:#00A86B">189 features &bull; 1 layer</strong></p></div>' +
        '</div>' +
        '<div style="display:flex;gap:16px;padding:16px;border-radius:10px;border-left:4px solid #06b6d4;background:rgba(6,182,212,0.04)">' +
          '<div style="flex-shrink:0;width:80px"><span style="display:inline-block;padding:4px 12px;border-radius:6px;background:rgba(6,182,212,0.15);color:#06b6d4;font-size:11px;font-weight:700">Phase 2</span></div>' +
          '<div><h4 style="color:#fff;font-size:14px;font-weight:700;margin:0 0 4px">Multi-Layer Intelligence</h4><p style="color:#94a3b8;font-size:12px;line-height:1.7;margin:0">Added BSL-4 labs (41), CTBTO stations (54), WHO outbreaks (24), and GHS Index (45) with custom markers, severity/score-based styling, detail panels, dynamic legend, and cross-layer search. <strong style="color:#06b6d4">353 features &bull; 5 layers</strong></p></div>' +
        '</div>' +
        '<div style="display:flex;gap:16px;padding:16px;border-radius:10px;border-left:4px solid #8b5cf6;background:rgba(139,92,246,0.04)">' +
          '<div style="flex-shrink:0;width:80px"><span style="display:inline-block;padding:4px 12px;border-radius:6px;background:rgba(139,92,246,0.15);color:#8b5cf6;font-size:11px;font-weight:700">Phase 3</span></div>' +
          '<div><h4 style="color:#fff;font-size:14px;font-weight:700;margin:0 0 4px">Full Spectrum Coverage</h4><p style="color:#94a3b8;font-size:12px;line-height:1.7;margin:0">Added CBRN sensors (33), genomic surveillance labs (24), environmental monitoring (21), population density centres (30), and policy readiness assessments (28). All 10 layers fully interactive with unified search, legend, and CSV export. <strong style="color:#8b5cf6">489 features &bull; 10 layers</strong></p></div>' +
        '</div>' +
      '</div>' +
    '</div>' +

    // Geocoding methodology detail
    '<div class="gi-a-glass" style="padding:28px;margin-bottom:28px">' +
      '<h3 style="font-size:17px;font-weight:700;color:#fff;margin:0 0 16px"><i class="fas fa-map-pin" style="margin-right:10px;color:#ef4444"></i>Geocoding Methodology</h3>' +
      '<p style="color:#cbd5e1;font-size:13px;line-height:1.8;margin:0 0 16px">Each of the 489 features was geocoded using a multi-step verification process:</p>' +
      '<div class="gi-a-2col" style="display:grid;grid-template-columns:1fr 1fr;gap:16px">' +
        '<div style="padding:16px;border-radius:10px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06)">' +
          '<h4 style="color:#00A86B;font-size:12px;font-weight:700;margin:0 0 8px">Automated Geocoding</h4>' +
          '<ul style="margin:0;padding:0 0 0 14px;color:#94a3b8;font-size:11.5px;line-height:1.7">' +
            '<li>Institutional address lookup via OpenStreetMap Nominatim</li>' +
            '<li>City-level fallback using GeoNames database</li>' +
            '<li>Country centroid as final fallback</li>' +
          '</ul>' +
        '</div>' +
        '<div style="padding:16px;border-radius:10px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06)">' +
          '<h4 style="color:#ef4444;font-size:12px;font-weight:700;margin:0 0 8px">Manual Verification</h4>' +
          '<ul style="margin:0;padding:0 0 0 14px;color:#94a3b8;font-size:11.5px;line-height:1.7">' +
            '<li>90+ PSEF platforms required manual coordinate research</li>' +
            '<li>Satellite imagery cross-reference for BSL-4 labs</li>' +
            '<li>CTBTO station coordinates verified against IMS database</li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
    '</div>' +

  '</div>';
}

// ===== ARCHITECTURE TAB — Dataset Structure & Proof of Concept =====
function giRenderArchitecture() {
  var layerKeys = Object.keys(giLayerMeta);

  // File manifest
  var manifest = layerKeys.map(function(k) {
    var m = giLayerMeta[k];
    return '<tr style="border-bottom:1px solid rgba(51,65,85,0.3)">' +
      '<td style="padding:10px 12px;font-size:12px"><i class="fas '+m.icon+'" style="color:'+m.color+';margin-right:8px"></i><span style="color:#fff;font-weight:600">'+m.label+'</span></td>' +
      '<td style="padding:10px 12px;font-size:12px;color:#94a3b8;font-family:monospace">/static/'+m.file+'</td>' +
      '<td style="padding:10px 12px;font-size:12px;color:#fff;font-weight:700;text-align:center">'+m.count+'</td>' +
      '<td style="padding:10px 12px;font-size:12px;color:#94a3b8;text-align:center">'+m.size+'</td>' +
      '<td style="padding:10px 12px;font-size:12px;color:#64748b;font-family:monospace;font-size:10px">'+m.props.slice(0,3).join(', ')+(m.props.length>3?'...':'')+'</td>' +
    '</tr>';
  }).join('');

  return '<div class="gi-a-fadein" style="max-width:1000px;margin:0 auto">' +

    // Architecture overview
    '<div class="gi-a-glass" style="padding:28px;margin-bottom:28px">' +
      '<h3 style="font-size:17px;font-weight:700;color:#fff;margin:0 0 16px"><i class="fas fa-project-diagram" style="margin-right:10px;color:#06b6d4"></i>Dataset Architecture</h3>' +
      '<p style="color:#cbd5e1;font-size:13px;line-height:1.8;margin:0 0 20px">The GeoIntel dataset is structured as <strong style="color:#06b6d4">10 independent GeoJSON FeatureCollection files</strong>, each representing a thematic layer. This modular architecture enables lazy-loading (layers load on-demand when activated), independent versioning, and efficient caching. All files follow the RFC 7946 GeoJSON specification with WGS84 (EPSG:4326) coordinate reference system.</p>' +
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px">' +
        '<div style="padding:16px;border-radius:10px;background:rgba(0,168,107,0.05);border:1px solid rgba(0,168,107,0.12);text-align:center"><div style="color:#00A86B;font-weight:800;font-size:24px;font-family:monospace">10</div><div style="font-size:11px;color:#94a3b8;margin-top:4px">GeoJSON Files</div></div>' +
        '<div style="padding:16px;border-radius:10px;background:rgba(6,182,212,0.05);border:1px solid rgba(6,182,212,0.12);text-align:center"><div style="color:#06b6d4;font-weight:800;font-size:24px;font-family:monospace">216 KB</div><div style="font-size:11px;color:#94a3b8;margin-top:4px">Total Dataset</div></div>' +
        '<div style="padding:16px;border-radius:10px;background:rgba(139,92,246,0.05);border:1px solid rgba(139,92,246,0.12);text-align:center"><div style="color:#8b5cf6;font-weight:800;font-size:24px;font-family:monospace">RFC 7946</div><div style="font-size:11px;color:#94a3b8;margin-top:4px">GeoJSON Standard</div></div>' +
      '</div>' +
    '</div>' +

    // GeoJSON Schema
    '<div class="gi-a-glass" style="padding:28px;margin-bottom:28px">' +
      '<h3 style="font-size:17px;font-weight:700;color:#fff;margin:0 0 16px"><i class="fas fa-code" style="margin-right:10px;color:#f59e0b"></i>GeoJSON Schema</h3>' +
      '<div style="padding:18px;border-radius:10px;background:rgba(15,23,42,0.6);font-family:monospace;font-size:12px;color:#94a3b8;line-height:1.8;overflow-x:auto;border:1px solid rgba(255,255,255,0.06)">' +
        '<span style="color:#64748b">// Each layer follows this structure:</span><br>' +
        '{<br>' +
        '&nbsp;&nbsp;<span style="color:#f59e0b">"type"</span>: <span style="color:#22c55e">"FeatureCollection"</span>,<br>' +
        '&nbsp;&nbsp;<span style="color:#f59e0b">"features"</span>: [<br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;{<br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#f59e0b">"type"</span>: <span style="color:#22c55e">"Feature"</span>,<br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#f59e0b">"geometry"</span>: {<br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#f59e0b">"type"</span>: <span style="color:#22c55e">"Point"</span>,<br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#f59e0b">"coordinates"</span>: [<span style="color:#06b6d4">longitude</span>, <span style="color:#06b6d4">latitude</span>]<br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},<br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#f59e0b">"properties"</span>: {<br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#f59e0b">"name"</span>: <span style="color:#22c55e">"Feature Name"</span>,<br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#64748b">// ... layer-specific properties</span><br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;}<br>' +
        '&nbsp;&nbsp;]<br>' +
        '}' +
      '</div>' +
    '</div>' +

    // File manifest table
    '<div class="gi-a-glass" style="padding:28px;margin-bottom:28px">' +
      '<h3 style="font-size:17px;font-weight:700;color:#fff;margin:0 0 16px"><i class="fas fa-file-code" style="margin-right:10px;color:#00A86B"></i>File Manifest</h3>' +
      '<div style="overflow-x:auto;border-radius:8px;border:1px solid rgba(51,65,85,0.3)">' +
        '<table style="width:100%;border-collapse:collapse">' +
          '<thead><tr style="background:rgba(15,23,42,0.5);border-bottom:1px solid rgba(51,65,85,0.5)">' +
            '<th style="padding:10px 12px;font-size:11px;color:#64748b;font-weight:600;text-align:left;text-transform:uppercase;letter-spacing:0.5px">Layer</th>' +
            '<th style="padding:10px 12px;font-size:11px;color:#64748b;font-weight:600;text-align:left;text-transform:uppercase;letter-spacing:0.5px">File Path</th>' +
            '<th style="padding:10px 12px;font-size:11px;color:#64748b;font-weight:600;text-align:center;text-transform:uppercase;letter-spacing:0.5px">Features</th>' +
            '<th style="padding:10px 12px;font-size:11px;color:#64748b;font-weight:600;text-align:center;text-transform:uppercase;letter-spacing:0.5px">Size</th>' +
            '<th style="padding:10px 12px;font-size:11px;color:#64748b;font-weight:600;text-align:left;text-transform:uppercase;letter-spacing:0.5px">Key Properties</th>' +
          '</tr></thead>' +
          '<tbody>'+manifest+'</tbody>' +
        '</table>' +
      '</div>' +
    '</div>' +

    // Technology stack
    '<div class="gi-a-glass" style="padding:28px;margin-bottom:28px">' +
      '<h3 style="font-size:17px;font-weight:700;color:#fff;margin:0 0 16px"><i class="fas fa-microchip" style="margin-right:10px;color:#8b5cf6"></i>Technology Stack</h3>' +
      '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px">' +
        '<div style="padding:14px;border-radius:10px;background:rgba(0,168,107,0.05);border:1px solid rgba(0,168,107,0.12);text-align:center"><div style="color:#00A86B;font-weight:700;font-size:20px;margin-bottom:4px"><i class="fas fa-map"></i></div><div style="color:#fff;font-weight:700;font-size:12px">MapLibre GL JS</div><div style="color:#64748b;font-size:10px">Vector tile renderer</div></div>' +
        '<div style="padding:14px;border-radius:10px;background:rgba(6,182,212,0.05);border:1px solid rgba(6,182,212,0.12);text-align:center"><div style="color:#06b6d4;font-weight:700;font-size:20px;margin-bottom:4px"><i class="fas fa-globe"></i></div><div style="color:#fff;font-weight:700;font-size:12px">GeoJSON</div><div style="color:#64748b;font-size:10px">RFC 7946 standard</div></div>' +
        '<div style="padding:14px;border-radius:10px;background:rgba(139,92,246,0.05);border:1px solid rgba(139,92,246,0.12);text-align:center"><div style="color:#8b5cf6;font-weight:700;font-size:20px;margin-bottom:4px"><i class="fas fa-cloud"></i></div><div style="color:#fff;font-weight:700;font-size:12px">Cloudflare Pages</div><div style="color:#64748b;font-size:10px">Edge deployment</div></div>' +
        '<div style="padding:14px;border-radius:10px;background:rgba(245,158,11,0.05);border:1px solid rgba(245,158,11,0.12);text-align:center"><div style="color:#f59e0b;font-weight:700;font-size:20px;margin-bottom:4px"><i class="fas fa-palette"></i></div><div style="color:#fff;font-weight:700;font-size:12px">CARTO Basemaps</div><div style="color:#64748b;font-size:10px">Dark, Light, Voyager</div></div>' +
      '</div>' +
    '</div>' +

  '</div>';
}

// ===== SOURCES TAB =====
function giRenderSources() {
  var sources = [
    { org:'World Health Organization (WHO)', items:['Disease Outbreak News (DON)','IHR Monitoring & Evaluation Framework','e-SPAR (State Party Self-Assessment Annual Reporting)','JEE Mission Reports','Laboratory Biosafety Manual','Genomic Surveillance Strategy','NAPHS Country Tracker'], color:'#06b6d4', icon:'fa-globe' },
    { org:'BioR PSEF Benchmark Dataset', items:['189 biosurveillance platforms (PSEF v3.1)','6-layer functional taxonomy','10-dimension evaluation scores','50 deep-research profiles','20 CBRN operational assessments'], color:'#00A86B', icon:'fa-shield-virus' },
    { org:'Comprehensive Nuclear-Test-Ban Treaty Organization (CTBTO)', items:['International Monitoring System (IMS) Station Database','Station type classifications (Seismic, Hydroacoustic, Infrasound, Radionuclide)','Station coordinate data'], color:'#f59e0b', icon:'fa-broadcast-tower' },
    { org:'Nuclear Threat Initiative (NTI) / Johns Hopkins', items:['Global Health Security Index 2021','195-country preparedness scores','6-category evaluation framework'], color:'#3b82f6', icon:'fa-shield-alt' },
    { org:'Organization for the Prohibition of Chemical Weapons (OPCW)', items:['CBRN facility transparency reports','Chemical detection network declarations'], color:'#f97316', icon:'fa-radiation-alt' },
    { org:'World Meteorological Organization (WMO)', items:['Global Atmosphere Watch (GAW) network directory','Environmental monitoring station metadata','Atmospheric composition parameters'], color:'#06b6d4', icon:'fa-cloud' },
    { org:'United Nations Population Division', items:['World Urbanization Prospects 2024','City population and density estimates','Urban agglomeration data'], color:'#a78bfa', icon:'fa-users' },
    { org:'Additional Sources', items:['GISAID EpiCoV submission metadata','GenBank/NCBI pathogen sequence databases','IAEA Environmental Monitoring','ABSA International BSL-4 facility directory','Global Health Security Agenda (GHSA)','OpenStreetMap / GeoNames (geocoding)','ProMED-mail outbreak reports','ECDC Communicable Disease Threats Report'], color:'#8b5cf6', icon:'fa-database' }
  ];

  var sourceCards = sources.map(function(s) {
    var items = s.items.map(function(i) {
      return '<li style="color:#cbd5e1;font-size:12px;line-height:1.7;margin-bottom:4px">'+i+'</li>';
    }).join('');
    return '<div class="gi-a-glass gi-a-fadein" style="padding:20px;border-left:4px solid '+s.color+'">' +
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px"><i class="fas '+s.icon+'" style="color:'+s.color+';font-size:16px"></i><h4 style="color:#fff;font-size:14px;font-weight:700;margin:0">'+s.org+'</h4></div>' +
      '<ul style="margin:0;padding:0 0 0 16px;list-style-type:disc">'+items+'</ul>' +
    '</div>';
  }).join('');

  return '<div class="gi-a-fadein" style="max-width:1000px;margin:0 auto">' +
    '<div class="gi-a-glass" style="padding:24px;margin-bottom:20px">' +
      '<h3 style="font-size:17px;font-weight:700;color:#fff;margin:0 0 6px"><i class="fas fa-book" style="margin-right:10px;color:#00A86B"></i>Data Sources & Citations</h3>' +
      '<p style="color:#94a3b8;font-size:13px;line-height:1.7;margin:0">The GeoIntel dataset draws from international health organisations, treaty monitoring bodies, national authorities, and open-source geospatial databases. All data sources are traceable and documented below.</p>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">' + sourceCards + '</div>' +
    '<div class="gi-a-glass" style="padding:20px;margin-top:20px;border-color:rgba(0,168,107,0.15)">' +
      '<div style="font-size:11px;color:#64748b;margin-bottom:6px">Suggested Citation</div>' +
      '<div style="padding:14px;border-radius:8px;background:rgba(15,23,42,0.5);font-size:12px;color:#cbd5e1;line-height:1.7;font-family:serif">BioR Intelligence Platform. <em>GeoIntel Engine: Multi-Source Geospatial Biosurveillance Intelligence Dataset v1.0</em>. 489 features, 10 layers, 80+ countries. bior.tech, 2026.</div>' +
    '</div>' +
  '</div>';
}
var giPlatformData = null;
var giActiveLayers = { platforms: true, bsl4: false, ctbto: false, outbreaks: false, ghs: false, cbrn: false, genomic: false, env: false, population: false, policy: false };
var gi3DMode = false;
var giLayerDataLoaded = { bsl4: false, ctbto: false, outbreaks: false, ghs: false, cbrn: false, genomic: false, env: false, population: false, policy: false };
var giBsl4Data = null;
var giCtbtoData = null;
var giOutbreakData = null;
var giGhsData = null;
var giCbrnData = null;
var giGenomicData = null;
var giEnvData = null;
var giPopulationData = null;
var giPolicyData = null;

var giLayerDefs = [
  { id:'platforms', label:'PSEF Platforms', icon:'fa-map-marker-alt', color:'#00A86B', desc:'189 biosurveillance platforms' },
  { id:'bsl4', label:'BSL-4 Laboratories', icon:'fa-flask', color:'#ef4444', desc:'Maximum containment labs worldwide' },
  { id:'ctbto', label:'CTBTO Stations', icon:'fa-broadcast-tower', color:'#f59e0b', desc:'Nuclear test monitoring network' },
  { id:'outbreaks', label:'WHO Outbreaks', icon:'fa-virus', color:'#ec4899', desc:'Active disease outbreaks' },
  { id:'ghs', label:'GHS Index', icon:'fa-shield-alt', color:'#3b82f6', desc:'Global Health Security scores' },
  { id:'cbrn', label:'CBRN Sensors', icon:'fa-radiation-alt', color:'#f97316', desc:'Chemical/biological/radiological/nuclear' },
  { id:'genomic', label:'Genomic Surveillance', icon:'fa-dna', color:'#8b5cf6', desc:'Sequencing capacity density' },
  { id:'env', label:'Environmental', icon:'fa-cloud', color:'#06b6d4', desc:'Air quality & radiation monitoring' },
  { id:'population', label:'Population Density', icon:'fa-users', color:'#a78bfa', desc:'WorldPop density estimates' },
  { id:'policy', label:'Policy Readiness', icon:'fa-gavel', color:'#14b8a6', desc:'IHR & JEE compliance zones' }
];

function renderGeoIntelView() {
  return '<div class="hub-page" style="overflow:hidden">' +
    '<style>' +
    '.gi-header{padding:12px 24px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--bior-border-subtle);background:var(--bior-glass-bg);backdrop-filter:blur(20px);position:relative;z-index:50;}' +
    '.gi-back{display:flex;align-items:center;gap:10px;cursor:pointer;color:rgba(255,255,255,0.5);font-size:12px;font-weight:500;transition:color 0.2s}' +
    '.gi-back:hover{color:#00A86B}' +
    '.gi-back-icon{width:32px;height:32px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;transition:all 0.2s}' +
    '.gi-back:hover .gi-back-icon{background:rgba(0,168,107,0.1);border-color:rgba(0,168,107,0.3)}' +
    '.gi-map-wrap{position:relative;height:calc(100vh - 53px);width:100%}' +
    '#geointelMap{position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%}' +
    '.gi-sidebar{position:absolute;top:16px;left:16px;width:280px;background:var(--bior-glass-bg);backdrop-filter:blur(24px);border:1px solid var(--bior-border-subtle);border-radius:16px;padding:16px;max-height:calc(100vh - 100px);overflow-y:auto;z-index:10;box-shadow:var(--bior-shadow-lg)}' +
    '.gi-sidebar::-webkit-scrollbar{width:4px}.gi-sidebar::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px}' +
    '.gi-section-title{font-size:10px;font-weight:700;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:10px;display:flex;align-items:center;gap:6px}' +
    '.gi-section-title i{font-size:9px}' +
    '.gi-layer-toggle{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;cursor:pointer;transition:all 0.2s;font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:2px}' +
    '.gi-layer-toggle:hover{background:rgba(255,255,255,0.05)}' +
    '.gi-layer-toggle.active{background:rgba(0,168,107,0.08);color:rgba(255,255,255,0.85)}' +
    '.gi-layer-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;opacity:0.4;transition:opacity 0.2s}' +
    '.gi-layer-toggle.active .gi-layer-dot{opacity:1;box-shadow:0 0 6px currentColor}' +
    '.gi-layer-icon{font-size:11px;width:18px;text-align:center;opacity:0.5;transition:opacity 0.2s}' +
    '.gi-layer-toggle.active .gi-layer-icon{opacity:1}' +
    '.gi-layer-label{flex:1;font-weight:500}' +
    '.gi-layer-check{width:16px;height:16px;border-radius:4px;border:1.5px solid rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:8px;transition:all 0.2s}' +
    '.gi-layer-toggle.active .gi-layer-check{background:#00A86B;border-color:#00A86B;color:#fff}' +
    '.gi-search-input{width:100%;padding:8px 12px 8px 32px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#fff;font-size:11px;font-family:Inter,sans-serif;outline:none;transition:border-color 0.2s}' +
    '.gi-search-input:focus{border-color:rgba(0,168,107,0.4)}' +
    '.gi-search-input::placeholder{color:rgba(255,255,255,0.2)}' +
    '.gi-controls{position:absolute;top:16px;right:16px;display:flex;flex-direction:column;gap:6px;z-index:10}' +
    '.gi-ctrl-btn{width:36px;height:36px;border-radius:10px;background:var(--bior-glass-bg);backdrop-filter:blur(16px);border:1px solid var(--bior-border-subtle);color:var(--bior-text-muted);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;font-size:13px}' +
    '.gi-ctrl-btn:hover{background:rgba(0,168,107,0.15);border-color:rgba(0,168,107,0.3);color:#00A86B}' +
    '.gi-ctrl-btn.active{background:rgba(0,168,107,0.2);border-color:#00A86B;color:#00A86B}' +
    '.gi-stats-bar{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);display:flex;gap:8px;z-index:10;background:var(--bior-glass-bg);backdrop-filter:blur(20px);border:1px solid var(--bior-border-subtle);border-radius:14px;padding:10px 18px}' +
    '.gi-stat{display:flex;align-items:center;gap:6px;font-size:11px;color:rgba(255,255,255,0.5)}' +
    '.gi-stat-val{font-weight:700;color:#fff}' +
    '.gi-stat-sep{width:1px;height:20px;background:rgba(255,255,255,0.08)}' +
    '.gi-legend{position:absolute;bottom:60px;left:16px;background:var(--bior-glass-bg);backdrop-filter:blur(20px);border:1px solid var(--bior-border-subtle);border-radius:12px;padding:10px 14px;z-index:10;min-width:160px;display:none}' +
    '.gi-legend.visible{display:block}' +
    '.gi-legend-title{font-size:9px;font-weight:700;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px}' +
    '.gi-legend-item{display:flex;align-items:center;gap:8px;font-size:10px;color:rgba(255,255,255,0.6);margin-bottom:5px}' +
    '.gi-legend-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}' +
    '.gi-legend-sq{width:10px;height:10px;border-radius:3px;flex-shrink:0;border:1px solid rgba(255,255,255,0.15)}' +
    '.gi-legend-diamond{width:8px;height:8px;flex-shrink:0;transform:rotate(45deg)}' +
    '.gi-legend-tri{width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-bottom:10px solid;flex-shrink:0}' +
    '.gi-detail-panel{position:absolute;top:16px;right:60px;width:320px;background:var(--bior-glass-bg);backdrop-filter:blur(24px);border:1px solid var(--bior-border-subtle);border-radius:16px;padding:20px;z-index:10;display:none;box-shadow:var(--bior-shadow-lg);max-height:calc(100vh - 100px);overflow-y:auto}' +
    '.gi-detail-panel.visible{display:block}' +
    '.gi-detail-close{position:absolute;top:12px;right:12px;width:28px;height:28px;border-radius:8px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(255,255,255,0.4);font-size:11px;transition:all 0.2s}' +
    '.gi-detail-close:hover{background:rgba(239,68,68,0.1);border-color:rgba(239,68,68,0.3);color:#ef4444}' +
    '.gi-detail-score{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:8px;font-size:12px;font-weight:700;font-family:monospace}' +
    '.gi-detail-dim{display:flex;align-items:center;gap:8px;margin-bottom:6px}' +
    '.gi-detail-dim-label{font-size:10px;color:rgba(255,255,255,0.4);width:90px;flex-shrink:0}' +
    '.gi-detail-dim-bar{flex:1;height:4px;background:rgba(255,255,255,0.06);border-radius:4px;overflow:hidden}' +
    '.gi-detail-dim-fill{height:100%;border-radius:4px;transition:width 0.5s ease}' +
    '.gi-detail-dim-val{font-size:10px;font-weight:600;color:rgba(255,255,255,0.6);width:28px;text-align:right;font-family:monospace}' +
    '.maplibregl-popup-content{background:var(--bior-glass-bg)!important;backdrop-filter:blur(16px);border:1px solid var(--bior-border-subtle)!important;border-radius:12px!important;padding:14px!important;color:var(--bior-text-primary)!important;box-shadow:var(--bior-shadow-xl)!important;min-width:220px;font-family:Inter,sans-serif!important}' +
    '.maplibregl-popup-tip{border-top-color:var(--bior-glass-bg)!important}' +
    '.maplibregl-popup-close-button{color:rgba(255,255,255,0.4)!important;font-size:16px!important;padding:4px 8px!important}' +
    '.maplibregl-popup-close-button:hover{color:#fff!important;background:transparent!important}' +
    '.maplibregl-ctrl-attrib{background:var(--bior-glass-bg)!important;color:var(--bior-text-faint)!important;font-size:9px!important;border-radius:6px 0 0 0!important}' +
    '.maplibregl-ctrl-attrib a{color:rgba(255,255,255,0.4)!important}' +
    '</style>' +

    '<div class="gi-header">' +
      '<div class="gi-back" onclick="openGeoIntelView()">' +
        '<div class="gi-back-icon"><i class="fas fa-arrow-left" style="font-size:11px"></i></div>' +
        '<span>Back to GeoIntel</span>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:10px">' +
        '<div style="width:32px;height:32px;border-radius:10px;background:rgba(0,168,107,0.15);display:flex;align-items:center;justify-content:center"><i class="fas fa-globe-americas" style="color:#00A86B;font-size:14px"></i></div>' +
        '<div><span style="font-size:14px;font-weight:700;color:#fff">GeoIntel Engine</span><span style="font-size:10px;color:rgba(255,255,255,0.3);margin-left:8px">489 Features &bull; 10 Layers &bull; Multi-Source Intelligence</span></div>' +
      '</div>' +
      '<div style="display:flex;gap:8px">' +
        '<button style="padding:6px 14px;border-radius:8px;background:rgba(0,168,107,0.1);border:1px solid rgba(0,168,107,0.2);color:#00A86B;font-size:11px;font-weight:600;cursor:pointer;font-family:Inter,sans-serif;transition:all 0.2s" onclick="giExportView()"><i class="fas fa-download" style="margin-right:4px"></i>Export</button>' +
      '</div>' +
    '</div>' +

    '<div class="gi-map-wrap">' +
      '<div id="geointelMap"></div>' +

      '<div class="gi-sidebar">' +
        '<div class="gi-section-title"><i class="fas fa-layer-group"></i> DATA LAYERS</div>' +
        '<div id="giLayerList"></div>' +
        '<div style="margin-top:14px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.06)">' +
          '<div class="gi-section-title"><i class="fas fa-search"></i> SEARCH PLATFORMS</div>' +
          '<div style="position:relative">' +
            '<i class="fas fa-search" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:10px;color:rgba(255,255,255,0.2)"></i>' +
            '<input type="text" id="giSearch" class="gi-search-input" placeholder="Search by name, layer, or country..." oninput="giDoSearch(this.value)">' +
          '</div>' +
          '<div id="giSearchResults" style="margin-top:8px;max-height:200px;overflow-y:auto"></div>' +
        '</div>' +
        '<div style="margin-top:14px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.06)">' +
          '<div class="gi-section-title"><i class="fas fa-info-circle"></i> LEGEND</div>' +
          '<div id="giLegend" style="font-size:10px;color:rgba(255,255,255,0.35)">Click a layer to toggle it on the map. Click a platform marker for details.</div>' +
        '</div>' +
      '</div>' +

      '<div class="gi-controls">' +
        '<div class="gi-ctrl-btn" onclick="giZoomIn()" title="Zoom In"><i class="fas fa-plus"></i></div>' +
        '<div class="gi-ctrl-btn" onclick="giZoomOut()" title="Zoom Out"><i class="fas fa-minus"></i></div>' +
        '<div class="gi-ctrl-btn" id="gi3DBtn" onclick="giToggle3D()" title="Toggle 3D Globe"><i class="fas fa-globe"></i></div>' +
        '<div class="gi-ctrl-btn" onclick="giResetView()" title="Reset View"><i class="fas fa-expand"></i></div>' +
        '<div class="gi-ctrl-btn" onclick="giToggleStyle()" title="Switch Map Style"><i class="fas fa-palette"></i></div>' +
      '</div>' +

      '<div class="gi-detail-panel" id="giDetailPanel"></div>' +
      '<div id="giLegend" class="gi-legend"></div>' +

      '<div class="gi-stats-bar">' +
        '<div class="gi-stat"><i class="fas fa-map-marker-alt" style="color:#00A86B"></i><span class="gi-stat-val" id="giStatFeatures">—</span> Features</div>' +
        '<div class="gi-stat-sep"></div>' +
        '<div class="gi-stat"><i class="fas fa-layer-group" style="color:#06b6d4"></i><span class="gi-stat-val" id="giStatLayers">1</span> Active</div>' +
        '<div class="gi-stat-sep"></div>' +
        '<div class="gi-stat"><i class="fas fa-globe" style="color:#8b5cf6"></i><span class="gi-stat-val" id="giStatCountries">—</span> Countries</div>' +
        '<div class="gi-stat-sep"></div>' +
        '<div class="gi-stat"><i class="fas fa-crosshairs" style="color:#f59e0b"></i>Zoom: <span class="gi-stat-val" id="giStatZoom">3.0</span></div>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function initGeoIntelView() {
  // Render layer toggles
  var list = document.getElementById('giLayerList');
  if (list) {
    list.innerHTML = giLayerDefs.map(function(l) {
      var isActive = giActiveLayers[l.id];
      return '<div class="gi-layer-toggle' + (isActive ? ' active' : '') + '" data-layer="' + l.id + '" onclick="giToggleLayer(\\'' + l.id + '\\')" title="' + l.desc + '">' +
        '<div class="gi-layer-dot" style="background:' + l.color + ';color:' + l.color + '"></div>' +
        '<i class="fas ' + l.icon + ' gi-layer-icon" style="color:' + l.color + '"></i>' +
        '<span class="gi-layer-label">' + l.label + '</span>' +
        '<div class="gi-layer-check">' + (isActive ? '<i class="fas fa-check"></i>' : '') + '</div>' +
      '</div>';
    }).join('');
  }

  // MapLibre GL JS is loaded in <head> — init map directly
  // Small delay to ensure DOM is fully painted
  setTimeout(giInitMap, 100);
}

function giInitMap() {
  // Prevent concurrent initialization
  if (_giMapInitializing) return;

  // If map already exists and is attached to the DOM, skip re-creation
  if (giMap && giMapReady && document.getElementById('geointelMap') && document.getElementById('geointelMap').querySelector('canvas')) {
    console.log('GeoIntel: Map already initialized, skipping');
    return;
  }

  var container = document.getElementById('geointelMap');
  if (!container || !window.maplibregl) {
    console.warn('GeoIntel: MISSING container=' + !!container + ' maplibregl=' + !!window.maplibregl);
    return;
  }

  // Ensure container has dimensions
  var rect = container.getBoundingClientRect();
  console.log('GeoIntel: Container ' + Math.round(rect.width) + 'x' + Math.round(rect.height));
  if (rect.width === 0 || rect.height === 0) {
    setTimeout(giInitMap, 300);
    return;
  }

  _giMapInitializing = true;

  // Clean up any previous map completely
  if (giMap) {
    try { giMap.remove(); } catch(e) {}
    giMap = null;
    giMapReady = false;
  }
  // Also clear any leftover canvas from a previous instance
  while (container.firstChild) { container.removeChild(container.firstChild); }

  try {
    console.log('GeoIntel: Creating MapLibre v' + maplibregl.version);
    giMap = new maplibregl.Map({
      container: container,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [35.0, 25.0],
      zoom: 3,
      attributionControl: false,
      maxZoom: 18,
      minZoom: 1.5,
      failIfMajorPerformanceCaveat: false,
      preserveDrawingBuffer: true
    });
  } catch(e) {
    console.error('GeoIntel: Map creation FAILED', e);
    showToast('Map failed to initialize: ' + e.message, 'error');
    _giMapInitializing = false;
    return;
  }

  giMap.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
  giMap.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');

  giMap.on('error', function(e) {
    console.error('GeoIntel map error:', e.error ? e.error.message : e);
  });

  giMap.on('zoom', function() {
    var z = document.getElementById('giStatZoom');
    if (z) z.textContent = giMap.getZoom().toFixed(1);
  });

  giMap.on('load', function() {
    console.log('GeoIntel: MAP LOADED OK');
    giMapReady = true;
    _giMapInitializing = false;
    giLoadPlatformData();
    // Load any layers toggled on before the map was ready
    Object.keys(giActiveLayers).forEach(function(lid) {
      if (lid !== 'platforms' && giActiveLayers[lid] && !giLayerDataLoaded[lid]) {
        var loadFns = { bsl4: giLoadBsl4Data, ctbto: giLoadCtbtoData, outbreaks: giLoadOutbreakData, ghs: giLoadGhsData, cbrn: giLoadCbrnData, genomic: giLoadGenomicData, env: giLoadEnvData, population: giLoadPopData, policy: giLoadPolicyData };
        if (loadFns[lid]) loadFns[lid]();
      }
    });
  });

  setTimeout(function() {
    if (!giMapReady) {
      console.warn('GeoIntel: Map not loaded after 15s');
      _giMapInitializing = false;
    }
  }, 15000);
}

function giLoadPlatformData() {
  fetch('/static/geointel-platforms.json')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      giPlatformData = data;
      giAddPlatformLayer();
      giUpdateStats();
    })
    .catch(function(e) {
      console.error('GeoIntel: Failed to load platform data', e);
      showToast('Failed to load GeoIntel platform data', 'error');
    });
}

function giAddPlatformLayer() {
  if (!giMapReady) { console.warn("GeoIntel: Map not ready for platform layer"); return; }
  if (!giMap || !giPlatformData) return;

  // Remove existing source/layers
  try { if (giMap.getLayer('gi-platform-labels')) giMap.removeLayer('gi-platform-labels'); } catch(e) {}
  try { if (giMap.getLayer('gi-platform-glow')) giMap.removeLayer('gi-platform-glow'); } catch(e) {}
  try { if (giMap.getLayer('gi-platforms')) giMap.removeLayer('gi-platforms'); } catch(e) {}
  try { if (giMap.getSource('gi-platforms-src')) giMap.removeSource('gi-platforms-src'); } catch(e) {}

  giMap.addSource('gi-platforms-src', {
    type: 'geojson',
    data: giPlatformData,
    cluster: true,
    clusterMaxZoom: 10,
    clusterRadius: 45
  });

  // Cluster circles
  giMap.addLayer({
    id: 'gi-clusters',
    type: 'circle',
    source: 'gi-platforms-src',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': ['step', ['get', 'point_count'], '#00A86B', 10, '#06b6d4', 30, '#3b82f6', 60, '#8b5cf6'],
      'circle-radius': ['step', ['get', 'point_count'], 18, 10, 24, 30, 30, 60, 36],
      'circle-opacity': 0.85,
      'circle-stroke-width': 2,
      'circle-stroke-color': 'rgba(255,255,255,0.15)'
    }
  });

  // Cluster labels
  giMap.addLayer({
    id: 'gi-cluster-count',
    type: 'symbol',
    source: 'gi-platforms-src',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['Open Sans Bold'],
      'text-size': 12
    },
    paint: { 'text-color': '#ffffff' }
  });

  // Individual platform glow
  giMap.addLayer({
    id: 'gi-platform-glow',
    type: 'circle',
    source: 'gi-platforms-src',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-radius': 12,
      'circle-color': ['match', ['get', 'layer'],
        'L1_Surveillance', '#22c55e',
        'L2_Genomic', '#38bdf8',
        'L3_Defense', '#ef4444',
        'L4_CBRN_Operational', '#f59e0b',
        'L4_Hardware', '#8b5cf6',
        'L5_Policy', '#ec4899',
        '#00A86B'
      ],
      'circle-opacity': 0.15,
      'circle-blur': 1
    }
  });

  // Individual platform dots
  giMap.addLayer({
    id: 'gi-platforms',
    type: 'circle',
    source: 'gi-platforms-src',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 4, 6, 6, 12, 8],
      'circle-color': ['match', ['get', 'layer'],
        'L1_Surveillance', '#22c55e',
        'L2_Genomic', '#38bdf8',
        'L3_Defense', '#ef4444',
        'L4_CBRN_Operational', '#f59e0b',
        'L4_Hardware', '#8b5cf6',
        'L5_Policy', '#ec4899',
        '#00A86B'
      ],
      'circle-opacity': 0.9,
      'circle-stroke-width': 2,
      'circle-stroke-color': 'rgba(255,255,255,0.25)'
    }
  });

  // Platform labels at higher zoom
  giMap.addLayer({
    id: 'gi-platform-labels',
    type: 'symbol',
    source: 'gi-platforms-src',
    filter: ['!', ['has', 'point_count']],
    minzoom: 6,
    layout: {
      'text-field': ['get', 'name'],
      'text-font': ['Open Sans Regular'],
      'text-size': 10,
      'text-offset': [0, 1.5],
      'text-anchor': 'top',
      'text-max-width': 12
    },
    paint: {
      'text-color': 'rgba(255,255,255,0.7)',
      'text-halo-color': 'rgba(10,15,26,0.9)',
      'text-halo-width': 1.5
    }
  });

  // Click handlers
  giMap.on('click', 'gi-platforms', function(e) {
    var f = e.features[0];
    if (!f) return;
    giShowPlatformDetail(f.properties);
  });

  giMap.on('click', 'gi-clusters', function(e) {
    var features = giMap.queryRenderedFeatures(e.point, { layers: ['gi-clusters'] });
    var clusterId = features[0].properties.cluster_id;
    giMap.getSource('gi-platforms-src').getClusterExpansionZoom(clusterId, function(err, zoom) {
      if (err) return;
      giMap.easeTo({ center: features[0].geometry.coordinates, zoom: zoom });
    });
  });

  // Hover cursor
  giMap.on('mouseenter', 'gi-platforms', function() { giMap.getCanvas().style.cursor = 'pointer'; });
  giMap.on('mouseleave', 'gi-platforms', function() { giMap.getCanvas().style.cursor = ''; });
  giMap.on('mouseenter', 'gi-clusters', function() { giMap.getCanvas().style.cursor = 'pointer'; });
  giMap.on('mouseleave', 'gi-clusters', function() { giMap.getCanvas().style.cursor = ''; });

  // Hover popup on platforms
  var hoverPopup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 12 });
  giMap.on('mouseenter', 'gi-platforms', function(e) {
    var f = e.features[0];
    if (!f) return;
    var p = f.properties;
    var layerColors = { L1_Surveillance:'#22c55e', L2_Genomic:'#38bdf8', L3_Defense:'#ef4444', L4_CBRN_Operational:'#f59e0b', L4_Hardware:'#8b5cf6', L5_Policy:'#ec4899' };
    var lc = layerColors[p.layer] || '#00A86B';
    var scoreColor = p.score >= 90 ? '#22c55e' : p.score >= 80 ? '#38bdf8' : p.score >= 70 ? '#f59e0b' : '#ef4444';
    hoverPopup.setLngLat(e.lngLat)
      .setHTML(
        '<div style="font-size:13px;font-weight:700;margin-bottom:4px">' + (p.name||'Unknown') + '</div>' +
        '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">' +
          '<span style="font-size:10px;padding:2px 8px;border-radius:6px;background:' + lc + '20;color:' + lc + ';font-weight:600">' + (p.layer_name||p.layer||'') + '</span>' +
          '<span style="font-size:12px;font-weight:700;color:' + scoreColor + ';font-family:monospace">' + (p.score||'—') + '</span>' +
        '</div>' +
        '<div style="font-size:10px;color:rgba(255,255,255,0.4)">' + (p.country||'') + (p.category ? ' &bull; ' + p.category : '') + '</div>'
      )
      .addTo(giMap);
  });
  giMap.on('mouseleave', 'gi-platforms', function() { hoverPopup.remove(); });
}

function giShowPlatformDetail(props) {
  var panel = document.getElementById('giDetailPanel');
  if (!panel) return;

  var layerColors = { L1_Surveillance:'#22c55e', L2_Genomic:'#38bdf8', L3_Defense:'#ef4444', L4_CBRN_Operational:'#f59e0b', L4_Hardware:'#8b5cf6', L5_Policy:'#ec4899' };
  var lc = layerColors[props.layer] || '#00A86B';
  var scoreColor = props.score >= 90 ? '#22c55e' : props.score >= 80 ? '#38bdf8' : props.score >= 70 ? '#f59e0b' : '#ef4444';

  // Parse dimensions
  var dims = {};
  try { dims = typeof props.scores === 'string' ? JSON.parse(props.scores) : (props.scores || {}); } catch(e) {}

  var dimNames = {
    data_integration: 'Data Integration',
    analytics_capability: 'Analytics',
    visualization: 'Visualization',
    accessibility: 'Accessibility',
    scalability: 'Scalability',
    documentation: 'Documentation',
    community_support: 'Community',
    security_compliance: 'Security',
    interoperability: 'Interoperability',
    real_time_capability: 'Real-Time'
  };

  var dimBars = Object.keys(dimNames).map(function(k) {
    var v = dims[k] || 0;
    var barColor = v >= 90 ? '#22c55e' : v >= 80 ? '#38bdf8' : v >= 70 ? '#f59e0b' : '#ef4444';
    return '<div class="gi-detail-dim">' +
      '<span class="gi-detail-dim-label">' + dimNames[k] + '</span>' +
      '<div class="gi-detail-dim-bar"><div class="gi-detail-dim-fill" style="width:' + v + '%;background:' + barColor + '"></div></div>' +
      '<span class="gi-detail-dim-val">' + v + '</span>' +
    '</div>';
  }).join('');

  panel.innerHTML =
    '<div class="gi-detail-close" onclick="giCloseDetail()"><i class="fas fa-times"></i></div>' +
    '<div style="margin-bottom:14px">' +
      '<div style="font-size:9px;font-weight:700;color:rgba(255,255,255,0.25);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px">PLATFORM PROFILE</div>' +
      '<div style="font-size:16px;font-weight:700;color:#fff;margin-bottom:6px">' + (props.name || 'Unknown') + '</div>' +
      '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
        '<span style="padding:3px 10px;border-radius:8px;background:' + lc + '15;color:' + lc + ';font-size:10px;font-weight:600;border:1px solid ' + lc + '30">' + (props.layer_name || props.layer || '') + '</span>' +
        '<span class="gi-detail-score" style="background:' + scoreColor + '15;color:' + scoreColor + ';border:1px solid ' + scoreColor + '30"><i class="fas fa-star" style="font-size:8px"></i> ' + (props.score || '—') + '</span>' +
        '<span style="font-size:10px;color:rgba(255,255,255,0.3)">#' + (props.rank || '—') + '</span>' +
      '</div>' +
    '</div>' +
    '<div style="font-size:11px;color:rgba(255,255,255,0.45);line-height:1.6;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,0.06)">' + (props.description || '') + '</div>' +
    (props.country ? '<div style="display:flex;align-items:center;gap:6px;font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:12px"><i class="fas fa-map-marker-alt" style="color:#00A86B;width:14px;text-align:center"></i>' + props.country + '</div>' : '') +
    (props.category ? '<div style="display:flex;align-items:center;gap:6px;font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:12px"><i class="fas fa-tag" style="color:#06b6d4;width:14px;text-align:center"></i>' + props.category + '</div>' : '') +
    (props.url ? '<div style="display:flex;align-items:center;gap:6px;font-size:11px;margin-bottom:14px"><i class="fas fa-external-link-alt" style="color:#3b82f6;width:14px;text-align:center"></i><a href="' + props.url + '" target="_blank" rel="noopener" style="color:#3b82f6;text-decoration:none;word-break:break-all">' + props.url + '</a></div>' : '') +
    '<div style="margin-bottom:4px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.08em">DIMENSION SCORES</div>' +
    dimBars +
    (props.biosurveillance_class ? '<div style="margin-top:14px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.06);font-size:10px;color:rgba(255,255,255,0.3)"><strong style="color:rgba(255,255,255,0.5)">Class:</strong> ' + props.biosurveillance_class + '</div>' : '') +
    (props.military_biodefense === 'true' || props.military_biodefense === true ? '<div style="margin-top:6px;display:flex;align-items:center;gap:4px;font-size:10px;color:#f59e0b"><i class="fas fa-shield-alt"></i> Military / Biodefense</div>' : '');

  panel.classList.add('visible');
}

window.giCloseDetail = function() {
  var panel = document.getElementById('giDetailPanel');
  if (panel) panel.classList.remove('visible');
};

// ===== GEOINTEL CONTROLS =====
window.giZoomIn = function() { if (giMap) giMap.zoomIn(); };
window.giZoomOut = function() { if (giMap) giMap.zoomOut(); };
window.giResetView = function() { if (giMap) giMap.flyTo({ center: [35.0, 25.0], zoom: 3, pitch: 0, bearing: 0 }); };

window.giToggle3D = function() {
  if (!giMap) return;
  gi3DMode = !gi3DMode;
  var btn = document.getElementById('gi3DBtn');
  if (btn) btn.classList.toggle('active', gi3DMode);
  if (gi3DMode) {
    giMap.easeTo({ pitch: 50, bearing: -15, duration: 800 });
  } else {
    giMap.easeTo({ pitch: 0, bearing: 0, duration: 800 });
  }
};

var giStyleIndex = 0;
var giStyles = [
  { url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json', name: 'Dark' },
  { url: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json', name: 'Light' },
  { url: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json', name: 'Voyager' }
];
window.giToggleStyle = function() {
  if (!giMap) return;
  giStyleIndex = (giStyleIndex + 1) % giStyles.length;
  showToast('Map style: ' + giStyles[giStyleIndex].name, 'info');
  giMap.setStyle(giStyles[giStyleIndex].url);
  giMap.once('styledata', function() {
    setTimeout(function() { giReAddAllActiveLayers(); }, 300);
  });
};

window.giToggleLayer = function(layerId) {
  giActiveLayers[layerId] = !giActiveLayers[layerId];
  // Re-render toggles
  var list = document.getElementById('giLayerList');
  if (list) {
    list.innerHTML = giLayerDefs.map(function(l) {
      var isActive = giActiveLayers[l.id];
      return '<div class="gi-layer-toggle' + (isActive ? ' active' : '') + '" data-layer="' + l.id + '" onclick="giToggleLayer(\\'' + l.id + '\\')" title="' + l.desc + '">' +
        '<div class="gi-layer-dot" style="background:' + l.color + ';color:' + l.color + '"></div>' +
        '<i class="fas ' + l.icon + ' gi-layer-icon" style="color:' + l.color + '"></i>' +
        '<span class="gi-layer-label">' + l.label + '</span>' +
        '<div class="gi-layer-check">' + (isActive ? '<i class="fas fa-check"></i>' : '') + '</div>' +
      '</div>';
    }).join('');
  }

  // Toggle map layer visibility for platforms
  if (layerId === 'platforms' && giMap) {
    var vis = giActiveLayers.platforms ? 'visible' : 'none';
    ['gi-clusters', 'gi-cluster-count', 'gi-platform-glow', 'gi-platforms', 'gi-platform-labels'].forEach(function(lid) {
      if (giMap.getLayer(lid)) giMap.setLayoutProperty(lid, 'visibility', vis);
    });
  }

  // Handle BSL-4 layer
  if (layerId === 'bsl4') {
    if (giActiveLayers.bsl4) {
      if (!giLayerDataLoaded.bsl4) { giLoadBsl4Data(); }
      else { giSetLayerVis('gi-bsl4', 'visible'); giSetLayerVis('gi-bsl4-glow', 'visible'); giSetLayerVis('gi-bsl4-labels', 'visible'); }
    } else {
      giSetLayerVis('gi-bsl4', 'none'); giSetLayerVis('gi-bsl4-glow', 'none'); giSetLayerVis('gi-bsl4-labels', 'none');
    }
  }

  // Handle CTBTO layer
  if (layerId === 'ctbto') {
    if (giActiveLayers.ctbto) {
      if (!giLayerDataLoaded.ctbto) { giLoadCtbtoData(); }
      else { giSetLayerVis('gi-ctbto', 'visible'); giSetLayerVis('gi-ctbto-glow', 'visible'); giSetLayerVis('gi-ctbto-labels', 'visible'); }
    } else {
      giSetLayerVis('gi-ctbto', 'none'); giSetLayerVis('gi-ctbto-glow', 'none'); giSetLayerVis('gi-ctbto-labels', 'none');
    }
  }

  // Handle WHO Outbreaks layer
  if (layerId === 'outbreaks') {
    if (giActiveLayers.outbreaks) {
      if (!giLayerDataLoaded.outbreaks) { giLoadOutbreakData(); }
      else { giSetLayerVis('gi-outbreaks', 'visible'); giSetLayerVis('gi-outbreaks-glow', 'visible'); giSetLayerVis('gi-outbreaks-labels', 'visible'); }
    } else {
      giSetLayerVis('gi-outbreaks', 'none'); giSetLayerVis('gi-outbreaks-glow', 'none'); giSetLayerVis('gi-outbreaks-labels', 'none');
    }
  }

  // Handle GHS Index layer
  if (layerId === 'ghs') {
    if (giActiveLayers.ghs) {
      if (!giLayerDataLoaded.ghs) { giLoadGhsData(); }
      else { giSetLayerVis('gi-ghs', 'visible'); giSetLayerVis('gi-ghs-glow', 'visible'); giSetLayerVis('gi-ghs-labels', 'visible'); }
    } else {
      giSetLayerVis('gi-ghs', 'none'); giSetLayerVis('gi-ghs-glow', 'none'); giSetLayerVis('gi-ghs-labels', 'none');
    }
  }

  // Handle CBRN layer
  if (layerId === 'cbrn') {
    if (giActiveLayers.cbrn) {
      if (!giLayerDataLoaded.cbrn) { giLoadCbrnData(); }
      else { giSetLayerVis('gi-cbrn', 'visible'); giSetLayerVis('gi-cbrn-glow', 'visible'); giSetLayerVis('gi-cbrn-labels', 'visible'); }
    } else {
      giSetLayerVis('gi-cbrn', 'none'); giSetLayerVis('gi-cbrn-glow', 'none'); giSetLayerVis('gi-cbrn-labels', 'none');
    }
  }

  // Handle Genomic Surveillance layer
  if (layerId === 'genomic') {
    if (giActiveLayers.genomic) {
      if (!giLayerDataLoaded.genomic) { giLoadGenomicData(); }
      else { giSetLayerVis('gi-genomic', 'visible'); giSetLayerVis('gi-genomic-glow', 'visible'); giSetLayerVis('gi-genomic-labels', 'visible'); }
    } else {
      giSetLayerVis('gi-genomic', 'none'); giSetLayerVis('gi-genomic-glow', 'none'); giSetLayerVis('gi-genomic-labels', 'none');
    }
  }

  // Handle Environmental layer
  if (layerId === 'env') {
    if (giActiveLayers.env) {
      if (!giLayerDataLoaded.env) { giLoadEnvData(); }
      else { giSetLayerVis('gi-env', 'visible'); giSetLayerVis('gi-env-glow', 'visible'); giSetLayerVis('gi-env-labels', 'visible'); }
    } else {
      giSetLayerVis('gi-env', 'none'); giSetLayerVis('gi-env-glow', 'none'); giSetLayerVis('gi-env-labels', 'none');
    }
  }

  // Handle Population Density layer
  if (layerId === 'population') {
    if (giActiveLayers.population) {
      if (!giLayerDataLoaded.population) { giLoadPopulationData(); }
      else { giSetLayerVis('gi-pop', 'visible'); giSetLayerVis('gi-pop-glow', 'visible'); giSetLayerVis('gi-pop-labels', 'visible'); }
    } else {
      giSetLayerVis('gi-pop', 'none'); giSetLayerVis('gi-pop-glow', 'none'); giSetLayerVis('gi-pop-labels', 'none');
    }
  }

  // Handle Policy Readiness layer
  if (layerId === 'policy') {
    if (giActiveLayers.policy) {
      if (!giLayerDataLoaded.policy) { giLoadPolicyData(); }
      else { giSetLayerVis('gi-policy', 'visible'); giSetLayerVis('gi-policy-glow', 'visible'); giSetLayerVis('gi-policy-labels', 'visible'); }
    } else {
      giSetLayerVis('gi-policy', 'none'); giSetLayerVis('gi-policy-glow', 'none'); giSetLayerVis('gi-policy-labels', 'none');
    }
  }

  giUpdateStats();
  giUpdateLegend();
};

function giSetLayerVis(name, vis) {
  if (giMap && giMap.getLayer(name)) giMap.setLayoutProperty(name, 'visibility', vis);
}

// ===== BSL-4 LAYER =====
function giLoadBsl4Data() {
  showToast('Loading BSL-4 Laboratories...', 'info');
  fetch('/static/geointel-bsl4.json')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      giBsl4Data = data;
      giLayerDataLoaded.bsl4 = true;
      giAddBsl4Layer();
      giUpdateStats();
      giUpdateLegend();
      showToast(data.features.length + ' BSL-4 labs loaded', 'success');
    })
    .catch(function(e) { console.error('GeoIntel: BSL-4 load error', e); showToast('Failed to load BSL-4 data', 'error'); });
}

function giAddBsl4Layer() {
  if (!giMapReady) { console.warn("GeoIntel: Map not ready for BSL4 layer"); return; }
  if (!giMap || !giBsl4Data) return;
  try { if (giMap.getLayer('gi-bsl4-labels')) giMap.removeLayer('gi-bsl4-labels'); } catch(e) {}
  try { if (giMap.getLayer('gi-bsl4')) giMap.removeLayer('gi-bsl4'); } catch(e) {}
  try { if (giMap.getLayer('gi-bsl4-glow')) giMap.removeLayer('gi-bsl4-glow'); } catch(e) {}
  try { if (giMap.getSource('gi-bsl4-src')) giMap.removeSource('gi-bsl4-src'); } catch(e) {}

  giMap.addSource('gi-bsl4-src', { type: 'geojson', data: giBsl4Data });

  giMap.addLayer({
    id: 'gi-bsl4-glow', type: 'circle', source: 'gi-bsl4-src',
    paint: { 'circle-radius': 14, 'circle-color': '#ef4444', 'circle-opacity': 0.15, 'circle-blur': 1 }
  });
  giMap.addLayer({
    id: 'gi-bsl4', type: 'circle', source: 'gi-bsl4-src',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 5, 6, 7, 12, 9],
      'circle-color': ['match', ['get', 'status'], 'Operational', '#ef4444', 'Under Construction', '#f59e0b', 'Planned', '#6b7280', '#ef4444'],
      'circle-opacity': 0.9,
      'circle-stroke-width': 2.5,
      'circle-stroke-color': 'rgba(255,255,255,0.3)'
    }
  });
  giMap.addLayer({
    id: 'gi-bsl4-labels', type: 'symbol', source: 'gi-bsl4-src', minzoom: 5,
    layout: { 'text-field': ['get', 'name'], 'text-font': ['Open Sans Regular'], 'text-size': 10, 'text-offset': [0, 1.5], 'text-anchor': 'top', 'text-max-width': 12 },
    paint: { 'text-color': '#fca5a5', 'text-halo-color': 'rgba(10,15,26,0.9)', 'text-halo-width': 1.5 }
  });

  // BSL-4 hover popup
  var bsl4Popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 12 });
  giMap.on('mouseenter', 'gi-bsl4', function(e) {
    giMap.getCanvas().style.cursor = 'pointer';
    var f = e.features[0]; if (!f) return;
    var p = f.properties;
    var statusColor = p.status === 'Operational' ? '#22c55e' : p.status === 'Under Construction' ? '#f59e0b' : '#6b7280';
    bsl4Popup.setLngLat(e.lngLat)
      .setHTML(
        '<div style="font-size:13px;font-weight:700;margin-bottom:4px"><i class="fas fa-flask" style="color:#ef4444;margin-right:6px"></i>' + (p.name||'Unknown') + '</div>' +
        '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">' +
          '<span style="font-size:10px;padding:2px 8px;border-radius:6px;background:' + statusColor + '20;color:' + statusColor + ';font-weight:600">' + (p.status||'Unknown') + '</span>' +
          '<span style="font-size:10px;padding:2px 8px;border-radius:6px;background:#ef444420;color:#ef4444;font-weight:600">' + (p.type||'BSL-4') + '</span>' +
        '</div>' +
        '<div style="font-size:10px;color:rgba(255,255,255,0.4)">' + (p.city||'') + ', ' + (p.country||'') + (p.year ? ' &bull; Est. ' + p.year : '') + '</div>' +
        (p.organization ? '<div style="font-size:10px;color:rgba(255,255,255,0.35);margin-top:3px"><i class="fas fa-building" style="margin-right:4px"></i>' + p.organization + '</div>' : '')
      ).addTo(giMap);
  });
  giMap.on('mouseleave', 'gi-bsl4', function() { giMap.getCanvas().style.cursor = ''; bsl4Popup.remove(); });
  giMap.on('click', 'gi-bsl4', function(e) { var f = e.features[0]; if (f) giShowLayerDetail('bsl4', f.properties, e.lngLat); });
}

// ===== CTBTO LAYER =====
function giLoadCtbtoData() {
  showToast('Loading CTBTO Stations...', 'info');
  fetch('/static/geointel-ctbto.json')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      giCtbtoData = data;
      giLayerDataLoaded.ctbto = true;
      giAddCtbtoLayer();
      giUpdateStats();
      giUpdateLegend();
      showToast(data.features.length + ' CTBTO stations loaded', 'success');
    })
    .catch(function(e) { console.error('GeoIntel: CTBTO load error', e); showToast('Failed to load CTBTO data', 'error'); });
}

function giAddCtbtoLayer() {
  if (!giMapReady) { console.warn("GeoIntel: Map not ready for CTBTO layer"); return; }
  if (!giMap || !giCtbtoData) return;
  try { if (giMap.getLayer('gi-ctbto-labels')) giMap.removeLayer('gi-ctbto-labels'); } catch(e) {}
  try { if (giMap.getLayer('gi-ctbto')) giMap.removeLayer('gi-ctbto'); } catch(e) {}
  try { if (giMap.getLayer('gi-ctbto-glow')) giMap.removeLayer('gi-ctbto-glow'); } catch(e) {}
  try { if (giMap.getSource('gi-ctbto-src')) giMap.removeSource('gi-ctbto-src'); } catch(e) {}

  giMap.addSource('gi-ctbto-src', { type: 'geojson', data: giCtbtoData });

  var stTypeColors = { Seismic: '#f59e0b', Hydroacoustic: '#06b6d4', Infrasound: '#8b5cf6', Radionuclide: '#ef4444' };

  giMap.addLayer({
    id: 'gi-ctbto-glow', type: 'circle', source: 'gi-ctbto-src',
    paint: { 'circle-radius': 14, 'circle-color': '#f59e0b', 'circle-opacity': 0.12, 'circle-blur': 1 }
  });
  giMap.addLayer({
    id: 'gi-ctbto', type: 'circle', source: 'gi-ctbto-src',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 5, 6, 7, 12, 9],
      'circle-color': ['match', ['get', 'station_type'],
        'Seismic', '#f59e0b', 'Hydroacoustic', '#06b6d4', 'Infrasound', '#8b5cf6', 'Radionuclide', '#ef4444', '#f59e0b'],
      'circle-opacity': 0.9,
      'circle-stroke-width': 2,
      'circle-stroke-color': 'rgba(255,255,255,0.2)'
    }
  });
  giMap.addLayer({
    id: 'gi-ctbto-labels', type: 'symbol', source: 'gi-ctbto-src', minzoom: 5,
    layout: { 'text-field': ['get', 'name'], 'text-font': ['Open Sans Regular'], 'text-size': 10, 'text-offset': [0, 1.5], 'text-anchor': 'top', 'text-max-width': 12 },
    paint: { 'text-color': '#fde68a', 'text-halo-color': 'rgba(10,15,26,0.9)', 'text-halo-width': 1.5 }
  });

  var ctbtoPopup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 12 });
  giMap.on('mouseenter', 'gi-ctbto', function(e) {
    giMap.getCanvas().style.cursor = 'pointer';
    var f = e.features[0]; if (!f) return;
    var p = f.properties;
    var tc = stTypeColors[p.station_type] || '#f59e0b';
    ctbtoPopup.setLngLat(e.lngLat)
      .setHTML(
        '<div style="font-size:13px;font-weight:700;margin-bottom:4px"><i class="fas fa-broadcast-tower" style="color:#f59e0b;margin-right:6px"></i>' + (p.name||'Unknown') + '</div>' +
        '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">' +
          '<span style="font-size:10px;padding:2px 8px;border-radius:6px;background:' + tc + '20;color:' + tc + ';font-weight:600">' + (p.station_type||'Unknown') + '</span>' +
        '</div>' +
        '<div style="font-size:10px;color:rgba(255,255,255,0.4)">' + (p.country||'') + '</div>'
      ).addTo(giMap);
  });
  giMap.on('mouseleave', 'gi-ctbto', function() { giMap.getCanvas().style.cursor = ''; ctbtoPopup.remove(); });
  giMap.on('click', 'gi-ctbto', function(e) { var f = e.features[0]; if (f) giShowLayerDetail('ctbto', f.properties, e.lngLat); });
}

// ===== WHO OUTBREAKS LAYER =====
function giLoadOutbreakData() {
  showToast('Loading WHO Outbreaks...', 'info');
  fetch('/static/geointel-outbreaks.json')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      giOutbreakData = data;
      giLayerDataLoaded.outbreaks = true;
      giAddOutbreakLayer();
      giUpdateStats();
      giUpdateLegend();
      showToast(data.features.length + ' outbreak events loaded', 'success');
    })
    .catch(function(e) { console.error('GeoIntel: Outbreak load error', e); showToast('Failed to load outbreak data', 'error'); });
}

function giAddOutbreakLayer() {
  if (!giMapReady) { console.warn("GeoIntel: Map not ready for outbreak layer"); return; }
  if (!giMap || !giOutbreakData) return;
  try { if (giMap.getLayer('gi-outbreaks-labels')) giMap.removeLayer('gi-outbreaks-labels'); } catch(e) {}
  try { if (giMap.getLayer('gi-outbreaks')) giMap.removeLayer('gi-outbreaks'); } catch(e) {}
  try { if (giMap.getLayer('gi-outbreaks-glow')) giMap.removeLayer('gi-outbreaks-glow'); } catch(e) {}
  try { if (giMap.getSource('gi-outbreaks-src')) giMap.removeSource('gi-outbreaks-src'); } catch(e) {}

  giMap.addSource('gi-outbreaks-src', { type: 'geojson', data: giOutbreakData });

  giMap.addLayer({
    id: 'gi-outbreaks-glow', type: 'circle', source: 'gi-outbreaks-src',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['get', 'cases'], 0, 16, 100, 24, 1000, 36, 10000, 50],
      'circle-color': ['match', ['get', 'severity'], 'Critical', '#ef4444', 'High', '#f97316', 'Moderate', '#f59e0b', 'Low', '#22c55e', '#ec4899'],
      'circle-opacity': 0.12,
      'circle-blur': 0.8
    }
  });
  giMap.addLayer({
    id: 'gi-outbreaks', type: 'circle', source: 'gi-outbreaks-src',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['get', 'cases'], 0, 6, 100, 9, 1000, 13, 10000, 18],
      'circle-color': ['match', ['get', 'severity'], 'Critical', '#ef4444', 'High', '#f97316', 'Moderate', '#f59e0b', 'Low', '#22c55e', '#ec4899'],
      'circle-opacity': 0.85,
      'circle-stroke-width': 2,
      'circle-stroke-color': 'rgba(255,255,255,0.3)'
    }
  });
  giMap.addLayer({
    id: 'gi-outbreaks-labels', type: 'symbol', source: 'gi-outbreaks-src', minzoom: 4,
    layout: { 'text-field': ['concat', ['get', 'pathogen'], GI_NL, ['get', 'cases'], ' cases'], 'text-font': ['Open Sans Bold'], 'text-size': 9, 'text-offset': [0, 2], 'text-anchor': 'top', 'text-max-width': 12 },
    paint: { 'text-color': '#fca5a5', 'text-halo-color': 'rgba(10,15,26,0.9)', 'text-halo-width': 1.5 }
  });

  var obPopup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 12 });
  giMap.on('mouseenter', 'gi-outbreaks', function(e) {
    giMap.getCanvas().style.cursor = 'pointer';
    var f = e.features[0]; if (!f) return;
    var p = f.properties;
    var sc = p.severity === 'Critical' ? '#ef4444' : p.severity === 'High' ? '#f97316' : p.severity === 'Moderate' ? '#f59e0b' : '#22c55e';
    obPopup.setLngLat(e.lngLat)
      .setHTML(
        '<div style="font-size:13px;font-weight:700;margin-bottom:4px"><i class="fas fa-virus" style="color:#ec4899;margin-right:6px"></i>' + (p.name||'Unknown') + '</div>' +
        '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">' +
          '<span style="font-size:10px;padding:2px 8px;border-radius:6px;background:' + sc + '20;color:' + sc + ';font-weight:600">' + (p.severity||'') + '</span>' +
          '<span style="font-size:11px;font-weight:700;color:#fff;font-family:monospace">' + (p.cases ? p.cases.toLocaleString() + ' cases' : '') + '</span>' +
        '</div>' +
        '<div style="font-size:10px;color:rgba(255,255,255,0.4)">' + (p.country||'') + ' &bull; ' + (p.pathogen||'') + ' &bull; ' + (p.date||'') + '</div>'
      ).addTo(giMap);
  });
  giMap.on('mouseleave', 'gi-outbreaks', function() { giMap.getCanvas().style.cursor = ''; obPopup.remove(); });
  giMap.on('click', 'gi-outbreaks', function(e) { var f = e.features[0]; if (f) giShowLayerDetail('outbreaks', f.properties, e.lngLat); });
}

// ===== GHS INDEX LAYER =====
function giLoadGhsData() {
  showToast('Loading GHS Index...', 'info');
  fetch('/static/geointel-ghs.json')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      giGhsData = data;
      giLayerDataLoaded.ghs = true;
      giAddGhsLayer();
      giUpdateStats();
      giUpdateLegend();
      showToast(data.features.length + ' GHS country scores loaded', 'success');
    })
    .catch(function(e) { console.error('GeoIntel: GHS load error', e); showToast('Failed to load GHS data', 'error'); });
}

function giAddGhsLayer() {
  if (!giMapReady) { console.warn("GeoIntel: Map not ready for GHS layer"); return; }
  if (!giMap || !giGhsData) return;
  try { if (giMap.getLayer('gi-ghs-labels')) giMap.removeLayer('gi-ghs-labels'); } catch(e) {}
  try { if (giMap.getLayer('gi-ghs')) giMap.removeLayer('gi-ghs'); } catch(e) {}
  try { if (giMap.getLayer('gi-ghs-glow')) giMap.removeLayer('gi-ghs-glow'); } catch(e) {}
  try { if (giMap.getSource('gi-ghs-src')) giMap.removeSource('gi-ghs-src'); } catch(e) {}

  giMap.addSource('gi-ghs-src', { type: 'geojson', data: giGhsData });

  giMap.addLayer({
    id: 'gi-ghs-glow', type: 'circle', source: 'gi-ghs-src',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['get', 'score'], 20, 12, 50, 18, 80, 26],
      'circle-color': ['interpolate', ['linear'], ['get', 'score'], 20, '#ef4444', 40, '#f59e0b', 60, '#06b6d4', 80, '#22c55e'],
      'circle-opacity': 0.15, 'circle-blur': 0.8
    }
  });
  giMap.addLayer({
    id: 'gi-ghs', type: 'circle', source: 'gi-ghs-src',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 6, 6, 9, 12, 12],
      'circle-color': ['interpolate', ['linear'], ['get', 'score'], 20, '#ef4444', 40, '#f59e0b', 60, '#06b6d4', 80, '#22c55e'],
      'circle-opacity': 0.85,
      'circle-stroke-width': 2.5,
      'circle-stroke-color': 'rgba(255,255,255,0.25)'
    }
  });
  giMap.addLayer({
    id: 'gi-ghs-labels', type: 'symbol', source: 'gi-ghs-src', minzoom: 3,
    layout: { 'text-field': ['concat', ['get', 'iso'], ' ', ['to-string', ['get', 'score']]], 'text-font': ['Open Sans Bold'], 'text-size': 10, 'text-offset': [0, 1.6], 'text-anchor': 'top' },
    paint: { 'text-color': 'rgba(255,255,255,0.7)', 'text-halo-color': 'rgba(10,15,26,0.9)', 'text-halo-width': 1.5 }
  });

  var ghsPopup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 12 });
  giMap.on('mouseenter', 'gi-ghs', function(e) {
    giMap.getCanvas().style.cursor = 'pointer';
    var f = e.features[0]; if (!f) return;
    var p = f.properties;
    var sc = p.score >= 80 ? '#22c55e' : p.score >= 60 ? '#06b6d4' : p.score >= 40 ? '#f59e0b' : '#ef4444';
    var tier = p.score >= 80 ? 'Most Prepared' : p.score >= 60 ? 'More Prepared' : p.score >= 40 ? 'Moderate' : 'Least Prepared';
    ghsPopup.setLngLat(e.lngLat)
      .setHTML(
        '<div style="font-size:13px;font-weight:700;margin-bottom:4px"><i class="fas fa-shield-alt" style="color:#3b82f6;margin-right:6px"></i>' + (p.name||p.iso||'Unknown') + '</div>' +
        '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">' +
          '<span style="font-size:18px;font-weight:800;color:' + sc + ';font-family:monospace">' + (p.score||'--') + '</span>' +
          '<span style="font-size:10px;padding:2px 8px;border-radius:6px;background:' + sc + '20;color:' + sc + ';font-weight:600">' + tier + '</span>' +
        '</div>' +
        '<div style="font-size:10px;color:rgba(255,255,255,0.4)">GHS Index Rank: #' + (p.rank||'--') + '</div>'
      ).addTo(giMap);
  });
  giMap.on('mouseleave', 'gi-ghs', function() { giMap.getCanvas().style.cursor = ''; ghsPopup.remove(); });
  giMap.on('click', 'gi-ghs', function(e) { var f = e.features[0]; if (f) giShowLayerDetail('ghs', f.properties, e.lngLat); });
}

// ===== CBRN SENSORS LAYER =====
function giLoadCbrnData() {
  showToast('Loading CBRN Sensors...', 'info');
  fetch('/static/geointel-cbrn.json')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      giCbrnData = data;
      giLayerDataLoaded.cbrn = true;
      giAddCbrnLayer();
      giUpdateStats();
      giUpdateLegend();
      showToast(data.features.length + ' CBRN sensors loaded', 'success');
    })
    .catch(function(e) { console.error('GeoIntel: CBRN load error', e); showToast('Failed to load CBRN data', 'error'); });
}

function giAddCbrnLayer() {
  if (!giMapReady) { console.warn("GeoIntel: Map not ready for CBRN layer"); return; }
  if (!giMap || !giCbrnData) return;
  try { if (giMap.getLayer('gi-cbrn-labels')) giMap.removeLayer('gi-cbrn-labels'); } catch(e) {}
  try { if (giMap.getLayer('gi-cbrn')) giMap.removeLayer('gi-cbrn'); } catch(e) {}
  try { if (giMap.getLayer('gi-cbrn-glow')) giMap.removeLayer('gi-cbrn-glow'); } catch(e) {}
  try { if (giMap.getSource('gi-cbrn-src')) giMap.removeSource('gi-cbrn-src'); } catch(e) {}

  giMap.addSource('gi-cbrn-src', { type: 'geojson', data: giCbrnData });

  giMap.addLayer({
    id: 'gi-cbrn-glow', type: 'circle', source: 'gi-cbrn-src',
    paint: { 'circle-radius': 16, 'circle-color': '#f97316', 'circle-opacity': 0.12, 'circle-blur': 1 }
  });
  giMap.addLayer({
    id: 'gi-cbrn', type: 'circle', source: 'gi-cbrn-src',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 5, 6, 7, 12, 9],
      'circle-color': ['match', ['get', 'type'],
        'Biological', '#f97316', 'Chemical', '#eab308', 'Radiological', '#ef4444', 'Nuclear', '#dc2626', '#f97316'],
      'circle-opacity': 0.9,
      'circle-stroke-width': 2.5,
      'circle-stroke-color': 'rgba(255,255,255,0.3)'
    }
  });
  giMap.addLayer({
    id: 'gi-cbrn-labels', type: 'symbol', source: 'gi-cbrn-src', minzoom: 5,
    layout: { 'text-field': ['get', 'name'], 'text-font': ['Open Sans Regular'], 'text-size': 10, 'text-offset': [0, 1.5], 'text-anchor': 'top', 'text-max-width': 12 },
    paint: { 'text-color': '#fdba74', 'text-halo-color': 'rgba(10,15,26,0.9)', 'text-halo-width': 1.5 }
  });

  var cbrnPopup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 12 });
  giMap.on('mouseenter', 'gi-cbrn', function(e) {
    giMap.getCanvas().style.cursor = 'pointer';
    var f = e.features[0]; if (!f) return;
    var p = f.properties;
    var tc = p.type === 'Biological' ? '#f97316' : p.type === 'Chemical' ? '#eab308' : p.type === 'Radiological' ? '#ef4444' : '#dc2626';
    var sc = p.status === 'Active' ? '#22c55e' : '#6b7280';
    cbrnPopup.setLngLat(e.lngLat)
      .setHTML(
        '<div style="font-size:13px;font-weight:700;margin-bottom:4px"><i class="fas fa-radiation-alt" style="color:#f97316;margin-right:6px"></i>' + (p.name||'Unknown') + '</div>' +
        '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">' +
          '<span style="font-size:10px;padding:2px 8px;border-radius:6px;background:' + tc + '20;color:' + tc + ';font-weight:600">' + (p.type||'Unknown') + '</span>' +
          '<span style="font-size:10px;padding:2px 8px;border-radius:6px;background:' + sc + '20;color:' + sc + ';font-weight:600">' + (p.status||'Unknown') + '</span>' +
        '</div>' +
        '<div style="font-size:10px;color:rgba(255,255,255,0.4)">' + (p.city||'') + ', ' + (p.country||'') + '</div>' +
        (p.network ? '<div style="font-size:10px;color:rgba(255,255,255,0.35);margin-top:3px"><i class="fas fa-network-wired" style="margin-right:4px"></i>' + p.network + '</div>' : '')
      ).addTo(giMap);
  });
  giMap.on('mouseleave', 'gi-cbrn', function() { giMap.getCanvas().style.cursor = ''; cbrnPopup.remove(); });
  giMap.on('click', 'gi-cbrn', function(e) { var f = e.features[0]; if (f) giShowLayerDetail('cbrn', f.properties, e.lngLat); });
}

// ===== GENOMIC SURVEILLANCE LAYER =====
function giLoadGenomicData() {
  showToast('Loading Genomic Surveillance...', 'info');
  fetch('/static/geointel-genomic.json')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      giGenomicData = data;
      giLayerDataLoaded.genomic = true;
      giAddGenomicLayer();
      giUpdateStats();
      giUpdateLegend();
      showToast(data.features.length + ' genomic labs loaded', 'success');
    })
    .catch(function(e) { console.error('GeoIntel: Genomic load error', e); showToast('Failed to load genomic data', 'error'); });
}

function giAddGenomicLayer() {
  if (!giMapReady) { console.warn("GeoIntel: Map not ready for genomic layer"); return; }
  if (!giMap || !giGenomicData) return;
  try { if (giMap.getLayer('gi-genomic-labels')) giMap.removeLayer('gi-genomic-labels'); } catch(e) {}
  try { if (giMap.getLayer('gi-genomic')) giMap.removeLayer('gi-genomic'); } catch(e) {}
  try { if (giMap.getLayer('gi-genomic-glow')) giMap.removeLayer('gi-genomic-glow'); } catch(e) {}
  try { if (giMap.getSource('gi-genomic-src')) giMap.removeSource('gi-genomic-src'); } catch(e) {}

  giMap.addSource('gi-genomic-src', { type: 'geojson', data: giGenomicData });

  giMap.addLayer({
    id: 'gi-genomic-glow', type: 'circle', source: 'gi-genomic-src',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['get', 'sequencers'], 1, 12, 20, 20, 50, 30],
      'circle-color': '#8b5cf6', 'circle-opacity': 0.12, 'circle-blur': 0.8
    }
  });
  giMap.addLayer({
    id: 'gi-genomic', type: 'circle', source: 'gi-genomic-src',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 5, 6, 8, 12, 10],
      'circle-color': ['match', ['get', 'capacity'], 'High', '#8b5cf6', 'Medium', '#a78bfa', 'Low', '#c4b5fd', '#8b5cf6'],
      'circle-opacity': 0.9,
      'circle-stroke-width': 2.5,
      'circle-stroke-color': 'rgba(255,255,255,0.3)'
    }
  });
  giMap.addLayer({
    id: 'gi-genomic-labels', type: 'symbol', source: 'gi-genomic-src', minzoom: 5,
    layout: { 'text-field': ['get', 'name'], 'text-font': ['Open Sans Regular'], 'text-size': 10, 'text-offset': [0, 1.5], 'text-anchor': 'top', 'text-max-width': 12 },
    paint: { 'text-color': '#c4b5fd', 'text-halo-color': 'rgba(10,15,26,0.9)', 'text-halo-width': 1.5 }
  });

  var genomicPopup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 12 });
  giMap.on('mouseenter', 'gi-genomic', function(e) {
    giMap.getCanvas().style.cursor = 'pointer';
    var f = e.features[0]; if (!f) return;
    var p = f.properties;
    var cc = p.capacity === 'High' ? '#8b5cf6' : p.capacity === 'Medium' ? '#a78bfa' : '#c4b5fd';
    genomicPopup.setLngLat(e.lngLat)
      .setHTML(
        '<div style="font-size:13px;font-weight:700;margin-bottom:4px"><i class="fas fa-dna" style="color:#8b5cf6;margin-right:6px"></i>' + (p.name||'Unknown') + '</div>' +
        '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">' +
          '<span style="font-size:10px;padding:2px 8px;border-radius:6px;background:' + cc + '20;color:' + cc + ';font-weight:600">' + (p.capacity||'') + ' Capacity</span>' +
          '<span style="font-size:10px;padding:2px 8px;border-radius:6px;background:#8b5cf620;color:#8b5cf6;font-weight:600">' + (p.focus||'') + '</span>' +
        '</div>' +
        '<div style="font-size:10px;color:rgba(255,255,255,0.4)">' + (p.city||'') + ', ' + (p.country||'') + '</div>' +
        '<div style="font-size:10px;color:rgba(255,255,255,0.35);margin-top:3px"><i class="fas fa-microchip" style="margin-right:4px"></i>' + (p.sequencers||0) + ' sequencers &bull; ' + (p.annual_sequences ? Number(p.annual_sequences).toLocaleString() : '0') + ' seq/yr</div>'
      ).addTo(giMap);
  });
  giMap.on('mouseleave', 'gi-genomic', function() { giMap.getCanvas().style.cursor = ''; genomicPopup.remove(); });
  giMap.on('click', 'gi-genomic', function(e) { var f = e.features[0]; if (f) giShowLayerDetail('genomic', f.properties, e.lngLat); });
}

// ===== ENVIRONMENTAL MONITORING LAYER =====
function giLoadEnvData() {
  showToast('Loading Environmental Stations...', 'info');
  fetch('/static/geointel-env.json')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      giEnvData = data;
      giLayerDataLoaded.env = true;
      giAddEnvLayer();
      giUpdateStats();
      giUpdateLegend();
      showToast(data.features.length + ' environmental stations loaded', 'success');
    })
    .catch(function(e) { console.error('GeoIntel: Env load error', e); showToast('Failed to load environmental data', 'error'); });
}

function giAddEnvLayer() {
  if (!giMapReady) { console.warn("GeoIntel: Map not ready for env layer"); return; }
  if (!giMap || !giEnvData) return;
  try { if (giMap.getLayer('gi-env-labels')) giMap.removeLayer('gi-env-labels'); } catch(e) {}
  try { if (giMap.getLayer('gi-env')) giMap.removeLayer('gi-env'); } catch(e) {}
  try { if (giMap.getLayer('gi-env-glow')) giMap.removeLayer('gi-env-glow'); } catch(e) {}
  try { if (giMap.getSource('gi-env-src')) giMap.removeSource('gi-env-src'); } catch(e) {}

  giMap.addSource('gi-env-src', { type: 'geojson', data: giEnvData });

  giMap.addLayer({
    id: 'gi-env-glow', type: 'circle', source: 'gi-env-src',
    paint: { 'circle-radius': 14, 'circle-color': '#06b6d4', 'circle-opacity': 0.12, 'circle-blur': 1 }
  });
  giMap.addLayer({
    id: 'gi-env', type: 'circle', source: 'gi-env-src',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 5, 6, 7, 12, 9],
      'circle-color': ['match', ['get', 'type'],
        'Air Quality', '#06b6d4', 'Radiation', '#ef4444', 'Water Quality', '#3b82f6', 'Weather', '#f59e0b', '#06b6d4'],
      'circle-opacity': 0.9,
      'circle-stroke-width': 2,
      'circle-stroke-color': 'rgba(255,255,255,0.2)'
    }
  });
  giMap.addLayer({
    id: 'gi-env-labels', type: 'symbol', source: 'gi-env-src', minzoom: 5,
    layout: { 'text-field': ['get', 'name'], 'text-font': ['Open Sans Regular'], 'text-size': 10, 'text-offset': [0, 1.5], 'text-anchor': 'top', 'text-max-width': 12 },
    paint: { 'text-color': '#67e8f9', 'text-halo-color': 'rgba(10,15,26,0.9)', 'text-halo-width': 1.5 }
  });

  var envPopup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 12 });
  giMap.on('mouseenter', 'gi-env', function(e) {
    giMap.getCanvas().style.cursor = 'pointer';
    var f = e.features[0]; if (!f) return;
    var p = f.properties;
    var tc = p.type === 'Air Quality' ? '#06b6d4' : p.type === 'Radiation' ? '#ef4444' : p.type === 'Water Quality' ? '#3b82f6' : '#f59e0b';
    envPopup.setLngLat(e.lngLat)
      .setHTML(
        '<div style="font-size:13px;font-weight:700;margin-bottom:4px"><i class="fas fa-cloud" style="color:#06b6d4;margin-right:6px"></i>' + (p.name||'Unknown') + '</div>' +
        '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">' +
          '<span style="font-size:10px;padding:2px 8px;border-radius:6px;background:' + tc + '20;color:' + tc + ';font-weight:600">' + (p.type||'Unknown') + '</span>' +
        '</div>' +
        '<div style="font-size:10px;color:rgba(255,255,255,0.4)">' + (p.city||'') + ', ' + (p.country||'') + '</div>' +
        (p.network ? '<div style="font-size:10px;color:rgba(255,255,255,0.35);margin-top:3px"><i class="fas fa-network-wired" style="margin-right:4px"></i>' + p.network + '</div>' : '') +
        (p.parameter ? '<div style="font-size:10px;color:rgba(255,255,255,0.35);margin-top:2px"><i class="fas fa-chart-line" style="margin-right:4px"></i>' + p.parameter + '</div>' : '')
      ).addTo(giMap);
  });
  giMap.on('mouseleave', 'gi-env', function() { giMap.getCanvas().style.cursor = ''; envPopup.remove(); });
  giMap.on('click', 'gi-env', function(e) { var f = e.features[0]; if (f) giShowLayerDetail('env', f.properties, e.lngLat); });
}

// ===== POPULATION DENSITY LAYER =====
function giLoadPopulationData() {
  showToast('Loading Population Centers...', 'info');
  fetch('/static/geointel-population.json')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      giPopulationData = data;
      giLayerDataLoaded.population = true;
      giAddPopulationLayer();
      giUpdateStats();
      giUpdateLegend();
      showToast(data.features.length + ' population centers loaded', 'success');
    })
    .catch(function(e) { console.error('GeoIntel: Population load error', e); showToast('Failed to load population data', 'error'); });
}

function giAddPopulationLayer() {
  if (!giMap || !giPopulationData) return;
  try { if (giMap.getLayer('gi-pop-labels')) giMap.removeLayer('gi-pop-labels'); } catch(e) {}
  try { if (giMap.getLayer('gi-pop')) giMap.removeLayer('gi-pop'); } catch(e) {}
  try { if (giMap.getLayer('gi-pop-glow')) giMap.removeLayer('gi-pop-glow'); } catch(e) {}
  try { if (giMap.getSource('gi-pop-src')) giMap.removeSource('gi-pop-src'); } catch(e) {}

  giMap.addSource('gi-pop-src', { type: 'geojson', data: giPopulationData });

  giMap.addLayer({
    id: 'gi-pop-glow', type: 'circle', source: 'gi-pop-src',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['get', 'population'], 1000000, 16, 10000000, 30, 37000000, 50],
      'circle-color': '#a78bfa', 'circle-opacity': 0.1, 'circle-blur': 0.8
    }
  });
  giMap.addLayer({
    id: 'gi-pop', type: 'circle', source: 'gi-pop-src',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['get', 'population'], 1000000, 5, 5000000, 8, 10000000, 12, 30000000, 18],
      'circle-color': ['match', ['get', 'risk_tier'],
        'Very High', '#ef4444', 'High', '#f97316', 'Elevated', '#f59e0b', 'Moderate', '#a78bfa', '#a78bfa'],
      'circle-opacity': 0.85,
      'circle-stroke-width': 2,
      'circle-stroke-color': 'rgba(255,255,255,0.25)'
    }
  });
  giMap.addLayer({
    id: 'gi-pop-labels', type: 'symbol', source: 'gi-pop-src', minzoom: 4,
    layout: { 'text-field': ['concat', ['get', 'name'], GI_NL, ['to-string', ['/', ['get', 'population'], 1000000]], 'M'], 'text-font': ['Open Sans Bold'], 'text-size': 9, 'text-offset': [0, 2], 'text-anchor': 'top', 'text-max-width': 12 },
    paint: { 'text-color': '#c4b5fd', 'text-halo-color': 'rgba(10,15,26,0.9)', 'text-halo-width': 1.5 }
  });

  var popPopup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 12 });
  giMap.on('mouseenter', 'gi-pop', function(e) {
    giMap.getCanvas().style.cursor = 'pointer';
    var f = e.features[0]; if (!f) return;
    var p = f.properties;
    var rc = p.risk_tier === 'Very High' ? '#ef4444' : p.risk_tier === 'High' ? '#f97316' : p.risk_tier === 'Elevated' ? '#f59e0b' : '#a78bfa';
    popPopup.setLngLat(e.lngLat)
      .setHTML(
        '<div style="font-size:13px;font-weight:700;margin-bottom:4px"><i class="fas fa-users" style="color:#a78bfa;margin-right:6px"></i>' + (p.name||'Unknown') + '</div>' +
        '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">' +
          '<span style="font-size:11px;font-weight:800;color:#fff;font-family:monospace">' + (p.population ? (p.population/1000000).toFixed(1) + 'M' : '--') + '</span>' +
          '<span style="font-size:10px;padding:2px 8px;border-radius:6px;background:' + rc + '20;color:' + rc + ';font-weight:600">' + (p.risk_tier||'') + ' Risk</span>' +
        '</div>' +
        '<div style="font-size:10px;color:rgba(255,255,255,0.4)">' + (p.country||'') + ' &bull; Density: ' + (p.density ? Number(p.density).toLocaleString() : '--') + '/km\u00B2</div>'
      ).addTo(giMap);
  });
  giMap.on('mouseleave', 'gi-pop', function() { giMap.getCanvas().style.cursor = ''; popPopup.remove(); });
  giMap.on('click', 'gi-pop', function(e) { var f = e.features[0]; if (f) giShowLayerDetail('population', f.properties, e.lngLat); });
}

// ===== POLICY READINESS LAYER =====
function giLoadPolicyData() {
  showToast('Loading Policy Readiness...', 'info');
  fetch('/static/geointel-policy.json')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      giPolicyData = data;
      giLayerDataLoaded.policy = true;
      giAddPolicyLayer();
      giUpdateStats();
      giUpdateLegend();
      showToast(data.features.length + ' policy assessments loaded', 'success');
    })
    .catch(function(e) { console.error('GeoIntel: Policy load error', e); showToast('Failed to load policy data', 'error'); });
}

function giAddPolicyLayer() {
  if (!giMapReady) { console.warn("GeoIntel: Map not ready for policy layer"); return; }
  if (!giMap || !giPolicyData) return;
  try { if (giMap.getLayer('gi-policy-labels')) giMap.removeLayer('gi-policy-labels'); } catch(e) {}
  try { if (giMap.getLayer('gi-policy')) giMap.removeLayer('gi-policy'); } catch(e) {}
  try { if (giMap.getLayer('gi-policy-glow')) giMap.removeLayer('gi-policy-glow'); } catch(e) {}
  try { if (giMap.getSource('gi-policy-src')) giMap.removeSource('gi-policy-src'); } catch(e) {}

  giMap.addSource('gi-policy-src', { type: 'geojson', data: giPolicyData });

  giMap.addLayer({
    id: 'gi-policy-glow', type: 'circle', source: 'gi-policy-src',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['get', 'ihr_score'], 30, 12, 60, 18, 90, 26],
      'circle-color': ['interpolate', ['linear'], ['get', 'ihr_score'], 30, '#ef4444', 50, '#f59e0b', 70, '#06b6d4', 90, '#14b8a6'],
      'circle-opacity': 0.12, 'circle-blur': 0.8
    }
  });
  giMap.addLayer({
    id: 'gi-policy', type: 'circle', source: 'gi-policy-src',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 6, 6, 9, 12, 12],
      'circle-color': ['match', ['get', 'tier'],
        'Compliant', '#14b8a6', 'Partially Compliant', '#f59e0b', 'Developing', '#ef4444', '#14b8a6'],
      'circle-opacity': 0.85,
      'circle-stroke-width': 2.5,
      'circle-stroke-color': 'rgba(255,255,255,0.25)'
    }
  });
  giMap.addLayer({
    id: 'gi-policy-labels', type: 'symbol', source: 'gi-policy-src', minzoom: 3,
    layout: { 'text-field': ['concat', ['get', 'iso'], ' ', ['to-string', ['get', 'ihr_score']]], 'text-font': ['Open Sans Bold'], 'text-size': 10, 'text-offset': [0, 1.6], 'text-anchor': 'top' },
    paint: { 'text-color': 'rgba(255,255,255,0.7)', 'text-halo-color': 'rgba(10,15,26,0.9)', 'text-halo-width': 1.5 }
  });

  var policyPopup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 12 });
  giMap.on('mouseenter', 'gi-policy', function(e) {
    giMap.getCanvas().style.cursor = 'pointer';
    var f = e.features[0]; if (!f) return;
    var p = f.properties;
    var tc = p.tier === 'Compliant' ? '#14b8a6' : p.tier === 'Partially Compliant' ? '#f59e0b' : '#ef4444';
    policyPopup.setLngLat(e.lngLat)
      .setHTML(
        '<div style="font-size:13px;font-weight:700;margin-bottom:4px"><i class="fas fa-gavel" style="color:#14b8a6;margin-right:6px"></i>' + (p.name||p.iso||'Unknown') + '</div>' +
        '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">' +
          '<span style="font-size:10px;padding:2px 8px;border-radius:6px;background:' + tc + '20;color:' + tc + ';font-weight:600">' + (p.tier||'') + '</span>' +
          '<span style="font-size:10px;padding:2px 8px;border-radius:6px;background:#14b8a620;color:#14b8a6;font-weight:600">NAPHS: ' + (p.naphs||'--') + '</span>' +
        '</div>' +
        '<div style="display:flex;gap:12px;margin-bottom:6px">' +
          '<div style="text-align:center"><div style="font-size:16px;font-weight:800;color:#14b8a6;font-family:monospace">' + (p.ihr_score||'--') + '</div><div style="font-size:8px;color:rgba(255,255,255,0.3)">IHR</div></div>' +
          '<div style="text-align:center"><div style="font-size:16px;font-weight:800;color:#06b6d4;font-family:monospace">' + (p.jee_score||'--') + '</div><div style="font-size:8px;color:rgba(255,255,255,0.3)">JEE</div></div>' +
        '</div>' +
        '<div style="font-size:10px;color:rgba(255,255,255,0.4)">' + (p.who_region||'') + ' &bull; ' + (p.year||'') + '</div>'
      ).addTo(giMap);
  });
  giMap.on('mouseleave', 'gi-policy', function() { giMap.getCanvas().style.cursor = ''; policyPopup.remove(); });
  giMap.on('click', 'gi-policy', function(e) { var f = e.features[0]; if (f) giShowLayerDetail('policy', f.properties, e.lngLat); });
}

// ===== GENERIC LAYER DETAIL PANEL =====
function giShowLayerDetail(layerType, props, lngLat) {
  var panel = document.getElementById('giDetailPanel');
  if (!panel) return;

  var html = '<div class="gi-detail-close" onclick="giCloseDetail()"><i class="fas fa-times"></i></div>';

  if (layerType === 'bsl4') {
    var statusColor = props.status === 'Operational' ? '#22c55e' : props.status === 'Under Construction' ? '#f59e0b' : '#6b7280';
    html += '<div style="margin-bottom:14px">' +
      '<div style="font-size:9px;font-weight:700;color:rgba(255,255,255,0.25);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px">BSL-4 LABORATORY</div>' +
      '<div style="font-size:16px;font-weight:700;color:#fff;margin-bottom:8px">' + (props.name||'Unknown') + '</div>' +
      '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px">' +
        '<span style="padding:3px 10px;border-radius:8px;background:#ef444415;color:#ef4444;font-size:10px;font-weight:600;border:1px solid #ef444430">' + (props.type||'BSL-4') + '</span>' +
        '<span style="padding:3px 10px;border-radius:8px;background:' + statusColor + '15;color:' + statusColor + ';font-size:10px;font-weight:600;border:1px solid ' + statusColor + '30">' + (props.status||'Unknown') + '</span>' +
      '</div>' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.5);line-height:1.8">' +
        '<div><i class="fas fa-map-marker-alt" style="color:#ef4444;width:16px;text-align:center;margin-right:6px"></i>' + (props.city||'') + ', ' + (props.country||'') + '</div>' +
        (props.organization ? '<div><i class="fas fa-building" style="color:#8b5cf6;width:16px;text-align:center;margin-right:6px"></i>' + props.organization + '</div>' : '') +
        (props.year ? '<div><i class="fas fa-calendar" style="color:#06b6d4;width:16px;text-align:center;margin-right:6px"></i>Established: ' + props.year + '</div>' : '') +
      '</div>' +
    '</div>';
  } else if (layerType === 'ctbto') {
    var stTypeColors = { Seismic: '#f59e0b', Hydroacoustic: '#06b6d4', Infrasound: '#8b5cf6', Radionuclide: '#ef4444' };
    var tc = stTypeColors[props.station_type] || '#f59e0b';
    html += '<div style="margin-bottom:14px">' +
      '<div style="font-size:9px;font-weight:700;color:rgba(255,255,255,0.25);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px">CTBTO MONITORING STATION</div>' +
      '<div style="font-size:16px;font-weight:700;color:#fff;margin-bottom:8px">' + (props.name||'Unknown') + '</div>' +
      '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px">' +
        '<span style="padding:3px 10px;border-radius:8px;background:' + tc + '15;color:' + tc + ';font-size:10px;font-weight:600;border:1px solid ' + tc + '30"><i class="fas fa-broadcast-tower" style="margin-right:4px"></i>' + (props.station_type||'Unknown') + '</span>' +
      '</div>' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.5);line-height:1.8">' +
        '<div><i class="fas fa-globe" style="color:#f59e0b;width:16px;text-align:center;margin-right:6px"></i>' + (props.country||'') + '</div>' +
      '</div>' +
      '<div style="margin-top:12px;padding:10px;border-radius:10px;background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.12);font-size:10px;color:rgba(255,255,255,0.4);line-height:1.6">' +
        '<i class="fas fa-info-circle" style="color:#f59e0b;margin-right:4px"></i>Part of the Comprehensive Nuclear-Test-Ban Treaty Organization International Monitoring System (IMS).' +
      '</div>' +
    '</div>';
  } else if (layerType === 'outbreaks') {
    var sc = props.severity === 'Critical' ? '#ef4444' : props.severity === 'High' ? '#f97316' : props.severity === 'Moderate' ? '#f59e0b' : '#22c55e';
    html += '<div style="margin-bottom:14px">' +
      '<div style="font-size:9px;font-weight:700;color:rgba(255,255,255,0.25);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px">WHO DISEASE OUTBREAK</div>' +
      '<div style="font-size:16px;font-weight:700;color:#fff;margin-bottom:8px">' + (props.name||'Unknown') + '</div>' +
      '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px">' +
        '<span style="padding:3px 10px;border-radius:8px;background:' + sc + '15;color:' + sc + ';font-size:10px;font-weight:600;border:1px solid ' + sc + '30"><i class="fas fa-exclamation-triangle" style="margin-right:4px"></i>' + (props.severity||'') + '</span>' +
        '<span style="padding:3px 10px;border-radius:8px;background:#ec489915;color:#ec4899;font-size:10px;font-weight:600;border:1px solid #ec489930"><i class="fas fa-virus" style="margin-right:4px"></i>' + (props.pathogen||'') + '</span>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">' +
        '<div style="padding:10px;border-radius:10px;background:rgba(236,72,153,0.06);border:1px solid rgba(236,72,153,0.12);text-align:center">' +
          '<div style="font-size:18px;font-weight:800;color:#ec4899;font-family:monospace">' + (props.cases ? Number(props.cases).toLocaleString() : '--') + '</div>' +
          '<div style="font-size:9px;color:rgba(255,255,255,0.3);margin-top:2px">TOTAL CASES</div>' +
        '</div>' +
        '<div style="padding:10px;border-radius:10px;background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.12);text-align:center">' +
          '<div style="font-size:18px;font-weight:800;color:' + sc + ';font-family:monospace">' + (props.severity||'--') + '</div>' +
          '<div style="font-size:9px;color:rgba(255,255,255,0.3);margin-top:2px">SEVERITY</div>' +
        '</div>' +
      '</div>' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.5);line-height:1.8">' +
        '<div><i class="fas fa-map-marker-alt" style="color:#ec4899;width:16px;text-align:center;margin-right:6px"></i>' + (props.country||'') + '</div>' +
        '<div><i class="fas fa-calendar-alt" style="color:#f59e0b;width:16px;text-align:center;margin-right:6px"></i>' + (props.date||'') + '</div>' +
      '</div>' +
    '</div>';
  } else if (layerType === 'ghs') {
    var gc = props.score >= 80 ? '#22c55e' : props.score >= 60 ? '#06b6d4' : props.score >= 40 ? '#f59e0b' : '#ef4444';
    var tier = props.score >= 80 ? 'Most Prepared' : props.score >= 60 ? 'More Prepared' : props.score >= 40 ? 'Moderate' : 'Least Prepared';
    html += '<div style="margin-bottom:14px">' +
      '<div style="font-size:9px;font-weight:700;color:rgba(255,255,255,0.25);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px">GLOBAL HEALTH SECURITY INDEX</div>' +
      '<div style="font-size:16px;font-weight:700;color:#fff;margin-bottom:8px">' + (props.name||props.iso||'Unknown') + '</div>' +
      '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">' +
        '<div style="width:56px;height:56px;border-radius:50%;background:' + gc + '15;border:3px solid ' + gc + ';display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:' + gc + ';font-family:monospace">' + (props.score||'--') + '</div>' +
        '<div>' +
          '<div style="font-size:12px;font-weight:600;color:' + gc + '">' + tier + '</div>' +
          '<div style="font-size:10px;color:rgba(255,255,255,0.4)">Global Rank: #' + (props.rank||'--') + '</div>' +
        '</div>' +
      '</div>' +
      '<div style="width:100%;height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;margin-bottom:6px"><div style="width:' + (props.score||0) + '%;height:100%;background:linear-gradient(90deg,' + gc + ',' + gc + 'aa);border-radius:3px;transition:width 0.6s ease"></div></div>' +
      '<div style="display:flex;justify-content:space-between;font-size:9px;color:rgba(255,255,255,0.25);margin-bottom:14px"><span>0</span><span>Score / 100</span><span>100</span></div>' +
      '<div style="padding:10px;border-radius:10px;background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.12);font-size:10px;color:rgba(255,255,255,0.4);line-height:1.6">' +
        '<i class="fas fa-info-circle" style="color:#3b82f6;margin-right:4px"></i>GHS Index measures health security and pandemic preparedness across 6 categories and 37 indicators.' +
      '</div>' +
    '</div>';
  } else if (layerType === 'cbrn') {
    var tc = props.type === 'Biological' ? '#f97316' : props.type === 'Chemical' ? '#eab308' : props.type === 'Radiological' ? '#ef4444' : '#dc2626';
    var sc = props.status === 'Active' ? '#22c55e' : '#6b7280';
    html += '<div style="margin-bottom:14px">' +
      '<div style="font-size:9px;font-weight:700;color:rgba(255,255,255,0.25);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px">CBRN DETECTION SENSOR</div>' +
      '<div style="font-size:16px;font-weight:700;color:#fff;margin-bottom:8px">' + (props.name||'Unknown') + '</div>' +
      '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px">' +
        '<span style="padding:3px 10px;border-radius:8px;background:' + tc + '15;color:' + tc + ';font-size:10px;font-weight:600;border:1px solid ' + tc + '30"><i class="fas fa-radiation-alt" style="margin-right:4px"></i>' + (props.type||'Unknown') + '</span>' +
        '<span style="padding:3px 10px;border-radius:8px;background:' + sc + '15;color:' + sc + ';font-size:10px;font-weight:600;border:1px solid ' + sc + '30">' + (props.status||'Unknown') + '</span>' +
      '</div>' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.5);line-height:1.8">' +
        '<div><i class="fas fa-map-marker-alt" style="color:#f97316;width:16px;text-align:center;margin-right:6px"></i>' + (props.city||'') + ', ' + (props.country||'') + '</div>' +
        (props.network ? '<div><i class="fas fa-network-wired" style="color:#06b6d4;width:16px;text-align:center;margin-right:6px"></i>Network: ' + props.network + '</div>' : '') +
      '</div>' +
      '<div style="margin-top:12px;padding:10px;border-radius:10px;background:rgba(249,115,22,0.06);border:1px solid rgba(249,115,22,0.12);font-size:10px;color:rgba(255,255,255,0.4);line-height:1.6">' +
        '<i class="fas fa-info-circle" style="color:#f97316;margin-right:4px"></i>CBRN sensors detect chemical, biological, radiological, and nuclear threats in real time.' +
      '</div>' +
    '</div>';
  } else if (layerType === 'genomic') {
    var cc = props.capacity === 'High' ? '#8b5cf6' : props.capacity === 'Medium' ? '#a78bfa' : '#c4b5fd';
    html += '<div style="margin-bottom:14px">' +
      '<div style="font-size:9px;font-weight:700;color:rgba(255,255,255,0.25);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px">GENOMIC SURVEILLANCE LAB</div>' +
      '<div style="font-size:16px;font-weight:700;color:#fff;margin-bottom:8px">' + (props.name||'Unknown') + '</div>' +
      '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px">' +
        '<span style="padding:3px 10px;border-radius:8px;background:' + cc + '15;color:' + cc + ';font-size:10px;font-weight:600;border:1px solid ' + cc + '30"><i class="fas fa-dna" style="margin-right:4px"></i>' + (props.capacity||'') + ' Capacity</span>' +
        '<span style="padding:3px 10px;border-radius:8px;background:#8b5cf615;color:#8b5cf6;font-size:10px;font-weight:600;border:1px solid #8b5cf630">' + (props.focus||'') + '</span>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">' +
        '<div style="padding:10px;border-radius:10px;background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.12);text-align:center">' +
          '<div style="font-size:18px;font-weight:800;color:#8b5cf6;font-family:monospace">' + (props.sequencers||'--') + '</div>' +
          '<div style="font-size:9px;color:rgba(255,255,255,0.3);margin-top:2px">SEQUENCERS</div>' +
        '</div>' +
        '<div style="padding:10px;border-radius:10px;background:rgba(167,139,250,0.06);border:1px solid rgba(167,139,250,0.12);text-align:center">' +
          '<div style="font-size:18px;font-weight:800;color:#a78bfa;font-family:monospace">' + (props.annual_sequences ? (props.annual_sequences/1000).toFixed(0) + 'K' : '--') + '</div>' +
          '<div style="font-size:9px;color:rgba(255,255,255,0.3);margin-top:2px">ANNUAL SEQ</div>' +
        '</div>' +
      '</div>' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.5);line-height:1.8">' +
        '<div><i class="fas fa-map-marker-alt" style="color:#8b5cf6;width:16px;text-align:center;margin-right:6px"></i>' + (props.city||'') + ', ' + (props.country||'') + '</div>' +
      '</div>' +
    '</div>';
  } else if (layerType === 'env') {
    var tc = props.type === 'Air Quality' ? '#06b6d4' : props.type === 'Radiation' ? '#ef4444' : props.type === 'Water Quality' ? '#3b82f6' : '#f59e0b';
    html += '<div style="margin-bottom:14px">' +
      '<div style="font-size:9px;font-weight:700;color:rgba(255,255,255,0.25);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px">ENVIRONMENTAL MONITORING STATION</div>' +
      '<div style="font-size:16px;font-weight:700;color:#fff;margin-bottom:8px">' + (props.name||'Unknown') + '</div>' +
      '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px">' +
        '<span style="padding:3px 10px;border-radius:8px;background:' + tc + '15;color:' + tc + ';font-size:10px;font-weight:600;border:1px solid ' + tc + '30"><i class="fas fa-cloud" style="margin-right:4px"></i>' + (props.type||'Unknown') + '</span>' +
      '</div>' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.5);line-height:1.8">' +
        '<div><i class="fas fa-map-marker-alt" style="color:#06b6d4;width:16px;text-align:center;margin-right:6px"></i>' + (props.city||'') + ', ' + (props.country||'') + '</div>' +
        (props.network ? '<div><i class="fas fa-network-wired" style="color:#f59e0b;width:16px;text-align:center;margin-right:6px"></i>Network: ' + props.network + '</div>' : '') +
        (props.parameter ? '<div><i class="fas fa-chart-line" style="color:#3b82f6;width:16px;text-align:center;margin-right:6px"></i>Parameters: ' + props.parameter + '</div>' : '') +
      '</div>' +
      '<div style="margin-top:12px;padding:10px;border-radius:10px;background:rgba(6,182,212,0.06);border:1px solid rgba(6,182,212,0.12);font-size:10px;color:rgba(255,255,255,0.4);line-height:1.6">' +
        '<i class="fas fa-info-circle" style="color:#06b6d4;margin-right:4px"></i>Continuous monitoring of atmospheric, aquatic, and radiological parameters for biosecurity early warning.' +
      '</div>' +
    '</div>';
  } else if (layerType === 'population') {
    var rc = props.risk_tier === 'Very High' ? '#ef4444' : props.risk_tier === 'High' ? '#f97316' : props.risk_tier === 'Elevated' ? '#f59e0b' : '#a78bfa';
    html += '<div style="margin-bottom:14px">' +
      '<div style="font-size:9px;font-weight:700;color:rgba(255,255,255,0.25);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px">POPULATION CENTER</div>' +
      '<div style="font-size:16px;font-weight:700;color:#fff;margin-bottom:8px">' + (props.name||'Unknown') + '</div>' +
      '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">' +
        '<div style="width:56px;height:56px;border-radius:50%;background:' + rc + '15;border:3px solid ' + rc + ';display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:' + rc + ';font-family:monospace">' + (props.population ? (props.population/1000000).toFixed(1) + 'M' : '--') + '</div>' +
        '<div>' +
          '<div style="font-size:12px;font-weight:600;color:' + rc + '">' + (props.risk_tier||'') + ' Risk</div>' +
          '<div style="font-size:10px;color:rgba(255,255,255,0.4)">' + (props.country||'') + '</div>' +
        '</div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">' +
        '<div style="padding:10px;border-radius:10px;background:rgba(167,139,250,0.06);border:1px solid rgba(167,139,250,0.12);text-align:center">' +
          '<div style="font-size:18px;font-weight:800;color:#a78bfa;font-family:monospace">' + (props.population ? (props.population/1000000).toFixed(1) + 'M' : '--') + '</div>' +
          '<div style="font-size:9px;color:rgba(255,255,255,0.3);margin-top:2px">POPULATION</div>' +
        '</div>' +
        '<div style="padding:10px;border-radius:10px;background:rgba(167,139,250,0.06);border:1px solid rgba(167,139,250,0.12);text-align:center">' +
          '<div style="font-size:18px;font-weight:800;color:#c4b5fd;font-family:monospace">' + (props.density ? Number(props.density).toLocaleString() : '--') + '</div>' +
          '<div style="font-size:9px;color:rgba(255,255,255,0.3);margin-top:2px">DENSITY/KM\u00B2</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  } else if (layerType === 'policy') {
    var tc = props.tier === 'Compliant' ? '#14b8a6' : props.tier === 'Partially Compliant' ? '#f59e0b' : '#ef4444';
    html += '<div style="margin-bottom:14px">' +
      '<div style="font-size:9px;font-weight:700;color:rgba(255,255,255,0.25);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px">POLICY READINESS ASSESSMENT</div>' +
      '<div style="font-size:16px;font-weight:700;color:#fff;margin-bottom:8px">' + (props.name||props.iso||'Unknown') + '</div>' +
      '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px">' +
        '<span style="padding:3px 10px;border-radius:8px;background:' + tc + '15;color:' + tc + ';font-size:10px;font-weight:600;border:1px solid ' + tc + '30"><i class="fas fa-gavel" style="margin-right:4px"></i>' + (props.tier||'Unknown') + '</span>' +
        '<span style="padding:3px 10px;border-radius:8px;background:#14b8a615;color:#14b8a6;font-size:10px;font-weight:600;border:1px solid #14b8a630">NAPHS: ' + (props.naphs||'--') + '</span>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">' +
        '<div style="padding:10px;border-radius:10px;background:rgba(20,184,166,0.06);border:1px solid rgba(20,184,166,0.12);text-align:center">' +
          '<div style="font-size:22px;font-weight:800;color:#14b8a6;font-family:monospace">' + (props.ihr_score||'--') + '</div>' +
          '<div style="font-size:9px;color:rgba(255,255,255,0.3);margin-top:2px">IHR SCORE</div>' +
        '</div>' +
        '<div style="padding:10px;border-radius:10px;background:rgba(6,182,212,0.06);border:1px solid rgba(6,182,212,0.12);text-align:center">' +
          '<div style="font-size:22px;font-weight:800;color:#06b6d4;font-family:monospace">' + (props.jee_score||'--') + '</div>' +
          '<div style="font-size:9px;color:rgba(255,255,255,0.3);margin-top:2px">JEE SCORE</div>' +
        '</div>' +
      '</div>' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.5);line-height:1.8">' +
        '<div><i class="fas fa-globe" style="color:#14b8a6;width:16px;text-align:center;margin-right:6px"></i>WHO Region: ' + (props.who_region||'') + '</div>' +
        '<div><i class="fas fa-calendar" style="color:#06b6d4;width:16px;text-align:center;margin-right:6px"></i>Assessment Year: ' + (props.year||'') + '</div>' +
      '</div>' +
      '<div style="margin-top:12px"><div style="font-size:9px;color:rgba(255,255,255,0.25);margin-bottom:4px">IHR COMPLIANCE</div>' +
        '<div style="width:100%;height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;margin-bottom:8px"><div style="width:' + (props.ihr_score||0) + '%;height:100%;background:linear-gradient(90deg,#14b8a6,#14b8a6aa);border-radius:3px"></div></div>' +
        '<div style="font-size:9px;color:rgba(255,255,255,0.25);margin-bottom:4px">JEE READINESS</div>' +
        '<div style="width:100%;height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden"><div style="width:' + (props.jee_score||0) + '%;height:100%;background:linear-gradient(90deg,#06b6d4,#06b6d4aa);border-radius:3px"></div></div>' +
      '</div>' +
      '<div style="margin-top:12px;padding:10px;border-radius:10px;background:rgba(20,184,166,0.06);border:1px solid rgba(20,184,166,0.12);font-size:10px;color:rgba(255,255,255,0.4);line-height:1.6">' +
        '<i class="fas fa-info-circle" style="color:#14b8a6;margin-right:4px"></i>IHR/JEE compliance measures national capacity for health emergency prevention, detection, and response.' +
      '</div>' +
    '</div>';
  }

  panel.innerHTML = html;
  panel.classList.add('visible');
}

// ===== LEGEND =====
function giUpdateLegend() {
  var legend = document.getElementById('giLegend');
  if (!legend) return;
  var items = [];
  var hasActive = false;

  if (giActiveLayers.platforms) {
    hasActive = true;
    items.push('<div class="gi-legend-title">PSEF Platforms</div>');
    var pLayers = [
      { color: '#22c55e', label: 'L1 Surveillance' },
      { color: '#38bdf8', label: 'L2 Genomic' },
      { color: '#ef4444', label: 'L3 Defense' },
      { color: '#f59e0b', label: 'L4 CBRN' },
      { color: '#8b5cf6', label: 'L4 Hardware' },
      { color: '#ec4899', label: 'L5 Policy' }
    ];
    pLayers.forEach(function(pl) {
      items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:' + pl.color + '"></div>' + pl.label + '</div>');
    });
  }

  if (giActiveLayers.bsl4 && giLayerDataLoaded.bsl4) {
    hasActive = true;
    if (items.length) items.push('<div style="border-top:1px solid rgba(255,255,255,0.06);margin:6px 0"></div>');
    items.push('<div class="gi-legend-title">BSL-4 Labs</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#ef4444"></div>Operational</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#f59e0b"></div>Under Construction</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#6b7280"></div>Planned</div>');
  }

  if (giActiveLayers.ctbto && giLayerDataLoaded.ctbto) {
    hasActive = true;
    if (items.length) items.push('<div style="border-top:1px solid rgba(255,255,255,0.06);margin:6px 0"></div>');
    items.push('<div class="gi-legend-title">CTBTO Stations</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#f59e0b"></div>Seismic</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#06b6d4"></div>Hydroacoustic</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#8b5cf6"></div>Infrasound</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#ef4444"></div>Radionuclide</div>');
  }

  if (giActiveLayers.outbreaks && giLayerDataLoaded.outbreaks) {
    hasActive = true;
    if (items.length) items.push('<div style="border-top:1px solid rgba(255,255,255,0.06);margin:6px 0"></div>');
    items.push('<div class="gi-legend-title">WHO Outbreaks</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#ef4444"></div>Critical</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#f97316"></div>High</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#f59e0b"></div>Moderate</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#22c55e"></div>Low</div>');
  }

  if (giActiveLayers.ghs && giLayerDataLoaded.ghs) {
    hasActive = true;
    if (items.length) items.push('<div style="border-top:1px solid rgba(255,255,255,0.06);margin:6px 0"></div>');
    items.push('<div class="gi-legend-title">GHS Index</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#22c55e"></div>\u226580 Most Prepared</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#06b6d4"></div>60\u201379 More Prepared</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#f59e0b"></div>40\u201359 Moderate</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#ef4444"></div><40 Least Prepared</div>');
  }

  if (giActiveLayers.cbrn && giLayerDataLoaded.cbrn) {
    hasActive = true;
    if (items.length) items.push('<div style="border-top:1px solid rgba(255,255,255,0.06);margin:6px 0"></div>');
    items.push('<div class="gi-legend-title">CBRN Sensors</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#f97316"></div>Biological</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#eab308"></div>Chemical</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#ef4444"></div>Radiological</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#dc2626"></div>Nuclear</div>');
  }

  if (giActiveLayers.genomic && giLayerDataLoaded.genomic) {
    hasActive = true;
    if (items.length) items.push('<div style="border-top:1px solid rgba(255,255,255,0.06);margin:6px 0"></div>');
    items.push('<div class="gi-legend-title">Genomic Surveillance</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#8b5cf6"></div>High Capacity</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#a78bfa"></div>Medium Capacity</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#c4b5fd"></div>Low Capacity</div>');
  }

  if (giActiveLayers.env && giLayerDataLoaded.env) {
    hasActive = true;
    if (items.length) items.push('<div style="border-top:1px solid rgba(255,255,255,0.06);margin:6px 0"></div>');
    items.push('<div class="gi-legend-title">Environmental</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#06b6d4"></div>Air Quality</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#ef4444"></div>Radiation</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#3b82f6"></div>Water Quality</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#f59e0b"></div>Weather</div>');
  }

  if (giActiveLayers.population && giLayerDataLoaded.population) {
    hasActive = true;
    if (items.length) items.push('<div style="border-top:1px solid rgba(255,255,255,0.06);margin:6px 0"></div>');
    items.push('<div class="gi-legend-title">Population Density</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#ef4444"></div>Very High Risk</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#f97316"></div>High Risk</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#f59e0b"></div>Elevated Risk</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#a78bfa"></div>Moderate</div>');
  }

  if (giActiveLayers.policy && giLayerDataLoaded.policy) {
    hasActive = true;
    if (items.length) items.push('<div style="border-top:1px solid rgba(255,255,255,0.06);margin:6px 0"></div>');
    items.push('<div class="gi-legend-title">Policy Readiness</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#14b8a6"></div>Compliant</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#f59e0b"></div>Partially Compliant</div>');
    items.push('<div class="gi-legend-item"><div class="gi-legend-dot" style="background:#ef4444"></div>Developing</div>');
  }

  if (hasActive) {
    legend.innerHTML = items.join('');
    legend.classList.add('visible');
  } else {
    legend.classList.remove('visible');
  }
}

// ===== RE-ADD ALL LAYERS ON STYLE CHANGE =====
function giReAddAllActiveLayers() {
  if (giActiveLayers.platforms && giPlatformData) giAddPlatformLayer();
  if (giActiveLayers.bsl4 && giBsl4Data) giAddBsl4Layer();
  if (giActiveLayers.ctbto && giCtbtoData) giAddCtbtoLayer();
  if (giActiveLayers.outbreaks && giOutbreakData) giAddOutbreakLayer();
  if (giActiveLayers.ghs && giGhsData) giAddGhsLayer();
  if (giActiveLayers.cbrn && giCbrnData) giAddCbrnLayer();
  if (giActiveLayers.genomic && giGenomicData) giAddGenomicLayer();
  if (giActiveLayers.env && giEnvData) giAddEnvLayer();
  if (giActiveLayers.population && giPopulationData) giAddPopulationLayer();
  if (giActiveLayers.policy && giPolicyData) giAddPolicyLayer();
}

window.giDoSearch = function(term) {
  var results = document.getElementById('giSearchResults');
  if (!results) return;
  if (!term || term.length < 2) { results.innerHTML = ''; return; }
  var lower = term.toLowerCase();

  // Collect features from all loaded data sources
  var allFeatures = [];

  if (giPlatformData) {
    giPlatformData.features.forEach(function(f) {
      var p = f.properties;
      if ((p.name && p.name.toLowerCase().indexOf(lower) > -1) ||
          (p.country && p.country.toLowerCase().indexOf(lower) > -1) ||
          (p.layer_name && p.layer_name.toLowerCase().indexOf(lower) > -1) ||
          (p.category && p.category.toLowerCase().indexOf(lower) > -1)) {
        allFeatures.push({ f: f, type: 'platform', color: '#00A86B', sublabel: (p.country||'') + ' \u2022 ' + (p.layer_name||'') });
      }
    });
  }
  if (giBsl4Data) {
    giBsl4Data.features.forEach(function(f) {
      var p = f.properties;
      if ((p.name && p.name.toLowerCase().indexOf(lower) > -1) ||
          (p.country && p.country.toLowerCase().indexOf(lower) > -1) ||
          (p.city && p.city.toLowerCase().indexOf(lower) > -1) ||
          (p.organization && p.organization.toLowerCase().indexOf(lower) > -1)) {
        allFeatures.push({ f: f, type: 'bsl4', color: '#ef4444', sublabel: (p.city||'') + ', ' + (p.country||'') + ' \u2022 BSL-4' });
      }
    });
  }
  if (giCtbtoData) {
    giCtbtoData.features.forEach(function(f) {
      var p = f.properties;
      if ((p.name && p.name.toLowerCase().indexOf(lower) > -1) ||
          (p.country && p.country.toLowerCase().indexOf(lower) > -1) ||
          (p.station_type && p.station_type.toLowerCase().indexOf(lower) > -1)) {
        allFeatures.push({ f: f, type: 'ctbto', color: '#f59e0b', sublabel: (p.country||'') + ' \u2022 ' + (p.station_type||'') });
      }
    });
  }
  if (giOutbreakData) {
    giOutbreakData.features.forEach(function(f) {
      var p = f.properties;
      if ((p.name && p.name.toLowerCase().indexOf(lower) > -1) ||
          (p.country && p.country.toLowerCase().indexOf(lower) > -1) ||
          (p.pathogen && p.pathogen.toLowerCase().indexOf(lower) > -1)) {
        allFeatures.push({ f: f, type: 'outbreaks', color: '#ec4899', sublabel: (p.country||'') + ' \u2022 ' + (p.pathogen||'') });
      }
    });
  }
  if (giGhsData) {
    giGhsData.features.forEach(function(f) {
      var p = f.properties;
      if ((p.name && p.name.toLowerCase().indexOf(lower) > -1) ||
          (p.iso && p.iso.toLowerCase().indexOf(lower) > -1)) {
        allFeatures.push({ f: f, type: 'ghs', color: '#3b82f6', sublabel: 'GHS Score: ' + (p.score||'--') + ' \u2022 Rank #' + (p.rank||'--') });
      }
    });
  }
  if (giCbrnData) {
    giCbrnData.features.forEach(function(f) {
      var p = f.properties;
      if ((p.name && p.name.toLowerCase().indexOf(lower) > -1) ||
          (p.country && p.country.toLowerCase().indexOf(lower) > -1) ||
          (p.city && p.city.toLowerCase().indexOf(lower) > -1) ||
          (p.type && p.type.toLowerCase().indexOf(lower) > -1) ||
          (p.network && p.network.toLowerCase().indexOf(lower) > -1)) {
        allFeatures.push({ f: f, type: 'cbrn', color: '#f97316', sublabel: (p.city||'') + ', ' + (p.country||'') + ' \u2022 ' + (p.type||'') });
      }
    });
  }
  if (giGenomicData) {
    giGenomicData.features.forEach(function(f) {
      var p = f.properties;
      if ((p.name && p.name.toLowerCase().indexOf(lower) > -1) ||
          (p.country && p.country.toLowerCase().indexOf(lower) > -1) ||
          (p.city && p.city.toLowerCase().indexOf(lower) > -1) ||
          (p.focus && p.focus.toLowerCase().indexOf(lower) > -1)) {
        allFeatures.push({ f: f, type: 'genomic', color: '#8b5cf6', sublabel: (p.city||'') + ', ' + (p.country||'') + ' \u2022 ' + (p.focus||'') });
      }
    });
  }
  if (giEnvData) {
    giEnvData.features.forEach(function(f) {
      var p = f.properties;
      if ((p.name && p.name.toLowerCase().indexOf(lower) > -1) ||
          (p.country && p.country.toLowerCase().indexOf(lower) > -1) ||
          (p.city && p.city.toLowerCase().indexOf(lower) > -1) ||
          (p.type && p.type.toLowerCase().indexOf(lower) > -1) ||
          (p.network && p.network.toLowerCase().indexOf(lower) > -1)) {
        allFeatures.push({ f: f, type: 'env', color: '#06b6d4', sublabel: (p.city||'') + ', ' + (p.country||'') + ' \u2022 ' + (p.type||'') });
      }
    });
  }
  if (giPopulationData) {
    giPopulationData.features.forEach(function(f) {
      var p = f.properties;
      if ((p.name && p.name.toLowerCase().indexOf(lower) > -1) ||
          (p.country && p.country.toLowerCase().indexOf(lower) > -1)) {
        allFeatures.push({ f: f, type: 'population', color: '#a78bfa', sublabel: (p.country||'') + ' \u2022 ' + (p.population ? (p.population/1000000).toFixed(1) + 'M' : '') + ' \u2022 ' + (p.risk_tier||'') });
      }
    });
  }
  if (giPolicyData) {
    giPolicyData.features.forEach(function(f) {
      var p = f.properties;
      if ((p.name && p.name.toLowerCase().indexOf(lower) > -1) ||
          (p.iso && p.iso.toLowerCase().indexOf(lower) > -1) ||
          (p.who_region && p.who_region.toLowerCase().indexOf(lower) > -1)) {
        allFeatures.push({ f: f, type: 'policy', color: '#14b8a6', sublabel: 'IHR: ' + (p.ihr_score||'--') + ' \u2022 JEE: ' + (p.jee_score||'--') + ' \u2022 ' + (p.tier||'') });
      }
    });
  }

  var matches = allFeatures.slice(0, 10);

  if (matches.length === 0) {
    results.innerHTML = '<div style="font-size:10px;color:rgba(255,255,255,0.2);padding:8px">No results found</div>';
    return;
  }
  results.innerHTML = matches.map(function(m) {
    var p = m.f.properties;
    var coords = m.f.geometry.coordinates;
    return '<div style="padding:6px 8px;border-radius:8px;cursor:pointer;transition:background 0.15s;display:flex;align-items:center;gap:8px" onmouseover="this.style.background=\\\'rgba(255,255,255,0.05)\\\'" onmouseout="this.style.background=\\\'transparent\\\'" onclick="giFlyTo(' + coords[0] + ',' + coords[1] + ',\\\'' + (p.name||'').replace(/'/g,'') + '\\\',\\\'' + m.type + '\\\')">' +
      '<div style="width:6px;height:6px;border-radius:50%;background:' + m.color + ';flex-shrink:0"></div>' +
      '<div><div style="font-size:11px;color:rgba(255,255,255,0.7);font-weight:600">' + (p.name||'Unknown') + '</div><div style="font-size:9px;color:rgba(255,255,255,0.3)">' + m.sublabel + '</div></div>' +
    '</div>';
  }).join('');
};

window.giFlyTo = function(lng, lat, name, layerType) {
  if (!giMap) return;
  giMap.flyTo({ center: [lng, lat], zoom: 8, duration: 1500 });

  // Find matching feature and show detail
  var dataSets = {
    platform: giPlatformData,
    bsl4: giBsl4Data,
    ctbto: giCtbtoData,
    outbreaks: giOutbreakData,
    ghs: giGhsData,
    cbrn: giCbrnData,
    genomic: giGenomicData,
    env: giEnvData,
    population: giPopulationData,
    policy: giPolicyData
  };

  var ds = dataSets[layerType || 'platform'];
  if (ds) {
    var match = ds.features.find(function(f) { return f.properties.name === name; });
    if (match) {
      setTimeout(function() {
        if (layerType && layerType !== 'platform') {
          giShowLayerDetail(layerType, match.properties, { lng: lng, lat: lat });
        } else {
          giShowPlatformDetail(match.properties);
        }
      }, 800);
    }
  }
};

window.giExportView = function() {
  var rows = [];
  rows.push('Type,Name,Score/Value,Layer/Category,Country,Latitude,Longitude,Details');

  if (giActiveLayers.platforms && giPlatformData) {
    giPlatformData.features.forEach(function(f) {
      var p = f.properties;
      rows.push('Platform,"' + (p.name||'').replace(/"/g,'""') + '",' + (p.score||'') + ',"' + (p.layer_name||'') + '","' + (p.country||'') + '",' + f.geometry.coordinates[1] + ',' + f.geometry.coordinates[0] + ',"' + (p.url||'') + '"');
    });
  }
  if (giActiveLayers.bsl4 && giBsl4Data) {
    giBsl4Data.features.forEach(function(f) {
      var p = f.properties;
      rows.push('BSL-4,"' + (p.name||'').replace(/"/g,'""') + '","' + (p.status||'') + '","' + (p.type||'') + '","' + (p.country||'') + '",' + f.geometry.coordinates[1] + ',' + f.geometry.coordinates[0] + ',"' + (p.organization||'') + '"');
    });
  }
  if (giActiveLayers.ctbto && giCtbtoData) {
    giCtbtoData.features.forEach(function(f) {
      var p = f.properties;
      rows.push('CTBTO,"' + (p.name||'').replace(/"/g,'""') + '","' + (p.station_type||'') + '","CTBTO IMS","' + (p.country||'') + '",' + f.geometry.coordinates[1] + ',' + f.geometry.coordinates[0] + ',""');
    });
  }
  if (giActiveLayers.outbreaks && giOutbreakData) {
    giOutbreakData.features.forEach(function(f) {
      var p = f.properties;
      rows.push('Outbreak,"' + (p.name||'').replace(/"/g,'""') + '",' + (p.cases||'') + ',"' + (p.pathogen||'') + '","' + (p.country||'') + '",' + f.geometry.coordinates[1] + ',' + f.geometry.coordinates[0] + ',"' + (p.severity||'') + ' - ' + (p.date||'') + '"');
    });
  }
  if (giActiveLayers.ghs && giGhsData) {
    giGhsData.features.forEach(function(f) {
      var p = f.properties;
      rows.push('GHS,"' + (p.name||'').replace(/"/g,'""') + '",' + (p.score||'') + ',"GHS Index","' + (p.name||'') + '",' + f.geometry.coordinates[1] + ',' + f.geometry.coordinates[0] + ',"Rank #' + (p.rank||'') + '"');
    });
  }
  if (giActiveLayers.cbrn && giCbrnData) {
    giCbrnData.features.forEach(function(f) {
      var p = f.properties;
      rows.push('CBRN,"' + (p.name||'').replace(/"/g,'""') + '","' + (p.type||'') + '","' + (p.network||'') + '","' + (p.country||'') + '",' + f.geometry.coordinates[1] + ',' + f.geometry.coordinates[0] + ',"' + (p.status||'') + '"');
    });
  }
  if (giActiveLayers.genomic && giGenomicData) {
    giGenomicData.features.forEach(function(f) {
      var p = f.properties;
      rows.push('Genomic,"' + (p.name||'').replace(/"/g,'""') + '",' + (p.sequencers||'') + ',"' + (p.focus||'') + '","' + (p.country||'') + '",' + f.geometry.coordinates[1] + ',' + f.geometry.coordinates[0] + ',"' + (p.capacity||'') + ' - ' + (p.annual_sequences||'') + ' seq/yr"');
    });
  }
  if (giActiveLayers.env && giEnvData) {
    giEnvData.features.forEach(function(f) {
      var p = f.properties;
      rows.push('Environmental,"' + (p.name||'').replace(/"/g,'""') + '","' + (p.type||'') + '","' + (p.network||'') + '","' + (p.country||'') + '",' + f.geometry.coordinates[1] + ',' + f.geometry.coordinates[0] + ',"' + (p.parameter||'') + '"');
    });
  }
  if (giActiveLayers.population && giPopulationData) {
    giPopulationData.features.forEach(function(f) {
      var p = f.properties;
      rows.push('Population,"' + (p.name||'').replace(/"/g,'""') + '",' + (p.population||'') + ',"' + (p.risk_tier||'') + '","' + (p.country||'') + '",' + f.geometry.coordinates[1] + ',' + f.geometry.coordinates[0] + ',"Density: ' + (p.density||'') + '/km2"');
    });
  }
  if (giActiveLayers.policy && giPolicyData) {
    giPolicyData.features.forEach(function(f) {
      var p = f.properties;
      rows.push('Policy,"' + (p.name||'').replace(/"/g,'""') + '",' + (p.ihr_score||'') + ',"' + (p.tier||'') + '","' + (p.name||'') + '",' + f.geometry.coordinates[1] + ',' + f.geometry.coordinates[0] + ',"IHR:' + (p.ihr_score||'') + ' JEE:' + (p.jee_score||'') + ' NAPHS:' + (p.naphs||'') + '"');
    });
  }

  if (rows.length <= 1) { showToast('No active layer data to export', 'error'); return; }

  var csv = rows.join(GI_NL);
  var blob = new Blob([csv], { type: 'text/csv' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'GeoIntel_Export_' + new Date().toISOString().split('T')[0] + '.csv';
  a.click();
  showToast('Exported ' + (rows.length - 1) + ' features across ' + Object.keys(giActiveLayers).filter(function(k) { return giActiveLayers[k]; }).length + ' layers', 'success');
};

function giUpdateStats() {
  var activeLayers = Object.keys(giActiveLayers).filter(function(k) { return giActiveLayers[k]; }).length;
  var el = document.getElementById('giStatLayers');
  if (el) el.textContent = activeLayers;

  var totalFeatures = 0;
  var countries = {};

  // Count features and countries across all active + loaded layers
  if (giActiveLayers.platforms && giPlatformData) {
    totalFeatures += giPlatformData.features.length;
    giPlatformData.features.forEach(function(f) { if (f.properties.country) countries[f.properties.country] = true; });
  }
  if (giActiveLayers.bsl4 && giBsl4Data) {
    totalFeatures += giBsl4Data.features.length;
    giBsl4Data.features.forEach(function(f) { if (f.properties.country) countries[f.properties.country] = true; });
  }
  if (giActiveLayers.ctbto && giCtbtoData) {
    totalFeatures += giCtbtoData.features.length;
    giCtbtoData.features.forEach(function(f) { if (f.properties.country) countries[f.properties.country] = true; });
  }
  if (giActiveLayers.outbreaks && giOutbreakData) {
    totalFeatures += giOutbreakData.features.length;
    giOutbreakData.features.forEach(function(f) { if (f.properties.country) countries[f.properties.country] = true; });
  }
  if (giActiveLayers.ghs && giGhsData) {
    totalFeatures += giGhsData.features.length;
    giGhsData.features.forEach(function(f) { if (f.properties.name) countries[f.properties.name] = true; });
  }
  if (giActiveLayers.cbrn && giCbrnData) {
    totalFeatures += giCbrnData.features.length;
    giCbrnData.features.forEach(function(f) { if (f.properties.country) countries[f.properties.country] = true; });
  }
  if (giActiveLayers.genomic && giGenomicData) {
    totalFeatures += giGenomicData.features.length;
    giGenomicData.features.forEach(function(f) { if (f.properties.country) countries[f.properties.country] = true; });
  }
  if (giActiveLayers.env && giEnvData) {
    totalFeatures += giEnvData.features.length;
    giEnvData.features.forEach(function(f) { if (f.properties.country) countries[f.properties.country] = true; });
  }
  if (giActiveLayers.population && giPopulationData) {
    totalFeatures += giPopulationData.features.length;
    giPopulationData.features.forEach(function(f) { if (f.properties.country) countries[f.properties.country] = true; });
  }
  if (giActiveLayers.policy && giPolicyData) {
    totalFeatures += giPolicyData.features.length;
    giPolicyData.features.forEach(function(f) { if (f.properties.name) countries[f.properties.name] = true; });
  }

  var cc = document.getElementById('giStatCountries');
  if (cc) cc.textContent = Object.keys(countries).length;
  var fc = document.getElementById('giStatFeatures');
  if (fc) fc.textContent = totalFeatures;
}

// ===== VERSION FOOTER =====
function renderVersionFooter() {}
  `;
}
