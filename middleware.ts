// ============================================================
// middleware.ts - Bảo vệ routes /admin/* bằng Supabase Auth
// Chỉ cho phép email trong ADMIN_EMAILS truy cập
// ============================================================
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
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

  // Lấy user hiện tại (không dùng getSession vì JWT không đáng tin)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Bảo vệ toàn bộ /admin/* trừ /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!user) {
      // Chưa đăng nhập → redirect về login
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Kiểm tra email trong whitelist ADMIN_EMAILS hoặc bảng admin_users trong database
    const adminEmails = (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)

    let isAuthorized = adminEmails.includes(user.email?.toLowerCase() ?? '')

    if (!isAuthorized && user.email) {
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
      // Email không trong whitelist → logout và redirect về login
      await supabase.auth.signOut()
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(loginUrl)
    }
  }

  // Nếu đã đăng nhập mà vào /admin/login → redirect về dashboard
  if (pathname === '/admin/login' && user) {
    const adminEmails = (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)

    let isAuthorized = adminEmails.includes(user.email?.toLowerCase() ?? '')

    if (!isAuthorized && user.email) {
      const { data: dbAdmin } = await supabase
        .from('admin_users')
        .select('id')
        .ilike('email', user.email)
        .maybeSingle()
      if (dbAdmin) {
        isAuthorized = true
      }
    }

    if (isAuthorized) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match tất cả routes trừ:
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - api routes
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
