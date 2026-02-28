import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ADMIN_ID = '994b20b5-87bc-4772-9f50-6d888f966b89'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

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
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  const isAuthRoute  = pathname.startsWith('/login') || pathname.startsWith('/register')
  const isPublic     = pathname === '/' || isAuthRoute
  const isBackoffice = pathname.startsWith('/backoffice')

  // no logueado → solo puede ver rutas públicas
  if (!user && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // logueado → no puede ir a login/register, lo mandamos al recetario
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/recetario', request.url))
  }

  // no admin → no puede ir al backoffice
  if (isBackoffice && user?.id !== ADMIN_ID) {
    return NextResponse.redirect(new URL('/recetario', request.url))
  }

  return response
}