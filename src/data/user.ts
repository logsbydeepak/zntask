'use server'

import { db } from './db'
import { removeAuthCookie } from './utils/auth'
import { redis } from './utils/config'
import { h, r } from './utils/handler'

export const logout = h('AUTH', async ({ userId, token }) => {
  removeAuthCookie()

  const redisRes = await redis.set(`logout:${token}`, userId)
  if (redisRes !== 'OK') throw new Error('Failed to set logout token in redis')

  return r('OK')
})

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
