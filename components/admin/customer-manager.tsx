'use client'

// ============================================================
// components/admin/customer-manager.tsx
// Client component quản lý danh sách và Drawer khách hàng
// ============================================================
import { useState, useTransition } from 'react'
import {
  Search,
  Download,
  Filter,
  User,
  Phone,
  MessageSquare,
  Calendar,
  Package,
  Edit3,
  Trash2,
  X,
  Loader2,
  CheckCircle,
} from 'lucide-react'
import { updateCustomerStatusAndNote, deleteCustomer } from '@/app/admin/actions'
import {
  formatDate,
  getStatusColor,
  getStatusLabel,
  cn,
} from '@/lib/utils'
import type { Customer, CustomerStatus } from '@/lib/types'
import { toast } from 'sonner'

interface CustomerManagerProps {
  initialCustomers: Customer[]
}

export function CustomerManager({ initialCustomers }: CustomerManagerProps) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Drawer chi tiết
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [noteText, setNoteText] = useState('')
  const [currentStatus, setCurrentStatus] = useState<CustomerStatus>('pending')
  const [isPending, startTransition] = useTransition()

  const handleOpenDrawer = (c: Customer) => {
    setSelectedCustomer(c)
    setNoteText(c.note || '')
    setCurrentStatus(c.status)
  }

  const handleSaveCustomer = () => {
    if (!selectedCustomer) return

    startTransition(async () => {
      const res = await updateCustomerStatusAndNote(
        selectedCustomer.id,
        currentStatus,
        noteText.trim() || null
      )

      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Đã lưu thông tin khách hàng')
        setCustomers((prev) =>
          prev.map((c) =>
            c.id === selectedCustomer.id
              ? { ...c, status: currentStatus, note: noteText.trim() || null }
              : c
          )
        )
        setSelectedCustomer(null)
      }
    })
  }

  const handleDeleteCustomer = (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa bản ghi khách hàng này?')) return

    startTransition(async () => {
      const res = await deleteCustomer(id)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Đã xóa khách hàng')
        setCustomers((prev) => prev.filter((c) => c.id !== id))
        if (selectedCustomer?.id === id) setSelectedCustomer(null)
      }
    })
  }

  // Export CSV
  const handleExportCSV = () => {
    if (customers.length === 0) {
      toast.error('Không có dữ liệu để xuất')
      return
    }

    const headers = ['ID', 'Tên khách hàng', 'Zalo / Phone', 'Sản phẩm quan tâm', 'Trạng thái', 'Ghi chú', 'Ngày tạo']
    const rows = customers.map((c) => [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${(c.zalo || c.phone || '').replace(/"/g, '""')}"`,
      `"${(c.products?.name || '').replace(/"/g, '""')}"`,
      getStatusLabel(c.status),
      `"${(c.note || '').replace(/"/g, '""')}"`,
      c.created_at,
    ])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `aigiasi_customers_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Đã tải xuống file CSV')
  }

  // Lọc
  const filteredCustomers = customers.filter((c) => {
    const term = search.toLowerCase()
    const matchSearch =
      c.name.toLowerCase().includes(term) ||
      (c.zalo && c.zalo.toLowerCase().includes(term)) ||
      (c.phone && c.phone.toLowerCase().includes(term))
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Quản lý Khách hàng
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Theo dõi danh sách khách đã quan tâm hoặc mua gói dịch vụ từ Zalo.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Xuất file CSV</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên khách, số Zalo hoặc điện thoại..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-violet-500"
        >
          <option value="all" className="bg-[#0F0F1A]">Tất cả trạng thái ({customers.length})</option>
          <option value="pending" className="bg-[#0F0F1A]">Chờ xử lý</option>
          <option value="contacted" className="bg-[#0F0F1A]">Đã liên hệ</option>
          <option value="closed" className="bg-[#0F0F1A]">Đã chốt đơn</option>
          <option value="cancelled" className="bg-[#0F0F1A]">Đã huỷ</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-white/[0.02] border-b border-white/5">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Khách hàng</th>
                <th scope="col" className="px-5 py-3 font-semibold">Zalo / SĐT</th>
                <th scope="col" className="px-5 py-3 font-semibold">Sản phẩm quan tâm</th>
                <th scope="col" className="px-5 py-3 font-semibold">Trạng thái</th>
                <th scope="col" className="px-5 py-3 font-semibold">Ngày tạo</th>
                <th scope="col" className="px-5 py-3 font-semibold text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => handleOpenDrawer(c)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white group-hover:text-violet-300 transition-colors">
                        {c.name}
                      </div>
                      {c.note && (
                        <div className="text-xs text-slate-500 line-clamp-1 italic mt-0.5">
                          "{c.note}"
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-300">
                      {c.zalo || c.phone || '—'}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-300">
                      {c.products?.name || 'Chung / Tư vấn'}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border',
                          getStatusColor(c.status)
                        )}
                      >
                        {getStatusLabel(c.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">{formatDate(c.created_at)}</td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-xs text-violet-400 font-semibold group-hover:underline">
                        Mở xem →
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500">
                    Không có khách hàng nào trong bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer Chi tiết Khách hàng */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedCustomer(null)}
          />
          <div className="relative w-full max-w-md bg-[#0F0F1A] border-l border-white/10 p-6 z-10 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-violet-400" />
                  <h2 className="text-lg font-bold text-white">Chi tiết Khách hàng</h2>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs text-slate-500 uppercase font-semibold">Tên khách hàng</label>
                  <p className="text-base font-bold text-white mt-1">{selectedCustomer.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-semibold">Số Zalo</label>
                    <p className="text-sm font-mono text-slate-200 mt-1">
                      {selectedCustomer.zalo || '—'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-semibold">Số điện thoại</label>
                    <p className="text-sm font-mono text-slate-200 mt-1">
                      {selectedCustomer.phone || '—'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-500 uppercase font-semibold">Gói quan tâm</label>
                  <p className="text-sm text-cyan-400 font-medium mt-1">
                    {selectedCustomer.products?.name || 'Tư vấn chung'}
                  </p>
                </div>

                <div>
                  <label className="text-xs text-slate-500 uppercase font-semibold">Ngày ghi nhận</label>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(selectedCustomer.created_at)}</p>
                </div>

                {/* Status selection */}
                <div>
                  <label className="block text-xs text-slate-300 uppercase font-semibold mb-2">
                    Trạng thái chăm sóc
                  </label>
                  <select
                    value={currentStatus}
                    onChange={(e) => setCurrentStatus(e.target.value as CustomerStatus)}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="pending" className="bg-[#0F0F1A]">Chờ xử lý</option>
                    <option value="contacted" className="bg-[#0F0F1A]">Đã liên hệ</option>
                    <option value="closed" className="bg-[#0F0F1A]">Đã chốt đơn</option>
                    <option value="cancelled" className="bg-[#0F0F1A]">Đã huỷ</option>
                  </select>
                </div>

                {/* Note edit */}
                <div>
                  <label className="block text-xs text-slate-300 uppercase font-semibold mb-2">
                    Ghi chú nội bộ
                  </label>
                  <textarea
                    rows={4}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Ghi lại tiến độ tư vấn, yêu cầu đặc biệt của khách..."
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-3 mt-6">
              <button
                type="button"
                onClick={() => handleDeleteCustomer(selectedCustomer.id)}
                className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                aria-label="Xóa khách hàng này"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustomer}
                  disabled={isPending}
                  className="btn-gradient px-5 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Lưu ghi chú</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
