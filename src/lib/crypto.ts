// =============================================================================
// BioR Platform - Cryptography & JWT Library (Enterprise Security v8.0)
// =============================================================================
// Uses Web Crypto API (Cloudflare Workers compatible)
// No Node.js dependencies
// Features: PBKDF2, HMAC-SHA256 JWT, AES-256-GCM field encryption,
//           session fingerprinting, token lifetime control
// =============================================================================

// JWT secret is injected at runtime from environment (Cloudflare secret)
// NEVER hardcode secrets in source code
let _jwtSecret: string | null = null;

/**
 * Initialize JWT secret from environment binding.
 * Must be called once at app startup or per-request with env.
 */
export function initJWTSecret(secret?: string) {
  if (secret) {
    _jwtSecret = secret;
  }
}

function getJWTSecret(): string {
  if (_jwtSecret) return _jwtSecret;
  _jwtSecret = 'ephemeral-' + crypto.randomUUID();
  console.warn('[SECURITY] JWT_SECRET not set in environment. Using ephemeral secret — tokens will not persist across restarts.');
  return _jwtSecret;
}

// ===== SECURITY CONSTANTS =====
const JWT_EXPIRY = 8 * 60 * 60; // 8 hours (reduced from 24h for tighter security)
const PBKDF2_ITERATIONS = 150000;
const SALT_LENGTH = 32;
const AES_KEY_LENGTH = 256; // AES-256
const IV_LENGTH = 12; // 96-bit IV for GCM

// Export for use in security dashboard
export const SECURITY_CONSTANTS = {
  JWT_EXPIRY_SECONDS: JWT_EXPIRY,
  JWT_EXPIRY_HOURS: JWT_EXPIRY / 3600,
  PBKDF2_ITERATIONS,
  SALT_LENGTH,
  AES_KEY_LENGTH,
  IV_LENGTH,
  ALGORITHM_JWT: 'HMAC-SHA256',
  ALGORITHM_PASSWORD: 'PBKDF2-SHA256',
  ALGORITHM_ENCRYPTION: 'AES-256-GCM',
};

// ===== UTILITY FUNCTIONS =====

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function base64UrlEncode(data: string): string {
  return btoa(data).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(data: string): string {
  const padded = data + '='.repeat((4 - data.length % 4) % 4);
  return atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
}

// ===== PBKDF2 PASSWORD HASHING =====

/**
 * Hash a password using PBKDF2-SHA256
 * Returns: "salt:hash" in base64
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );
  return arrayBufferToBase64(salt.buffer) + ':' + arrayBufferToBase64(derivedBits);
}

/**
 * Verify a password against a stored hash.
 * Supports both old (100k iter, 16-byte salt) and new (150k iter, 32-byte salt) hashes.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [saltB64, hashB64] = storedHash.split(':');
  if (!saltB64 || !hashB64) return false;

  const salt = new Uint8Array(base64ToArrayBuffer(saltB64));
  const iterations = salt.length >= 32 ? PBKDF2_ITERATIONS : 100000;

  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );
  
  // Constant-time comparison to prevent timing attacks
  const computed = arrayBufferToBase64(derivedBits);
  if (computed.length !== hashB64.length) return false;
  let diff = 0;
  for (let i = 0; i < computed.length; i++) {
    diff |= computed.charCodeAt(i) ^ hashB64.charCodeAt(i);
  }
  return diff === 0;
}

// ===== JWT TOKEN MANAGEMENT =====

export interface JWTPayload {
  sub: string;       // user id
  username: string;
  role: string;
  tier: number;
  iat: number;
  exp: number;
  jti: string;       // unique token ID (prevents replay)
  fph?: string;      // session fingerprint hash (UA + IP)
}

async function hmacSign(message: string): Promise<string> {
  const secret = getJWTSecret();
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return arrayBufferToBase64(signature).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmacVerify(message: string, signature: string): Promise<boolean> {
  const secret = getJWTSecret();
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  const sigPadded = signature + '='.repeat((4 - signature.length % 4) % 4);
  const sigBuffer = base64ToArrayBuffer(sigPadded.replace(/-/g, '+').replace(/_/g, '/'));
  return crypto.subtle.verify('HMAC', key, sigBuffer, encoder.encode(message));
}

/**
 * Generate a SHA-256 hash of a string (for fingerprinting)
 */
export async function sha256Hash(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return arrayBufferToBase64(hash).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Create a session fingerprint hash from User-Agent + IP
 */
export async function createSessionFingerprint(userAgent: string, ip: string): Promise<string> {
  return sha256Hash(`${userAgent}|${ip}`);
}

/**
 * Create a JWT token for a user
 * Includes unique token ID (jti) and session fingerprint (fph)
 */
export async function createToken(
  userId: string, username: string, role: string, tier: number,
  fingerprint?: string
): Promise<{ token: string; jti: string; expiresIn: number; expiresAt: string }> {
  const now = Math.floor(Date.now() / 1000);
  const jti = crypto.randomUUID();
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload: JWTPayload = {
    sub: userId,
    username,
    role,
    tier,
    iat: now,
    exp: now + JWT_EXPIRY,
    jti,
    ...(fingerprint ? { fph: fingerprint } : {}),
  };
  const payloadStr = base64UrlEncode(JSON.stringify(payload));
  const signature = await hmacSign(`${header}.${payloadStr}`);
  const token = `${header}.${payloadStr}.${signature}`;
  return {
    token,
    jti,
    expiresIn: JWT_EXPIRY,
    expiresAt: new Date((now + JWT_EXPIRY) * 1000).toISOString(),
  };
}

/**
 * Verify and decode a JWT token
 * Returns payload or null if invalid/expired
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const isValid = await hmacVerify(`${header}.${payload}`, signature);
    if (!isValid) return null;

    const decoded: JWTPayload = JSON.parse(base64UrlDecode(payload));
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) return null;

    // Validate required fields
    if (!decoded.sub || !decoded.username || !decoded.role || typeof decoded.tier !== 'number') {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

// ===== AES-256-GCM FIELD-LEVEL ENCRYPTION =====

/**
 * Derive an AES-256 key from JWT secret using PBKDF2
 * Uses a fixed salt derived from the purpose string for deterministic key derivation
 */
async function deriveEncryptionKey(purpose: string = 'field-encryption'): Promise<CryptoKey> {
  const secret = getJWTSecret();
  const encoder = new TextEncoder();
  
  // Derive a purpose-specific salt
  const saltData = await crypto.subtle.digest('SHA-256', encoder.encode(`bior-${purpose}-salt`));
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new Uint8Array(saltData),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: AES_KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt a string using AES-256-GCM
 * Returns: "iv:ciphertext:tag" in base64 (prefixed with "ENC:")
 */
export async function encryptField(plaintext: string): Promise<string> {
  if (!plaintext) return plaintext;
  // Don't double-encrypt
  if (plaintext.startsWith('ENC:')) return plaintext;

  const key = await deriveEncryptionKey();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encoder = new TextEncoder();
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(plaintext)
  );

  const ivB64 = arrayBufferToBase64(iv.buffer);
  const ctB64 = arrayBufferToBase64(encrypted);
  return `ENC:${ivB64}:${ctB64}`;
}

/**
 * Decrypt an AES-256-GCM encrypted string
 * Input format: "ENC:iv:ciphertext" in base64
 */
export async function decryptField(encrypted: string): Promise<string> {
  if (!encrypted || !encrypted.startsWith('ENC:')) return encrypted;

  try {
    const parts = encrypted.slice(4).split(':');
    if (parts.length !== 2) return encrypted;

    const [ivB64, ctB64] = parts;
    const key = await deriveEncryptionKey();
    const iv = new Uint8Array(base64ToArrayBuffer(ivB64));
    const ciphertext = base64ToArrayBuffer(ctB64);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  } catch {
    console.warn('[SECURITY] Decryption failed for field');
    return '[ENCRYPTED]';
  }
}

/**
 * Check if a value is encrypted
 */
export function isEncrypted(value: string): boolean {
  return typeof value === 'string' && value.startsWith('ENC:');
}

// ===== PASSWORD VALIDATION =====

/**
 * Validate password strength
 * Returns null if valid, or an error message string
 */
export function validatePasswordStrength(password: string): string | null {
  if (!password || password.length < 10) {
    return 'Password must be at least 10 characters long';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
    return 'Password must contain at least one special character';
  }
  // Check common weak passwords
  const commonPasswords = ['password', '12345678', 'qwerty', 'admin123', 'letmein', 'welcome', 'password1', 'abc123'];
  if (commonPasswords.some(cp => password.toLowerCase().includes(cp))) {
    return 'Password is too common. Choose a stronger password.';
  }
  // Check for sequential characters
  if (/(.)\1{3,}/.test(password)) {
    return 'Password must not contain 4 or more repeating characters';
  }
  return null;
}

// ===== INPUT SANITIZATION =====

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
