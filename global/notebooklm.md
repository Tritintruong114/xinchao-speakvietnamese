# NotebookLM — MCP & A2A tools

Tài liệu này mô tả **bộ công cụ MCP** dùng để kết nối hệ thống với **Google NotebookLM** thông qua gói mã nguồn mở [notebooklm-mcp-cli](https://github.com/jacob-bd/notebooklm-mcp-cli). Agent hoặc pipeline A2A có thể gọi các tool này (qua MCP server `notebooklm-mcp`) để quản lý notebook, nguồn, truy vấn, studio artifact, nghiên cứu, chia sẻ và thao tác hàng loạt.

**Tham chiếu upstream:** [notebooklm-mcp-cli](https://github.com/jacob-bd/notebooklm-mcp-cli) — gồm CLI (`nlm`) và MCP server (`notebooklm-mcp`). Chi tiết đầy đủ: [MCP Guide](https://github.com/jacob-bd/notebooklm-mcp-cli/blob/main/docs/MCP_GUIDE.md), [CLI Guide](https://github.com/jacob-bd/notebooklm-mcp-cli/blob/main/docs/CLI_GUIDE.md), [Authentication](https://github.com/jacob-bd/notebooklm-mcp-cli/blob/main/docs/AUTHENTICATION.md).

---

## Điều kiện & lưu ý vận hành


| Khía cạnh    | Ghi chú                                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Xác thực** | Cần `nlm login` (hoặc profile/cookie thủ công) trước khi dùng MCP; session dựa trên cookie Google, có thể cần đăng nhập lại định kỳ.       |
| **API**      | Dựa trên API nội bộ Google, không chính thức — có thể thay đổi; chỉ nên dùng cho mục đích cá nhân/thử nghiệm theo disclaimer của upstream. |
| **Context**  | Upstream cung cấp **~35 MCP tools** — nên **tắt server khi không dùng** để tiết kiệm context (ví dụ trong Claude Code: `@notebooklm-mcp`). |
| **Giới hạn** | Free tier có giới hạn truy vấn (ví dụ ~50 query/ngày theo README upstream).                                                                |


---

## Danh sách MCP tools (theo nhóm)

### Notebook (6)


| Tool                | Mục đích                          |
| ------------------- | --------------------------------- |
| `notebook_list`     | Liệt kê tất cả notebook           |
| `notebook_create`   | Tạo notebook mới                  |
| `notebook_get`      | Chi tiết notebook kèm nguồn       |
| `notebook_describe` | Tóm tắt AI và gợi ý chủ đề        |
| `notebook_rename`   | Đổi tên notebook                  |
| `notebook_delete`   | Xóa notebook (cần `confirm=True`) |


### Nguồn — Sources (6)


| Tool                 | Mục đích                                                  |
| -------------------- | --------------------------------------------------------- |
| `source_add`         | Thêm nguồn thống nhất: URL, text, file, hoặc Google Drive |
| `source_list_drive`  | Liệt kê nguồn và trạng thái “freshness” với Drive         |
| `source_sync_drive`  | Đồng bộ nguồn Drive đã cũ                                 |
| `source_delete`      | Xóa nguồn (cần `confirm=True`)                            |
| `source_describe`    | Tóm tắt AI và từ khóa                                     |
| `source_get_content` | Lấy nội dung text thô                                     |


### Truy vấn — Querying (2)


| Tool             | Mục đích                                                                    |
| ---------------- | --------------------------------------------------------------------------- |
| `notebook_query` | Hỏi đáp AI trên nguồn trong notebook (đồng bộ với lịch sử chat trên web UI) |
| `chat_configure` | Cấu hình mục tiêu chat và độ dài phản hồi                                   |


### Studio — nội dung tạo ra (4)


| Tool            | Mục đích                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| `studio_create` | Tạo artifact: audio, video, report, quiz, flashcards, mind_map, slide_deck, infographic, data_table, … |
| `studio_status` | Theo dõi tiến độ tạo nội dung                                                                          |
| `studio_delete` | Xóa artifact (cần `confirm=True`)                                                                      |
| `studio_revise` | Chỉnh sửa slide deck hiện có (cần `confirm=True`)                                                      |


### Tải xuống & xuất (2)


| Tool                | Mục đích                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| `download_artifact` | Tải artifact (audio, video, report, mind_map, slide_deck, infographic, data_table, quiz, flashcards, …) |
| `export_artifact`   | Xuất sang Google Docs/Sheets                                                                            |


### Nghiên cứu — Research (3)


| Tool              | Mục đích                                                          |
| ----------------- | ----------------------------------------------------------------- |
| `research_start`  | Bắt đầu nghiên cứu web/Drive                                      |
| `research_status` | Poll trạng thái nghiên cứu                                        |
| `research_import` | Import nguồn đã tìm được (có thể tăng `timeout` cho notebook lớn) |


### Ghi chú — Notes (1)


| Tool   | Mục đích                                                                    |
| ------ | --------------------------------------------------------------------------- |
| `note` | Quản lý note: `list`, `create`, `update`, `delete` (xóa cần `confirm=True`) |


### Chia sẻ — Sharing (3)


| Tool                    | Mục đích                    |
| ----------------------- | --------------------------- |
| `notebook_share_status` | Xem cấu hình chia sẻ        |
| `notebook_share_public` | Bật/tắt link công khai      |
| `notebook_share_invite` | Mời cộng tác viên qua email |


### Xác thực MCP — Auth (2)


| Tool               | Mục đích                        |
| ------------------ | ------------------------------- |
| `refresh_auth`     | Tải lại token xác thực          |
| `save_auth_tokens` | Lưu cookie (phương án dự phòng) |


### Server (1)


| Tool          | Mục đích                              |
| ------------- | ------------------------------------- |
| `server_info` | Phiên bản server và kiểm tra cập nhật |


### Hàng loạt & đa notebook (2)


| Tool                   | Mục đích                                                                                |
| ---------------------- | --------------------------------------------------------------------------------------- |
| `batch`                | Thao tác batch: `query`, `add_source`, `create`, `delete`, `studio` trên nhiều notebook |
| `cross_notebook_query` | Truy vấn nhiều notebook, tổng hợp câu trả lời có trích dẫn theo notebook                |


### Pipeline (1)


| Tool       | Mục đích                                                                                                  |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| `pipeline` | `list` hoặc `run` workflow nhiều bước (ví dụ `ingest-and-podcast`, `research-and-report`, `multi-format`) |


### Tag & chọn thông minh (1)


| Tool  | Mục đích                                                                          |
| ----- | --------------------------------------------------------------------------------- |
| `tag` | Gắn tag notebook: `add`, `remove`, `list`, `select` (tìm notebook theo tag/query) |


---

## CLI tương ứng (không phải MCP, hỗ trợ vận hành)

Cài đặt: `uv tool install notebooklm-mcp-cli` (hoặc pip/pipx). Binary: `nlm` (CLI), `notebooklm-mcp` (MCP server).


| Mục đích       | Ví dụ                                                                                                             |
| -------------- | ----------------------------------------------------------------------------------------------------------------- |
| Cấu hình IDE   | `nlm setup add cursor` — thêm MCP vào Cursor (`~/.cursor/mcp.json`)                                               |
| Cursor (repo)  | Server id `**notebooklm-mcp-cli`**, lệnh: `uvx --from notebooklm-mcp-cli notebooklm-mcp` (xem `.cursor/mcp.json`) |
| Đăng nhập      | `nlm login`, `nlm login --check`                                                                                  |
| Chẩn đoán      | `nlm doctor`                                                                                                      |
| JSON tuỳ chỉnh | `nlm setup add json`                                                                                              |


Chạy MCP không cài global: `uvx --from notebooklm-mcp-cli notebooklm-mcp`.

---

## Luồng gợi ý cho agent

1. **Nghiên cứu → podcast:** `research_start` → `research_status` → `research_import` → `studio_create` (audio) → `studio_status` → `download_artifact`.
2. **Bổ sung tài liệu:** `source_add` với `wait=True` khi cần chờ xử lý xong.
3. **Học tập:** `studio_create` (quiz, flashcards, report dạng Study Guide).
4. **Tổ chức & quy mô lớn:** `tag` → `cross_notebook_query` hoặc `batch`.

Chi tiết tham số và ví dụ: [MCP_GUIDE.md](https://github.com/jacob-bd/notebooklm-mcp-cli/blob/main/docs/MCP_GUIDE.md) trong repo upstream.