import { BrutalCard } from '@xinchao/ui-web';

function secondaryHint(message: string) {
  const m = message.toLowerCase();
  if (m.includes('not configured') || m.includes('database is not configured')) {
    return (
      <>
        Set <code className="rounded bg-black/20 px-1">SUPABASE_URL</code> and{' '}
        <code className="rounded bg-black/20 px-1">SUPABASE_SERVICE_ROLE_KEY</code> in{' '}
        <code className="rounded bg-black/20 px-1">apps/landing-web/.env.local</code> (these are server-only — not the same
        as <code className="rounded bg-black/20 px-1">EXPO_PUBLIC_*</code> for mobile). Restart{' '}
        <code className="rounded bg-black/20 px-1">pnpm dev</code> after editing.
      </>
    );
  }
  if (m.includes('could not load categories')) {
    return (
      <>
        Env may already be fine — this often means the{' '}
        <code className="rounded bg-black/20 px-1">survival_module_categories</code> table does not exist yet. Apply{' '}
        <code className="rounded bg-black/20 px-1">supabase/migrations/20260415120000_survival_module_categories.sql</code>{' '}
        in the Supabase SQL Editor, or run <code className="rounded bg-black/20 px-1">supabase db push</code>.
      </>
    );
  }
  return (
    <>
      If you recently pulled code, apply new files under <code className="rounded bg-black/20 px-1">supabase/migrations/</code>.
      Check the terminal where Next.js runs for the underlying PostgREST error.
    </>
  );
}

export function DbErrorBanner({ message }: { message: string }) {
  return (
    <BrutalCard backgroundColor="bg-brand-red" className="mb-8 border-2 border-text-main p-6 text-white">
      <p className="text-lg font-bold">{message}</p>
      <p className="mt-2 text-sm font-semibold leading-relaxed opacity-95">{secondaryHint(message)}</p>
    </BrutalCard>
  );
}
