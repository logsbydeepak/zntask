import { env } from '#env'
import { Resend } from 'resend'
import { z } from 'zod'

import { zEmail, zPassword } from '@/utils/zod'

export const schema = z.object({
  email: zEmail,
  password: zPassword('invalid password'),
})

export const resetPasswordSchema = z.object({
  email: zEmail,
})

export const resend = new Resend(env.RESEND_API_KEY)
