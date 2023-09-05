import { z } from 'zod'

import { zEmail, zPassword, zRequired } from '@/utils/zod'

export const schema = z
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
