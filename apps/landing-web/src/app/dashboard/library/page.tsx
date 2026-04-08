import { Suspense } from 'react';
import { loadSurvivalModules } from '../data';
import { LibrarySectionClient } from './LibrarySectionClient';

function LibrarySectionFallback() {
  return (
    <div
      className="flex min-h-[12rem] items-center justify-center border-2 border-dashed border-text-main/25 bg-brand-cream/30 text-sm font-bold text-text-main/60"
      aria-busy="true"
    >
      Loading library…
    </div>
  );
}

export default async function LibraryPage() {
  const result = await loadSurvivalModules();

  return (
    <Suspense fallback={<LibrarySectionFallback />}>
      <LibrarySectionClient dbError={result.error} modules={result.rows} />
    </Suspense>
  );
}
