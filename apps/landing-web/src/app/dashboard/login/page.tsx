import { BrutalButton, BrutalCard, BrutalHeading } from '@xinchao/ui-web';
import Link from 'next/link';
import { loginAction } from './actions';

type Search = { next?: string; reason?: string };

export default async function DashboardLoginPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const next = sp.next && sp.next.startsWith('/dashboard') ? sp.next : '/dashboard';

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-cream p-6">
      <div className="w-full max-w-md space-y-4">
        <BrutalHeading as="h1" className="text-center text-text-main">
          Dashboard
        </BrutalHeading>
        {sp.reason === 'invalid' ? (
          <p className="text-center text-sm font-bold text-brand-primary">Invalid email or password.</p>
        ) : null}
        {sp.reason === 'misconfigured' ? (
          <p className="text-center text-sm font-bold text-brand-primary">
            Set <code className="font-mono text-xs">DASHBOARD_SESSION_SECRET</code> in production.
          </p>
        ) : null}
        <BrutalCard className="border-2 border-text-main p-6 md:p-8">
          <form action={loginAction} className="space-y-4">
            <input type="hidden" name="next" value={next === '/dashboard/login' ? '/dashboard' : next} />
            <label className="block space-y-1">
              <span className="text-xs font-black uppercase text-text-main/70">Email</span>
              <input
                name="email"
                type="email"
                autoComplete="username"
                required
                className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-black uppercase text-text-main/70">Password</span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
              />
            </label>
            <BrutalButton type="submit" className="w-full justify-center">
              Sign in
            </BrutalButton>
          </form>
        </BrutalCard>
        <p className="text-center text-sm font-semibold text-text-main/60">
          <Link href="/" className="underline decoration-2 underline-offset-4">
            Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
