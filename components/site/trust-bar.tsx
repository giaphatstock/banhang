'use client'

// ============================================================
// components/site/trust-bar.tsx
// Dải logo/icon dịch vụ nổi tiếng
// ============================================================
import { motion } from 'framer-motion'

// Các thương hiệu dùng SVG inline để không cần ảnh ngoài
const brands = [
  { name: 'Google', icon: GoogleIcon },
  { name: 'OpenAI', icon: OpenAIIcon },
  { name: 'Netflix', icon: NetflixIcon },
  { name: 'Spotify', icon: SpotifyIcon },
  { name: 'Canva', icon: CanvaIcon },
  { name: 'CapCut', icon: CapCutIcon },
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
          className="text-center text-xs text-slate-600 uppercase tracking-widest mb-8 font-medium"
        >
          Nền tảng được hỗ trợ
        </motion.p>

        {/* Logo grid */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className="w-12 h-12 flex items-center justify-center rounded-xl
                           bg-white/5 border border-white/8
                           group-hover:bg-white/8 group-hover:border-white/15
                           transition-all duration-300"
              >
                <brand.icon className="w-6 h-6 text-slate-400 group-hover:text-slate-200 transition-colors" />
              </div>
              <span className="text-xs text-slate-600 group-hover:text-slate-400 transition-colors">
                {brand.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// SVG Icons inline cho từng thương hiệu
// ============================================================

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function OpenAIIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.677l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0L4.14 13.75a4.5 4.5 0 0 1-1.8-5.855zm16.597 3.855-5.843-3.369 2.02-1.168a.076.076 0 0 1 .071 0l4.679 2.701a4.5 4.5 0 0 1-.676 8.123v-5.678a.79.79 0 0 0-.251-.609zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.679-2.701a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
    </svg>
  )
}

function NetflixIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#E50914" aria-hidden="true">
      <path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 24c-.928.56-2.242 1.023-3.934 1.023L9.967 13.868V0zm-8.489 0v3.6l3.681 10.393v10.014l-3.68 2.993L0 24V0h5.398z"/>
    </svg>
  )
}

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#1DB954" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  )
}

function CanvaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.5 13.5c-.375.75-1.125 1.125-1.875.75-.375-.375-.75-.75-.75-1.125 0-.375.375-.75.75-.75.375 0 .75.375.75.75v.375c.375 0 .75-.375.75-.75 0-1.125-.75-1.875-1.875-1.875s-1.875.75-1.875 1.875.75 1.875 1.875 1.875c.75 0 1.5-.375 1.875-1.125h.375zm-6.75 1.875c-1.875 0-3-1.5-3-3.375S7.875 8.25 9.75 8.25c1.125 0 1.875.375 2.625 1.125l-.75.75C11.25 9.75 10.5 9.375 9.75 9.375c-1.125 0-1.875.75-1.875 2.25s.75 2.625 1.875 2.625c.75 0 1.5-.375 1.875-1.125v-.75h-1.875v-.75H12v2.625c-.75.75-1.5 1.125-2.25 1.125z" fill="#8B3DFF"/>
    </svg>
  )
}

function CapCutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fillOpacity="0.8"/>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeOpacity="0.3"/>
      <path d="M9 8v8h2V8H9zm4 0v8h2V8h-2z"/>
    </svg>
  )
}
