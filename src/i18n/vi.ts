/*
 * Every visitor-facing string on the site. Single source of truth —
 * edit copy here, never inline in templates.
 */
export const vi = {
  site: {
    name: 'Đầu tư cùng Thiên Quốc',
    brandKicker: 'Đầu tư cùng',
    brandName: 'Thiên Quốc',
    author: 'Thiên Quốc',
    tagline: 'Nghiên cứu thị trường chứng khoán Việt Nam độc lập, dựa trên dữ liệu',
    description:
      'Nhận định trước phiên, tổng kết phiên và báo cáo vĩ mô hàng tuần về thị trường chứng khoán Việt Nam. Độc lập, dựa trên dữ liệu công khai.',
    homeLabel: 'Trang chủ',
  },

  disclaimer: {
    title: 'Miễn trừ trách nhiệm',
    text: 'Nội dung trên trang là phân tích thị trường được tổng hợp từ các nguồn thông tin công khai, chỉ nhằm mục đích tham khảo và không phải là khuyến nghị đầu tư. Tác giả không phải là nhà tư vấn tài chính được cấp phép. Mọi quyết định mua, bán hay nắm giữ chứng khoán là của người đọc và người đọc tự chịu trách nhiệm.',
  },

  nav: {
    label: 'Điều hướng chính',
    items: [
      { href: '', label: 'Trang chủ' },
      { href: 'diem-tin/', label: 'Điểm tin' },
      { href: 'nhan-dinh/', label: 'Nhận định' },
      { href: 'tong-ket/', label: 'Tổng kết phiên' },
      { href: 'bao-cao/', label: 'Báo cáo' },
      { href: 'phan-tich/', label: 'Phân tích' },
      { href: 'luu-tru/', label: 'Lưu trữ' },
    ],
  },

  collections: {
    'diem-tin': {
      label: 'Điểm tin',
      singular: 'Điểm tin buổi sáng',
      title: 'Điểm tin tài chính buổi sáng',
      description:
        'Bài điểm tin phát hành lúc 7:00 các ngày giao dịch: thị trường thế giới qua đêm, vĩ mô, doanh nghiệp và những câu chuyện đáng chú ý trước giờ mở cửa.',
    },
    'nhan-dinh': {
      label: 'Nhận định',
      singular: 'Nhận định trước phiên',
      title: 'Nhận định trước phiên',
      description:
        'Ghi chú ngắn phát hành lúc 7:00 các ngày giao dịch: bối cảnh qua đêm, các mốc kỹ thuật và kịch bản cho phiên sắp mở.',
    },
    'tong-ket': {
      label: 'Tổng kết phiên',
      singular: 'Tổng kết phiên',
      title: 'Tổng kết phiên',
      description:
        'Tổng kết phát hành lúc 16:30 các ngày giao dịch: chỉ số, thanh khoản, dòng tiền khối ngoại, độ rộng và các nhóm ngành dẫn dắt.',
    },
    'bao-cao': {
      label: 'Báo cáo',
      singular: 'Báo cáo vĩ mô tuần',
      title: 'Báo cáo vĩ mô tuần',
      description:
        'Báo cáo phát hành 20:00 Chủ nhật: vĩ mô trong và ngoài nước, chính sách, dòng vốn và triển vọng cho tuần giao dịch tiếp theo.',
    },
    'phan-tich': {
      label: 'Phân tích',
      singular: 'Phân tích chuyên sâu',
      title: 'Phân tích chuyên sâu',
      description:
        'Các bài phân tích độc lập về một chủ đề, một ngành hoặc một doanh nghiệp, không theo lịch cố định.',
    },
  },

  ui: {
    skip: 'Chuyển đến nội dung chính',
    search: 'Tìm kiếm',
    themeToLight: 'Chuyển sang giao diện sáng',
    themeToDark: 'Chuyển sang giao diện tối',
    theme: 'Giao diện',
    readingTime: (min: number) => `${min} phút đọc`,
    published: 'Đăng',
    session: 'Phiên',
    data: 'Dữ liệu',
    revision: 'Cập nhật',
    draft: 'Bản nháp',
    toc: 'Mục lục',
    sources: 'Nguồn tham khảo',
    prev: 'Bài trước',
    next: 'Bài sau',
    seeAll: 'Xem tất cả',
    readMore: 'Đọc bài',
    latest: 'Mới nhất',
    empty: 'Chưa có bài viết nào trong mục này.',
    pagePrev: 'Trang trước',
    pageNext: 'Trang sau',
    pageOf: (n: number, total: number) => `Trang ${n} / ${total}`,
    pagination: 'Phân trang',
    backHome: 'Về trang chủ',
    breadcrumb: 'Vị trí',
    tags: 'Chủ đề',
    progress: 'Tiến độ đọc',
    rss: 'RSS',
    sitemap: 'Sơ đồ trang',
    marketVietnam: 'Thị trường Việt Nam',
    today: 'Hôm nay',
  },

  home: {
    heading: 'Đầu tư cùng Thiên Quốc — Nghiên cứu thị trường chứng khoán Việt Nam',
    tickerCaption: (session: string) => `Chốt phiên ${session}`,
    tickerSource: 'Theo bài tổng kết phiên mới nhất',
    lead: 'Tiêu điểm',
    daily: 'Bản tin hằng ngày',
    weekly: 'Báo cáo tuần',
    weeklyPrevious: 'Báo cáo tuần trước',
    archive: 'Mới cập nhật',
    archiveAll: 'Toàn bộ lưu trữ',
    noTicker: 'Chưa có số liệu phiên. Dữ liệu sẽ hiển thị khi có bài tổng kết phiên đầu tiên.',
  },

  ticker: {
    label: 'Số liệu thị trường',
    vnindex: 'VN-Index',
    change: 'Thay đổi',
    volume: 'Khối lượng',
    value: 'Giá trị GD',
    foreign: 'Khối ngoại ròng',
    breadth: 'Độ rộng',
    close: 'Điểm đóng cửa',
    points: 'điểm',
    millionShares: 'triệu cp',
    bn: 'tỷ đồng',
    netBuy: 'mua ròng',
    netSell: 'bán ròng',
    advDec: 'tăng / giảm',
    unchanged: (n: string) => `${n} đứng giá`,
  },

  components: {
    verdict: { pos: 'Tích cực', neu: 'Trung lập', neg: 'Tiêu cực' },
    severity: { hi: 'Cao', md: 'Trung bình', lo: 'Thấp' },
    probability: 'Xác suất',
    matrixLegend: [
      ['++', 'Tác động tích cực mạnh'],
      ['+', 'Tích cực'],
      ['0', 'Trung tính'],
      ['−', 'Tiêu cực'],
      ['−−', 'Tác động tiêu cực mạnh'],
    ] as const,
    current: 'Hiện tại',
    level: 'Mức',
    keyPoints: 'Điểm chính',
    date: 'Ngày',
    event: 'Sự kiện',
  },

  archive: {
    title: 'Lưu trữ',
    description: 'Toàn bộ bài viết theo thứ tự thời gian. Lọc theo loại bài và theo tháng.',
    filterType: 'Loại bài',
    filterMonth: 'Tháng',
    all: 'Tất cả',
    allMonths: 'Mọi tháng',
    count: (n: number) => `${n} bài`,
    none: 'Không có bài nào khớp bộ lọc.',
    month: (m: number, y: number) => `Tháng ${m}/${y}`,
  },

  search: {
    title: 'Tìm kiếm',
    description: 'Tìm trong toàn bộ nhận định, tổng kết phiên, báo cáo và phân tích.',
    label: 'Từ khoá',
    placeholder: 'Ví dụ: tỷ giá, khối ngoại, ngân hàng',
    submit: 'Tìm',
    idle: 'Nhập từ khoá để bắt đầu tìm kiếm.',
    loading: 'Đang tìm…',
    none: 'Không tìm thấy kết quả phù hợp.',
    results: (n: number) => `${n} kết quả`,
    unavailable: 'Chỉ mục tìm kiếm được tạo khi build. Hãy chạy npm run build rồi npm run preview để thử tìm kiếm.',
    noscript: 'Tìm kiếm cần JavaScript. Bạn có thể duyệt toàn bộ bài viết trong mục Lưu trữ.',
  },

  notFound: {
    title: 'Không tìm thấy trang',
    body: 'Trang bạn tìm không tồn tại hoặc đã được chuyển sang địa chỉ khác.',
    hint: 'Bạn có thể quay về trang chủ, xem lưu trữ hoặc dùng tìm kiếm.',
  },

  portfolio: {
    title: 'Danh mục',
    eyebrow: 'Đang xây dựng',
    body: 'Mục danh mục đầu tư đang trong giai đoạn chuẩn bị và chưa được công bố.',
  },

  sample: {
    note: 'Bài mẫu để kiểm tra giao diện. Số liệu trong bài là giả định, không phải dữ liệu thị trường thực tế đã công bố. Hãy thay thế bài này bằng nội dung thật.',
  },

  footer: {
    rights: (y: number) => `© ${y} Đầu tư cùng Thiên Quốc`,
    schedule: 'Lịch xuất bản: 7:00 và 16:30 các ngày giao dịch, 20:00 Chủ nhật.',
    feeds: 'Theo dõi',
  },
} as const;

export type CollectionKey = keyof typeof vi.collections;
