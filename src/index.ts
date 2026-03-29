// =============================================================================
// BioR Platform v8.0 - Application Entry Point (Enterprise Security)
// =============================================================================
// D1 Database Backend + Real JWT Auth + CRUD APIs
// Security: JWT secret from env, enterprise security headers, CORS restrictions,
//           global rate limiting, token blacklist, session fingerprinting,
//           AES-256-GCM encryption, security event monitoring
// =============================================================================

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getCookie } from 'hono/cookie';
import { authMiddleware } from './lib/auth';
import { initJWTSecret } from './lib/crypto';
import apiRoutes from './routes/api';
import pageRoutes from './routes/pages';

type Bindings = {
  DB: D1Database;
  JWT_SECRET?: string;
  ENCRYPTION_KEY?: string;
  SITE_ACCESS_KEY?: string;
  LOCKDOWN_MODE?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// ===== LOCKDOWN MODE =====
// Platform blocked for public. Admin bypasses with SITE_ACCESS_KEY.
app.use('*', async (c, next) => {
  if (c.env.LOCKDOWN_MODE !== 'true') return next();

  const adminKey = c.env.SITE_ACCESS_KEY;
  if (adminKey) {
    const provided = c.req.query('access_key') || c.req.header('X-Access-Key') || getCookie(c, 'bior_admin');
    if (provided === adminKey) {
      if (!getCookie(c, 'bior_admin')) {
        c.header('Set-Cookie', `bior_admin=${adminKey}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`);
      }
      return next();
    }
  }

  if (c.req.path.startsWith('/api/')) {
    return c.json({ error: 'Platform unavailable', message: 'BioR platform is currently private.', code: 'PLATFORM_PRIVATE' }, 403);
  }
  return c.html(getBlockedPage(), 403, { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' });
});

// ===== JWT SECRET INITIALIZATION =====
app.use('*', async (c, next) => {
  const secret = c.env.JWT_SECRET || (c.env as any).JWT_SECRET;
  if (secret) {
    initJWTSecret(secret);
  }
  return next();
});

// ===== ENTERPRISE SECURITY HEADERS =====
app.use('*', async (c, next) => {
  await next();
  
  // --- Anti-Clickjacking ---
  c.res.headers.set('X-Frame-Options', 'DENY');
  
  // --- Prevent MIME Sniffing ---
  c.res.headers.set('X-Content-Type-Options', 'nosniff');
  
  // --- XSS Protection (legacy browsers) ---
  c.res.headers.set('X-XSS-Protection', '1; mode=block');
  
  // --- Referrer Policy ---
  c.res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // --- Permissions Policy (restrict sensitive device APIs) ---
  c.res.headers.set('Permissions-Policy', 
    'camera=(), microphone=(), geolocation=(self), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  );
  
  // --- Content Security Policy (strict) ---
  c.res.headers.set('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com https://static.cloudflareinsights.com",
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com https://unpkg.com https://cdnjs.cloudflare.com",
    "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com data:",
    "img-src 'self' data: blob: https: http:",
    "connect-src 'self' https://bior.tech https://*.bior.tech https://*.pages.dev https://basemaps.cartocdn.com https://*.basemaps.cartocdn.com https://*.cartocdn.com https://*.carto.com https://tiles.basemaps.cartocdn.com",
    "worker-src 'self' blob:",
    "child-src 'self' blob:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; '));
  
  // --- HSTS (strict transport security) — 2 years + preload ---
  c.res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  
  // --- Cross-Origin Policies ---
  c.res.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  c.res.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
  
  // --- Remove server identification ---
  c.res.headers.delete('Server');
  c.res.headers.delete('X-Powered-By');
  
  // --- Cache Control for API responses ---
  if (c.req.path.startsWith('/api/')) {
    c.res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    c.res.headers.set('Pragma', 'no-cache');
  }
});

// ===== CORS (Strictly Restricted) =====
app.use('/api/*', cors({
  origin: ['https://bior.tech', 'https://www.bior.tech', 'https://bior-709.pages.dev'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
}));

// ===== AUTH MIDDLEWARE (includes global rate limiting, blacklist, fingerprint) =====
app.use('/api/*', authMiddleware);

// ===== ROUTES =====
app.route('/api', apiRoutes);
app.route('/', pageRoutes);

// ═══════════════════════════════════════════════════════════════════════════════
//  BLOCKED PAGE — No way in when LOCKDOWN_MODE=true
// ═══════════════════════════════════════════════════════════════════════════════
function getBlockedPage(): string {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow"><title>BioR — Private Platform</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{min-height:100vh;display:flex;align-items:center;justify-content:center;
background:#0a0e1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#e2e8f0;overflow:hidden}
.bg{position:fixed;inset:0;background:radial-gradient(ellipse at 30% 20%,rgba(59,130,246,0.06) 0%,transparent 60%),
radial-gradient(ellipse at 70% 80%,rgba(139,92,246,0.04) 0%,transparent 60%);pointer-events:none}
.container{position:relative;z-index:1;text-align:center;max-width:480px;padding:2rem}
.shield{font-size:3.5rem;margin-bottom:1.5rem;opacity:0.85}
.logo{font-size:2rem;font-weight:800;letter-spacing:-0.02em;margin-bottom:0.3rem;
background:linear-gradient(135deg,#3b82f6,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.tagline{font-size:0.85rem;color:#64748b;margin-bottom:2rem;letter-spacing:0.05em;text-transform:uppercase}
.card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:2rem;backdrop-filter:blur(10px)}
.status{display:inline-flex;align-items:center;gap:0.5rem;padding:0.4rem 1rem;border-radius:99px;
background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);color:#f87171;font-size:0.8rem;font-weight:600;margin-bottom:1.2rem}
.dot{width:8px;height:8px;border-radius:50%;background:#ef4444;animation:blink 2s ease-in-out infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
.message{color:#94a3b8;font-size:0.95rem;line-height:1.7}
.message strong{color:#cbd5e1}
.footer{margin-top:2.5rem;font-size:0.7rem;color:#334155;letter-spacing:0.03em}
</style></head><body>
<div class="bg"></div>
<div class="container">
<div class="shield">\u{1F6E1}\u{FE0F}</div>
<div class="logo">BioR</div>
<div class="tagline">Biological Response Network</div>
<div class="card">
<div class="status"><span class="dot"></span>Private Platform</div>
<p class="message">This platform is currently <strong>not available for public access</strong>.<br><br>
All services, APIs, and data are restricted to authorized internal use only.</p>
</div>
<div class="footer">&copy; 2026 BioR &mdash; All rights reserved</div>
</div></body></html>`;
}

// ===== EXPORT (fetch + scheduled) =====
export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledEvent, env: { DB: D1Database }, ctx: ExecutionContext) {
    const { generateWeeklyBulletin, generateMonthlySummary } = await import('./lib/reportGenerator');
    const trigger = event.cron;
    try {
      if (trigger === '0 6 * * 1') {
        // Weekly Epi Bulletin — every Monday 06:00 UTC
        await generateWeeklyBulletin(env.DB, 'cron_weekly');
      } else if (trigger === '0 6 1 * *') {
        // Monthly AMR Summary — 1st of each month 06:00 UTC
        await generateMonthlySummary(env.DB, 'cron_monthly');
      }
    } catch (e) {
      console.error('Scheduled report generation failed:', e);
    }
  },
};
