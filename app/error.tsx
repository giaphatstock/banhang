'use client'

// ============================================================
// app/error.tsx - Global Error handling
// ============================================================
import { useEffect } from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Lỗi ứng dụng:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0A0F]">
      <div className="glass-card max-w-md w-full p-8 text-center rounded-2xl border border-red-500/20">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <AlertTriangle className="w-8 h-8" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Đã có lỗi xảy ra
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          Hệ thống gặp sự cố trong quá trình xử lý yêu cầu. Vui lòng thử tải lại trang hoặc liên hệ hỗ trợ.
        </p>
        <button
          onClick={() => reset()}
          className="btn-gradient w-full py-3 px-6 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
          aria-label="Thử lại"
        >
          <RefreshCcw className="w-4 h-4" aria-hidden="true" />
          Thử lại
        </button>
      </div>
    </div>
  )
}
