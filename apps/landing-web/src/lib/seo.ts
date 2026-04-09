import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from './site';

/** Default description when a page omits its own. */
export const SITE_DESCRIPTION_DEFAULT =
  "The Traveler's Lifebuoy. Survive the street food, negotiate like a local, and connect in Vietnam—street-tested, pocket-ready.";

export const SITE_DEFAULT_KEYWORDS = [
  'Vietnamese for travelers',
  'Vietnamese phrasebook',
  'Learn Vietnamese',
  'Vietnam travel app',
  'survival Vietnamese',
  'Vietnamese for travel',
  'street Vietnamese',
  'Vietnamese expats',
  'menu translation Vietnam',
  'XinChao',
];

export function absoluteUrl(path: string): string {
  const base = SITE_URL.replace(/\/$/, '');
  if (!path || path === '/') {
    return base;
  }
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

type BuildPageMetadataInput = {
  title: string;
  description?: string;
  path: string;
  keywords?: string[];
};

export function buildPageMetadata({
  title,
  description = SITE_DESCRIPTION_DEFAULT,
  path,
  keywords = [],
}: BuildPageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = `${title} · ${SITE_NAME}`;
  const mergedKeywords = [...new Set([...SITE_DEFAULT_KEYWORDS, ...keywords])];

  return {
    title,
    description,
    keywords: mergedKeywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      type: 'website',
      locale: 'en_US',
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
  };
}
