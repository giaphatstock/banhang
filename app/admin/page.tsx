// ============================================================
// app/admin/page.tsx - Dashboard Tổng quan Quản trị viên
// Thống kê 4 số liệu cốt lõi & Danh sách 10 khách hàng gần nhất
// ============================================================
import Link from 'next/link'
import {
  Package,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  Plus,
  Clock,
  DollarSign,
  Receipt,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate, formatVND, getStatusColor, getStatusLabel } from '@/lib/utils'
import type { Customer, Product, Order } from '@/lib/types'

export const revalidate = 0 // Luôn lấy dữ liệu mới nhất trong admin

async function getDashboardData() {
  const supabase = await createClient()

  // 1. Thống kê sản phẩm
  const { data: products } = await supabase
    .from('products')
    .select('id, is_active')

  const totalProducts = products?.length || 0
  const activeProducts = products?.filter((p) => p.is_active).length || 0

  // 2. Thống kê đơn hàng & bảo hành
  const { data: orders } = await supabase
    .from('orders')
    .select('id, price, status, created_at')

  const totalOrders = orders?.length || 0
  const activeWarranties = orders?.filter((o) => o.status === 'active').length || 0
  const totalRevenue = orders?.reduce((sum, o) => sum + (Number(o.price) || 0), 0) || 0

  // 3. Thống kê khách hàng
  const { data: customers } = await supabase
    .from('customers')
    .select('id, created_at')

  const totalCustomers = customers?.length || 0

  // Khách hàng trong 7 ngày qua
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const newCustomersThisWeek =
    customers?.filter((c) => new Date(c.created_at) >= oneWeekAgo).length || 0

  // 4. Lấy 10 khách hàng mới nhất có kèm sản phẩm quan tâm
  const { data: recentCustomers } = await supabase
    .from('customers')
    .select('*, products(id, name)')
    .order('created_at', { ascending: false })
    .limit(10)

  // 5. Lấy 5 đơn hàng mới nhất
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return {
    stats: {
      totalProducts,
      activeProducts,
      totalCustomers,
      newCustomersThisWeek,
      totalOrders,
      activeWarranties,
      totalRevenue,
    },
    recentCustomers: (recentCustomers || []) as Customer[],
    recentOrders: (recentOrders || []) as Order[],
  }
}

export default async function AdminDashboardPage() {
  const { stats, recentCustomers, recentOrders } = await getDashboardData()

  const statCards = [
    {
      title: 'Đơn bán & Bảo hành',
      value: stats.totalOrders,
      desc: `${stats.activeWarranties} đơn đang trong thời hạn`,
      icon: ShieldCheck,
      gradient: 'from-violet-500/20 to-purple-500/10',
      iconColor: 'text-violet-400',
      borderColor: 'border-violet-500/20',
      link: '/admin/orders',
    },
    {
      title: 'Doanh thu bán',
      value: formatVND(stats.totalRevenue),
      desc: 'Từ tất cả đơn hàng đã chốt',
      icon: DollarSign,
      gradient: 'from-emerald-500/20 to-teal-500/10',
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      link: '/admin/orders',
    },
    {
      title: 'Tổng sản phẩm',
      value: stats.totalProducts,
      desc: `${stats.activeProducts} gói đang bật công khai`,
      icon: Package,
      gradient: 'from-cyan-500/20 to-blue-500/10',
      iconColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/20',
      link: '/admin/products',
    },
    {
      title: 'Lượt quan tâm',
      value: stats.totalCustomers,
      desc: `${stats.newCustomersThisWeek} khách mới tuần này`,
      icon: Users,
      gradient: 'from-amber-500/20 to-orange-500/10',
      iconColor: 'text-amber-400',
      borderColor: 'border-amber-500/20',
      link: '/admin/customers',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Bảng điều khiển
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Tổng hợp dữ liệu kinh doanh, kích hoạt bảo hành và tương tác khách hàng của AI GIÁ SỈ.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/20 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Kích hoạt bảo hành</span>
          </Link>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm sản phẩm</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.title}
              href={card.link}
              className={`glass-card p-5 rounded-2xl border ${card.borderColor} bg-gradient-to-br ${card.gradient} transition-transform hover:-translate-y-1 duration-200 block`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl bg-white/5 ${card.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div
                className="text-2xl sm:text-3xl font-bold text-white mb-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {card.value}
              </div>
              <p className="text-xs text-slate-400">{card.desc}</p>
            </Link>
          )
        })}
      </div>

      {/* Recent Orders & Warranty Table */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Đơn hàng & Bảo hành gần nhất
            </h2>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 transition-colors"
          >
            Quản lý tất cả
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-white/[0.02] border-b border-white/5">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Khách hàng</th>
                <th scope="col" className="px-5 py-3 font-semibold">Gói sản phẩm</th>
                <th scope="col" className="px-5 py-3 font-semibold">Giá bán</th>
                <th scope="col" className="px-5 py-3 font-semibold">Trạng thái</th>
                <th scope="col" className="px-5 py-3 font-semibold">Ngày mua</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentOrders.length > 0 ? (
                recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-medium text-white">
                      <div>{o.customer_name}</div>
                      {o.customer_contact && (
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{o.customer_contact}</div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-200 font-medium">
                      {o.product_name}
                      {o.warranty_duration && (
                        <div className="text-[11px] text-emerald-400/90 mt-0.5">🛡️ {o.warranty_duration}</div>
                      )}
                    </td>
                    <td className="px-5 py-4 font-semibold text-emerald-400 text-xs">
                      {formatVND(o.price)}
                    </td>
                    <td className="px-5 py-4">
                      {o.status === 'active' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Đang bảo hành
                        </span>
                      )}
                      {o.status === 'expired' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Hết hạn
                        </span>
                      )}
                      {o.status === 'refunded' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Hoàn tiền
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">
                      {o.purchase_date || formatDate(o.created_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-500">
                    Chưa có đơn hàng nào. Bấm &quot;Kích hoạt bảo hành&quot; ở trên để tạo đơn đầu tiên.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Customers Table */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-violet-400" />
            <h2 className="text-base font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Khách hàng mới nhất
            </h2>
          </div>
          <Link
            href="/admin/customers"
            className="text-xs font-semibold text-violet-400 hover:text-violet-300 inline-flex items-center gap-1 transition-colors"
          >
            Xem tất cả
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-white/[0.02] border-b border-white/5">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Tên khách hàng</th>
                <th scope="col" className="px-5 py-3 font-semibold">Zalo / SĐT</th>
                <th scope="col" className="px-5 py-3 font-semibold">Gói quan tâm</th>
                <th scope="col" className="px-5 py-3 font-semibold">Trạng thái</th>
                <th scope="col" className="px-5 py-3 font-semibold">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentCustomers.length > 0 ? (
                recentCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-medium text-white">{c.name}</td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-300">
                      {c.zalo || c.phone || 'Chưa cung cấp'}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-300">
                      {c.products?.name || 'Chung / Chưa rõ'}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(
                          c.status
                        )}`}
                      >
                        {getStatusLabel(c.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">
                      {formatDate(c.created_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-500">
                    Chưa có lượt khách hàng nào được ghi nhận.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
