'use server'

import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { db, dbSchema } from '@/db'
import { zCategory } from '@/utils/category'
import { h, r } from '@/utils/handler'
import { zRequired } from '@/utils/zod'

export const addCategory = h('AUTH', zCategory, async ({ input, userId }) => {
  await db.insert(dbSchema.categories).values({ ...input, userId })

  return r('OK', { input })
})

export const editCategory = h('AUTH', zCategory, async ({ input, userId }) => {
  await db
    .update(dbSchema.categories)
    .set(input)
    .where(eq(dbSchema.categories.id, input.id))

  return r('OK', { input })
})
const zDeleteCategory = z.object({
  id: zRequired.refine((id) => id.length > 0, { message: 'Invalid id' }),
})

export const deleteCategory = h(
  'AUTH',
  zDeleteCategory,
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
