'use client'

// ============================================================
// components/site/product-card.tsx
// Card sản phẩm glassmorphism với Framer Motion
// ============================================================
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Clock, Star, ChevronRight } from 'lucide-react'
import { cn, formatVND, getBadgeColor, calcDiscount } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
  onBuyClick: (product: Product) => void
  index?: number
}

export function ProductCard({ product, onBuyClick, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const hasDiscount = product.original_price && product.original_price > product.price
  const discountPercent = hasDiscount
    ? calcDiscount(product.price, product.original_price!)
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Border gradient khi hover */}
      <div
        className={cn(
          'absolute -inset-[1px] rounded-2xl transition-opacity duration-300',
          isHovered ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.5), rgba(6,182,212,0.5))',
        }}
      />

      {/* Card nội dung */}
      <div className="relative glass-card p-5 md:p-6 h-full flex flex-col rounded-2xl">
        {/* Badge góc trên */}
        {product.badge && (
          <span
            className={cn(
              'absolute top-4 right-4 px-2 py-0.5 rounded-full text-xs font-semibold border',
              getBadgeColor(product.badge)
            )}
          >
            {product.badge}
          </span>
        )}

        {/* Header: Icon + Tên */}
        <div className="flex items-start gap-4 mb-4">
          <ProductIcon productName={product.name} />

          <div className="flex-1 min-w-0">
            <h3
              className="font-bold text-white text-base leading-tight mb-1 pr-16"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {product.name}
            </h3>

            {/* Duration badge */}
            {product.duration && (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="w-3 h-3" aria-hidden="true" />
                <span>{product.duration}</span>
              </div>
            )}
          </div>
        </div>

        {/* Giá */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold gradient-text">
            {formatVND(product.price)}
          </span>

          {hasDiscount && (
            <>
              <span className="text-sm text-slate-500 line-through">
                {formatVND(product.original_price!)}
              </span>
              <span className="text-xs text-green-400 font-semibold">
                -{discountPercent}%
              </span>
            </>
          )}
        </div>

        {/* Mô tả ngắn */}
        {product.description && (
          <p className="text-sm text-slate-500 mb-4 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Benefits list */}
        {product.benefits && product.benefits.length > 0 && (
          <ul className="space-y-2 mb-4 flex-1">
            {product.benefits.slice(0, 5).map((benefit, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span
                  className="w-4 h-4 rounded-full bg-violet-500/20 border border-violet-500/30
                             flex items-center justify-center shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  <Star className="w-2.5 h-2.5 text-violet-400" />
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        )}

        {/* Footer: Bảo hành + Nút mua */}
        <div className="mt-auto pt-4 border-t border-white/5">
          {/* Badge bảo hành */}
          {product.warranty && (
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10
                             border border-emerald-500/20 px-2 py-1 rounded-full">
                <Shield className="w-3 h-3" aria-hidden="true" />
                <span>{product.warranty}</span>
              </div>
            </div>
          )}

          {/* Note nhỏ */}
          {product.note && (
            <p className="text-xs text-slate-600 italic mb-3 line-clamp-2">
              ⚠ {product.note}
            </p>
          )}

          {/* CTA Button */}
          <button
            onClick={() => onBuyClick(product)}
            className="btn-gradient w-full flex items-center justify-center gap-2
                       py-3 rounded-xl text-white font-semibold text-sm
                       shadow-lg shadow-violet-500/10"
            aria-label={`Mua ${product.name}`}
          >
            Mua ngay
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================
// ProductIcon - Hiển thị icon dựa trên tên sản phẩm
// ============================================================
function ProductIcon({ productName }: { productName: string }) {
  const name = productName.toLowerCase()

  // Màu và chữ viết tắt dựa trên dịch vụ
  const getIconConfig = () => {
    if (name.includes('gemini')) {
      return { bg: 'from-blue-500 to-purple-600', text: 'G', emoji: '✨' }
    }
    if (name.includes('chatgpt')) {
      return { bg: 'from-emerald-500 to-teal-600', text: 'C', emoji: '🤖' }
    }
    if (name.includes('netflix')) {
      return { bg: 'from-red-600 to-red-800', text: 'N', emoji: '🎬' }
    }
    if (name.includes('youtube')) {
      return { bg: 'from-red-500 to-pink-600', text: 'YT', emoji: '▶' }
    }
    if (name.includes('spotify')) {
      return { bg: 'from-green-500 to-emerald-600', text: 'S', emoji: '🎵' }
    }
    if (name.includes('canva')) {
      return { bg: 'from-purple-500 to-violet-700', text: 'C', emoji: '🎨' }
    }
    if (name.includes('capcut')) {
      return { bg: 'from-pink-500 to-rose-600', text: 'CC', emoji: '✂' }
    }
    return { bg: 'from-violet-500 to-cyan-600', text: productName[0], emoji: '⭐' }
  }

  const config = getIconConfig()

  return (
    <div
      className={cn(
        'w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center',
        'text-white font-bold text-sm shrink-0 shadow-lg',
        config.bg
      )}
      aria-hidden="true"
    >
      <span className="text-base">{config.emoji}</span>
    </div>
  )
}
