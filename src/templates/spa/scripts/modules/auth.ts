// =============================================================================
// BioR Platform - Login Form & Authentication Handlers
// =============================================================================

export function getAuthJS(): string {
  return `
// ===== SKELETON LOADER =====
function showSkeleton(el) {
  el.innerHTML =
    '<div class="page-transition"><div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">' +
    [1,2,3,4].map(() => '<div class="skeleton-card"><div class="flex items-center justify-between mb-3"><div class="skeleton skeleton-line w-1-3" style="height:10px"></div><div class="skeleton skeleton-circle" style="width:32px;height:32px"></div></div><div class="skeleton skeleton-line w-1-2" style="height:24px;margin-bottom:6px"></div><div class="skeleton skeleton-line w-2-3" style="height:10px"></div></div>').join('') +
    '</div><div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">' +
    '<div class="skeleton-card"><div class="skeleton skeleton-line w-1-2 mb-4" style="height:10px"></div><div class="skeleton skeleton-rect"></div></div>' +
    '<div class="lg:col-span-2 skeleton-card"><div class="skeleton skeleton-line w-1-3 mb-4" style="height:10px"></div><div class="skeleton skeleton-rect" style="height:340px"></div></div>' +
    '</div></div>';
}

// ===== LOGIN (70/30 split — matches standalone /login page) =====
function renderLogin() {
  return '<div class="login-page"><style>' +
    // Base
    '.login-page{min-height:100vh;display:grid;grid-template-columns:70% 30%;background:#060b14;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;}' +

    // Left panel (70%) — branded showcase
    '.lp-left{background:linear-gradient(160deg,#003a28 0%,#006241 30%,#00A86B 70%,#00c77b 100%);position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:center;padding:60px 80px;}' +
    '.lp-orb{position:absolute;border-radius:50%;filter:blur(80px);opacity:0.25;pointer-events:none;}' +
    '.lp-orb1{width:600px;height:600px;background:rgba(255,255,255,0.12);top:-200px;left:-100px;animation:orbF1 12s ease-in-out infinite;}' +
    '.lp-orb2{width:450px;height:450px;background:rgba(0,200,123,0.2);bottom:-150px;right:-50px;animation:orbF2 15s ease-in-out infinite;}' +
    '.lp-orb3{width:300px;height:300px;background:rgba(255,255,255,0.08);top:50%;left:60%;animation:orbF3 10s ease-in-out infinite;}' +
    '@keyframes orbF1{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(40px,-30px) scale(1.06);}66%{transform:translate(-20px,20px) scale(0.94);}}' +
    '@keyframes orbF2{0%,100%{transform:translate(0,0) scale(1);}50%{transform:translate(-35px,-40px) scale(1.1);}}' +
    '@keyframes orbF3{0%,100%{transform:translate(0,0) scale(1);}50%{transform:translate(20px,-25px) scale(1.08);}}' +
    '.lp-grid{position:absolute;inset:0;opacity:0.035;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px);background-size:60px 60px;}' +
    '.lp-content{position:relative;z-index:2;max-width:720px;}' +

    // Version pill
    '.lp-pill{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.12);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.15);border-radius:100px;padding:6px 16px;font-size:12px;font-weight:600;color:rgba(255,255,255,0.9);margin-bottom:32px;letter-spacing:0.02em;}' +
    '.lp-pill-dot{width:6px;height:6px;border-radius:50%;background:#00ff88;box-shadow:0 0 6px #00ff88;animation:lpPulse 2s infinite;}' +
    '@keyframes lpPulse{0%,100%{opacity:1;box-shadow:0 0 6px #00ff88;}50%{opacity:0.5;box-shadow:0 0 12px #00ff88;}}' +
    // Also used in hub


    // Brand
    '.lp-brand{display:flex;align-items:center;gap:16px;margin-bottom:20px;}' +
    '.lp-brand-icon{width:64px;height:64px;border-radius:18px;background:rgba(255,255,255,0.15);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 32px rgba(0,0,0,0.15);}' +
    '.lp-brand-icon i{font-size:28px;color:#fff;}' +
    '.lp-brand-text{font-size:42px;font-weight:900;color:#fff;letter-spacing:-1px;line-height:1;}' +
    '.lp-brand-sub{font-size:13px;font-weight:500;color:rgba(255,255,255,0.7);letter-spacing:0.5px;margin-top:2px;}' +

    // Hero headline
    '.lp-hero{font-size:40px;font-weight:800;color:#fff;line-height:1.15;margin-bottom:16px;letter-spacing:-0.5px;}' +
    '.lp-hero .hl{background:linear-gradient(135deg,#a7f3d0,#6ee7b7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}' +
    '.lp-desc{font-size:16px;color:rgba(255,255,255,0.65);line-height:1.7;margin-bottom:48px;max-width:560px;}' +

    // Stats
    '.lp-stats{display:flex;gap:32px;margin-bottom:48px;}' +
    '.lp-stat-num{font-size:36px;font-weight:800;color:#fff;letter-spacing:-0.5px;line-height:1;margin-bottom:4px;}' +
    '.lp-stat-lbl{font-size:12px;font-weight:500;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.08em;}' +

    // Feature cards
    '.lp-feats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}' +
    '.lp-feat{background:rgba(255,255,255,0.07);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:20px 18px;transition:all 0.3s ease;}' +
    '.lp-feat:hover{background:rgba(255,255,255,0.12);transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,0.2);border-color:rgba(255,255,255,0.2);}' +
    '.lp-feat-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:14px;font-size:16px;color:#fff;}' +
    '.lp-fi-genomic{background:rgba(16,185,129,0.2);}.lp-fi-threat{background:rgba(239,68,68,0.2);}.lp-fi-analytics{background:rgba(59,130,246,0.2);}.lp-fi-surv{background:rgba(168,85,247,0.2);}' +
    '.lp-feat-title{font-size:13px;font-weight:700;color:#fff;margin-bottom:6px;}' +
    '.lp-feat-desc{font-size:11px;color:rgba(255,255,255,0.45);line-height:1.5;}' +

    // Trust bar
    '.lp-trust{position:absolute;bottom:0;left:0;right:0;padding:20px 80px;display:flex;align-items:center;justify-content:space-between;background:rgba(0,0,0,0.15);border-top:1px solid rgba(255,255,255,0.06);z-index:2;}' +
    '.lp-trust-left{display:flex;align-items:center;gap:24px;}' +
    '.lp-trust-item{display:flex;align-items:center;gap:6px;font-size:11px;color:rgba(255,255,255,0.5);}' +
    '.lp-trust-item i{font-size:12px;color:rgba(255,255,255,0.35);}' +
    '.lp-trust-right{font-size:11px;color:rgba(255,255,255,0.35);}' +

    // Right panel (30%) — white form
    '.lp-right{background:#ffffff;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 32px;position:relative;}' +
    '.lp-form-wrap{width:100%;max-width:340px;}' +
    '.lp-header{margin-bottom:28px;}' +
    '.lp-header h2{font-size:22px;font-weight:700;color:#111827;margin-bottom:4px;}' +
    '.lp-header p{font-size:13px;color:#6b7280;}' +

    // Form
    '.lp-field{margin-bottom:18px;}' +
    '.lp-field label{display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.04em;}' +
    '.lp-input-wrap{position:relative;}' +
    '.lp-input-wrap input{width:100%;padding:12px 40px;background:#f9fafb;border:1.5px solid #e5e7eb;border-radius:10px;color:#111827;font-size:14px;font-family:Inter,sans-serif;outline:none;transition:all 0.25s ease;box-sizing:border-box;}' +
    '.lp-input-wrap input:hover{border-color:#d1d5db;background:#fff;}' +
    '.lp-input-wrap input:focus{border-color:#00A86B;background:#fff;box-shadow:0 0 0 3px rgba(0,168,107,0.1);}' +
    '.lp-input-wrap input::placeholder{color:#9ca3af;}' +
    '.lp-input-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#9ca3af;font-size:13px;pointer-events:none;transition:color 0.25s ease;}' +
    '.lp-input-wrap input:focus~.lp-input-icon{color:#00A86B;}' +
    '.lp-eye{position:absolute;right:12px;top:50%;transform:translateY(-50%);color:#9ca3af;cursor:pointer;font-size:13px;transition:color 0.2s;background:none;border:none;padding:4px;}' +
    '.lp-eye:hover{color:#6b7280;}' +

    // Button
    '.lp-btn{width:100%;padding:12px;background:linear-gradient(135deg,#00A86B,#008F5B);color:#fff;font-size:14px;font-weight:600;font-family:Inter,sans-serif;border:none;border-radius:10px;cursor:pointer;transition:all 0.3s ease;position:relative;overflow:hidden;margin-top:4px;}' +
    '.lp-btn:hover{background:linear-gradient(135deg,#00c77b,#00A86B);box-shadow:0 6px 24px rgba(0,168,107,0.35);transform:translateY(-1px);}' +
    '.lp-btn:active{transform:translateY(0);}' +
    '.lp-btn::after{content:"";position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);transition:left 0.5s ease;}' +
    '.lp-btn:hover::after{left:100%;}' +
    '.lp-btn.loading{pointer-events:none;opacity:0.8;}' +
    '.lp-btn .btn-text{transition:opacity 0.2s;}' +
    '.lp-btn.loading .btn-text{opacity:0;}' +
    '.lp-btn .btn-spinner{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.2s;}' +
    '.lp-btn.loading .btn-spinner{opacity:1;}' +

    // Messages
    '.lp-msg{display:none;align-items:center;gap:8px;padding:10px 14px;border-radius:10px;font-size:12px;font-weight:500;margin-bottom:14px;animation:lpSlide 0.3s ease-out;}' +
    '@keyframes lpSlide{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}' +
    '.lp-msg-ok{background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46;}' +
    '.lp-msg-ok i{color:#10b981;}' +
    '.lp-msg-err{background:#fef2f2;border:1px solid #fecaca;color:#991b1b;}' +
    '.lp-msg-err i{color:#ef4444;}' +
    '.lp-msg.show{display:flex;}' +

    // Divider + demo accounts
    '.lp-divider{display:flex;align-items:center;gap:10px;margin:22px 0 14px;}' +
    '.lp-divider::before,.lp-divider::after{content:"";flex:1;height:1px;background:#e5e7eb;}' +
    '.lp-divider span{font-size:10px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;}' +
    '.lp-demos{display:flex;flex-direction:column;gap:6px;}' +
    '.lp-demo{display:flex;align-items:center;gap:10px;padding:9px 12px;background:#f9fafb;border:1.5px solid #e5e7eb;border-radius:10px;font-size:12px;cursor:pointer;transition:all 0.25s ease;}' +
    '.lp-demo:hover{background:rgba(0,168,107,0.04);border-color:#00A86B;transform:translateX(3px);}' +
    '.lp-demo-badge{display:inline-flex;align-items:center;justify-content:center;min-width:28px;height:28px;border-radius:8px;font-size:10px;font-weight:700;color:#fff;}' +
    '.lp-demo:nth-child(1) .lp-demo-badge{background:linear-gradient(135deg,#00A86B,#008F5B);}' +
    '.lp-demo:nth-child(2) .lp-demo-badge{background:linear-gradient(135deg,#3b82f6,#2563eb);}' +
    '.lp-demo:nth-child(3) .lp-demo-badge{background:linear-gradient(135deg,#8b5cf6,#7c3aed);}' +
    '.lp-demo-role{font-weight:600;color:#111827;min-width:52px;}' +
    '.lp-demo-user{color:#6b7280;flex:1;}' +
    '.lp-demo-pass{color:#9ca3af;font-family:SFMono-Regular,Fira Code,monospace;font-size:11px;}' +
    '.lp-footer{text-align:center;margin-top:28px;font-size:11px;color:#b0b0b0;}' +

    // Responsive
    '@media(max-width:1200px){.login-page{grid-template-columns:65% 35%;}.lp-left{padding:50px 60px;}.lp-feats{grid-template-columns:repeat(2,1fr);}.lp-trust{padding:16px 60px;}}' +
    '@media(max-width:1024px){.login-page{grid-template-columns:1fr;}.lp-left{display:none;}.lp-right{padding:40px 24px;}.lp-form-wrap{max-width:420px;}.lp-mobile-brand{display:flex !important;flex-direction:column;align-items:center;margin-bottom:28px;}.lp-mobile-icon{width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,#00A86B,#008F5B);display:flex;align-items:center;justify-content:center;margin-bottom:12px;box-shadow:0 8px 28px rgba(0,168,107,0.25);}.lp-mobile-icon i{font-size:22px;color:#fff;}.lp-mobile-brand h1{font-size:28px;font-weight:800;color:#111827;}.lp-mobile-brand p{font-size:12px;color:#00A86B;margin-top:4px;font-weight:500;}}' +
    '@media(max-width:640px){.lp-right{padding:28px 18px;}.lp-demo{padding:8px 10px;font-size:11px;}}' +
    '.lp-forgot-link{font-size:12px;color:#00A86B;text-decoration:none;font-weight:500;transition:color 0.2s;}' +
    '.lp-forgot-link:hover{color:#00c77b;}' +
    '.lp-back-link{font-size:12px;color:#6b7280;text-decoration:none;display:inline-flex;align-items:center;gap:5px;transition:color 0.2s;}' +
    '.lp-back-link:hover{color:#111827;}' +
    '.lp-resend-link{font-size:11px;color:#9ca3af;text-decoration:none;transition:color 0.2s;}' +
    '.lp-resend-link:hover{color:#00A86B;}' +
    '</style>' +

    // === LEFT PANEL ===
    '<div class="lp-left">' +
      '<div class="lp-orb lp-orb1"></div><div class="lp-orb lp-orb2"></div><div class="lp-orb lp-orb3"></div>' +
      '<div class="lp-grid"></div>' +
      '<div class="lp-content">' +
        '<div class="lp-pill"><span class="lp-pill-dot"></span>System Online &mdash; v5.1</div>' +
        '<div class="lp-brand"><div class="lp-brand-icon"><i class="fas fa-dna"></i></div><div><div class="lp-brand-text">BioR</div><div class="lp-brand-sub">Biological Response Network</div></div></div>' +
        '<h1 class="lp-hero">National Biosurveillance<br>&amp; <span class="hl">Early Warning</span> Platform</h1>' +
        '<p class="lp-desc">AI-powered genomic threat detection, epidemic intelligence, and real-time surveillance across 13 regions. Protecting public health with next-generation bioinformatics and multi-layer early warning systems.</p>' +
        '<div class="lp-stats">' +
          '<div><div class="lp-stat-num">1,247</div><div class="lp-stat-lbl">Active Cases</div></div>' +
          '<div><div class="lp-stat-num">24</div><div class="lp-stat-lbl">Monitoring Sites</div></div>' +
          '<div><div class="lp-stat-num">856</div><div class="lp-stat-lbl">Genomic Sequences</div></div>' +
          '<div><div class="lp-stat-num">13</div><div class="lp-stat-lbl">Regions Covered</div></div>' +
        '</div>' +
        '<div class="lp-feats">' +
          '<div class="lp-feat"><div class="lp-feat-icon lp-fi-genomic"><i class="fas fa-microscope"></i></div><div class="lp-feat-title">Genomic Analysis</div><div class="lp-feat-desc">Real-time sequencing with AMR detection &amp; phylogenetic tracking</div></div>' +
          '<div class="lp-feat"><div class="lp-feat-icon lp-fi-threat"><i class="fas fa-shield-virus"></i></div><div class="lp-feat-title">Threat Detection</div><div class="lp-feat-desc">ML-powered early warning with OSINT intelligence feeds</div></div>' +
          '<div class="lp-feat"><div class="lp-feat-icon lp-fi-analytics"><i class="fas fa-chart-line"></i></div><div class="lp-feat-title">Analytics &amp; Reports</div><div class="lp-feat-desc">Epidemiological dashboards with automated situation reports</div></div>' +
          '<div class="lp-feat"><div class="lp-feat-icon lp-fi-surv"><i class="fas fa-satellite-dish"></i></div><div class="lp-feat-title">Surveillance Network</div><div class="lp-feat-desc">24 sites across 13 regions with real-time data streaming</div></div>' +
        '</div>' +
      '</div>' +
      '<div class="lp-trust"><div class="lp-trust-left">' +
        '<div class="lp-trust-item"><i class="fas fa-shield-halved"></i> SOC 2 Compliant</div>' +
        '<div class="lp-trust-item"><i class="fas fa-lock"></i> End-to-End Encrypted</div>' +
        '<div class="lp-trust-item"><i class="fas fa-server"></i> 99.99% Uptime</div>' +
        '<div class="lp-trust-item"><i class="fas fa-globe-americas"></i> Edge Network</div>' +
      '</div><div class="lp-trust-right">&copy; 2026 BioR Platform</div></div>' +
    '</div>' +

    // === RIGHT PANEL ===
    '<div class="lp-right">' +
      '<div class="lp-form-wrap">' +
        '<div class="lp-mobile-brand" style="display:none"><div class="lp-mobile-icon"><i class="fas fa-dna"></i></div><h1>BioR</h1><p>Biological Response Network</p></div>' +
        '<div class="lp-header"><h2>Sign In</h2><p>Access the biosurveillance platform</p></div>' +
        '<div id="loginSuccess" class="lp-msg lp-msg-ok"><i class="fas fa-check-circle"></i><span>Login successful! Redirecting...</span></div>' +
        '<div id="loginError" class="lp-msg lp-msg-err"><i class="fas fa-exclamation-circle"></i><span id="loginErrorText">Invalid credentials</span></div>' +
        '<form id="loginForm">' +
          '<div class="lp-field"><label for="username">Username</label><div class="lp-input-wrap"><input type="text" id="username" placeholder="Enter your username" autocomplete="username" /><span class="lp-input-icon"><i class="fas fa-user"></i></span></div></div>' +
          '<div class="lp-field"><label for="password">Password</label><div class="lp-input-wrap"><input type="password" id="password" placeholder="Enter your password" autocomplete="current-password" /><span class="lp-input-icon"><i class="fas fa-lock"></i></span><button type="button" class="lp-eye" onclick="togglePassword()" title="Show/Hide password"><i id="pwToggleIcon" class="fas fa-eye"></i></button></div></div>' +
          '<button type="submit" class="lp-btn" id="loginBtn"><span class="btn-text"><i class="fas fa-sign-in-alt" style="margin-right:8px"></i>Sign In</span><span class="btn-spinner"><i class="fas fa-circle-notch fa-spin" style="font-size:16px"></i></span></button>' +
          '<div style="text-align:center;margin-top:14px"><a href="#" onclick="showForgotPassword();return false" class="lp-forgot-link"><i class="fas fa-key" style="margin-right:5px;font-size:10px"></i>Forgot Password?</a></div>' +
        '</form>' +
        // Forgot password forms (hidden by default)
        '<div id="forgotStep1" style="display:none">' +
          '<div style="margin-bottom:16px"><a href="#" onclick="hideForgotPassword();return false" class="lp-back-link"><i class="fas fa-arrow-left" style="font-size:10px"></i> Back to Sign In</a></div>' +
          '<div class="lp-header"><h2><i class="fas fa-key" style="color:#00A86B;margin-right:8px;font-size:18px"></i>Forgot Password</h2><p>Enter your username to receive a verification code</p></div>' +
          '<div id="forgotMsg" class="lp-msg"><i></i><span></span></div>' +
          '<div class="lp-field"><label>Username</label><div class="lp-input-wrap"><input type="text" id="forgotUsername" placeholder="Enter your username" autocomplete="username" /><span class="lp-input-icon"><i class="fas fa-user"></i></span></div></div>' +
          '<button type="button" class="lp-btn" id="forgotSendBtn" onclick="sendResetOTP()"><span class="btn-text"><i class="fas fa-paper-plane" style="margin-right:8px"></i>Send Verification Code</span><span class="btn-spinner"><i class="fas fa-circle-notch fa-spin" style="font-size:16px"></i></span></button>' +
        '</div>' +
        '<div id="forgotStep2" style="display:none">' +
          '<div style="margin-bottom:16px"><a href="#" onclick="backToStep1();return false" class="lp-back-link"><i class="fas fa-arrow-left" style="font-size:10px"></i> Back</a></div>' +
          '<div class="lp-header"><h2><i class="fas fa-shield-halved" style="color:#00A86B;margin-right:8px;font-size:18px"></i>Verify &amp; Reset</h2><p id="resetEmailHint">Enter the 6-digit code sent to your email</p></div>' +
          '<div id="resetMsg" class="lp-msg"><i></i><span></span></div>' +
          '<div class="lp-field"><label>Verification Code</label><div class="lp-input-wrap"><input type="text" id="resetOTP" placeholder="000000" maxlength="6" style="text-align:center;letter-spacing:8px;font-size:22px;font-weight:700;font-family:monospace" autocomplete="one-time-code" /><span class="lp-input-icon"><i class="fas fa-hashtag"></i></span></div></div>' +
          '<div class="lp-field"><label>New Password</label><div class="lp-input-wrap"><input type="password" id="resetNewPw" placeholder="Minimum 8 characters" autocomplete="new-password" /><span class="lp-input-icon"><i class="fas fa-lock"></i></span><button type="button" class="lp-eye" onclick="toggleResetPw()" title="Show/Hide"><i id="resetPwIcon" class="fas fa-eye"></i></button></div></div>' +
          '<div class="lp-field"><label>Confirm Password</label><div class="lp-input-wrap"><input type="password" id="resetConfirmPw" placeholder="Repeat your password" autocomplete="new-password" /><span class="lp-input-icon"><i class="fas fa-check-double"></i></span></div></div>' +
          '<button type="button" class="lp-btn" id="resetSubmitBtn" onclick="submitPasswordReset()"><span class="btn-text"><i class="fas fa-check-circle" style="margin-right:8px"></i>Reset Password</span><span class="btn-spinner"><i class="fas fa-circle-notch fa-spin" style="font-size:16px"></i></span></button>' +
          '<div style="text-align:center;margin-top:12px"><a href="#" onclick="resendOTP();return false" id="resendLink" class="lp-resend-link"><i class="fas fa-redo" style="margin-right:4px;font-size:9px"></i>Resend Code</a></div>' +
        '</div>' +
        // 2FA verification step (hidden by default)
        '<div id="twoFactorStep" style="display:none">' +
          '<div style="margin-bottom:16px"><a href="#" onclick="cancel2FA();return false" class="lp-back-link"><i class="fas fa-arrow-left" style="font-size:10px"></i> Back to Sign In</a></div>' +
          '<div class="lp-header"><h2><i class="fas fa-shield-halved" style="color:#00A86B;margin-right:8px;font-size:18px"></i>Two-Factor Authentication</h2><p>Enter the 6-digit code from your authenticator app</p></div>' +
          '<div id="tfaMsg" class="lp-msg"><i></i><span></span></div>' +
          '<div class="lp-field"><label>Authenticator Code</label><div class="lp-input-wrap"><input type="text" id="tfaCode" placeholder="000000" maxlength="6" style="text-align:center;letter-spacing:8px;font-size:22px;font-weight:700;font-family:monospace" autocomplete="one-time-code" /><span class="lp-input-icon"><i class="fas fa-mobile-screen"></i></span></div></div>' +
          '<button type="button" class="lp-btn" id="tfaSubmitBtn" onclick="submit2FA()"><span class="btn-text"><i class="fas fa-check-circle" style="margin-right:8px"></i>Verify</span><span class="btn-spinner"><i class="fas fa-circle-notch fa-spin" style="font-size:16px"></i></span></button>' +
          '<div style="text-align:center;margin-top:14px"><a href="#" onclick="showRecoveryCode();return false" class="lp-resend-link"><i class="fas fa-life-ring" style="margin-right:4px;font-size:9px"></i>Use Recovery Code</a></div>' +
        '</div>' +
        // Recovery code step
        '<div id="recoveryStep" style="display:none">' +
          '<div style="margin-bottom:16px"><a href="#" onclick="backTo2FA();return false" class="lp-back-link"><i class="fas fa-arrow-left" style="font-size:10px"></i> Back</a></div>' +
          '<div class="lp-header"><h2><i class="fas fa-life-ring" style="color:#f59e0b;margin-right:8px;font-size:18px"></i>Recovery Code</h2><p>Enter one of your backup recovery codes</p></div>' +
          '<div id="recoveryMsg" class="lp-msg"><i></i><span></span></div>' +
          '<div class="lp-field"><label>Recovery Code</label><div class="lp-input-wrap"><input type="text" id="recoveryCodeInput" placeholder="XXXX-XXXX" maxlength="9" style="text-align:center;letter-spacing:3px;font-size:18px;font-weight:600;font-family:monospace;text-transform:uppercase" /><span class="lp-input-icon"><i class="fas fa-key"></i></span></div></div>' +
          '<button type="button" class="lp-btn" id="recoverySubmitBtn" onclick="submitRecoveryCode()"><span class="btn-text"><i class="fas fa-unlock" style="margin-right:8px"></i>Use Recovery Code</span><span class="btn-spinner"><i class="fas fa-circle-notch fa-spin" style="font-size:16px"></i></span></button>' +
        '</div>' +
        '<div class="lp-footer">BioR Platform v9.0 &bull; Dual-Channel Security</div>' +
      '</div>' +
    '</div>' +
  '</div>';
}

// ===== FORGOT PASSWORD STATE =====
var _resetTokenId = null;
var _resetUsername = null;
var _2faChallengeId = null;
var _2faUsername = null;

window.showForgotPassword = function() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('forgotStep1').style.display = 'block';
  document.getElementById('forgotStep2').style.display = 'none';
  document.getElementById('loginSuccess').classList.remove('show');
  document.getElementById('loginError').classList.remove('show');
  setTimeout(function() { var el = document.getElementById('forgotUsername'); if(el) el.focus(); }, 100);
};

window.hideForgotPassword = function() {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('forgotStep1').style.display = 'none';
  document.getElementById('forgotStep2').style.display = 'none';
};

window.backToStep1 = function() {
  document.getElementById('forgotStep1').style.display = 'block';
  document.getElementById('forgotStep2').style.display = 'none';
};

function showForgotMsg(elId, msg, isError) {
  var el = document.getElementById(elId);
  if (!el) return;
  el.className = 'lp-msg show ' + (isError ? 'lp-msg-err' : 'lp-msg-ok');
  el.innerHTML = '<i class="fas ' + (isError ? 'fa-exclamation-circle' : 'fa-check-circle') + '"></i><span>' + msg + '</span>';
}

window.sendResetOTP = async function() {
  var username = (document.getElementById('forgotUsername') || {}).value;
  if (!username) { showForgotMsg('forgotMsg', 'Please enter your username', true); return; }

  var btn = document.getElementById('forgotSendBtn');
  btn.classList.add('loading');
  document.getElementById('forgotMsg').classList.remove('show');

  try {
    var res = await api('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ username: username.trim() }) });
    btn.classList.remove('loading');

    if (res.error) { showForgotMsg('forgotMsg', res.error, true); return; }

    _resetTokenId = res.tokenId;
    _resetUsername = username.trim();

    // Show step 2
    document.getElementById('forgotStep1').style.display = 'none';
    document.getElementById('forgotStep2').style.display = 'block';
    document.getElementById('resetEmailHint').textContent = 'Code sent to ' + (res.maskedEmail || 'your email') + ' — expires in 15 min';

    // If dev mode (no email service), show OTP in a message
    if (res.devOtp) {
      showForgotMsg('resetMsg', 'Dev mode — your code is: ' + res.devOtp, false);
    }

    setTimeout(function() { var el = document.getElementById('resetOTP'); if(el) el.focus(); }, 100);
  } catch (err) {
    btn.classList.remove('loading');
    showForgotMsg('forgotMsg', 'Connection failed. Please try again.', true);
  }
};

window.submitPasswordReset = async function() {
  var otp = (document.getElementById('resetOTP') || {}).value;
  var newPw = (document.getElementById('resetNewPw') || {}).value;
  var confirmPw = (document.getElementById('resetConfirmPw') || {}).value;

  if (!otp || otp.length !== 6) { showForgotMsg('resetMsg', 'Please enter the 6-digit verification code', true); return; }
  if (!newPw || newPw.length < 8) { showForgotMsg('resetMsg', 'Password must be at least 8 characters', true); return; }
  if (newPw !== confirmPw) { showForgotMsg('resetMsg', 'Passwords do not match', true); return; }

  var btn = document.getElementById('resetSubmitBtn');
  btn.classList.add('loading');
  document.getElementById('resetMsg').classList.remove('show');

  try {
    var res = await api('/api/auth/verify-reset', { method: 'POST', body: JSON.stringify({ tokenId: _resetTokenId, otp: otp.trim(), newPassword: newPw }) });
    btn.classList.remove('loading');

    if (res.error) { showForgotMsg('resetMsg', res.error, true); return; }

    showForgotMsg('resetMsg', 'Password reset successfully! Redirecting to sign in...', false);
    setTimeout(function() {
      hideForgotPassword();
      // Pre-fill username
      var uEl = document.getElementById('username');
      if (uEl && _resetUsername) uEl.value = _resetUsername;
      var pEl = document.getElementById('password');
      if (pEl) { pEl.value = ''; pEl.focus(); }
      _resetTokenId = null;
    }, 2000);
  } catch (err) {
    btn.classList.remove('loading');
    showForgotMsg('resetMsg', 'Connection failed. Please try again.', true);
  }
};

window.resendOTP = function() {
  backToStep1();
  var el = document.getElementById('forgotUsername');
  if (el && _resetUsername) el.value = _resetUsername;
  sendResetOTP();
};

window.toggleResetPw = function() {
  var pw = document.getElementById('resetNewPw');
  var icon = document.getElementById('resetPwIcon');
  if (pw.type === 'password') { pw.type = 'text'; icon.className = 'fas fa-eye-slash'; }
  else { pw.type = 'password'; icon.className = 'fas fa-eye'; }
};

// ===== 2FA LOGIN FUNCTIONS =====
function show2FAStep(challengeId, username) {
  _2faChallengeId = challengeId;
  _2faUsername = username;
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('twoFactorStep').style.display = 'block';
  document.getElementById('recoveryStep').style.display = 'none';
  document.getElementById('loginSuccess').classList.remove('show');
  document.getElementById('loginError').classList.remove('show');
  var tfaMsg = document.getElementById('tfaMsg');
  if (tfaMsg) tfaMsg.classList.remove('show');
  setTimeout(function() { var el = document.getElementById('tfaCode'); if(el) { el.value = ''; el.focus(); } }, 100);
}

window.cancel2FA = function() {
  _2faChallengeId = null;
  _2faUsername = null;
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('twoFactorStep').style.display = 'none';
  document.getElementById('recoveryStep').style.display = 'none';
};

window.showRecoveryCode = function() {
  document.getElementById('twoFactorStep').style.display = 'none';
  document.getElementById('recoveryStep').style.display = 'block';
  var rMsg = document.getElementById('recoveryMsg');
  if (rMsg) rMsg.classList.remove('show');
  setTimeout(function() { var el = document.getElementById('recoveryCodeInput'); if(el) { el.value = ''; el.focus(); } }, 100);
};

window.backTo2FA = function() {
  document.getElementById('recoveryStep').style.display = 'none';
  document.getElementById('twoFactorStep').style.display = 'block';
};

function showTfaMsg(elId, msg, isError) {
  var el = document.getElementById(elId);
  if (!el) return;
  el.className = 'lp-msg show ' + (isError ? 'lp-msg-err' : 'lp-msg-ok');
  el.innerHTML = '<i class="fas ' + (isError ? 'fa-exclamation-circle' : 'fa-check-circle') + '"></i><span>' + msg + '</span>';
}

function complete2FALogin(res) {
  state.isAuthenticated = true;
  state.user = res.user;
  state.token = res.token;
  state.tokenExpiresAt = res.expiresAt || new Date(Date.now() + 8*3600*1000).toISOString();
  localStorage.setItem('bior_auth', JSON.stringify({ user: res.user, token: res.token, expiresAt: state.tokenExpiresAt }));
  if (typeof startSSE === 'function') startSSE();
  if (typeof startNotifPolling === 'function') startNotifPolling();
  showTfaMsg('tfaMsg', 'Verified! Redirecting...', false);
  setTimeout(function() {
    showToast('Welcome, ' + res.user.name, 'success');
    state.currentView = 'hub';
    render();
  }, 800);
}

window.submit2FA = async function() {
  var code = (document.getElementById('tfaCode') || {}).value;
  if (!code || code.length !== 6) { showTfaMsg('tfaMsg', 'Enter a valid 6-digit code', true); return; }

  var btn = document.getElementById('tfaSubmitBtn');
  btn.classList.add('loading');
  document.getElementById('tfaMsg').classList.remove('show');

  try {
    var res = await api('/api/auth/2fa/verify-login', {
      method: 'POST',
      body: JSON.stringify({ challengeId: _2faChallengeId, code: code.trim() })
    });
    btn.classList.remove('loading');

    if (res.error) {
      showTfaMsg('tfaMsg', res.error, true);
      var el = document.getElementById('tfaCode');
      if (el) { el.value = ''; el.focus(); }
      return;
    }

    complete2FALogin(res);
  } catch (err) {
    btn.classList.remove('loading');
    showTfaMsg('tfaMsg', 'Connection failed. Please try again.', true);
  }
};

window.submitRecoveryCode = async function() {
  var code = (document.getElementById('recoveryCodeInput') || {}).value;
  if (!code || code.trim().length < 4) { showTfaMsg('recoveryMsg', 'Enter a valid recovery code', true); return; }

  var btn = document.getElementById('recoverySubmitBtn');
  btn.classList.add('loading');
  var rMsg = document.getElementById('recoveryMsg');
  if (rMsg) rMsg.classList.remove('show');

  try {
    var res = await api('/api/auth/2fa/recovery', {
      method: 'POST',
      body: JSON.stringify({ challengeId: _2faChallengeId, recoveryCode: code.trim() })
    });
    btn.classList.remove('loading');

    if (res.error) {
      showTfaMsg('recoveryMsg', res.error, true);
      return;
    }

    if (res.recoveryWarning) {
      showToast(res.recoveryWarning, 'warning');
    }

    complete2FALogin(res);
  } catch (err) {
    btn.classList.remove('loading');
    showTfaMsg('recoveryMsg', 'Connection failed. Please try again.', true);
  }
};

function initLoginHandlers() {
  // Auto-focus username
  setTimeout(() => { const u = document.getElementById('username'); if(u) u.focus(); }, 100);

  // Auto-submit 2FA when 6 digits entered
  var tfaInput = document.getElementById('tfaCode');
  if (tfaInput) {
    tfaInput.addEventListener('input', function() {
      var val = this.value.replace(/[^0-9]/g, '');
      this.value = val;
      if (val.length === 6) { setTimeout(function() { submit2FA(); }, 100); }
    });
  }

  // Toggle password visibility
  window.togglePassword = function() {
    const pw = document.getElementById('password');
    const icon = document.getElementById('pwToggleIcon');
    if(pw.type === 'password') { pw.type = 'text'; icon.className = 'fas fa-eye-slash'; }
    else { pw.type = 'password'; icon.className = 'fas fa-eye'; }
  };

  // Form submit — API-based auth
  document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const btn = document.getElementById('loginBtn');
    const errEl = document.getElementById('loginError');
    const successEl = document.getElementById('loginSuccess');
    const errText = document.getElementById('loginErrorText');

    errEl.classList.remove('show');
    successEl.classList.remove('show');

    if(!username || !password) {
      errText.textContent = 'Please enter both username and password.';
      errEl.classList.add('show');
      return;
    }

    btn.classList.add('loading');

    try {
      const res = await api('/api/auth/login', { method:'POST', body:JSON.stringify({username,password}) });
      if (res.error) {
        errText.textContent = res.error;
        errEl.classList.add('show');
        btn.classList.remove('loading');
        return;
      }

      // Check if 2FA is required
      if (res.requires2FA) {
        btn.classList.remove('loading');
        show2FAStep(res.challengeId, res.username);
        return;
      }

      state.isAuthenticated = true; state.user = res.user; state.token = res.token;
      state.tokenExpiresAt = res.expiresAt || new Date(Date.now() + 8*3600*1000).toISOString();
      localStorage.setItem('bior_auth', JSON.stringify({user:res.user, token:res.token, expiresAt:state.tokenExpiresAt}));
      btn.classList.remove('loading');
      successEl.classList.add('show');
      if (typeof startSSE === 'function') startSSE();
      if (typeof startNotifPolling === 'function') startNotifPolling();
      setTimeout(() => {
        showToast('Welcome, ' + res.user.name, 'success');
        state.currentView = 'hub';
        render();
      }, 800);
    } catch(err) {
      errText.textContent = 'Connection failed. Please try again.';
      errEl.classList.add('show');
      btn.classList.remove('loading');
    }
  });
}

  `;
}
