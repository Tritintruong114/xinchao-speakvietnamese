import { SurvivalModule } from './types';

export const greetings: SurvivalModule = {
  id: 'greetings',
  title: 'GREETINGS',
  category: 'Beginner',
  image: require('../../assets/screens/home/greetings.png'),
  steps: [
    {
      id: 'onboarding',
      type: 'onboarding',
      title: 'SURVIVAL GREETINGS',
      goal: 'Master the 4 pillars of survival communication and the "Pronoun Hack" to greet anyone like a local.',
    },
    {
      id: 'essentials',
      type: 'micro-learning',
      title: 'THE BIG FOUR',
      description: 'These 4 words will get you through 90% of your daily interactions.',
      vocabulary: [
        { phrase: 'Xin chào', translation: 'Hello (Formal)', audioUri: 'xin_chao' },
        { phrase: 'Cảm ơn', translation: 'Thank you', audioUri: require('../../assets/audio/greetings/camon.mp3') },
        { phrase: 'Xin lỗi', translation: 'Sorry / Excuse me', audioUri: 'xin_loi' },
        { phrase: 'Tạm biệt', translation: 'Goodbye', audioUri: 'tam_biet' },
      ],
    },
    {
      id: 'pronoun_hack',
      type: 'teaching',
      title: 'THE PRONOUN HACK',
      content: 'Forget 50 complex kinship terms. Use "Chào" + one of these three to cover 80% of people:\n1. Anh (Man, slightly older)\n2. Chị (Woman, slightly older)\n3. Em (Anyone younger)',
      visualHighlight: 'Chào + <b>Anh/Chị/Em</b>',
    },
    {
      id: 'practice_pronoun',
      type: 'voice_practice',
      title: 'GREET THE DRIVER',
      description: 'You just opened the car door. Say hello to the male driver:',
      targetPhrase: 'CHÀO ANH',
      targetTranslation: 'Hello (to an older male)',
      successFeedback: 'Perfect! You are already more polite than most tourists.',
    },
    {
      id: 'roleplay_grab',
      type: 'roleplay',
      title: 'THE GRAB ARRIVAL',
      dialogues: [
        {
          id: 'd1',
          speaker: 'mascot',
          text: 'Your Grab driver is here! He looks older than you.',
          nextId: 'd2',
        },
        {
          id: 'd2',
          speaker: 'user',
          text: 'Chào anh!',
          audioUri: 'chao_anh',
          nextId: 'd3',
        },
        {
          id: 'd3',
          speaker: 'seller',
          text: 'Chào em! Đi đến Quận 1 hả?',
          tip: "He's asking if you're going to District 1.",
          nextId: 'd4',
        },
        {
          id: 'd4',
          speaker: 'user',
          text: 'Dạ, đúng rồi. Cảm ơn anh!',
          audioUri: 'da_dung_roi_cam_on_anh',
          tip: "Add 'Dạ' at the start to sound extra polite.",
          nextId: 'end',
        },
      ],
    },
    {
      id: 'reward',
      type: 'reward',
      title: 'SURVIVAL GRADUATE',
      reward: { xp: 100, badge: 'POLITE_TRAVELER' },
    },
  ],
};
