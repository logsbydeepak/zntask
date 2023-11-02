import { env } from '#env'
import * as jose from 'jose'

import { r } from './handler'

export async function checkToken(token: string) {
  try {
    const secret = jose.base64url.decode(env.JWT_SECRET)
    const { payload } = await jose.jwtDecrypt(token, secret, {
      audience: 'reset-password',
    })

    if (!payload) throw new Error("Payload doesn't exist!")
    if (!payload?.userId) throw new Error("Payload doesn't have userId!")
    if (typeof payload.userId !== 'string') throw new Error('Invalid payload!')

    return r('OK', { userId: payload.userId })
  } catch (error) {
    if (error instanceof jose.errors.JWTExpired) return r('TOKEN_EXPIRED')
    return r('INVALID_TOKEN')
  }
}
