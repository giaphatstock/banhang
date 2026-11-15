import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export const metadata = {
  title: 'Bảng Điều Khiển Quản Trị | AI GIÁ SỈ',
  description: 'Quản lý toàn bộ gói dịch vụ, khách hàng và cấu hình hệ thống AI GIÁ SỈ.',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Nếu chưa đăng nhập hoặc đang ở trang login, chỉ render children không có sidebar
  if (!user) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <AdminSidebar userEmail={user.email ?? ''} />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  )
}
