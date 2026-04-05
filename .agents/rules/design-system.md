---
trigger: always_on
---

## 1. ĐỊNH VỊ THƯƠNG HIỆU (BRAND POSITIONING)
*   **Tinh thần cốt lõi:** "Học nhanh, dùng ngay, không rườm rà".
*   **Tính cách:** Trẻ trung, thẳng thắn, tốc độ, thực tế và mang đậm năng lượng của một Việt Nam hiện đại.
*   **Giá trị đem lại (Time-to-Value):** Ứng dụng không bắt người dùng học ngữ pháp lan man. Mở app ra là biết nói giá tiền, biết gọi món, biết hỏi đường chỉ trong 30 giây.
*   **Khẩu hiệu (Tagline):** *Speak Vietnamese. Survive. Connect.*
*   **Giọng điệu (Tone of Voice):** Ngắn gọn, thực tế, hối thúc hành động (Action-oriented). Không dùng ngôn ngữ học thuật rườm rà. Ví dụ: Dùng "Sinh tồn ở chợ" thay vì "Từ vựng mua sắm cơ bản".

---

## 2. DESIGN TOKENS (BIẾN SỐ THIẾT KẾ CỐT LÕI)

### 2.1. Hệ màu sắc (Colors)
*   `Color-Bg-Primary`: **#F4F4F0** (Vàng kem nhẹ/Anti-glare Off-white) - Không gian nền chính, tạo sự dễ chịu cho mắt.
*   `Color-Brand-Primary`: **#DA251D** (Đỏ Cờ) - Dành cho các nút bấm hành động chính (Primary CTA), cảnh báo.
*   `Color-Brand-Secondary`: **#FFC62F** (Vàng Sao) - Dành cho nền thẻ Flashcard, làm nổi bật thông tin.
*   `Color-Brand-Pink`: **#FF90E8** (Hồng phấn) - Dùng cho các danh mục phụ hoặc trạng thái vui vẻ.
*   `Color-Brand-Mint`: **#86EFAC** (Xanh bạc hà) - Dùng cho các trạng thái thành công, tích cực.
*   `Color-Brand-Cyan`: **#00E5FF** (Xanh lơ) - Dùng cho thông tin bổ sung.
*   `Color-Brand-Lavender`: **#C084FC** (Tím oải hương) - Dùng cho các danh mục ngoại ngữ/văn hóa.
*   `Color-Brand-Blue`: **#93C5FD** (Xanh dương nhạt) - Dùng cho các trạng thái trung tính.
*   `Color-Text-Main`: **#1A1A1A** (Đen đậm) - Dùng cho văn bản chính và các đường viền (Solid Stroke).
*   `Color-Text-Muted`: **#666666** (Xám nhạt) - Dùng cho văn bản phụ.

### 2.2. Kiểu chữ (Typography)
*   **Font Family:** `Be Vietnam Pro` (Sans-serif).
*   `Heading-1`: 24px, Black (900), Line-height 32px, Màu Đỏ Cờ hoặc Đen.
*   `Heading-2`: 20px, Extra Bold (800), Line-height 26px, Màu Đen.
*   `Body-Text`: 16px, Regular (400), Line-height 24px, Màu Đen.
*   `Button-Text`: 16px, Bold (700), Font `Be Vietnam Pro Bold`.

### 2.3. Khoảng cách & Kích thước (Spacing & Sizing)
*   **Grid System:** Hệ thống lưới **4pt/8pt** (các khoảng cách: 4, 8, 16, 24, 32, 40...).
*   **Padding màn hình chuẩn:** Lề trái/phải **16px** hoặc **24px** (Spacing.m / Spacing.l).
*   **Touch-Target-Min:** **44x44 pt** (Apple Human Interface Guidelines).

### 2.4. Viền & Bo góc (Borders & Radii)
*   `Stroke-Width`: **2px**, nét Solid, màu `#1A1A1A` (Đen).
*   `Border-Radius-Card`: **12px**.
*   `Border-Radius-Button`: **8px**.
*   `Border-Radius-Tight`: **4px**.

---

## 3. UI COMPONENTS (THÀNH PHẦN GIAO DIỆN)

### 3.0. CTA Semantics & Consistency (Bắt buộc)
*   **Semantic mapping cố định toàn app:** `Primary CTA = Đỏ Cờ`, `Secondary CTA = Vàng Sao`, `Ghost/Neutral = Trắng`.
*   **Không đổi ý nghĩa theo màn hình:** Đỏ luôn mang nghĩa "đi tiếp / xác nhận hành động chính", KHÔNG dùng Đỏ cho trạng thái lỗi trong ngữ cảnh nút CTA chính.
*   **Mỗi màn hình chỉ có 1 Primary CTA:** Các hành động còn lại phải là Secondary hoặc Ghost để tránh cạnh tranh thị giác.
*   **Ưu tiên tương phản hơn màu đơn lẻ:** phân cấp bằng cả màu + viền + đổ bóng (visual weight), không dựa duy nhất vào hue.

### 3.1. Nút bấm (Buttons)
*   **Primary Button (`primary`):** Nền Đỏ Cờ (`#DA251D`), viền Đen 2px, chữ Trắng (`#FFFFFF`), **Hard Shadow đen lệch phải 4px**. Dùng cho hành động quan trọng nhất.
*   **Secondary Button (`secondary`):** Nền Vàng Sao (`#FFC62F`), viền Đen 2px, chữ Đen (`#1A1A1A`), không shadow hoặc shadow rất mỏng.
*   **Ghost Button (`ghost`):** Nền Trắng (`#FFFFFF`), viền Đen 2px, chữ Đen. Dùng cho "Bỏ qua", "Để sau", "Hủy".
*   **Pressed state:**
    *   `primary`: dịch chuyển `(+2, +2)` và giảm shadow còn 2px để tạo cảm giác "nhấn xuống".
    *   `secondary/ghost`: dịch chuyển nhẹ theo trục Y, giảm opacity nhẹ.
*   **Accessibility:** Touch target tối thiểu 44x44pt; text CTA phải đủ tương phản (AA trở lên).

### 3.2. Thẻ thông tin (Cards / Flashcards)
*   **Thiết kế:** Nền Trắng hoặc Vàng Sao, viền Đen 2px, góc bo 12px. 
*   **Shadow:** Tuyệt đối KHÔNG có Drop Shadow (bóng mờ). Dùng "Hard Shadow" (bóng đổ khối đặc màu đen chéo xuống góc phải) nếu muốn thẻ nổi bật.
*   **Component tiêu chuẩn (`FlashcardItem`):**
    *   Nền: `Color-Brand-Secondary` (Vàng Sao).
    *   Bo góc: 12px.
    *   Tối ưu hóa: Sử dụng `React.memo` cho danh sách lớn.
    *   Tính năng: Tích hợp sẵn tiêu đề (h2), mô tả và nút phát âm thanh (Lucide `Volume2`).

### 3.3. Trường nhập liệu (Inputs & Forms)
*   **Normal:** Nền trắng, viền Đen 2px, bo góc 8px, **Hard Shadow đen 4px offset**.
*   **Focused:** Viền Đỏ Cờ (`#DA251D`), độ dày 2px. Shadow giữ nguyên 4px để duy trì chiều sâu.
*   **Component tiêu chuẩn (`ThemedInput`):** Wrapper tùy chỉnh cho `TextInput`, hỗ trợ đầy đủ các thuộc tính React Native kèm trạng thái focus tự động.

### 3.4. Navigation (Điều hướng)
*   **Header (Top Nav):** Nền trắng tuyệt đối, phân cách nội dung bên dưới bằng line đen 1px mỏng. (Trái: Icon Back / Giữa: Tiêu đề Bold Đen / Phải: Icon Streak ngọn lửa Đỏ).
*   **Bottom Tab Bar:** Icon dạng Line-art nét đậm 2px màu Đen. Khi Active: Tô mảng (Fill) màu Đỏ Cờ hoặc Vàng Sao bên trong viền đen.

---

## 4. SCREEN & LAYOUT EXAMPLES (CẤU TRÚC MÀN HÌNH MẪU)

### 4.1. Màn hình Onboarding (Tiết lộ lũy tiến)
*   **Tiếp cận "English-first":** Toàn bộ luồng Onboarding sử dụng tiếng Anh làm ngôn ngữ dẫn dắt chính (Headings, Labels, Instructions) để đảm bảo người dùng quốc tế hiểu rõ giá trị app ngay lập tức. Tiếng Việt được giữ lại ở vai trò là nội dung học tập hoặc dịch thuật bổ trợ.
*   **Screen 1 (Phân nhánh):** Nền trắng. Headline Đỏ: *"What's your main goal?"*. Hai nút Secondary bự: `[ ✈️ SURVIVAL TRAVEL ]` và `[ 💼 LIVE & WORK IN VN ]`. Subtitle nhỏ bên dưới: *"Bạn muốn học tiếng Việt để làm gì?"*.
*   **Screen 2 (Aha Moment):** Sử dụng component `VoicePractice` chuẩn. Thẻ hiển thị "How much is it?" làm trọng tâm hiểu, sau đó là "Bao nhiêu tiền?" để học. Người dùng có thể nhấn loa để nghe và nhấn giữ Micro để tập nói ngay lập tức. Sau khi thành công sẽ có hiệu ứng chúc mừng và phần thưởng +10 XP. Nút Primary Đỏ: `[ CONTINUE ]`.

### 4.2. Màn hình Trang chủ (Home - Luồng Du lịch)
*   **Lời chào:** "Chào John!" (Đen) + Icon Pin hiển thị Offline Mode (Đỏ).
*   **Khối tính năng chính:** Block nền Đỏ chữ Trắng: *"Dịch Biển báo & Menu"* (Gọi Camera OCR).
*   **Danh sách tính năng:** Các thẻ (Cards) dạng lưới, nền trắng, viền đen. Icon Line-art màu Đỏ/Vàng (Giao tiếp sân bay, Mặc cả ở chợ...).

---

## 5. CREATIVE ASSETS & ICONOGRAPHY

### 5.1. Hình minh họa (Illustrations) & Biểu tượng (Icons)
*   **Phong cách:** Line-art nét đậm (Thick bold lines). 
*   **Thư viện:** Sử dụng **Lucide Icons** (`lucide-react-native`).
*   **Thông số:** Stroke width mặc định là **2px** hoặc **2.5px** để đảm bảo độ dày và tính nhất quán với font chữ `Be Vietnam Pro`.
*   **Màu sắc:** Không tô màu toàn bộ, chỉ tô mảng màu Đỏ hoặc Vàng ở các điểm nhấn (hoặc dùng prop `color` của Lucide), chừa lại nhiều khoảng trắng.
*   **Tuyệt đối không dùng Emoji:** Không sử dụng Emoji cho các biểu tượng chức năng hoặc điều hướng chính để giữ vẻ chuyên nghiệp và cao cấp.
*   **Biểu tượng văn hóa:** Cà phê phin, Bát phở... (được vẽ phẳng, hiện đại theo phong cách Lucide).

### 5.2. App Icon (Biểu tượng trên Store)
*   **Thiết kế:** Background màu Vàng Sao (`#FFC62F`) phẳng. Hình trung tâm là bong bóng chat (Speech bubble) viền đen dày, chữ "Xin" màu Đen, "Chào" màu Đỏ Cờ (hoặc icon Nón lá tối giản viền đen). Tuyệt đối không có inner shadow.

### 5.3. Mẫu Creative Assets (App Store & Social Ads)
*   **Asset 1 - App Store (Tính năng Offline):** Nền trắng tinh. Mockup iPhone viền đen nét mảnh. Màn hình hiện danh sách "Gói Sinh Tồn" đã tải xong. Text caption Đỏ Cờ: *"No Wi-Fi? No Problem."*
*   **Asset 2 - App Store (Camera OCR):** Nền Vàng Sao. Mockup hiển thị Camera đang quét menu quán ăn, pop-up dịch nổi lên. Text caption Đen Bold: *"Scan & Translate Instantly."*
*   **Asset 3 - Social Ad (Facebook/TikTok):** Video/Carousel chia đôi màn hình. Trái: Khách Tây bối rối trước cô bán hàng rong. Phải: Màn hình app XinChao bật Flashcard "Bao nhiêu tiền?". Copy: *"Don't pay tourist prices. Learn the local slang in 5 minutes."*

---

## 6. QUY TẮC SỬ DỤNG (USAGE RULES & GOVERNANCE)

1.  **Quy tắc Khoảng trắng (White Space):** Khoảng trắng là "không gian thở". Không nhồi nhét thông tin. Dùng khoảng trắng để phân tách cụm thông tin thay vì dùng quá nhiều đường kẻ (dividers).
2.  **Quy tắc Phân cấp Thị giác (Visual Hierarchy):** Mỗi màn hình CHỈ ĐƯỢC PHÉP CÓ MỘT Primary Button (Nút Đỏ). Các hành động khác dùng Secondary hoặc Ghost Button để điều hướng mắt người dùng vào hành động quan trọng nhất.
3.  **Real UI cho App Store:** Ảnh chụp màn hình đem lên Store phải là giao diện thật của app. Không chứa các từ ngữ phóng đại vi phạm chính sách Apple như "App số 1", "Tải ngay", "Miễn phí 100%".
4.  **Source of Truth (Nguồn chân lý duy nhất):** Mọi thay đổi về biến số (Design Tokens) phải được cập nhật đồng thời trên file Figma của Designer và code config của Developer. Không tự ý phát minh mã màu hay kích thước font chữ mới ngoài hệ thống này.

---

## 7. AI & GENERATIVE ARCHITECTURE (TIÊU CHUẨN AI)

### 7.1. Cấu hình tập trung (AI Centralized Config)
*   **Source of Truth:** Mọi cấu hình AI (Model ID, Base URL, Version) phải được quản lý tại [AIConfig.ts](file:///Users/truongtritin/Github/xinchao-speak-vietnamese/constants/AIConfig.ts).
*   **Quy tắc:** Tuyệt đối không hardcode Model ID (ví dụ: "gemini-1.5-flash") trực tiếp trong Hook hoặc Component. Luôn sử dụng `AIConfig.DEFAULT_GEMINI_MODEL`.

### 7.2. Model Selection (Lựa chọn mô hình)
*   **Mặc định (Default):** Sử dụng **Gemini 3.1 Flash-Lite** (`gemini-3.1-flash-lite-preview`).
*   **Ưu tiên:** Tốc độ (Latency) > Chi phí (Cost) > Độ chính xác (Accuracy) cho các tác vụ "Sinh tồn" (OCR menu, biển báo).
*   **Trải nghiệm người dùng:** AI phải phản hồi trong thời gian thực hoặc có trạng thái loading/skeleton tối ưu.

### 7.3. Prompting Standard
*   **Persona:** Luôn định nghĩa AI là "Vietnamese Street Specialist" để đảm bảo giọng điệu gần gũi, thực tế.
*   **Output:** Ưu tiên trả về định dạng JSON nghiêm ngặt để ứng dụng bóc tách dữ liệu (Menu items, Prices, Survival Phrases).
*   **Fallback:** Luôn có câu thoại "sinh tồn" dự phòng trong trường hợp AI không nhận diện được nội dung.
