---
description: Quy trình phát triển tính năng mới (TDD & Clean Architecture)
---

# /create-feature SOP

Quy trình này BẮT BUỘC phải được tuân thủ khi bắt đầu phát triển bất kỳ tính năng mới nào trong dự án **XinChao**.

## 1. Phân tích & Đặc tả (Architect & PO)
- **Product Owner MUST** xác nhận yêu cầu trong backlog và đảm bảo tính năng phù hợp với chiến lược LiveOps.
- **Frontend Architect SHOULD** thiết kế cấu trúc dữ liệu và các Hooks cần thiết.

## 2. Thiết kế Cơ sở dữ liệu (Backend & AI)
- **Backend Engineer MUST** cập nhật schema trên Supabase (nếu cần) và thiết lập RLS Policies.
- **MUST NOT** tạo bảng mà không có chính sách bảo mật RLS rõ ràng.

## 3. Phát triển hướng Kiểm thử (TDD)
- **Coder MUST** viết Unit Test cho logic nghiệp vụ (Business Logic) TRƯỚC khi viết mã thực thi.
- **React Native Architect** yêu cầu tách biệt logic này vào các thư mục `logic/` hoặc custom hooks.

## 4. Triển khai UI (Frontend)
- **Frontend Engineer MUST** sử dụng các Design Tokens từ `[.agents/rules/design-system.md](file:///Users/truongtritin/Github/xinchao%20-%20speak%20vietnamese/.agents/rules/design-system.md)`.
- **TUYỆT ĐỐI KHÔNG** sử dụng mã màu ad-hoc.

## 5. Kiểm tra & Tuân thủ (Compliance & Auditor)
- **Mobile Performance Auditor SHOULD** rà soát render loops.
- **Compliance Agent MUST** kiểm tra các yêu cầu về quyền riêng tư (Privacy Consent) nếu tính năng có sử dụng AI hoặc Camera.

---
*Ghi chú: Mọi vi phạm quy trình này SHOULD được Debugger Agent ghi nhận và yêu cầu sửa đổi.*
