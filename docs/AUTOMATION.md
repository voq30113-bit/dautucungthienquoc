# Tự động đăng bài lên website

Các bản tin do những tác vụ định kỳ của Claude viết ra sẽ tự xuất hiện trên website. Hệ thống **không dùng mật khẩu hay token cá nhân nào**.

## Luồng hoạt động

```
4 tác vụ định kỳ hiện có (không bị thay đổi)
  07:00  Nhận định trước phiên ─┐
  07:00  Điểm tin tài chính    ─┤  viết bản tin và gửi email
  16:30  Tổng kết phiên        ─┤  tới vntquoc03@gmail.com
  CN 20:00 Báo cáo vĩ mô tuần  ─┘
                │
                ▼
Tác vụ "Đăng bài lên website" (chạy 07:45 · 17:45 · 21:45 hằng ngày)
  └─ đọc các email bản tin trong 7 ngày gần nhất
  └─ bản tin nào chưa có trên web → chuyển thành bài Markdown
  └─ đẩy lên nhánh content/auto-… qua kết nối GitHub của Claude
                │
                ▼
GitHub Actions "Publish content" (.github/workflows/publish-content.yml)
  └─ chỉ chấp nhận file bài viết trong src/content/<loại-bài>/
  └─ kiểm tra nội dung + build thử
  └─ đạt: gộp vào main, xoá nhánh, chạy Deploy → bài lên web sau 2–4 phút
  └─ không đạt: không gộp, trang cũ giữ nguyên, nhánh được giữ lại để xem lỗi
```

| Email (tiêu đề) | Mục trên website |
|---|---|
| Điểm tin tài chính ngày DD/MM/YYYY | Điểm tin (`/diem-tin/`) |
| Nhận định trước phiên DD/MM/YYYY | Nhận định (`/nhan-dinh/`) |
| Tổng kết phiên DD/MM/YYYY — … | Tổng kết phiên (`/tong-ket/`), kèm dải chỉ số trên trang chủ |
| Báo cáo vĩ mô & TTCK Việt Nam — tuần … | Báo cáo (`/bao-cao/`), phần tóm tắt điều hành |

Mỗi lần chạy, tác vụ đăng bài tự bỏ qua bản tin đã có trên web. Vì vậy nếu một bản tin gửi trễ, lần chạy kế tiếp sẽ đăng bù.

## Vì sao không cần token

Tác vụ "Đăng bài lên website" được gắn sẵn repository `voq30113-bit/dautucungthienquoc`. Claude đẩy nhánh qua kết nối GitHub của tài khoản Claude, không có bí mật nào nằm trong prompt.

Hai lớp bảo vệ:

- Tác vụ chỉ đẩy lên nhánh `content/…`, không ghi trực tiếp vào `main`.
- GitHub Action từ chối mọi nhánh sửa file ngoài thư mục bài viết, hoặc có bài sai định dạng.

## Quản lý tác vụ

Xem, tạm dừng hoặc chạy ngay tác vụ tại **https://claude.ai/code/routines** → "Đăng bài lên website". Mỗi lần chạy có báo cáo ngắn: bài nào đã đẩy, email nào bị bỏ qua và vì sao.

- **Muốn đăng ngay**, không chờ lịch: mở tác vụ → **Run now**.
- **Muốn sửa một bài đã đăng:** sửa file trên GitHub (`src/content/<loại-bài>/<ngày>.md`, biểu tượng bút chì → Commit). Tác vụ sẽ không ghi đè vì file đã tồn tại.
- **Muốn gỡ một bài:** xoá file đó trên GitHub. Lưu ý: nếu email gốc còn trong 7 ngày gần nhất, lần chạy kế tiếp sẽ đăng lại. Muốn ẩn hẳn, sửa thành `draft: true` thay vì xoá.

## Bài không xuất hiện? Kiểm tra theo thứ tự

1. **Email bản tin đã được gửi chưa?** Tìm trong Gmail theo tiêu đề ở bảng trên. Không có email thì tác vụ gốc chưa chạy hoặc bị lỗi.
2. **Tác vụ đăng bài đã chạy chưa?** Mở https://claude.ai/code/routines → "Đăng bài lên website" → xem lần chạy gần nhất và báo cáo của nó.
3. **GitHub Action có đạt không?** Mở tab **Actions** của repository → workflow **Publish content**.
   - ✓ xanh: đã gộp. Kiểm tra tiếp workflow **Deploy** ngay sau đó.
   - ✗ đỏ: bấm vào lần chạy để đọc lỗi. Lỗi thường gặp:

| Thông báo | Nguyên nhân | Cách sửa |
|---|---|---|
| `Only post files under src/content/… are accepted` | Nhánh sửa file ngoài thư mục bài viết | Không gộp. Xoá nhánh đó trên GitHub (tab Branches) |
| `market.vnindex phải là số …` / `Expected type "number"` | Số trong frontmatter viết kiểu `1.775,09` | Sửa thành `1775.09` trên nhánh đó, commit lại: Action tự chạy lại |
| `frontmatter YAML không hợp lệ` | Chuỗi chứa dấu `"` hoặc `:` không đặt trong ngoặc kép | Sửa trên nhánh, commit lại |
| `sources[0].url không hợp lệ` | URL nguồn thiếu `https://` | Sửa hoặc xoá dòng `url` |

Khi một nhánh bị lỗi, trang web hiện tại vẫn hoạt động bình thường.

## Đăng thủ công

Vẫn có thể tự viết bài: xem [`docs/CONTENT.md`](CONTENT.md). Có ba cách: tạo file trực tiếp trên GitHub, dùng `git push`, hoặc đẩy một nhánh `content/<tên>` để đi qua cùng bước kiểm tra tự động.

### Phương án dự phòng: script `npm run publish` với token

`scripts/publish.mjs` ghi một file qua GitHub Contents API, dùng khi bạn muốn đăng từ một máy hoặc dịch vụ khác:

```bash
GITHUB_TOKEN=github_pat_xxx npm run publish -- --collection tong-ket --file ./2026-10-01.md
```

Nếu dùng cách này, hãy tạo **fine-grained personal access token**: GitHub → Settings → Developer settings → Fine-grained tokens. Token chỉ cho repository `dautucungthienquoc`, chỉ quyền **Contents: Read and write**, và có **ngày hết hạn**. Token là bí mật: không dán vào prompt hay nơi người khác đọc được. Xoá token khi không dùng nữa.
