# Ví dụ bài viết cho từng loại

Sao chép một ví dụ dưới đây vào file mới trong đúng thư mục, sửa nội dung, rồi commit. Hướng dẫn chi tiết xem [`docs/CONTENT.md`](../../docs/CONTENT.md).

Lưu ý chung:

- Tên file: `YYYY-MM-DD.md` (thêm `-slug-khong-dau` nếu cùng ngày đã có bài cùng loại).
- Số trong frontmatter viết kiểu máy (`1775.09`); số trong nội dung viết kiểu Việt Nam (`1.775,09`).
- Chuỗi trong frontmatter đặt trong ngoặc kép.
- Số liệu trong các ví dụ dưới đây là **giả định**, chỉ để minh hoạ.

---

## 1. Nhận định trước phiên — `src/content/nhan-dinh/2026-09-29.md`

```markdown
---
title: "Hồi phục kỹ thuật có thể xuất hiện, vùng 1.790 là thử thách đầu tiên"
date: 2026-09-29T07:00:00+07:00
sessionDate: 2026-09-29
standfirst: "Chứng khoán Mỹ tăng qua đêm và tỷ giá hạ nhiệt tạo điều kiện cho một phiên hồi phục. Vùng 1.790 điểm là kháng cự gần cần vượt qua với thanh khoản tốt."
tags: ["VN-Index", "kỹ thuật"]
sources:
  - label: "HOSE — Thống kê giao dịch phiên 28/09/2026"
    url: "https://www.hsx.vn"
  - label: "Ngân hàng Nhà nước — Tỷ giá trung tâm"
    url: "https://www.sbv.gov.vn"
---

## Bối cảnh qua đêm

- Chỉ số S&P 500 tăng 0,8%.
- Chỉ số DXY giảm về 101,2 điểm.

## Các mốc kỹ thuật

| Mốc | Mức (điểm) | Ghi chú |
|---|---:|---|
| Kháng cự gần | 1.790 | Vùng bán chủ động tuần trước |
| Hỗ trợ gần | 1.762 | Đáy tháng 9 |

## Kịch bản cho phiên hôm nay

> **Kịch bản cơ sở:** hồi phục nhẹ trong biên 1.770–1.795 điểm.
```

---

## 2. Tổng kết phiên — `src/content/tong-ket/2026-09-29.md`

Khối `market` cung cấp số liệu cho dải chỉ số ở đầu bài và trên trang chủ.

```markdown
---
title: "VN-Index hồi phục 14 điểm, thanh khoản giảm về mức trung bình"
date: 2026-09-29T16:30:00+07:00
sessionDate: 2026-09-29
standfirst: "Lực cầu bắt đáy ở nhóm ngân hàng giúp VN-Index lấy lại 14,2 điểm. Thanh khoản giảm cho thấy lực bán đã chậm lại."
tags: ["VN-Index", "thanh khoản"]
market:
  vnindex: 1789.31
  change: 14.22
  changePct: 0.80
  volume: 512480300
  valueBn: 13240
  foreignNetBn: 86
  advancers: 246
  decliners: 104
  unchanged: 47
sources:
  - label: "HOSE — Thống kê giao dịch cuối ngày"
    url: "https://www.hsx.vn"
---

## Diễn biến chỉ số

VN-Index tăng 14,22 điểm (+0,80%) lên 1.789,31 điểm.

## Thanh khoản và dòng tiền

| Chỉ tiêu | Phiên 29/09 | Trung bình 20 phiên |
|---|---:|---:|
| Giá trị (tỷ đồng) | 13.240 | 13.920 |
| Khối ngoại ròng (tỷ đồng) | +86 | −138 |
```

---

## 3. Báo cáo vĩ mô tuần — `src/content/bao-cao/2026-10-04.mdx`

File `.mdx` dùng được các thành phần trình bày mà không cần dòng `import`. Danh sách đầy đủ các thành phần nằm trong `docs/CONTENT.md`.

```mdx
---
title: "Dòng vốn ngoại quay lại khi tỷ giá ổn định"
date: 2026-10-04T20:00:00+07:00
sessionDate: 2026-10-02
standfirst: "Tỷ giá ổn định giúp khối ngoại mua ròng trở lại sau ba tuần. Tuần tới, số liệu vĩ mô quý III sẽ là trọng tâm."
eyebrow: "Báo cáo vĩ mô tuần · Tuần 41/2026 · Dữ liệu đến 02/10/2026"
tags: ["vĩ mô", "khối ngoại"]
sources:
  - label: "Tổng cục Thống kê"
    url: "https://www.gso.gov.vn"
---

## Tóm tắt

<KeyPoints items={[
  'VN-Index tăng 1,2% trong tuần.',
  'Khối ngoại mua ròng 640 tỷ đồng trên HOSE.',
]} />

<Callout tag="Luận điểm chính">
  Tỷ giá ổn định là điều kiện cần để dòng vốn ngoại quay lại.
</Callout>

## Kịch bản tuần tới

<ScenarioCards scenarios={[
  { name: 'Tích cực', probability: 30, range: '1.820 – 1.860', tone: 'pos', body: 'Số liệu quý III tốt hơn kỳ vọng.' },
  { name: 'Cơ sở', probability: 50, range: '1.780 – 1.820', tone: 'neu', body: 'Tích luỹ, phân hoá theo ngành.' },
  { name: 'Tiêu cực', probability: 20, range: '1.740 – 1.780', tone: 'neg', body: 'Đô la Mỹ mạnh trở lại.' },
]} />

## Lịch sự kiện

<EventCalendar items={[
  { date: '06/10', title: 'Số liệu kinh tế quý III', sub: 'Tổng cục Thống kê' },
]} />
```

---

## 4. Phân tích chuyên sâu — `src/content/phan-tich/2026-10-08-nhom-ngan-hang-quy-iii.mdx`

```mdx
---
title: "Nhóm ngân hàng trước mùa báo cáo quý III: biên lãi thuần là biến số chính"
date: 2026-10-08T09:00:00+07:00
standfirst: "Chi phí vốn tăng nhẹ trong quý III có thể làm biên lãi thuần thu hẹp, bù lại bằng tăng trưởng tín dụng tốt."
tags: ["ngân hàng", "lợi nhuận quý III"]
featured: true
sources:
  - label: "Báo cáo tài chính quý II/2026 của các ngân hàng niêm yết"
---

## Câu hỏi đặt ra

Tăng trưởng tín dụng có đủ bù cho biên lãi thuần thu hẹp không?

<DataTable
  caption="Biên lãi thuần (NIM) theo quý (%)"
  columns={[{ label: 'Nhóm' }, { label: 'Q1', num: true, decimals: 2 }, { label: 'Q2', num: true, decimals: 2 }]}
  rows={[
    ['Quốc doanh', 2.85, 2.79],
    ['Tư nhân lớn', 3.95, 3.88],
  ]}
/>

<SectorBlock
  name="Ngân hàng"
  verdict="neu"
  drivers={[
    { key: 'Tín dụng', text: 'Tăng trưởng tốt theo mùa vụ cuối năm.' },
    { key: 'Biên lãi', text: 'Chịu áp lực từ chi phí vốn.' },
  ]}
/>

## Kết luận

Kết luận và giới hạn của phân tích.
```
