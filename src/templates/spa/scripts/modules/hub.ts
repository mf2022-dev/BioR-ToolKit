// =============================================================================
// BioR Platform - Project Hub, Quick Stats, Data Library
// =============================================================================

export function getHubJS(): string {
  return `
// ===== PROJECT HUB =====
function openExtUrl(url) { window.open(url, '_blank'); }
function navToView(v) { state.currentView = v; pushSpaState(); render(); }

function renderProjectHub() {
  const u = state.user || {};
  const isAdmin = u.role === 'Admin';
  const projects = getAllProjects();
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

  return '<div class="hub-page">' +
    '<style>' +
    '.hub-page{min-height:100vh;background:#060b14;font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif;color:#fff;overflow-y:auto;}' +
    '.hub-header{padding:20px 40px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--bior-border-subtle);background:var(--bior-glass-bg);backdrop-filter:blur(20px);position:sticky;top:0;z-index:50;}' +
    '.hub-brand{display:flex;align-items:center;gap:12px;}' +
    '.hub-brand-icon{width:42px;height:42px;border-radius:14px;background:linear-gradient(135deg,#00A86B,#006241);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(0,168,107,0.25);}' +
    '.hub-brand-icon i{font-size:18px;color:#fff;}' +
    '.hub-brand-text h1{font-size:18px;font-weight:800;color:#fff;letter-spacing:-0.3px;line-height:1.1;}' +
    '.hub-brand-text p{font-size:10px;color:rgba(255,255,255,0.4);letter-spacing:0.5px;font-weight:500;}' +
    '.hub-user{display:flex;align-items:center;gap:12px;}' +
    '.hub-user-info{text-align:right;}' +
    '.hub-user-info p{font-size:12px;font-weight:600;color:rgba(255,255,255,0.85);}' +
    '.hub-user-info span{font-size:10px;color:rgba(255,255,255,0.35);}' +
    '.hub-avatar{width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,#00A86B,#006241);display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:700;cursor:pointer;transition:all 0.3s;box-shadow:0 2px 12px rgba(0,168,107,0.2);}' +
    '.hub-avatar:hover{transform:scale(1.05);box-shadow:0 4px 20px rgba(0,168,107,0.35);}' +
    '.hub-btn-icon{width:36px;height:36px;border-radius:10px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.04);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.4);cursor:pointer;transition:all 0.2s;font-size:13px;}' +
    '.hub-btn-icon:hover{background:rgba(255,255,255,0.08);color:#00A86B;border-color:rgba(0,168,107,0.3);}' +

    '.hub-body{max-width:1100px;margin:0 auto;padding:48px 40px 60px;}' +
    '.hub-welcome{margin-bottom:40px;}' +
    '.hub-welcome h2{font-size:28px;font-weight:800;color:#fff;letter-spacing:-0.5px;margin-bottom:6px;}' +
    '.hub-welcome h2 span{color:#00A86B;}' +
    '.hub-welcome p{font-size:14px;color:rgba(255,255,255,0.4);font-weight:400;}' +

    '.hub-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}' +
    '@media(max-width:900px){.hub-grid{grid-template-columns:repeat(2,1fr);}}' +
    '@media(max-width:600px){.hub-grid{grid-template-columns:1fr;}.hub-header{padding:16px 20px;}.hub-body{padding:28px 20px 40px;}}' +

    // Project card
    '.hub-card{position:relative;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:28px 24px;cursor:pointer;transition:all 0.35s cubic-bezier(0.4,0,0.2,1);overflow:hidden;}' +
    '.hub-card::before{content:\\'\\';position:absolute;inset:0;border-radius:20px;background:radial-gradient(ellipse at 30% 0%,var(--card-glow,rgba(0,168,107,0.06)),transparent 60%);opacity:0;transition:opacity 0.35s;}' +
    '.hub-card:hover{border-color:var(--card-border,rgba(0,168,107,0.3));transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,0.3),0 0 0 1px var(--card-border,rgba(0,168,107,0.15));}' +
    '.hub-card:hover::before{opacity:1;}' +
    '.hub-card-active{border-color:rgba(0,168,107,0.25);}' +
    '.hub-card-active::after{content:\\'\\';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#00A86B,#00c77b);border-radius:20px 20px 0 0;}' +

    '.hub-card-icon{width:52px;height:52px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:20px;color:#fff;margin-bottom:20px;position:relative;z-index:1;transition:transform 0.3s;}' +
    '.hub-card:hover .hub-card-icon{transform:scale(1.08);}' +
    '.hub-card-name{font-size:17px;font-weight:700;color:#fff;margin-bottom:8px;position:relative;z-index:1;letter-spacing:-0.2px;}' +
    '.hub-card-desc{font-size:12px;color:rgba(255,255,255,0.35);line-height:1.6;margin-bottom:20px;position:relative;z-index:1;min-height:38px;}' +

    '.hub-card-meta{display:flex;align-items:center;justify-content:space-between;position:relative;z-index:1;}' +
    '.hub-card-stats{display:flex;align-items:center;gap:12px;}' +
    '.hub-card-stat{font-size:11px;color:rgba(255,255,255,0.35);display:flex;align-items:center;gap:4px;}' +
    '.hub-card-stat i{font-size:9px;}' +
    '.hub-card-status{display:flex;align-items:center;gap:5px;font-size:10px;font-weight:600;}' +
    '.hub-card-status .dot{width:7px;height:7px;border-radius:50%;}' +
    '.hub-card-enter{font-size:11px;font-weight:600;color:#00A86B;display:flex;align-items:center;gap:6px;opacity:0;transform:translateX(-6px);transition:all 0.3s;}' +
    '.hub-card:hover .hub-card-enter{opacity:1;transform:translateX(0);}' +

    // Add card
    '.hub-card-add{border-style:dashed;border-color:rgba(255,255,255,0.1);display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:240px;text-align:center;}' +
    '.hub-card-add:hover{border-color:rgba(0,168,107,0.4);background:rgba(0,168,107,0.03);}' +
    '.hub-card-add-icon{width:56px;height:56px;border-radius:50%;border:2px dashed rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;font-size:22px;color:rgba(255,255,255,0.2);margin-bottom:16px;transition:all 0.3s;}' +
    '.hub-card-add:hover .hub-card-add-icon{border-color:rgba(0,168,107,0.5);color:#00A86B;background:rgba(0,168,107,0.08);}' +
    '.hub-card-add-title{font-size:14px;font-weight:600;color:rgba(255,255,255,0.5);margin-bottom:6px;}' +
    '.hub-card-add-desc{font-size:11px;color:rgba(255,255,255,0.25);}' +

    // Footer
    '.hub-footer{max-width:1100px;margin:0 auto;padding:0 40px 32px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(255,255,255,0.04);padding-top:20px;}' +
    '.hub-footer-left{display:flex;align-items:center;gap:16px;font-size:11px;color:rgba(255,255,255,0.2);}' +
    '.hub-footer-left span{display:flex;align-items:center;gap:5px;}' +
    '.hub-footer-right{font-size:11px;color:rgba(255,255,255,0.15);}' +

    // Modal for add project
    '.hub-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(8px);z-index:100;display:flex;align-items:center;justify-content:center;animation:hubFadeIn 0.2s ease-out;}' +
    '@keyframes hubFadeIn{from{opacity:0;}to{opacity:1;}}' +
    '.hub-modal{background:var(--bior-bg-modal);border:1px solid var(--bior-border-default);border-radius:20px;padding:32px;max-width:440px;width:90%;box-shadow:0 24px 80px rgba(0,0,0,0.5);animation:hubSlideUp 0.25s ease-out;}' +
    '@keyframes hubSlideUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}' +
    '.hub-modal h3{font-size:18px;font-weight:700;color:#fff;margin-bottom:4px;}' +
    '.hub-modal p{font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:20px;}' +
    '.hub-modal label{display:block;font-size:11px;font-weight:600;color:rgba(255,255,255,0.5);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.04em;}' +
    '.hub-modal input,.hub-modal textarea{width:100%;padding:10px 14px;background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,255,255,0.1);border-radius:10px;color:#fff;font-size:13px;font-family:Inter,sans-serif;outline:none;transition:border 0.2s;box-sizing:border-box;margin-bottom:14px;}' +
    '.hub-modal input:focus,.hub-modal textarea:focus{border-color:#00A86B;}' +
    '.hub-modal textarea{resize:vertical;min-height:60px;}' +
    '.hub-modal-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:8px;}' +
    '.hub-modal-btn{padding:10px 20px;border-radius:10px;font-size:12px;font-weight:600;font-family:Inter,sans-serif;cursor:pointer;transition:all 0.2s;border:none;}' +
    '.hub-modal-btn-primary{background:linear-gradient(135deg,#00A86B,#008F5B);color:#fff;}' +
    '.hub-modal-btn-primary:hover{background:linear-gradient(135deg,#00c77b,#00A86B);box-shadow:0 4px 16px rgba(0,168,107,0.3);}' +
    '.hub-modal-btn-cancel{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.1);}' +
    '.hub-modal-btn-cancel:hover{background:rgba(255,255,255,0.1);}' +

    // Icon picker
    '.hub-icon-picker{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;}' +
    '.hub-icon-opt{width:40px;height:40px;border-radius:10px;border:2px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;font-size:15px;color:rgba(255,255,255,0.4);}' +
    '.hub-icon-opt:hover{border-color:rgba(255,255,255,0.2);color:rgba(255,255,255,0.7);}' +
    '.hub-icon-opt.selected{border-color:#00A86B;color:#00A86B;background:rgba(0,168,107,0.1);}' +

    // Section headers
    '.hub-section{margin-bottom:36px;border-radius:16px;padding:24px;position:relative;overflow:hidden;border:1px solid rgba(255,255,255,0.04);}' +
    '.hub-section::before{content:"";position:absolute;inset:0;border-radius:16px;pointer-events:none;opacity:0.4;}' +
    '.hub-section-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid var(--sec-border,rgba(255,255,255,0.06));}' +
    '.hub-section-label{display:flex;flex-direction:column;gap:6px;}' +
    '.hub-section-title{display:flex;align-items:center;gap:10px;font-size:15px;font-weight:800;color:#fff;letter-spacing:0.02em;}' +
    '.hub-section-title i{font-size:14px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:9px;}' +
    '.hub-section-title .hub-section-count{font-size:10px;font-weight:600;padding:2px 8px;border-radius:6px;margin-left:2px;}' +
    '.hub-section-desc{font-size:11px;color:rgba(255,255,255,0.35);font-weight:400;line-height:1.5;padding-left:42px;}' +
    '.hub-section-btn{display:flex;align-items:center;gap:6px;padding:7px 16px;border-radius:10px;background:linear-gradient(135deg,#00A86B,#008F5B);color:#fff;font-size:11px;font-weight:600;border:none;cursor:pointer;transition:all 0.2s;font-family:Inter,sans-serif;}' +
    '.hub-section-btn:hover{box-shadow:0 4px 16px rgba(0,168,107,0.3);transform:translateY(-1px);}' +
    '.hub-section-btn i{font-size:10px;}' +

    // Section color themes
    '.hub-sec-projects{background:linear-gradient(135deg,rgba(0,168,107,0.04),rgba(0,168,107,0.01));--sec-border:rgba(0,168,107,0.1);}' +
    '.hub-sec-projects .hub-section-title i{background:rgba(0,168,107,0.12);color:#00A86B;}' +
    '.hub-sec-projects .hub-section-count{background:rgba(0,168,107,0.1);color:#00A86B;}' +
    '.hub-sec-kb{background:linear-gradient(135deg,rgba(245,158,11,0.04),rgba(245,158,11,0.01));--sec-border:rgba(245,158,11,0.1);}' +
    '.hub-sec-kb .hub-section-title i{background:rgba(245,158,11,0.12);color:#f59e0b;}' +
    '.hub-sec-kb .hub-section-count{background:rgba(245,158,11,0.1);color:#f59e0b;}' +
    '.hub-sec-engines{background:linear-gradient(135deg,rgba(99,102,241,0.04),rgba(99,102,241,0.01));--sec-border:rgba(99,102,241,0.1);}' +
    '.hub-sec-engines .hub-section-title i{background:rgba(99,102,241,0.12);color:#6366f1;}' +
    '.hub-sec-engines .hub-section-count{background:rgba(99,102,241,0.1);color:#6366f1;}' +
    '.hub-sec-tools{background:linear-gradient(135deg,rgba(6,182,212,0.04),rgba(6,182,212,0.01));--sec-border:rgba(6,182,212,0.1);}' +
    '.hub-sec-tools .hub-section-title i{background:rgba(6,182,212,0.12);color:#06b6d4;}' +
    '.hub-sec-tools .hub-section-count{background:rgba(6,182,212,0.1);color:#06b6d4;}' +
    '.hub-sec-data{background:linear-gradient(135deg,rgba(139,92,246,0.04),rgba(139,92,246,0.01));--sec-border:rgba(139,92,246,0.1);}' +
    '.hub-sec-data .hub-section-title i{background:rgba(139,92,246,0.12);color:#8b5cf6;}' +
    '.hub-sec-data .hub-section-count{background:rgba(139,92,246,0.1);color:#8b5cf6;}' +

    // Responsive card grid
    '.hub-dl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:16px;}' +
    '@media(max-width:640px){.hub-dl-grid{grid-template-columns:1fr;}}' +

    // Data Library horizontal scroll (kept for datasets)
    '.hub-dl-scroll{display:flex;gap:16px;overflow-x:auto;padding-bottom:8px;scroll-behavior:smooth;}' +
    '.hub-dl-scroll::-webkit-scrollbar{height:4px;}.hub-dl-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px;}' +
    '.hub-dl-loading{flex:1;text-align:center;padding:32px;color:rgba(255,255,255,0.2);font-size:12px;}' +
    '.hub-dl-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:20px;transition:all 0.3s;cursor:pointer;position:relative;overflow:hidden;}' +
    '.hub-dl-card:hover{border-color:rgba(0,168,107,0.3);transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,0,0,0.25);}' +
    '.hub-dl-scroll .hub-dl-card{min-width:260px;max-width:280px;flex-shrink:0;}' +
    '.hub-dl-card-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:16px;color:#fff;margin-bottom:14px;}' +
    '.hub-dl-card-name{font-size:14px;font-weight:700;color:#fff;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
    '.hub-dl-card-desc{font-size:11px;color:rgba(255,255,255,0.3);margin-bottom:12px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:33px;}' +
    '.hub-dl-progress{height:3px;background:rgba(255,255,255,0.06);border-radius:3px;margin-bottom:12px;overflow:hidden;}' +
    '.hub-dl-progress-bar{height:100%;border-radius:3px;transition:width 0.5s ease;}' +
    '.hub-dl-card-meta{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;}' +
    '.hub-dl-card-tag{font-size:10px;color:rgba(255,255,255,0.35);display:flex;align-items:center;gap:4px;}' +
    '.hub-dl-card-tag i{font-size:8px;}' +
    '.hub-dl-card-actions{display:flex;gap:6px;}' +
    '.hub-dl-btn{flex:1;padding:7px 0;border-radius:8px;font-size:10px;font-weight:600;border:none;cursor:pointer;transition:all 0.2s;font-family:Inter,sans-serif;text-align:center;}' +
    '.hub-dl-btn-explore{background:rgba(0,168,107,0.12);color:#00A86B;border:1px solid rgba(0,168,107,0.2);}' +
    '.hub-dl-btn-explore:hover{background:rgba(0,168,107,0.2);}' +
    '.hub-dl-btn-more{background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.4);border:1px solid rgba(255,255,255,0.08);width:32px;flex:none;}' +
    '.hub-dl-btn-more:hover{color:rgba(255,255,255,0.7);}' +
    '.hub-dl-add{min-width:200px;border-style:dashed;border-color:rgba(255,255,255,0.08);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;min-height:200px;}' +
    '.hub-dl-add:hover{border-color:rgba(59,130,246,0.4);background:rgba(59,130,246,0.03);}' +
    '.hub-dl-add-icon{width:44px;height:44px;border-radius:50%;border:2px dashed rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:18px;color:rgba(255,255,255,0.15);margin-bottom:10px;transition:all 0.3s;}' +
    '.hub-dl-add:hover .hub-dl-add-icon{border-color:rgba(59,130,246,0.4);color:#3b82f6;background:rgba(59,130,246,0.08);}' +
    '.hub-dl-add-title{font-size:12px;font-weight:600;color:rgba(255,255,255,0.4);margin-bottom:4px;}' +
    '.hub-dl-add-desc{font-size:10px;color:rgba(255,255,255,0.2);}' +
    '</style>' +

    // Header
    '<div class="hub-header">' +
      '<div class="hub-brand">' +
        '<div class="hub-brand-icon"><i class="fas fa-dna"></i></div>' +
        '<div class="hub-brand-text"><h1>BioR Platform</h1><p>Biological Response Network</p></div>' +
      '</div>' +
      '<div class="hub-user">' +
        '<div class="hub-user-info"><p>' + (u.name||'User') + '</p><span>' + (u.role||'') + (u.institution?' &bull; '+u.institution:'') + '</span></div>' +
        '<div class="hub-avatar" title="Profile">' + (u.avatar||'U') + '</div>' +
        '<button class="hub-btn-icon" onclick="toggleTheme()" title="Toggle Theme"><i class="fas fa-moon"></i></button>' +
        '<button class="hub-btn-icon" onclick="logout()" title="Sign Out"><i class="fas fa-sign-out-alt"></i></button>' +
      '</div>' +
    '</div>' +

    // Body
    '<div class="hub-body">' +
      '<div class="hub-welcome">' +
        '<h2>' + greeting + ', <span>' + (u.name||'User').split(' ')[0] + '</span></h2>' +
        '<p>Select a project workspace' + (isAdmin ? ' or explore your data library' : '') + '</p>' +
      '</div>' +

      // QUICK STATS BAR (loads async)
      '<div id="hubQuickStats" class="hub-section" style="margin-bottom:8px"></div>' +

      // ═══════════════════════════════════════════════
      // SECTION 1: PROJECTS
      // ═══════════════════════════════════════════════
      '<div class="hub-section hub-sec-projects">' +
        '<div class="hub-section-header">' +
          '<div class="hub-section-label">' +
            '<div class="hub-section-title"><i class="fas fa-rocket"></i> Projects<span class="hub-section-count">3</span></div>' +
            '<div class="hub-section-desc">Core platforms &amp; operational systems — live deployments powering real-time intelligence</div>' +
          '</div>' +
        '</div>' +
        '<div class="hub-dl-grid">' +
          // CBRN WATCH
          '<div class="hub-dl-card" style="border-color:rgba(0,168,107,0.15);border-top:3px solid #00A86B" data-ext-url="https://cbrn-watch.pages.dev" onclick="openExtUrl(this.dataset.extUrl)">' +
            '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px"><div style="width:44px;height:44px;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,108,53,0.35);flex-shrink:0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="44" height="44"><rect width="100" height="100" rx="4" fill="#0d1b2a"/><path d="M50 12 L85 30 L85 55 Q85 75 50 88 Q15 75 15 55 L15 30 Z" fill="none" stroke="#006C35" stroke-width="2.5" opacity="0.8"/><path d="M50 20 L78 34 L78 55 Q78 70 50 80 Q22 70 22 55 L22 34 Z" fill="#006C35" opacity="0.08"/><circle cx="50" cy="46" r="14" fill="none" stroke="#22c55e" stroke-width="1.5" opacity="0.7"/><circle cx="50" cy="46" r="7" fill="none" stroke="#22c55e" stroke-width="1.5" opacity="0.5"/><circle cx="50" cy="46" r="2" fill="#22c55e"/><line x1="50" y1="46" x2="60" y2="36" stroke="#22c55e" stroke-width="1.5" opacity="0.8"/><text x="50" y="94" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="9" font-weight="800" letter-spacing="1" fill="#006C35">CBRN WATCH</text></svg></div><div style="width:40px;height:40px;border-radius:10px;background:rgba(0,168,107,0.15);display:flex;align-items:center;justify-content:center"><i class="fas fa-satellite-dish" style="color:#00A86B;font-size:16px"></i></div><span style="position:absolute;top:12px;right:12px;background:rgba(0,168,107,0.1);color:#00A86B;font-size:9px;font-weight:600;padding:3px 8px;border-radius:6px;border:1px solid rgba(0,168,107,0.2)"><i class="fas fa-external-link-alt" style="margin-right:3px;font-size:7px"></i>Live</span></div>' +
            '<div class="hub-dl-card-name"><span style="background:linear-gradient(135deg,#006C35,#22c55e);-webkit-background-clip:text;-webkit-text-fill-color:transparent">CBRN WATCH</span></div>' +
            '<div class="hub-dl-card-desc">CBRN Predictive Intelligence Platform — AI-driven threat assessment across Nuclear, Biological, Chemical &amp; Radiological domains. 79 real-time data sources, 143 investigation sites, convergence analysis, signal detection &amp; OSINT monitoring.</div>' +
            '<div class="hub-dl-progress"><div class="hub-dl-progress-bar" style="width:100%;background:linear-gradient(90deg,#006C35,#22c55e)"></div></div>' +
            '<div class="hub-dl-card-meta">' +
              '<span class="hub-dl-card-tag"><i class="fas fa-shield-alt"></i>4 CBRN Domains</span>' +
              '<span class="hub-dl-card-tag"><i class="fas fa-rss"></i>79 Sources</span>' +
              '<span class="hub-dl-card-tag"><i class="fas fa-map-marked-alt"></i>143 Sites</span>' +
              '<span class="hub-dl-card-tag"><i class="fas fa-brain"></i>AI Engine</span>' +
            '</div>' +
            '<div class="hub-dl-card-actions">' +
              '<button class="hub-dl-btn hub-dl-btn-explore" style="background:linear-gradient(135deg,#006C35,#22c55e);color:#fff" data-ext-url="https://cbrn-watch.pages.dev" onclick="event.stopPropagation();openExtUrl(this.dataset.extUrl)"><i class="fas fa-external-link-alt"></i> Explore</button>' +
            '</div>' +
          '</div>' +
          // GeoIntel Engine
          '<div class="hub-dl-card" style="border-color:rgba(6,182,212,0.15);border-top:3px solid #06b6d4" onclick="openGeoIntelView()">' +
            '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px"><div style="width:44px;height:44px;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,108,53,0.35);flex-shrink:0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="44" height="44"><rect width="100" height="100" rx="4" fill="#0d1b2a"/><circle cx="50" cy="45" r="28" fill="none" stroke="#006C35" stroke-width="2"/><ellipse cx="50" cy="45" rx="28" ry="12" fill="none" stroke="#006C35" stroke-width="1.5" opacity="0.6"/><ellipse cx="50" cy="45" rx="12" ry="28" fill="none" stroke="#006C35" stroke-width="1.5" opacity="0.6"/><line x1="22" y1="45" x2="78" y2="45" stroke="#006C35" stroke-width="1" opacity="0.4"/><line x1="50" y1="17" x2="50" y2="73" stroke="#006C35" stroke-width="1" opacity="0.4"/><circle cx="38" cy="35" r="2.5" fill="#22c55e" opacity="0.9"/><circle cx="62" cy="50" r="2" fill="#22c55e" opacity="0.7"/><circle cx="45" cy="58" r="1.8" fill="#22c55e" opacity="0.8"/><text x="50" y="90" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="11" font-weight="800" letter-spacing="1.5" fill="#006C35">GEOINTEL</text></svg></div><div style="width:40px;height:40px;border-radius:10px;background:rgba(6,182,212,0.15);display:flex;align-items:center;justify-content:center"><i class="fas fa-globe-americas" style="color:#06b6d4;font-size:16px"></i></div></div>' +
            '<div class="hub-dl-card-name"><span style="background:linear-gradient(135deg,#0891b2,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent">GeoIntel</span><span style="color:rgba(255,255,255,0.4);font-weight:400"> | </span><span style="background:linear-gradient(135deg,#0891b2,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Engine</span></div>' +
            '<div class="hub-dl-card-desc">Multi-layer geospatial intelligence — 489 features across 10 layers: platforms, BSL-4 labs, CTBTO stations, outbreaks, GHS scores, CBRN sensors, genomic labs, environmental monitoring, population centers &amp; policy readiness.</div>' +
            '<div class="hub-dl-progress"><div class="hub-dl-progress-bar" style="width:100%;background:linear-gradient(90deg,#0891b2,#06b6d4)"></div></div>' +
            '<div class="hub-dl-card-meta">' +
              '<span class="hub-dl-card-tag"><i class="fas fa-layer-group"></i>10 Layers</span>' +
              '<span class="hub-dl-card-tag"><i class="fas fa-map-marker-alt"></i>489 Features</span>' +
              '<span class="hub-dl-card-tag"><i class="fas fa-satellite"></i>Interactive</span>' +
            '</div>' +
            '<div class="hub-dl-card-actions">' +
              '<button class="hub-dl-btn hub-dl-btn-explore" style="background:linear-gradient(135deg,#0891b2,#06b6d4);color:#fff" onclick="event.stopPropagation();openGeoIntelView()"><i class="fas fa-eye"></i> Explore</button>' +
            '</div>' +
          '</div>' +
          // SampleTrack
          '<div class="hub-dl-card" style="border-color:rgba(139,92,246,0.15);border-top:3px solid #8b5cf6" data-ext-url="https://sampletrack.bior.tech" onclick="openExtUrl(this.dataset.extUrl)">' +
            '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px"><div style="width:44px;height:44px;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(139,92,246,0.35);flex-shrink:0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="44" height="44"><rect width="100" height="100" rx="4" fill="#0d1b2a"/><rect x="25" y="20" width="50" height="35" rx="3" fill="none" stroke="#8b5cf6" stroke-width="2"/><line x1="25" y1="30" x2="75" y2="30" stroke="#8b5cf6" stroke-width="1.5" opacity="0.5"/><circle cx="35" cy="42" r="3" fill="#8b5cf6" opacity="0.6"/><circle cx="50" cy="42" r="3" fill="#a78bfa" opacity="0.8"/><circle cx="65" cy="42" r="3" fill="#8b5cf6" opacity="0.6"/><path d="M30 60 L40 56 L50 62 L60 54 L70 58" stroke="#a78bfa" stroke-width="2" fill="none" opacity="0.8"/><text x="50" y="90" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="8" font-weight="800" letter-spacing="1" fill="#8b5cf6">SAMPLETRACK</text></svg></div><div style="width:40px;height:40px;border-radius:10px;background:rgba(139,92,246,0.15);display:flex;align-items:center;justify-content:center"><i class="fas fa-vials" style="color:#8b5cf6;font-size:16px"></i></div><span style="position:absolute;top:12px;right:12px;background:rgba(139,92,246,0.1);color:#8b5cf6;font-size:9px;font-weight:600;padding:3px 8px;border-radius:6px;border:1px solid rgba(139,92,246,0.2)"><i class="fas fa-external-link-alt" style="margin-right:3px;font-size:7px"></i>Live</span></div>' +
            '<div class="hub-dl-card-name"><span style="background:linear-gradient(135deg,#7c3aed,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent">SampleTrack</span></div>' +
            '<div class="hub-dl-card-desc">Biological sample chain-of-custody tracking — end-to-end specimen lifecycle management from collection through sequencing. Real-time status, lab integration &amp; compliance reporting.</div>' +
            '<div class="hub-dl-progress"><div class="hub-dl-progress-bar" style="width:75%;background:linear-gradient(90deg,#7c3aed,#a78bfa)"></div></div>' +
            '<div class="hub-dl-card-meta">' +
              '<span class="hub-dl-card-tag"><i class="fas fa-vial"></i>Sample Tracking</span>' +
              '<span class="hub-dl-card-tag"><i class="fas fa-link"></i>Chain of Custody</span>' +
              '<span class="hub-dl-card-tag"><i class="fas fa-clipboard-check"></i>Compliance</span>' +
            '</div>' +
            '<div class="hub-dl-card-actions">' +
              '<button class="hub-dl-btn hub-dl-btn-explore" style="background:linear-gradient(135deg,#7c3aed,#a78bfa);color:#fff" data-ext-url="https://sampletrack.bior.tech" onclick="event.stopPropagation();openExtUrl(this.dataset.extUrl)"><i class="fas fa-external-link-alt"></i> Explore</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      // ═══════════════════════════════════════════════
      // SECTION 2: KNOWLEDGE BASES
      // ═══════════════════════════════════════════════
      '<div class="hub-section hub-sec-kb">' +
        '<div class="hub-section-header">' +
          '<div class="hub-section-label">' +
            '<div class="hub-section-title"><i class="fas fa-book-open"></i> Knowledge Bases<span class="hub-section-count">4</span></div>' +
            '<div class="hub-section-desc">Regulatory frameworks, benchmarks &amp; structured reference data for compliance and evaluation</div>' +
          '</div>' +
        '</div>' +
        '<div class="hub-dl-grid">' +
          // PSEF Benchmark
          '<div class="hub-dl-card" style="border-color:rgba(0,168,107,0.15)" onclick="openBenchmarkView()">' +
            '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px"><div style="width:44px;height:44px;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,108,53,0.35);flex-shrink:0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="44" height="44"><rect width="100" height="100" rx="4" fill="#0d1b2a"/><rect x="15" y="55" width="16" height="25" rx="2" fill="#006C35" opacity="0.6"/><rect x="35" y="40" width="16" height="40" rx="2" fill="#006C35" opacity="0.75"/><rect x="55" y="25" width="16" height="55" rx="2" fill="#22c55e" opacity="0.85"/><rect x="75" y="35" width="10" height="45" rx="2" fill="#006C35" opacity="0.5"/><polygon points="43,18 46,24 53,24 48,28 50,35 43,31 36,35 38,28 33,24 40,24" fill="#c8a84e" opacity="0.9"/><text x="50" y="94" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="11" font-weight="800" letter-spacing="1.5" fill="#006C35">PSEF</text></svg></div><div style="width:40px;height:40px;border-radius:10px;background:rgba(0,168,107,0.15);display:flex;align-items:center;justify-content:center"><i class="fas fa-ranking-star" style="color:#00A86B;font-size:16px"></i></div></div>' +
            '<div class="hub-dl-card-name"><span style="background:linear-gradient(135deg,#006C35,#22c55e);-webkit-background-clip:text;-webkit-text-fill-color:transparent">PSEF</span><span style="color:rgba(255,255,255,0.4);font-weight:400"> | </span><span style="background:linear-gradient(135deg,#006C35,#22c55e);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Benchmark</span></div>' +
            '<div class="hub-dl-card-desc">Deep-Research Profiles — 189 Biosurveillance Platforms (50 Deep Profiles, 20 CBRN). Overview, profiles, CBRN analysis &amp; ecosystem map.</div>' +
            '<div class="hub-dl-progress"><div class="hub-dl-progress-bar" style="width:100%;background:linear-gradient(90deg,#006C35,#22c55e)"></div></div>' +
            '<div class="hub-dl-card-meta">' +
              '<span class="hub-dl-card-tag"><i class="fas fa-microscope"></i>10 Deep Profiles</span>' +
              '<span class="hub-dl-card-tag"><i class="fas fa-layer-group"></i>3 Layers</span>' +
              '<span class="hub-dl-card-tag"><i class="fas fa-chart-bar"></i>4 Views</span>' +
            '</div>' +
            '<div class="hub-dl-card-actions">' +
              '<button class="hub-dl-btn hub-dl-btn-explore" style="background:linear-gradient(135deg,#006C35,#22c55e);color:#fff" onclick="event.stopPropagation();openBenchmarkView()"><i class="fas fa-eye"></i> Explore</button>' +
            '</div>' +
          '</div>' +
          // RSKB Regulatory KB
          '<div class="hub-dl-card" style="border-color:rgba(0,168,107,0.15)" data-view="rskb" onclick="navToView(this.dataset.view)">' +
            '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px"><div style="width:44px;height:44px;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,108,53,0.35);flex-shrink:0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="44" height="44"><rect width="100" height="100" rx="4" fill="#0d1b2a"/><rect x="30" y="20" width="40" height="50" rx="3" fill="none" stroke="#006C35" stroke-width="2"/><line x1="36" y1="30" x2="64" y2="30" stroke="#006C35" stroke-width="1.5" opacity="0.5"/><line x1="36" y1="37" x2="58" y2="37" stroke="#006C35" stroke-width="1" opacity="0.35"/><line x1="36" y1="44" x2="62" y2="44" stroke="#006C35" stroke-width="1" opacity="0.35"/><line x1="36" y1="51" x2="55" y2="51" stroke="#006C35" stroke-width="1" opacity="0.35"/><line x1="36" y1="58" x2="60" y2="58" stroke="#006C35" stroke-width="1" opacity="0.35"/><circle cx="50" cy="60" r="0" fill="#22c55e"/><text x="50" y="90" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#006C35">RSKB</text></svg></div><div style="width:40px;height:40px;border-radius:10px;background:rgba(0,168,107,0.15);display:flex;align-items:center;justify-content:center"><i class="fas fa-balance-scale" style="color:#00A86B;font-size:16px"></i></div></div>' +
            '<div class="hub-dl-card-name"><span style="background:linear-gradient(135deg,#006C35,#22c55e);-webkit-background-clip:text;-webkit-text-fill-color:transparent">RSKB</span><span style="color:rgba(255,255,255,0.4);font-weight:400"> | </span><span style="background:linear-gradient(135deg,#006C35,#22c55e);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Regulatory KB</span></div>' +
            '<div class="hub-dl-card-desc">Comprehensive biosurveillance regulatory foundation — international treaties (BWC, IHR, CWC), standards (ISO 35001, 15189), Saudi regulations, GHSA, capacity assessments, regulated agents &amp; cross-references.</div>' +
            '<div class="hub-dl-progress"><div class="hub-dl-progress-bar" style="width:100%;background:linear-gradient(90deg,#006C35,#22c55e)"></div></div>' +
            '<div class="hub-dl-card-meta">' +
              '<span class="hub-dl-card-tag"><i class="fas fa-scroll"></i>27 Instruments</span>' +
              '<span class="hub-dl-card-tag"><i class="fas fa-layer-group"></i>8 Domains</span>' +
              '<span class="hub-dl-card-tag"><i class="fas fa-biohazard"></i>15 Agents</span>' +
            '</div>' +
            '<div class="hub-dl-card-actions">' +
              '<button class="hub-dl-btn hub-dl-btn-explore" style="background:linear-gradient(135deg,#006C35,#22c55e);color:#fff" data-view="rskb" onclick="event.stopPropagation();navToView(this.dataset.view)"><i class="fas fa-eye"></i> Explore</button>' +
            '</div>' +
          '</div>' +
          // PSEF-X — Preparedness Simulation Evidence Framework
          '<div class="hub-dl-card" style="border-color:rgba(239,68,68,0.15)" data-ext-url="https://psef-x.bior.tech/" onclick="openExtUrl(this.dataset.extUrl)">' +
            '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px"><div style="width:44px;height:44px;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(239,68,68,0.35);flex-shrink:0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="44" height="44"><rect width="100" height="100" rx="4" fill="#0d1b2a"/><rect x="12" y="18" width="22" height="30" rx="2" fill="none" stroke="#ef4444" stroke-width="2" opacity="0.8"/><rect x="39" y="18" width="22" height="30" rx="2" fill="none" stroke="#f59e0b" stroke-width="2" opacity="0.8"/><rect x="66" y="18" width="22" height="30" rx="2" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.8"/><circle cx="23" cy="28" r="3" fill="#ef4444" opacity="0.9"/><circle cx="50" cy="28" r="3" fill="#f59e0b" opacity="0.9"/><circle cx="77" cy="28" r="3" fill="#3b82f6" opacity="0.9"/><line x1="16" y1="35" x2="30" y2="35" stroke="#ef4444" stroke-width="1" opacity="0.4"/><line x1="16" y1="39" x2="28" y2="39" stroke="#ef4444" stroke-width="1" opacity="0.3"/><line x1="43" y1="35" x2="57" y2="35" stroke="#f59e0b" stroke-width="1" opacity="0.4"/><line x1="43" y1="39" x2="55" y2="39" stroke="#f59e0b" stroke-width="1" opacity="0.3"/><line x1="70" y1="35" x2="84" y2="35" stroke="#3b82f6" stroke-width="1" opacity="0.4"/><line x1="70" y1="39" x2="82" y2="39" stroke="#3b82f6" stroke-width="1" opacity="0.3"/><path d="M15 58 L30 52 L50 62 L70 48 L85 56" stroke="#22c55e" stroke-width="2" fill="none" opacity="0.7"/><circle cx="50" cy="72" r="8" fill="none" stroke="#ef4444" stroke-width="1.5" opacity="0.6"/><text x="50" y="76" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="9" font-weight="800" fill="#ef4444">!</text><text x="50" y="94" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="9" font-weight="800" letter-spacing="1" fill="#ef4444">PSEF-X</text></svg></div><div style="width:40px;height:40px;border-radius:10px;background:rgba(239,68,68,0.15);display:flex;align-items:center;justify-content:center"><i class="fas fa-chess" style="color:#ef4444;font-size:16px"></i></div><span style="position:absolute;top:12px;right:12px;background:rgba(239,68,68,0.1);color:#ef4444;font-size:9px;font-weight:600;padding:3px 8px;border-radius:6px;border:1px solid rgba(239,68,68,0.2)"><i class="fas fa-external-link-alt" style="margin-right:3px;font-size:7px"></i>Live</span></div>' +
            '<div class="hub-dl-card-name"><span style="background:linear-gradient(135deg,#dc2626,#ef4444);-webkit-background-clip:text;-webkit-text-fill-color:transparent">PSEF-X</span><span style="color:rgba(255,255,255,0.4);font-weight:400"> | </span><span style="background:linear-gradient(135deg,#dc2626,#ef4444);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Exercises KB</span></div>' +
            '<div class="hub-dl-card-desc">Interactive archive of 20 major war games &amp; pandemic simulations (1983\u20132025) — evidence cards, classified timelines, participant dossiers, findings &amp; legacy analysis.</div>' +
            '<div class="hub-dl-progress"><div class="hub-dl-progress-bar" style="width:100%;background:linear-gradient(90deg,#dc2626,#ef4444)"></div></div>' +
            '<div class="hub-dl-card-meta">' +
              '<span class="hub-dl-card-tag"><i class="fas fa-chess-board"></i>20 Exercises</span>' +
              '<span class="hub-dl-card-tag"><i class="fas fa-clock"></i>1983\u20132025</span>' +
              '<span class="hub-dl-card-tag"><i class="fas fa-biohazard"></i>5 Categories</span>' +
              '<span class="hub-dl-card-tag"><i class="fas fa-skull-crossbones"></i>2B+ Deaths</span>' +
            '</div>' +
            '<div class="hub-dl-card-actions">' +
              '<button class="hub-dl-btn hub-dl-btn-explore" style="background:linear-gradient(135deg,#dc2626,#ef4444);color:#fff" data-ext-url="https://psef-x.bior.tech/" onclick="event.stopPropagation();openExtUrl(this.dataset.extUrl)"><i class="fas fa-external-link-alt"></i> Explore</button>' +
            '</div>' +
          '</div>' +
          '<div class="hub-dl-card" style="border-color:rgba(0,168,107,0.15);border-top:3px solid #00A86B" data-ext-url="https://pandemic-strategy.pages.dev/countries" onclick="openExtUrl(this.dataset.extUrl)">' +
            '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px"><div style="width:44px;height:44px;border-radius:10px;background:rgba(0,168,107,0.15);display:flex;align-items:center;justify-content:center"><i class="fas fa-globe" style="color:#00A86B;font-size:16px"></i></div><span style="position:absolute;top:12px;right:12px;background:rgba(0,168,107,0.1);color:#00A86B;font-size:9px;font-weight:600;padding:3px 8px;border-radius:6px;border:1px solid rgba(0,168,107,0.2)"><i class="fas fa-external-link-alt" style="margin-right:3px;font-size:7px"></i>Live</span></div>' +
            '<div class="hub-dl-card-name"><span style="background:linear-gradient(135deg,#006C35,#22c55e);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Pandemic</span><span style="color:rgba(255,255,255,0.4);font-weight:400"> | </span><span style="background:linear-gradient(135deg,#006C35,#22c55e);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Strategy</span></div>' +
            '<div class="hub-dl-card-desc">Global Pandemic Preparedness Benchmark — 23 national strategies scored across 10 dimensions. UK base reference + 22 peer nations. Interactive guides, heatmap, ranking &amp; comparison tools.</div>' +
            '<div class="hub-dl-progress"><div class="hub-dl-progress-bar" style="width:100%;background:linear-gradient(90deg,#006C35,#22c55e)"></div></div>' +
            '<div class="hub-dl-card-meta">' +
              '<span class="hub-dl-card-tag"><i class="fas fa-flag"></i>23 Nations</span>' +
              '<span class="hub-dl-card-tag"><i class="fas fa-chart-bar"></i>10 Dimensions</span>' +
              '<span class="hub-dl-card-tag"><i class="fas fa-trophy"></i>🇬🇧 #1 Ranked</span>' +
              '<span class="hub-dl-card-tag"><i class="fas fa-globe"></i>Global</span>' +
            '</div>' +
            '<div class="hub-dl-card-actions">' +
              '<button class="hub-dl-btn hub-dl-btn-explore" style="background:linear-gradient(135deg,#006C35,#22c55e);color:#fff" data-ext-url="https://pandemic-strategy.pages.dev/countries" onclick="event.stopPropagation();openExtUrl(this.dataset.extUrl)"><i class="fas fa-eye"></i> Explore</button>' +
              
            '</div>' +
          '</div>' +          
          '</div>' +
        '</div>' +
      '</div>' +

      // ═══════════════════════════════════════════════
      // SECTION 3: RESEARCH ENGINES
      // ═══════════════════════════════════════════════
      '<div class="hub-section hub-sec-engines">' +
        '<div class="hub-section-header">' +
          '<div class="hub-section-label">' +
            '<div class="hub-section-title"><i class="fas fa-flask"></i> Research Engines<span class="hub-section-count">3</span></div>' +
            '<div class="hub-section-desc">Deep-research intelligence from RAND, DARPA &amp; GAO — curated publications and knowledge graphs</div>' +
          '</div>' +
        '</div>' +
        '<div class="hub-dl-grid">' +
          // RAND ENGIN
          '<div class="hub-dl-card" style="border-color:rgba(0,168,107,0.15)" data-ext-url="https://7aaa7896.data-library.pages.dev" onclick="openExtUrl(this.dataset.extUrl)">' +
            '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px"><div style="width:44px;height:44px;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,108,53,0.35);flex-shrink:0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="44" height="44"><rect width="100" height="100" rx="4" fill="#0d1b2a"/><path d="M0 58 Q50 30 100 20" stroke="#fff" stroke-width="3" fill="none" opacity="0.85"/><text x="50" y="72" text-anchor="middle" font-family="Georgia,serif" font-size="28" font-weight="700" letter-spacing="3" fill="#fff">RAND</text></svg></div><div style="width:40px;height:40px;border-radius:10px;background:rgba(0,168,107,0.15);display:flex;align-items:center;justify-content:center"><i class="fas fa-dna" style="color:#00A86B;font-size:16px"></i></div></div>' +
            '<div class="hub-dl-card-name"><span style="background:linear-gradient(135deg,#006C35,#22c55e);-webkit-background-clip:text;-webkit-text-fill-color:transparent">RAND</span><span style="color:rgba(255,255,255,0.4);font-weight:400"> | </span><span style="background:linear-gradient(135deg,#006C35,#22c55e);-webkit-background-clip:text;-webkit-text-fill-color:transparent">ENGIN</span></div>' +
            '<div class="hub-dl-card-desc">Bio-Domain Intelligence Dashboard — RAND Corporation research on biotechnology, biodefense, biosecurity, CBRN, biological threats, AI+Bio convergence. 7 domains, 20+ publications, interactive charts.</div>' +
            '<div class="hub-dl-progress"><div class="hub-dl-progress-bar" style="width:100%;background:linear-gradient(90deg,#006C35,#22c55e)"></div></div>' +
            '<div class="hub-dl-card-meta">' +
              '<span class="hub-dl-card-tag"><i class="fas fa-layer-group"></i>7 Domains</span>' +
              '<span class="hub-dl-card-tag"><i class="fas fa-book"></i>20+ Reports</span>' +
              '<span class="hub-dl-card-tag"><i class="fas fa-chart-radar"></i>8 Pages</span>' +
            '</div>' +
            '<div class="hub-dl-card-actions">' +
              '<button class="hub-dl-btn hub-dl-btn-explore" style="background:linear-gradient(135deg,#006C35,#22c55e);color:#fff" data-ext-url="https://7aaa7896.data-library.pages.dev" onclick="event.stopPropagation();openExtUrl(this.dataset.extUrl)"><i class="fas fa-external-link-alt"></i> Explore</button>' +
            '</div>' +
          '</div>' +
          // DARPA Knowledge Engine
          '<div class="hub-dl-card" style="border-color:rgba(0,168,107,0.15)" data-ext-url="https://data-library.bior.tech" onclick="openExtUrl(this.dataset.extUrl)">' +
            '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px"><div style="width:44px;height:44px;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,108,53,0.35);flex-shrink:0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="44" height="44"><rect width="100" height="100" rx="4" fill="#0d1b2a"/><polygon points="50,8 62,35 92,35 68,55 78,85 50,67 22,85 32,55 8,35 38,35" fill="none" stroke="#c8a84e" stroke-width="2.5" opacity="0.9"/><polygon points="50,18 58,35 78,35 62,48 68,68 50,56 32,68 38,48 22,35 42,35" fill="#c8a84e" opacity="0.15"/><text x="50" y="94" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="15" font-weight="800" letter-spacing="4" fill="#fff">DARPA</text></svg></div><div style="width:40px;height:40px;border-radius:10px;background:rgba(0,168,107,0.15);display:flex;align-items:center;justify-content:center"><i class="fas fa-rocket" style="color:#00A86B;font-size:16px"></i></div></div>' +
            '<div class="hub-dl-card-name"><span style="background:linear-gradient(135deg,#006C35,#22c55e);-webkit-background-clip:text;-webkit-text-fill-color:transparent">DARPA</span><span style="color:rgba(255,255,255,0.4);font-weight:400"> | </span><span style="background:linear-gradient(135deg,#006C35,#22c55e);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Knowledge Engine</span></div>' +
            '<div class="hub-dl-card-desc">Comprehensive DARPA intelligence — 39 verified timeline events, 20 major projects, 14 key personnel, 6 office deep-dives, BTO analysis, org hierarchy, interactive knowledge graph, trivia quiz &amp; agency comparison.</div>' +
            '<div class="hub-dl-progress"><div class="hub-dl-progress-bar" style="width:100%;background:linear-gradient(90deg,#006C35,#22c55e)"></div></div>' +
            '<div class="hub-dl-card-meta">' +
              '<span class="hub-dl-card-tag"><i class="fas fa-clock"></i>39 Events</span>' +
              '<span class="hub-dl-card-tag"><i class="fas fa-project-diagram"></i>20 Projects</span>' +
              '<span class="hub-dl-card-tag"><i class="fas fa-users"></i>14 People</span>' +
              '<span class="hub-dl-card-tag"><i class="fas fa-building"></i>6 Offices</span>' +
            '</div>' +
            '<div class="hub-dl-card-actions">' +
              '<button class="hub-dl-btn hub-dl-btn-explore" style="background:linear-gradient(135deg,#006C35,#22c55e);color:#fff" data-ext-url="https://data-library.bior.tech" onclick="event.stopPropagation();openExtUrl(this.dataset.extUrl)"><i class="fas fa-external-link-alt"></i> Explore</button>' +
            '</div>' +
          '</div>' +
          // GAO Engine
          '<div class="hub-dl-card" style="border-color:rgba(0,168,107,0.15)" data-ext-url="https://data.bior.tech" onclick="openExtUrl(this.dataset.extUrl)">' +
            '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px"><div style="width:44px;height:44px;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,108,53,0.35);flex-shrink:0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="44" height="44"><rect width="100" height="100" rx="4" fill="#0d1b2a"/><rect x="20" y="15" width="60" height="44" rx="3" fill="none" stroke="#006C35" stroke-width="2.5"/><line x1="20" y1="25" x2="80" y2="25" stroke="#006C35" stroke-width="1.5" opacity="0.5"/><rect x="25" y="29" width="50" height="3" rx="1" fill="#006C35" opacity="0.3"/><rect x="25" y="35" width="35" height="3" rx="1" fill="#006C35" opacity="0.3"/><rect x="25" y="41" width="45" height="3" rx="1" fill="#006C35" opacity="0.3"/><rect x="25" y="47" width="25" height="3" rx="1" fill="#006C35" opacity="0.3"/><text x="50" y="82" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="13" font-weight="800" letter-spacing="2" fill="#006C35">GAO</text><text x="50" y="94" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="7" font-weight="600" letter-spacing="1.5" fill="rgba(255,255,255,0.5)">ENGINE</text></svg></div><div style="width:40px;height:40px;border-radius:10px;background:rgba(0,168,107,0.15);display:flex;align-items:center;justify-content:center"><i class="fas fa-landmark" style="color:#00A86B;font-size:16px"></i></div></div>' +
            '<div class="hub-dl-card-name"><span style="background:linear-gradient(135deg,#006C35,#22c55e);-webkit-background-clip:text;-webkit-text-fill-color:transparent">GAO</span><span style="color:rgba(255,255,255,0.4);font-weight:400"> | </span><span style="background:linear-gradient(135deg,#006C35,#22c55e);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Engine</span></div>' +
            '<div class="hub-dl-card-desc">Government Accountability Office analysis platform — 156 verified documents, 87 reports, 985 recommendations, 69 Bio-CBRN reports, 30 topics. Full-text search, sortable data tables, direct GAO.gov links.</div>' +
            '<div class="hub-dl-progress"><div class="hub-dl-progress-bar" style="width:100%;background:linear-gradient(90deg,#006C35,#22c55e)"></div></div>' +
            '<div class="hub-dl-card-meta">' +
              '<span class="hub-dl-card-tag"><i class="fas fa-file-alt"></i>156 Docs</span>' +
              '<span class="hub-dl-card-tag"><i class="fas fa-clipboard-check"></i>985 Recs</span>' +
              '<span class="hub-dl-card-tag"><i class="fas fa-biohazard"></i>69 Bio-CBRN</span>' +
              '<span class="hub-dl-card-tag"><i class="fas fa-tags"></i>30 Topics</span>' +
            '</div>' +
            '<div class="hub-dl-card-actions">' +
              '<button class="hub-dl-btn hub-dl-btn-explore" style="background:linear-gradient(135deg,#006C35,#22c55e);color:#fff" data-ext-url="https://data.bior.tech" onclick="event.stopPropagation();openExtUrl(this.dataset.extUrl)"><i class="fas fa-external-link-alt"></i> Explore</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      // ═══════════════════════════════════════════════
      // SECTION 4: ANALYTICAL TOOLS
      // ═══════════════════════════════════════════════
      '<div class="hub-section hub-sec-tools">' +
        '<div class="hub-section-header">' +
          '<div class="hub-section-label">' +
            '<div class="hub-section-title"><i class="fas fa-tools"></i> Analytical Tools<span class="hub-section-count">1</span></div>' +
            '<div class="hub-section-desc">Research workflow instruments — systematic review, literature search &amp; meta-analysis</div>' +
          '</div>' +
        '</div>' +
        '<div class="hub-dl-grid">' +
          // SR Toolkit
          '<div class="hub-dl-card" style="border-color:rgba(0,168,107,0.15)" data-ext-url="https://sr-toolkit.pages.dev" onclick="openExtUrl(this.dataset.extUrl)">' +
            '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px"><div style="width:44px;height:44px;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,108,53,0.35);flex-shrink:0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="44" height="44"><rect width="100" height="100" rx="4" fill="#0d1b2a"/><rect x="18" y="18" width="28" height="36" rx="3" fill="none" stroke="#006C35" stroke-width="2"/><line x1="23" y1="26" x2="42" y2="26" stroke="#006C35" stroke-width="1.5" opacity="0.5"/><line x1="23" y1="32" x2="38" y2="32" stroke="#006C35" stroke-width="1" opacity="0.35"/><line x1="23" y1="38" x2="40" y2="38" stroke="#006C35" stroke-width="1" opacity="0.35"/><line x1="23" y1="44" x2="36" y2="44" stroke="#006C35" stroke-width="1" opacity="0.35"/><rect x="54" y="22" width="28" height="36" rx="3" fill="none" stroke="#22c55e" stroke-width="2"/><line x1="59" y1="30" x2="78" y2="30" stroke="#22c55e" stroke-width="1.5" opacity="0.5"/><line x1="59" y1="36" x2="74" y2="36" stroke="#22c55e" stroke-width="1" opacity="0.35"/><line x1="59" y1="42" x2="76" y2="42" stroke="#22c55e" stroke-width="1" opacity="0.35"/><line x1="59" y1="48" x2="72" y2="48" stroke="#22c55e" stroke-width="1" opacity="0.35"/><path d="M46 35 L54 35" stroke="#22c55e" stroke-width="2" opacity="0.8" stroke-dasharray="2 2"/><circle cx="50" cy="70" r="3" fill="#22c55e" opacity="0.9"/><circle cx="38" cy="66" r="2" fill="#006C35" opacity="0.7"/><circle cx="62" cy="66" r="2" fill="#006C35" opacity="0.7"/><line x1="40" y1="67" x2="48" y2="69" stroke="#006C35" stroke-width="1" opacity="0.4"/><line x1="52" y1="69" x2="60" y2="67" stroke="#006C35" stroke-width="1" opacity="0.4"/><text x="50" y="92" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="10" font-weight="800" letter-spacing="1" fill="#006C35">SR TOOLKIT</text></svg></div><div style="width:40px;height:40px;border-radius:10px;background:rgba(0,168,107,0.15);display:flex;align-items:center;justify-content:center"><i class="fas fa-search" style="color:#00A86B;font-size:16px"></i></div></div>' +
            '<div class="hub-dl-card-name"><span style="background:linear-gradient(135deg,#006C35,#22c55e);-webkit-background-clip:text;-webkit-text-fill-color:transparent">SR</span><span style="color:rgba(255,255,255,0.4);font-weight:400"> | </span><span style="background:linear-gradient(135deg,#006C35,#22c55e);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Toolkit</span></div>' +
            '<div class="hub-dl-card-desc">Systematic Literature Review &amp; Meta-Analysis Toolkit — 12 tools across 4 PRISMA phases, literature search across 240M+ papers (OpenAlex, Semantic Scholar, PubMed), WBE guide, pipeline combos &amp; analytics.</div>' +
            '<div class="hub-dl-progress"><div class="hub-dl-progress-bar" style="width:100%;background:linear-gradient(90deg,#006C35,#22c55e)"></div></div>' +
            '<div class="hub-dl-card-meta">' +
              '<span class="hub-dl-card-tag"><i class="fas fa-tools"></i>12 Tools</span>' +
              '<span class="hub-dl-card-tag"><i class="fas fa-layer-group"></i>4 Phases</span>' +
              '<span class="hub-dl-card-tag"><i class="fas fa-search"></i>240M+ Papers</span>' +
            '</div>' +
            '<div class="hub-dl-card-actions">' +
              '<button class="hub-dl-btn hub-dl-btn-explore" style="background:linear-gradient(135deg,#006C35,#22c55e);color:#fff" data-ext-url="https://sr-toolkit.pages.dev" onclick="event.stopPropagation();openExtUrl(this.dataset.extUrl)"><i class="fas fa-external-link-alt"></i> Explore</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      // ═══════════════════════════════════════════════
      // SECTION 5: DATA WORKSPACE (Admin-only)
      // ═══════════════════════════════════════════════
      (isAdmin ?
      '<div class="hub-section hub-sec-data">' +
        '<div class="hub-section-header">' +
          '<div class="hub-section-label">' +
            '<div class="hub-section-title"><i class="fas fa-database"></i> Data Workspace<span class="hub-section-count" id="hubDsCountBadge">—</span></div>' +
            '<div class="hub-section-desc">Custom datasets, CSV imports &amp; structured data tables</div>' +
          '</div>' +
          '<div style="display:flex;gap:8px">' +
            '<button class="hub-section-btn" style="background:rgba(56,189,248,0.08);color:#38bdf8;border-color:rgba(56,189,248,0.2)" onclick="openDatasetCompare()"><i class="fas fa-code-compare"></i> Compare</button>' +
            '<button class="hub-section-btn" onclick="showCreateDatasetModal()"><i class="fas fa-plus"></i> New Dataset</button>' +
          '</div>' +
        '</div>' +
        '<div class="hub-dl-scroll" id="dataLibraryCards">' +
          '<div class="hub-dl-loading"><i class="fas fa-circle-notch fa-spin"></i> Loading datasets...</div>' +
        '</div>' +
      '</div>' : '') +

      // WORKSPACE PROJECTS section header
      '<div class="hub-section">' +
        '<div class="hub-section-header">' +
          '<div class="hub-section-label"><i class="fas fa-folder-open"></i> WORKSPACES</div>' +
        '</div>' +
      '</div>' +

      '<div class="hub-grid">' +
      projects.map(function(p) {
        const isActive = p.id === 'dashboard' || p.type === 'external';
        const statusColor = isActive ? (p.type === 'external' ? (p.color||'#3b82f6') : '#00A86B') : 'rgba(255,255,255,0.2)';
        const statusText = p.status || (isActive ? 'Active' : 'Not Started');
        const externalBadge = p.type === 'external' ? '<span style="position:absolute;top:12px;right:12px;background:' + (p.color||'#3b82f6') + '25;color:' + (p.color||'#3b82f6') + ';font-size:9px;font-weight:600;padding:3px 8px;border-radius:6px;letter-spacing:0.5px;text-transform:uppercase;border:1px solid ' + (p.color||'#3b82f6') + '30"><i class="fas fa-external-link-alt" style="margin-right:4px;font-size:8px"></i>Live</span>' : '';
        return '<div class="hub-card' + (isActive?' hub-card-active':'') + '" style="--card-glow:' + (p.color||'#00A86B') + '15;--card-border:' + (p.color||'#00A86B') + '50" onclick="enterProject(\\'' + p.id + '\\\')">'  +
          externalBadge +
          '<div class="hub-card-icon" style="background:' + (p.color||'#00A86B') + '20"><i class="fas ' + (p.icon||'fa-folder') + '" style="color:' + (p.color||'#00A86B') + '"></i></div>' +
          '<div class="hub-card-name">' + p.name + '</div>' +
          '<div class="hub-card-desc">' + (p.description||'Empty workspace') + '</div>' +
          '<div class="hub-card-meta">' +
            '<div class="hub-card-stats">' +
              '<span class="hub-card-stat"><i class="fas fa-cubes"></i>' + (p.modules||0) + ' modules</span>' +
              '<span class="hub-card-status"><span class="dot" style="background:' + statusColor + (isActive?';box-shadow:0 0 6px '+statusColor:'') + '"></span>' + statusText + '</span>' +
            '</div>' +
            '<span class="hub-card-enter">' + (p.type === 'external' ? 'Open <i class="fas fa-external-link-alt"></i>' : 'Enter <i class="fas fa-arrow-right"></i>') + '</span>' +
          '</div>' +
        '</div>';
      }).join('') +

      // Add New Project card
      '<div class="hub-card hub-card-add" onclick="showAddProjectModal()">' +
        '<div class="hub-card-add-icon"><i class="fas fa-plus"></i></div>' +
        '<div class="hub-card-add-title">Add New Project</div>' +
        '<div class="hub-card-add-desc">Create a new workspace</div>' +
      '</div>' +

      '</div>' + // end grid
    '</div>' + // end body

    // Footer
    '<div class="hub-footer">' +
      '<div class="hub-footer-left">' +
        '<span><i class="fas fa-cubes"></i> ' + projects.length + ' Projects</span>' +
        (isAdmin ? '<span id="hubDsCount"><i class="fas fa-database"></i> — Datasets</span>' : '') +
        '<span><i class="fas fa-globe"></i> bior.tech</span>' +
        '<span><i class="fas fa-code-branch"></i> v5.2</span>' +
      '</div>' +
      '<div class="hub-footer-right">&copy; 2026 BioR Platform</div>' +
    '</div>' +

    // Modal container
    '<div id="hubModal"></div>' +
  '</div>';
}

function initHubHandlers() {
  // Expose global functions for hub
  window.showAddProjectModal = function() {
    const icons = ['fa-flask','fa-microscope','fa-vials','fa-laptop-medical','fa-bacteria','fa-virus','fa-hospital','fa-syringe','fa-pills','fa-stethoscope','fa-heartbeat','fa-chart-line','fa-project-diagram','fa-satellite-dish','fa-shield-virus'];
    const colors = ['#3b82f6','#8b5cf6','#f59e0b','#ef4444','#ec4899','#06b6d4','#10b981','#f97316','#6366f1','#14b8a6'];
    const modalEl = document.getElementById('hubModal');
    if(!modalEl) return;
    modalEl.innerHTML =
      '<div class="hub-modal-overlay" onclick="if(event.target===this)closeHubModal()">' +
      '<div class="hub-modal">' +
        '<h3><i class="fas fa-plus-circle mr-2" style="color:#00A86B"></i>Create New Project</h3>' +
        '<p>Set up a new workspace for your biosurveillance module or research project.</p>' +
        '<div><label>Project Name</label><input type="text" id="newProjectName" placeholder="e.g., AMR Surveillance" maxlength="40" /></div>' +
        '<div><label>Description</label><textarea id="newProjectDesc" placeholder="Brief description of this project..." maxlength="200"></textarea></div>' +
        '<div><label>Icon</label><div class="hub-icon-picker" id="iconPicker">' +
        icons.map(function(ic,i) { return '<div class="hub-icon-opt' + (i===0?' selected':'') + '" data-icon="' + ic + '" onclick="selectHubIcon(this)"><i class="fas ' + ic + '"></i></div>'; }).join('') +
        '</div></div>' +
        '<div class="hub-modal-actions">' +
          '<button class="hub-modal-btn hub-modal-btn-cancel" onclick="closeHubModal()">Cancel</button>' +
          '<button class="hub-modal-btn hub-modal-btn-primary" onclick="createNewProject()"><i class="fas fa-plus mr-1"></i>Create Project</button>' +
        '</div>' +
      '</div></div>';
    setTimeout(function() { var el = document.getElementById('newProjectName'); if(el) el.focus(); }, 100);
  };

  window.selectHubIcon = function(el) {
    document.querySelectorAll('.hub-icon-opt').forEach(function(e) { e.classList.remove('selected'); });
    el.classList.add('selected');
  };

  window.closeHubModal = function() {
    var m = document.getElementById('hubModal');
    if(m) m.innerHTML = '';
  };

  window.createNewProject = function() {
    var name = (document.getElementById('newProjectName')?.value || '').trim();
    if (!name) { document.getElementById('newProjectName').style.borderColor='#ef4444'; return; }
    var desc = (document.getElementById('newProjectDesc')?.value || '').trim() || 'Empty workspace ready for configuration.';
    var iconEl = document.querySelector('.hub-icon-opt.selected');
    var icon = iconEl ? iconEl.dataset.icon : 'fa-folder';
    var colors = ['#3b82f6','#8b5cf6','#f59e0b','#ef4444','#ec4899','#06b6d4','#10b981','#f97316','#6366f1','#14b8a6'];
    var color = colors[state.projects.length % colors.length];
    var id = 'project-' + Date.now().toString(36);
    state.projects.push({ id: id, name: name, description: desc, icon: icon, color: color, modules: 0, status: 'Not Started', type: 'user' });
    saveProjects();
    closeHubModal();
    render();
  };
}

// ===== HUB QUICK STATS (live from D1) =====
async function loadHubQuickStats() {
  var el = document.getElementById('hubQuickStats');
  if(!el) return;
  try {
    var d = await api('/api/dashboard');
    if(d.error) return;
    var sites = d.totalSites || 0;
    var threats = d.activeThreats || 0;
    var samples = d.genomicSequences || 0;
    var alerts = d.activeAlerts || 0;
    el.innerHTML =
      '<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:10px">' +
      '<div class="hub-stat-card" style="padding:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px"><div style="display:flex;align-items:center;gap:8px"><div style="width:32px;height:32px;border-radius:10px;background:rgba(0,168,107,0.12);display:flex;align-items:center;justify-content:center"><i class="fas fa-satellite-dish" style="color:#00A86B;font-size:12px"></i></div><div><p style="font-size:9px;color:rgba(255,255,255,0.35);text-transform:uppercase;margin:0">Sites</p><p style="font-size:16px;font-weight:700;color:#fff;margin:0">' + sites + '</p></div></div></div>' +
      '<div class="hub-stat-card" style="padding:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px"><div style="display:flex;align-items:center;gap:8px"><div style="width:32px;height:32px;border-radius:10px;background:rgba(239,68,68,0.12);display:flex;align-items:center;justify-content:center"><i class="fas fa-biohazard" style="color:#ef4444;font-size:12px"></i></div><div><p style="font-size:9px;color:rgba(255,255,255,0.35);text-transform:uppercase;margin:0">Threats</p><p style="font-size:16px;font-weight:700;color:#fff;margin:0">' + threats + '</p></div></div></div>' +
      '<div class="hub-stat-card" style="padding:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px"><div style="display:flex;align-items:center;gap:8px"><div style="width:32px;height:32px;border-radius:10px;background:rgba(139,92,246,0.12);display:flex;align-items:center;justify-content:center"><i class="fas fa-dna" style="color:#8b5cf6;font-size:12px"></i></div><div><p style="font-size:9px;color:rgba(255,255,255,0.35);text-transform:uppercase;margin:0">Samples</p><p style="font-size:16px;font-weight:700;color:#fff;margin:0">' + samples + '</p></div></div></div>' +
      '<div class="hub-stat-card" style="padding:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px"><div style="display:flex;align-items:center;gap:8px"><div style="width:32px;height:32px;border-radius:10px;background:rgba(245,158,11,0.12);display:flex;align-items:center;justify-content:center"><i class="fas fa-bell" style="color:#f59e0b;font-size:12px"></i></div><div><p style="font-size:9px;color:rgba(255,255,255,0.35);text-transform:uppercase;margin:0">Alerts</p><p style="font-size:16px;font-weight:700;color:#fff;margin:0">' + alerts + '</p></div></div></div>' +
      '<div class="hub-stat-card" style="padding:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;cursor:pointer" data-nav="analytics" onclick="navigate(this.dataset.nav)""><div style="display:flex;align-items:center;gap:8px"><div style="width:32px;height:32px;border-radius:10px;background:rgba(139,92,246,0.12);display:flex;align-items:center;justify-content:center"><i class="fas fa-brain" style="color:#8b5cf6;font-size:12px"></i></div><div><p style="font-size:9px;color:rgba(255,255,255,0.35);text-transform:uppercase;margin:0">Analytics</p><p id="hubAnalyticsScore" style="font-size:16px;font-weight:700;color:#fff;margin:0">\u2014</p></div></div></div>' +
      '<div class="hub-stat-card" style="padding:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;cursor:pointer" onclick="openGeoIntelView()"><div style="display:flex;align-items:center;gap:8px"><div style="width:32px;height:32px;border-radius:10px;background:rgba(6,182,212,0.12);display:flex;align-items:center;justify-content:center"><i class="fas fa-globe-americas" style="color:#06b6d4;font-size:12px"></i></div><div><p style="font-size:9px;color:rgba(255,255,255,0.35);text-transform:uppercase;margin:0">GeoIntel</p><p style="font-size:16px;font-weight:700;color:#fff;margin:0">10 Layers</p></div></div></div>' +
      '</div>';
    // Load analytics score for hub
    api('/api/analytics').then(function(a) {
      var el2 = document.getElementById('hubAnalyticsScore');
      if (el2 && a.nationalRisk) el2.innerHTML = '<span style="color:' + a.nationalRisk.color + '">' + a.nationalRisk.score + '</span>';
    }).catch(function(){});
  } catch(e) {}
}

// ===== EMPTY PROJECT WORKSPACE =====
function renderEmptyProject() {
  const p = getAllProjects().find(function(x) { return x.id === state.currentProject; });
  if (!p) { navigateToHub(); return ''; }
  const u = state.user || {};
  const isUserProject = p.type === 'user' || !defaultProjects.find(function(d) { return d.id === p.id; });

  return '<div class="hub-page">' +
    '<style>' +
    '.ep-header{padding:16px 32px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--bior-border-subtle);background:var(--bior-glass-bg);backdrop-filter:blur(20px);}' +
    '.ep-back{display:flex;align-items:center;gap:10px;cursor:pointer;color:rgba(255,255,255,0.5);font-size:12px;font-weight:500;transition:color 0.2s;}' +
    '.ep-back:hover{color:#00A86B;}' +
    '.ep-back-icon{width:32px;height:32px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;transition:all 0.2s;}' +
    '.ep-back:hover .ep-back-icon{background:rgba(0,168,107,0.1);border-color:rgba(0,168,107,0.3);}' +
    '.ep-title{font-size:15px;font-weight:700;color:#fff;display:flex;align-items:center;gap:10px;}' +
    '.ep-title-icon{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;}' +
    '.ep-body{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:calc(100vh - 60px);padding:40px;text-align:center;}' +
    '.ep-empty-icon{width:100px;height:100px;border-radius:28px;border:2px dashed rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:36px;color:rgba(255,255,255,0.1);margin-bottom:28px;}' +
    '.ep-empty-title{font-size:22px;font-weight:700;color:rgba(255,255,255,0.7);margin-bottom:8px;}' +
    '.ep-empty-desc{font-size:13px;color:rgba(255,255,255,0.3);max-width:420px;line-height:1.7;margin-bottom:32px;}' +
    '.ep-actions{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;}' +
    '.ep-action-btn{padding:10px 20px;border-radius:12px;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;border:none;font-family:Inter,sans-serif;display:flex;align-items:center;gap:8px;}' +
    '.ep-action-primary{background:linear-gradient(135deg,#00A86B,#008F5B);color:#fff;}' +
    '.ep-action-primary:hover{box-shadow:0 4px 20px rgba(0,168,107,0.3);transform:translateY(-1px);}' +
    '.ep-action-secondary{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.1);}' +
    '.ep-action-secondary:hover{background:rgba(255,255,255,0.1);}' +
    '.ep-action-danger{background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid rgba(239,68,68,0.2);}' +
    '.ep-action-danger:hover{background:rgba(239,68,68,0.15);}' +
    '</style>' +

    '<div class="ep-header">' +
      '<div class="ep-back" onclick="navigateToHub()">' +
        '<div class="ep-back-icon"><i class="fas fa-arrow-left" style="font-size:11px"></i></div>' +
        '<span>Back to Projects</span>' +
      '</div>' +
      '<div class="ep-title">' +
        '<div class="ep-title-icon" style="background:' + (p.color||'#3b82f6') + '20"><i class="fas ' + (p.icon||'fa-folder') + '" style="color:' + (p.color||'#3b82f6') + ';font-size:14px"></i></div>' +
        p.name +
      '</div>' +
      '<div style="width:120px"></div>' +
    '</div>' +

    '<div class="ep-body">' +
      '<div class="ep-empty-icon"><i class="fas ' + (p.icon||'fa-folder') + '"></i></div>' +
      '<div class="ep-empty-title">' + p.name + '</div>' +
      '<div class="ep-empty-desc">This project workspace is empty and ready for configuration. Future modules and features can be added here to extend the BioR platform.</div>' +
      '<div class="ep-actions">' +
        '<button class="ep-action-btn ep-action-primary" onclick="navigateToHub()"><i class="fas fa-arrow-left"></i>Back to Hub</button>' +
        (isUserProject ? '<button class="ep-action-btn ep-action-danger" onclick="deleteProject(\\'' + p.id + '\\\')"><i class="fas fa-trash"></i>Delete Project</button>' : '') +
      '</div>' +
    '</div>' +
  '</div>';
}

window.deleteProject = function(id) {
  if (!confirm('Delete this project? This cannot be undone.')) return;
  state.projects = state.projects.filter(function(p) { return p.id !== id; });
  saveProjects();
  navigateToHub();
};

// Make hub navigation globally available
window.navigateToHub = navigateToHub;
window.enterProject = enterProject;

// ===== DATA LIBRARY (Admin-only) =====
async function loadDataLibrary() {
  const container = document.getElementById('dataLibraryCards');
  if (!container) return;
  try {
    const d = await api('/api/datasets');
    state.datasetCache = d.datasets || [];
    const datasets = state.datasetCache;
    // Update footer count
    const fc = document.getElementById('hubDsCount');
    if (fc) fc.innerHTML = '<i class="fas fa-database"></i> ' + datasets.length + ' Datasets';

    if (datasets.length === 0) {
      container.innerHTML =
        '<div class="hub-dl-card hub-dl-add" onclick="showCreateDatasetModal()">' +
          '<div class="hub-dl-add-icon"><i class="fas fa-plus"></i></div>' +
          '<div class="hub-dl-add-title">Add Your First Dataset</div>' +
          '<div class="hub-dl-add-desc">Import CSV or create manually</div>' +
        '</div>';
      return;
    }

    container.innerHTML = datasets.map(function(ds) {
      var cols = [];
      try { cols = typeof ds.columns_def === 'string' ? JSON.parse(ds.columns_def) : (ds.columns_def||[]); } catch(e) { cols = []; }
      var pct = ds.status === 'active' ? 100 : 50;
      var pctColor = pct === 100 ? '#00A86B' : '#f59e0b';
      return '<div class="hub-dl-card" onclick="openDatasetExplorer(\\'' + ds.id + '\\\')">' +
        '<div class="hub-dl-card-icon" style="background:' + (ds.color||'#3b82f6') + '20"><i class="fas ' + (ds.icon||'fa-database') + '" style="color:' + (ds.color||'#3b82f6') + '"></i></div>' +
        '<div class="hub-dl-card-name">' + ds.name + '</div>' +
        '<div class="hub-dl-card-desc">' + (ds.description || 'No description') + '</div>' +
        '<div class="hub-dl-progress"><div class="hub-dl-progress-bar" style="width:' + pct + '%;background:' + pctColor + '"></div></div>' +
        '<div class="hub-dl-card-meta">' +
          '<span class="hub-dl-card-tag"><i class="fas fa-table"></i>' + (ds.row_count||0) + ' rows &middot; ' + cols.length + ' col</span>' +
          '<span class="hub-dl-card-tag"><i class="fas fa-code-branch"></i>' + (ds.version_count||1) + ' ver</span>' +
          '<span class="hub-dl-card-tag"><i class="fas fa-link"></i>' + (ds.project_count||0) + ' proj</span>' +
        '</div>' +
        '<div class="hub-dl-card-actions">' +
          '<button class="hub-dl-btn hub-dl-btn-explore" onclick="event.stopPropagation();openDatasetExplorer(\\'' + ds.id + '\\\')">Explore</button>' +
          '<button class="hub-dl-btn hub-dl-btn-more" onclick="event.stopPropagation();deleteDataset(\\'' + ds.id + '\\',\\'' + ds.name.replace(/'/g,'') + '\\\')"><i class="fas fa-trash"></i></button>' +
        '</div>' +
      '</div>';
    }).join('') +
    // Add Dataset card
    '<div class="hub-dl-card hub-dl-add" onclick="showCreateDatasetModal()">' +
      '<div class="hub-dl-add-icon"><i class="fas fa-plus"></i></div>' +
      '<div class="hub-dl-add-title">Add Dataset</div>' +
      '<div class="hub-dl-add-desc">Import CSV or create manually</div>' +
    '</div>';
    // Update badge count
    var badge = document.getElementById('hubDsCountBadge');
    if (badge) badge.textContent = datasets.length;
  } catch(e) {
    container.innerHTML = '<div class="hub-dl-loading" style="color:#ef4444"><i class="fas fa-exclamation-triangle"></i> Failed to load datasets</div>';
  }
}

window.openDatasetExplorer = function(id) {
  state.currentDataset = id;
  state.currentView = 'dataset-explorer';
  pushSpaState();
  render();
};

window.deleteDataset = async function(id, name) {
  if (!confirm('Delete dataset "' + name + '"? This cannot be undone.')) return;
  await api('/api/datasets/' + id, { method: 'DELETE' });
  showToast('Dataset deleted', 'success');
  loadDataLibrary();
};

window.showCreateDatasetModal = function() {
  var icons = ['fa-database','fa-chart-bar','fa-flask','fa-microscope','fa-dna','fa-vials','fa-chart-line','fa-table','fa-file-csv','fa-clipboard-list','fa-project-diagram','fa-heartbeat','fa-virus','fa-bacteria','fa-pills'];
  var colors = ['#3b82f6','#8b5cf6','#f59e0b','#ef4444','#ec4899','#06b6d4','#10b981','#f97316','#6366f1','#14b8a6'];
  var modalEl = document.getElementById('hubModal');
  if(!modalEl) return;
  modalEl.innerHTML =
    '<div class="hub-modal-overlay" onclick="if(event.target===this)closeHubModal()">' +
    '<div class="hub-modal" style="max-width:520px">' +
      '<h3><i class="fas fa-database mr-2" style="color:#3b82f6"></i>Create New Dataset</h3>' +
      '<p>Import data from CSV or create a blank dataset with column definitions.</p>' +
      '<div><label>Dataset Name</label><input type="text" id="dsName" placeholder="e.g., Benchmark Analysis Q1 2026" maxlength="60" /></div>' +
      '<div><label>Description</label><textarea id="dsDesc" placeholder="What does this dataset contain?" maxlength="300" style="min-height:50px"></textarea></div>' +
      '<div style="display:flex;gap:12px;margin-bottom:14px"><div style="flex:1"><label>Icon</label><div class="hub-icon-picker" id="dsIconPicker">' +
      icons.map(function(ic,i) { return '<div class="hub-icon-opt' + (i===0?' selected':'') + '" data-icon="' + ic + '" onclick="selectDsIcon(this)"><i class="fas ' + ic + '"></i></div>'; }).join('') +
      '</div></div><div style="flex:1"><label>Color</label><div class="hub-icon-picker" id="dsColorPicker">' +
      colors.map(function(cl,i) { return '<div class="hub-icon-opt' + (i===0?' selected':'') + '" data-color="' + cl + '" onclick="selectDsColor(this)" style="background:' + cl + '20;border-color:' + (i===0?cl:'rgba(255,255,255,0.08)') + '"><div style="width:14px;height:14px;border-radius:50%;background:' + cl + '"></div></div>'; }).join('') +
      '</div></div></div>' +
      '<div><label>Paste CSV Data (with header row)</label><textarea id="dsCsvData" placeholder="id,pathogen,method,sensitivity,specificity,region&#10;BM-001,SARS-CoV-2,RT-PCR,98.5,99.1,Riyadh&#10;BM-002,MERS-CoV,NGS,94.2,97.8,Eastern" style="min-height:120px;font-family:monospace;font-size:11px;white-space:pre;overflow-x:auto"></textarea></div>' +
      '<div id="dsCsvPreview" style="font-size:11px;color:rgba(255,255,255,0.3);margin-bottom:10px"></div>' +
      '<div class="hub-modal-actions">' +
        '<button class="hub-modal-btn hub-modal-btn-cancel" onclick="closeHubModal()">Cancel</button>' +
        '<button class="hub-modal-btn hub-modal-btn-primary" onclick="createDataset()" id="dsCreateBtn"><i class="fas fa-plus mr-1"></i>Create Dataset</button>' +
      '</div>' +
    '</div></div>';

  // Auto-detect CSV on input
  var ta = document.getElementById('dsCsvData');
  if (ta) ta.addEventListener('input', function() { parseCsvPreview(); });
  setTimeout(function() { var el = document.getElementById('dsName'); if(el) el.focus(); }, 100);
};

window.selectDsIcon = function(el) {
  document.querySelectorAll('#dsIconPicker .hub-icon-opt').forEach(function(e) { e.classList.remove('selected'); });
  el.classList.add('selected');
};
window.selectDsColor = function(el) {
  document.querySelectorAll('#dsColorPicker .hub-icon-opt').forEach(function(e) { e.classList.remove('selected'); e.style.borderColor='rgba(255,255,255,0.08)'; });
  el.classList.add('selected');
  el.style.borderColor = el.dataset.color;
};

function parseCsvPreview() {
  var ta = document.getElementById('dsCsvData');
  var preview = document.getElementById('dsCsvPreview');
  if (!ta || !preview) return { columns: [], rows: [] };
  var text = ta.value.trim();
  if (!text) { preview.innerHTML = ''; return { columns: [], rows: [] }; }
  var lines = text.split('\\n').filter(function(l) { return l.trim(); });
  if (lines.length < 1) { preview.innerHTML = ''; return { columns: [], rows: [] }; }
  var headers = lines[0].split(',').map(function(h) { return h.trim().replace(/^"|"$/g, ''); });
  var dataLines = lines.slice(1);
  var rows = dataLines.map(function(line) {
    var vals = line.split(',').map(function(v) { return v.trim().replace(/^"|"$/g, ''); });
    var obj = {};
    headers.forEach(function(h, i) { obj[h] = vals[i] || ''; });
    return obj;
  });
  // Detect column types
  var columns = headers.map(function(h) {
    var type = 'text';
    var numCount = 0;
    rows.forEach(function(r) { if (r[h] && !isNaN(parseFloat(r[h])) && isFinite(r[h])) numCount++; });
    if (rows.length > 0 && numCount / rows.length > 0.7) type = 'number';
    return { name: h, type: type };
  });
  preview.innerHTML = '<i class="fas fa-check-circle" style="color:#00A86B"></i> Auto-detected: <strong>' + columns.length + ' columns</strong>, <strong>' + rows.length + ' rows</strong> &mdash; ' + columns.map(function(c) { return c.name + ' <span style="color:' + (c.type==='number'?'#f59e0b':'#3b82f6') + '">(' + c.type + ')</span>'; }).join(', ');
  return { columns: columns, rows: rows };
}

window.createDataset = async function() {
  var name = (document.getElementById('dsName')?.value || '').trim();
  if (!name) { document.getElementById('dsName').style.borderColor='#ef4444'; return; }
  var desc = (document.getElementById('dsDesc')?.value || '').trim();
  var iconEl = document.querySelector('#dsIconPicker .hub-icon-opt.selected');
  var icon = iconEl ? iconEl.dataset.icon : 'fa-database';
  var colorEl = document.querySelector('#dsColorPicker .hub-icon-opt.selected');
  var color = colorEl ? colorEl.dataset.color : '#3b82f6';
  var parsed = parseCsvPreview();
  if (!parsed.columns || parsed.columns.length === 0) {
    // Create blank dataset with manual columns
    parsed = { columns: [{ name: 'id', type: 'text' }, { name: 'value', type: 'text' }], rows: [] };
  }
  var btn = document.getElementById('dsCreateBtn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-1"></i>Creating...'; }
  var result = await api('/api/datasets', {
    method: 'POST',
    body: JSON.stringify({ name: name, description: desc, icon: icon, color: color, columns: parsed.columns, rows: parsed.rows, notes: 'Initial import' })
  });
  if (result.error) { showToast('Error: ' + result.error, 'error'); if(btn) { btn.disabled=false; btn.innerHTML='<i class="fas fa-plus mr-1"></i>Create Dataset'; } return; }
  closeHubModal();
  showToast('Dataset "' + name + '" created with ' + (result.rowCount||0) + ' rows', 'success');
  loadDataLibrary();
};

  `;
}
