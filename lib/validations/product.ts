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
    .max(100, 'Slug không được quá 100 ký tự')
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang'),
  category_id: z.string().uuid('Danh mục không hợp lệ').nullable().optional(),
  description: z.string().max(500, 'Mô tả không được quá 500 ký tự').nullable().optional(),
  benefits: z.array(z.string().min(1, 'Quyền lợi không được trống')).max(10, 'Tối đa 10 quyền lợi').optional(),
  price: z
    .number()
    .min(1000, 'Giá tối thiểu 1.000đ')
    .max(100000000, 'Giá tối đa 100 triệu'),
  original_price: z
    .number()
    .min(1000, 'Giá gốc tối thiểu 1.000đ')
    .nullable()
    .optional(),
  duration: z.string().max(50, 'Thời hạn không được quá 50 ký tự').nullable().optional(),
  warranty: z.string().max(100, 'Bảo hành không được quá 100 ký tự').nullable().optional(),
  badge: z.enum(['Best Seller', 'Hot', 'Khuyến mãi']).nullable().optional(),
  note: z.string().max(500, 'Lưu ý không được quá 500 ký tự').nullable().optional(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  sort_order: z.number().int().min(0).default(0),
})

export type ProductFormData = z.infer<typeof productSchema>
