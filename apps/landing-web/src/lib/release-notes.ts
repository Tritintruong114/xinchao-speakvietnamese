import { unstable_noStore as noStore } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

const RELEASE_NOTES_DIR = path.join(process.cwd(), 'content', 'release-notes');

function isSafeVersionSlug(slug: string): boolean {
  return /^[a-zA-Z0-9._-]+$/.test(slug);
}

export async function listReleaseNoteVersions(): Promise<string[]> {
  const entries = await fs.readdir(RELEASE_NOTES_DIR);
  return entries
    .filter((f) => f.endsWith('.md'))
    .map((f) => path.basename(f, '.md'))
    .sort();
}

export async function getReleaseNoteMarkdown(version: string): Promise<string | null> {
  noStore();
  if (!isSafeVersionSlug(version)) return null;
  const filePath = path.join(RELEASE_NOTES_DIR, `${version}.md`);
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch {
    return null;
  }
}
