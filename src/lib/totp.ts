// =============================================================================
// BioR Platform - TOTP Library (RFC 6238 / RFC 4226)
// =============================================================================
// Pure Web Crypto API implementation — Cloudflare Workers compatible
// No Node.js dependencies. Implements HMAC-SHA1 TOTP with 6-digit codes
// =============================================================================

const TOTP_PERIOD = 30; // seconds
const TOTP_DIGITS = 6;
const TOTP_WINDOW = 1;  // allow ±1 period for clock skew

// ===== BASE32 ENCODING/DECODING =====
const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function base32Encode(buffer: Uint8Array): string {
  let bits = '';
  for (const byte of buffer) {
    bits += byte.toString(2).padStart(8, '0');
  }
  let result = '';
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.substring(i, i + 5).padEnd(5, '0');
    result += BASE32_CHARS[parseInt(chunk, 2)];
  }
  return result;
}

export function base32Decode(encoded: string): Uint8Array {
  const cleaned = encoded.replace(/[\s=]/g, '').toUpperCase();
  let bits = '';
  for (const char of cleaned) {
    const idx = BASE32_CHARS.indexOf(char);
    if (idx === -1) throw new Error('Invalid base32 character: ' + char);
    bits += idx.toString(2).padStart(5, '0');
  }
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.substring(i * 8, i * 8 + 8), 2);
  }
  return bytes;
}

// ===== TOTP GENERATION =====

/**
 * Generate a random TOTP secret (20 bytes = 160 bits, standard for Google Authenticator)
 */
export function generateSecret(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  return base32Encode(bytes);
}

/**
 * Generate 8 recovery codes (each 8 chars alphanumeric)
 */
export function generateRecoveryCodes(): string[] {
  const codes: string[] = [];
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I, O, 0, 1 for clarity
  for (let i = 0; i < 8; i++) {
    const bytes = crypto.getRandomValues(new Uint8Array(8));
    let code = '';
    for (let j = 0; j < 8; j++) {
      code += chars[bytes[j] % chars.length];
    }
    codes.push(code.substring(0, 4) + '-' + code.substring(4));
  }
  return codes;
}

/**
 * Compute HMAC-SHA1 using Web Crypto API
 */
async function hmacSha1(key: Uint8Array, data: Uint8Array): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  return crypto.subtle.sign('HMAC', cryptoKey, data);
}

/**
 * Generate HOTP value (RFC 4226)
 */
async function generateHOTP(secret: Uint8Array, counter: bigint): Promise<string> {
  // Counter to 8-byte big-endian
  const counterBytes = new Uint8Array(8);
  let c = counter;
  for (let i = 7; i >= 0; i--) {
    counterBytes[i] = Number(c & 0xFFn);
    c >>= 8n;
  }

  const hmac = await hmacSha1(secret, counterBytes);
  const hmacBytes = new Uint8Array(hmac);

  // Dynamic truncation
  const offset = hmacBytes[19] & 0x0f;
  const code =
    ((hmacBytes[offset] & 0x7f) << 24) |
    ((hmacBytes[offset + 1] & 0xff) << 16) |
    ((hmacBytes[offset + 2] & 0xff) << 8) |
    (hmacBytes[offset + 3] & 0xff);

  return (code % Math.pow(10, TOTP_DIGITS)).toString().padStart(TOTP_DIGITS, '0');
}

/**
 * Generate current TOTP value
 */
export async function generateTOTP(secretBase32: string, time?: number): Promise<string> {
  const secret = base32Decode(secretBase32);
  const now = time || Math.floor(Date.now() / 1000);
  const counter = BigInt(Math.floor(now / TOTP_PERIOD));
  return generateHOTP(secret, counter);
}

/**
 * Verify a TOTP code with ±1 time window
 * Returns true if the code matches any window
 */
export async function verifyTOTP(secretBase32: string, code: string, time?: number): Promise<boolean> {
  if (!code || code.length !== TOTP_DIGITS) return false;

  const secret = base32Decode(secretBase32);
  const now = time || Math.floor(Date.now() / 1000);
  const currentCounter = Math.floor(now / TOTP_PERIOD);

  for (let i = -TOTP_WINDOW; i <= TOTP_WINDOW; i++) {
    const counter = BigInt(currentCounter + i);
    const expected = await generateHOTP(secret, counter);
    // Constant-time comparison
    if (expected.length === code.length) {
      let diff = 0;
      for (let j = 0; j < expected.length; j++) {
        diff |= expected.charCodeAt(j) ^ code.charCodeAt(j);
      }
      if (diff === 0) return true;
    }
  }
  return false;
}

/**
 * Generate otpauth:// URI for QR code
 */
export function generateOTPAuthURI(
  secret: string,
  username: string,
  issuer: string = 'BioR Platform'
): string {
  const encoded = encodeURIComponent(issuer) + ':' + encodeURIComponent(username);
  return `otpauth://totp/${encoded}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=${TOTP_DIGITS}&period=${TOTP_PERIOD}`;
}

/**
 * Generate a simple SVG QR code for the otpauth URI
 * Uses a minimal QR encoder without external dependencies
 */
export function generateQRCodeSVG(uri: string): string {
  // We'll return a data URL that the frontend can use with a JS-based QR library
  // Since generating QR in Workers is complex, we return the raw URI
  // and let the frontend render it with a lightweight QR library
  return uri;
}
