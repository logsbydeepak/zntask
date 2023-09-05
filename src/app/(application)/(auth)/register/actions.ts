'use server'

import bcrypt from 'bcryptjs'
import { ulid } from 'ulidx'

import { generateJWT, setAuthCookie } from '@/app/(application)/(auth)/utils'
import { db, dbSchema } from '@/db'
import { h, r } from '@/utils/handler'

import { schema } from './utils'

export const registerWithCredentials = h(schema, async function ({ input }) {
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

  const token = await generateJWT(id)
  setAuthCookie(token)

  return r('OK')
})
