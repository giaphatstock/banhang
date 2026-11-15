'use client'

// ============================================================
// components/site/navbar.tsx
// Thanh điều hướng Header cố định phong cách Cyber-clean Linear
// ============================================================
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShieldCheck, UserCog, ArrowUpRight, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavbarProps {
  zaloLink: string
  shopName: string
}

export function Navbar({ zaloLink, shopName }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-white/5 py-3.5 shadow-2xl shadow-black/50'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 p-[1px] group-hover:shadow-lg group-hover:shadow-violet-500/20 transition-all">
            <div className="w-full h-full bg-[#0A0A0F] rounded-xl flex items-center justify-center font-bold text-white text-base">
              OL
            </div>
          </div>
          <span
            className="text-lg font-bold text-white tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {shopName || 'OpenLay'}
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7">
          <Link
            href="/#san-pham"
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Gói dịch vụ
          </Link>
          <Link
            href="/#tai-sao-chon-chung-toi"
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cam kết
          </Link>
          <Link
            href="/#faq"
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            FAQ
          </Link>
          <Link
            href="/lien-he"
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Liên hệ Zalo
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all"
            aria-label="Vào trang quản trị Admin"
          >
            <UserCog className="w-3.5 h-3.5 text-violet-400" />
            <span>Admin Panel</span>
          </Link>

          <a
            href={zaloLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gradient inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-md shadow-violet-500/10 cursor-pointer"
            aria-label="Nhắn Zalo"
          >
            <span>Nhắn Zalo</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="sm:hidden flex items-center gap-2">
          <Link
            href="/admin"
            className="p-2 rounded-lg bg-white/5 text-slate-300 hover:text-white text-xs font-medium border border-white/5"
          >
            Admin
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 text-slate-300 hover:text-white"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#0F0F1A] border-b border-white/10 px-4 py-4 space-y-3">
          <Link
            href="/#san-pham"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-300 font-medium"
          >
            Gói dịch vụ
          </Link>
          <Link
            href="/#tai-sao-chon-chung-toi"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-300 font-medium"
          >
            Cam kết
          </Link>
          <Link
            href="/#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-300 font-medium"
          >
            FAQ
          </Link>
          <Link
            href="/lien-he"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-300 font-medium"
          >
            Liên hệ Zalo
          </Link>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-center text-xs font-semibold text-slate-200"
            >
              Vào Admin Panel
            </Link>
            <a
              href={zaloLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gradient w-full py-2.5 rounded-xl text-center text-xs font-semibold text-white"
            >
              Nhắn Zalo ngay
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
