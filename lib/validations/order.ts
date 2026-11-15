import { z } from 'zod'

export const orderSchema = z.object({
  customer_name: z
    .string()
    .min(1, 'Tên khách hàng không được để trống'),
  customer_contact: z.string().nullable().optional(),
  product_id: z.string().nullable().optional(),
  product_name: z
    .string()
    .min(1, 'Tên sản phẩm không được để trống'),
  price: z.coerce.number().min(0, 'Giá tiền không thể âm'),
  bill_image: z.string().nullable().optional(),
  attachment_image: z.string().nullable().optional(),
  account_note: z.string().nullable().optional(),
  purchase_date: z.string().min(1, 'Vui lòng chọn ngày mua'),
  warranty_duration: z.string().nullable().optional(),
  warranty_months: z.coerce.number().nullable().optional(),
  warranty_expiry_date: z.string().nullable().optional(),
  status: z.enum(['active', 'expired', 'refunded']).default('active'),
})

export type OrderInput = z.infer<typeof orderSchema>
