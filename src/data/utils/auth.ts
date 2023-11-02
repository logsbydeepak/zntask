import { cookies } from 'next/headers'
import * as jose from 'jose'
import ms from 'ms'

import { env } from '@/env.mjs'

import { redis } from './config'

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
    const token = cookies().get('auth')?.value
    if (!token) throw new Error("Token doesn't exist!")

    const secret = jose.base64url.decode(env.JWT_SECRET)
    const { payload } = await jose.jwtDecrypt(token, secret, {
      audience: 'auth',
    })

    if (!payload) throw new Error("Payload doesn't exist!")
    if (!payload?.userId) throw new Error("Payload doesn't have userId!")
    if (typeof payload.userId !== 'string') throw new Error('Invalid payload!')

    const redisRes = await redis.exists(`logout:${token}`)
    if (redisRes === 1) throw new Error('Token is invalid!')

    return { userId: payload.userId, token }
  } catch (error) {
    throw new UnauthorizedError()
  }
}
