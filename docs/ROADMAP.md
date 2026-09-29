# Lộ trình và các câu hỏi còn mở

## 1. Mục Danh mục đầu tư (`/danh-muc/`)

**Trạng thái: đã giữ chỗ, chưa xây dựng.**

Những gì đã có trong mã nguồn:

- Trang `/danh-muc/` hiển thị thông báo "Đang xây dựng". Trang **không** có trong menu, **không** có trong `sitemap.xml`, có thẻ `noindex` và bị chặn trong `robots.txt`.
- Bản phác thảo schema `danhMuc` (đang để dạng chú thích) trong `src/content.config.ts`, gồm:
  - **holdings:** mã cổ phiếu, số lượng, giá vốn bình quân, ngày mở vị thế;
  - **transactions:** giao dịch mua/bán, phí, lãi/lỗ đã thực hiện;
  - **unrealised:** giá thị trường và lãi/lỗ chưa thực hiện theo mã;
  - **snapshots:** lịch sử giá trị danh mục theo ngày (kèm VN-Index để so sánh), dùng để vẽ đường vốn.

Không có đăng nhập, cơ sở dữ liệu hay backend. Trang vẫn là web tĩnh hoàn toàn.

### Cần quyết định trước khi xây dựng

**Công khai hay riêng tư?** Đây là quyết định chủ trang nên đưa ra **một cách có cân nhắc**, không nên để mặc định:

- Website này là **công khai**. Mọi dữ liệu trong repository (kể cả lịch sử commit) đều có thể bị bất kỳ ai đọc và lưu lại, **kể cả sau khi đã xoá**.
- Công bố **quy mô vị thế thật** (số lượng cổ phiếu, giá trị tiền) cho người khác biết tài sản của bạn. Việc này có thể tạo áp lực khi thị trường biến động, và có thể bị hiểu là khuyến nghị theo danh mục.
- Các phương án có thể cân nhắc:
  1. **Chỉ công bố tỷ trọng (%)** và hiệu suất tương đối so với VN-Index, không công bố số lượng hay giá trị tuyệt đối.
  2. **Công bố trễ**, ví dụ sau khi đã đóng vị thế hoặc theo quý.
  3. **Danh mục mô phỏng** với vốn giả định, tách biệt với tài khoản thật.
  4. **Giữ riêng tư**: đặt ở một repository private khác hoặc chỉ dùng cục bộ, không đưa lên trang này.
- Nếu công bố dưới bất kỳ hình thức nào, cần giữ nguyên dòng miễn trừ trách nhiệm và ghi rõ đây không phải khuyến nghị.

## 2. Các việc còn để ngỏ

- **Logo:** hiện dùng wordmark bằng chữ. Khi có logo SVG, chỉ cần sửa `src/components/Brand.astro` (xem hướng dẫn trong README).
- **Tên miền riêng:** xem `docs/DOMAIN.md`.
- **Ảnh chia sẻ mạng xã hội (Open Graph image):** chưa có. Có thể thêm một ảnh mặc định, hoặc tạo ảnh tự động cho từng bài.
- **Bài mẫu:** ba bài mẫu (và một bản nháp) chỉ dùng để kiểm tra giao diện. Xoá khi đã có bài thật.
- **Token đăng bài tự động:** nhớ xoay vòng token trước ngày hết hạn (xem `docs/AUTOMATION.md`).

## 3. Ngoài phạm vi (theo thiết kế)

Những thứ sau đã được cố ý **không** đưa vào: CMS hoặc trang quản trị, đăng nhập, cơ sở dữ liệu, form đăng ký nhận thư, banner cookie, công cụ phân tích truy cập hoặc bất kỳ trình theo dõi bên thứ ba nào, bình luận, nút chia sẻ mạng xã hội, chatbot, tính năng AI, carousel, video nền, hiệu ứng parallax, ảnh minh hoạ trang trí. Nếu cần bổ sung, hãy cân nhắc lại cả về quyền riêng tư của người đọc lẫn hiệu năng trang.
