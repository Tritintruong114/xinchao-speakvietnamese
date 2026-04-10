import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MarkdownDoc } from '@/components/docs/MarkdownDoc';
import { getReleaseNoteMarkdown, listReleaseNoteVersions } from '@/lib/release-notes';

type PageProps = {
  params: Promise<{ version: string }>;
};

/** Always resolve markdown at request time so /v1.1.0 never serves a stale or wrong bundle. */
export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const versions = await listReleaseNoteVersions();
  return versions.map((version) => ({ version }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { version } = await params;
  return {
    title: `Release notes · ${version}`,
    description: `XinChao ${version} release notes.`,
  };
}

export default async function ReleaseNoteVersionPage({ params }: PageProps) {
  const { version } = await params;
  const decoded = decodeURIComponent(version);
  const markdown = await getReleaseNoteMarkdown(decoded);

  if (markdown === null) {
    notFound();
  }

  return (
    <article className="space-y-8">
      <div>
        <Link
          href="/release-notes"
          className="text-sm font-medium text-brand-red underline-offset-4 hover:underline"
        >
          ← All release notes
        </Link>
      </div>
      <MarkdownDoc key={decoded} source={markdown} />
    </article>
  );
}
