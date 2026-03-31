import { SurvivalModule } from './types';

export const money_count: SurvivalModule = {
  id: 'money_count',
  title: 'MONEY COUNT',
  category: 'Survival',
  image: require('../../assets/screens/home/money_count.png'),
  steps: [
    {
      id: 'onboarding',
      type: 'onboarding',
      title: 'MONEY TRAP SURVIVAL',
      goal: 'Avoid the "Blue Note" trap, master the 3-zero rule, and learn to bargain like a local.',
    },
    {
      id: 'visual_trap',
      type: 'quiz',
      title: 'THE BLUE TRAP',
      question: 'Which one is the 500,000 VND note (approx. $20)?',
      images: [
        require('../../assets/currencies/F-20000.png'),
        require('../../assets/currencies/F-500000.png')
      ],
      options: ['The one on the Left', 'The one on the Right'],
      correctIndex: 1,
      fact: 'Both 20K and 500K are blue! They look identical when you are in a rush. Always count the zeros (4 vs 5).',
    },
    {
      id: 'counting_hack',
      type: 'teaching',
      title: 'THE "DROP 3 ZEROS" RULE',
      content: 'Vietnamese numbers are huge. To stay sane:\n1. Drop the last 3 zeros (500,<s>000</s> → 500).\n2. Divide by 25 to get USD (500 ÷ 25 = $20).',
      visualHighlight: '500,<s>000</s> / 25 = $20',
    },
    {
      id: 'slang_ruoi',
      type: 'voice_practice',
      title: 'STREET SLANG: "RƯỠI"',
      description: 'Locals never say "phẩy năm" (.5). They say "rưỡi" (and a half).',
      targetPhrase: 'Hai triệu rưỡi',
      targetTranslation: '2.5 Million',
      audioUri: 'slang_ruoi.mp3',
      successFeedback: 'Perfect! Use "rưỡi" to sound like a pro when talking about millions or hours.',
    },
    {
      id: 'roleplay_coffee',
      type: 'roleplay',
      title: 'COFFEE SHOP SURVIVAL',
      dialogues: [
        {
          id: 'd1',
          speaker: 'user',
          text: 'Một cà phê sữa đá bao nhiêu tiền?',
          audioUri: 'user_ask_price.mp3',
        },
        {
          id: 'd2',
          speaker: 'seller',
          text: 'Dạ, hai mươi lăm ngàn.',
          audioUri: 'seller_25k.mp3',
        },
        {
          id: 'd3',
          speaker: 'user',
          text: 'Đây là năm mươi ngàn. Gửi chị.',
          audioUri: 'user_give_50k.mp3',
        },
        {
          id: 'd4',
          speaker: 'seller',
          text: 'Của em là hai mươi lăm ngàn tiền thối. Cảm ơn!',
          audioUri: 'seller_change.mp3',
        },
      ],
    },
    {
      id: 'reward',
      type: 'reward',
      title: 'MONEY MASTERED',
      reward: { xp: 50, badge: 'MONEY_PRO' },
    },
  ],
};
