'use client'

// ============================================================
// components/site/trust-bar.tsx
// Dải logo/icon dịch vụ nổi tiếng với logo chính thức sắc nét
// ============================================================
import { motion } from 'framer-motion'

const brands = [
  { name: 'Google', logo: '/brands/google.svg' },
  { name: 'OpenAI', logo: '/brands/chatgpt.svg' },
  { name: 'Netflix', logo: '/brands/netflix.svg' },
  { name: 'YouTube', logo: '/brands/youtube.svg' },
  { name: 'Spotify', logo: '/brands/spotify.svg' },
  { name: 'Canva', logo: '/brands/canva.svg' },
  { name: 'CapCut', logo: '/brands/capcut.svg' },
]

export function TrustBar() {
  return (
    <section className="py-12 border-y border-white/5">
      <div className="container mx-auto px-4">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-slate-500 uppercase tracking-widest mb-8 font-medium"
        >
          Nền tảng được hỗ trợ
        </motion.p>

        {/* Logo grid */}
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-10">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div
                className="w-13 h-13 p-2.5 flex items-center justify-center rounded-2xl
                           bg-white/[0.04] border border-white/10
                           group-hover:bg-white/[0.08] group-hover:border-white/20
                           group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-violet-500/10
                           transition-all duration-300"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  width="32"
                  height="32"
                  className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors font-medium">
                {brand.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
