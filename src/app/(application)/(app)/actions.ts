'use server'

import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { isValid } from 'ulidx'
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
  isFavorite: z.boolean(),
})

export const addCategory = h('AUTH', schema, async ({ input, userId }) => {
  await db.insert(dbSchema.categories).values({ ...input, userId })

  return r('OK', { input })
})

export const editCategory = h('AUTH', schema, async ({ input, userId }) => {
  await db
    .update(dbSchema.categories)
    .set(input)
    .where(eq(dbSchema.categories.id, input.id))

  return r('OK', { input })
})

const getInitCategoriesSchema = z.object({
  hash: zRequired,
})

export const getInitCategories = h(
  'AUTH',
  getInitCategoriesSchema,
  async ({ userId, input }) => {
    const categories = await db.query.categories.findMany({
      where(fields, operators) {
        return operators.eq(fields.userId, userId)
      },
    })
    if (!categories) throw new Error('No categories found')

    if (categories.length === 0) return r('OK', { categories })

    const modCategories = categories.map((category) => {
      const { id, title, indicator, isFavorite } = category
      return { id, title, indicator, isFavorite }
    })

    const isValidHash = await bcrypt.compare(
      JSON.stringify(modCategories),
      input.hash
    )

    if (isValidHash) {
      return r('IS_VALID')
    }

    return r('OK', { categories: modCategories })
  }
)
