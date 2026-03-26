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
*   `Color-Bg-Primary`: **#FFFFFF** (Trắng tinh) - Không gian nền chính, tạo sự sạch sẽ, tối giản.
*   `Color-Brand-Primary`: **#DA251D** (Đỏ Cờ) - Dành cho các nút bấm hành động chính (Primary CTA), cảnh báo, và các điểm nhấn quan trọng nhất.
*   `Color-Brand-Secondary`: **#FFC62F** (Vàng Sao) - Dành cho nền thẻ Flashcard, background phụ, làm nổi bật thông tin.
*   `Color-Text-Main`: **#1A1A1A** (Đen đậm) - Dùng cho văn bản chính, tiêu đề và các đường viền (Solid Stroke).
*   `Color-Text-Muted`: **#666666** (Xám nhạt) - Dùng cho văn bản phụ, placeholder trong ô nhập liệu.

### 2.2. Kiểu chữ (Typography)
*   **Font Family:** `Be Vietnam Pro` hoặc `Inter` (Sans-serif).
*   `Heading-1`: 24px - 32px, Extra Bold, Line-height 120%, Màu Đỏ Cờ hoặc Đen.
*   `Heading-2`: 18px - 20px, Bold, Line-height 130%, Màu Đen.
*   `Body-Text`: 16px, Regular, Line-height 150%, Màu Đen.
*   `Button-Text`: 16px, Bold, Uppercase (in hoa) hoặc Sentence case.

### 2.3. Khoảng cách & Kích thước (Spacing & Sizing)
*   **Grid System:** Hệ thống lưới **8pt** (các khoảng cách margin/padding là bội số của 8: 8, 16, 24, 32...).
*   **Padding màn hình chuẩn:** Lề trái/phải **16px** hoặc **24px**.
*   **Touch-Target-Min:** **44x44 pt** (Tuân thủ tuyệt đối Apple Human Interface Guidelines tránh lỗi "ngón tay mập").

### 2.4. Viền & Bo góc (Borders & Radii)
*   `Stroke-Width`: **1.5px** hoặc **2px**, nét Solid (mảng đặc), màu `#1A1A1A` (Đen).
*   `Border-Radius-Card`: **12px** - Mềm mại nhưng giữ form dáng rõ ràng.
*   `Border-Radius-Button`: **8px** - Giữ vẻ cứng cáp, không bo tròn dạng viên thuốc hoàn toàn.

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

### 3.3. Trường nhập liệu (Inputs & Forms)
*   **Normal:** Nền trắng, viền Đen 1px, bo góc 8px. Text Đen, Placeholder Xám (`#666666`).
*   **Focused:** Viền Đỏ Cờ (`#DA251D`), độ dày 2px.

### 3.4. Navigation (Điều hướng)
*   **Header (Top Nav):** Nền trắng tuyệt đối, phân cách nội dung bên dưới bằng line đen 1px mỏng. (Trái: Icon Back / Giữa: Tiêu đề Bold Đen / Phải: Icon Streak ngọn lửa Đỏ).
*   **Bottom Tab Bar:** Icon dạng Line-art nét đậm 2px màu Đen. Khi Active: Tô mảng (Fill) màu Đỏ Cờ hoặc Vàng Sao bên trong viền đen.

---

## 4. SCREEN & LAYOUT EXAMPLES (CẤU TRÚC MÀN HÌNH MẪU)

### 4.1. Màn hình Onboarding (Tiết lộ lũy tiến)
*   **Screen 1 (Phân nhánh):** Nền trắng. Headline Đỏ: *"Bạn muốn học tiếng Việt để làm gì?"*. Hai nút Secondary bự: `[ ✈️ Du lịch sinh tồn ]` và `[ 💼 Sống & Làm việc ]`.
*   **Screen 2 (Aha Moment):** Thẻ Flashcard mẫu (Nền Vàng, viền Đen) "Bao nhiêu tiền?". Nút Primary Đỏ: `[ Nghe phát âm ]`.

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
