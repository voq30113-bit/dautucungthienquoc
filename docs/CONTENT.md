# Viết và đăng bài thủ công

Tài liệu này dành cho việc tự tay viết một bài, không qua scheduled task. Ví dụ đầy đủ cho cả bốn loại bài nằm trong [`src/content/README.md`](../src/content/README.md).

## 1. Bài nằm ở đâu

| Loại bài | Thư mục | Định dạng | Đường dẫn trên web |
|---|---|---|---|
| Nhận định trước phiên | `src/content/nhan-dinh/` | `.md` | `/nhan-dinh/<tên-file>/` |
| Tổng kết phiên | `src/content/tong-ket/` | `.md` | `/tong-ket/<tên-file>/` |
| Báo cáo vĩ mô tuần | `src/content/bao-cao/` | `.mdx` (hoặc `.md`) | `/bao-cao/<tên-file>/` |
| Phân tích chuyên sâu | `src/content/phan-tich/` | `.mdx` (hoặc `.md`) | `/phan-tich/<tên-file>/` |

**Tên file:** `YYYY-MM-DD.md`, hoặc `YYYY-MM-DD-slug.md` khi có hơn một bài cùng loại trong một ngày. Slug chỉ gồm chữ thường không dấu, số và dấu gạch ngang, ví dụ `2026-10-03-dong-von-ngoai.mdx`.

## 2. Frontmatter

Mỗi file bắt đầu bằng khối YAML giữa hai dòng `---`:

| Trường | Bắt buộc | Ý nghĩa |
|---|---|---|
| `title` | có | Tiêu đề bài |
| `date` | có | Thời điểm đăng, ví dụ `2026-09-29T07:00:00+07:00` |
| `standfirst` | có | 1–3 câu tóm tắt, hiện trong danh sách và khi chia sẻ |
| `sessionDate` | không | Phiên giao dịch mà bài đề cập |
| `eyebrow` | không | Dòng nhỏ phía trên tiêu đề; mặc định là "Loại bài · Thị trường Việt Nam · ngày" |
| `market` | không | Số liệu phiên (xem bên dưới). Có thì bài hiện dải chỉ số |
| `tags` | không | Danh sách chủ đề |
| `sources` | không | Danh sách nguồn `{ label, url }`, hiện ở cuối bài |
| `revision` | không | Ghi chú sửa đổi, hiện thành thẻ "Cập nhật" |
| `featured` | không | `true` để đưa bài lên vị trí Tiêu điểm trang chủ (nếu là bài mới nhất được đánh dấu) |
| `draft` | không | `true` để giữ bài ở dạng nháp: chỉ hiện khi chạy `npm run dev`, không bao giờ được xuất bản |

**Số trong frontmatter** viết kiểu máy: `1775.09`, `-26.56`, `16681`. Không dùng `1.775,09`. Trang tự hiển thị lại theo kiểu Việt Nam.

Khối `market`:

```yaml
market:
  vnindex: 1775.09        # bắt buộc trong khối
  change: -26.56          # bắt buộc
  changePct: -1.47        # bắt buộc
  volume: 638302592       # cổ phiếu
  valueBn: 16681          # tỷ đồng
  foreignNetBn: -512      # tỷ đồng, âm = bán ròng
  advancers: 118
  decliners: 221
  unchanged: 58
```

Trang chủ lấy số liệu cho dải chỉ số từ **bài tổng kết phiên mới nhất có khối `market`**.

## 3. Viết nội dung

- `## Tiêu đề mục` tạo một mục mới. Mục được tự đánh số La Mã và đưa vào mục lục.
- `### Tiêu đề nhỏ` dùng cho ý phụ trong một mục.
- Bảng Markdown: cột số dùng `---:` để căn phải và dùng font số đều.
- `> **Lưu ý:** …` hiển thị thành hộp nhấn mạnh.
- Danh sách, **chữ đậm**, *chữ nghiêng* và [liên kết](https://example.com) dùng như Markdown thông thường.
- Ảnh: đặt file vào `src/assets/`, chèn bằng `![Mô tả ảnh](../../assets/ten-anh.png)`. Ảnh được tối ưu tự động khi build.

## 4. Thành phần trình bày trong báo cáo (chỉ file `.mdx`)

Bài `.mdx` dùng được các thành phần sau mà **không cần dòng import**:

| Thành phần | Dùng cho |
|---|---|
| `<TickerStrip items={[…]} />` | Dải chỉ số |
| `<Callout tag="…" tone="accent\|warn\|down">…</Callout>` | Hộp nhấn mạnh |
| `<KeyPoints items={['…', '…']} />` | Danh sách điểm chính đánh số |
| `<DataTable caption="…" columns={[…]} rows={[…]} total={[…]} />` | Bảng số liệu |
| `<Matrix caption="…" columns={[…]} rows={[{ label, cells }]} />` | Ma trận tác động `++ + 0 − −−` |
| `<BarChart caption="…" items={[{ label, value }]} unit="%" />` | Biểu đồ thanh ngang |
| `<LevelLadder caption="…" levels={[{ level, label, note, here }]} />` | Bản đồ hỗ trợ / kháng cự |
| `<SectorBlock name="…" verdict="pos\|neu\|neg" drivers={[…]} />` | Nhận định theo ngành |
| `<ScenarioCards scenarios={[{ name, probability, range, body, tone }]} />` | Kịch bản |
| `<RiskList items={[{ name, severity: 'hi'\|'md'\|'lo', text }]} />` | Danh sách rủi ro |
| `<EventCalendar items={[{ date, title, sub }]} />` | Lịch sự kiện |
| `<SourceList items={[{ label, url }]} />` | Danh sách nguồn (thường không cần, trang tự lấy từ `sources`) |

Xem cách dùng đầy đủ trong bài mẫu `src/content/bao-cao/2026-09-27.mdx`.

## 5. Xem trước trên máy

```bash
npm install
npm run dev
```

Mở `http://localhost:4321/dautucungthienquoc/`. Trang tự tải lại mỗi khi bạn lưu file.

Trước khi đăng, chạy kiểm tra:

```bash
npm run check
```

## 6. Đăng bài

Chọn một trong ba cách:

1. **Trên giao diện GitHub:** mở thư mục `src/content/<loại-bài>/` → **Add file → Create new file** (hoặc **Upload files**) → đặt tên file → **Commit changes**.
2. **Bằng Git:** `git add`, `git commit`, `git push` lên nhánh `main`.
3. **Bằng script:** `GITHUB_TOKEN=… npm run publish -- --collection nhan-dinh --file ./2026-09-29.md` (xem `docs/AUTOMATION.md`).

Mọi commit vào `main` đều tự động build và deploy. Bài xuất hiện sau khoảng 1–3 phút. Nếu bài không hiện, xem mục 5 trong `docs/AUTOMATION.md`.

## 7. Sửa hoặc gỡ bài

- **Sửa:** chỉnh file và commit. Nên thêm hoặc cập nhật trường `revision`, ví dụ `revision: "29/09 09:15 — sửa số liệu khối ngoại"`, để người đọc biết bài đã thay đổi.
- **Tạm ẩn:** đặt `draft: true`.
- **Xoá:** xoá file và commit. Lưu ý lịch sử Git vẫn giữ bản cũ.
