'use server'

import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import ms from 'ms'
import { ulid } from 'ulidx'
import { z } from 'zod'

import { zPassword, zRequired } from '@/utils/zSchema'

import { db, dbSchema } from './db'
import { checkToken } from './utils'
import { generateAuthJWT, generateEmailJWT, setAuthCookie } from './utils/auth'
import { redis } from './utils/config'
import { h, r } from './utils/handler'
import {
  zLoginWithCredentials,
  zRegisterWithCredentials,
  zResetPassword,
} from './utils/zSchema'

export const loginWithCredentials = h(
  zLoginWithCredentials,
  async ({ input }) => {
    const user = await db.query.users.findFirst({
      with: {
        credentialAuth: true,
        googleAuth: true,
      },
      where(fields, operators) {
        return operators.eq(fields.email, input.email)
      },
    })

    if (!user) return r('INVALID_CREDENTIALS')
    if (!user.credentialAuth) return r('INVALID_CREDENTIALS')

    const password = await bcrypt.compare(
      input.password,
      user.credentialAuth.password
    )
    if (!password) return r('INVALID_CREDENTIALS')

    const token = await generateAuthJWT(user.id)
    setAuthCookie(token)

    return r('OK')
  }
)

export const registerWithCredentials = h(
  zRegisterWithCredentials,
  async function ({ input }) {
    const isEmailAlreadyExists = await db.query.users.findFirst({
      where(fields, operators) {
        return operators.eq(fields.email, input.email)
      },
    })
    if (isEmailAlreadyExists) return r('EMAIL_ALREADY_EXISTS')

    const password = await bcrypt.hash(input.password, 10)
    const id = ulid()

    await db.insert(dbSchema.users).values({
      id: id,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
    })
    await db.insert(dbSchema.credentialAuth).values({
      id: ulid(),
      userId: id,
      password: password,
    })

    const token = await generateAuthJWT(id)
    setAuthCookie(token)

    return r('OK')
  }
)

export const resetPassword = h(zResetPassword, async ({ input }) => {
  const user = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.email, input.email)
    },
  })
  if (!user) return r('INVALID_CREDENTIALS')

  const redisIsExist = (await redis.exists(`reset-password:${user.id}`)) === 1
  if (redisIsExist) {
    return r('EMAIL_ALREADY_SENT')
  }

  const token = await generateEmailJWT(user.id)

  // const email = await resend.sendEmail({
  //   to: input.email,
  //   from: `team <${env.RESEND_FROM_EMAIL}>`,
  //   subject: 'Reset Password',
  //   text: `${env.BASE_URL}/add-password?token=${token}`,
  // })

  // if (!email.id) {
  //   throw new Error('Failed to send email', { cause: email })
  // }

  const redisRes = await redis.set(`reset-password:${user.id}`, token, {
    px: ms('15 minutes'),
  })

  if (redisRes !== 'OK') {
    throw new Error('Failed to set reset-password token to redis')
  }

  return r('OK')
})

const zSchema = z
  .object({
    token: zRequired,
    password: zPassword('not strong enough'),
    confirmPassword: zRequired,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'password do not match',
    path: ['confirmPassword'],
  })

export const addPassword = h(zSchema, async function ({ input }) {
  const token = await checkToken(input.token)
  if (token.code === 'INVALID_TOKEN') return r('INVALID_TOKEN')
  if (token.code === 'TOKEN_EXPIRED') return r('TOKEN_EXPIRED')
  const userId = token.userId

  const redisRes = await redis.get(`reset-password:${userId}`)
  if (!redisRes) return r('INVALID_TOKEN')
  if (redisRes !== input.token) return r('INVALID_TOKEN')

  const user = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, userId)
    },
    with: {
      credentialAuth: true,
    },
  })
  if (!user) return r('INVALID_TOKEN')

  const password = await bcrypt.hash(input.password, 10)
  if (!user.credentialAuth) {
    await db.insert(dbSchema.credentialAuth).values({
      id: ulid(),
      userId: user.id,
      password,
    })
  } else {
    await db
      .update(dbSchema.credentialAuth)
      .set({
        password,
      })
      .where(eq(dbSchema.credentialAuth.id, user.id))
  }

  return r('OK')
})
