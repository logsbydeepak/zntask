'use server'

import { env } from '#env'
import bcrypt from 'bcryptjs'
import ms from 'ms'

import { db } from '@/db'
import { redis } from '@/utils/config'
import { h, r } from '@/utils/handler'

import { generateAuthJWT, generateEmailJWT, setAuthCookie } from '../utils'
import { resetPasswordSchema, schema } from './utils'

export const loginWithCredentials = h(schema, async ({ input }) => {
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
})

export const resetPassword = h(resetPasswordSchema, async ({ input }) => {
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
