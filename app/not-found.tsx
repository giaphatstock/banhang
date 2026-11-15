// ============================================================
// app/not-found.tsx - Trang 404 tùy chỉnh
// ============================================================
import Link from 'next/link'
import { ArrowLeft, Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0A0F]">
      <div className="glass-card max-w-md w-full p-8 text-center rounded-2xl">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
          <Compass className="w-8 h-8 animate-pulse" aria-hidden="true" />
        </div>
        <h1 className="text-4xl font-extrabold gradient-text mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          404
        </h1>
        <h2 className="text-lg font-semibold text-white mb-3">
          Không tìm thấy trang
        </h2>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          Đường dẫn bạn yêu cầu không tồn tại hoặc đã được chuyển sang địa chỉ khác.
        </p>
        <Link
          href="/"
          className="btn-gradient inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl text-white font-semibold"
          aria-label="Quay lại trang chủ"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Về trang chủ
        </Link>
      </div>
    </div>
  )
}
