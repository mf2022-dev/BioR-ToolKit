// =============================================================================
// BioR Platform - SPA Stylesheet v4.0
// =============================================================================
// Unified with BioR Design System CSS variables (bior-design-system.css).
// ALL hardcoded colors replaced with var(--bior-*) tokens.
// Light/dark theming handled automatically via CSS custom properties.
// =============================================================================

export function getSPAStyles(): string {
  return `
    /* Reset is handled by bior-design-system.css — only add body font */
    body { font-family: var(--bior-font); }

    /* ===== SIDEBAR ===== */
    .sidebar-wrap {
      background: linear-gradient(180deg, var(--bior-primary-darkest) 0%, #007850 40%, var(--bior-primary) 100%);
      position: relative; overflow: hidden;
      transition: width var(--bior-duration-normal) var(--bior-ease);
    }
    .sidebar-wrap.collapsed { width: 64px !important; }
    .sidebar-wrap::before {
      content: ''; position: absolute; width: 300px; height: 300px;
      background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%);
      top: -60px; left: -60px; animation: sidebarBlob 10s ease-in-out infinite;
    }
    .sidebar-wrap::after {
      content: ''; position: absolute; width: 250px; height: 250px;
      background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%);
      bottom: -40px; right: -40px; animation: sidebarBlob2 12s ease-in-out infinite;
    }
    @keyframes sidebarBlob { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(15px,-10px) scale(1.05);} }
    @keyframes sidebarBlob2 { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(-10px,-15px) scale(1.08);} }

    .sidebar-link {
      transition: all var(--bior-duration-normal) ease; border-left: 3px solid transparent; position: relative; z-index: 2;
    }
    .sidebar-link:hover {
      background: rgba(255,255,255,0.12); border-left-color: rgba(255,255,255,0.6);
    }
    .sidebar-link.active {
      background: rgba(255,255,255,0.18); border-left-color: #fff; color: #fff;
      box-shadow: inset 0 0 20px rgba(255,255,255,0.05);
    }
    .sidebar-link:not(.active) { color: rgba(255,255,255,0.7); }
    .sidebar-link:hover:not(.active) { color: #fff; }

    /* Sidebar collapse states */
    .sidebar-wrap.collapsed .sidebar-label,
    .sidebar-wrap.collapsed .sidebar-brand-text,
    .sidebar-wrap.collapsed .sidebar-user-info,
    .sidebar-wrap.collapsed .sidebar-badge { display: none; }
    .sidebar-wrap.collapsed .sidebar-link { justify-content: center; padding-left: 0; padding-right: 0; border-left: none; }
    .sidebar-wrap.collapsed .sidebar-link i { margin: 0; font-size: 16px; }
    .sidebar-wrap.collapsed .sidebar-brand { justify-content: center; }
    .sidebar-wrap.collapsed .sidebar-user-wrap { justify-content: center; padding: 8px; }

    /* Sidebar tooltip (shown when collapsed) */
    .sidebar-link .sidebar-tooltip {
      display: none; position: absolute; left: 100%; top: 50%; transform: translateY(-50%);
      background: #1f2937; color: #fff; font-size: 11px; font-weight: 500; padding: 4px 10px;
      border-radius: var(--bior-radius-sm); white-space: nowrap; z-index: var(--z-toast); pointer-events: none;
      box-shadow: var(--bior-shadow-md); margin-left: 8px;
    }
    .sidebar-link .sidebar-tooltip::before {
      content: ''; position: absolute; right: 100%; top: 50%; transform: translateY(-50%);
      border: 5px solid transparent; border-right-color: #1f2937;
    }
    .sidebar-wrap.collapsed .sidebar-link:hover .sidebar-tooltip { display: block; }

    /* Collapse toggle button */
    .sidebar-collapse-btn {
      position: absolute; top: 16px; right: -12px; z-index: 20;
      width: 24px; height: 24px; border-radius: 50%;
      background: var(--bior-primary); border: 2px solid var(--bior-bg-page);
      color: #fff; display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all var(--bior-duration-normal) ease; font-size: 10px;
    }
    .sidebar-collapse-btn:hover { background: var(--bior-primary-light); transform: scale(1.1); }
    .sidebar-wrap.collapsed .sidebar-collapse-btn { right: -12px; }
    .sidebar-wrap.collapsed .sidebar-collapse-btn i { transform: rotate(180deg); }

    /* ===== KPI CARDS — Use design system tokens ===== */
    .kpi-card {
      transition: all var(--bior-duration-normal) ease;
      background: var(--bior-bg-card); backdrop-filter: blur(var(--bior-glass-blur));
      border: 1px solid var(--bior-border-subtle); border-radius: var(--bior-radius-xl);
      position: relative; overflow: hidden;
    }
    .kpi-card::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
      border-radius: var(--bior-radius-xl) var(--bior-radius-xl) 0 0; background: var(--bior-border-default);
      transition: all var(--bior-duration-normal) ease;
    }
    .kpi-card:hover {
      transform: translateY(-3px);
      box-shadow: var(--bior-shadow-lg);
      border-color: rgba(var(--bior-primary-rgb),0.2);
      background: var(--bior-bg-card-hover);
    }
    /* Accent color variants */
    .kpi-card.accent-red::before { background: linear-gradient(90deg, var(--bior-danger), #f87171); }
    .kpi-card.accent-red:hover { border-color: rgba(239,68,68,0.25); box-shadow: 0 12px 40px rgba(239,68,68,0.08); }
    .kpi-card.accent-green::before { background: linear-gradient(90deg, var(--bior-primary), #34d399); }
    .kpi-card.accent-green:hover { border-color: rgba(var(--bior-primary-rgb),0.25); box-shadow: 0 12px 40px rgba(var(--bior-primary-rgb),0.08); }
    .kpi-card.accent-blue::before { background: linear-gradient(90deg, var(--bior-info), #60a5fa); }
    .kpi-card.accent-blue:hover { border-color: rgba(59,130,246,0.25); box-shadow: 0 12px 40px rgba(59,130,246,0.08); }
    .kpi-card.accent-amber::before { background: linear-gradient(90deg, var(--bior-warning), #fbbf24); }
    .kpi-card.accent-amber:hover { border-color: rgba(245,158,11,0.25); box-shadow: 0 12px 40px rgba(245,158,11,0.08); }
    .kpi-card.accent-purple::before { background: linear-gradient(90deg, var(--bior-special), #a78bfa); }
    .kpi-card.accent-purple:hover { border-color: rgba(139,92,246,0.25); box-shadow: 0 12px 40px rgba(139,92,246,0.08); }

    .panel-card {
      background: var(--bior-bg-card); backdrop-filter: blur(var(--bior-glass-blur));
      border: 1px solid var(--bior-border-subtle); border-radius: var(--bior-radius-xl);
      transition: all var(--bior-duration-normal) ease;
    }
    .panel-card:hover { border-color: var(--bior-border-default); }

    /* ===== BADGES ===== */
    .badge {
      display: inline-flex; align-items: center; padding: 2px 10px; border-radius: var(--bior-radius-pill);
      font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;
      backdrop-filter: blur(4px);
    }

    /* ===== SCROLLBAR ===== */
    .scrollbar-thin::-webkit-scrollbar { width: 5px; }
    .scrollbar-thin::-webkit-scrollbar-thumb { background: var(--bior-border-strong); border-radius: 3px; }
    .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }

    /* ===== MAP ===== */
    .map-container { height: 380px; border-radius: var(--bior-radius-lg); overflow: hidden; border: 1px solid var(--bior-border-subtle); }

    /* ===== ANIMATIONS ===== */
    .fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
    @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }

    /* Page transition */
    .page-transition { animation: pageSlideIn 0.35s var(--bior-ease); }
    @keyframes pageSlideIn {
      from { opacity: 0; transform: translateY(12px) scale(0.995); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* ===== SKELETON LOADERS ===== */
    .skeleton {
      background: linear-gradient(90deg,
        var(--bior-bg-card) 25%,
        var(--bior-bg-elevated) 50%,
        var(--bior-bg-card) 75%
      );
      background-size: 200% 100%;
      animation: skeletonShimmer 1.5s ease-in-out infinite;
      border-radius: var(--bior-radius-md);
    }
    @keyframes skeletonShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

    .skeleton-card {
      border-radius: var(--bior-radius-xl); border: 1px solid var(--bior-border-subtle);
      background: var(--bior-bg-card); padding: 16px; overflow: hidden;
    }
    .skeleton-line { height: 12px; border-radius: var(--bior-radius-sm); margin-bottom: 10px; }
    .skeleton-line.w-1-3 { width: 33%; }
    .skeleton-line.w-1-2 { width: 50%; }
    .skeleton-line.w-2-3 { width: 66%; }
    .skeleton-line.w-full { width: 100%; }
    .skeleton-circle { width: 48px; height: 48px; border-radius: 50%; }
    .skeleton-rect { height: 200px; border-radius: var(--bior-radius-lg); }

    /* ===== GLASS ===== */
    .glass { background: var(--bior-glass-bg); backdrop-filter: blur(var(--bior-glass-blur)); border: 1px solid var(--bior-glass-border); }

    /* ===== MODAL ===== */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); z-index: var(--z-modal); display: flex; align-items: center; justify-content: center; }
    .modal-content {
      background: var(--bior-bg-modal);
      border: 1px solid rgba(var(--bior-primary-rgb),0.15); border-radius: var(--bior-radius-xxl);
      max-width: 720px; width: 90%; max-height: 85vh; overflow-y: auto;
      box-shadow: var(--bior-shadow-xl);
      animation: modalIn 0.3s var(--bior-ease);
    }
    @keyframes modalIn {
      from { opacity: 0; transform: scale(0.95) translateY(10px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }

    /* ===== TOAST ===== */
    .toast-container { position: fixed; top: 16px; right: 16px; z-index: var(--z-toast); display: flex; flex-direction: column; gap: 8px; }
    .toast {
      padding: 12px 16px; border-radius: var(--bior-radius-lg); color: white; font-size: 0.8rem;
      animation: slideIn 0.3s ease-out; max-width: 360px;
      backdrop-filter: blur(12px); border: 1px solid var(--bior-border-default);
      box-shadow: var(--bior-shadow-md);
    }
    .toast-success { background: var(--bior-toast-success-bg); }
    @keyframes slideIn { from { opacity:0; transform:translateX(100px); } to { opacity:1; transform:translateX(0); } }

    /* ===== TABLE ===== */
    .data-table { border-radius: var(--bior-radius-xl); overflow: hidden; }
    .data-table thead { background: rgba(var(--bior-primary-rgb),0.08); }
    .data-table th { font-size: 10px; font-weight: 600; color: var(--bior-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .data-table tbody tr { transition: all 0.2s ease; }
    .data-table tbody tr:hover { background: rgba(var(--bior-primary-rgb),0.05); }

    /* ===== INPUTS / SELECTS ===== */
    .bior-input {
      background: var(--bior-bg-card); border: 1.5px solid var(--bior-border-default);
      border-radius: var(--bior-radius-md); color: var(--bior-text-primary); font-size: 12px; outline: none;
      transition: all var(--bior-duration-normal) ease; font-family: var(--bior-font);
    }
    .bior-input:hover { border-color: var(--bior-border-strong); background: var(--bior-bg-elevated); }
    .bior-input:focus { border-color: var(--bior-primary); box-shadow: 0 0 0 3px rgba(var(--bior-primary-rgb),0.1); background: var(--bior-bg-elevated); }
    .bior-input::placeholder { color: var(--bior-text-faint); }

    /* ===== HEADER SEARCH ===== */
    .header-search {
      background: var(--bior-bg-elevated); border: 1px solid var(--bior-border-subtle);
      border-radius: var(--bior-radius-lg); padding: 6px 12px 6px 36px; color: var(--bior-text-primary);
      font-size: 12px; font-family: var(--bior-font); outline: none;
      width: 200px; transition: all var(--bior-duration-normal) ease;
    }
    .header-search:focus {
      width: 280px; border-color: rgba(var(--bior-primary-rgb),0.4);
      background: var(--bior-bg-interactive); box-shadow: 0 0 0 3px rgba(var(--bior-primary-rgb),0.08);
    }
    .header-search::placeholder { color: var(--bior-text-faint); }
    .header-search-wrap { position: relative; }
    .header-search-icon {
      position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
      color: var(--bior-text-faint); font-size: 11px; pointer-events: none;
    }

    /* ===== NOTIFICATION BELL ===== */
    .notif-btn {
      position: relative; width: 34px; height: 34px; border-radius: var(--bior-radius-md);
      background: var(--bior-bg-elevated); border: 1px solid var(--bior-border-subtle);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all var(--bior-duration-normal) ease; color: var(--bior-text-muted);
    }
    .notif-btn:hover { background: var(--bior-bg-interactive); color: var(--bior-text-primary); border-color: var(--bior-border-default); }
    .notif-count {
      position: absolute; top: -4px; right: -4px; min-width: 16px; height: 16px;
      border-radius: 8px; background: var(--bior-danger); color: #fff; font-size: 9px;
      font-weight: 700; display: flex; align-items: center; justify-content: center;
      padding: 0 4px; border: 2px solid var(--bior-bg-page); line-height: 1;
      animation: notifPop 0.3s var(--bior-ease);
    }
    @keyframes notifPop { from { transform: scale(0); } to { transform: scale(1); } }
    .notif-pulse { animation: bellPulse 0.5s ease 3; }
    .notif-pulse .notif-count { animation: notifFlash 0.5s ease 3; }
    @keyframes bellPulse {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(15deg); }
      75% { transform: rotate(-15deg); }
    }
    @keyframes notifFlash {
      0%, 100% { background: var(--bior-danger); }
      50% { background: var(--bior-warning); }
    }

    /* ===== BREADCRUMB ===== */
    .breadcrumb {
      display: flex; align-items: center; gap: 6px;
      font-size: 10px; color: var(--bior-text-faint);
    }
    .breadcrumb a { color: var(--bior-text-faint); text-decoration: none; transition: color 0.2s; cursor: pointer; }
    .breadcrumb a:hover { color: var(--bior-primary); }
    .breadcrumb .separator { font-size: 8px; }
    .breadcrumb .current { color: var(--bior-text-muted); font-weight: 500; }

    /* ===== BUTTONS ===== */
    .bior-btn {
      background: linear-gradient(135deg, var(--bior-primary) 0%, var(--bior-primary-dark) 100%);
      color: #fff; font-weight: 600; border: none; border-radius: var(--bior-radius-md);
      cursor: pointer; transition: all var(--bior-duration-normal) ease; position: relative; overflow: hidden;
      font-family: var(--bior-font);
    }
    .bior-btn:hover {
      background: linear-gradient(135deg, var(--bior-primary-light) 0%, var(--bior-primary) 100%);
      box-shadow: var(--bior-shadow-glow); transform: translateY(-1px);
    }
    .bior-btn::after {
      content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
      transition: left 0.5s ease;
    }
    .bior-btn:hover::after { left: 100%; }

    .bior-btn-secondary {
      background: var(--bior-bg-elevated); border: 1px solid var(--bior-border-default);
      color: var(--bior-text-primary); border-radius: var(--bior-radius-md); cursor: pointer;
      transition: all var(--bior-duration-normal) ease; font-family: var(--bior-font);
    }
    .bior-btn-secondary:hover {
      background: var(--bior-bg-interactive); border-color: var(--bior-border-strong);
    }

    /* ===== ANIMATED THREAT CIRCLE ===== */
    .threat-circle { position: relative; width: 100px; height: 100px; }
    .threat-circle svg { transform: rotate(-90deg); }
    .threat-circle-bg { fill: none; stroke: var(--bior-border-subtle); stroke-width: 8; }
    .threat-circle-fg {
      fill: none; stroke-width: 8; stroke-linecap: round;
      transition: stroke-dashoffset 1.2s var(--bior-ease);
    }
    .threat-circle-value {
      position: absolute; inset: 0; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
    }

    /* ===== MISC ===== */
    .sparkline { display: inline-block; vertical-align: middle; }
    .pipeline-step { position: relative; }
    .pipeline-step::after { content: ''; position: absolute; top: 50%; right: -16px; width: 12px; height: 2px; background: var(--bior-border-subtle); }
    .pipeline-step:last-child::after { display: none; }
    .heatmap-cell { transition: all 0.2s; cursor: pointer; border-radius: var(--bior-radius-sm); }
    .heatmap-cell:hover { transform: scale(1.1); box-shadow: 0 0 12px rgba(var(--bior-primary-rgb),0.3); }
    .timeline-dot { width: 10px; height: 10px; border-radius: 50%; position: relative; z-index: 1; }
    .timeline-line { position: absolute; left: 4px; top: 10px; bottom: -10px; width: 2px; background: var(--bior-border-subtle); }
    .tab-btn { transition: all var(--bior-duration-normal) ease; backdrop-filter: blur(4px); }
    .tab-btn.active {
      background: rgba(var(--bior-primary-rgb),0.15); color: var(--bior-primary);
      border-color: rgba(var(--bior-primary-rgb),0.4); box-shadow: 0 0 15px rgba(var(--bior-primary-rgb),0.1);
    }
    .pulse-dot { width: 8px; height: 8px; border-radius: 50%; animation: pulseDot 2s infinite; }
    @keyframes pulseDot { 0%,100% { opacity:1; box-shadow:0 0 0 0 currentColor; } 50% { opacity:0.7; box-shadow:0 0 0 4px transparent; } }

    /* ===== HEADER ===== */
    .bior-header {
      background: var(--bior-glass-bg);
      backdrop-filter: blur(20px); border-bottom: 1px solid rgba(var(--bior-primary-rgb),0.1);
    }

    /* ===== EMPTY STATE ===== */
    .empty-state {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 48px 24px; text-align: center;
    }
    .empty-state i { font-size: 36px; color: var(--bior-text-disabled); margin-bottom: 16px; }
    .empty-state p { font-size: 13px; color: var(--bior-text-faint); max-width: 320px; }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 768px) {
      .sidebar-desktop {
        display: none;
        position: fixed; top: 0; left: 0; bottom: 0; z-index: 60;
        width: 240px !important;
      }
      .sidebar-desktop.mobile-open {
        display: flex !important;
        animation: slideInSidebar 0.3s ease-out;
      }
      .sidebar-desktop.mobile-open .sidebar-label,
      .sidebar-desktop.mobile-open .sidebar-brand-text,
      .sidebar-desktop.mobile-open .sidebar-user-info,
      .sidebar-desktop.mobile-open .sidebar-badge { display: initial !important; }
      .sidebar-desktop.mobile-open .sidebar-link { justify-content: flex-start; padding-left: 16px; border-left: 3px solid transparent; }

      .mobile-sidebar-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,0.6);
        backdrop-filter: blur(4px); z-index: 55;
        animation: fadeIn 0.2s ease-out;
      }
      .header-search { width: 140px; }
      .header-search:focus { width: 200px; }
      .version-footer { font-size: 9px; padding: 6px 12px; }
    }
    @keyframes slideInSidebar {
      from { transform: translateX(-100%); }
      to { transform: translateX(0); }
    }

    /* Mobile hamburger */
    .mobile-menu-btn {
      width: 34px; height: 34px; border-radius: var(--bior-radius-md);
      background: var(--bior-bg-elevated); border: 1px solid var(--bior-border-subtle);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all var(--bior-duration-normal) ease; color: var(--bior-text-muted);
    }
    .mobile-menu-btn:hover { background: var(--bior-bg-interactive); color: var(--bior-text-primary); }

    @media (min-width: 769px) {
      .mobile-header { display: none; }
      .mobile-menu-btn { display: none; }
    }

    /* ===== ADMIN TAB STYLING ===== */
    .admin-tab {
      transition: all var(--bior-duration-normal) ease; cursor: pointer;
      background: transparent; border: 1px solid transparent;
      color: var(--bior-text-muted);
    }
    .admin-tab:hover { background: var(--bior-bg-elevated); color: var(--bior-text-secondary); }
    .admin-tab.active {
      background: rgba(var(--bior-primary-rgb),0.15); color: var(--bior-primary);
      border-color: rgba(var(--bior-primary-rgb),0.3); box-shadow: 0 0 15px rgba(var(--bior-primary-rgb),0.08);
    }

    /* ===== REPORT TAB STYLING ===== */
    .rpt-tab-btn { cursor: pointer; border: 1px solid transparent; }

    /* ===== ANIMATED GAUGE RINGS ===== */
    .gauge-ring { animation: gaugeIn 1.2s var(--bior-ease) forwards; }
    @keyframes gaugeIn { from { stroke-dashoffset: 213.6; } }

    /* ===== ADMIN HEARTBEAT ===== */
    .admin-pulse { animation: adminPulse 1.5s ease-in-out infinite; }
    @keyframes adminPulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.15); }
    }

    /* ===== SERVICE STATUS DOT ===== */
    .service-status-dot { animation: statusGlow 2s ease-in-out infinite; }
    @keyframes statusGlow {
      0%, 100% { box-shadow: 0 0 0 0 currentColor; }
      50% { box-shadow: 0 0 6px 2px currentColor; }
    }

    /* ===== SERVICE CARD HOVER ===== */
    .service-card { transition: all var(--bior-duration-normal) ease; }
    .service-card:hover { transform: translateY(-2px); box-shadow: var(--bior-shadow-md); }

    /* ===== DETECTION LAYER CARDS ===== */
    .detection-layer { transition: all var(--bior-duration-normal) ease; }
    .detection-layer:hover { transform: translateX(4px); }

    /* ===== RISK BAR ANIMATION ===== */
    .risk-bar-animate { animation: riskBarGrow 0.8s var(--bior-ease) forwards; }
    @keyframes riskBarGrow { from { width: 0%; } }

    /* ===== VERSION FOOTER ===== */
    .version-footer {
      position: fixed; bottom: 0; left: 0; right: 0;
      background: var(--bior-glass-bg); backdrop-filter: blur(12px);
      border-top: 1px solid var(--bior-border-subtle);
      padding: 6px 20px; display: flex; align-items: center; justify-content: center;
      font-size: 10px; color: var(--bior-text-disabled);
      z-index: var(--z-sidebar); pointer-events: none;
    }

    /* ===== ENHANCED MODAL ANIMATION ===== */
    .modal-overlay { animation: overlayIn 0.2s ease-out; }
    @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }

    /* ===== PRINT STYLES ===== */
    @media print {
      .sidebar-wrap, .bior-header, .version-footer, .notif-btn,
      .sidebar-collapse-btn, .header-search-wrap { display: none !important; }
      main { margin: 0 !important; }
      .panel-card { border: 1px solid #ddd !important; break-inside: avoid; }
      .kpi-card { border: 1px solid #ddd !important; break-inside: avoid; }
      body { background: white !important; color: black !important; }
      .modal-overlay { display: none !important; }
    }

    /* ===== LIGHT THEME — Major structural overrides ===== */
    /* Most theming now happens via CSS variables from bior-design-system.css.
       These overrides handle Tailwind utility classes and inline styles that
       can't be controlled by CSS variables alone. */

    [data-theme="light"] body,
    [data-theme="light"] main { background: var(--bior-bg-page) !important; color: var(--bior-text-primary) !important; }
    [data-theme="light"] .panel-card { background: var(--bior-bg-card) !important; border-color: var(--bior-border-subtle) !important; box-shadow: var(--bior-shadow-sm) !important; }
    [data-theme="light"] .kpi-card { background: var(--bior-bg-card) !important; border-color: var(--bior-border-subtle) !important; box-shadow: var(--bior-shadow-sm) !important; }

    /* Tailwind text-white/N utility overrides for light mode */
    [data-theme="light"] .text-white { color: var(--bior-text-primary) !important; }
    [data-theme="light"] .text-white\\/85 { color: var(--bior-text-primary) !important; }
    [data-theme="light"] .text-white\\/70 { color: var(--bior-text-secondary) !important; }
    [data-theme="light"] .text-white\\/60 { color: var(--bior-text-secondary) !important; }
    [data-theme="light"] .text-white\\/50 { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .text-white\\/40 { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .text-white\\/35 { color: var(--bior-text-faint) !important; }
    [data-theme="light"] .text-white\\/30 { color: var(--bior-text-faint) !important; }
    [data-theme="light"] .text-white\\/25 { color: var(--bior-text-faint) !important; }
    [data-theme="light"] .text-white\\/20 { color: var(--bior-text-disabled) !important; }
    [data-theme="light"] .text-gray-100 { color: var(--bior-text-primary) !important; }

    /* Tailwind bg-white/N utility overrides */
    [data-theme="light"] .bg-white\\/3,
    [data-theme="light"] .bg-white\\/4,
    [data-theme="light"] .bg-white\\/5,
    [data-theme="light"] .bg-white\\/6 { background: var(--bior-bg-elevated) !important; }
    [data-theme="light"] .bg-white\\/8,
    [data-theme="light"] .bg-white\\/10,
    [data-theme="light"] .bg-white\\/12,
    [data-theme="light"] .bg-white\\/15 { background: var(--bior-bg-interactive) !important; }

    /* Tailwind border-white/N utility overrides */
    [data-theme="light"] .border-white\\/6,
    [data-theme="light"] .border-white\\/8,
    [data-theme="light"] .border-white\\/10,
    [data-theme="light"] .border-white\\/15,
    [data-theme="light"] .border-white\\/20 { border-color: var(--bior-border-subtle) !important; }

    /* Hover state overrides */
    [data-theme="light"] .hover\\:bg-white\\/5:hover { background: var(--bior-bg-elevated) !important; }
    [data-theme="light"] .hover\\:bg-white\\/8:hover { background: var(--bior-bg-interactive) !important; }
    [data-theme="light"] .hover\\:text-white:hover { color: var(--bior-text-primary) !important; }

    /* Header in light mode */
    [data-theme="light"] .bior-header { background: var(--bior-glass-bg) !important; border-bottom: 1px solid var(--bior-border-subtle) !important; }
    [data-theme="light"] .version-footer { background: var(--bior-glass-bg) !important; color: var(--bior-text-faint) !important; border-top-color: var(--bior-border-subtle) !important; }
    [data-theme="light"] .modal-content { background: var(--bior-bg-modal) !important; border-color: var(--bior-border-default) !important; box-shadow: var(--bior-shadow-xl) !important; }

    /* Inline style overrides for workspace pages */
    [data-theme="light"] #pageContent [style*="color:#fff"],
    [data-theme="light"] #pageContent [style*="color: #fff"] { color: var(--bior-text-primary) !important; }
    [data-theme="light"] #pageContent [style*="color:rgba(255,255,255,0.85)"],
    [data-theme="light"] #pageContent [style*="color:rgba(255,255,255,0.8)"] { color: var(--bior-text-primary) !important; }
    [data-theme="light"] #pageContent [style*="color:rgba(255,255,255,0.7)"],
    [data-theme="light"] #pageContent [style*="color:rgba(255,255,255,0.6)"] { color: var(--bior-text-secondary) !important; }
    [data-theme="light"] #pageContent [style*="color:rgba(255,255,255,0.5)"],
    [data-theme="light"] #pageContent [style*="color:rgba(255,255,255,0.4)"],
    [data-theme="light"] #pageContent [style*="color:rgba(255,255,255,0.35)"] { color: var(--bior-text-muted) !important; }
    [data-theme="light"] #pageContent [style*="color:rgba(255,255,255,0.3)"],
    [data-theme="light"] #pageContent [style*="color:rgba(255,255,255,0.25)"],
    [data-theme="light"] #pageContent [style*="color:rgba(255,255,255,0.2)"] { color: var(--bior-text-faint) !important; }
    [data-theme="light"] #pageContent [style*="color:rgba(255,255,255,0.15)"],
    [data-theme="light"] #pageContent [style*="color:rgba(255,255,255,0.1)"] { color: var(--bior-text-disabled) !important; }

    /* Inline dark bg overrides */
    [data-theme="light"] #pageContent [style*="background:rgba(255,255,255,0.03)"],
    [data-theme="light"] #pageContent [style*="background:rgba(255,255,255,0.04)"],
    [data-theme="light"] #pageContent [style*="background:rgba(255,255,255,0.05)"],
    [data-theme="light"] #pageContent [style*="background:rgba(255,255,255,0.06)"] { background: var(--bior-bg-elevated) !important; }
    [data-theme="light"] #pageContent [style*="background:rgba(255,255,255,0.08)"],
    [data-theme="light"] #pageContent [style*="background:rgba(255,255,255,0.1)"],
    [data-theme="light"] #pageContent [style*="background:rgba(255,255,255,0.12)"] { background: var(--bior-bg-interactive) !important; }

    /* Inline border overrides */
    [data-theme="light"] #pageContent [style*="border-color:rgba(255,255,255"],
    [data-theme="light"] #pageContent [style*="border:1px solid rgba(255,255,255"],
    [data-theme="light"] #pageContent [style*="border:1.5px solid rgba(255,255,255"],
    [data-theme="light"] #pageContent [style*="border-bottom:1px solid rgba(255,255,255"] { border-color: var(--bior-border-subtle) !important; }

    /* Tailwind bg-[#0a0f1a] and similar hardcoded dark backgrounds */
    [data-theme="light"] .bg-\\[\\#0a0f1a\\] { background: var(--bior-bg-page) !important; }
    [data-theme="light"] .bg-\\[\\#1a1f2e\\] { background: var(--bior-bg-card) !important; }
    [data-theme="light"] .bg-\\[\\#0f1420\\] { background: var(--bior-bg-card) !important; }

    /* Dividers */
    [data-theme="light"] .divide-gray-800 > * + * { border-color: var(--bior-border-subtle) !important; }
    [data-theme="light"] table thead { background: var(--bior-bg-elevated) !important; }
    [data-theme="light"] .toast { box-shadow: var(--bior-shadow-md) !important; }

    /* PROTECT: Sidebar always keeps white text on green gradient */
    [data-theme="light"] .sidebar-wrap .text-white { color: #fff !important; }
    [data-theme="light"] .sidebar-wrap .text-white\\/50 { color: rgba(255,255,255,0.5) !important; }
    [data-theme="light"] .sidebar-wrap .text-white\\/70 { color: rgba(255,255,255,0.7) !important; }
    [data-theme="light"] .sidebar-wrap .border-white\\/10 { border-color: rgba(255,255,255,0.1) !important; }

    /* Modal content overrides for light mode */
    [data-theme="light"] .modal-content .text-white { color: var(--bior-text-primary) !important; }
    [data-theme="light"] .modal-content .text-white\\/85 { color: var(--bior-text-primary) !important; }
    [data-theme="light"] .modal-content .text-white\\/80 { color: var(--bior-text-primary) !important; }
    [data-theme="light"] .modal-content .text-white\\/70 { color: var(--bior-text-secondary) !important; }
    [data-theme="light"] .modal-content .text-white\\/60 { color: var(--bior-text-secondary) !important; }
    [data-theme="light"] .modal-content .text-white\\/50 { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .modal-content .text-white\\/40 { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .modal-content .text-white\\/30 { color: var(--bior-text-faint) !important; }
    [data-theme="light"] .modal-content .text-white\\/25 { color: var(--bior-text-faint) !important; }
    [data-theme="light"] .modal-content .text-white\\/20 { color: var(--bior-text-disabled) !important; }
    [data-theme="light"] .modal-content .bg-white\\/5,
    [data-theme="light"] .modal-content .bg-white\\/8,
    [data-theme="light"] .modal-content .bg-white\\/10 { background: var(--bior-bg-elevated) !important; }
    [data-theme="light"] .modal-content .border-white\\/8,
    [data-theme="light"] .modal-content .border-white\\/10,
    [data-theme="light"] .modal-content .border-white\\/20 { border-color: var(--bior-border-subtle) !important; }
    [data-theme="light"] .modal-content input,
    [data-theme="light"] .modal-content textarea,
    [data-theme="light"] .modal-content select { background: var(--bior-bg-elevated) !important; border-color: var(--bior-border-default) !important; color: var(--bior-text-primary) !important; }
    [data-theme="light"] .modal-content input::placeholder,
    [data-theme="light"] .modal-content textarea::placeholder { color: var(--bior-text-faint) !important; }
    [data-theme="light"] .modal-content [style*="color:#fff"],
    [data-theme="light"] .modal-content [style*="color: #fff"] { color: var(--bior-text-primary) !important; }
    [data-theme="light"] .modal-content [style*="color:rgba(255,255,255"] { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .modal-content [style*="background:rgba(255,255,255,0.05)"],
    [data-theme="light"] .modal-content [style*="background:rgba(255,255,255,0.03)"] { background: var(--bior-bg-elevated) !important; }
    [data-theme="light"] .modal-content [style*="border:1px solid rgba(255,255,255"],
    [data-theme="light"] .modal-content [style*="border:1.5px solid rgba(255,255,255"] { border-color: var(--bior-border-subtle) !important; }
    [data-theme="light"] .modal-content .hover\\:bg-white\\/5:hover,
    [data-theme="light"] .modal-content .hover\\:bg-white\\/8:hover { background: var(--bior-bg-elevated) !important; }

    /* Notification badge color categories */
    [data-theme="light"] .modal-content .bg-red-900\\/10 { background: rgba(239,68,68,0.06) !important; }
    [data-theme="light"] .modal-content .bg-amber-900\\/10 { background: rgba(245,158,11,0.06) !important; }
    [data-theme="light"] .modal-content .bg-emerald-900\\/10 { background: rgba(var(--bior-primary-rgb),0.06) !important; }
    [data-theme="light"] .modal-content .bg-purple-900\\/10 { background: rgba(139,92,246,0.06) !important; }
    [data-theme="light"] .modal-content .bg-blue-900\\/50 { background: rgba(59,130,246,0.12) !important; }
    [data-theme="light"] .modal-content .bg-red-900\\/50 { background: rgba(239,68,68,0.12) !important; }
    [data-theme="light"] .modal-content .bg-amber-900\\/50 { background: rgba(245,158,11,0.12) !important; }
    [data-theme="light"] .modal-content .bg-emerald-900\\/50 { background: rgba(var(--bior-primary-rgb),0.12) !important; }
    [data-theme="light"] .modal-content .bg-purple-900\\/50 { background: rgba(139,92,246,0.12) !important; }
    [data-theme="light"] .modal-content .border-red-800\\/30 { border-color: rgba(239,68,68,0.15) !important; }
    [data-theme="light"] .modal-content .border-amber-800\\/30 { border-color: rgba(245,158,11,0.15) !important; }

    /* Alert cards in workspace */
    [data-theme="light"] #pageContent .bg-red-900\\/50 { background: rgba(239,68,68,0.12) !important; }
    [data-theme="light"] #pageContent .bg-amber-900\\/50 { background: rgba(245,158,11,0.12) !important; }
    [data-theme="light"] #pageContent .bg-red-900\\/10 { background: rgba(239,68,68,0.06) !important; }
    [data-theme="light"] #pageContent .bg-amber-900\\/10 { background: rgba(245,158,11,0.06) !important; }

    /* Header overrides for light mode */
    [data-theme="light"] .bior-header .text-white { color: var(--bior-text-primary) !important; }
    [data-theme="light"] .bior-header .text-white\\/85 { color: var(--bior-text-primary) !important; }
    [data-theme="light"] .bior-header .text-white\\/60 { color: var(--bior-text-secondary) !important; }
    [data-theme="light"] .bior-header .text-white\\/40 { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .bior-header .text-white\\/30 { color: var(--bior-text-faint) !important; }
    [data-theme="light"] .bior-header .text-white\\/25 { color: var(--bior-text-faint) !important; }
    [data-theme="light"] .bior-header .text-white\\/20 { color: var(--bior-text-disabled) !important; }
    [data-theme="light"] .bior-header .bg-white\\/5,
    [data-theme="light"] .bior-header .bg-white\\/8 { background: var(--bior-bg-elevated) !important; }
    [data-theme="light"] .bior-header .border-white\\/8,
    [data-theme="light"] .bior-header .border-white\\/10 { border-color: var(--bior-border-subtle) !important; }
    [data-theme="light"] .bior-header .hover\\:text-white:hover { color: var(--bior-text-primary) !important; }
    [data-theme="light"] .bior-header .hover\\:bg-white\\/5:hover { background: var(--bior-bg-interactive) !important; }

    /* ===== CUSTOM MAP MARKERS ===== */
    .custom-marker { background: none !important; border: none !important; }
    .bior-popup .leaflet-popup-content-wrapper { background: #1a1f2e !important; color: #fff !important; border-radius: var(--bior-radius-lg) !important; border: 1px solid var(--bior-border-default) !important; box-shadow: var(--bior-shadow-xl) !important; }
    .bior-popup .leaflet-popup-tip { background: #1a1f2e !important; }
    [data-theme="light"] .bior-popup .leaflet-popup-content-wrapper { background: var(--bior-bg-card) !important; color: var(--bior-text-primary) !important; border-color: var(--bior-border-default) !important; box-shadow: var(--bior-shadow-lg) !important; }
    [data-theme="light"] .bior-popup .leaflet-popup-tip { background: var(--bior-bg-card) !important; }
    [data-theme="light"] .leaflet-popup-content [style*="color:#fff"],
    [data-theme="light"] .leaflet-popup-content [style*="color: #fff"] { color: var(--bior-text-primary) !important; }
    [data-theme="light"] .leaflet-popup-content [style*="color:rgba(255,255,255"] { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .leaflet-popup-content [style*="background:rgba(255,255,255,0.05)"],
    [data-theme="light"] .leaflet-popup-content [style*="background:rgba(255,255,255,0.03)"] { background: var(--bior-bg-elevated) !important; }
    [data-theme="light"] .leaflet-popup-content [style*="border:1px solid rgba(255,255,255"] { border-color: var(--bior-border-subtle) !important; }

    /* ===== KBD KEY STYLE ===== */
    kbd { display: inline-flex; align-items: center; justify-content: center; min-width: 20px; }
    [data-theme="light"] kbd { background: var(--bior-bg-elevated) !important; border-color: var(--bior-border-default) !important; color: var(--bior-text-muted) !important; }

    /* ===== AUTO REFRESH MENU ===== */
    #autoRefreshMenu { backdrop-filter: blur(12px); }
    .ar-opt:hover { background: rgba(var(--bior-primary-rgb),0.1) !important; color: var(--bior-primary) !important; }
    .ar-opt.active { background: rgba(var(--bior-primary-rgb),0.15) !important; color: var(--bior-primary) !important; font-weight: 600; }
    [data-theme="light"] #autoRefreshMenu { background: var(--bior-bg-card) !important; border-color: var(--bior-border-default) !important; }
    [data-theme="light"] .ar-opt { color: var(--bior-text-secondary) !important; }

    /* ===== HEATMAP CELL TOOLTIP ===== */
    .heatmap-cell .group-hover\\:opacity-100 { z-index: var(--z-modal); }

    /* ===== LIVE TICKER ===== */
    .ticker-wrap { position: relative; }
    .ticker-track { animation: tickerScroll 30s linear infinite; }
    .ticker-track:hover { animation-play-state: paused; }
    @keyframes tickerScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

    /* ===== EWS RADIAL RINGS ===== */
    .ews-ring { animation: ewsRingIn 1s ease-out forwards; transition: stroke-dashoffset 0.8s ease-out; }
    @keyframes ewsRingIn { from { stroke-dashoffset: 88; } }

    /* ===== COMMAND PALETTE ===== */
    .cmd-item.cmd-active { background: rgba(var(--bior-primary-rgb),0.08) !important; }
    .cmd-item.cmd-active .fa-arrow-right { color: rgba(var(--bior-primary-rgb),0.5) !important; }
    [data-theme="light"] .cmd-item.cmd-active { background: rgba(var(--bior-primary-rgb),0.06) !important; }
    [data-theme="light"] #cmdInput { color: var(--bior-text-primary) !important; }
    [data-theme="light"] #cmdInput::placeholder { color: var(--bior-text-faint) !important; }

    /* ===== USER MENU POPUP ===== */
    .user-menu-pop { animation: userMenuPop 0.2s ease-out; backdrop-filter: blur(16px); }
    @keyframes userMenuPop {
      from { opacity: 0; transform: translateY(8px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .user-menu-item { transition: all 0.15s ease; }
    .user-menu-item:hover { padding-left: 20px !important; }
    [data-theme="light"] .user-menu-pop { background: var(--bior-bg-card) !important; border-color: var(--bior-border-default) !important; }

    /* User menu light mode */
    [data-theme="light"] #userMenu { background: var(--bior-bg-card) !important; border-color: var(--bior-border-default) !important; box-shadow: var(--bior-shadow-lg) !important; }
    [data-theme="light"] #userMenu .text-white { color: var(--bior-text-primary) !important; }
    [data-theme="light"] #userMenu .text-white\\/80 { color: var(--bior-text-primary) !important; }
    [data-theme="light"] #userMenu .text-white\\/60 { color: var(--bior-text-secondary) !important; }
    [data-theme="light"] #userMenu .text-white\\/50 { color: var(--bior-text-muted) !important; }
    [data-theme="light"] #userMenu .text-white\\/40 { color: var(--bior-text-muted) !important; }
    [data-theme="light"] #userMenu .text-white\\/30 { color: var(--bior-text-faint) !important; }
    [data-theme="light"] #userMenu .text-white\\/20 { color: var(--bior-text-disabled) !important; }
    [data-theme="light"] #userMenu .bg-white\\/5,
    [data-theme="light"] #userMenu .bg-white\\/8,
    [data-theme="light"] #userMenu .bg-white\\/12 { background: var(--bior-bg-elevated) !important; }
    [data-theme="light"] #userMenu .border-white\\/8,
    [data-theme="light"] #userMenu .border-white\\/10 { border-color: var(--bior-border-subtle) !important; }
    [data-theme="light"] .user-menu-item { color: var(--bior-text-secondary) !important; }
    [data-theme="light"] .user-menu-item:hover { background: var(--bior-bg-elevated) !important; }

    /* Search dropdown light mode */
    [data-theme="light"] #searchResultsWrap { background: var(--bior-bg-card) !important; border-color: var(--bior-border-default) !important; box-shadow: var(--bior-shadow-lg) !important; }
    [data-theme="light"] #searchResultsWrap .text-white\\/85 { color: var(--bior-text-primary) !important; }
    [data-theme="light"] #searchResultsWrap .text-white\\/35 { color: var(--bior-text-muted) !important; }
    [data-theme="light"] #searchResultsWrap .text-white\\/30 { color: var(--bior-text-faint) !important; }
    [data-theme="light"] #searchResultsWrap .text-white\\/20 { color: var(--bior-text-disabled) !important; }
    [data-theme="light"] #searchResultsWrap .text-white\\/10 { color: var(--bior-text-disabled) !important; }
    [data-theme="light"] #searchResultsWrap .bg-white\\/5,
    [data-theme="light"] #searchResultsWrap .bg-white\\/6 { background: var(--bior-bg-elevated) !important; }
    [data-theme="light"] #searchResultsWrap .hover\\:bg-white\\/5:hover { background: var(--bior-bg-elevated) !important; }
    [data-theme="light"] #autoRefreshMenu .text-white\\/30 { color: var(--bior-text-faint) !important; }
    [data-theme="light"] #autoRefreshMenu .text-white\\/60 { color: var(--bior-text-muted) !important; }

    /* ===== LIGHT THEME — HUB, BENCHMARK, DATA LIBRARY ===== */
    [data-theme="light"] .hub-page { background: var(--bior-bg-page) !important; color: var(--bior-text-primary) !important; }
    [data-theme="light"] .hub-header { background: var(--bior-glass-bg) !important; backdrop-filter: blur(20px); border-bottom-color: var(--bior-border-subtle) !important; }
    [data-theme="light"] .hub-card { background: var(--bior-bg-card) !important; border-color: var(--bior-border-subtle) !important; box-shadow: var(--bior-shadow-sm); }
    [data-theme="light"] .hub-card::before { background: radial-gradient(circle, rgba(var(--bior-primary-rgb),0.04) 0%, transparent 70%) !important; }
    [data-theme="light"] .hub-card:hover { border-color: var(--bior-border-primary) !important; box-shadow: var(--bior-shadow-md); }
    [data-theme="light"] .hub-card-name { color: var(--bior-text-primary) !important; }
    [data-theme="light"] .hub-btn-icon { background: var(--bior-bg-elevated) !important; border-color: var(--bior-border-subtle) !important; color: var(--bior-text-muted) !important; }
    [data-theme="light"] .hub-btn-icon:hover { background: var(--bior-bg-interactive) !important; color: var(--bior-primary) !important; }
    [data-theme="light"] .hub-card-desc { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .hub-modal { background: var(--bior-bg-card) !important; border-color: var(--bior-border-default) !important; box-shadow: var(--bior-shadow-xl) !important; }
    [data-theme="light"] .hub-modal[style*="background"] { background: var(--bior-bg-card) !important; }
    [data-theme="light"] .hub-modal h3 { color: var(--bior-text-primary) !important; }
    [data-theme="light"] .hub-modal p { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .hub-modal label { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .hub-modal [style*="color:#fff"],
    [data-theme="light"] .hub-modal [style*="color: #fff"] { color: var(--bior-text-primary) !important; }
    [data-theme="light"] .hub-modal [style*="color:rgba(255,255,255"] { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .hub-modal [style*="background:rgba(255,255,255,0.05)"],
    [data-theme="light"] .hub-modal [style*="background:rgba(255,255,255,0.06)"] { background: var(--bior-bg-elevated) !important; }
    [data-theme="light"] .hub-modal [style*="border:1px solid rgba(255,255,255"],
    [data-theme="light"] .hub-modal [style*="border:1.5px solid rgba(255,255,255"] { border-color: var(--bior-border-default) !important; }
    [data-theme="light"] .hub-modal input,
    [data-theme="light"] .hub-modal textarea { background: var(--bior-bg-elevated) !important; border-color: var(--bior-border-default) !important; color: var(--bior-text-primary) !important; }
    [data-theme="light"] .hub-dl-card-icon { box-shadow: none !important; }
    [data-theme="light"] .hub-welcome h2 { color: var(--bior-text-primary) !important; }
    [data-theme="light"] .hub-welcome p { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .hub-footer { background: var(--bior-glass-bg) !important; border-color: var(--bior-border-subtle) !important; }
    [data-theme="light"] .hub-dl-card { background: var(--bior-bg-card) !important; border-color: var(--bior-border-subtle) !important; }
    [data-theme="light"] .hub-dl-card:hover { border-color: var(--bior-border-primary) !important; }
    [data-theme="light"] .hub-dl-card-name { color: var(--bior-text-primary) !important; }
    [data-theme="light"] .hub-dl-card-desc { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .hub-dl-card-tag { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .hub-dl-scroll::-webkit-scrollbar-thumb { background: var(--bior-border-default) !important; }
    [data-theme="light"] .hub-dl-scroll::-webkit-scrollbar-track { background: var(--bior-bg-elevated) !important; }

    /* Hub section containers & headers */
    [data-theme="light"] .hub-section { border-color: var(--bior-border-subtle) !important; }
    [data-theme="light"] .hub-sec-projects { background: linear-gradient(135deg, rgba(var(--bior-primary-rgb),0.06), rgba(var(--bior-primary-rgb),0.02)) !important; }
    [data-theme="light"] .hub-sec-kb { background: linear-gradient(135deg, rgba(245,158,11,0.06), rgba(245,158,11,0.02)) !important; }
    [data-theme="light"] .hub-sec-engines { background: linear-gradient(135deg, rgba(99,102,241,0.06), rgba(99,102,241,0.02)) !important; }
    [data-theme="light"] .hub-sec-tools { background: linear-gradient(135deg, rgba(6,182,212,0.06), rgba(6,182,212,0.02)) !important; }
    [data-theme="light"] .hub-sec-data { background: linear-gradient(135deg, rgba(139,92,246,0.06), rgba(139,92,246,0.02)) !important; }
    [data-theme="light"] .hub-section-header { border-bottom-color: var(--bior-border-subtle) !important; }
    [data-theme="light"] .hub-section-title { color: var(--bior-text-primary) !important; }
    [data-theme="light"] .hub-section-desc { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .hub-section-count { color: inherit !important; }
    [data-theme="light"] .hub-footer-left,
    [data-theme="light"] .hub-footer-left span { color: var(--bior-text-faint) !important; }
    [data-theme="light"] .hub-footer-right { color: var(--bior-text-disabled) !important; }
    [data-theme="light"] .hub-user-info p { color: var(--bior-text-primary) !important; }
    [data-theme="light"] .hub-user-info span { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .hub-brand-text h1 { color: var(--bior-text-primary) !important; }
    [data-theme="light"] .hub-brand-text p { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .hub-dl-card-name span[style*="-webkit-text-fill-color:transparent"] {
      -webkit-text-fill-color: initial !important; background: none !important; -webkit-background-clip: initial !important;
    }
    [data-theme="light"] .hub-stat-card { background: var(--bior-bg-elevated) !important; border-color: var(--bior-border-subtle) !important; }
    [data-theme="light"] .hub-stat-card p[style*="color:#fff"],
    [data-theme="light"] .hub-stat-card [style*="color:#fff"] { color: var(--bior-text-primary) !important; }
    [data-theme="light"] .hub-stat-card [style*="color:rgba(255,255,255"] { color: var(--bior-text-muted) !important; }

    /* Hub page inline overrides */
    [data-theme="light"] .hub-page [style*="color:#fff"],
    [data-theme="light"] .hub-page [style*="color: #fff"] { color: var(--bior-text-primary) !important; }
    [data-theme="light"] .hub-page [style*="color:rgba(255,255,255,0.85)"],
    [data-theme="light"] .hub-page [style*="color:rgba(255,255,255,0.8)"] { color: var(--bior-text-primary) !important; }
    [data-theme="light"] .hub-page [style*="color:rgba(255,255,255,0.7)"],
    [data-theme="light"] .hub-page [style*="color:rgba(255,255,255,0.6)"] { color: var(--bior-text-secondary) !important; }
    [data-theme="light"] .hub-page [style*="color:rgba(255,255,255,0.5)"],
    [data-theme="light"] .hub-page [style*="color:rgba(255,255,255,0.4)"],
    [data-theme="light"] .hub-page [style*="color:rgba(255,255,255,0.35)"] { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .hub-page [style*="color:rgba(255,255,255,0.3)"],
    [data-theme="light"] .hub-page [style*="color:rgba(255,255,255,0.25)"],
    [data-theme="light"] .hub-page [style*="color:rgba(255,255,255,0.2)"] { color: var(--bior-text-faint) !important; }
    [data-theme="light"] .hub-page [style*="background:rgba(255,255,255,0.03)"],
    [data-theme="light"] .hub-page [style*="background:rgba(255,255,255,0.04)"],
    [data-theme="light"] .hub-page [style*="background:rgba(255,255,255,0.05)"],
    [data-theme="light"] .hub-page [style*="background:rgba(255,255,255,0.06)"] { background: var(--bior-bg-elevated) !important; }
    [data-theme="light"] .hub-page [style*="background:rgba(255,255,255,0.08)"],
    [data-theme="light"] .hub-page [style*="background:rgba(255,255,255,0.1)"] { background: var(--bior-bg-interactive) !important; }
    [data-theme="light"] .hub-page [style*="border:1px solid rgba(255,255,255"],
    [data-theme="light"] .hub-page [style*="border:1.5px solid rgba(255,255,255"],
    [data-theme="light"] .hub-page [style*="border-color:rgba(255,255,255"],
    [data-theme="light"] .hub-page [style*="border-bottom:1px solid rgba(255,255,255"] { border-color: var(--bior-border-subtle) !important; }
    [data-theme="light"] .hub-page input,
    [data-theme="light"] .hub-page textarea { background: var(--bior-bg-elevated) !important; border-color: var(--bior-border-default) !important; color: var(--bior-text-primary) !important; }

    /* PROTECT: Buttons with gradient keep white text */
    [data-theme="light"] .hub-page button[style*="background:linear-gradient"][style*="color:#fff"],
    [data-theme="light"] .hub-page button[style*="background:linear-gradient"][style*="color: #fff"],
    [data-theme="light"] .hub-page .hub-section-btn,
    [data-theme="light"] .hub-page .hub-modal-btn-primary { color: #fff !important; }
    [data-theme="light"] .hub-page .hub-brand-icon i,
    [data-theme="light"] .hub-page .hub-avatar,
    [data-theme="light"] .hub-page .hub-dl-card-icon[style*="background"] i { color: #fff !important; }

    /* Hub add/dl elements light */
    [data-theme="light"] .hub-card-add { border-color: var(--bior-border-default) !important; }
    [data-theme="light"] .hub-card-add-icon { border-color: var(--bior-border-default) !important; color: var(--bior-text-disabled) !important; }
    [data-theme="light"] .hub-card-add-title { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .hub-card-add-desc { color: var(--bior-text-faint) !important; }
    [data-theme="light"] .hub-dl-add { border-color: var(--bior-border-default) !important; }
    [data-theme="light"] .hub-dl-add-icon { border-color: var(--bior-border-default) !important; color: var(--bior-text-disabled) !important; }
    [data-theme="light"] .hub-dl-add-title { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .hub-dl-add-desc { color: var(--bior-text-faint) !important; }
    [data-theme="light"] .hub-card-stat { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .hub-card-enter { color: var(--bior-primary) !important; }
    [data-theme="light"] .hub-dl-btn-more { background: var(--bior-bg-elevated) !important; color: var(--bior-text-muted) !important; border-color: var(--bior-border-subtle) !important; }
    [data-theme="light"] .hub-dl-btn-more:hover { color: var(--bior-text-secondary) !important; }
    [data-theme="light"] .hub-dl-progress { background: var(--bior-bg-elevated) !important; }
    [data-theme="light"] .hub-dl-loading { color: var(--bior-text-faint) !important; }
    [data-theme="light"] .hub-icon-opt { border-color: var(--bior-border-subtle) !important; color: var(--bior-text-muted) !important; }
    [data-theme="light"] .hub-icon-opt:hover { border-color: var(--bior-border-strong) !important; color: var(--bior-text-secondary) !important; }
    [data-theme="light"] .hub-modal-btn-cancel { background: var(--bior-bg-elevated) !important; color: var(--bior-text-secondary) !important; border-color: var(--bior-border-default) !important; }

    /* Empty project, dataset explorer, dataset compare — light overrides */
    [data-theme="light"] .ep-wrap { background: var(--bior-bg-page) !important; color: var(--bior-text-primary) !important; }
    [data-theme="light"] .ep-title { color: var(--bior-text-primary) !important; }
    [data-theme="light"] .de-wrap [style*="color:#fff"],
    [data-theme="light"] .de-wrap [style*="color: #fff"] { color: var(--bior-text-primary) !important; }
    [data-theme="light"] .de-wrap [style*="color:rgba(255,255,255"] { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .de-wrap [style*="background:rgba(255,255,255,0.05)"],
    [data-theme="light"] .de-wrap [style*="background:rgba(255,255,255,0.03)"] { background: var(--bior-bg-elevated) !important; }
    [data-theme="light"] .de-wrap [style*="border:1px solid rgba(255,255,255"],
    [data-theme="light"] .de-wrap [style*="border:1.5px solid rgba(255,255,255"] { border-color: var(--bior-border-subtle) !important; }
    [data-theme="light"] .de-wrap input,
    [data-theme="light"] .de-wrap textarea,
    [data-theme="light"] .de-search { background: var(--bior-bg-elevated) !important; border-color: var(--bior-border-default) !important; color: var(--bior-text-primary) !important; }
    [data-theme="light"] .dc-wrap [style*="color:#fff"] { color: var(--bior-text-primary) !important; }
    [data-theme="light"] .dc-wrap [style*="color:rgba(255,255,255"] { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .ep-header,
    [data-theme="light"] .de-header,
    [data-theme="light"] .dc-header { background: var(--bior-glass-bg) !important; border-color: var(--bior-border-subtle) !important; }
    [data-theme="light"] .ep-back,
    [data-theme="light"] .de-back,
    [data-theme="light"] .dc-back { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .de-tabs { background: var(--bior-glass-bg) !important; border-color: var(--bior-border-subtle) !important; }
    [data-theme="light"] [style*="background:rgba(10,15,26"] { background: var(--bior-glass-bg) !important; }

    /* Benchmark viewer light */
    [data-theme="light"] .bm-wrapper { background: var(--bior-bg-page) !important; color: var(--bior-text-primary) !important; }
    [data-theme="light"] .bm-glass { background: var(--bior-bg-card) !important; border-color: var(--bior-border-subtle) !important; box-shadow: var(--bior-shadow-sm) !important; }
    [data-theme="light"] .bm-glass-light { background: rgba(245,247,250,0.95) !important; border-color: var(--bior-border-subtle) !important; }
    [data-theme="light"] .bm-tab { color: var(--bior-text-faint) !important; }
    [data-theme="light"] .bm-tab:hover { color: var(--bior-text-secondary) !important; }
    [data-theme="light"] .bm-tab-active { border-color: #0284c7 !important; color: #0284c7 !important; background: rgba(2,132,199,0.08) !important; }
    [data-theme="light"] .bm-card { background: var(--bior-bg-card) !important; border-color: var(--bior-border-subtle) !important; box-shadow: var(--bior-shadow-sm) !important; }
    [data-theme="light"] .bm-card:hover { box-shadow: var(--bior-shadow-md) !important; }
    [data-theme="light"] .bm-wrapper [style*="color:#fff"],
    [data-theme="light"] .bm-wrapper [style*="color: #fff"],
    [data-theme="light"] .bm-wrapper [style*="color:#e2e8f0"],
    [data-theme="light"] .bm-wrapper [style*="color: #e2e8f0"] { color: #1e293b !important; }
    [data-theme="light"] .bm-wrapper [style*="color:#cbd5e1"] { color: #334155 !important; }
    [data-theme="light"] .bm-wrapper [style*="color:#94a3b8"] { color: #64748b !important; }
    [data-theme="light"] .bm-wrapper [style*="color:rgba(255,255,255"] { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .bm-wrapper h1, [data-theme="light"] .bm-wrapper h2,
    [data-theme="light"] .bm-wrapper h3, [data-theme="light"] .bm-wrapper h4 { color: var(--bior-text-primary) !important; }
    [data-theme="light"] .bm-wrapper p { color: #334155 !important; }
    [data-theme="light"] .bm-wrapper li { color: #334155 !important; }
    [data-theme="light"] .bm-wrapper table thead tr { background: var(--bior-bg-elevated) !important; }
    [data-theme="light"] .bm-wrapper table thead th { color: #64748b !important; background: var(--bior-bg-elevated) !important; }
    [data-theme="light"] .bm-wrapper table tbody tr { border-color: var(--bior-border-subtle) !important; }
    [data-theme="light"] .bm-wrapper table tbody tr:hover { background: var(--bior-bg-elevated) !important; }
    [data-theme="light"] .bm-wrapper table tbody td { color: #334155 !important; }
    [data-theme="light"] .bm-wrapper input,
    [data-theme="light"] .bm-wrapper select { background: var(--bior-bg-elevated) !important; border-color: var(--bior-border-default) !important; color: var(--bior-text-primary) !important; }
    [data-theme="light"] .bm-wrapper [style*="background:#0f172a"],
    [data-theme="light"] .bm-wrapper [style*="background:#1e293b"] { background: var(--bior-bg-elevated) !important; }
    [data-theme="light"] .bm-wrapper [style*="background:rgba(15,23,42"],
    [data-theme="light"] .bm-wrapper [style*="background:rgba(30,41,59"],
    [data-theme="light"] .bm-wrapper [style*="background:rgba(51,65,85"] { background: var(--bior-bg-elevated) !important; }
    [data-theme="light"] .bm-wrapper [style*="border-color:rgba(56,189,248"],
    [data-theme="light"] .bm-wrapper [style*="border:1px solid rgba(56,189,248"],
    [data-theme="light"] .bm-wrapper [style*="border-bottom:1px solid rgba(51,65,85"],
    [data-theme="light"] .bm-wrapper [style*="border-color:rgba(51,65,85"],
    [data-theme="light"] .bm-wrapper [style*="border:1px solid rgba(51,65,85"] { border-color: var(--bior-border-subtle) !important; }
    [data-theme="light"] .bm-wrapper svg text { fill: #64748b !important; }
    [data-theme="light"] .bm-wrapper svg line { stroke: var(--bior-border-subtle) !important; }
    [data-theme="light"] .bm-wrapper a { color: #0284c7 !important; }
    [data-theme="light"] .bm-wrapper .bm-layer-btn { background: var(--bior-bg-elevated) !important; border-color: var(--bior-border-subtle) !important; color: #64748b !important; }
    [data-theme="light"] .bm-wrapper .bm-layer-btn.active { background: rgba(2,132,199,0.1) !important; border-color: rgba(2,132,199,0.3) !important; color: #0284c7 !important; }
    .bm-wrapper { background: var(--bm-bg, #0f172a); color: var(--bm-text, #e2e8f0); }

    /* Dataset explorer light */
    [data-theme="light"] .de-tab.active { color: var(--bior-primary) !important; border-color: var(--bior-primary) !important; background: rgba(var(--bior-primary-rgb),0.06) !important; }
    [data-theme="light"] .de-sidebar { background: rgba(245,247,250,0.95) !important; border-color: var(--bior-border-subtle) !important; }
    [data-theme="light"] .de-main { background: var(--bior-bg-page) !important; }
    [data-theme="light"] .dc-card { background: var(--bior-bg-card) !important; border-color: var(--bior-border-subtle) !important; }
    [data-theme="light"] .dc-card h3 { color: var(--bior-text-primary) !important; }
    [data-theme="light"] .dc-metric { background: var(--bior-bg-elevated) !important; border-color: var(--bior-border-subtle) !important; }
    [data-theme="light"] .dc-metric-label { color: var(--bior-text-muted) !important; }

    /* Admin panels light */
    [data-theme="light"] .admin-tab { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .admin-tab:hover { background: var(--bior-bg-elevated) !important; color: var(--bior-text-secondary) !important; }
    [data-theme="light"] .admin-tab.active { background: rgba(var(--bior-primary-rgb),0.1) !important; color: var(--bior-primary) !important; border-color: rgba(var(--bior-primary-rgb),0.3) !important; }
    [data-theme="light"] .service-card { box-shadow: var(--bior-shadow-sm) !important; }
    [data-theme="light"] .service-card:hover { box-shadow: var(--bior-shadow-md) !important; }
    [data-theme="light"] .data-table thead { background: var(--bior-bg-elevated) !important; }
    [data-theme="light"] .data-table th { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .data-table tbody tr:hover { background: rgba(var(--bior-primary-rgb),0.04) !important; }

    /* Alerts, genomics, misc light */
    [data-theme="light"] .alert-filter-btn { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .alert-item { box-shadow: var(--bior-shadow-sm) !important; }
    [data-theme="light"] .phylo-tree text { fill: var(--bior-text-muted) !important; }
    [data-theme="light"] .cmd-item .text-white\\/85 { color: var(--bior-text-primary) !important; }
    [data-theme="light"] .cmd-item .text-white\\/35 { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .rpt-tab-btn { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .rpt-tab-btn:hover { color: var(--bior-text-secondary) !important; }
    [data-theme="light"] .detection-layer { border-color: var(--bior-border-subtle) !important; background: var(--bior-bg-elevated) !important; }
    [data-theme="light"] .detection-layer:hover { background: var(--bior-bg-interactive) !important; }
    [data-theme="light"] .risk-bar-animate { box-shadow: none !important; }
    [data-theme="light"] .ticker-wrap { border-color: var(--bior-border-subtle) !important; }
    [data-theme="light"] .heatmap-cell:hover { box-shadow: 0 0 8px rgba(0,0,0,0.15) !important; }
    [data-theme="light"] .profile-tab { color: var(--bior-text-muted) !important; }
    [data-theme="light"] .profile-tab.active { background: rgba(var(--bior-primary-rgb),0.1) !important; color: var(--bior-primary) !important; }
    [data-theme="light"] .login-page { background: var(--bior-bg-page) !important; }
    [data-theme="light"] .lp-right { background: var(--bior-bg-card) !important; border-left-color: var(--bior-border-subtle) !important; }
    [data-theme="light"] .lp-right-inner { color: var(--bior-text-primary) !important; }

    /* ===== GLOBAL LOADING BAR ===== */
    #loadBar {
      pointer-events: none;
      background: linear-gradient(90deg, var(--bior-primary), var(--bior-primary-light), var(--bior-primary)) !important;
      box-shadow: 0 0 10px rgba(var(--bior-primary-rgb),0.5), 0 0 20px rgba(var(--bior-primary-rgb),0.2);
    }

    /* ===== ENHANCED MOBILE RESPONSIVE ===== */
    @media (max-width: 640px) {
      .hub-welcome h2 { font-size: 20px !important; }
      .hub-welcome p { font-size: 12px !important; }
      .hub-section-header { flex-direction: column; gap: 8px; align-items: flex-start !important; }
      .hub-section-btn { font-size: 10px !important; padding: 6px 12px !important; }
      .hub-dl-card { min-width: 220px !important; max-width: 240px !important; padding: 14px !important; }
      .hub-dl-card-name { font-size: 12px !important; }
      .hub-dl-card-desc { font-size: 10px !important; }
      .hub-card { padding: 18px 16px !important; }
      .hub-card-icon { width: 40px !important; height: 40px !important; font-size: 16px !important; margin-bottom: 14px !important; }
      .hub-card-name { font-size: 14px !important; }
      .hub-card-desc { font-size: 11px !important; }
      .hub-footer { flex-direction: column !important; gap: 8px !important; padding: 16px 20px !important; }
      .bm-glass { border-radius: 8px !important; }
      .de-header { padding: 10px 16px !important; flex-wrap: wrap; gap: 8px; }
      .de-tabs { padding: 8px 16px !important; overflow-x: auto; }
      .de-tab { padding: 6px 12px !important; font-size: 10px !important; white-space: nowrap; }
      .de-main { padding: 16px !important; }
      .de-sidebar { display: none !important; }
      .de-toolbar { flex-direction: column; }
      .de-search { width: 100% !important; }
      .de-charts-grid { grid-template-columns: 1fr !important; }
      .dc-header { padding: 10px 16px !important; flex-wrap: wrap; gap: 8px; }
      .panel-card { border-radius: var(--bior-radius-md) !important; }
      .modal-content { max-width: 95vw !important; padding: 16px !important; }
    }

    @media (max-width: 480px) {
      .hub-header { padding: 12px 16px !important; }
      .hub-body { padding: 20px 16px 32px !important; }
      .hub-welcome { margin-bottom: 24px !important; }
      .hub-welcome h2 { font-size: 18px !important; }
      .hub-card-status { font-size: 9px !important; }
    }

    /* Profile tabs */
    .profile-tab.active {
      background: rgba(var(--bior-primary-rgb),0.15) !important;
      color: var(--bior-primary) !important;
      font-weight: 600;
    }

    /* ===== BENCHMARK BADGE VARIANTS ===== */
    [data-theme="light"] .bm-badge-l1 { background: rgba(22,163,74,0.1) !important; color: #16a34a !important; border-color: rgba(22,163,74,0.25) !important; }
    [data-theme="light"] .bm-badge-l2 { background: rgba(2,132,199,0.1) !important; color: #0284c7 !important; border-color: rgba(2,132,199,0.25) !important; }
    [data-theme="light"] .bm-badge-l3 { background: rgba(220,38,38,0.1) !important; color: #dc2626 !important; border-color: rgba(220,38,38,0.25) !important; }
    [data-theme="light"] .bm-badge-l4c { background: rgba(217,119,6,0.1) !important; color: #d97706 !important; border-color: rgba(217,119,6,0.25) !important; }
    [data-theme="light"] .bm-badge-l4h { background: rgba(109,40,217,0.1) !important; color: #6d28d9 !important; border-color: rgba(109,40,217,0.25) !important; }
    [data-theme="light"] .bm-badge-l5 { background: rgba(219,39,119,0.1) !important; color: #db2777 !important; border-color: rgba(219,39,119,0.25) !important; }

    /* Genomics heatmap dark cell backgrounds in light mode */
    [data-theme="light"] #pageContent [style*="background:rgba(16,185,129"] { background: rgba(16,185,129,0.15) !important; }
    [data-theme="light"] #pageContent [style*="background:rgba(245,158,11"] { background: rgba(245,158,11,0.15) !important; }
    [data-theme="light"] #pageContent [style*="background:rgba(239,68,68"] { background: rgba(239,68,68,0.15) !important; }
  `;
}
