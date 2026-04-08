import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { resolveDashboardSessionSecret } from '@/lib/dashboardSessionSecret';

export function getPrimaryDashboardAdmin(): { email: string; password: string } {
  return {
    email: (process.env.DASHBOARD_ADMIN_EMAIL?.trim() || 'admin@gmail.com').toLowerCase(),
    password: process.env.DASHBOARD_ADMIN_PASSWORD?.trim() || 'xinchaovietnam',
  };
}

export function getDashboardSessionSecret(): string | null {
  return resolveDashboardSessionSecret();
}

export function hashDashboardPassword(plain: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(plain, salt, 64);
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

export function verifyDashboardPasswordHash(plain: string, stored: string): boolean {
  const parts = stored.split(':');
  if (parts.length !== 2) return false;
  const [saltHex, hashHex] = parts;
  if (!saltHex || !hashHex) return false;
  try {
    const salt = Buffer.from(saltHex, 'hex');
    const hash = Buffer.from(hashHex, 'hex');
    const check = scryptSync(plain, salt, 64);
    return hash.length === check.length && timingSafeEqual(hash, check);
  } catch {
    return false;
  }
}

export async function verifyDashboardAdminFromDb(email: string, password: string): Promise<boolean> {
  const admin = getSupabaseAdmin();
  if (!admin) return false;
  const { data, error } = await admin
    .from('dashboard_admins')
    .select('password_hash')
    .eq('email', email)
    .maybeSingle();
  if (error || !data?.password_hash) return false;
  return verifyDashboardPasswordHash(password, data.password_hash as string);
}
