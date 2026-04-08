/** Edge-safe HMAC session token for dashboard cookie. */

export const DASHBOARD_SESSION_COOKIE = 'xc_dashboard';

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function hexFromBuffer(buf: Uint8Array): string {
  return [...buf].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(b64url: string): Uint8Array {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 === 0 ? '' : '===='.slice(b64.length % 4);
  const str = atob(b64 + pad);
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return bytes;
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return hexFromBuffer(new Uint8Array(sig));
}

export async function signDashboardSession(email: string, secret: string): Promise<string> {
  const exp = Date.now() + SESSION_TTL_MS;
  const payload = JSON.stringify({ email, exp });
  const payloadB64 = bytesToBase64Url(new TextEncoder().encode(payload));
  const sig = await hmacSha256Hex(secret, payloadB64);
  return `${payloadB64}.${sig}`;
}

export async function verifyDashboardSessionToken(token: string, secret: string): Promise<boolean> {
  const lastDot = token.lastIndexOf('.');
  if (lastDot <= 0) return false;
  const payloadB64 = token.slice(0, lastDot);
  const sigHex = token.slice(lastDot + 1);
  if (!payloadB64 || !sigHex) return false;
  const expected = await hmacSha256Hex(secret, payloadB64);
  if (!timingSafeEqualHex(expected, sigHex)) return false;
  let payload: { email?: string; exp?: number };
  try {
    const json = new TextDecoder().decode(base64UrlToBytes(payloadB64));
    payload = JSON.parse(json) as { email?: string; exp?: number };
  } catch {
    return false;
  }
  if (!payload.email || typeof payload.exp !== 'number') return false;
  if (payload.exp <= Date.now()) return false;
  return true;
}
