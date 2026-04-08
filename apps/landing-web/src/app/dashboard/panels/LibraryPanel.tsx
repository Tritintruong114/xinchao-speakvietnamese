import { BrutalCard, BrutalHeading, BrutalTag } from '@xinchao/ui-web';

export function LibraryPanel() {
  return (
    <section className="space-y-6" aria-label="Library placeholder">
      <BrutalTag backgroundColor="bg-white" className="border-2 border-text-main">
        Library
      </BrutalTag>
      <BrutalHeading as="h1" className="text-text-main">
        Coming soon
      </BrutalHeading>
      <BrutalCard className="max-w-xl border-2 border-text-main p-8 md:p-10">
        <p className="text-xl font-bold leading-relaxed text-text-main/85">
          Reserved for playbook or survival content—nothing here yet.
        </p>
      </BrutalCard>
    </section>
  );
}
