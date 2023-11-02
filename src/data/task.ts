'use server'

import { eq } from 'drizzle-orm'
import { isValid } from 'ulidx'
import { z } from 'zod'

import { zRequired } from '@/utils/zSchema'

import { db, dbSchema } from './db'
import { h, r } from './utils/handler'

export const getTasks = h('AUTH', async ({ userId }) => {
  const parentTask = await db.query.parentTasks.findMany({
    where(fields, operators) {
      return operators.eq(fields.userId, userId)
    },
  })

  const childTask = await db.query.childTask.findMany({
    where(fields, operators) {
      return operators.eq(fields.userId, userId)
    },
  })

  if (!parentTask && !childTask) throw new Error('No tasks found')

  const modParentTask = parentTask.map((task) => {
    const { userId, ...rest } = task
    return rest
  })

  const modChildTask = childTask.map((task) => {
    const { userId, ...rest } = task
    return rest
  })

  return r('OK', { parentTask: modParentTask, childTask: modChildTask })
})

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

export const createParentTask = h(
  'AUTH',
  zParentTask,
  async ({ userId, input }) => {
    await db.insert(dbSchema.parentTasks).values({ ...input, userId })

    return r('OK', { input })
  }
)
export const createChildTask = h(
  'AUTH',
  zChildTask,
  async ({ userId, input }) => {
    await db.insert(dbSchema.childTask).values({ ...input, userId })
    return r('OK', { input })
  }
)

export const editParentTask = h(
  'AUTH',
  zParentTask,
  async ({ input, userId }) => {
    if (input.isCompleted) {
      await db
        .update(dbSchema.parentTasks)
        .set(input)
        .where(eq(dbSchema.parentTasks.id, input.id))

      await db
        .update(dbSchema.childTask)
        .set({ isCompleted: true })
        .where(eq(dbSchema.childTask.parentId, input.id))
    } else {
      await db
        .update(dbSchema.parentTasks)
        .set(input)
        .where(eq(dbSchema.parentTasks.id, input.id))
    }

    return r('OK')
  }
)

export const editChildTask = h(
  'AUTH',
  zChildTask,
  async ({ input, userId }) => {
    await db
      .update(dbSchema.childTask)
      .set(input)
      .where(eq(dbSchema.childTask.id, input.id))

    return r('OK')
  }
)

const zDeleteTask = z.object({
  id: zRequired.refine(isValid, { message: 'Invalid ulid' }),
})

export const deleteParentTask = h(
  'AUTH',
  zDeleteTask,
  async ({ input, userId }) => {
    await db
      .delete(dbSchema.parentTasks)
      .where(eq(dbSchema.parentTasks.id, input.id))

    await db
      .delete(dbSchema.childTask)
      .where(eq(dbSchema.childTask.parentId, input.id))

    return r('OK', { input })
  }
)

export const deleteChildTask = h(
  'AUTH',
  zDeleteTask,
  async ({ input, userId }) => {
    await db
      .delete(dbSchema.childTask)
      .where(eq(dbSchema.childTask.id, input.id))
    return r('OK', { input })
  }
)
