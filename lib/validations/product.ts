// ============================================================
// lib/validations/product.ts - Zod schema cho Product form
// ============================================================
import { z } from 'zod'

export const productSchema = z.object({
  name: z
    .string()
    .min(2, 'Tên sản phẩm phải có ít nhất 2 ký tự')
    .max(100, 'Tên sản phẩm không được quá 100 ký tự'),
  slug: z
    .string()
    .min(2, 'Slug phải có ít nhất 2 ký tự')
    .max(100, 'Slug không được quá 100 ký tự'),
  category_id: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val && val.trim() ? val.trim() : null)),
  description: z
    .string()
    .max(1000, 'Mô tả không được quá 1000 ký tự')
    .nullable()
    .optional()
    .transform((val) => (val && val.trim() ? val.trim() : null)),
  benefits: z
    .array(z.string())
    .nullable()
    .optional()
    .transform((val) => (val ? val.filter((b) => b && b.trim()) : [])),
  price: z.coerce
    .number()
    .min(0, 'Giá sản phẩm tối thiểu 0đ')
    .max(100000000, 'Giá tối đa 100 triệu'),
  original_price: z.coerce
    .number()
    .nullable()
    .optional()
    .transform((val) => (val && val > 0 ? val : null)),
  duration: z
    .string()
    .max(100, 'Thời hạn không được quá 100 ký tự')
    .nullable()
    .optional()
    .transform((val) => (val && val.trim() ? val.trim() : null)),
  warranty: z
    .string()
    .max(150, 'Bảo hành không được quá 150 ký tự')
    .nullable()
    .optional()
    .transform((val) => (val && val.trim() ? val.trim() : null)),
  badge: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val && val.trim() ? val.trim() : null)),
  note: z
    .string()
    .max(1000, 'Lưu ý không được quá 1000 ký tự')
    .nullable()
    .optional()
    .transform((val) => (val && val.trim() ? val.trim() : null)),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  sort_order: z.coerce.number().int().min(0).default(0),
})

export type ProductFormData = z.infer<typeof productSchema>
