'use server'

import { revalidateTag } from 'next/cache'
import { eq } from 'drizzle-orm'

import { db, dbSchema } from './db'
import { removeAuthCookie, UnauthorizedError } from './utils/auth'
import { redis, utapi } from './utils/config'
import { h, r } from './utils/handler'
import { zUpdateName } from './utils/zSchema'

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

  if (!user) throw new Error('User not found!')

  let profilePicture = null
  if (user.profilePicture) {
    const res = await utapi.getFileUrls(user.profilePicture)
    profilePicture = res[0].url
  }

  return r('OK', {
    firstName: user.firstName,
    lastName: user.lastName,
    profilePicture: profilePicture,
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

  let profilePicture = null
  if (user.profilePicture) {
    const res = await utapi.getFileUrls(user.profilePicture)
    profilePicture = res[0].url
  }

  return r('OK', {
    firstName: user.firstName,
    lastName: user.lastName,
    profilePicture: profilePicture,
    email: user.email,
    auth,
  })
})

export const updateName = h('AUTH', zUpdateName, async ({ userId, input }) => {
  await db
    .update(dbSchema.users)
    .set({ firstName: input.firstName, lastName: input.lastName })
    .where(eq(dbSchema.users.id, userId))
  revalidateTag('user')

  return r('OK')
})

export const removeProfilePicture = h('AUTH', async ({ userId }) => {
  const user = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, userId)
    },
  })

  if (!user) throw new Error('User not found!')

  if (user.profilePicture) {
    await utapi.deleteFiles(user?.profilePicture)
    await db
      .update(dbSchema.users)
      .set({ profilePicture: null })
      .where(eq(dbSchema.users.id, userId))

    revalidateTag('user')
  }

  return r('OK')
})

export const revalidateUser = h('AUTH', async ({ userId }) => {
  revalidateTag('user')

  return r('OK')
})
