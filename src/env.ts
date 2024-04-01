import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

const zRequired = z.string().min(1, { message: 'required' }).trim()

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'production']),
    DATABASE_URL: zRequired.url(),
    JWT_SECRET: zRequired,
    RESEND_API_KEY: zRequired,
    RESEND_FROM_EMAIL: zRequired.email(),
    REDIS_URL: zRequired.url(),
    REDIS_TOKEN: zRequired,
    BASE_URL: zRequired.url(),
    UPLOADTHING_SECRET: zRequired,
    UPLOADTHING_APP_ID: zRequired,
    GOOGLE_CLIENT_ID: zRequired,
    GOOGLE_CLIENT_SECRET: zRequired,
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
    BASE_URL: process.env.BASE_URL,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  },
})
