import { Redis } from '@upstash/redis'
import { env } from '#env'

// import { Resend } from 'resend'

export const redis = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_TOKEN,
})

// export const resend = new Resend(env.RESEND_API_KEY)
