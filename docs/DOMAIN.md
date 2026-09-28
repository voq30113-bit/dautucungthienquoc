# Chuyển sang tên miền riêng

Hiện trang chạy tại `https://<tên-người-dùng>.github.io/dautucungthienquoc/`. Chuyển sang tên miền riêng (ví dụ `dautucungthienquoc.vn`) gồm **hai dòng cấu hình**, **một file `CNAME`** và vài bước cài đặt trên GitHub và nhà cung cấp tên miền.

## 1. Sửa hai dòng trong `astro.config.mjs`

```js
const SITE = process.env.SITE_URL || 'https://dautucungthienquoc.vn';
const BASE = process.env.SITE_BASE ?? '';
```

- Dòng 1: địa chỉ gốc của trang (có `https://`, không có dấu `/` ở cuối).
- Dòng 2: đường dẫn con. Với tên miền riêng, trang nằm ở gốc nên để chuỗi rỗng `''`.

Mọi liên kết nội bộ, RSS, sitemap, canonical và Open Graph đều đi qua cấu hình này, nên **không cần sửa template nào khác**.

> Trên GitHub Actions, workflow đã tự lấy địa chỉ và đường dẫn đúng từ `actions/configure-pages`. Việc sửa hai dòng này giữ cho bản build trên máy của bạn khớp với bản chạy thật.

## 2. Tạo file `public/CNAME`

Tạo file `public/CNAME` với **một dòng duy nhất** là tên miền, không có `https://`:

```
dautucungthienquoc.vn
```

## 3. Cấu hình DNS tại nhà cung cấp tên miền

**Tên miền gốc** (ví dụ `dautucungthienquoc.vn`): tạo bốn bản ghi `A` trỏ tới GitHub Pages:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Có thể thêm bốn bản ghi `AAAA` (IPv6):

```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

**Tên miền con `www`**: tạo bản ghi `CNAME` trỏ `www` tới `<tên-người-dùng>.github.io`.

Thay đổi DNS có thể mất vài phút đến 24 giờ để có hiệu lực.

## 4. Khai báo trên GitHub

1. Repository → **Settings → Pages → Custom domain**, nhập tên miền, bấm **Save**.
2. Chờ GitHub kiểm tra DNS xong, bật **Enforce HTTPS**.
3. Khuyến nghị **xác minh tên miền** để tránh người khác chiếm dụng: ảnh đại diện → **Settings → Pages → Add a domain**, làm theo hướng dẫn (thêm một bản ghi `TXT`).

## 5. Commit và kiểm tra

```bash
git add astro.config.mjs public/CNAME
git commit -m "chore: move to custom domain"
git push
```

Sau khi workflow **Deploy** chạy xong, kiểm tra:

- Trang chủ mở được tại tên miền mới, có ổ khoá HTTPS.
- Bấm vài liên kết: không có liên kết nào còn chứa `/dautucungthienquoc/`.
- `https://<tên-miền>/sitemap.xml` và `https://<tên-miền>/rss.xml` hiện địa chỉ mới.
- Địa chỉ cũ `…github.io/dautucungthienquoc/` được GitHub tự chuyển hướng sang tên miền mới.
