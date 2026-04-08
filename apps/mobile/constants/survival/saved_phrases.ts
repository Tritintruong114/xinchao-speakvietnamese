import { CategoryColors, PhraseCategory, SavedPhrase } from '@xinchao/shared';

// Tùy chỉnh lại interface để hứng Tailwind classes thay vì mã HEX thuần
export interface Category {
  id: PhraseCategory | 'ALL';
  label: string;
  themeClass: string; // Dùng Tailwind class (VD: 'bg-[#FFC62F] text-[#1A1A1A]')
}

// Single Source of Truth: Mapping trực tiếp từ CategoryColors
export const CATEGORIES: Category[] = [
  {
    id: 'ALL',
    label: 'ALL',
    themeClass: 'bg-[#FAFAF8] text-[#1A1A1A]' // Dùng Trắng ngà (Off-White)
  },
  {
    id: 'ESSENTIALS',
    label: 'ESSENTIALS',
    themeClass: CategoryColors.ESSENTIALS
  },
  {
    id: 'FOOD_DRINK',
    label: 'FOOD & DRINK',
    themeClass: CategoryColors.FOOD_DRINK
  },
  {
    id: 'TRANSPORT',
    label: 'TRANSPORT',
    themeClass: CategoryColors.TRANSPORT
  },
  {
    id: 'MONEY_SIM',
    label: 'MONEY & SIM',
    themeClass: CategoryColors.MONEY_SIM
  },
  {
    id: 'STREET_BARGAINING',
    label: 'BARGAINING',
    themeClass: CategoryColors.STREET_BARGAINING
  },
  {
    id: 'EMERGENCY',
    label: 'EMERGENCY',
    themeClass: CategoryColors.EMERGENCY
  },
  {
    id: 'AIRPORT_CUSTOMS',
    label: 'AIRPORT',
    themeClass: CategoryColors.AIRPORT_CUSTOMS
  },
  {
    id: 'ACCOMMODATION',
    label: 'STAY',
    themeClass: CategoryColors.ACCOMMODATION
  },
  {
    id: 'NIGHTLIFE_SOCIAL',
    label: 'SOCIAL',
    themeClass: CategoryColors.NIGHTLIFE_SOCIAL
  },
];

// Asset mapping for offline audio
const AUDIO_ASSETS = {
  khong_da_khong_duong: require('../../assets/audio/food&drink/khong_da_khong_duong.mp3'),
  mot_ly_ca_phe_sua_da: require('../../assets/audio/food&drink/mot_ly_ca_phe_sua_da.mp3'),
  di_ung_lac: require('../../assets/audio/food&drink/di_ung_lac.mp3'),
};

export const SAVED_PHRASES: SavedPhrase[] = [
  {
    id: 'p1',
    vietnamese: "Không đá, không đường",
    english: "No ice, no sugar",
    audioUri: AUDIO_ASSETS.khong_da_khong_duong as any as string,
    categories: ['FOOD_DRINK', 'ESSENTIALS']
  },
  {
    id: 'p2',
    vietnamese: "Bao nhiêu tiền?",
    english: "How much is it?",
    audioUri: "bao_nhieu_tien",
    categories: ['MONEY_SIM', 'ESSENTIALS', 'STREET_BARGAINING']
  },
  {
    id: 'p3',
    vietnamese: "Cho tôi gọi taxi",
    english: "Call me a taxi",
    audioUri: "cho_toi_goi_taxi",
    categories: ['TRANSPORT', 'ESSENTIALS']
  },
  {
    id: 'p4',
    vietnamese: "Chợ Bến Thành ở đâu?",
    english: "Where is Ben Thanh Market?",
    audioUri: "cho_ben_thanh_o_dau",
    categories: ['TRANSPORT', 'STREET_BARGAINING']
  },
  {
    id: 'p5',
    vietnamese: "Một ly cà phê sữa đá",
    english: "One iced coffee with milk",
    audioUri: AUDIO_ASSETS.mot_ly_ca_phe_sua_da as any as string,
    categories: ['FOOD_DRINK', 'NIGHTLIFE_SOCIAL']
  },
  {
    id: 'p6',
    vietnamese: "Đi thẳng rồi rẽ trái",
    english: "Go straight then turn left",
    audioUri: "di_thang_roi_re_trai",
    categories: ['TRANSPORT']
  },
  {
    id: 'p7',
    vietnamese: "Toilet ở đâu?",
    english: "Where is the toilet?",
    audioUri: "toilet_o_dau",
    categories: ['EMERGENCY', 'ESSENTIALS']
  },
  {
    id: 'p8',
    vietnamese: "Tôi bị dị ứng đậu phộng",
    english: "I am allergic to peanuts",
    audioUri: AUDIO_ASSETS.di_ung_lac as any as string,
    categories: ['FOOD_DRINK', 'EMERGENCY']
  }
];


