// ============================================================
// app/(site)/page.tsx - Trang chủ (Server Component)
// Fetch dữ liệu server-side, hỗ trợ fallback data tức thì
// ============================================================
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/site/navbar'
import { HeroSection } from '@/components/site/hero-section'
import { TrustBar } from '@/components/site/trust-bar'
import { FilterTabs } from '@/components/site/filter-tabs'
import { WhyUs } from '@/components/site/why-us'
import { FAQ } from '@/components/site/faq'
import { Footer } from '@/components/site/footer'
import type { Category, Product, SiteSettingsObject } from '@/lib/types'

export const metadata: Metadata = {
  title: 'AI GIÁ SỈ - Tài khoản số chính hãng, bảo hành uy tín',
  description:
    'Mua tài khoản Gemini, ChatGPT, Netflix, Spotify, Canva, CapCut và nhiều dịch vụ số cao cấp với giá sỉ tốt nhất. Bảo hành uy tín, hỗ trợ 24/7 qua Zalo.',
}

export const revalidate = 60

// Dữ liệu dự phòng mặc định (Fallbacks)
const FALLBACK_CATEGORIES: Category[] = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'AI & Công việc', slug: 'ai-cong-viec', icon: 'BrainCircuit', sort_order: 1, created_at: '' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Giải trí', slug: 'giai-tri', icon: 'Tv', sort_order: 2, created_at: '' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Thiết kế & Video', slug: 'thiet-ke-video', icon: 'Palette', sort_order: 3, created_at: '' },
]

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: '1',
    category_id: '11111111-1111-1111-1111-111111111111',
    name: 'Gemini Advanced 18 Tháng',
    slug: 'gemini-advanced-18-thang',
    description: 'Trải nghiệm Gemini Advanced với 1.5 Pro, 5TB Google Drive và toàn bộ tính năng Google One Premium.',
    benefits: ['Gemini Advanced (mô hình 1.5 Pro)', '5TB Google Drive', 'Google One Premium', 'Dùng được trên mọi thiết bị', 'Tích hợp Gmail, Docs, Sheets'],
    price: 220000,
    original_price: 350000,
    duration: '18 tháng',
    warranty: 'Bảo hành 7 ngày đầu',
    badge: 'Khuyến mãi',
    note: 'Không cam kết đủ 18 tháng, có thể bị Google quét về Free, bảo hành 7 ngày đầu',
    is_active: true,
    is_featured: true,
    sort_order: 1,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    category_id: '11111111-1111-1111-1111-111111111111',
    name: 'Gemini Advanced 8 Tháng',
    slug: 'gemini-advanced-8-thang',
    description: 'Gói Gemini Advanced ổn định 8 tháng với bảo hành toàn thời gian sử dụng.',
    benefits: ['Gemini Advanced (mô hình 1.5 Pro)', '5TB Google Drive', 'Google One Premium', 'Bảo hành full 8 tháng', 'Hỗ trợ 24/7'],
    price: 439000,
    original_price: 600000,
    duration: '8 tháng',
    warranty: 'Bảo hành full 8 tháng',
    badge: 'Best Seller',
    note: null,
    is_active: true,
    is_featured: true,
    sort_order: 2,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    category_id: '11111111-1111-1111-1111-111111111111',
    name: 'ChatGPT Go 1 Tháng',
    slug: 'chatgpt-go-1-thang',
    description: 'Gói ChatGPT Go hàng tháng, truy cập GPT-4o Mini và các tính năng cơ bản.',
    benefits: ['Truy cập GPT-4o Mini', 'Tốc độ phản hồi nhanh', 'Dùng trên web và mobile', 'Bảo hành full 1 tháng', 'Hỗ trợ kỹ thuật'],
    price: 230000,
    original_price: null,
    duration: '1 tháng',
    warranty: 'Bảo hành full 1 tháng',
    badge: null,
    note: null,
    is_active: true,
    is_featured: false,
    sort_order: 3,
    created_at: '',
    updated_at: '',
  },
  {
    id: '4',
    category_id: '11111111-1111-1111-1111-111111111111',
    name: 'ChatGPT Plus 1 Tháng',
    slug: 'chatgpt-plus-1-thang',
    description: 'ChatGPT Plus đầy đủ tính năng với GPT-4o, DALL-E 3 và các plugin cao cấp.',
    benefits: ['Truy cập GPT-4o (full speed)', 'DALL-E 3 tạo ảnh AI', 'Tất cả Plugin cao cấp', 'Bảo hành full 1 tháng', 'Hỗ trợ 24/7'],
    price: 370000,
    original_price: 500000,
    duration: '1 tháng',
    warranty: 'Bảo hành full 1 tháng',
    badge: 'Hot',
    note: null,
    is_active: true,
    is_featured: true,
    sort_order: 4,
    created_at: '',
    updated_at: '',
  },
  {
    id: '5',
    category_id: '22222222-2222-2222-2222-222222222222',
    name: 'Netflix 4K Premium 1 Tháng',
    slug: 'netflix-4k-premium-1-thang',
    description: 'Netflix Premium 4K Ultra HD, xem trên 4 màn hình cùng lúc, không giới hạn nội dung.',
    benefits: ['Chất lượng 4K Ultra HD + HDR', 'Xem trên 4 màn hình đồng thời', 'Tải xuống xem offline', 'Bảo hành full 1 tháng', 'Hàng triệu nội dung'],
    price: 240000,
    original_price: 300000,
    duration: '1 tháng',
    warranty: 'Bảo hành full 1 tháng',
    badge: 'Hot',
    note: null,
    is_active: true,
    is_featured: false,
    sort_order: 5,
    created_at: '',
    updated_at: '',
  },
  {
    id: '6',
    category_id: '22222222-2222-2222-2222-222222222222',
    name: 'YouTube Premium Family 3 Tháng',
    slug: 'youtube-premium-family-3-thang',
    description: 'YouTube Premium Family cho cả gia đình, không quảng cáo, tải nhạc offline và YouTube Music.',
    benefits: ['Xem không quảng cáo', 'YouTube Music Premium', 'Tải video/nhạc offline', 'Cho tối đa 5 thành viên', 'Bảo hành full 3 tháng'],
    price: 300000,
    original_price: 400000,
    duration: '3 tháng',
    warranty: 'Bảo hành full 3 tháng',
    badge: 'Best Seller',
    note: null,
    is_active: true,
    is_featured: false,
    sort_order: 6,
    created_at: '',
    updated_at: '',
  },
  {
    id: '7',
    category_id: '22222222-2222-2222-2222-222222222222',
    name: 'Spotify Premium 3 Tháng',
    slug: 'spotify-premium-3-thang',
    description: 'Nghe nhạc không giới hạn, không quảng cáo, chất lượng cao nhất với Spotify Premium.',
    benefits: ['Nghe nhạc không quảng cáo', 'Tải nhạc offline không giới hạn', 'Chất lượng âm thanh cao', 'Shuffle tự do mọi bài hát', 'Hỗ trợ toàn cầu'],
    price: 235000,
    original_price: null,
    duration: '3 tháng',
    warranty: 'Không bảo hành',
    badge: null,
    note: null,
    is_active: true,
    is_featured: false,
    sort_order: 7,
    created_at: '',
    updated_at: '',
  },
  {
    id: '8',
    category_id: '33333333-3333-3333-3333-333333333333',
    name: 'Canva Pro 12 Tháng',
    slug: 'canva-pro-12-thang',
    description: 'Canva Pro slot 12 tháng với toàn bộ template premium, background remover và Brand Kit.',
    benefits: ['100M+ template và element premium', 'Background Remover tự động', 'Brand Kit cá nhân hóa', '100GB cloud storage', 'Bảo hành full 12 tháng'],
    price: 250000,
    original_price: 350000,
    duration: '12 tháng',
    warranty: 'Bảo hành full 12 tháng',
    badge: 'Best Seller',
    note: null,
    is_active: true,
    is_featured: true,
    sort_order: 8,
    created_at: '',
    updated_at: '',
  },
  {
    id: '9',
    category_id: '33333333-3333-3333-3333-333333333333',
    name: 'CapCut Pro 30 Ngày',
    slug: 'capcut-pro-30-ngay',
    description: 'CapCut Pro với tất cả hiệu ứng premium, AI tools và xuất video không watermark.',
    benefits: ['Xuất video không watermark', 'AI Background remover', 'Tất cả hiệu ứng và filter premium', 'AI Script to Video', 'Tốc độ render nhanh'],
    price: 210000,
    original_price: null,
    duration: '30 ngày',
    warranty: 'Không bảo hành lỗi thiết bị',
    badge: null,
    note: 'Không bảo hành lỗi thiết bị hoặc bảo mật từ người dùng',
    is_active: true,
    is_featured: false,
    sort_order: 9,
    created_at: '',
    updated_at: '',
  },
]

// Fetch site settings từ database
async function getSiteSettings(): Promise<Partial<SiteSettingsObject>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value')

    if (error || !data || data.length === 0) {
      return {
        zalo_phone: process.env.NEXT_PUBLIC_ZALO_PHONE || '0764894250',
        zalo_link: `https://zalo.me/${process.env.NEXT_PUBLIC_ZALO_PHONE || '0764894250'}`,
        shop_name: 'AI GIÁ SỈ',
      }
    }

    const settings: Record<string, string> = {}
    data.forEach((row) => {
      if (row.key && row.value) {
        settings[row.key] = row.value
      }
    })

    return {
      zalo_phone: settings.zalo_phone || process.env.NEXT_PUBLIC_ZALO_PHONE || '0764894250',
      zalo_link: settings.zalo_link || `https://zalo.me/${settings.zalo_phone || process.env.NEXT_PUBLIC_ZALO_PHONE || '0764894250'}`,
      shop_name: settings.shop_name || 'AI GIÁ SỈ',
      contact_email: settings.contact_email || 'contact@aigiasi.vn',
      facebook_link: settings.facebook_link || '',
      telegram_link: settings.telegram_link || '',
      shop_description: settings.shop_description || 'Chuyên cung cấp tài khoản AI, bản quyền số giá sỉ uy tín',
    }
  } catch {
    return {
      zalo_phone: process.env.NEXT_PUBLIC_ZALO_PHONE || '0764894250',
      zalo_link: `https://zalo.me/${process.env.NEXT_PUBLIC_ZALO_PHONE || '0764894250'}`,
      shop_name: 'AI GIÁ SỈ',
    }
  }
}

// Fetch categories
async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error || !data || data.length === 0) return FALLBACK_CATEGORIES
    return data
  } catch {
    return FALLBACK_CATEGORIES
  }
}

// Fetch products (chỉ active)
async function getProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(id, name, slug)')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error || !data || data.length === 0) return FALLBACK_PRODUCTS
    return data as Product[]
  } catch {
    return FALLBACK_PRODUCTS
  }
}

export default async function HomePage() {
  const [settings, categories, products] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getProducts(),
  ])

  const zaloPhone = settings.zalo_phone || process.env.NEXT_PUBLIC_ZALO_PHONE || '0764894250'
  const zaloLink = settings.zalo_link || `https://zalo.me/${zaloPhone}`
  const shopName = settings.shop_name || 'AI GIÁ SỈ'

  return (
    <main className="relative">
      {/* 0. Fixed Header Navbar */}
      <Navbar zaloLink={zaloLink} shopName={shopName} />

      {/* 1. Hero Section */}
      <HeroSection zaloPhone={zaloPhone} zaloLink={zaloLink} />

      {/* 2. Trust Bar */}
      <TrustBar />

      {/* 3. Products + Filter */}
      <FilterTabs
        categories={categories}
        products={products}
        zaloPhone={zaloPhone}
        zaloLink={zaloLink}
      />

      {/* 4. Why Us */}
      <WhyUs />

      {/* 5. FAQ */}
      <FAQ />

      {/* 6. Footer */}
      <Footer settings={settings} />
    </main>
  )
}
