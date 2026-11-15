'use client'

// ============================================================
// components/site/warranty-slip-view.tsx
// Giao diện Phiếu Bảo Hành Điện Tử dành riêng cho khách hàng
// ============================================================
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Calendar,
  DollarSign,
  Copy,
  Check,
  Share2,
  Printer,
  ExternalLink,
  MessageCircle,
  Clock,
  AlertTriangle,
  RotateCcw,
  Receipt,
  Image as ImageIcon,
  Eye,
  X,
  Lock,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import {
  formatVND,
  formatDateShort,
  cn,
  getEffectiveWarrantyStatus,
  getDaysRemaining,
} from '@/lib/utils'
import type { Order } from '@/lib/types'
import { toast } from 'sonner'

interface WarrantySlipViewProps {
  order: Order
  zaloPhone: string
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

export function WarrantySlipView({ order, zaloPhone }: WarrantySlipViewProps) {
  const [copiedNote, setCopiedNote] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [viewingImage, setViewingImage] = useState<{ url: string; title: string } | null>(null)
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
    }
  }, [])

  // Tự động kiểm tra trạng thái bảo hành theo lịch thực tế (qua ngày sẽ tự động hết hạn)
  const effectiveStatus = getEffectiveWarrantyStatus(order.status, order.warranty_expiry_date)
  const daysRemaining = getDaysRemaining(order.warranty_expiry_date)

  const warrantyCode = `BH-${order.id.slice(0, 8).toUpperCase()}`
  const brandLogo = getProductLogo(order.product_name)
  const zaloSupportLink = `https://zalo.me/${zaloPhone}?text=${encodeURIComponent(
    `Xin chào AI GIÁ SỈ, tôi cần hỗ trợ cho Phiếu Bảo Hành mã: ${warrantyCode} (${order.product_name} - Khách: ${order.customer_name})`
  )}`

  const handleCopyNote = () => {
    if (!order.account_note) return
    navigator.clipboard.writeText(order.account_note)
    setCopiedNote(true)
    toast.success('Đã sao chép thông tin tài khoản')
    setTimeout(() => setCopiedNote(false), 2000)
  }

  const handleCopyLink = () => {
    const url = currentUrl || window.location.href
    navigator.clipboard.writeText(url)
    setCopiedLink(true)
    toast.success('Đã sao chép liên kết Phiếu bảo hành')
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-[#07070B] text-slate-100 py-8 sm:py-12 px-4 selection:bg-violet-600 selection:text-white print:bg-white print:text-black print:p-0">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none print:hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-violet-600/15 via-indigo-600/10 to-transparent blur-[120px]" />
        <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] bg-emerald-600/10 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        {/* Navigation Bar / Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 print:hidden">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 p-0.5 bg-white shrink-0">
              <img
                src="/logo.jpg"
                alt="AI GIÁ SỈ"
                className="w-full h-full object-contain"
              />
            </div>
            <span
              className="font-bold text-base tracking-tight text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              AI GIÁ SỈ
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
              title="Sao chép liên kết phiếu này để lưu trữ"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Đã chép link</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Chia sẻ link</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
              title="In hoặc lưu file PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In phiếu</span>
            </button>
          </div>
        </div>

        {/* THẺ PHIẾU BẢO HÀNH CHÍNH (Certificate Card) */}
        <div className="relative rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl overflow-hidden print:border-none print:shadow-none print:bg-white print:text-black">
          {/* Dải màu đỉnh thẻ */}
          <div
            className={cn(
              'h-2 w-full',
              order.status === 'active'
                ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500'
                : order.status === 'expired'
                ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500'
                : 'bg-gradient-to-r from-rose-500 via-pink-400 to-red-500'
            )}
          />

          <div className="p-6 sm:p-8 space-y-6">
            {/* Header Phiếu */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 print:border-gray-300">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-2 print:border-gray-400 print:text-black">
                  <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                  HỆ THỐNG XÁC THỰC BẢO HÀNH ĐIỆN TỬ
                </div>
                <h1
                  className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase print:text-black"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  PHIẾU BẢO HÀNH
                </h1>
                <p className="text-xs text-slate-400 mt-1 print:text-gray-600">
                  Mã chứng nhận bảo hành:{' '}
                  <span className="font-mono font-bold text-violet-400 print:text-black">
                    #{warrantyCode}
                  </span>
                </p>
              </div>

              {/* Huy hiệu trạng thái */}
              <div className="flex flex-col sm:items-end">
                {effectiveStatus === 'active' && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5 print:border-emerald-600 print:text-emerald-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse print:hidden" />
                    <span className="text-sm font-bold tracking-wide uppercase">
                      ĐANG BẢO HÀNH
                    </span>
                  </div>
                )}
                {effectiveStatus === 'expired' && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 print:border-amber-600 print:text-amber-700">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-bold tracking-wide uppercase">
                      HẾT HẠN BẢO HÀNH
                    </span>
                  </div>
                )}
                {effectiveStatus === 'refunded' && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 print:border-rose-600 print:text-rose-700">
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-sm font-bold tracking-wide uppercase">
                      ĐÃ HOÀN TIỀN
                    </span>
                  </div>
                )}
                <span className="text-[11px] text-slate-500 mt-1.5 print:text-gray-500">
                  {effectiveStatus === 'active' && order.warranty_expiry_date
                    ? `Hiệu lực đến: ${formatDateShort(order.warranty_expiry_date)}${
                        daysRemaining !== null ? ` (Còn ${daysRemaining} ngày)` : ''
                      }`
                    : effectiveStatus === 'expired' && order.warranty_expiry_date
                    ? `Đã hết hạn vào ngày: ${formatDateShort(order.warranty_expiry_date)}`
                    : 'Cấp bởi hệ sinh thái AI GIÁ SỈ'}
                </span>
              </div>
            </div>

            {/* Thông tin Khách hàng & Gói tài khoản */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box Khách Hàng */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2.5 print:border-gray-300 print:bg-gray-50">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 print:text-gray-600">
                  Thông tin khách hàng
                </span>
                <div className="pt-1">
                  <p className="text-lg font-bold text-white print:text-black">
                    {order.customer_name}
                  </p>
                  {order.customer_contact ? (
                    <p className="text-xs font-mono text-cyan-400 mt-0.5 print:text-gray-700">
                      Liên hệ: {order.customer_contact}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500 mt-0.5">Khách hàng thành viên</p>
                  )}
                </div>
              </div>

              {/* Box Gói Sản Phẩm */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2.5 print:border-gray-300 print:bg-gray-50">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 print:text-gray-600">
                  Sản phẩm & Dịch vụ
                </span>
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/60 p-1.5 flex items-center justify-center shrink-0 print:border-gray-400 print:bg-white">
                    <img
                      src={brandLogo}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-base font-bold text-white line-clamp-1 print:text-black">
                      {order.product_name}
                    </p>
                    <p className="text-xs font-semibold text-emerald-400 print:text-black">
                      {formatVND(order.price)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chi tiết thời gian & Quy định bảo hành */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-4 print:border-gray-300 print:bg-gray-50">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 print:text-gray-600">
                Thời gian & Chính sách bảo hành
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0 print:border-gray-400 print:text-black">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 print:text-gray-600">Ngày kích hoạt:</span>
                    <p className="text-sm font-bold text-white print:text-black">
                      {order.purchase_date
                        ? formatDateShort(order.purchase_date)
                        : formatDateShort(order.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 print:border-gray-400 print:text-black">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 print:text-gray-600">Thời hạn cam kết:</span>
                    <p className="text-sm font-bold text-emerald-400 print:text-black">
                      {order.warranty_duration || (order.warranty_months ? `${order.warranty_months} tháng` : 'Trọn thời gian')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 print:border-gray-400 print:text-black",
                    effectiveStatus === 'active'
                      ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                      : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                  )}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 print:text-gray-600">Hạn bảo hành đến:</span>
                    <p className={cn(
                      "text-sm font-bold print:text-black",
                      effectiveStatus === 'active' ? "text-cyan-400" : "text-amber-400"
                    )}>
                      {order.warranty_expiry_date
                        ? formatDateShort(order.warranty_expiry_date)
                        : 'Theo thỏa thuận'}
                    </p>
                    {order.warranty_expiry_date && (
                      <span className="text-[11px] text-slate-400 print:text-gray-600">
                        {effectiveStatus === 'active'
                          ? `(Còn ${daysRemaining} ngày)`
                          : '(Đã hết hạn)'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Cam kết bảo hành */}
              <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-300 leading-relaxed print:text-gray-700 print:border-gray-300">
                <strong className="text-emerald-400 font-semibold print:text-black">
                  Cam kết bảo hành uy tín:
                </strong>{' '}
                Hỗ trợ 1 đổi 1 hoặc hoàn tiền tương ứng nếu tài khoản gặp sự cố trong thời gian và quy định bảo hành. Xử lý nhanh chóng và tận tâm.
              </div>
            </div>

            {/* Note Thông tin tài khoản bàn giao (Nếu có) */}
            {order.account_note && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-violet-500/20 shadow-lg shadow-violet-500/5 space-y-3 print:border-gray-300 print:bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-violet-400 print:text-black" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-violet-300 print:text-black">
                      Thông tin tài khoản & Hướng dẫn sử dụng
                    </span>
                  </div>
                  <button
                    onClick={handleCopyNote}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 transition-all print:hidden"
                  >
                    {copiedNote ? (
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
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-slate-200 whitespace-pre-wrap break-all leading-relaxed selection:bg-violet-600 print:border-gray-300 print:text-black print:bg-gray-100">
                  {order.account_note}
                </div>
                <p className="text-[11px] text-slate-500 italic print:text-gray-500">
                  * Vui lòng lưu trữ thông tin cẩn thận và không chia sẻ liên kết này ra ngoài.
                </p>
              </div>
            )}

            {/* Hình ảnh Chứng từ & Bàn giao (Bill / Attachment) */}
            {(order.bill_image || order.attachment_image) && (
              <div className="space-y-3 print:break-inside-avoid">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 print:text-gray-600">
                  Hình ảnh chứng từ & Bàn giao
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {order.bill_image && (
                    <div className="space-y-1.5">
                      <span className="text-xs text-slate-400 flex items-center gap-1 print:text-gray-700">
                        <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                        Bill thanh toán xác nhận
                      </span>
                      <div
                        onClick={() =>
                          setViewingImage({
                            url: order.bill_image!,
                            title: `Bill thanh toán - ${order.customer_name}`,
                          })
                        }
                        className="h-44 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 cursor-pointer relative group print:cursor-default print:border-gray-400"
                      >
                        <img
                          src={order.bill_image}
                          alt="Bill thanh toán"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                          <span className="text-xs text-white bg-black/70 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5" />
                            Phóng to
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {order.attachment_image && (
                    <div className="space-y-1.5">
                      <span className="text-xs text-slate-400 flex items-center gap-1 print:text-gray-700">
                        <ImageIcon className="w-3.5 h-3.5 text-violet-400" />
                        Ảnh xác nhận bàn giao
                      </span>
                      <div
                        onClick={() =>
                          setViewingImage({
                            url: order.attachment_image!,
                            title: `Ảnh bàn giao - ${order.customer_name}`,
                          })
                        }
                        className="h-44 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 cursor-pointer relative group print:cursor-default print:border-gray-400"
                      >
                        <img
                          src={order.attachment_image}
                          alt="Ảnh đính kèm"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                          <span className="text-xs text-white bg-black/70 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5" />
                            Phóng to
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dấu Mộc Xác Thực Điện Tử */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 print:text-gray-600 print:border-gray-300">
              <div>
                <p>
                  Phiếu bảo hành điện tử chính thức được phát hành bởi{' '}
                  <strong className="text-slate-300 print:text-black">AI GIÁ SỈ</strong>.
                </p>
                <p className="mt-0.5">
                  Mọi thắc mắc hoặc cần kích hoạt lại bảo hành, vui lòng liên hệ qua Zalo.
                </p>
              </div>

              {/* Con dấu mô phỏng */}
              <div className="px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 font-bold uppercase tracking-widest text-[11px] shrink-0 print:border-emerald-600 print:text-emerald-700">
                ✓ ĐÃ XÁC THỰC BẢO HÀNH
              </div>
            </div>
          </div>
        </div>

        {/* Nút Hỗ trợ Zalo Trực Tiếp (Call to action) */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-900/30 via-indigo-900/20 to-slate-900/40 border border-violet-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              Cần hỗ trợ hoặc kiểm tra bảo hành?
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Đội ngũ hỗ trợ AI GIÁ SỈ luôn sẵn sàng hỗ trợ trực tiếp qua Zalo.
            </p>
          </div>

          <a
            href={zaloSupportLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-600/20 transition-all shrink-0 active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Nhắn Zalo hỗ trợ ngay</span>
          </a>
        </div>
      </div>

      {/* MODAL: XEM ẢNH PHÓNG TO */}
      {viewingImage && (
        <div
          onClick={() => setViewingImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150 print:hidden"
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
                  title="Mở ảnh gốc trong tab mới"
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
    </div>
  )
}
