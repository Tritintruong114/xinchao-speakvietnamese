import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const SETTING_ELEVENLABS = 'elevenlabs_api_key';
export const SETTING_GEMINI = 'gemini_api_key';

export async function getDashboardSetting(key: string): Promise<string | null> {
  const admin = getSupabaseAdmin();
  if (!admin) return null;
  const { data, error } = await admin
    .from('dashboard_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle();
  if (error || !data?.value) return null;
  return String(data.value);
}

export async function getDashboardSettingsMap(keys: string[]): Promise<Record<string, string>> {
  const admin = getSupabaseAdmin();
  if (!admin) return {};
  const { data, error } = await admin.from('dashboard_settings').select('key, value').in('key', keys);
  if (error || !data?.length) return {};
  const out: Record<string, string> = {};
  for (const row of data as { key: string; value: string }[]) {
    out[row.key] = row.value;
  }
  return out;
}

export async function upsertDashboardSetting(key: string, value: string): Promise<{ error: string | null }> {
  const admin = getSupabaseAdmin();
  if (!admin) return { error: 'Database is not configured.' };
  const { error } = await admin
    .from('dashboard_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) return { error: error.message };
  return { error: null };
}

export type DashboardAdminRow = { email: string; created_at: string };

export async function listDashboardAdmins(): Promise<DashboardAdminRow[]> {
  const admin = getSupabaseAdmin();
  if (!admin) return [];
  const { data, error } = await admin
    .from('dashboard_admins')
    .select('email, created_at')
    .order('created_at', { ascending: true });
  if (error || !data) return [];
  return data as DashboardAdminRow[];
}

export async function insertDashboardAdmin(
  email: string,
  passwordHash: string,
): Promise<{ error: string | null }> {
  const admin = getSupabaseAdmin();
  if (!admin) return { error: 'Database is not configured.' };
  const { error } = await admin.from('dashboard_admins').insert({ email, password_hash: passwordHash });
  if (error) {
    if (/duplicate|unique/i.test(error.message)) return { error: 'Email already exists.' };
    return { error: error.message };
  }
  return { error: null };
}
