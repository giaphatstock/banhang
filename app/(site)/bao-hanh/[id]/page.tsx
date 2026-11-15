// ============================================================
// app/(site)/bao-hanh/[id]/page.tsx
// Trang Phiếu Bảo Hành Điện Tử dành riêng cho từng khách hàng
// ============================================================
import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldAlert, ArrowLeft, Headphones } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/server'
import { WarrantySlipView } from '@/components/site/warranty-slip-view'
import type { Order } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
}

export const revalidate = 0 // Luôn lấy trạng thái bảo hành mới nhất

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createAdminClient()

  const { data: order } = await supabase
    .from('orders')
    .select('customer_name, product_name')
    .eq('id', id)
    .maybeSingle()

  if (!order) {
    return {
      title: 'Phiếu bảo hành không tồn tại | AI GIÁ SỈ',
    }
  }

  return {
    title: `Phiếu Bảo Hành - ${order.customer_name} | AI GIÁ SỈ`,
    description: `Phiếu bảo hành điện tử gói ${order.product_name} dành cho khách hàng ${order.customer_name}. Xác thực chính hãng từ hệ sinh thái AI GIÁ SỈ.`,
    robots: {
      index: false, // Không index trang bảo hành cá nhân lên Google
      follow: false,
    },
  }
}

export default async function WarrantySlipPage({ params }: Props) {
  const { id } = await params
  const supabase = await createAdminClient()

  // 1. Lấy thông tin đơn hàng / phiếu bảo hành
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  // 2. Lấy số Zalo hỗ trợ
  const { data: settings } = await supabase
    .from('site_settings')
    .select('key, value')

  const settingsMap = (settings || []).reduce<Record<string, string>>((acc, curr) => {
    acc[curr.key] = curr.value || ''
    return acc
  }, {})

  const zaloPhone =
    settingsMap.zalo_phone || process.env.NEXT_PUBLIC_ZALO_PHONE || '0764894250'

  // Trường hợp không tìm thấy phiếu
  if (!order) {
    return (
      <div className="min-h-screen bg-[#07070B] text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1
            className="text-xl font-bold text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Không tìm thấy Phiếu bảo hành
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Đường dẫn phiếu bảo hành không tồn tại, đã bị gỡ bỏ hoặc bạn đã nhập sai liên kết.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Về trang chủ</span>
            </Link>
            <a
              href={`https://zalo.me/${zaloPhone}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors"
            >
              <Headphones className="w-4 h-4" />
              <span>Hỗ trợ qua Zalo</span>
            </a>
          </div>
        </div>
      </div>
    )
  }

  return <WarrantySlipView order={order as Order} zaloPhone={zaloPhone} />
}
