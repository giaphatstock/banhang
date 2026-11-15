// ============================================================
// lib/types.ts - Type definitions cho toàn bộ dự án
// Không dùng 'any', tất cả type phải rõ ràng
// ============================================================

export interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  sort_order: number
  created_at: string
}

export interface Product {
  id: string
  category_id: string | null
  name: string
  slug: string
  description: string | null
  benefits: string[] | null
  price: number
  original_price: number | null
  duration: string | null
  warranty: string | null
  badge: string | null
  note: string | null
  is_active: boolean
  is_featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
  // Join với categories
  categories?: Category | null
}

export interface Customer {
  id: string
  name: string
  zalo: string | null
  phone: string | null
  note: string | null
  product_id: string | null
  status: CustomerStatus
  created_at: string
  // Join với products
  products?: Pick<Product, 'id' | 'name'> | null
}

export type CustomerStatus = 'pending' | 'contacted' | 'closed' | 'cancelled'

export interface SiteSetting {
  id: string
  key: string
  value: string | null
  updated_at: string
}

// Settings object đã được parse từ key-value
export interface SiteSettingsObject {
  zalo_phone: string
  shop_name: string
  contact_email: string
  zalo_link: string
  facebook_link: string
  telegram_link: string
  shop_description: string
}

// Badge types cho sản phẩm
export type ProductBadge = 'Best Seller' | 'Hot' | 'Khuyến mãi' | null

// Pagination
export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

// Admin dashboard stats
export interface DashboardStats {
  totalProducts: number
  totalCustomers: number
  newCustomersThisWeek: number
  activeProducts: number
}

export interface AdminUser {
  id: string
  email: string
  role: string
  note: string | null
  created_at: string
}

// ============================================================
// Orders & Warranty Types (Quản lý bán hàng & Bảo hành)
// ============================================================
export type OrderStatus = 'active' | 'expired' | 'refunded'

export interface Order {
  id: string
  customer_name: string
  customer_contact?: string | null
  product_id?: string | null
  product_name: string
  price: number
  bill_image?: string | null
  attachment_image?: string | null
  account_note?: string | null
  purchase_date: string // YYYY-MM-DD
  warranty_duration?: string | null
  status: OrderStatus
  created_at: string
  updated_at: string
  products?: Pick<Product, 'id' | 'name' | 'price' | 'warranty' | 'duration'> | null
}

export interface OrderFormData {
  customer_name: string
  customer_contact?: string | null
  product_id?: string | null
  product_name: string
  price: number
  bill_image?: string | null
  attachment_image?: string | null
  account_note?: string | null
  purchase_date: string
  warranty_duration?: string | null
  status?: OrderStatus
}

