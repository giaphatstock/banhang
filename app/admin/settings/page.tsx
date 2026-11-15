// ============================================================
// app/admin/settings/page.tsx - Server Component
// ============================================================
import { createClient } from '@/lib/supabase/server'
import { SettingsManager } from '@/components/admin/settings-manager'
import type { SiteSettingsObject } from '@/lib/types'

export const revalidate = 0

async function getSettings(): Promise<SiteSettingsObject> {
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('key, value')

  const map: Record<string, string> = {}
  data?.forEach((row) => {
    if (row.key && row.value) map[row.key] = row.value
  })

  return {
    shop_name: map.shop_name || 'OpenLay',
    zalo_phone: map.zalo_phone || process.env.NEXT_PUBLIC_ZALO_PHONE || '0123456789',
    zalo_link: map.zalo_link || `https://zalo.me/${map.zalo_phone || process.env.NEXT_PUBLIC_ZALO_PHONE || '0123456789'}`,
    contact_email: map.contact_email || 'contact@openlay.vn',
    facebook_link: map.facebook_link || '',
    telegram_link: map.telegram_link || '',
    shop_description: map.shop_description || 'Cung cấp tài khoản số chính hãng, bảo hành uy tín',
  }
}

export default async function AdminSettingsPage() {
  const settings = await getSettings()

  return <SettingsManager initialSettings={settings} />
}
