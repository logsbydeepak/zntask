import { db } from '@/db'
import { h, r } from '@/utils/handler'

export const getUserWithAuth = h('AUTH', async ({ userId }) => {
  const user = await db.query.users.findFirst({
    with: {
      credentialAuth: true,
      googleAuth: true,
    },
    where(fields, operators) {
      return operators.eq(fields.id, userId)
    },
  })

  if (!user) throw new Error('User not found!')
  const auth = {
    credential: false,
    google: false,
  }

  if (user.credentialAuth) auth.credential = true
  if (user.googleAuth) auth.google = true
  if (!auth.credential && !auth.google)
    throw new Error('User has no auth methods!')

  return r('OK', {
    id: user.id,
    email: user.email,
    auth,
  })
})
