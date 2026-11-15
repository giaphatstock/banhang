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
  Shield,
  UserPlus,
  Trash2,
  KeyRound,
} from 'lucide-react'
import { updateSettings, addAdminUser, deleteAdminUser, updateAdminPassword } from '@/app/admin/actions'
import type { SiteSettingsObject, AdminUser } from '@/lib/types'
import type { SettingsFormData } from '@/lib/validations/settings'
import { toast } from 'sonner'

interface SettingsManagerProps {
  initialSettings: SiteSettingsObject
  initialAdminUsers?: AdminUser[]
}

export function SettingsManager({ initialSettings, initialAdminUsers = [] }: SettingsManagerProps) {
  const [formData, setFormData] = useState<SiteSettingsObject>(initialSettings)
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(initialAdminUsers)
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminNote, setNewAdminNote] = useState('')
  const [isPending, startTransition] = useTransition()
  const [isAddingAdmin, setIsAddingAdmin] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)

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

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAdminEmail.trim()) {
      toast.error('Vui lòng nhập email admin')
      return
    }

    setIsAddingAdmin(true)
    const res = await addAdminUser(newAdminEmail, newAdminNote)
    setIsAddingAdmin(false)

    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success(`Đã thêm quyền admin cho ${newAdminEmail}`)
      setAdminUsers((prev) => [
        {
          id: Math.random().toString(),
          email: newAdminEmail.trim().toLowerCase(),
          role: 'admin',
          note: newAdminNote.trim() || 'Quản trị viên',
          created_at: new Date().toISOString(),
        },
        ...prev,
      ])
      setNewAdminEmail('')
      setNewAdminNote('')
    }
  }

  const handleDeleteAdmin = async (id: string, email: string) => {
    if (!confirm(`Bạn có chắc muốn xóa quyền admin của ${email}?`)) return

    const res = await deleteAdminUser(id)
    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success(`Đã xóa ${email} khỏi danh sách admin`)
      setAdminUsers((prev) => prev.filter((a) => a.id !== id))
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword || newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự.')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp.')
      return
    }

    setIsChangingPassword(true)
    const fd = new FormData()
    fd.append('newPassword', newPassword)
    fd.append('confirmPassword', confirmPassword)

    const res = await updateAdminPassword(fd)
    setIsChangingPassword(false)

    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success('Đổi mật khẩu tài khoản thành công!')
      setNewPassword('')
      setConfirmPassword('')
    }
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

      {/* Card 4: Quản lý Admin Users (Bảng admin_users trong Supabase) */}
      <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-6 pt-6 mt-8">
        <div className="flex items-center justify-between pb-3 border-b border-white/5 flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Quản lý Tài khoản Admin (Bảng admin_users)</h2>
              <p className="text-xs text-slate-400">
                Email trong danh sách này được phép đăng nhập vào trang quản trị /admin. Đồng bộ trực tiếp với bảng <code className="text-violet-400">admin_users</code> trên Supabase.
              </p>
            </div>
          </div>
        </div>

        {/* Form thêm admin */}
        <form onSubmit={handleAddAdmin} className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="sm:col-span-6">
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Email Quản trị viên mới
            </label>
            <input
              type="email"
              required
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
            />
          </div>
          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Ghi chú / Tên
            </label>
            <input
              type="text"
              value={newAdminNote}
              onChange={(e) => setNewAdminNote(e.target.value)}
              placeholder="VD: Quản lý kỹ thuật"
              className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
            />
          </div>
          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={isAddingAdmin}
              className="w-full py-2 px-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isAddingAdmin ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <UserPlus className="w-3.5 h-3.5" />
              )}
              <span>Thêm Admin</span>
            </button>
          </div>
        </form>

        {/* Danh sách Admin */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Danh sách Admin hiện tại ({adminUsers.length})
          </div>
          <div className="divide-y divide-white/5 rounded-xl border border-white/5 bg-black/20 overflow-hidden">
            {adminUsers.map((admin) => (
              <div
                key={admin.id}
                className="p-3.5 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center text-xs font-bold uppercase">
                    {admin.email.slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white flex items-center gap-2">
                      <span>{admin.email}</span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        {admin.role}
                      </span>
                    </div>
                    {admin.note && (
                      <div className="text-xs text-slate-400">{admin.note}</div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                  title="Xóa quyền admin"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card 5: Đổi Mật Khẩu Admin đang đăng nhập */}
      <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 pt-6 mt-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Đổi Mật Khẩu Đăng Nhập</h2>
            <p className="text-xs text-slate-400">
              Cập nhật mật khẩu mới cho tài khoản admin bạn đang sử dụng.
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Mật khẩu mới
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={isChangingPassword}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isChangingPassword ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang đổi mật khẩu...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Cập nhật mật khẩu mới</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
