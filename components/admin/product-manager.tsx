'use client'

// ============================================================
// components/admin/product-manager.tsx
// Client component quản lý danh sách và Form sản phẩm
// ============================================================
import { useState, useTransition } from 'react'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  AlertCircle,
  Loader2,
  Sparkles,
  Shield,
  Clock,
  Layers,
} from 'lucide-react'
import {
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductActive,
} from '@/app/admin/actions'
import { formatVND, slugify, cn, getBadgeColor } from '@/lib/utils'
import type { Product, Category } from '@/lib/types'
import type { ProductFormData } from '@/lib/validations/product'
import { toast } from 'sonner'

interface ProductManagerProps {
  initialProducts: Product[]
  categories: Category[]
}

export function ProductManager({ initialProducts, categories }: ProductManagerProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [isPending, startTransition] = useTransition()

  // Form Fields State
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [description, setDescription] = useState('')
  const [benefits, setBenefits] = useState<string[]>([''])
  const [price, setPrice] = useState<number>(0)
  const [originalPrice, setOriginalPrice] = useState<number | null>(null)
  const [duration, setDuration] = useState('')
  const [warranty, setWarranty] = useState('')
  const [badge, setBadge] = useState<string>('')
  const [note, setNote] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [sortOrder, setSortOrder] = useState<number>(0)

  // Mở modal thêm mới
  const handleOpenCreate = () => {
    setEditingProduct(null)
    setName('')
    setSlug('')
    setCategoryId(categories[0]?.id || '')
    setDescription('')
    setBenefits([''])
    setPrice(100000)
    setOriginalPrice(null)
    setDuration('1 tháng')
    setWarranty('Bảo hành full thời gian')
    setBadge('')
    setNote('')
    setIsActive(true)
    setIsFeatured(false)
    setSortOrder(products.length + 1)
    setIsFormOpen(true)
  }

  // Mở modal chỉnh sửa
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p)
    setName(p.name)
    setSlug(p.slug)
    setCategoryId(p.category_id || '')
    setDescription(p.description || '')
    setBenefits(p.benefits && p.benefits.length > 0 ? p.benefits : [''])
    setPrice(p.price)
    setOriginalPrice(p.original_price)
    setDuration(p.duration || '')
    setWarranty(p.warranty || '')
    setBadge(p.badge || '')
    setNote(p.note || '')
    setIsActive(p.is_active)
    setIsFeatured(p.is_featured)
    setSortOrder(p.sort_order)
    setIsFormOpen(true)
  }

  // Xử lý auto-slug khi gõ name (chỉ khi tạo mới hoặc chưa đổi thủ công)
  const handleNameChange = (val: string) => {
    setName(val)
    if (!editingProduct) {
      setSlug(slugify(val))
    }
  }

  // Quản lý Dynamic Benefits List
  const handleBenefitChange = (index: number, val: string) => {
    const updated = [...benefits]
    updated[index] = val
    setBenefits(updated)
  }

  const handleAddBenefit = () => {
    setBenefits([...benefits, ''])
  }

  const handleRemoveBenefit = (index: number) => {
    if (benefits.length === 1) {
      setBenefits([''])
      return
    }
    setBenefits(benefits.filter((_, i) => i !== index))
  }

  // Submit Form Lưu / Sửa
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()

    const cleanBenefits = benefits.map((b) => b.trim()).filter(Boolean)

    const payload: ProductFormData = {
      name: name.trim(),
      slug: slug.trim(),
      category_id: categoryId || null,
      description: description.trim() || null,
      benefits: cleanBenefits.length > 0 ? cleanBenefits : undefined,
      price: Number(price),
      original_price: originalPrice ? Number(originalPrice) : null,
      duration: duration.trim() || null,
      warranty: warranty.trim() || null,
      badge: (badge as any) || null,
      note: note.trim() || null,
      is_active: isActive,
      is_featured: isFeatured,
      sort_order: Number(sortOrder),
    }

    startTransition(async () => {
      if (editingProduct) {
        const res = await updateProduct(editingProduct.id, payload)
        if (res.error) {
          toast.error(res.error)
        } else {
          toast.success('Đã cập nhật sản phẩm')
          setProducts((prev) =>
            prev.map((item) =>
              item.id === editingProduct.id
                ? {
                    ...item,
                    ...payload,
                    categories: categories.find((c) => c.id === payload.category_id) || null,
                  }
                : item
            )
          )
          setIsFormOpen(false)
        }
      } else {
        const res = await createProduct(payload)
        if (res.error) {
          toast.error(res.error)
        } else {
          toast.success('Đã thêm sản phẩm mới')
          // Tạm sinh product để optimistic preview
          const newProd: Product = {
            id: crypto.randomUUID(),
            ...payload,
            category_id: payload.category_id ?? null,
            description: payload.description ?? null,
            duration: payload.duration ?? null,
            warranty: payload.warranty ?? null,
            badge: payload.badge ?? null,
            note: payload.note ?? null,
            original_price: payload.original_price ?? null,
            benefits: cleanBenefits,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            categories: categories.find((c) => c.id === payload.category_id) || null,
          }
          setProducts([newProd, ...products])
          setIsFormOpen(false)
        }
      }
    })
  }

  // Toggle Active Optimistic
  const handleToggleActive = (p: Product) => {
    const nextState = !p.is_active
    setProducts((prev) =>
      prev.map((item) => (item.id === p.id ? { ...item, is_active: nextState } : item))
    )

    startTransition(async () => {
      const res = await toggleProductActive(p.id, nextState)
      if (res.error) {
        // Rollback nếu lỗi
        setProducts((prev) =>
          prev.map((item) => (item.id === p.id ? { ...item, is_active: !nextState } : item))
        )
        toast.error('Không thể cập nhật trạng thái: ' + res.error)
      } else {
        toast.success(nextState ? 'Đã bật hiển thị' : 'Đã ẩn sản phẩm')
      }
    })
  }

  // Delete Product
  const handleDelete = () => {
    if (!deletingProduct) return
    const idToDelete = deletingProduct.id

    startTransition(async () => {
      const res = await deleteProduct(idToDelete)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Đã xóa sản phẩm thành công')
        setProducts((prev) => prev.filter((item) => item.id !== idToDelete))
        setDeletingProduct(null)
      }
    })
  }

  // Lọc sản phẩm theo search và category
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
    const matchCat = selectedCategory === 'all' || p.category_id === selectedCategory
    return matchSearch && matchCat
  })

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Quản lý Sản phẩm
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Thêm mới, sửa thông tin, giá bán, thời hạn và bảo hành các gói dịch vụ.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-gradient inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg shadow-violet-500/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Thêm sản phẩm mới</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên sản phẩm hoặc slug..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-violet-500 transition-colors"
        >
          <option value="all" className="bg-[#0F0F1A]">
            Tất cả danh mục ({products.length})
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id} className="bg-[#0F0F1A]">
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Table */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-white/[0.02] border-b border-white/5">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Sản phẩm</th>
                <th scope="col" className="px-5 py-3 font-semibold">Danh mục</th>
                <th scope="col" className="px-5 py-3 font-semibold">Giá bán</th>
                <th scope="col" className="px-5 py-3 font-semibold">Thời hạn</th>
                <th scope="col" className="px-5 py-3 font-semibold">Bảo hành</th>
                <th scope="col" className="px-5 py-3 font-semibold text-center">Trạng thái</th>
                <th scope="col" className="px-5 py-3 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{p.name}</span>
                            {p.badge && (
                              <span
                                className={cn(
                                  'px-2 py-0.5 rounded-full text-[10px] font-bold border',
                                  getBadgeColor(p.badge)
                                )}
                              >
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-500 font-mono">/{p.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-300">
                      {p.categories?.name || 'Chưa gán'}
                    </td>
                    <td className="px-5 py-4 font-mono font-medium text-white">
                      {formatVND(p.price)}
                      {p.original_price && (
                        <div className="text-[11px] text-slate-500 line-through">
                          {formatVND(p.original_price)}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-300">{p.duration || '—'}</td>
                    <td className="px-5 py-4 text-xs text-slate-400">
                      <span className="line-clamp-1 max-w-[150px]">{p.warranty || '—'}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleToggleActive(p)}
                        className={cn(
                          'px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer',
                          p.is_active
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-slate-500/10 text-slate-500 border-slate-500/30 hover:bg-slate-500/20'
                        )}
                        aria-label="Bật/Tắt trạng thái hoạt động"
                      >
                        {p.is_active ? 'Đang bật' : 'Đang ẩn'}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                          aria-label="Sửa sản phẩm"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingProduct(p)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                          aria-label="Xóa sản phẩm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-500">
                    Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Thêm / Sửa Sản phẩm */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="glass-card max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-white/10 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2
                className="text-xl font-bold text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                    Tên sản phẩm *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="ChatGPT Plus 1 Tháng"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                    Slug URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="chatgpt-plus-1-thang"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                    Danh mục
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="" className="bg-[#0F0F1A]">-- Chọn danh mục --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#0F0F1A]">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                    Badge nổi bật
                  </label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="" className="bg-[#0F0F1A]">Không có badge</option>
                    <option value="Best Seller" className="bg-[#0F0F1A]">Best Seller</option>
                    <option value="Hot" className="bg-[#0F0F1A]">Hot</option>
                    <option value="Khuyến mãi" className="bg-[#0F0F1A]">Khuyến mãi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                    Giá bán (VND) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                    Giá gốc gạch ngang (VND)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={originalPrice ?? ''}
                    onChange={(e) =>
                      setOriginalPrice(e.target.value ? Number(e.target.value) : null)
                    }
                    placeholder="Không bắt buộc"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                    Thời hạn gói
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="18 tháng, 1 tháng..."
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                    Chính sách bảo hành
                  </label>
                  <input
                    type="text"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    placeholder="Bảo hành full thời gian, 7 ngày..."
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                  Mô tả ngắn
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả tóm tắt tính năng và ưu điểm nổi bật..."
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Dynamic Benefits List */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase">
                    Quyền lợi gói (Từng gạch đầu dòng)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddBenefit}
                    className="text-xs text-violet-400 hover:text-violet-300 inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Thêm quyền lợi
                  </button>
                </div>
                <div className="space-y-2">
                  {benefits.map((b, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={b}
                        onChange={(e) => handleBenefitChange(idx, e.target.value)}
                        placeholder={`Quyền lợi #${idx + 1}...`}
                        className="flex-1 px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveBenefit(idx)}
                        className="p-2 text-slate-500 hover:text-red-400"
                        aria-label="Xóa dòng quyền lợi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                  Lưu ý riêng biệt (Ghi chú rủi ro / điều kiện)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: Không cam kết đủ 18 tháng, có thể bị quét về Free..."
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-violet-600 focus:ring-0"
                  />
                  <span className="text-xs text-slate-300 font-medium">Bật công khai</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-violet-600 focus:ring-0"
                  />
                  <span className="text-xs text-slate-300 font-medium">Sản phẩm nổi bật</span>
                </label>

                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-xs text-slate-400">Thứ tự ưu tiên:</span>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-16 px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white text-center"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-gradient px-6 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingProduct ? 'Lưu thay đổi' : 'Tạo sản phẩm'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card max-w-sm w-full p-6 rounded-2xl border border-red-500/20 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Xác nhận xóa sản phẩm</h3>
            <p className="text-xs text-slate-400">
              Bạn có chắc chắn muốn xóa gói <strong className="text-white">"{deletingProduct.name}"</strong>? Thao tác này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-semibold text-white flex items-center gap-1.5"
              >
                {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
