// ============================================================
// app/(site)/page.tsx - Trang chủ (Server Component)
// Fetch dữ liệu server-side, không dùng useEffect
// ============================================================
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { HeroSection } from '@/components/site/hero-section'
import { TrustBar } from '@/components/site/trust-bar'
import { FilterTabs } from '@/components/site/filter-tabs'
import { WhyUs } from '@/components/site/why-us'
import { FAQ } from '@/components/site/faq'
import { Footer } from '@/components/site/footer'
import type { Category, Product, SiteSettingsObject } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Tài khoản số chính hãng, bảo hành uy tín | OpenLay',
  description:
    'Mua tài khoản Gemini, ChatGPT, Netflix, Spotify, Canva, CapCut và nhiều dịch vụ số cao cấp. Bảo hành uy tín, hỗ trợ 24/7 qua Zalo.',
}

// Revalidate mỗi 60 giây để landing page cập nhật sau khi admin sửa
export const revalidate = 60

// Fetch site settings từ database
async function getSiteSettings(): Promise<Partial<SiteSettingsObject>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value')

    if (error || !data) {
      // Fallback về env variables
      return {
        zalo_phone: process.env.NEXT_PUBLIC_ZALO_PHONE || '',
        zalo_link: `https://zalo.me/${process.env.NEXT_PUBLIC_ZALO_PHONE || ''}`,
        shop_name: 'OpenLay',
      }
    }

    // Convert từ key-value array sang object
    const settings: Record<string, string> = {}
    data.forEach((row) => {
      if (row.key && row.value) {
        settings[row.key] = row.value
      }
    })

    return {
      zalo_phone: settings.zalo_phone || process.env.NEXT_PUBLIC_ZALO_PHONE || '',
      zalo_link: settings.zalo_link || `https://zalo.me/${settings.zalo_phone || ''}`,
      shop_name: settings.shop_name || 'OpenLay',
      contact_email: settings.contact_email || '',
      facebook_link: settings.facebook_link || '',
      telegram_link: settings.telegram_link || '',
      shop_description: settings.shop_description || '',
    }
  } catch {
    return {
      zalo_phone: process.env.NEXT_PUBLIC_ZALO_PHONE || '',
      zalo_link: `https://zalo.me/${process.env.NEXT_PUBLIC_ZALO_PHONE || ''}`,
      shop_name: 'OpenLay',
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

    if (error) return []
    return data || []
  } catch {
    return []
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

    if (error) return []
    return (data || []) as Product[]
  } catch {
    return []
  }
}

export default async function HomePage() {
  // Fetch song song để tối ưu performance
  const [settings, categories, products] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getProducts(),
  ])

  const zaloPhone = settings.zalo_phone || process.env.NEXT_PUBLIC_ZALO_PHONE || ''
  const zaloLink = settings.zalo_link || `https://zalo.me/${zaloPhone}`

  return (
    <main>
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
