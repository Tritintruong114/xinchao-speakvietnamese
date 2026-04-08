import { Resend } from 'resend';
import { SITE_CONTACT_EMAIL, SITE_NAME, SITE_URL } from '@/lib/site';

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getOwnerInbox(): string {
  return (process.env.OWNER_EMAIL || process.env.CONTACT_EMAIL || SITE_CONTACT_EMAIL).trim();
}

function getFromAddress(): string {
  const from = process.env.EMAIL_FROM?.trim();
  if (from) return from;
  return `XinChao <onboarding@resend.dev>`;
}

async function logSend(
  resend: Resend,
  payload: Parameters<Resend['emails']['send']>[0],
  label: string,
) {
  try {
    const result = await resend.emails.send(payload);
    if (result.error) {
      console.error(`[email] ${label}`, result.error.message, result.error.name);
    }
  } catch (e) {
    console.error(`[email] ${label} exception`, e);
  }
}

/**
 * Sends waitlist confirmation to the subscriber and a notification to the owner.
 * No-op if RESEND_API_KEY is unset. Errors are logged only — never throws.
 */
export async function notifyWaitlistSignup(subscriberEmail: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not set; skip waitlist emails');
    return;
  }

  const resend = new Resend(apiKey);
  const from = getFromAddress();
  const owner = getOwnerInbox();
  const safeEmail = escapeHtml(subscriberEmail);
  const site = escapeHtml(SITE_URL);
  const brand = escapeHtml(SITE_NAME);

  const subscriberHtml = `
    <p>Hi,</p>
    <p>You're on the <strong>${brand}</strong> waitlist. We'll email you when early access opens.</p>
    <p>Registered address: <strong>${safeEmail}</strong></p>
    <p>— The ${brand} team<br />
    <a href="${site}">${site}</a></p>
  `;

  const ownerHtml = `
    <p>New waitlist signup.</p>
    <p><strong>Email:</strong> ${safeEmail}</p>
    <p><strong>Time:</strong> ${escapeHtml(new Date().toISOString())}</p>
    <p><a href="${site}">Open site</a></p>
  `;

  await Promise.all([
    logSend(
      resend,
      {
        from,
        to: subscriberEmail,
        subject: `You're on the ${SITE_NAME} waitlist`,
        html: subscriberHtml,
      },
      'waitlist → subscriber',
    ),
    logSend(
      resend,
      {
        from,
        to: owner,
        subject: `[${SITE_NAME}] New waitlist: ${subscriberEmail}`,
        html: ownerHtml,
      },
      'waitlist → owner',
    ),
  ]);
}

/**
 * Sends contact acknowledgment to the visitor and full copy to the owner.
 */
export async function notifyContactSubmission(params: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not set; skip contact emails');
    return;
  }

  const { name, email, message } = params;
  const resend = new Resend(apiKey);
  const from = getFromAddress();
  const owner = getOwnerInbox();

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');
  const site = escapeHtml(SITE_URL);
  const brand = escapeHtml(SITE_NAME);

  const visitorHtml = `
    <p>Hi ${safeName},</p>
    <p>Thanks for reaching out to <strong>${brand}</strong>. We got your message and will reply when we can.</p>
    <p>— The ${brand} team<br />
    <a href="${site}">${site}</a></p>
  `;

  const ownerHtml = `
    <p><strong>New contact form</strong></p>
    <p><strong>Name:</strong> ${safeName}<br />
    <strong>Email:</strong> ${safeEmail}</p>
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap;border-left:4px solid #1A1A1A;padding-left:12px">${safeMessage}</p>
    <p><a href="${site}">Site</a></p>
  `;

  await Promise.all([
    logSend(
      resend,
      {
        from,
        to: email,
        subject: `We received your message — ${SITE_NAME}`,
        html: visitorHtml,
      },
      'contact → visitor',
    ),
    logSend(
      resend,
      {
        from,
        to: owner,
        subject: `[${SITE_NAME}] Contact from ${name}`,
        html: ownerHtml,
        replyTo: email,
      },
      'contact → owner',
    ),
  ]);
}
