// ============================================================
// lib/validations/category.ts - Zod schema cho Category form
// ============================================================
import { z } from 'zod'

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, 'Tên danh mục phải có ít nhất 2 ký tự')
    .max(50, 'Tên danh mục không được quá 50 ký tự'),
  slug: z
    .string()
    .min(2, 'Slug phải có ít nhất 2 ký tự')
    .max(50, 'Slug không được quá 50 ký tự')
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang'),
  icon: z.string().max(50, 'Tên icon không được quá 50 ký tự').nullable().optional(),
  sort_order: z.number().int().min(0).default(0),
})

export type CategoryFormData = z.infer<typeof categorySchema>
