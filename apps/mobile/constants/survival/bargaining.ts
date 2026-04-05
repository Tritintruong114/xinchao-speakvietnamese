import { SurvivalModule } from './types';

export const bargaining: SurvivalModule = {
  id: 'bargaining',
  title: 'THE ART OF BARGAINING',
  category: 'Survival',
  image: require('../../assets/screens/home/bargaining.png'),
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
        {
          phrase: 'Cái này bao nhiêu tiền?',
          translation: 'How much is this?',
          audioUri: require('../../assets/audio/bargaining/baonhieutien.mp3')
        },
      ],
      mascotExpression: 'happy',
    },
    {
      id: 'learn_negotiate',
      type: 'micro-learning',
      title: 'STAGE 2: NEGOTIATION WEAPONS',
      description: 'Once you hear the price, use these to express your surprise and ask for a fair discount.',
      vocabulary: [
        { phrase: 'Mắc quá!', translation: 'Too expensive! (South)', audioUri: require('../../assets/audio/bargaining/macqua.mp3'), tag: 'South' },
        { phrase: 'Đắt thế!', translation: 'Too expensive! (North)', audioUri: require('../../assets/audio/bargaining/datthe.mp3'), tag: 'North' },
        {
          phrase: 'Bớt đi cô!',
          translation: 'Discount please! (to female)',
          audioUri: require('../../assets/audio/bargaining/botdico.mp3')
        },
        {
          phrase: 'Bớt đi chú!',
          translation: 'Discount please! (to male)',
          audioUri: require('../../assets/audio/bargaining/botdichu.mp3')
        },
      ],
      mascotExpression: 'excited',
    },
    {
      id: 'learn_close',
      type: 'micro-learning',
      title: 'STAGE 3: CLOSING THE DEAL',
      description: 'A polite "Thank you" goes a long way in Vietnamese culture once the deal is done.',
      vocabulary: [
        { phrase: 'Cảm ơn!', translation: 'Thank you!', audioUri: require('../../assets/audio/bargaining/camon.mp3') },
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
      audioUri: require('../../assets/audio/bargaining/baonhieutien.mp3'),
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
          audioUri: require('../../assets/audio/bargaining/baonhieutien.mp3'),
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
            { label: 'Mắc quá! (South)', nextId: 'd5_offer', audioUri: require('../../assets/audio/bargaining/macqua.mp3') },
            { label: 'Đắt thế! (North)', nextId: 'd5_offer', audioUri: require('../../assets/audio/bargaining/datthe.mp3') },
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
          audioUri: require('../../assets/audio/bargaining/camon.mp3'),
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
};
