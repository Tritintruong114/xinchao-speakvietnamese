import { SurvivalModule } from './types';

export const ride_hailing: SurvivalModule = {
  id: 'ride_hailing',
  title: 'RIDE HAILING',
  category: 'Survival',
  image: require('../../assets/screens/home/ride_hailing.png'),
  steps: [
    {
      id: 'onboarding',
      type: 'onboarding',
      title: 'GRAB & GO SURVIVAL',
      goal: 'Master the essential phrases to communicate with your driver and ensure you get to the right spot.',
    },
    {
      id: 'vocab',
      type: 'micro-learning',
      title: 'PICKUP BASICS',
      vocabulary: [
        { phrase: 'Đón tôi ở đây', translation: 'Pick me up here', audioUri: 'don_toi_o_day' },
        { phrase: 'Mấy phút nữa tới?', translation: 'How many minutes?', audioUri: 'may_phut' },
        { phrase: 'Biển số xe', translation: 'License plate', audioUri: 'bien_so' },
      ],
    },
    {
      id: 'practice',
      type: 'voice_practice',
      title: 'TELL THE DESTINATION',
      targetPhrase: 'TỚI SÂN BAY TÂN SƠN NHẤT',
      targetTranslation: 'To Tan Son Nhat Airport',
      audioUri: 'to_airport',
      successFeedback: 'Perfect! The driver knows exactly where to go.',
    },
    {
      id: 'reward',
      type: 'reward',
      title: 'DRIVER READY',
      reward: { xp: 80, badge: 'ROAD_WARRIOR' },
    },
  ],
};

export const directions: SurvivalModule = {
  id: 'directions',
  title: 'DIRECTIONS',
  category: 'Survival',
  image: require('../../assets/screens/home/directions.png'),
  steps: [
    {
      id: 'onboarding',
      type: 'onboarding',
      title: 'STREET NAVIGATOR',
      goal: 'Stop getting lost in the "Hẻm" (alleys). Learn to command your turns like a local.',
    },
    {
      id: 'vocab',
      type: 'micro-learning',
      title: 'THE CORE 4',
      vocabulary: [
        { phrase: 'Rẽ trái', translation: 'Turn left', audioUri: 're_trai' },
        { phrase: 'Rẽ phải', translation: 'Turn right', audioUri: 're_phai' },
        { phrase: 'Đi thẳng', translation: 'Go straight', audioUri: 'di_thang' },
        { phrase: 'Dừng lại', translation: 'Stop', audioUri: 'dung_lai' },
      ],
    },
    {
      id: 'quiz',
      type: 'quiz',
      title: 'WHICH WAY?',
      question: 'Your driver is heading too far. How do you tell him to turn LEFT?',
      options: ['Rẽ trái', 'Đi thẳng'],
      correctIndex: 0,
      fact: 'In Vietnam, "Rẽ" is common in the North, while "Quẹo" is used in the South.',
    },
    {
      id: 'reward',
      type: 'reward',
      title: 'MAP MASTER',
      reward: { xp: 60, badge: 'NAVIGATOR' },
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
      title: 'PHỞ & CÀ PHÊ SURVIVAL',
      goal: 'Order your Phở without cilantro and your coffee exactly how you like it.',
    },
    {
      id: 'vocab',
      type: 'micro-learning',
      title: 'THE ESSENTIALS',
      vocabulary: [
        { phrase: 'Một tô Phở bò', translation: 'One bowl of Beef Pho', audioUri: 'pho_bo' },
        { phrase: 'Không hành', translation: 'No green onions', audioUri: 'khong_hanh' },
        { phrase: 'Cà phê sữa đá', translation: 'Iced milk coffee', audioUri: 'cafe_sua_da' },
        { phrase: 'Tính tiền!', translation: 'Check, please!', audioUri: 'tinh_tien' },
      ],
    },
    {
      id: 'roleplay',
      type: 'roleplay',
      title: 'ORDERING COFFEE',
      dialogues: [
        {
          id: 'd1',
          speaker: 'user',
          text: 'Cho tôi một cà phê sữa đá.',
        },
        {
          id: 'd2',
          speaker: 'seller',
          text: 'Dạ có ngay! Anh uống nhiều đá hay ít đá?',
        },
        {
          id: 'd3',
          speaker: 'user',
          text: 'Ít đá, ít đường cảm ơn.',
        },
      ],
    },
    {
      id: 'reward',
      type: 'reward',
      title: 'STREET FOODIE',
      reward: { xp: 100, badge: 'FOODIE_PRO' },
    },
  ],
};
