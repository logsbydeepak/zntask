'use server'

import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { db, dbSchema } from '@/db'
import { zCategory } from '@/utils/category'
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

export const addCategory = h('AUTH', zCategory, async ({ input, userId }) => {
  await db
    .insert(dbSchema.categories)
    .values({ ...input, userId, indicator: 'orange' })

  return r('OK', { input })
})

export const editCategory = h('AUTH', zCategory, async ({ input, userId }) => {
  await db
    .update(dbSchema.categories)
    .set(input)
    .where(eq(dbSchema.categories.id, input.id))

  return r('OK', { input })
})

export const deleteCategory = h(
  'AUTH',
  zCategory,
  async ({ input, userId }) => {
    await db
      .delete(dbSchema.categories)
      .where(eq(dbSchema.categories.id, input.id))
    return r('OK', { input })
  }
)

export const getCategories = h('AUTH', async ({ userId }) => {
  const categories = await db.query.categories.findMany({
    where(fields, operators) {
      return operators.eq(fields.userId, userId)
    },
    orderBy(fields, operators) {
      return operators.desc(fields.orderId)
    },
  })

  if (!categories) throw new Error('No categories found')
  if (categories.length === 0) return r('OK', { categories })

  const modCategories = categories.map((category) => {
    const { userId, ...rest } = category
    return rest
  })

  return r('OK', { categories: modCategories })
})
