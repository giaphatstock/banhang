// ============================================================
// components/site/footer.tsx - Server Component
// Footer với thông tin thương hiệu AI GIÁ SỈ, sắp xếp 3 cột chuẩn
// ============================================================
import Link from 'next/link'
import { Mail, ExternalLink, ShieldCheck } from 'lucide-react'
import type { SiteSettingsObject } from '@/lib/types'

interface FooterProps {
  settings: Partial<SiteSettingsObject>
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const shopName = settings.shop_name || 'AI GIÁ SỈ'
  const zaloPhone = settings.zalo_phone || '0764894250'
  const zaloLink = settings.zalo_link || `https://zalo.me/${zaloPhone}`
  const contactEmail = settings.contact_email || 'contact@aigiasi.vn'
  const facebookLink = settings.facebook_link || ''
  const telegramLink = settings.telegram_link || ''

  return (
    <footer className="border-t border-white/5 bg-[#08080C] pt-16 pb-12 mt-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Main 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 mb-14">
          {/* Cột 1: Logo & Mô tả (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 p-0.5 bg-white shrink-0">
                <img
                  src="/logo.jpg"
                  alt="Logo AI GIÁ SỈ"
                  className="w-full h-full object-contain"
                />
              </div>
              <span
                className="text-xl font-extrabold text-white tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {shopName}
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {settings.shop_description ||
                'Chuyên cung cấp tài khoản AI, bản quyền số và gói dịch vụ giải trí chính hãng với giá sỉ tốt nhất.'}
            </p>

            <div className="pt-2">
              <a
                href={zaloLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gradient inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-semibold shadow-lg shadow-violet-500/10 cursor-pointer"
                aria-label="Liên hệ Zalo"
              >
                <ZaloIconSmall />
                <span>Nhắn Zalo: {zaloPhone}</span>
              </a>
            </div>
          </div>

          {/* Cột 2: Điều hướng (3 cols) */}
          <div className="md:col-span-3">
            <h4
              className="text-sm font-bold text-white uppercase tracking-wider mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Điều hướng
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/#san-pham"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Gói dịch vụ
                </Link>
              </li>
              <li>
                <Link
                  href="/#tai-sao-chon-chung-toi"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Cam kết bảo hành
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link
                  href="/lien-he"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Trang liên hệ & QR
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors"
                >
                  Quản trị viên (Admin)
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Liên hệ hỗ trợ (4 cols) */}
          <div className="md:col-span-4">
            <h4
              className="text-sm font-bold text-white uppercase tracking-wider mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Kênh hỗ trợ
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={zaloLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors group"
                  aria-label="Zalo"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <ZaloIconSmall />
                  </div>
                  <span>Zalo: <strong className="text-slate-200">{zaloPhone}</strong></span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>

              {contactEmail && (
                <li>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors"
                    aria-label={`Email: ${contactEmail}`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                      <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                    </div>
                    <span className="truncate">{contactEmail}</span>
                  </a>
                </li>
              )}

              {facebookLink && (
                <li>
                  <a
                    href={facebookLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-500 shrink-0">
                      <FacebookIcon className="w-3.5 h-3.5" />
                    </div>
                    <span>Facebook Fanpage</span>
                  </a>
                </li>
              )}

              {telegramLink && (
                <li>
                  <a
                    href={telegramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                      <TelegramIcon className="w-3.5 h-3.5" />
                    </div>
                    <span>Kênh Telegram</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Chia đều 2 bên trái/phải gọn gàng */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© {currentYear} {shopName}. Mọi quyền được bảo lưu.</p>
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cam kết tài khoản chính hãng — Bảo hành uy tín 24/7.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function ZaloIconSmall({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="8" fill="#0068FF" />
      <path
        d="M36 25c0 6.627-5.373 12-12 12-1.633 0-3.187-.326-4.598-.915l-7.902 1.915 2.168-7.025A12 12 0 0 1 12 25c0-6.627 5.373-12 12-12s12 5.373 12 12z"
        fill="white"
      />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}
