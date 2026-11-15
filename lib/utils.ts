// ============================================================
// lib/utils.ts - Utility functions dùng chung
// ============================================================
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Merge Tailwind classes (do shadcn tạo ra)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format tiền VND
export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format số đơn giản với dấu chấm ngăn cách
export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount)
}

// Tạo slug từ tên tiếng Việt
export function slugify(text: string): string {
  const vietnameseMap: Record<string, string> = {
    à: 'a', á: 'a', ả: 'a', ã: 'a', ạ: 'a',
    ă: 'a', ằ: 'a', ắ: 'a', ẳ: 'a', ẵ: 'a', ặ: 'a',
    â: 'a', ầ: 'a', ấ: 'a', ẩ: 'a', ẫ: 'a', ậ: 'a',
    è: 'e', é: 'e', ẻ: 'e', ẽ: 'e', ẹ: 'e',
    ê: 'e', ề: 'e', ế: 'e', ể: 'e', ễ: 'e', ệ: 'e',
    ì: 'i', í: 'i', ỉ: 'i', ĩ: 'i', ị: 'i',
    ò: 'o', ó: 'o', ỏ: 'o', õ: 'o', ọ: 'o',
    ô: 'o', ồ: 'o', ố: 'o', ổ: 'o', ỗ: 'o', ộ: 'o',
    ơ: 'o', ờ: 'o', ớ: 'o', ở: 'o', ỡ: 'o', ợ: 'o',
    ù: 'u', ú: 'u', ủ: 'u', ũ: 'u', ụ: 'u',
    ư: 'u', ừ: 'u', ứ: 'u', ử: 'u', ữ: 'u', ự: 'u',
    ỳ: 'y', ý: 'y', ỷ: 'y', ỹ: 'y', ỵ: 'y',
    đ: 'd',
  }

  return text
    .toLowerCase()
    .replace(/[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/g,
      (char) => vietnameseMap[char] || char
    )
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// Lấy Base URL tự động (hỗ trợ localhost, Vercel tự động và custom domain)
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'http://localhost:3000'
}

// Format ngày tháng Việt Nam đầy đủ
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

// Format ngày ngắn gọn
export function formatDateShort(dateStr: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateStr))
}

// Tính phần trăm giảm giá
export function calcDiscount(price: number, originalPrice: number): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

// Màu badge theo loại
export function getBadgeColor(badge: string | null): string {
  switch (badge) {
    case 'Best Seller':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    case 'Hot':
      return 'bg-red-500/20 text-red-400 border-red-500/30'
    case 'Khuyến mãi':
      return 'bg-violet-500/20 text-violet-400 border-violet-500/30'
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  }
}

// Màu status customer
export function getStatusColor(status: string): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    case 'contacted':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    case 'closed':
      return 'bg-green-500/20 text-green-400 border-green-500/30'
    case 'cancelled':
      return 'bg-red-500/20 text-red-400 border-red-500/30'
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  }
}

// Label status customer
export function getStatusLabel(status: string): string {
  switch (status) {
    case 'pending':
      return 'Chờ xử lý'
    case 'contacted':
      return 'Đã liên hệ'
    case 'closed':
      return 'Đã chốt'
    case 'cancelled':
      return 'Huỷ'
    default:
      return status
  }
}

// ============================================================
// XỬ LÝ LỊCH & BẢO HÀNH CHÍNH XÁC (28/29/30/31 ngày)
// ============================================================

/**
 * Tính ngày hết hạn bảo hành theo lịch chuẩn quốc tế và Việt Nam.
 * Tự động kiểm tra chính xác số ngày của từng tháng mục tiêu (28, 29, 30, 31 ngày).
 * Ví dụ:
 * - 31/01 + 1 tháng -> 28/02 (hoặc 29/02 nếu năm nhuận)
 * - 31/03 + 1 tháng -> 30/04
 * - 02/03/2026 + 1 tháng -> 02/04/2026
 * - Nếu có days > 0 (ví dụ 7 ngày): cộng chính xác số ngày qua các tháng
 */
export function calculateWarrantyExpiry(
  startDateStr: string,
  months?: number | null,
  days?: number | null
): string {
  if (!startDateStr) return ''
  const parts = startDateStr.split('-').map(Number)
  if (parts.length !== 3) return ''
  const [year, month, day] = parts

  // Trường hợp tính theo ngày (ví dụ bảo hành 7 ngày đầu)
  if (days && days > 0) {
    const d = new Date(year, month - 1, day)
    d.setDate(d.getDate() + days)
    const yyyy = String(d.getFullYear()).padStart(4, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  const m = Number(months) || 0
  if (m <= 0) return startDateStr

  const targetMonthIndex = month - 1 + m
  const targetYear = year + Math.floor(targetMonthIndex / 12)
  const normalizedMonthIndex = ((targetMonthIndex % 12) + 12) % 12

  // Ngày cuối cùng của tháng mục tiêu (tự động xử lý năm nhuận 29 ngày hay năm thường 28 ngày)
  const daysInTargetMonth = new Date(targetYear, normalizedMonthIndex + 1, 0).getDate()
  const targetDay = Math.min(day, daysInTargetMonth)

  const yyyy = String(targetYear).padStart(4, '0')
  const mm = String(normalizedMonthIndex + 1).padStart(2, '0')
  const dd = String(targetDay).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/**
 * Phân tích số tháng hoặc số ngày từ chuỗi bảo hành của sản phẩm
 */
export function parseWarrantyPeriod(text: string): { months: number; days: number } {
  if (!text) return { months: 1, days: 0 }
  const lower = text.toLowerCase()

  if (lower.includes('không bảo hành')) {
    return { months: 0, days: 0 }
  }

  // Số ngày (ví dụ: "7 ngày")
  const dayMatch = lower.match(/(\d+)\s*ngày/)
  if (dayMatch && dayMatch[1]) {
    const d = parseInt(dayMatch[1], 10)
    if (d < 30) {
      return { months: 0, days: d }
    }
  }

  // Số tháng (ví dụ: "18 tháng", "8 tháng", "12 tháng", "3 tháng", "1 tháng")
  const monthMatch = lower.match(/(\d+)\s*tháng/)
  if (monthMatch && monthMatch[1]) {
    return { months: parseInt(monthMatch[1], 10), days: 0 }
  }

  return { months: 1, days: 0 }
}

/**
 * Lấy trạng thái bảo hành thực tế dựa trên ngày hết hạn và thời gian hiện tại
 * Nếu qua ngày hết hạn -> Tự động chuyển thành 'expired'
 */
export function getEffectiveWarrantyStatus(
  status: 'active' | 'expired' | 'refunded',
  expiryDateStr?: string | null
): 'active' | 'expired' | 'refunded' {
  if (status === 'refunded') return 'refunded'
  if (!expiryDateStr) return status

  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const todayStr = `${yyyy}-${mm}-${dd}`

  if (expiryDateStr < todayStr) {
    return 'expired'
  }
  return status
}

/**
 * Tính số ngày còn lại đến hạn bảo hành
 */
export function getDaysRemaining(expiryDateStr?: string | null): number | null {
  if (!expiryDateStr) return null
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const [y, m, d] = expiryDateStr.split('-').map(Number)
  if (!y || !m || !d) return null
  const target = new Date(y, m - 1, d)
  target.setHours(0, 0, 0, 0)

  const diffMs = target.getTime() - now.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

