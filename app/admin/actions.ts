'use server'

// ============================================================
// app/admin/actions.ts - Server Actions cho Admin Panel
// Quản lý Sản phẩm, Danh mục, Khách hàng, Cài đặt và Auth
// ============================================================
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { productSchema, type ProductFormData } from '@/lib/validations/product'
import { categorySchema, type CategoryFormData } from '@/lib/validations/category'
import { settingsSchema, type SettingsFormData } from '@/lib/validations/settings'
import type { CustomerStatus } from '@/lib/types'

// ------------------------------------------------------------
// AUTH ACTIONS
// ------------------------------------------------------------

export async function loginAdmin(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Vui lòng nhập đầy đủ email và mật khẩu.' }
  }

  // Whitelist check: biến môi trường ADMIN_EMAILS HOẶC bảng admin_users trong database
  const envAdminEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  let isAllowed = envAdminEmails.includes(email.toLowerCase())

  const supabase = await createClient()

  if (!isAllowed) {
    const { data: adminRecord } = await supabase
      .from('admin_users')
      .select('id')
      .ilike('email', email.trim())
      .maybeSingle()
    if (adminRecord) {
      isAllowed = true
    }
  }

  if (!isAllowed) {
    return { error: 'Tài khoản không có quyền truy cập vào trang quản trị.' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'Email hoặc mật khẩu không chính xác.' }
  }

  revalidatePath('/admin')
  redirect('/admin')
}

export async function logoutAdmin() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/admin/login')
}

// ------------------------------------------------------------
// PRODUCT ACTIONS
// ------------------------------------------------------------

export async function createProduct(data: ProductFormData) {
  const parsed = productSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues?.[0]?.message || 'Dữ liệu không hợp lệ.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('products').insert([parsed.data])

  if (error) {
    return { error: 'Không thể thêm sản phẩm: ' + error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/products')
  return { success: true }
}

export async function updateProduct(id: string, data: ProductFormData) {
  const parsed = productSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues?.[0]?.message || 'Dữ liệu không hợp lệ.' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('products')
    .update(parsed.data)
    .eq('id', id)

  if (error) {
    return { error: 'Không thể cập nhật sản phẩm: ' + error.message }
  }

  revalidatePath('/')
  revalidatePath(`/san-pham/${parsed.data.slug}`)
  revalidatePath('/admin/products')
  return { success: true }
}

export async function toggleProductActive(id: string, is_active: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('products')
    .update({ is_active })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/products')
  return { success: true }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) {
    return { error: 'Không thể xóa sản phẩm: ' + error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/products')
  return { success: true }
}

// ------------------------------------------------------------
// CATEGORY ACTIONS
// ------------------------------------------------------------

export async function createCategory(data: CategoryFormData) {
  const parsed = categorySchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues?.[0]?.message || 'Dữ liệu không hợp lệ.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('categories').insert([parsed.data])

  if (error) {
    return { error: 'Không thể tạo danh mục: ' + error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/categories')
  return { success: true }
}

export async function updateCategory(id: string, data: CategoryFormData) {
  const parsed = categorySchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues?.[0]?.message || 'Dữ liệu không hợp lệ.' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('categories')
    .update(parsed.data)
    .eq('id', id)

  if (error) {
    return { error: 'Không thể cập nhật danh mục: ' + error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/categories')
  return { success: true }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('categories').delete().eq('id', id)

  if (error) {
    return { error: 'Không thể xóa danh mục: ' + error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/categories')
  return { success: true }
}

// ------------------------------------------------------------
// CUSTOMER ACTIONS
// ------------------------------------------------------------

export async function updateCustomerStatusAndNote(
  id: string,
  status: CustomerStatus,
  note: string | null
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('customers')
    .update({ status, note })
    .eq('id', id)

  if (error) {
    return { error: 'Không thể cập nhật thông tin khách hàng: ' + error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/customers')
  return { success: true }
}

export async function deleteCustomer(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('customers').delete().eq('id', id)

  if (error) {
    return { error: 'Không thể xóa khách hàng: ' + error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/customers')
  return { success: true }
}

// ------------------------------------------------------------
// SETTINGS ACTIONS
// ------------------------------------------------------------

export async function updateSettings(data: SettingsFormData) {
  const parsed = settingsSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues?.[0]?.message || 'Dữ liệu không hợp lệ.' }
  }

  const supabase = await createClient()

  // Upsert các key vào bảng site_settings
  const updates = Object.entries(parsed.data).map(([key, value]) => ({
    key,
    value: value ?? '',
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from('site_settings')
    .upsert(updates, { onConflict: 'key' })

  if (error) {
    return { error: 'Không thể lưu cài đặt: ' + error.message }
  }

  revalidatePath('/')
  revalidatePath('/lien-he')
  revalidatePath('/admin/settings')
  return { success: true }
}

// ------------------------------------------------------------
// ADMIN USERS ACTIONS
// ------------------------------------------------------------

export async function addAdminUser(email: string, note?: string) {
  const cleanEmail = email.trim().toLowerCase()
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { error: 'Email không hợp lệ.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('admin_users').insert([
    {
      email: cleanEmail,
      role: 'admin',
      note: note?.trim() || 'Quản trị viên',
    },
  ])

  if (error) {
    if (error.code === '23505') {
      return { error: 'Email này đã tồn tại trong danh sách admin.' }
    }
    return { error: 'Lỗi khi thêm admin: ' + error.message }
  }

  revalidatePath('/admin/settings')
  return { success: true }
}

export async function deleteAdminUser(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('admin_users').delete().eq('id', id)

  if (error) {
    return { error: 'Không thể xóa admin: ' + error.message }
  }

  revalidatePath('/admin/settings')
  return { success: true }
}
