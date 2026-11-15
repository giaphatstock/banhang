// ============================================================
// components/site/footer.tsx - Server Component
// Footer với thông tin liên hệ, Zalo, social, copyright
// ============================================================
import Link from 'next/link'
import { Mail, ExternalLink } from 'lucide-react'
import type { SiteSettingsObject } from '@/lib/types'

interface FooterProps {
  settings: Partial<SiteSettingsObject>
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const shopName = settings.shop_name || 'OpenLay'
  const zaloLink = settings.zalo_link || `https://zalo.me/${settings.zalo_phone || ''}`
  const contactEmail = settings.contact_email || ''
  const facebookLink = settings.facebook_link || ''
  const telegramLink = settings.telegram_link || ''

  return (
    <footer className="border-t border-white/5 py-12 mt-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="text-xl font-bold gradient-text mb-3"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {shopName}
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              {settings.shop_description || 'Cung cấp tài khoản số chính hãng, bảo hành uy tín, hỗ trợ 24/7.'}
            </p>
            {/* Zalo CTA nổi bật */}
            <Link
              href={zaloLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 btn-gradient px-4 py-2 rounded-xl
                         text-white text-sm font-semibold"
              aria-label="Liên hệ Zalo"
            >
              <ZaloIconSmall />
              Nhắn Zalo ngay
            </Link>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Điều hướng</h4>
            <ul className="space-y-2">
              {[
                { href: '/#san-pham', label: 'Sản phẩm' },
                { href: '/lien-he', label: 'Liên hệ' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-slate-200 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Liên hệ</h4>
            <ul className="space-y-3">
              {contactEmail && (
                <li>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-200 transition-colors"
                    aria-label={`Email: ${contactEmail}`}
                  >
                    <Mail className="w-4 h-4" aria-hidden="true" />
                    {contactEmail}
                  </a>
                </li>
              )}
              {zaloLink && (
                <li>
                  <Link
                    href={zaloLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-200 transition-colors"
                    aria-label="Zalo"
                  >
                    <ZaloIconSmall className="text-blue-400" />
                    <span>Zalo</span>
                    <ExternalLink className="w-3 h-3 opacity-50" aria-hidden="true" />
                  </Link>
                </li>
              )}
              {facebookLink && (
                <li>
                  <Link
                    href={facebookLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-200 transition-colors"
                    aria-label="Facebook"
                  >
                    <FacebookIcon className="w-4 h-4 text-blue-500" />
                    <span>Facebook</span>
                    <ExternalLink className="w-3 h-3 opacity-50" aria-hidden="true" />
                  </Link>
                </li>
              )}
              {telegramLink && (
                <li>
                  <Link
                    href={telegramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-200 transition-colors"
                    aria-label="Telegram"
                  >
                    <TelegramIcon className="w-4 h-4 text-cyan-400" />
                    <span>Telegram</span>
                    <ExternalLink className="w-3 h-3 opacity-50" aria-hidden="true" />
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row
                       justify-between items-center gap-4">
          <p className="text-xs text-slate-600">
            © {currentYear} {shopName}. Mọi quyền được bảo lưu.
          </p>
          <p className="text-xs text-slate-600">
            Giá có thể thay đổi. Liên hệ Zalo để xác nhận giá mới nhất.
          </p>
        </div>
      </div>
    </footer>
  )
}

// ============================================================
// Inline SVG Icons nhỏ
// ============================================================
function ZaloIconSmall({ className }: { className?: string }) {
  return (
    <svg
      width="16" height="16"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="8" fill="#0068FF"/>
      <path d="M36 25c0 6.627-5.373 12-12 12-1.633 0-3.187-.326-4.598-.915l-7.902 1.915 2.168-7.025A12 12 0 0 1 12 25c0-6.627 5.373-12 12-12s12 5.373 12 12z" fill="white"/>
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  )
}
