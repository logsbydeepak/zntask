import { z } from 'zod'

import { zEmail, zPassword, zRequired } from '@/utils/zod'

export const zLoginWithCredentials = z.object({
  email: zEmail,
  password: zPassword('invalid password'),
})

export const zResetPassword = z.object({
  email: zEmail,
})

export const zRegisterWithCredentials = z
  .object({
    firstName: zRequired,
    lastName: z.string().nullable(),
    email: zEmail,
    password: zPassword('not strong enough'),
    confirmPassword: zRequired,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'password do not match',
    path: ['confirmPassword'],
  })
