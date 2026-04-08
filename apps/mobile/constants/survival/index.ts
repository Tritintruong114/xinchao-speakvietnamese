import { SurvivalModule } from '@xinchao/shared';
import { money_count } from './money_count';
import { greetings } from './greetings';
import { counting_numbers } from './counting_numbers';
import { bargaining } from './bargaining';
import { ride_hailing, directions, restaurant_coffee } from './transport_eat';
import {
  metro,
  sleeper_bus,
  train,
  airplane,
  nhau_culture,
  genz_slang,
  expat_life,
} from './other_modules';

export const SURVIVAL_MODULES: Record<string, SurvivalModule> = {
  money_count,
  greetings,
  counting_numbers,
  ride_hailing,
  directions,
  restaurant_coffee,
  bargaining,
  metro,
  sleeper_bus,
  train,
  airplane,
  nhau_culture,
  genz_slang,
  expat_life,
};

export * from '@xinchao/shared';
