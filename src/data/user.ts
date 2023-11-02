'use server'

import { redis } from '@/utils/config'
import { h, r } from '@/utils/handler'

import { removeAuthCookie } from './utils/auth'

export const logout = h('AUTH', async ({ userId, token }) => {
  removeAuthCookie()

  const redisRes = await redis.set(`logout:${token}`, userId)
  if (redisRes !== 'OK') throw new Error('Failed to set logout token in redis')

  return r('OK')
})
