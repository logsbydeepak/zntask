import { Redis } from '@upstash/redis'
import { Resend } from 'resend'
import { UTApi } from 'uploadthing/server'

import { env } from '@/env'

export const redis = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_TOKEN,
})

export const resend = new Resend(env.RESEND_API_KEY)

export const utapi = new UTApi()
