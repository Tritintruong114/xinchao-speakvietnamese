import { BrutalCard, BrutalHeading, BrutalTag } from '@xinchao/ui-web';
import type { ContactRow } from '../types';

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

export function ContactPanel({ contacts }: { contacts: ContactRow[] }) {
  return (
    <section className="space-y-6" aria-label="Contact messages">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <BrutalTag backgroundColor="bg-brand-yellow" className="mb-2" rotate="-rotate-1">
            Contact
          </BrutalTag>
          <BrutalHeading as="h1" className="text-text-main">
            Messages
          </BrutalHeading>
        </div>
        <p className="text-xl font-bold text-text-main/80">{contacts.length} threads</p>
      </div>

      <div className="space-y-4">
        {contacts.length === 0 ? (
          <BrutalCard className="border-2 border-text-main p-8 text-center font-bold text-text-main/60">
            No messages yet.
          </BrutalCard>
        ) : (
          contacts.map((row) => (
            <BrutalCard key={row.id} className="border-2 border-text-main p-5 md:p-6" backgroundColor="bg-white">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-text-main/10 pb-3">
                <p className="text-lg font-black text-text-main">{row.name}</p>
                <p className="font-semibold text-text-main/70">{row.email}</p>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-base font-medium leading-relaxed text-text-main/90">
                {row.message}
              </p>
              <p className="mt-4 text-sm font-bold text-text-main/50">
                {formatWhen(row.created_at)}
                {row.source ? ` · ${row.source}` : ''}
              </p>
            </BrutalCard>
          ))
        )}
      </div>
    </section>
  );
}
