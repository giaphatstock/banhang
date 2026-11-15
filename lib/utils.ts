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
