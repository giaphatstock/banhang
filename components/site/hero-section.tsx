'use client'

// ============================================================
// components/site/hero-section.tsx
// Hero section với animated gradient blob, padding thoáng đãng
// ============================================================
import { motion } from 'framer-motion'
import { ArrowDown, Zap } from 'lucide-react'
import Link from 'next/link'

interface HeroSectionProps {
  zaloPhone: string
  zaloLink: string
}

export function HeroSection({ zaloPhone, zaloLink }: HeroSectionProps) {
  // Scroll mượt xuống section sản phẩm
  const handleScrollDown = () => {
    document.getElementById('san-pham')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
      {/* Grid Pattern nền */}
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />

      {/* Animated Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.15, 1],
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 60%)',
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Nội dung Hero */}
      <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
        {/* Headline chính */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Nâng cấp
          <br />
          <span className="gradient-text">trải nghiệm số</span>
          <br />
          của bạn
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Cung cấp tài khoản AI, giải trí và sáng tạo chính hãng.{' '}
          <span className="text-slate-300">Bảo hành uy tín, giá sỉ tốt nhất thị trường.</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          {/* Nút khám phá - scroll xuống */}
          <button
            onClick={handleScrollDown}
            className="group flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl
                       border border-white/10 bg-white/5 hover:bg-white/10
                       text-white font-semibold text-sm sm:text-base
                       transition-all duration-300 hover:border-white/20
                       backdrop-blur-sm cursor-pointer"
            aria-label="Khám phá các gói dịch vụ"
          >
            Khám phá gói
            <ArrowDown
              className="w-4 h-4 group-hover:translate-y-1 transition-transform"
              aria-hidden="true"
            />
          </button>

          {/* Nút Zalo - nổi bật */}
          <Link
            href={zaloLink || `https://zalo.me/${zaloPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gradient flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl
                       text-white font-semibold text-sm sm:text-base
                       shadow-lg shadow-violet-500/20 cursor-pointer"
            aria-label="Liên hệ Zalo"
          >
            <ZaloIcon className="w-5 h-5" />
            Liên hệ Zalo
            <Zap className="w-4 h-4" aria-hidden="true" />
          </Link>
        </motion.div>

        {/* Stats sạch sẽ, căn đều 3 cột bằng Grid, không có icon chuột/chấm lơ lửng */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-xl mx-auto"
        >
          <div className="grid grid-cols-3 gap-2 sm:gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm divide-x divide-white/5">
            <div className="text-center px-2">
              <div
                className="text-2xl sm:text-3xl font-extrabold gradient-text"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                500+
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                Khách hàng tin dùng
              </div>
            </div>

            <div className="text-center px-2">
              <div
                className="text-2xl sm:text-3xl font-extrabold gradient-text"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                9+
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                Dịch vụ cao cấp
              </div>
            </div>

            <div className="text-center px-2">
              <div
                className="text-2xl sm:text-3xl font-extrabold gradient-text"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Zalo
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                Liên hệ hỗ trợ Zalo
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Icon Zalo SVG inline
function ZaloIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="24" fill="currentColor" fillOpacity="0.2" />
      <text x="24" y="30" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold">
        Z
      </text>
    </svg>
  )
}
