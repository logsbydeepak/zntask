import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose'

import { env } from '@/env.mjs'

export async function middleware(req: NextRequest) {
  try {
    const url = req.url
    const token = cookies().get('auth')?.value
    const isAuth = await checkIsAuth(token)

    const { pathname } = req.nextUrl

    if (pathname.startsWith('/logout')) {
      const authCookie = req.cookies.get('auth')?.value
      const authParam = req.nextUrl.searchParams.get('auth')

      if (authCookie !== authParam) {
        return null
      }

      const response = NextResponse.next()
      response.cookies.delete('auth')
      return response
    }

    const isIndexPage = pathname === '/'

    const isAuthPage =
      pathname.startsWith('/login') || pathname.startsWith('/register')

    const isAppPage =
      pathname.startsWith('/today') ||
      pathname.startsWith('/inbox') ||
      pathname.startsWith('/upcoming') ||
      pathname.startsWith('/favorite') ||
      pathname.startsWith('/category') ||
      pathname.startsWith('/user')

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
    '/logout/:path*',

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
