import { cookies, headers } from 'next/headers'
import * as jose from 'jose'
import ms from 'ms'

import { env } from '@/env'

const secret = jose.base64url.decode(env.JWT_SECRET)
const maxAge = ms('30 days')

function genExpTime(ExpMs: number) {
  return Date.now() + ExpMs
}

export async function generateAuthJWT(userId: string) {
  return await new jose.EncryptJWT({ userId })
    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
    .setAudience('auth')
    .setExpirationTime(genExpTime(maxAge))
    .encrypt(secret)
}

export async function generateEmailJWT(userId: string) {
  return await new jose.EncryptJWT({ userId })
    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
    .setAudience('reset-password')
    .setExpirationTime(genExpTime(ms('15 minutes')))
    .encrypt(secret)
}

export const setAuthCookie = (token: string) => {
  cookies().set('auth', token, {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    secure: env.NODE_ENV === 'production',
    maxAge,
  })
}

export const removeAuthCookie = () => {
  cookies().set('auth', '', {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    secure: env.NODE_ENV === 'production',
    maxAge: 0,
  })
}

export class UnauthorizedError extends Error {
  constructor(message = 'user is not authorized') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export async function isAuth() {
  try {
    const userId = cookies().get('middlewareData-auth-userId')?.value
    const token = cookies().get('middlewareData-auth-token')?.value

    if (!token) throw new Error("Token doesn't exist!")
    if (!userId) throw new Error("UserId doesn't exist!")

    return { userId, token }
  } catch (error) {
    throw new UnauthorizedError()
  }
}
