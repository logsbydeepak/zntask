'use server'

import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { zEmail, zPassword } from '@/utils/zSchema'

import { db, dbSchema } from './db'
import { removeAuthCookie, UnauthorizedError } from './utils/auth'
import { redis, utapi } from './utils/config'
import { h, r } from './utils/handler'
import { zUpdateName } from './utils/zSchema'

export const logout = h.auth.fn(async ({ userId, token }) => {
  removeAuthCookie()

  const redisRes = await redis.set(`logout:${token}`, userId)
  if (redisRes !== 'OK') throw new Error('Failed to set logout token in redis')
  redirect('/login')
})

export const getUser = h.auth.fn(async ({ userId }) => {
  const user = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, userId)
    },
  })

  if (!user) throw new Error('User not found!')

  let profilePicture = null
  if (user.profilePicture) {
    const res = await utapi.getFileUrls(user.profilePicture)
    if (!res) {
      profilePicture = null
    }

    profilePicture = res.data[0].url
  }

  return r('OK', {
    firstName: user.firstName,
    lastName: user.lastName,
    profilePicture: profilePicture,
    email: user.email,
  })
})

export const getUserWithAuth = h.auth.fn(async ({ userId }) => {
  const user = await db.query.users.findFirst({
    with: {
      passwordAuth: true,
      googleAuth: true,
    },
    where(fields, operators) {
      return operators.eq(fields.id, userId)
    },
  })

  if (!user) throw new Error('User not found!')
  const auth = {
    password: false,
    google: false,
  }

  if (user.passwordAuth) auth.password = true
  if (user.googleAuth) auth.google = true
  if (!auth.password && !auth.google)
    throw new Error('User has no auth methods!')

  let profilePicture = null
  if (user.profilePicture) {
    const res = await utapi.getFileUrls(user.profilePicture)
    profilePicture = res.data[0].url
  }

  return r('OK', {
    firstName: user.firstName,
    lastName: user.lastName,
    profilePicture: profilePicture,
    email: user.email,
    auth,
  })
})

export const updateName = h.auth
  .input(zUpdateName)
  .fn(async ({ userId, input }) => {
    await db
      .update(dbSchema.users)
      .set({ firstName: input.firstName, lastName: input.lastName })
      .where(eq(dbSchema.users.id, userId))
    revalidateTag('user')

    return r('OK')
  })

export const removeProfilePicture = h.auth.fn(async ({ userId }) => {
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

export const revalidateUser = h.auth.fn(async ({ userId }) => {
  revalidateTag('user')

  return r('OK')
})

const zUpdateEmail = z.object({
  email: zEmail,
  password: zPassword('invalid password'),
})

export const updateEmail = h.auth
  .input(zUpdateEmail)
  .fn(async ({ userId, input }) => {
    const user = await db.query.users.findFirst({
      with: {
        passwordAuth: true,
      },
      where(fields, operators) {
        return operators.eq(fields.id, userId)
      },
    })
    if (!user) throw new UnauthorizedError()
    if (!user.passwordAuth) return r('INVALID_CREDENTIALS')

    const password = await bcrypt.compare(
      input.password,
      user.passwordAuth.password
    )
    if (!password) return r('INVALID_CREDENTIALS')

    const existingUser = await db.query.users.findFirst({
      where(fields, operators) {
        return operators.eq(fields.email, input.email)
      },
    })
    if (existingUser) return r('EMAIL_EXISTS')

    await db
      .update(dbSchema.users)
      .set({ email: input.email })
      .where(eq(dbSchema.users.id, userId))

    revalidateTag('user')

    return r('OK')
  })
