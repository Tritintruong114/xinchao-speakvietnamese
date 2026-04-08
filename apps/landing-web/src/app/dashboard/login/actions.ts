'use server';

import {
  getDashboardSessionSecret,
  getPrimaryDashboardAdmin,
  verifyDashboardAdminFromDb,
} from '@/lib/dashboardAuth';
import { DASHBOARD_SESSION_COOKIE, signDashboardSession } from '@/lib/dashboardSessionCrypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

function safeNext(path: string): string {
  const p = path.trim();
  if (p.startsWith('/dashboard') && !p.startsWith('/dashboard/login')) return p;
  return '/dashboard';
}

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');
  const nextRaw = String(formData.get('next') || '');
  const secret = getDashboardSessionSecret();

  if (!secret) {
    redirect('/dashboard/login?reason=misconfigured');
  }

  const primary = getPrimaryDashboardAdmin();
  let ok = email === primary.email && password === primary.password;
  if (!ok) {
    ok = await verifyDashboardAdminFromDb(email, password);
  }

  if (!ok) {
    redirect('/dashboard/login?reason=invalid');
  }

  const token = await signDashboardSession(email, secret);
  const store = await cookies();
  store.set(DASHBOARD_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect(safeNext(nextRaw));
}
