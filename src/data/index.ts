import { db } from './db'
import { h, r } from './utils/handler'

export const getInitialData = h('AUTH', async ({ userId }) => {
  const data = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, userId)
    },
    with: {
      categories: true,
      parentTasks: true,
      childTasks: true,
    },
  })
  if (!data) throw new Error('User not found!')

  const user = {
    firstName: data.firstName,
    lastName: data.lastName,
    profilePicture: data.profilePicture,
    email: data.email,
  }

  const categories = data.categories.map(({ userId, ...data }) => data)
  const parentTasks = data.parentTasks.map(({ userId, ...data }) => data)
  const childTasks = data.childTasks.map(({ userId, ...data }) => data)

  return r('OK', {
    user,
    categories,
    parentTasks,
    childTasks,
  })
})
