// ============================================================
// middleware.ts - Bảo vệ routes /admin/* bằng Supabase Auth
// ============================================================
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 1. Chỉ can thiệp các routes bắt đầu bằng /admin
  // Toàn bộ trang chủ, sản phẩm ngoài, static asset đều bỏ qua để tốc độ đạt tối đa
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Lấy thông tin user hiện tại
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Whitelist admin emails (bao gồm mặc định và từ env)
  const defaultAdmins = ['phatdeeptraisiu@gmail.com', 'admin@aigiasi.vn']
  const envAdmins = (process.env.ADMIN_EMAILS ?? '')
    .split(/[,\s]+/)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  const allowedAdmins = new Set([...defaultAdmins, ...envAdmins])

  // Nếu đang ở trang login
  if (pathname === '/admin/login') {
    if (user && allowedAdmins.has(user.email?.toLowerCase() ?? '')) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return supabaseResponse
  }

  // Chưa đăng nhập -> redirect về /admin/login
  if (!user) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Kiểm tra quyền: nếu có trong Set in-memory thì thông qua ngay (0ms)
  let isAuthorized = allowedAdmins.has(user.email?.toLowerCase() ?? '')

  if (!isAuthorized && user.email) {
    // Chỉ query database nếu email chưa có trong list mặc định
    const { data: dbAdmin } = await supabase
      .from('admin_users')
      .select('id')
      .ilike('email', user.email)
      .maybeSingle()
    if (dbAdmin) {
      isAuthorized = true
    }
  }

  if (!isAuthorized) {
    await supabase.auth.signOut()
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('error', 'unauthorized')
    return NextResponse.redirect(loginUrl)
  }

  // Đính kèm user email vào request header để AdminLayout không phải gọi Supabase lần 2
  const requestHeaders = new Headers(request.headers)
  if (user?.email) {
    requestHeaders.set('x-user-email', user.email)
  }

  const finalResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Sao chép cookies đã set từ Supabase client
  supabaseResponse.cookies.getAll().forEach((c) => {
    finalResponse.cookies.set(c.name, c.value, c)
  })

  return finalResponse
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
