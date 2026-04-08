'use server';

import { getPrimaryDashboardAdmin, hashDashboardPassword } from '@/lib/dashboardAuth';
import { DASHBOARD_SESSION_COOKIE } from '@/lib/dashboardSessionCrypto';
import {
  insertDashboardAdmin,
  SETTING_ELEVENLABS,
  SETTING_GEMINI,
  upsertDashboardSetting,
} from '@/lib/dashboardSettingsDb';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveDashboardApiKeysAction(formData: FormData): Promise<void> {
  const eleven = String(formData.get('elevenlabs_api_key') || '').trim();
  const gemini = String(formData.get('gemini_api_key') || '').trim();

  if (!eleven && !gemini) {
    redirect('/dashboard/settings');
  }

  if (eleven) {
    const { error } = await upsertDashboardSetting(SETTING_ELEVENLABS, eleven);
    if (error) redirect(`/dashboard/settings?keysError=${encodeURIComponent(error)}`);
  }
  if (gemini) {
    const { error } = await upsertDashboardSetting(SETTING_GEMINI, gemini);
    if (error) redirect(`/dashboard/settings?keysError=${encodeURIComponent(error)}`);
  }

  revalidatePath('/dashboard/settings');
  redirect('/dashboard/settings?keysSaved=1');
}

export async function createDashboardAdminAction(formData: FormData): Promise<void> {
  const email = String(formData.get('admin_email') || '').trim().toLowerCase();
  const password = String(formData.get('admin_password') || '');
  const primary = getPrimaryDashboardAdmin();
  if (email === primary.email) {
    redirect(
      '/dashboard/settings?adminError=' + encodeURIComponent('This email is the built-in primary admin.'),
    );
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect('/dashboard/settings?adminError=' + encodeURIComponent('Invalid email.'));
  }
  if (password.length < 8) {
    redirect('/dashboard/settings?adminError=' + encodeURIComponent('Password must be at least 8 characters.'));
  }
  const hash = hashDashboardPassword(password);
  const { error } = await insertDashboardAdmin(email, hash);
  if (error) {
    redirect(`/dashboard/settings?adminError=${encodeURIComponent(error)}`);
  }
  revalidatePath('/dashboard/settings');
  redirect('/dashboard/settings?adminCreated=1');
}

export async function logoutDashboardAction(): Promise<void> {
  const store = await cookies();
  store.set(DASHBOARD_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  redirect('/dashboard/login');
}
