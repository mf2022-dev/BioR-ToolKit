// =============================================================================
// BioR Platform - Data Layer Barrel Export
// =============================================================================
// Central re-export of all data modules.
// Route handlers import from here: import { ... } from '../data';
// =============================================================================

// authLogin removed — authentication is now API-based via D1 + JWT
export { dashboardData } from './dashboard';
export { surveillanceSites } from './surveillance';
export { threats } from './threats';
export { genomicSamples, pipelineStages, amrHeatmap } from './genomics';
export { alerts } from './alerts';
export { reports } from './reports';
export { ewsData } from './ews';
export { systemHealth, auditLog } from './admin';
