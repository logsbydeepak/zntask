'use server'

import { eq } from 'drizzle-orm'
import { isValid } from 'ulidx'
import { z } from 'zod'

import { zRequired } from '@/utils/zSchema'

import { db, dbSchema } from './db'
import { h, r } from './utils/handler'

const zTask = z.object({
  id: zRequired.refine(isValid, { message: 'Invalid ulid' }),
  title: zRequired,
  isCompleted: z.boolean(),
  orderId: zRequired.refine(isValid, { message: 'Invalid ulid' }),
  date: z.string().nullable(),
  time: z.string().nullable(),
  details: z.string().nullable(),
})

const zParentTask = z.object({
  ...zTask.shape,
  categoryId: zRequired.refine(isValid, { message: 'Invalid ulid' }).nullable(),
})

const zChildTask = z.object({
  ...zTask.shape,
  parentId: zRequired.refine(isValid, { message: 'Invalid ulid' }),
})

export const createParentTask = h.auth
  .input(zParentTask)
  .fn(async ({ userId, input }) => {
    const categoryId = input.categoryId

    if (categoryId) {
      const category = await db.query.categories.findFirst({
        where(fields, operators) {
          return operators.eq(fields.id, categoryId)
        },
      })

      if (!category) return r('NOT_FOUND')
    }

    await db.insert(dbSchema.parentTasks).values({ ...input, userId })
    return r('OK', { input })
  })
export const createChildTask = h.auth
  .input(zChildTask)
  .fn(async ({ userId, input }) => {
    const parentTask = await db.query.parentTasks.findFirst({
      where(fields, operators) {
        return operators.eq(fields.id, input.parentId)
      },
    })

    if (!parentTask) return r('NOT_FOUND')

    await db
      .insert(dbSchema.childTask)
      .values({ ...input, userId, categoryId: parentTask.categoryId })

    return r('OK', { input })
  })

export const editParentTask = h.auth
  .input(zParentTask)
  .fn(async ({ input, userId }) => {
    const parentTask = await db.query.parentTasks.findFirst({
      where(fields, operators) {
        return operators.eq(fields.id, input.id)
      },
    })
    if (!parentTask) return r('NOT_FOUND')

    if (parentTask.categoryId !== input.categoryId) {
      await db
        .update(dbSchema.childTask)
        .set({ categoryId: input.categoryId })
        .where(eq(dbSchema.childTask.parentId, input.id))
    }

    if (input.isCompleted) {
      await db
        .update(dbSchema.parentTasks)
        .set(input)
        .where(eq(dbSchema.parentTasks.id, input.id))

      await db
        .update(dbSchema.childTask)
        .set({ completedAt: new Date().toString() })
        .where(eq(dbSchema.childTask.parentId, input.id))
    } else {
      await db
        .update(dbSchema.parentTasks)
        .set(input)
        .where(eq(dbSchema.parentTasks.id, input.id))
    }

    return r('OK')
  })

export const editChildTask = h.auth
  .input(zChildTask)
  .fn(async ({ input, userId }) => {
    await db
      .update(dbSchema.childTask)
      .set(input)
      .where(eq(dbSchema.childTask.id, input.id))

    return r('OK')
  })

const zDeleteTask = z.object({
  id: zRequired.refine(isValid, { message: 'Invalid ulid' }),
})

export const deleteParentTask = h.auth
  .input(zDeleteTask)
  .fn(async ({ input, userId }) => {
    await db
      .delete(dbSchema.parentTasks)
      .where(eq(dbSchema.parentTasks.id, input.id))

    await db
      .delete(dbSchema.childTask)
      .where(eq(dbSchema.childTask.parentId, input.id))

    return r('OK', { input })
  })

export const deleteChildTask = h.auth
  .input(zDeleteTask)
  .fn(async ({ input, userId }) => {
    await db
      .delete(dbSchema.childTask)
      .where(eq(dbSchema.childTask.id, input.id))
    return r('OK', { input })
  })
