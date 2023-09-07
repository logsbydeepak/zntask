import { z } from 'zod'

import { zEmail, zPassword } from '@/utils/zod'

export const schema = z.object({
  email: zEmail,
  password: zPassword('invalid password'),
})

export const resetPasswordSchema = z.object({
  email: zEmail,
})
