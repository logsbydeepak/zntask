import { db } from '@/db'
import { h, r } from '@/utils/handler'

export const getTasks = h('AUTH', async ({ userId }) => {
  const tasks = await db.query.tasks.findMany({
    where(fields, operators) {
      return operators.eq(fields.userId, userId)
    },
  })

  if (!tasks) throw new Error('No tasks found')
  if (tasks.length === 0) return r('OK', { tasks })

  const modTasks = tasks.map((task) => {
    const { userId, ...rest } = task
    return rest
  })

  return r('OK', { tasks: modTasks })
})
