// ============================================================
// app/loading.tsx - Global Loading state
// ============================================================
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-violet-500/20 animate-ping" />
          <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-violet-500 border-r-cyan-400 animate-spin" />
        </div>
        <p className="text-sm text-slate-400 font-medium tracking-wide animate-pulse">
          Đang tải dữ liệu...
        </p>
      </div>
    </div>
  )
}
