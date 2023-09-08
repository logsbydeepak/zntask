import { z } from 'zod'

import { zPassword, zRequired } from '@/utils/zod'

export const addPasswordClientSchema = z
  .object({
    password: zPassword('not strong enough'),
    confirmPassword: zRequired,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'password do not match',
    path: ['confirmPassword'],
  })
