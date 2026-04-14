import { Suspense } from 'react';
import { loadSurvivalModuleCategories, loadSurvivalModules, sortSurvivalModulesForLibrary } from '../data';
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
  const [modulesResult, categoriesResult] = await Promise.all([
    loadSurvivalModules(),
    loadSurvivalModuleCategories(),
  ]);

  const dbError = modulesResult.error ?? categoriesResult.error;
  const categoryNames = categoriesResult.rows.map((c) => c.name);
  const categoryOptions =
    categoryNames.length > 0 ? categoryNames : ['Beginner', 'Survival', 'Legend'];
  const sortedModules = sortSurvivalModulesForLibrary(modulesResult.rows, categoriesResult.rows);

  return (
    <Suspense fallback={<LibrarySectionFallback />}>
      <LibrarySectionClient
        dbError={dbError}
        modules={sortedModules}
        categoryOptions={categoryOptions}
      />
    </Suspense>
  );
}
