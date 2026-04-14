import type { SurvivalModule } from '@xinchao/shared';
import { Image, type ImageSourcePropType } from 'react-native';

/**
 * Bundled cover art for known module ids when `image_url` from Supabase is absent.
 * Extend this map when adding static modules in `constants/survival`.
 */
export const LOCAL_SURVIVAL_COVER_IMAGES: Record<string, ImageSourcePropType> = {
  money_count: require('../assets/screens/home/money_count.png'),
  greetings: require('../assets/screens/home/greetings.png'),
  counting_numbers: require('../assets/screens/home/counting_numbers.png'),
  directions: require('../assets/screens/home/directions.png'),
  bargaining: require('../assets/screens/home/bargaining.png'),
  ride_hailing: require('../assets/screens/home/ride_hailing.png'),
  restaurant_coffee: require('../assets/screens/home/restaurant_coffee.png'),
  metro: require('../assets/screens/home/metro.png'),
  sleeper_bus: require('../assets/screens/home/sleeper_bus.png'),
  train: require('../assets/screens/home/train.png'),
  airplane: require('../assets/screens/home/airplane.png'),
  nhau_culture: require('../assets/screens/home/nhau_culture.png'),
  genz_slang: require('../assets/screens/home/genz_slang.png'),
  expat_life: require('../assets/screens/home/expat_life.png'),
};

/** Last-resort asset when remote `image_url` fails at runtime (see SurvivalTeaching `onError`). */
export const SURVIVAL_IMAGE_FALLBACK: ImageSourcePropType = require('../assets/screens/home/directions.png');

function cacheBustRemoteCover(url: string, updatedAt?: string | null): string {
  const base = url.trim();
  const v = updatedAt?.trim();
  if (!v) return base;
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}v=${encodeURIComponent(v)}`;
}

export function resolveSurvivalCoverImage(module: {
  id: string;
  image_url?: string | null;
  image?: ImageSourcePropType;
  /** Bust RN image cache when the row (or cover URL) changes in Supabase. */
  updated_at?: string | null;
}): ImageSourcePropType {
  if (module.image_url?.trim()) {
    return { uri: cacheBustRemoteCover(module.image_url, module.updated_at) };
  }
  if (module.image != null) {
    return module.image as ImageSourcePropType;
  }
  return LOCAL_SURVIVAL_COVER_IMAGES[module.id] ?? SURVIVAL_IMAGE_FALLBACK;
}

/**
 * Teaching-step hero: prefer the step's own `image_url` when set; otherwise same as Home
 * (`resolveSurvivalCoverImage`). Broken remote URLs still fall back via `SurvivalTeaching` `onError`.
 */
export function resolveSurvivalTeachingImage(
  module: {
    id: string;
    image_url?: string | null;
    image?: ImageSourcePropType;
    updated_at?: string | null;
  },
  step?: { image_url?: string | null; image?: ImageSourcePropType },
): ImageSourcePropType {
  const stepUrl = step?.image_url?.trim();
  if (stepUrl) {
    return { uri: cacheBustRemoteCover(stepUrl, module.updated_at) };
  }
  if (step?.image != null) {
    return step.image as ImageSourcePropType;
  }
  return resolveSurvivalCoverImage(module);
}

/**
 * Remote HTTPS URIs for one module (cover + every step `image_url`), deduped.
 * Must match `resolveSurvivalCoverImage` / `resolveSurvivalTeachingImage` cache-bust rules
 * so `Image.prefetch` hits the same cache keys as `<Image>` / expo-image.
 */
export function collectSurvivalModuleRemoteImageUris(module: SurvivalModule): string[] {
  const seen = new Set<string>();
  if (module.image_url?.trim()) {
    seen.add(cacheBustRemoteCover(module.image_url.trim(), module.updated_at));
  }
  for (const step of module.steps ?? []) {
    if (step.image_url?.trim()) {
      seen.add(cacheBustRemoteCover(step.image_url.trim(), module.updated_at));
    }
  }
  return [...seen];
}

/**
 * HTTPS URIs for many modules (home prefetch + library).
 */
export function collectSurvivalRemoteImageUris(modules: SurvivalModule[]): string[] {
  const seen = new Set<string>();
  for (const m of modules) {
    for (const uri of collectSurvivalModuleRemoteImageUris(m)) {
      seen.add(uri);
    }
  }
  return [...seen];
}

function prefetchRemoteImageUris(uris: string[]): Promise<void> {
  if (uris.length === 0) return Promise.resolve();
  return Promise.allSettled(uris.map((uri) => Image.prefetch(uri))).then(() => undefined);
}

/**
 * Warm RN's image disk cache for remote survival art (home grid + step heroes) so opening
 * a module reuses bytes already fetched on the first screen.
 */
export function prefetchSurvivalModuleRemoteImages(modules: SurvivalModule[]): Promise<void> {
  return prefetchRemoteImageUris(collectSurvivalRemoteImageUris(modules));
}

/**
 * When entering a single module, prefetch cover + all step images immediately so teaching
 * steps do not wait for network on each swipe.
 */
export function prefetchSurvivalModuleOpenImages(module: SurvivalModule): Promise<void> {
  return prefetchRemoteImageUris(collectSurvivalModuleRemoteImageUris(module));
}
