// ============================================================
// app/admin/orders/page.tsx - Server Component
// Quản lý đơn hàng & Kích hoạt bảo hành
// ============================================================
import { createClient } from '@/lib/supabase/server'
import { OrderManager } from '@/components/admin/order-manager'
import type { Order, Product } from '@/lib/types'

export const revalidate = 0

async function getOrdersData() {
  const supabase = await createClient()

  // 1. Lấy danh sách đơn hàng
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('purchase_date', { ascending: false })
    .order('created_at', { ascending: false })

  // 2. Lấy danh sách sản phẩm active để chọn trong dropdown
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true })

  return {
    orders: (orders || []) as Order[],
    products: (products || []) as Product[],
  }
}

export default async function AdminOrdersPage() {
  const { orders, products } = await getOrdersData()

  return <OrderManager initialOrders={orders} products={products} />
}
