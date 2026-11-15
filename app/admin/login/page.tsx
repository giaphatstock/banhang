'use client'

// ============================================================
// app/admin/login/page.tsx - Trang Đăng Nhập Quản Trị Viên
// Bảo mật, không cho phép công khai đăng ký tài khoản mới
// ============================================================
import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ShieldCheck, Lock, Mail, Loader2, ArrowRight } from 'lucide-react'
import { loginAdmin } from '@/app/admin/actions'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')

  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(
    errorParam === 'unauthorized'
      ? 'Email của bạn không nằm trong danh sách quản trị viên được cấp phép.'
      : null
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const res = await loginAdmin(formData)
      if (res?.error) {
        setErrorMessage(res.error)
        toast.error(res.error)
      } else {
        toast.success('Đăng nhập thành công')
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0A0F] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="glass-card max-w-md w-full p-8 md:p-10 rounded-3xl relative z-10 border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 p-[1px] flex items-center justify-center">
            <div className="w-full h-full bg-[#0A0A0F] rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-violet-400" />
            </div>
          </div>
          <h1
            className="text-2xl font-bold text-white tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            OpenLay Admin
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Đăng nhập hệ thống quản lý nội dung số
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm leading-relaxed">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Quản trị
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@openlay.vn"
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="btn-gradient w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 mt-4 transition-all duration-200 disabled:opacity-50"
            aria-label="Đăng nhập quản trị viên"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xác thực...</span>
              </>
            ) : (
              <>
                <span>Vào trang quản trị</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-slate-500">
            Hệ thống nội bộ được giám sát an toàn 24/7.
          </p>
        </div>
      </div>
    </div>
  )
}
