# Đầu tư cùng Thiên Quốc

Website nghiên cứu thị trường chứng khoán Việt Nam: nhận định trước phiên, tổng kết phiên, báo cáo vĩ mô hằng tuần và các bài phân tích chuyên sâu. Độc lập, dựa trên dữ liệu công khai.

Trang là web tĩnh, build bằng [Astro](https://astro.build), tìm kiếm bằng [Pagefind](https://pagefind.app) và tự động đăng lên GitHub Pages mỗi khi có commit vào nhánh `main`.

## Chạy trên máy

Yêu cầu: Node.js 24 (xem `.nvmrc`).

```bash
npm ci            # cài thư viện (lần đầu)
npm run dev       # chạy thử tại http://localhost:4321/dautucungthienquoc/
npm run check     # kiểm tra kiểu và nội dung
npm run build     # build bản chính thức vào thư mục dist/ (kèm chỉ mục tìm kiếm)
npm run preview   # xem bản build (tìm kiếm chỉ hoạt động ở bản này)
```

Bài có `draft: true` chỉ hiện khi chạy `npm run dev`.

## Đăng bài

| Cách | Hướng dẫn |
|---|---|
| Tự động từ các scheduled task của Claude | [`docs/AUTOMATION.md`](docs/AUTOMATION.md) |
| Viết tay, commit qua GitHub hoặc Git | [`docs/CONTENT.md`](docs/CONTENT.md) |
| Dòng lệnh: `GITHUB_TOKEN=… npm run publish -- --collection tong-ket --file ./2026-09-29.md` | [`docs/AUTOMATION.md`](docs/AUTOMATION.md#4-đăng-thủ-công-bằng-dòng-lệnh-tuỳ-chọn) |

Ví dụ đầy đủ cho từng loại bài: [`src/content/README.md`](src/content/README.md).

Mọi commit vào `main` chạy workflow **Deploy** (`.github/workflows/deploy.yml`): kiểm tra, build và đăng lên GitHub Pages. Nếu nội dung sai định dạng, build thất bại và **trang cũ vẫn giữ nguyên**.

## Thay logo

Thương hiệu chỉ được vẽ ở **một nơi**: `src/components/Brand.astro`. Mọi template đều dùng component này.

1. Lưu logo tại `src/assets/logo.svg`.
2. Trong `Brand.astro`, thêm `import Logo from '../assets/logo.svg';` vào phần frontmatter.
3. Thay nội dung bên trong `<slot name="mark">…</slot>` bằng:
   `<Logo class="brand-logo" aria-hidden="true" /><span class="sr-only">{vi.site.name}</span>`

Hướng dẫn chi tiết nằm ở đầu file `Brand.astro`. Biểu tượng trên tab trình duyệt là `public/favicon.svg`.

## Thay màu sắc và kiểu chữ

Toàn bộ màu, font và thông số chuyển động nằm trong **`src/styles/tokens.css`**:

- khối `:root { … }`: màu giao diện sáng;
- hai khối giao diện tối (`prefers-color-scheme: dark` và `[data-theme="dark"]`): sửa **cả hai** cho giống nhau;
- các biến `--*-text`: phiên bản màu đậm hơn dùng cho chữ nhỏ, để đạt độ tương phản tối thiểu 4,5:1.

Quy ước màu cố định: `--up` (xanh) cho tăng, `--down` (đỏ) cho giảm, `--warn` (vàng) cho cảnh báo, `--accent` cho liên kết và điểm nhấn.

## Sửa chữ trên giao diện

Mọi chữ hiển thị cho người đọc (menu, nhãn, dòng miễn trừ trách nhiệm, …) nằm trong **`src/i18n/vi.ts`**. Dòng miễn trừ trách nhiệm là `vi.disclaimer.text`, dùng chung cho chân trang, mọi bài viết và RSS.

## Cấu trúc thư mục

```
.github/workflows/deploy.yml   build + deploy lên GitHub Pages
astro.config.mjs               địa chỉ trang (site, base), cấu hình build
scripts/publish.mjs            đăng một file qua GitHub Contents API
scripts/lint-content.mjs       kiểm tra tên file, frontmatter, URL nguồn
src/assets/                    ảnh dùng trong bài
src/components/                Brand, TickerStrip, Callout, DataTable, … (12 thành phần báo cáo)
src/content/                   bài viết: nhan-dinh/ tong-ket/ bao-cao/ phan-tich/
src/content.config.ts          schema (Zod) của các loại bài
src/i18n/vi.ts                 toàn bộ chữ trên giao diện
src/layouts/                   khung trang và khung bài viết
src/pages/                     các trang và RSS, sitemap
src/scripts/                   theme.ts, reveal.ts, countup.ts
src/styles/tokens.css          màu, font, chuyển động
docs/                          AUTOMATION, CONTENT, DOMAIN, ROADMAP
```

## Tài liệu khác

- [`docs/DOMAIN.md`](docs/DOMAIN.md): chuyển sang tên miền riêng.
- [`docs/ROADMAP.md`](docs/ROADMAP.md): mục Danh mục (chưa xây dựng) và các câu hỏi còn mở.

## Miễn trừ trách nhiệm

Nội dung trên trang là phân tích thị trường được tổng hợp từ các nguồn công khai, không phải khuyến nghị đầu tư. Tác giả không phải là nhà tư vấn tài chính được cấp phép.
