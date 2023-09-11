import { db } from '@/db'
import { h, r } from '@/utils/handler'

export const getUser = h('AUTH', async ({ userId }) => {
  const user = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, userId)
    },
  })
  if (!user) throw new Error('User not found')

  return r('OK', {
    firstName: user.firstName,
    lastName: user.lastName,
    profilePicture: user.profilePicture,
    email: user.email,
  })
})
