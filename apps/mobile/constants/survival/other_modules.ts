import { SurvivalModule } from './types';

export const metro: SurvivalModule = {
  id: 'metro',
  title: 'URBAN METRO',
  category: 'Survival',
  image: require('../../assets/screens/home/metro.png'),
  steps: [],
};

export const sleeper_bus: SurvivalModule = {
  id: 'sleeper_bus',
  title: 'THE SLEEPER BUS',
  category: 'Survival',
  image: require('../../assets/screens/home/sleeper_bus.png'),
  steps: [],
};

export const train: SurvivalModule = {
  id: 'train',
  title: 'REUNIFICATION EXPRESS',
  category: 'Survival',
  image: require('../../assets/screens/home/train.png'),
  steps: [],
};

export const airplane: SurvivalModule = {
  id: 'airplane',
  title: 'AIRPORT & FLYING',
  category: 'Survival',
  image: require('../../assets/screens/home/airplane.png'),
  steps: [],
};

export const nhau_culture: SurvivalModule = {
  id: 'nhau_culture',
  title: 'NHẬU CULTURE',
  category: 'Survival',
  image: require('../../assets/screens/home/nhau_culture.png'),
  steps: [
    {
      id: 'onboarding',
      type: 'onboarding',
      title: 'MOT, HAI, BA, YO!',
      goal: 'The art of the Vietnamese beer table. Rules of engagement for a night out.',
    },
  ],
};

export const genz_slang: SurvivalModule = {
  id: 'genz_slang',
  title: 'GEN Z SLANG',
  category: 'Legend',
  image: require('../../assets/screens/home/genz_slang.png'),
  steps: [
    {
      id: 'onboarding',
      type: 'onboarding',
      title: 'BE A COOL KID',
      goal: 'Decode the secret language of Vietnamese youth. From texting to flirting.',
    },
  ],
};

export const expat_life: SurvivalModule = {
  id: 'expat_life',
  title: 'EXPAT LIFE',
  category: 'Legend',
  image: require('../../assets/screens/home/expat_life.png'),
  steps: [
    {
      id: 'onboarding',
      type: 'onboarding',
      title: 'LONG-TERM SURVIVAL',
      goal: 'Crucial medical and legal phrases for living in Vietnam.',
    },
  ],
};
