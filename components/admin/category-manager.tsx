'use client'

// ============================================================
// components/admin/category-manager.tsx
// Client component quản lý danh mục sản phẩm (CRUD)
// ============================================================
import { useState, useTransition } from 'react'
import { Plus, Edit2, Trash2, Layers, AlertCircle, Loader2 } from 'lucide-react'
import { createCategory, updateCategory, deleteCategory } from '@/app/admin/actions'
import { slugify } from '@/lib/utils'
import type { Category } from '@/lib/types'
import type { CategoryFormData } from '@/lib/validations/category'
import { toast } from 'sonner'

interface CategoryManagerProps {
  initialCategories: Category[]
}

const AVAILABLE_ICONS = [
  'BrainCircuit',
  'Tv',
  'Palette',
  'Sparkles',
  'Cpu',
  'Shield',
  'Code',
  'Music',
  'Film',
  'Zap',
]

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const [isPending, startTransition] = useTransition()

  // Form states
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [icon, setIcon] = useState('BrainCircuit')
  const [sortOrder, setSortOrder] = useState<number>(0)

  const handleOpenCreate = () => {
    setEditingCategory(null)
    setName('')
    setSlug('')
    setIcon('BrainCircuit')
    setSortOrder(categories.length + 1)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c)
    setName(c.name)
    setSlug(c.slug)
    setIcon(c.icon || 'BrainCircuit')
    setSortOrder(c.sort_order)
    setIsFormOpen(true)
  }

  const handleNameChange = (val: string) => {
    setName(val)
    if (!editingCategory) {
      setSlug(slugify(val))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payload: CategoryFormData = {
      name: name.trim(),
      slug: slug.trim(),
      icon: icon || null,
      sort_order: Number(sortOrder),
    }

    startTransition(async () => {
      if (editingCategory) {
        const res = await updateCategory(editingCategory.id, payload)
        if (res.error) {
          toast.error(res.error)
        } else {
          toast.success('Đã cập nhật danh mục')
          setCategories((prev) =>
            prev.map((c) => (c.id === editingCategory.id ? { ...c, ...payload } : c))
          )
          setIsFormOpen(false)
        }
      } else {
        const res = await createCategory(payload)
        if (res.error) {
          toast.error(res.error)
        } else {
          toast.success('Đã tạo danh mục mới')
          const newCat: Category = {
            id: crypto.randomUUID(),
            name: payload.name,
            slug: payload.slug,
            icon: payload.icon ?? null,
            sort_order: payload.sort_order,
            created_at: new Date().toISOString(),
          }
          setCategories([...categories, newCat])
          setIsFormOpen(false)
        }
      }
    })
  }

  const handleDelete = () => {
    if (!deletingCategory) return
    const idToDelete = deletingCategory.id

    startTransition(async () => {
      const res = await deleteCategory(idToDelete)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Đã xóa danh mục')
        setCategories((prev) => prev.filter((c) => c.id !== idToDelete))
        setDeletingCategory(null)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Quản lý Danh mục
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Phân loại các gói dịch vụ giúp khách hàng lọc và tìm kiếm dễ dàng hơn.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-gradient inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg shadow-violet-500/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Thêm danh mục</span>
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-white/[0.02] border-b border-white/5">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Tên danh mục</th>
                <th scope="col" className="px-5 py-3 font-semibold">Slug URL</th>
                <th scope="col" className="px-5 py-3 font-semibold">Icon</th>
                <th scope="col" className="px-5 py-3 font-semibold text-center">Thứ tự</th>
                <th scope="col" className="px-5 py-3 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {categories.length > 0 ? (
                categories.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-semibold text-white">{c.name}</td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-400">/{c.slug}</td>
                    <td className="px-5 py-4 text-xs font-mono text-cyan-400">
                      {c.icon || 'Mặc định'}
                    </td>
                    <td className="px-5 py-4 text-center font-mono text-xs text-slate-300">
                      {c.sort_order}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                          aria-label="Sửa danh mục"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingCategory(c)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                          aria-label="Xóa danh mục"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-500">
                    Chưa có danh mục nào. Hãy tạo danh mục đầu tiên!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-white/10">
            <h2 className="text-lg font-bold text-white mb-4">
              {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                  Tên danh mục *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="AI & Công việc"
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
                  placeholder="ai-cong-viec"
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                  Icon Lucide
                </label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                >
                  {AVAILABLE_ICONS.map((ic) => (
                    <option key={ic} value={ic} className="bg-[#0F0F1A]">
                      {ic}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                  Thứ tự sắp xếp
                </label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-gradient px-5 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-2"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingCategory ? 'Cập nhật' : 'Tạo mới'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card max-w-sm w-full p-6 rounded-2xl border border-red-500/20 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Xóa danh mục?</h3>
            <p className="text-xs text-slate-400">
              Bạn có chắc muốn xóa <strong className="text-white">"{deletingCategory.name}"</strong>? Các sản phẩm thuộc danh mục này sẽ chuyển về "Chưa gán".
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingCategory(null)}
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
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
