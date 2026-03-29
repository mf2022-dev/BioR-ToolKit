// =============================================================================
// BioR Platform - Auth Middleware (Enterprise Security v8.0)
// =============================================================================
// Protects API routes, extracts user context from JWT
// Features: Token blacklist checking, session fingerprint verification,
//           global rate limiting, security event logging
// =============================================================================

import { Context, Next } from 'hono';
import { verifyToken, createSessionFingerprint, type JWTPayload } from './crypto';

export interface AuthUser {
  id: string;
  username: string;
  role: string;
  tier: number;
  jti?: string;      // token ID for blacklist tracking
  fingerprint?: string; // session fingerprint
}

// ===== SECURITY EVENT LOGGER =====
export async function logSecurityEvent(
  db: D1Database,
  eventType: string,
  severity: 'low' | 'medium' | 'high' | 'critical',
  details: string,
  ip?: string,
  userId?: string,
  username?: string,
  metadata?: any
) {
  const id = 'SE-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6);
  try {
    await db.prepare(
      'INSERT INTO security_events (id, event_type, severity, ip, user_id, username, details, metadata) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, eventType, severity, ip || 'unknown', userId || null, username || null, details, metadata ? JSON.stringify(metadata) : null).run();
  } catch (e) {
    // Don't fail the request if security logging fails
    console.error('[SECURITY] Failed to log security event:', e);
  }
}

// ===== TOKEN BLACKLIST CHECK =====
async function isTokenBlacklisted(db: D1Database, jti: string): Promise<boolean> {
  try {
    const result = await db.prepare(
      'SELECT jti FROM token_blacklist WHERE jti = ? AND expires_at > datetime("now")'
    ).bind(jti).first();
    return !!result;
  } catch {
    return false; // Fail open — don't block if table doesn't exist yet
  }
}

// ===== BLACKLIST A TOKEN =====
export async function blacklistToken(db: D1Database, jti: string, userId: string, reason: string, expiresAt: string) {
  try {
    await db.prepare(
      'INSERT OR IGNORE INTO token_blacklist (jti, user_id, reason, expires_at) VALUES (?, ?, ?, ?)'
    ).bind(jti, userId, reason, expiresAt).run();
  } catch (e) {
    console.error('[SECURITY] Failed to blacklist token:', e);
  }
}

// ===== BLACKLIST ALL USER TOKENS =====
export async function blacklistAllUserTokens(db: D1Database, userId: string, reason: string) {
  try {
    // Get all active session fingerprints for this user
    const sessions = await db.prepare(
      'SELECT jti FROM session_fingerprints WHERE user_id = ?'
    ).bind(userId).all();
    
    const futureExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    for (const session of sessions.results as any[]) {
      await blacklistToken(db, session.jti, userId, reason, futureExpiry);
    }
    
    // Clear all fingerprints for this user
    await db.prepare('DELETE FROM session_fingerprints WHERE user_id = ?').bind(userId).run();
  } catch (e) {
    console.error('[SECURITY] Failed to blacklist user tokens:', e);
  }
}

// ===== GLOBAL RATE LIMITING =====
const GLOBAL_RATE_LIMIT = 120; // requests per minute per IP
const GLOBAL_RATE_WINDOW = 60; // 1 minute

async function checkGlobalRateLimit(db: D1Database, ip: string): Promise<{ allowed: boolean; remaining: number; retryAfter?: number }> {
  const now = new Date();
  const windowKey = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}-${now.getUTCHours()}-${now.getUTCMinutes()}`;
  
  try {
    const existing: any = await db.prepare(
      'SELECT request_count, first_request FROM rate_limit_tracker WHERE ip = ? AND window_key = ?'
    ).bind(ip, windowKey).first();
    
    if (existing) {
      if (existing.request_count >= GLOBAL_RATE_LIMIT) {
        return { allowed: false, remaining: 0, retryAfter: GLOBAL_RATE_WINDOW };
      }
      await db.prepare(
        'UPDATE rate_limit_tracker SET request_count = request_count + 1, last_request = datetime("now") WHERE ip = ? AND window_key = ?'
      ).bind(ip, windowKey).run();
      return { allowed: true, remaining: GLOBAL_RATE_LIMIT - existing.request_count - 1 };
    } else {
      // Clean old entries and insert new one
      await db.prepare(
        'DELETE FROM rate_limit_tracker WHERE ip = ? AND window_key != ?'
      ).bind(ip, windowKey).run();
      await db.prepare(
        'INSERT OR REPLACE INTO rate_limit_tracker (ip, window_key, request_count) VALUES (?, ?, 1)'
      ).bind(ip, windowKey).run();
      return { allowed: true, remaining: GLOBAL_RATE_LIMIT - 1 };
    }
  } catch {
    return { allowed: true, remaining: GLOBAL_RATE_LIMIT }; // Fail open
  }
}

// ===== SESSION FINGERPRINT VERIFICATION =====
async function verifySessionFingerprint(
  db: D1Database, jti: string, currentFingerprint: string
): Promise<boolean> {
  try {
    const session: any = await db.prepare(
      'SELECT user_agent_hash FROM session_fingerprints WHERE jti = ?'
    ).bind(jti).first();
    
    if (!session) return true; // No fingerprint stored — allow (backward compat)
    return session.user_agent_hash === currentFingerprint;
  } catch {
    return true; // Fail open
  }
}

// ===== STORE SESSION FINGERPRINT =====
export async function storeSessionFingerprint(
  db: D1Database, jti: string, userId: string, userAgentHash: string, ip: string
) {
  try {
    await db.prepare(
      'INSERT OR REPLACE INTO session_fingerprints (jti, user_id, user_agent_hash, ip_address) VALUES (?, ?, ?, ?)'
    ).bind(jti, userId, userAgentHash, ip).run();
  } catch (e) {
    console.error('[SECURITY] Failed to store session fingerprint:', e);
  }
}

// ===== ADMIN IP ALLOWLIST CHECK =====
async function isAdminIpAllowed(db: D1Database, ip: string): Promise<boolean> {
  try {
    // Check if IP restriction is enabled
    const config: any = await db.prepare(
      "SELECT value FROM security_config WHERE key = 'admin_ip_restriction_enabled'"
    ).first();
    
    if (!config || config.value !== '1') return true; // Restriction not enabled
    
    // Check if IP is in allowlist
    const allowed = await db.prepare(
      'SELECT id FROM admin_ip_allowlist WHERE ip_address = ? AND is_active = 1 AND (expires_at IS NULL OR expires_at > datetime("now"))'
    ).bind(ip).first();
    
    return !!allowed;
  } catch {
    return true; // Fail open
  }
}

// ===== BRUTE FORCE DETECTION =====
async function detectBruteForce(db: D1Database, ip: string) {
  try {
    // Check for 10+ failed logins from same IP in last hour
    const hourAgo = new Date(Date.now() - 3600000).toISOString().replace('T', ' ').split('.')[0];
    const result: any = await db.prepare(
      "SELECT COUNT(*) as cnt FROM security_events WHERE ip = ? AND event_type = 'login_failed' AND created_at >= ?"
    ).bind(ip, hourAgo).first();
    
    if (result && result.cnt >= 10) {
      await logSecurityEvent(db, 'brute_force_detected', 'critical',
        `Brute force attack detected: ${result.cnt} failed logins from ${ip} in last hour`,
        ip, null, null, { failedAttempts: result.cnt });
    }
  } catch { /* ignore */ }
}

// ===== AUTH MIDDLEWARE =====

/**
 * Auth middleware — verifies JWT, checks blacklist, validates fingerprint
 * Only login endpoint is public. Everything else requires valid JWT.
 */
export async function authMiddleware(c: Context, next: Next) {
  const path = c.req.path;
  const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';
  const db = c.env.DB;
  
  // Only login, password reset, and 2FA verify are truly public (no auth needed)
  if (path === '/api/auth/login' || path === '/api/auth/forgot-password' || path === '/api/auth/verify-reset'
      || path === '/api/auth/2fa/verify-login' || path === '/api/auth/2fa/recovery') {
    return next();
  }

  // SSE stream handles its own JWT auth via query param (EventSource can't set headers)
  if (path === '/api/notifications/stream' || path === '/api/notifications/stream/health') {
    return next();
  }

  // Global rate limiting for all authenticated endpoints
  try {
    const rateCheck = await checkGlobalRateLimit(db, ip);
    if (!rateCheck.allowed) {
      await logSecurityEvent(db, 'rate_limit_exceeded', 'medium',
        `Global rate limit exceeded for IP ${ip}`, ip);
      c.res.headers.set('Retry-After', String(rateCheck.retryAfter || 60));
      c.res.headers.set('X-RateLimit-Remaining', '0');
      return c.json({ 
        error: 'Too many requests. Please slow down.', 
        code: 'RATE_LIMITED',
        retryAfter: rateCheck.retryAfter 
      }, 429);
    }
    c.res.headers.set('X-RateLimit-Remaining', String(rateCheck.remaining));
  } catch { /* Don't block on rate limit errors */ }

  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Authentication required', code: 'AUTH_REQUIRED' }, 401);
  }

  const token = authHeader.slice(7);
  
  // Reject obviously fake/static tokens
  if (token.startsWith('eyJhbGciOiJIUzI1NiJ9.bior-')) {
    await logSecurityEvent(db, 'fake_token_attempt', 'high',
      'Fake/static token used in request', ip, undefined, undefined, { path });
    return c.json({ error: 'Invalid token format. Please re-authenticate.', code: 'TOKEN_INVALID' }, 401);
  }
  
  const payload = await verifyToken(token);
  if (!payload) {
    return c.json({ error: 'Invalid or expired token. Please sign in again.', code: 'TOKEN_EXPIRED' }, 401);
  }

  // Check token blacklist
  if (payload.jti) {
    const blacklisted = await isTokenBlacklisted(db, payload.jti);
    if (blacklisted) {
      await logSecurityEvent(db, 'blacklisted_token_used', 'high',
        `Blacklisted token used by ${payload.username}`, ip, payload.sub, payload.username);
      return c.json({ error: 'Session has been revoked. Please sign in again.', code: 'TOKEN_REVOKED' }, 401);
    }
  }

  // Verify session fingerprint (if enabled)
  if (payload.jti && payload.fph) {
    const userAgent = c.req.header('User-Agent') || '';
    const currentFingerprint = await createSessionFingerprint(userAgent, ip);
    const fpValid = await verifySessionFingerprint(db, payload.jti, currentFingerprint);
    if (!fpValid) {
      await logSecurityEvent(db, 'session_fingerprint_mismatch', 'high',
        `Session fingerprint mismatch for ${payload.username}. Possible token theft.`,
        ip, payload.sub, payload.username, { expectedFph: payload.fph });
      return c.json({ 
        error: 'Session verification failed. Your session may have been compromised. Please sign in again.', 
        code: 'SESSION_INVALID' 
      }, 401);
    }
  }

  // Admin IP restriction check
  if (path.startsWith('/api/admin') || path.startsWith('/api/security')) {
    const role = payload.role;
    if (role === 'Admin') {
      const ipAllowed = await isAdminIpAllowed(db, ip);
      if (!ipAllowed) {
        await logSecurityEvent(db, 'admin_ip_blocked', 'critical',
          `Admin access from unauthorized IP: ${ip}`, ip, payload.sub, payload.username);
        return c.json({ 
          error: 'Admin access not permitted from this location.', 
          code: 'IP_RESTRICTED' 
        }, 403);
      }
    }
  }

  // Attach user to context (with JTI for token management)
  c.set('user', {
    id: payload.sub,
    username: payload.username,
    role: payload.role,
    tier: payload.tier,
    jti: payload.jti,
    fingerprint: payload.fph,
  } as AuthUser);

  return next();
}

/**
 * Require minimum tier level
 */
export function requireTier(minTier: number) {
  return async (c: Context, next: Next) => {
    const user = c.get('user') as AuthUser;
    if (!user || user.tier < minTier) {
      return c.json({ error: 'Insufficient permissions', code: 'FORBIDDEN' }, 403);
    }
    return next();
  };
}

/**
 * Require specific role(s)
 */
export function requireRole(...roles: string[]) {
  return async (c: Context, next: Next) => {
    const user = c.get('user') as AuthUser;
    if (!user || !roles.includes(user.role)) {
      return c.json({ error: 'Insufficient permissions', code: 'FORBIDDEN' }, 403);
    }
    return next();
  };
}
