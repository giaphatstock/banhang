'use client'

// ============================================================
// components/site/zalo-modal.tsx
// Modal hướng dẫn liên hệ Zalo khi bấm "Mua ngay"
// Dùng Dialog của shadcn/ui
// ============================================================
import { useState } from 'react'
import { Copy, Check, ExternalLink, MessageCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ZaloModalProps {
  open: boolean
  onClose: () => void
  productName: string
  zaloPhone: string
  zaloLink: string
}

export function ZaloModal({
  open,
  onClose,
  productName,
  zaloPhone,
  zaloLink,
}: ZaloModalProps) {
  const [copied, setCopied] = useState(false)

  // Copy số Zalo vào clipboard
  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(zaloPhone)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const el = document.createElement('input')
      el.value = zaloPhone
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const zaloMessageLink = `${zaloLink || `https://zalo.me/${zaloPhone}`}`

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="glass-card max-w-md w-full p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0F0F1A] text-white">
        <DialogHeader className="flex flex-col items-center text-center">
          {/* Icon Zalo */}
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
            <ZaloOfficialIcon className="w-10 h-10" />
          </div>

          <DialogTitle
            className="text-xl font-bold text-white tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Mua qua Zalo
          </DialogTitle>

          <DialogDescription className="text-slate-400 text-sm mt-1">
            Để mua gói này, vui lòng liên hệ Zalo của chúng tôi để được kích hoạt ngay.
          </DialogDescription>
        </DialogHeader>

        {/* Thông tin gói */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 my-2">
          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
            Gói dịch vụ đã chọn
          </p>
          <p className="text-white font-bold text-base">{productName}</p>
        </div>

        {/* Text gợi ý gửi kèm */}
        <div className="bg-violet-500/10 rounded-2xl p-3.5 border border-violet-500/20 flex items-start gap-2.5">
          <MessageCircle className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-xs text-violet-200 leading-relaxed">
            Gửi kèm tên gói: <strong className="text-white">"{productName}"</strong> để được hỗ trợ nhanh nhất.
          </p>
        </div>

        {/* Nút lớn: Nhắn Zalo ngay */}
        <a
          href={zaloMessageLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gradient flex items-center justify-center gap-2.5 w-full py-4 rounded-xl text-white font-semibold text-base shadow-lg shadow-violet-500/20 mt-2 cursor-pointer"
          aria-label={`Nhắn Zalo ngay để mua ${productName}`}
        >
          <ZaloOfficialIcon className="w-5 h-5" />
          <span>Nhắn Zalo ngay</span>
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
        </a>

        {/* Box copy số Zalo */}
        <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5">
          <span className="text-slate-400 text-xs">Số Zalo hỗ trợ:</span>
          <div className="flex items-center gap-2">
            <span className="text-white font-mono font-bold text-sm">{zaloPhone}</span>
            <button
              onClick={handleCopyPhone}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-slate-300 hover:text-white cursor-pointer"
              aria-label="Sao chép số Zalo"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-400" aria-hidden="true" />
              ) : (
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={onClose}
          className="w-full text-slate-400 hover:text-white text-xs mt-1"
        >
          Đóng cửa sổ
        </Button>
      </DialogContent>
    </Dialog>
  )
}

// Icon Zalo SVG chính thức
function ZaloOfficialIcon({ className }: { className?: string }) {
  return (
    <svg
      width="40"
      height="40"
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="10" fill="#0068FF" />
      <path
        d="M36.5 25.5c0 6.627-5.373 12-12 12-1.633 0-3.187-.326-4.598-.915l-7.902 1.915 2.168-7.025A11.95 11.95 0 0 1 12.5 25.5c0-6.627 5.373-12 12-12s12 5.373 12 12z"
        fill="white"
      />
      <path
        d="M19.5 22.5h9M19.5 25.5h6"
        stroke="#0068FF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
