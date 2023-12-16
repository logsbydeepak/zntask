import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose'

import { env } from '@/env.mjs'

import { redis } from './data/utils/config'
import { r } from './data/utils/handler'

export async function middleware(req: NextRequest) {
  try {
    const url = req.url
    const token = cookies().get('auth')?.value
    const authData = await checkIsAuth(token)
    const isAuth = authData.code === 'OK'

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
      pathname.startsWith('/user') ||
      pathname.startsWith('/api/uploadthing')

    if (isAuth) {
      const clonedRequest = req.clone()
      clonedRequest.headers.append(
        'Cookie',
        `middlewareData-auth-userId=${authData.userId}`
      )
      clonedRequest.headers.append(
        'Cookie',
        `middlewareData-auth-token=${authData.token}`
      )

      if (isIndexPage) {
        return NextResponse.rewrite(new URL('/today', url), {
          request: clonedRequest,
        })
      }

      if (isAuthPage) {
        return NextResponse.redirect(new URL('/', url))
      }
      return NextResponse.next({ request: clonedRequest })
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
    '/api/uploadthing:path*',

    '/user/:path*',
  ],
}

async function checkIsAuth(token?: string) {
  try {
    if (!token) return r('NO_TOKEN')
    const secret = jose.base64url.decode(env.JWT_SECRET)
    const { payload } = await jose.jwtDecrypt(token, secret, {
      audience: 'auth',
    })
    if (!payload || !payload?.userId || typeof payload.userId !== 'string')
      return r('INVALID_PAYLOAD')

    const redisRes = await redis.exists(`logout:${token}`)
    if (redisRes === 1) return r('LOGGED_OUT')

    return r('OK', {
      userId: payload.userId,
      token: token,
    })
  } catch (error) {
    return r('ERROR')
  }
}
