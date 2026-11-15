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
-- 1. Gemini 18 tháng
(
  'Gemini Advanced 18 Tháng',
  'gemini-advanced-18-thang',
  '11111111-1111-1111-1111-111111111111',
  'Trải nghiệm Gemini Advanced với 1.5 Pro, 5TB Google Drive và toàn bộ tính năng Google One Premium.',
  '["Gemini Advanced (mô hình 1.5 Pro)", "5TB Google Drive", "Google One Premium", "Dùng được trên mọi thiết bị", "Tích hợp Gmail, Docs, Sheets"]',
  220000, 350000, '18 tháng', 'Bảo hành 7 ngày đầu', 'Khuyến mãi',
  'Không cam kết đủ 18 tháng, có thể bị Google quét về Free, bảo hành 7 ngày đầu',
  true, true, 1
),
-- 2. Gemini 8 tháng
(
  'Gemini Advanced 8 Tháng',
  'gemini-advanced-8-thang',
  '11111111-1111-1111-1111-111111111111',
  'Gói Gemini Advanced ổn định 8 tháng với bảo hành toàn thời gian sử dụng.',
  '["Gemini Advanced (mô hình 1.5 Pro)", "5TB Google Drive", "Google One Premium", "Bảo hành full 8 tháng", "Hỗ trợ 24/7"]',
  439000, 600000, '8 tháng', 'Bảo hành full 8 tháng', 'Best Seller',
  NULL,
  true, true, 2
),
-- 3. ChatGPT Go 1 tháng
(
  'ChatGPT Go 1 Tháng',
  'chatgpt-go-1-thang',
  '11111111-1111-1111-1111-111111111111',
  'Gói ChatGPT Go hàng tháng, truy cập GPT-4o Mini và các tính năng cơ bản.',
  '["Truy cập GPT-4o Mini", "Tốc độ phản hồi nhanh", "Dùng trên web và mobile", "Bảo hành full 1 tháng", "Hỗ trợ kỹ thuật"]',
  230000, NULL, '1 tháng', 'Bảo hành full 1 tháng', NULL,
  NULL,
  true, false, 3
),
-- 4. ChatGPT Plus 1 tháng
(
  'ChatGPT Plus 1 Tháng',
  'chatgpt-plus-1-thang',
  '11111111-1111-1111-1111-111111111111',
  'ChatGPT Plus đầy đủ tính năng với GPT-4o, DALL-E 3 và các plugin cao cấp.',
  '["Truy cập GPT-4o (full speed)", "DALL-E 3 tạo ảnh AI", "Tất cả Plugin cao cấp", "Bảo hành full 1 tháng", "Hỗ trợ 24/7"]',
  370000, 500000, '1 tháng', 'Bảo hành full 1 tháng', 'Hot',
  NULL,
  true, true, 4
),
-- 5. Netflix 4K Premium
(
  'Netflix 4K Premium 1 Tháng',
  'netflix-4k-premium-1-thang',
  '22222222-2222-2222-2222-222222222222',
  'Netflix Premium 4K Ultra HD, xem trên 4 màn hình cùng lúc, không giới hạn nội dung.',
  '["Chất lượng 4K Ultra HD + HDR", "Xem trên 4 màn hình đồng thời", "Tải xuống xem offline", "Bảo hành full 1 tháng", "Hàng triệu nội dung"]',
  240000, 300000, '1 tháng', 'Bảo hành full 1 tháng', 'Hot',
  NULL,
  true, false, 5
),
-- 6. YouTube Premium Family
(
  'YouTube Premium Family 3 Tháng',
  'youtube-premium-family-3-thang',
  '22222222-2222-2222-2222-222222222222',
  'YouTube Premium Family cho cả gia đình, không quảng cáo, tải nhạc offline và YouTube Music.',
  '["Xem không quảng cáo", "YouTube Music Premium", "Tải video/nhạc offline", "Cho tối đa 5 thành viên", "Bảo hành full 3 tháng"]',
  300000, 400000, '3 tháng', 'Bảo hành full 3 tháng', 'Best Seller',
  NULL,
  true, false, 6
),
-- 7. Spotify Premium
(
  'Spotify Premium 3 Tháng',
  'spotify-premium-3-thang',
  '22222222-2222-2222-2222-222222222222',
  'Nghe nhạc không giới hạn, không quảng cáo, chất lượng cao nhất với Spotify Premium.',
  '["Nghe nhạc không quảng cáo", "Tải nhạc offline không giới hạn", "Chất lượng âm thanh cao", "Shuffle tự do mọi bài hát", "Hỗ trợ toàn cầu"]',
  235000, NULL, '3 tháng', 'Không bảo hành', NULL,
  NULL,
  true, false, 7
),
-- 8. Canva Pro
(
  'Canva Pro 12 Tháng',
  'canva-pro-12-thang',
  '33333333-3333-3333-3333-333333333333',
  'Canva Pro slot 12 tháng với toàn bộ template premium, background remover và Brand Kit.',
  '["100M+ template và element premium", "Background Remover tự động", "Brand Kit cá nhân hóa", "100GB cloud storage", "Bảo hành full 12 tháng"]',
  250000, 350000, '12 tháng', 'Bảo hành full 12 tháng', 'Best Seller',
  NULL,
  true, true, 8
),
-- 9. CapCut Pro
(
  'CapCut Pro 30 Ngày',
  'capcut-pro-30-ngay',
  '33333333-3333-3333-3333-333333333333',
  'CapCut Pro với tất cả hiệu ứng premium, AI tools và xuất video không watermark.',
  '["Xuất video không watermark", "AI Background remover", "Tất cả hiệu ứng và filter premium", "AI Script to Video", "Tốc độ render nhanh"]',
  210000, NULL, '30 ngày', 'Không bảo hành lỗi thiết bị', NULL,
  'Không bảo hành lỗi thiết bị hoặc bảo mật từ người dùng',
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
