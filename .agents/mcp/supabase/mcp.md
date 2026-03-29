---
name: Supabase MCP
description: Gọi Supabase MCP server đã kết nối để thực hiện các task do người dùng input.
---

# Supabase MCP

## Mô tả

Skill này kết nối tới **Supabase MCP server** đã được cấu hình sẵn để thực hiện các tác vụ liên quan đến cơ sở dữ liệu, authentication, storage và các dịch vụ Supabase khác.

## Khi nào sử dụng

- Khi người dùng yêu cầu thao tác với database (query, insert, update, delete).
- Khi cần quản lý authentication users.
- Khi cần thao tác với Supabase Storage (upload, download, list files).
- Khi cần quản lý Edge Functions hoặc Realtime subscriptions.
- Bất kỳ task nào liên quan đến Supabase backend.

## Quy trình thực hiện

1. **Nhận yêu cầu từ người dùng** — Xác định rõ task cần thực hiện.
2. **Gọi MCP server** — Sử dụng các tool từ Supabase MCP server đã kết nối.
3. **Xử lý kết quả** — Trả về kết quả cho người dùng, kèm giải thích nếu cần.
4. **Xử lý lỗi** — Nếu có lỗi, thông báo rõ ràng và đề xuất cách khắc phục.

## Lưu ý

- Luôn xác nhận với người dùng trước khi thực hiện các thao tác destructive (DELETE, DROP, TRUNCATE).
- Tuân thủ security best practices khi thao tác với dữ liệu nhạy cảm.
- Log lại các thay đổi quan trọng để traceability.
