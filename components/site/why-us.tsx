'use client'

// ============================================================
// components/site/why-us.tsx
// Section "Why Choose Us" với 4 card
// ============================================================
import { motion } from 'framer-motion'
import { ShieldCheck, Lock, Star, HeadphonesIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const reasons = [
  {
    icon: ShieldCheck,
    title: 'Bảo hành uy tín',
    description: 'Cam kết hoàn tiền hoặc đổi mới nếu sản phẩm gặp vấn đề trong thời gian bảo hành. Không hỏi nhiều.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    glow: 'hover:shadow-emerald-500/10',
  },
  {
    icon: Lock,
    title: 'Bảo mật tuyệt đối',
    description: 'Thông tin cá nhân và tài khoản của bạn được bảo vệ theo tiêu chuẩn cao nhất. Không lưu mật khẩu.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    glow: 'hover:shadow-blue-500/10',
  },
  {
    icon: Star,
    title: 'Uy tín 500+ khách',
    description: 'Đã phục vụ hơn 500 khách hàng hài lòng. Đánh giá 5 sao trên các group công nghệ lớn.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    glow: 'hover:shadow-amber-500/10',
  },
  {
    icon: HeadphonesIcon,
    title: 'Hỗ trợ 24/7',
    description: 'Đội ngũ hỗ trợ luôn sẵn sàng qua Zalo. Phản hồi trong vòng 5 phút, kể cả ban đêm.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
    glow: 'hover:shadow-violet-500/10',
  },
]

export function WhyUs() {
  return (
    <section className="py-20">
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
            Tại sao chọn
            <span className="gradient-text"> OpenLay?</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Chúng tôi không chỉ bán tài khoản — chúng tôi cam kết trải nghiệm mua hàng an toàn, nhanh chóng và đáng tin cậy.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                  'glass-card p-6 rounded-2xl border transition-all duration-300',
                  reason.bg,
                  'hover:shadow-xl',
                  reason.glow
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                    reason.bg
                  )}
                >
                  <Icon className={cn('w-6 h-6', reason.color)} aria-hidden="true" />
                </div>

                {/* Text */}
                <h3
                  className="font-bold text-white mb-2"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {reason.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {reason.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
