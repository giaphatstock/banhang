// ============================================================
// app/admin/products/page.tsx - Server Component
// Lấy danh sách sản phẩm và danh mục để truyền vào ProductManager
// ============================================================
import { createClient } from '@/lib/supabase/server'
import { ProductManager } from '@/components/admin/product-manager'
import type { Product, Category } from '@/lib/types'

export const revalidate = 0

async function getData() {
  const supabase = await createClient()

  const [productsRes, categoriesRes] = await Promise.all([
    supabase
      .from('products')
      .select('*, categories(id, name, slug)')
      .order('sort_order', { ascending: true }),
    supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true }),
  ])

  return {
    products: (productsRes.data || []) as Product[],
    categories: (categoriesRes.data || []) as Category[],
  }
}

export default async function AdminProductsPage() {
  const { products, categories } = await getData()

  return <ProductManager initialProducts={products} categories={categories} />
}
