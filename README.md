# 🌟 OpenLay - Premium Digital Product Showcase & Admin Platform

Website bán tài khoản số (subscription) cao cấp mang phong cách **Cyber-Clean / Linear / Raycast / Vercel** SaaS aesthetic. Khách hàng lựa chọn gói và bấm **"Mua ngay"** để mở Popup hướng dẫn và liên hệ trực tiếp qua **Zalo**. Hệ thống đi kèm một **Admin Panel** chuyên nghiệp bảo mật cao để quản lý toàn diện nội dung, danh mục, khách hàng và cấu hình shop.

---

## 🚀 Công Nghệ Sử Dụng

- **Framework**: [Next.js 16+ (App Router)](https://nextjs.org) + TypeScript (Strict mode, không dùng `any`)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **Animation**: [Framer Motion](https://www.framer.com/motion/) (Micro-interactions, smooth hover, staggered fade-in)
- **Database & Auth**: [Supabase](https://supabase.com) (PostgreSQL với RLS - Row Level Security)
- **Form Handling & Validation**: [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)
- **Notification**: [Sonner](https://sonner.emilkowal.ski)
- **QR Code**: [qrcode.react](https://github.com/zpao/qrcode.react)
- **Icons**: [Lucide React](https://lucide.dev)

---

## 🎨 Thiết Kế & Trải Nghiệm (UX/UI)

- **Dark Mode mặc định**: Nền gradient nhẹ `#0A0A0F` → `#0F0F1A`, grid pattern mờ và glow effect tinh tế.
- **Accent Gradient**: Violet `#8B5CF6` → Cyan `#06B6D4`.
- **Card Glassmorphism**: Nền kính mờ `backdrop-blur-md`, viền gradient khi hover, scale `1.02`.
- **Nút CTA**: Hiệu ứng Gradient kết hợp viền ánh sáng **Shine Animation**.
- **Không thanh toán online**: Tuyệt đối không tích hợp cổng thanh toán trực tuyến, tập trung 100% vào luồng liên hệ Zalo chốt khách.

---

## 📂 Cấu Trúc Thư Mục

```text
├── app/
│   ├── (site)/
│   │   ├── page.tsx                 # Trang chủ (Hero, Trust, Products, Why Us, FAQ, Footer)
│   │   ├── layout.tsx               # Site layout wrapper
│   │   ├── san-pham/[slug]/page.tsx # Chi tiết sản phẩm (Chuẩn SEO với dynamic metadata)
│   │   └── lien-he/page.tsx         # Trang liên hệ Zalo kèm mã QR Code động
│   ├── admin/
│   │   ├── layout.tsx               # Admin Sidebar & navigation layout
│   │   ├── page.tsx                 # Dashboard tổng quan 4 stat card + 10 khách hàng gần nhất
│   │   ├── actions.ts               # Server Actions (CRUD Products, Categories, Settings, Auth)
│   │   ├── login/page.tsx           # Form đăng nhập quản trị viên (chống public signup)
│   │   ├── products/page.tsx        # Quản lý sản phẩm (Table, Dialog Form, Search, Filter)
│   │   ├── categories/page.tsx      # Quản lý danh mục (CRUD, Icon Lucide)
│   │   ├── customers/page.tsx       # Quản lý khách hàng (Drawer chi tiết, Note, Export CSV)
│   │   └── settings/page.tsx        # Cài đặt số Zalo, Link, Email, Tên shop (Real-time update)
│   ├── globals.css                  # CSS Variables & theme dark mode
│   ├── layout.tsx                   # Root layout, Google Fonts (Inter + Space Grotesk)
│   ├── loading.tsx                  # Loading Skeleton toàn trang
│   ├── error.tsx                    # Error boundary
│   ├── not-found.tsx                # Trang 404 tùy chỉnh
│   ├── robots.ts                    # Dynamic robots.txt
│   └── sitemap.ts                   # Dynamic sitemap.xml
├── components/
│   ├── site/                        # HeroSection, TrustBar, FilterTabs, ProductCard, ZaloModal, WhyUs, FAQ, Footer, ZaloQR
│   ├── admin/                       # AdminSidebar, ProductManager, CategoryManager, CustomerManager, SettingsManager
│   └── ui/                          # shadcn UI components (Button, Dialog, Accordion, Table, Badge,...)
├── lib/
│   ├── supabase/                    # client.ts, server.ts (cookies + static client)
│   ├── validations/                 # Zod Schemas (product, category, settings)
│   ├── types.ts                     # Type definitions chặt chẽ (Product, Category, Customer,...)
│   └── utils.ts                     # formatVND, slugify, formatDate, cn,...
├── middleware.ts                    # Bảo vệ /admin/* bằng Supabase Auth & Email Whitelist
└── supabase_schema.sql              # File SQL khởi tạo toàn bộ bảng, RLS & 10 sản phẩm mẫu
```

---

## 🛠️ Hướng Dẫn Cài Đặt Chi Tiết

### 1. Chuẩn bị biến môi trường `.env.local`

Tạo file `.env.local` tại thư mục gốc (tham khảo `.env.example`):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Danh sách Email Admin được cấp quyền (ngăn cách bởi dấu phẩy)
ADMIN_EMAILS=admin@openlay.vn,your-email@gmail.com

# Số điện thoại Zalo fallback
NEXT_PUBLIC_ZALO_PHONE=0987654321

# Site URL cho SEO và Sitemap
NEXT_PUBLIC_SITE_URL=https://openlay.vn
```

### 2. Thiết lập Database Supabase

1. Đăng nhập vào [Supabase Dashboard](https://supabase.com/dashboard) và tạo project mới.
2. Mở mục **SQL Editor** trong thanh bên trái.
3. Mở file `supabase_schema.sql` có trong mã nguồn dự án, sao chép toàn bộ nội dung và dán vào SQL Editor của Supabase.
4. Bấm nút **RUN**. Script sẽ tự động:
   - Tạo các bảng: `categories`, `products`, `customers`, `site_settings`.
   - Cấu hình **Row Level Security (RLS)** bảo mật chặt chẽ.
   - Thêm sẵn **3 danh mục** chuẩn: *AI & Công việc*, *Giải trí*, *Thiết kế & Video*.
   - Seed đầy đủ **10 sản phẩm mẫu**:
     1. Gemini Advanced 18 Tháng (220.000đ - Khuyến mãi - Ghi chú rủi ro Google quét)
     2. Gemini Advanced 8 Tháng (439.000đ - Best Seller - Bảo hành full 8 tháng)
     3. ChatGPT Go 1 Tháng (230.000đ)
     4. ChatGPT Plus 1 Tháng (370.000đ - Hot)
     5. Netflix 4K Premium 1 Tháng (240.000đ - Hot)
     6. YouTube Premium Family 3 Tháng (300.000đ - Best Seller)
     7. Spotify Premium 3 Tháng (235.000đ)
     8. Canva Pro 12 Tháng (250.000đ - Best Seller)
     9. CapCut Pro 30 Ngày (210.000đ)
     10. Thiết lập mặc định `site_settings` (Zalo, Tên shop, Email).

### 3. Tạo tài khoản Quản trị viên (Admin User)

1. Trong Supabase Dashboard, chuyển tới tab **Authentication** -> **Users**.
2. Bấm **Add user** -> chọn **Create user**.
3. Điền Email (phải trùng với một trong các email đã khai báo trong biến `ADMIN_EMAILS`) và mật khẩu.
4. Bấm **Create user**.
5. Bây giờ bạn có thể đăng nhập vào `/admin/login` bằng tài khoản vừa tạo.

### 4. Chạy ứng dụng trên môi trường Local

```bash
# Cài đặt thư viện (nếu chưa cài)
npm install

# Khởi chạy máy chủ phát triển
npm run dev
```

Mở trình duyệt truy cập:
- Landing Page khách hàng: `http://localhost:3000`
- Bảng điều khiển Admin: `http://localhost:3000/admin`

### 5. Build và Kiểm thử Production

```bash
npm run build
npm run start
```

---

## ⚡ Nghiệm Thu Tiêu Chí Kỹ Thuật

- [x] **Dark Mode mặc định**: Tone màu `#0A0A0F` sang `#0F0F1A`, accent `#8B5CF6` → `#06B6D4`.
- [x] **Đúng thứ tự Landing Page**: Hero Section → Trust Bar (Google, OpenAI, Netflix, Spotify, Canva, CapCut) → Products (Filter tabs) → Why Choose Us → FAQ Accordion → Footer.
- [x] **Zalo Modal**: Icon SVG chuẩn, tự động lấy số và link Zalo từ `site_settings` database, copy số nhanh.
- [x] **Admin Panel đầy đủ**:
  - `/admin`: Dashboard 4 card thống kê + 10 đơn khách gần nhất.
  - `/admin/products`: CRUD đầy đủ, toggle active trực tiếp, search, filter.
  - `/admin/categories`: CRUD danh mục, icon selector, sort order.
  - `/admin/customers`: Danh sách, Drawer chi tiết đổi status & ghi chú, xuất file CSV.
  - `/admin/settings`: Đổi số Zalo, link, tên shop, email không cần deploy lại.
- [x] **Bảo mật**: Middleware chặn `/admin/*`, kiểm tra email whitelist từ `ADMIN_EMAILS`.
- [x] **SEO**: Metadata động theo từng sản phẩm, `sitemap.xml`, `robots.txt`.
- [x] **Next.js 16 Production Build**: Compile thành công 100%, không lỗi TypeScript, không dùng `any`.
