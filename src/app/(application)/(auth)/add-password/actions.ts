'use server'

import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { ulid } from 'ulidx'
import { z } from 'zod'

import { db, dbSchema } from '@/db'
import { redis } from '@/utils/config'
import { h, r } from '@/utils/handler'
import { zPassword, zRequired } from '@/utils/zod'

import { checkToken } from './utils'

const zSchema = z
  .object({
    token: zRequired,
    password: zPassword('not strong enough'),
    confirmPassword: zRequired,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'password do not match',
    path: ['confirmPassword'],
  })

export const addPassword = h(zSchema, async function ({ input }) {
  const token = await checkToken(input.token)
  if (token.code === 'INVALID_TOKEN') return r('INVALID_TOKEN')
  if (token.code === 'TOKEN_EXPIRED') return r('TOKEN_EXPIRED')
  const userId = token.userId

  const redisRes = await redis.get(`reset-password:${userId}`)
  if (!redisRes) return r('INVALID_TOKEN')
  if (redisRes !== input.token) return r('INVALID_TOKEN')

  const user = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, userId)
    },
    with: {
      credentialAuth: true,
    },
  })
  if (!user) return r('INVALID_TOKEN')

  const password = await bcrypt.hash(input.password, 10)
  if (!user.credentialAuth) {
    await db.insert(dbSchema.credentialAuth).values({
      id: ulid(),
      userId: user.id,
      password,
    })
  } else {
    await db
      .update(dbSchema.credentialAuth)
      .set({
        password,
      })
      .where(eq(dbSchema.credentialAuth.id, user.id))
  }

  return r('OK')
})
