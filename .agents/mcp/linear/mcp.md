---
name: Linear MCP
description: Gọi Linear MCP server đã kết nối để thực hiện các task do người dùng input.
---

# Linear MCP

## Mô tả

Skill này kết nối tới **Linear MCP server** đã được cấu hình sẵn để thực hiện các tác vụ quản lý dự án, issue tracking và team collaboration trên Linear.

## Khi nào sử dụng

- Khi người dùng yêu cầu tạo, cập nhật hoặc quản lý issues.
- Khi cần quản lý projects, milestones và cycles.
- Khi cần tìm kiếm, lọc và báo cáo trạng thái công việc.
- Khi cần quản lý labels, teams và users.
- Khi cần tạo hoặc cập nhật documents trong Linear.
- Bất kỳ task nào liên quan đến project management trên Linear.

## Quy trình thực hiện

1. **Nhận yêu cầu từ người dùng** — Xác định rõ task cần thực hiện (tạo issue, cập nhật status, query backlog...).
2. **Gọi MCP server** — Sử dụng các tool từ Linear MCP server đã kết nối (`list_issues`, `save_issue`, `list_projects`...).
3. **Xử lý kết quả** — Trả về kết quả cho người dùng với format rõ ràng.
4. **Xử lý lỗi** — Nếu có lỗi, thông báo và đề xuất cách khắc phục.

## Lưu ý

- Luôn xác nhận team và project context trước khi tạo issue mới.
- Sử dụng đúng label taxonomy đã thiết lập trong workspace.
- Khi tạo issue, đảm bảo có đủ title, description và assignee nếu cần.
