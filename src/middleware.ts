import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("Missing Supabase environment variables in middleware!")
    return NextResponse.next({ request })
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string, value: string, options: any }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, { ...options, secure: false })
          )
        },
      },
    }
  )

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  const user = session?.user

  console.log("Middleware auth check:", { 
    userId: user?.id, 
    error: sessionError?.message,
    cookieCount: request.cookies.getAll().length,
  })

  const { pathname } = request.nextUrl

  if (!user && pathname.startsWith('/admin')) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/sign-in'
    const redirectRes = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach(c => redirectRes.cookies.set(c.name, c.value, c))
    return redirectRes
  }

  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/dashboard'
    const redirectRes = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach(c => redirectRes.cookies.set(c.name, c.value, c))
    return redirectRes
  }

  if (user && pathname === '/auth/sign-in') {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/dashboard'
    const redirectRes = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach(c => redirectRes.cookies.set(c.name, c.value, c))
    return redirectRes
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
