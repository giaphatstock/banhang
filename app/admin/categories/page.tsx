// ============================================================
// app/admin/categories/page.tsx - Server Component
// ============================================================
import { createClient } from '@/lib/supabase/server'
import { CategoryManager } from '@/components/admin/category-manager'
import type { Category } from '@/lib/types'

export const revalidate = 0

async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })

  return (data || []) as Category[]
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return <CategoryManager initialCategories={categories} />
}
