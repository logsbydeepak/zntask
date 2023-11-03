'use server'

import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { zCategory } from '@/utils/category'
import { zRequired } from '@/utils/zSchema'

import { db, dbSchema } from './db'
import { h, r } from './utils/handler'

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
