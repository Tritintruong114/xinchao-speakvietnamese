import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import type { ContactRow, WaitlistRow } from './types';

export async function loadWaitlist(): Promise<{ rows: WaitlistRow[]; error: string | null }> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return { rows: [], error: 'Database is not configured.' };
  }

  const { data, error } = await admin
    .from('landing_waitlist')
    .select('id,email,created_at,source')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    console.error('[dashboard waitlist]', error.message);
    return { rows: [], error: 'Could not load waitlist.' };
  }

  return { rows: (data ?? []) as WaitlistRow[], error: null };
}

export async function loadContacts(): Promise<{ rows: ContactRow[]; error: string | null }> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return { rows: [], error: 'Database is not configured.' };
  }

  const { data, error } = await admin
    .from('landing_contact_submissions')
    .select('id,name,email,message,created_at,source')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    console.error('[dashboard contacts]', error.message);
    return { rows: [], error: 'Could not load messages.' };
  }

  return { rows: (data ?? []) as ContactRow[], error: null };
}
