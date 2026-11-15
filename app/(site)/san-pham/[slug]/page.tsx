// ============================================================
// app/(site)/san-pham/[slug]/page.tsx
// Trang chi tiết sản phẩm cho SEO
// ============================================================
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Shield, Clock, Star, ChevronRight } from 'lucide-react'
import { createClient, createStaticClient } from '@/lib/supabase/server'
import { formatVND, calcDiscount, getBadgeColor, cn } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface Props {
  params: Promise<{ slug: string }>
}

// Tạo metadata động cho SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('name, description, price')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!product) {
    return { title: 'Sản phẩm không tồn tại' }
  }

  return {
    title: `${product.name} - ${formatVND(product.price)}`,
    description: product.description || `Mua ${product.name} với giá ${formatVND(product.price)}. Bảo hành uy tín, hỗ trợ 24/7 qua Zalo.`,
    openGraph: {
      title: `${product.name} | OpenLay`,
      description: product.description || `Mua ${product.name} với giá ${formatVND(product.price)}.`,
    },
  }
}

// Tạo static params cho tất cả sản phẩm (ISR)
export async function generateStaticParams() {
  try {
    const supabase = createStaticClient()
    const { data: products } = await supabase
      .from('products')
      .select('slug')
      .eq('is_active', true)

    return (products || []).map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export const revalidate = 60

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch sản phẩm
  const { data: product, error } = await supabase
    .from('products')
    .select('*, categories(id, name, slug)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !product) {
    notFound()
  }

  // Fetch site settings cho Zalo
  const { data: settings } = await supabase
    .from('site_settings')
    .select('key, value')

  const settingsMap: Record<string, string> = {}
  settings?.forEach((s) => { if (s.key && s.value) settingsMap[s.key] = s.value })

  const zaloPhone = settingsMap.zalo_phone || process.env.NEXT_PUBLIC_ZALO_PHONE || ''
  const zaloLink = settingsMap.zalo_link || `https://zalo.me/${zaloPhone}`

  const p = product as Product
  const hasDiscount = p.original_price && p.original_price > p.price
  const discountPercent = hasDiscount ? calcDiscount(p.price, p.original_price!) : null
  const benefits = p.benefits || []

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-200 transition-colors">Trang chủ</Link>
          <ChevronRight className="w-3 h-3" aria-hidden="true" />
          <Link href="/#san-pham" className="hover:text-slate-200 transition-colors">Sản phẩm</Link>
          <ChevronRight className="w-3 h-3" aria-hidden="true" />
          <span className="text-slate-300 truncate max-w-[200px]">{p.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {p.badge && (
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold border', getBadgeColor(p.badge))}>
                    {p.badge}
                  </span>
                )}
                {p.categories && (
                  <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/8">
                    {(p.categories as { name: string }).name}
                  </span>
                )}
              </div>

              <h1
                className="text-2xl md:text-3xl font-bold text-white mb-3"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {p.name}
              </h1>

              {p.description && (
                <p className="text-slate-400 leading-relaxed">{p.description}</p>
              )}
            </div>

            {/* Benefits */}
            {benefits.length > 0 && (
              <div className="glass-card p-5 rounded-2xl">
                <h2 className="font-semibold text-white mb-4"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Quyền lợi bao gồm
                </h2>
                <ul className="space-y-3">
                  {benefits.map((benefit: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/30
                                      flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
                        <Star className="w-3 h-3 text-violet-400" />
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Note */}
            {p.note && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm text-amber-300">
                  <strong>⚠ Lưu ý:</strong> {p.note}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - Giá + CTA */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 rounded-2xl sticky top-4 space-y-4">
              {/* Giá */}
              <div>
                <div className="text-3xl font-bold gradient-text mb-1">
                  {formatVND(p.price)}
                </div>
                {hasDiscount && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 line-through text-sm">
                      {formatVND(p.original_price!)}
                    </span>
                    <span className="text-green-400 text-xs font-semibold">
                      Tiết kiệm {discountPercent}%
                    </span>
                  </div>
                )}
              </div>

              {/* Duration */}
              {p.duration && (
                <div className="flex items-center gap-2 text-sm text-slate-400 py-3
                               border-y border-white/5">
                  <Clock className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                  <span>Thời hạn: <strong className="text-white">{p.duration}</strong></span>
                </div>
              )}

              {/* Warranty */}
              {p.warranty && (
                <div className="flex items-center gap-2 text-sm text-emerald-400
                               bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
                  <Shield className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{p.warranty}</span>
                </div>
              )}

              {/* CTA */}
              <a
                href={`${zaloLink}?text=Cho mình hỏi về gói: ${encodeURIComponent(p.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gradient flex items-center justify-center gap-2
                           w-full py-4 rounded-xl text-white font-semibold text-base"
                aria-label={`Liên hệ Zalo để mua ${p.name}`}
              >
                <span>🔵</span>
                Nhắn Zalo để mua
              </a>

              <p className="text-xs text-slate-600 text-center">
                Gửi kèm tên gói để được hỗ trợ nhanh hơn
              </p>

              {/* Back link */}
              <Link
                href="/#san-pham"
                className="flex items-center justify-center gap-2 text-sm text-slate-500
                           hover:text-slate-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Xem tất cả gói
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
