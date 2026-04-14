import { Suspense } from 'react';

import { loadSurvivalModuleCategories } from '../data';
import { CategoriesSectionClient } from './CategoriesSectionClient';

function CategoriesFallback() {
  return (
    <div
      className="flex min-h-[12rem] items-center justify-center border-2 border-dashed border-text-main/25 bg-brand-cream/30 text-sm font-bold text-text-main/60"
      aria-busy="true"
    >
      Loading categories…
    </div>
  );
}

export default async function CategoriesPage() {
  const result = await loadSurvivalModuleCategories();

  return (
    <Suspense fallback={<CategoriesFallback />}>
      <CategoriesSectionClient dbError={result.error} initialCategories={result.rows} />
    </Suspense>
  );
}
