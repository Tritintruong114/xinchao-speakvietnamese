'use client';

import { BrutalButton, BrutalCard } from '@xinchao/ui-web';
import { Send } from 'lucide-react';
import React, { useState, type FormEvent } from 'react';
import { FormResultBanner } from '@/components/common/FormResultBanner';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  function resetContact() {
    setStatus('idle');
    setMessage('');
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get('name') ?? '').trim();
    const email = String(fd.get('email') ?? '').trim();
    const body = String(fd.get('message') ?? '').trim();

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message: body }),
      });
      const data = (await res.json()) as { error?: string; mailto?: string; mode?: string };

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error ?? 'Could not send. Try again.');
        return;
      }

      if (data.mailto) {
        window.location.href = data.mailto;
        setStatus('success');
        setMessage('Opening your email app with your message…');
        return;
      }

      setStatus('success');
      if (data.mode === 'database' || data.mode === 'webhook') {
        setMessage(
          'We saved your message. The team usually replies within a couple of days — check the email you used above.',
        );
      } else {
        setMessage('Thanks — we got your message and will reply soon.');
      }
      form.reset();
    } catch {
      setStatus('error');
      setMessage('Network error. Try again in a moment.');
    }
  }

  if (status === 'success') {
    return (
      <FormResultBanner
        variant="success"
        title="Message sent!"
        actionLabel="Send another message"
        onAction={resetContact}
        className="max-w-none"
      >
        {message}
      </FormResultBanner>
    );
  }

  return (
    <BrutalCard className="p-10 space-y-8 bg-white border-4 border-text-main brutal-shadow-lg">
      <h3 className="text-3xl font-black italic">Drop a Message</h3>

      {status === 'error' && message ? (
        <FormResultBanner variant="error" title="Could not send">
          {message}
        </FormResultBanner>
      ) : null}

      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label htmlFor="contact-name" className="font-black uppercase text-sm">
            Your Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            maxLength={200}
            placeholder="John Doe"
            disabled={status === 'loading'}
            className="w-full p-4 border-2 border-text-main rounded-lg focus:outline-none focus:ring-4 focus:ring-brand-yellow transition-all font-bold disabled:opacity-60"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="contact-email" className="font-black uppercase text-sm">
            Email Address
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="john@example.com"
            disabled={status === 'loading'}
            className="w-full p-4 border-2 border-text-main rounded-lg focus:outline-none focus:ring-4 focus:ring-brand-yellow transition-all font-bold disabled:opacity-60"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="contact-message" className="font-black uppercase text-sm">
            Survival Issue
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            required
            maxLength={8000}
            placeholder="I can't translate this Bún Riêu menu…"
            disabled={status === 'loading'}
            className="w-full p-4 border-2 border-text-main rounded-lg focus:outline-none focus:ring-4 focus:ring-brand-yellow transition-all font-bold disabled:opacity-60"
          />
        </div>
        <BrutalButton type="submit" className="w-full py-5 text-2xl" disabled={status === 'loading'}>
          SEND MESSAGE <Send size={20} />
        </BrutalButton>
      </form>
    </BrutalCard>
  );
}
