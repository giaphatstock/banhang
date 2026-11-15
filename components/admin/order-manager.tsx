'use client'

// ============================================================
// components/admin/order-manager.tsx
// Quản lý Lịch sử bán hàng, Tự động tính hạn bảo hành theo lịch & Phiếu bảo hành
// ============================================================
import { useState, useTransition, useRef } from 'react'
import {
  ShieldCheck,
  Search,
  Plus,
  Calendar,
  DollarSign,
  Receipt,
  Image as ImageIcon,
  FileText,
  Copy,
  Check,
  Edit2,
  Trash2,
  ExternalLink,
  Loader2,
  X,
  AlertCircle,
  Eye,
  CheckCircle2,
  Clock,
  RotateCcw,
  Upload,
  Share2,
  CalendarDays,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
} from '@/app/admin/actions'
import {
  formatVND,
  formatDateShort,
  cn,
  calculateWarrantyExpiry,
  parseWarrantyPeriod,
  getEffectiveWarrantyStatus,
  getDaysRemaining,
} from '@/lib/utils'
import type { Order, OrderFormData, OrderStatus, Product } from '@/lib/types'
import { toast } from 'sonner'

interface OrderManagerProps {
  initialOrders: Order[]
  products: Product[]
}

function getProductLogo(productName: string) {
  const name = productName.toLowerCase()
  if (name.includes('gemini') || name.includes('google drive')) return '/brands/gemini.svg'
  if (name.includes('chatgpt') || name.includes('openai')) return '/brands/chatgpt.svg'
  if (name.includes('netflix')) return '/brands/netflix.svg'
  if (name.includes('youtube')) return '/brands/youtube.svg'
  if (name.includes('spotify')) return '/brands/spotify.svg'
  if (name.includes('canva')) return '/brands/canva.svg'
  if (name.includes('capcut')) return '/brands/capcut.svg'
  return '/brands/google.svg'
}

function getTodayString() {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function OrderManager({ initialOrders, products }: OrderManagerProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null)
  const [viewingImage, setViewingImage] = useState<{ url: string; title: string } | null>(null)
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isUploadingBill, setIsUploadingBill] = useState(false)
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null)

  // Form Fields State
  const [customerName, setCustomerName] = useState('')
  const [customerContact, setCustomerContact] = useState('')
  const [selectedProductId, setSelectedProductId] = useState<string>('')
  const [productName, setProductName] = useState('')
  const [price, setPrice] = useState<number>(0)
  const [purchaseDate, setPurchaseDate] = useState<string>(getTodayString())
  const [warrantyDuration, setWarrantyDuration] = useState('')
  const [warrantyMonths, setWarrantyMonths] = useState<number>(1)
  const [warrantyDays, setWarrantyDays] = useState<number>(0)
  const [warrantyExpiryDate, setWarrantyExpiryDate] = useState<string>('')
  const [accountNote, setAccountNote] = useState('')
  const [billImage, setBillImage] = useState<string | null>(null)
  const [attachmentImage, setAttachmentImage] = useState<string | null>(null)
  const [status, setStatus] = useState<OrderStatus>('active')

  const billFileInputRef = useRef<HTMLInputElement>(null)
  const attachmentFileInputRef = useRef<HTMLInputElement>(null)

  // Mở modal tạo mới
  const handleOpenCreate = () => {
    setEditingOrder(null)
    setCustomerName('')
    setCustomerContact('')
    const today = getTodayString()
    setPurchaseDate(today)
    setAccountNote('')
    setBillImage(null)
    setAttachmentImage(null)
    setStatus('active')

    // Chọn sản phẩm đầu tiên nếu có
    if (products.length > 0) {
      const p = products[0]
      setSelectedProductId(p.id)
      setProductName(p.name)
      setPrice(p.price)
      const durationText = p.warranty || p.duration || 'Bảo hành Full thời gian'
      setWarrantyDuration(durationText)
      const { months, days } = parseWarrantyPeriod(durationText)
      setWarrantyMonths(months)
      setWarrantyDays(days)
      setWarrantyExpiryDate(calculateWarrantyExpiry(today, months, days))
    } else {
      setSelectedProductId('')
      setProductName('')
      setPrice(0)
      setWarrantyDuration('')
      setWarrantyMonths(1)
      setWarrantyDays(0)
      setWarrantyExpiryDate(calculateWarrantyExpiry(today, 1, 0))
    }
    setIsFormOpen(true)
  }

  // Khi chọn sản phẩm từ dropdown -> Tự động điền giá, thời hạn và TÍNH TOÁN NGÀY HẾT HẠN THEO LỊCH
  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId)
    if (productId === 'custom') {
      setProductName('')
      setPrice(0)
      setWarrantyDuration('')
      setWarrantyMonths(1)
      setWarrantyDays(0)
      setWarrantyExpiryDate(calculateWarrantyExpiry(purchaseDate, 1, 0))
      return
    }
    const found = products.find((p) => p.id === productId)
    if (found) {
      setProductName(found.name)
      setPrice(found.price)
      const durationText = found.warranty || found.duration || 'Bảo hành Full thời gian'
      setWarrantyDuration(durationText)
      const { months, days } = parseWarrantyPeriod(durationText)
      setWarrantyMonths(months)
      setWarrantyDays(days)
      // Tự động kiểm tra lịch (28/29/30/31 ngày) để chọn chính xác ngày hết hạn
      setWarrantyExpiryDate(calculateWarrantyExpiry(purchaseDate, months, days))
    }
  }

  // Khi thay đổi ngày mua -> Tự động tính lại ngày hết hạn
  const handlePurchaseDateChange = (newDate: string) => {
    setPurchaseDate(newDate)
    setWarrantyExpiryDate(calculateWarrantyExpiry(newDate, warrantyMonths, warrantyDays))
  }

  // Khi thay đổi số tháng bảo hành -> Tự động tính lại ngày hết hạn
  const handleWarrantyMonthsChange = (months: number) => {
    setWarrantyMonths(months)
    setWarrantyDays(0)
    setWarrantyExpiryDate(calculateWarrantyExpiry(purchaseDate, months, 0))
    setWarrantyDuration(`Bảo hành ${months} tháng`)
  }

  // Chọn nhanh ngày (ví dụ 7 ngày đầu)
  const handleSetQuickDays = (days: number) => {
    setWarrantyDays(days)
    setWarrantyMonths(0)
    setWarrantyExpiryDate(calculateWarrantyExpiry(purchaseDate, 0, days))
    setWarrantyDuration(`Bảo hành ${days} ngày đầu`)
  }

  // Mở modal sửa
  const handleOpenEdit = (o: Order) => {
    setEditingOrder(o)
    setCustomerName(o.customer_name)
    setCustomerContact(o.customer_contact || '')
    setSelectedProductId(o.product_id || 'custom')
    setProductName(o.product_name)
    setPrice(o.price)
    const pDate = o.purchase_date || getTodayString()
    setPurchaseDate(pDate)
    setWarrantyDuration(o.warranty_duration || '')
    const months = o.warranty_months !== null && o.warranty_months !== undefined ? Number(o.warranty_months) : 1
    setWarrantyMonths(months)
    setWarrantyDays(0)
    setWarrantyExpiryDate(o.warranty_expiry_date || calculateWarrantyExpiry(pDate, months, 0))
    setAccountNote(o.account_note || '')
    setBillImage(o.bill_image || null)
    setAttachmentImage(o.attachment_image || null)
    setStatus(o.status)
    setIsFormOpen(true)
  }

  // Upload file hình ảnh lên Supabase Storage bucket 'orders'
  const handleUploadFile = async (
    file: File,
    type: 'bill' | 'attachment'
  ) => {
    if (type === 'bill') setIsUploadingBill(true)
    else setIsUploadingAttachment(true)

    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop() || 'png'
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
      const filePath = `${type}/${fileName}`

      const { data, error } = await supabase.storage
        .from('orders')
        .upload(filePath, file, { cacheControl: '3600', upsert: true })

      if (error) {
        // Fallback Base64 Data URL nếu storage gặp trục trặc
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64 = reader.result as string
          if (type === 'bill') setBillImage(base64)
          else setAttachmentImage(base64)
          toast.info('Đã lưu ảnh.')
        }
        reader.readAsDataURL(file)
      } else {
        const { data: urlData } = supabase.storage
          .from('orders')
          .getPublicUrl(filePath)
        if (type === 'bill') setBillImage(urlData.publicUrl)
        else setAttachmentImage(urlData.publicUrl)
        toast.success(`Đã tải lên ảnh ${type === 'bill' ? 'bill chuyển khoản' : 'đính kèm'}`)
      }
    } catch (err: any) {
      toast.error('Lỗi khi tải ảnh: ' + (err.message || 'Thử lại sau'))
    } finally {
      if (type === 'bill') setIsUploadingBill(false)
      else setIsUploadingAttachment(false)
    }
  }

  // Lưu Form (Tạo mới hoặc Cập nhật)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!customerName.trim()) {
      toast.error('Vui lòng nhập tên khách hàng')
      return
    }
    if (!productName.trim()) {
      toast.error('Vui lòng chọn hoặc nhập tên sản phẩm')
      return
    }

    const payload: OrderFormData = {
      customer_name: customerName.trim(),
      customer_contact: customerContact.trim() || null,
      product_id: selectedProductId && selectedProductId !== 'custom' ? selectedProductId : null,
      product_name: productName.trim(),
      price: Number(price) || 0,
      bill_image: billImage,
      attachment_image: attachmentImage,
      account_note: accountNote.trim() || null,
      purchase_date: purchaseDate || getTodayString(),
      warranty_duration: warrantyDuration.trim() || null,
      warranty_months: warrantyMonths,
      warranty_expiry_date: warrantyExpiryDate || null,
      status: status,
    }

    startTransition(async () => {
      if (editingOrder) {
        const res = await updateOrder(editingOrder.id, payload)
        if (res.error) {
          toast.error(res.error)
        } else {
          toast.success('Cập nhật đơn hàng thành công')
          const updated: Order = {
            ...editingOrder,
            ...payload,
            updated_at: new Date().toISOString(),
          }
          setOrders((prev) =>
            prev.map((o) => (o.id === editingOrder.id ? updated : o))
          )
          if (viewingOrder && viewingOrder.id === editingOrder.id) {
            setViewingOrder(updated)
          }
          setIsFormOpen(false)
        }
      } else {
        const res = await createOrder(payload)
        if (res.error) {
          toast.error(res.error)
        } else {
          toast.success('Đã tạo thành công Phiếu Bảo Hành!')
          if (res.order) {
            const newOrder = res.order as Order
            setOrders((prev) => [newOrder, ...prev])
            // Tự động mở xem chi tiết & link bảo hành để admin copy gửi Zalo ngay lập tức!
            setViewingOrder(newOrder)
          }
          setIsFormOpen(false)
        }
      }
    })
  }

  // Chuyển nhanh trạng thái
  const handleQuickStatusChange = (order: Order, newStatus: OrderStatus) => {
    startTransition(async () => {
      const res = await updateOrderStatus(order.id, newStatus)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(
          newStatus === 'active'
            ? 'Đã kích hoạt bảo hành'
            : newStatus === 'expired'
            ? 'Đã chuyển sang hết hạn'
            : 'Đã đánh dấu hoàn tiền'
        )
        setOrders((prev) =>
          prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o))
        )
        if (viewingOrder && viewingOrder.id === order.id) {
          setViewingOrder({ ...viewingOrder, status: newStatus })
        }
      }
    })
  }

  // Xóa đơn hàng
  const handleDelete = () => {
    if (!deletingOrder) return
    startTransition(async () => {
      const res = await deleteOrder(deletingOrder.id)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Đã xóa đơn hàng')
        setOrders((prev) => prev.filter((o) => o.id !== deletingOrder.id))
        if (viewingOrder?.id === deletingOrder.id) {
          setViewingOrder(null)
        }
        setDeletingOrder(null)
      }
    })
  }

  // Sao chép thông tin tài khoản
  const handleCopyNote = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('Đã sao chép thông tin tài khoản!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Sao chép link phiếu bảo hành dành riêng cho khách
  const handleCopyWarrantyLink = (orderId: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const link = `${origin}/bao-hanh/${orderId}`
    navigator.clipboard.writeText(link)
    setCopiedLinkId(orderId)
    toast.success('Đã sao chép liên kết Phiếu Bảo Hành gửi cho khách!')
    setTimeout(() => setCopiedLinkId(null), 2500)
  }

  // Lọc và Tìm kiếm (tự động tính trạng thái thực tế qua getEffectiveWarrantyStatus)
  const filteredOrders = orders.filter((o) => {
    const effectiveStatus = getEffectiveWarrantyStatus(o.status, o.warranty_expiry_date)
    const matchSearch =
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      (o.customer_contact && o.customer_contact.toLowerCase().includes(search.toLowerCase())) ||
      o.product_name.toLowerCase().includes(search.toLowerCase()) ||
      (o.account_note && o.account_note.toLowerCase().includes(search.toLowerCase()))

    const matchStatus = statusFilter === 'all' || effectiveStatus === statusFilter

    return matchSearch && matchStatus
  })

  // Thống kê nhanh với trạng thái thực tế (tự động hết hạn khi qua ngày)
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.price) || 0), 0)
  const activeCount = orders.filter(
    (o) => getEffectiveWarrantyStatus(o.status, o.warranty_expiry_date) === 'active'
  ).length
  const expiredCount = orders.filter(
    (o) => getEffectiveWarrantyStatus(o.status, o.warranty_expiry_date) === 'expired'
  ).length
  const refundedCount = orders.filter((o) => o.status === 'refunded').length

  return (
    <div className="space-y-6">
      {/* Header & Thống kê */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Đơn hàng & Bảo hành
              </h1>
              <p className="text-sm text-slate-400">
                Tự động kiểm tra lịch hết hạn bảo hành & tạo liên kết Phiếu bảo hành riêng cho khách.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-sm shadow-lg shadow-violet-600/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Kích hoạt bảo hành mới
        </button>
      </div>

      {/* Cards thống kê tự động */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Tổng đơn bán</span>
            <Receipt className="w-4 h-4 text-violet-400" />
          </div>
          <p className="text-xl md:text-2xl font-bold text-white mt-2">{orders.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Tất cả giao dịch ghi nhận</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Doanh thu ghi nhận</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl md:text-2xl font-bold text-emerald-400 mt-2">
            {formatVND(totalRevenue)}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Từ tất cả các đơn hàng</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Đang bảo hành</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-xl md:text-2xl font-bold text-cyan-400 mt-2">{activeCount}</p>
          <p className="text-xs text-slate-500 mt-0.5">Còn trong thời hạn lịch</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Hết hạn / Hoàn tiền</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl md:text-2xl font-bold text-slate-300 mt-2">
            {expiredCount + refundedCount}{' '}
            <span className="text-xs font-normal text-slate-500">
              ({expiredCount} hết hạn, {refundedCount} hoàn)
            </span>
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Tự động chuyển khi qua ngày</p>
        </div>
      </div>

      {/* Bộ lọc & Tìm kiếm */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên khách, Zalo, gói tài khoản, ghi chú..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800/60 border border-slate-700/60 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        {/* Tab lọc trạng thái */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'active', label: 'Đang bảo hành' },
            { id: 'expired', label: 'Hết hạn' },
            { id: 'refunded', label: 'Hoàn tiền' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
                statusFilter === tab.id
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách đơn hàng */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
          <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-base font-semibold text-slate-300">
            {search || statusFilter !== 'all'
              ? 'Không tìm thấy đơn hàng phù hợp'
              : 'Chưa có đơn hàng nào được ghi nhận'}
          </p>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Bấm nút &quot;Kích hoạt bảo hành mới&quot; để tạo phiếu bảo hành và lấy liên kết gửi riêng cho khách.
          </p>
          {!search && statusFilter === 'all' && (
            <button
              onClick={handleOpenCreate}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tạo đơn đầu tiên
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-950/40 text-slate-400 text-xs font-semibold">
                <th className="py-3.5 px-4">Khách hàng</th>
                <th className="py-3.5 px-4">Sản phẩm / Gói</th>
                <th className="py-3.5 px-4">Giá bán</th>
                <th className="py-3.5 px-4">Thời gian bảo hành</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4 text-center">Chứng từ</th>
                <th className="py-3.5 px-4 text-right">Phiếu & Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.map((order) => {
                const brandLogo = getProductLogo(order.product_name)
                const effectiveStatus = getEffectiveWarrantyStatus(order.status, order.warranty_expiry_date)
                const daysRemaining = getDaysRemaining(order.warranty_expiry_date)

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    {/* Khách hàng */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-white">{order.customer_name}</div>
                      {order.customer_contact ? (
                        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          <span className="text-violet-400">Zalo/SĐT:</span>{' '}
                          {order.customer_contact}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-600 mt-0.5">Không có liên hệ</div>
                      )}
                    </td>

                    {/* Sản phẩm */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/60 p-1 flex items-center justify-center shrink-0">
                          <img
                            src={brandLogo}
                            alt="Logo"
                            className="w-5 h-5 object-contain"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-slate-200 line-clamp-1">
                            {order.product_name}
                          </div>
                          {order.warranty_duration && (
                            <div className="text-xs text-emerald-400/90 line-clamp-1 mt-0.5">
                              🛡️ {order.warranty_duration}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Giá bán */}
                    <td className="py-3.5 px-4 font-semibold text-emerald-400 whitespace-nowrap">
                      {formatVND(order.price)}
                    </td>

                    {/* Ngày mua & Hạn bảo hành theo lịch */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-slate-300 text-xs flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        Mua: {order.purchase_date ? formatDateShort(order.purchase_date) : 'Hôm nay'}
                      </div>
                      {order.warranty_expiry_date && (
                        <div className="text-xs mt-1 flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span className={effectiveStatus === 'active' ? 'text-cyan-400' : 'text-slate-500'}>
                            Hạn: {formatDateShort(order.warranty_expiry_date)}
                          </span>
                          {effectiveStatus === 'active' && daysRemaining !== null && (
                            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                              còn {daysRemaining} ngày
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Trạng thái (TỰ ĐỘNG HẾT HẠN KHI QUA NGÀY) */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {effectiveStatus === 'active' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Đang bảo hành
                        </span>
                      )}
                      {effectiveStatus === 'expired' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Hết hạn
                        </span>
                      )}
                      {effectiveStatus === 'refunded' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Đã hoàn tiền
                        </span>
                      )}
                    </td>

                    {/* Bill & Đính kèm */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        {order.bill_image ? (
                          <button
                            type="button"
                            onClick={() =>
                              setViewingImage({
                                url: order.bill_image!,
                                title: `Bill chuyển khoản - ${order.customer_name}`,
                              })
                            }
                            className="relative group/bill w-8 h-8 rounded-lg overflow-hidden border border-emerald-500/30 hover:border-emerald-400 transition-all"
                            title="Bấm xem bill chuyển khoản"
                          >
                            <img
                              src={order.bill_image}
                              alt="Bill"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/bill:opacity-100 transition-opacity">
                              <Eye className="w-3.5 h-3.5 text-white" />
                            </div>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-600">Không bill</span>
                        )}

                        {order.attachment_image && (
                          <button
                            type="button"
                            onClick={() =>
                              setViewingImage({
                                url: order.attachment_image!,
                                title: `Ảnh đính kèm - ${order.customer_name}`,
                              })
                            }
                            className="relative group/att w-8 h-8 rounded-lg overflow-hidden border border-violet-500/30 hover:border-violet-400 transition-all"
                            title="Bấm xem ảnh đính kèm"
                          >
                            <img
                              src={order.attachment_image}
                              alt="Attachment"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/att:opacity-100 transition-opacity">
                              <Eye className="w-3.5 h-3.5 text-white" />
                            </div>
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Thao tác & Copy Link Phiếu bảo hành */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Nút Copy Link Phiếu Bảo Hành */}
                        <button
                          onClick={() => handleCopyWarrantyLink(order.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-violet-600/10 hover:bg-violet-600/20 text-violet-300 border border-violet-500/20 transition-all"
                          title="Sao chép liên kết Phiếu bảo hành gửi riêng cho khách"
                        >
                          {copiedLinkId === order.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-3.5 h-3.5" />
                              <span>Link phiếu</span>
                            </>
                          )}
                        </button>

                        <a
                          href={`/bao-hanh/${order.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Mở xem Phiếu bảo hành khách thấy"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => setViewingOrder(order)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(order)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                          title="Chỉnh sửa đơn"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingOrder(order)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Xóa đơn hàng"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================
          MODAL: KÍCH HOẠT BẢO HÀNH / TẠO & SỬA ĐƠN HÀNG
         ============================================================ */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-white">
                  {editingOrder ? 'Chỉnh sửa đơn hàng' : 'Kích hoạt bảo hành & Tạo Phiếu bảo hành'}
                </h2>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Tên khách hàng & Zalo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Tên khách hàng <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="VD: Nguyễn Văn A..."
                    className="w-full px-3.5 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Số điện thoại / Zalo khách
                  </label>
                  <input
                    type="text"
                    value={customerContact}
                    onChange={(e) => setCustomerContact(e.target.value)}
                    placeholder="VD: 0987654321 hoặc link Zalo..."
                    className="w-full px-3.5 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              {/* Chọn sản phẩm */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Chọn sản phẩm (Tự động lấy giá, thời hạn & tính ngày theo lịch) <span className="text-rose-400">*</span>
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {formatVND(p.price)}
                    </option>
                  ))}
                  <option value="custom">+ Gói khác / Nhập tay tùy chỉnh...</option>
                </select>
              </div>

              {/* Tên gói (nếu chọn custom hoặc cần sửa) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tên gói hiển thị trên Phiếu bảo hành <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="VD: ChatGPT Plus 1 Tháng..."
                  className="w-full px-3.5 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              {/* Giá bán & Trạng thái */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Giá bán (VND)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-emerald-400 font-semibold focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Trạng thái
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as OrderStatus)}
                    className="w-full px-3.5 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value="active">Đang bảo hành (Tự động hết hạn khi qua ngày)</option>
                    <option value="expired">Hết hạn</option>
                    <option value="refunded">Đã hoàn tiền</option>
                  </select>
                </div>
              </div>

              {/* KHUNG THỜI GIAN & TÍNH LỊCH BẢO HÀNH CHUẨN XÁC */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-violet-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-violet-300 uppercase tracking-wider flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4 text-violet-400" />
                    Cài đặt thời gian bảo hành theo lịch
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Tự động nhận diện tháng 28, 29, 30, 31 ngày
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Ngày mua */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Ngày mua / kích hoạt <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={purchaseDate}
                      onChange={(e) => handlePurchaseDateChange(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-violet-500 transition-colors [color-scheme:dark]"
                    />
                  </div>

                  {/* Bảo hành mấy tháng (hoặc ngày) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Bảo hành mấy tháng?
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={warrantyMonths}
                      onChange={(e) => handleWarrantyMonthsChange(Number(e.target.value))}
                      placeholder="VD: 1, 3, 8, 12..."
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-cyan-400 font-bold focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>

                  {/* Ngày hết hạn bảo hành tự tính */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Tự động tính ngày hết hạn
                    </label>
                    <input
                      type="date"
                      value={warrantyExpiryDate}
                      onChange={(e) => setWarrantyExpiryDate(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800 border border-cyan-500/40 rounded-lg text-sm text-cyan-300 font-bold focus:outline-none focus:border-cyan-400 transition-colors [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Phím chọn nhanh thời hạn */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 mr-1">Chọn nhanh:</span>
                  <button
                    type="button"
                    onClick={() => handleSetQuickDays(7)}
                    className="px-2 py-0.5 rounded text-[11px] bg-slate-800 hover:bg-violet-600/30 text-slate-300 hover:text-white border border-slate-700"
                  >
                    7 ngày
                  </button>
                  <button
                    type="button"
                    onClick={() => handleWarrantyMonthsChange(1)}
                    className="px-2 py-0.5 rounded text-[11px] bg-slate-800 hover:bg-violet-600/30 text-slate-300 hover:text-white border border-slate-700"
                  >
                    1 tháng
                  </button>
                  <button
                    type="button"
                    onClick={() => handleWarrantyMonthsChange(3)}
                    className="px-2 py-0.5 rounded text-[11px] bg-slate-800 hover:bg-violet-600/30 text-slate-300 hover:text-white border border-slate-700"
                  >
                    3 tháng
                  </button>
                  <button
                    type="button"
                    onClick={() => handleWarrantyMonthsChange(6)}
                    className="px-2 py-0.5 rounded text-[11px] bg-slate-800 hover:bg-violet-600/30 text-slate-300 hover:text-white border border-slate-700"
                  >
                    6 tháng
                  </button>
                  <button
                    type="button"
                    onClick={() => handleWarrantyMonthsChange(8)}
                    className="px-2 py-0.5 rounded text-[11px] bg-slate-800 hover:bg-violet-600/30 text-slate-300 hover:text-white border border-slate-700"
                  >
                    8 tháng
                  </button>
                  <button
                    type="button"
                    onClick={() => handleWarrantyMonthsChange(12)}
                    className="px-2 py-0.5 rounded text-[11px] bg-slate-800 hover:bg-violet-600/30 text-slate-300 hover:text-white border border-slate-700"
                  >
                    12 tháng
                  </button>
                  <button
                    type="button"
                    onClick={() => handleWarrantyMonthsChange(18)}
                    className="px-2 py-0.5 rounded text-[11px] bg-slate-800 hover:bg-violet-600/30 text-slate-300 hover:text-white border border-slate-700"
                  >
                    18 tháng
                  </button>
                </div>

                {/* Chuỗi mô tả bảo hành */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Ghi chú chính sách hiển thị (vd: &quot;Bảo hành Full 8 tháng&quot;)
                  </label>
                  <input
                    type="text"
                    value={warrantyDuration}
                    onChange={(e) => setWarrantyDuration(e.target.value)}
                    placeholder="VD: Bảo hành Full 8 tháng..."
                    className="w-full px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              {/* Bill chuyển khoản & Ảnh đính kèm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Bill Image */}
                <div className="p-3.5 rounded-xl border border-dashed border-slate-700 bg-slate-800/40">
                  <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                      Bill chuyển khoản
                    </span>
                    {billImage && (
                      <button
                        type="button"
                        onClick={() => setBillImage(null)}
                        className="text-rose-400 hover:text-rose-300 text-xs"
                      >
                        Xóa ảnh
                      </button>
                    )}
                  </label>

                  {billImage ? (
                    <div className="relative rounded-lg overflow-hidden border border-slate-700 h-32 group">
                      <img
                        src={billImage}
                        alt="Bill preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button
                          type="button"
                          onClick={() =>
                            setViewingImage({ url: billImage, title: 'Bill chuyển khoản' })
                          }
                          className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs text-white backdrop-blur-sm"
                        >
                          Xem ảnh to
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        ref={billFileInputRef}
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleUploadFile(file, 'bill')
                        }}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={isUploadingBill}
                        onClick={() => billFileInputRef.current?.click()}
                        className="w-full h-24 rounded-lg border border-dashed border-slate-600 hover:border-violet-500 hover:bg-violet-500/5 flex flex-col items-center justify-center text-slate-400 hover:text-white transition-all text-xs"
                      >
                        {isUploadingBill ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin text-violet-400 mb-1" />
                            Đang tải ảnh...
                          </>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-slate-500 mb-1" />
                            Bấm để chọn file ảnh bill
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Attachment Image */}
                <div className="p-3.5 rounded-xl border border-dashed border-slate-700 bg-slate-800/40">
                  <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-violet-400" />
                      Hình ảnh muốn đính kèm
                    </span>
                    {attachmentImage && (
                      <button
                        type="button"
                        onClick={() => setAttachmentImage(null)}
                        className="text-rose-400 hover:text-rose-300 text-xs"
                      >
                        Xóa ảnh
                      </button>
                    )}
                  </label>

                  {attachmentImage ? (
                    <div className="relative rounded-lg overflow-hidden border border-slate-700 h-32 group">
                      <img
                        src={attachmentImage}
                        alt="Attachment preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button
                          type="button"
                          onClick={() =>
                            setViewingImage({
                              url: attachmentImage,
                              title: 'Hình ảnh đính kèm',
                            })
                          }
                          className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs text-white backdrop-blur-sm"
                        >
                          Xem ảnh to
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        ref={attachmentFileInputRef}
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleUploadFile(file, 'attachment')
                        }}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={isUploadingAttachment}
                        onClick={() => attachmentFileInputRef.current?.click()}
                        className="w-full h-24 rounded-lg border border-dashed border-slate-600 hover:border-violet-500 hover:bg-violet-500/5 flex flex-col items-center justify-center text-slate-400 hover:text-white transition-all text-xs"
                      >
                        {isUploadingAttachment ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin text-violet-400 mb-1" />
                            Đang tải ảnh...
                          </>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-slate-500 mb-1" />
                            Bấm để chọn ảnh đính kèm
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Note thông tin tài khoản */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  Note thông tin tài khoản (bàn giao cho khách xem trên Phiếu bảo hành)
                </label>
                <textarea
                  rows={3}
                  value={accountNote}
                  onChange={(e) => setAccountNote(e.target.value)}
                  placeholder="VD: Email / Mật khẩu / 2FA / Slot profile / Link tham gia nhóm..."
                  className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors font-mono"
                />
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingOrder ? 'Lưu thay đổi' : 'Xác nhận tạo Phiếu bảo hành'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL: XEM CHI TIẾT ĐƠN HÀNG & LIÊN KẾT PHIẾU BẢO HÀNH
         ============================================================ */}
      {viewingOrder && (() => {
        const effectiveStatus = getEffectiveWarrantyStatus(viewingOrder.status, viewingOrder.warranty_expiry_date)
        const daysRemaining = getDaysRemaining(viewingOrder.warranty_expiry_date)
        const origin = typeof window !== 'undefined' ? window.location.origin : ''
        const warrantySlipUrl = `${origin}/bao-hanh/${viewingOrder.id}`

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between z-10">
                <div>
                  <h3 className="text-lg font-bold text-white">Chi tiết Đơn hàng & Phiếu bảo hành</h3>
                  <p className="text-xs text-slate-400">Mã đơn: #{viewingOrder.id.slice(0, 8)}</p>
                </div>
                <button
                  onClick={() => setViewingOrder(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* BOX LIÊN KẾT PHIẾU BẢO HÀNH GỬI RIÊNG CHO KHÁCH */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-violet-950/60 to-indigo-950/50 border border-violet-500/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-violet-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-violet-400" />
                      Liên kết Phiếu bảo hành (gửi riêng cho khách)
                    </span>
                    <span className="text-[11px] text-emerald-400 font-medium">Bảo mật</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={warrantySlipUrl}
                      className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs font-mono text-slate-300 select-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopyWarrantyLink(viewingOrder.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors shrink-0"
                    >
                      {copiedLinkId === viewingOrder.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                    <a
                      href={`/bao-hanh/${viewingOrder.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                      title="Mở tab mới xem giao diện khách"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Box tổng quan */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Khách hàng</span>
                    <span className="text-sm font-bold text-white">
                      {viewingOrder.customer_name}
                    </span>
                  </div>
                  {viewingOrder.customer_contact && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Liên hệ Zalo / SĐT</span>
                      <span className="text-sm font-mono text-cyan-400">
                        {viewingOrder.customer_contact}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Sản phẩm / Gói</span>
                    <span className="text-sm font-medium text-slate-200">
                      {viewingOrder.product_name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Giá thanh toán</span>
                    <span className="text-base font-bold text-emerald-400">
                      {formatVND(viewingOrder.price)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Ngày kích hoạt</span>
                    <span className="text-sm text-slate-300">
                      {viewingOrder.purchase_date
                        ? formatDateShort(viewingOrder.purchase_date)
                        : 'Hôm nay'}
                    </span>
                  </div>
                  {viewingOrder.warranty_expiry_date && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Hạn bảo hành theo lịch</span>
                      <span className="text-sm font-bold text-cyan-400">
                        {formatDateShort(viewingOrder.warranty_expiry_date)}{' '}
                        {effectiveStatus === 'active' && daysRemaining !== null && (
                          <span className="text-xs text-emerald-400 font-normal">
                            (Còn {daysRemaining} ngày)
                          </span>
                        )}
                        {effectiveStatus === 'expired' && (
                          <span className="text-xs text-amber-400 font-normal">
                            (Đã qua ngày)
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                  {viewingOrder.warranty_duration && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Chính sách cam kết</span>
                      <span className="text-sm font-semibold text-emerald-400">
                        🛡️ {viewingOrder.warranty_duration}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-xs text-slate-400">Trạng thái bảo hành</span>
                    <div className="flex items-center gap-2">
                      {effectiveStatus === 'active' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Đang bảo hành
                        </span>
                      )}
                      {effectiveStatus === 'expired' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Hết hạn
                        </span>
                      )}
                      {effectiveStatus === 'refunded' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Đã hoàn tiền
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Note thông tin tài khoản */}
                {viewingOrder.account_note && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-cyan-400" />
                        Thông tin tài khoản bàn giao
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyNote(viewingOrder.account_note!, viewingOrder.id)
                        }
                        className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
                      >
                        {copiedId === viewingOrder.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Sao chép nhanh
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-slate-300 whitespace-pre-wrap break-all selection:bg-violet-600">
                      {viewingOrder.account_note}
                    </div>
                  </div>
                )}

                {/* Hình ảnh Bill & Đính kèm */}
                <div className="grid grid-cols-2 gap-3">
                  {viewingOrder.bill_image ? (
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                        Bill chuyển khoản
                      </label>
                      <div
                        onClick={() =>
                          setViewingImage({
                            url: viewingOrder.bill_image!,
                            title: `Bill chuyển khoản - ${viewingOrder.customer_name}`,
                          })
                        }
                        className="h-36 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 cursor-pointer relative group"
                      >
                        <img
                          src={viewingOrder.bill_image}
                          alt="Bill"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs text-white bg-black/60 px-2 py-1 rounded">
                            Xem phóng to
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-36 rounded-xl border border-dashed border-slate-800 flex items-center justify-center text-xs text-slate-600">
                      Không có bill
                    </div>
                  )}

                  {viewingOrder.attachment_image ? (
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                        Hình ảnh đính kèm
                      </label>
                      <div
                        onClick={() =>
                          setViewingImage({
                            url: viewingOrder.attachment_image!,
                            title: `Ảnh đính kèm - ${viewingOrder.customer_name}`,
                          })
                        }
                        className="h-36 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 cursor-pointer relative group"
                      >
                        <img
                          src={viewingOrder.attachment_image}
                          alt="Attachment"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs text-white bg-black/60 px-2 py-1 rounded">
                            Xem phóng to
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-36 rounded-xl border border-dashed border-slate-800 flex items-center justify-center text-xs text-slate-600">
                      Không có ảnh đính kèm
                    </div>
                  )}
                </div>

                {/* Nút chuyển trạng thái nhanh */}
                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400">Đổi trạng thái:</span>
                    {viewingOrder.status !== 'active' && (
                      <button
                        type="button"
                        onClick={() => handleQuickStatusChange(viewingOrder, 'active')}
                        className="px-2.5 py-1 rounded-lg text-xs bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
                      >
                        Kích hoạt lại
                      </button>
                    )}
                    {viewingOrder.status !== 'expired' && (
                      <button
                        type="button"
                        onClick={() => handleQuickStatusChange(viewingOrder, 'expired')}
                        className="px-2.5 py-1 rounded-lg text-xs bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
                      >
                        Báo hết hạn
                      </button>
                    )}
                    {viewingOrder.status !== 'refunded' && (
                      <button
                        type="button"
                        onClick={() => handleQuickStatusChange(viewingOrder, 'refunded')}
                        className="px-2.5 py-1 rounded-lg text-xs bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
                      >
                        Hoàn tiền
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const toEdit = viewingOrder
                        setViewingOrder(null)
                        handleOpenEdit(toEdit)
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Chỉnh sửa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ============================================================
          MODAL: XEM ẢNH PHÓNG TO (LIGHTBOX)
         ============================================================ */}
      {viewingImage && (
        <div
          onClick={() => setViewingImage(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col"
          >
            <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white truncate max-w-md">
                {viewingImage.title}
              </h4>
              <div className="flex items-center gap-2">
                <a
                  href={viewingImage.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  title="Mở tab mới"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setViewingImage(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-2 overflow-auto flex items-center justify-center max-h-[80vh]">
              <img
                src={viewingImage.url}
                alt="Preview"
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL: XÁC NHẬN XÓA ĐƠN HÀNG
         ============================================================ */}
      {deletingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Xác nhận xóa đơn hàng?</h3>
                <p className="text-xs text-slate-400">Hành động này không thể hoàn tác.</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-6 bg-slate-950 p-3 rounded-xl border border-slate-800">
              Bạn có chắc chắn muốn xóa đơn hàng của khách{' '}
              <strong className="text-white">{deletingOrder.customer_name}</strong> ({deletingOrder.product_name})?
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingOrder(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleDelete}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
