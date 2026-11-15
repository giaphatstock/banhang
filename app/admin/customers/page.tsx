// ============================================================
// app/admin/customers/page.tsx - Server Component
// ============================================================
import { createClient } from '@/lib/supabase/server'
import { CustomerManager } from '@/components/admin/customer-manager'
import type { Customer } from '@/lib/types'

export const revalidate = 0

async function getCustomers() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('customers')
    .select('*, products(id, name)')
    .order('created_at', { ascending: false })

  return (data || []) as Customer[]
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers()

  return <CustomerManager initialCustomers={customers} />
}
