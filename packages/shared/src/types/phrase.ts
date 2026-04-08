// 1. Định nghĩa các Danh mục Sinh tồn cốt lõi (User Journey Based)
export type PhraseCategory = 
  | 'ESSENTIALS'        // Giao tiếp cơ bản (Xin chào, Cảm ơn, Xin lỗi)
  | 'AIRPORT_CUSTOMS'   // Sân bay & Hải quan (Nhập cảnh, Lấy hành lý)
  | 'MONEY_SIM'         // Tiền bạc & Kết nối (Đổi tiền VNĐ, Mua SIM 4G)
  | 'TRANSPORT'         // Di chuyển (Gọi Grab/Taxi, Tránh scam meter)
  | 'ACCOMMODATION'     // Lưu trú (Check-in khách sạn, Pass Wifi)
  | 'FOOD_DRINK'        // Ẩm thực vỉa hè (Gọi món, Dị ứng, Tùy chỉnh gia vị)
  | 'STREET_BARGAINING' // Mua sắm & Mặc cả (Chợ Bến Thành, Chợ Đồng Xuân)
  | 'EMERGENCY'         // Khẩn cấp (Bệnh viện, Cảnh sát, Mất đồ, Toilet)
  | 'NIGHTLIFE_SOCIAL'; // Giao lưu (Nhậu, 1-2-3 Dô, Khen ngợi)

// 2. Định nghĩa Interface cho Phrase
export interface SavedPhrase {
  id: string; // Nên có ID để WatermelonDB/SQLite quản lý Offline
  vietnamese: string;
  english: string;
  audioUri: string; // Tên file audio (đã được bundle offline trong app)
  categories: PhraseCategory[];
  isBookmarked?: boolean;
}

// 3. Mapping màu sắc UI (Neo-Brutalism) cho từng Tag
export const CategoryColors: Record<PhraseCategory, string> = {
  EMERGENCY: 'bg-[#DA251D] text-white',         // Crimson Red (Cảnh báo)
  ESSENTIALS: 'bg-[#86EFAC] text-[#1A1A1A]',    // Mint Green (Thành công, An toàn)
  FOOD_DRINK: 'bg-[#FFC62F] text-[#1A1A1A]',    // Vibrant Yellow (Thu hút)
  STREET_BARGAINING: 'bg-[#FFC62F] text-[#1A1A1A]', // Vibrant Yellow
  NIGHTLIFE_SOCIAL: 'bg-[#FF90E8] text-[#1A1A1A]',// Bubblegum Pink (Vui vẻ, Gamification)
  TRANSPORT: 'bg-[#93C5FD] text-[#1A1A1A]',     // Soft Blue (Thông tin)
  ACCOMMODATION: 'bg-[#93C5FD] text-[#1A1A1A]', // Soft Blue
  MONEY_SIM: 'bg-[#C084FC] text-[#1A1A1A]',     // Lavender Purple (Giao dịch)
  AIRPORT_CUSTOMS: 'bg-[#F4F4F0] text-[#1A1A1A]'// Off-White
};
