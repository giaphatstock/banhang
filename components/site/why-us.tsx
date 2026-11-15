'use client'

// ============================================================
// components/site/why-us.tsx
// Section "Tại sao chọn AI GIÁ SỈ?"
// ============================================================
import { motion } from 'framer-motion'
import { ShieldCheck, Building2, HeadphonesIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const reasons = [
  {
    icon: ShieldCheck,
    title: 'Bảo hành uy tín',
    description:
      'Cam kết hoàn tiền hoặc đổi mới nếu sản phẩm gặp vấn đề trong thời gian và quy định bảo hành(nếu có). Không hỏi nhiều.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    glow: 'hover:shadow-emerald-500/10',
  },
  {
    icon: Building2,
    title: 'Tin cậy',
    description:
      'Thuộc hệ sinh thái FinGreen - chuyên cung cấp giải pháp FinTech.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    glow: 'hover:shadow-cyan-500/10',
  },
  {
    icon: HeadphonesIcon,
    title: 'Hỗ trợ',
    description:
      'Đội ngũ hỗ trợ tận tâm - thấu hiểu. Tư vấn cách sử dụng như một người bạn.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
    glow: 'hover:shadow-violet-500/10',
  },
]

export function WhyUs() {
  return (
    <section id="tai-sao-chon-chung-toi" className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Tại sao chọn{' '}
            <span className="gradient-text">AI GIÁ SỈ?</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Chúng tôi không chỉ bán tài khoản — chúng tôi cam kết trải nghiệm mua hàng an toàn, nhanh chóng và đáng tin cậy.
          </p>
        </motion.div>

        {/* Cards Grid: 3 cards căn đều, cân đối */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reasons.map((reason, i) => {
            const Icon = reason.icon
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className={cn(
                  'glass-card p-6 sm:p-7 rounded-2xl border transition-all duration-300 flex flex-col justify-between',
                  reason.bg,
                  'hover:shadow-xl',
                  reason.glow
                )}
              >
                <div>
                  {/* Icon */}
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center mb-5',
                      reason.bg
                    )}
                  >
                    <Icon className={cn('w-6 h-6', reason.color)} aria-hidden="true" />
                  </div>

                  {/* Text */}
                  <h3
                    className="font-bold text-white text-lg mb-2.5"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {reason.title}
                  </h3>
                  <p className="text-sm text-slate-300/90 leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
