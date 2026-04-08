import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';

const PATHS = [
  { path: '/', priority: 1, changeFrequency: 'weekly' as const },
  { path: '/about', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/survival', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/pricing', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/contact', priority: 0.85, changeFrequency: 'monthly' as const },
  { path: '/team-member', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/privacy', priority: 0.4, changeFrequency: 'yearly' as const },
  { path: '/terms', priority: 0.4, changeFrequency: 'yearly' as const },
  { path: '/cookie-policy', priority: 0.3, changeFrequency: 'yearly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PATHS.map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
