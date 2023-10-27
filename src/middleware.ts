import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { env } from '#env'
import * as jose from 'jose'

export async function middleware(req: NextRequest) {
  try {
    const url = req.url
    const token = cookies().get('auth')?.value
    const isAuth = await checkIsAuth(token)

    const isIndexPage = req.nextUrl.pathname === '/'

    const isAuthPage =
      req.nextUrl.pathname.startsWith('/login') ||
      req.nextUrl.pathname.startsWith('/register')

    const isAppPage =
      req.nextUrl.pathname.startsWith('/today') ||
      req.nextUrl.pathname.startsWith('/inbox') ||
      req.nextUrl.pathname.startsWith('/upcoming') ||
      req.nextUrl.pathname.startsWith('/favorite') ||
      req.nextUrl.pathname.startsWith('/category') ||
      req.nextUrl.pathname.startsWith('/user')

    if (isAuth) {
      if (isIndexPage) {
        return NextResponse.rewrite(new URL('/today', url))
      }

      if (isAuthPage) {
        return NextResponse.redirect(new URL('/', url))
      }
    }

    if (!isAuth) {
      if (isIndexPage) {
        return NextResponse.rewrite(new URL('/home', url))
      }

      if (isAppPage) {
        return NextResponse.redirect(new URL('/login', url))
      }
    }

    return null
  } catch (error) {
    return null
  }
}

export const config = {
  matcher: [
    '/',

    '/login/:path*',
    '/register/:path*',

    '/today/:path*',
    '/inbox/:path*',
    '/upcoming/:path*',
    '/favorite/:path*',
    '/category/:path*',

    '/user/:path*',
  ],
}

async function checkIsAuth(token?: string) {
  try {
    if (!token) return false
    const secret = jose.base64url.decode(env.JWT_SECRET)
    const { payload } = await jose.jwtDecrypt(token, secret, {
      audience: 'auth',
    })
    if (!payload) return false
    if (!payload?.userId) return false
    if (typeof payload.userId !== 'string') return false
    return true
  } catch (error) {
    return false
  }
}
