// =============================================================================
// BioR Platform - Application Initialization
// =============================================================================

export function getInitJS(): string {
  return `

// ===== INIT =====
history.replaceState({ view: state.currentView, page: state.currentPage, project: state.currentProject, _spa: true }, '', '#/' + state.currentView);
render();
// Start SSE stream if already authenticated (restored session), polling as fallback
if (state.isAuthenticated && typeof startSSE === 'function') startSSE();
if (state.isAuthenticated && typeof startNotifPolling === 'function') startNotifPolling();
  `;
}
