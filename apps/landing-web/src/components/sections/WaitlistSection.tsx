'use client';

import { BrutalHeading, BrutalTag, cn } from '@xinchao/ui-web';
import React, { useState, type FormEvent } from 'react';
import { FormResultBanner } from '../common/FormResultBanner';
import { BrutalSection } from '../layout/BrutalSection';
import { BrutalContainer } from '../layout/BrutalContainer';

export const WaitlistSection: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  function resetWaitlist() {
    setStatus('idle');
    setMessage('');
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    const form = e.currentTarget;
    const email = String(new FormData(form).get('email') ?? '').trim();

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as {
        error?: string;
        mailto?: string;
        mode?: string;
      };

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error ?? 'Something went wrong.');
        return;
      }

      if (data.mailto) {
        window.location.href = data.mailto;
        setStatus('success');
        setMessage('Opening your email app to complete signup…');
        return;
      }

      setStatus('success');
      if (data.mode === 'database' || data.mode === 'webhook') {
        setMessage(
          "You're officially on the waitlist. Watch your inbox for early access and launch updates.",
        );
      } else {
        setMessage("You're on the list. We'll email you when your spot is ready.");
      }
      form.reset();
    } catch {
      setStatus('error');
      setMessage('Network error. Try again in a moment.');
    }
  }

  return (
    <BrutalSection id="waitlist" backgroundColor="bg-brand-pink" padding="lg">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow rounded-full border-4 border-text-main brutal-shadow-lg -translate-y-1/2 translate-x-1/2 animate-pulse opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-mint rounded-full border-4 border-text-main brutal-shadow-lg translate-y-1/2 -translate-x-1/2 animate-pulse opacity-50" />

      <BrutalContainer className="relative z-10 text-center space-y-12">
        <div className="space-y-6 max-w-4xl mx-auto">
          <BrutalTag className="bg-brand-red text-white">EARLY BIRD SURVIVAL PACK</BrutalTag>
          <BrutalHeading as="h2" className="text-5xl md:text-8xl uppercase tracking-tighter text-text-main">
            GET{' '}
            <span className="text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">1 MONTH</span> PRO FREE!
          </BrutalHeading>
          <p className="text-2xl font-black md:text-3xl max-w-2xl mx-auto leading-tight italic">
            Join the waitlist and unlock survival features for 30 days when we launch in your region.
          </p>
        </div>

        {status === 'error' && message ? (
          <FormResultBanner variant="error" title="Could not sign up" align="center">
            {message}
          </FormResultBanner>
        ) : null}

        {status === 'success' ? (
          <FormResultBanner
            variant="success"
            title="You're in!"
            actionLabel="Use another email"
            onAction={resetWaitlist}
            align="center"
          >
            {message}
          </FormResultBanner>
        ) : (
          <form
            onSubmit={onSubmit}
            className="max-w-2xl mx-auto flex flex-col sm:flex-row items-stretch gap-0 border-4 border-text-main rounded-2xl overflow-hidden brutal-shadow-lg bg-white"
          >
            <label htmlFor="waitlist-email" className="sr-only">
              Email for waitlist
            </label>
            <input
              id="waitlist-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="your-email@example.com"
              disabled={status === 'loading'}
              className="flex-1 px-8 py-6 text-xl font-bold bg-transparent focus:outline-none focus:bg-brand-cream transition-colors placeholder:text-text-muted disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className={cn(
                'px-10 py-6 text-xl font-black uppercase tracking-widest text-white transition-all bg-brand-red border-t-4 sm:border-t-0 sm:border-l-4 border-text-main',
                'hover:bg-text-main hover:text-brand-red active:translate-y-1 disabled:opacity-60 disabled:pointer-events-none',
              )}
            >
              {status === 'loading' ? '…' : 'GET PRO ACCESS'}
            </button>
          </form>
        )}

        {status !== 'success' ? (
          <p className="font-bold text-lg opacity-80">Limited early access — join while spots last.</p>
        ) : null}
      </BrutalContainer>
    </BrutalSection>
  );
};
