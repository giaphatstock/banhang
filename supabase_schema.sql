-- ============================================================
-- OPENLAY - Schema SQL đầy đủ
-- Chạy trong Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- BẢNG: categories
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT, -- tên icon lucide
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BẢNG: products
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  benefits JSONB, -- mảng string các quyền lợi
  price NUMERIC NOT NULL,
  original_price NUMERIC, -- giá gốc (optional, để gạch ngang)
  duration TEXT, -- ví dụ "18 tháng"
  warranty TEXT, -- ví dụ "Bảo hành 7 ngày"
  badge TEXT, -- "Best Seller" | "Hot" | "Khuyến mãi"
  note TEXT, -- lưu ý riêng
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- BẢNG: customers
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  zalo TEXT,
  phone TEXT,
  note TEXT,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'closed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BẢNG: site_settings (single row hoặc key-value)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Bật RLS cho tất cả bảng
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- CATEGORIES: public SELECT (chỉ active), admin full access
CREATE POLICY "categories_public_select" ON categories
  FOR SELECT TO anon, authenticated
  USING (true); -- tất cả categories hiển thị (filter active ở app layer)

CREATE POLICY "categories_admin_insert" ON categories
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "categories_admin_update" ON categories
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "categories_admin_delete" ON categories
  FOR DELETE TO authenticated
  USING (true);

-- PRODUCTS: public SELECT (chỉ is_active = true), admin full access
CREATE POLICY "products_public_select" ON products
  FOR SELECT TO anon
  USING (is_active = true);

CREATE POLICY "products_authenticated_select" ON products
  FOR SELECT TO authenticated
  USING (true); -- admin thấy tất cả kể cả inactive

CREATE POLICY "products_admin_insert" ON products
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "products_admin_update" ON products
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "products_admin_delete" ON products
  FOR DELETE TO authenticated
  USING (true);

-- CUSTOMERS: chỉ authenticated (admin)
CREATE POLICY "customers_admin_all" ON customers
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- SITE_SETTINGS: public SELECT, authenticated INSERT/UPDATE
CREATE POLICY "site_settings_public_select" ON site_settings
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "site_settings_admin_insert" ON site_settings
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "site_settings_admin_update" ON site_settings
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- GRANT quyền truy cập Data API
-- ============================================================
GRANT SELECT ON categories TO anon, authenticated;
GRANT ALL ON categories TO authenticated;

GRANT SELECT ON products TO anon;
GRANT ALL ON products TO authenticated;

GRANT ALL ON customers TO authenticated;

GRANT SELECT ON site_settings TO anon, authenticated;
GRANT ALL ON site_settings TO authenticated;

-- ============================================================
-- SEED DATA: 3 danh mục
-- ============================================================
INSERT INTO categories (id, name, slug, icon, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'AI & Công việc', 'ai-cong-viec', 'BrainCircuit', 1),
  ('22222222-2222-2222-2222-222222222222', 'Giải trí', 'giai-tri', 'Tv', 2),
  ('33333333-3333-3333-3333-333333333333', 'Thiết kế & Video', 'thiet-ke-video', 'Palette', 3)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED DATA: 10 sản phẩm
-- ============================================================
INSERT INTO products (
  name, slug, category_id, description, benefits,
  price, original_price, duration, warranty, badge,
  note, is_active, is_featured, sort_order
) VALUES
-- 1. Gemini Pro 18 tháng
(
  'Gemini Pro + 5TB Google Drive (18 Tháng)',
  'gemini-pro-5tb-google-drive-18-thang',
  '11111111-1111-1111-1111-111111111111',
  'Nâng cấp chính chủ qua Family Link, mở khóa trọn bộ tính năng Gemini Pro kèm 5TB Google Drive lưu trữ tốc độ cao.',
  '["Mở khóa trọn bộ tính năng Gemini Pro", "Tặng kèm 5TB (5.000GB) dung lượng Google Drive", "Nâng cấp chính chủ qua lời mời nhóm Family Link", "Hoạt động độc lập, bảo mật dữ liệu tuyệt đối", "Nhận link tham gia & kiểm tra OK mới thanh toán"]',
  220000, 350000,
  '18 tháng', 'Bảo hành 7 ngày đầu', 'Khuyến mãi',
  'Không nhận Gmail mới tạo. Đây là gói khuyến mại từ Google nên không cam kết dùng trọn 18 tháng (có rủi ro Google quét về Free), cam kết không kick thành viên.',
  true, true, 1
),
-- 2. Gemini Pro 8 tháng
(
  'Gemini Pro + 5TB Google Drive (8 Tháng)',
  'gemini-pro-5tb-google-drive-8-thang',
  '11111111-1111-1111-1111-111111111111',
  'Gói nâng cấp chính chủ ổn định cao qua Family Link, sở hữu trọn bộ tính năng Gemini Pro và 5TB Google Drive dùng đủ thời hạn.',
  '["Mở khóa trọn bộ tính năng Gemini Pro", "Tặng kèm 5TB (5.000GB) dung lượng Google Drive", "Cam kết sử dụng ổn định đủ 8 tháng", "Hoạt động độc lập, riêng tư và bảo mật tuyệt đối", "Kiểm tra nâng cấp thành công rồi mới chuyển khoản"]',
  439000, 550000,
  '8 tháng', 'Bảo hành Full 8 tháng', 'Ổn định / Khuyên dùng',
  'Chỉ cần gửi địa chỉ Gmail để nhận link mời. Không áp dụng nâng cấp cho tài khoản Gmail mới tạo.',
  true, true, 2
),
-- 3. ChatGPT Go 1 tháng
(
  'ChatGPT Go (1 Tháng)',
  'chatgpt-go-1-thang',
  '11111111-1111-1111-1111-111111111111',
  'Trải nghiệm trợ lý AI thông minh ChatGPT phục vụ học tập, viết lách và xử lý công việc hàng ngày với chi phí tối ưu.',
  '["Truy cập các mô hình AI tiên tiến của OpenAI", "Tốc độ phản hồi nhanh, hạn chế gián đoạn giờ cao điểm", "Hỗ trợ đa tác vụ: soạn thảo, tóm tắt, dịch thuật, lập trình", "Dùng ổn định trên cả trình duyệt web và ứng dụng điện thoại"]',
  230000, 300000,
  '1 tháng', 'Bảo hành Full thời gian sử dụng', 'Tiết kiệm',
  'Bảo hành trọn vẹn 1 tháng sử dụng. Vui lòng không tự ý thay đổi thông tin bảo mật của tài khoản được cấp.',
  true, false, 3
),
-- 4. ChatGPT Plus 1 tháng
(
  'ChatGPT Plus (1 Tháng)',
  'chatgpt-plus-1-thang',
  '11111111-1111-1111-1111-111111111111',
  'Mở khóa sức mạnh tối đa của OpenAI với ChatGPT Plus: truy cập mô hình mới nhất, tạo ảnh, phân tích dữ liệu chuyên sâu.',
  '["Mở khóa toàn bộ các mô hình cao cấp nhất của OpenAI", "Tạo hình ảnh AI sắc nét, đọc và phân tích file dữ liệu lớn", "Ưu tiên tốc độ xử lý siêu tốc ngay cả trong giờ cao điểm", "Sử dụng tính năng trò chuyện giọng nói nâng cao (Advanced Voice)"]',
  370000, 520000,
  '1 tháng', 'Bảo hành Full thời gian sử dụng', 'Bán chạy',
  'Bảo hành Full suốt 1 tháng sử dụng. Tuân thủ quy định số lượng thiết bị đăng nhập theo hướng dẫn khi nhận tài khoản.',
  true, true, 4
),
-- 5. Netflix 4K Premium
(
  'Netflix 4K Premium (Slot 1 Tháng)',
  'netflix-4k-premium-slot-1-thang',
  '22222222-2222-2222-2222-222222222222',
  'Thưởng thức kho phim bom tấn độc quyền chuẩn hình ảnh Ultra HD 4K sắc nét và âm thanh sống động trên mọi thiết bị.',
  '["Chất lượng hình ảnh cao nhất: Ultra HD 4K + HDR", "Hỗ trợ âm thanh vòm không gian sống động", "Hồ sơ (Profile) riêng tư có mã PIN bảo vệ", "Tải phim về thiết bị để xem ngoại tuyến không cần mạng"]',
  240000, 260000,
  '1 tháng', 'Bảo hành Full 1 tháng', 'Hot',
  'Gói cấp 1 Slot sử dụng riêng. Không tự ý đổi mật khẩu tài khoản hoặc xâm phạm sang hồ sơ của thành viên khác.',
  true, true, 5
),
-- 6. YouTube Premium Family
(
  'YouTube Premium Family (3 Tháng)',
  'youtube-premium-family-3-thang',
  '22222222-2222-2222-2222-222222222222',
  'Xem video YouTube không quảng cáo, phát nhạc nền khi tắt màn hình và tặng kèm trọn bộ YouTube Music Premium trên chính Gmail của bạn.',
  '["Chặn 100% quảng cáo khi xem video trên mọi thiết bị", "Hỗ trợ phát video trong nền khi tắt màn hình điện thoại", "Tải video chất lượng cao về máy xem offline", "Tặng kèm kho nhạc bản quyền YouTube Music Premium", "Nâng cấp trực tiếp trên Gmail cá nhân qua nhóm Family cố định"]',
  300000, 390000,
  '3 tháng', 'Bảo hành Full 3 tháng', 'Ổn định',
  'Bảo hành Full 3 tháng. Tài khoản Google của bạn cần đảm bảo chưa tham gia hoặc chuyển đổi nhóm Family quá 2 lần trong 12 tháng qua.',
  true, false, 6
),
-- 7. Spotify Premium
(
  'Spotify Premium Link Kích Hoạt (3 Tháng)',
  'spotify-premium-link-kich-hoat-3-thang',
  '22222222-2222-2222-2222-222222222222',
  'Nghe nhạc bản quyền chất lượng cao không quảng cáo, tải nhạc offline và tự do chuyển bài không giới hạn bằng link kích hoạt chính chủ.',
  '["Nghe nhạc không bị làm phiền bởi quảng cáo", "Chất lượng âm thanh cao lên đến 320kbps", "Tải xuống bài hát và podcast để nghe ngoại tuyến", "Kích hoạt trực tiếp vào tài khoản cá nhân, giữ nguyên playlist cũ"]',
  235000, 300000,
  '3 tháng', 'Không bảo hành', 'Giá tốt',
  'Đây là gói kích hoạt qua link ưu đãi nên KHÔNG áp dụng chính sách bảo hành sau khi kích hoạt thành công.',
  true, false, 7
),
-- 8. Canva Pro
(
  'Canva Pro (Slot 12 Tháng)',
  'canva-pro-slot-12-thang',
  '33333333-3333-3333-3333-333333333333',
  'Mở khóa kho tài nguyên hơn 100 triệu ảnh, video, mẫu thiết kế cao cấp cùng bộ công cụ AI xóa phông, đổi kích thước chỉ với 1 click.',
  '["Mở khóa toàn bộ mẫu thiết kế, font chữ và đồ họa Pro", "Công cụ xóa phông nền ảnh & video tự động bằng AI", "Đổi kích thước thiết kế đa nền tảng (Magic Switch) trong 1 giây", "Nâng cấp trực tiếp trên tài khoản Canva cá nhân của bạn"]',
  250000, 1200000,
  '12 tháng', 'Bảo hành Full 12 tháng', 'Tiết kiệm nhất',
  'Bảo hành Full 12 tháng sử dụng. Vui lòng lưu trữ thiết kế cá nhân ở thư mục riêng tư trong nhóm để đảm bảo bảo mật.',
  true, true, 8
),
-- 9. CapCut Pro
(
  'CapCut Pro Tài Khoản Cá Nhân (30 Ngày)',
  'capcut-pro-tai-khoan-ca-nhan-30-ngay',
  '33333333-3333-3333-3333-333333333333',
  'Trải nghiệm trọn bộ hiệu ứng, bộ lọc, phụ đề tự động AI và xuất video 4K 60fps không dính logo trên tài khoản CapCut Pro dùng riêng.',
  '["Mở khóa toàn bộ hiệu ứng, chuyển cảnh, sticker và bộ lọc Pro", "Tạo phụ đề tự động AI, tách nền video và làm mịn da thông minh", "Xuất video chất lượng cao lên đến 4K 60fps, không watermark", "Tài khoản sử dụng riêng biệt, đồng bộ dự án trên điện thoại và PC"]',
  210000, 290000,
  '30 ngày', 'Bảo hành lỗi tài khoản (có điều kiện)', 'Chính chủ',
  'Không bảo hành các lỗi phát sinh do đăng nhập vượt quá giới hạn thiết bị quy định hoặc các lỗi bảo mật từ phía người dùng.',
  true, false, 9
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED DATA: site_settings mặc định
-- ============================================================
INSERT INTO site_settings (key, value) VALUES
  ('zalo_phone', '0764894250'),
  ('shop_name', 'AI GIÁ SỈ'),
  ('contact_email', 'contact@aigiasi.vn'),
  ('zalo_link', 'https://zalo.me/0764894250'),
  ('facebook_link', ''),
  ('telegram_link', ''),
  ('shop_description', 'Cung cấp tài khoản số AI & Công nghệ chính hãng, bảo hành uy tín')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- BẢNG: admin_users (Quản lý phân quyền Quản trị viên)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  note TEXT DEFAULT 'Quản trị viên',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read admin_users" ON admin_users FOR SELECT USING (true);
CREATE POLICY "Allow authenticated manage admin_users" ON admin_users FOR ALL TO authenticated USING (true) WITH CHECK (true);

GRANT ALL ON admin_users TO authenticated;
GRANT SELECT ON admin_users TO anon;
GRANT ALL ON admin_users TO service_role;

INSERT INTO admin_users (email, role, note) VALUES
  ('phatdeeptraisiu@gmail.com', 'super_admin', 'Admin chính'),
  ('admin@aigiasi.vn', 'super_admin', 'Admin dự phòng')
ON CONFLICT (email) DO NOTHING;
