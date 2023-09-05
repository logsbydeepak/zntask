import { z } from 'zod'

import { createEnv } from '@t3-oss/env-nextjs'

const zRequired = z.string().nonempty({ message: 'required' }).trim()

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'production']),
    DATABASE_URL: zRequired.url(),
    JWT_SECRET: zRequired,
  },
  client: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
  },
})
