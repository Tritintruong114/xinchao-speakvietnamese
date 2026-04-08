import { NextResponse } from 'next/server';
import { notifyContactSubmission } from '@/lib/email';
import { SITE_CONTACT_EMAIL } from '@/lib/site';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!name || name.length > 200) {
    return NextResponse.json({ error: 'Name required' }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }
  if (!message || message.length > 8000) {
    return NextResponse.json({ error: 'Message required' }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  if (admin) {
    const { error } = await admin.from('landing_contact_submissions').insert({
      name,
      email,
      message,
      source: 'landing-contact',
    });

    if (error) {
      console.error('[contact]', error.message);
      return NextResponse.json({ error: 'Could not send message. Try again later.' }, { status: 503 });
    }

    await notifyContactSubmission({ name, email, message });

    return NextResponse.json({ ok: true as const, mode: 'database' as const });
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          source: 'landing-contact',
          at: new Date().toISOString(),
        }),
      });
    } catch {
      return NextResponse.json({ error: 'Could not reach messaging service' }, { status: 502 });
    }
    return NextResponse.json({ ok: true as const, mode: 'webhook' as const });
  }

  const text = `From: ${name} <${email}>\n\n${message}`;
  const mailto = `mailto:${SITE_CONTACT_EMAIL}?subject=${encodeURIComponent(
    `[XinChao] Message from ${name}`,
  )}&body=${encodeURIComponent(text)}`;

  return NextResponse.json({ ok: true as const, mode: 'mailto' as const, mailto });
}
