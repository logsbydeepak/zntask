import { cookies } from 'next/headers'
import { env } from '#env'
import * as jose from 'jose'
import ms from 'ms'

const secret = jose.base64url.decode(env.JWT_SECRET)
const maxAge = ms('30 days')

export async function generateJWT(userId: string) {
  return await new jose.EncryptJWT({ userId })
    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
    .setIssuedAt()
    .setExpirationTime(maxAge)
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
