'use client'

// ============================================================
// components/admin/admin-sidebar.tsx
// Thanh điều hướng quản trị viên phong cách Linear/Raycast
// ============================================================
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Layers,
  Users,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logoutAdmin } from '@/app/admin/actions'

interface AdminSidebarProps {
  userEmail: string
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { href: '/admin', label: 'Tổng quan', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Sản phẩm', icon: Package },
    { href: '/admin/categories', label: 'Danh mục', icon: Layers },
    { href: '/admin/customers', label: 'Khách hàng', icon: Users },
    { href: '/admin/settings', label: 'Cài đặt hệ thống', icon: Settings },
  ]

  const navContent = (
    <div className="flex flex-col h-full justify-between p-4 md:p-5">
      <div>
        {/* Brand */}
        <div className="flex items-center justify-between mb-8 px-2">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 p-0.5 bg-white shrink-0">
              <img
                src="/logo.jpg"
                alt="Logo AI GIÁ SỈ"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-tight block" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                AI GIÁ SỈ
              </span>
              <span className="text-[11px] text-violet-400 font-medium tracking-wider uppercase">
                Admin Panel
              </span>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
            aria-label="Đóng menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          {navLinks.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-violet-600/20 to-cyan-600/10 text-white border border-violet-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-violet-400' : 'text-slate-400')} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer / User info & Logout */}
      <div className="pt-6 border-t border-white/5 space-y-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            Xem website ngoài
          </span>
          <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-300">Live</span>
        </Link>

        <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/5">
          <p className="text-[11px] text-slate-500 font-medium">Tài khoản đăng nhập:</p>
          <p className="text-xs text-slate-200 truncate font-mono mt-0.5" title={userEmail}>
            {userEmail}
          </p>
        </div>

        <form action={logoutAdmin}>
          <button
            type="submit"
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            aria-label="Đăng xuất quản trị"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất hệ thống</span>
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0F0F1A] border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 p-0.5 bg-white shrink-0">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-sm text-white">AI GIÁ SỈ Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg bg-white/5 text-slate-300 hover:text-white"
          aria-label="Mở menu quản trị"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] bg-[#0F0F1A] border-r border-white/10 z-10 shadow-2xl">
            {navContent}
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 bg-[#0A0A0F] border-r border-white/5 h-screen sticky top-0">
        {navContent}
      </aside>
    </>
  )
}
