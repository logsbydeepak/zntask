'use server'

import bcrypt from 'bcryptjs'
import { ulid } from 'ulidx'

import { db, dbSchema } from '@/db'
import { h, r } from '@/utils/handler'

import { schema } from './utils'

export const registerWithCredentials = h(schema, async function ({ input }) {
  const isEmailTaken = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.email, input.email)
    },
  })
  if (isEmailTaken) return r('EMAIL_TAKEN')

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

  return r('OK')
})
