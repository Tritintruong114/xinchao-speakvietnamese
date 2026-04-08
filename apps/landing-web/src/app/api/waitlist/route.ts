import { NextResponse } from 'next/server';
import { notifyWaitlistSignup } from '@/lib/email';
import { SITE_CONTACT_EMAIL } from '@/lib/site';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  if (admin) {
    const { error } = await admin.from('landing_waitlist').insert({
      email,
      source: 'landing-waitlist',
    });

    if (error) {
      console.error('[waitlist]', error.message);
      return NextResponse.json({ error: 'Could not save your email. Try again later.' }, { status: 503 });
    }

    await notifyWaitlistSignup(email);

    return NextResponse.json({ ok: true as const, mode: 'database' as const });
  }

  const webhook = process.env.WAITLIST_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'landing-waitlist', at: new Date().toISOString() }),
      });
    } catch {
      return NextResponse.json({ error: 'Could not reach signup service' }, { status: 502 });
    }
    return NextResponse.json({ ok: true as const, mode: 'webhook' as const });
  }

  const mailto = `mailto:${SITE_CONTACT_EMAIL}?subject=${encodeURIComponent(
    'XinChao waitlist',
  )}&body=${encodeURIComponent(`Please add me to the waitlist.\n\n${email}`)}`;

  return NextResponse.json({ ok: true as const, mode: 'mailto' as const, mailto });
}
