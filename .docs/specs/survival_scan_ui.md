# UI/UX Specification: SurvivalScan (Neo-Brutalism Style)

**Version:** 1.0.0 (MVP)  
**Platform:** React Native (Expo)  
**Style:** Neo-Brutalism (High Contrast, Bold Lines, Hard Shadows)

---

## 1. Màn hình Xin quyền (Pre-permission Screen)
Để giảm ma sát khi người dùng thấy pop-up hệ thống, chúng ta dùng một "Bumper Screen" giải thích lợi ích.

- **Layout:** `Center`
- **Mascot:** `assets/images/mascot_camera.png` (Bé Ghế Nhựa cầm máy ảnh).
- **Headline:** "Let Bé Ghế Nhựa translate for you!" (Đỏ Cờ, 28px ExtraBold).
- **Copy:** "We need your camera to scan menus and street signs. No photos are stored, only translated." (Đen, 16px Regular).
- **Primary Button:** "ENABLE CAMERA" (Nền Đỏ Cờ, Shadow Đen 4px).
- **Ghost Button:** "Maybe later" (Viền Đen, Chữ Đen).

---

## 2. Giao diện Camera (Scanning Interface)
Trải nghiệm trực quan, tập trung vào việc "bắt" từ khóa.

- **Viewfinder Overlay:** Một khung hình chữ nhật nét mảnh (1px) ở giữa màn hình.
- **Hotspots (Recognized Items):**
    - **Border:** 2px solid Black (#1A1A1A).
    - **Fill:** 10% opacity Red (#DA251D).
    - **Label:** Một tag nhỏ nền Vàng Sao (#FFC62F) đè lên góc trái khung nhận diện.
- **Controls:**
    - Bottom Left: Flash Toggle (Icon Lucide `Zap`).
    - Bottom Center: Nút "Capture" hình tròn viền đen dày (3px).
    - Bottom Right: History (Icon Lucide `Clock`).

---

## 3. Thẻ kết quả (Result Card - Mini Modal)
Hiển thị ngay trên Viewfinder sau khi quét thành công.

- **Background:** Vàng Sao (#FFC62F).
- **Border:** 2px solid Black (#1A1A1A).
- **Shadow:** Hard Shadow (4px offset x/y, màu Đen).
- **Content:**
    - **Headline:** Tên món ăn (Ví dụ: "Bún Chả") - Đen, Bold.
    - **Translation:** "Grilled Pork Noodles" - Đen, Italic/Regular.
    - **Action Row:**
        - **Icon Loa (TTS):** Lucide `Volume2`, nét 2.5px. Nút này hình vuông, nền Đỏ Cờ.
        - **"I'll take this" phrase:** "Cho tôi một dĩa này" (Lấy từ `survival_phrase` trong API).

---

## 4. Màn hình Giới hạn (Paywall / Usage Limit)
Phong cách "Hối thúc hành động" đặc trưng của XinChao.

- **Background:** Đỏ Cờ (#DA251D).
- **Text Color:** Trắng tinh (#FFFFFF).
- **Copy:** "Survival Mode is Full!" 
- **Sub-copy:** "You've saved yourself 5 times today. Go Premium for unlimited scans."
- **CTA Button:** "UPGRADE NOW" (Nền Vàng Sao, Chữ Đen, Shadow Đen 4px).
- **Viral Trigger:** "Invite a friend to get 7 days free" (Link nhỏ phía dưới).

---

## 5. Trạng thái Lỗi (Bé Ghế Nhựa Fail)
- **UI:** Thẻ màu Đỏ nhạt (hoặc Trắng viền Đỏ).
- **Copy:** "Oops! Món này lạ quá, Bé Ghế Nhựa chưa học kịp. Hãy thử tự gõ tay nhé!"
- **Action:** Nút "Type Manually" (Secondary Button).

---

## 6. Resources & Icons (Lucide)
- `Camera`, `Zap`, `Volume2`, `Share2`, `CreditCard`, `History`.
- Stroke-width: **2.5px**.

---
**END OF UI SPECIFICATION**
