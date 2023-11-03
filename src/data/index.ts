import { db } from './db'
import { h, r } from './utils/handler'

export const getInitialData = h('AUTH', async ({ userId }) => {
  const data = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, userId)
    },
    with: {
      categories: {
        columns: { userId: false },
      },
      parentTasks: {
        columns: { userId: false },
      },
      childTasks: {
        columns: { userId: false },
      },
    },
  })
  if (!data) throw new Error('User not found!')

  const user = {
    firstName: data.firstName,
    lastName: data.lastName,
    profilePicture: data.profilePicture,
    email: data.email,
  }

  return r('OK', {
    user,
    categories: data.categories,
    parentTasks: data.parentTasks,
    childTasks: data.childTasks,
  })
})
