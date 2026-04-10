import type { Metadata } from 'next';
import Link from 'next/link';
import { listReleaseNoteVersions } from '@/lib/release-notes';

export const metadata: Metadata = {
  title: 'Release notes',
  description: 'XinChao app release notes and changelog.',
};

export default async function ReleaseNotesIndexPage() {
  const versions = await listReleaseNoteVersions();

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">Release notes</h1>
        <p className="max-w-2xl text-neutral-600">
          What is new in each version—written for travelers and learners using XinChao in English.
        </p>
      </header>
      <ul className="space-y-2 border-t border-black/10 pt-6">
        {versions.length === 0 ? (
          <li className="text-neutral-500">No release notes yet.</li>
        ) : (
          versions.map((v) => (
            <li key={v}>
              <Link
                href={`/release-notes/${encodeURIComponent(v)}`}
                className="text-brand-red font-semibold underline-offset-4 hover:underline"
              >
                {v}
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
