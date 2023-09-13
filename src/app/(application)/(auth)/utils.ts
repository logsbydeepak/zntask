import { cookies } from 'next/headers'
import { env } from '#env'
import * as jose from 'jose'
import ms from 'ms'

import { redis } from '@/utils/config'

const secret = jose.base64url.decode(env.JWT_SECRET)
const maxAge = ms('30 days')

export async function generateAuthJWT(userId: string) {
  return await new jose.EncryptJWT({ userId })
    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
    .setIssuedAt()
    .setExpirationTime(maxAge)
    .encrypt(secret)
}

export async function generateEmailJWT(id: string) {
  return await new jose.EncryptJWT({ id })
    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
    .setIssuedAt()
    .setExpirationTime(ms('15 minutes'))
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
    const { payload } = await jose.jwtDecrypt(token, secret)

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
