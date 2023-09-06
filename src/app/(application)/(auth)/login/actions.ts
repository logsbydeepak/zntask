'use server'

import bcrypt from 'bcryptjs'

import { db } from '@/db'
import { h, r } from '@/utils/handler'

import { generateJWT, setAuthCookie } from '../utils'
import { schema } from './utils'

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

  const token = await generateJWT(user.id)
  setAuthCookie(token)

  return r('OK')
})
