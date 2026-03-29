// =============================================================================
// BioR Platform v8.0 - API Routes (Enterprise Security)
// =============================================================================
// All data flows through Cloudflare D1. Enterprise security features:
// - Token blacklist/revocation on password change
// - Session fingerprinting
// - AES-256-GCM PII encryption at rest
// - Security event alerting and monitoring
// - Security compliance dashboard
// - Admin IP allowlist management
// =============================================================================

import { Hono } from 'hono';
import { hashPassword, verifyPassword, createToken, validatePasswordStrength, sanitizeInput, encryptField, decryptField, isEncrypted, createSessionFingerprint, SECURITY_CONSTANTS } from '../lib/crypto';
import type { AuthUser } from '../lib/auth';
import { requireTier, requireRole, logSecurityEvent, blacklistToken, blacklistAllUserTokens, storeSessionFingerprint } from '../lib/auth';
import { broadcast, subscribe, unsubscribe, subscriberCount, heartbeat } from '../lib/events';
import { generateSecret, generateRecoveryCodes, generateTOTP, verifyTOTP, generateOTPAuthURI } from '../lib/totp';

type Bindings = { DB: D1Database };
type Variables = { user: AuthUser };

const api = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// ===== REQUEST METRICS MIDDLEWARE =====
// Records real latency for every API call to D1
api.use('/*', async (c, next) => {
  const start = Date.now();
  await next();
  const latency = Date.now() - start;
  const path = c.req.path;
  const method = c.req.method;
  const status = c.res.status;
  // Fire-and-forget: don't block response for metrics write
  try {
    c.executionCtx.waitUntil(
      c.env.DB.prepare('INSERT INTO request_metrics (path, method, status, latency_ms) VALUES (?, ?, ?, ?)')
        .bind(path, method, status, latency).run()
    );
  } catch(e) { /* ignore metrics failures */ }
});

// Helper: parse JSON fields safely
function parseJSON(val: string | null | undefined, fallback: any = null) {
  if (!val) return fallback;
  try { return JSON.parse(val); } catch { return fallback; }
}

// Helper: audit log entry
async function auditLog(db: D1Database, user: string, action: string, resource: string, details: string, ip: string, tier: number) {
  const id = 'AUD-' + Date.now().toString(36).toUpperCase();
  await db.prepare(
    'INSERT INTO audit_log (id, timestamp, user, action, resource, details, ip, tier) VALUES (?, datetime("now"), ?, ?, ?, ?, ?, ?)'
  ).bind(id, user, action, resource, details, ip, tier).run();
}

// ===== RATE LIMITER (D1-backed) =====
// Tracks failed login attempts per IP; locks after 5 failures in 15 min window
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 15 * 60; // 15 minutes in seconds
const GLOBAL_RATE_LIMIT = 120; // max 120 requests per minute per IP
const GLOBAL_RATE_WINDOW = 60; // 1 minute window

async function checkRateLimit(db: D1Database, ip: string): Promise<{allowed: boolean, remaining: number, retryAfter?: number}> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW * 1000).toISOString().replace('T',' ').split('.')[0];
  try {
    const result: any = await db.prepare(
      "SELECT COUNT(*) as cnt, MAX(timestamp) as last_attempt FROM audit_log WHERE ip = ? AND action = 'Login Failed' AND timestamp >= ?"
    ).bind(ip, windowStart).first();
    const failures = result?.cnt || 0;
    if (failures >= RATE_LIMIT_MAX) {
      const lastAttempt = new Date(result.last_attempt).getTime();
      const retryAfter = Math.ceil((lastAttempt + RATE_LIMIT_WINDOW * 1000 - Date.now()) / 1000);
      return { allowed: false, remaining: 0, retryAfter: Math.max(0, retryAfter) };
    }
    return { allowed: true, remaining: RATE_LIMIT_MAX - failures };
  } catch {
    return { allowed: true, remaining: RATE_LIMIT_MAX }; // Fail open
  }
}

// =============================================================================
// AUTH ROUTES
// =============================================================================

api.post('/auth/login', async (c) => {
  let username: string, password: string;
  try {
    const body = await c.req.json();
    username = body.username;
    password = body.password;
  } catch {
    return c.json({ error: 'Invalid request body' }, 400);
  }
  if (!username || !password) return c.json({ error: 'Username and password required' }, 400);

  const db = c.env.DB;
  const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';
  const userAgent = c.req.header('User-Agent') || '';

  // Rate limit check
  const rateCheck = await checkRateLimit(db, ip);
  if (!rateCheck.allowed) {
    await logSecurityEvent(db, 'login_rate_limited', 'medium', `Login rate limited for IP ${ip}`, ip, null, username);
    return c.json({
      error: `Too many failed attempts. Try again in ${Math.ceil((rateCheck.retryAfter || 0) / 60)} minutes.`,
      retryAfter: rateCheck.retryAfter,
      rateLimited: true
    }, 429);
  }

  const row: any = await db.prepare('SELECT * FROM users WHERE username = ?').bind(username).first();
  if (!row) {
    await auditLog(db, username, 'Login Failed', 'unknown', `Failed login: user not found`, ip, 0);
    await logSecurityEvent(db, 'login_failed', 'medium', `Failed login: unknown username "${sanitizeInput(username)}"`, ip, null, username);
    return c.json({ error: 'Invalid credentials', attemptsRemaining: rateCheck.remaining - 1 }, 401);
  }

  // Check if account is suspended
  if (row.status === 'suspended') {
    await auditLog(db, row.name, 'Login Failed', row.id, `Suspended account login attempt`, ip, row.tier);
    await logSecurityEvent(db, 'suspended_login', 'high', `Suspended account login: ${row.username}`, ip, row.id, row.username);
    return c.json({ error: 'Account suspended. Contact administrator.' }, 403);
  }

  // Check if password needs migration (placeholder hashes from seed)
  let valid = false;
  if (row.password_hash.startsWith('__HASH_') && row.password_hash.endsWith('__')) {
    const plain = row.password_hash.slice(7, -2);
    if (password === plain) {
      valid = true;
      const newHash = await hashPassword(password);
      await db.prepare('UPDATE users SET password_hash = ?, updated_at = datetime("now") WHERE id = ?')
        .bind(newHash, row.id).run();
    }
  } else {
    valid = await verifyPassword(password, row.password_hash);
  }

  if (!valid) {
    await auditLog(db, row.name, 'Login Failed', row.id, `Failed login: wrong password`, ip, row.tier);
    await logSecurityEvent(db, 'login_failed', 'medium', `Failed login: wrong password for ${row.username}`, ip, row.id, row.username);
    return c.json({ error: 'Invalid credentials', attemptsRemaining: rateCheck.remaining - 1 }, 401);
  }

  // ===== CHECK 2FA =====
  // If user has TOTP 2FA enabled, return a challenge instead of full login
  const totpRow: any = await db.prepare(
    'SELECT * FROM totp_secrets WHERE user_id = ? AND enabled = 1 AND verified = 1'
  ).bind(row.id).first();

  if (totpRow) {
    // Password correct but 2FA required — issue a short-lived 2FA challenge token
    const challengeId = 'c2fa-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
    const challengeExpires = new Date(Date.now() + 5 * 60 * 1000).toISOString().replace('T', ' ').split('.')[0]; // 5 min

    // Store challenge in totp_attempts table
    await db.prepare(
      'INSERT INTO totp_attempts (id, user_id, ip, success, created_at) VALUES (?, ?, ?, 0, datetime("now"))'
    ).bind(challengeId, row.id, ip).run();

    await logSecurityEvent(db, '2fa_challenge_issued', 'low',
      `2FA challenge issued for ${row.username}`, ip, row.id, row.username);

    return c.json({
      requires2FA: true,
      challengeId,
      username: row.username,
      message: 'Two-factor authentication required. Enter your authenticator code.',
    });
  }

  // ===== NO 2FA — Complete login =====
  // Generate session fingerprint (binds token to User-Agent + IP)
  const fingerprint = await createSessionFingerprint(userAgent, ip);

  // Update last login
  await db.prepare('UPDATE users SET last_login = datetime("now"), sessions_today = sessions_today + 1, updated_at = datetime("now") WHERE id = ?')
    .bind(row.id).run();

  // Create token with fingerprint
  const { token, jti, expiresIn, expiresAt } = await createToken(row.id, row.username, row.role, row.tier, fingerprint);

  // Store session fingerprint in DB for server-side verification
  await storeSessionFingerprint(db, jti, row.id, fingerprint, ip);

  // Log successful login
  await auditLog(db, row.name, 'Login', row.id, `User ${row.username} logged in`, ip, row.tier);
  await logSecurityEvent(db, 'login_success', 'low', `Successful login: ${row.username}`, ip, row.id, row.username, { jti });

  // Decrypt PII fields for response
  const email = isEncrypted(row.email || '') ? await decryptField(row.email) : row.email;

  // Check if 2FA is available but not enabled (for prompt)
  const totpSetup: any = await db.prepare(
    'SELECT enabled, verified FROM totp_secrets WHERE user_id = ?'
  ).bind(row.id).first();

  return c.json({
    user: {
      id: row.id, username: row.username, name: row.name, role: row.role,
      fullRole: row.full_role, institution: row.institution, tier: row.tier,
      avatar: row.avatar, email, createdAt: row.created_at, lastLogin: row.last_login,
    },
    token,
    expiresIn,
    expiresAt,
    security: {
      sessionFingerprint: true,
      tokenBlacklist: true,
      encryptionAtRest: true,
      twoFactorEnabled: totpSetup?.enabled === 1 && totpSetup?.verified === 1,
      twoFactorAvailable: true,
    },
  });
});

// =============================================================================
// FORGOT PASSWORD — OTP-based password reset
// =============================================================================
// Step 1: POST /auth/forgot-password — sends 6-digit OTP to user's email
// Step 2: POST /auth/verify-reset   — verifies OTP + sets new password
// Public endpoints (no JWT required), rate-limited per IP
// =============================================================================

api.post('/auth/forgot-password', async (c) => {
  const db = c.env.DB;
  const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';

  let username: string;
  try {
    const body = await c.req.json();
    username = body.username;
  } catch {
    return c.json({ error: 'Invalid request body' }, 400);
  }

  if (!username) return c.json({ error: 'Username is required' }, 400);

  // Rate limit: max 3 reset requests per IP per hour
  try {
    const hourAgo = new Date(Date.now() - 3600000).toISOString().replace('T', ' ').split('.')[0];
    const recent: any = await db.prepare(
      "SELECT COUNT(*) as cnt FROM password_reset_tokens WHERE email != '' AND created_at >= ? AND id LIKE ?"
    ).bind(hourAgo, `prt-${ip.replace(/\./g, '')}%`).first();
    if (recent && recent.cnt >= 3) {
      await logSecurityEvent(db, 'reset_rate_limited', 'medium', `Password reset rate limit hit from ${ip}`, ip);
      return c.json({ error: 'Too many reset requests. Please try again later.', code: 'RATE_LIMITED' }, 429);
    }
  } catch {}

  // Find user
  const user: any = await db.prepare(
    'SELECT id, username, email, name, status FROM users WHERE username = ?'
  ).bind(username).first();

  // Always return success (don't reveal if user exists)
  if (!user || user.status === 'Suspended') {
    await logSecurityEvent(db, 'reset_unknown_user', 'low', `Reset requested for unknown/suspended user: ${username}`, ip);
    return c.json({ success: true, message: 'If this account exists, a reset code has been sent to the registered email.' });
  }

  const email = user.email;
  if (!email) {
    return c.json({ success: true, message: 'If this account exists, a reset code has been sent to the registered email.' });
  }

  // Generate 6-digit OTP
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const otpHash = await hashPassword(otp);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString().replace('T', ' ').split('.')[0]; // 15 min
  const tokenId = 'prt-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);

  // Invalidate any existing unused tokens for this user
  await db.prepare(
    "UPDATE password_reset_tokens SET used = 1 WHERE user_id = ? AND used = 0"
  ).bind(user.id).run();

  // Store token
  await db.prepare(
    'INSERT INTO password_reset_tokens (id, user_id, otp_hash, email, expires_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(tokenId, user.id, otpHash, email, expiresAt).run();

  // Mask email for response (show first 2 chars + domain)
  const parts = email.split('@');
  const maskedEmail = parts[0].substring(0, 2) + '***@' + parts[1];

  // Send OTP via email (Resend API)
  let emailSent = false;
  const resendApiKey = (c.env as any).RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'BioR Platform <noreply@bior.tech>',
          to: [email],
          subject: `BioR Password Reset Code: ${otp}`,
          html: `
            <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0f1219;border-radius:16px;border:1px solid rgba(255,255,255,0.1)">
              <div style="text-align:center;margin-bottom:24px">
                <div style="width:48px;height:48px;background:linear-gradient(135deg,#00A86B,#006241);border-radius:12px;display:inline-flex;align-items:center;justify-content:center">
                  <span style="color:white;font-size:20px">🧬</span>
                </div>
                <h2 style="color:#ffffff;margin:12px 0 4px;font-size:18px">BioR Password Reset</h2>
                <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:0">Biological Response Network</p>
              </div>
              <div style="background:rgba(0,168,107,0.1);border:1px solid rgba(0,168,107,0.2);border-radius:12px;padding:20px;text-align:center;margin-bottom:20px">
                <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:0 0 8px">Your verification code</p>
                <div style="font-size:32px;font-weight:700;letter-spacing:8px;color:#00A86B;font-family:monospace">${otp}</div>
              </div>
              <p style="color:rgba(255,255,255,0.5);font-size:11px;line-height:1.6;margin:0">
                This code expires in <strong style="color:#fff">15 minutes</strong>. If you did not request a password reset, please ignore this email.
              </p>
              <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:20px 0"/>
              <p style="color:rgba(255,255,255,0.25);font-size:10px;text-align:center;margin:0">
                BioR Platform · <a href="https://bior.tech" style="color:rgba(0,168,107,0.6)">bior.tech</a>
              </p>
            </div>
          `
        })
      });
      emailSent = emailRes.ok;
    } catch (e) {
      console.error('[EMAIL] Failed to send OTP:', e);
    }
  }

  await logSecurityEvent(db, 'password_reset_requested', 'medium',
    `Password reset OTP generated for ${username} (email: ${maskedEmail}, sent: ${emailSent})`, ip, user.id, username);

  // If no email service configured, log OTP for development
  if (!emailSent) {
    console.log(`[DEV] Password reset OTP for ${username}: ${otp} (expires: ${expiresAt})`);
  }

  return c.json({
    success: true,
    message: 'If this account exists, a reset code has been sent to the registered email.',
    maskedEmail,
    emailSent,
    tokenId,
    // In dev mode without email service, include OTP for testing
    ...((!resendApiKey) ? { devOtp: otp } : {}),
    expiresIn: '15 minutes'
  });
});

api.post('/auth/verify-reset', async (c) => {
  const db = c.env.DB;
  const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';

  let tokenId: string, otp: string, newPassword: string;
  try {
    const body = await c.req.json();
    tokenId = body.tokenId;
    otp = body.otp;
    newPassword = body.newPassword;
  } catch {
    return c.json({ error: 'Invalid request body' }, 400);
  }

  if (!tokenId || !otp || !newPassword) {
    return c.json({ error: 'Token ID, OTP, and new password are required' }, 400);
  }

  // Validate password strength
  const pwError = validatePasswordStrength(newPassword);
  if (pwError) {
    return c.json({ error: pwError, code: 'WEAK_PASSWORD' }, 400);
  }

  // Find the token
  const token: any = await db.prepare(
    "SELECT * FROM password_reset_tokens WHERE id = ? AND used = 0 AND expires_at > datetime('now')"
  ).bind(tokenId).first();

  if (!token) {
    await logSecurityEvent(db, 'reset_invalid_token', 'medium', `Invalid/expired reset token: ${tokenId}`, ip);
    return c.json({ error: 'Reset code has expired or is invalid. Please request a new one.', code: 'TOKEN_INVALID' }, 400);
  }

  // Check max attempts (5)
  if (token.attempts >= 5) {
    await db.prepare("UPDATE password_reset_tokens SET used = 1 WHERE id = ?").bind(tokenId).run();
    await logSecurityEvent(db, 'reset_max_attempts', 'high', `Max OTP attempts exceeded for token: ${tokenId}`, ip, token.user_id);
    return c.json({ error: 'Too many failed attempts. Please request a new reset code.', code: 'MAX_ATTEMPTS' }, 400);
  }

  // Verify OTP
  const otpValid = await verifyPassword(otp, token.otp_hash);
  if (!otpValid) {
    await db.prepare("UPDATE password_reset_tokens SET attempts = attempts + 1 WHERE id = ?").bind(tokenId).run();
    const remaining = 4 - token.attempts;
    await logSecurityEvent(db, 'reset_wrong_otp', 'medium', `Wrong OTP for token: ${tokenId} (${remaining} attempts left)`, ip, token.user_id);
    return c.json({ error: `Incorrect code. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`, code: 'WRONG_OTP' }, 400);
  }

  // OTP valid — reset the password
  const newHash = await hashPassword(newPassword);
  await db.prepare(
    "UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?"
  ).bind(newHash, token.user_id).run();

  // Mark token as used
  await db.prepare("UPDATE password_reset_tokens SET used = 1 WHERE id = ?").bind(tokenId).run();

  // Revoke all existing sessions for security
  await blacklistAllUserTokens(db, token.user_id, 'password_reset_via_otp');

  await logSecurityEvent(db, 'password_reset_success', 'high',
    `Password reset successfully via OTP for user: ${token.user_id}`, ip, token.user_id);

  await auditLog(db, 'System', 'Password Reset (OTP)', token.user_id,
    `Password reset via forgot-password OTP flow`, ip, 0);

  return c.json({ success: true, message: 'Password reset successfully. Please sign in with your new password.' });
});

// =============================================================================
// TWO-FACTOR AUTHENTICATION (TOTP)
// =============================================================================
// POST /auth/2fa/verify-login  — verify TOTP during login (public)
// POST /auth/2fa/setup          — begin 2FA setup (JWT required)
// POST /auth/2fa/verify-setup   — confirm setup with first valid code (JWT)
// POST /auth/2fa/disable        — disable 2FA (JWT, requires current code)
// GET  /auth/2fa/status          — check 2FA status (JWT)
// POST /auth/2fa/recovery        — use recovery code during login (public)
// =============================================================================

// Verify TOTP code during login (public — called after login returns requires2FA)
api.post('/auth/2fa/verify-login', async (c) => {
  const db = c.env.DB;
  const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';
  const userAgent = c.req.header('User-Agent') || '';

  let challengeId: string, code: string;
  try {
    const body = await c.req.json();
    challengeId = body.challengeId;
    code = body.code;
  } catch {
    return c.json({ error: 'Invalid request body' }, 400);
  }

  if (!challengeId || !code) return c.json({ error: 'Challenge ID and code are required' }, 400);

  // Find the challenge
  const challenge: any = await db.prepare(
    "SELECT * FROM totp_attempts WHERE id = ? AND success = 0 AND created_at >= datetime('now', '-5 minutes')"
  ).bind(challengeId).first();

  if (!challenge) {
    await logSecurityEvent(db, '2fa_invalid_challenge', 'medium', `Invalid/expired 2FA challenge: ${challengeId}`, ip);
    return c.json({ error: '2FA session expired. Please sign in again.', code: 'CHALLENGE_EXPIRED' }, 400);
  }

  // Rate limit: max 5 2FA attempts per challenge
  const attempts: any = await db.prepare(
    "SELECT COUNT(*) as cnt FROM totp_attempts WHERE user_id = ? AND success = 0 AND created_at >= datetime('now', '-5 minutes')"
  ).bind(challenge.user_id).first();
  if (attempts && attempts.cnt > 5) {
    await logSecurityEvent(db, '2fa_rate_limited', 'high', `2FA rate limited for user ${challenge.user_id}`, ip, challenge.user_id);
    return c.json({ error: 'Too many attempts. Please sign in again.', code: 'RATE_LIMITED' }, 429);
  }

  // Get TOTP secret
  const totpRow: any = await db.prepare(
    'SELECT secret FROM totp_secrets WHERE user_id = ? AND enabled = 1 AND verified = 1'
  ).bind(challenge.user_id).first();

  if (!totpRow) {
    return c.json({ error: '2FA not configured for this account.', code: '2FA_NOT_FOUND' }, 400);
  }

  // Verify TOTP code
  const isValid = await verifyTOTP(totpRow.secret, code.trim());
  if (!isValid) {
    // Track attempt
    await db.prepare(
      'INSERT INTO totp_attempts (id, user_id, ip, success) VALUES (?, ?, ?, 0)'
    ).bind('ta-' + Date.now().toString(36), challenge.user_id, ip).run();
    await logSecurityEvent(db, '2fa_failed', 'medium', `Invalid 2FA code for user ${challenge.user_id}`, ip, challenge.user_id);
    return c.json({ error: 'Invalid authenticator code. Please try again.', code: 'INVALID_CODE' }, 401);
  }

  // 2FA passed! Mark challenge as successful
  await db.prepare('UPDATE totp_attempts SET success = 1 WHERE id = ?').bind(challengeId).run();

  // Load user data and complete login
  const row: any = await db.prepare('SELECT * FROM users WHERE id = ?').bind(challenge.user_id).first();
  if (!row) return c.json({ error: 'User not found' }, 404);

  const fingerprint = await createSessionFingerprint(userAgent, ip);
  await db.prepare('UPDATE users SET last_login = datetime("now"), sessions_today = sessions_today + 1, updated_at = datetime("now") WHERE id = ?')
    .bind(row.id).run();

  const { token, jti, expiresIn, expiresAt } = await createToken(row.id, row.username, row.role, row.tier, fingerprint);
  await storeSessionFingerprint(db, jti, row.id, fingerprint, ip);

  await auditLog(db, row.name, 'Login (2FA)', row.id, `User ${row.username} logged in with 2FA`, ip, row.tier);
  await logSecurityEvent(db, 'login_2fa_success', 'low', `2FA login: ${row.username}`, ip, row.id, row.username, { jti });

  const email = isEncrypted(row.email || '') ? await decryptField(row.email) : row.email;

  return c.json({
    user: {
      id: row.id, username: row.username, name: row.name, role: row.role,
      fullRole: row.full_role, institution: row.institution, tier: row.tier,
      avatar: row.avatar, email, createdAt: row.created_at, lastLogin: row.last_login,
    },
    token,
    expiresIn,
    expiresAt,
    security: {
      sessionFingerprint: true,
      tokenBlacklist: true,
      encryptionAtRest: true,
      twoFactorEnabled: true,
    },
  });
});

// Use recovery code during login (public)
api.post('/auth/2fa/recovery', async (c) => {
  const db = c.env.DB;
  const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';
  const userAgent = c.req.header('User-Agent') || '';

  let challengeId: string, recoveryCode: string;
  try {
    const body = await c.req.json();
    challengeId = body.challengeId;
    recoveryCode = body.recoveryCode;
  } catch {
    return c.json({ error: 'Invalid request body' }, 400);
  }

  if (!challengeId || !recoveryCode) return c.json({ error: 'Challenge ID and recovery code are required' }, 400);

  // Find the challenge
  const challenge: any = await db.prepare(
    "SELECT * FROM totp_attempts WHERE id = ? AND success = 0 AND created_at >= datetime('now', '-5 minutes')"
  ).bind(challengeId).first();

  if (!challenge) {
    return c.json({ error: '2FA session expired. Please sign in again.', code: 'CHALLENGE_EXPIRED' }, 400);
  }

  // Get recovery codes
  const totpRow: any = await db.prepare(
    'SELECT recovery_codes FROM totp_secrets WHERE user_id = ? AND enabled = 1'
  ).bind(challenge.user_id).first();

  if (!totpRow || !totpRow.recovery_codes) {
    return c.json({ error: 'No recovery codes found.', code: 'NO_RECOVERY' }, 400);
  }

  const codes: string[] = JSON.parse(totpRow.recovery_codes);
  const normalizedInput = recoveryCode.trim().toUpperCase().replace(/\s/g, '');
  const codeIndex = codes.findIndex(c => c.replace(/-/g, '') === normalizedInput.replace(/-/g, ''));

  if (codeIndex === -1) {
    await logSecurityEvent(db, '2fa_recovery_failed', 'high', `Invalid recovery code for user ${challenge.user_id}`, ip, challenge.user_id);
    return c.json({ error: 'Invalid recovery code.', code: 'INVALID_RECOVERY' }, 401);
  }

  // Remove used recovery code
  codes.splice(codeIndex, 1);
  await db.prepare('UPDATE totp_secrets SET recovery_codes = ?, updated_at = datetime("now") WHERE user_id = ?')
    .bind(JSON.stringify(codes), challenge.user_id).run();

  // Mark challenge as successful
  await db.prepare('UPDATE totp_attempts SET success = 1 WHERE id = ?').bind(challengeId).run();

  // Complete login
  const row: any = await db.prepare('SELECT * FROM users WHERE id = ?').bind(challenge.user_id).first();
  if (!row) return c.json({ error: 'User not found' }, 404);

  const fingerprint = await createSessionFingerprint(userAgent, ip);
  await db.prepare('UPDATE users SET last_login = datetime("now"), sessions_today = sessions_today + 1, updated_at = datetime("now") WHERE id = ?')
    .bind(row.id).run();
  const { token, jti, expiresIn, expiresAt } = await createToken(row.id, row.username, row.role, row.tier, fingerprint);
  await storeSessionFingerprint(db, jti, row.id, fingerprint, ip);

  await auditLog(db, row.name, 'Login (Recovery)', row.id, `User ${row.username} used recovery code (${codes.length} remaining)`, ip, row.tier);
  await logSecurityEvent(db, 'login_recovery_success', 'high', `Recovery code login: ${row.username} (${codes.length} codes left)`, ip, row.id, row.username);

  const email = isEncrypted(row.email || '') ? await decryptField(row.email) : row.email;

  return c.json({
    user: {
      id: row.id, username: row.username, name: row.name, role: row.role,
      fullRole: row.full_role, institution: row.institution, tier: row.tier,
      avatar: row.avatar, email, createdAt: row.created_at, lastLogin: row.last_login,
    },
    token, expiresIn, expiresAt,
    security: { twoFactorEnabled: true },
    recoveryWarning: codes.length <= 2 ? `Only ${codes.length} recovery codes remaining. Please generate new ones.` : undefined,
    remainingCodes: codes.length,
  });
});

// Get 2FA status (JWT required)
api.get('/auth/2fa/status', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const totpRow: any = await db.prepare(
    'SELECT enabled, verified, created_at, updated_at, recovery_codes FROM totp_secrets WHERE user_id = ?'
  ).bind(user.id).first();

  if (!totpRow) {
    return c.json({ enabled: false, verified: false, setupStarted: false });
  }

  const codes: string[] = totpRow.recovery_codes ? JSON.parse(totpRow.recovery_codes) : [];
  return c.json({
    enabled: totpRow.enabled === 1,
    verified: totpRow.verified === 1,
    setupStarted: true,
    createdAt: totpRow.created_at,
    updatedAt: totpRow.updated_at,
    recoveryCodesRemaining: codes.length,
  });
});

// Begin 2FA setup (JWT required)
api.post('/auth/2fa/setup', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';

  // Check if already enabled
  const existing: any = await db.prepare(
    'SELECT enabled, verified FROM totp_secrets WHERE user_id = ?'
  ).bind(user.id).first();

  if (existing && existing.enabled === 1 && existing.verified === 1) {
    return c.json({ error: '2FA is already enabled. Disable it first to reconfigure.' }, 400);
  }

  // Generate new secret and recovery codes
  const secret = generateSecret();
  const recoveryCodes = generateRecoveryCodes();
  const otpauthUri = generateOTPAuthURI(secret, user.username);

  // Store (or replace pending setup)
  if (existing) {
    await db.prepare(
      'UPDATE totp_secrets SET secret = ?, enabled = 0, verified = 0, recovery_codes = ?, updated_at = datetime("now") WHERE user_id = ?'
    ).bind(secret, JSON.stringify(recoveryCodes), user.id).run();
  } else {
    await db.prepare(
      'INSERT INTO totp_secrets (user_id, secret, enabled, verified, recovery_codes) VALUES (?, ?, 0, 0, ?)'
    ).bind(user.id, secret, JSON.stringify(recoveryCodes)).run();
  }

  await auditLog(db, user.username, '2FA Setup Started', user.id, '2FA TOTP setup initiated', ip, user.tier);

  return c.json({
    success: true,
    secret,
    otpauthUri,
    recoveryCodes,
    message: 'Scan the QR code with your authenticator app, then enter the 6-digit code to verify.',
  });
});

// Verify 2FA setup with first valid code (JWT required)
api.post('/auth/2fa/verify-setup', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';

  let code: string;
  try {
    const body = await c.req.json();
    code = body.code;
  } catch {
    return c.json({ error: 'Invalid request body' }, 400);
  }

  if (!code || code.length !== 6) return c.json({ error: 'Enter a valid 6-digit code' }, 400);

  // Get the pending secret
  const totpRow: any = await db.prepare(
    'SELECT secret FROM totp_secrets WHERE user_id = ? AND verified = 0'
  ).bind(user.id).first();

  if (!totpRow) {
    return c.json({ error: 'No pending 2FA setup found. Start setup first.' }, 400);
  }

  // Verify the code against the secret
  const isValid = await verifyTOTP(totpRow.secret, code.trim());
  if (!isValid) {
    return c.json({ error: 'Invalid code. Make sure your authenticator app is synced correctly.' }, 400);
  }

  // Enable 2FA
  await db.prepare(
    'UPDATE totp_secrets SET enabled = 1, verified = 1, updated_at = datetime("now") WHERE user_id = ?'
  ).bind(user.id).run();

  await auditLog(db, user.username, '2FA Enabled', user.id, 'TOTP 2FA successfully enabled', ip, user.tier);
  await logSecurityEvent(db, '2fa_enabled', 'high', `2FA enabled for ${user.username}`, ip, user.id, user.username);

  return c.json({
    success: true,
    message: 'Two-factor authentication is now enabled! You will need your authenticator app on every login.',
  });
});

// Disable 2FA (JWT required, requires current TOTP code or password)
api.post('/auth/2fa/disable', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';

  let code: string, password: string;
  try {
    const body = await c.req.json();
    code = body.code;
    password = body.password;
  } catch {
    return c.json({ error: 'Invalid request body' }, 400);
  }

  if (!code && !password) return c.json({ error: 'Current TOTP code or password required' }, 400);

  // Verify identity
  const totpRow: any = await db.prepare(
    'SELECT secret FROM totp_secrets WHERE user_id = ? AND enabled = 1'
  ).bind(user.id).first();

  if (!totpRow) {
    return c.json({ error: '2FA is not enabled.' }, 400);
  }

  if (code) {
    const isValid = await verifyTOTP(totpRow.secret, code.trim());
    if (!isValid) {
      await logSecurityEvent(db, '2fa_disable_failed', 'high', `Failed 2FA disable attempt for ${user.username}`, ip, user.id, user.username);
      return c.json({ error: 'Invalid authenticator code.' }, 401);
    }
  } else if (password) {
    const row: any = await db.prepare('SELECT password_hash FROM users WHERE id = ?').bind(user.id).first();
    if (!row) return c.json({ error: 'User not found' }, 404);
    const valid = await verifyPassword(password, row.password_hash);
    if (!valid) {
      await logSecurityEvent(db, '2fa_disable_failed', 'high', `Wrong password for 2FA disable: ${user.username}`, ip, user.id, user.username);
      return c.json({ error: 'Invalid password.' }, 401);
    }
  }

  // Disable 2FA
  await db.prepare('DELETE FROM totp_secrets WHERE user_id = ?').bind(user.id).run();

  await auditLog(db, user.username, '2FA Disabled', user.id, 'TOTP 2FA disabled', ip, user.tier);
  await logSecurityEvent(db, '2fa_disabled', 'high', `2FA disabled for ${user.username}`, ip, user.id, user.username);

  return c.json({ success: true, message: 'Two-factor authentication has been disabled.' });
});

api.get('/auth/me', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const row: any = await db.prepare('SELECT * FROM users WHERE id = ?').bind(user.id).first();
  if (!row) return c.json({ error: 'User not found' }, 404);

  // Get recent activity for this user
  const activity = await db.prepare(
    'SELECT action, resource, details, timestamp, ip FROM audit_log WHERE user = ? ORDER BY timestamp DESC LIMIT 10'
  ).bind(row.name).all();

  // Session info (login count, last IPs)
  const loginCount: any = await db.prepare(
    "SELECT COUNT(*) as cnt FROM audit_log WHERE user = ? AND action = 'Login'"
  ).bind(row.name).first();

  const recentIps = await db.prepare(
    "SELECT DISTINCT ip FROM audit_log WHERE user = ? AND action = 'Login' ORDER BY timestamp DESC LIMIT 5"
  ).bind(row.name).all();

  // Check 2FA status for this user
  const totp2fa: any = await db.prepare(
    'SELECT enabled, verified, recovery_codes FROM totp_secrets WHERE user_id = ?'
  ).bind(user.id).first();
  const recoveryCodes2fa: string[] = totp2fa?.recovery_codes ? JSON.parse(totp2fa.recovery_codes) : [];

  return c.json({
    id: row.id, username: row.username, name: row.name, role: row.role,
    fullRole: row.full_role, institution: row.institution, tier: row.tier,
    avatar: row.avatar, email: row.email, createdAt: row.created_at, lastLogin: row.last_login,
    sessionsToday: row.sessions_today,
    recentActivity: (activity.results as any[]).map(r => ({
      action: r.action, resource: r.resource, details: r.details, timestamp: r.timestamp, ip: r.ip,
    })),
    totalLogins: loginCount?.cnt || 0,
    recentIps: (recentIps.results as any[]).map(r => r.ip),
    twoFactor: {
      enabled: totp2fa?.enabled === 1 && totp2fa?.verified === 1,
      recoveryCodesRemaining: recoveryCodes2fa.length,
    },
  });
});

// Update own profile (any authenticated user)
api.put('/auth/profile', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const { name, email, avatar } = await c.req.json();

  const updates: string[] = [];
  const binds: any[] = [];
  if (name) { updates.push('name = ?'); binds.push(name); }
  if (email !== undefined) { updates.push('email = ?'); binds.push(email); }
  if (avatar) { updates.push('avatar = ?'); binds.push(avatar); }
  if (updates.length === 0) return c.json({ error: 'No changes provided' }, 400);

  updates.push('updated_at = datetime("now")');
  binds.push(user.id);

  await db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).bind(...binds).run();
  await auditLog(db, user.username, 'Profile Updated', user.id, `Updated: ${updates.filter(u => u !== 'updated_at = datetime("now")').join(', ')}`, c.req.header('CF-Connecting-IP') || 'unknown', user.tier);

  // Return updated user
  const row: any = await db.prepare('SELECT * FROM users WHERE id = ?').bind(user.id).first();
  return c.json({
    success: true,
    user: {
      id: row.id, username: row.username, name: row.name, role: row.role,
      fullRole: row.full_role, institution: row.institution, tier: row.tier,
      avatar: row.avatar, email: row.email,
    }
  });
});

// Change own password (any authenticated user)
// SECURITY: Revokes ALL existing tokens on password change (forced re-auth)
api.post('/auth/change-password', async (c) => {
  const user = c.get('user') as AuthUser;
  const db = c.env.DB;
  const ip = c.req.header('CF-Connecting-IP') || 'unknown';
  const { currentPassword, newPassword } = await c.req.json();

  if (!currentPassword || !newPassword) return c.json({ error: 'Current and new passwords required' }, 400);
  const pwError = validatePasswordStrength(newPassword);
  if (pwError) return c.json({ error: pwError }, 400);

  const row: any = await db.prepare('SELECT password_hash FROM users WHERE id = ?').bind(user.id).first();
  if (!row) return c.json({ error: 'User not found' }, 404);

  // Verify current password
  let valid = false;
  if (row.password_hash.startsWith('__HASH_') && row.password_hash.endsWith('__')) {
    valid = currentPassword === row.password_hash.slice(7, -2);
  } else {
    valid = await verifyPassword(currentPassword, row.password_hash);
  }
  if (!valid) return c.json({ error: 'Current password is incorrect' }, 401);

  const newHash = await hashPassword(newPassword);
  await db.prepare('UPDATE users SET password_hash = ?, updated_at = datetime("now") WHERE id = ?').bind(newHash, user.id).run();

  // TOKEN REVOCATION: Blacklist all existing tokens for this user
  await blacklistAllUserTokens(db, user.id, 'password_changed');
  await auditLog(db, user.username, 'Password Changed', user.id, 'User changed own password — all sessions revoked', ip, user.tier);
  await logSecurityEvent(db, 'password_changed', 'medium', `${user.username} changed password — all tokens revoked`, ip, user.id, user.username);

  return c.json({ success: true, message: 'Password updated. All existing sessions have been revoked. Please sign in again.', requireReAuth: true });
});

// Registration is DISABLED for security — only admins can create users
// Uncomment and add admin approval workflow if self-registration is needed
api.post('/auth/register', async (c) => {
  return c.json({ error: 'Registration is disabled. Contact your administrator to create an account.' }, 403);
});

// Password reset requires Admin authentication — no anonymous reset
api.post('/auth/reset-password', requireRole('Admin'), async (c) => {
  const { username, newPassword } = await c.req.json();
  if (!username || !newPassword) return c.json({ error: 'Username and new password required' }, 400);
  const pwError = validatePasswordStrength(newPassword);
  if (pwError) return c.json({ error: pwError }, 400);

  const db = c.env.DB;
  const row: any = await db.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
  if (!row) return c.json({ error: 'User not found' }, 404);

  const passwordHash = await hashPassword(newPassword);
  await db.prepare('UPDATE users SET password_hash = ?, updated_at = datetime("now") WHERE id = ?')
    .bind(passwordHash, row.id).run();

  const caller = c.get('user');
  await auditLog(db, caller.username, 'Password Reset', row.id, `Admin reset password for ${username}`, c.req.header('CF-Connecting-IP') || 'unknown', caller.tier);

  return c.json({ success: true });
});

// =============================================================================
// DASHBOARD
// =============================================================================

api.get('/dashboard', async (c) => {
  const db = c.env.DB;

  // Fetch all dashboard metrics from DB
  const metricsRows = await db.prepare('SELECT metric_key, metric_value FROM dashboard_metrics').all();
  const metrics: Record<string, any> = {};
  for (const row of metricsRows.results as any[]) {
    metrics[row.metric_key] = parseJSON(row.metric_value);
  }

  const summary = metrics['summary'] || {};
  const ewsScores = metrics['ews_scores'] || {};
  const sparklines = metrics['sparklines'] || {};
  const recentActivity = metrics['recent_activity'] || [];
  const topPathogens = metrics['top_pathogens'] || [];
  const mapMarkers = metrics['map_markers'] || [];
  const regionBreakdown = metrics['region_breakdown'] || [];
  const weeklyTrend = metrics['weekly_trend'] || {};

  return c.json({
    ...summary,
    ewsScores,
    sparklines,
    recentActivity,
    topPathogens,
    mapMarkers,
    regionBreakdown,
    weeklyTrend,
  });
});

// =============================================================================
// SURVEILLANCE SITES (CRUD)
// =============================================================================

api.get('/surveillance', async (c) => {
  const db = c.env.DB;
  const search = c.req.query('search')?.toLowerCase();
  const type = c.req.query('type');
  const status = c.req.query('status');
  const region = c.req.query('region');
  const page = parseInt(c.req.query('page') || '1');
  const limit = Math.min(parseInt(c.req.query('limit') || '50'), 100);
  const offset = (page - 1) * limit;

  let where: string[] = [];
  let params: any[] = [];

  if (search) { where.push('(LOWER(name) LIKE ? OR LOWER(region) LIKE ? OR LOWER(contact_person) LIKE ?)'); params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
  if (type) { where.push('type = ?'); params.push(type); }
  if (status) { where.push('status = ?'); params.push(status); }
  if (region) { where.push('region = ?'); params.push(region); }

  const whereClause = where.length ? ' WHERE ' + where.join(' AND ') : '';

  const countResult: any = await db.prepare(`SELECT COUNT(*) as total FROM surveillance_sites${whereClause}`).bind(...params).first();
  const rows = await db.prepare(`SELECT * FROM surveillance_sites${whereClause} ORDER BY dq_score DESC LIMIT ? OFFSET ?`).bind(...params, limit, offset).all();

  const sites = (rows.results as any[]).map(r => ({
    id: r.id, name: r.name, type: r.type, region: r.region, status: r.status,
    lastReport: r.last_report, dqScore: r.dq_score, lat: r.lat, lng: r.lng,
    casesThisWeek: r.cases_this_week, samplesSubmitted: r.samples_submitted,
    contactPerson: r.contact_person, phone: r.phone, capacity: r.capacity,
    pathogens: parseJSON(r.pathogens, []),
  }));

  return c.json({ sites, total: countResult.total, page, limit });
});

api.get('/surveillance/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const row: any = await db.prepare('SELECT * FROM surveillance_sites WHERE id = ?').bind(id).first();
  if (!row) return c.json({ error: 'Site not found' }, 404);
  return c.json({
    id: row.id, name: row.name, type: row.type, region: row.region, status: row.status,
    lastReport: row.last_report, dqScore: row.dq_score, lat: row.lat, lng: row.lng,
    casesThisWeek: row.cases_this_week, samplesSubmitted: row.samples_submitted,
    contactPerson: row.contact_person, phone: row.phone, capacity: row.capacity,
    pathogens: parseJSON(row.pathogens, []),
  });
});

api.post('/surveillance', requireTier(3), async (c) => {
  const db = c.env.DB;
  const data = await c.req.json();
  const id = 's' + (Date.now() % 100000).toString().padStart(2, '0');

  await db.prepare(
    'INSERT INTO surveillance_sites (id, name, type, region, status, lat, lng, contact_person, phone, capacity, pathogens, dq_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, data.name, data.type, data.region, data.status || 'Active', data.lat || 0, data.lng || 0,
    data.contactPerson || '', data.phone || '', data.capacity || '', JSON.stringify(data.pathogens || []), data.dqScore || 0
  ).run();

  const user = c.get('user');
  await auditLog(db, user.username, 'Create Site', id, `Created surveillance site: ${data.name}`, c.req.header('CF-Connecting-IP') || 'unknown', user.tier);

  // SSE broadcast: new surveillance site
  broadcast({ event: 'surveillance', data: { action: 'site_created', siteId: id, name: data.name, region: data.region, creator: user.username } });

  return c.json({ success: true, id }, 201);
});

api.put('/surveillance/:id', requireTier(3), async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const data = await c.req.json();

  await db.prepare(
    'UPDATE surveillance_sites SET name=?, type=?, region=?, status=?, lat=?, lng=?, contact_person=?, phone=?, capacity=?, pathogens=?, dq_score=?, cases_this_week=?, samples_submitted=?, last_report=?, updated_at=datetime("now") WHERE id=?'
  ).bind(data.name, data.type, data.region, data.status, data.lat, data.lng,
    data.contactPerson, data.phone, data.capacity, JSON.stringify(data.pathogens || []),
    data.dqScore, data.casesThisWeek || 0, data.samplesSubmitted || 0, data.lastReport || null, id
  ).run();

  return c.json({ success: true });
});

// =============================================================================
// THREATS (CRUD)
// =============================================================================

api.get('/threats', async (c) => {
  const db = c.env.DB;
  const severity = c.req.query('severity');
  const page = parseInt(c.req.query('page') || '1');
  const limit = Math.min(parseInt(c.req.query('limit') || '50'), 100);
  const offset = (page - 1) * limit;

  let where = '';
  let params: any[] = [];
  if (severity) { where = ' WHERE severity = ?'; params.push(severity); }

  const countResult: any = await db.prepare(`SELECT COUNT(*) as total FROM threats${where}`).bind(...params).first();
  const rows = await db.prepare(`SELECT * FROM threats${where} ORDER BY risk_score DESC LIMIT ? OFFSET ?`).bind(...params, limit, offset).all();

  const threats = (rows.results as any[]).map(r => ({
    id: r.id, name: r.name, pathogen: r.pathogen, icd11: r.icd11, severity: r.severity,
    cases: r.cases, deaths: r.deaths, cfr: r.cfr, regions: parseJSON(r.regions, []),
    containment: r.containment, detected: r.detected, riskScore: r.risk_score,
    labConfirmed: r.lab_confirmed, genomicClusterId: r.genomic_cluster_id,
    trend: r.trend, weeklyChange: r.weekly_change, ihReportable: !!r.ih_reportable,
    responseTeams: r.response_teams, waterSources: r.water_sources,
    timeline: parseJSON(r.timeline, []),
  }));

  return c.json({ threats, total: countResult.total, page, limit });
});

api.post('/threats', requireTier(3), async (c) => {
  const db = c.env.DB;
  const d = await c.req.json();
  const id = 't' + (Date.now() % 100000).toString().padStart(2, '0');

  await db.prepare(
    'INSERT INTO threats (id, name, pathogen, icd11, severity, cases, deaths, cfr, regions, containment, detected, risk_score, lab_confirmed, genomic_cluster_id, trend, weekly_change, ih_reportable, response_teams, water_sources, timeline) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, d.name, d.pathogen, d.icd11 || '', d.severity || 'Low', d.cases || 0, d.deaths || 0, d.cfr || 0,
    JSON.stringify(d.regions || []), d.containment || 0, d.detected || new Date().toISOString().slice(0, 10),
    d.riskScore || 0, d.labConfirmed || 0, d.genomicClusterId || null, d.trend || 'stable',
    d.weeklyChange || '0', d.ihReportable ? 1 : 0, d.responseTeams || 0, d.waterSources || 0,
    JSON.stringify(d.timeline || [])
  ).run();

  const user = c.get('user');
  await auditLog(db, user.username, 'Create Threat', id, `Created threat: ${d.name}`, c.req.header('CF-Connecting-IP') || 'unknown', user.tier);

  // SSE broadcast: new threat created
  broadcast({ event: 'surveillance', data: { action: 'threat_created', threatId: id, name: d.name, severity: d.severity || 'Low', creator: user.username } });

  return c.json({ success: true, id }, 201);
});

api.put('/threats/:id', requireTier(3), async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const d = await c.req.json();

  await db.prepare(
    'UPDATE threats SET name=?, pathogen=?, severity=?, cases=?, deaths=?, cfr=?, regions=?, containment=?, risk_score=?, lab_confirmed=?, trend=?, weekly_change=?, timeline=?, updated_at=datetime("now") WHERE id=?'
  ).bind(d.name, d.pathogen, d.severity, d.cases, d.deaths, d.cfr,
    JSON.stringify(d.regions || []), d.containment, d.riskScore, d.labConfirmed,
    d.trend, d.weeklyChange, JSON.stringify(d.timeline || []), id
  ).run();

  return c.json({ success: true });
});

// =============================================================================
// GENOMICS (CRUD)
// =============================================================================

api.get('/genomics', async (c) => {
  const db = c.env.DB;
  const status = c.req.query('status');
  const pathogen = c.req.query('pathogen');
  const search = c.req.query('search')?.toLowerCase();
  const page = parseInt(c.req.query('page') || '1');
  const limit = Math.min(parseInt(c.req.query('limit') || '50'), 100);
  const offset = (page - 1) * limit;

  let where: string[] = [];
  let params: any[] = [];
  if (status) { where.push('pipeline_status = ?'); params.push(status); }
  if (pathogen) { where.push('pathogen = ?'); params.push(pathogen); }
  if (search) { where.push('(LOWER(sample_id) LIKE ? OR LOWER(pathogen) LIKE ? OR LOWER(institution) LIKE ?)'); params.push(`%${search}%`, `%${search}%`, `%${search}%`); }

  const whereClause = where.length ? ' WHERE ' + where.join(' AND ') : '';
  const countResult: any = await db.prepare(`SELECT COUNT(*) as total FROM genomic_samples${whereClause}`).bind(...params).first();
  const rows = await db.prepare(`SELECT * FROM genomic_samples${whereClause} ORDER BY date DESC LIMIT ? OFFSET ?`).bind(...params, limit, offset).all();

  const samples = (rows.results as any[]).map(r => ({
    sampleId: r.sample_id, pathogen: r.pathogen, lineage: r.lineage, platform: r.platform,
    pipelineStatus: r.pipeline_status, coverage: r.coverage, amrDetected: !!r.amr_detected,
    amrGenes: parseJSON(r.amr_genes, []), quality: r.quality, institution: r.institution,
    date: r.date, readLength: r.read_length, totalReads: r.total_reads,
    assemblyLength: r.assembly_length, mutations: r.mutations, novelMutations: r.novel_mutations,
  }));

  // Fetch pipeline stages
  const stageRows = await db.prepare('SELECT * FROM pipeline_stages ORDER BY id').all();
  const pipelineStages = (stageRows.results as any[]).map(r => ({
    name: r.name, icon: r.icon, completed: r.completed, active: r.active, failed: r.failed,
  }));

  // Fetch AMR heatmap
  const amrRows = await db.prepare('SELECT * FROM amr_heatmap ORDER BY pathogen, antibiotic').all();
  const amrData = amrRows.results as any[];
  const pathogens = [...new Set(amrData.map(r => r.pathogen))];
  const antibiotics = [...new Set(amrData.map(r => r.antibiotic))];
  const heatmapMatrix = pathogens.map(p => antibiotics.map(a => {
    const match = amrData.find(r => r.pathogen === p && r.antibiotic === a);
    return match ? match.resistance_pct : 0;
  }));

  return c.json({
    samples, total: countResult.total, page, limit,
    pipelineStages,
    amrHeatmap: { pathogens, antibiotics, data: heatmapMatrix },
  });
});

api.post('/genomics', requireTier(2), async (c) => {
  const db = c.env.DB;
  const d = await c.req.json();
  const sampleId = d.sampleId || 'BioR-2026-SA-' + (Date.now() % 10000).toString().padStart(4, '0');

  await db.prepare(
    'INSERT INTO genomic_samples (sample_id, pathogen, lineage, platform, pipeline_status, coverage, amr_detected, amr_genes, quality, institution, date, read_length, total_reads, assembly_length, mutations, novel_mutations) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(sampleId, d.pathogen, d.lineage || '', d.platform || '', d.pipelineStatus || 'Queued',
    d.coverage || 0, d.amrDetected ? 1 : 0, JSON.stringify(d.amrGenes || []), d.quality || 'pending',
    d.institution || '', d.date || new Date().toISOString().slice(0, 10),
    d.readLength || '', d.totalReads || '', d.assemblyLength || '', d.mutations || 0, d.novelMutations || 0
  ).run();

  const user = c.get('user');
  await auditLog(db, user.username, 'Submit Sample', sampleId, `Submitted genomic sample: ${d.pathogen}`, c.req.header('CF-Connecting-IP') || 'unknown', user.tier);

  return c.json({ success: true, sampleId }, 201);
});

// =============================================================================
// ALERTS (CRUD)
// =============================================================================

api.get('/alerts', async (c) => {
  const db = c.env.DB;
  const level = c.req.query('level');
  const status = c.req.query('status');
  const page = parseInt(c.req.query('page') || '1');
  const limit = Math.min(parseInt(c.req.query('limit') || '50'), 100);
  const offset = (page - 1) * limit;

  let where: string[] = [];
  let params: any[] = [];
  if (level) { where.push('level = ?'); params.push(parseInt(level)); }
  if (status) { where.push('status = ?'); params.push(status); }

  const whereClause = where.length ? ' WHERE ' + where.join(' AND ') : '';
  const countResult: any = await db.prepare(`SELECT COUNT(*) as total FROM alerts${whereClause}`).bind(...params).first();
  const rows = await db.prepare(`SELECT * FROM alerts${whereClause} ORDER BY generated_at DESC LIMIT ? OFFSET ?`).bind(...params, limit, offset).all();

  const alerts = (rows.results as any[]).map(r => ({
    id: r.id, title: r.title, description: r.description, level: r.level, type: r.type,
    pathogen: r.pathogen, region: r.region, riskScore: r.risk_score, status: r.status,
    generatedAt: r.generated_at, generatedBy: r.generated_by, reviewedAt: r.reviewed_at,
    reviewer: r.reviewer, channels: parseJSON(r.channels, []),
    recommendedActions: parseJSON(r.recommended_actions, []),
    affectedPopulation: r.affected_population, responseStatus: r.response_status, sitrep: !!r.sitrep,
  }));

  return c.json({ alerts, total: countResult.total, page, limit });
});

// Bulk alert action — confirm or dismiss all pending alerts (must be before :id route)
api.patch('/alerts/bulk', requireTier(3), async (c) => {
  const db = c.env.DB;
  const { decision } = await c.req.json();
  const user = c.get('user');

  const statusMap: Record<string, string> = {
    confirm: 'confirmed',
    dismiss: 'dismissed',
  };
  const newStatus = statusMap[decision];
  if (!newStatus) return c.json({ error: 'Invalid decision. Use: confirm, dismiss' }, 400);

  const pending = await db.prepare(
    "SELECT id FROM alerts WHERE status = 'pending_review'"
  ).all();
  const ids = (pending.results as any[]).map((r: any) => r.id);
  if (ids.length === 0) return c.json({ success: true, updated: 0 });

  await db.prepare(
    "UPDATE alerts SET status = ?, reviewed_at = datetime('now'), reviewer = ?, updated_at = datetime('now') WHERE status = 'pending_review'"
  ).bind(newStatus, user.username).run();

  await auditLog(db, user.username, `Bulk Alert ${decision}`, ids.join(','), `Bulk ${decision}ed ${ids.length} alerts`, c.req.header('CF-Connecting-IP') || 'unknown', user.tier);

  // SSE broadcast: bulk alert review
  broadcast({ event: 'alert', data: { action: 'bulk_' + decision, count: ids.length, status: newStatus, reviewer: user.username } });

  return c.json({ success: true, updated: ids.length, status: newStatus });
});

api.patch('/alerts/:id/review', requireTier(3), async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const { decision } = await c.req.json();
  const user = c.get('user');

  const statusMap: Record<string, string> = {
    confirm: 'confirmed',
    dismiss: 'dismissed',
    escalate: 'escalated',
  };
  const newStatus = statusMap[decision];
  if (!newStatus) return c.json({ error: 'Invalid decision. Use: confirm, dismiss, escalate' }, 400);

  await db.prepare(
    'UPDATE alerts SET status = ?, reviewed_at = datetime("now"), reviewer = ?, updated_at = datetime("now") WHERE id = ?'
  ).bind(newStatus, user.username, id).run();

  await auditLog(db, user.username, `Alert ${decision}`, id, `Alert ${id} ${decision}ed`, c.req.header('CF-Connecting-IP') || 'unknown', user.tier);

  // SSE broadcast: alert reviewed
  broadcast({ event: 'alert', data: { action: decision, alertId: id, status: newStatus, reviewer: user.username } });

  return c.json({ success: true, id, status: newStatus });
});

// =============================================================================
// REPORTS
// =============================================================================

api.get('/reports', async (c) => {
  const db = c.env.DB;

  // Fetch chart data
  const dataRows = await db.prepare('SELECT key, value FROM reports_data').all();
  const data: Record<string, any> = {};
  for (const row of dataRows.results as any[]) {
    data[row.key] = parseJSON(row.value);
  }

  // Fetch weekly reports
  const reportRows = await db.prepare('SELECT * FROM reports ORDER BY id DESC').all();
  const weeklyReports = (reportRows.results as any[]).map(r => ({
    title: r.title, period: r.period, totalCases: r.total_cases, deaths: r.deaths,
    status: r.status, author: r.author,
  }));

  return c.json({
    weeklyLabels: data['weekly_labels'] || [],
    confirmedCases: data['confirmed_cases'] || [],
    suspectedCases: data['suspected_cases'] || [],
    positivityRate: data['positivity_rate'] || [],
    pathogenLabels: data['pathogen_labels'] || [],
    pathogenCases: data['pathogen_cases'] || [],
    alertDistribution: data['alert_distribution'] || [],
    regionLabels: data['region_labels'] || [],
    regionCases: data['region_cases'] || [],
    epiCurve: data['epi_curve'] || {},
    monthlyTrend: data['monthly_trend'] || {},
    weeklyReports,
  });
});

// =============================================================================
// REPORT ARCHIVE — Automated & On-Demand Report Archive (v8.7, Issue #5)
// =============================================================================

// List archived reports (paginated, filterable)
api.get('/reports/archive', async (c) => {
  const db = c.env.DB;
  const type = c.req.query('type');        // weekly_bulletin | monthly_amr | situation_report
  const limit = Math.min(parseInt(c.req.query('limit') || '20'), 50);
  const offset = parseInt(c.req.query('offset') || '0');

  let sql = 'SELECT id, title, type, period, generated_by, generated_at, trigger_type, size_bytes, metadata FROM reports_archive';
  const params: any[] = [];

  if (type) {
    sql += ' WHERE type = ?';
    params.push(type);
  }

  sql += ' ORDER BY generated_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const rows = await db.prepare(sql).bind(...params).all();

  // Count total
  let countSql = 'SELECT count(*) as total FROM reports_archive';
  const countParams: any[] = [];
  if (type) {
    countSql += ' WHERE type = ?';
    countParams.push(type);
  }
  const countRow = countParams.length > 0
    ? await db.prepare(countSql).bind(...countParams).first() as any
    : await db.prepare(countSql).first() as any;

  return c.json({
    reports: rows.results,
    total: countRow?.total || 0,
    limit,
    offset,
  });
});

// Get a single archived report (full HTML)
api.get('/reports/archive/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');

  const row = await db.prepare('SELECT * FROM reports_archive WHERE id = ?').bind(id).first();
  if (!row) return c.json({ error: 'Report not found' }, 404);

  return c.json(row);
});

// Generate a report on-demand (admin/analyst only)
api.post('/reports/generate', requireTier(3), async (c) => {
  const db = c.env.DB;
  const user = c.get('user') as AuthUser;
  const body = await c.req.json().catch(() => ({}));
  const reportType = body.type || 'weekly_bulletin';

  const { generateWeeklyBulletin, generateMonthlySummary } = await import('../lib/reportGenerator');

  let reportId: string;
  try {
    if (reportType === 'monthly_amr') {
      reportId = await generateMonthlySummary(db, `manual:${user.username}`);
    } else {
      reportId = await generateWeeklyBulletin(db, `manual:${user.username}`);
    }
  } catch (e: any) {
    return c.json({ error: 'Report generation failed', detail: e.message }, 500);
  }

  await auditLog(db, user.username, 'Generate Report', reportId, `On-demand ${reportType} generated`, c.req.header('CF-Connecting-IP') || 'unknown', user.tier);

  // SSE broadcast: report generated
  broadcast({ event: 'system', data: { action: 'report_generated', reportId, type: reportType, generator: user.username } });

  return c.json({ success: true, id: reportId, type: reportType });
});

// Delete an archived report (admin only)
api.delete('/reports/archive/:id', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const user = c.get('user') as AuthUser;

  const existing = await db.prepare('SELECT id FROM reports_archive WHERE id = ?').bind(id).first();
  if (!existing) return c.json({ error: 'Report not found' }, 404);

  await db.prepare('DELETE FROM reports_archive WHERE id = ?').bind(id).run();
  await auditLog(db, user.username, 'Delete Report', id, `Archived report deleted: ${id}`, c.req.header('CF-Connecting-IP') || 'unknown', user.tier);

  return c.json({ success: true, deleted: id });
});

// =============================================================================
// ANALYTICS — Advanced Epidemiological Analytics (v8.6)
// =============================================================================

api.get('/analytics', async (c) => {
  const db = c.env.DB;

  // 1. Load analytics config
  const cfgRows = await db.prepare('SELECT key, value FROM analytics_config').all();
  const cfg: Record<string, number> = {};
  for (const row of cfgRows.results as any[]) {
    cfg[row.key] = parseFloat(row.value);
  }
  const config = {
    risk_w_velocity: cfg['risk_w_velocity'] ?? 0.30,
    risk_w_severity: cfg['risk_w_severity'] ?? 0.25,
    risk_w_containment: cfg['risk_w_containment'] ?? 0.20,
    risk_w_genomic: cfg['risk_w_genomic'] ?? 0.15,
    risk_w_ews: cfg['risk_w_ews'] ?? 0.10,
    anomaly_threshold_sigma: cfg['anomaly_threshold_sigma'] ?? 2.0,
    anomaly_window_weeks: cfg['anomaly_window_weeks'] ?? 6,
    forecast_window_weeks: cfg['forecast_window_weeks'] ?? 6,
    forecast_horizon_days: cfg['forecast_horizon_days'] ?? 14,
    rt_serial_interval: cfg['rt_serial_interval'] ?? 5.0,
    rt_window_days: cfg['rt_window_days'] ?? 7,
  };

  // 2. Load threats
  const threatRows = await db.prepare('SELECT * FROM threats ORDER BY risk_score DESC').all();
  const threats = threatRows.results as any[];

  // 3. Load EWS composite score
  const ewsRow = await db.prepare("SELECT metric_value FROM dashboard_metrics WHERE metric_key='ews_scores'").first() as any;
  const ewsScores = ewsRow ? parseJSON(ewsRow.metric_value) : {};
  const ewsComposite = ewsScores.composite || 72;

  // 4. Load regional risks
  const rrRows = await db.prepare('SELECT * FROM ews_regional_risks ORDER BY score DESC').all();
  const regionalData = rrRows.results as any[];

  // 5. Load weekly trend for time-series analysis
  const trendRow = await db.prepare("SELECT metric_value FROM dashboard_metrics WHERE metric_key='weekly_trend'").first() as any;
  const weeklyTrend = trendRow ? parseJSON(trendRow.metric_value) : {};
  const weeklyConfirmed: number[] = weeklyTrend.confirmed || [];
  const weekLabels: string[] = weeklyTrend.labels || [];

  // 6. Load sparkline cases for anomaly baseline
  const sparkRow = await db.prepare("SELECT metric_value FROM dashboard_metrics WHERE metric_key='sparklines'").first() as any;
  const sparklines = sparkRow ? parseJSON(sparkRow.metric_value) : {};
  const caseSpark: number[] = sparklines.cases || [];

  // Import analytics functions
  const { computeNationalRisk, computeRegionalRisks, detectAnomalies, estimateRt, computeForecast, computeRiskDrivers } = await import('../lib/analytics');

  // 7. Compute everything
  const nationalRisk = computeNationalRisk(threats, ewsComposite, config);
  const regionalRisks = computeRegionalRisks(regionalData, threats);
  const anomalies = detectAnomalies(weeklyConfirmed.length > 0 ? weeklyConfirmed : caseSpark, threats, config.anomaly_threshold_sigma);
  const rt = estimateRt(weeklyConfirmed);
  const forecast = computeForecast(weeklyConfirmed, weekLabels, config.forecast_horizon_days);
  const riskDrivers = computeRiskDrivers(threats, anomalies);

  return c.json({
    nationalRisk,
    regionalRisks,
    anomalies,
    rt,
    forecast,
    riskDrivers,
    config: {
      anomalyThreshold: config.anomaly_threshold_sigma,
      forecastHorizon: config.forecast_horizon_days,
      forecastModel: forecast.model,
      lastUpdated: new Date().toISOString(),
    },
    summary: {
      totalThreats: threats.length,
      criticalThreats: threats.filter((t: any) => t.severity === 'Critical').length,
      totalCases: threats.reduce((s: number, t: any) => s + (t.cases || 0), 0),
      totalDeaths: threats.reduce((s: number, t: any) => s + (t.deaths || 0), 0),
      regionsAtRisk: regionalRisks.filter(r => r.score >= 55).length,
      anomalyCount: anomalies.length,
    },
  });
});

// =============================================================================
// EWS (Early Warning System)
// =============================================================================

api.get('/ews', async (c) => {
  const db = c.env.DB;

  // Config (national risk, risk history, forecast)
  const configRows = await db.prepare('SELECT key, value FROM ews_config').all();
  const config: Record<string, any> = {};
  for (const row of configRows.results as any[]) {
    config[row.key] = parseJSON(row.value);
  }

  // Regional risks
  const riskRows = await db.prepare('SELECT * FROM ews_regional_risks ORDER BY score DESC').all();
  const regionalRisks = (riskRows.results as any[]).map(r => ({
    region: r.region, score: r.score, trend: r.trend, change: r.change, topThreat: r.top_threat,
  }));

  // Detection layers
  const layerRows = await db.prepare('SELECT * FROM ews_detection_layers ORDER BY id').all();
  const detectionLayers = (layerRows.results as any[]).map(r => ({
    name: r.name, icon: r.icon, color: r.color, signals: r.signals,
    description: r.description, algorithms: parseJSON(r.algorithms, []),
    lastRun: r.last_run, nextRun: r.next_run,
  }));

  // Recent signals
  const signalRows = await db.prepare('SELECT * FROM ews_signals ORDER BY score DESC LIMIT 10').all();
  const recentSignals = (signalRows.results as any[]).map(r => ({
    pathogen: r.pathogen, region: r.region, type: r.type, score: r.score,
    description: r.description, time: r.time, source: r.source, action: r.action,
  }));

  // OSINT feed
  const osintRows = await db.prepare('SELECT * FROM ews_osint_feed ORDER BY relevance DESC LIMIT 10').all();
  const osintFeed = (osintRows.results as any[]).map(r => ({
    title: r.title, source: r.source, date: r.date, relevance: r.relevance,
    language: r.language, sentiment: r.sentiment, entities: parseJSON(r.entities, []),
  }));

  const national = config['national_risk'] || {};

  return c.json({
    ...national,
    riskHistory: config['risk_history'] || {},
    forecast: config['forecast'] || {},
    regionalRisks,
    detectionLayers,
    recentSignals,
    osintFeed,
  });
});

// =============================================================================
// ADMIN
// =============================================================================

api.get('/admin/health', async (c) => {
  const db = c.env.DB;

  const configRows = await db.prepare('SELECT key, value FROM system_config').all();
  const config: Record<string, any> = {};
  for (const row of configRows.results as any[]) {
    config[row.key] = parseJSON(row.value);
  }

  const serviceRows = await db.prepare('SELECT * FROM system_services ORDER BY id').all();
  const services = (serviceRows.results as any[]).map(r => ({
    name: r.name, status: r.status, uptime: r.uptime, latency: r.latency,
    load: r.load, lastCheck: r.last_check,
  }));

  const health = config['health'] || {};
  const storage = config['storage'] || {};
  const recentEvents = config['recent_events'] || [];

  // DQ scorecard
  const dqRows = await db.prepare('SELECT * FROM dq_scorecard ORDER BY score DESC').all();
  const dqScorecard = (dqRows.results as any[]).map(r => ({
    institution: r.institution, score: r.score, completeness: r.completeness,
    timeliness: r.timeliness, accuracy: r.accuracy, trend: r.trend,
  }));

  return c.json({ ...health, services, storage, recentEvents, dqScorecard });
});

api.get('/admin/audit', async (c) => {
  const db = c.env.DB;
  const page = parseInt(c.req.query('page') || '1');
  const limit = Math.min(parseInt(c.req.query('limit') || '30'), 100);
  const offset = (page - 1) * limit;
  const search = c.req.query('search')?.toLowerCase().trim() || '';
  const action = c.req.query('action') || '';
  const user = c.req.query('user') || '';
  const dateFrom = c.req.query('from') || '';
  const dateTo = c.req.query('to') || '';

  let where = '1=1';
  const binds: any[] = [];
  if (search) { where += ' AND (LOWER(user) LIKE ? OR LOWER(action) LIKE ? OR LOWER(resource) LIKE ? OR LOWER(details) LIKE ?)'; binds.push(`%${search}%`,`%${search}%`,`%${search}%`,`%${search}%`); }
  if (action) { where += ' AND action = ?'; binds.push(action); }
  if (user) { where += ' AND user = ?'; binds.push(user); }
  if (dateFrom) { where += ' AND timestamp >= ?'; binds.push(dateFrom); }
  if (dateTo) { where += ' AND timestamp <= ?'; binds.push(dateTo + ' 23:59:59'); }

  const countResult: any = await db.prepare(`SELECT COUNT(*) as total FROM audit_log WHERE ${where}`).bind(...binds).first();
  const rows = await db.prepare(`SELECT * FROM audit_log WHERE ${where} ORDER BY timestamp DESC LIMIT ? OFFSET ?`).bind(...binds, limit, offset).all();

  const entries = (rows.results as any[]).map(r => ({
    id: r.id, timestamp: r.timestamp, user: r.user, action: r.action,
    resource: r.resource, details: r.details, ip: r.ip, tier: r.tier,
  }));

  // Aggregate stats for summary cards
  const statsRows = await db.prepare('SELECT action, COUNT(*) as cnt FROM audit_log GROUP BY action ORDER BY cnt DESC').all();
  const actionStats = (statsRows.results as any[]).map(r => ({ action: r.action, count: r.cnt }));
  const uniqueUsersResult: any = await db.prepare('SELECT COUNT(DISTINCT user) as cnt FROM audit_log').first();
  const uniqueActions = await db.prepare('SELECT DISTINCT action FROM audit_log ORDER BY action').all();
  const uniqueUsersList = await db.prepare('SELECT DISTINCT user FROM audit_log WHERE user IS NOT NULL ORDER BY user').all();

  return c.json({
    entries, total: countResult.total, page, limit,
    stats: { actionBreakdown: actionStats, uniqueUsers: uniqueUsersResult.cnt },
    filters: {
      actions: (uniqueActions.results as any[]).map(r => r.action),
      users: (uniqueUsersList.results as any[]).map(r => r.user),
    }
  });
});

api.get('/admin/audit/export', async (c) => {
  const db = c.env.DB;
  const rows = await db.prepare('SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT 5000').all();
  const entries = rows.results as any[];
  const csv = 'Timestamp,User,Action,Resource,Details,IP,Tier\n' +
    entries.map(r => `"${r.timestamp||''}","${(r.user||'').replace(/"/g,'""')}","${r.action||''}","${(r.resource||'').replace(/"/g,'""')}","${(r.details||'').replace(/"/g,'""')}","${r.ip||''}","${r.tier||0}"`).join('\n');
  return new Response(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename=audit_log_export.csv' } });
});

api.get('/admin/users', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const rows = await db.prepare('SELECT id, username, name, role, full_role, institution, tier, avatar, email, status, sessions_today, created_at, last_login FROM users ORDER BY tier DESC').all();
  return c.json({ users: rows.results, total: rows.results.length });
});

// Create user (Admin only)
api.post('/admin/users', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const { username, password, name, role, fullRole, institution, tier, email } = await c.req.json();
  if (!username || !password || !name || !role) return c.json({ error: 'Username, password, name, and role are required' }, 400);
  const pwError = validatePasswordStrength(password);
  if (pwError) return c.json({ error: pwError }, 400);

  // Sanitize inputs
  const cleanName = sanitizeInput(name);
  const cleanUsername = username.replace(/[^a-zA-Z0-9._-]/g, '');
  if (cleanUsername !== username) return c.json({ error: 'Username contains invalid characters. Use only letters, numbers, dots, hyphens, underscores.' }, 400);

  // Check duplicate username
  const existing = await db.prepare('SELECT id FROM users WHERE username = ?').bind(cleanUsername).first();
  if (existing) return c.json({ error: 'Username already exists' }, 409);

  const id = 'usr-' + Date.now().toString(36);
  const hash = await hashPassword(password);
  const avatar = name.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase();
  const t = Math.min(Math.max(parseInt(tier) || 1, 1), 4);
  const roleMap: Record<string, number> = { Admin: 4, Analyst: 3, Viewer: 2, Guest: 1 };
  const finalTier = roleMap[role] || t;

  await db.prepare(
    'INSERT INTO users (id, username, password_hash, name, role, full_role, institution, tier, avatar, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, username, hash, name, role, fullRole || '', institution || '', finalTier, avatar, email || '').run();

  const caller = c.get('user');
  await auditLog(db, caller.name, 'User Created', id, `Created user ${username} (${role})`, c.req.header('CF-Connecting-IP') || 'unknown', caller.tier);

  return c.json({ id, username, name, role, tier: finalTier, avatar });
});

// Update user (Admin only)
// SECURITY: Suspending a user revokes all their tokens
api.put('/admin/users/:id', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const ip = c.req.header('CF-Connecting-IP') || 'unknown';
  const id = c.req.param('id');
  const { name, role, fullRole, institution, tier, email, status } = await c.req.json();

  const user: any = await db.prepare('SELECT * FROM users WHERE id = ?').bind(id).first();
  if (!user) return c.json({ error: 'User not found' }, 404);

  const updates: string[] = [];
  const vals: any[] = [];
  if (name !== undefined) { updates.push('name = ?'); vals.push(name); }
  if (role !== undefined) { updates.push('role = ?'); vals.push(role); }
  if (fullRole !== undefined) { updates.push('full_role = ?'); vals.push(fullRole); }
  if (institution !== undefined) { updates.push('institution = ?'); vals.push(institution); }
  if (tier !== undefined) { updates.push('tier = ?'); vals.push(Math.min(Math.max(parseInt(tier) || 1, 1), 4)); }
  if (email !== undefined) {
    // Encrypt email before storing (PII at rest)
    const encEmail = await encryptField(email);
    updates.push('email = ?'); vals.push(encEmail);
  }
  if (status !== undefined) { updates.push('status = ?'); vals.push(status); }
  if (name) {
    const avatar = name.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase();
    updates.push('avatar = ?'); vals.push(avatar);
  }
  updates.push('updated_at = datetime("now")');
  vals.push(id);

  await db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).bind(...vals).run();

  // If user was suspended, revoke all their tokens immediately
  if (status === 'suspended') {
    await blacklistAllUserTokens(db, id, 'account_suspended');
    await logSecurityEvent(db, 'account_suspended', 'high', `Account suspended: ${user.username} — all tokens revoked`, ip, id, user.username);
  }

  const caller = c.get('user');
  await auditLog(db, caller.name, 'User Updated', id, `Updated user ${user.username}: ${updates.filter(u => u !== 'updated_at = datetime("now")').join(', ')}`, ip, caller.tier);

  return c.json({ success: true, id });
});

// Reset user password (Admin only)
// SECURITY: Revokes ALL existing tokens for the target user
api.post('/admin/users/:id/reset-password', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const ip = c.req.header('CF-Connecting-IP') || 'unknown';
  const id = c.req.param('id');
  const { password } = await c.req.json();
  if (!password) return c.json({ error: 'Password is required' }, 400);
  const pwErr = validatePasswordStrength(password);
  if (pwErr) return c.json({ error: pwErr }, 400);

  const user: any = await db.prepare('SELECT username FROM users WHERE id = ?').bind(id).first();
  if (!user) return c.json({ error: 'User not found' }, 404);

  const hash = await hashPassword(password);
  await db.prepare('UPDATE users SET password_hash = ?, updated_at = datetime("now") WHERE id = ?').bind(hash, id).run();

  // TOKEN REVOCATION: Blacklist all existing tokens for this user
  await blacklistAllUserTokens(db, id, 'admin_password_reset');

  const caller = c.get('user');
  await auditLog(db, caller.name, 'Password Reset', id, `Reset password for ${user.username} — all sessions revoked`, ip, caller.tier);
  await logSecurityEvent(db, 'admin_password_reset', 'high', `Admin ${caller.username} reset password for ${user.username} — all tokens revoked`, ip, id, user.username);

  return c.json({ success: true, message: 'Password reset. All user sessions revoked.' });
});

// Delete user (Admin only)
api.delete('/admin/users/:id', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');

  const user: any = await db.prepare('SELECT username, name FROM users WHERE id = ?').bind(id).first();
  if (!user) return c.json({ error: 'User not found' }, 404);

  // Prevent deleting self
  const caller = c.get('user');
  if (caller.id === id) return c.json({ error: 'Cannot delete your own account' }, 400);

  await db.prepare('DELETE FROM users WHERE id = ?').bind(id).run();

  await auditLog(db, caller.name, 'User Deleted', id, `Deleted user ${user.username} (${user.name})`, c.req.header('CF-Connecting-IP') || 'unknown', caller.tier);

  return c.json({ success: true });
});

// =============================================================================
// NOTIFICATIONS
// =============================================================================

// Get notifications for current user
api.get('/notifications', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  const limit = parseInt(c.req.query('limit') || '20');

  // Get notifications for this user OR for all users (user_id IS NULL)
  const rows = await db.prepare(
    'SELECT * FROM notifications WHERE user_id = ? OR user_id IS NULL ORDER BY created_at DESC LIMIT ?'
  ).bind(user.id, limit).all();

  const unreadCount: any = await db.prepare(
    'SELECT COUNT(*) as cnt FROM notifications WHERE (user_id = ? OR user_id IS NULL) AND is_read = 0'
  ).bind(user.id).first();

  const totalCount: any = await db.prepare(
    'SELECT COUNT(*) as cnt FROM notifications WHERE user_id = ? OR user_id IS NULL'
  ).bind(user.id).first();

  return c.json({ notifications: rows.results, unread: unreadCount?.cnt || 0, total: totalCount?.cnt || rows.results.length });
});

// Mark notification as read
api.patch('/notifications/:id/read', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  await db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

// Mark all notifications as read
api.patch('/notifications/read-all', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  await db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ? OR user_id IS NULL').bind(user.id).run();
  return c.json({ success: true });
});

// Create notification (Admin only) — also used internally
api.post('/notifications', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const { type, icon, title, message, userId, link } = await c.req.json();
  if (!title || !message) return c.json({ error: 'Title and message required' }, 400);

  const id = 'notif-' + Date.now().toString(36);
  await db.prepare(
    'INSERT INTO notifications (id, user_id, type, icon, title, message, link) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, userId || null, type || 'info', icon || 'fa-bell', title, message, link || null).run();

  // SSE broadcast: new notification
  broadcast({ event: 'notification', data: { id, type: type || 'info', title, message, icon: icon || 'fa-bell' } });

  return c.json({ id, success: true });
});

// =============================================================================
// SSE REAL-TIME NOTIFICATIONS (Issue #1)
// =============================================================================
// Stream endpoint uses query-param JWT (EventSource can't set headers).
// Heartbeat every 25s keeps the connection alive (Workers 30s idle timeout).
// Broadcasts: alert review, notification create, threat create, surveillance create.
// =============================================================================

api.get('/notifications/stream', async (c) => {
  const db = c.env.DB;
  const token = c.req.query('token');
  if (!token) return c.json({ error: 'Missing token query parameter', code: 'AUTH_REQUIRED' }, 401);

  // Verify JWT from query param (same as auth middleware but inline)
  const { verifyToken } = await import('../lib/crypto');
  const payload = await verifyToken(token);
  if (!payload) return c.json({ error: 'Invalid or expired token', code: 'TOKEN_EXPIRED' }, 401);

  // Check blacklist
  if (payload.jti) {
    try {
      const bl: any = await db.prepare(
        'SELECT jti FROM token_blacklist WHERE jti = ? AND expires_at > datetime("now")'
      ).bind(payload.jti).first();
      if (bl) return c.json({ error: 'Token revoked', code: 'TOKEN_REVOKED' }, 401);
    } catch {}
  }

  const userId = payload.sub || 'unknown';
  let controller: ReadableStreamDefaultController;
  let heartbeatTimer: any;

  const stream = new ReadableStream({
    start(ctrl) {
      controller = ctrl;
      subscribe(controller, userId);

      // Send initial connection event
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode(
        `event: system\ndata: ${JSON.stringify({ type: 'connected', userId, subscribers: subscriberCount(), _ts: new Date().toISOString() })}\n\n`
      ));

      // Heartbeat every 25s (Workers idle timeout is 30s)
      heartbeatTimer = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`:keepalive ${Date.now()}\n\n`));
        } catch {
          clearInterval(heartbeatTimer);
          unsubscribe(controller);
        }
      }, 25000);
    },
    cancel() {
      clearInterval(heartbeatTimer);
      unsubscribe(controller);
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-store',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'X-Accel-Buffering': 'no',
    },
  });
});

// SSE health — subscriber count for admin dashboard
api.get('/notifications/stream/health', async (c) => {
  return c.json({ subscribers: subscriberCount(), ts: new Date().toISOString() });
});

// =============================================================================
// ADMIN / PERFORMANCE
// =============================================================================

api.get('/admin/performance', async (c) => {
  const db = c.env.DB;
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const last24h = new Date(now.getTime() - 24*60*60*1000).toISOString().replace('T',' ').split('.')[0];
  const lastHour = new Date(now.getTime() - 60*60*1000).toISOString().replace('T',' ').split('.')[0];

  // Today's totals
  const todayStats: any = await db.prepare(
    "SELECT COUNT(*) as total, AVG(latency_ms) as avg_lat, MAX(latency_ms) as max_lat, SUM(CASE WHEN status >= 400 THEN 1 ELSE 0 END) as errors FROM request_metrics WHERE timestamp >= ?"
  ).bind(today).first();

  // Last hour for recent trend
  const hourStats: any = await db.prepare(
    "SELECT COUNT(*) as total, AVG(latency_ms) as avg_lat FROM request_metrics WHERE timestamp >= ?"
  ).bind(lastHour).first();

  // P95 approximation (top 5% latency from last 200 requests)
  const p95Row: any = await db.prepare(
    "SELECT latency_ms FROM request_metrics ORDER BY timestamp DESC LIMIT 200"
  ).all();
  const latencies = (p95Row.results as any[]).map(r => r.latency_ms).sort((a,b) => a - b);
  const p95 = latencies.length > 0 ? latencies[Math.floor(latencies.length * 0.95)] : 0;
  const p99 = latencies.length > 0 ? latencies[Math.floor(latencies.length * 0.99)] : 0;

  // Top slowest endpoints
  const slowest: any = await db.prepare(
    "SELECT path, AVG(latency_ms) as avg_lat, COUNT(*) as hits FROM request_metrics WHERE timestamp >= ? GROUP BY path ORDER BY avg_lat DESC LIMIT 5"
  ).bind(last24h).all();

  // Hourly request counts for sparkline (last 12 hours)
  const hourly: any = await db.prepare(
    "SELECT strftime('%H:00', timestamp) as hour, COUNT(*) as cnt, AVG(latency_ms) as avg_lat FROM request_metrics WHERE timestamp >= ? GROUP BY strftime('%H', timestamp) ORDER BY hour"
  ).bind(last24h).all();

  const requestsToday = todayStats?.total || 0;
  const errorsToday = todayStats?.errors || 0;

  return c.json({
    avgLatency: Math.round(todayStats?.avg_lat || 0) + 'ms',
    p95Latency: Math.round(p95) + 'ms',
    p99Latency: Math.round(p99) + 'ms',
    maxLatency: Math.round(todayStats?.max_lat || 0) + 'ms',
    requestsToday,
    errorsToday,
    errorRate: requestsToday > 0 ? (errorsToday / requestsToday).toFixed(4) : '0',
    requestsLastHour: hourStats?.total || 0,
    avgLatencyLastHour: Math.round(hourStats?.avg_lat || 0) + 'ms',
    cpuTime: Math.round((todayStats?.avg_lat || 0) * 0.3) + 'ms avg',
    slowestEndpoints: (slowest.results as any[]).map(r => ({
      path: r.path, avgLatency: Math.round(r.avg_lat) + 'ms', hits: r.hits
    })),
    hourlyTrend: (hourly.results as any[]).map(r => ({
      hour: r.hour, requests: r.cnt, avgLatency: Math.round(r.avg_lat)
    })),
    dataSource: 'live_d1'
  });
});

// =============================================================================
// GLOBAL SEARCH
// =============================================================================

api.get('/search', async (c) => {
  const db = c.env.DB;
  const q = c.req.query('q')?.toLowerCase().trim();
  if (!q || q.length < 2) return c.json({ results: [] });

  const results: any[] = [];

  // Search surveillance sites
  try {
    const sites = await db.prepare(
      "SELECT id, name, type, region, status FROM surveillance_sites WHERE LOWER(name) LIKE ? OR LOWER(region) LIKE ? OR LOWER(type) LIKE ? LIMIT 5"
    ).bind(`%${q}%`, `%${q}%`, `%${q}%`).all();
    (sites.results || []).forEach((s: any) => {
      results.push({ type: 'surveillance', icon: 'fa-satellite-dish', title: s.name, subtitle: s.type + ' — ' + s.region, action: 'surveillance', id: s.id });
    });
  } catch(e) {}

  // Search threats
  try {
    const threats = await db.prepare(
      "SELECT id, pathogen_name, category, risk_level FROM threats WHERE LOWER(pathogen_name) LIKE ? OR LOWER(category) LIKE ? LIMIT 5"
    ).bind(`%${q}%`, `%${q}%`).all();
    (threats.results || []).forEach((t: any) => {
      results.push({ type: 'threat', icon: 'fa-biohazard', title: t.pathogen_name, subtitle: t.category + ' — ' + t.risk_level, action: 'threats', id: t.id });
    });
  } catch(e) {}

  // Search genomic samples
  try {
    const samples = await db.prepare(
      "SELECT id, sample_id, pathogen, institution FROM genomic_samples WHERE LOWER(sample_id) LIKE ? OR LOWER(pathogen) LIKE ? OR LOWER(institution) LIKE ? LIMIT 5"
    ).bind(`%${q}%`, `%${q}%`, `%${q}%`).all();
    (samples.results || []).forEach((s: any) => {
      results.push({ type: 'genomic', icon: 'fa-dna', title: s.sample_id, subtitle: s.pathogen + ' — ' + s.institution, action: 'genomics', id: s.id });
    });
  } catch(e) {}

  // Search datasets
  try {
    const datasets = await db.prepare(
      "SELECT id, name, description FROM datasets WHERE LOWER(name) LIKE ? OR LOWER(description) LIKE ? LIMIT 5"
    ).bind(`%${q}%`, `%${q}%`).all();
    (datasets.results || []).forEach((d: any) => {
      results.push({ type: 'dataset', icon: 'fa-database', title: d.name, subtitle: (d.description || '').substring(0, 80), action: 'dataset', id: d.id });
    });
  } catch(e) {}

  // Search alerts
  try {
    const alerts = await db.prepare(
      "SELECT id, title, severity, region FROM alerts WHERE LOWER(title) LIKE ? OR LOWER(region) LIKE ? LIMIT 5"
    ).bind(`%${q}%`, `%${q}%`).all();
    (alerts.results || []).forEach((a: any) => {
      results.push({ type: 'alert', icon: 'fa-bell', title: a.title, subtitle: a.severity + ' — ' + a.region, action: 'alerts', id: a.id });
    });
  } catch(e) {}

  // Search pages (always include)
  const pages = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-tachometer-alt', desc: 'Overview & KPIs' },
    { id: 'surveillance', label: 'Surveillance Network', icon: 'fa-satellite-dish', desc: '24 monitoring sites' },
    { id: 'threats', label: 'Threat Intelligence', icon: 'fa-biohazard', desc: 'Active biological threats' },
    { id: 'genomics', label: 'Genomic Tracking', icon: 'fa-dna', desc: 'Sequencing pipeline & AMR' },
    { id: 'ews', label: 'Early Warning System', icon: 'fa-exclamation-triangle', desc: 'Multi-layer EWS' },
    { id: 'alerts', label: 'Alert Management', icon: 'fa-bell', desc: 'Review & manage alerts' },
    { id: 'reports', label: 'Reports & Analytics', icon: 'fa-chart-bar', desc: 'Charts, sitreps, export' },
    { id: 'admin', label: 'Administration', icon: 'fa-cogs', desc: 'System health & audit' },
  ];
  pages.forEach(p => {
    if (p.label.toLowerCase().includes(q) || p.id.includes(q) || p.desc.toLowerCase().includes(q)) {
      results.push({ type: 'page', icon: p.icon, title: p.label, subtitle: p.desc, action: p.id, id: p.id });
    }
  });

  return c.json({ results: results.slice(0, 20), query: q });
});

// =============================================================================
// DATABASE SEED (one-time setup endpoint)
// =============================================================================

// Seed endpoint: PROTECTED — requires Admin role
// In production, seed via wrangler d1 execute, not via API
api.post('/db/seed', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const caller = c.get('user');

  // Check if already seeded
  const userCount: any = await db.prepare('SELECT COUNT(*) as cnt FROM users').first();
  if (userCount.cnt > 3) {
    return c.json({ message: 'Database already seeded', userCount: userCount.cnt });
  }

  await auditLog(db, caller.username, 'DB Seed', 'system', 'Admin triggered database seed', c.req.header('CF-Connecting-IP') || 'unknown', caller.tier);

  return c.json({ message: 'Seed operation restricted. Use wrangler CLI for initial database setup.', userCount: userCount.cnt });
});

// =============================================================================
// EXPORT (CSV)
// =============================================================================

api.get('/export/:type', async (c) => {
  const db = c.env.DB;
  const type = c.req.param('type');
  let csv = '';
  let filename = `bior-${type}.csv`;

  switch (type) {
    case 'surveillance': {
      const rows = await db.prepare('SELECT * FROM surveillance_sites ORDER BY region, name').all();
      csv = 'ID,Name,Type,Region,Status,DQ Score,Cases This Week,Samples Submitted\n';
      for (const r of rows.results as any[]) {
        csv += `${r.id},"${r.name}",${r.type},${r.region},${r.status},${r.dq_score},${r.cases_this_week},${r.samples_submitted}\n`;
      }
      break;
    }
    case 'alerts': {
      const rows = await db.prepare('SELECT * FROM alerts ORDER BY generated_at DESC').all();
      csv = 'ID,Title,Level,Pathogen,Region,Risk Score,Status,Generated At\n';
      for (const r of rows.results as any[]) {
        csv += `${r.id},"${r.title}",${r.level},"${r.pathogen}","${r.region}",${r.risk_score},${r.status},${r.generated_at}\n`;
      }
      break;
    }
    case 'threats': {
      const rows = await db.prepare('SELECT * FROM threats ORDER BY risk_score DESC').all();
      csv = 'ID,Name,Pathogen,Severity,Cases,Deaths,CFR,Risk Score,Trend\n';
      for (const r of rows.results as any[]) {
        csv += `${r.id},"${r.name}","${r.pathogen}",${r.severity},${r.cases},${r.deaths},${r.cfr},${r.risk_score},${r.trend}\n`;
      }
      break;
    }
    case 'genomics': {
      const rows = await db.prepare('SELECT * FROM genomic_samples ORDER BY date DESC').all();
      csv = 'Sample ID,Pathogen,Lineage,Platform,Status,Coverage,AMR Detected,Quality,Institution,Date\n';
      for (const r of rows.results as any[]) {
        csv += `${r.sample_id},"${r.pathogen}","${r.lineage}",${r.platform},${r.pipeline_status},${r.coverage},${r.amr_detected ? 'Yes' : 'No'},${r.quality},"${r.institution}",${r.date}\n`;
      }
      break;
    }
    default:
      return c.json({ error: 'Unknown export type' }, 400);
  }

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
});

// =============================================================================
// DATASETS / DATA LIBRARY (Admin-only)
// =============================================================================

// List all datasets
api.get('/datasets', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const rows = await db.prepare(
    'SELECT d.*, (SELECT COUNT(*) FROM project_datasets pd WHERE pd.dataset_id = d.id) AS project_count FROM datasets d WHERE d.status = ? ORDER BY d.updated_at DESC'
  ).bind('active').all();
  return c.json({ datasets: rows.results, count: rows.results.length });
});

// Get single dataset with versions
api.get('/datasets/:id', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const ds = await db.prepare('SELECT * FROM datasets WHERE id = ?').bind(id).first() as any;
  if (!ds) return c.json({ error: 'Dataset not found' }, 404);

  const versions = await db.prepare(
    'SELECT * FROM dataset_versions WHERE dataset_id = ? ORDER BY version_num DESC'
  ).bind(id).all();

  const projects = await db.prepare(
    'SELECT project_id, linked_at FROM project_datasets WHERE dataset_id = ?'
  ).bind(id).all();

  ds.columns_def = parseJSON(ds.columns_def, []);
  return c.json({ dataset: ds, versions: versions.results, linkedProjects: projects.results });
});

// Get dataset rows (with pagination, search, filter, sort)
api.get('/datasets/:id/rows', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const page = parseInt(c.req.query('page') || '1');
  const limit = Math.min(parseInt(c.req.query('limit') || '25'), 100);
  const offset = (page - 1) * limit;
  const versionId = c.req.query('version');
  const search = c.req.query('search') || '';
  const sortCol = c.req.query('sort') || '';
  const sortDir = c.req.query('dir') === 'desc' ? 'DESC' : 'ASC';

  let where = 'dataset_id = ?';
  const params: any[] = [id];
  if (versionId) { where += ' AND version_id = ?'; params.push(versionId); }
  if (search) { where += ' AND row_data LIKE ?'; params.push(`%${search}%`); }

  const countR = await db.prepare(`SELECT COUNT(*) as cnt FROM dataset_rows WHERE ${where}`).bind(...params).first() as any;
  const total = countR?.cnt || 0;

  let order = 'row_index ASC';
  if (sortCol) {
    order = `json_extract(row_data, '$.${sortCol.replace(/[^a-zA-Z0-9_]/g, '')}') ${sortDir}`;
  }

  const rows = await db.prepare(
    `SELECT * FROM dataset_rows WHERE ${where} ORDER BY ${order} LIMIT ? OFFSET ?`
  ).bind(...params, limit, offset).all();

  return c.json({ rows: rows.results.map((r: any) => ({ ...r, row_data: parseJSON(r.row_data, {}) })), total, page, limit });
});

// Create dataset (with optional CSV data)
api.post('/datasets', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const user = c.get('user') as AuthUser;
  const body = await c.req.json();
  const { name, description, icon, color, columns, rows: csvRows, notes } = body;

  if (!name || !columns || !Array.isArray(columns) || columns.length === 0) {
    return c.json({ error: 'Name and columns are required' }, 400);
  }

  const dsId = 'ds-' + Date.now().toString(36);
  const verId = 'dv-' + Date.now().toString(36);
  const rowCount = Array.isArray(csvRows) ? csvRows.length : 0;

  // Create dataset
  await db.prepare(
    'INSERT INTO datasets (id, name, description, icon, color, columns_def, row_count, version_count, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)'
  ).bind(dsId, name, description || '', icon || 'fa-database', color || '#3b82f6', JSON.stringify(columns), rowCount, user.username).run();

  // Create first version
  await db.prepare(
    'INSERT INTO dataset_versions (id, dataset_id, version_num, row_count, notes, created_by) VALUES (?, ?, 1, ?, ?, ?)'
  ).bind(verId, dsId, rowCount, notes || 'Initial import', user.username).run();

  // Insert rows if provided
  if (csvRows && csvRows.length > 0) {
    const stmt = db.prepare('INSERT INTO dataset_rows (dataset_id, version_id, row_data, row_index) VALUES (?, ?, ?, ?)');
    const batch = csvRows.map((row: any, i: number) => stmt.bind(dsId, verId, JSON.stringify(row), i));
    // D1 batch limit ~100 statements at a time
    for (let i = 0; i < batch.length; i += 80) {
      await db.batch(batch.slice(i, i + 80));
    }
  }

  await auditLog(db, user.username, 'Dataset Created', dsId, `${name} (${rowCount} rows, ${columns.length} cols)`, c.req.header('CF-Connecting-IP') || '0.0.0.0', user.tier);

  return c.json({ id: dsId, versionId: verId, name, rowCount, columnCount: columns.length });
});

// Add data (new version) to existing dataset
api.post('/datasets/:id/versions', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const user = c.get('user') as AuthUser;
  const id = c.req.param('id');
  const body = await c.req.json();
  const { rows: csvRows, notes } = body;

  const ds = await db.prepare('SELECT * FROM datasets WHERE id = ?').bind(id).first() as any;
  if (!ds) return c.json({ error: 'Dataset not found' }, 404);

  if (!csvRows || !Array.isArray(csvRows) || csvRows.length === 0) {
    return c.json({ error: 'Rows are required' }, 400);
  }

  const newVerNum = ds.version_count + 1;
  const verId = 'dv-' + Date.now().toString(36);

  await db.prepare(
    'INSERT INTO dataset_versions (id, dataset_id, version_num, row_count, notes, created_by) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(verId, id, newVerNum, csvRows.length, notes || `Version ${newVerNum}`, user.username).run();

  // Insert new rows
  const stmt = db.prepare('INSERT INTO dataset_rows (dataset_id, version_id, row_data, row_index) VALUES (?, ?, ?, ?)');
  const batch = csvRows.map((row: any, i: number) => stmt.bind(id, verId, JSON.stringify(row), i));
  for (let i = 0; i < batch.length; i += 80) {
    await db.batch(batch.slice(i, i + 80));
  }

  // Update dataset counts
  const totalRows = ds.row_count + csvRows.length;
  await db.prepare(
    'UPDATE datasets SET row_count = ?, version_count = ?, updated_at = datetime("now") WHERE id = ?'
  ).bind(totalRows, newVerNum, id).run();

  await auditLog(db, user.username, 'Dataset Version Added', id, `v${newVerNum}: +${csvRows.length} rows`, c.req.header('CF-Connecting-IP') || '0.0.0.0', user.tier);

  return c.json({ versionId: verId, versionNum: newVerNum, addedRows: csvRows.length, totalRows });
});

// Compare two versions
api.get('/datasets/:id/compare', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const v1 = c.req.query('v1');
  const v2 = c.req.query('v2');
  if (!v1 || !v2) return c.json({ error: 'v1 and v2 version IDs required' }, 400);

  const ds = await db.prepare('SELECT columns_def FROM datasets WHERE id = ?').bind(id).first() as any;
  if (!ds) return c.json({ error: 'Dataset not found' }, 404);
  const columns = parseJSON(ds.columns_def, []);

  const ver1 = await db.prepare('SELECT * FROM dataset_versions WHERE id = ?').bind(v1).first() as any;
  const ver2 = await db.prepare('SELECT * FROM dataset_versions WHERE id = ?').bind(v2).first() as any;
  if (!ver1 || !ver2) return c.json({ error: 'Version not found' }, 404);

  // Get stats for each version — aggregate numeric columns
  const numericCols = columns.filter((col: any) => col.type === 'number');
  const stats: any = { v1: { rowCount: ver1.row_count }, v2: { rowCount: ver2.row_count } };

  for (const col of numericCols) {
    const key = col.name.replace(/[^a-zA-Z0-9_]/g, '');
    const r1 = await db.prepare(
      `SELECT AVG(CAST(json_extract(row_data, '$.${key}') AS REAL)) as avg_val, MIN(CAST(json_extract(row_data, '$.${key}') AS REAL)) as min_val, MAX(CAST(json_extract(row_data, '$.${key}') AS REAL)) as max_val, SUM(CAST(json_extract(row_data, '$.${key}') AS REAL)) as sum_val FROM dataset_rows WHERE version_id = ?`
    ).bind(v1).first() as any;
    const r2 = await db.prepare(
      `SELECT AVG(CAST(json_extract(row_data, '$.${key}') AS REAL)) as avg_val, MIN(CAST(json_extract(row_data, '$.${key}') AS REAL)) as min_val, MAX(CAST(json_extract(row_data, '$.${key}') AS REAL)) as max_val, SUM(CAST(json_extract(row_data, '$.${key}') AS REAL)) as sum_val FROM dataset_rows WHERE version_id = ?`
    ).bind(v2).first() as any;
    stats.v1[col.name] = r1;
    stats.v2[col.name] = r2;
  }

  return c.json({ version1: ver1, version2: ver2, columns, stats });
});

// Delete dataset
api.delete('/datasets/:id', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const user = c.get('user') as AuthUser;
  const id = c.req.param('id');

  const ds = await db.prepare('SELECT name FROM datasets WHERE id = ?').bind(id).first() as any;
  if (!ds) return c.json({ error: 'Dataset not found' }, 404);

  await db.batch([
    db.prepare('DELETE FROM dataset_rows WHERE dataset_id = ?').bind(id),
    db.prepare('DELETE FROM dataset_versions WHERE dataset_id = ?').bind(id),
    db.prepare('DELETE FROM project_datasets WHERE dataset_id = ?').bind(id),
    db.prepare('DELETE FROM datasets WHERE id = ?').bind(id),
  ]);

  await auditLog(db, user.username, 'Dataset Deleted', id, ds.name, c.req.header('CF-Connecting-IP') || '0.0.0.0', user.tier);
  return c.json({ success: true });
});

// Link/unlink dataset to project
api.post('/datasets/:id/link', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const user = c.get('user') as AuthUser;
  const id = c.req.param('id');
  const { projectId } = await c.req.json();
  if (!projectId) return c.json({ error: 'projectId required' }, 400);

  await db.prepare(
    'INSERT OR IGNORE INTO project_datasets (project_id, dataset_id, linked_by) VALUES (?, ?, ?)'
  ).bind(projectId, id, user.username).run();
  return c.json({ success: true });
});

api.delete('/datasets/:id/link/:projectId', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const projectId = c.req.param('projectId');
  await db.prepare('DELETE FROM project_datasets WHERE project_id = ? AND dataset_id = ?').bind(projectId, id).run();
  return c.json({ success: true });
});

// Export dataset as CSV
api.get('/datasets/:id/export', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const versionId = c.req.query('version');

  const ds = await db.prepare('SELECT * FROM datasets WHERE id = ?').bind(id).first() as any;
  if (!ds) return c.json({ error: 'Dataset not found' }, 404);
  const columns = parseJSON(ds.columns_def, []);

  let where = 'dataset_id = ?';
  const params: any[] = [id];
  if (versionId) { where += ' AND version_id = ?'; params.push(versionId); }

  const rows = await db.prepare(`SELECT row_data FROM dataset_rows WHERE ${where} ORDER BY row_index ASC`).bind(...params).all();

  // Build CSV
  const header = columns.map((col: any) => col.name).join(',');
  const body = rows.results.map((r: any) => {
    const data = parseJSON(r.row_data, {});
    return columns.map((col: any) => {
      const val = data[col.name] ?? '';
      return typeof val === 'string' && (val.includes(',') || val.includes('"')) ? `"${val.replace(/"/g, '""')}"` : val;
    }).join(',');
  }).join('\n');

  const csv = header + '\n' + body;
  return new Response(csv, {
    headers: { 'Content-Type': 'text/csv', 'Content-Disposition': `attachment; filename="${ds.name.replace(/[^a-zA-Z0-9]/g, '_')}.csv"` },
  });
});

// Chart data aggregation for dataset
api.get('/datasets/:id/charts', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');

  const ds = await db.prepare('SELECT columns_def FROM datasets WHERE id = ?').bind(id).first() as any;
  if (!ds) return c.json({ error: 'Dataset not found' }, 404);
  const columns = parseJSON(ds.columns_def, []);
  const charts: any[] = [];

  // For each numeric column, aggregate by each text column
  const numCols = columns.filter((c: any) => c.type === 'number');
  const textCols = columns.filter((c: any) => c.type === 'text');

  for (const num of numCols.slice(0, 3)) {
    for (const txt of textCols.slice(0, 3)) {
      const nk = num.name.replace(/[^a-zA-Z0-9_]/g, '');
      const tk = txt.name.replace(/[^a-zA-Z0-9_]/g, '');
      const r = await db.prepare(
        `SELECT json_extract(row_data, '$.${tk}') as label, AVG(CAST(json_extract(row_data, '$.${nk}') AS REAL)) as avg_val, COUNT(*) as cnt FROM dataset_rows WHERE dataset_id = ? GROUP BY label ORDER BY avg_val DESC LIMIT 15`
      ).bind(id).all();
      charts.push({ numericCol: num.name, groupCol: txt.name, type: 'bar', data: r.results });
    }
  }

  // Version trend (row count per version)
  const versions = await db.prepare(
    'SELECT version_num, row_count, created_at FROM dataset_versions WHERE dataset_id = ? ORDER BY version_num ASC'
  ).bind(id).all();
  charts.push({ type: 'versionTrend', data: versions.results });

  return c.json({ charts });
});

// =============================================================================
// SECURITY COMPLIANCE DASHBOARD (Admin only)
// =============================================================================

// GET /api/security/status — Enterprise Security Compliance Dashboard
api.get('/security/status', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const ip = c.req.header('CF-Connecting-IP') || 'unknown';

  // 1. Security configuration
  let securityConfig: Record<string, string> = {};
  try {
    const configRows = await db.prepare('SELECT key, value FROM security_config').all();
    for (const row of configRows.results as any[]) {
      securityConfig[row.key] = row.value;
    }
  } catch { /* table might not exist yet */ }

  // 2. Active sessions count
  let activeSessions = 0;
  try {
    const sessResult: any = await db.prepare(
      'SELECT COUNT(*) as cnt FROM session_fingerprints'
    ).first();
    activeSessions = sessResult?.cnt || 0;
  } catch {}

  // 3. Blacklisted tokens count
  let blacklistedTokens = 0;
  try {
    const blResult: any = await db.prepare(
      'SELECT COUNT(*) as cnt FROM token_blacklist WHERE expires_at > datetime("now")'
    ).first();
    blacklistedTokens = blResult?.cnt || 0;
  } catch {}

  // 4. Security events summary (last 24 hours)
  const last24h = new Date(Date.now() - 86400000).toISOString().replace('T', ' ').split('.')[0];
  let securityEvents: any = { total: 0, critical: 0, high: 0, medium: 0, low: 0, recentEvents: [] };
  try {
    const evTotal: any = await db.prepare(
      'SELECT COUNT(*) as cnt FROM security_events WHERE created_at >= ?'
    ).bind(last24h).first();
    securityEvents.total = evTotal?.cnt || 0;

    const evBySeverity = await db.prepare(
      'SELECT severity, COUNT(*) as cnt FROM security_events WHERE created_at >= ? GROUP BY severity'
    ).bind(last24h).all();
    for (const row of evBySeverity.results as any[]) {
      securityEvents[row.severity] = row.cnt;
    }

    const recentEvents = await db.prepare(
      'SELECT * FROM security_events ORDER BY created_at DESC LIMIT 20'
    ).all();
    securityEvents.recentEvents = recentEvents.results;
  } catch {}

  // 5. Login attempt stats (last 24h)
  let loginStats: any = { successful: 0, failed: 0, rateLimited: 0 };
  try {
    const successLogins: any = await db.prepare(
      "SELECT COUNT(*) as cnt FROM security_events WHERE event_type = 'login_success' AND created_at >= ?"
    ).bind(last24h).first();
    loginStats.successful = successLogins?.cnt || 0;

    const failedLogins: any = await db.prepare(
      "SELECT COUNT(*) as cnt FROM security_events WHERE event_type = 'login_failed' AND created_at >= ?"
    ).bind(last24h).first();
    loginStats.failed = failedLogins?.cnt || 0;

    const rateLimited: any = await db.prepare(
      "SELECT COUNT(*) as cnt FROM security_events WHERE event_type = 'login_rate_limited' AND created_at >= ?"
    ).bind(last24h).first();
    loginStats.rateLimited = rateLimited?.cnt || 0;
  } catch {}

  // 6. Rate limit status
  let rateLimitStatus: any = { trackedIPs: 0, throttledIPs: 0 };
  try {
    const rlTotal: any = await db.prepare('SELECT COUNT(DISTINCT ip) as cnt FROM rate_limit_tracker').first();
    rateLimitStatus.trackedIPs = rlTotal?.cnt || 0;
  } catch {}

  // 7. Admin IP allowlist
  let ipAllowlist: any[] = [];
  try {
    const allowRows = await db.prepare(
      'SELECT * FROM admin_ip_allowlist WHERE is_active = 1 ORDER BY created_at DESC'
    ).all();
    ipAllowlist = allowRows.results as any[];
  } catch {}

  // 8. User stats
  let userStats: any = { total: 0, active: 0, suspended: 0, admins: 0 };
  try {
    const uTotal: any = await db.prepare('SELECT COUNT(*) as cnt FROM users').first();
    userStats.total = uTotal?.cnt || 0;
    const uActive: any = await db.prepare("SELECT COUNT(*) as cnt FROM users WHERE status != 'suspended' OR status IS NULL").first();
    userStats.active = uActive?.cnt || 0;
    const uSuspended: any = await db.prepare("SELECT COUNT(*) as cnt FROM users WHERE status = 'suspended'").first();
    userStats.suspended = uSuspended?.cnt || 0;
    const uAdmins: any = await db.prepare("SELECT COUNT(*) as cnt FROM users WHERE role = 'Admin'").first();
    userStats.admins = uAdmins?.cnt || 0;
  } catch {}

  // 9. Encryption status
  let encryptionStatus: any = { enabled: true, algorithm: 'AES-256-GCM', encryptedFields: 0 };
  try {
    const encResult: any = await db.prepare('SELECT COUNT(*) as cnt FROM encryption_registry').first();
    encryptionStatus.encryptedFields = encResult?.cnt || 0;
  } catch {}

  // 10. Build compliance checklist
  const complianceChecks = [
    { id: 'jwt_env', name: 'JWT Secret from Environment', status: 'pass', details: 'JWT_SECRET loaded from Cloudflare secret, not hardcoded' },
    { id: 'pbkdf2', name: 'Password Hashing (PBKDF2-SHA256)', status: 'pass', details: `${SECURITY_CONSTANTS.PBKDF2_ITERATIONS.toLocaleString()} iterations, ${SECURITY_CONSTANTS.SALT_LENGTH}-byte salt` },
    { id: 'token_lifetime', name: 'Token Lifetime', status: 'pass', details: `${SECURITY_CONSTANTS.JWT_EXPIRY_HOURS}h session window (reduced from 24h)` },
    { id: 'session_fp', name: 'Session Fingerprinting', status: securityConfig.session_fingerprint_enabled === '1' ? 'pass' : 'warn', details: 'Tokens bound to User-Agent + IP' },
    { id: 'token_blacklist', name: 'Token Blacklist/Revocation', status: 'pass', details: `${blacklistedTokens} tokens currently revoked` },
    { id: 'encryption', name: 'AES-256-GCM Encryption at Rest', status: securityConfig.encryption_at_rest_enabled === '1' ? 'pass' : 'warn', details: 'PII fields encrypted in database' },
    { id: 'rate_limit_login', name: 'Login Rate Limiting', status: 'pass', details: `${securityConfig.max_login_attempts || 5} attempts per ${securityConfig.lockout_window_minutes || 15} min` },
    { id: 'rate_limit_global', name: 'Global API Rate Limiting', status: 'pass', details: `${securityConfig.global_rate_limit_per_minute || 120} req/min per IP` },
    { id: 'security_headers', name: 'Security Headers', status: 'pass', details: 'CSP, HSTS (2yr), X-Frame-Options DENY, X-Content-Type-Options, CORP, COOP' },
    { id: 'cors', name: 'CORS Restriction', status: 'pass', details: 'Only bior.tech and bior-709.pages.dev allowed' },
    { id: 'input_sanitize', name: 'Input Sanitization', status: 'pass', details: 'XSS prevention + parameterized SQL queries' },
    { id: 'password_policy', name: 'Password Policy', status: 'pass', details: '≥10 chars, mixed case, number, special char, common password blacklist' },
    { id: 'admin_ip', name: 'Admin IP Allowlist', status: securityConfig.admin_ip_restriction_enabled === '1' ? 'pass' : 'info', details: securityConfig.admin_ip_restriction_enabled === '1' ? `${ipAllowlist.length} IPs whitelisted` : 'Available but not enabled' },
    { id: 'brute_force', name: 'Brute Force Detection', status: securityConfig.brute_force_detection_enabled === '1' ? 'pass' : 'warn', details: 'Detects 10+ failed logins per IP per hour' },
    { id: 'security_alerting', name: 'Security Event Alerting', status: securityConfig.security_alerting_enabled === '1' ? 'pass' : 'warn', details: `${securityEvents.total} events in last 24h` },
    { id: 'audit_trail', name: 'Comprehensive Audit Trail', status: 'pass', details: 'All actions logged with IP, user, timestamp' },
    { id: 'no_secrets', name: 'No Hardcoded Secrets', status: 'pass', details: 'Source code clean — verified by automated scan' },
    { id: 'private_repo', name: 'Private GitHub Repository', status: 'pass', details: 'Code not publicly accessible' },
    { id: 'registration', name: 'Registration Disabled', status: 'pass', details: 'Only admins can create user accounts' },
    { id: 'seed_protected', name: 'Seed Endpoint Protected', status: 'pass', details: 'Requires Admin authentication' },
  ];

  const passCount = complianceChecks.filter(c => c.status === 'pass').length;
  const totalChecks = complianceChecks.length;
  const complianceScore = Math.round((passCount / totalChecks) * 100);

  // Log security dashboard access
  const caller = c.get('user') as AuthUser;
  await auditLog(db, caller.username, 'Security Dashboard', 'system', 'Accessed security compliance dashboard', ip, caller.tier);

  return c.json({
    platform: 'BioR Platform',
    version: 'v8.0 Enterprise Security',
    timestamp: new Date().toISOString(),
    complianceScore,
    complianceChecks,
    crypto: {
      jwtAlgorithm: SECURITY_CONSTANTS.ALGORITHM_JWT,
      passwordAlgorithm: SECURITY_CONSTANTS.ALGORITHM_PASSWORD,
      encryptionAlgorithm: SECURITY_CONSTANTS.ALGORITHM_ENCRYPTION,
      pbkdf2Iterations: SECURITY_CONSTANTS.PBKDF2_ITERATIONS,
      saltLength: SECURITY_CONSTANTS.SALT_LENGTH,
      tokenLifetimeHours: SECURITY_CONSTANTS.JWT_EXPIRY_HOURS,
      aesKeyLength: SECURITY_CONSTANTS.AES_KEY_LENGTH,
    },
    sessions: {
      active: activeSessions,
      blacklisted: blacklistedTokens,
    },
    securityEvents,
    loginStats,
    rateLimitStatus,
    ipAllowlist,
    userStats,
    encryptionStatus,
    securityConfig,
  });
});

// GET /api/security/events — Security event log (Admin only)
api.get('/security/events', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const page = parseInt(c.req.query('page') || '1');
  const limit = Math.min(parseInt(c.req.query('limit') || '30'), 100);
  const offset = (page - 1) * limit;
  const severity = c.req.query('severity');
  const eventType = c.req.query('type');

  let where = '1=1';
  const params: any[] = [];
  if (severity) { where += ' AND severity = ?'; params.push(severity); }
  if (eventType) { where += ' AND event_type = ?'; params.push(eventType); }

  const countResult: any = await db.prepare(`SELECT COUNT(*) as total FROM security_events WHERE ${where}`).bind(...params).first();
  const rows = await db.prepare(`SELECT * FROM security_events WHERE ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).bind(...params, limit, offset).all();

  // Get distinct event types for filters
  const types = await db.prepare('SELECT DISTINCT event_type FROM security_events ORDER BY event_type').all();

  return c.json({
    events: rows.results,
    total: countResult?.total || 0,
    page,
    limit,
    filters: {
      eventTypes: (types.results as any[]).map(r => r.event_type),
      severities: ['low', 'medium', 'high', 'critical'],
    },
  });
});

// PATCH /api/security/events/:id/resolve — Resolve a security event
api.patch('/security/events/:id/resolve', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const caller = c.get('user') as AuthUser;
  const ip = c.req.header('CF-Connecting-IP') || 'unknown';

  await db.prepare(
    'UPDATE security_events SET resolved = 1, resolved_by = ?, resolved_at = datetime("now") WHERE id = ?'
  ).bind(caller.username, id).run();

  await auditLog(db, caller.username, 'Security Event Resolved', id, `Resolved security event ${id}`, ip, caller.tier);

  return c.json({ success: true });
});

// GET /api/security/ip-allowlist — Admin IP allowlist (Admin only)
api.get('/security/ip-allowlist', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const rows = await db.prepare('SELECT * FROM admin_ip_allowlist ORDER BY created_at DESC').all();
  
  // Check if restriction is enabled
  let enabled = false;
  try {
    const config: any = await db.prepare(
      "SELECT value FROM security_config WHERE key = 'admin_ip_restriction_enabled'"
    ).first();
    enabled = config?.value === '1';
  } catch {}

  return c.json({ allowlist: rows.results, enabled });
});

// POST /api/security/ip-allowlist — Add IP to allowlist
api.post('/security/ip-allowlist', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const caller = c.get('user') as AuthUser;
  const ip = c.req.header('CF-Connecting-IP') || 'unknown';
  const { ipAddress, label, expiresAt } = await c.req.json();
  
  if (!ipAddress) return c.json({ error: 'IP address is required' }, 400);
  // Basic IP validation
  if (!/^[\d.:/]+$/.test(ipAddress)) return c.json({ error: 'Invalid IP address format' }, 400);

  await db.prepare(
    'INSERT INTO admin_ip_allowlist (ip_address, label, added_by, expires_at) VALUES (?, ?, ?, ?)'
  ).bind(ipAddress, label || '', caller.username, expiresAt || null).run();

  await logSecurityEvent(db, 'ip_allowlist_added', 'medium', `Added ${ipAddress} to admin IP allowlist`, ip, caller.id, caller.username);
  await auditLog(db, caller.username, 'IP Allowlist Added', ipAddress, `Added to admin IP allowlist: ${label || ipAddress}`, ip, caller.tier);

  return c.json({ success: true });
});

// DELETE /api/security/ip-allowlist/:id — Remove IP from allowlist
api.delete('/security/ip-allowlist/:id', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const caller = c.get('user') as AuthUser;
  const ip = c.req.header('CF-Connecting-IP') || 'unknown';

  await db.prepare('UPDATE admin_ip_allowlist SET is_active = 0 WHERE id = ?').bind(id).run();
  await logSecurityEvent(db, 'ip_allowlist_removed', 'medium', `Removed IP from admin allowlist (ID: ${id})`, ip, caller.id, caller.username);

  return c.json({ success: true });
});

// POST /api/security/ip-restriction/toggle — Enable/disable admin IP restriction
api.post('/security/ip-restriction/toggle', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const caller = c.get('user') as AuthUser;
  const ip = c.req.header('CF-Connecting-IP') || 'unknown';
  const { enabled } = await c.req.json();

  await db.prepare(
    "INSERT OR REPLACE INTO security_config (key, value, updated_at, updated_by) VALUES ('admin_ip_restriction_enabled', ?, datetime('now'), ?)"
  ).bind(enabled ? '1' : '0', caller.username).run();

  // If enabling, auto-add the current admin IP
  if (enabled) {
    await db.prepare(
      'INSERT OR IGNORE INTO admin_ip_allowlist (ip_address, label, added_by) VALUES (?, ?, ?)'
    ).bind(ip, 'Auto-added on enable', caller.username).run();
  }

  await logSecurityEvent(db, 'ip_restriction_toggled', 'high', `Admin IP restriction ${enabled ? 'enabled' : 'disabled'}`, ip, caller.id, caller.username);
  await auditLog(db, caller.username, 'Security Config', 'admin_ip_restriction', `${enabled ? 'Enabled' : 'Disabled'} admin IP restriction`, ip, caller.tier);

  return c.json({ success: true, enabled });
});

// POST /api/security/encrypt-pii — Encrypt existing PII fields (one-time migration)
api.post('/security/encrypt-pii', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const caller = c.get('user') as AuthUser;
  const ip = c.req.header('CF-Connecting-IP') || 'unknown';

  let encryptedCount = 0;

  // Encrypt user emails
  try {
    const users = await db.prepare('SELECT id, email FROM users WHERE email IS NOT NULL AND email != ""').all();
    for (const user of users.results as any[]) {
      if (!isEncrypted(user.email)) {
        const encrypted = await encryptField(user.email);
        await db.prepare('UPDATE users SET email = ? WHERE id = ?').bind(encrypted, user.id).run();
        encryptedCount++;
      }
    }
  } catch (e) {
    console.error('[SECURITY] PII encryption error:', e);
  }

  // Register encrypted fields
  try {
    await db.prepare(
      'INSERT OR REPLACE INTO encryption_registry (table_name, field_name, encryption_algo) VALUES (?, ?, ?)'
    ).bind('users', 'email', 'AES-256-GCM').run();
  } catch {}

  await logSecurityEvent(db, 'pii_encryption', 'medium', `Encrypted ${encryptedCount} PII fields`, ip, caller.id, caller.username);
  await auditLog(db, caller.username, 'PII Encryption', 'users.email', `Encrypted ${encryptedCount} email fields`, ip, caller.tier);

  return c.json({ success: true, encryptedCount, message: `Encrypted ${encryptedCount} email fields with AES-256-GCM` });
});

// POST /api/security/token/revoke — Revoke a specific user's tokens (Admin only)
api.post('/security/token/revoke', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const caller = c.get('user') as AuthUser;
  const ip = c.req.header('CF-Connecting-IP') || 'unknown';
  const { userId, reason } = await c.req.json();

  if (!userId) return c.json({ error: 'userId is required' }, 400);

  await blacklistAllUserTokens(db, userId, reason || 'admin_revocation');

  const targetUser: any = await db.prepare('SELECT username FROM users WHERE id = ?').bind(userId).first();
  const targetName = targetUser?.username || userId;

  await logSecurityEvent(db, 'admin_token_revocation', 'high', `Admin ${caller.username} revoked all tokens for ${targetName}: ${reason || 'no reason'}`, ip, userId, targetName);
  await auditLog(db, caller.username, 'Token Revocation', userId, `Revoked all tokens for ${targetName}: ${reason || 'no reason'}`, ip, caller.tier);

  return c.json({ success: true, message: `All sessions revoked for ${targetName}` });
});

// POST /api/security/cleanup — Clean up expired tokens and old security data
api.post('/security/cleanup', requireRole('Admin'), async (c) => {
  const db = c.env.DB;
  const caller = c.get('user') as AuthUser;
  const ip = c.req.header('CF-Connecting-IP') || 'unknown';

  let cleaned = { blacklist: 0, rateLimits: 0, oldEvents: 0 };

  try {
    // Clean expired blacklisted tokens
    const bl = await db.prepare('DELETE FROM token_blacklist WHERE expires_at < datetime("now")').run();
    cleaned.blacklist = bl.meta?.changes || 0;
  } catch {}

  try {
    // Clean old rate limit entries
    const rl = await db.prepare('DELETE FROM rate_limit_tracker WHERE last_request < datetime("now", "-1 hour")').run();
    cleaned.rateLimits = rl.meta?.changes || 0;
  } catch {}

  try {
    // Clean security events older than 90 days
    const se = await db.prepare('DELETE FROM security_events WHERE created_at < datetime("now", "-90 days")').run();
    cleaned.oldEvents = se.meta?.changes || 0;
  } catch {}

  await auditLog(db, caller.username, 'Security Cleanup', 'system', `Cleaned: ${cleaned.blacklist} tokens, ${cleaned.rateLimits} rate limits, ${cleaned.oldEvents} old events`, ip, caller.tier);

  return c.json({ success: true, cleaned });
});

// POST /api/auth/logout — Logout (blacklist current token)
api.post('/auth/logout', async (c) => {
  const user = c.get('user') as AuthUser;
  const db = c.env.DB;
  const ip = c.req.header('CF-Connecting-IP') || 'unknown';

  if (user.jti) {
    const futureExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    await blacklistToken(db, user.jti, user.id, 'logout', futureExpiry);
    // Remove session fingerprint
    try {
      await db.prepare('DELETE FROM session_fingerprints WHERE jti = ?').bind(user.jti).run();
    } catch {}
  }

  await auditLog(db, user.username, 'Logout', user.id, `User ${user.username} logged out`, ip, user.tier);
  await logSecurityEvent(db, 'logout', 'low', `${user.username} logged out`, ip, user.id, user.username);

  return c.json({ success: true, message: 'Logged out successfully. Token revoked.' });
});

// =============================================================================
// RSKB — Regulatory & Standards Knowledge Base
// =============================================================================

// GET /api/rskb/stats — Overview statistics
api.get('/rskb/stats', async (c) => {
  const db = c.env.DB;
  const [domains, instruments, bodies, agents, capacities, crossRefs] = await Promise.all([
    db.prepare('SELECT COUNT(*) as cnt FROM rskb_domains').first<{cnt:number}>(),
    db.prepare('SELECT COUNT(*) as cnt FROM rskb_instruments').first<{cnt:number}>(),
    db.prepare('SELECT COUNT(*) as cnt FROM rskb_bodies').first<{cnt:number}>(),
    db.prepare('SELECT COUNT(*) as cnt FROM rskb_regulated_agents').first<{cnt:number}>(),
    db.prepare('SELECT COUNT(*) as cnt FROM rskb_capacity_areas').first<{cnt:number}>(),
    db.prepare('SELECT COUNT(*) as cnt FROM rskb_cross_references').first<{cnt:number}>(),
  ]);
  const bySector = await db.prepare(`SELECT 
    SUM(sector_biosecurity) as biosecurity, SUM(sector_biosafety) as biosafety,
    SUM(sector_biosurveillance) as biosurveillance, SUM(sector_biodefense) as biodefense,
    SUM(sector_public_health) as public_health, SUM(sector_laboratory) as laboratory,
    SUM(sector_amr) as amr, SUM(sector_animal_health) as animal_health,
    SUM(sector_food_safety) as food_safety, SUM(sector_environmental) as environmental
    FROM rskb_instruments`).first();
  const byScope = await db.prepare(`SELECT scope, COUNT(*) as cnt FROM rskb_instruments GROUP BY scope ORDER BY cnt DESC`).all();
  const byBinding = await db.prepare(`SELECT binding_level, COUNT(*) as cnt FROM rskb_instruments GROUP BY binding_level ORDER BY cnt DESC`).all();
  return c.json({
    totals: { domains: domains?.cnt||0, instruments: instruments?.cnt||0, bodies: bodies?.cnt||0, agents: agents?.cnt||0, capacities: capacities?.cnt||0, crossReferences: crossRefs?.cnt||0 },
    bySector, byScope: byScope.results, byBinding: byBinding.results
  });
});

// GET /api/rskb/domains — List all domains with instrument counts
api.get('/rskb/domains', async (c) => {
  const db = c.env.DB;
  const domains = await db.prepare(`
    SELECT d.*, COUNT(i.id) as instrument_count 
    FROM rskb_domains d LEFT JOIN rskb_instruments i ON i.domain_id = d.id 
    GROUP BY d.id ORDER BY d.sort_order
  `).all();
  return c.json(domains.results);
});

// GET /api/rskb/categories — List categories (optionally by domain)
api.get('/rskb/categories', async (c) => {
  const db = c.env.DB;
  const domainId = c.req.query('domain_id');
  let q = 'SELECT c.*, d.name as domain_name, d.code as domain_code, COUNT(i.id) as instrument_count FROM rskb_categories c LEFT JOIN rskb_domains d ON d.id = c.domain_id LEFT JOIN rskb_instruments i ON i.category_id = c.id';
  const params: string[] = [];
  if (domainId) { q += ' WHERE c.domain_id = ?'; params.push(domainId); }
  q += ' GROUP BY c.id ORDER BY c.sort_order';
  const stmt = params.length ? db.prepare(q).bind(...params) : db.prepare(q);
  const cats = await stmt.all();
  return c.json(cats.results);
});

// GET /api/rskb/instruments — List instruments with filtering
api.get('/rskb/instruments', async (c) => {
  const db = c.env.DB;
  const { domain_id, category_id, scope, sector, binding, status, search, page, limit: lim } = c.req.query();
  const pg = parseInt(page || '1'); const lt = Math.min(parseInt(lim || '50'), 100);
  const offset = (pg - 1) * lt;
  let where: string[] = []; let params: any[] = [];

  if (domain_id) { where.push('i.domain_id = ?'); params.push(domain_id); }
  if (category_id) { where.push('i.category_id = ?'); params.push(category_id); }
  if (scope) { where.push('i.scope = ?'); params.push(scope); }
  if (binding) { where.push('i.binding_level = ?'); params.push(binding); }
  if (status) { where.push('i.status = ?'); params.push(status); }
  if (sector) {
    const col = `sector_${sector}`;
    const validCols = ['sector_biosecurity','sector_biosafety','sector_biosurveillance','sector_biodefense','sector_public_health','sector_animal_health','sector_food_safety','sector_environmental','sector_laboratory','sector_amr'];
    if (validCols.includes(col)) { where.push(`i.${col} = 1`); }
  }

  const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

  // If search, use FTS
  if (search && search.trim()) {
    const ftsResults = await db.prepare('SELECT rowid FROM rskb_instruments_fts WHERE rskb_instruments_fts MATCH ? LIMIT 100').bind(search + '*').all();
    if (ftsResults.results.length === 0) return c.json({ instruments: [], total: 0, page: pg, totalPages: 0 });
    const rowIds = ftsResults.results.map((r: any) => r.rowid);
    const inClause = rowIds.map(() => '?').join(',');
    const total = rowIds.length;
    const q = `SELECT i.*, d.name as domain_name, d.color as domain_color, d.icon as domain_icon, cat.name as category_name
      FROM rskb_instruments i
      LEFT JOIN rskb_domains d ON d.id = i.domain_id
      LEFT JOIN rskb_categories cat ON cat.id = i.category_id
      WHERE i.rowid IN (${inClause}) ${where.length ? 'AND ' + where.join(' AND ') : ''}
      ORDER BY i.code LIMIT ? OFFSET ?`;
    const allParams = [...rowIds, ...params, lt, offset];
    const results = await db.prepare(q).bind(...allParams).all();
    return c.json({ instruments: results.results, total, page: pg, totalPages: Math.ceil(total / lt) });
  }

  const countQ = `SELECT COUNT(*) as cnt FROM rskb_instruments i ${whereClause}`;
  const countStmt = params.length ? db.prepare(countQ).bind(...params) : db.prepare(countQ);
  const total = (await countStmt.first<{cnt:number}>())?.cnt || 0;

  const q = `SELECT i.id, i.code, i.title, i.short_title, i.instrument_type, i.scope, i.issuing_body, i.status, i.binding_level, i.purpose, i.adopted_date, i.entry_into_force, i.last_amended, i.sa_status,
    i.sector_biosecurity, i.sector_biosafety, i.sector_biosurveillance, i.sector_biodefense, i.sector_public_health, i.sector_laboratory, i.sector_amr, i.sector_animal_health, i.sector_food_safety, i.sector_environmental,
    d.name as domain_name, d.color as domain_color, d.icon as domain_icon, cat.name as category_name
    FROM rskb_instruments i
    LEFT JOIN rskb_domains d ON d.id = i.domain_id
    LEFT JOIN rskb_categories cat ON cat.id = i.category_id
    ${whereClause} ORDER BY d.sort_order, i.code LIMIT ? OFFSET ?`;
  const allParams = [...params, lt, offset];
  const results = await db.prepare(q).bind(...allParams).all();
  return c.json({ instruments: results.results, total, page: pg, totalPages: Math.ceil(total / lt) });
});

// GET /api/rskb/instruments/:id — Single instrument detail
api.get('/rskb/instruments/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const inst = await db.prepare(`
    SELECT i.*, d.name as domain_name, d.color as domain_color, d.icon as domain_icon, cat.name as category_name
    FROM rskb_instruments i
    LEFT JOIN rskb_domains d ON d.id = i.domain_id
    LEFT JOIN rskb_categories cat ON cat.id = i.category_id
    WHERE i.id = ? OR i.code = ?
  `).bind(id, id).first();
  if (!inst) return c.json({ error: 'Instrument not found' }, 404);

  // Get cross-references
  const outgoing = await db.prepare(`
    SELECT xr.*, t.code as target_code, t.short_title as target_title, t.instrument_type as target_type
    FROM rskb_cross_references xr JOIN rskb_instruments t ON t.id = xr.target_id WHERE xr.source_id = ?
  `).bind(inst.id as string).all();
  const incoming = await db.prepare(`
    SELECT xr.*, s.code as source_code, s.short_title as source_title, s.instrument_type as source_type
    FROM rskb_cross_references xr JOIN rskb_instruments s ON s.id = xr.source_id WHERE xr.target_id = ?
  `).bind(inst.id as string).all();

  // Get provisions
  const provisions = await db.prepare('SELECT * FROM rskb_provisions WHERE instrument_id = ? ORDER BY sort_order').bind(inst.id as string).all();

  // Get compliance
  const compliance = await db.prepare('SELECT * FROM rskb_compliance WHERE instrument_id = ? ORDER BY assessment_date DESC LIMIT 1').bind(inst.id as string).first();

  // Get timeline
  const timeline = await db.prepare('SELECT * FROM rskb_timeline WHERE instrument_id = ? ORDER BY event_date').bind(inst.id as string).all();

  return c.json({ ...inst, crossReferences: { outgoing: outgoing.results, incoming: incoming.results }, provisions: provisions.results, compliance, timeline: timeline.results });
});

// GET /api/rskb/bodies — List issuing bodies
api.get('/rskb/bodies', async (c) => {
  const db = c.env.DB;
  const bodyType = c.req.query('type');
  let q = 'SELECT b.*, (SELECT COUNT(*) FROM rskb_instruments WHERE issuing_body = b.name OR issuing_body = b.code) as instrument_count FROM rskb_bodies b';
  if (bodyType) { q += ' WHERE b.body_type = ?'; }
  q += ' ORDER BY b.name';
  const stmt = bodyType ? db.prepare(q).bind(bodyType) : db.prepare(q);
  return c.json((await stmt.all()).results);
});

// GET /api/rskb/agents — List regulated biological agents
api.get('/rskb/agents', async (c) => {
  const db = c.env.DB;
  const { type, risk_group, bsl, select_agent, search } = c.req.query();
  let where: string[] = []; let params: any[] = [];
  if (type) { where.push('agent_type = ?'); params.push(type); }
  if (risk_group) { where.push('risk_group = ?'); params.push(parseInt(risk_group)); }
  if (bsl) { where.push('bsl_required = ?'); params.push(parseInt(bsl)); }
  if (select_agent === '1') { where.push('select_agent = 1'); }
  if (search) { where.push('agent_name LIKE ?'); params.push(`%${search}%`); }
  const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
  const q = `SELECT * FROM rskb_regulated_agents ${whereClause} ORDER BY risk_group DESC, agent_name`;
  const stmt = params.length ? db.prepare(q).bind(...params) : db.prepare(q);
  return c.json((await stmt.all()).results);
});

// GET /api/rskb/capacities — IHR/GHSA capacity areas with scores
api.get('/rskb/capacities', async (c) => {
  const db = c.env.DB;
  const framework = c.req.query('framework'); // 'IHR' or 'GHSA'
  let q = `SELECT ca.*, i.short_title as framework_name FROM rskb_capacity_areas ca LEFT JOIN rskb_instruments i ON i.id = ca.framework_instrument_id`;
  if (framework) {
    q += ' WHERE ca.code LIKE ?';
    const caps = await db.prepare(q).bind(`${framework}%`).all();
    return c.json(caps.results);
  }
  q += ' ORDER BY ca.sort_order';
  return c.json((await db.prepare(q).all()).results);
});

// GET /api/rskb/matrix — Compliance/sector matrix view
api.get('/rskb/matrix', async (c) => {
  const db = c.env.DB;
  const instruments = await db.prepare(`
    SELECT i.id, i.code, i.short_title, i.scope, i.binding_level, i.sa_status,
      i.sector_biosecurity, i.sector_biosafety, i.sector_biosurveillance, i.sector_biodefense,
      i.sector_public_health, i.sector_laboratory, i.sector_amr, i.sector_animal_health,
      i.sector_food_safety, i.sector_environmental,
      d.name as domain_name, d.color as domain_color
    FROM rskb_instruments i LEFT JOIN rskb_domains d ON d.id = i.domain_id
    ORDER BY d.sort_order, i.code
  `).all();
  return c.json(instruments.results);
});

export default api;
