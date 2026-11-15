// ============================================================
// app/(site)/lien-he/page.tsx - Trang liên hệ với QR code
// ============================================================
import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, ExternalLink, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ZaloQRCode } from '@/components/site/zalo-qr'

export const metadata: Metadata = {
  title: 'Liên hệ | AI GIÁ SỈ',
  description: 'Liên hệ AI GIÁ SỈ qua Zalo để được hỗ trợ mua tài khoản số nhanh nhất.',
}

export const revalidate = 300

export default async function ContactPage() {
  // Fetch settings
  const supabase = await createClient()
  const { data: settings } = await supabase.from('site_settings').select('key, value')

  const settingsMap: Record<string, string> = {}
  settings?.forEach((s) => { if (s.key && s.value) settingsMap[s.key] = s.value })

  const zaloPhone = settingsMap.zalo_phone || process.env.NEXT_PUBLIC_ZALO_PHONE || '0764894250'
  const zaloLink = settingsMap.zalo_link || `https://zalo.me/${zaloPhone}`
  const contactEmail = settingsMap.contact_email || ''
  const shopName = settingsMap.shop_name || 'AI GIÁ SỈ'
  const shopDescription = settingsMap.shop_description || ''

  return (
    <div className="min-h-screen flex items-center justify-center py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-200
                     transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Về trang chủ
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Liên hệ
            <span className="gradient-text"> {shopName}</span>
          </h1>
          <p className="text-slate-400">
            {shopDescription || 'Chúng tôi hỗ trợ 24/7, phản hồi trong 5 phút qua Zalo.'}
          </p>
        </div>

        {/* Contact card */}
        <div className="glass-card p-8 rounded-2xl text-center space-y-8">
          {/* QR Code */}
          <div>
            <p className="text-sm text-slate-500 mb-4">
              Quét mã QR để nhắn Zalo ngay
            </p>
            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-2xl inline-block">
                {/* Client Component để render QR */}
                <ZaloQRCode value={zaloLink} size={180} />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-slate-600">hoặc</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Direct link */}
          <div className="space-y-4">
            <a
              href={zaloLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gradient flex items-center justify-center gap-2
                         w-full py-4 rounded-xl text-white font-semibold text-base"
              aria-label="Nhắn Zalo ngay"
            >
              <span>🔵</span>
              Nhắn Zalo: {zaloPhone}
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>

            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center justify-center gap-2 py-3 rounded-xl
                           border border-white/8 bg-white/5 hover:bg-white/8
                           text-slate-300 text-sm transition-all"
                aria-label={`Email: ${contactEmail}`}
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                {contactEmail}
              </a>
            )}
          </div>

          {/* Note */}
          <p className="text-xs text-slate-600">
            Giờ hỗ trợ: 7:00 - 23:00 hàng ngày. Ngoài giờ vui lòng để lại tin nhắn, chúng tôi sẽ phản hồi sớm nhất.
          </p>
        </div>
      </div>
    </div>
  )
}
