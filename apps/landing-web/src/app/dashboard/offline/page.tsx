import { Suspense } from 'react';
import { loadSavedPhrases } from '../data';
import { OfflineSectionClient } from './OfflineSectionClient';

function OfflineSectionFallback() {
  return (
    <div
      className="flex min-h-[12rem] items-center justify-center border-2 border-dashed border-text-main/25 bg-brand-cream/30 text-sm font-bold text-text-main/60"
      aria-busy="true"
    >
      Loading offline…
    </div>
  );
}

export default async function OfflineDashboardPage() {
  const result = await loadSavedPhrases();

  return (
    <Suspense fallback={<OfflineSectionFallback />}>
      <OfflineSectionClient dbError={result.error} phrases={result.rows} />
    </Suspense>
  );
}
