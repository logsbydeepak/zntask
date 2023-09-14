'use server'

import { isValid, ulid } from 'ulidx'
import { z } from 'zod'

import { db, dbSchema } from '@/db'
import { redis } from '@/utils/config'
import { h, r } from '@/utils/handler'
import { zRequired } from '@/utils/zod'

import { removeAuthCookie } from '../(auth)/utils'

export const logout = h('AUTH', async ({ userId, token }) => {
  removeAuthCookie()

  const redisRes = await redis.set(`logout:${token}`, userId)
  if (redisRes !== 'OK') throw new Error('Failed to set logout token in redis')

  return r('OK')
})

const schema = z.object({
  id: zRequired.refine(isValid, { message: 'Invalid ulid' }),
  title: zRequired,
  indicator: zRequired,
})

export const addCategory = h('AUTH', schema, async ({ input, userId }) => {
  await db.insert(dbSchema.categories).values({ ...input, userId })

  return r('OK', { input })
})
