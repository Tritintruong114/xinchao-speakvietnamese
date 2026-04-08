import { SurvivalModule } from './types';

export const counting_numbers: SurvivalModule = {
  id: 'counting_numbers',
  title: 'COUNTING NUMBERS',
  category: 'Beginner',
  image: require('../../assets/screens/home/counting_numbers.png'),
  steps: [
    {
      id: 'onboarding',
      type: 'onboarding',
      title: 'MISSION: STREET MATH',
      goal: 'Master numbers 1-100 to handle prices, quantities, and phone numbers like a local without breaking a sweat.',
      mascotExpression: 'excited',
    },
    {
      id: 'basic_numbers',
      type: 'micro-learning',
      title: 'THE CORE 10',
      description: 'The foundation of everything. Learn 0 to 10 first.',
      vocabulary: [
        { phrase: 'Không', translation: 'Zero', audioUri: require('../../assets/audio/currencies/1k.mp3') }, // Placeholder
        { phrase: 'Một', translation: 'One', audioUri: require('../../assets/audio/currencies/1k.mp3') },
        { phrase: 'Hai', translation: 'Two', audioUri: require('../../assets/audio/currencies/2k.mp3') },
        { phrase: 'Ba', translation: 'Three', audioUri: require('../../assets/audio/currencies/2k.mp3') }, // Placeholder
        { phrase: 'Bốn', translation: 'Four', audioUri: require('../../assets/audio/currencies/5k.mp3') }, // Placeholder
        { phrase: 'Năm', translation: 'Five', audioUri: require('../../assets/audio/currencies/5k.mp3') },
        { phrase: 'Sáu', translation: 'Six', audioUri: require('../../assets/audio/currencies/10k.mp3') }, // Placeholder
        { phrase: 'Bảy', translation: 'Seven', audioUri: require('../../assets/audio/currencies/10k.mp3') }, // Placeholder
        { phrase: 'Tám', translation: 'Eight', audioUri: require('../../assets/audio/currencies/20k.mp3') }, // Placeholder
        { phrase: 'Chín', translation: 'Nine', audioUri: require('../../assets/audio/currencies/20k.mp3') }, // Placeholder
        { phrase: 'Mười', translation: 'Ten', audioUri: require('../../assets/audio/currencies/10k.mp3') },
      ],
      mascotExpression: 'happy',
    },
    {
      id: 'irregulars',
      type: 'teaching',
      title: 'THE IRREGULAR TRAPS',
      content: 'Vietnamese numbers are mostly logical (10 + 1 = mười một), except for these two critical changes:\n\n- **15** is NOT "mười năm". It is **mười lăm**.\n- **21, 31...** is NOT "... một". It is **... mốt**.',
      visualHighlight: '5 → LĂM | 1 → MỐT',
    },
    {
      id: 'trap_quiz',
      type: 'quiz',
      title: 'NUMERICAL TRAP',
      question: 'How do you say 15 in Vietnamese?',
      options: ['Mười năm', 'Mười lăm'],
      correctIndex: 1,
      fact: 'Remember: When "5" comes after "10", it changes from "năm" to "lăm"!',
    },
    {
      id: 'verbal_drill',
      type: 'voice_practice',
      title: 'VERBAL DRILL',
      description: 'Practice the pattern for 20+ numbers.',
      targetPhrase: 'Hai mươi lăm',
      targetTranslation: 'Twenty-five (25)',
      audioUri: require('../../assets/audio/currencies/20k.mp3'), // Placeholder
      successFeedback: 'Sharp! You just mastered the most common price suffix.',
    },
    {
      id: 'fruit_stall',
      type: 'roleplay',
      title: 'THE FRUIT STALL SHOWDOWN',
      dialogues: [
        {
          id: 'd1',
          speaker: 'app',
          tip: 'You are at a fruit stall in Ben Thanh Market. You want 1kg of mangoes.',
          nextId: 'd2',
        },
        {
          id: 'd2',
          speaker: 'user',
          text: 'Cho tôi một kí xoài. Bao nhiêu tiền?',
          audioUri: require('../../assets/audio/bargaining/baonhieutien.mp3'),
          nextId: 'd3',
        },
        {
          id: 'd3',
          speaker: 'seller',
          text: 'Dạ, bốn mươi lăm nghìn một kí ạ.',
          audioUri: require('../../assets/audio/currencies/50k.mp3'), // Placeholder
          nextId: 'd4',
        },
        {
          id: 'd4',
          speaker: 'user',
          options: [
            { label: 'Bốn mươi lăm nghìn? (Repeat price)', nextId: 'd5_pay' },
            { label: 'Đắt quá! (Too expensive)', nextId: 'd5_bargain' },
          ],
        },
        {
          id: 'd5_pay',
          speaker: 'seller',
          text: 'Đúng rồi, bốn mươi lăm nghìn. Cảm ơn nhé!',
          nextId: 'end_success',
        },
        {
          id: 'd5_bargain',
          speaker: 'seller',
          text: 'Thôi, bớt cho em, bốn mươi nghìn thôi!',
          nextId: 'end_success',
        },
        {
          id: 'end_success',
          speaker: 'mascot',
          text: 'Great job! You navigated the market and potentially saved 5k!',
          mascotExpression: 'excited',
        }
      ],
    },
    {
      id: 'reward',
      type: 'reward',
      title: 'NUMBER NINJA',
      reward: { xp: 100, badge: 'NUMBER_NINJA' },
    },
  ],
};
