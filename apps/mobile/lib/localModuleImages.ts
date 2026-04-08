import type { ImageSourcePropType } from 'react-native';

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

const FALLBACK_COVER: ImageSourcePropType = require('../assets/screens/home/directions.png');

export function resolveSurvivalCoverImage(module: {
  id: string;
  image_url?: string | null;
  image?: ImageSourcePropType;
}): ImageSourcePropType {
  if (module.image_url?.trim()) {
    return { uri: module.image_url.trim() };
  }
  if (module.image != null) {
    return module.image as ImageSourcePropType;
  }
  return LOCAL_SURVIVAL_COVER_IMAGES[module.id] ?? FALLBACK_COVER;
}
