// @ts-check

import { z } from 'zod'

import { createEnv } from '@t3-oss/env-nextjs'

const zRequired = z.string().nonempty({ message: 'required' }).trim()

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'production']),
    DATABASE_URL: zRequired.url(),
    JWT_SECRET: zRequired,
    RESEND_API_KEY: zRequired,
    RESEND_FROM_EMAIL: zRequired.email(),
    REDIS_URL: zRequired.url(),
    REDIS_TOKEN: zRequired,
  },
  client: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    REDIS_URL: process.env.REDIS_URL,
    REDIS_TOKEN: process.env.REDIS_TOKEN,
  },
})
