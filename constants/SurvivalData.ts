
export type MascotExpression = 'happy' | 'neutral' | 'sad' | 'excited';

export interface Dialogue {
  id: string;
  speaker: 'seller' | 'user' | 'app' | 'mascot';
  text?: string;
  tip?: string;
  options?: {
    label: string;
    nextId: string;
    xp?: number;
    badge?: string;
    audioUri?: string;
  }[];
  audioUri?: string;
  nextId?: string;
  timeLimit?: number; // in seconds
  timeoutId?: string; // where to go if time runs out
}

export type SurvivalStepType =
  | 'onboarding'
  | 'micro-learning'
  | 'voice_practice'
  | 'roleplay'
  | 'reward'
  | 'quiz'
  | 'teaching';

export interface SurvivalStep {
  id: string;
  type: SurvivalStepType;
  title: string;
  goal?: string;
  description?: string;
  mascotExpression?: MascotExpression;
  vocabulary?: { phrase: string; translation: string; audioUri?: string; tag?: string }[];
  targetPhrase?: string;
  targetTranslation?: string;
  successFeedback?: string;
  dialogues?: Dialogue[];
  audioUri?: string;
  reward?: { xp: number; badge: string };
  // Quiz specific
  question?: string;
  image?: any;
  options?: string[];
  correctIndex?: number;
  fact?: string;
  // Teaching specific
  content?: string;
  visualHighlight?: string;
}

export interface SurvivalModule {
  id: string;
  title: string;
  category: 'Beginner' | 'Survival' | 'Legend';
  image: any;
  steps: SurvivalStep[];
}

export const SURVIVAL_MODULES: Record<string, SurvivalModule> = {
  money_count: {
    id: 'money_count',
    title: 'MONEY COUNT',
    category: 'Beginner',
    image: require('../assets/screens/home/money_count.png'),
    steps: [
      {
        id: 'onboarding',
        type: 'onboarding',
        title: 'MONEY COUNT 101',
        goal: 'Master the "Drop 3 Zeros" rule and learn local currency slang to handle cash like a pro.',
      },
      {
        id: 'visual_trap',
        type: 'quiz',
        title: 'VISUAL TRAP',
        question: 'Which note is 500,000 (approx. $20)?',
        image: require('../assets/currencies/F-500000.png'),
        options: [
          'The one with 5 zeros',
          'The one with 4 zeros',
        ],
        correctIndex: 0,
        fact: "Don't get fooled by the blue color! 20k and 500k are both blue.",
        description: 'Locals call the 500k note "Xấp xỉ 20 đô".',
      },
      {
        id: 'counting_hack',
        type: 'teaching',
        title: 'LIFESAVING HACK',
        content: 'Quick conversion: Drop the last 3 zeros (500,000 becomes 500). Then divide by 25 (since $1 ≈ 25,000 VND). So, 500 ÷ 25 = $20.',
        visualHighlight: '500,<s>000</s>',
      },
      {
        id: 'ruoi_rule',
        type: 'voice_practice',
        title: 'AND A HALF',
        targetPhrase: 'Hai triệu rưỡi',
        targetTranslation: '2.5 Million (Two million and a half)',
        successFeedback: 'Perfect! "Rưỡi" is used everywhere in street markets.',
      },
      {
        id: 'roleplay_airport',
        type: 'roleplay',
        title: 'CURRENCY EXCHANGE',
        dialogues: [
          {
            id: 'd1',
            speaker: 'seller',
            text: 'Chào bạn! Bạn đổi bao nhiêu?',
            audioUri: 'seller_greet.mp3',
          },
          {
            id: 'd2',
            speaker: 'user',
            text: 'Tôi muốn đổi 100 Đô.',
            audioUri: 'user_100usd.mp3',
          },
          {
            id: 'd3',
            speaker: 'seller',
            text: 'Của bạn là Hai triệu rưỡi. Xin đếm lại.',
            audioUri: 'seller_result.mp3',
          },
          {
            id: 'd4',
            speaker: 'user',
            text: 'Xin đổi tiền lẻ giúp tôi.',
            audioUri: 'user_change.mp3',
          },
        ],
      },
      {
        id: 'reward',
        type: 'reward',
        title: 'MISSION COMPLETE',
        reward: { xp: 50, badge: 'CURRENCY_PRO' },
      },
    ],
  },
  greetings: {
    id: 'greetings',
    title: 'GREETINGS',
    category: 'Beginner',
    image: require('../assets/screens/home/greetings.png'),
    steps: [
      {
        id: 'onboarding',
        type: 'onboarding',
        title: 'SURVIVAL GREETINGS',
        goal: 'Learn the essential 4 phrases and the complex (but vital) world of addressing people correctly.',
      },
      {
        id: 'essentials',
        type: 'micro-learning',
        title: 'THE BIG FOUR',
        vocabulary: [
          { phrase: 'Xin chào', translation: 'Hello' },
          { phrase: 'Cảm ơn', translation: 'Thank you' },
          { phrase: 'Xin lỗi', translation: 'Sorry / Excuse me' },
          { phrase: 'Tạm biệt', translation: 'Goodbye' },
        ],
      },
    ],
  },
  ride_hailing: {
    id: 'ride_hailing',
    title: 'CALL A TAXI',
    category: 'Survival',
    image: require('../assets/screens/home/ride_hailing.png'),
    steps: [
      {
        id: 'onboarding',
        type: 'onboarding',
        title: 'GRAB & GO',
        goal: 'Understand what drivers are asking on the phone and how to command your destination.',
      },
    ],
  },
  directions: {
    id: 'directions',
    title: 'ASK DIRECTIONS',
    category: 'Survival',
    image: require('../assets/screens/home/directions.png'),
    steps: [
      {
        id: 'onboarding',
        type: 'onboarding',
        title: 'FIND YOUR WAY',
        goal: 'Navigation by landmarks. Stop getting lost in the hem (alleys).',
      },
    ],
  },
  restaurant_coffee: {
    id: 'restaurant_coffee',
    title: 'EAT & DRINK',
    category: 'Survival',
    image: require('../assets/screens/home/restaurant_coffee.png'),
    steps: [
      {
        id: 'onboarding',
        type: 'onboarding',
        title: 'PHỞ & CÀ PHÊ',
        goal: 'Order your Phở without cilantro and your coffee exactly how you like it.',
      },
    ],
  },
  bargaining: {
    id: 'bargaining',
    title: 'THE ART OF BARGAINING',
    category: 'Survival',
    image: require('../assets/screens/home/bargaining.png'),
    steps: [
      {
        id: 'onboarding',
        type: 'onboarding',
        title: 'SURVIVAL: THE ART OF BARGAINING',
        goal: 'Learn how to initiate a price check, negotiate with street-smart phrases, and close the deal like a local at Ben Thanh or Dong Xuan market.',
      },
      {
        id: 'learn_ask',
        type: 'micro-learning',
        title: 'STAGE 1: ASKING FOR PRICE',
        description: 'Initiate by asking. Use the "Little Calculator" strategy: show your phone and let them type the number to avoid confusion!',
        vocabulary: [
          { phrase: 'Cái này bao nhiêu tiền?', translation: 'How much is this?', audioUri: 'bao_nhieu_tien' },
        ],
        mascotExpression: 'happy',
      },
      {
        id: 'learn_negotiate',
        type: 'micro-learning',
        title: 'STAGE 2: NEGOTIATION WEAPONS',
        description: 'Once you hear the price, use these to express your surprise and ask for a fair discount.',
        vocabulary: [
          { phrase: 'Mắc quá!', translation: 'Too expensive!', audioUri: 'mac_qua', tag: 'South' },
          { phrase: 'Đắt quá!', translation: 'Too expensive!', audioUri: 'dat_qua', tag: 'North' },
          { phrase: 'Bớt đi cô/chú!', translation: 'Discount please!', audioUri: 'bot_di' },
        ],
        mascotExpression: 'excited',
      },
      {
        id: 'learn_close',
        type: 'micro-learning',
        title: 'STAGE 3: CLOSING THE DEAL',
        description: 'A polite "Thank you" goes a long way in Vietnamese culture once the deal is done.',
        vocabulary: [
          { phrase: 'Cảm ơn!', translation: 'Thank you!', audioUri: 'cam_on' },
        ],
        mascotExpression: 'happy',
      },
      {
        id: 'practice_ask',
        type: 'voice_practice',
        title: 'SAY IT LOUD!',
        description: 'Master the opening phrase:',
        targetPhrase: 'CÁI NÀY BAO NHIÊU TIỀN?',
        targetTranslation: 'How much is this?',
        audioUri: 'bao_nhieu_tien',
        successFeedback: 'Nice! You sound like a regular!',
      },
      {
        id: 'simulation',
        type: 'roleplay',
        title: 'FULL MARKET SIMULATION',
        dialogues: [
          {
            id: 'd1',
            speaker: 'app',
            tip: 'Step into the market and point at a shirt you like.',
            nextId: 'd2',
          },
          {
            id: 'd2',
            speaker: 'user',
            text: 'Cái này bao nhiêu tiền?',
            audioUri: 'bao_nhieu_tien',
            nextId: 'd3',
          },
          {
            id: 'd3',
            speaker: 'seller',
            text: 'This one? Top quality! For you, 200,000 VND.',
            audioUri: 'seller_offer_200k',
            nextId: 'd4',
          },
          {
            id: 'd4',
            speaker: 'user',
            options: [
              { label: 'Mắc quá! (South)', nextId: 'd5_offer', audioUri: 'mac_qua' },
              { label: 'Đắt quá! (North)', nextId: 'd5_offer', audioUri: 'dat_qua' },
            ],
          },
          {
            id: 'd5_offer',
            speaker: 'app',
            tip: 'Tip: Hand over your calculator and type 100,000.',
            nextId: 'd6_calc',
          },
          {
            id: 'd6_calc',
            speaker: 'user',
            nextId: 'd7_rejection',
          },
          {
            id: 'd7_rejection',
            speaker: 'seller',
            text: 'No no, too low! My cost is high. 150,000 VND, take it or leave it!',
            audioUri: 'seller_rejection_150k',
            nextId: 'd8_walkaway_choice',
          },
          {
            id: 'd8_walkaway_choice',
            speaker: 'user',
            options: [
              { label: 'Pay 150k', nextId: 'end_partial' },
              { label: 'Shake head, smile and walk away', nextId: 'd9_call_back' },
            ],
            timeLimit: 12,
            timeoutId: 'd8_timeout',
          },
          {
            id: 'd8_timeout',
            speaker: 'seller',
            text: 'Mua không em ơi? 150k is my final price. Yes or no?',
            audioUri: 'seller_impatient',
            nextId: 'd8_walkaway_choice', // Loop back for a second chance
          },
          {
            id: 'd9_call_back',
            speaker: 'seller',
            text: 'Wait! Come back! (Losing money here...) Okay, okay, 100,000 VND! Deal!',
            audioUri: 'seller_final_deal',
            nextId: 'd10_thank',
          },
          {
            id: 'd10_thank',
            speaker: 'user',
            text: 'Cảm ơn!',
            audioUri: 'cam_on',
            nextId: 'end_success',
          },
        ],
      },
      {
        id: 'victory',
        type: 'reward',
        title: 'BARGAIN MASTER!',
        reward: { xp: 150, badge: 'STREET SMART' },
      },
    ],
  },
  metro: {
    id: 'metro',
    title: 'URBAN METRO',
    category: 'Survival',
    image: require('../assets/screens/home/metro.png'),
    steps: [],
  },
  sleeper_bus: {
    id: 'sleeper_bus',
    title: 'THE SLEEPER BUS',
    category: 'Survival',
    image: require('../assets/screens/home/sleeper_bus.png'),
    steps: [],
  },
  train: {
    id: 'train',
    title: 'REUNIFICATION EXPRESS',
    category: 'Survival',
    image: require('../assets/screens/home/train.png'),
    steps: [],
  },
  airplane: {
    id: 'airplane',
    title: 'AIRPORT & FLYING',
    category: 'Survival',
    image: require('../assets/screens/home/airplane.png'),
    steps: [],
  },
  nhau_culture: {
    id: 'nhau_culture',
    title: 'NHẬU CULTURE',
    category: 'Survival',
    image: require('../assets/screens/home/nhau_culture.png'),
    steps: [
      {
        id: 'onboarding',
        type: 'onboarding',
        title: 'MOT, HAI, BA, YO!',
        goal: 'The art of the Vietnamese beer table. Rules of engagement for a night out.',
      },
    ],
  },
  genz_slang: {
    id: 'genz_slang',
    title: 'GEN Z SLANG',
    category: 'Legend',
    image: require('../assets/screens/home/genz_slang.png'),
    steps: [
      {
        id: 'onboarding',
        type: 'onboarding',
        title: 'BE A COOL KID',
        goal: 'Decode the secret language of Vietnamese youth. From texting to flirting.',
      },
    ],
  },
  expat_life: {
    id: 'expat_life',
    title: 'EXPAT LIFE',
    category: 'Legend',
    image: require('../assets/screens/home/expat_life.png'),
    steps: [
      {
        id: 'onboarding',
        type: 'onboarding',
        title: 'LONG-TERM SURVIVAL',
        goal: 'Crucial medical and legal phrases for living in Vietnam.',
      },
    ],
  },
};
