'use client';

import type { SurvivalModuleInput } from '@xinchao/shared';
import { ttsCoverage } from '@/lib/ai/survivalTtsCore';
import { validatePhaAModuleBody } from '@/lib/validation/survivalModuleDraft';

export function ModuleDraftHitlChecklist({ model }: { model: SurvivalModuleInput }) {
  const schema = validatePhaAModuleBody(model);
  const cov = ttsCoverage(model);

  return (
    <div className="border-2 border-dashed border-text-main/30 bg-brand-cream/40 px-4 py-3 text-sm">
      <p className="mb-2 text-xs font-black uppercase text-text-main/70">Review checklist (Pha A)</p>
      <ul className="space-y-1.5 font-semibold text-text-main">
        <li className="flex flex-wrap gap-2">
          <span>{schema.ok ? '✓' : '✗'}</span>
          <span>Module matches Pha A schema (teaching / micro-learning / voice_practice / quiz)</span>
        </li>
        <li className="flex flex-wrap gap-2">
          <span>
            {cov.total === 0 ? '—' : cov.filled === cov.total ? '✓' : '○'}
          </span>
          <span>
            {cov.total === 0
              ? 'No TTS targets yet (add teaching content, vocabulary, voice line, or quiz question)'
              : `Audio coverage: ${cov.filled} / ${cov.total} TTS slots`}
          </span>
        </li>
      </ul>
      {schema.ok === false ? (
        <p className="mt-2 text-xs font-bold text-brand-primary">{schema.error}</p>
      ) : null}
      <p className="mt-3 text-xs font-semibold leading-relaxed text-text-main/65">
        Human review: confirm Vietnamese tone, English glosses, and that each clip matches the on-screen text before you
        save.
      </p>
    </div>
  );
}
