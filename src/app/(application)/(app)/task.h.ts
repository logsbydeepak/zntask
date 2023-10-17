import { isValid } from 'ulidx'
import { z } from 'zod'

import { db, dbSchema } from '@/db'
import { h, r } from '@/utils/handler'
import { zRequired } from '@/utils/zod'

export const getTasks = h('AUTH', async ({ userId }) => {
  // const tasks = await db.query.tasks.findMany({
  //   where(fields, operators) {
  //     return operators.eq(fields.userId, userId)
  //   },
  // })

  // if (!tasks) throw new Error('No tasks found')
  // if (tasks.length === 0) return r('OK', { tasks })

  // const modTasks = tasks.map((task) => {
  //   const { userId, ...rest } = task
  //   return rest
  // })

  // return r('OK', { tasks: modTasks })
  return r('OK', { tasks: [] })
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
