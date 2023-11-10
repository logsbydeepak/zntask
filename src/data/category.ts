'use server'

import { and, eq } from 'drizzle-orm'
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
  const dbRes = await db
    .update(dbSchema.categories)
    .set(input)
    .where(
      and(
        eq(dbSchema.categories.id, input.id),
        eq(dbSchema.categories.userId, userId)
      )
    )

  if (dbRes.rowsAffected === 0) {
    return r('NOT_FOUND', { id: input.id })
  }

  return r('OK', { input })
})
const zDeleteCategory = z.object({
  id: zRequired.refine((id) => id.length > 0, { message: 'Invalid id' }),
})

export const deleteCategory = h(
  'AUTH',
  zDeleteCategory,
  async ({ input, userId }) => {
    const categoryDeleteRes = await db
      .delete(dbSchema.categories)
      .where(
        and(
          eq(dbSchema.categories.id, input.id),
          eq(dbSchema.categories.userId, userId)
        )
      )

    if (categoryDeleteRes.rowsAffected === 0) {
      return r('NOT_FOUND')
    }

    await db
      .delete(dbSchema.parentTasks)
      .where(
        and(
          eq(dbSchema.parentTasks.categoryId, input.id),
          eq(dbSchema.parentTasks.userId, userId)
        )
      )

    await db
      .delete(dbSchema.childTask)
      .where(
        and(
          eq(dbSchema.childTask.categoryId, input.id),
          eq(dbSchema.childTask.userId, userId)
        )
      )

    return r('OK', { input })
  }
)
