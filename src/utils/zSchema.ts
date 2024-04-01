import isEmail from 'validator/lib/isEmail'
import isStrongPassword from 'validator/lib/isStrongPassword'
import { z } from 'zod'

export const zRequired = z.string().min(1, { message: 'required' }).trim()
export const zEmail = zRequired.refine((val) => isEmail(val), {
  message: 'invalid email',
})

export function zPassword(message: string) {
  return zRequired.refine((val) => isStrongPassword(val), {
    message,
  })
}
