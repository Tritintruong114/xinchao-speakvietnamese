import { BrutalCard, BrutalHeading, BrutalTag } from '@xinchao/ui-web';
import type { WaitlistRow } from '../types';

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

export function WaitlistPanel({ waitlist }: { waitlist: WaitlistRow[] }) {
  return (
    <section className="space-y-6" aria-label="Waitlist signups">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <BrutalTag backgroundColor="bg-brand-mint" className="mb-2" rotate="rotate-1">
            Waitlist
          </BrutalTag>
          <BrutalHeading as="h1" className="text-text-main">
            Signups
          </BrutalHeading>
        </div>
        <p className="text-xl font-bold text-text-main/80">{waitlist.length} emails</p>
      </div>

      <BrutalCard className="overflow-hidden border-2 border-text-main p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead>
              <tr className="border-b-2 border-text-main bg-brand-cream">
                <th className="px-4 py-3 font-black uppercase tracking-wide">Email</th>
                <th className="px-4 py-3 font-black uppercase tracking-wide">Source</th>
                <th className="px-4 py-3 font-black uppercase tracking-wide">Joined</th>
              </tr>
            </thead>
            <tbody>
              {waitlist.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center font-bold text-text-main/60">
                    No signups yet.
                  </td>
                </tr>
              ) : (
                waitlist.map((row) => (
                  <tr key={row.id} className="border-b border-text-main/15 odd:bg-white even:bg-brand-cream/40">
                    <td className="px-4 py-3 font-semibold">{row.email}</td>
                    <td className="px-4 py-3 text-text-main/80">{row.source ?? '—'}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-text-main/80">
                      {formatWhen(row.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </BrutalCard>
    </section>
  );
}
