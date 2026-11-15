'use client'

// ============================================================
// components/admin/settings-manager.tsx
// Client component chỉnh sửa số Zalo, tên Shop, Social, Email
// ============================================================
import { useState, useTransition } from 'react'
import {
  Settings,
  Phone,
  Mail,
  Store,
  Share2,
  FileText,
  Loader2,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react'
import { updateSettings } from '@/app/admin/actions'
import type { SiteSettingsObject } from '@/lib/types'
import type { SettingsFormData } from '@/lib/validations/settings'
import { toast } from 'sonner'

interface SettingsManagerProps {
  initialSettings: SiteSettingsObject
}

export function SettingsManager({ initialSettings }: SettingsManagerProps) {
  const [formData, setFormData] = useState<SiteSettingsObject>(initialSettings)
  const [isPending, startTransition] = useTransition()

  const handleChange = (field: keyof SiteSettingsObject, val: string) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: val }
      // Tự động đồng bộ link zalo nếu chỉ đổi số
      if (field === 'zalo_phone' && !prev.zalo_link.includes('?')) {
        next.zalo_link = `https://zalo.me/${val}`
      }
      return next
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payload: SettingsFormData = {
      shop_name: formData.shop_name.trim(),
      zalo_phone: formData.zalo_phone.trim(),
      zalo_link: formData.zalo_link.trim(),
      contact_email: formData.contact_email.trim(),
      facebook_link: formData.facebook_link.trim() || undefined,
      telegram_link: formData.telegram_link.trim() || undefined,
      shop_description: formData.shop_description.trim() || undefined,
    }

    startTransition(async () => {
      const res = await updateSettings(payload)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Đã lưu cấu hình hệ thống thành công!')
      }
    })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1
          className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Cài đặt Chung
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Cập nhật số Zalo, thông tin shop và kênh liên hệ tức thì mà không cần build lại website.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Kênh Zalo - Cốt lõi */}
        <div className="glass-card p-6 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-600/5 to-cyan-600/5 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Kênh Chốt Khách Zalo</h2>
              <p className="text-xs text-slate-400">
                Toàn bộ nút "Mua ngay" trên landing page sẽ điều hướng theo số Zalo này.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                Số điện thoại Zalo *
              </label>
              <input
                type="text"
                required
                value={formData.zalo_phone}
                onChange={(e) => handleChange('zalo_phone', e.target.value)}
                placeholder="0987654321"
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                Đường dẫn Zalo trực tiếp *
              </label>
              <div className="relative">
                <input
                  type="url"
                  required
                  value={formData.zalo_link}
                  onChange={(e) => handleChange('zalo_link', e.target.value)}
                  placeholder="https://zalo.me/0987654321"
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-violet-500 pr-10"
                />
                <a
                  href={formData.zalo_link}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400"
                  title="Kiểm tra link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Thông tin Shop */}
        <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
            <div className="p-2 rounded-xl bg-white/5 text-slate-300">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Thương hiệu & Email</h2>
              <p className="text-xs text-slate-400">Hiển thị ở Header, Footer và thẻ Meta SEO.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                Tên Shop / Thương hiệu *
              </label>
              <input
                type="text"
                required
                value={formData.shop_name}
                onChange={(e) => handleChange('shop_name', e.target.value)}
                placeholder="OpenLay"
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                Email liên hệ hỗ trợ *
              </label>
              <input
                type="email"
                required
                value={formData.contact_email}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                placeholder="contact@openlay.vn"
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
              Khẩu hiệu / Mô tả ngắn gọn
            </label>
            <input
              type="text"
              value={formData.shop_description}
              onChange={(e) => handleChange('shop_description', e.target.value)}
              placeholder="Cung cấp tài khoản số chính hãng, bảo hành uy tín"
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Card 3: Mạng xã hội */}
        <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
            <div className="p-2 rounded-xl bg-white/5 text-slate-300">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Mạng xã hội bổ sung (Tùy chọn)</h2>
              <p className="text-xs text-slate-400">Gắn link Facebook Fanpage hoặc Kênh Telegram.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                Link Facebook (Fanpage/Group)
              </label>
              <input
                type="url"
                value={formData.facebook_link}
                onChange={(e) => handleChange('facebook_link', e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                Link Telegram (Channel/Support)
              </label>
              <input
                type="url"
                value={formData.telegram_link}
                onChange={(e) => handleChange('telegram_link', e.target.value)}
                placeholder="https://t.me/..."
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="btn-gradient px-8 py-3 rounded-xl text-sm font-semibold text-white flex items-center gap-2 shadow-lg shadow-violet-500/20 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang lưu cấu hình...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Lưu cài đặt</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
