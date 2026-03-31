import { SurvivalModule } from './types';

export const ride_hailing: SurvivalModule = {
  id: 'ride_hailing',
  title: 'CALL A TAXI',
  category: 'Survival',
  image: require('../../assets/screens/home/ride_hailing.png'),
  steps: [
    {
      id: 'onboarding',
      type: 'onboarding',
      title: 'GRAB & GO',
      goal: 'Understand what drivers are asking on the phone and how to command your destination.',
    },
  ],
};

export const directions: SurvivalModule = {
  id: 'directions',
  title: 'ASK DIRECTIONS',
  category: 'Survival',
  image: require('../../assets/screens/home/directions.png'),
  steps: [
    {
      id: 'onboarding',
      type: 'onboarding',
      title: 'FIND YOUR WAY',
      goal: 'Navigation by landmarks. Stop getting lost in the hem (alleys).',
    },
  ],
};

export const restaurant_coffee: SurvivalModule = {
  id: 'restaurant_coffee',
  title: 'EAT & DRINK',
  category: 'Survival',
  image: require('../../assets/screens/home/restaurant_coffee.png'),
  steps: [
    {
      id: 'onboarding',
      type: 'onboarding',
      title: 'PHỞ & CÀ PHÊ',
      goal: 'Order your Phở without cilantro and your coffee exactly how you like it.',
    },
  ],
};
