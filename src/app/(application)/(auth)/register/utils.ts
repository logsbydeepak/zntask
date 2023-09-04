import { z } from 'zod'

import { zEmail, zPassword } from '@/utils/zod'

export const schema = z
  .object({
    firstName: z.string().nonempty({ message: 'required' }),
    lastName: z.string().nonempty({ message: 'required' }),
    email: zEmail,
    password: zPassword('not strong enough'),
    confirmPassword: zPassword('not strong enough'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'password do not match',
    path: ['confirmPassword'],
  })
