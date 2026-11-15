'use client'

// ============================================================
// components/site/zalo-qr.tsx
// Component hiển thị mã QR Zalo bằng qrcode.react
// ============================================================
import { QRCodeSVG } from 'qrcode.react'

interface ZaloQRCodeProps {
  value: string
  size?: number
}

export function ZaloQRCode({ value, size = 180 }: ZaloQRCodeProps) {
  if (!value) return null

  return (
    <QRCodeSVG
      value={value}
      size={size}
      level="H"
      includeMargin={false}
      aria-label="Mã QR liên hệ Zalo"
    />
  )
}
