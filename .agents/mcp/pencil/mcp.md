---
name: Pencil MCP
description: Gọi Pencil MCP server đã kết nối để thực hiện các task do người dùng input.
---

# Pencil MCP

## Mô tả

Skill này kết nối tới **Pencil MCP server** đã được cấu hình sẵn để thực hiện các tác vụ thiết kế UI/UX, đọc/ghi file `.pen` và quản lý design components.

## Khi nào sử dụng

- Khi người dùng yêu cầu tạo hoặc chỉnh sửa thiết kế trong file `.pen`.
- Khi cần đọc, phân tích cấu trúc design hiện tại (components, layout, styles).
- Khi cần export design nodes thành hình ảnh (PNG, JPEG, WEBP, PDF).
- Khi cần tạo hoặc cập nhật design system components.
- Khi cần screenshot để review hoặc so sánh thiết kế.
- Bất kỳ task nào liên quan đến design và file `.pen`.

## Quy trình thực hiện

1. **Nhận yêu cầu từ người dùng** — Xác định rõ task thiết kế cần thực hiện.
2. **Đọc context** — Sử dụng `get_editor_state`, `batch_get`, `get_guidelines` để hiểu trạng thái hiện tại.
3. **Gọi MCP server** — Sử dụng các tool từ Pencil MCP server (`batch_design`, `batch_get`, `export_nodes`...).
4. **Verify kết quả** — Dùng `get_screenshot` để xác nhận thiết kế đúng yêu cầu.
5. **Xử lý lỗi** — Nếu có lỗi, rollback và thông báo cho người dùng.

## Lưu ý

- **KHÔNG** dùng `view_file` hoặc `grep_search` để đọc file `.pen` — chỉ dùng Pencil MCP tools.
- Luôn tuân thủ Design System đã định nghĩa (xem `design-system.md`).
- Sau khi thay đổi design, luôn chụp screenshot để verify trước khi báo hoàn thành.
- Giới hạn tối đa 25 operations mỗi `batch_design` call.
