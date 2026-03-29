// =============================================================================
// BioR Platform - Frontend JavaScript Bundle (Modular)
// =============================================================================
// All client-side JavaScript for the SPA, assembled from modules.
// Each module exports a function returning a JavaScript string.
// This runs in the browser context (not Node/Worker).
// =============================================================================
//
// Module Structure:
//   core.ts      - State, helpers, API client, SPA history, theme, chart defaults
//   render.ts    - Main render() function & skeleton loader
//   hub.ts       - Project Hub, quick stats, empty project, data library
//   datasets.ts  - Dataset Explorer & Dataset Comparison tool
//   auth.ts      - Login form & authentication handlers
//   layout.ts    - Layout, sidebar, user profile, search, notifications
//   workspace.ts - Dashboard, surveillance, threats, genomics, EWS, alerts,
//                  reports, admin, auto-refresh, keyboard shortcuts, command palette
//   analytics.ts - Advanced Analytics (national risk, anomalies, Rt, forecast)
//   benchmark.ts - PSEF Benchmark viewer (about, overview, detail, profiles,
//                  layers, CBRN, all platforms)
//   geointel.ts  - GeoIntel Engine (about/presentation, map, 10 layers,
//                  controls, legend, search, export, stats)
//   rskb.ts      - Regulatory & Standards Knowledge Base (RSKB)
//   init.ts      - Application initialization (history state + first render)
// =============================================================================

import { getCoreJS } from './modules/core';
import { getRenderJS } from './modules/render';
import { getHubJS } from './modules/hub';
import { getDatasetsJS } from './modules/datasets';
import { getAuthJS } from './modules/auth';
import { getLayoutJS } from './modules/layout';
import { getWorkspaceJS } from './modules/workspace';
import { getBenchmarkJS } from './modules/benchmark';
import { getGeointelJS } from './modules/geointel';
import { getAnalyticsJS } from './modules/analytics';
import { getRSKBJS } from './modules/rskb';
import { getInitJS } from './modules/init';

export function getFrontendJS(): string {
  return [
    getCoreJS(),
    getRenderJS(),
    getHubJS(),
    getDatasetsJS(),
    getAuthJS(),
    getLayoutJS(),
    getWorkspaceJS(),
    getAnalyticsJS(),
    getBenchmarkJS(),
    getGeointelJS(),
    getRSKBJS(),
    getInitJS(),
  ].join('\n');
}
