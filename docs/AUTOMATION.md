# Tự động đăng bài từ các scheduled task

Tài liệu này hướng dẫn cách để các scheduled task của Claude tự đăng bài lên trang. Có bốn task: 7:00 và 16:30 các ngày giao dịch, 20:00 Chủ nhật, và phân tích chuyên sâu khi cần.

## Luồng hoạt động

```
Scheduled task (Claude)
  └─ tạo file Markdown có frontmatter
  └─ PUT https://api.github.com/repos/{owner}/{repo}/contents/src/content/{loại-bài}/{tên-file}
        │  (commit thẳng vào nhánh main)
        ▼
GitHub Actions (.github/workflows/deploy.yml)
  └─ npm ci → npm run check → npm run build → deploy lên GitHub Pages
        ▼
Bài mới xuất hiện trên trang sau khoảng 1–3 phút
```

Nếu file sai định dạng, bước `check` hoặc `build` sẽ thất bại. Khi đó **không có gì được deploy** và trang cũ vẫn hoạt động bình thường.

---

## 1. Chuẩn bị repository (làm một lần)

1. Repository phải ở chế độ **Public** (GitHub Pages miễn phí yêu cầu public, trừ khi bạn dùng gói trả phí).
2. Vào **Settings → Pages → Build and deployment → Source**, chọn **GitHub Actions**.
3. Vào **Actions**, kiểm tra workflow **Deploy** đã chạy thành công ít nhất một lần.

## 2. Tạo fine-grained personal access token

Token này cho phép scheduled task ghi file vào repository. Hãy tạo token có quyền **hẹp nhất có thể**.

1. Đăng nhập GitHub, bấm ảnh đại diện → **Settings**.
2. Cuộn xuống cuối menu trái → **Developer settings**.
3. **Personal access tokens → Fine-grained tokens → Generate new token**.
4. Điền:
   - **Token name:** `dang-bai-tu-dong` (hoặc tên tuỳ ý dễ nhận biết).
   - **Expiration:** chọn một ngày cụ thể, ví dụ **90 ngày**. Không chọn "No expiration".
   - **Resource owner:** tài khoản của bạn.
   - **Repository access:** chọn **Only select repositories** → chọn đúng **dautucungthienquoc**.
5. Mục **Permissions → Repository permissions**:
   - **Contents: Read and write**.
   - **Metadata: Read-only** được GitHub tự thêm và bắt buộc. Để nguyên.
   - **Không cấp bất kỳ quyền nào khác.** Không cấp Account permissions.
6. Bấm **Generate token** và sao chép token (bắt đầu bằng `github_pat_…`). GitHub chỉ hiển thị token **một lần**.
7. Ghi lại ngày hết hạn vào lịch để nhớ tạo token mới trước ngày đó.

### Đánh đổi về bảo mật, cần nói rõ

Token sẽ nằm **dưới dạng văn bản đọc được** trong cấu hình của scheduled task. Bất kỳ ai xem được cấu hình task đều đọc được token. Hiện chưa có cơ chế lưu bí mật nào khác cho scheduled task, và tài liệu này không giả định có.

Vì vậy token **bắt buộc** phải:

- **fine-grained** (không dùng token classic),
- **chỉ cho một repository** này,
- **chỉ có quyền Contents**,
- **có ngày hết hạn**.

Với các giới hạn đó, trường hợp xấu nhất nếu token bị lộ là người khác có thể commit vào **một** repository nội dung công khai này. Họ không truy cập được repository khác, không xoá được tài khoản, không đọc được dữ liệu riêng tư. Mọi commit đều hiện trong lịch sử Git và có thể hoàn tác.

**Xoay vòng token theo lịch hết hạn:** trước ngày hết hạn, tạo token mới theo đúng các bước trên, thay vào cả bốn task, rồi xoá token cũ tại **Settings → Developer settings → Fine-grained tokens**. Nếu nghi token bị lộ, xoá ngay token đó và tạo token mới.

---

## 3. Khối lệnh thêm vào cuối prompt của từng scheduled task

Sao chép **nguyên văn** khối tương ứng và dán vào **cuối** prompt hiện có của từng task. Thay:

- `<<OWNER>>` bằng tên người dùng GitHub của bạn,
- `<<TOKEN>>` bằng token vừa tạo.

Nếu bạn đổi tên repository, thay luôn `dautucungthienquoc`.

### Phần chung (dùng trong cả bốn khối bên dưới)

Mỗi khối A–D đã chứa sẵn phần này, bạn không cần dán riêng.

```text
=== ĐĂNG BÀI LÊN WEBSITE ===
Sau khi hoàn thành nội dung, hãy đăng bài lên website bằng GitHub Contents API.

1) Soạn MỘT file Markdown thuần (không dùng component, không dùng JSX, không dùng HTML).
   File bắt đầu bằng khối frontmatter YAML giữa hai dòng ---, sau đó là nội dung.
   Quy tắc frontmatter:
   - Chuỗi luôn đặt trong dấu ngoặc kép "…". Trong chuỗi không dùng dấu " (dùng ‘ ’ hoặc « » thay thế).
   - Số trong frontmatter viết kiểu máy: dấu chấm thập phân, KHÔNG có dấu phân cách hàng nghìn
     (đúng: 1775.09, 16681, -26.56; sai: 1.775,09).
   - date ghi đầy đủ giờ Việt Nam, ví dụ 2026-09-29T07:00:00+07:00.
   - sources: mỗi nguồn có label; url (nếu có) phải là địa chỉ đầy đủ bắt đầu bằng https://.
   - Không thêm trường nào ngoài các trường trong mẫu.
   Quy tắc nội dung:
   - Chia mục bằng tiêu đề cấp 2 (## Tiêu đề). Website tự đánh số La Mã cho các mục.
   - Bảng Markdown được phép; cột số căn phải bằng ---: ; số trong nội dung viết kiểu Việt Nam (1.775,09).
   - Đoạn nhấn mạnh dùng blockquote (> **Lưu ý:** …).
   - Không chèn lời khuyên mua/bán.

2) Tên file: YYYY-MM-DD.md theo ngày quy định bên dưới (chỉ chữ thường, số và dấu gạch ngang).
   Nếu đã có một bài cùng loại trong ngày và đây là bài KHÁC, dùng YYYY-MM-DD-slug-khong-dau.md.

3) Đăng bằng API (ví dụ dùng curl):
   OWNER="<<OWNER>>"; REPO="dautucungthienquoc"; TOKEN="<<TOKEN>>"
   PATH_IN_REPO="src/content/<LOẠI-BÀI>/<TÊN-FILE>"
   API="https://api.github.com/repos/$OWNER/$REPO/contents/$PATH_IN_REPO"
   a) Lấy sha nếu file đã tồn tại (để ghi đè thay vì báo lỗi):
      curl -s -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" "$API?ref=main"
      → nếu trả về 200, lấy giá trị "sha"; nếu 404, file chưa có (không cần sha).
   b) Gửi file (nội dung mã hoá base64, không xuống dòng):
      curl -s -X PUT -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" "$API" \
        -d '{"message":"content(<LOẠI-BÀI>): <TÊN-FILE>","branch":"main","content":"<BASE64>","sha":"<SHA-nếu-có>"}'
      (bỏ hẳn trường "sha" nếu file chưa tồn tại)
   c) Nếu nhận mã 409 hoặc 422: làm lại bước a) để lấy sha mới nhất rồi gửi lại bước b) MỘT lần.
   d) Nếu nhận 401: token sai hoặc hết hạn. Nếu 403/404: token thiếu quyền Contents. Dừng và báo lỗi.
   e) Thành công (200 hoặc 201): báo lại đường dẫn commit trong trường commit.html_url.

4) Cuối cùng, báo lại: tên file, mã HTTP, đường dẫn commit.
   Nhắc rằng bài sẽ hiện trên web sau 1–3 phút nếu bước build trên GitHub Actions thành công.
=== HẾT PHẦN ĐĂNG BÀI ===
```

### A. Task 7:00 — Nhận định trước phiên

Loại bài: `nhan-dinh`. Tên file: ngày giao dịch hôm nay.

```text
=== ĐĂNG BÀI LÊN WEBSITE (Nhận định trước phiên) ===
Sau khi hoàn thành bản nhận định, hãy đăng lên website.
LOẠI-BÀI = nhan-dinh
TÊN-FILE = <ngày hôm nay theo giờ Việt Nam, dạng YYYY-MM-DD>.md

Frontmatter mẫu (điền giá trị thật, giữ đúng cấu trúc):
---
title: "<tiêu đề ngắn, nêu luận điểm chính>"
date: <YYYY-MM-DD>T07:00:00+07:00
sessionDate: <YYYY-MM-DD của phiên giao dịch hôm nay>
standfirst: "<1–3 câu tóm tắt>"
tags: ["VN-Index", "<chủ đề>"]
sources:
  - label: "<tên nguồn>"
    url: "https://<địa chỉ nguồn>"
---

Quy tắc soạn và đăng: làm đúng theo "Phần chung" dưới đây.
<DÁN TOÀN BỘ KHỐI "PHẦN CHUNG" VÀO ĐÂY>
```

### B. Task 16:30 — Tổng kết phiên

Loại bài: `tong-ket`. Bài tổng kết là **nguồn số liệu cho dải chỉ số trên trang chủ**, nên phải có khối `market`.

```text
=== ĐĂNG BÀI LÊN WEBSITE (Tổng kết phiên) ===
Sau khi hoàn thành bản tổng kết, hãy đăng lên website.
LOẠI-BÀI = tong-ket
TÊN-FILE = <ngày của phiên vừa đóng cửa, dạng YYYY-MM-DD>.md

Frontmatter mẫu (điền giá trị thật, giữ đúng cấu trúc):
---
title: "<tiêu đề>"
date: <YYYY-MM-DD>T16:30:00+07:00
sessionDate: <YYYY-MM-DD của phiên>
standfirst: "<1–3 câu tóm tắt>"
tags: ["VN-Index", "<chủ đề>"]
market:
  vnindex: <điểm đóng cửa, ví dụ 1775.09>
  change: <thay đổi điểm, ví dụ -26.56>
  changePct: <thay đổi %, ví dụ -1.47>
  volume: <khối lượng khớp lệnh HOSE (cổ phiếu), ví dụ 638302592>
  valueBn: <giá trị giao dịch, tỷ đồng, ví dụ 16681>
  foreignNetBn: <khối ngoại ròng, tỷ đồng, âm = bán ròng, ví dụ -512>
  advancers: <số mã tăng>
  decliners: <số mã giảm>
  unchanged: <số mã đứng giá>
sources:
  - label: "<tên nguồn>"
    url: "https://<địa chỉ nguồn>"
---
Các trường trong market chỉ có vnindex, change, changePct là bắt buộc. Bỏ hẳn dòng nào không có số liệu, đừng ghi 0 hay null.

Quy tắc soạn và đăng: làm đúng theo "Phần chung" dưới đây.
<DÁN TOÀN BỘ KHỐI "PHẦN CHUNG" VÀO ĐÂY>
```

### C. Task Chủ nhật 20:00 — Báo cáo vĩ mô tuần

Loại bài: `bao-cao`. Task tự động vẫn viết **Markdown thuần** (đuôi `.md`), không dùng component.

```text
=== ĐĂNG BÀI LÊN WEBSITE (Báo cáo vĩ mô tuần) ===
Sau khi hoàn thành báo cáo tuần, hãy đăng lên website.
LOẠI-BÀI = bao-cao
TÊN-FILE = <ngày Chủ nhật hôm nay, dạng YYYY-MM-DD>.md

Frontmatter mẫu (điền giá trị thật, giữ đúng cấu trúc):
---
title: "<tiêu đề>"
date: <YYYY-MM-DD>T20:00:00+07:00
sessionDate: <YYYY-MM-DD của phiên giao dịch cuối cùng trong tuần>
standfirst: "<1–3 câu tóm tắt luận điểm chính của tuần>"
eyebrow: "Báo cáo vĩ mô tuần · Tuần <số tuần>/<năm> · Dữ liệu đến <DD/MM/YYYY>"
tags: ["vĩ mô", "<chủ đề>"]
sources:
  - label: "<tên nguồn>"
    url: "https://<địa chỉ nguồn>"
---
Gợi ý các mục: ## Tóm tắt, ## Bức tranh vĩ mô, ## Tác động theo ngành, ## Bản đồ kỹ thuật, ## Kịch bản tuần tới, ## Rủi ro cần theo dõi, ## Lịch sự kiện.

Quy tắc soạn và đăng: làm đúng theo "Phần chung" dưới đây.
<DÁN TOÀN BỘ KHỐI "PHẦN CHUNG" VÀO ĐÂY>
```

### D. Task thứ tư — Phân tích chuyên sâu (nếu có)

Loại bài: `phan-tich`. Vì có thể có nhiều bài trong một ngày, luôn thêm slug vào tên file.

```text
=== ĐĂNG BÀI LÊN WEBSITE (Phân tích chuyên sâu) ===
LOẠI-BÀI = phan-tich
TÊN-FILE = <YYYY-MM-DD>-<slug-khong-dau-viet-thuong>.md   (ví dụ 2026-10-03-dong-von-ngoai-va-ty-gia.md)

Frontmatter mẫu:
---
title: "<tiêu đề>"
date: <YYYY-MM-DD>T<HH:MM>:00+07:00
standfirst: "<1–3 câu tóm tắt>"
tags: ["<chủ đề>"]
sources:
  - label: "<tên nguồn>"
    url: "https://<địa chỉ nguồn>"
---

Quy tắc soạn và đăng: làm đúng theo "Phần chung" dưới đây.
<DÁN TOÀN BỘ KHỐI "PHẦN CHUNG" VÀO ĐÂY>
```

> **Cách ghép:** với mỗi task, dán khối A/B/C/D tương ứng, rồi thay dòng `<DÁN TOÀN BỘ KHỐI "PHẦN CHUNG" VÀO ĐÂY>` bằng nội dung khối **Phần chung** ở trên (đã điền OWNER và TOKEN).

---

## 4. Đăng thủ công bằng dòng lệnh (tuỳ chọn)

Trên máy đã cài Node:

```bash
GITHUB_TOKEN=github_pat_xxx npm run publish -- --collection tong-ket --file ./2026-09-29.md
```

Script `scripts/publish.mjs` tự tìm `sha` khi file đã tồn tại (chạy lại sẽ cập nhật thay vì báo lỗi), thử lại một lần khi có xung đột, và in đường dẫn commit. Thêm `--dry-run` để kiểm tra mà không ghi.

---

## 5. Bài không xuất hiện trên trang? Kiểm tra theo thứ tự

1. **Commit có vào repository chưa?** Mở repository → thư mục `src/content/<loại-bài>/`. Nếu không thấy file, task chưa gửi được. Xem lại mã HTTP mà task báo:
   - 401: token sai hoặc hết hạn. Tạo token mới.
   - 403 hoặc 404: token không có quyền Contents: Read and write, hoặc không được cấp cho repository này.
   - 409 hoặc 422: xung đột `sha`. Task phải lấy lại sha và gửi lại.
2. **Build có thành công không?** Mở tab **Actions** → workflow **Deploy** mới nhất.
   - Dấu ✓ xanh: đã deploy. Chờ 1–2 phút rồi tải lại trang (Ctrl+F5).
   - Dấu ✗ đỏ: bấm vào lần chạy → job **build** → bước bị đỏ (**Check** hoặc **Build**) để đọc thông báo lỗi.
3. **Đọc thông báo lỗi schema.** Ví dụ thường gặp:

| Thông báo | Nguyên nhân | Cách sửa |
|---|---|---|
| `market.vnindex phải là số …` hoặc `Expected type "number", received "string"` | Viết số kiểu Việt Nam trong frontmatter (`1.775,09`) | Viết `1775.09` |
| `sources[0].url không hợp lệ` hoặc `Invalid URL` | url thiếu `https://` hoặc có khoảng trắng | Sửa thành địa chỉ đầy đủ |
| `frontmatter YAML không hợp lệ` | Chuỗi chứa dấu `:` hoặc `"` mà không đặt trong ngoặc kép | Đặt chuỗi trong `"…"`, không dùng `"` bên trong |
| `thiếu trường bắt buộc "standfirst"` | Thiếu trường | Thêm trường |
| `tên file phải có dạng YYYY-MM-DD…` | Tên file có dấu, chữ hoa hoặc khoảng trắng | Đổi tên theo quy tắc |
| `Unrecognized key` | Thêm trường không có trong mẫu | Xoá trường đó |

4. **Sửa lỗi:** mở file trên GitHub (biểu tượng bút chì), sửa, rồi **Commit changes**. Commit mới tự động build lại. Trong lúc bị lỗi, trang cũ vẫn hoạt động bình thường.
5. **Bài có `draft: true`?** Bài nháp không bao giờ được xuất bản. Đổi thành `draft: false`.
