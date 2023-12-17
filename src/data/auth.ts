'use server'

import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import ms from 'ms'
import { ulid } from 'ulidx'
import { z } from 'zod'

import { env } from '@/env.mjs'
import { zPassword, zRequired } from '@/utils/zSchema'

import { db, dbSchema } from './db'
import { checkToken } from './utils'
import {
  generateAuthJWT,
  generateEmailJWT,
  setAuthCookie,
  UnauthorizedError,
} from './utils/auth'
import { redis, resend } from './utils/config'
import { GC } from './utils/google'
import { h, r } from './utils/handler'
import {
  zLoginWithCredentials,
  zRegisterWithCredentials,
  zResetPassword,
} from './utils/zSchema'

const gcLogin = new GC(`${env.BASE_URL}/google?type=login`)
const gcRegister = new GC(`${env.BASE_URL}/google?type=register`)
const gcNew = new GC(`${env.BASE_URL}/google?type=new`)

const zUpdateAuthProvider = z.object({
  password: zPassword('invalid password'),
})

export const redirectGoogleLogin = h.fn(async () => {
  const url = gcLogin.genURL()
  redirect(url)
})

export const redirectGoogleRegister = h.fn(async () => {
  const url = gcRegister.genURL()
  redirect(url)
})

export const redirectGoogleAddNew = h.auth
  .input(zUpdateAuthProvider)
  .fn(async ({ input, userId }) => {
    const user = await db.query.users.findFirst({
      with: {
        credentialAuth: true,
        googleAuth: true,
      },
      where(fields, operators) {
        return operators.eq(fields.id, userId)
      },
    })

    if (!user) throw new UnauthorizedError()
    if (!user.credentialAuth) return r('INVALID_CREDENTIALS')
    if (user.googleAuth) return r('ALREADY_ADDED')

    const password = await bcrypt.compare(
      input.password,
      user.credentialAuth.password
    )
    if (!password) return r('INVALID_CREDENTIALS')

    const url = gcNew.genURL()
    redirect(url)
  })

const zGoogleCode = z.object({
  code: zRequired,
})

export const addGoogleAuthProvider = h.auth
  .input(zGoogleCode)
  .fn(async ({ input, userId }) => {
    const data = await gcNew.getData(input.code)
    if (data.code !== 'OK') return r('INVALID_CREDENTIALS')

    const googleAuthProvider = await db.query.googleAuth.findFirst({
      where(fields, operators) {
        return operators.eq(fields.id, userId)
      },
    })
    if (googleAuthProvider) return r('ALREADY_ADDED')

    await db.insert(dbSchema.googleAuth).values({
      id: ulid(),
      userId,
      email: data.email,
    })

    return r('OK')
  })

export const removeGoogleAuthProvider = h.auth
  .input(zUpdateAuthProvider)
  .fn(async ({ userId, input }) => {
    const user = await db.query.users.findFirst({
      with: {
        credentialAuth: true,
        googleAuth: true,
      },
      where(fields, operators) {
        return operators.eq(fields.id, userId)
      },
    })
    if (!user) throw new UnauthorizedError()
    if (!user.credentialAuth) return r('INVALID_CREDENTIALS')
    if (!user.googleAuth) return r('NOT_ADDED')

    const password = await bcrypt.compare(
      input.password,
      user.credentialAuth.password
    )
    if (!password) return r('INVALID_CREDENTIALS')

    await db
      .delete(dbSchema.googleAuth)
      .where(eq(dbSchema.googleAuth.id, userId))

    return r('OK')
  })

export const removeCredentialAuthProvider = h.auth
  .input(zUpdateAuthProvider)
  .fn(async ({ userId, input }) => {
    const user = await db.query.users.findFirst({
      with: {
        credentialAuth: true,
        googleAuth: true,
      },
      where(fields, operators) {
        return operators.eq(fields.id, userId)
      },
    })
    if (!user) throw new UnauthorizedError()
    if (!user.credentialAuth) return r('INVALID_CREDENTIALS')
    if (!user.googleAuth) return r('NOT_ADDED')

    const password = await bcrypt.compare(
      input.password,
      user.credentialAuth.password
    )
    if (!password) return r('INVALID_CREDENTIALS')

    await db
      .delete(dbSchema.credentialAuth)
      .where(eq(dbSchema.credentialAuth.id, userId))

    return r('OK')
  })

export const loginWithGoogle = h.input(zGoogleCode).fn(async ({ input }) => {
  const data = await gcLogin.getData(input.code)
  if (data.code !== 'OK') return r('INVALID_CREDENTIALS')

  const user = await db.query.googleAuth.findFirst({
    where(fields, operators) {
      return operators.eq(fields.email, data.email)
    },
  })

  if (!user) return r('INVALID_CREDENTIALS')
  const token = await generateAuthJWT(user.userId)
  setAuthCookie(token)
  redirect('/')
})

export const registerWithGoogle = h.input(zGoogleCode).fn(async ({ input }) => {
  const data = await gcRegister.getData(input.code)
  if (data.code !== 'OK') return r('INVALID_CREDENTIALS')

  const user = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.email, data.email)
    },
  })
  const googleAuthProvider = await db.query.googleAuth.findFirst({
    where(fields, operators) {
      return operators.eq(fields.email, data.email)
    },
  })
  if (user || googleAuthProvider) return r('EMAIL_ALREADY_EXISTS')

  const id = ulid()

  await db.insert(dbSchema.users).values({
    id: id,
    firstName: data.given_name,
    lastName: data.family_name,
    email: data.email,
  })
  await db.insert(dbSchema.googleAuth).values({
    id: ulid(),
    userId: id,
    email: data.email,
  })

  const token = await generateAuthJWT(id)
  setAuthCookie(token)
  redirect('/')
})

export const loginWithCredentials = h
  .input(zLoginWithCredentials)
  .fn(async ({ input }) => {
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
    redirect('/')
  })

export const registerWithCredentials = h
  .input(zRegisterWithCredentials)
  .fn(async function ({ input }) {
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
    redirect('/')
  })

export const resetPassword = h.input(zResetPassword).fn(async ({ input }) => {
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

  const email = await resend.emails.send({
    to: input.email,
    from: `team <${env.RESEND_FROM_EMAIL}>`,
    subject: 'Reset Password',
    text: `${env.BASE_URL}/add-password?token=${token}`,
  })

  if (!email.data?.id) {
    throw new Error('Failed to send email', { cause: email })
  }

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

export const addPassword = h.input(zSchema).fn(async function ({ input }) {
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
