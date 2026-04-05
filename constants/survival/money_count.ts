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
      goal: 'Avoid the "Blue Note" trap, master the 3-zero rule, and calculate like a local at the market or metro.',
    },
    {
      id: 'survival_items',
      type: 'micro-learning',
      title: 'SURVIVAL ITEMS: CORE CASH',
      description: 'Master these basic numbers and phrases to survive your first day in Vietnam.',
      vocabulary: [
        { 
          phrase: 'Một nghìn đồng', 
          translation: '1,000 VND', 
          audioUri: require('../../assets/audio/currencies/1k.mp3'),
          tag: 'Paper'
        },
        { 
          phrase: 'Mười nghìn đồng', 
          translation: '10,000 VND', 
          audioUri: require('../../assets/audio/currencies/10k.mp3'),
          tag: 'Polymer'
        },
        { 
          phrase: 'Một trăm nghìn đồng', 
          translation: '100,000 VND', 
          audioUri: require('../../assets/audio/currencies/100k.mp3'),
          tag: 'Polymer'
        },
        { 
          phrase: 'Năm trăm nghìn đồng', 
          translation: '500,000 VND', 
          audioUri: require('../../assets/audio/currencies/500k.mp3'),
          tag: 'Polymer'
        },
        { 
          phrase: 'Bao nhiêu tiền?', 
          translation: 'How much is it?', 
          audioUri: require('../../assets/audio/bargaining/baonhieutien.mp3')
        },
        { 
          phrase: 'Tiền thối', 
          translation: 'Change (Money back)', 
          audioUri: require('../../assets/audio/currencies/50k.mp3') // Placeholder for change pronunciation
        },
      ],
      mascotExpression: 'happy',
    },
    {
      id: 'denominations',
      type: 'teaching',
      title: 'THE DENOMINATIONS',
      content: 'Vietnamese banknotes range from 1,000 to 500,000 VND.\n\n- Small (1k, 2k, 5k): Cotton paper, used for small change or parking.\n- Large (10k - 500k): Waterproof Polymer, the main currency.',
      visualHighlight: '1.000đ → 500.000đ',
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
      id: 'addition_quiz',
      type: 'quiz',
      title: 'QUICK ADDITION',
      question: 'You buy a Bánh Mì (20k) and a Bottle of Water (5k). How much in total?',
      images: [
        require('../../assets/currencies/F-20000.png'),
        require('../../assets/currencies/F-5000.png')
      ],
      options: ['15.000 VNĐ', '25.000 VNĐ'],
      correctIndex: 1,
      fact: 'Street food is cheap! 25k is only about $1 USD.',
    },
    {
      id: 'subtraction_quiz',
      type: 'quiz',
      title: 'CALCULATING CHANGE',
      question: 'You pay with a 100k note for a 75k meal. How much "Tiền thối" (change) should you get?',
      image: require('../../assets/currencies/F-100000.png'),
      options: ['25.000 VNĐ', '35.000 VNĐ'],
      correctIndex: 0,
      fact: 'Always check your "Tiền thối" before leaving the counter!',
    },
    {
      id: 'metro_scenario',
      type: 'teaching',
      title: 'METRO SURVIVAL (HCMC/HANOI)',
      content: 'Vietnamese Metro (MRT/LRT) has specific pricing:\n- Paper Ticket: 6,000 VND.\n- Physical Smart Card: 7,000 VND.\n- Card Deposit: 15,000 VND (Refundable).',
      visualHighlight: 'Paper (6k) vs Card (7k + 15k)',
    },
    {
      id: 'metro_quiz',
      type: 'quiz',
      title: 'METRO TOTAL',
      question: 'Buying your FIRST physical smart card for one trip. How much do you pay?',
      options: ['7.000 VNĐ', '22.000 VNĐ'],
      correctIndex: 1,
      fact: 'Total = 7k (Fare) + 15k (Deposit) = 22k. You get the 15k back when you return the card!',
    },
    {
      id: 'roleplay_hotel',
      type: 'roleplay',
      title: 'HOTEL PRICE CHECK',
      dialogues: [
        {
          id: 'd1',
          speaker: 'user',
          text: 'Phòng này bao nhiêu tiền một đêm?',
          audioUri: require('../../assets/audio/bargaining/baonhieutien.mp3'), // Partial match
        },
        {
          id: 'd2',
          speaker: 'seller',
          text: 'Dạ, tám trăm ngàn một đêm ạ.',
          audioUri: require('../../assets/audio/currencies/200k.mp3'), // Using 200k as base for 800k placeholder
        },
        {
          id: 'd3',
          speaker: 'user',
          text: 'Tôi ở hai đêm. Tổng cộng bao nhiêu?',
        },
        {
          id: 'd4',
          speaker: 'seller',
          text: 'Dạ, tổng cộng một triệu sáu trăm ngàn ạ.',
        },
      ],
    },
    {
      id: 'slang_ruoi',
      type: 'voice_practice',
      title: 'STREET SLANG: "RƯỠI"',
      description: 'Locals never say "phẩy năm" (.5). They say "rưỡi" (and a half).',
      targetPhrase: 'Hai triệu rưỡi',
      targetTranslation: '2.5 Million',
      audioUri: require('../../assets/audio/currencies/500k.mp3'), // Placeholder
      successFeedback: 'Perfect! Use "rưỡi" to sound like a pro when talking about millions or hours.',
    },
    {
      id: 'reward',
      type: 'reward',
      title: 'MONEY MASTERED',
      reward: { xp: 100, badge: 'MONEY_PRO' },
    },
  ],
};
