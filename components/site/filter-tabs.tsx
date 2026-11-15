'use client'

// ============================================================
// components/site/filter-tabs.tsx
// Filter tabs danh mục sản phẩm - client-side filtering
// ============================================================
import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Category, Product } from '@/lib/types'
import { ProductCard } from './product-card'
import { ZaloModal } from './zalo-modal'

interface FilterTabsProps {
  categories: Category[]
  products: Product[]
  zaloPhone: string
  zaloLink: string
}

export function FilterTabs({ categories, products, zaloPhone, zaloLink }: FilterTabsProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Lọc sản phẩm theo danh mục đã chọn
  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category_id === activeCategory)

  // Mở modal khi bấm "Mua ngay"
  const handleBuyClick = useCallback((product: Product) => {
    setSelectedProduct(product)
    setModalOpen(true)
  }, [])

  const handleModalClose = useCallback(() => {
    setModalOpen(false)
    // Delay reset product để tránh flash khi đóng animation
    setTimeout(() => setSelectedProduct(null), 300)
  }, [])

  const tabs = [
    { id: 'all', label: 'Tất cả' },
    ...categories.map((cat) => ({ id: cat.id, label: cat.name })),
  ]

  return (
    <section id="san-pham" className="py-20">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Gói dịch vụ
            <span className="gradient-text"> cao cấp</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Chọn gói phù hợp với nhu cầu của bạn. Tất cả đều chính hãng, bảo hành uy tín.
          </p>
        </motion.div>

        {/* Filter Tabs - sticky khi scroll */}
        <div className="sticky top-4 z-20 mb-8">
          <div className="flex justify-center">
            <div className="flex gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/8
                           backdrop-blur-md overflow-x-auto max-w-full">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={cn(
                    'relative px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap',
                    'transition-colors duration-200 outline-none',
                    'focus-visible:ring-2 focus-visible:ring-violet-500',
                    activeCategory === tab.id
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  )}
                  aria-pressed={activeCategory === tab.id}
                >
                  {/* Active indicator */}
                  {activeCategory === tab.id && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600"
                      transition={{ type: 'spring', duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                onBuyClick={handleBuyClick}
                index={index}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-16 text-slate-500"
            >
              Không có sản phẩm nào trong danh mục này.
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Zalo Modal */}
      {selectedProduct && (
        <ZaloModal
          open={modalOpen}
          onClose={handleModalClose}
          productName={selectedProduct.name}
          zaloPhone={zaloPhone}
          zaloLink={zaloLink}
        />
      )}
    </section>
  )
}
