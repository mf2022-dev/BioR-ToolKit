// =============================================================================
// BioR Platform - Layout, Sidebar, User Profile, Search, Notifications
// =============================================================================

export function getLayoutJS(): string {
  return `
// ===== LAYOUT =====
const navItems = [
  { id:'dashboard', icon:'fa-tachometer-alt', label:'Dashboard' },
  { id:'surveillance', icon:'fa-satellite-dish', label:'Surveillance' },
  { id:'threats', icon:'fa-biohazard', label:'Threat Intel' },
  { id:'genomics', icon:'fa-dna', label:'Genomics' },
  { id:'ews', icon:'fa-exclamation-triangle', label:'Early Warning' },
  { id:'alerts', icon:'fa-bell', label:'Alerts', badge:3 },
  { id:'analytics', icon:'fa-brain', label:'Analytics' },
  { id:'reports', icon:'fa-chart-bar', label:'Reports' },
  { id:'admin', icon:'fa-cogs', label:'Admin' },
];

function renderLayout() {
  const pageTitle = { dashboard:'Dashboard',surveillance:'Surveillance Network',threats:'Threat Intelligence',genomics:'Genomic Tracking',ews:'Early Warning System',alerts:'Alert Management',analytics:'Advanced Analytics',reports:'Reports & Analytics',admin:'System Administration' };
  const pageIcon = { dashboard:'fa-tachometer-alt',surveillance:'fa-satellite-dish',threats:'fa-biohazard',genomics:'fa-dna',ews:'fa-exclamation-triangle',alerts:'fa-bell',analytics:'fa-brain',reports:'fa-chart-bar',admin:'fa-cogs' };
  const pageDesc = { dashboard:'Real-time overview of national biosurveillance metrics', surveillance:'Monitor 24 active surveillance sites across 13 regions', threats:'AI-powered threat detection and intelligence analysis', genomics:'Genomic sequencing pipeline and AMR tracking', ews:'Multi-layer early warning signal detection', alerts:'Manage and review system-generated alerts', analytics:'Epidemiological risk scoring, anomaly detection, Rt estimation, and forecasting', reports:'Epidemiological analytics and situation reports', admin:'System health, data quality, and audit logs' };
  const collapsed = state.sidebarCollapsed;
  return '<div class="h-screen flex overflow-hidden">' +
    // Sidebar
    '<aside id="mainSidebar" class="sidebar-desktop sidebar-wrap ' + (collapsed ? 'collapsed' : 'w-60') + ' flex flex-col shrink-0" style="' + (collapsed ? 'width:64px' : '') + '">' +
    '<button id="sidebarToggle" class="sidebar-collapse-btn"><i class="fas fa-chevron-left"></i></button>' +
    '<div class="sidebar-brand p-4 border-b border-white/10 relative z-10">' +
    '<div class="flex items-center gap-3">' +
    '<div class="w-10 h-10 rounded-[14px] bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg shadow-black/20 shrink-0"><i class="fas fa-dna text-white text-base"></i></div>' +
    '<div class="sidebar-brand-text"><h1 class="text-base font-extrabold text-white leading-tight tracking-tight" style="text-transform:none">BioR Platform</h1><p class="text-[9px] text-white/70 tracking-wider font-medium" style="text-transform:none">Biological Response Network</p></div>' +
    '</div></div>' +
    '<nav class="flex-1 py-3 overflow-y-auto scrollbar-thin relative z-10">' +
    // Back to Projects hub link
    '<a onclick="navigateToHub()" class="sidebar-link flex items-center gap-3 px-4 py-2 cursor-pointer text-[12px] font-medium mb-1 opacity-60 hover:opacity-100" style="border-bottom:1px solid rgba(255,255,255,0.06);padding-bottom:10px;margin-bottom:8px">' +
    '<i class="fas fa-th-large w-5 text-center text-xs"></i>' +
    '<span class="sidebar-label">All Projects</span>' +
    '<span class="sidebar-tooltip">All Projects</span>' +
    '</a>' +
    navItems.map(n => '<a onclick="navigate(\\'' + n.id + '\\')" class="sidebar-link flex items-center gap-3 px-4 py-2.5 cursor-pointer text-[13px] font-medium ' + (state.currentPage===n.id ? 'active' : '') + '">' +
      '<i class="fas ' + n.icon + ' w-5 text-center text-xs"></i>' +
      '<span class="sidebar-label">' + n.label + '</span>' +
      (n.badge ? '<span class="sidebar-badge ml-auto bg-white/20 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold">' + n.badge + '</span>' : '') +
      '<span class="sidebar-tooltip">' + n.label + '</span>' +
    '</a>').join('') +
    '</nav>' +
    '<div class="sidebar-user-wrap p-3 border-t border-white/10 relative z-10">' +
    '<div class="flex items-center gap-2 p-2 rounded-xl bg-white/8 cursor-pointer hover:bg-white/12 transition" onclick="toggleUserMenu()">' +
    '<div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00A86B] to-[#006241] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg">' + (state.user?.avatar||'A') + '</div>' +
    '<div class="sidebar-user-info flex-1 min-w-0"><p class="text-xs font-semibold text-white truncate">' + (state.user?.name||'Admin') + '</p><p class="text-[9px] text-white/50 truncate">' + (state.user?.role||'Admin') + '</p></div>' +
    '<i class="fas fa-ellipsis-v text-white/30 text-[10px] sidebar-label"></i>' +
    '</div>' +
    '<div id="userMenu" class="hidden absolute bottom-full left-3 right-3 mb-2 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden user-menu-pop" style="background:var(--bior-bg-card);backdrop-filter:blur(16px)">' +
    '<div class="px-4 py-3 border-b border-white/8">' +
    '<div class="flex items-center gap-3 mb-2.5">' +
    '<div class="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00A86B] to-[#006241] flex items-center justify-center text-white text-lg font-bold shadow-lg ring-2 ring-[#00A86B]/30">' + (state.user?.avatar||'A') + '</div>' +
    '<div class="flex-1 min-w-0"><p class="text-sm font-semibold text-white truncate">' + (state.user?.name||'Admin') + '</p><p class="text-[10px] text-white/40 truncate">' + (state.user?.role||'Admin') + ' &bull; ' + (state.user?.tier?'Tier '+state.user.tier:'') + '</p></div>' +
    '<span class="px-1.5 py-0.5 rounded-md bg-[#00A86B]/15 text-[8px] text-[#00A86B] font-bold shrink-0">ACTIVE</span>' +
    '</div>' +
    '<div class="grid grid-cols-3 gap-1.5">' +
    '<div class="text-center p-1.5 rounded-lg bg-white/5"><p class="text-[10px] font-bold text-white/80">' + (state.user?.role==='Admin'?'Full':'Limited') + '</p><p class="text-[7px] text-white/30 uppercase">Access</p></div>' +
    '<div class="text-center p-1.5 rounded-lg bg-white/5"><p class="text-[10px] font-bold text-[#00A86B]">Online</p><p class="text-[7px] text-white/30 uppercase">Status</p></div>' +
    '<div class="text-center p-1.5 rounded-lg bg-white/5"><p class="text-[10px] font-bold text-white/80">24h</p><p class="text-[7px] text-white/30 uppercase">Session</p></div>' +
    '</div></div>' +
    '<div class="py-1">' +
    '<button onclick="showUserProfile();toggleUserMenu()" class="user-menu-item w-full text-left px-4 py-2 text-[11px] text-white/60 hover:bg-white/5 transition flex items-center gap-2.5"><i class="fas fa-user-circle w-4 text-center text-white/30"></i>My Profile<span class="ml-auto text-[8px] text-white/20 font-mono">Ctrl+P</span></button>' +
    '<button onclick="navigate(\\'admin\\');toggleUserMenu()" class="user-menu-item w-full text-left px-4 py-2 text-[11px] text-white/60 hover:bg-white/5 transition flex items-center gap-2.5"><i class="fas fa-cog w-4 text-center text-white/30"></i>System Settings</button>' +
    '<button onclick="toggleTheme();toggleUserMenu()" class="user-menu-item w-full text-left px-4 py-2 text-[11px] text-white/60 hover:bg-white/5 transition flex items-center gap-2.5"><i class="fas ' + (savedTheme==='dark'?'fa-sun':'fa-moon') + ' w-4 text-center text-white/30"></i>' + (savedTheme==='dark'?'Light Mode':'Dark Mode') + '</button>' +
    '<button onclick="showShortcutHelp();toggleUserMenu()" class="user-menu-item w-full text-left px-4 py-2 text-[11px] text-white/60 hover:bg-white/5 transition flex items-center gap-2.5"><i class="fas fa-keyboard w-4 text-center text-white/30"></i>Keyboard Shortcuts</button>' +
    '<button onclick="showCommandPalette();toggleUserMenu()" class="user-menu-item w-full text-left px-4 py-2 text-[11px] text-white/60 hover:bg-white/5 transition flex items-center gap-2.5"><i class="fas fa-terminal w-4 text-center text-white/30"></i>Command Palette<span class="ml-auto text-[8px] text-white/20 font-mono">\u2318K</span></button>' +
    '</div>' +
    '<div class="py-1 border-t border-white/8">' +
    '<button onclick="logout()" class="w-full text-left px-4 py-2 text-[11px] text-red-400/80 hover:bg-red-900/10 transition flex items-center gap-2.5"><i class="fas fa-sign-out-alt w-4 text-center"></i>Sign Out</button>' +
    '</div></div>' +
    '</div></aside>' +
    // Main content
    '<main class="flex-1 overflow-y-auto scrollbar-thin" style="background:var(--bior-bg-page)">' +
    '<header class="bior-header sticky top-0 z-10 px-5 py-3">' +
    '<div class="flex items-center justify-between">' +
    '<div class="flex items-center gap-3">' +
    // Mobile hamburger
    '<button class="mobile-menu-btn md:hidden" onclick="toggleMobileSidebar()"><i class="fas fa-bars text-white/60"></i></button>' +
    '<div class="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00A86B] to-[#006241] flex items-center justify-center shadow-lg shadow-[#00A86B]/10"><i class="fas ' + (pageIcon[state.currentPage]||'fa-home') + ' text-white text-xs"></i></div>' +
    '<div><div class="flex items-center gap-2"><h2 class="text-base font-bold text-white tracking-tight">' + (pageTitle[state.currentPage]||state.currentPage) + '</h2></div>' +
    '<div class="breadcrumb mt-0.5"><a onclick="navigate(\\'dashboard\\')">Home</a><span class="separator"><i class="fas fa-chevron-right"></i></span><span class="current">' + (pageTitle[state.currentPage]||state.currentPage) + '</span></div>' +
    '<p class="text-[9px] text-white/25 mt-0.5 hidden md:block">' + (pageDesc[state.currentPage]||'') + '</p>' +
    '</div></div>' +
    '<div class="flex items-center gap-2">' +
    // Search
    '<div class="header-search-wrap hidden md:block"><i class="header-search-icon fas fa-search"></i><input type="text" class="header-search" placeholder="Search pages, data..." id="headerSearch" oninput="handleSearch()" onkeydown="handleSearchKeydown(event)" autocomplete="off"/><kbd class="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-white/8 border border-white/10 text-[8px] text-white/20 font-mono pointer-events-none">\u2318K</kbd></div>' +
    // Status (SSE-aware)
    '<div id="connStatus" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00A86B]/10 border border-[#00A86B]/20 cursor-pointer" onclick="showSSEStatus()" title="Connection status"><span class="pulse-dot bg-[#00A86B] text-[#00A86B]"></span><span id="connLabel" class="text-[10px] text-[#00A86B] font-semibold">Online</span></div>' +
    // Notifications
    '<button class="notif-btn" onclick="showNotifications()" title="Notifications"><i class="fas fa-bell text-xs"></i><span class="notif-count" style="display:none">0</span></button>' +
    // Theme toggle
    '<button onclick="toggleTheme()" class="text-white/30 hover:text-[#00A86B] transition p-1.5 rounded-lg hover:bg-white/5" title="Toggle Theme"><i id="themeIcon" class="fas ' + (savedTheme==='dark'?'fa-moon':'fa-sun') + ' text-xs"></i></button>' +
    // Keyboard shortcut hint
    '<button onclick="showShortcutHelp()" class="hidden lg:flex text-white/20 hover:text-white/50 transition p-1.5 rounded-lg hover:bg-white/5 items-center gap-1" title="Keyboard Shortcuts"><kbd class="text-[9px] px-1.5 py-0.5 rounded bg-white/8 border border-white/10 font-mono">?</kbd></button>' +
    // Time
    '<div class="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/8"><i class="fas fa-clock text-[9px] text-white/30"></i><span id="headerTime" class="text-[10px] text-white/40 font-mono">' + new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit'}) + '</span></div>' +
    // Refresh + Auto-refresh dropdown
    '<div class="relative" id="refreshWrap"><button onclick="loadPage();spinRefresh()" class="text-white/30 hover:text-[#00A86B] transition p-1.5 rounded-lg hover:bg-white/5" title="Refresh" id="refreshBtn"><i class="fas fa-sync-alt text-xs"></i></button>' +
    '<button onclick="toggleAutoRefreshMenu()" class="text-white/20 hover:text-white/40 transition px-1 text-[9px]" title="Auto-refresh"><i class="fas fa-caret-down"></i></button>' +
    '<span id="autoRefreshBadge" class="hidden text-[8px] text-[#00A86B] font-mono ml-0.5"></span>' +
    '<div id="autoRefreshMenu" class="hidden absolute right-0 top-full mt-1 border border-white/10 rounded-xl shadow-xl z-50 py-1 min-w-[120px]" style="background:var(--bior-bg-card);backdrop-filter:blur(12px)">' +
    '<div class="px-3 py-1.5 text-[9px] text-white/30 uppercase font-semibold">Auto Refresh</div>' +
    '<button onclick="setAutoRefresh(0)" class="ar-opt w-full text-left px-3 py-1.5 text-[11px] text-white/60 hover:bg-white/5 transition">Off</button>' +
    '<button onclick="setAutoRefresh(15)" class="ar-opt w-full text-left px-3 py-1.5 text-[11px] text-white/60 hover:bg-white/5 transition">Every 15s</button>' +
    '<button onclick="setAutoRefresh(30)" class="ar-opt w-full text-left px-3 py-1.5 text-[11px] text-white/60 hover:bg-white/5 transition">Every 30s</button>' +
    '<button onclick="setAutoRefresh(60)" class="ar-opt w-full text-left px-3 py-1.5 text-[11px] text-white/60 hover:bg-white/5 transition">Every 60s</button>' +
    '</div></div>' +
    '</div></div></header>' +
    '<div id="pageContent" class="p-5"></div></main></div>';
}

// ===== SIDEBAR TOGGLE =====
function initSidebarToggle() {
  const btn = document.getElementById('sidebarToggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    state.sidebarCollapsed = !state.sidebarCollapsed;
    localStorage.setItem('bior_sidebar', state.sidebarCollapsed ? 'collapsed' : 'expanded');
    const sidebar = document.getElementById('mainSidebar');
    if (state.sidebarCollapsed) {
      sidebar.classList.add('collapsed');
      sidebar.classList.remove('w-60');
      sidebar.style.width = '64px';
    } else {
      sidebar.classList.remove('collapsed');
      sidebar.classList.add('w-60');
      sidebar.style.width = '';
    }
  });
}

// ===== USER PROFILE MODAL =====
window.showUserProfile = async function() {
  showModal('<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-white/30 text-xl"></i><p class="text-white/30 text-xs mt-3">Loading profile...</p></div>');

  const u = await api('/api/auth/me');
  if(u.error) { closeModal(); showToast('Failed to load profile', 'error'); return; }

  const loginTime = u.lastLogin ? new Date(u.lastLogin).toLocaleString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) : 'Never';
  const memberSince = u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}) : 'Unknown';
  const tokenExpiry = state.tokenExpiresAt ? new Date(state.tokenExpiresAt).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}) : '--';

  var html =
    '<div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold text-white"><i class="fas fa-user-circle mr-2 text-[#00A86B]"></i>My Profile</h3><button onclick="closeModal()" class="text-white/40 hover:text-white"><i class="fas fa-times"></i></button></div>' +

    // Profile tabs
    '<div class="flex gap-1 mb-4 bg-white/5 rounded-xl p-1"><button class="profile-tab active flex-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition" onclick="showProfileTab(&apos;overview&apos;,this)">Overview</button><button class="profile-tab flex-1 px-3 py-1.5 rounded-lg text-[11px] text-white/40 transition" onclick="showProfileTab(&apos;edit&apos;,this)">Edit Profile</button><button class="profile-tab flex-1 px-3 py-1.5 rounded-lg text-[11px] text-white/40 transition" onclick="showProfileTab(&apos;security&apos;,this)">Security</button><button class="profile-tab flex-1 px-3 py-1.5 rounded-lg text-[11px] text-white/40 transition" onclick="showProfileTab(&apos;activity&apos;,this)">Activity</button></div>' +
    '<div id="profileTabContent">' +

    // Overview tab
    '<div id="profileOverview">' +
    '<div class="flex items-center gap-4 mb-4 p-4 rounded-xl bg-white/5 border border-white/10"><div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00A86B] to-[#006241] flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-2 ring-[#00A86B]/20">' + (u.avatar||'?') + '</div><div class="flex-1"><p class="text-base font-semibold text-white">' + (u.name||'') + '</p><p class="text-xs text-white/40">' + (u.fullRole||u.role) + ' &bull; Tier ' + u.tier + '</p><p class="text-[10px] text-white/30 mt-1">' + (u.institution||'') + '</p><div class="flex items-center gap-2 mt-1.5"><span class="px-2 py-0.5 rounded-full bg-[#00A86B]/15 text-[9px] text-[#00A86B] font-semibold"><i class="fas fa-circle text-[5px] mr-1"></i>Online</span><span class="px-2 py-0.5 rounded-full bg-white/8 text-[9px] text-white/40"><i class="fas fa-clock mr-1"></i>Expires: ' + tokenExpiry + '</span></div></div></div>' +

    '<div class="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">' +
    '<div class="p-3 rounded-xl bg-white/5 border border-white/8"><p class="text-[9px] text-white/30 uppercase mb-1">Total Logins</p><p class="text-sm font-bold text-white">' + (u.totalLogins||0) + '</p></div>' +
    '<div class="p-3 rounded-xl bg-white/5 border border-white/8"><p class="text-[9px] text-white/30 uppercase mb-1">Today Sessions</p><p class="text-sm font-bold text-white">' + (u.sessionsToday||0) + '</p></div>' +
    '<div class="p-3 rounded-xl bg-white/5 border border-white/8"><p class="text-[9px] text-white/30 uppercase mb-1">Member Since</p><p class="text-[10px] font-bold text-white">' + memberSince + '</p></div>' +
    '<div class="p-3 rounded-xl bg-white/5 border border-white/8"><p class="text-[9px] text-white/30 uppercase mb-1">Last Login</p><p class="text-[10px] font-bold text-white">' + loginTime + '</p></div>' +
    '</div>' +

    '<div class="p-3 rounded-xl bg-white/5 border border-white/8 mb-3"><p class="text-[9px] text-white/30 uppercase mb-2">Contact</p><p class="text-xs text-white/70"><i class="fas fa-envelope mr-2 text-white/30"></i>' + (u.email||'Not set') + '</p><p class="text-xs text-white/70 mt-1"><i class="fas fa-user mr-2 text-white/30"></i>@' + (u.username||'') + '</p></div>' +

    '<div class="p-3 rounded-xl bg-white/5 border border-white/8"><p class="text-[9px] text-white/30 uppercase mb-2">Permissions</p><div class="flex flex-wrap gap-1.5">' +
    ['Dashboard','Surveillance','Threats','Genomics','EWS','Alerts','Reports',u.role==='Admin'?'Admin':null].filter(Boolean).map(function(p) { return '<span class="px-2 py-0.5 rounded-full bg-[#00A86B]/10 text-[9px] text-[#00A86B] font-medium">' + p + '</span>'; }).join('') +
    '</div></div>' +

    (u.recentIps && u.recentIps.length > 0 ? '<div class="p-3 rounded-xl bg-white/5 border border-white/8 mt-3"><p class="text-[9px] text-white/30 uppercase mb-2">Recent IPs</p><div class="flex flex-wrap gap-1.5">' + u.recentIps.map(function(ip) { return '<span class="px-2 py-0.5 rounded-full bg-white/8 text-[9px] text-white/40 font-mono">' + ip + '</span>'; }).join('') + '</div></div>' : '') +
    '</div>' +

    // Edit tab (hidden)
    '<div id="profileEdit" class="hidden">' +
    '<div class="space-y-3">' +
    '<div><label class="text-[10px] text-white/40 uppercase font-semibold block mb-1">Full Name</label><input id="profName" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#00A86B]" value="' + (u.name||'') + '"></div>' +
    '<div><label class="text-[10px] text-white/40 uppercase font-semibold block mb-1">Email</label><input id="profEmail" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#00A86B]" value="' + (u.email||'') + '"></div>' +
    '<div><label class="text-[10px] text-white/40 uppercase font-semibold block mb-1">Avatar (initials)</label><input id="profAvatar" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#00A86B]" value="' + (u.avatar||'') + '" maxlength="3"></div>' +
    '<button onclick="saveProfile()" class="w-full py-2 bg-[#00A86B] hover:bg-[#008F5B] text-white text-xs font-semibold rounded-xl transition"><i class="fas fa-save mr-1.5"></i>Save Changes</button>' +
    '<p id="profMsg" class="text-[10px] text-center hidden"></p></div>' +
    '</div>' +

    // Security tab (hidden)
    '<div id="profileSecurity" class="hidden">' +
    // 2FA Section
    '<div class="p-3 rounded-xl bg-white/5 border border-white/8 mb-4">' +
    '<div class="flex items-center justify-between mb-2"><p class="text-[9px] text-white/30 uppercase">Two-Factor Authentication</p>' +
    '<span id="tfa-badge" class="px-2 py-0.5 text-[9px] font-semibold rounded-full ' +
    (u.twoFactor && u.twoFactor.enabled ? 'bg-[#00A86B]/20 text-[#00A86B]">Enabled' : 'bg-white/10 text-white/40">Disabled') + '</span></div>' +
    '<p class="text-[10px] text-white/40 mb-3">Protect your account with an authenticator app (Google Authenticator, Authy, 1Password).</p>' +
    (u.twoFactor && u.twoFactor.enabled ?
      '<div class="space-y-2">' +
      '<div class="flex justify-between text-xs"><span class="text-white/40">Recovery Codes Left</span><span class="text-white/70 font-mono">' + (u.twoFactor.recoveryCodesRemaining || 0) + ' / 8</span></div>' +
      '<button onclick="disable2FAModal()" class="w-full py-2 bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold rounded-xl transition"><i class="fas fa-shield-xmark mr-1.5"></i>Disable 2FA</button>' +
      '</div>'
    :
      '<button onclick="setup2FA()" class="w-full py-2 bg-[#00A86B] hover:bg-[#008F5B] text-white text-xs font-semibold rounded-xl transition"><i class="fas fa-shield-halved mr-1.5"></i>Enable 2FA</button>'
    ) +
    '</div>' +
    // Session info
    '<div class="p-3 rounded-xl bg-white/5 border border-white/8 mb-4"><p class="text-[9px] text-white/30 uppercase mb-2">Session Info</p>' +
    '<div class="space-y-1.5"><div class="flex justify-between text-xs"><span class="text-white/40">Token Expires</span><span class="text-white/70">' + tokenExpiry + '</span></div><div class="flex justify-between text-xs"><span class="text-white/40">Auth Method</span><span class="text-white/70">PBKDF2-SHA256 + JWT</span></div><div class="flex justify-between text-xs"><span class="text-white/40">Encryption</span><span class="text-white/70">HMAC-SHA256</span></div></div></div>' +
    '<div class="space-y-3">' +
    '<p class="text-[10px] text-white/40 uppercase font-semibold">Change Password</p>' +
    '<input id="profCurPwd" type="password" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#00A86B]" placeholder="Current password">' +
    '<input id="profNewPwd" type="password" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#00A86B]" placeholder="New password (min 6 chars)">' +
    '<input id="profConfPwd" type="password" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#00A86B]" placeholder="Confirm new password">' +
    '<button onclick="changeMyPassword()" class="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition"><i class="fas fa-key mr-1.5"></i>Update Password</button>' +
    '<p id="pwdMsg" class="text-[10px] text-center hidden"></p></div>' +
    '</div>' +

    // Activity tab (hidden)
    '<div id="profileActivity" class="hidden">' +
    '<div class="space-y-1.5">' +
    ((u.recentActivity||[]).length > 0 ? (u.recentActivity||[]).map(function(a) {
      var icon = a.action.includes('Login') ? 'fa-sign-in-alt text-blue-400' : a.action.includes('Create') ? 'fa-plus text-[#00A86B]' : a.action.includes('Update')||a.action.includes('Changed') ? 'fa-edit text-amber-400' : a.action.includes('Delete') ? 'fa-trash text-red-400' : 'fa-circle text-white/20';
      return '<div class="flex items-start gap-3 p-2.5 rounded-lg bg-white/5 hover:bg-white/8 transition"><div class="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0"><i class="fas '+icon+' text-[10px]"></i></div><div class="flex-1 min-w-0"><div class="flex items-center gap-2"><span class="text-[11px] font-medium text-white/80">' + a.action + '</span><span class="text-[9px] text-white/25 font-mono">' + (a.ip||'') + '</span></div><p class="text-[10px] text-white/40 truncate">' + (a.details||'') + '</p><p class="text-[9px] text-white/20 mt-0.5">' + (a.timestamp||'') + '</p></div></div>';
    }).join('') : '<p class="text-xs text-white/30 text-center py-6">No recent activity</p>') +
    '</div></div></div>';

  document.querySelector('.modal-content').innerHTML = html;
};

window.showProfileTab = function(tab, btn) {
  document.querySelectorAll('.profile-tab').forEach(function(b) { b.classList.remove('active'); b.classList.add('text-white/40'); });
  btn.classList.add('active'); btn.classList.remove('text-white/40');
  ['profileOverview','profileEdit','profileSecurity','profileActivity'].forEach(function(id) { var e = document.getElementById(id); if(e) e.classList.add('hidden'); });
  var target = document.getElementById('profile' + tab.charAt(0).toUpperCase() + tab.slice(1));
  if(target) target.classList.remove('hidden');
};

window.saveProfile = async function() {
  var name = document.getElementById('profName').value.trim();
  var email = document.getElementById('profEmail').value.trim();
  var avatar = document.getElementById('profAvatar').value.trim();
  var msg = document.getElementById('profMsg');
  if(!name) { msg.textContent = 'Name is required'; msg.className = 'text-[10px] text-center text-red-400'; msg.classList.remove('hidden'); return; }
  var res = await api('/api/auth/profile', { method:'PUT', body:JSON.stringify({name:name,email:email,avatar:avatar||undefined}) });
  if(res.success) {
    state.user = Object.assign(state.user, res.user);
    localStorage.setItem('bior_auth', JSON.stringify({user:state.user,token:state.token}));
    msg.textContent = 'Profile saved!'; msg.className = 'text-[10px] text-center text-[#00A86B]'; msg.classList.remove('hidden');
    showToast('Profile updated', 'success');
  } else {
    msg.textContent = res.error || 'Failed to save'; msg.className = 'text-[10px] text-center text-red-400'; msg.classList.remove('hidden');
  }
};

window.changeMyPassword = async function() {
  var cur = document.getElementById('profCurPwd').value;
  var newP = document.getElementById('profNewPwd').value;
  var conf = document.getElementById('profConfPwd').value;
  var msg = document.getElementById('pwdMsg');
  if(!cur || !newP) { msg.textContent = 'All fields required'; msg.className = 'text-[10px] text-center text-red-400'; msg.classList.remove('hidden'); return; }
  if(newP.length < 6) { msg.textContent = 'Min 6 characters'; msg.className = 'text-[10px] text-center text-red-400'; msg.classList.remove('hidden'); return; }
  if(newP !== conf) { msg.textContent = 'Passwords do not match'; msg.className = 'text-[10px] text-center text-red-400'; msg.classList.remove('hidden'); return; }
  var res = await api('/api/auth/change-password', { method:'POST', body:JSON.stringify({currentPassword:cur,newPassword:newP}) });
  if(res.success) {
    msg.textContent = 'Password updated!'; msg.className = 'text-[10px] text-center text-[#00A86B]'; msg.classList.remove('hidden');
    document.getElementById('profCurPwd').value = '';
    document.getElementById('profNewPwd').value = '';
    document.getElementById('profConfPwd').value = '';
    showToast('Password changed', 'success');
  } else {
    msg.textContent = res.error || 'Failed'; msg.className = 'text-[10px] text-center text-red-400'; msg.classList.remove('hidden');
  }
};

// ===== 2FA SETUP & MANAGEMENT =====
window.setup2FA = async function() {
  showModal('<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-white/30 text-xl"></i><p class="text-white/30 text-xs mt-3">Setting up 2FA...</p></div>');

  var res = await api('/api/auth/2fa/setup', { method: 'POST', body: '{}' });
  if (res.error) { closeModal(); showToast(res.error, 'error'); return; }

  var html =
    '<div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold text-white"><i class="fas fa-shield-halved mr-2 text-[#00A86B]"></i>Enable 2FA</h3><button onclick="closeModal()" class="text-white/40 hover:text-white"><i class="fas fa-times"></i></button></div>' +

    // Step 1: QR Code
    '<div id="setup2faStep1">' +
    '<div class="p-3 rounded-xl bg-white/5 border border-white/8 mb-4">' +
    '<p class="text-[10px] text-white/50 mb-3">Scan this QR code with your authenticator app:</p>' +
    '<div class="flex justify-center mb-3"><div id="qrcode2fa" style="background:#fff;padding:12px;border-radius:12px;display:inline-block"></div></div>' +
    '<div class="text-center mb-3"><p class="text-[9px] text-white/30 mb-1">Or enter this key manually:</p><code class="text-xs text-[#00A86B] font-mono bg-black/30 px-3 py-1.5 rounded-lg select-all cursor-pointer" onclick="navigator.clipboard.writeText(this.textContent)" title="Click to copy">' + res.secret + '</code></div></div>' +

    '<div class="p-3 rounded-xl bg-white/5 border border-white/8 mb-4">' +
    '<p class="text-[10px] text-white/50 mb-2">Enter the 6-digit code from your app to verify:</p>' +
    '<input id="setup2faCode" type="text" maxlength="6" class="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-center text-xl font-mono font-bold tracking-[8px] outline-none focus:border-[#00A86B] mb-3" placeholder="000000" autocomplete="one-time-code">' +
    '<button onclick="verify2FASetup()" id="verify2faBtn" class="w-full py-2.5 bg-[#00A86B] hover:bg-[#008F5B] text-white text-xs font-semibold rounded-xl transition"><i class="fas fa-check-circle mr-1.5"></i>Verify &amp; Enable</button>' +
    '<p id="setup2faMsg" class="text-[10px] text-center mt-2 hidden"></p></div>' +

    // Recovery codes (hidden until verified)
    '<div id="setup2faStep2" class="hidden">' +
    '<div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">' +
    '<div class="flex items-center gap-2 mb-2"><i class="fas fa-exclamation-triangle text-amber-400 text-xs"></i><p class="text-[10px] text-amber-400 font-semibold uppercase">Save Your Recovery Codes</p></div>' +
    '<p class="text-[10px] text-white/50 mb-3">Store these codes safely. Each can only be used once. You will need them if you lose access to your authenticator app.</p>' +
    '<div class="grid grid-cols-2 gap-1.5 mb-3">' +
    (res.recoveryCodes || []).map(function(c) { return '<div class="px-2.5 py-1.5 bg-black/30 rounded-lg text-center"><code class="text-xs text-white/80 font-mono">' + c + '</code></div>'; }).join('') +
    '</div>' +
    '<div class="flex gap-2">' +
    '<button onclick="copy2FACodes()" class="flex-1 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl transition"><i class="fas fa-copy mr-1.5"></i>Copy Codes</button>' +
    '<button onclick="closeModal();showUserProfile()" class="flex-1 py-2 bg-[#00A86B] hover:bg-[#008F5B] text-white text-xs font-semibold rounded-xl transition"><i class="fas fa-check mr-1.5"></i>Done</button>' +
    '</div></div></div>' +
    '</div>';

  document.querySelector('.modal-content').innerHTML = html;

  // Store recovery codes in a variable for copy function
  window._2faRecoveryCodes = res.recoveryCodes || [];

  // Render QR code using lightweight JS library (load from CDN)
  var qrDiv = document.getElementById('qrcode2fa');
  if (qrDiv) {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js';
    script.onload = function() {
      var qr = qrcode(0, 'M');
      qr.addData(res.otpauthUri);
      qr.make();
      qrDiv.innerHTML = qr.createSvgTag(4, 0);
    };
    document.head.appendChild(script);
  }

  // Auto-submit on 6 digits
  var codeInput = document.getElementById('setup2faCode');
  if (codeInput) {
    codeInput.addEventListener('input', function() {
      this.value = this.value.replace(/[^0-9]/g, '');
      if (this.value.length === 6) setTimeout(function() { verify2FASetup(); }, 100);
    });
    setTimeout(function() { codeInput.focus(); }, 200);
  }
};

window.verify2FASetup = async function() {
  var code = (document.getElementById('setup2faCode') || {}).value;
  var msg = document.getElementById('setup2faMsg');
  if (!code || code.length !== 6) {
    if (msg) { msg.textContent = 'Enter a valid 6-digit code'; msg.className = 'text-[10px] text-center text-red-400'; msg.classList.remove('hidden'); }
    return;
  }
  var btn = document.getElementById('verify2faBtn');
  if (btn) btn.disabled = true;

  var res = await api('/api/auth/2fa/verify-setup', { method: 'POST', body: JSON.stringify({ code: code.trim() }) });
  if (btn) btn.disabled = false;

  if (res.error) {
    if (msg) { msg.textContent = res.error; msg.className = 'text-[10px] text-center text-red-400'; msg.classList.remove('hidden'); }
    var el = document.getElementById('setup2faCode');
    if (el) { el.value = ''; el.focus(); }
    return;
  }

  // Success — show recovery codes
  var step1 = document.getElementById('setup2faStep1');
  var step2 = document.getElementById('setup2faStep2');
  if (step1) step1.classList.add('hidden');
  if (step2) step2.classList.remove('hidden');
  showToast('2FA Enabled! Save your recovery codes.', 'success');
};

window.copy2FACodes = function() {
  var codes = window._2faRecoveryCodes || [];
  navigator.clipboard.writeText(codes.join(String.fromCharCode(10))).then(function() {
    showToast('Recovery codes copied to clipboard', 'success');
  });
};

window.disable2FAModal = function() {
  showModal(
    '<div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold text-white"><i class="fas fa-shield-xmark mr-2 text-red-400"></i>Disable 2FA</h3><button onclick="closeModal()" class="text-white/40 hover:text-white"><i class="fas fa-times"></i></button></div>' +
    '<div class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">' +
    '<p class="text-[10px] text-red-300 mb-1"><i class="fas fa-exclamation-triangle mr-1"></i>Warning: Disabling 2FA reduces your account security.</p>' +
    '<p class="text-[10px] text-white/40">Enter your current authenticator code or password to confirm.</p></div>' +
    '<div class="space-y-3">' +
    '<input id="disable2faCode" type="text" maxlength="6" class="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-center text-lg font-mono font-bold tracking-[6px] outline-none focus:border-red-400" placeholder="6-digit code">' +
    '<div class="flex items-center gap-2"><div class="flex-1 h-px bg-white/10"></div><span class="text-[9px] text-white/20 uppercase">or</span><div class="flex-1 h-px bg-white/10"></div></div>' +
    '<input id="disable2faPwd" type="password" class="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-red-400" placeholder="Your password">' +
    '<button onclick="confirmDisable2FA()" class="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition"><i class="fas fa-shield-xmark mr-1.5"></i>Disable 2FA</button>' +
    '<p id="disable2faMsg" class="text-[10px] text-center hidden"></p></div>'
  );
  setTimeout(function() { var el = document.getElementById('disable2faCode'); if(el) el.focus(); }, 200);
};

window.confirmDisable2FA = async function() {
  var code = (document.getElementById('disable2faCode') || {}).value;
  var pwd = (document.getElementById('disable2faPwd') || {}).value;
  var msg = document.getElementById('disable2faMsg');

  if (!code && !pwd) {
    if (msg) { msg.textContent = 'Enter a code or password'; msg.className = 'text-[10px] text-center text-red-400'; msg.classList.remove('hidden'); }
    return;
  }

  var body = {};
  if (code && code.length === 6) body.code = code.trim();
  else if (pwd) body.password = pwd;
  else {
    if (msg) { msg.textContent = 'Enter a valid 6-digit code or password'; msg.className = 'text-[10px] text-center text-red-400'; msg.classList.remove('hidden'); }
    return;
  }

  var res = await api('/api/auth/2fa/disable', { method: 'POST', body: JSON.stringify(body) });
  if (res.error) {
    if (msg) { msg.textContent = res.error; msg.className = 'text-[10px] text-center text-red-400'; msg.classList.remove('hidden'); }
    return;
  }

  closeModal();
  showToast('2FA has been disabled', 'success');
  showUserProfile(); // Refresh profile
};

// ===== USER MENU =====
window.toggleUserMenu = function() {
  const menu = document.getElementById('userMenu');
  if(menu) menu.classList.toggle('hidden');
};
document.addEventListener('click', function(e) {
  const menu = document.getElementById('userMenu');
  const wrap = document.querySelector('.sidebar-user-wrap');
  if(menu && wrap && !wrap.contains(e.target)) menu.classList.add('hidden');
});

// ===== MOBILE SIDEBAR TOGGLE =====
window.toggleMobileSidebar = function() {
  const sidebar = document.getElementById('mainSidebar');
  if (!sidebar) return;
  const isOpen = sidebar.classList.contains('mobile-open');
  if (isOpen) {
    sidebar.classList.remove('mobile-open');
    const overlay = document.getElementById('mobileSidebarOverlay');
    if (overlay) overlay.remove();
  } else {
    sidebar.classList.add('mobile-open');
    sidebar.classList.remove('collapsed');
    sidebar.style.width = '';
    const overlay = document.createElement('div');
    overlay.id = 'mobileSidebarOverlay';
    overlay.className = 'mobile-sidebar-overlay';
    overlay.onclick = function() { window.toggleMobileSidebar(); };
    document.body.appendChild(overlay);
  }
};

// ===== HEADER SEARCH =====
let searchTimer = null;
let searchOpen = false;

window.handleSearch = function() {
  const q = document.getElementById('headerSearch')?.value?.trim();
  if (!q) { closeSearchResults(); return; }
  clearTimeout(searchTimer);
  searchTimer = setTimeout(function() { doGlobalSearch(q); }, 250);
};

window.handleSearchKeydown = function(e) {
  if (e.key === 'Enter') { e.preventDefault(); doGlobalSearch(document.getElementById('headerSearch')?.value?.trim()); }
  else if (e.key === 'Escape') { closeSearchResults(); }
  else { handleSearch(); }
};

async function doGlobalSearch(q) {
  if (!q || q.length < 2) { closeSearchResults(); return; }
  const wrap = document.getElementById('searchResultsWrap');
  if (!wrap) createSearchDropdown();
  const results = document.getElementById('searchResults');
  if (results) results.innerHTML = '<div class="px-4 py-3 text-center"><i class="fas fa-spinner fa-spin text-white/20"></i></div>';
  showSearchDropdown();
  try {
    const data = await api('/api/search?q=' + encodeURIComponent(q));
    if (!data.results || data.results.length === 0) {
      results.innerHTML = '<div class="px-4 py-4 text-center"><i class="fas fa-search text-white/10 text-lg mb-1"></i><p class="text-[10px] text-white/30">No results for &quot;' + q + '&quot;</p></div>';
      return;
    }
    const typeLabel = {surveillance:'Surveillance',threat:'Threat',genomic:'Genomic',dataset:'Dataset',alert:'Alert',page:'Page'};
    const typeColor = {surveillance:'text-emerald-400',threat:'text-red-400',genomic:'text-blue-400',dataset:'text-purple-400',alert:'text-amber-400',page:'text-white/60'};
    results.innerHTML = data.results.map(function(r) {
      return '<div class="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-white/5 transition" onclick="searchResultClick(&apos;'+r.action+'&apos;,&apos;'+r.id+'&apos;)"><div class="w-7 h-7 rounded-lg bg-white/6 flex items-center justify-center shrink-0"><i class="fas '+r.icon+' text-[10px] '+(typeColor[r.type]||'text-white/40')+'"></i></div><div class="flex-1 min-w-0"><p class="text-xs font-medium text-white/85 truncate">'+r.title+'</p><p class="text-[9px] text-white/35 truncate">'+r.subtitle+'</p></div><span class="text-[8px] px-1.5 py-0.5 rounded bg-white/5 '+(typeColor[r.type]||'text-white/30')+' font-medium uppercase">'+(typeLabel[r.type]||r.type)+'</span></div>';
    }).join('');
  } catch(e) {
    results.innerHTML = '<div class="px-4 py-3 text-center text-[10px] text-red-400">Search error</div>';
  }
}

function createSearchDropdown() {
  const wrap = document.querySelector('.header-search-wrap');
  if (!wrap) return;
  const dd = document.createElement('div');
  dd.id = 'searchResultsWrap';
  var lt = isLightTheme();
  dd.style.cssText = 'position:absolute;top:100%;left:0;right:0;margin-top:6px;background:'+(lt?'rgba(255,255,255,0.98)':'rgba(15,23,42,0.98)')+';backdrop-filter:blur(16px);border:1px solid '+(lt?'rgba(0,0,0,0.1)':'rgba(255,255,255,0.1)')+';border-radius:12px;z-index:60;box-shadow:0 12px 40px '+(lt?'rgba(0,0,0,0.15)':'rgba(0,0,0,0.5)')+';display:none;max-height:360px;overflow-y:auto;min-width:340px';
  dd.innerHTML = '<div id="searchResults"></div>';
  wrap.appendChild(dd);
  // Close on outside click
  document.addEventListener('click', function(e) {
    if (!wrap.contains(e.target)) closeSearchResults();
  });
}

function showSearchDropdown() {
  const dd = document.getElementById('searchResultsWrap');
  if (dd) { dd.style.display = 'block'; searchOpen = true; }
}

function closeSearchResults() {
  const dd = document.getElementById('searchResultsWrap');
  if (dd) { dd.style.display = 'none'; searchOpen = false; }
}

window.searchResultClick = function(action, id) {
  closeSearchResults();
  document.getElementById('headerSearch').value = '';
  if (action === 'dataset') {
    state.currentView = 'dataset-explorer';
    state.currentDataset = id;
    pushSpaState();
    render();
  } else {
    navigate(action);
  }
  showToast('Navigated to result', 'info');
};

// ===== NOTIFICATIONS PANEL =====
window.loadNotifCount = async function() {
  try {
    const data = await api('/api/notifications?limit=1');
    const badge = document.querySelector('.notif-count');
    if (badge) {
      if (data.unread > 0) { badge.textContent = data.unread > 9 ? '9+' : data.unread; badge.style.display = ''; }
      else { badge.style.display = 'none'; }
    }
  } catch(e) {}
};

window.showNotifications = async function() {
  var isAdmin = state.user && state.user.role === 'Admin';
  showModal(
    '<div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold text-white"><i class="fas fa-bell mr-2 text-amber-400"></i>Notifications</h3><div class="flex items-center gap-2">' + (isAdmin ? '<button onclick="showCreateNotification()" class="text-[10px] text-amber-400 hover:text-amber-300 font-medium px-2 py-1 rounded-lg hover:bg-white/5 transition"><i class="fas fa-plus mr-1"></i>Create</button>' : '') + '<button onclick="markAllNotifRead()" class="text-[10px] text-[#00A86B] hover:text-[#00c77b] font-medium px-2 py-1 rounded-lg hover:bg-white/5 transition">Mark all read</button><button onclick="closeModal()" class="text-white/40 hover:text-white"><i class="fas fa-times"></i></button></div></div>' +
    '<div id="notifList" class="space-y-2 max-h-[60vh] overflow-y-auto"><div class="text-center py-6"><i class="fas fa-spinner fa-spin text-white/20"></i></div></div>' +
    '<div class="mt-4 pt-3 border-t border-white/8 text-center"><button onclick="navigate(&apos;alerts&apos;);closeModal()" class="text-xs text-[#00A86B] hover:text-[#00c77b] font-medium">View All Alerts <i class="fas fa-arrow-right ml-1"></i></button></div>'
  );
  try {
    const data = await api('/api/notifications?limit=20');
    const list = document.getElementById('notifList');
    if (!list) return;
    if (!data.notifications || data.notifications.length === 0) {
      list.innerHTML = '<div class="text-center py-6"><i class="fas fa-bell-slash text-white/10 text-2xl mb-2"></i><p class="text-xs text-white/30">No notifications yet</p></div>';
      return;
    }
    const typeCfg = {
      alert: {bg:'bg-red-900/10',border:'border-red-800/30',icon_bg:'bg-red-900/50',icon_c:'text-red-400'},
      warning: {bg:'bg-amber-900/10',border:'border-amber-800/30',icon_bg:'bg-amber-900/50',icon_c:'text-amber-400'},
      success: {bg:'bg-emerald-900/10',border:'border-white/10',icon_bg:'bg-emerald-900/50',icon_c:'text-emerald-400'},
      system: {bg:'bg-purple-900/10',border:'border-white/10',icon_bg:'bg-purple-900/50',icon_c:'text-purple-400'},
      info: {bg:'bg-white/5',border:'border-white/10',icon_bg:'bg-blue-900/50',icon_c:'text-blue-400'}
    };
    list.innerHTML = data.notifications.map(function(n) {
      const cfg = typeCfg[n.type] || typeCfg.info;
      const ago = timeAgo(n.created_at);
      const unread = !n.is_read ? ' border-l-[3px] border-l-[#00A86B]' : '';
      return '<div class="flex items-start gap-3 p-3 rounded-xl ' + cfg.bg + ' border ' + cfg.border + unread + ' hover:bg-white/8 transition cursor-pointer" onclick="markNotifRead(&apos;' + n.id + '&apos;)">' +
        '<div class="w-8 h-8 rounded-lg ' + cfg.icon_bg + ' ' + cfg.icon_c + ' flex items-center justify-center shrink-0"><i class="fas ' + (n.icon||'fa-bell') + ' text-xs"></i></div>' +
        '<div class="flex-1 min-w-0"><p class="text-[11px] font-medium text-white/85 leading-tight">' + n.title + '</p><p class="text-[10px] text-white/50 mt-0.5 leading-relaxed">' + n.message + '</p><p class="text-[9px] text-white/30 mt-1">' + ago + '</p></div>' +
        (!n.is_read ? '<span class="w-2 h-2 rounded-full bg-[#00A86B] shrink-0 mt-1"></span>' : '') +
      '</div>';
    }).join('');
  } catch(e) {
    const el = document.getElementById('notifList');
    if (el) el.innerHTML = '<div class="text-center py-4"><p class="text-xs text-red-400">Failed to load notifications</p></div>';
  }
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff/60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return mins + 'm ago';
  const hrs = Math.floor(mins/60);
  if (hrs < 24) return hrs + 'h ago';
  const days = Math.floor(hrs/24);
  return days + 'd ago';
}

window.markNotifRead = async function(id) {
  try {
    await api('/api/notifications/' + id + '/read', { method: 'PATCH' });
    loadNotifCount();
  } catch(e) {}
};

window.markAllNotifRead = async function() {
  try {
    await api('/api/notifications/read-all', { method: 'PATCH' });
    showToast('All notifications marked as read', 'success');
    loadNotifCount();
    showNotifications();
  } catch(e) { showToast('Failed to mark notifications', 'error'); }
};

window.showCreateNotification = function() {
  showModal(
    '<div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold text-white"><i class="fas fa-bullhorn mr-2 text-amber-400"></i>Broadcast Notification</h3><button onclick="closeModal()" class="text-white/40 hover:text-white"><i class="fas fa-times"></i></button></div>' +
    '<div class="space-y-3">' +
    '<div><label class="text-[10px] text-white/40 uppercase font-semibold block mb-1">Type</label><select id="cnType" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#00A86B]"><option value="info">Info</option><option value="success">Success</option><option value="warning">Warning</option><option value="alert">Alert</option><option value="system">System</option></select></div>' +
    '<div><label class="text-[10px] text-white/40 uppercase font-semibold block mb-1">Icon (FontAwesome class)</label><input id="cnIcon" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#00A86B]" value="fa-bell" placeholder="fa-bell, fa-exclamation-triangle..."></div>' +
    '<div><label class="text-[10px] text-white/40 uppercase font-semibold block mb-1">Title *</label><input id="cnTitle" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#00A86B]" placeholder="Notification title"></div>' +
    '<div><label class="text-[10px] text-white/40 uppercase font-semibold block mb-1">Message *</label><textarea id="cnMessage" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-[#00A86B]" rows="3" placeholder="Notification message body"></textarea></div>' +
    '<button onclick="submitNotification()" class="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition"><i class="fas fa-paper-plane mr-1.5"></i>Send to All Users</button>' +
    '<p id="cnMsg" class="text-[10px] text-center hidden"></p></div>'
  );
};

window.submitNotification = async function() {
  var title = (document.getElementById('cnTitle')||{}).value;
  var message = (document.getElementById('cnMessage')||{}).value;
  var type = (document.getElementById('cnType')||{}).value || 'info';
  var icon = (document.getElementById('cnIcon')||{}).value || 'fa-bell';
  var msg = document.getElementById('cnMsg');
  if(!title || !message) { msg.textContent='Title and message required'; msg.className='text-[10px] text-center text-red-400'; msg.classList.remove('hidden'); return; }
  var res = await api('/api/notifications', { method:'POST', body:JSON.stringify({title:title,message:message,type:type,icon:icon}) });
  if(res.success || res.id) {
    showToast('Notification sent to all users', 'success');
    loadNotifCount();
    closeModal();
  } else {
    msg.textContent = res.error || 'Failed to create'; msg.className='text-[10px] text-center text-red-400'; msg.classList.remove('hidden');
  }
};

// ===== SSE REAL-TIME NOTIFICATIONS (Issue #1) =====
// Primary: EventSource stream  |  Fallback: 30s polling
// =================================================

window.startSSE = function() {
  if (!state.isAuthenticated || !state.token) return;
  if (state.sseSource) return; // already connected

  try {
    var url = API + '/api/notifications/stream?token=' + encodeURIComponent(state.token);
    var es = new EventSource(url);
    state.sseSource = es;
    state.sseRetryCount = 0;

    es.onopen = function() {
      state.sseConnected = true;
      state.sseRetryCount = 0;
      updateConnStatus();
      // SSE connected — slow down polling to 120s heartbeat check
      if (state.notifPollTimer) clearInterval(state.notifPollTimer);
      state.notifPollTimer = setInterval(pollNotifications, 120000);
      console.log('[SSE] Connected');
    };

    // Typed event: alert (alert review, bulk review)
    es.addEventListener('alert', function(e) {
      try {
        var d = JSON.parse(e.data);
        var action = d.action || '';
        if (action.indexOf('bulk') === 0) {
          showToast('Alerts bulk ' + action.replace('bulk_','') + 'ed (' + d.count + ')', 'info');
        } else {
          showToast('Alert ' + (d.alertId||'') + ' ' + (d.status||action), d.status === 'escalated' ? 'warning' : 'info');
        }
        loadNotifCount();
        // Auto-refresh if on alerts page
        if (state.currentPage === 'alerts') render();
      } catch(err) {}
    });

    // Typed event: surveillance (threat/site created)
    es.addEventListener('surveillance', function(e) {
      try {
        var d = JSON.parse(e.data);
        showToast((d.action === 'threat_created' ? 'New threat: ' : 'New site: ') + (d.name||''), 'info');
        loadNotifCount();
        if (state.currentPage === 'threats' || state.currentPage === 'surveillance') render();
      } catch(err) {}
    });

    // Typed event: notification (admin broadcast)
    es.addEventListener('notification', function(e) {
      try {
        var d = JSON.parse(e.data);
        var toastType = d.type === 'alert' ? 'error' : d.type === 'warning' ? 'warning' : 'info';
        showToast(d.title + ': ' + (d.message||'').substring(0,80), toastType);
        loadNotifCount();
        // Pulse the bell
        var bellBtn = document.querySelector('.notif-btn');
        if (bellBtn) { bellBtn.classList.add('notif-pulse'); setTimeout(function(){ bellBtn.classList.remove('notif-pulse'); }, 3000); }
      } catch(err) {}
    });

    // Typed event: ews_update
    es.addEventListener('ews_update', function(e) {
      try {
        var d = JSON.parse(e.data);
        showToast('EWS score updated' + (d.region ? ': ' + d.region : ''), 'warning');
        loadNotifCount();
        if (state.currentPage === 'ews' || state.currentPage === 'dashboard') render();
      } catch(err) {}
    });

    // Typed event: system (report generated, etc.)
    es.addEventListener('system', function(e) {
      try {
        var d = JSON.parse(e.data);
        if (d.action === 'report_generated') {
          showToast('Report generated: ' + (d.type||'weekly_bulletin'), 'success');
          if (state.currentPage === 'reports') render();
        } else if (d.type === 'connected') {
          // Connection acknowledgement
        } else {
          showToast(d.action || 'System event', 'info');
        }
        loadNotifCount();
      } catch(err) {}
    });

    es.onerror = function() {
      state.sseConnected = false;
      state.sseRetryCount++;
      updateConnStatus();
      console.log('[SSE] Error, retry #' + state.sseRetryCount);

      // Close failed connection
      if (state.sseSource) {
        state.sseSource.close();
        state.sseSource = null;
      }

      // Exponential backoff reconnect (max 5 retries, then fall back to polling only)
      if (state.sseRetryCount <= state.sseMaxRetry && state.isAuthenticated) {
        var delay = Math.min(30000, 1000 * Math.pow(2, state.sseRetryCount));
        setTimeout(function() {
          if (state.isAuthenticated) startSSE();
        }, delay);
      } else {
        console.log('[SSE] Max retries reached — falling back to polling');
        // Resume 30s polling
        if (state.notifPollTimer) clearInterval(state.notifPollTimer);
        state.notifPollTimer = setInterval(pollNotifications, state.notifPollInterval);
      }
    };
  } catch(err) {
    console.log('[SSE] Failed to create EventSource:', err);
    // Fallback to polling
    startNotifPolling();
  }
};

window.stopSSE = function() {
  if (state.sseSource) {
    state.sseSource.close();
    state.sseSource = null;
  }
  state.sseConnected = false;
  state.sseRetryCount = 0;
  updateConnStatus();
};

// Update header connection indicator
function updateConnStatus() {
  var el = document.getElementById('connLabel');
  var wrap = document.getElementById('connStatus');
  if (!el || !wrap) return;
  var dot = wrap.querySelector('.pulse-dot');
  if (state.sseConnected) {
    el.textContent = 'Live';
    el.className = 'text-[10px] text-[#00A86B] font-semibold';
    wrap.style.background = 'rgba(0,168,107,0.1)';
    wrap.style.borderColor = 'rgba(0,168,107,0.2)';
    if (dot) { dot.className = 'pulse-dot bg-[#00A86B] text-[#00A86B]'; }
  } else {
    el.textContent = 'Online';
    el.className = 'text-[10px] text-white/50 font-semibold';
    wrap.style.background = 'rgba(255,255,255,0.05)';
    wrap.style.borderColor = 'rgba(255,255,255,0.1)';
    if (dot) { dot.className = 'pulse-dot bg-white/30 text-white/30'; }
  }
}

window.showSSEStatus = function() {
  var connected = state.sseConnected;
  var retries = state.sseRetryCount;
  showModal(
    '<div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold text-white"><i class="fas fa-broadcast-tower mr-2 text-[#00A86B]"></i>Connection Status</h3><button onclick="closeModal()" class="text-white/40 hover:text-white"><i class="fas fa-times"></i></button></div>' +
    '<div class="space-y-3">' +
    '<div class="flex items-center gap-3 p-3 rounded-xl ' + (connected ? 'bg-emerald-900/20 border border-emerald-800/30' : 'bg-amber-900/20 border border-amber-800/30') + '">' +
    '<i class="fas ' + (connected ? 'fa-check-circle text-emerald-400' : 'fa-exclamation-circle text-amber-400') + ' text-lg"></i>' +
    '<div><p class="text-sm font-medium text-white">' + (connected ? 'SSE Stream Active' : 'Polling Mode') + '</p>' +
    '<p class="text-[10px] text-white/50">' + (connected ? 'Real-time events via Server-Sent Events' : 'Polling every ' + (state.notifPollInterval/1000) + 's (SSE retries: ' + retries + ')') + '</p></div></div>' +
    '<div class="grid grid-cols-2 gap-2 text-center">' +
    '<div class="p-3 rounded-xl bg-white/5 border border-white/8"><p class="text-lg font-bold text-white">' + (connected ? '<i class="fas fa-bolt text-[#00A86B]"></i>' : '<i class="fas fa-clock text-amber-400"></i>') + '</p><p class="text-[9px] text-white/40 mt-1">' + (connected ? 'Real-Time' : 'Polling') + '</p></div>' +
    '<div class="p-3 rounded-xl bg-white/5 border border-white/8"><p class="text-lg font-bold text-white">' + retries + '</p><p class="text-[9px] text-white/40 mt-1">Retries</p></div></div>' +
    (connected ? '<button onclick="stopSSE();startSSE();closeModal()" class="w-full py-2 bg-white/5 hover:bg-white/10 text-white/60 text-xs font-medium rounded-xl transition border border-white/10"><i class="fas fa-redo mr-1.5"></i>Reconnect SSE</button>' :
    '<button onclick="startSSE();closeModal()" class="w-full py-2 bg-[#00A86B]/20 hover:bg-[#00A86B]/30 text-[#00A86B] text-xs font-semibold rounded-xl transition border border-[#00A86B]/30"><i class="fas fa-broadcast-tower mr-1.5"></i>Connect SSE</button>') +
    '</div>'
  );
};

// ===== LIVE NOTIFICATION POLLING (fallback) =====
window.startNotifPolling = function() {
  if (state.notifPollTimer) clearInterval(state.notifPollTimer);
  state.lastNotifCount = -1;
  // Initial load
  pollNotifications();
  // Poll every 30s
  state.notifPollTimer = setInterval(pollNotifications, state.notifPollInterval);
};

window.stopNotifPolling = function() {
  if (state.notifPollTimer) { clearInterval(state.notifPollTimer); state.notifPollTimer = null; }
  state.lastNotifCount = -1;
};

async function pollNotifications() {
  if (!state.isAuthenticated || !state.token) return;
  try {
    var data = await api('/api/notifications?limit=5');
    var unread = data.unread || 0;
    var badge = document.querySelector('.notif-count');
    var bellBtn = document.querySelector('.notif-btn');

    // Update badge
    if (badge) {
      if (unread > 0) { badge.textContent = unread > 9 ? '9+' : unread; badge.style.display = ''; }
      else { badge.style.display = 'none'; }
    }

    // Check if there are NEW notifications since last poll
    if (state.lastNotifCount >= 0 && unread > state.lastNotifCount) {
      var diff = unread - state.lastNotifCount;
      // Pulse the bell icon
      if (bellBtn) {
        bellBtn.classList.add('notif-pulse');
        setTimeout(function() { bellBtn.classList.remove('notif-pulse'); }, 3000);
      }
      // Show toast for the newest notification
      if (data.notifications && data.notifications.length > 0) {
        var newest = data.notifications[0];
        var toastType = newest.type === 'alert' ? 'error' : newest.type === 'warning' ? 'warning' : 'info';
        showToast(newest.title + ': ' + (newest.message || '').substring(0, 80), toastType);
      } else {
        showToast(diff + ' new notification' + (diff > 1 ? 's' : ''), 'info');
      }
    }
    state.lastNotifCount = unread;
  } catch(e) { /* silent fail on poll */ }
}

  `;
}
