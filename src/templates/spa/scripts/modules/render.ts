// =============================================================================
// BioR Platform - Main Render Function & Skeleton Loader
// =============================================================================

export function getRenderJS(): string {
  return `
// ===== RENDER =====
function render() {
  destroyCharts();
  // Clean up map when switching away from geointel-map
  if (state.currentView !== 'geointel-map' && giMap) {
    try { giMap.remove(); } catch(e) {} giMap = null; giMapReady = false; _giMapInitializing = false;
  }
  const app = document.getElementById('app');
  if (!state.isAuthenticated) { app.innerHTML = renderLogin(); initLoginHandlers(); return; }

  // Dataset Explorer view (admin-only)
  if (state.currentView === 'dataset-explorer' && state.currentDataset) {
    app.innerHTML = renderDatasetExplorer();
    initDatasetExplorer();
    return;
  }

  // Dataset Comparison view (admin-only)
  if (state.currentView === 'dataset-compare') {
    app.innerHTML = renderDatasetCompare();
    initDatasetCompare();
    return;
  }

  // Benchmark Results view (admin-only)
  if (state.currentView === 'benchmark') {
    app.innerHTML = renderBenchmarkView();
    initBenchmarkView();
    return;
  }

  // GeoIntel About / Presentation view
  if (state.currentView === 'geointel') {
    app.innerHTML = renderGeoIntelAboutView();
    initGeoIntelAboutView();
    return;
  }

  // RSKB — Regulatory & Standards Knowledge Base
  if (state.currentView === 'rskb') {
    app.innerHTML = renderRSKBView();
    initRSKBView();
    return;
  }

  // GeoIntel Map view (full interactive map)
  if (state.currentView === 'geointel-map') {
    // If map is already rendered, do NOT replace innerHTML (would destroy WebGL canvas)
    if (document.getElementById('geointelMap') && giMap) {
      return;
    }
    app.innerHTML = renderGeoIntelView();
    initGeoIntelView();
    return;
  }

  // Project Hub view
  if (state.currentView === 'hub') {
    app.innerHTML = renderProjectHub();
    initHubHandlers();
    if (state.user && state.user.role === 'Admin') loadDataLibrary();
    loadHubQuickStats();
    return;
  }

  // Empty project workspace
  if (state.currentView === 'project') {
    app.innerHTML = renderEmptyProject();
    return;
  }

  // Full workspace (Dashboard SPA)
  app.innerHTML = renderLayout();
  // Add global loading bar
  if(!document.getElementById('loadBar')) {
    const bar = document.createElement('div'); bar.id='loadBar';
    bar.style.cssText='position:fixed;top:0;left:0;height:2px;width:0;z-index:9999;transition:width 0.4s ease,opacity 0.3s;opacity:0';
    document.body.prepend(bar);
  }
  loadPage();
  initSidebarToggle();
  renderVersionFooter();
  // Load notification count from D1
  if (typeof loadNotifCount === 'function') loadNotifCount();
  // Start refresh timer
  if(state.refreshTimer) clearInterval(state.refreshTimer);
  state.refreshTimer = setInterval(() => {
    const timeEl = document.getElementById('headerTime');
    if(timeEl) timeEl.textContent = new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  }, 1000);
}

  `;
}
