// ============================================================
// lib/validations/settings.ts - Zod schema cho Settings form
// ============================================================
import { z } from 'zod'

export const settingsSchema = z.object({
  shop_name: z
    .string()
    .min(1, 'Tên shop không được trống')
    .max(100, 'Tên shop không được quá 100 ký tự'),
  zalo_phone: z
    .string()
    .min(10, 'Số Zalo phải có ít nhất 10 chữ số')
    .max(15, 'Số Zalo không được quá 15 ký tự')
    .regex(/^[0-9+]+$/, 'Số Zalo chỉ được chứa chữ số và dấu +'),
  zalo_link: z
    .string()
    .url('Link Zalo không hợp lệ')
    .startsWith('https://zalo.me/', 'Link Zalo phải bắt đầu bằng https://zalo.me/'),
  contact_email: z
    .string()
    .email('Email không hợp lệ')
    .max(100, 'Email không được quá 100 ký tự'),
  facebook_link: z
    .string()
    .url('Link Facebook không hợp lệ')
    .nullable()
    .optional()
    .or(z.literal('')),
  telegram_link: z
    .string()
    .url('Link Telegram không hợp lệ')
    .nullable()
    .optional()
    .or(z.literal('')),
  shop_description: z
    .string()
    .max(200, 'Mô tả shop không được quá 200 ký tự')
    .nullable()
    .optional(),
})

export type SettingsFormData = z.infer<typeof settingsSchema>
